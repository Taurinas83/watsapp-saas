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
  Sparkles,
  BookOpen,
  QrCode,
  Eye,
  UserCheck,
  Cpu,
  Layers,
  Sliders,
  Play
} from 'lucide-react';
import { WhatsAppSimulatorModal } from '@/components/WhatsAppSimulatorModal';

export default function LandingPage() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'attendant' | 'knowledge' | 'inbox' | 'whatsapp'>('attendant');

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
              Construída para empresas que precisam de atendimento sério, preciso e sem respostas inventadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Diff 1: RAG Sem Alucinações */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#128C7E] flex items-center justify-center">
                <BookOpen className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">RAG Sem Alucinações</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                A IA responde estritamente o que você ensinou na Base de Conhecimento. Nunca inventa preços, prazos ou promoções inexistentes.
              </p>
            </div>

            {/* Diff 2: Transferência Imediata */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#128C7E] flex items-center justify-center">
                <UserCheck className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Handover Inteligente</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Configure palavras-chave como "cancelar", "humano" ou "urgente". O bot pausa instantaneamente e transfere para sua equipe.
              </p>
            </div>

            {/* Diff 3: Modo Copiloto */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C4DFF] flex items-center justify-center">
                <Sparkles className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Modo Copiloto para a Equipe</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                A IA redige sugestões de respostas perfeitas dentro da Inbox. Seu atendente humano apenas revisa e envia com 1 clique.
              </p>
            </div>

            {/* Diff 4: Conexão QR Code */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <QrCode className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Conexão QR Code em 30s</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Zero burocracia de validação no Facebook Meta. Conecte qualquer WhatsApp comercial existente como se fosse o WhatsApp Web.
              </p>
            </div>

            {/* Diff 5: Supervisão em Tempo Real */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Eye className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">Supervisão & Auditoria</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Acompanhe o grau de confiança de cada resposta da IA, métricas de tempo de resposta e assuma conversas a qualquer momento.
              </p>
            </div>

            {/* Diff 6: 100% em Nuvem 24/7 */}
            <div className="p-7 rounded-3xl bg-white border border-[#E0E3E1] space-y-3 hover:border-[#00E676] transition-all shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#128C7E] flex items-center justify-center">
                <Cpu className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-bold text-[#171901]">100% em Nuvem 24/7</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Seu celular ficou sem bateria ou sem sinal? A Zapella continua respondendo sem parar nos servidores de alta disponibilidade.
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
              { id: 'attendant', label: 'Identidade do Atendente', icon: Bot },
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
              {activeTab === 'attendant' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#111B21]">Identidade do Atendente Virtual</h4>
                      <p className="text-xs text-[#667781]">Configure o tom de voz e regras de conduta da Zapella</p>
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
                      <label className="font-bold text-[#111B21] block">Palavras-chave de Transferência Imediata</label>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700">falar com atendente</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700">cancelar</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700">doutor</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700">urgente</span>
                      </div>
                      <p className="text-[11px] text-[#667781]">
                        Ao detectar esses termos, a IA pausa na hora e notifica sua equipe.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <label className="font-bold text-[#111B21] block">Instruções Customizadas da Empresa</label>
                    <div className="p-3 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-700 border border-slate-200">
                      "Você é a Zapella, secretária da Clínica Saúde Total. Nosso horário é de seg a sex das 08h às 19h. Sempre confirme o nome do paciente antes de agendar qualquer consulta."
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
