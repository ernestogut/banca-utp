import React, { useState, useMemo } from 'react';
import { downloadTransactionHistory } from '../utils/downloadHelper';

interface Transaction {
  id: string;
  date: string;
  description: string;
  subText: string;
  category: string;
  status: 'Completado' | 'Pendiente';
  amount: number; // positive for income, negative for expense
  icon: string;
}

interface HistoryProps {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  onUpdateProfile: (name: string, email: string, phone: string) => void;
  searchQuery: string;
  transactions: Transaction[];
}

export const History: React.FC<HistoryProps> = ({ user, onUpdateProfile, searchQuery, transactions }) => {
  // Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);

  // Filters State
  const [dateRange, setDateRange] = useState('Todos');
  const [movementType, setMovementType] = useState<'Todos' | 'Gastos' | 'Ingresos'>('Todos');
  const [minAmount, setMinAmount] = useState<string>('');
  const [appliedMinAmount, setAppliedMinAmount] = useState<number | null>(null);


  const handleApplyFilters = () => {
    setAppliedMinAmount(minAmount ? parseFloat(minAmount) : null);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Search Bar Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesDesc = t.description.toLowerCase().includes(query);
        const matchesCat = t.category.toLowerCase().includes(query);
        const matchesId = t.id.toLowerCase().includes(query);
        if (!matchesDesc && !matchesCat && !matchesId) return false;
      }

      // 2. Movement Type Filter
      if (movementType === 'Gastos' && t.amount > 0) return false;
      if (movementType === 'Ingresos' && t.amount < 0) return false;

      // 3. Min Amount Filter
      if (appliedMinAmount !== null) {
        if (Math.abs(t.amount) < appliedMinAmount) return false;
      }

      // 4. Date Range Filter
      if (dateRange === 'Este mes' && !t.date.includes('Oct')) return false;
      if (dateRange === 'Mes anterior' && t.date.includes('Oct')) return false; // Simple placeholder logic

      return true;
    });
  }, [transactions, searchQuery, movementType, appliedMinAmount, dateRange]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileName, profileEmail, profilePhone);
    setProfileModalOpen(false);
  };

  return (
    <div className="pt-8 pb-16 px-6 md:px-12 w-full max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 fade-in-up">
        <div>
          <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface">Historial de Transacciones</h1>
          <p className="font-body-md text-body-md text-secondary mt-1">Consulta y filtra tus movimientos financieros con precisión.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-outline rounded-lg text-primary hover:bg-surface-container-low transition-all cursor-pointer font-bold"
            onClick={() => downloadTransactionHistory(filteredTransactions)}
          >
            <span className="material-symbols-outlined text-primary">download</span>
            <span className="font-label-md text-label-md">Descargar Historial</span>
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-outline rounded-lg text-primary hover:bg-surface-container-low transition-all cursor-pointer font-bold"
            onClick={() => {
              setProfileName(user.name);
              setProfileEmail(user.email);
              setProfilePhone(user.phone);
              setProfileModalOpen(true);
            }}
          >
            <span className="material-symbols-outlined text-primary">edit</span>
            <span className="font-label-md text-label-md">Actualizar Perfil</span>
          </button>
        </div>
      </section>

      {/* Filters Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-surface-subtle rounded-xl border border-surface-container fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md text-secondary font-bold">Rango de Fecha</label>
          <select 
            className="bg-white border border-outline-variant rounded-lg p-2 font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="Todos">Todos los registros</option>
            <option value="Últimos 30 días">Últimos 30 días</option>
            <option value="Este mes">Este mes</option>
            <option value="Mes anterior">Mes anterior</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md text-secondary font-bold">Tipo de Movimiento</label>
          <div className="flex gap-2 h-10">
            <button 
              className={`flex-1 rounded-lg font-label-md text-xs font-bold cursor-pointer transition-all ${
                movementType === 'Todos' ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-secondary hover:border-primary'
              }`}
              onClick={() => setMovementType('Todos')}
            >
              Todos
            </button>
            <button 
              className={`flex-1 rounded-lg font-label-md text-xs font-bold cursor-pointer transition-all ${
                movementType === 'Gastos' ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-secondary hover:border-primary'
              }`}
              onClick={() => setMovementType('Gastos')}
            >
              Gastos
            </button>
            <button 
              className={`flex-1 rounded-lg font-label-md text-xs font-bold cursor-pointer transition-all ${
                movementType === 'Ingresos' ? 'bg-primary text-white' : 'bg-white border border-outline-variant text-secondary hover:border-primary'
              }`}
              onClick={() => setMovementType('Ingresos')}
            >
              Ingresos
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-label-md text-secondary font-bold">Monto Mínimo</label>
          <input 
            className="bg-white border border-outline-variant rounded-lg p-2 font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
            placeholder="S/ 0.00" 
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 justify-end">
          <button 
            className="w-full py-2 bg-secondary text-white rounded-lg hover:bg-on-surface transition-colors font-bold cursor-pointer h-10"
            onClick={handleApplyFilters}
          >
            Aplicar Filtros
          </button>
        </div>
      </section>

      {/* Detailed Transaction Table */}
      <div className="bg-white rounded-xl border border-surface-container overflow-hidden shadow-sm fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-surface-subtle border-b border-surface-container">
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider font-bold">Fecha</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider font-bold">Descripción</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider font-bold">Categoría</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider font-bold">Estado</th>
                <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-wider font-bold text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4 font-data-tabular text-data-tabular text-on-surface whitespace-nowrap">
                      {t.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                          <span className="material-symbols-outlined text-primary">{t.icon}</span>
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-semibold text-on-surface">{t.description}</p>
                          <p className="font-body-sm text-body-sm text-secondary">{t.subText} • ID: {t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-surface-subtle text-secondary rounded text-[10px] font-bold uppercase select-none">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 font-label-md text-label-md ${t.status === 'Completado' ? 'text-success' : 'text-secondary'}`}>
                        <span className={`w-2 h-2 rounded-full ${t.status === 'Completado' ? 'bg-success' : 'bg-secondary'}`}></span>
                        <span>{t.status}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right font-data-tabular text-data-tabular font-bold whitespace-nowrap ${t.amount > 0 ? 'text-success' : 'text-on-surface'}`}>
                      {t.amount > 0 ? '+' : ''}S/ {t.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-secondary font-body-md">
                    No se encontraron transacciones con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination controls */}
        <div className="px-6 py-4 bg-surface-subtle flex items-center justify-between border-t border-surface-container">
          <p className="font-body-sm text-body-sm text-secondary">
            Mostrando 1-{filteredTransactions.length} de {filteredTransactions.length} transacciones
          </p>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant rounded-lg bg-white disabled:opacity-50 cursor-pointer" disabled>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="p-2 border border-outline-variant rounded-lg bg-white disabled:opacity-50 cursor-pointer" disabled>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Support CTA Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="p-8 bg-primary rounded-xl text-on-primary flex flex-col justify-between h-full relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <h3 className="font-headline-md text-headline-md text-white font-bold mb-2">¿Necesitas ayuda con un movimiento?</h3>
            <p className="font-body-md text-body-md text-white/90 mb-6 max-w-sm">
              Inicia un reclamo o solicita información detallada sobre cualquier transacción de forma instantánea.
            </p>
            <button className="px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
              Ver Preguntas Frecuentes
            </button>
          </div>
          <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[120px] text-white/10 rotate-12 pointer-events-none">
            receipt_long
          </span>
        </div>
        
        <div className="relative rounded-xl overflow-hidden min-h-[220px] shadow-sm">
          <img 
            alt="Soporte al cliente profesional" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg0wRFIdeHrdo8Zl8qyLyiI7C21watoFI5lnWtVfeZeVVcMe1THK_-vcvZ1f7k0h2UDAJGTaumQit_SZW1PuG_FsUrK-MkHdlp3f4Dy00ByY0MSIGBd7y15pmL4W9jwhOKDGICk3KhZsv8YwQZp1ysVJt0FNC7jGqrKhVcBUuc6Am0OfJ2BByLc8WTHRYucB6xraC48zSvt0-YCPMZqG_IPmXTjCO1tTxJGBH02AhV1-KLvw0LH_Ynp0DgGMiYgC7hVDravXEjeOA"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-on-surface/70 to-transparent flex items-center p-8">
            <div className="max-w-xs text-white">
              <h3 className="font-headline-md text-headline-md text-white font-bold mb-2">Soporte Prioritario</h3>
              <p className="font-body-sm text-body-sm text-white/80">
                Atención 24/7 para usuarios de Cuenta Premium con tiempos de espera menores a 1 minuto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Update Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-surface-container flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Actualizar Perfil</h3>
              <button 
                className="material-symbols-outlined text-secondary hover:text-on-surface cursor-pointer"
                onClick={() => setProfileModalOpen(false)}
              >
                close
              </button>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-secondary font-bold">Nombre Completo</label>
                <input 
                  className="w-full bg-surface-subtle border border-outline-variant rounded-lg p-2 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-secondary font-bold">Correo Electrónico</label>
                <input 
                  className="w-full bg-surface-subtle border border-outline-variant rounded-lg p-2 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  type="email" 
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-secondary font-bold">Teléfono</label>
                <input 
                  className="w-full bg-surface-subtle border border-outline-variant rounded-lg p-2 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  type="tel" 
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  required
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  className="flex-1 py-2 border border-outline rounded-lg text-secondary font-bold hover:bg-surface-subtle transition-all cursor-pointer"
                  onClick={() => setProfileModalOpen(false)}
                  type="button"
                >
                  Cancelar
                </button>
                <button 
                  className="flex-1 py-2 bg-primary text-white rounded-lg font-bold hover:bg-crimson-dark transition-all cursor-pointer"
                  type="submit"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
