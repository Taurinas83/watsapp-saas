'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { getSuperAdminProfile } from '@/lib/admin/actions';
import { Profile } from '@/types';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const adminProfile = await getSuperAdminProfile();
        if (!isMounted) return;

        if (!adminProfile || !adminProfile.is_super_admin) {
          setUnauthorized(true);
        } else {
          setProfile(adminProfile);
        }
      } catch (err) {
        if (isMounted) setUnauthorized(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#128C7E] animate-spin" strokeWidth={1.75} />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667781]">
            Validando Acesso de Super Administrador...
          </p>
        </div>
      </div>
    );
  }

  if (unauthorized || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h2 className="text-lg font-bold text-[#111B21] mb-2">Acesso Restrito (God Mode)</h2>
          <p className="text-xs text-[#667781] leading-relaxed mb-6">
            Esta área é restrita exclusivamente aos super administradores da plataforma Zapella.
            Seu usuário atual não possui os privilégios de acesso necessários.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#128C7E] hover:bg-[#0e7065] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
              Retornar ao Painel do Cliente
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-[#667781] hover:text-[#111B21] hover:bg-slate-50 transition-colors"
            >
              Alternar de Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
