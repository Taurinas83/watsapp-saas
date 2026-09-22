'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import {
  CrmStage,
  CrmLead
} from '@/types';
import {
  fetchCrmBoard,
  createCrmLead,
  updateLeadStage,
  updateCrmLead,
  deleteCrmLead
} from '@/lib/crm/actions';
import { getCurrentUserOrganizationId } from '@/lib/supabase/actions';
import {
  Kanban,
  Table as TableIcon,
  Plus,
  Search,
  Users,
  DollarSign,
  Sparkles,
  MessageSquare,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit2,
  RefreshCw,
  Phone,
  Tag,
  Clock
} from 'lucide-react';

export default function CrmPage() {
  const [stages, setStages] = useState<CrmStage[]>([]);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [orgId, setOrgId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLead, setEditingLead] = useState<CrmLead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formContactName, setFormContactName] = useState('');
  const [formContactPhone, setFormContactPhone] = useState('');
  const [formDealValue, setFormDealValue] = useState('0');
  const [formStageId, setFormStageId] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formTags, setFormTags] = useState('');

  const loadBoard = async () => {
    setLoading(true);
    try {
      const currentOrgId = await getCurrentUserOrganizationId();
      setOrgId(currentOrgId);
      const data = await fetchCrmBoard(currentOrgId);
      setStages(data.stages || []);
      setLeads(data.leads || []);
      if (data.stages && data.stages.length > 0 && !formStageId) {
        setFormStageId(data.stages[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar CRM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, []);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) return leads;
    const term = searchTerm.toLowerCase();
    return leads.filter(
      (l) =>
        l.contact_name.toLowerCase().includes(term) ||
        l.contact_phone.includes(term) ||
        (l.tags && l.tags.some((t) => t.toLowerCase().includes(term))) ||
        (l.ai_summary && l.ai_summary.toLowerCase().includes(term))
    );
  }, [leads, searchTerm]);

  // Metrics summary
  const totalPipelineValue = useMemo(() => {
    return leads.reduce((acc, l) => acc + (Number(l.deal_value) || 0), 0);
  }, [leads]);

  const handleStageChange = async (leadId: string, newStageId: string) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage_id: newStageId } : l))
    );
    await updateLeadStage(leadId, newStageId);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContactName || !formContactPhone || !formStageId) return;

    setIsSubmitting(true);
    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created = await createCrmLead({
      organization_id: orgId,
      stage_id: formStageId,
      contact_name: formContactName.trim(),
      contact_phone: formContactPhone.trim(),
      deal_value: parseFloat(formDealValue) || 0,
      notes: formNotes.trim() || undefined,
      tags: tagsArray,
    });

    if (created) {
      setLeads((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setFormContactName('');
      setFormContactPhone('');
      setFormDealValue('0');
      setFormNotes('');
      setFormTags('');
    }
    setIsSubmitting(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    setIsSubmitting(true);
    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const success = await updateCrmLead(editingLead.id, {
      contact_name: formContactName.trim(),
      contact_phone: formContactPhone.trim(),
      deal_value: parseFloat(formDealValue) || 0,
      stage_id: formStageId,
      notes: formNotes.trim() || undefined,
      tags: tagsArray,
    });

    if (success) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === editingLead.id
            ? {
                ...l,
                contact_name: formContactName.trim(),
                contact_phone: formContactPhone.trim(),
                deal_value: parseFloat(formDealValue) || 0,
                stage_id: formStageId,
                notes: formNotes.trim() || undefined,
                tags: tagsArray,
              }
            : l
        )
      );
      setEditingLead(null);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm('Deseja realmente remover esta oportunidade do CRM?')) return;
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    await deleteCrmLead(leadId);
  };

  const openEditModal = (lead: CrmLead) => {
    setEditingLead(lead);
    setFormContactName(lead.contact_name);
    setFormContactPhone(lead.contact_phone);
    setFormDealValue(String(lead.deal_value || 0));
    setFormStageId(lead.stage_id);
    setFormNotes(lead.notes || '');
    setFormTags((lead.tags || []).join(', '));
  };

  return (
    <div>
      <Header
        title="CRM & Funil de Vendas"
        subtitle="Gerencie leads, oportunidades e o avanço dos seus clientes com automação inteligente por IA"
      />

      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Valor do Funil</span>
              <p className="text-xl font-bold text-[#128C7E]">
                R$ {totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#128C7E] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total de Oportunidades</span>
              <p className="text-xl font-bold text-slate-900">{leads.length} leads</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Etapas Ativas</span>
              <p className="text-xl font-bold text-slate-900">{stages.length} colunas</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Kanban className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Automação IA</span>
              <p className="text-xs font-bold text-[#128C7E] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Sincronização Ativa
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Controls Bar: Search, View Switcher & New Lead Button */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, telefone, tag ou resumo..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabela</span>
              </button>
            </div>

            <button
              onClick={loadBoard}
              className="p-2 bg-slate-50 border border-slate-200 hover:border-[#128C7E] text-slate-600 rounded-xl transition-colors"
              title="Recarregar CRM"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#128C7E]' : ''}`} />
            </button>

            <button
              onClick={() => {
                setFormContactName('');
                setFormContactPhone('');
                setFormDealValue('0');
                setFormNotes('');
                setFormTags('');
                if (stages.length > 0) setFormStageId(stages[0].id);
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Oportunidade</span>
            </button>
          </div>
        </div>

        {/* Kanban Board View */}
        {viewMode === 'kanban' && (
          <div className="flex gap-4 overflow-x-auto pb-6 items-start">
            {stages.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage_id === stage.id);
              const stageValue = stageLeads.reduce((acc, l) => acc + (Number(l.deal_value) || 0), 0);

              return (
                <div
                  key={stage.id}
                  className="w-80 shrink-0 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col max-h-[calc(100vh-320px)]"
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-slate-200/80 bg-white/70 backdrop-blur-xs rounded-t-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: stage.color || '#128C7E' }}
                        />
                        <h4 className="text-xs font-bold text-slate-900 truncate">{stage.name}</h4>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-500">
                      R$ {stageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    {stageLeads.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-slate-400 italic">
                        Nenhum lead nesta etapa
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-[#128C7E]/50 hover:shadow-sm transition-all space-y-2.5 group"
                        >
                          {/* Lead Name & Actions */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                {lead.contact_name}
                              </h5>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {lead.contact_phone}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(lead)}
                                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded"
                                title="Editar"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(lead.id)}
                                className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                                title="Excluir"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Deal Value */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-500">Valor estimado:</span>
                            <span className="font-bold text-[#128C7E]">
                              R$ {(Number(lead.deal_value) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          {/* AI Summary / Notes */}
                          {lead.ai_summary && (
                            <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100/80 text-[11px] text-slate-700 leading-relaxed flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#128C7E] shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{lead.ai_summary}</span>
                            </div>
                          )}

                          {/* Tags */}
                          {lead.tags && lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {lead.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Card Footer: Quick Move Stage & Open in Chat */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <select
                              value={lead.stage_id}
                              onChange={(e) => handleStageChange(lead.id, e.target.value)}
                              className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-[#128C7E] max-w-[130px]"
                            >
                              {stages.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Mover: {s.name}
                                </option>
                              ))}
                            </select>

                            <Link
                              href={`/dashboard/supervision?search=${encodeURIComponent(lead.contact_phone)}`}
                              className="text-[10px] font-bold text-[#128C7E] hover:underline flex items-center gap-1"
                              title="Abrir no Chat ao Vivo"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Chat</span>
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Contato</th>
                    <th className="p-3.5">Telefone</th>
                    <th className="p-3.5">Etapa / Coluna</th>
                    <th className="p-3.5">Valor do Negócio</th>
                    <th className="p-3.5">Tags</th>
                    <th className="p-3.5">Resumo IA</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => {
                    const currentStage = stages.find((s) => s.id === lead.stage_id);
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{lead.contact_name}</td>
                        <td className="p-3.5 font-mono text-slate-600">{lead.contact_phone}</td>
                        <td className="p-3.5">
                          <select
                            value={lead.stage_id}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
                          >
                            {stages.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3.5 font-bold text-[#128C7E]">
                          R$ {(Number(lead.deal_value) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(lead.tags || []).map((t, idx) => (
                              <span key={idx} className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5 max-w-xs truncate text-[11px] text-slate-500">
                          {lead.ai_summary || '-'}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <Link
                            href={`/dashboard/supervision?search=${encodeURIComponent(lead.contact_phone)}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#128C7E] hover:underline"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Chat
                          </Link>
                          <button
                            onClick={() => openEditModal(lead)}
                            className="text-[11px] font-bold text-slate-600 hover:text-slate-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="text-[11px] font-bold text-red-600 hover:text-red-800"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: New / Edit Lead */}
        {(showCreateModal || editingLead) && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  {editingLead ? 'Editar Oportunidade' : 'Nova Oportunidade / Lead'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingLead(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                >
                  ×
                </button>
              </div>

              <form onSubmit={editingLead ? handleEditSubmit : handleCreateSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Contato</label>
                  <input
                    type="text"
                    value={formContactName}
                    onChange={(e) => setFormContactName(e.target.value)}
                    placeholder="Ex: João Silva"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone WhatsApp</label>
                  <input
                    type="text"
                    value={formContactPhone}
                    onChange={(e) => setFormContactPhone(e.target.value)}
                    placeholder="Ex: 5511999998888"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Valor do Negócio (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formDealValue}
                      onChange={(e) => setFormDealValue(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Etapa / Coluna</label>
                    <select
                      value={formStageId}
                      onChange={(e) => setFormStageId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                    >
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Ex: Quente, Consultoria, Plano Pro"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Observações Internas</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Notas internas do vendedor/atendente..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#128C7E]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingLead(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : editingLead ? 'Salvar Alterações' : 'Criar Oportunidade'}
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
