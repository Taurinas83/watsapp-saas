'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Send,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bot,
  User,
  ChevronRight,
  ArrowLeft,
  Mail,
  ExternalLink
} from 'lucide-react';
import { FaqItem, FAQ_DATA, FAQ_CATEGORIES } from '@/lib/faq-data';

interface SupportChatModalProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  time: string;
  type?: 'intro' | 'text' | 'categories' | 'question_list' | 'faq_detail' | 'human_info';
  categoryKey?: string;
  categoryLabel?: string;
  faqItem?: FaqItem;
  suggestedQuestions?: FaqItem[];
}

export function SupportChatModal({ onClose }: SupportChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Inicialização do Chat com Saudação e Categorias
  const resetChat = () => {
    const welcomeId = Date.now().toString();
    setMessages([
      {
        id: `${welcomeId}-1`,
        sender: 'bot',
        text: 'Olá! 👋 Seja muito bem-vindo à Central de Ajuda da Zapella.',
        time: getCurrentTime(),
        type: 'text',
      },
      {
        id: `${welcomeId}-2`,
        sender: 'bot',
        text: 'Aqui você tira suas dúvidas instantaneamente! Escolha uma categoria abaixo ou digite o que procura:',
        time: getCurrentTime(),
        type: 'categories',
      },
    ]);
  };

  useEffect(() => {
    resetChat();
  }, []);

  // Simular pequeno tempo de digitação (250ms) para sensação autêntica e fluida
  const botReplyWithDelay = (newMessage: ChatMessage) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, newMessage]);
    }, 280);
  };

  // 1. Usuário seleciona uma Categoria
  const handleSelectCategory = (catId: string, catLabel: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: catLabel,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const matchingFaqs = FAQ_DATA.filter((item) => item.category === catId);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: `Aqui estão as principais dúvidas sobre ${catLabel}:`,
      time: getCurrentTime(),
      type: 'question_list',
      categoryKey: catId,
      categoryLabel: catLabel,
      suggestedQuestions: matchingFaqs,
    };

    botReplyWithDelay(botMsg);
  };

  // 2. Usuário seleciona uma Pergunta Específica
  const handleSelectQuestion = (faq: FaqItem) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: faq.question,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      time: getCurrentTime(),
      type: 'faq_detail',
      faqItem: faq,
    };

    botReplyWithDelay(botMsg);
  };

  // 3. Usuário clica em Informações de Suporte Humano
  const handleHumanSupportClick = () => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: '👨‍💻 Falar com Suporte Humano',
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      time: getCurrentTime(),
      type: 'human_info',
    };

    botReplyWithDelay(botMsg);
  };

  // 4. Voltar ao Menu Principal de Categorias
  const handleBackToCategories = () => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: '🏠 Ver outros temas',
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: 'Escolha uma categoria para explorar:',
      time: getCurrentTime(),
      type: 'categories',
    };

    botReplyWithDelay(botMsg);
  };

  // 5. Envio de Mensagem Livre no Input
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    const term = query.toLowerCase();

    // Busca nas perguntas, respostas, passos e dicas
    const matches = FAQ_DATA.filter((item) => {
      return (
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term) ||
        (item.steps && item.steps.some((s) => s.toLowerCase().includes(term))) ||
        (item.tip && item.tip.toLowerCase().includes(term))
      );
    });

    if (matches.length === 1) {
      // 1 resposta exata encontrada
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        time: getCurrentTime(),
        type: 'faq_detail',
        faqItem: matches[0],
      };
      botReplyWithDelay(botMsg);
    } else if (matches.length > 1) {
      // Múltiplas respostas encontradas
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Encontrei ${matches.length} tópicos relacionados à sua pesquisa. Escolha uma das opções:`,
        time: getCurrentTime(),
        type: 'question_list',
        suggestedQuestions: matches.slice(0, 5),
      };
      botReplyWithDelay(botMsg);
    } else {
      // Nenhuma resposta direta encontrada
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Não encontrei uma resposta exata para "${query}". Tente buscar por palavras-chave como "QR Code", "CRM", "agendamento" ou escolha um dos temas abaixo:`,
        time: getCurrentTime(),
        type: 'categories',
      };
      botReplyWithDelay(botMsg);
    }
  };

  // Lista de categorias filtradas (excluindo 'all')
  const categoriesList = FAQ_CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-[650px] max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E0E3E1]">
        {/* ── WhatsApp Style Header ── */}
        <div
          className="px-4 py-3.5 flex items-center justify-between text-white shrink-0 shadow-md"
          style={{ background: 'linear-gradient(135deg, #111B21 0%, #171901 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}
              >
                <Image src="/zapella-icon.png" alt="Zapella Suporte" width={28} height={28} className="object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00E676] rounded-full ring-2 ring-[#111B21]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight">Suporte Zapella</h3>
                <span className="bg-[#00E676]/20 text-[#00E676] text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                  Oficial
                </span>
              </div>
              <p className="text-[11px] text-green-300 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                Respostas instantâneas • 24/7
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={resetChat}
              title="Reiniciar Atendimento"
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Fechar"
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── WhatsApp Chat Background & Messages Container ── */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3.5 relative"
          style={{
            backgroundColor: '#ECE5DD',
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Date pill */}
          <div className="flex justify-center mb-2">
            <span className="bg-white/80 backdrop-blur-xs text-[#4D4D61] text-[10px] font-bold px-3 py-1 rounded-full shadow-xs border border-black/5">
              Hoje • Central de Dúvidas Direcionadas
            </span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}>
                {/* Regular Text Bubble */}
                {msg.text && (
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs leading-relaxed relative ${
                      isUser
                        ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs'
                        : 'bg-white text-[#111B21] rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[9px] text-[#4D4D61]/70 text-right mt-1 font-medium">
                      {msg.time}
                    </span>
                  </div>
                )}

                {/* Categories Options */}
                {msg.type === 'categories' && (
                  <div className="w-full space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold text-[#4D4D61] uppercase tracking-wider px-1">
                      Selecione um tópico para ver as respostas:
                    </p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {categoriesList.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id, cat.label)}
                          className="w-full text-left bg-white hover:bg-emerald-50/80 border border-black/5 hover:border-emerald-200 rounded-xl p-2.5 text-xs text-[#111B21] font-semibold transition-all shadow-xs flex items-center justify-between group active:scale-98"
                        >
                          <div>
                            <span className="font-bold text-[#171901]">{cat.label}</span>
                            {cat.description && (
                              <p className="text-[10px] text-[#4D4D61] font-normal mt-0.5">{cat.description}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#4D4D61] group-hover:text-[#2E7D5A] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}

                      {/* Botão de Suporte Humano */}
                      <button
                        onClick={handleHumanSupportClick}
                        className="w-full text-left bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-300 rounded-xl p-2.5 text-xs text-[#128C7E] font-bold transition-all shadow-xs flex items-center justify-between group active:scale-98"
                      >
                        <div className="flex items-center gap-2">
                          <span>👨‍💻</span>
                          <span>Falar com Atendimento Humano</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#128C7E] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Questions List of a Category */}
                {msg.type === 'question_list' && msg.suggestedQuestions && (
                  <div className="w-full space-y-1.5 pt-1">
                    <div className="grid grid-cols-1 gap-1.5">
                      {msg.suggestedQuestions.map((faq) => (
                        <button
                          key={faq.id}
                          onClick={() => handleSelectQuestion(faq)}
                          className="w-full text-left bg-white hover:bg-emerald-50 border border-black/5 hover:border-emerald-200 rounded-xl p-2.5 text-xs text-[#111B21] font-medium transition-all shadow-xs flex items-center justify-between group active:scale-98"
                        >
                          <span className="font-semibold text-[#171901] pr-2">{faq.question}</span>
                          <ChevronRight className="w-4 h-4 text-[#4D4D61] group-hover:text-[#2E7D5A] shrink-0" />
                        </button>
                      ))}

                      <button
                        onClick={handleBackToCategories}
                        className="w-full text-center py-2 text-xs font-bold text-[#2E7D5A] hover:underline flex items-center justify-center gap-1.5 mt-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Voltar a todos os temas</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* FAQ Detail Answer Card */}
                {msg.type === 'faq_detail' && msg.faqItem && (
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 text-xs text-[#111B21] space-y-3 w-[95%]">
                    {/* Header with Category Badge */}
                    <div className="flex items-center justify-between border-b border-[#E0E3E1] pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D5A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {msg.faqItem.categoryLabel}
                      </span>
                      <span className="text-[9px] text-[#4D4D61]">{msg.time}</span>
                    </div>

                    {/* Question Title */}
                    <h4 className="text-sm font-extrabold text-[#171901] leading-snug">
                      {msg.faqItem.question}
                    </h4>

                    {/* Direct Answer */}
                    <p className="text-[#4D4D61] leading-relaxed">
                      {msg.faqItem.answer}
                    </p>

                    {/* Steps if available */}
                    {msg.faqItem.steps && msg.faqItem.steps.length > 0 && (
                      <div className="space-y-1.5 bg-[#F4F5F4] p-3 rounded-xl border border-[#E0E3E1]">
                        <p className="font-bold text-[11px] text-[#171901]">Passo a passo recomendado:</p>
                        <ol className="space-y-1">
                          {msg.faqItem.steps.map((st, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-[#4D4D61]">
                              <span className="w-4 h-4 rounded-full bg-white border border-[#E0E3E1] font-bold text-[#2E7D5A] flex items-center justify-center text-[9px] shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{st}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Tip if available */}
                    {msg.faqItem.tip && (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                        <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-950">Dica Zapella: </span>
                          <span>{msg.faqItem.tip}</span>
                        </div>
                      </div>
                    )}

                    {/* Follow-up navigation buttons */}
                    <div className="pt-2 border-t border-[#E0E3E1] flex flex-col gap-1.5">
                      <button
                        onClick={handleBackToCategories}
                        className="w-full text-center py-2 px-3 rounded-xl bg-[#F4F5F4] hover:bg-[#E0E3E1] text-[11px] font-bold text-[#171901] transition-colors"
                      >
                        ← Ver outros temas
                      </button>

                      <Link
                        href="/login"
                        onClick={onClose}
                        className="w-full text-center py-2 px-3 rounded-xl text-[11px] font-extrabold text-[#171901] shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-1.5"
                        style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
                      >
                        <span>Testar Grátis por 7 dias</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Human Support Info Card */}
                {msg.type === 'human_info' && (
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 text-xs text-[#111B21] space-y-3 w-[95%]">
                    <div className="flex items-center gap-2 text-[#128C7E] font-bold">
                      <Mail className="w-4 h-4" />
                      <span>Atendimento & Suporte ao Cliente</span>
                    </div>

                    <p className="text-[#4D4D61] leading-relaxed">
                      Nosso time de suporte técnico atende todos os clientes diretamente através do painel de controle e por e-mail corporativo:
                    </p>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[#128C7E] font-semibold text-center">
                      <p className="text-[10px] text-[#4D4D61] uppercase tracking-wider font-bold">Canal Oficial de Suporte</p>
                      <p className="text-sm font-extrabold text-[#171901] mt-0.5 select-all">suporte@zapella.com</p>
                    </div>

                    <p className="text-[11px] text-[#4D4D61] leading-normal">
                      Se você ainda não tem uma conta, você pode iniciar o teste gratuito de 7 dias e conectar seu próprio WhatsApp em menos de 1 minuto para testar na prática!
                    </p>

                    <div className="pt-2 flex flex-col gap-1.5">
                      <button
                        onClick={handleBackToCategories}
                        className="w-full text-center py-2 rounded-xl bg-[#F4F5F4] hover:bg-[#E0E3E1] text-[11px] font-bold text-[#171901] transition-colors"
                      >
                        ← Voltar para as dúvidas frequentes
                      </button>

                      <Link
                        href="/login"
                        onClick={onClose}
                        className="w-full text-center py-2 px-3 rounded-xl text-[11px] font-extrabold text-[#171901] shadow-xs flex items-center justify-center gap-1.5"
                        style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
                      >
                        <span>Criar Conta & Testar 7 Dias</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white text-[#4D4D61] px-3.5 py-2 rounded-2xl rounded-tl-xs shadow-xs w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[10px] text-[#4D4D61] font-medium ml-1">Digitando resposta...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Chat Input Footer ── */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-[#E0E3E1] flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua dúvida (ex: QR Code, CRM, planos)..."
            className="flex-1 bg-[#F4F5F4] border border-[#E0E3E1] focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] rounded-xl px-3.5 py-2.5 text-xs text-[#171901] placeholder-[#4D4D61]/60 outline-none transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[#171901] font-bold shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 shrink-0"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
            title="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
