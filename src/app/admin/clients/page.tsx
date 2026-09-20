'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreVertical,
  ArrowUpDown,
  Shield,
  CreditCard,
  Edit,
  Eye,
  LogOut,
  ExternalLink,
  Ban,
  RotateCcw,
  Check,
  X,
  Clock
} from 'lucide-react';
import {
  fetchAdminTenants,
  updateTenantStatus,
  updateTenantPlan,
  TenantListItem,
  PLAN_PRICES
} from '@/lib/admin/actions';
import { OrganizationStatus } from '@/types';

export default function AdminClientsPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [selectedTenant, setSelectedTenant] = useState<TenantListItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  // Form states for modals
  const [newPlan, setNewPlan] = useState('starter');
  const [newMrr, setNewMrr] = useState<number>(97);
  const [suspendReason, setSuspendReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTenants(searchQuery, statusFilter);
      setTenants(data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTenants();
  };

  const handleOpenPlanModal = (tenant: TenantListItem) => {
    setSelectedTenant(tenant);
    setNewPlan(tenant.plan_tier || 'starter');
    setNewMrr(tenant.custom_mrr || PLAN_PRICES[tenant.plan_tier || 'starter'] || 97);
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async () => {
    if (!selectedTenant) return;
    setSubmitting(true);
    try {
      const ok = await updateTenantPlan(selectedTenant.id, newPlan, newMrr);
      if (ok) {
        setIsPlanModalOpen(false);
        loadTenants();
      }
    } catch (err) {
      console.error('Erro ao atualizar plano:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenSuspendModal = (tenant: TenantListItem) => {
    setSelectedTenant(tenant);
    setSuspendReason(tenant.suspended_reason || '');
    setIsSuspendModalOpen(true);
  };

  const handleToggleStatus = async (targetStatus: OrganizationStatus) => {
    if (!selectedTenant) return;
    setSubmitting(true);
    try {
      const ok = await updateTenantStatus(
        selectedTenant.id,
        targetStatus,
        targetStatus === 'suspended' ? suspendReason : undefined
      );
      if (ok) {
        setIsSuspendModalOpen(false);
        loadTenants();
      }
    } catch (err) {
      console.error('Erro ao atualizar status do cliente:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImpersonate = (tenant: TenantListItem) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zapella_impersonate_org', JSON.stringify({
        id: tenant.id,
        name: tenant.name,
      }));
      router.push('/dashboard');
    }
  };

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-[#111B21]">Gestão de Clientes (Tenants)</h2>
          <p className="text-xs text-[#667781] mt-0.5">
            Visualize, altere planos, audite configurações e acerte o status operacional de cada cliente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[#111B21]">
            Total: {tenants.length} tenants
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#667781] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Buscar por empresa, responsável ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#128C7E] focus:bg-white text-[#111B21] transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs w-full sm:w-auto">
            {['all', 'active', 'suspended', 'trialing'].map((status) => {
              const labels: Record<string, string> = {
                all: 'Todos',
                active: 'Ativos',
                suspended: 'Suspensos',
                trialing: 'Em Trial',
              };
              const isSelected = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white text-[#111B21] font-semibold shadow-sm border border-slate-200'
                      : 'text-[#667781] hover:text-[#111B21]'
                  }`}
                >
                  {labels[status]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-[#667781]">
                <th className="py-3 px-5">Empresa / Tenant</th>
                <th className="py-3 px-5">Responsável</th>
                <th className="py-3 px-5">Plano & MRR</th>
                <th className="py-3 px-5">WhatsApp</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#667781]">
                    Carregando base de clientes...
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#667781]">
                    Nenhum cliente encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => {
                  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
                    active: { bg: 'bg-emerald-50', text: 'text-[#128C7E]', border: 'border-emerald-200' },
                    suspended: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
                    trialing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                    canceled: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
                  };
                  const statusStyle = statusColors[tenant.status || 'active'] || statusColors.active;

                  return (
                    <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Empresa */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#111B21] flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.75} />
                          <span className="truncate max-w-[180px]">{tenant.name}</span>
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                          ID: {tenant.id.slice(0, 8)}...
                        </div>
                      </td>

                      {/* Responsável */}
                      <td className="py-3.5 px-5">
                        <div className="font-medium text-[#111B21]">{tenant.ownerName}</div>
                        <div className="text-[10px] text-[#667781] truncate max-w-[160px]">{tenant.ownerEmail}</div>
                      </td>

                      {/* Plano & MRR */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#111B21] uppercase text-[11px]">
                            {tenant.plan_tier || 'starter'}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-[#128C7E] mt-0.5">
                          {formatCurrency(tenant.custom_mrr)}/mês
                        </div>
                      </td>

                      {/* WhatsApp Status */}
                      <td className="py-3.5 px-5">
                        {tenant.attendantConnected ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#128C7E] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                            Conectado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Desconectado
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {tenant.status || 'active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonate */}
                          <button
                            onClick={() => handleImpersonate(tenant)}
                            title="Acessar como Cliente (Impersonate)"
                            className="p-1.5 rounded-lg text-[#667781] hover:text-[#128C7E] hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
                          </button>

                          {/* Change Plan */}
                          <button
                            onClick={() => handleOpenPlanModal(tenant)}
                            title="Alterar Plano & MRR"
                            className="p-1.5 rounded-lg text-[#667781] hover:text-[#111B21] hover:bg-slate-100 transition-colors"
                          >
                            <CreditCard className="w-4 h-4" strokeWidth={1.75} />
                          </button>

                          {/* Suspend / Reactivate */}
                          <button
                            onClick={() => handleOpenSuspendModal(tenant)}
                            title={tenant.status === 'suspended' ? 'Reativar Cliente' : 'Suspender Cliente'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              tenant.status === 'suspended'
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-[#667781] hover:text-red-600 hover:bg-red-50'
                            }`}
                          >
                            {tenant.status === 'suspended' ? (
                              <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
                            ) : (
                              <Ban className="w-4 h-4" strokeWidth={1.75} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Alterar Plano & MRR */}
      {isPlanModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111B21]">Alterar Plano do Tenant</h3>
                <p className="text-xs text-[#667781]">{selectedTenant.name}</p>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#111B21] mb-1.5">Plano Contratado</label>
                <select
                  value={newPlan}
                  onChange={(e) => {
                    const p = e.target.value;
                    setNewPlan(p);
                    setNewMrr(PLAN_PRICES[p] || 97);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                >
                  <option value="starter">Starter - R$ 97,00/mês</option>
                  <option value="pro">Pro - R$ 197,00/mês</option>
                  <option value="enterprise">Enterprise - R$ 397,00/mês</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111B21] mb-1.5">
                  Valor Customizado de MRR (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newMrr}
                  onChange={(e) => setNewMrr(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                />
                <p className="text-[10px] text-[#667781] mt-1">
                  Permite negociar contratos customizados ou descontos diretos.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsPlanModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#667781] hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#128C7E] hover:bg-[#0e7065] transition-colors"
              >
                {submitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Suspender / Reativar Tenant */}
      {isSuspendModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTenant.status === 'suspended' ? 'bg-emerald-50 text-[#128C7E]' : 'bg-red-50 text-red-600'
                }`}>
                  {selectedTenant.status === 'suspended' ? (
                    <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
                  ) : (
                    <Ban className="w-4 h-4" strokeWidth={1.75} />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111B21]">
                    {selectedTenant.status === 'suspended' ? 'Reativar Cliente' : 'Suspender Acesso do Cliente'}
                  </h3>
                  <p className="text-xs text-[#667781]">{selectedTenant.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsSuspendModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedTenant.status !== 'suspended' ? (
                <>
                  <p className="text-[#667781] leading-relaxed">
                    Ao suspender este tenant, o acesso ao painel do cliente e os disparos de mensagens automáticas no WhatsApp serão pausados imediatamente.
                  </p>
                  <div>
                    <label className="block font-semibold text-[#111B21] mb-1.5">
                      Motivo da Suspensão
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Inadimplência na fatura de Setembro / Excesso de volume de spam"
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21]"
                    />
                  </div>
                </>
              ) : (
                <p className="text-[#667781] leading-relaxed">
                  Tem certeza que deseja reativar o acesso de <strong className="text-[#111B21]">{selectedTenant.name}</strong>?
                  O cliente voltará ao status operacional regular imediatamente.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsSuspendModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#667781] hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>

              {selectedTenant.status === 'suspended' ? (
                <button
                  onClick={() => handleToggleStatus('active')}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#128C7E] hover:bg-[#0e7065] transition-colors"
                >
                  {submitting ? 'Reativando...' : 'Confirmar Reativação'}
                </button>
              ) : (
                <button
                  onClick={() => handleToggleStatus('suspended')}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  {submitting ? 'Suspendendo...' : 'Confirmar Suspensão'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
