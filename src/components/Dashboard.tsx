import React, { useState, useEffect } from 'react';

interface DashboardProps {
  userName: string;
  checkingBalance: number;
  savingsBalance: number;
  onNavigateToTransfers: () => void;
  onNavigateToWithdraw: () => void;
  onNavigateToDeposit: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userName, 
  checkingBalance,
  savingsBalance,
  onNavigateToTransfers,
  onNavigateToWithdraw,
  onNavigateToDeposit,
}) => {
  const [animateChart, setAnimateChart] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  const balance = checkingBalance + savingsBalance;

  // Extract first name for welcome
  const firstName = userName.split(' ')[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Buenos días';
    } else if (hour >= 12 && hour < 19) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  };

  useEffect(() => {
    // Trigger chart bars entry animation
    setTimeout(() => {
      setAnimateChart(true);
    }, 200);
  }, []);

  const weeklyData = [
    { day: 'Lun', height: 40, amount: 'S/ 240' },
    { day: 'Mar', height: 65, amount: 'S/ 390' },
    { day: 'Mie', height: 55, amount: 'S/ 330' },
    { day: 'Jue', height: 85, amount: 'S/ 510' },
    { day: 'Vie', height: 95, amount: 'S/ 570' },
    { day: 'Sab', height: 30, amount: 'S/ 180' },
    { day: 'Dom', height: 15, amount: 'S/ 90' },
  ];

  return (
    <div className="pt-8 pb-12 px-6 md:px-12 w-full max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <header className="fade-in-up">
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-primary">
          {getGreeting()}, {firstName}.
        </h1>
        <p className="font-body-lg text-body-lg text-secondary mt-2">
          Aquí tienes el resumen consolidado de tus finanzas al 24 de Mayo de 2026.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Consolidado Balance (Hero Card) */}
        <div className="col-span-12 md:col-span-8 bg-white border border-surface-container rounded-xl p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 border-l-primary">
          <div className="relative z-10">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-bold">
              Saldo Consolidado Total
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl md:text-5xl font-bold font-display-lg text-on-surface">
                S/ {balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
              <span className="font-body-md text-body-md text-success flex items-center font-bold">
                <span className="material-symbols-outlined text-sm text-success">arrow_upward</span> 2.4%
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 relative z-10">
            <button 
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-crimson-dark transition-all transform active:scale-95 duration-100 flex items-center gap-2 shadow-sm cursor-pointer font-bold"
              onClick={onNavigateToTransfers}
            >
              <span className="material-symbols-outlined text-white">payments</span> Transferir
            </button>
            <button 
              className="px-6 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-primary-container/5 transition-all transform active:scale-95 duration-100 flex items-center gap-2 cursor-pointer font-bold"
              onClick={onNavigateToWithdraw}
            >
              <span className="material-symbols-outlined">account_balance_wallet</span> Retirar
            </button>
            <button 
              className="px-6 py-3 bg-surface-subtle text-secondary font-bold rounded-lg hover:bg-surface-container transition-all transform active:scale-95 duration-100 flex items-center gap-2 cursor-pointer font-bold"
              onClick={onNavigateToDeposit}
            >
              <span className="material-symbols-outlined">add_card</span> Depositar
            </button>
          </div>

          {/* Abstract geometric background decoration */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute right-10 bottom-10 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[150px] text-primary">account_balance</span>
          </div>
        </div>

        {/* Active Cards */}
        <div className="col-span-12 md:col-span-4 bg-white border border-surface-container rounded-xl p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Tarjetas Activas</h3>
            <a className="text-primary font-label-md text-label-md hover:underline font-bold" href="#">Ver todas</a>
          </div>
          
          <div className="group cursor-pointer">
            <div className="w-full h-40 rounded-xl bg-gradient-to-br from-primary to-crimson-dark p-6 text-white relative shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-3xl text-white">contactless</span>
                <span className="font-label-md text-label-md text-white font-bold">Visa Infinite</span>
              </div>
              <div className="mt-6">
                <p className="font-data-tabular text-data-tabular tracking-[0.2em] text-white text-lg">•••• •••• •••• 8842</p>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-[10px] opacity-70 uppercase leading-none">Vence</p>
                  <p className="font-label-md text-label-md text-white font-bold mt-1">12/26</p>
                </div>
                <div className="w-10 h-6 bg-white/20 rounded flex items-center justify-center font-bold text-[8px]">VISA</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-12 gap-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Savings & Current Accounts */}
        <div className="col-span-12 md:col-span-5 bg-white border border-surface-container rounded-xl p-8 hover:shadow-lg transition-all duration-200">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">Mis Cuentas</h3>
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 border border-surface-container rounded-lg hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-tertiary">savings</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md font-bold">Cuenta de Ahorros</p>
                  <p className="font-label-md text-label-md text-secondary mt-0.5">No. ****5523</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body-md text-body-md font-bold text-on-surface">S/ {savingsBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                <p className="font-label-md text-label-md text-success font-bold mt-0.5">+ S/ 1,200 mes</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-surface-container rounded-lg hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md font-bold">Cuenta Corriente</p>
                  <p className="font-label-md text-label-md text-secondary mt-0.5">No. ****9910</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body-md text-body-md font-bold text-on-surface">S/ {checkingBalance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                <p className="font-label-md text-label-md text-error font-bold mt-0.5">- S/ 450 mes</p>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-surface-container">
            <p className="font-label-md text-label-md text-secondary mb-4 font-bold uppercase tracking-wider">
              Metas de ahorro
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-label-md text-label-md mb-2 font-semibold">
                  <span>Fondo de Emergencia</span>
                  <span className="text-primary font-bold">75%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Graph */}
        <div className="col-span-12 md:col-span-7 bg-white border border-surface-container rounded-xl p-8 hover:shadow-lg transition-all duration-200">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Actividad Reciente</h3>
              <p className="font-label-md text-label-md text-secondary">Flujo de caja semanal</p>
            </div>
            <div className="flex gap-2 bg-surface-subtle p-1 rounded-lg">
              <button className="px-3 py-1 bg-white rounded shadow-sm font-label-md text-label-md text-on-surface font-bold text-xs cursor-pointer">
                Ingresos
              </button>
              <button className="px-3 py-1 text-secondary font-label-md text-label-md text-xs cursor-pointer hover:text-primary transition-colors">
                Egresos
              </button>
            </div>
          </div>

          {/* Chart Columns */}
          <div className="h-64 flex items-end justify-between gap-3 px-2 relative border-b border-surface-container pb-2">
            {weeklyData.map((item, index) => (
              <div 
                key={item.day}
                className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end cursor-pointer"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {hoveredBar === index && (
                  <div className="absolute top-0 transform -translate-y-full bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10 animate-fade-in whitespace-nowrap">
                    {item.amount}
                  </div>
                )}
                
                {/* Bar */}
                <div 
                  className={`w-full bg-primary rounded-t transition-all duration-700 ease-out ${
                    hoveredBar === index ? 'opacity-80 scale-x-105' : hoveredBar !== null ? 'opacity-40' : ''
                  }`} 
                  style={{ 
                    height: animateChart ? `${item.height}%` : '0%', 
                    backgroundColor: hoveredBar === index ? '#A8153B' : `rgba(168, 0, 53, ${item.height / 100})` 
                  }}
                ></div>
                <span className="font-label-md text-label-md text-secondary font-bold select-none">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-8 text-secondary font-label-md text-label-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Gastos mayores</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/20"></div>
              <span>Promedio diario</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
