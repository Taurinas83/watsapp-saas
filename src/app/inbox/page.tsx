'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { initialConversations, initialMessages, initialAttendant, initialKnowledgeItems } from '@/lib/mock-data';
import { DEFAULT_ORG_ID } from '@/lib/constants';
import { Conversation, Message, ConversationStatus } from '@/types';
import { generateBotResponse } from '@/lib/ai-engine';
import { fetchConversations, fetchMessages, insertMessage, updateConversationStatus, getCurrentUserOrganizationId } from '@/lib/supabase/actions';
import {
  MessageSquare,
  Search,
  Filter,
  Bot,
  UserCheck,
  User,
  Send,
  Sparkles,
  Tag,
  FileText,
  Clock,
  ArrowLeft,
  CheckCheck,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Building2,
  Check
} from 'lucide-react';

export default function UnifiedInboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>(initialConversations[0]?.id || '');
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [orgId, setOrgId] = useState<string>(DEFAULT_ORG_ID);

  // Carregar conversas reais do Supabase DB com Polling em tempo real
  useEffect(() => {
    async function loadConvs() {
      const currentOrgId = await getCurrentUserOrganizationId();
      setOrgId(currentOrgId);
      const dbConvs = await fetchConversations(currentOrgId);
      if (dbConvs && dbConvs.length > 0) {
        setConversations(dbConvs);
        setActiveConvId(prev => prev || dbConvs[0].id);
      }
    }
    loadConvs();

    const interval = setInterval(async () => {
      const currentOrgId = await getCurrentUserOrganizationId();
      const dbConvs = await fetchConversations(currentOrgId);
      if (dbConvs && dbConvs.length > 0) {
        setConversations(dbConvs);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Carregar mensagens da conversa ativa com Polling a cada 3 segundos
  useEffect(() => {
    if (!activeConvId) return;
    async function loadMsgs() {
      const dbMsgs = await fetchMessages(activeConvId);
      if (dbMsgs && dbMsgs.length > 0) {
        setAllMessages(prev => ({
          ...prev,
          [activeConvId]: dbMsgs
        }));
      }
    }
    loadMsgs();

    const interval = setInterval(loadMsgs, 3000);
    return () => clearInterval(interval);
  }, [activeConvId]);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Input & AI Suggestion States
  const [messageInput, setMessageInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(
    'Olá! Como posso ajudar você e sua empresa hoje?'
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Internal Notes & Tags State
  const [newTagInput, setNewTagInput] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState(
    conversations.find(c => c.id === activeConvId)?.internal_notes || ''
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0] || {
    id: '',
    organization_id: '',
    customer_name: 'Nenhuma conversa',
    customer_phone: '',
    status: 'bot_active',
    last_message: '',
    last_message_at: new Date().toISOString(),
    tags: [],
    unread_count: 0
  };
  const activeMessages = activeConv.id ? (allMessages[activeConv.id] || []) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, aiSuggestion]);

  useEffect(() => {
    setInternalNoteInput(activeConv.internal_notes || '');
  }, [activeConvId]);

  // Handover Action Toggle
  const handleToggleHandover = async () => {
    const nextStatus: ConversationStatus =
      activeConv.status === 'bot_active' ? 'human_active' : 'bot_active';

    await updateConversationStatus(activeConvId, nextStatus);

    setConversations(conversations.map(c => {
      if (c.id === activeConvId) {
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Send Operator Message
  const handleSendOperatorMessage = async (textToSend?: string) => {
    const text = textToSend || messageInput.trim();
    if (!text) return;

    // Persistir mensagem no Supabase
    const savedMsg = await insertMessage(
      activeConvId,
      orgId,
      'operator',
      'Atendente Humano',
      text
    );

    const newMsg: Message = savedMsg || {
      id: `msg-op-${Date.now()}`,
      conversation_id: activeConvId,
      organization_id: orgId,
      sender_type: 'operator',
      sender_name: 'Atendente Humano',
      content: text,
      created_at: new Date().toISOString()
    };

    setAllMessages(prev => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg]
    }));

    // Tentar enviar para o WhatsApp do cliente via Evolution API se a conversa tiver número
    if (activeConv.customer_phone) {
      fetch('/api/whatsapp/instance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendText',
          number: activeConv.customer_phone,
          text: text
        })
      }).catch(() => null);
    }

    // Se o humano respondeu, mudar status para human_active
    await updateConversationStatus(activeConvId, 'human_active');

    setConversations(conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          status: 'human_active',
          last_message: text,
          last_message_at: new Date().toISOString()
        };
      }
      return c;
    }));

    setMessageInput('');
    setAiSuggestion(null);
  };


  // Simulate Incoming Customer Message (Para testar no Inbox)
  const handleSimulateCustomerMessage = async () => {
    const promptText = prompt('Digite a mensagem enviada pelo cliente no WhatsApp:', 'Qual o horário de atendimento?');
    if (!promptText) return;

    const customerMsg: Message = {
      id: `msg-cust-${Date.now()}`,
      conversation_id: activeConvId,
      organization_id: orgId,
      sender_type: 'customer',
      sender_name: activeConv.customer_name,
      content: promptText,
      created_at: new Date().toISOString()
    };

    const currentList = [...(allMessages[activeConvId] || []), customerMsg];
    setAllMessages(prev => ({
      ...prev,
      [activeConvId]: currentList
    }));

    // Se o bot estiver ativo, a IA responde automaticamente
    if (activeConv.status === 'bot_active') {
      const response = await generateBotResponse(
        promptText,
        initialAttendant,
        initialKnowledgeItems,
        currentList
      );

      setTimeout(() => {
        const botMsg: Message = {
          id: `msg-bot-${Date.now()}`,
          conversation_id: activeConvId,
          organization_id: orgId,
          sender_type: 'bot',
          sender_name: `${initialAttendant.name} (IA)`,
          content: response.content,
          created_at: new Date().toISOString()
        };

        setAllMessages(prev => ({
          ...prev,
          [activeConvId]: [...(prev[activeConvId] || []), botMsg]
        }));

        setConversations(conversations.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              status: response.shouldHandover ? 'waiting_human' : 'bot_active',
              last_message: response.content,
              last_message_at: new Date().toISOString()
            };
          }
          return c;
        }));
      }, 800);
    } else {
      // Se humano estiver no comando, gerar sugestão de IA para o operador
      setIsGeneratingAi(true);
      setTimeout(async () => {
        const response = await generateBotResponse(
          promptText,
          initialAttendant,
          initialKnowledgeItems,
          currentList
        );
        setAiSuggestion(response.content);
        setIsGeneratingAi(false);
      }, 700);
    }
  };

  // Add Tag
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    setConversations(conversations.map(c => {
      if (c.id === activeConvId && !c.tags.includes(tag)) {
        return { ...c, tags: [...c.tags, tag] };
      }
      return c;
    }));
    setNewTagInput('');
  };

  // Save Internal Notes
  const handleSaveNotes = () => {
    setConversations(conversations.map(c => {
      if (c.id === activeConvId) {
        return { ...c, internal_notes: internalNoteInput };
      }
      return c;
    }));
  };

  const filteredConversations = conversations.filter(c => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'waiting' && c.status === 'waiting_human') ||
      (statusFilter === 'human' && c.status === 'human_active') ||
      (statusFilter === 'bot' && c.status === 'bot_active');

    const matchesSearch =
      searchFilter === '' ||
      c.customer_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.customer_phone.includes(searchFilter);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F4] text-[#171901] overflow-hidden select-none font-sans">

      {/* Top Header Bar */}
      <header className="h-14 bg-white border-b border-[#E0E3E1] px-4 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/attendant"
            className="p-1.5 text-[#4D4D61] hover:text-[#171901] rounded-lg hover:bg-[#F4F5F4] transition-colors"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}
            >
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#171901] leading-tight">Caixa de Entrada Unificada (Inbox)</h1>
              <p className="text-[10px] font-medium" style={{ color: '#2E7D5A' }}>Supervisão & Atendimento Humano Zapella</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateCustomerMessage}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F4F5F4] text-[#171901] text-xs font-semibold border border-[#E0E3E1] flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" style={{ color: '#00E676' }} />
            <span>Simular Mensagem do Cliente</span>
          </button>

          <div className="h-5 w-px bg-[#E0E3E1]"></div>

          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
            style={{ background: 'rgba(0,230,118,0.08)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E676' }}></span>
            <span>Atendimento ao Vivo</span>
          </div>
        </div>
      </header>

      {/* Main 3-Column WhatsApp Web Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Column: Conversations List */}
        <div className="w-80 bg-white border-r border-[#E0E3E1] flex flex-col shrink-0 shadow-sm">
          
          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-[#E0E3E1] space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#4D4D61] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar por nome ou WhatsApp..."
                className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#171901] placeholder-[#4D4D61]/60 focus:outline-none focus:border-[#00E676]"
              />
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex bg-[#F4F5F4] p-0.5 rounded-xl border border-[#E0E3E1]">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'waiting', label: 'Aguardando' },
                { id: 'human', label: 'Humano' },
                { id: 'bot', label: 'Bot IA' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded-lg transition-all ${
                    statusFilter === tab.id
                      ? 'bg-[#00E676] text-[#171901] shadow-sm font-bold'
                      : 'text-[#4D4D61] hover:text-[#171901]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Contacts */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3E1]/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-[#4D4D61] space-y-3 my-auto">
                <MessageSquare className="w-8 h-8 mx-auto text-[#4D4D61]/40" />
                <div>
                  <p className="text-xs font-semibold text-[#171901]">Nenhuma conversa recebida</p>
                  <p className="text-[11px] text-[#4D4D61] mt-1">
                    Conecte seu WhatsApp e envie uma mensagem de outro celular para visualizar em tempo real.
                  </p>
                </div>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                const isWaiting = conv.status === 'waiting_human';
                const isHuman = conv.status === 'human_active';

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3.5 cursor-pointer transition-all hover:bg-[#F4F5F4] relative ${
                      isActive ? 'bg-[rgba(0,230,118,0.08)] border-l-4 border-[#00E676]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-xs text-[#171901] truncate">{conv.customer_name}</h4>
                      <span className="text-[10px] text-[#4D4D61] shrink-0">
                        {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#4D4D61] line-clamp-1 mb-2 leading-relaxed">
                      {conv.last_message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isWaiting
                            ? 'bg-amber-50 text-amber-700 border border-amber-300 animate-pulse'
                            : isHuman
                            ? 'bg-blue-50 text-blue-700 border border-blue-300'
                            : 'bg-[rgba(0,230,118,0.15)] text-[#2E7D5A] border border-[rgba(0,230,118,0.30)]'
                        }`}>
                          {isWaiting ? 'Aguardando Atendente' : isHuman ? 'Atendimento Humano' : 'Bot Operando'}
                        </span>
                      </div>

                      {conv.tags.length > 0 && (
                        <span className="text-[9px] bg-[#F4F5F4] text-[#4D4D61] border border-[#E0E3E1] px-1.5 py-0.5 rounded-md font-medium">
                          {conv.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Center Column: WhatsApp Chat Area */}
        <div className="flex-1 flex flex-col bg-[#F4F5F4] relative">

          {/* Chat Header */}
          <div className="bg-white px-4 py-3 border-b border-[#E0E3E1] flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0"
                style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}
              >
                {activeConv.customer_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#171901]">{activeConv.customer_name}</h3>
                <p className="text-[11px] text-[#4D4D61] font-mono">{activeConv.customer_phone}</p>
              </div>
            </div>

            {/* Handover Toggle Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleHandover}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                  activeConv.status === 'bot_active'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-[#00E676] hover:bg-[#1DE9B6] text-[#171901]'
                }`}
              >
                {activeConv.status === 'bot_active' ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Assumir Conversa (Pausar Bot)</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Devolver para Atendente IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* WhatsApp Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2]/30">
            {activeMessages.map((msg) => {
              const isCustomer = msg.sender_type === 'customer';
              const isBot = msg.sender_type === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      isCustomer
                        ? 'bg-white text-[#171901] rounded-tl-none border border-[#E0E3E1]'
                        : isBot
                        ? 'bg-[#D9FDD3] text-[#111B21] border border-[#C2ECC0] rounded-tr-none'
                        : 'bg-[#171901] text-white rounded-tr-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 border-b pb-1 text-[10px] opacity-75 border-black/10">
                      <span className="font-bold flex items-center gap-1">
                        {isCustomer ? (
                          <User className="w-3 h-3 text-[#4D4D61]" />
                        ) : isBot ? (
                          <Bot className="w-3 h-3 text-[#2E7D5A]" />
                        ) : (
                          <UserCheck className="w-3 h-3 text-white" />
                        )}
                        {msg.sender_name}
                      </span>
                      <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Response Suggestion Box */}
          {aiSuggestion && (
            <div className="mx-4 mb-2 p-3.5 bg-white border-2 border-[#00E676] rounded-2xl shadow-xl animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#2E7D5A' }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: '#00E676' }} />
                  Sugestão de Resposta da IA (Base de Conhecimento)
                </span>
                <button
                  onClick={() => setAiSuggestion(null)}
                  className="text-[10px] text-[#4D4D61] hover:text-[#171901]"
                >
                  Fechar
                </button>
              </div>

              <p className="text-xs text-[#171901] bg-[#F4F5F4] p-3 rounded-xl border border-[#E0E3E1] leading-relaxed">
                {aiSuggestion}
              </p>

              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() => handleSendOperatorMessage(aiSuggestion)}
                  className="px-3.5 py-1.5 text-[#171901] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Usar Esta Resposta</span>
                </button>

                <button
                  onClick={() => {
                    setMessageInput(aiSuggestion);
                    setAiSuggestion(null);
                  }}
                  className="px-3.5 py-1.5 bg-[#F4F5F4] hover:bg-[#E0E3E1] text-[#171901] font-semibold text-xs rounded-xl transition-all border border-[#E0E3E1]"
                >
                  Editar Texto
                </button>
              </div>
            </div>
          )}

          {/* Message Input Footer */}
          <div className="p-3 bg-white border-t border-[#E0E3E1] shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOperatorMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={
                  activeConv.status === 'bot_active'
                    ? 'Bot operando. Digite para enviar mensagem como operador e assumir...'
                    : 'Digite como operador do WhatsApp...'
                }
                className="flex-1 bg-[#F4F5F4] text-[#171901] text-xs px-4 py-3 rounded-xl border border-[#E0E3E1] focus:outline-none focus:border-[#00E676] placeholder-[#4D4D61]/60"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-4 py-3 text-[#171901] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Tags & Private Internal Notes */}
        <div className="w-72 bg-white border-l border-[#E0E3E1] p-4 flex flex-col justify-between shrink-0 space-y-6 shadow-sm">
          
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#4D4D61] border-b border-[#E0E3E1] pb-2">
              Detalhes do Cliente
            </h3>

            <div>
              <p className="text-[11px] font-semibold text-[#4D4D61] mb-1">Nome:</p>
              <p className="text-xs font-bold text-[#171901]">{activeConv.customer_name}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#4D4D61] mb-1">WhatsApp:</p>
              <p className="text-xs font-mono font-bold" style={{ color: '#2E7D5A' }}>{activeConv.customer_phone}</p>
            </div>

            {/* Tags Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#4D4D61] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#4D4D61]" />
                  Etiquetas (Tags)
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {activeConv.tags.map(t => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4F5F4] text-[#171901] border border-[#E0E3E1]">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Nova tag..."
                  className="flex-1 bg-[#F4F5F4] border border-[#E0E3E1] text-[11px] px-2 py-1.5 rounded-lg text-[#171901] placeholder-[#4D4D61]/60 focus:outline-none focus:border-[#00E676]"
                />
                <button
                  onClick={handleAddTag}
                  className="px-2.5 py-1.5 bg-[#171901] hover:bg-[#4D4D61] text-xs font-bold text-white rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Internal Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-[#4D4D61] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#4D4D61]" />
                  Observações Internas (Privadas)
                </span>
              </div>

              <textarea
                rows={5}
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Notas visíveis apenas para a equipe (Ex: Cliente solicitou desconto de 10%)..."
                className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl p-2.5 text-xs text-[#171901] placeholder-[#4D4D61]/60 focus:outline-none focus:border-[#00E676] leading-relaxed"
              />

              <button
                onClick={handleSaveNotes}
                className="mt-2 w-full py-2 bg-[#171901] hover:bg-[#4D4D61] text-xs font-bold text-white rounded-xl transition-colors shadow-sm"
              >
                Salvar Nota Interna
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#F4F5F4] rounded-xl border border-[#E0E3E1] text-[10px] text-[#4D4D61]">
            <p className="font-bold text-[#171901]">Equipe de Atendimento Zapella</p>
            <p className="mt-0.5">As notas privadas não são enviadas ao WhatsApp do cliente.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
