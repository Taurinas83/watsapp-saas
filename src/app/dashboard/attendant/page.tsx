'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Attendant } from '@/types';
import {
  Bot, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  MessageCircle, Loader2, ShieldCheck, Smile, Coffee, Zap
} from 'lucide-react';
import {
  fetchAttendants,
  updateAttendant,
  deleteAttendant,
  getCurrentUserOrganizationId,
  createAttendant,
} from '@/lib/supabase/actions';
import Link from 'next/link';

const personalityLabel: Record<string, string> = {
  friendly: 'Amigável',
  professional: 'Profissional',
  casual: 'Descontraído',
};

const personalityIcon: Record<string, React.ElementType> = {
  friendly: Smile,
  professional: ShieldCheck,
  casual: Coffee,
};

const personalityColor: Record<string, string> = {
  friendly: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  professional: 'bg-blue-50 text-blue-700 border-blue-200',
  casual: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AttendantsListPage() {
  const [orgId, setOrgId] = useState('');
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newPersonality, setNewPersonality] = useState<'friendly' | 'professional' | 'casual'>('professional');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function load() {
      const id = await getCurrentUserOrganizationId();
      setOrgId(id);
      const data = await fetchAttendants(id);
      setAttendants(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDept.trim()) return;
    setIsCreating(true);
    const created = await createAttendant(orgId, {
      name: newName.trim(),
      department: newDept.trim(),
      personality: newPersonality,
    });
    if (created) {
      setAttendants(prev => [...prev, created]);
      setNewName('');
      setNewDept('');
      setNewPersonality('professional');
      setShowCreateModal(false);
    }
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover este atendente? As conversas existentes não serão afetadas.')) return;
    setDeletingId(id);
    const ok = await deleteAttendant(id);
    if (ok) setAttendants(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  };

  const handleToggleActive = async (att: Attendant) => {
    setTogglingId(att.id);
    await updateAttendant({ id: att.id, organization_id: att.organization_id, is_active: !att.is_active });
    setAttendants(prev => prev.map(a => a.id === att.id ? { ...a, is_active: !a.is_active } : a));
    setTogglingId(null);
  };

  return (
    <div className="font-sans">
      <Header
        title="Atendentes Virtuais"
        subtitle="Gerencie seus agentes de IA por setor — cada um com personalidade e roteamento próprios"
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Barra de ação */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#4D4D61]">
            <Bot className="w-4 h-4" style={{ color: '#00E676' }} />
            <span><strong>{attendants.length}</strong> atendente{attendants.length !== 1 ? 's' : ''} ativo{attendants.length !== 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#171901] shadow-sm transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
          >
            <Plus className="w-4 h-4" />
            Novo Atendente
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E0E3E1] text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: '#00E676' }} />
            <p className="text-xs text-[#4D4D61]">Carregando atendentes...</p>
          </div>
        ) : attendants.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl border border-[#E0E3E1] text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}>
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-bold text-[#171901] text-sm">Nenhum atendente virtual criado</p>
              <p className="text-xs text-[#4D4D61] mt-1">Crie seu primeiro agente de IA para começar a atender no WhatsApp.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl text-sm font-bold text-[#171901] shadow-sm"
              style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
            >
              Criar Primeiro Atendente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attendants.map(att => {
              const Icon = personalityIcon[att.personality] || Bot;
              return (
                <div
                  key={att.id}
                  className={`bg-white rounded-2xl border p-5 space-y-4 transition-all ${att.is_active ? 'border-[#E0E3E1] shadow-sm' : 'border-[#E0E3E1] opacity-60'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-[#171901] text-sm">{att.name}</p>
                        <p className="text-xs text-[#4D4D61]">{att.department}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${personalityColor[att.personality]}`}>
                      {personalityLabel[att.personality] || att.personality}
                    </span>
                  </div>

                  {att.routing_keywords && att.routing_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {att.routing_keywords.slice(0, 5).map(kw => (
                        <span key={kw} className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] text-blue-700 font-medium border border-blue-200">
                          {kw}
                        </span>
                      ))}
                      {att.routing_keywords.length > 5 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F4F5F4] text-[10px] text-[#4D4D61]">+{att.routing_keywords.length - 5}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#E0E3E1]">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/attendant/${att.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F5F4] hover:bg-[#E0E3E1] text-xs font-semibold text-[#171901] transition-all"
                      >
                        <Pencil className="w-3 h-3" />
                        Configurar
                      </Link>
                      <button
                        onClick={() => handleDelete(att.id)}
                        disabled={deletingId === att.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-600 transition-all"
                      >
                        {deletingId === att.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        Remover
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleActive(att)}
                      disabled={togglingId === att.id}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                      style={{ color: att.is_active ? '#00E676' : '#9CA3AF' }}
                    >
                      {togglingId === att.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : att.is_active
                          ? <ToggleRight className="w-5 h-5" />
                          : <ToggleLeft className="w-5 h-5" />}
                      {att.is_active ? 'Ativo' : 'Inativo'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {attendants.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Zap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-800">
              <strong>Roteamento multi-agente ativo.</strong>{' '}
              Configure menu inicial e roteamento por IA em{' '}
              <Link href="/dashboard/settings" className="underline font-bold">Configurações → Roteamento</Link>.
            </div>
          </div>
        )}
      </div>

      {/* Modal de Criação Rápida */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#171901]">
              <Bot className="w-5 h-5" style={{ color: '#00E676' }} />
              Novo Atendente Virtual
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#171901] mb-1">Nome do Atendente</label>
                <input type="text" required value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="Ex: Luna, Max, Sofia..." className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00E676]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171901] mb-1">Setor / Departamento</label>
                <input type="text" required value={newDept} onChange={e => setNewDept(e.target.value)}
                  placeholder="Ex: Vendas, Suporte, Financeiro, Geral..." className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#00E676]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171901] mb-2">Personalidade</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['professional', 'friendly', 'casual'] as const).map(p => (
                    <button key={p} type="button" onClick={() => setNewPersonality(p)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${newPersonality === p ? 'border-[#00E676] bg-[#F4F5F4] text-[#171901]' : 'border-[#E0E3E1] text-[#4D4D61]'}`}>
                      {personalityLabel[p]}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-[#4D4D61]">💡 Configure personalidade completa e palavras-chave de roteamento após criar.</p>
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4F5F4] text-xs font-bold text-[#4D4D61]">Cancelar</button>
                <button type="submit" disabled={isCreating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#171901]"
                  style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}>
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Criar Atendente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
