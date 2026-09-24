import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Cpu,
  Kanban,
  Zap,
  Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Glossário de IA e Automação de WhatsApp 2026 | Zapella',
  description: 'Guia definitivo e termos técnicos sobre Inteligência Artificial, CRM WhatsApp, RAG, Proteção Antiban e Handover explicados de forma simples e direta.',
  keywords: [
    'Glossário IA WhatsApp',
    'O que é RAG WhatsApp',
    'Como evitar banimento WhatsApp Business',
    'O que é Handover no Atendimento',
    'O que é Modo Copiloto IA',
    'Zapella Glossário'
  ],
  alternates: {
    canonical: 'https://www.zapella.app/glossario',
  },
  openGraph: {
    title: 'Glossário de IA e Automação de WhatsApp 2026 | Zapella',
    description: 'Definições objetivas dos principais conceitos de Inteligência Artificial aplicada a vendas e atendimento via WhatsApp.',
    url: 'https://www.zapella.app/glossario',
    siteName: 'Zapella',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function GlossarioPage() {
  const glossaryItems = [
    {
      id: 'rag-whatsapp',
      term: 'O que é RAG (Retrieval-Augmented Generation) no WhatsApp?',
      shortAnswer: 'RAG é uma arquitetura de inteligência artificial que consulta dados reais e atualizados da sua empresa antes de responder ao cliente, garantindo que a IA nunca invente preços, prazos ou regras inexistentes (eliminação de alucinações).',
      details: [
        'Na Zapella, o RAG funciona através da Base de Conhecimento, onde você cadastra perguntas frequentes, cardápios ou tabelas de preços.',
        'A cada nova mensagem do cliente no WhatsApp, a IA busca os trechos relevantes no banco em menos de 100 milissegundos.',
        'A resposta é montada estritamente com base nos dados fornecidos, sem inventar informações fictícias.'
      ]
    },
    {
      id: 'como-evitar-banimento',
      term: 'Como integrar CRM ao WhatsApp sem risco de banimento?',
      shortAnswer: 'Para integrar CRM ao WhatsApp sem risco de banimento, deve-se utilizar instâncias isoladas com proteção inteligente de intervalo humanizado (15 a 30 segundos) entre envios, evitando rajadas simultâneas e disparos massivos para contatos que nunca conversaram com sua empresa.',
      details: [
        'Passo 1: Utilize APIs modernas (como a Evolution API / WhatsApp Business) que respeitam os protocolos de conexão.',
        'Passo 2: Configure delays humanizados randômicos entre mensagens (a Zapella aplica de 15 a 30 segundos em disparos de grupos).',
        'Passo 3: Mantenha interações receptivas com quem já salvou seu contato ou chamou primeiro.',
        'Passo 4: Utilize o Agendador de Grupos com custo zero de tokens de IA para comunidades e lançamentos.'
      ]
    },
    {
      id: 'handover-atendimento',
      term: 'O que é Handover em Chatbots e Atendimento Virtual?',
      shortAnswer: 'Handover é a transferência automática e inteligente da conversa do robô para um atendente humano assim que o sistema detecta intenções complexas, palavras de insatisfação ou quando o cliente solicita expressamente falar com uma pessoa.',
      details: [
        'Gatilhos instantâneos: Palavras como "atendente", "falar com pessoa" ou "reclamação" disparam a transição imediata.',
        'Pausa da IA: O bot suspende o envio automático para que a conversa não sofra interrupções enquanto o operador humano fala.',
        'Status no CRM: A conversa é automaticamente movida para o status "Aguardando Atendente Humano" na Caixa de Entrada.'
      ]
    },
    {
      id: 'modo-copiloto',
      term: 'O que é o Modo Copiloto (Human-in-the-Loop)?',
      shortAnswer: 'O Modo Copiloto é a tecnologia em que a Inteligência Artificial elabora a melhor resposta com base no histórico do cliente e a apresenta como rascunho privativo para a secretária humana, que pode revisar, editar ou enviar com 1 clique sem digitar nada do zero.',
      details: [
        'A secretária mantém o controle 100% humano sobre as mensagens enviadas aos pacientes ou clientes.',
        'Aumenta a velocidade de atendimento em até 400%, economizando horas de digitação repetitiva.',
        'Ideal para clínicas e empresas com procedimentos cirúrgicos ou vendas de alto valor agregado.'
      ]
    },
    {
      id: 'motor-multi-modelo',
      term: 'O que é um Motor de IA Multi-Modelo Híbrido?',
      shortAnswer: 'É uma arquitetura que combina múltiplos modelos de linguagem (como Google Gemini 2.5 Flash, Groq Llama 3.3 70B, DeepSeek V3 e Claude) em uma rota de fallback inteligente, garantindo que o atendimento nunca fique fora do ar mesmo se uma das APIs oscilar.',
      details: [
        'Se o provedor primário demorar mais de 3 segundos, o sistema automaticamente alterna para o modelo secundário.',
        'Combina a ultra-velocidade do Groq/Gemini com a capacidade de raciocínio refinado do Claude.',
        'Garante tempo médio de resposta ao cliente de 2,4 segundos 24 horas por dia.'
      ]
    },
    {
      id: 'crm-kanban-nativo',
      term: 'O que é Funil Kanban Nativo de WhatsApp?',
      shortAnswer: 'É a gestão visual de oportunidades em colunas de arrastar (Lead Novo, Qualificado, Visita Marcada, Proposta, Fechamento) diretamente conectada à lista de conversas do WhatsApp, atualizando o status do cliente em tempo real a cada interação.',
      details: [
        'Dispensa a contratação e sincronização de softwares externos de CRM.',
        'Permite atribuir valor monetário estimado a cada negócio para prever o faturamento mensal.',
        'Possui botão de acesso direto ao chat e anotações internas da equipe sobre o cliente.'
      ]
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
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-[#00E676]/10 text-[#2E7D5A] border border-[#00E676]/20">
            Glossário de IA & Automação
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
            Testar Grátis 7 Dias
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-16 px-6 lg:px-14 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-8"
             style={{ background: 'rgba(0,230,118,0.08)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}>
          <BookOpen className="w-4 h-4 text-[#2E7D5A]" />
          <span>Central de Conhecimento Técnico Oficial</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#171901] tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Glossário de IA e CRM para{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            WhatsApp em 2026
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#4D4D61] max-w-2xl mx-auto font-medium leading-relaxed">
          Respostas diretas e conceitos essenciais sobre Inteligência Artificial, atendimento conversacional, proteção contra bloqueios e funis de vendas no WhatsApp.
        </p>
      </section>

      {/* ── Lista de Termos do Glossário ── */}
      <section className="py-12 px-6 lg:px-14 max-w-5xl mx-auto">
        <div className="space-y-12">
          {glossaryItems.map((item, idx) => (
            <article key={idx} id={item.id} className="p-8 sm:p-10 rounded-3xl border border-[#E0E3E1] bg-white shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5A] mb-2 block">
                Conceito #{idx + 1}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171901] tracking-tight mb-4">
                {item.term}
              </h2>

              {/* Resposta de Primeiros 50 tokens (AEO / Featured Snippet Box) */}
              <div className="p-5 rounded-2xl bg-[#00E676]/5 border border-[#00E676]/20 text-[#171901] font-semibold text-sm sm:text-base leading-relaxed mb-6">
                💡 <span className="font-bold text-[#2E7D5A]">Definição Direta: </span>
                {item.shortAnswer}
              </div>

              {/* Detalhamento Passo a Passo */}
              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#70727B]">
                  Como funciona na prática:
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#4D4D61]">
                  {item.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA Final de Conversão ── */}
      <section className="py-20 px-6 lg:px-14 max-w-5xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl text-white relative overflow-hidden shadow-2xl"
             style={{ background: 'linear-gradient(135deg, #171901 0%, #1A2E22 100%)' }}>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Aplique essa tecnologia no WhatsApp da sua empresa
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-8 font-medium">
              Conecte sua secretária virtual com IA e CRM Kanban em menos de 3 minutos. Teste grátis por 7 dias.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[#171901] font-extrabold text-sm shadow-xl transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
            >
              <span>Começar Teste Grátis Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[#E0E3E1] px-6 lg:px-14 text-center text-xs text-[#70727B] bg-white">
        <p>© 2026 Zapella. Documentação técnica e conceitos de IA para WhatsApp.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/termos" className="hover:text-[#171901] transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-[#171901] transition-colors">Privacidade & LGPD</Link>
          <Link href="/" className="hover:text-[#171901] transition-colors">Página Inicial</Link>
        </div>
      </footer>
    </div>
  );
}
