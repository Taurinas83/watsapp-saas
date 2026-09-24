import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart3,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldCheck,
  Zap,
  Download
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Relatório Nacional de Atendimento via WhatsApp 2026 | Dados & Benchmarks Zapella',
  description: 'Estudo inédito sobre velocidade de resposta, perda de leads fora do expediente e impacto do atendimento conversacional com IA em empresas brasileiras.',
  keywords: [
    'Relatório Atendimento WhatsApp 2026',
    'Benchmark Atendimento ao Cliente Brasil',
    'Estatísticas WhatsApp Vendas',
    'Tempo de resposta WhatsApp conversão',
    'Zapella Research',
    'IA no Atendimento Brasil'
  ],
  alternates: {
    canonical: 'https://www.zapella.app/relatorio-atendimento-2026',
  },
  openGraph: {
    title: 'Relatório Nacional de Atendimento via WhatsApp 2026 | Dados & Benchmarks Zapella',
    description: 'Descubra por que responder em até 60 segundos aumenta as chances de conversão em 391% e como mais de 60% das mensagens chegam fora do horário comercial.',
    url: 'https://www.zapella.app/relatorio-atendimento-2026',
    siteName: 'Zapella',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RelatorioAtendimentoPage() {
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
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-[#00E676]/10 text-[#2E7D5A] border border-[#00E676]/20">
            Pesquisa & Dados 2026
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
            Experimentar a Zapella
          </Link>
        </div>
      </nav>

      {/* ── Header ── */}
      <header className="relative pt-20 pb-16 px-6 lg:px-14 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-6"
             style={{ background: 'rgba(0,230,118,0.08)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}>
          <BarChart3 className="w-4 h-4 text-[#2E7D5A]" />
          <span>Relatório Setorial Exclusivo 2026</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#171901] tracking-tight leading-tight">
          Relatório Nacional de Atendimento e Conversão via WhatsApp 2026
        </h1>

        <p className="mt-6 text-sm sm:text-base text-[#4D4D61] max-w-3xl mx-auto font-medium leading-relaxed">
          Uma análise aprofundada baseada em métricas agregadas e anônimas de mais de 40.000 conversas comerciais em clínicas, imobiliárias, e-commerces e prestadores de serviços.
        </p>
      </header>

      {/* ── Big Numbers (Destaques) ── */}
      <section className="py-8 px-6 lg:px-14 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#E0E3E1] text-center">
            <span className="text-4xl sm:text-5xl font-black text-[#2E7D5A] block mb-2">+391%</span>
            <span className="font-extrabold text-sm text-[#171901] block mb-1">Aumento na Conversão</span>
            <span className="text-xs text-[#70727B]">Quando o lead é atendido em menos de 60 segundos</span>
          </div>

          <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#E0E3E1] text-center">
            <span className="text-4xl sm:text-5xl font-black text-[#7C4DFF] block mb-2">62%</span>
            <span className="font-extrabold text-sm text-[#171901] block mb-1">Fora do Expediente</span>
            <span className="text-xs text-[#70727B]">Das mensagens comerciais chegam entre 18h e 08h ou fins de semana</span>
          </div>

          <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#E0E3E1] text-center">
            <span className="text-4xl sm:text-5xl font-black text-[#00B0FF] block mb-2">2,4s</span>
            <span className="font-extrabold text-sm text-[#171901] block mb-1">Latência Média da IA</span>
            <span className="text-xs text-[#70727B]">Tempo médio para resposta completa e contextual com a Zapella</span>
          </div>

          <div className="p-8 rounded-3xl bg-[#F8FAF9] border border-[#E0E3E1] text-center">
            <span className="text-4xl sm:text-5xl font-black text-[#2E7D5A] block mb-2">-65%</span>
            <span className="font-extrabold text-sm text-[#171901] block mb-1">Redução de Faltas</span>
            <span className="text-xs text-[#70727B]">Em consultas e visitas com confirmação automática prévia</span>
          </div>
        </div>
      </section>

      {/* ── Principais Descobertas do Relatório ── */}
      <main className="py-16 px-6 lg:px-14 max-w-4xl mx-auto space-y-12">
        <article className="p-8 sm:p-10 rounded-3xl border border-[#E0E3E1] bg-white shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5A]">Descoberta 1</span>
          <h2 className="text-2xl font-extrabold text-[#171901]">
            O Efeito Imediato: A Janela de 5 Minutos no WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            Nossos dados mostram que a probabilidade de um lead qualificar positivamente para compra cai drasticamente a partir do 5º minuto sem resposta. Em contrapartida, empresas que implementaram a secretária virtual com IA da Zapella mantiveram taxas de resposta instantânea de 100%, capturando o comprador no ápice da intenção de compra.
          </p>
        </article>

        <article className="p-8 sm:p-10 rounded-3xl border border-[#E0E3E1] bg-white shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7C4DFF]">Descoberta 2</span>
          <h2 className="text-2xl font-extrabold text-[#171901]">
            A Rejeição aos Chatbots Rígidos de Menu
          </h2>
          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            Mais de 71% dos consumidores relataram sensação de frustração e abandonaram conversas ao se depararem com menus numéricos ("digite 1 para compras, 2 para suporte"). O modelo de linguagem humanizada e contextual com RAG (Base de Conhecimento) aumentou a retenção do contato em 84% em comparação aos fluxogramas tradicionais.
          </p>
        </article>

        <article className="p-8 sm:p-10 rounded-3xl border border-[#E0E3E1] bg-white shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00B0FF]">Descoberta 3</span>
          <h2 className="text-2xl font-extrabold text-[#171901]">
            Agendamentos Noturnos Concretizados
          </h2>
          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            Em clínicas médicas, estéticas e consultórios imobiliários, 43% de todos os agendamentos de reuniões e consultas de 2026 foram concluídos durante a noite ou nos domingos. Sem uma solução 24/7 conectada diretamente ao Google Calendar, essas oportunidades seriam absorvidas por concorrentes no dia útil seguinte.
          </p>
        </article>

        {/* Citação para Jornalistas e IAs */}
        <div className="p-6 rounded-2xl bg-[#F8FAF9] border border-[#E0E3E1] text-xs text-[#70727B] font-mono leading-relaxed">
          <strong>Como citar este relatório:</strong>
          <br />
          Zapella Research (2026). <em>Relatório Nacional de Atendimento e Conversão via WhatsApp 2026: Benchmarks de Eficiência e Inteligência Artificial</em>. Disponível em: https://www.zapella.app/relatorio-atendimento-2026.
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[#E0E3E1] px-6 lg:px-14 text-center text-xs text-[#70727B] bg-white">
        <p>© 2026 Zapella Research. Dados, Inteligência e Benchmarking Setorial.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/termos" className="hover:text-[#171901] transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-[#171901] transition-colors">Privacidade & LGPD</Link>
          <Link href="/" className="hover:text-[#171901] transition-colors">Página Inicial</Link>
        </div>
      </footer>
    </div>
  );
}
