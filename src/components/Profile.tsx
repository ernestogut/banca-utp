import React, { useState } from 'react';

interface ProfileProps {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  onUpdateProfile: (name: string, email: string, phone: string) => void;
  onCancel: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile, onCancel }) => {
  // Local Form States
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  
  // Security
  const [currentPassword, setCurrentPassword] = useState('••••••••••••');
  const [newPassword, setNewPassword] = useState('');

  // Status message
  const [showStatus, setShowStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      onUpdateProfile(name, email, phone);
      setIsSaving(false);
      setShowStatus(true);
      
      setTimeout(() => {
        setShowStatus(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="pt-8 pb-12 px-6 md:px-12 w-full max-w-7xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="mb-12 border-l-4 border-primary pl-6 fade-in-up">
        <h2 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface mb-2">Mi Perfil</h2>
        <p className="font-body-lg text-body-lg text-secondary">
          Configuración de cuenta personal y seguridad avanzada para {user.name.split(' ')[0]}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Profile Card & Avatar Column */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-surface-container p-8 text-center rounded-xl shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary-container p-1 bg-white">
                <img 
                  alt="Ernesto Profile" 
                  className="w-full h-full object-cover rounded-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1-ZK1_Vy5wgGy5WlmjvW8TSPoVeE8WFlTxsvTlJXhihZS5tczRvrPPQXdTQUzYZx3a4yflFQm7lY0CM44qQUyunSckM9TgFNVVnYd838zdWcaZxZfTNXRDDqM8px60k4DENirclUJOzZAf9TtQ7G9u3-rCgk0Hg0m2_P-rKkE6sCr_XtRH4mW5RcK0j9E2VbJjvxMPtFdwoJDxpAByIMcGiDZVV65Kbs3mSmzQ7_JSTQSEgXl4JfuSILZhgVE8Qd6OMmAoQo73Bc"
                />
              </div>
              <button 
                type="button"
                className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-crimson-dark transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
                onClick={() => alert('Función para actualizar foto de perfil disponible próximamente.')}
              >
                <span className="material-symbols-outlined text-[18px] text-white">photo_camera</span>
              </button>
            </div>
            
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">{user.name}</h3>
            <p className="font-label-md text-xs text-primary uppercase font-bold tracking-widest mt-1">Premium Member • 2026</p>
            
            <div className="mt-8 pt-8 border-t border-surface-container grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">Estado</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-xs font-bold text-on-surface">Verificado</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">País</p>
                <p className="text-xs font-bold text-on-surface mt-1">Perú (S/)</p>
              </div>
            </div>
          </div>
          
          {/* Security Banner info */}
          <div className="bg-surface-subtle p-6 rounded-xl border-l-4 border-success border border-surface-container shadow-sm">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-success">verified_user</span>
              <div>
                <h4 className="font-label-md text-xs font-bold text-on-surface uppercase mb-2">Protección de Datos</h4>
                <p className="text-xs text-secondary leading-relaxed font-semibold">
                  Tus datos están protegidos bajo estándares internacionales de seguridad bancaria. CrimsonBank nunca te pedirá tu clave por correo o teléfono.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Edit Form Column */}
        <section className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Info Box */}
            <div className="bg-white border border-surface-container rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-surface-container bg-surface-subtle flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">person</span>
                <h3 className="font-headline-sm text-md font-bold text-on-surface">Información Personal</h3>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Nombre Completo</label>
                  <input 
                    className="w-full h-12 px-4 bg-white border border-surface-container rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Teléfono</label>
                  <input 
                    className="w-full h-12 px-4 bg-white border border-surface-container rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Correo Electrónico</label>
                  <input 
                    className="w-full h-12 px-4 bg-white border border-surface-container rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Passwords Box */}
            <div className="bg-white border border-surface-container rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-surface-container bg-surface-subtle flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">lock</span>
                <h3 className="font-headline-sm text-md font-bold text-on-surface">Seguridad</h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Contraseña Actual</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-surface-container rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold"
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Nueva Contraseña</label>
                    <input 
                      className="w-full h-12 px-4 bg-white border border-surface-container rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Mínimo 12 caracteres" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-surface-subtle border border-surface-container rounded-lg">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  <p className="text-xs text-secondary font-semibold">
                    La última actualización de contraseña fue hace 45 días. Recomendamos cambiarla periódicamente.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar & Success Notifications */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 select-none">
              <p 
                className={`font-body-sm text-xs text-success flex items-center gap-2 transition-opacity duration-300 font-bold ${
                  showStatus ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Información guardada exitosamente
              </p>
              
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  type="button"
                  className="flex-1 sm:flex-none h-12 px-8 border border-primary text-primary font-label-md text-xs font-bold uppercase tracking-wider hover:bg-surface-subtle rounded-lg transition-colors active:scale-95 cursor-pointer text-center"
                  onClick={onCancel}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 sm:flex-none h-12 px-8 bg-primary text-white font-label-md text-xs font-bold uppercase tracking-wider hover:bg-crimson-dark rounded-lg transition-colors shadow-sm active:scale-95 cursor-pointer text-center"
                >
                  {isSaving ? 'Guardando...' : 'Confirmar Cambios'}
                </button>
              </div>
            </div>

          </form>
        </section>

      </div>
    </div>
  );
};
