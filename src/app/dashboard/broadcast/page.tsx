'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import {
  CalendarClock,
  Plus,
  Users,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ShieldCheck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ScheduledMessage } from '@/types';
import { getCurrentUserOrganizationId } from '@/lib/supabase/actions';

export default function BroadcastPage() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [groups, setGroups] = useState<{ id: string; subject: string; size?: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [selectedGroupJid, setSelectedGroupJid] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/broadcast');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Erro ao carregar mensagens agendadas:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    setLoadingGroups(true);
    try {
      const orgId = await getCurrentUserOrganizationId();
      const inst = orgId && orgId !== 'a0000000-0000-0000-0000-000000000001'
        ? `org_${orgId.replace(/[^a-zA-Z0-9]/g, '_')}`
        : 'default_org';
      const res = await fetch(`/api/whatsapp/groups?instance=${inst}`);
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups || []);
        if (data.groups && data.groups.length > 0 && !selectedGroupJid) {
          setSelectedGroupJid(data.groups[0].id);
          setSelectedGroupName(data.groups[0].subject);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar grupos:', err);
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    loadData();
    loadGroups();
  }, []);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupJid || !messageContent.trim() || !scheduledDateTime) {
      setFeedback({ type: 'error', message: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    const scheduledDate = new Date(scheduledDateTime);
    if (scheduledDate.getTime() <= Date.now()) {
      setFeedback({ type: 'error', message: 'O horário agendado deve ser no futuro.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_jid: selectedGroupJid,
          target_name: selectedGroupName || 'Grupo WhatsApp',
          message_content: messageContent.trim(),
          scheduled_for: scheduledDate.toISOString(),
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: 'Mensagem agendada com sucesso!' });
        setShowModal(false);
        setMessageContent('');
        setScheduledDateTime('');
        loadData();
      } else {
        const err = await res.json();
        setFeedback({ type: 'error', message: err.error || 'Erro ao agendar mensagem.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erro inesperado.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Deseja realmente cancelar este agendamento?')) return;

    try {
      const res = await fetch(`/api/broadcast?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Erro ao cancelar agendamento:', err);
    }
  };

  const handleTriggerDispatch = async () => {
    setIsDispatching(true);
    try {
      const res = await fetch('/api/broadcast/dispatch', { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        setFeedback({
          type: 'success',
          message: `Verificação concluída: ${result.processed || 0} mensagens processadas.`,
        });
        loadData();
      }
    } catch (err) {
      console.error('Erro ao disparar verificação:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div>
      <Header
        title="Mensagens Agendadas para Grupos"
        subtitle="Agende comunicados e novidades para seus grupos e comunidades do WhatsApp com segurança antiban"
      />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Top Info Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Blindagem Antiban & Custo Zero de IA</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#128C7E]">
                  Proteção Meta Ativa
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl">
                O envio programado para grupos é direto via WhatsApp, não consome tokens de IA e utiliza intervalos inteligentes (15s a 30s) para manter seu número 100% seguro contra bloqueios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={handleTriggerDispatch}
              disabled={isDispatching}
              className="flex-1 md:flex-none px-3.5 py-2.5 bg-white border border-slate-200 hover:border-[#128C7E] text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              title="Verifica se há mensagens agendadas para o momento e dispara"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin text-[#128C7E]' : ''}`} />
              <span>{isDispatching ? 'Verificando...' : 'Verificar Fila'}</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Mensagem</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in-50 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 font-bold ml-2">
              ×
            </button>
          </div>
        )}

        {/* List of Scheduled Messages */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#128C7E]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Histórico e Fila de Agendamentos</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: {messages.length} agendamento(s)
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#128C7E]" />
              <span>Carregando agendamentos...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <CalendarClock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">Nenhuma mensagem agendada no momento.</p>
              <p className="text-slate-400">Clique em &ldquo;Nova Mensagem&rdquo; para programar o envio para os seus grupos.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((item) => {
                const isPending = item.status === 'pending';
                const isSent = item.status === 'sent';
                const isFailed = item.status === 'failed';
                const isCancelled = item.status === 'cancelled';

                return (
                  <div key={item.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#128C7E]" />
                          {item.target_name || 'Grupo WhatsApp'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : isSent
                              ? 'bg-emerald-50 text-[#128C7E] border border-emerald-200'
                              : isFailed
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isPending ? 'PENDENTE' : isSent ? 'ENVIADO' : isFailed ? 'FALHOU' : 'CANCELADO'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-wrap font-sans">
                        {item.message_content}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Agendado para: {new Date(item.scheduled_for).toLocaleString('pt-BR')}
                        </span>
                        {item.sent_at && (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-[#128C7E]" />
                            Enviado em: {new Date(item.sent_at).toLocaleString('pt-BR')}
                          </span>
                        )}
                        {item.error_message && (
                          <span className="text-red-600 truncate max-w-xs" title={item.error_message}>
                            Erro: {item.error_message}
                          </span>
                        )}
                      </div>
                    </div>

                    {isPending && (
                      <button
                        onClick={() => handleCancel(item.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancelar</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: New Scheduled Message */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-[#128C7E] flex items-center justify-center">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Novo Agendamento para Grupo</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateSchedule} className="space-y-4">
                {/* Select Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Grupo de WhatsApp (Destino)
                  </label>
                  {loadingGroups ? (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 py-2">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Buscando grupos da sua conexão do WhatsApp...</span>
                    </div>
                  ) : groups.length > 0 ? (
                    <select
                      value={selectedGroupJid}
                      onChange={(e) => {
                        const jid = e.target.value;
                        setSelectedGroupJid(jid);
                        const found = groups.find((g) => g.id === jid);
                        if (found) setSelectedGroupName(found.subject);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                    >
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.subject} {g.size ? `(${g.size} membros)` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={selectedGroupJid}
                        onChange={(e) => setSelectedGroupJid(e.target.value)}
                        placeholder="ID do Grupo (ex: 1203630xxx@g.us)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                      />
                      <p className="text-[11px] text-slate-400 italic">
                        Nenhum grupo detectado automaticamente. Conecte seu WhatsApp ou informe o ID do grupo.
                      </p>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Mensagem
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {messageContent.length} caracteres
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Escreva o comunicado, novidade ou mensagem que será disparada no grupo..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                    required
                  />
                </div>

                {/* Date and Time Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Data e Horário do Envio
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Horário baseado no seu fuso horário local.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
