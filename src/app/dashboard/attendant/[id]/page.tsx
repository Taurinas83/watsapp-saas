'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Attendant, PersonalityType } from '@/types';
import { buildSystemPrompt } from '@/lib/ai-engine';
import { fetchAttendants, updateAttendant, createAttendant, getCurrentUserOrganizationId } from '@/lib/supabase/actions';
import { DEFAULT_ORG_ID } from '@/lib/constants';
import {
  Bot, Sparkles, Smile, ShieldCheck, Coffee, Check, Save,
  Info, Terminal, RefreshCw, Calendar, Users, ArrowLeft, Plus, X
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { initialAttendant } from '@/lib/mock-data';

const inputClass = 'w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs text-[#171901] focus:outline-none focus:border-[#00E676] transition-all';
const labelClass = 'block text-xs font-bold text-[#171901] mb-1';

export default function AttendantEditPage() {
  const params = useParams();
  const router = useRouter();
  const attendantId = params?.id as string;
  const isNew = attendantId === 'new';

  const [orgId, setOrgId] = useState<string>(DEFAULT_ORG_ID);
  const [attendant, setAttendant] = useState<Attendant>({ ...initialAttendant, department: 'Geral', routing_keywords: [], is_active: true });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newRoutingKw, setNewRoutingKw] = useState('');

  useEffect(() => {
    async function load() {
      const currentOrgId = await getCurrentUserOrganizationId();
      setOrgId(currentOrgId);

      if (!isNew) {
        const data = await fetchAttendants(currentOrgId);
        const found = data.find(a => a.id === attendantId);
        if (found) {
          setAttendant(found);
        }
      } else {
        setAttendant(prev => ({ ...prev, organization_id: currentOrgId }));
      }
      setIsLoading(false);
    }
    load();
  }, [attendantId, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (isNew) {
      const created = await createAttendant(orgId, attendant);
      if (created) {
        setSavedSuccess(true);
        setTimeout(() => router.push('/dashboard/attendant'), 1500);
      }
    } else {
      await updateAttendant({ ...attendant, organization_id: orgId });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  const addKeyword = (type: 'handover' | 'routing') => {
    const val = type === 'handover' ? newKeyword.trim() : newRoutingKw.trim();
    if (!val) return;
    if (type === 'handover') {
      const cur = attendant.handover_keywords || [];
      if (!cur.includes(val)) setAttendant({ ...attendant, handover_keywords: [...cur, val] });
      setNewKeyword('');
    } else {
      const cur = attendant.routing_keywords || [];
      if (!cur.includes(val)) setAttendant({ ...attendant, routing_keywords: [...cur, val] });
      setNewRoutingKw('');
    }
  };

  const removeKeyword = (type: 'handover' | 'routing', kw: string) => {
    if (type === 'handover') {
      setAttendant({ ...attendant, handover_keywords: (attendant.handover_keywords || []).filter(k => k !== kw) });
    } else {
      setAttendant({ ...attendant, routing_keywords: (attendant.routing_keywords || []).filter(k => k !== kw) });
    }
  };

  const personalities: { id: PersonalityType; title: string; desc: string; icon: any }[] = [
    { id: 'friendly', title: 'Amigável & Caloroso', desc: 'Emojis, empático, acolhedor e simpático.', icon: Smile },
    { id: 'professional', title: 'Profissional & Elegante', desc: 'Objetiva, culta, direta e formal.', icon: ShieldCheck },
    { id: 'casual', title: 'Descontraído & Leve', desc: 'Informal, moderno, leve e conversacional.', icon: Coffee },
  ];

  if (isLoading) {
    return (
      <div className="font-sans">
        <Header title="Carregando..." subtitle="" />
        <div className="p-6 text-center">
          <div className="w-6 h-6 animate-spin mx-auto rounded-full border-2 border-[#00E676] border-t-transparent" />
        </div>
      </div>
    );
  }

  const generatedPrompt = buildSystemPrompt(attendant, []);

  return (
    <div className="font-sans">
      <Header
        title={isNew ? 'Novo Atendente Virtual' : `Configurar: ${attendant.name}`}
        subtitle={isNew ? 'Crie um novo agente de IA com personalidade e setor próprios' : `Setor: ${attendant.department}`}
      />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <Link href="/dashboard/attendant" className="flex items-center gap-1.5 text-xs text-[#4D4D61] hover:text-[#171901] transition-all w-fit">
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para lista de atendentes
        </Link>

        {savedSuccess && (
          <div className="bg-[#F4F5F4] border border-[#00E676] text-[#2E7D5A] px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50">
            <Check className="w-4 h-4 text-[#00E676]" />
            <span>{isNew ? 'Atendente criado! Redirecionando...' : 'Configurações salvas com sucesso!'}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Identidade */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0E3E1] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#171901] font-bold text-sm pb-3 border-b border-[#E0E3E1]">
              <Bot className="w-4 h-4" style={{ color: '#00E676' }} />
              <span>Identidade do Atendente</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nome do Atendente</label>
                <input type="text" required value={attendant.name} onChange={e => setAttendant({ ...attendant, name: e.target.value })} placeholder="Ex: Luna, Max, Sofia..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Setor / Departamento</label>
                <input type="text" required value={attendant.department} onChange={e => setAttendant({ ...attendant, department: e.target.value })} placeholder="Ex: Vendas, Suporte, Financeiro..." className={inputClass} />
              </div>
            </div>

            {/* Personalidade */}
            <div>
              <label className={labelClass}>Personalidade</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {personalities.map(({ id, title, desc, icon: Icon }) => (
                  <button key={id} type="button"
                    onClick={() => setAttendant({ ...attendant, personality: id })}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${attendant.personality === id ? 'border-[#00E676] bg-[#F4F5F4]' : 'border-[#E0E3E1] hover:border-[#00E676]/50'}`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${attendant.personality === id ? 'text-[#2E7D5A]' : 'text-[#4D4D61]'}`} />
                    <p className="text-xs font-bold text-[#171901]">{title}</p>
                    <p className="text-[10px] text-[#4D4D61] mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contexto e Instruções */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0E3E1] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#171901] font-bold text-sm pb-3 border-b border-[#E0E3E1]">
              <Sparkles className="w-4 h-4" style={{ color: '#00E676' }} />
              <span>Contexto & Instruções</span>
            </div>
            <div>
              <label className={labelClass}>Tom de Voz</label>
              <input type="text" value={attendant.voice_tone} onChange={e => setAttendant({ ...attendant, voice_tone: e.target.value })} placeholder="Ex: Atencioso, prestativo, eficiente e objetivo" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contexto do Negócio</label>
              <textarea rows={4} value={attendant.business_info} onChange={e => setAttendant({ ...attendant, business_info: e.target.value })} placeholder="Descreva sua empresa, produtos, serviços, público-alvo e diferencial..." className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Instruções Personalizadas</label>
              <textarea rows={3} value={attendant.custom_instructions} onChange={e => setAttendant({ ...attendant, custom_instructions: e.target.value })} placeholder="Regras específicas para este atendente, scripts de venda, como lidar com objeções..." className={`${inputClass} resize-none`} />
            </div>
          </div>

          {/* Roteamento */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0E3E1] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#171901] font-bold text-sm pb-3 border-b border-[#E0E3E1]">
              <Users className="w-4 h-4" style={{ color: '#00E676' }} />
              <span>Palavras-chave de Roteamento</span>
            </div>
            <p className="text-xs text-[#4D4D61]">Quando um cliente enviar uma mensagem contendo essas palavras, ele será direcionado para este atendente automaticamente.</p>
            <div className="flex gap-2">
              <input type="text" value={newRoutingKw} onChange={e => setNewRoutingKw(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword('routing'); } }} placeholder="Ex: comprar, preço, orçamento..." className={`${inputClass} flex-1`} />
              <button type="button" onClick={() => addKeyword('routing')} className="px-3 py-2 rounded-xl bg-[#171901] text-white text-xs font-bold"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(attendant.routing_keywords || []).map(kw => (
                <span key={kw} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-700 font-medium">
                  {kw}
                  <button type="button" onClick={() => removeKeyword('routing', kw)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {(attendant.routing_keywords || []).length === 0 && <p className="text-xs text-[#4D4D61] italic">Nenhuma palavra-chave definida</p>}
            </div>

            <div className="pt-2 border-t border-[#E0E3E1]">
              <label className={labelClass}>Palavras-chave de Transferência para Humano</label>
              <p className="text-xs text-[#4D4D61] mb-2">Se o cliente digitar estas palavras, a conversa é passada para um atendente humano.</p>
              <div className="flex gap-2">
                <input type="text" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword('handover'); } }} placeholder="Ex: falar com humano, atendente..." className={`${inputClass} flex-1`} />
                <button type="button" onClick={() => addKeyword('handover')} className="px-3 py-2 rounded-xl bg-[#171901] text-white text-xs font-bold"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(attendant.handover_keywords || []).map(kw => (
                  <span key={kw} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">
                    {kw}
                    <button type="button" onClick={() => removeKeyword('handover', kw)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Agenda e Grupo */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0E3E1] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#171901] font-bold text-sm pb-3 border-b border-[#E0E3E1]">
              <Calendar className="w-4 h-4" style={{ color: '#00E676' }} />
              <span>Agenda & Comunidade (Opcional)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Link de Agendamento</label>
                <input type="url" value={attendant.calendar_link || ''} onChange={e => setAttendant({ ...attendant, calendar_link: e.target.value })} placeholder="https://calendly.com/..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Link do Grupo VIP</label>
                <input type="url" value={attendant.group_invite_link || ''} onChange={e => setAttendant({ ...attendant, group_invite_link: e.target.value })} placeholder="https://chat.whatsapp.com/..." className={inputClass} />
              </div>
            </div>
          </div>

          {/* Prompt Preview */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0E3E1] shadow-sm space-y-3">
            <button type="button" onClick={() => setShowPromptPreview(!showPromptPreview)} className="flex items-center gap-2 text-xs font-bold text-[#4D4D61] hover:text-[#171901]">
              <Terminal className="w-4 h-4" />
              {showPromptPreview ? 'Ocultar' : 'Ver'} System Prompt Gerado
            </button>
            {showPromptPreview && (
              <pre className="bg-[#F4F5F4] p-4 rounded-xl text-[10px] text-[#4D4D61] whitespace-pre-wrap overflow-auto max-h-64 font-mono border border-[#E0E3E1]">
                {generatedPrompt}
              </pre>
            )}
          </div>

          {/* Salvar */}
          <div className="flex justify-end gap-3">
            <Link href="/dashboard/attendant" className="px-5 py-2.5 rounded-xl bg-[#F4F5F4] hover:bg-[#E0E3E1] text-[#4D4D61] text-xs font-bold transition-all">
              Cancelar
            </Link>
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-[#171901] shadow-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}>
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isNew ? 'Criar Atendente' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
