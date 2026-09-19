'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  QrCode,
  BookOpen,
  Eye,
  BarChart3,
  Settings,
  MessageSquare,
  Sparkles,
  UserCheck,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavProps {
  userRole?: 'admin' | 'operator';
}

export function Navigation({ userRole = 'admin' }: NavProps) {
  const pathname = usePathname();

  const clientPanelItems = [
    {
      name: 'Identidade do Atendente',
      href: '/dashboard/attendant',
      icon: Bot,
      badge: 'Cérebro IA'
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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none z-30">
      {/* App Branding */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight tracking-tight">AtendenteVirtual</h1>
            <p className="text-xs text-emerald-400 font-medium">SaaS WhatsApp AI</p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">

        {/* Section 1: Painel do Cliente (Dono do Negócio) */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>PAINEL DO CLIENTE</span>
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <nav className="space-y-1">
            {clientPanelItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300")} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Painel da Equipe de Atendimento (Inbox) */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>EQUIPE DE ATENDIMENTO</span>
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <nav className="space-y-1">
            {teamPanelItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300")} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / User Profile Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
            WA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Minha Empresa</p>
            <p className="text-[11px] text-slate-400 truncate">Plano Pro (Ativo)</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
