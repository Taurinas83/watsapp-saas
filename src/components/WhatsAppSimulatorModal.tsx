'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, RefreshCw, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import Image from 'next/image';

interface WhatsAppSimulatorModalProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isHandover?: boolean;
}

// Fluxos pré-configurados com respostas humanizadas e contextualizadas (Zero consumo de créditos)
const SIMULATION_FLOWS: Record<string, { reply: string; nextSuggestions: string[]; isHandover?: boolean }> = {
  'Como funciona a Zapella?': {
    reply: 'A Zapella é uma secretária virtual com inteligência artificial para o seu WhatsApp! Ela responde seus clientes instantaneamente 24 horas por dia, tira dúvidas sobre seus produtos, preços e horários com base nos dados da sua empresa e transfere para você quando necessário.',
    nextSuggestions: [
      'Quais são os planos e preços?',
      'Como funciona a conexão com WhatsApp?',
      'Como ela aprende os dados da empresa?'
    ]
  },
  'Quais são os planos e preços?': {
    reply: 'Temos planos a partir de R$ 149/mês no plano Iniciante (até 1.000 mensagens) e R$ 299/mês no plano Pro (mensagens ilimitadas e suporte prioritário). Todos incluem 7 dias de teste grátis sem compromisso!',
    nextSuggestions: [
      'Como funciona o teste de 7 dias?',
      'Tem taxa de instalação ou fidelidade?',
      'Quero começar o teste grátis agora'
    ]
  },
  'Como funciona a conexão com WhatsApp?': {
    reply: 'É super simples! Você só precisa escanear um QR Code na tela do sistema usando o WhatsApp do seu celular, igualzinho ao WhatsApp Web. Em menos de 30 segundos a IA já está ativa e pronta para atender.',
    nextSuggestions: [
      'O celular precisa ficar ligado?',
      'Posso usar meu número atual?',
      'Quais são os planos e preços?'
    ]
  },
  'Quero falar com um atendente humano': {
    reply: 'Perfeito! Acabei de pausar as respostas automáticas e notifiquei nossa equipe de atendimento. Um especialista humano já está assumindo esta conversa no painel. 👋',
    isHandover: true,
    nextSuggestions: [
      'Reiniciar demonstração',
      'Como funciona a Zapella?',
      'Quero começar o teste grátis agora'
    ]
  },
  'Como funciona o teste de 7 dias?': {
    reply: 'Você cria sua conta em 1 minuto, conecta seu WhatsApp e usa todas as funcionalidades da Zapella por 7 dias inteiros gratuitamente. Se não gostar, pode cancelar a qualquer momento sem pagar nada.',
    nextSuggestions: [
      'Quero começar o teste grátis agora',
      'Como funciona a conexão com WhatsApp?',
      'Tem taxa de instalação ou fidelidade?'
    ]
  },
  'Tem taxa de instalação ou fidelidade?': {
    reply: 'Não cobramos nenhuma taxa de adesão ou instalação! E você não tem fidelidade nenhuma: pode pausar ou cancelar sua assinatura quando quiser com apenas um clique.',
    nextSuggestions: [
      'Quero começar o teste grátis agora',
      'Quais são os planos e preços?',
      'Como funciona a Zapella?'
    ]
  },
  'O celular precisa ficar ligado?': {
    reply: 'Não precisa! A Zapella roda 100% na nuvem. Mesmo se o seu celular desligar, descarregar a bateria ou ficar sem internet, a secretária continuará atendendo seus clientes no WhatsApp 24 horas por dia.',
    nextSuggestions: [
      'Posso usar meu número atual?',
      'Como funciona o teste de 7 dias?',
      'Quero começar o teste grátis agora'
    ]
  },
  'Posso usar meu número atual?': {
    reply: 'Sim! Você pode conectar tanto um número de WhatsApp comercial existente quanto um novo número. O histórico e seus contatos permanecem intactos.',
    nextSuggestions: [
      'Quero começar o teste grátis agora',
      'Como ela aprende os dados da empresa?',
      'Quais são os planos e preços?'
    ]
  },
  'Como ela aprende os dados da empresa?': {
    reply: 'Você tem uma aba de Base de Conhecimento onde pode cadastrar suas perguntas frequentes, tabela de serviços, valores e horários. A IA consulta essa base em milissegundos e só responde informações verdadeiras sobre o seu negócio.',
    nextSuggestions: [
      'Quais são os planos e preços?',
      'Como funciona a conexão com WhatsApp?',
      'Quero falar com um atendente humano'
    ]
  },
  'Quero começar o teste grátis agora': {
    reply: 'Excelente escolha! Basta clicar no botão verde "Testar Grátis — 7 dias" no topo da página ou criar sua conta em nosso painel. Estamos prontos para acelerar seu atendimento! 🚀',
    nextSuggestions: [
      'Como funciona a Zapella?',
      'Reiniciar demonstração'
    ]
  }
};

