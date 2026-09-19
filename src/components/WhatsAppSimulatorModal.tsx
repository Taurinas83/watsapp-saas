'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { initialAttendant, initialKnowledgeItems } from '@/lib/mock-data';
import { generateBotResponse } from '@/lib/ai-engine';
import { Message } from '@/types';

interface WhatsAppSimulatorModalProps {
  onClose: () => void;
}

export function WhatsAppSimulatorModal({ onClose }: WhatsAppSimulatorModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'sim-1',
      conversation_id: 'sim-conv',
      organization_id: 'a0000000-0000-0000-0000-000000000001',
      sender_type: 'bot',
      sender_name: `${initialAttendant.name} (IA)`,
      content: `Olá! Sou ${initialAttendant.name}, atendente virtual. Como posso te ajudar hoje? 😊`,
      created_at: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [handoverTriggered, setHandoverTriggered] = useState<{ triggered: boolean; reason?: string }>({ triggered: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');

    const userMsg: Message = {
      id: `sim-user-${Date.now()}`,
      conversation_id: 'sim-conv',
      organization_id: 'a0000000-0000-0000-0000-000000000001',
      sender_type: 'customer',
      sender_name: 'Você (Cliente)',
      content: userText,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simular pequeno delay de resposta humanizada
    setTimeout(async () => {
      const response = await generateBotResponse(
        userText,
        initialAttendant,
        initialKnowledgeItems,
        [...messages, userMsg]
      );

      const botMsg: Message = {
        id: `sim-bot-${Date.now()}`,
        conversation_id: 'sim-conv',
        organization_id: 'a0000000-0000-0000-0000-000000000001',
        sender_type: 'bot',
        sender_name: `${initialAttendant.name} (IA)`,
        content: response.content,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      if (response.shouldHandover) {
        setHandoverTriggered({ triggered: true, reason: response.handoverReason });
      }
    }, 900);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `sim-reset-${Date.now()}`,
        conversation_id: 'sim-conv',
        organization_id: 'a0000000-0000-0000-0000-000000000001',
        sender_type: 'bot',
        sender_name: `${initialAttendant.name} (IA)`,
        content: `Olá! Sou ${initialAttendant.name}, atendente virtual. Como posso te ajudar hoje? 😊`,
        created_at: new Date().toISOString()
      }
    ]);
    setHandoverTriggered({ triggered: false });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-md h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-200">

        {/* WhatsApp Header Mock */}
        <div className="bg-emerald-700 px-4 py-3 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{initialAttendant.name} (Atendente Virtual)</h3>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                WhatsApp Online • Resposta Automática
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              title="Reiniciar Simulação"
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Handover Alert Notification Banner */}
        {handoverTriggered.triggered && (
          <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Gatilho de Handover Acionado!</strong> ({handoverTriggered.reason}) Status alterado para <em>Aguardando Humano</em>.
              </span>
            </div>
          </div>
        )}

        {/* WhatsApp Chat Background & Messages */}
        <div className="flex-1 bg-[#0b141a] p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((msg) => {
            const isBot = msg.sender_type === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow ${
                    isBot
                      ? 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-700/50'
                      : 'bg-[#005c4b] text-white rounded-tr-none'
                  }`}
                >
                  <p className="text-[10px] font-medium mb-1 opacity-70 flex items-center gap-1">
                    {isBot ? <Bot className="w-3 h-3 text-emerald-400" /> : <User className="w-3 h-3 text-emerald-300" />}
                    <span>{msg.sender_name}</span>
                  </p>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className="text-[9px] text-right mt-1 opacity-50">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-emerald-400 rounded-2xl rounded-tl-none px-4 py-2 text-xs flex items-center gap-1.5 shadow">
                <span className="animate-bounce font-bold">.</span>
                <span className="animate-bounce delay-100 font-bold">.</span>
                <span className="animate-bounce delay-200 font-bold">.</span>
                <span className="text-[10px] text-slate-400 ml-1">Sofia digitando</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Input Footer */}
        <form onSubmit={handleSend} className="bg-[#202c33] p-3 flex items-center gap-2 border-t border-slate-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite como um cliente no WhatsApp..."
            className="flex-1 bg-[#2a3942] text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center justify-center transition-all shadow shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
