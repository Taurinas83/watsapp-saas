'use client';

import React, { useEffect, useState } from 'react';
import { Sliders, Save, Shield, AlertTriangle, Bell, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logAdminAction } from '@/lib/admin/actions';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings states
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState('');
  const [starterLimit, setStarterLimit] = useState(1000);
  const [proLimit, setProLimit] = useState(5000);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase.from('platform_settings').select('*');

        if (data) {
          data.forEach((item) => {
            if (item.key === 'maintenance_mode') setMaintenanceMode(item.value?.enabled || false);
            if (item.key === 'global_announcement') setGlobalAnnouncement(item.value?.message || '');
            if (item.key === 'plan_limits') {
              setStarterLimit(item.value?.starter || 1000);
              setProLimit(item.value?.pro || 5000);
            }
          });
        }
      } catch (err) {
        console.error('Erro ao carregar configurações globais:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const supabase = createClient();

      await supabase.from('platform_settings').upsert([
        {
          key: 'maintenance_mode',
          value: { enabled: maintenanceMode },
          updated_at: new Date().toISOString(),
        },
        {
          key: 'global_announcement',
          value: { message: globalAnnouncement },
          updated_at: new Date().toISOString(),
        },
        {
          key: 'plan_limits',
          value: { starter: starterLimit, pro: proLimit },
          updated_at: new Date().toISOString(),
        },
      ]);

      await logAdminAction('platform.settings_update', 'system', 'global_settings', {
        maintenance_mode: maintenanceMode,
        global_announcement: globalAnnouncement,
        plan_limits: { starter: starterLimit, pro: proLimit },
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
        <Loader2 className="w-6 h-6 text-[#128C7E] animate-spin mx-auto mb-2" strokeWidth={1.75} />
        <p className="text-xs text-[#667781]">Carregando parâmetros globais da plataforma...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-[#111B21]">Configurações da Plataforma</h2>
          <p className="text-xs text-[#667781] mt-0.5">
            Defina parâmetros operacionais, avisos globais e limites por plano.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#128C7E] hover:bg-[#0e7065] transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.75} />
              <span>Salvando...</span>
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Salvo com Sucesso</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Avisos e Manutenção */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-[#128C7E]" strokeWidth={1.75} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111B21]">
              Avisos e Disponibilidade
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-[#111B21]">Modo de Manutenção Geral</p>
                <p className="text-[11px] text-[#667781] mt-0.5">
                  Bloqueia o login e o uso da plataforma para todos os clientes, mantendo apenas o God Mode ativo.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 accent-[#128C7E] rounded cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111B21] mb-1.5">
                Comunicado Global para Tenants
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Atualização programada para domingo às 02:00 BRT..."
                value={globalAnnouncement}
                onChange={(e) => setGlobalAnnouncement(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21]"
              />
              <p className="text-[10px] text-[#667781] mt-1">
                Se preenchido, será exibido como aviso no topo de todos os painéis de clientes.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Limites Padrão dos Planos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#128C7E]" strokeWidth={1.75} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111B21]">
              Limites Padrão de Consumo
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111B21] mb-1.5">
                Limite de Mensagens/Mês - Plano Starter
              </label>
              <input
                type="number"
                value={starterLimit}
                onChange={(e) => setStarterLimit(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111B21] mb-1.5">
                Limite de Mensagens/Mês - Plano Pro
              </label>
              <input
                type="number"
                value={proLimit}
                onChange={(e) => setProLimit(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
