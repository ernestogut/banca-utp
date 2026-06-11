import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface SecurityProps {
  userName: string;
}

export const Security: React.FC<SecurityProps> = ({ userName }) => {
  const firstName = userName.split(' ')[0];

  // Sliders State
  const [transferLimit, setTransferLimit] = useState(15000);
  const [atmLimit, setAtmLimit] = useState(3000);
  const [onlineLimit, setOnlineLimit] = useState(8500);

  // Night Mode State
  const [nightModeActive, setNightModeActive] = useState(true);

  // Location Protection
  const [locationActive, setLocationActive] = useState(true);

  // Bitácora de seguridad
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Cargar límites
    api.get('/api/security/settings')
      .then((settings) => {
        setTransferLimit(settings.transferLimit);
        setAtmLimit(settings.atmLimit);
        setOnlineLimit(settings.onlineLimit);
        setNightModeActive(settings.nightModeActive);
        setLocationActive(settings.locationActive);
      })
      .catch(console.error);

    // Cargar bitácora
    api.get('/api/security/logs')
      .then(setLogs)
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/api/security/settings', {
        transferLimit,
        atmLimit,
        onlineLimit,
        nightModeActive,
        locationActive,
      });
      alert(res.message || '¡Cambios guardados con éxito!');
      // Recargar bitácora
      const updatedLogs = await api.get('/api/security/logs');
      setLogs(updatedLogs);
    } catch (error: any) {
      alert(error.message || 'Error al guardar cambios.');
    }
  };

  const handleReset = () => {
    setTransferLimit(15000);
    setAtmLimit(3000);
    setOnlineLimit(8500);
    setNightModeActive(true);
  };

  return (
    <div className="pt-8 pb-12 px-6 md:px-12 w-full max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex text-xs text-secondary gap-2 items-center font-bold tracking-wider select-none">
        <span className="cursor-pointer hover:text-primary transition-colors">Inicio</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="cursor-pointer hover:text-primary transition-colors">Mi Perfil</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary">Límites y Seguridad</span>
      </nav>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 fade-in-up">
        <div>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-2">
            Configuración y Límites de Seguridad
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Hola, <span className="font-bold text-on-surface">{firstName}</span>. Gestiona tus parámetros transaccionales para máxima tranquilidad.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-surface-container shadow-sm shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-secondary leading-none mb-1">Estado de Seguridad</p>
            <p className="font-body-md text-body-md font-bold text-success">Seguridad Alta • 2FA Activo</p>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Left Section: Daily Limits Form */}
        <section className="lg:col-span-8 bg-white p-8 border border-surface-container rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">tune</span>
                <h2 className="font-headline-sm text-lg font-bold text-on-surface">Límites Diarios de Operaciones</h2>
              </div>
              <span className="text-xs font-bold text-secondary bg-surface-subtle px-3 py-1 rounded-full uppercase tracking-wider">
                Soles (S/)
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              {/* Transfer limit slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-body-md font-bold text-on-surface">Transferencias Interbancarias</p>
                    <p className="text-xs text-secondary">Monto máximo acumulado por 24h.</p>
                  </div>
                  <span className="text-lg font-bold text-primary font-display-lg">
                    S/ {transferLimit.toLocaleString('es-PE')}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-surface-subtle rounded-full">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100" 
                    style={{ width: `${(transferLimit / 20000) * 100}%` }}
                  ></div>
                  <input 
                    className="absolute -top-1.5 left-0 w-full h-5 opacity-0 cursor-pointer" 
                    max="20000" 
                    min="0" 
                    step="500"
                    type="range" 
                    value={transferLimit}
                    onChange={(e) => setTransferLimit(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex justify-between text-xs text-secondary font-semibold">
                  <span>S/ 0</span>
                  <span>Límite máximo: S/ 20,000</span>
                </div>
              </div>

              {/* ATM Limit slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-body-md font-bold text-on-surface">Retiro por Cajeros (ATM)</p>
                    <p className="text-xs text-secondary">Tope de retiro de efectivo presencial.</p>
                  </div>
                  <span className="text-lg font-bold text-primary font-display-lg">
                    S/ {atmLimit.toLocaleString('es-PE')}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-surface-subtle rounded-full">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100" 
                    style={{ width: `${(atmLimit / 5000) * 100}%` }}
                  ></div>
                  <input 
                    className="absolute -top-1.5 left-0 w-full h-5 opacity-0 cursor-pointer" 
                    max="5000" 
                    min="0" 
                    step="100"
                    type="range" 
                    value={atmLimit}
                    onChange={(e) => setAtmLimit(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex justify-between text-xs text-secondary font-semibold">
                  <span>S/ 0</span>
                  <span>Límite máximo: S/ 5,000</span>
                </div>
              </div>

              {/* Online Limit slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-body-md font-bold text-on-surface">Pagos en Línea y Apps</p>
                    <p className="text-xs text-secondary">Consumos en comercios electrónicos.</p>
                  </div>
                  <span className="text-lg font-bold text-primary font-display-lg">
                    S/ {onlineLimit.toLocaleString('es-PE')}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-surface-subtle rounded-full">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100" 
                    style={{ width: `${(onlineLimit / 15000) * 100}%` }}
                  ></div>
                  <input 
                    className="absolute -top-1.5 left-0 w-full h-5 opacity-0 cursor-pointer" 
                    max="15000" 
                    min="0" 
                    step="500"
                    type="range" 
                    value={onlineLimit}
                    onChange={(e) => setOnlineLimit(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex justify-between text-xs text-secondary font-semibold">
                  <span>S/ 0</span>
                  <span>Límite máximo: S/ 15,000</span>
                </div>
              </div>

              {/* Form submit buttons */}
              <div className="pt-8 flex gap-4">
                <button 
                  type="submit"
                  className="bg-primary text-white px-8 py-3 rounded-lg font-label-md text-label-md font-bold hover:bg-crimson-dark transition-all shadow shadow-primary/10 cursor-pointer transform active:scale-95 duration-100"
                >
                  Guardar Cambios
                </button>
                <button 
                  type="button"
                  className="border border-outline-variant text-secondary px-8 py-3 rounded-lg font-label-md text-label-md font-bold hover:bg-surface-subtle transition-all cursor-pointer transform active:scale-95 duration-100"
                  onClick={handleReset}
                >
                  Restaurar Valores
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Right Section: Support Widgets */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Modo Nocturno */}
          <div className="bg-white p-6 border border-surface-container rounded-xl shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">Modo Nocturno</h2>
            </div>
            
            <p className="text-xs text-secondary">
              Restringe operaciones de alto riesgo durante la noche para evitar fraudes en caso de extravío.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-subtle rounded-xl border border-surface-container">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">nights_stay</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Activo: 11:00 PM - 06:00 AM</p>
                    <p className="text-[9px] text-secondary font-bold uppercase">Seguridad Reforzada</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={nightModeActive} 
                    className="sr-only peer"
                    onChange={(e) => setNightModeActive(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-container after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex flex-col gap-2 p-4 border border-outline-variant rounded-xl bg-white">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider">Acciones permitidas en este horario:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                    <span className="material-symbols-outlined text-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                    Consultas de saldo
                  </li>
                  <li className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                    <span className="material-symbols-outlined text-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                    Bloqueo de tarjetas
                  </li>
                  <li className="flex items-center gap-2 text-xs font-semibold text-secondary opacity-60 line-through">
                    <span className="material-symbols-outlined text-error text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span> 
                    Transferencias &gt; S/ 500
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Check de Seguridad Widget */}
          <div className="bg-primary text-white p-6 rounded-xl relative overflow-hidden shadow">
            <div className="relative z-10 space-y-4">
              <h3 className="font-headline-sm text-lg font-bold">Check de Seguridad</h3>
              <p className="text-xs opacity-90 leading-relaxed">
                Tu cuenta cumple con el 95% de los estándares Premium de CrimsonBank.
              </p>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Optimización</span>
                  <span>Excelente (95%)</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              
              <button 
                className="w-full bg-white text-primary py-2.5 rounded-lg font-label-md text-xs font-bold hover:bg-surface-subtle transition-all cursor-pointer transform active:scale-95 duration-100"
                onClick={() => alert('Escaneando protocolos de seguridad de CrimsonBank... Todo se encuentra en orden.')}
              >
                Revisar Protocolos
              </button>
            </div>
            
            {/* Background design */}
            <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-10">
              <span className="material-symbols-outlined text-[120px] text-white">shield</span>
            </div>
          </div>

          {/* Location Protection Card */}
          <div className="bg-white p-6 border border-surface-container rounded-xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-label-md text-xs font-bold text-secondary uppercase tracking-wider">Protección Geográfica</h3>
              <span className="material-symbols-outlined text-primary">location_on</span>
            </div>
            
            <p className="text-xs text-secondary leading-relaxed">
              Autoriza transacciones solo desde ubicaciones frecuentes y tu celular verificado.
            </p>
            
            <div className="flex items-center justify-between p-3 bg-surface-subtle border border-surface-container rounded-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                <span className="material-symbols-outlined text-success" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
                Lima, Perú (Actual)
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={locationActive} 
                  className="sr-only peer"
                  onChange={(e) => setLocationActive(e.target.checked)}
                />
                <div className="w-9 h-5 bg-surface-container rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-container after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

        </div>

      </div>

      {/* Security Logs Section */}
      <section className="bg-white p-8 border border-surface-container rounded-xl shadow-sm fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-sm text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            Registro de Seguridad Reciente
          </h2>
          <button 
            className="text-primary font-label-md text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
            onClick={() => alert('Redirigiendo a bitácora completa de accesos y tokens...')}
          >
            Ver registro completo 
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-surface-container">
                <th className="pb-4 font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Fecha / Hora</th>
                <th className="pb-4 font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Evento</th>
                <th className="pb-4 font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Dispositivo / IP</th>
                <th className="pb-4 font-label-md text-xs text-secondary uppercase font-bold tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-subtle transition-colors">
                  <td className="py-4 text-xs font-semibold font-data-tabular">{log.timestamp}</td>
                  <td className="py-4 text-xs font-bold">{log.event}</td>
                  <td className="py-4 text-xs text-secondary">{log.device} • {log.ip}</td>
                  <td className="py-4">
                    <span className={`border text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      log.status === 'Exitoso'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer Meta info */}
      <footer className="mt-12 text-center pb-8 border-t border-surface-container pt-8">
        <p className="text-xs text-secondary font-medium">
          © 2026 CrimsonBank S.A. Entidad supervisada por la Superintendencia de Banca, Seguros y AFP.
        </p>
        <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-secondary uppercase tracking-wider">
          <a className="hover:text-primary transition-colors cursor-pointer">Privacidad</a>
          <a className="hover:text-primary transition-colors cursor-pointer">Términos</a>
          <a className="hover:text-primary transition-colors cursor-pointer">Libro de Reclamaciones</a>
        </div>
      </footer>
    </div>
  );
};
