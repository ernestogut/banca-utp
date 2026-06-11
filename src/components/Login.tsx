import React, { useState } from 'react';
import { api } from '../services/api';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  biometricFingerprintEnabled: boolean;
  biometricFaceEnabled: boolean;
}

interface LoginProps {
  onLoginSuccess: (user: UserInfo) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricState, setBiometricState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'facial' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Estados de Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor ingrese su identificación de usuario y contraseña.');
      return;
    }
    setErrorMsg('');
    try {
      const res = await api.post('/api/auth/login', {
        email,
        passwordHash: password,
      });
      localStorage.setItem('token', res.token);
      onLoginSuccess(res.user);
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    }
  };

  const startBiometricScan = (type: 'fingerprint' | 'facial') => {
    setBiometricType(type);
    setBiometricState('scanning');
    setErrorMsg('');

    const authEmail = email.trim() || 'ernesto.mtz@email.com';

    setTimeout(async () => {
      try {
        const res = await api.post('/api/auth/biometric', {
          email: authEmail,
          type,
        });
        setBiometricState('success');
        localStorage.setItem('token', res.token);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 800);
      } catch (error: any) {
        setBiometricState('error');
        setErrorMsg(error.message || 'Error de autenticación biométrica.');
        setTimeout(() => {
          setBiometricState('idle');
        }, 2000);
      }
    }, 2000);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Por favor complete todos los campos de registro.');
      return;
    }
    setErrorMsg('');
    try {
      const res = await api.post('/api/auth/register', {
        name: regName,
        email: regEmail,
        passwordHash: regPassword,
      });
      localStorage.setItem('token', res.token);
      onLoginSuccess(res.user);
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al crear la cuenta.');
    }
  };

  return (
    <div className="bg-surface-canvas text-on-surface font-body-md min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-surface-canvas border-b border-surface-container w-full h-16 z-50">
        <div className="flex justify-between items-center px-6 md:px-12 w-full h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
            <span className="font-headline-md text-headline-md font-bold text-primary">CrimsonBank</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <nav className="flex gap-6">
              <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors duration-200" href="#">Personal</a>
              <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors duration-200" href="#">Negocios</a>
              <a className="font-body-md text-body-md text-secondary hover:text-primary transition-colors duration-200" href="#">Institucional</a>
            </nav>
            <div className="h-6 w-[1px] bg-surface-container"></div>
            <div className="flex gap-3 items-center">
              <span className="material-symbols-outlined text-secondary">public</span>
              <span className="font-label-md text-label-md text-secondary uppercase">ES</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-12 relative overflow-hidden">
        {/* Background Ambient Blur Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-crimson-dark/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          
          {/* Left Side: Branding & Welcome */}
          <div className="hidden lg:flex flex-col space-y-8 fade-in-up">
            <div>
              <h1 className="font-display-lg text-4xl lg:text-5xl font-bold text-on-surface leading-tight">
                Acceso Seguro <br />
                <span className="text-primary">Crimson Trust</span>
              </h1>
              <p className="font-body-lg text-body-lg text-secondary mt-6 max-w-md">
                Experimente la banca de próxima generación con protocolos de seguridad biométrica de grado militar y una interfaz diseñada para su tranquilidad.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-surface-subtle border border-surface-container rounded-xl space-y-3">
                <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                <h3 className="font-headline-sm text-headline-sm font-semibold">Cifrado E2E</h3>
                <p className="font-body-sm text-body-sm text-secondary">Tus datos están protegidos con los estándares más altos del mercado.</p>
              </div>
              <div className="p-6 bg-surface-subtle border border-surface-container rounded-xl space-y-3">
                <span className="material-symbols-outlined text-primary text-3xl">biotech</span>
                <h3 className="font-headline-sm text-headline-sm font-semibold">Biometría</h3>
                <p className="font-body-sm text-body-sm text-secondary">Acceso instantáneo mediante reconocimiento facial o huella dactilar.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 py-4 border-t border-surface-container">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container overflow-hidden">
                  <img 
                    alt="Usuario Crimson" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSTEZ1fnE4LWLh5uoylezdwfU1rgJjzLlycb-0kOi-YtrhekqUSgSYwki0wJkbr0zGetFHjPYN6gl1TqlIqM2EWrO9QqBHS0kP6AFr7cDU9__vMMD89f9J6E4KUwms8aSDFwnMLyK4RIXN_lW_SmifnsYfs7wte5G5jl4QbAYlPjg84p3DNKV5hWPb73qzx8I7Z2ZEzrq0kkXPrtU4QrIBq7hvH5TSIkQGHtTx4KC6HWBTfGD51hWPK5SjhuhFbmRZlLoX0tfJ4Hg" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white font-label-md flex items-center justify-center font-bold">
                  +12k
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">Únase a miles de usuarios que ya confían en nuestra seguridad.</p>
            </div>
          </div>

          {/* Right Side: Auth Form */}
          <div className="w-full max-w-md mx-auto fade-in-up">
            <div className="bg-white border border-surface-container-high rounded-xl p-8 md:p-10 shadow-md relative">
              
              {/* Tabs Selection */}
              <div className="flex border-b border-surface-container mb-8">
                <button 
                  className={`flex-1 pb-4 font-headline-sm text-headline-sm transition-all border-b-2 font-semibold cursor-pointer ${
                    activeTab === 'login' 
                      ? 'text-primary border-primary' 
                      : 'text-secondary border-transparent hover:text-primary'
                  }`}
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                >
                  Iniciar Sesión
                </button>
                <button 
                  className={`flex-1 pb-4 font-headline-sm text-headline-sm transition-all border-b-2 font-semibold cursor-pointer ${
                    activeTab === 'register' 
                      ? 'text-primary border-primary' 
                      : 'text-secondary border-transparent hover:text-primary'
                  }`}
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                >
                  Registrarse
                </button>
              </div>

              {activeTab === 'login' ? (
                /* Login Form */
                <form onSubmit={handleManualLogin} className="space-y-6">
                  {errorMsg && (
                    <div className="p-3 bg-error-container text-on-error-container text-body-sm rounded border border-error/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-error">error</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block font-bold">
                      Identificación de Usuario
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                        alternate_email
                      </span>
                      <input 
                        className="w-full pl-10 pr-4 py-3 bg-surface-subtle border border-surface-container rounded focus:outline-none focus:border-2 focus:border-primary transition-all font-body-md" 
                        placeholder="nombre@ejemplo.com" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-bold">
                        Contraseña
                      </label>
                      <a className="font-label-md text-label-md text-primary hover:underline" href="#">
                        ¿Olvidó su contraseña?
                      </a>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                        lock
                      </span>
                      <input 
                        className="w-full pl-10 pr-12 py-3 bg-surface-subtle border border-surface-container rounded focus:outline-none focus:border-2 focus:border-primary transition-all font-body-md" 
                        placeholder="••••••••" 
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary text-white font-headline-sm rounded hover:bg-crimson-dark transition-all transform active:scale-95 duration-100 flex justify-center items-center gap-2 cursor-pointer font-semibold shadow-sm"
                  >
                    Ingresar al Sistema
                    <span className="material-symbols-outlined text-white">arrow_forward</span>
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-surface-container"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-secondary font-label-md font-bold">
                        O accede con biometría
                      </span>
                    </div>
                  </div>

                  {/* Biometric Integration Module */}
                  <div className="bg-surface-subtle rounded-xl border border-surface-container-high p-6 text-center space-y-4">
                    
                    {biometricState === 'scanning' ? (
                      <div className="space-y-4">
                        <div className="relative w-20 h-20 mx-auto biometric-scanner-animation rounded-full flex items-center justify-center border-2 border-primary">
                          <span className="material-symbols-outlined text-primary text-5xl animate-pulse">
                            {biometricType === 'fingerprint' ? 'fingerprint' : 'face'}
                          </span>
                        </div>
                        <div>
                          <p className="font-headline-sm text-headline-sm font-semibold text-primary">
                            {biometricType === 'fingerprint' ? 'Escaneando Huella...' : 'Analizando Rostro...'}
                          </p>
                          <p className="font-body-sm text-body-sm text-secondary">Por favor espere un momento</p>
                        </div>
                      </div>
                    ) : biometricState === 'success' ? (
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center border-2 border-success">
                          <span className="material-symbols-outlined text-success text-5xl">
                            check_circle
                          </span>
                        </div>
                        <div>
                          <p className="font-headline-sm text-headline-sm font-semibold text-success">
                            Acceso Autorizado
                          </p>
                          <p className="font-body-sm text-body-sm text-secondary">Redireccionando...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2 border-primary/20 bg-white">
                          <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            fingerprint
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-headline-sm text-headline-sm font-semibold">Autenticación Biométrica</h4>
                          <p className="font-body-sm text-body-sm text-secondary">Toque el sensor o mire a la cámara para ingresar</p>
                        </div>
                        <div className="flex justify-center gap-4">
                          <button 
                            type="button"
                            className="flex items-center gap-1 font-label-md text-label-md text-primary hover:bg-primary/5 px-3 py-2 rounded transition-all cursor-pointer font-bold border border-primary/20"
                            onClick={() => startBiometricScan('facial')}
                          >
                            <span className="material-symbols-outlined text-sm">face</span> Facial
                          </button>
                          <button 
                            type="button"
                            className="flex items-center gap-1 font-label-md text-label-md text-primary hover:bg-primary/5 px-3 py-2 rounded transition-all cursor-pointer font-bold border border-primary/20"
                            onClick={() => startBiometricScan('fingerprint')}
                          >
                            <span className="material-symbols-outlined text-sm">touch_app</span> Huella
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Security Indicator */}
                  <div className="flex items-center justify-center gap-2 text-success pt-4 border-t border-surface-container">
                    <span className="material-symbols-outlined text-sm text-success">verified</span>
                    <span className="font-label-md text-label-md font-bold">Conexión Segura SSL 256-bit AES</span>
                  </div>
                </form>
              ) : (
                 <form onSubmit={handleRegisterSubmit} className="space-y-6">
                   {errorMsg && (
                     <div className="p-3 bg-error-container text-on-error-container text-body-sm rounded border border-error/20 flex items-center gap-2">
                       <span className="material-symbols-outlined text-error">error</span>
                       <span>{errorMsg}</span>
                     </div>
                   )}
                   <div className="space-y-2">
                     <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block font-bold">
                       Nombre Completo
                     </label>
                     <input 
                       className="w-full px-4 py-3 bg-surface-subtle border border-surface-container rounded focus:outline-none focus:border-primary transition-all font-body-md" 
                       placeholder="Juan Pérez" 
                       type="text" 
                       value={regName}
                       onChange={(e) => setRegName(e.target.value)}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block font-bold">
                       Correo Electrónico
                     </label>
                     <input 
                       className="w-full px-4 py-3 bg-surface-subtle border border-surface-container rounded focus:outline-none focus:border-primary transition-all font-body-md" 
                       placeholder="nombre@ejemplo.com" 
                       type="email" 
                       value={regEmail}
                       onChange={(e) => setRegEmail(e.target.value)}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider block font-bold">
                       Contraseña
                     </label>
                     <input 
                       className="w-full px-4 py-3 bg-surface-subtle border border-surface-container rounded focus:outline-none focus:border-primary transition-all font-body-md" 
                       placeholder="••••••••" 
                       type="password" 
                       value={regPassword}
                       onChange={(e) => setRegPassword(e.target.value)}
                       required
                     />
                   </div>
                   <button 
                     type="submit"
                     className="w-full py-4 bg-primary text-white font-headline-sm rounded hover:bg-crimson-dark transition-all flex justify-center items-center gap-2 cursor-pointer font-bold shadow-sm"
                   >
                     Crear Cuenta Premium
                     <span className="material-symbols-outlined text-white">person_add</span>
                   </button>
                 </form>
              )}

            </div>
          </div>

        </div>
      </main>

      <footer className="bg-surface-canvas border-t border-surface-container mt-auto">
        <div className="w-full py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <p className="font-body-sm text-body-sm text-secondary">© 2026 CrimsonBank Financial Services. Member FDIC. Equal Housing Lender.</p>
          <div className="flex gap-6">
            <a className="font-body-sm text-body-sm text-secondary hover:text-primary transition-opacity duration-200" href="#">Política de Privacidad</a>
            <a className="font-body-sm text-body-sm text-secondary hover:text-primary transition-opacity duration-200" href="#">Términos de Servicio</a>
            <a className="font-body-sm text-body-sm text-secondary hover:text-primary transition-opacity duration-200" href="#">Centro de Seguridad</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
