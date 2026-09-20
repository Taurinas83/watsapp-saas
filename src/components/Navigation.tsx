'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Bot,
  QrCode,
  BookOpen,
  Eye,
  BarChart3,
  Settings,
  MessageSquare,
  UserCheck,
  Building2,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentUserOrganizationId, fetchMonthlyUsage } from '@/lib/supabase/actions';

interface NavProps {
  userRole?: 'admin' | 'operator';
}

export function Navigation({ userRole = 'admin' }: NavProps) {
  const pathname = usePathname();
  const [usage, setUsage] = useState<{ count: number; limit: number; planTier: string }>({
    count: 0,
    limit: 1000,
    planTier: 'starter'
  });

  useEffect(() => {
    async function loadUsage() {
      const orgId = await getCurrentUserOrganizationId();
      if (orgId) {
        const data = await fetchMonthlyUsage(orgId);
        setUsage(data);
      }
    }
    loadUsage();
  }, []);

  const clientPanelItems = [
    {
      name: 'Identidade do Atendente',
      href: '/dashboard/attendant',
      icon: Bot,
      badge: 'IA'
    },
    {
      name: 'Conexão WhatsApp',
      href: '/dashboard/whatsapp',
      icon: QrCode
    },
    {
      name: 'Base de Conhecimento',
      href: '/dashboard/knowledge',
      icon: BookOpen,
      badge: 'RAG'
    },
    {
      name: 'Supervisão de Conversas',
      href: '/dashboard/supervision',
      icon: Eye
    },
    {
      name: 'Métricas & Relatórios',
      href: '/dashboard/metrics',
      icon: BarChart3
    },
    {
      name: 'Configurações Gerais',
      href: '/dashboard/settings',
      icon: Settings
    },
  ];

  const teamPanelItems = [
    {
      name: 'Inbox Unificada',
      href: '/inbox',
      icon: MessageSquare,
      badge: 'Ao Vivo'
    }
  ];

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col h-screen sticky top-0 border-r border-[#E0E3E1] select-none z-30 shadow-sm">

      {/* Zapella Logo */}
      <div className="px-5 py-4 border-b border-[#E0E3E1] flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-md"
               style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            <Image
              src="/zapella-icon.png"
              alt="Zapella Icon"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-extrabold text-[#171901] text-base tracking-tight leading-none">Zapella</span>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: '#2E7D5A' }}>Secretária IA para WhatsApp</p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">

        {/* Section 1: Painel do Cliente */}
        <div>
          <div className="px-3 mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4D4D61]">Painel do Cliente</span>
            <Building2 className="w-3 h-3 text-[#4D4D61]" />
          </div>
          <nav className="space-y-0.5">
            {clientPanelItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                    isActive
                      ? "text-[#171901] font-semibold"
                      : "text-[#4D4D61] hover:text-[#171901] hover:bg-[#F4F5F4]"
                  )}
                  style={isActive ? {
                    backgroundColor: 'rgba(0, 230, 118, 0.10)',
                    borderLeft: '3px solid #00E676',
                    paddingLeft: '9px'
                  } : {}}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn("w-4 h-4 transition-colors shrink-0")}
                      style={{ color: isActive ? '#00E676' : '#4D4D61' }}
                    />
                    <span className="text-xs">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={isActive
                        ? { backgroundColor: 'rgba(0,230,118,0.15)', color: '#2E7D5A' }
                        : { backgroundColor: '#F4F5F4', color: '#4D4D61' }
                      }
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Equipe de Atendimento */}
        <div>
          <div className="px-3 mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4D4D61]">Atendimento</span>
            <UserCheck className="w-3 h-3 text-[#4D4D61]" />
          </div>
          <nav className="space-y-0.5">
            {teamPanelItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                    isActive
                      ? "text-[#171901] font-semibold"
                      : "text-[#4D4D61] hover:text-[#171901] hover:bg-[#F4F5F4]"
                  )}
                  style={isActive ? {
                    backgroundColor: 'rgba(0, 230, 118, 0.10)',
                    borderLeft: '3px solid #00E676',
                    paddingLeft: '9px'
                  } : {}}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className="w-4 h-4 shrink-0 transition-colors"
                      style={{ color: isActive ? '#00E676' : '#4D4D61' }}
                    />
                    <span className="text-xs">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse"
                      style={{ background: '#00E676', color: '#171901' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Usage / Plan Limits Block */}
      <div className="p-3 border-t border-[#E0E3E1] space-y-2 bg-white">
        <div className="p-3 rounded-2xl bg-[#F4F5F4] border border-[#E0E3E1] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#171901]">Consumo de Mensagens</span>
            <span className="font-bold text-[#2E7D5A]">
              {usage.planTier === 'starter' ? `${usage.count} / ${usage.limit}` : `${usage.count} msgs`}
            </span>
          </div>

          {usage.planTier === 'starter' ? (
            <>
              <div className="w-full bg-[#E0E3E1] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((usage.count / usage.limit) * 100))}%`,
                    background: (usage.count / usage.limit) > 0.85 ? '#FF5252' : '#00E676'
                  }}
                />
              </div>

              <div className="pt-1">
                <a
                  href="https://www.asaas.com/c/ukq2r3jczggrhibc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-1.5 px-2 text-center text-[10px] font-extrabold rounded-xl text-[#171901] transition-all hover:opacity-90 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
                >
                  ⚡ Fazer Upgrade (Ilimitado)
                </a>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-[#2E7D5A] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse"></span>
              <span>Mensagens Ilimitadas ({usage.planTier.toUpperCase()})</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / User Info */}
      <div className="p-3 border-t border-[#E0E3E1]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F4F5F4]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}
          >
            ZP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#171901] truncate">Minha Empresa</p>
            <p className="text-[10px] text-[#4D4D61] truncate capitalize">
              Plano {usage.planTier} • Ativo
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
