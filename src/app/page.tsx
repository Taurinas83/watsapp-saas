'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  Bot,
  Zap,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Headphones,
  Check,
  Sparkles
} from 'lucide-react';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';

export default function LandingPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Preciso ter o celular ligado o tempo todo para a Zapella funcionar?',
      a: 'Não! Graças à integração via WhatsApp Business API (Evolution API), a Zapella opera 100% na nuvem, 24 horas por dia, 7 dias por semana, mesmo que seu celular esteja desligado ou sem bateria.'
    },
    {
      q: 'Como a IA aprende sobre os preços e serviços da minha empresa?',
      a: 'Você cadastra suas informações na Base de Conhecimento (RAG) em poucos minutos. Basta incluir perguntas e respostas frequentes, cardápio ou tabela de preços. A IA consulta estes dados instantaneamente a cada mensagem.'
    },
    {
      q: 'O que acontece se um cliente fizer uma pergunta difícil ou quiser falar com uma pessoa?',
      a: 'A Zapella possui gatilhos inteligentes de Handover. Se o cliente pedir para falar com um atendente ou demonstrar insatisfação, a IA pausa a resposta automática e transfere a conversa imediatamente para a Caixa de Entrada da sua equipe.'
    },
    {
      q: 'Posso personalizar o tom de voz para parecer com a minha marca?',
      a: 'Com certeza! Você pode escolher personalidades pré-definidas (Amigável, Profissional ou Descontraído) e definir instruções de conduta sob medida para sua clínica, loja ou escritório.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#171901] flex flex-col font-sans">

      {/* ── Top Navbar ── */}
      <nav className="h-18 border-b border-[#E0E3E1]/80 px-6 lg:px-14 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-40 shadow-sm">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shrink-0"
               style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            <Image src="/zapella-icon.png" alt="Zapella" width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-[#171901] text-lg tracking-tight">Zapella</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#4D4D61]">
          <a href="#beneficios" className="hover:text-[#2E7D5A] transition-colors">Benefícios</a>
          <a href="#como-funciona" className="hover:text-[#2E7D5A] transition-colors">Como Funciona</a>
          <a href="#planos" className="hover:text-[#2E7D5A] transition-colors">Planos & Preços</a>
          <a href="#faq" className="hover:text-[#2E7D5A] transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4D4D61] hover:text-[#171901] hover:bg-[#F4F5F4] transition-all">
            Entrar
          </Link>
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl text-[#171901] font-extrabold text-xs shadow-md transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
          >
            Testar Grátis — 7 dias
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-28 px-6 lg:px-14 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none opacity-30"
             style={{ background: 'radial-gradient(ellipse, rgba(0,230,118,0.25) 0%, rgba(124,77,255,0.10) 60%, transparent 100%)', filter: 'blur(80px)' }} />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-8"
             style={{ background: 'rgba(0,230,118,0.08)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atendimento Inteligente 24/7 via WhatsApp</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#171901] tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Sua secretária virtual{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            inteligente
          </span>{' '}
          no WhatsApp
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#4D4D61] max-w-2xl mx-auto leading-relaxed">
          Atenda clientes instantaneamente, tire dúvidas com base no seu catálogo e transfira para sua equipe apenas quando necessário. Sem complicações técnicas.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl text-[#171901] font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)', boxShadow: '0 8px 32px rgba(0,230,118,0.25)' }}
          >
            <span>Começar Agora Gratuitamente</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm border border-[#E0E3E1] bg-white hover:bg-[#F4F5F4] text-[#171901] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Bot className="w-4 h-4" style={{ color: '#00E676' }} />
            <span>Ver Demonstração ao Vivo</span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className="mt-14 pt-10 border-t border-[#E0E3E1] grid grid-cols-2 md:grid-cols-4 gap-6 text-[#4D4D61] text-xs font-medium max-w-4xl mx-auto">
          {[
            'Respostas em < 5 segundos',
            'Treinamento com seus dados',
            'Handover para humano',
            'Sem taxas de instalação'
          ].map((feat) => (
            <div key={feat} className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#00E676' }} />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-12 px-6 lg:px-14 border-y border-[#E0E3E1]" style={{ background: '#F4F5F4' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '+2.400', label: 'Empresas ativas' },
            { val: '98.2%', label: 'Precisão das respostas' },
            { val: '< 5s', label: 'Tempo de resposta' },
            { val: '24/7', label: 'Sem pausas' }
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold tracking-tight" style={{ color: '#171901' }}>{stat.val}</p>
              <p className="text-xs text-[#4D4D61] mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits Section ── */}
      <section id="beneficios" className="py-20 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: '#2E7D5A' }}>Benefícios para seu Negócio</p>
            <h2 className="text-3xl font-bold text-[#171901]">Por que empresas escolhem a Zapella?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Benefit Card 1 */}
            <div className="p-8 rounded-3xl border border-[#E0E3E1] space-y-4 hover:border-[#00E676]/40 hover:shadow-lg transition-all bg-white">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,230,118,0.10)' }}>
                <Clock className="w-6 h-6" style={{ color: '#2E7D5A' }} />
              </div>
              <h3 className="text-base font-bold text-[#171901]">Atendimento 24/7 sem Pausa</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Nunca mais perca vendas no período da noite ou aos finais de semana. A Zapella responde imediatamente a qualquer hora.
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="p-8 rounded-3xl border border-[#E0E3E1] space-y-4 hover:border-[#7C4DFF]/40 hover:shadow-lg transition-all bg-white">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,77,255,0.08)' }}>
                <Bot className="w-6 h-6" style={{ color: '#7C4DFF' }} />
              </div>
              <h3 className="text-base font-bold text-[#171901]">Personalidade Humanizada</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Diga adeus a bots engessados. A Zapella cria conversas fluidas e naturais com o tom de voz da sua marca.
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div className="p-8 rounded-3xl border border-[#E0E3E1] space-y-4 hover:border-[#1DE9B6]/40 hover:shadow-lg transition-all bg-white">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(29,233,182,0.10)' }}>
                <Headphones className="w-6 h-6" style={{ color: '#00897B' }} />
              </div>
              <h3 className="text-base font-bold text-[#171901]">Supervisão & Intervenção Humana</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Sua equipe tem controle total para assumir conversas sensíveis com 1 clique diretamente pelo painel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="como-funciona" className="py-20 px-6 lg:px-14" style={{ background: '#F4F5F4' }}>
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: '#2E7D5A' }}>Passo a Passo Simplificado</p>
            <h2 className="text-3xl font-bold text-[#171901]">No ar em menos de 3 minutos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { num: '01', title: 'Configure a Identidade', desc: 'Defina o nome do seu atendente, a personalidade desejada e regras de negócio.' },
              { num: '02', title: 'Cadastre a Base de Conhecimento', desc: 'Insira perguntas frequentes, tabela de preços, endereço e horários de funcionamento.' },
              { num: '03', title: 'Conecte o WhatsApp com QR Code', desc: 'Escaneie o QR Code com seu celular. Pronto! A IA assume os atendimentos imediatamente.' },
            ].map((step) => (
              <div key={step.num} className="bg-white p-7 rounded-2xl border border-[#E0E3E1] relative shadow-sm hover:shadow-md transition-shadow">
                <span className="text-5xl font-extrabold absolute top-4 right-5 select-none opacity-10" style={{ color: '#00E676' }}>{step.num}</span>
                <h3 className="text-sm font-bold text-[#171901] mb-2">{step.title}</h3>
                <p className="text-xs text-[#4D4D61] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="planos" className="py-20 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: '#2E7D5A' }}>Planos Transparentes</p>
            <h2 className="text-3xl font-bold text-[#171901]">Escolha o plano ideal para o seu negócio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-3xl border border-[#E0E3E1] flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-base font-bold text-[#171901]">Iniciante</h3>
                <p className="text-xs text-[#4D4D61] mt-1">Ideal para autônomos e pequenos consultórios.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-[#171901]">R$ 149</span>
                  <span className="text-xs text-[#4D4D61]"> /mês</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-[#4D4D61]">
                  {['Até 1.000 mensagens/mês', '1 Número de WhatsApp', 'Base de Conhecimento RAG', 'Painel de Inbox para 1 operador'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" style={{ color: '#00E676' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="https://www.asaas.com/c/i9vryhz03j002dnn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl border border-[#E0E3E1] text-[#171901] font-bold text-xs text-center transition-all hover:bg-[#F4F5F4] block"
              >
                Contratar Starter (R$ 149/mês)
              </a>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-white p-8 rounded-3xl border-2 flex flex-col justify-between space-y-6 shadow-xl relative"
                 style={{ borderColor: '#00E676', boxShadow: '0 8px 40px rgba(0,230,118,0.15)' }}>
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[#171901] font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ background: '#00E676' }}>
                MAIS POPULAR
              </span>
              <div>
                <h3 className="text-base font-bold text-[#171901]">Pro Negócios</h3>
                <p className="text-xs text-[#4D4D61] mt-1">Para clínicas e comércios em expansão.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-[#171901]">R$ 299</span>
                  <span className="text-xs text-[#4D4D61]"> /mês</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-[#4D4D61]">
                  {['Mensagens ilimitadas', '1 Número de WhatsApp', 'Sugestões de Resposta IA', 'Até 5 operadores no Inbox', 'Relatórios de métricas avançados'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" style={{ color: '#00E676' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="https://www.asaas.com/c/ukq2r3jczggrhibc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl text-[#171901] font-extrabold text-xs text-center transition-all hover:opacity-90 shadow-md block"
                style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)', boxShadow: '0 4px 16px rgba(0,230,118,0.25)' }}
              >
                Assinar Pro Negócios (R$ 299/mês)
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-3xl border border-[#E0E3E1] flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-base font-bold text-[#171901]">Enterprise</h3>
                <p className="text-xs text-[#4D4D61] mt-1">Para redes de franquias e grandes operações.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-[#171901]">R$ 599</span>
                  <span className="text-xs text-[#4D4D61]"> /mês</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-[#4D4D61]">
                  {['Múltiplos números WhatsApp', 'Operadores ilimitados', 'Suporte dedicado via WhatsApp', 'Treinamento de IA sob medida'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" style={{ color: '#00E676' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="https://www.asaas.com/c/93308y4cw5ssn2vl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl border border-[#E0E3E1] text-[#171901] font-bold text-xs text-center transition-all hover:bg-[#F4F5F4] block"
              >
                Assinar Enterprise (R$ 599/mês)
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 px-6 lg:px-14 max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: '#2E7D5A' }}>Perguntas Frequentes</p>
          <h2 className="text-3xl font-bold text-[#171901]">Dúvidas sobre a Zapella?</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-[#E0E3E1] overflow-hidden transition-all hover:border-[#00E676]/30">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-sm text-[#171901]">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: '#00E676' }} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#4D4D61] leading-relaxed border-t border-[#E0E3E1]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="py-16 px-6 lg:px-14 max-w-5xl mx-auto text-center">
        <div className="p-10 rounded-3xl shadow-2xl text-white space-y-6 relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #2E7D5A 0%, #00E676 50%, #7C4DFF 100%)' }}>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pronto para automatizar seu WhatsApp com a Zapella?
            </h2>
            <p className="text-green-100 text-sm max-w-xl mx-auto mt-3">
              Crie sua conta em 1 minuto e teste gratuitamente por 7 dias. Sem cartão de crédito.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-[#F4F5F4] text-[#171901] font-extrabold text-sm rounded-2xl shadow-xl transition-all hover:scale-105"
              >
                <span>Criar Conta Gratuita Agora</span>
                <ArrowRight className="w-4 h-4" style={{ color: '#00E676' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E0E3E1] py-12 px-6 lg:px-14" style={{ background: '#F4F5F4' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#4D4D61]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm"
                 style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
              <Image src="/zapella-icon.png" alt="Zapella" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-[#171901]">Zapella</span>
          </div>
          <p>© 2026 Zapella. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#171901] transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-[#171901] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#171901] transition-colors">Suporte</a>
          </div>
        </div>
      </footer>

      {isSimulatorOpen && (
        <WhatsAppSimulatorModal onClose={() => setIsSimulatorOpen(false)} />
      )}
    </div>
  );
}
