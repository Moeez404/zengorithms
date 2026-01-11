
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X } from 'lucide-react';
import { ChatMessage } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface AITutorProps {
  algorithmName: string;
}

const AITutor: React.FC<AITutorProps> = ({ algorithmName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm your algorithm tutor. Ask me anything about ${algorithmName}!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset conversation when algorithm changes
    setMessages([{ role: 'model', text: `Hi! I'm your algorithm tutor. Ask me anything about ${algorithmName}!` }]);
  }, [algorithmName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const updatedMessages = [...messages, userMsg];
    const responseText = await getGeminiResponse(updatedMessages, algorithmName);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white border border-indigo-100 rounded-full shadow-lg flex items-center justify-center text-indigo-500 hover:bg-indigo-50 hover:scale-105 transition-all z-50 group"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-xl border border-indigo-100 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Header */}
      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-800 font-semibold">
          <Sparkles size={18} />
          <span>AI Tutor</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-500 text-white rounded-br-none' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the algorithm..."
          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <button 
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AITutor;
