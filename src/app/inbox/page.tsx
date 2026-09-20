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
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden select-none">

      {/* Top Header Bar */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/attendant"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00E676]/20 text-[#00E676] flex items-center justify-center font-bold text-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Caixa de Entrada Unificada (Inbox)</h1>
              <p className="text-[10px] text-[#00E676]">Supervisão & Atendimento Humano Multiatendente</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateCustomerMessage}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#00E676]" />
            <span>Simular Mensagem do Cliente</span>
          </button>

          <div className="h-5 w-px bg-slate-800"></div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Atendimento ao Vivo</span>
          </div>
        </div>
      </header>

      {/* Main 3-Column WhatsApp Web Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Column: Conversations List */}
        <div className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
          
          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar por nome ou WhatsApp..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E676]"
              />
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'waiting', label: 'Aguardando' },
                { id: 'human', label: 'Humano' },
                { id: 'bot', label: 'Bot IA' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded transition-all ${
                    statusFilter === tab.id ? 'bg-[#00E676] text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Contacts */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-3 my-auto">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-400">Nenhuma conversa recebida</p>
                  <p className="text-[11px] text-slate-500 mt-1">
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
                  className={`p-3.5 cursor-pointer transition-all hover:bg-slate-900/80 relative ${
                    isActive ? 'bg-slate-900 border-l-4 border-[#00E676]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-xs text-white truncate">{conv.customer_name}</h4>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 leading-relaxed">
                    {conv.last_message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isWaiting
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : isHuman
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-[#00E676]/20 text-emerald-300 border border-[#00E676]/40'
                      }`}>
                        {isWaiting ? 'Aguardando Atendente' : isHuman ? 'Atendimento Humano' : 'Bot Operando'}
                      </span>
                    </div>

                    {conv.tags.length > 0 && (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {conv.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>

        </div>

        {/* Center Column: WhatsApp Chat Area */}
        <div className="flex-1 flex flex-col bg-[#0b141a] relative">

          {/* Chat Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs border border-slate-700">
                {activeConv.customer_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{activeConv.customer_name}</h3>
                <p className="text-[11px] text-slate-400 font-mono">{activeConv.customer_phone}</p>
              </div>
            </div>

            {/* Handover Toggle Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleHandover}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow ${
                  activeConv.status === 'bot_active'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-[#00E676] hover:bg-[#1DE9B6] text-white'
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
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
            {activeMessages.map((msg) => {
              const isCustomer = msg.sender_type === 'customer';
              const isBot = msg.sender_type === 'bot';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                      isCustomer
                        ? 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-800'
                        : isBot
                        ? 'bg-[#005c4b] text-white rounded-tr-none'
                        : 'bg-blue-700 text-white rounded-tr-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 border-b border-white/10 pb-1 text-[10px] opacity-75">
                      <span className="font-bold flex items-center gap-1">
                        {isCustomer ? <User className="w-3 h-3 text-slate-400" /> : isBot ? <Bot className="w-3 h-3 text-emerald-300" /> : <UserCheck className="w-3 h-3 text-blue-200" />}
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
            <div className="mx-4 mb-2 p-3 bg-slate-900 border border-[#00E676]/40 rounded-xl shadow-lg animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#00E676] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E676]" />
                  Sugestão de Resposta da IA (Base de Conhecimento)
                </span>
                <button
                  onClick={() => setAiSuggestion(null)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Fechar
                </button>
              </div>

              <p className="text-xs text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                {aiSuggestion}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleSendOperatorMessage(aiSuggestion)}
                  className="px-3 py-1 bg-[#00E676] hover:bg-[#1DE9B6] text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Usar Esta Resposta</span>
                </button>

                <button
                  onClick={() => {
                    setMessageInput(aiSuggestion);
                    setAiSuggestion(null);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition-all"
                >
                  Editar Texto
                </button>
              </div>
            </div>
          )}

          {/* Message Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
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
                className="flex-1 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-[#00E676] placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-4 py-3 bg-[#00E676] hover:bg-[#1DE9B6] disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Tags & Private Internal Notes */}
        <div className="w-72 bg-slate-950 border-l border-slate-800 p-4 flex flex-col justify-between shrink-0 space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Detalhes do Cliente
            </h3>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 mb-1">Nome:</p>
              <p className="text-xs font-bold text-white">{activeConv.customer_name}</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 mb-1">WhatsApp:</p>
              <p className="text-xs font-mono text-[#00E676]">{activeConv.customer_phone}</p>
            </div>

            {/* Tags Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  Etiquetas (Tags)
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {activeConv.tags.map(t => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
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
                  className="flex-1 bg-slate-900 border border-slate-800 text-[11px] px-2 py-1 rounded text-white focus:outline-none focus:border-[#00E676]"
                />
                <button
                  onClick={handleAddTag}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* Internal Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Observações Internas (Privadas)
                </span>
              </div>

              <textarea
                rows={5}
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Notas visíveis apenas para a equipe (Ex: Cliente solicitou desconto de 10%)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#00E676] leading-relaxed"
              />

              <button
                onClick={handleSaveNotes}
                className="mt-2 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                Salvar Nota Interna
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[10px] text-slate-400">
            <p className="font-semibold text-slate-300">Equipe de Atendimento</p>
            <p className="mt-0.5">As notas privadas não são enviadas ao WhatsApp do cliente.</p>
          </div>

        </div>

      </div>
    </div>
  );
}
