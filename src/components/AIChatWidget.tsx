import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AIChatWidgetProps {
  userName: string;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `¡Hola, ${userName}! Soy tu asistente inteligente Crimson AI. ¿Tienes alguna duda sobre tus transacciones recientes o necesitas ayuda con tu perfil?`,
      timestamp: '10:48 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Ahora',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      const res = await api.post('/api/chat', { text: textToSend });
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.text,
        timestamp: res.timestamp || formatTime(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      const errResponse: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Lo siento, en este momento no puedo conectar con la central de Crimson AI.',
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, errResponse]);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end" id="ai-chat">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="w-80 md:w-96 h-[500px] mb-4 glass-card rounded-2xl shadow-2xl border border-surface-container flex flex-col overflow-hidden transition-all duration-300 animate-in slide-in-from-bottom-5"
          id="chat-window"
        >
          {/* Header */}
          <div className="bg-primary p-4 text-on-primary flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm text-white">smart_toy</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-white font-bold leading-none">Asistente Crimson AI</p>
                <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold mt-1">En línea</p>
              </div>
            </div>
            <button 
              className="material-symbols-outlined text-white hover:bg-white/10 p-1 rounded-full cursor-pointer transition-colors"
              onClick={toggleChat}
            >
              close
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-surface-bright flex flex-col">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`p-3 max-w-[80%] text-body-sm font-body-sm rounded-bl-xl rounded-br-xl ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tl-xl' 
                      : 'bg-surface-container-high text-on-surface rounded-tr-xl'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-secondary mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-surface-container">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
              className="flex gap-2"
            >
              <input 
                className="flex-1 bg-surface-subtle border border-surface-container rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                id="chat-input" 
                placeholder="Escribe tu duda aquí..." 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-primary text-white p-2 rounded-lg hover:bg-crimson-dark transition-all flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-white">send</span>
              </button>
            </form>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
              <button 
                type="button"
                className="whitespace-nowrap px-3 py-1 bg-surface-subtle text-[11px] font-bold text-secondary rounded-full hover:bg-surface-container transition-all cursor-pointer"
                onClick={() => handleSendMessage('Reportar fraude en mi cuenta')}
              >
                Reportar fraude
              </button>
              <button 
                type="button"
                className="whitespace-nowrap px-3 py-1 bg-surface-subtle text-[11px] font-bold text-secondary rounded-full hover:bg-surface-container transition-all cursor-pointer"
                onClick={() => handleSendMessage('¿Cuáles son mis límites de cuenta?')}
              >
                Límites de cuenta
              </button>
              <button 
                type="button"
                className="whitespace-nowrap px-3 py-1 bg-surface-subtle text-[11px] font-bold text-secondary rounded-full hover:bg-surface-container transition-all cursor-pointer"
                onClick={() => handleSendMessage('¿Cómo activar la biometría?')}
              >
                Activar biometría
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button 
        className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center cursor-pointer z-50 focus:outline-none"
        onClick={toggleChat}
      >
        <span className="material-symbols-outlined text-2xl text-white">
          {isOpen ? 'expand_more' : 'chat'}
        </span>
      </button>
    </div>
  );
};
