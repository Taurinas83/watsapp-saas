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
  Clock,
  KeyRound
} from 'lucide-react';
import {
  fetchAdminTenants,
  updateTenantStatus,
  updateTenantPlan,
  updateTenantComplete,
  adminResetUserPassword,
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  // Form states for modals
  const [newPlan, setNewPlan] = useState('starter');
  const [newMrr, setNewMrr] = useState<number>(97);
  const [suspendReason, setSuspendReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form states for Complete Edit Modal
  const [editOrgName, setEditOrgName] = useState('');
  const [editOwnerName, setEditOwnerName] = useState('');
  const [editOwnerEmail, setEditOwnerEmail] = useState('');
  const [editOwnerPhone, setEditOwnerPhone] = useState('');
  const [editPlanTier, setEditPlanTier] = useState('starter');
  const [editStatus, setEditStatus] = useState<OrganizationStatus>('trialing');
  const [editCustomMrr, setEditCustomMrr] = useState<number>(97);
  const [editTrialEndsAt, setEditTrialEndsAt] = useState('');
  const [editSuspendedReason, setEditSuspendedReason] = useState('');

  // Password reset state (Support)
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!selectedTenant?.profileId) {
      alert('Perfil do assinante não encontrado.');
      return;
    }
    if (!resetPasswordVal || resetPasswordVal.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setResetPasswordLoading(true);
    try {
      const ok = await adminResetUserPassword(selectedTenant.profileId, resetPasswordVal);
      if (ok) {
        setResetPasswordSuccess(true);
        setResetPasswordVal('');
        setTimeout(() => setResetPasswordSuccess(false), 6000);
      } else {
        alert('Falha ao redefinir a senha do usuário. Verifique se o perfil existe no Auth.');
      }
    } catch (e) {
      console.error('Erro ao redefinir senha:', e);
      alert('Erro ao redefinir senha.');
    } finally {
      setResetPasswordLoading(false);
    }
  };

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

  const handleOpenEditModal = (tenant: TenantListItem) => {
    setSelectedTenant(tenant);
    setEditOrgName(tenant.name);
    setEditOwnerName(tenant.ownerName !== 'Não informado' ? tenant.ownerName : '');
    setEditOwnerEmail(tenant.ownerEmail !== 'sem-email@zapella.com' ? tenant.ownerEmail : '');
    setEditOwnerPhone(tenant.ownerPhone || '');
    setEditPlanTier(tenant.plan_tier || 'starter');
    setEditStatus((tenant.status as OrganizationStatus) || 'trialing');
    setEditCustomMrr(tenant.custom_mrr || PLAN_PRICES[tenant.plan_tier || 'starter'] || 97);
    setEditTrialEndsAt(
      tenant.trial_ends_at
        ? new Date(tenant.trial_ends_at).toISOString().split('T')[0]
        : new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    );
    setEditSuspendedReason(tenant.suspended_reason || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTenant) return;
    setSubmitting(true);
    try {
      const ok = await updateTenantComplete({
        organizationId: selectedTenant.id,
        organizationName: editOrgName,
        profileId: selectedTenant.profileId,
        ownerName: editOwnerName,
        ownerEmail: editOwnerEmail,
        ownerPhone: editOwnerPhone,
        planTier: editPlanTier,
        status: editStatus,
        customMrr: editCustomMrr,
        trialEndsAt: editTrialEndsAt ? new Date(editTrialEndsAt).toISOString() : null,
        suspendedReason: editStatus === 'suspended' ? editSuspendedReason : null,
      });

      if (ok) {
        setIsEditModalOpen(false);
        loadTenants();
      }
    } catch (err) {
      console.error('Erro ao atualizar assinante:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExtendTrialDays = (days: number) => {
    const currentBase = editTrialEndsAt ? new Date(editTrialEndsAt) : new Date();
    const newDate = new Date(currentBase.getTime() + days * 86400000);
    setEditTrialEndsAt(newDate.toISOString().split('T')[0]);
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
      router.push('/dashboard/attendant');
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
                        {tenant.ownerPhone ? (
                          <a
                            href={`https://wa.me/55${tenant.ownerPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#128C7E] hover:underline mt-0.5"
                            title="Conversar no WhatsApp"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                            <span>{tenant.ownerPhone}</span>
                          </a>
                        ) : (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">Sem WhatsApp</div>
                        )}
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
                        {tenant.status === 'trialing' ? (
                          <div className="space-y-0.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              tenant.trialDaysLeft && tenant.trialDaysLeft > 0
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {tenant.trialDaysLeft && tenant.trialDaysLeft > 0
                                ? `Trial (${tenant.trialDaysLeft}d)`
                                : 'Trial Expirado'}
                            </span>
                            {tenant.trial_ends_at && (
                              <span className="block text-[10px] text-slate-400">
                                Até {new Date(tenant.trial_ends_at).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            {tenant.status === 'active' ? 'Ativo' : tenant.status === 'suspended' ? 'Suspenso' : tenant.status === 'canceled' ? 'Cancelado' : tenant.status}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonate */}
                          <button
                            onClick={() => handleImpersonate(tenant)}
                            title="Acessar como Cliente (Visão do Assinante)"
                            className="p-1.5 rounded-lg text-[#667781] hover:text-[#128C7E] hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
                          </button>

                          {/* Edit Complete Info */}
                          <button
                            onClick={() => handleOpenEditModal(tenant)}
                            title="Editar Cadastro Completo do Assinante"
                            className="p-1.5 rounded-lg text-[#667781] hover:text-[#128C7E] hover:bg-slate-100 transition-colors"
                          >
                            <Edit className="w-4 h-4" strokeWidth={1.75} />
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

      {/* MODAL 0: Editar Cadastro Completo do Assinante */}
      {isEditModalOpen && selectedTenant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#111B21]">Editar Cadastro do Assinante</h3>
                <p className="text-xs text-[#667781]">Atualize dados cadastrais, plano e período de teste.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Nome da Empresa */}
              <div>
                <label className="block font-semibold text-[#111B21] mb-1">Nome da Empresa / Tenant</label>
                <input
                  type="text"
                  value={editOrgName}
                  onChange={(e) => setEditOrgName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                />
              </div>

              {/* Responsável, Email e WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#111B21] mb-1">Nome</label>
                  <input
                    type="text"
                    value={editOwnerName}
                    onChange={(e) => setEditOwnerName(e.target.value)}
                    placeholder="Ex: Ana Maria Silva"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111B21] mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editOwnerEmail}
                    onChange={(e) => setEditOwnerEmail(e.target.value)}
                    placeholder="cliente@empresa.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111B21] mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editOwnerPhone}
                    onChange={(e) => setEditOwnerPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-8888"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                  />
                </div>
              </div>

              {/* Status e Plano */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#111B21] mb-1">Status Operacional</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrganizationStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                  >
                    <option value="trialing">Em Período de Teste (Trial)</option>
                    <option value="active">Ativo (Assinante Regular)</option>
                    <option value="suspended">Suspenso</option>
                    <option value="canceled">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#111B21] mb-1">Plano</label>
                  <select
                    value={editPlanTier}
                    onChange={(e) => {
                      const p = e.target.value;
                      setEditPlanTier(p);
                      setEditCustomMrr(PLAN_PRICES[p] || 97);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                  >
                    <option value="starter">Starter - R$ 97/mês</option>
                    <option value="pro">Pro - R$ 197/mês</option>
                    <option value="enterprise">Enterprise - R$ 397/mês</option>
                  </select>
                </div>
              </div>

              {/* Período de Teste (Trial) */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Período de Teste (Data de Expiração)</span>
                  </label>
                  {selectedTenant.trialDaysLeft !== null && selectedTenant.trialDaysLeft !== undefined && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {selectedTenant.trialDaysLeft > 0 ? `${selectedTenant.trialDaysLeft} dias restantes` : 'Expirado'}
                    </span>
                  )}
                </div>

                <input
                  type="date"
                  value={editTrialEndsAt}
                  onChange={(e) => setEditTrialEndsAt(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-blue-200 bg-white text-[#111B21] font-medium"
                />

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-blue-700 font-semibold">Prorrogar teste:</span>
                  <button
                    type="button"
                    onClick={() => handleExtendTrialDays(7)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-800 text-[11px] font-semibold hover:bg-blue-50 transition-colors shadow-xs"
                  >
                    +7 dias
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExtendTrialDays(15)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-800 text-[11px] font-semibold hover:bg-blue-50 transition-colors shadow-xs"
                  >
                    +15 dias
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExtendTrialDays(30)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-800 text-[11px] font-semibold hover:bg-blue-50 transition-colors shadow-xs"
                  >
                    +30 dias
                  </button>
                </div>
              </div>

              {/* MRR Customizado */}
              <div>
                <label className="block font-semibold text-[#111B21] mb-1">
                  Valor Customizado de MRR (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editCustomMrr}
                  onChange={(e) => setEditCustomMrr(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-[#111B21] font-medium"
                />
              </div>

              {/* Motivo da Suspensão se estiver suspenso */}
              {editStatus === 'suspended' && (
                <div>
                  <label className="block font-semibold text-red-700 mb-1">
                    Motivo da Suspensão
                  </label>
                  <textarea
                    rows={2}
                    value={editSuspendedReason}
                    onChange={(e) => setEditSuspendedReason(e.target.value)}
                    placeholder="Ex: Fatura em atraso ou uso indevido"
                    className="w-full p-2.5 rounded-xl border border-red-200 bg-red-50/30 focus:bg-white text-[#111B21]"
                  />
                </div>
              )}

              {/* Redefinição de Senha (Suporte) */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Redefinir Senha do Assinante (Suporte)</span>
                  </label>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                    Acesso Imediato
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Defina uma nova senha temporária caso o cliente não consiga acessar ou tenha esquecido a senha.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resetPasswordVal}
                    onChange={(e) => setResetPasswordVal(e.target.value)}
                    placeholder="Digite a nova senha (mínimo 6 caracteres)"
                    className="flex-1 p-2 rounded-xl border border-amber-300 bg-white text-[#111B21] font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={resetPasswordLoading || !resetPasswordVal}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors shrink-0 shadow-xs"
                  >
                    {resetPasswordLoading ? 'Alterando...' : 'Definir Senha'}
                  </button>
                </div>
                {resetPasswordSuccess && (
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Senha redefinida com sucesso! Você já pode repassar a nova senha ao cliente.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#667781] hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#128C7E] hover:bg-[#0e7065] transition-colors"
              >
                {submitting ? 'Salvando...' : 'Salvar Dados do Assinante'}
              </button>
            </div>
          </div>
        </div>
      )}

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
