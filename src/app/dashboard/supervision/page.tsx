'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { initialConversations, initialMessages } from '@/lib/mock-data';
import { Conversation, ConversationStatus, Message } from '@/types';
import { fetchConversations, fetchMessages, updateConversationStatus, getCurrentUserOrganizationId } from '@/lib/supabase/actions';
import { DEFAULT_ORG_ID } from '@/lib/constants';
import {
  Eye,
  Bot,
  UserCheck,
  UserX,
  MessageSquare,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function SupervisionPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string>(initialConversations[0]?.id || '');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(initialMessages);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [orgId, setOrgId] = useState<string>(DEFAULT_ORG_ID);

  useEffect(() => {
    async function load() {
      const currentOrgId = await getCurrentUserOrganizationId();
      setOrgId(currentOrgId);
      const dbConvs = await fetchConversations(currentOrgId);
      if (dbConvs && dbConvs.length > 0) {
        setConversations(dbConvs);
        setSelectedConvId(prev => prev || dbConvs[0].id);
      }
      setIsLoading(false);
    }
    load();

    const interval = setInterval(async () => {
      const currentOrgId = await getCurrentUserOrganizationId();
      const dbConvs = await fetchConversations(currentOrgId);
      if (dbConvs && dbConvs.length > 0) {
        setConversations(dbConvs);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedConvId) return;
    async function loadMsgs() {
      const msgs = await fetchMessages(selectedConvId);
      if (msgs && msgs.length > 0) {
        setMessagesMap(prev => ({
          ...prev,
          [selectedConvId]: msgs
        }));
      }
    }
    loadMsgs();

    const interval = setInterval(loadMsgs, 3000);
    return () => clearInterval(interval);
  }, [selectedConvId]);

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0] || {
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

  const messagesList = selectedConv.id ? (messagesMap[selectedConv.id] || []) : [];

  const handleToggleHandover = async (convId: string) => {
    const target = conversations.find(c => c.id === convId);
    if (!target) return;
    const nextStatus: ConversationStatus = target.status === 'bot_active' ? 'waiting_human' : 'bot_active';
    await updateConversationStatus(convId, nextStatus);

    setConversations(conversations.map(c => {
      if (c.id === convId) {
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const filteredConversations = conversations.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });


  return (
    <div>
      <Header
        title="Supervisão de Conversas do WhatsApp"
        subtitle="Monitore a atuação da IA em tempo real e assuma o atendimento quando necessário"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Status KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Bot Operando 100%</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {conversations.filter(c => c.status === 'bot_active').length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#F4F5F4] text-[#2E7D5A] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Aguardando Humano</p>
              <h3 className="text-xl font-bold text-amber-600 mt-1">
                {conversations.filter(c => c.status === 'waiting_human').length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Atendimento Humano</p>
              <h3 className="text-xl font-bold text-blue-600 mt-1">
                {conversations.filter(c => c.status === 'human_active').length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Finalizados Hoje</p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {conversations.filter(c => c.status === 'closed').length}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[550px]">

          {/* Left Column: Conversation List */}
          <div className="lg:col-span-5 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Filtro de Conversas</h3>
                <Link href="/inbox" className="text-xs font-semibold text-[#2E7D5A] hover:text-[#2E7D5A] flex items-center gap-1">
                  <span>Abrir Inbox</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex gap-1.5 overflow-x-auto">
                {['all', 'bot_active', 'waiting_human', 'human_active'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                      filterStatus === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'Todas' : st === 'bot_active' ? 'Bot Ativo' : st === 'waiting_human' ? 'Transf. Pendente' : 'Humano'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2 my-auto">
                  <Eye className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">Nenhuma conversa registrada</p>
                  <p className="text-[11px] text-slate-400">
                    As interações com a IA no WhatsApp aparecerão aqui para monitoramento.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedConvId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                        isSelected ? 'bg-[#F4F5F4]/50 border-l-4 border-[#00E676]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-xs">{conv.customer_name}</h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 mb-2">{conv.last_message}</p>

                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          conv.status === 'bot_active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : conv.status === 'waiting_human'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {conv.status === 'bot_active' ? 'Bot Operando' : conv.status === 'waiting_human' ? 'Aguardando Atendente' : 'Humano Ativo'}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">{conv.customer_phone}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Conversation Preview & Handover Control */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/50">
            {/* Header of selected chat */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{selectedConv.customer_name}</h3>
                <p className="text-xs text-slate-500">{selectedConv.customer_phone}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleHandover(selectedConv.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-sm ${
                    selectedConv.status === 'bot_active'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-[#00E676] hover:bg-[#43A047] text-[#171901]'
                  }`}
                >
                  {selectedConv.status === 'bot_active' ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Pausar IA e Assumir Conversa</span>
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

            {/* Messages Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messagesList.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-12">
                  Nenhuma mensagem registrada nesta conversa.
                </div>
              ) : (
                messagesList.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.sender_type === 'customer' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs shadow-sm ${
                      m.sender_type === 'customer'
                        ? 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                        : 'bg-emerald-700 text-white rounded-tr-none'
                    }`}>
                      <p className="text-[10px] font-bold opacity-75 mb-1">{m.sender_name}</p>
                      <p className="leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Direct Link to Full Inbox */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Supervisão ativa em tempo real.</span>
              <Link
                href="/inbox"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Ir para Caixa de Entrada Completa &rarr;
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
