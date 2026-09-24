'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  BookOpen,
  QrCode,
  Eye,
  UserCheck,
  Cpu,
  Layers,
  Sliders,
  Play,
  Kanban,
  Calendar,
  CalendarClock,
  Send,
  HelpCircle,
  DollarSign
} from 'lucide-react';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';
import { SupportChatModal } from '@/components/SupportChatModal';

export default function LandingPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'crm' | 'broadcast' | 'attendant' | 'knowledge' | 'inbox' | 'whatsapp'>('crm');

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#suporte' || window.location.search.includes('suporte=true'))) {
      setIsSupportOpen(true);
    }
  }, []);

  const faqs = [
    {
      q: 'A Zapella consegue agendar reuniões e consultas para mim?',
      a: 'Sim! A Zapella integra-se com Calendly, Cal.com ou Google Calendar. Quando o cliente demonstra interesse em marcar um horário ou consulta, a IA identifica a intenção e envia o seu link de agendamento na hora exata, sem você precisar intervir.'
    },
    {
      q: 'Como funciona o CRM integrado dentro da Zapella?',
      a: 'Todo cliente que conversa no seu WhatsApp é automaticamente cadastrado como lead no seu Funil de Vendas (Kanban). Você visualiza em qual etapa da negociação ele está, o valor estimado do negócio e tem acesso direto ao chat com 1 clique.'
    },
    {
      q: 'Posso mandar mensagens para grupos de WhatsApp sem risco de banimento?',
      a: 'Sim! Nosso Agendador de Mensagens para Grupos VIP conta com proteção antiban inteligente (intervalo humanizado de 15 a 30 segundos entre envios) e opera com custo zero de tokens de IA, perfeito para lançamentos e comunidades.'
    },
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
      q: 'Quais modelos de Inteligência Artificial a Zapella utiliza?',
      a: 'Trabalhamos com um motor híbrido de ponta: Google Gemini 2.5 Flash, Groq (Llama 3.3 70B), DeepSeek V3 e Claude 3.5 Haiku, combinando ultra-velocidade com respostas humanizadas e precisas.'
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
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#4D4D61]">
          <a href="#beneficios" className="hover:text-[#2E7D5A] transition-colors">Benefícios</a>
          <a href="#diferenciais" className="hover:text-[#2E7D5A] transition-colors">Diferenciais</a>
          <a href="#telas" className="hover:text-[#2E7D5A] transition-colors">O Sistema</a>
          <a href="#como-funciona" className="hover:text-[#2E7D5A] transition-colors">Como Funciona</a>
          <a href="#planos" className="hover:text-[#2E7D5A] transition-colors">Planos & Preços</a>
          <a href="#faq" className="hover:text-[#2E7D5A] transition-colors">FAQ</a>
          <button
            onClick={() => setIsSupportOpen(true)}
            className="hover:text-[#2E7D5A] transition-colors flex items-center gap-1 font-semibold text-xs"
          >
            <span>Suporte</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
          </button>
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
          <span>Atendimento Inteligente 24/7 • CRM Nativo • Agendas • Disparos em Grupos</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#171901] tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Sua secretária virtual{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
            inteligente
          </span>{' '}
          no WhatsApp
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#4D4D61] max-w-2xl mx-auto leading-relaxed">
          Atenda clientes instantaneamente, gerencie seu Funil CRM de Vendas, agende reuniões automaticamente e dispare mensagens para seus grupos VIP com total segurança.
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
            'Respostas em < 3 segundos',
            'Funil CRM Nativo (Kanban)',
            'Agendamento de Calls com IA',
            'Disparo Seguro em Grupos VIP'
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
            { val: '< 3s', label: 'Tempo de resposta' },
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
              <h3 className="text-base font-bold text-[#171901]">Atendimento IA 24/7 sem Pausa</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Nunca mais perca vendas no período da noite ou aos finais de semana. A Zapella responde imediatamente a qualquer hora com inteligência multi-modelo.
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="p-8 rounded-3xl border border-[#E0E3E1] space-y-4 hover:border-[#7C4DFF]/40 hover:shadow-lg transition-all bg-white">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(124,77,255,0.08)' }}>
                <Kanban className="w-6 h-6" style={{ color: '#7C4DFF' }} />
              </div>
              <h3 className="text-base font-bold text-[#171901]">Funil CRM de Vendas Integrado</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Cada contato do WhatsApp é registrado como lead em um Kanban visual. Acompanhe etapas, valores previstos e acerte o timing das vendas.
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div className="p-8 rounded-3xl border border-[#E0E3E1] space-y-4 hover:border-[#1DE9B6]/40 hover:shadow-lg transition-all bg-white">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(29,233,182,0.10)' }}>
                <CalendarClock className="w-6 h-6" style={{ color: '#00897B' }} />
              </div>
              <h3 className="text-base font-bold text-[#171901]">Agendas & Grupos VIP</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Agende reuniões e consultas direto pelo Calendly/Google Calendar e dispare comunicados para grupos com proteção antiban inteligente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Exclusives & Differentiators ── */}
      <section id="diferenciais" className="py-20 px-6 lg:px-14 bg-[#F8FAF9] border-t border-[#E0E3E1]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: '#2E7D5A' }}>
              Diferenciais Exclusivos
            </p>
            <h2 className="text-3xl font-bold text-[#171901]">
              O que torna a Zapella superior a chatbots comuns?
            </h2>
            <p className="text-xs text-[#4D4D61] mt-3">
              Construída para empresas que precisam de atendimento sério, vendas estruturadas e sem respostas inventadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Diff 1: Funil CRM Nativo */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C4DFF] flex items-center justify-center">
                <Kanban className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Funil CRM Nativo</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Todos os contatos que chegam pelo WhatsApp entram automaticamente no seu CRM visual Kanban com valores e etapas.
              </p>
            </div>

            {/* Diff 2: Agendamento Inteligente */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#128C7E] flex items-center justify-center">
                <Calendar className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Agendamento de Calls</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                A IA detecta pedidos de consulta ou reunião e envia o link direto do seu Calendly, Cal.com ou Google Agenda.
              </p>
            </div>

            {/* Diff 3: Disparo Seguro em Grupos */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarClock className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Disparos em Grupos VIP</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Agende mensagens para grupos com proteção antiban inteligente (intervalo de 15 a 30s) e custo zero de IA.
              </p>
            </div>

            {/* Diff 4: RAG Sem Alucinações */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#128C7E] flex items-center justify-center">
                <BookOpen className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">RAG Sem Alucinações</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                A IA responde estritamente o que você ensinou na Base de Conhecimento. Nunca inventa preços ou prazos.
              </p>
            </div>

            {/* Diff 5: Motor Multi-LLM */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Motor Multi-LLM</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Potência de Google Gemini 2.5 Flash, Groq (Llama 3.3), DeepSeek V3 e Claude 3.5 para respostas em menos de 3s.
              </p>
            </div>

            {/* Diff 6: Handover Inteligente */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#128C7E] flex items-center justify-center">
                <UserCheck className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Handover Inteligente</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Palavras-chave como "cancelar" ou "urgente" pausam o bot na hora e transferem para o operador humano.
              </p>
            </div>

            {/* Diff 7: Modo Copiloto */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C4DFF] flex items-center justify-center">
                <Sparkles className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Modo Copiloto</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                A IA sugere respostas prontas na Inbox da sua equipe para o atendente revisar e enviar com 1 clique.
              </p>
            </div>

            {/* Diff 8: Nuvem 24/7 & QR Code */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <QrCode className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Nuvem 24/7 & QR Code</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Conecte em 30 segundos pelo QR Code. Funciona direto na nuvem mesmo com seu celular desligado.
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

      {/* ── Product Showcase / Prints do Sistema ── */}
      <section id="telas" className="py-20 px-6 lg:px-14 bg-white border-t border-[#E0E3E1]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: '#2E7D5A' }}>
              Tour pelo Sistema
            </p>
            <h2 className="text-3xl font-bold text-[#171901]">
              Interface limpa, moderna e fácil de usar
            </h2>
            <p className="text-xs text-[#4D4D61] mt-2">
              Veja por dentro como o painel da Zapella simplifica o dia a dia do seu negócio.
            </p>
          </div>

          {/* Tabs Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'crm', label: 'Funil CRM (Kanban)', icon: Kanban },
              { id: 'broadcast', label: 'Disparo em Grupos VIP', icon: CalendarClock },
              { id: 'attendant', label: 'Identidade & Agendas', icon: Bot },
              { id: 'knowledge', label: 'Base de Conhecimento (RAG)', icon: BookOpen },
              { id: 'inbox', label: 'Inbox & Supervisão ao Vivo', icon: MessageSquare },
              { id: 'whatsapp', label: 'Conexão WhatsApp', icon: QrCode },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#171901] text-white shadow-md'
                      : 'bg-[#F4F5F4] text-[#4D4D61] hover:text-[#171901] hover:bg-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#00E676]' : 'text-[#4D4D61]'}`} strokeWidth={1.75} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Screen Mockup */}
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-3 sm:p-4 shadow-2xl border border-slate-700">
            {/* Window Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="font-mono text-[11px] bg-slate-800 px-4 py-1 rounded-lg text-slate-300">
                https://app.zapella.com.br/dashboard/{activeTab}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                ● Ao Vivo
              </div>
            </div>

            {/* Mockup Screen Contents */}
            <div className="bg-[#F0F2F5] rounded-2xl p-6 text-[#111B21] min-h-[420px]">
              {activeTab === 'crm' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#111B21]">Funil CRM de Vendas</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C4DFF] text-[10px] font-extrabold uppercase">
                          Sincronizado com WhatsApp
                        </span>
                      </div>
                      <p className="text-xs text-[#667781]">Arraste seus contatos pelas etapas e monitore o valor total em negociação</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#111B21] shadow-xs">
                        Total no Funil: <span className="text-[#128C7E]">R$ 12.300,00</span>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-[#128C7E] text-white text-xs font-bold shadow-xs">
                        + Novo Lead
                      </span>
                    </div>
                  </div>

                  {/* Kanban Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Column 1: Novo Lead */}
                    <div className="bg-slate-100/80 rounded-xl p-3 space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Novo Lead (2)
                        </span>
                        <span className="text-[10px] text-slate-400">R$ 2.350</span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 shadow-xs hover:border-slate-300 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#111B21]">Mariana Santos</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">WhatsApp</span>
                        </div>
                        <p className="text-[11px] text-[#667781] line-clamp-1">Interesse em consulta dermatológica</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-[#128C7E]">R$ 1.500,00</span>
                          <span className="text-[10px] text-slate-400">14:32</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 shadow-xs hover:border-slate-300 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#111B21]">Rodrigo Alves</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">WhatsApp</span>
                        </div>
                        <p className="text-[11px] text-[#667781] line-clamp-1">Pediu tabela de preços trimestral</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-[#128C7E]">R$ 850,00</span>
                          <span className="text-[10px] text-slate-400">13:10</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Em Qualificação */}
                    <div className="bg-slate-100/80 rounded-xl p-3 space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Qualificação (1)
                        </span>
                        <span className="text-[10px] text-slate-400">R$ 2.400</span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 shadow-xs hover:border-slate-300 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#111B21]">Camila Albuquerque</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">Proposta</span>
                        </div>
                        <p className="text-[11px] text-[#667781] line-clamp-1">Aguardando aprovação da proposta</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-[#128C7E]">R$ 2.400,00</span>
                          <span className="text-[10px] text-slate-400">Ontem</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Reunião / Agendado */}
                    <div className="bg-slate-100/80 rounded-xl p-3 space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Agendados (1)
                        </span>
                        <span className="text-[10px] text-slate-400">R$ 3.500</span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-2 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#111B21]">Dr. Lucas Lima</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-[#128C7E] font-semibold">Google Meet</span>
                        </div>
                        <p className="text-[11px] text-[#667781] line-clamp-1">Call via Calendly agendada pela IA</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-[#128C7E]">R$ 3.500,00</span>
                          <span className="text-[10px] text-[#128C7E] font-semibold">Amanhã 15h</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 4: Fechado / Ganho */}
                    <div className="bg-slate-100/80 rounded-xl p-3 space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#128C7E]" />
                          Ganho (1)
                        </span>
                        <span className="text-[10px] text-slate-400">R$ 4.900</span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-2 shadow-xs bg-emerald-50/20">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#111B21]">Beatriz Costa</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-[#128C7E] font-extrabold">Fechado</span>
                        </div>
                        <p className="text-[11px] text-[#667781] line-clamp-1">Contrato anual assinado via WhatsApp</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-[#128C7E]">R$ 4.900,00</span>
                          <span className="text-[10px] text-emerald-600 font-bold">Pago Pix</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'broadcast' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#111B21]">Disparo para Grupos de WhatsApp</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#128C7E] text-[10px] font-extrabold uppercase">
                          Proteção Antiban Ativa
                        </span>
                      </div>
                      <p className="text-xs text-[#667781]">Agende comunicados e ofertas para seus grupos VIP com intervalo seguro de 15 a 30s</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-[#128C7E] text-white text-xs font-bold shadow-xs">
                      + Agendar Nova Mensagem
                    </span>
                  </div>

                  {/* Summary metric pills */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">Grupos Conectados</p>
                      <p className="text-lg font-bold text-[#111B21] mt-0.5">4 Grupos VIP</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">Mensagens Agendadas</p>
                      <p className="text-lg font-bold text-blue-600 mt-0.5">1 Envio Pendente</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">Intervalo Antiban</p>
                      <p className="text-lg font-bold text-[#128C7E] mt-0.5">15s a 30s Jitter</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-medium">Custo de Disparo</p>
                      <p className="text-lg font-bold text-[#128C7E] mt-0.5">R$ 0,00 (Sem Tokens)</p>
                    </div>
                  </div>

                  {/* Scheduled Message Item */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-bold text-xs text-[#111B21]">Campanha: Lembrete da Masterclass Exclusiva</span>
                        <p className="text-[11px] text-slate-500">Destino: <span className="font-semibold text-slate-700">Comunidade de Clientes VIP (184 membros)</span></p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold self-start sm:self-auto">
                        Agendado para Hoje às 19:30
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
                      "Boa noite pessoal! Passando para avisar que em 30 minutos liberamos a gravação completa e o material complementar no grupo. Fiquem ligados!"
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>✓ Disparo automático via Evolution API</span>
                      <span className="text-emerald-600 font-semibold">Segurança Antiban: Fila escalonada</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendant' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#111B21]">Identidade do Atendente & Agendas</h4>
                      <p className="text-xs text-[#667781]">Configure o tom de voz, link do Calendly/Google Calendar e regras de conduta</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#128C7E] text-xs font-bold">
                      ● Atendente Ativo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <label className="font-bold text-[#111B21] block">Personalidade Selecionada</label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 rounded-lg border-2 border-[#25D366] bg-emerald-50 text-center font-bold text-[#128C7E]">
                          Amigável
                        </div>
                        <div className="p-2.5 rounded-lg border border-slate-200 text-center text-slate-600">
                          Profissional
                        </div>
                        <div className="p-2.5 rounded-lg border border-slate-200 text-center text-slate-600">
                          Descontraído
                        </div>
                      </div>
                      <p className="text-[11px] text-[#667781]">
                        Tom de voz atencioso, acolhedor e com uso suave de emojis humanizados.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="font-bold text-[#111B21] block">Link de Agendamento (Calendly / Google)</label>
                      <div className="p-2.5 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-700 border border-slate-200 truncate">
                        https://calendly.com/sua-clinica/consulta-30min
                      </div>
                      <p className="text-[11px] text-[#667781]">
                        A IA envia esse link automaticamente sempre que o lead pedir uma reunião ou consulta.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="font-bold text-[#111B21] block">Palavras-chave de Transferência Imediata</label>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700">falar com atendente</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700">cancelar</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700">urgente</span>
                      </div>
                      <p className="text-[11px] text-[#667781]">
                        Ao detectar esses termos, a IA pausa na hora e notifica sua equipe.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                      <label className="font-bold text-[#111B21] block">Link do Grupo VIP (WhatsApp)</label>
                      <div className="p-2.5 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-700 border border-slate-200 truncate">
                        https://chat.whatsapp.com/GrupoClientesVIP2026
                      </div>
                      <p className="text-[11px] text-[#667781]">
                        A IA convida novos leads para sua comunidade após o primeiro atendimento.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <label className="font-bold text-[#111B21] block">Instruções Customizadas da Empresa</label>
                    <div className="p-3 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-700 border border-slate-200">
                      "Você é a Zapella, secretária da Clínica Saúde Total. Nosso horário é de seg a sex das 08h às 19h. Sempre confirme o nome do paciente antes de enviar o link da agenda."
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'knowledge' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#111B21]">Base de Conhecimento RAG</h4>
                      <p className="text-xs text-[#667781]">Dados que a IA consulta para responder seus clientes com 100% de exatidão</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-[#128C7E] text-white text-xs font-bold shadow-sm">
                      + Adicionar Pergunta / FAQ
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { cat: 'Preços & Planos', q: 'Quanto custa a consulta presencial e online?', a: 'A consulta presencial é R$ 250,00 e a teleconsulta é R$ 190,00 com retorno em até 15 dias incluso.' },
                      { cat: 'Horários', q: 'Qual o horário de funcionamento da clínica?', a: 'Atendemos de segunda a sexta das 08h às 19h e aos sábados das 08h às 13h.' },
                      { cat: 'Formas de Pagamento', q: 'Vocês aceitam convênios médicos ou Pix?', a: 'Aceitamos Pix com 5% de desconto, cartões de crédito em até 3x e emitimos recibo para reembolso.' }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#128C7E] bg-emerald-50 px-2 py-0.5 rounded">
                            {item.cat}
                          </span>
                          <span className="text-[10px] text-slate-400">Sincronizado na IA</span>
                        </div>
                        <p className="text-xs font-bold text-[#111B21]">{item.q}</p>
                        <p className="text-xs text-[#667781] leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'inbox' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#111B21]">Caixa de Entrada Unificada (Inbox)</h4>
                      <p className="text-xs text-[#667781]">Supervisão de conversas ao vivo e intervenção com 1 clique</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#128C7E] text-xs font-bold">
                      ● 3 Conversas em Andamento
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Chat list */}
                    <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1 text-xs">
                      <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111B21]">Mariana Santos</span>
                          <span className="text-[10px] text-slate-400">14:32</span>
                        </div>
                        <p className="text-[11px] text-[#128C7E] truncate font-medium">IA: Olá Mariana! Temos horário amanhã...</p>
                      </div>
                      <div className="p-2.5 rounded-lg hover:bg-slate-50 border border-transparent cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111B21]">Carlos Eduardo</span>
                          <span className="text-[10px] text-slate-400">14:15</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Carlos: Qual o endereço de vocês?</p>
                      </div>
                    </div>

                    {/* Chat view */}
                    <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <span className="font-bold text-xs text-[#111B21]">Mariana Santos</span>
                          <span className="text-[10px] text-[#128C7E] block">Zapella (IA) está atendendo • Confiança 98%</span>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold">
                          Assumir Conversa
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="bg-slate-100 p-2.5 rounded-xl rounded-tl-none max-w-[80%] text-slate-800">
                          Mariana: Olá, queria agendar uma consulta com o dermatologista para amanhã.
                        </div>
                        <div className="bg-[#D9FDD3] p-2.5 rounded-xl rounded-tr-none max-w-[80%] ml-auto text-slate-900">
                          Zapella (IA): Olá Mariana! Temos horários disponíveis amanhã às 10h e às 15h30. Qual fica melhor para você?
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        Pressione para responder manualmente ou deixe a IA continuar.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#111B21]">Conexão com WhatsApp</h4>
                      <p className="text-xs text-[#667781]">Conecte seu WhatsApp comercial em segundos via QR Code</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#128C7E] text-xs font-bold">
                      ● WhatsApp Conectado
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#128C7E] flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-[#111B21]">+55 (11) 98765-4321</p>
                          <p className="text-[11px] text-[#128C7E]">Instância Ativa & Respondendo 24/7</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Nuvem Zapella:</span>
                          <span className="font-bold text-[#128C7E]">100% Operacional</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Tempo médio de resposta:</span>
                          <span className="font-bold text-[#111B21]">2.4 segundos</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-3">
                      <div className="w-32 h-32 mx-auto bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-slate-400" strokeWidth={1.5} />
                      </div>
                      <p className="text-xs font-semibold text-slate-700">QR Code escaneado com sucesso</p>
                      <p className="text-[11px] text-slate-400">Caso deseje trocar de aparelho, basta desconectar e ler um novo código.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                  {[
                    'Até 1.000 mensagens/mês',
                    '1 Número de WhatsApp Conectado',
                    'Base de Conhecimento RAG',
                    'Funil CRM Nativo (Kanban)',
                    'Agendamento de Calls com IA',
                    'Painel de Inbox para 1 operador'
                  ].map(f => (
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
                  {[
                    'Mensagens ilimitadas',
                    '1 Número de WhatsApp Conectado',
                    'Funil CRM Completo com Múltiplas Etapas',
                    'Disparo em Grupos VIP com Antiban',
                    'Agendamento com Calendly & Google',
                    'Sugestões de Resposta IA (Copiloto)',
                    'Até 5 operadores no Inbox'
                  ].map(f => (
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
                  {[
                    'Múltiplos números WhatsApp',
                    'Operadores ilimitados',
                    'CRM Avançado & Campos Personalizados',
                    'Disparo em Massa para Grupos Ilimitados',
                    'Suporte prioritário via WhatsApp',
                    'Treinamento de IA sob medida'
                  ].map(f => (
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
      <footer className="border-t border-[#E0E3E1] py-14 px-6 lg:px-14" style={{ background: '#F4F5F4' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm"
                   style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}>
                <Image src="/zapella-icon.png" alt="Zapella" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-[#171901] text-sm">Zapella</span>
            </div>
            <p className="text-[#4D4D61] leading-relaxed">
              A secretária virtual inteligente com IA conversacional humanizada, CRM Kanban e proteção antiban para WhatsApp.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#171901] mb-3 uppercase tracking-wider text-[11px]">Soluções por Nicho</h4>
            <ul className="space-y-2 text-[#4D4D61]">
              <li>
                <Link href="/solucoes/clinicas-e-consultorios" className="hover:text-[#2E7D5A] transition-colors">
                  Clínicas & Consultórios
                </Link>
              </li>
              <li>
                <Link href="/solucoes/imobiliarias-e-corretores" className="hover:text-[#2E7D5A] transition-colors">
                  Imobiliárias & Corretores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#171901] mb-3 uppercase tracking-wider text-[11px]">Comparativos & Conceitos</h4>
            <ul className="space-y-2 text-[#4D4D61]">
              <li>
                <Link href="/comparativo/zapella-vs-chatbots-tradicionais" className="hover:text-[#2E7D5A] transition-colors">
                  Zapella vs Chatbots de Botão
                </Link>
              </li>
              <li>
                <Link href="/glossario" className="hover:text-[#2E7D5A] transition-colors">
                  Glossário de IA & Automação
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#171901] mb-3 uppercase tracking-wider text-[11px]">Legal & Suporte</h4>
            <ul className="space-y-2 text-[#4D4D61]">
              <li>
                <Link href="/termos" className="hover:text-[#2E7D5A] transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-[#2E7D5A] transition-colors">
                  Privacidade & LGPD
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsSupportOpen(true)}
                  className="hover:text-[#2E7D5A] transition-colors font-bold text-[#2E7D5A] flex items-center gap-1.5"
                >
                  <span>Central de Suporte</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#E0E3E1]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#70727B]">
          <p>© 2026 Zapella. Todos os direitos reservados.</p>
          <p>Feito para empresas que não aceitam perder clientes no WhatsApp.</p>
        </div>
      </footer>

      {/* ── Floating Support Button (FAB) ── */}
      <button
        onClick={() => setIsSupportOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full text-[#171901] font-extrabold text-xs shadow-xl transition-all hover:scale-105 hover:opacity-95 active:scale-95 group border border-white/20"
        style={{
          background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)',
          boxShadow: '0 8px 24px rgba(0,230,118,0.35)',
        }}
        aria-label="Abrir suporte interativo"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#171901] opacity-40" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#171901]" />
        </span>
        <MessageSquare className="w-4 h-4 text-[#171901]" />
        <span>Suporte & Dúvidas</span>
      </button>

      {/* ── Interactive Support Chat (Sem IA, FAQ Direcionado) ── */}
      {isSupportOpen && (
        <SupportChatModal onClose={() => setIsSupportOpen(false)} />
      )}

      {isSimulatorOpen && (
        <WhatsAppSimulatorModal onClose={() => setIsSimulatorOpen(false)} />
      )}
    </div>
  );
}
