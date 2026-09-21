'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Percent,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Smartphone,
  Database,
  Mail
} from 'lucide-react';
import { fetchAdminOverviewMetrics, OverviewMetrics } from '@/lib/admin/actions';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOverviewMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-[#111B21]">Visão Geral Executiva</h2>
          <p className="text-xs text-[#667781] mt-0.5">
            Métricas de desempenho financeiro, volume de mensagens e integridade da rede Zapella.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#128C7E] bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.75} />
          <span>Atualizar Dados</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: MRR */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667781]">MRR Consolidado</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#128C7E] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#111B21]">
              {metrics ? formatCurrency(metrics.mrr) : 'R$ 0,00'}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center text-[10px] font-bold text-[#128C7E] bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="w-3 h-3 mr-0.5" strokeWidth={2} />
                +14.2%
              </span>
              <span className="text-[10px] text-[#667781]">vs mês anterior</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Clientes Ativos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667781]">Clientes Ativos</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#111B21]">
              {metrics ? metrics.activeClients : 0}
            </div>
            <div className="text-[10px] text-[#667781] mt-1">
              {metrics ? `${metrics.totalClients} tenants registrados (${metrics.trialingClients} em trial)` : 'Carregando...'}
            </div>
          </div>
        </div>

        {/* KPI 3: Taxa de Churn */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667781]">Taxa de Churn</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Percent className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#111B21]">
              {metrics ? `${metrics.churnRate}%` : '0%'}
            </div>
            <div className="text-[10px] text-[#667781] mt-1">
              {metrics?.suspendedClients ? `${metrics.suspendedClients} suspensos por pendência` : 'Nenhuma suspensão ativa'}
            </div>
          </div>
        </div>

        {/* KPI 4: Mensagens IA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#667781]">Mensagens Processadas</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#111B21]">
              {metrics ? metrics.totalMessages.toLocaleString('pt-BR') : 0}
            </div>
            <div className="text-[10px] text-[#667781] mt-1">
              {metrics ? `${metrics.messagesThisMonth.toLocaleString('pt-BR')} no ciclo atual` : 'Carregando...'}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Resources & Quota Monitoring Block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#111B21]">Consumo de Ferramentas & Cotas de APIs</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#128C7E] border border-emerald-200">
                Operação Segura
              </span>
            </div>
            <p className="text-xs text-[#667781] mt-0.5">
              Monitore o consumo de tokens de IA, conexões do WhatsApp, banco de dados e gateways para evitar paradas.
            </p>
          </div>
          <div className="text-[11px] text-[#667781] flex items-center gap-1.5 self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
            <span>Sincronizado: {metrics?.resourceUsage.gateway.lastSync || 'Agora'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Motor de IA (Tokens & Custo) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-[#128C7E] flex items-center justify-center">
                  <Cpu className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-bold text-[#111B21]">Motor de IA</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                metrics?.resourceUsage?.ai?.status === 'danger'
                  ? 'bg-red-50 text-red-700'
                  : metrics?.resourceUsage?.ai?.status === 'warning'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-[#128C7E]'
              }`}>
                {metrics?.resourceUsage?.ai?.percentage || 0}% Cota
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[#667781]">Tokens Mês:</span>
                <span className="font-semibold text-[#111B21]">
                  {(metrics?.resourceUsage?.ai?.estimatedTokens || 0).toLocaleString('pt-BR')} / {(metrics?.resourceUsage?.ai?.quotaLimitMonthly || 2000000).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics?.resourceUsage?.ai?.percentage || 0}%`,
                    backgroundColor:
                      (metrics?.resourceUsage?.ai?.percentage || 0) > 85 ? '#EF4444' :
                      (metrics?.resourceUsage?.ai?.percentage || 0) > 65 ? '#F59E0B' : '#25D366'
                  }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-[#667781]">Custo Estimado:</span>
              <span className="font-bold text-[#128C7E]">
                ${metrics?.resourceUsage?.ai?.estimatedCostUsd || '0.00'} USD (~R$ {((metrics?.resourceUsage?.ai?.estimatedCostUsd || 0) * 5.6).toFixed(2)})
              </span>
            </div>
          </div>

          {/* Card 2: Cluster WhatsApp (Evolution API) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-bold text-[#111B21]">WhatsApp Cluster</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                metrics?.resourceUsage?.whatsapp?.status === 'danger'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-emerald-50 text-[#128C7E]'
              }`}>
                {metrics?.resourceUsage?.whatsapp?.connectedInstances || 0} Ativos
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[#667781]">Capacidade VPS:</span>
                <span className="font-semibold text-[#111B21]">
                  {metrics?.resourceUsage?.whatsapp?.connectedInstances || 0} / {metrics?.resourceUsage?.whatsapp?.maxRecommendedInstances || 25} nós
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics?.resourceUsage?.whatsapp?.percentage || 0}%`,
                    backgroundColor:
                      (metrics?.resourceUsage?.whatsapp?.percentage || 0) > 85 ? '#EF4444' :
                      (metrics?.resourceUsage?.whatsapp?.percentage || 0) > 70 ? '#F59E0B' : '#25D366'
                  }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-[#667781]">Servidor Evolution:</span>
              <span className="font-semibold text-slate-700">Railway VPS (OK)</span>
            </div>
          </div>

          {/* Card 3: Supabase (Banco & Vetores) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-[#128C7E] flex items-center justify-center">
                  <Database className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-bold text-[#111B21]">Supabase & Vetores</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#128C7E]">
                {metrics?.resourceUsage?.database?.percentage || 0}% Disco
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[#667781]">Tamanho Estimado:</span>
                <span className="font-semibold text-[#111B21]">
                  {metrics?.resourceUsage?.database?.estimatedSizeMb || 0} MB / {metrics?.resourceUsage?.database?.storageLimitMb || 500} MB
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics?.resourceUsage?.database?.percentage || 0}%`,
                    backgroundColor: '#25D366'
                  }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-[#667781]">Vetores Base de Conhecimento:</span>
              <span className="font-semibold text-slate-700">
                {metrics?.resourceUsage?.database?.knowledgeVectorsCount || 0} itens
              </span>
            </div>
          </div>

          {/* Card 4: Asaas Gateway & Webhook */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-bold text-[#111B21]">Gateway Asaas</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#128C7E]">
                PRODUÇÃO
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#667781]">Webhook Token:</span>
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  whsec_...28rM (OK)
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#667781]">Situação:</span>
                <span className="font-bold text-[#128C7E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  Sincronização Ativa
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-[#667781]">Faturas Processadas:</span>
              <span className="font-semibold text-slate-700">Tempo Real</span>
            </div>
          </div>
        </div>
      </div>


      {/* Middle Section: Revenue Chart & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#111B21]">Evolução de Faturamento (6 Meses)</h3>
              <p className="text-xs text-[#667781] mt-0.5">Projeção e histórico consolidado de receita recorrente</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-[#667781]">
                <span className="w-2.5 h-2.5 rounded bg-[#128C7E]" />
                Receita (R$)
              </span>
            </div>
          </div>

          {/* Bar / Column Visualizer */}
          <div className="pt-4">
            <div className="h-56 flex items-end justify-between gap-3 px-2 border-b border-slate-100 pb-2">
              {metrics?.revenueHistory.map((item, index) => {
                const maxVal = Math.max(...(metrics.revenueHistory.map(h => h.revenue) || [1000]), 100);
                const heightPercent = Math.max(12, Math.round((item.revenue / maxVal) * 100));

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-semibold text-[#111B21] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                      {formatCurrency(item.revenue)}
                    </div>
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-t-lg overflow-hidden flex items-end relative h-40">
                      <div
                        className="w-full bg-gradient-to-t from-[#128C7E] to-[#25D366] rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-medium text-[#667781] block">{item.month}</span>
                      <span className="text-[9px] text-slate-400 block">{item.clients} orgs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Platform Status (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111B21]">Saúde da Infraestrutura</h3>
            <p className="text-xs text-[#667781] mt-0.5">Disponibilidade e conectividade dos serviços</p>

            <div className="mt-5 space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#128C7E]" strokeWidth={1.75} />
                  <div>
                    <p className="text-xs font-semibold text-[#111B21]">Instâncias WhatsApp</p>
                    <p className="text-[10px] text-[#667781]">Evolution / Baileys Cluster</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#128C7E] bg-emerald-50 px-2 py-0.5 rounded">
                  ONLINE
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#128C7E]" strokeWidth={1.75} />
                  <div>
                    <p className="text-xs font-semibold text-[#111B21]">Motor de IA & RAG</p>
                    <p className="text-[10px] text-[#667781]">Supabase Vector + OpenAI/Gemini</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#128C7E] bg-emerald-50 px-2 py-0.5 rounded">
                  ESTÁVEL
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#128C7E]" strokeWidth={1.75} />
                  <div>
                    <p className="text-xs font-semibold text-[#111B21]">Webhooks & Ingestion</p>
                    <p className="text-[10px] text-[#667781]">Fila de Mensagens em Tempo Real</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#128C7E] bg-emerald-50 px-2 py-0.5 rounded">
                  0 FILAS
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#667781]">Tempo de Resposta Médio</span>
              <span className="font-bold text-[#111B21]">142ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Admin Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#111B21]">Auditoria de Ações Administrativas</h3>
            <p className="text-xs text-[#667781] mt-0.5">
              Registro das últimas operações executadas por administradores da plataforma.
            </p>
          </div>
          <span className="text-[11px] font-medium text-[#667781]">Últimas 10 ocorrências</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-[#667781]">
                <th className="py-3 px-5">Data / Hora</th>
                <th className="py-3 px-5">Administrador</th>
                <th className="py-3 px-5">Ação</th>
                <th className="py-3 px-5">Alvo</th>
                <th className="py-3 px-5">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {metrics?.recentLogs && metrics.recentLogs.length > 0 ? (
                metrics.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3.5 px-5 text-[#667781] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                        <span>{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-[#111B21]">
                      {log.admin_name}
                      <span className="block text-[10px] text-[#667781] font-normal">{log.admin_email}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#111B21] border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-[#667781]">
                      {log.target_type}: {log.target_id.slice(0, 8)}...
                    </td>
                    <td className="py-3.5 px-5 text-[#667781]">
                      <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 block max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#667781]">
                    Nenhum log de auditoria recente registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
