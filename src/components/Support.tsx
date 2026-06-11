import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface SupportProps {
  userName: string;
}

export const Support: React.FC<SupportProps> = ({ userName }) => {
  const firstName = userName.split(' ')[0];
  
  // Expandable FAQ State
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: '¿Cómo bloqueo mi tarjeta?',
      answer: 'Accede a Seguridad > Bloqueo de Tarjetas en el panel de control o llámanos inmediatamente a nuestra Línea Premium 24/7 al 0-800-456-7890. El bloqueo es instantáneo.',
    },
    {
      question: '¿Cuánto tiempo toman las transferencias?',
      answer: 'Las transferencias inmediatas entre cuentas CrimsonBank y hacia otros bancos afiliados toman hasta 15 minutos en acreditarse. Las transferencias diferidas pueden tardar hasta 24 horas hábiles.',
    },
    {
      question: '¿Cómo actualizo mis datos personales?',
      answer: 'Puedes actualizar tu número telefónico y correo electrónico directamente desde la sección "Mi Perfil" en esta plataforma. Los cambios requieren confirmación con tu Token Digital por seguridad.',
    },
    {
      question: '¿Qué es la protección geográfica?',
      answer: 'Es una medida de seguridad que previene transacciones sospechosas bloqueándolas si se realizan desde una ubicación distinta a la de tu teléfono verificado o fuera de Lima/Perú.',
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="pt-8 pb-12 px-6 md:px-12 w-full max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <header className="mb-12 fade-in-up">
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-on-surface mb-2">
          Centro de Ayuda y Soporte
        </h1>
        <p className="font-body-lg text-body-lg text-secondary">
          Hola, {firstName}. ¿Cómo podemos ayudarte hoy?
        </p>
      </header>

      {/* Main Support Action: WhatsApp & Contacts Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* WhatsApp Hero Bento Card */}
        <div className="lg:col-span-8 bg-white border border-surface-container p-8 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[320px] group transition-all hover:shadow-lg">
          {/* Subtle Background decoration */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#25D366] flex items-center justify-center rounded-full shadow-sm text-white shrink-0">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <span className="font-headline-sm text-lg font-bold text-on-surface">Atención Directa por WhatsApp</span>
            </div>
            <p className="font-body-lg text-body-lg text-secondary max-w-lg mb-8">
              Conversa en tiempo real con uno de nuestros asesores expertos. Estamos listos para resolver tus dudas sobre transferencias, cuentas y seguridad.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a 
              className="w-full sm:w-auto bg-primary text-white px-8 py-4 font-bold rounded-lg hover:bg-crimson-dark transition-all text-center flex items-center justify-center gap-2 group/btn cursor-pointer" 
              href="https://wa.me/51999999999" 
              target="_blank" 
              rel="noreferrer"
            >
              Contactar a Soporte
              <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform text-white">arrow_forward</span>
            </a>
            <span className="text-xs font-bold text-secondary-fixed-dim hidden sm:block">Respuesta en menos de 5 min.</span>
          </div>
        </div>
        
        {/* Right Bento Grid Items */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Linea Premium Card */}
          <div className="flex-1 bg-surface-subtle p-6 border border-surface-container rounded-xl flex flex-col justify-between hover:bg-surface-container-high transition-colors">
            <div className="flex items-start justify-between">
              <span className="material-symbols-outlined text-primary text-4xl">phone_in_talk</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                24/7 Premium
              </span>
            </div>
            <div className="mt-8">
              <h3 className="font-headline-sm text-sm font-bold text-secondary mb-1">Línea Premium 24/7</h3>
              <p className="font-data-tabular text-xl text-on-surface font-bold">0-800-456-7890</p>
            </div>
          </div>
          
          {/* Institutional Email Card */}
          <div className="flex-1 bg-surface-subtle p-6 border border-surface-container rounded-xl flex flex-col justify-between hover:bg-surface-container-high transition-colors">
            <div className="flex items-start justify-between">
              <span className="material-symbols-outlined text-primary text-4xl">mail</span>
            </div>
            <div className="mt-8">
              <h3 className="font-headline-sm text-sm font-bold text-secondary mb-1">Correo Institucional</h3>
              <p className="font-body-md text-sm text-on-surface font-bold truncate">atencion@crimsonbank.com.pe</p>
              <a className="text-primary font-label-md text-xs font-bold mt-2 inline-block hover:underline cursor-pointer" href="mailto:atencion@crimsonbank.com.pe">
                Redactar ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-white p-8 border border-surface-container rounded-xl shadow-sm mb-12 fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-8 border-b border-surface-container pb-4">
          <h2 className="font-headline-md text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">live_help</span>
            Preguntas Frecuentes
          </h2>
          <a className="text-primary font-label-md text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer" onClick={() => alert('Mostrando catálogo completo de preguntas frecuentes...')}>
            Ver todas las FAQ
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-surface-container rounded-lg p-5 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex justify-between items-center w-full text-left">
                <h4 className={`font-headline-sm text-sm font-semibold transition-colors ${expandedIndex === index ? 'text-primary' : 'text-on-surface'}`}>
                  {faq.question}
                </h4>
                <span className="material-symbols-outlined text-secondary transition-transform duration-200" style={{ transform: expandedIndex === index ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </div>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  expandedIndex === index ? 'max-h-32 mt-3 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-xs text-secondary font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Systems Status Section */}
      <section className="bg-white border border-surface-container p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-4">
          <div className="w-3.5 h-3.5 bg-success rounded-full animate-pulse"></div>
          <div>
            <p className="font-headline-sm text-sm font-bold text-on-surface">Estado de los Sistemas</p>
            <p className="font-body-sm text-xs text-secondary font-medium">Todos los servicios operativos (Actualizado: Hoy, 2026)</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-surface-subtle px-4 py-2 rounded-lg border border-surface-container shadow-sm">
            <span className="material-symbols-outlined text-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span className="font-label-md text-xs font-bold text-on-surface">App Móvil</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-subtle px-4 py-2 rounded-lg border border-surface-container shadow-sm">
            <span className="material-symbols-outlined text-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <span className="font-label-md text-xs font-bold text-on-surface">Web Banking</span>
          </div>
        </div>
      </section>
    </div>
  );
};
