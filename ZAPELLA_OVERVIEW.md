# 🚀 ZAPELLA — Documentação Geral do Sistema

> **Plataforma SaaS de Atendimento Inteligente, CRM Nativo e Automação para WhatsApp com Inteligência Artificial**  
> **Versão da Plataforma:** 2.0 (Produção)  
> **Domínio Oficial:** [https://www.zapella.app](https://www.zapella.app)  
> **Última Atualização:** Setembro de 2026  

---

## 📑 Índice Executivo

1. [O que é a Zapella](#1-o-que-é-a-zapella)
2. [Para que serve e Proposta de Valor](#2-para-que-serve-e-proposta-de-valor)
3. [Público-Alvo e Casos de Uso](#3-público-alvo-e-casos-de-uso)
4. [Arquitetura e Stack Tecnológica](#4-arquitetura-e-stack-tecnológica)
5. [Módulos e Funcionalidades Detalhadas](#5-módulos-e-funcionalidades-detalhadas)
   - 5.1. Conexão WhatsApp 100% Nuvem
   - 5.2. Motor de IA e Base RAG Sem Alucinações
   - 5.3. Identidade do Atendente e Transbordo Humano
   - 5.4. Funil CRM de Vendas Nativo (Kanban)
   - 5.5. Agendamento Integrado (Calendly, Cal.com e Google)
   - 5.6. Disparo e Agendamento em Grupos VIP (Antiban)
   - 5.7. Inbox ao Vivo e Modo Copiloto
   - 5.8. Central de Ajuda Interna (FAQ Didático)
   - 5.9. God Mode (Painel Master do Super Admin)
   - 5.10. Landing Page, Suporte Simulado e Compliance LGPD
6. [Guia de Branding e Identidade Visual](#6-guia-de-branding-e-identidade-visual)
7. [Diferenciais Competitivos](#7-diferenciais-competitivos)
8. [Segurança e Conformidade Jurídica](#8-segurança-e-conformidade-jurídica)

---

## 1. O que é a Zapella?

A **Zapella** é uma plataforma **Software as a Service (SaaS)** desenvolvida para transformar o WhatsApp de empresas em um canal autônomo de vendas, suporte e atendimento ao cliente. 

O sistema atua como uma **secretária virtual inteligente** equipada com modelos avançados de Inteligência Artificial Generativa e tecnologia de **Busca Aumentada por Recuperação (RAG)**. A secretária virtual opera **24 horas por dia, 7 dias por semana**, respondendo mensagens em menos de 3 segundos com linguagem humanizada e fundamentada estritamente nas regras e informações cadastradas pelo próprio cliente.

Diferente de chatbots tradicionais baseados em árvores engessadas ("digite 1 para financeiro, digite 2 para comercial"), a Zapella compreende áudios, textos informais, gírias e intenções complexas, gerando respostas personalizadas, qualificando leads no CRM e agendando compromissos automaticamente.

---

## 2. Para que serve e Proposta de Valor

### O Problema que Resolvemos:
- **Demora no primeiro contato:** Clientes que esperam mais de 5 minutos no WhatsApp procuram o concorrente.
- **Atendimento fora do horário comercial:** Perda de oportunidades e vendas em noites, fins de semana e feriados.
- **Desorganização de leads:** Conversas perdidas no histórico do WhatsApp sem acompanhamento comercial.
- **Custo e sobrecarga humana:** Equipes sobrecarregadas respondendo as mesmas dúvidas básicas repetidas vezes.
- **Risco de banimento:** Uso de ferramentas amadoras de disparo que violam as políticas da Meta.

### A Solução Zapella:
1. **Velocidade Extrema:** Respostas instantâneas em < 3 segundos a qualquer hora do dia ou da noite.
2. **Zero Alucinações:** A IA só responde o que foi cadastrado na Base de Conhecimento oficial da empresa.
3. **Conversão Automatizada:** Conduz o lead de forma natural pelo funil até o agendamento de uma call ou fechamento.
4. **Operação 100% em Nuvem:** Funciona mesmo se o computador for desligado ou se o celular ficar sem bateria.
5. **Transbordo Fluido:** Identifica insatisfação ou pedidos complexos e passa a conversa para o operador humano imediatamente.

---

## 3. Público-Alvo e Casos de Uso

A Zapella atende empresas de serviços, consultorias e comércios que utilizam o WhatsApp como principal ponto de contato:

- **Clínicas e Consultórios Médicos/Odontológicos:** Tiram dúvidas sobre tratamentos, informam convênios e enviam o link de agendamento de consultas.
- **Advogados e Consultorias:** Triagem preliminar de clientes, esclarecimento de áreas de atuação e marcação de reuniões diagnósticas.
- **Estúdios de Estética e Salões:** Apresentação de tabela de preços, serviços, horários de atendimento e captação de agendamentos.
- **Infoprodutores e Especialistas:** Suporte a alunos, onboarding, qualificação de leads de lançamentos e avisos em grupos VIP.
- **Imobiliárias e Corretores:** Apresentação de imóveis, filtros de orçamento e agendamento de visitas com o corretor.
- **Empresas B2B e Agências:** Qualificação de prospects e direcionamento para reuniões de fechamento no Google Calendar / Calendly.

---

## 4. Arquitetura e Stack Tecnológica

O sistema foi construído sobre uma arquitetura moderna, escalável e resiliente:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ZAPELLA ECOSYSTEM                             │
├─────────────────┬──────────────────────┬───────────────────────────────┤
│    FRONTEND     │       BACKEND        │         INTEGRAÇÕES           │
│ Next.js 14      │ Next.js App Router   │ Evolution API (Baileys)       │
│ React & Hooks   │ Serverless Functions │ Google Gemini 2.5 Flash       │
│ TailwindCSS     │ Webhooks Resilientes │ Groq (Llama 3.3 70B)          │
│ Lucide Icons    │ Supabase PostgreSQL  │ DeepSeek V3 / Claude 3.5      │
│ SSR & ISR       │ Row Level Security   │ Asaas Gateway (Faturamento)   │
└─────────────────┴──────────────────────┴───────────────────────────────┘
```

- **Frontend & Interface:** Next.js 14 (App Router) com TypeScript, TailwindCSS moderno e componentização modular.
- **Banco de Dados & Autenticação:** Supabase (PostgreSQL 15), com **Row Level Security (RLS)** garantindo isolamento absoluto de dados entre tenants.
- **Conectividade WhatsApp:** Evolution API com integração WHATSAPP-BAILEYS em contêineres dedicados de alta performance.
- **Motor de IA (Multi-LLM):** Orquestrador dinâmico com suporte nativo a Google Gemini 2.5 Flash (ultrarrápido), Groq / Llama 3.3 70B (baixa latência e alta precisão), DeepSeek V3 e Claude 3.5 Sonnet.
- **Proteção de Privacidade (PII):** Sanitização e mascaramento de CPFs, senhas e cartões de crédito antes de qualquer chamada para a IA.
- **Hospedagem & Infraestrutura:** Vercel Edge Network global com alta disponibilidade e failover automatizado.

---

## 5. Módulos e Funcionalidades Detalhadas

### 5.1. Conexão WhatsApp 100% Nuvem (`/dashboard/whatsapp`)
- **Conexão em 30 Segundos:** Escaneamento de QR Code padrão WhatsApp Web diretamente na tela.
- **Persistência em Nuvem:** A conexão roda em servidores dedicados e permanece ativa mesmo que o aparelho do cliente fique sem internet ou desligue.
- **Monitoramento em Tempo Real:** Indicador visual de status (`Conectado`, `Conectando`, `Desconectado`), foto de perfil do número e contador de mensagens processadas.
- **Auto-Reconexão:** Rotina de recuperação e limpeza de instâncias zumbis com botão de "Reiniciar Conexão" em 1 clique.

### 5.2. Motor de IA e Base RAG Sem Alucinações (`/dashboard/knowledge`)
- **RAG Determinístico:** A IA pesquisa semântica e lexicalmente nas perguntas e respostas cadastradas antes de gerar a mensagem.
- **Categorização Estruturada:** Itens organizados por categorias (`FAQ`, `Produtos/Serviços`, `Preços/Planos`, `Horários`, `Geral`).
- **Respostas Multiformato:** Suporte a textos explicativos, listas de benefícios e instruções operacionais.
- **Custo Inteligente:** Sistema de cache de contexto para redução drástica no consumo de tokens.

### 5.3. Identidade do Atendente e Transbordo Humano (`/dashboard/attendant`)
- **Personalização de Persona:** Escolha de estilo (`Amigável & Caloroso`, `Profissional & Técnico`, `Descontraído & Ágil`).
- **Instruções Personalizadas:** Campo aberto para regras de negócio (ex: "Nunca mencione valores de descontos sem autorização prévia").
- **Handover Automático:** Detecção de termos críticos (ex: *"falar com atendente"*, *"humano"*, *"reclamação"*) e transferência imediata para a fila humana.
- **Botão de Pausa Instantânea:** Alternância imediata entre `🟢 Bot Ativo` e `⏸️ Bot Pausado` no cabeçalho do sistema.

### 5.4. Funil CRM de Vendas Nativo (Kanban) (`/dashboard/crm`)
- **Captura Automática de Leads:** Qualquer novo contato recebido no WhatsApp vira automaticamente um card no funil.
- **Etapas Automatizadas:**
  1. *Novo Lead / Em Qualificação (IA)*: Diálogo inicial com a secretária virtual.
  2. *Atendimento Humano*: Conversas onde o cliente pediu intervenção humana.
  3. *Agendados / Reunião*: Leads que receberam o link e agendaram horário.
  4. *Fechado / Ganho*: Negócios concluídos com valor monetário registrado.
  5. *Perdido / Sem Interesse*: Oportunidades descartadas.
- **Gestão de Valor Financeiro:** Atribuição de valor em Reais a cada negócio, com cálculo automático do valor por coluna e total do pipeline.
- **Acesso ao Chat com 1 Clique:** Botão para abrir o histórico completo da conversa ao vivo.

### 5.5. Agendamento Integrado de Calls e Consultas
- **Integração de Links de Calendário:** Compatibilidade total com **Calendly**, **Cal.com** e **Google Calendar**.
- **Envio Contextual:** A IA identifica quando o cliente expressa intenção de reunião (*"como faço para agendar?"*, *"tem horário amanhã?"*) e envia o link oficial orientando o agendamento.
- **Automação no CRM:** A conversa é movida automaticamente para a coluna "Agendados" no momento do envio do link.

### 5.6. Disparo e Agendamento em Grupos VIP (`/dashboard/broadcast`)
- **Blindagem Antiban Exclusiva:** Intervalo humanizado com jitter aleatório de 15 a 30 segundos entre os envios.
- **Custo Zero de IA:** Mensagens operam via envio direto de texto, consumindo R$ 0,00 em créditos de inteligência artificial.
- **Sincronização Automática:** Leitura automática de todos os grupos em que o número de WhatsApp é participante ou administrador.
- **Fila de Disparos:** Agendamento prévio com data e hora exatas, histórico de envios e status de entrega.

### 5.7. Inbox ao Vivo e Modo Copiloto (`/inbox`, `/dashboard/supervision`)
- **Central Unificada de Atendimento:** Histórico em tempo real de todas as conversas ativas.
- **Modo Copiloto:** Sugestões inteligentes de resposta geradas pela IA para que o operador humano revise e envie com 1 clique.
- **Filtros de Visão:** Separação entre conversas atendidas pela IA, aguardando equipe humana ou já finalizadas.

### 5.8. Central de Ajuda Interna (`/dashboard/help`)
- **FAQ Interativo para Clientes:** Guia visual completo com passo a passo ilustrado, dicas de ouro e links de atalho para configuração rápida do sistema.

### 5.9. God Mode (Painel Master do Super Admin) (`/admin`)
- **Visão 360º de Tenants:** Monitoramento de todas as empresas cadastradas no SaaS.
- **Status do WhatsApp em Tempo Real:** Diagnóstico contínuo via Evolution API exibindo quais clientes estão conectados (`• Conectado` em verde) ou desconectados.
- **Gestão Financeira e MRR:** Controle de receita recorrente mensal, planos ativos e faturas.
- **Ações de Suporte (Impersonate):** Capacidade do Super Admin de entrar na conta do cliente para prestar suporte sem pedir senha.
- **Auditoria e Logs:** Rastreamento completo de eventos críticos do sistema.

### 5.10. Landing Page, Suporte Simulado e Compliance LGPD
- **Landing Page de Alta Conversão:** Apresentação comercial, comparativos de planos, diferenciais e simulação interativa de telas.
- **Chat Simulado de Suporte (Sem IA):** Assistente no rodapé e menu que utiliza a base do FAQ interno para tirar dúvidas dos visitantes com custo zero de LLM e navegação guiada por pílulas de categorias.
- **Páginas Legais:** Termos de Uso completos (`/termos`) e Política de Privacidade estritamente em conformidade com a LGPD (`/privacidade`).

---

## 6. Guia de Branding e Identidade Visual

O design da Zapella foi concebido para transmitir **alta tecnologia, modernidade, inteligência artificial e a familiaridade acolhedora do WhatsApp**.

### 6.1. Paleta de Cores Oficial

| Nome da Cor | Código HEX | Função e Aplicação Principal |
| :--- | :--- | :--- |
| **WhatsApp Bright** | `#00E676` | Cor primária de ação, badges de conexão, botões de conversão e brilhos. |
| **Neural Purple** | `#7C4DFF` | Representa a Inteligência Artificial; usado em gradientes e destaques de IA. |
| **Accent Teal** | `#1DE9B6` | Gradiente complementar de transição suave com o verde. |
| **Interface Forest** | `#2E7D5A` | Cor institucional para textos de destaque, links e bordas ativas. |
| **Safe Mint** | `#43A047` | Estados de sucesso, ícones de confirmação e status ativo. |
| **Attention Amber** | `#FF8F1A` | Avisos importantes, modo trial e dicas de atenção. |
| **System Error** | `#FF5252` | Alertas críticos, desconexões e mensagens de erro. |
| **Midnight Onyx** | `#171901` | Cor de fundo escuro, textos principais e elementos de alto contraste. |
| **Slate Steel** | `#4D4D61` | Textos secundários, legendas e descrições técnicas. |
| **Soft Divider** | `#E0E3E1` | Linhas de divisão, bordas de cards e separadores sutis. |
| **Muted Canvas** | `#F4F5F4` | Fundo principal da aplicação (clean, claro e ergonômico). |
| **Pure White** | `#FFFFFF` | Superfície dos cards, modais e containers de conteúdo. |

### 6.2. Gradientes Oficiais da Marca
- **Gradiente Primário Zapella (IA + WhatsApp):**  
  `linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)`
- **Gradiente Verde de Conversão (Ação & Botões):**  
  `linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)`

### 6.3. Tipografia
- **Família Tipográfica:** `Inter`, `system-ui`, `-apple-system`, `sans-serif`.
- **Pesos Utilizados:** Regular (400) para leitura, Medium (500) para detalhes, Semibold (600) para rótulos e Extrabold (800) para títulos de alto impacto.

### 6.4. Tom de Voz da Marca
- **Objetivo e Ágil:** Respostas diretas, sem burocracia ou termos técnicos desnecessários.
- **Empático e Educado:** Linguagem acolhedora que reflete o atendimento humano de alto padrão.
- **Focado em Resultados:** Sempre direcionado a ajudar o empresário a vender mais e economizar tempo.

---

## 7. Diferenciais Competitivos

| Funcionalidade | Zapella | Chatbots Convencionais | WhatsApp Padrão |
| :--- | :---: | :---: | :---: |
| **Atendimento com IA Generativa Real** | ✅ Sim | ❌ Não (Apenas árvores numéricas) | ❌ Não |
| **Respostas em < 3 Segundos** | ✅ Sim | ⚠️ Lento | ❌ Depende do atendente |
| **Funil CRM Visual Integrado** | ✅ Nativo | ❌ Requer CRM externo caro | ❌ Apenas etiquetas básicas |
| **Agendamento com Calendly/Google** | ✅ Nativo | ❌ Não possui | ❌ Manual |
| **Disparos em Grupos com Antiban** | ✅ Sim (Custo R$ 0 de IA) | ❌ Alto risco de ban | ❌ Manual |
| **Modo Copiloto para Operadores** | ✅ Sim | ❌ Não possui | ❌ Não possui |
| **Operação 100% em Nuvem 24/7** | ✅ Sim | ⚠️ Requer servidor ligado | ❌ Depende do celular |
| **Período de Teste Gratuito** | ✅ 7 Dias Sem Cartão | ❌ Geralmente pago de início | — |

---

## 8. Segurança e Conformidade Jurídica

1. **Conformidade com a LGPD (Lei nº 13.709/2018):**
   - Todos os dados coletados possuem finalidade legítima estrita à prestação do serviço.
   - Os clientes possuem canal direto com o Encarregado de Dados (DPO) através do e-mail oficial `privacidade@zapella.com`.
2. **Isolamento de Dados (Multi-Tenant RLS):**
   - Cada organização possui isolamento lógico por políticas de Row Level Security (RLS) no banco PostgreSQL.
   - Nenhuma empresa tem acesso, visibilidade ou permissão sobre dados de outra.
3. **Privacidade das Mensagens e IA:**
   - As integrações com provedores de LLM operam sob contratos que **não utilizam os dados do cliente para treinamento de modelos públicos**.
4. **Criptografia em Trânsito:**
   - Tráfego 100% criptografado através de protocolos TLS 1.3 com certificados SSL modernos.

---

*Zapella © 2026. Todos os direitos reservados.*
