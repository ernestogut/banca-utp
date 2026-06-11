import React, { useState } from 'react';
import { downloadAccountStatement } from '../utils/downloadHelper';

interface AccountsProps {
  userName: string;
  accounts: any[];
  transactions: any[];
  onCreateAccount: (accountType: 'corriente' | 'ahorros', initialBalance: number) => Promise<any>;
}

export const Accounts: React.FC<AccountsProps> = ({
  userName,
  accounts,
  transactions,
  onCreateAccount,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<'corriente' | 'ahorros'>('ahorros');
  const [initialDeposit, setInitialDeposit] = useState<string>('0');
  const [isCreating, setIsCreating] = useState(false);
  const [createdAccountInfo, setCreatedAccountInfo] = useState<any>(null);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const firstName = userName.split(' ')[0];

  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);
    setSelectedType('ahorros');
    setInitialDeposit('0');
    setIsCreating(false);
    setCreatedAccountInfo(null);
  };

  const handleConfirmCreate = async () => {
    setIsCreating(true);
    // Simulate biometric scanning delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const newAcc = await onCreateAccount(selectedType, parseFloat(initialDeposit) || 0);
      setCreatedAccountInfo(newAcc);
      setStep(3);
    } catch (error: any) {
      alert(error.message || 'Error al crear la cuenta.');
      setIsCreating(false);
    }
  };

  return (
    <div className="pt-8 pb-12 px-6 md:px-12 w-full max-w-7xl mx-auto space-y-8">
      {/* Header & Action */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 fade-in-up">
        <div>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-2">
            Bienvenido, {firstName}
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Gestiona tus cuentas bancarias y activos financieros para el periodo 2026.
          </p>
        </div>
        <button 
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-crimson-dark transition-all shadow-md active:scale-95 cursor-pointer font-bold"
          onClick={() => setShowModal(true)}
        >
          <span className="material-symbols-outlined text-white">add_circle</span>
          Crear nueva cuenta
        </button>
      </header>

      {/* Portfolio Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white p-6 border border-surface-container rounded-xl shadow-sm">
          <p className="font-label-md text-label-md text-secondary mb-1 uppercase font-bold tracking-wider">Balance Total</p>
          <h3 className="font-headline-md text-2xl font-bold text-primary">
            S/ {totalBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 h-1 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/3"></div>
          </div>
        </div>
        <div className="bg-white p-6 border border-surface-container rounded-xl shadow-sm">
          <p className="font-label-md text-label-md text-secondary mb-1 uppercase font-bold tracking-wider">Cuentas Activas</p>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">
            {String(accounts.length + 1).padStart(2, '0')}
          </h3>
          <p className="text-success text-[12px] font-bold mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> 
            +12% este mes
          </p>
        </div>
        <div className="bg-white p-6 border border-surface-container rounded-xl shadow-sm">
          <p className="font-label-md text-label-md text-secondary mb-1 uppercase font-bold tracking-wider">Próximo Vencimiento</p>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">15 May</h3>
          <p className="text-secondary text-[12px] mt-2">Mantenimiento de cuenta</p>
        </div>
      </section>

      {/* Accounts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Dynamic Accounts from Database */}
        {accounts.map((acc: any) => {
          const isSavings = acc.accountType === 'ahorros';
          const iconName = isSavings ? 'savings' : 'credit_card';
          const bgBar = isSavings ? 'bg-primary' : 'bg-secondary';
          const bgIcon = isSavings ? 'bg-primary-fixed text-primary' : 'bg-secondary-container text-secondary';
          const title = isSavings ? 'Cuenta de Ahorros' : 'Cuenta Corriente';
          const createdDate = new Date(acc.createdAt).toLocaleDateString('es-PE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          return (
            <div key={acc.id} className="bg-white border border-surface-container p-6 rounded-xl hover:shadow-lg transition-all group relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${bgBar}`}></div>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2 rounded-lg ${bgIcon}`}>
                    <span className="material-symbols-outlined">{iconName}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Activa
                  </span>
                </div>
                <div className="mb-6">
                  <h4 className="font-headline-sm text-lg font-bold text-on-surface mb-1">{title}</h4>
                  <p className="font-data-tabular text-data-tabular text-secondary">{acc.accountNumber}</p>
                </div>
              </div>
              <div>
                <div className="mb-8">
                  <p className="font-label-md text-label-md text-secondary mb-1 uppercase tracking-wider font-bold">Saldo Disponible</p>
                  <h2 className="text-3xl font-bold font-display-lg text-on-surface">
                    S/ {acc.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-surface-container">
                  <span className="text-xs text-secondary">Creada: {createdDate}</span>
                  <button 
                    onClick={() => downloadAccountStatement({
                      userName,
                      accountNumber: acc.accountNumber,
                      accountType: acc.accountType,
                      balance: acc.balance,
                      id: acc.id,
                      createdAt: acc.createdAt
                    }, transactions)}
                    className="text-primary hover:underline font-label-md text-label-md font-bold cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span> Estado de cuenta
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Account Card 3: Blocked Account Mockup (kept for UI richness) */}
        <div className="bg-white border border-surface-container p-6 rounded-xl opacity-80 hover:opacity-100 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-error"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-error-container rounded-lg text-error">
                <span className="material-symbols-outlined">block</span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
                Bloqueada
              </span>
            </div>
            <div className="mb-6">
              <h4 className="font-headline-sm text-lg font-bold text-on-surface mb-1">Cuenta de Ahorros Extra</h4>
              <p className="font-data-tabular text-data-tabular text-secondary">****1102</p>
            </div>
          </div>
          <div>
            <div className="mb-8">
              <p className="font-label-md text-label-md text-secondary mb-1 uppercase tracking-wider font-bold">Saldo Disponible</p>
              <h2 className="text-3xl font-bold font-display-lg text-on-surface">S/ 0.00</h2>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-surface-container">
              <span className="text-xs text-secondary">Creada: 20 de Junio, 2023</span>
              <button className="text-error hover:underline font-label-md text-label-md font-bold cursor-pointer" onClick={() => alert('Solicitud de desbloqueo enviada.')}>
                Solicitar Desbloqueo
              </button>
            </div>
          </div>
        </div>

        {/* Add New Account Card CTA */}
        <div 
          className="border-2 border-dashed border-surface-container p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-surface-subtle transition-all cursor-pointer group min-h-[300px]"
          onClick={() => setShowModal(true)}
        >
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-secondary group-hover:text-white text-3xl">add</span>
          </div>
          <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Nueva Cuenta</h4>
          <p className="font-body-sm text-body-sm text-secondary px-6">
            Abre una nueva cuenta de ahorros o corriente en segundos.
          </p>
        </div>
      </section>

      {/* Trust Section with Image */}
      <section className="mt-16 bg-primary-container/20 rounded-xl overflow-hidden relative min-h-[300px] flex items-center shadow-sm fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-20 grayscale" 
            alt="A professional architectural photograph of a modern bank headquarters building at twilight. The structure is characterized by clean lines, expansive glass windows reflecting a deep crimson glow, and sharp metallic edges that evoke a sense of security and institutional stability. The lighting is sophisticated, emphasizing the structural integrity and high-performance digital environment of CrimsonBank." 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUPukKht1jxgXb-7W2htLIxt-BCHBGfvow2h8DGxCwE5nSs7FfDwxHs6I1YgUCn6ZYTN1iuRbTHd0RRta4QiH4ZfUxL_XtF87ff83MxLJiBXzviYGmaBwHZdMeYJFr3mWgF3dHcNhBrAVfU966cHNGLV2_Qr1_FBosn72IypPaKhA2_dQs02wuetHGlu91dR5uRvMZ8XWF6UnlqZOjFhVSJ-Zjah-Espr4BUeDVfW61YHYk306ApnXsX3BzsyEtWJyqV87XSOY60o"
          />
        </div>
        <div className="relative z-10 px-8 py-12 md:px-12 max-w-2xl">
          <h2 className="font-display-lg text-2xl md:text-3xl font-bold text-primary mb-4">
            Seguridad Institucional Crimson
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface opacity-90 mb-8">
            Tus fondos están protegidos por el sistema de encriptación cuántica CrimsonBank. Monitoreo 24/7 y respaldo del Fondo de Seguro de Depósitos.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-primary">verified_user</span>
              <span className="font-label-md text-label-md text-on-surface font-bold">Certificado SSL</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-primary">lock</span>
              <span className="font-label-md text-label-md text-on-surface font-bold">2FA Activo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Account Creation Modal Flow */}
      {showModal && (
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 md:p-10 rounded-2xl max-w-lg w-full shadow-2xl relative overflow-hidden transition-all duration-300 transform scale-100">
            
            {/* Modal Close Button */}
            {step !== 2 && step !== 3 && (
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-secondary hover:text-on-surface p-1 rounded-full hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}

            {/* Step 1: Configuration Form */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="font-headline-md text-2xl font-bold text-primary mb-2">Abrir Nueva Cuenta</h3>
                  <p className="text-secondary font-body-sm">Selecciona el tipo de cuenta y el depósito inicial.</p>
                </div>

                {/* Account Type Selector Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setSelectedType('ahorros')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center text-center ${
                      selectedType === 'ahorros' 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-surface-container hover:border-outline bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-2xl">savings</span>
                    </div>
                    <h4 className="font-headline-sm font-bold text-on-surface text-sm">Cuenta de Ahorros</h4>
                    <p className="text-[10px] text-secondary mt-1">Ideal para ahorrar y ganar intereses</p>
                  </div>

                  <div 
                    onClick={() => setSelectedType('corriente')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center text-center ${
                      selectedType === 'corriente' 
                        ? 'border-secondary bg-secondary/5 shadow-md' 
                        : 'border-surface-container hover:border-outline bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-2xl">credit_card</span>
                    </div>
                    <h4 className="font-headline-sm font-bold text-on-surface text-sm">Cuenta Corriente</h4>
                    <p className="text-[10px] text-secondary mt-1">Operaciones diarias ilimitadas</p>
                  </div>
                </div>

                {/* Initial Deposit Input */}
                <div className="space-y-2">
                  <label className="font-label-md text-secondary block font-bold uppercase tracking-wider text-xs">
                    Depósito Inicial (Opcional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body-md font-bold text-secondary">
                      S/
                    </span>
                    <input 
                      type="number"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-4 pl-10 bg-surface-subtle border border-surface-container rounded-lg focus:outline-none focus:border-primary font-body-md text-on-surface"
                    />
                  </div>
                  {/* Presets */}
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 100, 500, 1000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setInitialDeposit(val.toString())}
                        className={`py-1.5 px-3 border border-surface-container rounded-md font-bold text-xs cursor-pointer hover:bg-surface-subtle transition-all ${
                          parseFloat(initialDeposit) === val ? 'bg-primary text-white hover:bg-primary' : 'bg-white text-secondary'
                        }`}
                      >
                        S/ {val}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-crimson-dark transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  Siguiente
                  <span className="material-symbols-outlined text-white text-[18px]">arrow_forward</span>
                </button>
              </div>
            )}

            {/* Step 2: Biometric Confirmation */}
            {step === 2 && (
              <div className="space-y-6 text-center">
                <h3 className="font-headline-md text-2xl font-bold text-on-surface">Confirmación Biométrica</h3>
                <p className="text-secondary font-body-sm">
                  Para autorizar la apertura de tu nueva {selectedType === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'}, por favor coloca tu huella en el lector digital.
                </p>

                <div className="py-6">
                  <button
                    onClick={handleConfirmCreate}
                    disabled={isCreating}
                    className={`w-28 h-28 mx-auto rounded-full border-4 border-primary flex items-center justify-center cursor-pointer transition-all relative ${
                      isCreating ? 'biometric-scanner-animation bg-primary/10' : 'hover:bg-primary/5 active:scale-95'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-primary text-5xl ${isCreating ? 'animate-pulse' : ''}`}>
                      fingerprint
                    </span>
                  </button>
                  <p className="text-xs text-secondary mt-4">
                    {isCreating ? 'Escaneando huella y configurando cuenta...' : 'Presiona el lector para escanear'}
                  </p>
                </div>

                {!isCreating && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-secondary font-bold hover:text-primary transition-all text-sm cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span> Atrás
                  </button>
                )}
              </div>
            )}

            {/* Step 3: Success View */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto border-2 border-success">
                  <span className="material-symbols-outlined text-success text-5xl">check_circle</span>
                </div>

                <div>
                  <h3 className="font-headline-md text-2xl font-bold mb-2">¡Cuenta Abierta Exitosamente!</h3>
                  <p className="text-secondary font-body-sm">
                    Tu {createdAccountInfo?.accountType === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente'} ya está activa y lista para operar.
                  </p>
                </div>

                <div className="bg-surface-subtle border border-surface-container rounded-xl p-4 space-y-2 text-left">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary">Número de Cuenta:</span>
                    <span className="font-bold text-on-surface font-mono">{createdAccountInfo?.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary">Tipo de Cuenta:</span>
                    <span className="font-bold text-on-surface capitalize">{createdAccountInfo?.accountType}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary">Saldo Inicial:</span>
                    <span className="font-bold text-on-surface">S/ {parseFloat(initialDeposit || '0').toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-crimson-dark transition-all cursor-pointer shadow-sm"
                >
                  Listo, ir a mis cuentas
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