const INITIAL_SUGGESTIONS = [
  'Como funciona a Zapella?',
  'Quais são os planos e preços?',
  'Como funciona a conexão com WhatsApp?',
  'Quero falar com um atendente humano'
];

export function WhatsAppSimulatorModal({ onClose }: WhatsAppSimulatorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Olá! Sou a Zapella, sua secretária virtual. Como posso te ajudar hoje? 😊',
      time: 'Agora'
    }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [isTyping, setIsTyping] = useState(false);
  const [handoverActive, setHandoverActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelectSuggestion = (text: string) => {
    if (isTyping) return;

    if (text === 'Reiniciar demonstração') {
      handleReset();
      return;
    }

    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Adiciona mensagem do usuário
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: currentTime
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simula tempo de digitação natural (650ms)
    setTimeout(() => {
      const flow = SIMULATION_FLOWS[text] || {
        reply: 'Entendido! Essa é uma das principais perguntas dos nossos clientes. A Zapella foi projetada para oferecer respostas ágeis e humanizadas diretamente no WhatsApp da sua empresa.',
        nextSuggestions: INITIAL_SUGGESTIONS
      };

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: flow.reply,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isHandover: flow.isHandover
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      if (flow.isHandover) {
        setHandoverActive(true);
      }

      setSuggestions(flow.nextSuggestions);
    }, 700);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        text: 'Olá! Sou a Zapella, sua secretária virtual. Como posso te ajudar hoje? 😊',
        time: 'Agora'
      }
    ]);
    setSuggestions(INITIAL_SUGGESTIONS);
    setHandoverActive(false);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#EFEAE2] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col h-[600px] border border-slate-300">

        {/* WhatsApp Header */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center shrink-0 border border-white/30">
              <Image
                src="/zapella-icon.png"
                alt="Zapella"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border border-[#075E54]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm leading-tight">Zapella • Secretária IA</p>
                <span className="text-[9px] bg-[#25D366]/30 text-emerald-200 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                  Bot
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 leading-tight">
                {isTyping ? 'digitando...' : 'online • 24/7'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              title="Reiniciar conversa"
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Handover Notice Banner */}
        {handoverActive && (
          <div className="bg-amber-100 text-amber-900 px-4 py-2 text-xs flex items-center gap-2 border-b border-amber-200">
            <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Transferência Humana Ativa:</strong> A IA pausou e a conversa foi entregue à equipe.
            </span>
          </div>
        )}

        {/* Messages Body */}
        <div
          className="flex-1 p-4 overflow-y-auto space-y-3"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}
        >
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-sm relative ${
                    isBot
                      ? 'bg-white text-[#111B21] rounded-tl-sm border border-slate-200/50'
                      : 'bg-[#D9FDD3] text-[#111B21] rounded-tr-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start">
              <div className="bg-white px-3.5 py-2.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200/50 text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Interactive) */}
        <div className="bg-white border-t border-slate-200 p-3 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Clique em uma pergunta para simular:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSelectSuggestion(suggestion)}
                disabled={isTyping}
                className="text-xs px-3 py-1.5 rounded-full bg-[#F0F2F5] hover:bg-[#D9FDD3] text-[#111B21] font-medium border border-slate-200 hover:border-[#25D366] transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <span>{suggestion}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-[#F0F2F5] px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Gostou da velocidade?</span>
          <a
            href="/login"
            className="font-bold text-[#128C7E] hover:underline flex items-center gap-1"
          >
            <span>Criar conta gratuita</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
