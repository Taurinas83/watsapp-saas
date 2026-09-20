'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, X } from 'lucide-react';

export function ImpersonationBanner() {
  const router = useRouter();
  const [impersonatedOrg, setImpersonatedOrg] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('zapella_impersonate_org');
      if (stored) {
        try {
          setImpersonatedOrg(JSON.parse(stored));
        } catch (e) {
          localStorage.removeItem('zapella_impersonate_org');
        }
      }
    }
  }, []);

  const handleExit = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zapella_impersonate_org');
      router.push('/admin/clients');
    }
  };

  if (!impersonatedOrg) return null;

  return (
    <div className="bg-[#111B21] text-white px-4 py-2 flex items-center justify-between text-xs z-50 sticky top-0 border-b border-amber-400">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-semibold text-amber-300">Modo de Impersonação Ativo:</span>
        <span className="text-slate-200">
          Você está navegando no painel de <strong className="text-white">{impersonatedOrg.name}</strong> ({impersonatedOrg.id.slice(0, 8)}...)
        </span>
      </div>

      <button
        onClick={handleExit}
        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        <span>Encerrar e Voltar ao God Mode</span>
      </button>
    </div>
  );
}
