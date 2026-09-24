import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building2,
  Home,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Key,
  MapPin,
  Filter,
  DollarSign
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'CRM WhatsApp para Imobiliárias e Corretores de Imóveis | Zapella',
  description: 'Automatize o atendimento da sua imobiliária no WhatsApp. Qualifique leads em 30 segundos, envie opções de imóveis 24h e agende visitas no Google Calendar.',
  keywords: [
    'CRM WhatsApp Imobiliárias',
    'Automação de WhatsApp para Corretores',
    'Chatbot Imobiliário com IA',
    'Atendimento 24h WhatsApp Imobiliária',
    'Qualificação de Leads Imobiliários WhatsApp',
    'Zapella Imobiliárias'
  ],
  alternates: {
    canonical: 'https://www.zapella.app/solucoes/imobiliarias-e-corretores',
  },
  openGraph: {
    title: 'CRM WhatsApp para Imobiliárias e Corretores de Imóveis | Zapella',
    description: 'Secretária virtual com IA que atende e qualifica compradores e inquilinos 24/7 pelo WhatsApp, agendando visitas e alimentando o Kanban.',
    url: 'https://www.zapella.app/solucoes/imobiliarias-e-corretores',
    siteName: 'Zapella',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function ImobiliariasCorretoresPage() {
  const realEstateFaqs = [
    {
      q: 'A Zapella consegue qualificar se o lead quer comprar ou alugar e qual o orçamento?',
      a: 'Sim! De forma natural e sem parecer um robô chato de menu, a IA identifica o objetivo do cliente (compra, locação, investimento), o bairro de preferência, a faixa de valor e o número de dormitórios desejados.'
    },
    {
      q: 'A IA consegue agendar visitas direto na agenda do corretor responsável?',
      a: 'Sim. A Zapella integra-se ao Google Calendar e Calendly de cada corretor ou da equipe de plantão. Quando o cliente quer visitar o imóvel, a IA apresenta os horários vagos e confirma a visita automaticamente.'
    },
    {
      q: 'Como a Zapella organiza os leads que chegam de anúncios e portais?',
      a: 'Todo contato que entra pelo WhatsApp é instantaneamente criado como lead no seu Funil de Vendas Kanban. Você visualiza a etapa do comprador, o valor estimado e o histórico da conversa com 1 clique.'
    },
    {
      q: 'O corretor pode entrar na conversa a qualquer momento?',
      a: 'Sim! A qualquer momento o corretor pode assumir a conversa pela Caixa de Entrada da Zapella. A IA silencia a resposta automática para aquele contato imediatamente, permitindo negociação humana 100% fluida.'
    },
    {
      q: 'Como funciona a Base de Conhecimento para o catálogo de imóveis?',
      a: 'Você cadastra as informações dos empreendimentos, bairros atendidos, formas de financiamento e regras de locação (garantias, fiador, caução) na Base de Conhecimento. A IA responde às dúvidas técnicas com exatidão.'
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
            Para Imobiliárias & Corretores
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
      <section className="relative pt-20 pb-24 px-6 lg:px-14 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-8"
             style={{ background: 'rgba(0,230,118,0.08)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}>
          <Building2 className="w-4 h-4 text-[#2E7D5A]" />
          <span>Atendimento 24/7 e Qualificação de Leads Imobiliários</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#171901] tracking-tight max-w-5xl mx-auto leading-[1.12]">
          Atenda seus leads de imóveis em{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            menos de 5 segundos
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#4D4D61] max-w-3xl mx-auto font-medium leading-relaxed">
          Enquanto seus corretores estão em visitas, a secretária virtual com IA conversa no WhatsApp, descobre o perfil do comprador, envia opções e já agenda a visita direto no Google Calendar.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-[#171901] font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
          >
            <span>Acelerar Vendas da Imobiliária</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/solucoes/clinicas-e-consultorios"
            className="w-full sm:w-auto px-6 py-4 rounded-xl text-[#4D4D61] font-bold text-sm border border-[#E0E3E1] hover:bg-[#F4F5F4] transition-all"
          >
            Ver Outras Soluções
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#70727B] font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            <span>Resposta em 2,4s para leads de portais</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            <span>Qualificação automática de orçamento</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            <span>CRM Kanban Integrado</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            <span>Zero risco de banimento com intervalos humanizados</span>
          </div>
        </div>
      </section>

      {/* ── As Dores Reais do Mercado Imobiliário ── */}
      <section className="py-20 bg-[#F8FAF9] border-y border-[#E0E3E1]/60 px-6 lg:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-[#171901] tracking-tight">
              Por que investir em anúncios de imóveis sem IA é jogar dinheiro fora?
            </h2>
            <p className="mt-3 text-sm text-[#4D4D61] font-medium">
              O comprador de imóvel navega em dezenas de anúncios ao mesmo tempo. A imobiliária que responde primeiro e agenda a visita fica com 78% das vendas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl mb-6">
                ✕
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Lead Esfriando por Horas</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                O lead manda mensagem às 22h interessado num apartamento. Sem resposta imediata, na manhã seguinte ele já fechou visita com o concorrente.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl mb-6">
                !
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Corretor Perdendo Tempo com Curiosos</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Seu corretor passa o dia respondendo contatos sem renda comprovada ou fora do perfil, em vez de focar nas visitas com compradores quentes.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border-2 border-[#00E676] shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#00E676] text-[#171901] text-[10px] font-black px-3 py-1 rounded-bl-lg">
                COM A ZAPELLA
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center font-black text-xl mb-6">
                ✓
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Qualificação e Visita na Hora</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                A IA filtra orçamento, bairro, FGTS e preferências em minutos. O corretor recebe o lead pronto e qualificado na agenda para fechar o negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Como Funciona o Pipeline Imobiliário ── */}
      <section className="py-24 px-6 lg:px-14 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5A]">Pipeline de Alta Eficiência</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171901] tracking-tight mt-2">
            A jornada completa da mensagem até a escritura
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-[#E0E3E1] bg-white hover:border-[#00E676] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center mb-4">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#171901] mb-2">Triagem e Qualificação Humanizada</h3>
            <p className="text-sm text-[#4D4D61] leading-relaxed">
              Sem menus de "digite 1 ou 2". A IA conversa naturalmente: entende se a pessoa busca apartamento de 2 quartos em Moema ou casa em condomínio fechado, capturando faixa de preço e prazo de mudança.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#E0E3E1] bg-white hover:border-[#00E676] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#7C4DFF]/10 text-[#7C4DFF] flex items-center justify-center mb-4">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#171901] mb-2">Agendamento de Visitas Presenciais</h3>
            <p className="text-sm text-[#4D4D61] leading-relaxed">
              Assim que o cliente demonstra interesse em conhecer o imóvel, a secretária virtual oferece os dias disponíveis e sincroniza a visita no Google Calendar do corretor do plantão.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#E0E3E1] bg-white hover:border-[#00E676] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#00B0FF]/10 text-[#0091EA] flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#171901] mb-2">Funil Kanban Imobiliário Nativo</h3>
            <p className="text-sm text-[#4D4D61] leading-relaxed">
              Mova os cards conforme a negociação avança: Lead Novo ➔ Qualificado ➔ Visita Marcada ➔ Proposta Apresentada ➔ Em Análise de Crédito ➔ Venda Concluída.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#E0E3E1] bg-white hover:border-[#00E676] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center mb-4">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#171901] mb-2">Disparos para Grupos de Corretores & Investidores</h3>
            <p className="text-sm text-[#4D4D61] leading-relaxed">
              Tem um lançamento ou captação exclusiva? Use nosso agendador de mensagens para disparar nos grupos VIP de investidores e parceiros com proteção antiban e custo zero de IA.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ de Imobiliárias (AEO) ── */}
      <section className="py-20 bg-[#F8FAF9] border-t border-[#E0E3E1] px-6 lg:px-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5A]">Perguntas & Respostas</span>
            <h2 className="text-3xl font-extrabold text-[#171901] tracking-tight mt-2">
              Dúvidas Frequentes de Corretores e Gestores Imobiliários
            </h2>
          </div>

          <div className="space-y-4">
            {realEstateFaqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
                <h3 className="font-extrabold text-base text-[#171901] mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#00E676] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final de Conversão ── */}
      <section className="py-24 px-6 lg:px-14 max-w-5xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl text-white relative overflow-hidden shadow-2xl"
             style={{ background: 'linear-gradient(135deg, #171901 0%, #15222E 100%)' }}>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Multiplique as visitas e feche mais negócios todo mês
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 font-medium">
              Conecte o WhatsApp da sua imobiliária em menos de 3 minutos via QR Code. Teste gratuitamente por 7 dias sem compromisso.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[#171901] font-extrabold text-sm shadow-xl transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
            >
              <span>Ativar Minha Secretária Imobiliária</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="mt-4 text-xs text-gray-400">
              Planos a partir de R$ 97/mês • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[#E0E3E1] px-6 lg:px-14 text-center text-xs text-[#70727B] bg-white">
        <p>© 2026 Zapella. Feito para acelerar imobiliárias e corretores de alta performance.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/termos" className="hover:text-[#171901] transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-[#171901] transition-colors">Privacidade & LGPD</Link>
          <Link href="/" className="hover:text-[#171901] transition-colors">Página Inicial</Link>
        </div>
      </footer>
    </div>
  );
}
