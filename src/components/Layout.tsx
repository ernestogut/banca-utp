import React, { useState } from 'react';
import type { ViewType } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  onLogout: () => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onNavigate,
  user,
  onLogout,
  globalSearchQuery,
  setGlobalSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Panel de Control', icon: 'dashboard', view: 'dashboard' as const },
    { id: 'accounts', label: 'Cuentas', icon: 'account_balance', view: 'accounts' as const },
    { id: 'transfers', label: 'Transferencias', icon: 'swap_horiz', view: 'transfers' as const },
    { id: 'history', label: 'Historial', icon: 'history', view: 'history' as const },
    { id: 'security', label: 'Seguridad', icon: 'security', view: 'security' as const },
    { id: 'support', label: 'Soporte', icon: 'contact_support', view: 'support' as const },
  ];

  const handleLinkClick = (view: ViewType) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-surface-canvas text-on-surface min-h-screen flex flex-col font-body-md">
      {/* TopNavBar */}
      <header className="bg-surface-canvas border-b border-surface-container fixed top-0 left-0 right-0 h-16 z-40">
        <div className="flex justify-between items-center px-6 md:px-12 w-full h-full max-w-7xl mx-auto">
          
          <div className="flex items-center gap-8">
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden material-symbols-outlined text-secondary hover:text-primary p-1 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? 'close' : 'menu'}
            </button>
            <span 
              className="font-headline-md text-headline-md font-bold text-primary cursor-pointer flex items-center gap-2"
              onClick={() => handleLinkClick('dashboard')}
            >
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
              CrimsonBank
            </span>
            <nav className="hidden md:flex space-x-6">
              <button 
                className={`font-body-md text-body-md py-1 border-b-2 transition-all cursor-pointer font-medium ${
                  currentView === 'accounts' ? 'text-primary border-primary' : 'text-secondary border-transparent hover:text-primary'
                }`}
                onClick={() => handleLinkClick('accounts')}
              >
                Cuentas
              </button>
              <button 
                className={`font-body-md text-body-md py-1 border-b-2 transition-all cursor-pointer font-medium ${
                  currentView === 'transfers' ? 'text-primary border-primary' : 'text-secondary border-transparent hover:text-primary'
                }`}
                onClick={() => handleLinkClick('transfers')}
              >
                Transferencias
              </button>
              <button 
                className={`font-body-md text-body-md py-1 border-b-2 transition-all cursor-pointer font-medium ${
                  currentView === 'support' ? 'text-primary border-primary' : 'text-secondary border-transparent hover:text-primary'
                }`}
                onClick={() => handleLinkClick('support')}
              >
                Soporte
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                search
              </span>
              <input 
                className="pl-10 pr-4 py-1.5 bg-surface-subtle border-none rounded-lg text-body-sm w-64 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none" 
                placeholder="Buscar transacción..." 
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
              />
            </div>
            <button className="material-symbols-outlined text-secondary hover:text-primary p-2 cursor-pointer transition-colors">
              notifications
            </button>
            <button 
              className="material-symbols-outlined text-secondary hover:text-primary p-2 cursor-pointer transition-colors"
              onClick={onLogout}
              title="Cerrar sesión"
            >
              logout
            </button>
            <button 
              className="w-8 h-8 rounded-full overflow-hidden border border-surface-container hover:ring-2 hover:ring-primary transition-all cursor-pointer"
              onClick={() => handleLinkClick('profile')}
              title="Mi Perfil"
            >
              <img 
                alt="Foto de perfil del usuario" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1-ZK1_Vy5wgGy5WlmjvW8TSPoVeE8WFlTxsvTlJXhihZS5tczRvrPPQXdTQUzYZx3a4yflFQm7lY0CM44qQUyunSckM9TgFNVVnYd838zdWcaZxZfTNXRDDqM8px60k4DENirclUJOzZAf9TtQ7G9u3-rCgk0Hg0m2_P-rKkE6sCr_XtRH4mW5RcK0j9E2VbJjvxMPtFdwoJDxpAByIMcGiDZVV65Kbs3mSmzQ7_JSTQSEgXl4JfuSILZhgVE8Qd6OMmAoQo73Bc"
              />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto relative pt-16">
        
        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <aside 
              className="w-64 bg-surface-subtle h-full p-6 space-y-4 flex flex-col border-r border-surface-container animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                <div>
                  <p className="font-headline-sm text-headline-sm font-bold text-primary">{user.name}</p>
                  <p className="font-label-md text-label-md text-secondary">Acceso: Hoy 10:45 AM</p>
                </div>
                <button 
                  className="material-symbols-outlined text-secondary hover:text-primary p-1 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  close
                </button>
              </div>
              <nav className="flex-grow space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-label-md text-label-md font-bold cursor-pointer ${
                      currentView === item.id 
                        ? 'bg-primary-container text-on-primary-container' 
                        : 'text-secondary hover:bg-surface-container'
                    }`}
                    onClick={() => handleLinkClick(item.view)}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <button 
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-crimson-dark transition-colors shadow shadow-primary/20 cursor-pointer"
                onClick={() => handleLinkClick('transfers')}
              >
                Nueva Operación
              </button>
            </aside>
          </div>
        )}

        {/* Desktop SideNavBar */}
        <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 pt-8 px-4 space-y-2 w-64 bg-surface-subtle border-r border-surface-container">
          <div className="px-4 mb-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleLinkClick('profile')} title="Ver Perfil">
            <p className="font-headline-sm text-headline-sm font-bold text-primary truncate text-left" title={user.name}>{user.name}</p>
            <p className="font-label-md text-label-md text-secondary text-left">Último acceso: Hoy 10:45 AM, 2026</p>
          </div>
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left font-label-md text-label-md font-bold cursor-pointer ${
                  currentView === item.view 
                    ? 'bg-primary-container text-on-primary-container' 
                    : 'text-secondary hover:bg-surface-container'
                }`}
                onClick={() => handleLinkClick(item.view)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="pt-8 mb-8">
            <button 
              className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-crimson-dark transition-all transform active:scale-95 duration-100 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => handleLinkClick('transfers')}
            >
              <span className="material-symbols-outlined text-white">add</span>
              Nueva Operación
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow min-h-[calc(100vh-4rem)] bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
