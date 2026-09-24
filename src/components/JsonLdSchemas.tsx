import React from 'react';

export function JsonLdSchemas() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zapella',
    url: 'https://www.zapella.app',
    logo: 'https://www.zapella.app/zapella-icon.png',
    description: 'Plataforma líder em Secretária Virtual com Inteligência Artificial e CRM Integrado para WhatsApp.',
    sameAs: [
      'https://www.instagram.com/zapella.app',
      'https://github.com/Taurinas83/watsapp-saas'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://www.zapella.app/#suporte',
      availableLanguage: ['Portuguese', 'English']
    }
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Zapella',
    operatingSystem: 'All (Cloud/SaaS)',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '97.00',
      priceCurrency: 'BRL',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: 'https://www.zapella.app/#planos'
    },
    description: 'Secretária virtual com inteligência artificial para WhatsApp, automação de agendamentos no Google Calendar, funil Kanban CRM nativo e disparos protegidos contra banimento.',
    featureList: [
      'Atendimento 24/7 humanizado via WhatsApp Business API',
      'CRM Kanban Nativo com captura automática de leads',
      'Integração com Calendly e Google Calendar',
      'Base de Conhecimento RAG sem alucinações',
      'Agendador de Mensagens para Grupos com Proteção Antiban',
      'Transbordo Inteligente para Atendentes Humanos (Handover)',
      'Modo Copiloto Human-in-the-Loop'
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'A Zapella consegue agendar reuniões e consultas para mim?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! A Zapella integra-se com Calendly, Cal.com ou Google Calendar. Quando o cliente demonstra interesse em marcar um horário ou consulta, a IA identifica a intenção e envia o seu link de agendamento na hora exata, sem você precisar intervir.'
        }
      },
      {
        '@type': 'Question',
        name: 'Como funciona o CRM integrado dentro da Zapella?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Todo cliente que conversa no seu WhatsApp é automaticamente cadastrado como lead no seu Funil de Vendas (Kanban). Você visualiza em qual etapa da negociação ele está, o valor estimado do negócio e tem acesso direto ao chat com 1 clique.'
        }
      },
      {
        '@type': 'Question',
        name: 'Posso mandar mensagens para grupos de WhatsApp sem risco de banimento?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim! Nosso Agendador de Mensagens para Grupos VIP conta com proteção antiban inteligente (intervalo humanizado de 15 a 30 segundos entre envios) e opera com custo zero de tokens de IA, perfeito para lançamentos e comunidades.'
        }
      },
      {
        '@type': 'Question',
        name: 'Preciso ter o celular ligado o tempo todo para a Zapella funcionar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Não! Graças à integração via WhatsApp Business API (Evolution API), a Zapella opera 100% na nuvem, 24 horas por dia, 7 dias por semana, mesmo que seu celular esteja desligado ou sem bateria.'
        }
      },
      {
        '@type': 'Question',
        name: 'Como a IA aprende sobre os preços e serviços da minha empresa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Você cadastra suas informações na Base de Conhecimento (RAG) em poucos minutos. Basta incluir perguntas e respostas frequentes, cardápio ou tabela de preços. A IA consulta estes dados instantaneamente a cada mensagem.'
        }
      },
      {
        '@type': 'Question',
        name: 'O que acontece se um cliente fizer uma pergunta difícil ou quiser falar com uma pessoa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A Zapella possui gatilhos inteligentes de Handover. Se o cliente pedir para falar com um atendente ou demonstrar insatisfação, a IA pausa a resposta automática e transfere a conversa imediatamente para a Caixa de Entrada da sua equipe.'
        }
      },
      {
        '@type': 'Question',
        name: 'Quais modelos de Inteligência Artificial a Zapella utiliza?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Trabalhamos com um motor híbrido de ponta: Google Gemini 2.5 Flash, Groq (Llama 3.3 70B), DeepSeek V3 e Claude 3.5 Haiku, combinando ultra-velocidade com respostas humanizadas e precisas.'
        }
      }
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Zapella',
    url: 'https://www.zapella.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.zapella.app/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
