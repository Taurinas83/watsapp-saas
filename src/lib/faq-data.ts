export interface FaqItem {
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

export interface FaqCategory {
  id: string;
  label: string;
  iconName?: string;
  description?: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'all', label: 'Todas as Dúvidas' },
  { id: 'whatsapp', label: '📱 Conexão WhatsApp', description: 'QR Code, reconexão e proteção antiban' },
  { id: 'bot', label: '🤖 Robô & IA', description: 'Base RAG, transbordo e pausa' },
  { id: 'agenda', label: '📅 Agendas & Grupos', description: 'Calendly, Google Calendar e convites' },
  { id: 'crm', label: '🎯 Funil CRM', description: 'Gestão visual de leads e negócios' },
  { id: 'broadcast', label: '⏰ Mensagens Agendadas', description: 'Disparo seguro para grupos VIP' },
  { id: 'billing', label: '💳 Planos & Faturas', description: 'Teste de 7 dias e assinaturas' },
];

export const FAQ_DATA: FaqItem[] = [
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
  {
    id: 'billing-2',
    category: 'billing',
    categoryLabel: 'Planos & Faturas',
    question: 'Como funciona o teste gratuito de 7 dias?',
    answer: 'Você pode se cadastrar e testar todas as funcionalidades do Zapella por 7 dias corridos sem precisar cadastrar cartão de crédito no momento do registro. Durante esse período, você pode conectar seu WhatsApp, criar sua base RAG e testar os atendimentos livremente.',
    steps: [
      'Clique em "Testar Grátis — 7 dias" na página inicial.',
      'Crie sua conta informando nome, e-mail e senha.',
      'Conecte seu WhatsApp escaneando o QR Code.',
      'Aproveite 7 dias completos com suporte para testar sua secretária IA.',
    ],
    tip: 'Ao final do teste, você pode escolher o plano ideal (Starter, Pro ou Enterprise) para continuar operando sem interrupções.',
  },
  {
    id: 'billing-3',
    category: 'billing',
    categoryLabel: 'Planos & Faturas',
    question: 'Existe fidelidade ou multa de cancelamento?',
    answer: 'Não! O Zapella não possui fidelidade e nem multa de rescisão. As assinaturas são mensais e você pode pausar ou cancelar o serviço a qualquer momento com apenas 1 clique no painel.',
  },
];
