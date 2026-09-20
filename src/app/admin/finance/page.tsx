'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Receipt,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { fetchAdminInvoices } from '@/lib/admin/actions';
import { Invoice } from '@/types';

export default function AdminFinancePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminInvoices(50);
      setInvoices(data);
    } catch (err) {
      console.error('Erro ao buscar faturas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-[#111B21]">Faturamento & Cobrança (Invoices)</h2>
          <p className="text-xs text-[#667781] mt-0.5">
            Acompanhe pagamentos, assinaturas e status de cobrança de todos os tenants.
          </p>
        </div>

        <button
          onClick={loadInvoices}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#128C7E] bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.75} />
          <span>Atualizar Faturas</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-[#667781]">
                <th className="py-3 px-5">Tenant / Cliente</th>
                <th className="py-3 px-5">Valor</th>
                <th className="py-3 px-5">Vencimento</th>
                <th className="py-3 px-5">Gateway</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Comprovante / Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#667781]">
                    Carregando faturas da plataforma...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#667781]">
                    Nenhuma fatura registrada no momento.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const statusColors: Record<string, { bg: string; text: string }> = {
                    paid: { bg: 'bg-emerald-50 text-[#128C7E]', text: 'Pago' },
                    pending: { bg: 'bg-amber-50 text-amber-700', text: 'Pendente' },
                    overdue: { bg: 'bg-red-50 text-red-700', text: 'Vencido' },
                    canceled: { bg: 'bg-slate-100 text-slate-600', text: 'Cancelado' },
                  };
                  const currentStatus = statusColors[inv.status] || statusColors.pending;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-[#111B21]">
                        {inv.organization_name}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-[#111B21]">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="py-3.5 px-5 text-[#667781]">
                        {new Date(inv.due_date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3.5 px-5 capitalize font-medium text-[#667781]">
                        {inv.gateway}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${currentStatus.bg}`}>
                          {currentStatus.text}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {inv.invoice_url ? (
                          <a
                            href={inv.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#128C7E] hover:underline"
                          >
                            <span>Abrir Fatura</span>
                            <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Não disponível</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
