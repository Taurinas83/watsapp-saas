'use client';

import React, { useEffect, useState } from 'react';
import { ScrollText, Clock, RefreshCw, Filter, Search, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AdminAuditLog } from '@/types';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('all');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('admin_audit_logs')
        .select(`
          id,
          admin_id,
          action,
          target_type,
          target_id,
          details,
          ip_address,
          created_at,
          profiles:admin_id (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filterAction !== 'all') {
        query = query.eq('action', filterAction);
      }

      const { data, error } = await query;
      if (error) throw error;

      setLogs((data || []).map((l: any) => ({
        id: l.id,
        admin_id: l.admin_id,
        admin_name: l.profiles?.full_name || 'Admin',
        admin_email: l.profiles?.email || '',
        action: l.action,
        target_type: l.target_type,
        target_id: l.target_id,
        details: l.details || {},
        ip_address: l.ip_address,
        created_at: l.created_at,
      })));
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filterAction]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-[#111B21]">Logs de Auditoria Administrativa</h2>
          <p className="text-xs text-[#667781] mt-0.5">
            Trilha imutável de todas as ações de gestão executadas por administradores da plataforma.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#128C7E] bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.75} />
          <span>Atualizar Trilha</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#667781]" strokeWidth={1.75} />
          <span className="text-xs font-semibold text-[#111B21]">Filtrar por Ação:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 text-[#111B21] focus:bg-white"
          >
            <option value="all">Todas as Ações</option>
            <option value="tenant.status_change">Mudança de Status (tenant.status_change)</option>
            <option value="tenant.plan_change">Alteração de Plano (tenant.plan_change)</option>
            <option value="tenant.impersonate">Impersonação (tenant.impersonate)</option>
          </select>
        </div>
        <span className="text-xs text-[#667781]">Exibindo {logs.length} registros</span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-[#667781]">
                <th className="py-3 px-5">Data / Hora</th>
                <th className="py-3 px-5">Administrador</th>
                <th className="py-3 px-5">Ação Executada</th>
                <th className="py-3 px-5">Alvo</th>
                <th className="py-3 px-5">Payload / Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#667781]">
                    Carregando trilha de auditoria...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#667781]">
                    Nenhum log de auditoria encontrado.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 text-[#667781] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                        <span>{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-[#111B21]">{log.admin_name}</div>
                      <div className="text-[10px] text-[#667781]">{log.admin_email}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#111B21] border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-[#667781]">
                      {log.target_type}: {log.target_id.slice(0, 8)}...
                    </td>
                    <td className="py-3.5 px-5">
                      <pre className="font-mono text-[10px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 max-w-sm overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
