import React, { useState } from 'react';
import { downloadVoucher } from '../utils/downloadHelper';

interface DepositProps {
  checkingBalance: number;
  savingsBalance: number;
  onDepositComplete: (amount: number, accountType: 'ahorros' | 'corriente') => void;
  onCancel: () => void;
}

export const Deposit: React.FC<DepositProps> = ({
  checkingBalance,
  savingsBalance,
  onDepositComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedAccount, setSelectedAccount] = useState<'ahorros' | 'corriente'>('ahorros');
  const [amount, setAmount] = useState<string>('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [referenceId] = useState(() => Math.floor(10000 + Math.random() * 90000));

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const numAmount = parseFloat(amount);
      if (!amount || numAmount <= 0) {
        alert('Por favor ingresa un monto válido.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    if (currentStep === 1) {
      onCancel();
    } else {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const setPresetAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleConfirmDeposit = () => {
    const numAmount = parseFloat(amount);
    onDepositComplete(numAmount, selectedAccount);
    setShowSuccessScreen(true);
  };

  const getStepClass = (step: number) => {
    if (currentStep === step) {
      return 'text-primary border-b-2 border-primary pb-2 font-bold';
    }
    return 'text-secondary pb-2';
  };

  return (
    <div className="pt-8 pb-12 px-6 md:px-12 w-full max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="fade-in-up">
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold mb-2 text-primary">Panel de Depósitos</h1>
        <p className="font-body-lg text-body-lg text-secondary">Gestiona tus fondos de manera segura y rápida en S/.</p>
      </div>

      {/* Stepper Indicator */}
      {!showSuccessScreen && (
        <div className="flex items-center justify-center mb-12 space-x-4 md:space-x-12 select-none fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className={`flex items-center space-x-2 ${getStepClass(1)}`}>
            <span className="font-bold">1.</span>
            <span className="font-label-md text-xs tracking-wider uppercase">CUENTA</span>
          </div>
          <div className="h-px bg-surface-container w-8 md:w-16 mb-2"></div>
          
          <div className={`flex items-center space-x-2 ${getStepClass(2)}`}>
            <span className="font-bold">2.</span>
            <span className="font-label-md text-xs tracking-wider uppercase">MONTO</span>
          </div>
          <div className="h-px bg-surface-container w-8 md:w-16 mb-2"></div>
          
          <div className={`flex items-center space-x-2 ${getStepClass(3)}`}>
            <span className="font-bold">3.</span>
            <span className="font-label-md text-xs tracking-wider uppercase">CONFIRMACIÓN</span>
          </div>
        </div>
      )}

      {/* Deposit Card Container */}
      <div className="bg-white border border-surface-container rounded-xl shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-between fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        {!showSuccessScreen ? (
          <>
            {/* Step 1: Account Selection */}
            {currentStep === 1 && (
              <div className="p-8 md:p-12 space-y-8 animate-in fade-in duration-200">
                <h2 className="font-headline-md text-xl font-bold text-on-surface">Selecciona la cuenta de destino</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <button 
                    className={`group flex flex-col text-left p-6 border-2 rounded-xl transition-all ${
                      selectedAccount === 'ahorros' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-container bg-surface-subtle hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAccount('ahorros')}
                  >
                    <div className="flex justify-between items-start w-full mb-4">
                      <span className="material-symbols-outlined text-primary text-4xl">savings</span>
                      <span className={`material-symbols-outlined text-primary ${selectedAccount === 'ahorros' ? 'opacity-100' : 'opacity-0'}`}>
                        check_circle
                      </span>
                    </div>
                    <span className="font-headline-sm text-lg font-bold mb-1">Cuenta de Ahorros</span>
                    <span className="font-body-sm text-body-sm text-secondary">**** 5523</span>
                    <span className="mt-4 font-data-tabular text-data-tabular text-primary font-bold text-lg">
                      S/ {savingsBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </button>

                  <button 
                    className={`group flex flex-col text-left p-6 border-2 rounded-xl transition-all ${
                      selectedAccount === 'corriente' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-container bg-surface-subtle hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAccount('corriente')}
                  >
                    <div className="flex justify-between items-start w-full mb-4">
                      <span className="material-symbols-outlined text-primary text-4xl">account_balance_wallet</span>
                      <span className={`material-symbols-outlined text-primary ${selectedAccount === 'corriente' ? 'opacity-100' : 'opacity-0'}`}>
                        check_circle
                      </span>
                    </div>
                    <span className="font-headline-sm text-lg font-bold mb-1">Cuenta Corriente</span>
                    <span className="font-body-sm text-body-sm text-secondary">**** 9901</span>
                    <span className="mt-4 font-data-tabular text-data-tabular text-primary font-bold text-lg">
                      S/ {checkingBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </button>
                </div>
                
                <div className="flex justify-end pt-6 border-t border-surface-container">
                  <button 
                    className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-crimson-dark transition-colors cursor-pointer" 
                    onClick={handleNext}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Amount Entry */}
            {currentStep === 2 && (
              <div className="p-8 md:p-12 space-y-8 animate-in fade-in duration-200">
                <h2 className="font-headline-md text-xl font-bold text-on-surface">¿Cuánto deseas depositar?</h2>
                
                <div className="max-w-md mx-auto text-center space-y-6">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline-md text-primary font-bold text-2xl">S/</span>
                    <input 
                      className="w-full pl-16 pr-4 py-6 text-3xl font-bold bg-surface-subtle border-2 border-surface-container rounded-xl focus:border-primary focus:ring-0 text-primary placeholder-primary/25 transition-all outline-none" 
                      placeholder="0.00" 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      autoFocus
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      className="py-3 px-4 border border-surface-container rounded-lg hover:bg-primary-container hover:text-white hover:border-primary transition-all font-bold bg-white cursor-pointer" 
                      onClick={() => setPresetAmount(100)}
                    >
                      S/ 100
                    </button>
                    <button 
                      className="py-3 px-4 border border-surface-container rounded-lg hover:bg-primary-container hover:text-white hover:border-primary transition-all font-bold bg-white cursor-pointer" 
                      onClick={() => setPresetAmount(500)}
                    >
                      S/ 500
                    </button>
                    <button 
                      className="py-3 px-4 border border-surface-container rounded-lg hover:bg-primary-container hover:text-white hover:border-primary transition-all font-bold bg-white cursor-pointer" 
                      onClick={() => setPresetAmount(1000)}
                    >
                      S/ 1000
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-surface-container">
                  <button 
                    className="px-8 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer" 
                    onClick={handlePrev}
                  >
                    Atrás
                  </button>
                  <button 
                    className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-crimson-dark transition-colors cursor-pointer" 
                    onClick={handleNext}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="p-8 md:p-12 space-y-8 animate-in fade-in duration-200">
                <h2 className="font-headline-md text-xl font-bold text-on-surface">Confirma los detalles</h2>
                
                <div className="bg-surface-subtle p-6 rounded-xl space-y-4">
                  <div className="flex justify-between border-b border-surface-container-high pb-4">
                    <span className="text-secondary font-body-md">Cuenta de destino</span>
                    <span className="font-bold text-on-surface">
                      {selectedAccount === 'ahorros' ? 'Cuenta de Ahorros (**** 5523)' : 'Cuenta Corriente (**** 9901)'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-surface-container-high pb-4">
                    <span className="text-secondary font-body-md">Monto a depositar</span>
                    <span className="font-bold text-primary text-xl">
                      S/ {parseFloat(amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-secondary font-body-md">Fecha de operación</span>
                    <span className="font-bold text-on-surface">
                      {new Date().toLocaleDateString('es-PE')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary font-body-md">Comisión</span>
                    <span className="font-bold text-success">S/ 0.00 (Gratis)</span>
                  </div>
                </div>
                
                <div className="bg-primary-container/10 p-4 rounded-lg flex items-start space-x-3 border border-primary-container/20">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="text-xs text-primary font-body-sm leading-tight font-semibold">
                    Al confirmar, el depósito se procesará de forma inmediata. Asegúrate de que los datos sean correctos.
                  </p>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-surface-container">
                  <button 
                    className="px-8 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer" 
                    onClick={handlePrev}
                  >
                    Atrás
                  </button>
                  <button 
                    className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-crimson-dark transition-colors shadow-lg cursor-pointer" 
                    onClick={handleConfirmDeposit}
                  >
                    Confirmar Depósito
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Success Screen */
          <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center text-white mb-4 border border-success/30 shadow-sm">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            
            <h2 className="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">¡Depósito Exitoso!</h2>
            <p className="font-body-lg text-secondary max-w-sm">
              Tu depósito ha sido procesado correctamente. Los fondos ya están disponibles en tu cuenta.
            </p>
            
            <div className="w-full max-w-sm bg-surface-subtle p-4 rounded-lg text-left border border-surface-container">
              <p className="text-xs text-secondary font-bold uppercase mb-2">Comprobante #CB-{referenceId}-DP</p>
              <div className="flex justify-between mb-1 border-b border-surface-container pb-2">
                <span className="text-sm text-secondary">Destino</span>
                <span className="text-sm font-bold text-on-surface">
                  {selectedAccount === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-sm text-secondary">Monto</span>
                <span className="text-sm font-bold text-primary">
                  S/ {parseFloat(amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center">
              <button 
                className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-crimson-dark transition-colors cursor-pointer" 
                onClick={onCancel}
              >
                Volver al Inicio
              </button>
              <button 
                type="button"
                className="px-8 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-primary-container/10 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                onClick={() => downloadVoucher('deposito', {
                  amount: parseFloat(amount),
                  accountName: selectedAccount === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente',
                  referenceId: `CB-${referenceId}-DP`,
                  date: new Date().toLocaleString('es-PE'),
                })}
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Descargar Recibo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
