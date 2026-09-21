'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { initialAttendant } from '@/lib/mock-data';
import { Attendant, PersonalityType } from '@/types';
import { buildSystemPrompt } from '@/lib/ai-engine';
import { fetchAttendant, updateAttendant, getCurrentUserOrganizationId } from '@/lib/supabase/actions';
import { DEFAULT_ORG_ID } from '@/lib/constants';
import { Bot, Sparkles, Smile, ShieldCheck, Coffee, Check, Save, Info, Terminal, RefreshCw } from 'lucide-react';

export default function AttendantConfigPage() {
  const [attendant, setAttendant] = useState<Attendant>(initialAttendant);
  const [orgId, setOrgId] = useState<string>(DEFAULT_ORG_ID);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const currentOrgId = await getCurrentUserOrganizationId();
      setOrgId(currentOrgId);
      const data = await fetchAttendant(currentOrgId);
      if (data) {
        setAttendant(data);
      } else {
        setAttendant(prev => ({ ...prev, organization_id: currentOrgId }));
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateAttendant({ ...attendant, organization_id: orgId });
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;
    const current = attendant.handover_keywords || [];
    if (!current.includes(trimmed)) {
      setAttendant({ ...attendant, handover_keywords: [...current, trimmed] });
    }
    setNewKeyword('');
  };

  const generatedPrompt = buildSystemPrompt(attendant, []);


  const personalities: { id: PersonalityType; title: string; desc: string; icon: any }[] = [
    {
      id: 'friendly',
      title: 'Amigável & Caloroso',
      desc: 'Usará emojis, tom empático, acolhedor e muito simpático.',
      icon: Smile
    },
    {
      id: 'professional',
      title: 'Profissional & Elegante',
      desc: 'Comunicação objetiva, culta, direta e extremamente formal.',
      icon: ShieldCheck
    },
    {
      id: 'casual',
      title: 'Descontraído & Leve',
      desc: 'Tom informal, moderno, leve e conversacional sem rigidez.',
      icon: Coffee
    }
  ];

  return (
    <div>
      <Header
        title="Identidade do Atendente Virtual"
        subtitle="Configure o nome, personalidade e conduta da sua IA que atenderá via WhatsApp"
      />

      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Top Notification Banner */}
        {savedSuccess && (
          <div className="bg-[#00E676]/10 border border-[#00E676]/30 text-[#2E7D5A] px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in-50 duration-150">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Check className="w-4 h-4 text-[#2E7D5A]" />
              <span>Configurações da Identidade salvas com sucesso! O prompt dinâmico foi atualizado.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Form Configuration Column */}
          <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">

            {/* Basic Identity Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-3 border-b border-slate-100">
                <Bot className="w-4 h-4 text-[#2E7D5A]" />
                <span>Dados do Atendente</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Atendente Virtual</label>
                <input
                  type="text"
                  value={attendant.name}
                  onChange={(e) => setAttendant({ ...attendant, name: e.target.value })}
                  placeholder="Ex: Zapella, Lucas, Assistente Virtual"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00E676] font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">Este é o nome com o qual a IA se apresentará para os clientes.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Personalidade</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {personalities.map((p) => {
                    const Icon = p.icon;
                    const isSelected = attendant.personality === p.id;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setAttendant({ ...attendant, personality: p.id })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#00E676]/10 border-[#00E676] text-emerald-950 shadow-sm ring-1 ring-[#00E676]/30'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#2E7D5A]' : 'text-slate-400'}`} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#2E7D5A]" />}
                        </div>
                        <p className="text-xs font-semibold leading-snug">{p.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-normal">{p.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tom de Voz Detalhado</label>
                <input
                  type="text"
                  value={attendant.voice_tone}
                  onChange={(e) => setAttendant({ ...attendant, voice_tone: e.target.value })}
                  placeholder="Ex: Atencioso, bem-humorado e objetivo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00E676]"
                />
              </div>
            </div>

            {/* Business Context & Custom Instructions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-3 border-b border-slate-100">
                <Info className="w-4 h-4 text-[#2E7D5A]" />
                <span>Instruções do Negócio & Conduta</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Resumo das Atividades do Negócio</label>
                <textarea
                  rows={3}
                  value={attendant.business_info}
                  onChange={(e) => setAttendant({ ...attendant, business_info: e.target.value })}
                  placeholder="Descreva o que seu negócio faz, localização e resumo dos atendimentos..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00E676] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Instruções de Conduta Personalizadas</label>
                <textarea
                  rows={4}
                  value={attendant.custom_instructions}
                  onChange={(e) => setAttendant({ ...attendant, custom_instructions: e.target.value })}
                  placeholder="Ex: NUNCA dê descontos sem autorização. Se o cliente reclamar, peça desculpas e acione o atendimento humano..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00E676] leading-relaxed"
                />
              </div>
            </div>

            {/* Handover & Immediate Transfer Keywords Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm pb-3 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-[#2E7D5A]" />
                <span>Palavras-chave de Transferência Imediata (Handover)</span>
              </div>

              <p className="text-xs text-slate-500">
                Quando o cliente enviar qualquer uma destas palavras no WhatsApp, o robô pausará imediatamente e transferirá a conversa para a equipe humana no Inbox.
              </p>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 min-h-[42px] p-3 bg-slate-50 border border-slate-200 rounded-xl items-center">
                  {(attendant.handover_keywords || []).map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-sm"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (attendant.handover_keywords || []).filter((_, idx) => idx !== i);
                          setAttendant({ ...attendant, handover_keywords: updated });
                        }}
                        className="text-slate-400 hover:text-rose-500 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {(attendant.handover_keywords || []).length === 0 && (
                    <span className="text-xs text-slate-400 italic">Nenhuma palavra cadastrada ainda.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Adicionar termo (ex: financeiro, cancelar, falar com atendente)..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#00E676]"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-4 py-2.5 bg-[#171901] hover:bg-[#4D4D61] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            </div>

            {/* Bot Status & Save Button */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-900">Pausar Atendente IA Globalmente</p>
                  <p className="text-[11px] text-slate-500">
                    {attendant.is_paused
                      ? '⏸️ O bot está PAUSADO. As mensagens dos clientes aguardarão atendimento humano no Inbox.'
                      : '🟢 O bot está ATIVO e responderá a todas as mensagens com a IA.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAttendant({ ...attendant, is_paused: !attendant.is_paused })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm ${
                    attendant.is_paused
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-[#00E676] hover:bg-[#1DE9B6] text-[#171901]'
                  }`}
                >
                  {attendant.is_paused ? '⏸️ Bot Pausado' : '🟢 Bot Ativo'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#00E676] hover:bg-[#43A047] text-[#171901] font-bold text-xs py-3.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Todas as Configurações da Identidade'}</span>
              </button>
            </div>

          </form>

          {/* AI Prompt Live Preview Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-full">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#00E676]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00E676]">Prompt do Sistema (Claude IA)</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Gerado Dinamicamente</span>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Este é o prompt exato construído em tempo real que será enviado para a API do Anthropic Claude a cada mensagem recebida no WhatsApp:
              </p>

              <div className="flex-1 bg-slate-950 p-4 rounded-xl font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto max-h-[460px] border border-slate-800 whitespace-pre-wrap select-all">
                {generatedPrompt}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
