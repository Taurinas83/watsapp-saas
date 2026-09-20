'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Activity, Search, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AdminHeader({
  title = 'Painel do Super Administrador',
  subtitle = 'Gestão Central da Plataforma Zapella',
}: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Title & System Status */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-sm font-bold text-[#111B21] leading-tight">{title}</h1>
          <p className="text-[11px] text-[#667781] leading-tight mt-0.5">{subtitle}</p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-medium text-[#128C7E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          <span>Sistemas 100% Operacionais</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* God Mode Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F0F2F5] text-[11px] font-semibold text-[#111B21] border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-[#128C7E]" strokeWidth={1.75} />
          <span>God Mode Ativo</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Encerrar Sessão"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#667781] hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
