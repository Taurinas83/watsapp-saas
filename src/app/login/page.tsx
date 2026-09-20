'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Building, User, CheckCircle2, ShieldCheck } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = createClient();

    try {
      if (isRegister) {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://watsapp-saas.vercel.app';
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
              full_name: fullName,
              company_name: companyName
            }
          }
        });
        if (error) throw error;

        if (data?.user && !data.session) {
          setSuccessMsg('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
          setLoading(false);
          return;
        }

        router.push('/dashboard/attendant');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard/attendant');
      }
    } catch (err: any) {
      console.error('Login Auth:', err?.message);
      setErrorMsg(err?.message || 'Falha na autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-[#E0E3E1] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#171901] placeholder-[#4D4D61]/60 focus:outline-none focus:border-[#00E676] transition-colors";

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#F4F5F4' }}>

      {/* Left decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 flex-col text-white"
           style={{ background: 'linear-gradient(135deg, #171901 0%, #2E7D5A 50%, #7C4DFF 100%)' }}>
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />

        <div className="relative text-center space-y-6 max-w-md">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg"
                 style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
              <Image src="/zapella-icon.png" alt="Zapella" width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-white text-2xl tracking-tight">Zapella</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Sua secretária virtual <span style={{ color: '#00E676' }}>inteligente</span> para WhatsApp
          </h2>
          <p className="text-green-100 text-sm leading-relaxed">
            Automatize o atendimento, responda clientes 24/7 e supervisione conversas em tempo real — tudo em um único painel.
          </p>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { val: '+2.400', label: 'Empresas' },
              { val: '98.2%', label: 'Precisão' },
              { val: '24/7', label: 'Disponível' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-extrabold text-white">{s.val}</p>
                <p className="text-xs text-green-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 sm:px-12">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md"
                 style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
              <Image src="/zapella-icon.png" alt="Zapella" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-[#171901] text-xl tracking-tight">Zapella</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-[#171901] tracking-tight">
              {isRegister ? 'Criar nova conta' : 'Acessar minha conta'}
            </h1>
            <p className="text-xs text-[#4D4D61] mt-1">
              {isRegister ? 'Comece gratuitamente por 7 dias, sem cartão.' : 'Bem-vindo de volta à Zapella.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E0E3E1] p-6 sm:p-8 space-y-5">

            {/* Tab Switcher */}
            <div className="flex bg-[#F4F5F4] p-1 rounded-xl border border-[#E0E3E1]">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all"
                style={!isRegister
                  ? { background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)', color: '#171901', boxShadow: '0 2px 8px rgba(0,230,118,0.20)' }
                  : { color: '#4D4D61' }
                }
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all"
                style={isRegister
                  ? { background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)', color: '#171901', boxShadow: '0 2px 8px rgba(0,230,118,0.20)' }
                  : { color: '#4D4D61' }
                }
              >
                Cadastrar
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="p-3.5 rounded-xl text-xs flex items-center gap-2"
                     style={{ background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.25)', color: '#FF5252' }}>
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl text-xs flex items-center gap-2"
                     style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.25)', color: '#2E7D5A' }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#171901] mb-1">Seu Nome Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#4D4D61] absolute left-3 top-3" />
                      <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                        placeholder="Ex: Ana Maria Silva" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171901] mb-1">Nome da sua Empresa / Loja</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#4D4D61] absolute left-3 top-3" />
                      <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)}
                        placeholder="Ex: Minha Empresa" className={inputClass} />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#171901] mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#4D4D61] absolute left-3 top-3" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="seuemail@empresa.com" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171901] mb-1">Senha</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#4D4D61] absolute left-3 top-3" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className={inputClass} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 text-[#171901] font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group hover:opacity-90 active:scale-98 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)', boxShadow: '0 4px 16px rgba(0,230,118,0.25)' }}
              >
                {loading ? (
                  <span>Carregando...</span>
                ) : (
                  <>
                    <span>{isRegister ? 'Criar Conta na Zapella' : 'Acessar Painel'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[#E0E3E1] text-center">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#4D4D61]">
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#00E676' }} />
                <span>Plataforma protegida com criptografia de ponta a ponta.</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-[#4D4D61] mt-4">
            <Link href="/" className="hover:text-[#171901] transition-colors">← Voltar para o site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
