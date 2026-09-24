import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Kanban,
  CalendarCheck,
  Bot
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Zapella vs. Chatbots Tradicionais: Por que Menus de Botão Perdem Vendas | Comparativo 2026',
  description: 'Entenda a diferença entre chatbots antigos baseados em regras rígidas ("digite 1 ou 2") e a IA conversacional da Zapella com RAG e CRM Kanban nativo.',
  keywords: [
    'Zapella vs Chatbots Tradicionais',
    'Chatbot com Inteligência Artificial WhatsApp',
    'Melhor ferramenta WhatsApp 2026',
    'Chatbot vs Secretária Virtual IA',
    'IA Conversacional WhatsApp',
    'Zapella Comparativo'
  ],
  alternates: {
    canonical: 'https://www.zapella.app/comparativo/zapella-vs-chatbots-tradicionais',
  },
  openGraph: {
    title: 'Zapella vs. Chatbots Tradicionais: Comparativo Completo 2026',
    description: 'Por que clientes odeiam menus numéricos de WhatsApp e como a IA humanizada da Zapella converte 3x mais.',
    url: 'https://www.zapella.app/comparativo/zapella-vs-chatbots-tradicionais',
    siteName: 'Zapella',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function ZapellaVsChatbotsPage() {
  const comparisonRows = [
    {
      feature: 'Experiência de Atendimento',
      traditional: 'Menus robóticos: "Digite 1 para compras, 2 para suporte". Se o cliente digita outra coisa, o bot trava.',
      zapella: 'IA Conversacional Fluida. O cliente conversa em áudio ou texto natural e a IA compreende a intenção de imediato.'
    },
    {
      feature: 'Resolução de Dúvidas Complexas',
      traditional: 'Respostas prontas limitadas a opções pré-programadas em diagramas complexos.',
      zapella: 'Base de Conhecimento RAG sem alucinações. Lê tabelas de preço, cardápios e regras da empresa em milissegundos.'
    },
    {
      feature: 'Gestão de Oportunidades & Vendas',
      traditional: 'Nenhum funil visual. As conversas ficam perdidas no WhatsApp Web sem controle de negociação.',
      zapella: 'CRM Kanban Nativo. Cada novo contato é automaticamente categorizado em colunas com valor da venda.'
    },
    {
      feature: 'Agendamento de Horários',
      traditional: 'O bot manda o cliente ligar ou esperar uma secretária humana.',
      zapella: 'Integração direta com Google Calendar e Calendly com links inteligentes e confirmação automática.'
    },
    {
      feature: 'Proteção Antiban no WhatsApp',
      traditional: 'Disparos em massa em rajada que provocam bloqueio rápido do chip pela Meta.',
      zapella: 'Proteção Antiban com delay humanizado dinâmico (15 a 30s) e custo zero de IA para mensagens em grupos.'
    },
    {
      feature: 'Intervenção Humana (Handover)',
      traditional: 'Cliente fica preso em loops infinitos sem conseguir falar com uma pessoa.',
      zapella: 'Detecção instantânea de sentimento e palavras-chave ("atendente", "falar com humano") com transbordo imediato.'
    },
    {
      feature: 'Tempo de Configuração',
      traditional: 'Dias desenhando árvores de decisão em fluxogramas intermináveis.',
      zapella: 'Pronto em 3 minutos: escaneie o QR Code, preencha sua Base de Conhecimento e a secretária está no ar.'
    }
  ];

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
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-[#7C4DFF]/10 text-[#7C4DFF] border border-[#7C4DFF]/20">
            Comparativo 2026
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

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-20 px-6 lg:px-14 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-8"
             style={{ background: 'rgba(124,77,255,0.08)', borderColor: 'rgba(124,77,255,0.30)', color: '#7C4DFF' }}>
          <Sparkles className="w-4 h-4 text-[#7C4DFF]" />
          <span>Análise Comparativa de Tecnologia de Atendimento</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#171901] tracking-tight max-w-5xl mx-auto leading-[1.12]">
          Por que clientes odeiam chatbots tradicionais e{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            amam a Zapella?
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#4D4D61] max-w-3xl mx-auto font-medium leading-relaxed">
          Chatbots baseados em árvores de botões ("digite 1 ou 2") foram criados em 2018 e afastam seus clientes. Em 2026, quem vende no WhatsApp usa IA conversacional com RAG, Funil Kanban e agendamento instantâneo.
        </p>
      </section>

      {/* ── Tabela Comparativa Detalhada ── */}
      <section className="pb-24 px-6 lg:px-14 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-[#E0E3E1] bg-white overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#F8FAF9] border-b border-[#E0E3E1] p-6 text-sm font-extrabold text-[#171901]">
            <div className="md:col-span-3">Critério de Avaliação</div>
            <div className="md:col-span-4 text-red-600 flex items-center gap-2 mt-2 md:mt-0">
              <XCircle className="w-4 h-4" />
              <span>Chatbots de Menu Tradicional</span>
            </div>
            <div className="md:col-span-5 text-[#2E7D5A] flex items-center gap-2 mt-2 md:mt-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zapella (Secretária Virtual com IA)</span>
            </div>
          </div>

          <div className="divide-y divide-[#E0E3E1]">
            {comparisonRows.map((row, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 p-6 gap-4 items-start text-xs sm:text-sm hover:bg-[#F8FAF9]/50 transition-colors">
                <div className="md:col-span-3 font-bold text-[#171901]">
                  {row.feature}
                </div>
                <div className="md:col-span-4 text-[#70727B] leading-relaxed pr-2">
                  <span className="md:hidden font-bold text-red-500 block mb-1">Chatbot Antigo:</span>
                  {row.traditional}
                </div>
                <div className="md:col-span-5 font-semibold text-[#171901] leading-relaxed bg-[#00E676]/5 p-3 rounded-xl border border-[#00E676]/20">
                  <span className="md:hidden font-bold text-[#2E7D5A] block mb-1">Zapella IA:</span>
                  {row.zapella}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Os Três Diferenciais Únicos da Zapella ── */}
      <section className="py-20 bg-[#F8FAF9] border-y border-[#E0E3E1] px-6 lg:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C4DFF]">Diferencial Tecnológico</span>
            <h2 className="text-3xl font-extrabold text-[#171901] tracking-tight mt-2">
              Os 3 pilares que tornam a Zapella imbatível em 2026
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center font-black text-xl mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Motor Cognitivo Híbrido</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Integração automática com Google Gemini 2.5 Flash, Groq Llama 3.3 e Claude. Respostas em 2,4 segundos com precisão humana, sem respostas engessadas ou alucinações.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#7C4DFF]/10 text-[#7C4DFF] flex items-center justify-center font-black text-xl mb-6">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Funil Kanban Integrado</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Você não precisa pagar outro software de CRM por fora (como HubSpot ou RD Station). Cada contato no WhatsApp vira um card arrastável com valor estimado de venda.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#00B0FF]/10 text-[#0091EA] flex items-center justify-center font-black text-xl mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Segurança Nível Bancário</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Isolamento total de dados via Row Level Security (RLS) no PostgreSQL. Os dados e conversas da sua empresa são 100% blindados e inacessíveis para terceiros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final de Conversão ── */}
      <section className="py-24 px-6 lg:px-14 max-w-5xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl text-white relative overflow-hidden shadow-2xl"
             style={{ background: 'linear-gradient(135deg, #171901 0%, #201335 100%)' }}>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Modernize seu WhatsApp em menos de 3 minutos
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 font-medium">
              Abandone as árvores de botões do passado. Ofereça uma experiência conversacional de primeiro mundo para seus clientes agora mesmo.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[#171901] font-extrabold text-sm shadow-xl transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
            >
              <span>Testar a Zapella Grátis por 7 Dias</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="mt-4 text-xs text-gray-400">
              Sem fidelidade • Cancele quando quiser com 1 clique
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[#E0E3E1] px-6 lg:px-14 text-center text-xs text-[#70727B] bg-white">
        <p>© 2026 Zapella. A nova geração de automação e CRM para WhatsApp.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/termos" className="hover:text-[#171901] transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-[#171901] transition-colors">Privacidade & LGPD</Link>
          <Link href="/" className="hover:text-[#171901] transition-colors">Página Inicial</Link>
        </div>
      </footer>
    </div>
  );
}
