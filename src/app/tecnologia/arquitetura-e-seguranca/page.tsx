import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Server,
  Database,
  Zap,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  Terminal,
  FileCode,
  Key,
  Layers,
  RefreshCw,
  Clock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Arquitetura e Segurança de Dados da Zapella | Whitepaper Técnico',
  description: 'Documentação técnica sobre a arquitetura de segurança da Zapella: isolamento multi-tenant via Row Level Security (RLS) no PostgreSQL, pipeline RAG sem alucinações e proteção antiban.',
  keywords: [
    'Segurança Zapella',
    'Arquitetura CRM WhatsApp',
    'Row Level Security PostgreSQL WhatsApp',
    'Proteção Antiban WhatsApp Business API',
    'RAG sem alucinações',
    'LGPD WhatsApp SaaS'
  ],
  alternates: {
    canonical: 'https://www.zapella.app/tecnologia/arquitetura-e-seguranca',
  },
  openGraph: {
    title: 'Arquitetura e Segurança de Dados da Zapella | Whitepaper Técnico',
    description: 'Conheça em detalhes como a Zapella protege dados empresariais com isolamento nível bancário e inteligência artificial de alta disponibilidade.',
    url: 'https://www.zapella.app/tecnologia/arquitetura-e-seguranca',
    siteName: 'Zapella',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function ArquiteturaSegurancaPage() {
  return (
    <div className="min-h-screen bg-white text-[#171901] flex flex-col font-sans">
      {/* ── Top Navbar ── */}
      <nav className="py-4 border-b border-[#E0E3E1]/80 px-6 lg:px-14 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-40 shadow-sm">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shrink-0"
               style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            <Image src="/zapella-icon.png" alt="Zapella" width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-[#171901] text-lg tracking-tight">Zapella</span>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-[#171901] text-white">
            Whitepaper Técnico
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4D4D61] hover:text-[#171901] hover:bg-[#F4F5F4] transition-all">
            Entrar
          </Link>
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl text-[#171901] font-extrabold text-xs shadow-md transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
          >
            Acessar Plataforma
          </Link>
        </div>
      </nav>

      {/* ── Header ── */}
      <header className="relative pt-20 pb-16 px-6 lg:px-14 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-6"
             style={{ background: 'rgba(0,230,118,0.08)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}>
          <ShieldCheck className="w-4 h-4 text-[#2E7D5A]" />
          <span>Documento Técnico Oficial de Engenharia</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#171901] tracking-tight leading-tight">
          Arquitetura de Segurança, RLS e{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            Proteção Antiban da Zapella
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-[#4D4D61] max-w-3xl mx-auto font-medium leading-relaxed">
          Este documento descreve as decisões de engenharia, isolamento criptográfico, conformidade com a LGPD e o pipeline de resiliência que sustentam a operação da Zapella.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-[#70727B] font-mono">
          <span>Versão da Especificação: 2026.4</span>
          <span>•</span>
          <span>PostgreSQL 16 com RLS</span>
          <span>•</span>
          <span>SLA de Disponibilidade: 99,9%</span>
        </div>
      </header>

      {/* ── Corpo do Whitepaper ── */}
      <main className="py-12 px-6 lg:px-14 max-w-4xl mx-auto space-y-16">

        {/* 1. Isolamento Multi-Tenant */}
        <section className="p-8 sm:p-10 rounded-3xl border border-[#E0E3E1] bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="text-2xl font-extrabold text-[#171901]">
              Isolamento Multi-Tenant Nível Bancário (PostgreSQL RLS)
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            Diferente de sistemas convencionais que confiam o isolamento de clientes apenas à camada de aplicação (onde um bug de software pode vazar dados de uma empresa para outra), a Zapella implementa **Row Level Security (RLS)** diretamente no kernel do banco de dados relacional.
          </p>

          <div className="p-5 rounded-2xl bg-[#171901] text-gray-200 font-mono text-xs overflow-x-auto leading-relaxed">
            <span className="text-[#00E676]">// Regra de Isolamento Nativo no PostgreSQL:</span>
            <br />
            CREATE POLICY &quot;Messages: isolamento por organizacao&quot;
            <br />
            ON public.messages FOR ALL TO authenticated
            <br />
            USING (organization_id = get_auth_user_organization_id());
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#171901]">Garantias Criptográficas e Operacionais:</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#4D4D61]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span><strong>Zero Permissões Públicas:</strong> A chave anônima (anon) tem exatamente 0 linhas de acesso a mensagens, contatos ou conversas sem autenticação via JWT válido.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span><strong>Privilégio de Backend Seguro:</strong> As rotas de webhook e background usam credenciais restritas (Service Role) que rodam exclusivamente na infraestrutura de nuvem, nunca no navegador do usuário.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span><strong>Triggers Anti-Escalação:</strong> Gatilhos ativos bloqueiam qualquer tentativa de auto-promoção para administrador ou modificação manual de IDs de empresas.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Pipeline RAG Sem Alucinações */}
        <section className="p-8 sm:p-10 rounded-3xl border border-[#E0E3E1] bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7C4DFF]/10 text-[#7C4DFF] flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="text-2xl font-extrabold text-[#171901]">
              Pipeline Cognitivo RAG (Grounding Sem Alucinações)
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            O maior receio de empresas ao adotar Inteligência Artificial no WhatsApp é a possibilidade do modelo inventar informações (alucinar preços ou prometer prazos inexistentes). O cérebro da Zapella foi concebido com uma arquitetura estrita de ancoragem de contexto (Retrieval-Augmented Generation).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E0E3E1]">
              <span className="font-extrabold text-sm text-[#171901] block mb-1">1. Recuperação</span>
              <span className="text-xs text-[#70727B]">Busca vetorial na Base de Conhecimento da empresa em &lt;100ms</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E0E3E1]">
              <span className="font-extrabold text-sm text-[#171901] block mb-1">2. Guardrails</span>
              <span className="text-xs text-[#70727B]">Instruções rígidas de recusa para dados não catalogados</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E0E3E1]">
              <span className="font-extrabold text-sm text-[#171901] block mb-1">3. Mascaramento PII</span>
              <span className="text-xs text-[#70727B]">Filtro automático de CPF, cartão e dados confidenciais (LGPD)</span>
            </div>
          </div>
        </section>

        {/* 3. Motor Multi-Modelo de Alta Disponibilidade */}
        <section className="p-8 sm:p-10 rounded-3xl border border-[#E0E3E1] bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00B0FF]/10 text-[#0091EA] flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="text-2xl font-extrabold text-[#171901]">
              Motor Cognitivo Híbrido com Fallback Automático
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            Nenhuma API individual de IA possui 100% de uptime contínuo. A Zapella implementa um balanceador inteligente com fallback dinâmico entre provedores de ponta mundial:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-[#E0E3E1] flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-[#171901]">Tier 1 — Google Gemini 2.5 Flash</span>
              <span className="text-[#2E7D5A] font-semibold">Velocidade Extrema (Latência: ~1.2s)</span>
            </div>
            <div className="p-4 rounded-xl border border-[#E0E3E1] flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-[#171901]">Tier 2 — Groq Llama 3.3 70B</span>
              <span className="text-[#2E7D5A] font-semibold">Hardware LPU Dedicado (Latência: ~1.0s)</span>
            </div>
            <div className="p-4 rounded-xl border border-[#E0E3E1] flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-[#171901]">Tier 3 — DeepSeek V3 & Claude 3.5</span>
              <span className="text-[#2E7D5A] font-semibold">Raciocínio Profundo e Resolução Complexa</span>
            </div>
          </div>
        </section>

        {/* 4. Proteção Antiban */}
        <section className="p-8 sm:p-10 rounded-3xl border border-[#E0E3E1] bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="text-2xl font-extrabold text-[#171901]">
              Algoritmo de Proteção Antiban com Jitter Humanizado
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            O algoritmo de disparo para grupos de WhatsApp da Zapella emprega técnicas avançadas de evasão de falso-positivo de spam:
          </p>

          <ul className="space-y-2 text-xs sm:text-sm text-[#4D4D61]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
              <span><strong>Intervalo Randômico Adaptativo:</strong> Pausas calculadas entre 15 e 30 segundos entre mensagens, simulando o comportamento de digitação de um ser humano.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
              <span><strong>Descarte Anti-Histórico:</strong> Mensagens antigas com mais de 3 minutos são automaticamente descartadas caso a conexão reconecte, impedindo rajadas de disparos em atraso.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
              <span><strong>Token-Free para Comunidades:</strong> Mensagens agendadas para avisos em grupos rodam diretamente sem custo de tokens de IA, viabilizando lançamentos de grande escala.</span>
            </li>
          </ul>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[#E0E3E1] px-6 lg:px-14 text-center text-xs text-[#70727B] bg-[#F8FAF9]">
        <p>© 2026 Zapella. Documentação Técnica & Engenharia de Sistemas.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/termos" className="hover:text-[#171901] transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-[#171901] transition-colors">Privacidade & LGPD</Link>
          <Link href="/" className="hover:text-[#171901] transition-colors">Página Inicial</Link>
        </div>
      </footer>
    </div>
  );
}
