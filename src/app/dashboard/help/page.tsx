'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  QrCode,
  Bot,
  Calendar,
  Users,
  Kanban,
  CalendarClock,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'whatsapp' | 'bot' | 'agenda' | 'crm' | 'broadcast' | 'billing';
  categoryLabel: string;
  question: string;
  answer: string;
  steps?: string[];
  tip?: string;
  actionLink?: {
    label: string;
    href: string;
  };
}

const FAQ_DATA: FaqItem[] = [
  // ── WHATSAPP & CONEXÃO ──────────────────────────────────────────────────
  {
    id: 'wa-1',
    category: 'whatsapp',
    categoryLabel: 'Conexão WhatsApp',
    question: 'Como conectar o meu WhatsApp no Zapella?',
    answer: 'A conexão é feita de forma simples via QR Code, exatamente como no WhatsApp Web.',
    steps: [
      'Acesse o menu "Conexão WhatsApp" no painel lateral.',
      'Clique no botão "Gerar QR Code".',
      'Abra o aplicativo do WhatsApp no seu celular físico.',
      'Vá em Configurações (ou 3 pontinhos) > "Aparelhos conectados" > "Conectar um aparelho".',
      'Aponte a câmera do celular para a tela e aguarde a confirmação de "WhatsApp Conectado".',
    ],
    tip: 'Mantenha o seu celular conectado à internet. O WhatsApp precisa do celular online para sincronizar os atendimentos.',
    actionLink: {
      label: 'Ir para Conexão WhatsApp',
      href: '/dashboard/whatsapp',
    },
  },
  {
    id: 'wa-2',
    category: 'whatsapp',
    categoryLabel: 'Conexão WhatsApp',
    question: 'O que fazer se o meu WhatsApp desconectar?',
    answer: 'O WhatsApp pode desconectar se o celular ficar sem bateria, sem internet por muito tempo ou se o aplicativo for reiniciado pelo sistema operacional do celular.',
    steps: [
      'Acesse "Conexão WhatsApp".',
      'Se o status estiver como "Desconectado", clique em "Reconectar / Novo QR Code".',
      'Escaneie o novo QR Code com o seu celular.',
      'Assim que conectar, a IA volta a responder imediatamente sem perder nenhuma configuração.',
    ],
    tip: 'No seu celular Android/iPhone, desative a otimização de bateria para o aplicativo do WhatsApp para que o sistema não feche o app em segundo plano.',
    actionLink: {
      label: 'Verificar Status da Conexão',
      href: '/dashboard/whatsapp',
    },
  },
  {
    id: 'wa-3',
    category: 'whatsapp',
    categoryLabel: 'Conexão WhatsApp',
    question: 'Como evitar bloqueios de número pela Meta/WhatsApp?',
    answer: 'O Zapella foi desenvolvido com proteções ativas para preservar a saúde do seu número. No entanto, é fundamental seguir boas práticas:',
    steps: [
      'Evite enviar mensagens privadas em massa para contatos que nunca falaram com você.',
      'Para comunicados e ofertas em massa, use o recurso "Mensagens Agendadas para Grupos", onde as pessoas já escolheram participar.',
      'Use um número que já tenha histórico de conversas e não um chip virgem recém-ativado.',
      'Configure o tom de voz amigável na "Identidade do Atendente" para gerar empatia e evitar que clientes denunciem a conversa.',
    ],
    tip: 'Mensagens em grupos onde você é administrador têm risco quase nulo de banimento, pois os membros optaram por estar no grupo.',
  },

  // ── ROBÔ & BASE RAG ──────────────────────────────────────────────────────
  {
    id: 'bot-1',
    category: 'bot',
    categoryLabel: 'Robô & IA',
    question: 'Como ensinar o robô sobre os meus produtos e serviços?',
    answer: 'O robô utiliza tecnologia RAG (Busca Inteligente em Base de Conhecimento). Você não precisa programar nada: basta cadastrar perguntas e respostas comuns.',
    steps: [
      'Acesse o menu "Base de Conhecimento".',
      'Clique em "Novo Item de Conhecimento".',
      'Preencha uma Pergunta Comum (ex: "Qual o valor da consulta?", "Quais as formas de pagamento?", "Qual o endereço?").',
      'Escreva a Resposta Oficial completa.',
      'Selecione a categoria e salve. O robô passa a usar essa informação imediatamente na próxima conversa!',
    ],
    tip: 'Quanto mais claras forem as respostas cadastradas, mais preciso e seguro o robô será ao responder os clientes no WhatsApp.',
    actionLink: {
      label: 'Acessar Base de Conhecimento',
      href: '/dashboard/knowledge',
    },
  },
  {
    id: 'bot-2',
    category: 'bot',
    categoryLabel: 'Robô & IA',
    question: 'Como funciona o transbordo para atendente humano?',
    answer: 'Sempre que o robô perceber que o cliente precisa falar com uma pessoa, ele transfere o atendimento automaticamente para a equipe humana.',
    steps: [
      'A IA identifica palavras-chave de transbordo (ex: "falar com humano", "atendente", "pessoa de verdade").',
      'A IA detecta sinais de insatisfação ou pedidos complexos.',
      'O robô avisa com educação: "Entendido! Estou transferindo para a nossa equipe agora mesmo".',
      'A conversa é marcada com o status "Aguardando Humano" e o lead é movido no CRM para a coluna "Atendimento Humano".',
    ],
    tip: 'Você pode cadastrar palavras-chave personalizadas na aba "Identidade do Atendente" para disparar o transbordo no momento exato que desejar.',
    actionLink: {
      label: 'Configurar Palavras-chave',
      href: '/dashboard/attendant',
    },
  },
  {
    id: 'bot-3',
    category: 'bot',
    categoryLabel: 'Robô & IA',
    question: 'Como pausar o robô quando eu quiser atender manualmente?',
    answer: 'Você pode pausar o robô a qualquer momento com apenas 1 clique no botão superior do painel:',
    steps: [
      'No topo de qualquer tela do Zapella, localize o botão "🟢 Bot Ativo".',
      'Clique nele para alternar para "⏸️ Bot Pausado".',
      'Enquanto pausado, o robô não responderá nenhuma mensagem, permitindo que você responda tudo manualmente no seu celular ou WhatsApp Web.',
      'Para reativar a IA, basta clicar novamente no mesmo botão.',
    ],
    tip: 'O botão de pausa é instantâneo e não afeta as conversas já salvas no histórico.',
  },

  // ── AGENDAMENTO & GRUPOS ─────────────────────────────────────────────────
  {
    id: 'agenda-1',
    category: 'agenda',
    categoryLabel: 'Agendamento & Grupos',
    question: 'Como funciona o agendamento de reuniões/calls com clientes?',
    answer: 'O Zapella integra com as principais ferramentas de calendário do mercado (Calendly, Cal.com e Google Calendar).',
    steps: [
      'Acesse "Identidade do Atendente".',
      'No bloco "Agendamento de Calls & Consultas", cole o link da sua agenda (ex: https://calendly.com/sua-empresa).',
      'Adicione instruções opcionais de quando o robô deve oferecer a agenda.',
      'Clique em "Salvar Todas as Configurações".',
      'Quando o cliente no WhatsApp disser "quero agendar uma reunião" ou "como marco uma consulta?", o robô enviará o seu link oficial orientando o cliente a escolher o dia e horário.',
    ],
    tip: 'Quando o robô envia o link de agendamento, o lead é movido automaticamente no seu CRM para a coluna "Agendados"!',
    actionLink: {
      label: 'Configurar Link da Agenda',
      href: '/dashboard/attendant',
    },
  },
  {
    id: 'agenda-2',
    category: 'agenda',
    categoryLabel: 'Agendamento & Grupos',
    question: 'Como convidar clientes para o meu Grupo VIP no WhatsApp?',
    answer: 'Você pode usar a IA para fazer a transição de clientes atendidos no privado para a sua comunidade de WhatsApp.',
    steps: [
      'Crie o grupo no seu aplicativo do WhatsApp no celular (defina foto, nome e descrição).',
      'Nas configurações do grupo no WhatsApp, copie o "Link de convite do grupo" (https://chat.whatsapp.com/...).',
      'Acesse "Identidade do Atendente" no Zapella.',
      'Cole o link no campo "Link de Convite do Grupo de WhatsApp".',
      'O robô convidará os leads qualificados no final do atendimento para entrarem no seu grupo VIP!',
    ],
    tip: 'Recomendamos ativar nas configurações do grupo no WhatsApp a opção "Apenas administradores podem enviar mensagens". Isso mantém seu grupo organizado como canal de avisos e novidades.',
    actionLink: {
      label: 'Configurar Grupo VIP',
      href: '/dashboard/attendant',
    },
  },

  // ── CRM & FUNIL DE VENDAS ────────────────────────────────────────────────
  {
    id: 'crm-1',
    category: 'crm',
    categoryLabel: 'Funil CRM',
    question: 'Como os leads entram no CRM e como funciona a automação?',
    answer: 'O CRM do Zapella é 100% nativo e integrado ao WhatsApp. Você não precisa cadastrar nada manualmente!',
    steps: [
      'Sempre que um novo contato enviar mensagem no WhatsApp, ele é criado automaticamente na coluna "Em Qualificação (IA)".',
      'Conforme a conversa avança, a IA atualiza o resumo do atendimento.',
      'Se o cliente pedir para falar com alguém, o card é movido automaticamente para "Atendimento Humano".',
      'Se o robô enviar o link de agendamento, o card é movido automaticamente para "Agendados".',
      'Você também pode arrastar ou selecionar manualmente a coluna para mover o lead para "Fechado / Ganho" ou "Perdido".',
    ],
    tip: 'Dentro de cada card no CRM, clique no botão "Chat" para abrir instantaneamente o histórico da conversa ao vivo!',
    actionLink: {
      label: 'Acessar Funil CRM',
      href: '/dashboard/crm',
    },
  },
  {
    id: 'crm-2',
    category: 'crm',
    categoryLabel: 'Funil CRM',
    question: 'Como definir o valor estimado de um negócio no CRM?',
    answer: 'No menu "Funil CRM & Vendas", clique no ícone de lápis em qualquer card de lead, digite o valor em Reais (ex: 1500.00) e salve. O sistema somará o valor da coluna e o valor total do funil automaticamente.',
    actionLink: {
      label: 'Ir para o CRM',
      href: '/dashboard/crm',
    },
  },

  // ── MENSAGENS AGENDADAS ──────────────────────────────────────────────────
  {
    id: 'broadcast-1',
    category: 'broadcast',
    categoryLabel: 'Mensagens Agendadas',
    question: 'Como agendar mensagens e comunicados para os meus grupos?',
    answer: 'Você pode programar avisos, promoções e conteúdos para serem disparados em grupos em datas e horários futuros.',
    steps: [
      'Acesse o menu "Mensagens Agendadas" no painel lateral.',
      'Clique no botão "Nova Mensagem".',
      'Selecione o Grupo de Destino na lista (os grupos são carregados automaticamente da sua conexão do WhatsApp).',
      'Escreva a mensagem com os detalhes, ofertas ou comunicados.',
      'Escolha a Data e o Horário exatos do disparo.',
      'Clique em "Confirmar Agendamento". A mensagem ficará na fila com status "Pendente" até o horário programado.',
    ],
    tip: 'Esse disparo tem CUSTO ZERO DE IA e possui blindagem antiban com intervalo inteligente entre envios.',
    actionLink: {
      label: 'Agendar Mensagem',
      href: '/dashboard/broadcast',
    },
  },
  {
    id: 'broadcast-2',
    category: 'broadcast',
    categoryLabel: 'Mensagens Agendadas',
    question: 'Por que o agendamento de mensagens para grupos é seguro?',
    answer: 'Disparar mensagens em grupos onde você é participante ou administrador é a forma mais segura de comunicação no WhatsApp. Diferente de mensagens privadas não solicitadas (onde o cliente pode denunciar como spam), no grupo os membros já conhecem a sua marca. Além disso, o Zapella aplica um intervalo de segurança de 15 a 30 segundos entre envios.',
  },

  // ── ASSINATURA & PLANOS ──────────────────────────────────────────────────
  {
    id: 'billing-1',
    category: 'billing',
    categoryLabel: 'Planos & Faturas',
    question: 'Como consultar o status da minha assinatura ou faturas?',
    answer: 'Você pode acompanhar os dados da sua empresa, plano ativo e detalhes de faturamento diretamente no menu "Configurações Gerais". As faturas são processadas de forma segura via gateway Asaas.',
    actionLink: {
      label: 'Ver Minha Assinatura',
      href: '/dashboard/settings',
    },
  },
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('wa-1');

  const categories = [
    { id: 'all', label: 'Todas as Dúvidas' },
    { id: 'whatsapp', label: '📱 Conexão WhatsApp' },
    { id: 'bot', label: '🤖 Robô & IA' },
    { id: 'agenda', label: '📅 Agendas & Grupos' },
    { id: 'crm', label: '🎯 Funil CRM' },
    { id: 'broadcast', label: '⏰ Mensagens Agendadas' },
    { id: 'billing', label: '💳 Planos & Faturas' },
  ];

  const filteredFaq = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term) ||
        (item.steps && item.steps.some((s) => s.toLowerCase().includes(term))) ||
        (item.tip && item.tip.toLowerCase().includes(term));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <Header
        title="Central de Ajuda & Tutoriais Rápidos"
        subtitle="Guias didáticos passo a passo para você dominar todos os recursos do Zapella"
      />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Top Hero / Search Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Base de Conhecimento Oficial
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">Como podemos te ajudar hoje?</h2>
            <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
              Tire dúvidas instantâneas sobre conexão do WhatsApp, treinamento do robô, agendamentos, funil CRM e mensagens agendadas.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl pt-2">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite sua dúvida (ex: como conectar, agenda, grupos, transbordo)..."
              className="w-full bg-white text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 text-xs focus:outline-none shadow-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#128C7E] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#128C7E]/40 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaq.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Nenhum resultado encontrado para &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-xs text-slate-400">Tente buscar por outras palavras-chave ou navegue pelas categorias acima.</p>
            </div>
          ) : (
            filteredFaq.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-[#128C7E]/50 shadow-sm ring-1 ring-[#128C7E]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                          isExpanded ? 'bg-[#128C7E] text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        ?
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#128C7E]">
                          {item.categoryLabel}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.question}</h3>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 text-xs text-slate-700 leading-relaxed animate-in fade-in-50">
                      <p>{item.answer}</p>

                      {/* Step-by-step guidance */}
                      {item.steps && item.steps.length > 0 && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                            Passo a Passo:
                          </span>
                          <ol className="space-y-2">
                            {item.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                                <span className="w-5 h-5 rounded-full bg-[#128C7E]/10 text-[#128C7E] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Gold Tip Callout */}
                      {item.tip && (
                        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 flex items-start gap-2.5 text-xs">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block mb-0.5 text-amber-950">Dica de Ouro:</span>
                            <span>{item.tip}</span>
                          </div>
                        </div>
                      )}

                      {/* Direct Action Link */}
                      {item.actionLink && (
                        <div className="pt-2 flex items-center justify-end">
                          <Link
                            href={item.actionLink.href}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                          >
                            <span>{item.actionLink.label}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Support Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-[#128C7E] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Ainda precisa de ajuda especializada?</h4>
              <p className="text-xs text-slate-500">
                Nossa equipe de suporte está pronta para te auxiliar com qualquer configuração específica.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/5511999999999?text=Olá!%20Preciso%20de%20ajuda%20com%20minha%20conta%20no%20Zapella."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Falar com Suporte</span>
          </a>
        </div>
      </div>
    </div>
  );
}
