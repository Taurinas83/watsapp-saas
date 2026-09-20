'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
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
  Building2,
  TrendingUp,
  Headphones,
  Check
} from 'lucide-react';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';

export default function LandingPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Preciso ter o celular ligado o tempo todo para o atendente virtual funcionar?',
      a: 'Não! Graças à integração via WhatsApp Business API (Evolution API), o seu atendente virtual opera 100% na nuvem, 24 horas por dia, 7 dias por semana, mesmo que seu celular esteja desligado ou sem bateria.'
    },
    {
      q: 'Como a IA aprende sobre os preços e serviços da minha empresa?',
      a: 'Você cadastra suas informações na nossa Base de Conhecimento (RAG) em poucos minutos. Basta incluir perguntas e respostas frequentes, cardápio ou tabela de preços. A IA consulta estes dados instantaneamente a cada mensagem.'
    },
    {
      q: 'O que acontece se um cliente fizer uma pergunta difícil ou quiser falar com uma pessoa?',
      a: 'O sistema possui gatilhos inteligentes de Handover. Se o cliente pedir para falar com um atendente ou demonstrar insatisfação, o bot pausa a resposta automática e transfere a conversa imediatamente para a Caixa de Entrada da sua equipe.'
    },
    {
      q: 'Posso personalizar o tom de voz do atendente para parecer com a minha marca?',
      a: 'Com certeza! Você pode escolher personalidades pré-definidas (Amigável, Profissional ou Descontraído) e definir instruções de conduta sob medida para sua clínica, loja ou escritório.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">

      {/* Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-slate-950/90 backdrop-blur-md z-40">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight tracking-tight">AtendenteVirtual</h1>
            <p className="text-xs text-emerald-400 font-medium">SaaS WhatsApp AI</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#beneficios" className="hover:text-emerald-400 transition-colors">Benefícios</a>
          <a href="#como-funciona" className="hover:text-emerald-400 transition-colors">Como Funciona</a>
          <a href="#planos" className="hover:text-emerald-400 transition-colors">Planos & Preços</a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
          >
            Entrar
          </Link>
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            Testar Grátis por 7 Dias
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 lg:px-12 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>Atendimento Inteligente 24/7 via WhatsApp</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Transforme seu WhatsApp em uma <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Máquina de Vendas</span> Humanizada
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Atenda clientes instantaneamente, tire dúvidas com base no seu catálogo e transfira para sua equipe apenas quando necessário. Sem complicações técnicos.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group hover:scale-105"
          >
            <span>Começar Agora Gratuitamente</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Testar Atendente ao Vivo (Simulador)</span>
          </button>
        </div>

        {/* Feature Pill Highlights */}
        <div className="mt-14 pt-10 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400 text-xs font-medium max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Respostas em &lt; 5 segundos</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Treinamento com seus dados</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Handover para humano</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sem taxas de instalação</span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-6 lg:px-12 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Benefícios para seu Negócio</h2>
            <h3 className="text-3xl font-bold text-white mt-2">Por que milhares de empresas adotam o Atendente Virtual?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Atendimento 24/7 sem Pausa</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nunca mais perca vendas no período da noite ou aos finais de semana. Sua IA responde imediatamente a qualquer hora.
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Personalidade Humanizada</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diga adeus a bots engessados de "digite 1 para vendas". Nosso motor Claude cria conversas fluidas com o tom de voz da sua marca.
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Supervisão & Intervenção Humana</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sua equipe de atendimento tem total controle para assumir conversas sensíveis com 1 clique diretamente pelo painel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Passo a Passo Simplificado</h2>
          <h3 className="text-3xl font-bold text-white mt-2">Como colocar seu atendente no ar em 3 minutos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative">
            <span className="text-4xl font-extrabold text-emerald-500/20 absolute top-4 right-4">01</span>
            <h4 className="text-base font-bold text-white mb-2">Configure a Identidade</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Defina o nome do seu atendente, a personalidade desejada (amigável, profissional ou descontraída) e regras de negócio.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative">
            <span className="text-4xl font-extrabold text-emerald-500/20 absolute top-4 right-4">02</span>
            <h4 className="text-base font-bold text-white mb-2">Cadastre a Base de Conhecimento</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Insira suas perguntas frequentes, tabela de preços, endereço e horários de funcionamento.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative">
            <span className="text-4xl font-extrabold text-emerald-500/20 absolute top-4 right-4">03</span>
            <h4 className="text-base font-bold text-white mb-2">Conecte o WhatsApp com QR Code</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Abra seu celular e escaneie o QR Code na tela. Pronto! O robô assume imediatamente os atendimentos.
            </p>
          </div>
        </div>
      </section>

      {/* Plans & Pricing Section */}
      <section id="planos" className="py-20 px-6 lg:px-12 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Planos Transparentes</h2>
            <h3 className="text-3xl font-bold text-white mt-2">Escolha o plano ideal para o tamanho da sua empresa</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* Starter Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white">Iniciante</h4>
                <p className="text-xs text-slate-400 mt-1">Ideal para autônomos e pequenos consultórios.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-white">R$ 149</span>
                  <span className="text-xs text-slate-400"> /mês</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 1.000 mensagens/mês</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 1 Número de WhatsApp</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Base de Conhecimento RAG</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Painel de Inbox para 1 operador</li>
                </ul>
              </div>
              <a
                href="https://www.asaas.com/c/i9vryhz03j002dnn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all block"
              >
                Contratar Starter (R$ 149/mês)
              </a>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-slate-900 p-8 rounded-3xl border-2 border-emerald-500 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-emerald-500/10">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                MAIS POPULAR
              </span>

              <div>
                <h4 className="text-lg font-bold text-white">Pro Negócios</h4>
                <p className="text-xs text-slate-400 mt-1">Para clínicas e comércios em expansão.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-white">R$ 299</span>
                  <span className="text-xs text-slate-400"> /mês</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Mensagens ilimitadas</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 1 Número de WhatsApp</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Sugestões de Resposta IA</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Até 5 operadores no Inbox</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Relatórios de métricas avançados</li>
                </ul>
              </div>
              <a
                href="https://www.asaas.com/c/ukq2r3jczggrhibc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs text-center transition-all shadow-lg shadow-emerald-500/20 block"
              >
                Assinar Pro Negócios (R$ 299/mês)
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white">Enterprise</h4>
                <p className="text-xs text-slate-400 mt-1">Para redes de franquias e grandes operações.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-white">R$ 599</span>
                  <span className="text-xs text-slate-400"> /mês</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Múltiplos números WhatsApp</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Operadores ilimitados</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Suporte dedicado via WhatsApp</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Treinamento de IA sob medida</li>
                </ul>
              </div>
              <a
                href="https://www.asaas.com/c/93308y4cw5ssn2vl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-all block"
              >
                Assinar Enterprise (R$ 599/mês)
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-6 lg:px-12 max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Perguntas Frequentes</h2>
          <h3 className="text-3xl font-bold text-white mt-2">Dúvidas Comuns sobre o SaaS</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-sm text-white">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 px-6 lg:px-12 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-10 rounded-3xl shadow-2xl text-slate-950 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Pronto para automatizar seu WhatsApp hoje mesmo?
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Crie sua conta em 1 minuto e faça o teste gratuito de 7 dias sem precisar colocar cartão de crédito.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              <span>Criar Conta Gratuita Agora</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-12 px-6 lg:px-12 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-white font-bold">Atendente Virtual WhatsApp SaaS</span>
          </div>

          <p>© 2026 AtendenteVirtual. Todos os direitos reservados.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Termos de Uso</a>
            <a href="#" className="hover:text-slate-300">Privacidade</a>
            <a href="#" className="hover:text-slate-300">Suporte</a>
          </div>
        </div>
      </footer>

      {/* Interactive Simulator Modal triggerable anywhere from landing page */}
      {isSimulatorOpen && (
        <WhatsAppSimulatorModal onClose={() => setIsSimulatorOpen(false)} />
      )}

    </div>
  );
}
