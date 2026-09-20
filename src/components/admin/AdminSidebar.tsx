'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Receipt,
  ScrollText,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  adminEmail?: string;
  adminName?: string;
}

export function AdminSidebar({
  adminEmail = 'tiagotaurian@gmail.com',
  adminName = 'Tiago Taurian',
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Visão Geral',
      href: '/admin/overview',
      icon: LayoutDashboard,
      badge: 'KPIs',
    },
    {
      name: 'Gestão de Clientes',
      href: '/admin/clients',
      icon: Users,
    },
    {
      name: 'Faturamento & Planos',
      href: '/admin/finance',
      icon: Receipt,
    },
    {
      name: 'Logs de Auditoria',
      href: '/admin/logs',
      icon: ScrollText,
    },
    {
      name: 'Configurações',
      href: '/admin/settings',
      icon: Sliders,
    },
  ];

  return (
    <aside className="w-[240px] bg-white text-[#111B21] flex flex-col h-screen sticky top-0 border-r border-slate-200 select-none z-30 shrink-0">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin/overview" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #128C7E 0%, #25D366 100%)' }}
          >
            <Image
              src="/zapella-icon.png"
              alt="Zapella Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#111B21] text-sm tracking-tight leading-none">Zapella</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#128C7E] tracking-wider uppercase border border-slate-200">
                GOD
              </span>
            </div>
            <p className="text-[10px] font-medium text-[#667781] mt-0.5 truncate">Super Administrador</p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667781]">
              Administração Central
            </span>
            <ShieldCheck className="w-3 h-3 text-[#667781]" strokeWidth={1.75} />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === '/admin/overview' && pathname === '/admin');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group',
                    isActive
                      ? 'text-[#111B21] font-semibold bg-[#F0F2F5]'
                      : 'text-[#667781] hover:text-[#111B21] hover:bg-slate-50'
                  )}
                  style={
                    isActive
                      ? {
                          borderLeft: '3px solid #25D366',
                          paddingLeft: '9px',
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className="w-4 h-4 shrink-0 transition-colors"
                      strokeWidth={1.75}
                      style={{ color: isActive ? '#128C7E' : '#667781' }}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider"
                      style={
                        isActive
                          ? { backgroundColor: 'rgba(37, 211, 102, 0.15)', color: '#128C7E' }
                          : { backgroundColor: '#F0F2F5', color: '#667781' }
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

        {/* Tenant Environment Shortcut */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#667781]">
              Ambiente do Cliente
            </span>
            <Building2 className="w-3 h-3 text-[#667781]" strokeWidth={1.75} />
          </div>

          <Link
            href="/dashboard"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#667781] hover:text-[#111B21] hover:bg-slate-50 border border-dashed border-slate-200 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-[#667781] group-hover:text-[#128C7E]" strokeWidth={1.75} />
              <span>Painel do Cliente</span>
            </div>
            <span className="text-[10px] text-[#667781]">Tenant</span>
          </Link>
        </div>
      </div>

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F0F2F5]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: 'linear-gradient(135deg, #128C7E 0%, #25D366 100%)' }}
          >
            TT
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#111B21] truncate">{adminName}</p>
            <p className="text-[10px] text-[#667781] truncate">{adminEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
