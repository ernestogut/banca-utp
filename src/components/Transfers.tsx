import React, { useState } from 'react';
import { downloadVoucher } from '../utils/downloadHelper';

interface Contact {
  name: string;
  initials: string;
  bank: string;
  accNumber: string;
}

interface TransfersProps {
  checkingBalance: number;
  savingsBalance: number;
  onTransferComplete: (amount: number, description: string, accountType: 'corriente' | 'ahorros') => void;
  onNavigateToDashboard: () => void;
}

export const Transfers: React.FC<TransfersProps> = ({
  checkingBalance,
  savingsBalance,
  onTransferComplete,
  onNavigateToDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [referenceId] = useState(() => Math.floor(10000 + Math.random() * 90000));

  
  // Step 1 states
  const [sourceAccount, setSourceAccount] = useState<'corriente' | 'ahorros'>('corriente');
  const [destinationType, setDestinationType] = useState<'agendados' | 'nuevo'>('agendados');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Step 2 states
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('Varios');
  const [limitError, setLimitError] = useState(false);

  // Step 3 states
  const [isBiometricConfirming, setIsBiometricConfirming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const contacts: Contact[] = [
    { name: 'Julian Sanchez', initials: 'JS', bank: 'Banco Nación', accNumber: '**** 4492' },
    { name: 'Maria Alvear', initials: 'MA', bank: 'Mercado Pago', accNumber: '**** 0012' },
    { name: 'Rent Taylor S.A.', initials: 'RT', bank: 'Santander', accNumber: '**** 9928' },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedContact) {
        alert('Por favor selecciona un contacto de destino.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const numericAmount = parseFloat(amount);
      if (!amount || numericAmount <= 0) {
        alert('Por favor ingresa un monto válido.');
        return;
      }
      const activeBalance = sourceAccount === 'ahorros' ? savingsBalance : checkingBalance;
      if (numericAmount > activeBalance) {
        alert('Monto insuficiente en la cuenta seleccionada.');
        return;
      }
      if (numericAmount > 150000) {
        setLimitError(true);
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const setQuickAmount = (val: number) => {
    setAmount(val.toString());
    setLimitError(val > 150000);
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 150000) {
      setLimitError(true);
    } else {
      setLimitError(false);
    }
  };

  const startBiometricTransfer = async () => {
    setIsBiometricConfirming(true);
    
    // Simulate biometric scanning delay
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    try {
      const description = `Transf. a ${selectedContact?.name}`;
      await onTransferComplete(parseFloat(amount), description, sourceAccount);
      setIsBiometricConfirming(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      setIsBiometricConfirming(false);
      alert(error.message || 'Error al procesar la transferencia.');
    }
  };

  return (
    <div className="pt-8 pb-16 px-6 md:px-12 w-full max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="fade-in-up">
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold mb-2 text-on-surface">Nueva Operación</h1>
        <p className="font-body-lg text-body-lg text-secondary">Realiza transferencias nacionales o internacionales con total seguridad.</p>
      </div>

      {/* Multi-Step Form Container */}
      <div className="bg-white border border-surface-container-highest rounded-xl shadow-sm overflow-hidden fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Step Progress Bar */}
        <div className="flex border-b border-surface-container select-none">
          <div className={`flex-1 flex flex-col items-center py-4 border-r border-surface-container transition-colors ${
            currentStep === 1 ? 'bg-white' : 'bg-success/5 opacity-100'
          }`}>
            <span className={`font-label-md text-label-md font-bold ${currentStep === 1 ? 'text-primary' : 'text-success'}`}>
              {currentStep > 1 ? '✔ PASO 1' : 'PASO 1'}
            </span>
            <span className="font-body-sm text-body-sm font-bold text-on-surface">Origen y Destino</span>
          </div>
          
          <div className={`flex-1 flex flex-col items-center py-4 border-r border-surface-container transition-colors ${
            currentStep === 2 ? 'bg-white opacity-100' : currentStep > 2 ? 'bg-success/5 opacity-100' : 'bg-surface-subtle opacity-40'
          }`}>
            <span className={`font-label-md text-label-md font-bold ${
              currentStep === 2 ? 'text-primary' : currentStep > 2 ? 'text-success' : 'text-secondary'
            }`}>
              {currentStep > 2 ? '✔ PASO 2' : 'PASO 2'}
            </span>
            <span className="font-body-sm text-body-sm font-bold text-on-surface">Detalles de Monto</span>
          </div>
          
          <div className={`flex-1 flex flex-col items-center py-4 transition-colors ${
            currentStep === 3 ? 'bg-white opacity-100' : 'bg-surface-subtle opacity-40'
          }`}>
            <span className={`font-label-md text-label-md font-bold ${currentStep === 3 ? 'text-primary' : 'text-secondary'}`}>
              PASO 3
            </span>
            <span className="font-body-sm text-body-sm font-bold text-on-surface">Confirmación</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 md:p-12">
          
          {/* Step 1: Origin & Destination */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Source Account Selection */}
                <div className="space-y-4">
                  <label className="font-label-md text-label-md text-secondary block font-bold uppercase tracking-wider">
                    CUENTA ORIGEN
                  </label>
                  
                  <div 
                    className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all flex flex-col justify-between ${
                      sourceAccount === 'corriente' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-container hover:border-outline bg-white'
                    }`}
                    onClick={() => setSourceAccount('corriente')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-body-md text-body-md font-bold text-on-surface">Cuenta Corriente Premium</span>
                      <span className={`material-symbols-outlined ${sourceAccount === 'corriente' ? 'text-primary' : 'text-surface-container-high'}`}>
                        {sourceAccount === 'corriente' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">**** 8842</p>
                    <p className="font-headline-sm text-headline-sm font-bold mt-2 text-on-surface">
                      S/ {checkingBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="font-label-md text-label-md text-secondary mt-1">Disponible para operar</p>
                  </div>
                  
                  <div 
                    className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all flex flex-col justify-between ${
                      sourceAccount === 'ahorros' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-container hover:border-outline bg-white'
                    }`}
                    onClick={() => setSourceAccount('ahorros')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-body-md text-body-md font-bold text-on-surface">Ahorros Personal</span>
                      <span className={`material-symbols-outlined ${sourceAccount === 'ahorros' ? 'text-primary' : 'text-surface-container-high'}`}>
                        {sourceAccount === 'ahorros' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">**** 1129</p>
                    <p className="font-headline-sm text-headline-sm font-bold mt-2 text-on-surface">
                      S/ {savingsBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Destination Selection */}
                <div className="space-y-4">
                  <label className="font-label-md text-label-md text-secondary block font-bold uppercase tracking-wider">
                    CUENTA DESTINO
                  </label>
                  
                  <div className="flex items-center space-x-2 p-1 bg-surface-subtle rounded-lg mb-4">
                    <button 
                      className={`flex-1 py-2 px-4 rounded font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        destinationType === 'agendados' ? 'bg-white shadow-sm text-primary' : 'text-secondary'
                      }`}
                      onClick={() => setDestinationType('agendados')}
                    >
                      Agendados
                    </button>
                    <button 
                      className={`flex-1 py-2 px-4 rounded font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        destinationType === 'nuevo' ? 'bg-white shadow-sm text-primary' : 'text-secondary'
                      }`}
                      onClick={() => setDestinationType('nuevo')}
                    >
                      Nuevo CVU/Alias
                    </button>
                  </div>

                  {destinationType === 'agendados' ? (
                    <div className="space-y-2 h-64 overflow-y-auto custom-scrollbar pr-2">
                      {contacts.map((contact) => (
                        <div 
                          key={contact.name}
                          className={`flex items-center p-3 border rounded-lg transition-all cursor-pointer ${
                            selectedContact?.name === contact.name 
                              ? 'border-primary bg-primary/5' 
                              : 'border-surface-container hover:border-primary/50 bg-white'
                          }`}
                          onClick={() => setSelectedContact(contact)}
                        >
                          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center mr-3 font-bold text-secondary text-sm">
                            {contact.initials}
                          </div>
                          <div className="flex-1">
                            <p className="font-body-sm text-body-sm font-bold text-on-surface">{contact.name}</p>
                            <p className="font-label-md text-label-md text-secondary mt-0.5">{contact.bank} • {contact.accNumber}</p>
                          </div>
                          <span className="material-symbols-outlined text-secondary">
                            {selectedContact?.name === contact.name ? 'check' : 'chevron_right'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* New Account Mockup Input */
                    <div className="space-y-4 h-64">
                      <div className="space-y-1">
                        <label className="font-label-md text-label-md text-secondary font-bold">CVU, CBU o Alias</label>
                        <input 
                          type="text" 
                          placeholder="Ingresa alias o clave numérica" 
                          className="w-full p-3 bg-surface-subtle border border-surface-container rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-sm"
                        />
                      </div>
                      <button 
                        type="button"
                        className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:bg-on-surface transition-colors cursor-pointer"
                        onClick={() => setSelectedContact({ name: 'Destinatario Nuevo', initials: 'DN', bank: 'Banco Destino', accNumber: '**** 1234' })}
                      >
                        Buscar Cuenta
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Step 2: Amount & Details */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="max-w-md mx-auto space-y-8">
                
                <div className="text-center">
                  <h3 className="font-headline-sm text-headline-sm font-bold mb-2">¿Cuánto deseas enviar?</h3>
                  <p className="text-secondary font-body-sm text-body-sm">Límite diario disponible: S/ 150,000.00</p>
                </div>
                
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline-md text-headline-md text-secondary font-bold">
                    S/
                  </span>
                  <input 
                    className={`w-full text-center py-6 px-12 text-3xl md:text-4xl font-bold border-2 rounded-xl transition-all outline-none focus:ring-0 ${
                      limitError ? 'border-error text-error' : 'border-surface-container focus:border-primary'
                    }`}
                    id="amount-input" 
                    placeholder="0.00" 
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                  />
                  {limitError && (
                    <p className="text-error font-label-md text-label-md mt-2 text-center" id="limit-error">
                      El monto supera el límite disponible de S/ 150,000.00.
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    className="py-2 px-4 border border-surface-container rounded hover:bg-surface-subtle transition-all font-body-sm text-body-sm font-bold cursor-pointer bg-white" 
                    onClick={() => setQuickAmount(1000)}
                  >
                    S/ 1.000
                  </button>
                  <button 
                    className="py-2 px-4 border border-surface-container rounded hover:bg-surface-subtle transition-all font-body-sm text-body-sm font-bold cursor-pointer bg-white" 
                    onClick={() => setQuickAmount(5000)}
                  >
                    S/ 5.000
                  </button>
                  <button 
                    className="py-2 px-4 border border-surface-container rounded hover:bg-surface-subtle transition-all font-body-sm text-body-sm font-bold cursor-pointer bg-white" 
                    onClick={() => setQuickAmount(10000)}
                  >
                    S/ 10.000
                  </button>
                </div>
                
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-secondary font-bold block">MOTIVO (OPCIONAL)</label>
                  <select 
                    className="w-full p-4 border border-surface-container rounded-lg focus:border-primary outline-none font-body-md text-body-md bg-white cursor-pointer"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="Varios">Varios</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Préstamo">Préstamo</option>
                    <option value="Haberes">Haberes</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Step 3: Biometric Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="max-w-md mx-auto text-center space-y-6">
                
                {isBiometricConfirming ? (
                  <div className="space-y-6">
                    <div className="relative w-24 h-24 mx-auto biometric-scanner-animation rounded-full flex items-center justify-center border-4 border-primary">
                      <span className="material-symbols-outlined text-primary text-6xl animate-pulse">
                        fingerprint
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-primary">Autenticando transferencia...</h3>
                      <p className="text-secondary font-body-md text-body-md mt-2">Mantenga el dedo en el sensor biométrico.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-surface-subtle p-8 rounded-2xl inline-block mb-4 border border-surface-container-high">
                      <span className="material-symbols-outlined text-primary text-6xl">fingerprint</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold">Confirmación Biométrica</h3>
                    <p className="text-secondary font-body-md text-body-md">
                      Para finalizar la transferencia de{' '}
                      <span className="font-bold text-on-surface" id="confirm-amount">
                        S/ {parseFloat(amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>{' '}
                      a <span className="font-bold text-on-surface">{selectedContact?.name}</span>, por favor utiliza tu sensor de huella o ingresa tu PIN de seguridad.
                    </p>
                    
                    <div className="flex flex-col space-y-3 pt-4">
                      <button 
                        className="bg-primary text-white py-4 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-crimson-dark transition-all cursor-pointer shadow-sm transform active:scale-95" 
                        onClick={handlePrev}
                      >
                        <span className="material-symbols-outlined text-white">arrow_back</span>
                        <span>Corregir Datos</span>
                      </button>
                      <button 
                        className="bg-success text-white py-4 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-green-700 transition-all cursor-pointer shadow-sm transform active:scale-95" 
                        onClick={startBiometricTransfer}
                      >
                        <span className="material-symbols-outlined text-white">touch_app</span>
                        <span>Confirmar con Huella</span>
                      </button>
                      <button className="text-secondary font-label-md text-label-md hover:underline font-bold pt-2 cursor-pointer">
                        Usar PIN de Seguridad
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 3 && (
            <div className="mt-12 pt-8 border-t border-surface-container flex justify-between items-center" id="form-actions">
              <button 
                className={`flex items-center text-secondary font-bold hover:text-primary transition-all cursor-pointer ${
                  currentStep === 1 ? 'invisible' : 'visible'
                }`} 
                id="prev-btn"
                onClick={handlePrev}
              >
                <span className="material-symbols-outlined mr-1">arrow_back</span> Atrás
              </button>
              <button 
                className={`bg-primary text-white px-10 py-3 rounded-lg font-bold flex items-center hover:bg-crimson-dark transition-all cursor-pointer ${
                  limitError ? 'opacity-50 pointer-events-none' : ''
                }`} 
                id="next-btn"
                onClick={handleNext}
                disabled={limitError}
              >
                {currentStep === 2 ? 'Revisar' : 'Siguiente'}
                <span className="material-symbols-outlined ml-1 text-white">arrow_forward</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-surface-subtle p-6 rounded-xl flex items-start space-x-4 border border-surface-container">
          <span className="material-symbols-outlined text-primary p-2 bg-white rounded-lg">shield</span>
          <div>
            <h4 className="font-body-sm text-body-sm font-bold text-on-surface">Transferencia Segura</h4>
            <p className="font-label-md text-label-md text-secondary mt-1">Encriptación de extremo a extremo en cada operación.</p>
          </div>
        </div>
        <div className="bg-surface-subtle p-6 rounded-xl flex items-start space-x-4 border border-surface-container">
          <span className="material-symbols-outlined text-success p-2 bg-white rounded-lg">speed</span>
          <div>
            <h4 className="font-body-sm text-body-sm font-bold text-on-surface">Acreditación Inmediata</h4>
            <p className="font-label-md text-label-md text-secondary mt-1">El dinero llega al destino en menos de 10 segundos.</p>
          </div>
        </div>
        <div className="bg-surface-subtle p-6 rounded-xl flex items-start space-x-4 border border-surface-container">
          <span className="material-symbols-outlined text-warning p-2 bg-white rounded-lg">info</span>
          <div>
            <h4 className="font-body-sm text-body-sm font-bold text-on-surface">¿Necesitas ayuda?</h4>
            <p className="font-label-md text-label-md text-secondary mt-1">Soporte 24/7 disponible para consultas sobre transferencias.</p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-2xl max-w-sm w-full text-center shadow-xl transform scale-100 transition-all duration-300">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-success">
              <span className="material-symbols-outlined text-success text-5xl">check_circle</span>
            </div>
            
            <h3 className="font-headline-md text-headline-md font-bold mb-2">¡Transferencia Exitosa!</h3>
            <p className="text-secondary font-body-md text-body-md mb-6">
              Has enviado <span className="font-bold text-on-surface">S/ {parseFloat(amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span> a <span className="font-bold text-on-surface">{selectedContact?.name}</span> con éxito.
            </p>
            <p className="text-secondary font-body-sm text-body-sm mb-8 leading-relaxed">
              El comprobante ha sido enviado a tu correo electrónico registrado.
            </p>
            
            <div className="space-y-3">
              <button 
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-crimson-dark transition-all cursor-pointer shadow shadow-primary/20" 
                onClick={onNavigateToDashboard}
              >
                Volver al Inicio
              </button>
              <button 
                type="button"
                className="w-full border border-surface-container py-3 rounded-lg font-bold text-secondary flex items-center justify-center gap-2 hover:bg-surface-subtle transition-colors cursor-pointer"
                onClick={() => downloadVoucher('transferencia', {
                  amount: parseFloat(amount),
                  accountName: sourceAccount === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente',
                  referenceId: `CB-${referenceId}-TX`,
                  date: new Date().toLocaleString('es-PE'),
                  destinationName: selectedContact?.name,
                  destinationBank: selectedContact?.bank,
                  destinationAccount: selectedContact?.accNumber,
                  reason: reason
                })}
              >
                <span className="material-symbols-outlined">download</span> Descargar Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
