'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { initialMetrics } from '@/lib/mock-data';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Bot,
  UserCheck
} from 'lucide-react';

export default function MetricsPage() {
  const metrics = initialMetrics;

  return (
    <div>
      <Header
        title="Métricas e Performance de Atendimento"
        subtitle="Analise o desempenho da IA, tempo médio de resposta e produtividade da equipe"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Conversas</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{metrics.totalConversations}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{metrics.weeklyGrowth}% este mês</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tempo Médio Resposta</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{metrics.avgResponseTimeSeconds} segundos</h3>
            <p className="text-[11px] text-slate-400 mt-1">Imediato via Claude IA Engine</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resoluções por IA</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{metrics.aiResolutionRate}%</h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">Sem necessidade de humano</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taxa de Escalonamento</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{metrics.handoverRate}%</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Transferidos para a equipe</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Daily Distribution Chart Mock */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Volume de Atendimentos Semanal (Bot vs Humano)</h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500"></span> IA Bot</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500"></span> Operadores</span>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
              {metrics.conversationsByDay.map((item) => {
                const total = item.bot + item.human;
                const botHeight = (item.bot / 80) * 100;
                const humanHeight = (item.human / 80) * 100;
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full max-w-[40px] flex flex-col items-center gap-0.5 h-full justify-end">
                      <div
                        style={{ height: `${humanHeight}%` }}
                        className="w-full bg-blue-500 rounded-t-md transition-all group-hover:bg-blue-600"
                        title={`Humano: ${item.human}`}
                      ></div>
                      <div
                        style={{ height: `${botHeight}%` }}
                        className="w-full bg-emerald-500 rounded-t-md transition-all group-hover:bg-emerald-600"
                        title={`Bot: ${item.bot}`}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">Assuntos Mais Solicitados</h3>
            
            <div className="space-y-3">
              {metrics.categoryDistribution.map((cat) => {
                const percentage = Math.round((cat.count / 342) * 100);
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat.category}</span>
                      <span>{cat.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="bg-emerald-500 h-full rounded-full"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Operator Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Ranking da Equipe de Atendimento</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Ordenado por atendimentos concluídos</span>
          </div>

          <div className="divide-y divide-slate-100">
            {metrics.operatorRanking.map((op, idx) => (
              <div key={op.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' : idx === 1 ? 'bg-slate-200 text-slate-700' : 'bg-amber-800/10 text-amber-900'
                  }`}>
                    {idx + 1}
                  </span>
                  <img src={op.avatar} alt={op.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{op.name}</h4>
                    <p className="text-[10px] text-slate-400">Avaliação do cliente: ⭐ {op.rating}/5.0</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 text-xs">{op.count} atendimentos</span>
                  <p className="text-[10px] text-emerald-600 font-semibold">100% resolvidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
