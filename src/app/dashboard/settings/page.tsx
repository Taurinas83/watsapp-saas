'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Clock, Bell, Save, Check, Mail, Smartphone, Loader2, User, Building2, ShieldCheck } from 'lucide-react';
import { getCurrentUserOrganizationId, fetchOrganizationSettings, updateOrganizationSettings } from '@/lib/supabase/actions';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_ORG_ID } from '@/lib/constants';

interface ScheduleDay {
  day: string;
  active: boolean;
  open: string;
  close: string;
}

const defaultSchedule: ScheduleDay[] = [
  { day: 'Segunda-feira', active: true, open: '08:00', close: '19:00' },
  { day: 'Terça-feira', active: true, open: '08:00', close: '19:00' },
  { day: 'Quarta-feira', active: true, open: '08:00', close: '19:00' },
  { day: 'Quinta-feira', active: true, open: '08:00', close: '19:00' },
  { day: 'Sexta-feira', active: true, open: '08:00', close: '19:00' },
  { day: 'Sábado', active: true, open: '08:00', close: '13:00' },
  { day: 'Domingo', active: false, open: '08:00', close: '12:00' },
];

export default function GeneralSettingsPage() {
  const [orgId, setOrgId] = useState<string>(DEFAULT_ORG_ID);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [planTier, setPlanTier] = useState('starter');

  // Business Hours State
  const [schedule, setSchedule] = useState<ScheduleDay[]>(defaultSchedule);

  const [outOfHoursMsg, setOutOfHoursMsg] = useState(
    'Olá! No momento estamos fora do nosso horário de atendimento. Deixe sua dúvida que responderemos assim que abrirmos! 😊'
  );

  const [notifyHandoverEmail, setNotifyHandoverEmail] = useState(true);
  const [notifyHandoverWhatsApp, setNotifyHandoverWhatsApp] = useState(true);

  // Carregar configurações reais do Supabase
  useEffect(() => {
    async function loadSettings() {
      try {
        const currentOrgId = await getCurrentUserOrganizationId();
        setOrgId(currentOrgId);

        const supabase = createClient();

        // Carregar usuário logado e perfil
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setEmail(user.email || '');
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (profile) {
            setFullName(profile.full_name || '');
          }
        }

        // Carregar organização
        const { data: org } = await supabase.from('organizations').select('name, plan_tier').eq('id', currentOrgId).single();
        if (org) {
          setCompanyName(org.name || '');
          setPlanTier(org.plan_tier || 'starter');
        }

        // Carregar configurações de horário e notificações
        const data = await fetchOrganizationSettings(currentOrgId);
        if (data) {
          if (data.schedule && Array.isArray(data.schedule)) {
            setSchedule(data.schedule);
          }
          if (data.outOfHoursMsg) {
            setOutOfHoursMsg(data.outOfHoursMsg);
          }
          if (typeof data.notifyHandoverEmail === 'boolean') {
            setNotifyHandoverEmail(data.notifyHandoverEmail);
          }
          if (typeof data.notifyHandoverWhatsApp === 'boolean') {
            setNotifyHandoverWhatsApp(data.notifyHandoverWhatsApp);
          }
        }
      } catch (err: any) {
        console.error('Erro ao carregar configurações:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);

    try {
      const supabase = createClient();
      if (userId) {
        await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId);
      }
      if (orgId) {
        await supabase.from('organizations').update({ name: companyName }).eq('id', orgId);
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Salvar no Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        schedule,
        outOfHoursMsg,
        notifyHandoverEmail,
        notifyHandoverWhatsApp,
        updated_at: new Date().toISOString()
      };

      const success = await updateOrganizationSettings(orgId, payload);
      if (success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      } else {
        setErrorMessage('Não foi possível salvar as alterações no banco de dados.');
      }
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      setErrorMessage(err.message || 'Erro inesperado ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="font-sans">
      <Header
        title="Configurações Gerais"
        subtitle="Ajuste horários de atendimento, mensagens de ausência e alertas de notificação"
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {savedSuccess && (
          <div className="bg-[#F4F5F4] border border-[#00E676] text-[#2E7D5A] px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50">
            <Check className="w-4 h-4 text-[#00E676]" />
            <span>Configurações salvas e aplicadas com sucesso no Supabase!</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <span>{errorMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E0E3E1] text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: '#00E676' }} />
            <p className="text-xs text-[#4D4D61]">Carregando configurações da empresa...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile & Account Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0E3E1] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#171901] font-bold text-sm pb-3 border-b border-[#E0E3E1]">
            <User className="w-4 h-4" style={{ color: '#2E7D5A' }} />
            <span>Meu Perfil & Dados da Conta</span>
          </div>

          {profileSuccess && (
            <div className="bg-[#F4F5F4] border border-[#00E676] text-[#2E7D5A] px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in-50">
              <Check className="w-4 h-4 text-[#00E676]" />
              <span>Dados do perfil atualizados com sucesso!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171901] mb-1">Seu Nome Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Tiago Taurian"
                className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs text-[#171901] focus:outline-none focus:border-[#00E676]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171901] mb-1">Nome da Empresa / Loja</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Taurians Consult"
                className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs text-[#171901] focus:outline-none focus:border-[#00E676]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171901] mb-1">E-mail de Login</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs text-[#4D4D61] cursor-not-allowed opacity-80"
              />
              <p className="text-[10px] text-[#4D4D61] mt-1">E-mail autenticado via Supabase Auth.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171901] mb-1">Plano Atual</label>
              <div className="flex items-center justify-between p-2.5 bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl">
                <span className="text-xs font-extrabold capitalize text-[#2E7D5A]">
                  Plano {planTier}
                </span>
                <a
                  href="https://www.asaas.com/c/ukq2r3jczggrhibc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold px-3 py-1.5 rounded-lg text-[#171901] transition-all hover:opacity-90 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
                >
                  {planTier === 'starter' ? '⚡ Fazer Upgrade (Pro)' : 'Gerenciar Assinatura'}
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="px-5 py-2.5 rounded-xl bg-[#171901] hover:bg-[#4D4D61] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingProfile ? 'Salvando Perfil...' : 'Salvar Dados do Perfil'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

            {/* Operating Hours Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E0E3E1] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#171901] font-bold text-sm pb-3 border-b border-[#E0E3E1]">
                <Clock className="w-4 h-4" style={{ color: '#2E7D5A' }} />
                <span>Horário de Funcionamento Comercial</span>
              </div>

              <p className="text-xs text-[#4D4D61]">
                Fora destes horários, o atendente virtual enviará automaticamente a mensagem de ausência configurada abaixo.
              </p>

              <div className="space-y-2.5 pt-2">
                {schedule.map((item, idx) => (
                  <div
                    key={item.day}
                    className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#F4F5F4] border border-[#E0E3E1]"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <input
                        type="checkbox"
                        checked={item.active}
                        onChange={(e) => {
                          const updated = [...schedule];
                          updated[idx].active = e.target.checked;
                          setSchedule(updated);
                        }}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#00E676' }}
                      />
                      <span className="text-xs font-semibold text-[#171901] min-w-[120px]">{item.day}</span>
                    </div>

                    {item.active ? (
                      <div className="flex items-center gap-2 text-xs text-[#4D4D61]">
                        <span>Abre às</span>
                        <input
                          type="time"
                          value={item.open}
                          onChange={(e) => {
                            const updated = [...schedule];
                            updated[idx].open = e.target.value;
                            setSchedule(updated);
                          }}
                          className="bg-white border border-[#E0E3E1] rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-[#00E676] text-[#171901]"
                        />
                        <span>Fecha às</span>
                        <input
                          type="time"
                          value={item.close}
                          onChange={(e) => {
                            const updated = [...schedule];
                            updated[idx].close = e.target.value;
                            setSchedule(updated);
                          }}
                          className="bg-white border border-[#E0E3E1] rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-[#00E676] text-[#171901]"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-[#4D4D61]/60 font-medium">Fechado o dia todo</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <label className="block text-xs font-bold text-[#171901] mb-1.5">Mensagem de Fora do Horário</label>
                <textarea
                  rows={3}
                  value={outOfHoursMsg}
                  onChange={(e) => setOutOfHoursMsg(e.target.value)}
                  className="w-full bg-[#F4F5F4] border border-[#E0E3E1] rounded-xl px-3.5 py-2.5 text-xs text-[#171901] focus:outline-none focus:border-[#00E676] leading-relaxed"
                />
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#E0E3E1] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#171901] font-bold text-sm pb-3 border-b border-[#E0E3E1]">
                <Bell className="w-4 h-4" style={{ color: '#2E7D5A' }} />
                <span>Notificações de Transferência (Handover)</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4F5F4] border border-[#E0E3E1] cursor-pointer hover:border-[#00E676]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#4D4D61]" />
                    <div>
                      <p className="text-xs font-semibold text-[#171901]">Notificação por E-mail</p>
                      <p className="text-[11px] text-[#4D4D61]">Enviar e-mail para a equipe quando a IA solicitar atendimento humano.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyHandoverEmail}
                    onChange={(e) => setNotifyHandoverEmail(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#00E676' }}
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4F5F4] border border-[#E0E3E1] cursor-pointer hover:border-[#00E676]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-[#4D4D61]" />
                    <div>
                      <p className="text-xs font-semibold text-[#171901]">Alerta Sonoro no Painel da Equipe</p>
                      <p className="text-[11px] text-[#4D4D61]">Emitir bip sonoro no Inbox quando uma nova conversa precisar de intervenção.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyHandoverWhatsApp}
                    onChange={(e) => setNotifyHandoverWhatsApp(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#00E676' }}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 hover:opacity-90 disabled:opacity-50 text-[#171901]"
                style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações Gerais</span>
                  </>
                )}
              </button>
            </div>

          </form>
          </div>
        )}

      </div>
    </div>
  );
}
