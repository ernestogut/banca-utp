import React, { useState } from 'react';
import { downloadVoucher } from '../utils/downloadHelper';

interface WithdrawProps {
  checkingBalance: number;
  savingsBalance: number;
  onWithdrawComplete: (amount: number, accountType: 'ahorros' | 'corriente') => void;
  onCancel: () => void;
}

export const Withdraw: React.FC<WithdrawProps> = ({
  checkingBalance,
  savingsBalance,
  onWithdrawComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedAccount, setSelectedAccount] = useState<'ahorros' | 'corriente'>('ahorros');
  const [amount, setAmount] = useState<string>('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [referenceId] = useState(() => Math.floor(10000 + Math.random() * 90000));

  const activeBalance = selectedAccount === 'ahorros' ? savingsBalance : checkingBalance;

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const numAmount = parseFloat(amount);
      if (!amount || numAmount <= 0) {
        setAmountError('Por favor ingresa un monto válido.');
        return;
      }
      if (numAmount > 5000) {
        setAmountError('El límite máximo de retiro diario es de S/ 5,000.00.');
        return;
      }
      if (numAmount > activeBalance) {
        setAmountError('El monto supera el saldo disponible en la cuenta.');
        return;
      }
      
      setAmountError(null);
      setCurrentStep(3);
      
      // Perform the withdrawal deduction
      onWithdrawComplete(numAmount, selectedAccount);
    }
  };

  const handlePrev = () => {
    if (currentStep === 1) {
      onCancel();
    } else if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const getStepMarkerClass = (step: number) => {
    if (currentStep > step) {
      return 'bg-success text-white border-success';
    }
    if (currentStep === step) {
      return 'bg-primary text-white border-primary';
    }
    return 'bg-white text-secondary border-surface-container';
  };

  const getStepLabelClass = (step: number) => {
    if (currentStep > step) return 'text-success font-bold';
    if (currentStep === step) return 'text-primary font-bold';
    return 'text-secondary';
  };

  return (
    <div className="pt-8 pb-16 px-6 md:px-12 w-full max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="fade-in-up">
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold mb-2 text-on-surface">Panel de Retiros</h1>
        <p className="font-body-lg text-body-lg text-secondary">Disposición segura de tus fondos en S/.</p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-12 relative px-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-surface-container -z-10"></div>
        
        <div className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${getStepMarkerClass(1)}`}>
            {currentStep > 1 ? <span className="material-symbols-outlined text-sm">check</span> : '1'}
          </div>
          <span className={`font-label-md text-xs tracking-wider uppercase ${getStepLabelClass(1)}`}>CUENTA</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${getStepMarkerClass(2)}`}>
            {currentStep > 2 ? <span className="material-symbols-outlined text-sm">check</span> : '2'}
          </div>
          <span className={`font-label-md text-xs tracking-wider uppercase ${getStepLabelClass(2)}`}>MONTO</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${getStepMarkerClass(3)}`}>
            '3'
          </div>
          <span className={`font-label-md text-xs tracking-wider uppercase ${getStepLabelClass(3)}`}>CONFIRMACIÓN</span>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white border border-surface-container rounded-xl shadow-sm p-8 md:p-12 min-h-[400px] flex flex-col justify-between fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Step 1: Account Selection */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-headline-sm text-xl font-bold text-on-surface">Selecciona la cuenta de origen</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className={`relative cursor-pointer border-2 rounded-xl p-6 transition-all flex flex-col justify-between min-h-[140px] ${
                  selectedAccount === 'ahorros' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-surface-container hover:border-outline bg-white'
                }`}
                onClick={() => setSelectedAccount('ahorros')}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-label-md text-secondary font-bold uppercase tracking-wider">Cuenta de Ahorros</span>
                  <span className={`material-symbols-outlined ${selectedAccount === 'ahorros' ? 'text-primary' : 'text-surface-container-high'}`}>
                    {selectedAccount === 'ahorros' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
                <div className="font-headline-md text-2xl font-bold text-on-surface">
                  S/ {savingsBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-success text-xs font-bold mt-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">task_alt</span> Activa
                </div>
              </div>

              <div 
                className={`relative cursor-pointer border-2 rounded-xl p-6 transition-all flex flex-col justify-between min-h-[140px] ${
                  selectedAccount === 'corriente' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-surface-container hover:border-outline bg-white'
                }`}
                onClick={() => setSelectedAccount('corriente')}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-label-md text-secondary font-bold uppercase tracking-wider">Cuenta Corriente</span>
                  <span className={`material-symbols-outlined ${selectedAccount === 'corriente' ? 'text-primary' : 'text-surface-container-high'}`}>
                    {selectedAccount === 'corriente' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
                <div className="font-headline-md text-2xl font-bold text-on-surface">
                  S/ {checkingBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-success text-xs font-bold mt-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">task_alt</span> Activa
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Amount Input */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-headline-sm text-xl font-bold text-on-surface">Ingresa el monto a retirar</h3>
            
            <div className="p-4 bg-surface-subtle rounded-xl border border-surface-container flex items-center justify-between">
              <div>
                <p className="font-label-md text-xs text-secondary font-bold uppercase tracking-wider">Saldo Disponible</p>
                <p className="font-headline-sm text-lg font-bold text-on-surface">
                  S/ {activeBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <span className="material-symbols-outlined text-secondary scale-125">account_balance_wallet</span>
            </div>

            <div className="space-y-2">
              <label className="block font-label-md text-xs text-secondary font-bold uppercase tracking-wider">Monto a Retirar (S/)</label>
              <div className="relative">
                <input 
                  className={`w-full p-4 border border-outline rounded-lg text-lg font-bold focus:border-2 focus:border-primary outline-none transition-all ${
                    amountError ? 'border-error text-error' : 'border-surface-container'
                  }`}
                  placeholder="0.00" 
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setAmountError(null);
                  }}
                  autoFocus
                />
                {amountError && (
                  <div className="text-error text-xs font-bold mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>{amountError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex gap-3 p-3 bg-primary-fixed/15 border-l-4 border-primary rounded-r-lg">
                <span className="material-symbols-outlined text-primary text-sm">info</span>
                <p className="text-xs text-on-surface-variant font-semibold">
                  Restricción diaria: Límite máximo de retiro S/ 5,000.00
                </p>
              </div>
              <div className="flex gap-3 p-3 bg-surface-subtle border-l-4 border-secondary rounded-r-lg">
                <span className="material-symbols-outlined text-secondary text-sm">security</span>
                <p className="text-xs text-secondary font-semibold">
                  Estado de cuenta: Solo se permiten retiros de cuentas en estado Activo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success Voucher */}
        {currentStep === 3 && (
          <div className="text-center py-6 animate-in zoom-in duration-300 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success border border-success/30">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            
            <div>
              <h2 className="font-headline-md text-2xl font-bold text-on-surface">Retiro Exitoso</h2>
              <p className="text-body-md text-secondary mt-1">Tus fondos han sido procesados correctamente.</p>
            </div>

            <div className="max-w-sm mx-auto p-6 bg-surface-subtle border border-surface-container rounded-xl space-y-4 text-left">
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-xs text-secondary">Cuenta</span>
                <span className="font-label-md font-bold text-on-surface">
                  {selectedAccount === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'}
                </span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-xs text-secondary">Monto</span>
                <span className="font-label-md text-primary font-bold text-lg">
                  S/ {parseFloat(amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-xs text-secondary">Fecha</span>
                <span className="font-label-md text-on-surface">
                  {new Date().toLocaleDateString('es-PE')} - {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-secondary">Referencia</span>
                <span className="font-label-md text-on-surface">#CB-{referenceId}-RT</span>
              </div>
            </div>

            <button 
              className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary-container/10 transition-all mx-auto cursor-pointer"
              onClick={() => downloadVoucher('retiro', {
                amount: parseFloat(amount),
                accountName: selectedAccount === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente',
                referenceId: `CB-${referenceId}-RT`,
                date: new Date().toLocaleString('es-PE'),
              })}
            >
              <span className="material-symbols-outlined">download</span>
              Descargar Comprobante
            </button>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="mt-12 pt-8 border-t border-surface-container flex flex-col md:flex-row-reverse gap-4">
          {currentStep === 3 ? (
            <button 
              className="w-full md:w-48 bg-primary text-white py-3.5 rounded-lg font-bold hover:bg-crimson-dark transition-all active:scale-95 duration-100 cursor-pointer text-center"
              onClick={onCancel}
            >
              Inicio
            </button>
          ) : (
            <>
              <button 
                className="w-full md:w-48 bg-primary text-white py-3.5 rounded-lg font-bold hover:bg-crimson-dark transition-all active:scale-95 duration-100 cursor-pointer text-center"
                onClick={handleNext}
              >
                Siguiente
              </button>
              <button 
                className="w-full md:w-48 border border-surface-container bg-transparent text-secondary py-3.5 rounded-lg font-bold hover:text-primary transition-all cursor-pointer text-center"
                onClick={handlePrev}
              >
                {currentStep === 1 ? 'Cancelar' : 'Anterior'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Security Footer Message */}
      <div className="flex items-center justify-center gap-2 text-secondary font-label-md text-xs font-semibold">
        <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
        <span>Operación protegida por Crimson Guard® Encryption v.2.6</span>
      </div>
    </div>
  );
};
