'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F4] text-[#171901] selection:bg-[#00E676] selection:text-[#171901]">
      {/* ── Top Navigation ── */}
      <nav className="sticky top-0 z-50 bg-[#F4F5F4]/90 backdrop-blur-md border-b border-[#E0E3E1] px-6 lg:px-14 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl overflow-hidden shadow-md shrink-0"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #7C4DFF 100%)' }}
          >
            <Image src="/zapella-icon.png" alt="Zapella" width={36} height={36} className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-[#171901] text-lg tracking-tight">Zapella</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#4D4D61] hover:text-[#171901] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Início</span>
          </Link>

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[#171901] font-extrabold text-xs shadow-md transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
          >
            <span>Testar Grátis — 7 dias</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Header Section ── */}
      <header className="pt-14 pb-10 px-6 lg:px-14 max-w-4xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold mb-4"
          style={{ background: 'rgba(0,230,118,0.08)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Contrato de Licenciamento & Termos de Uso</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171901] leading-tight">
          Termos de Uso da Plataforma
        </h1>
        <p className="text-sm text-[#4D4D61] mt-3 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-[#2E7D5A]" />
          <span>Última atualização: 23 de Setembro de 2026</span>
        </p>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-4xl mx-auto px-6 lg:px-14 pb-24">
        {/* Resumo Rápido */}
        <div className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-base font-extrabold text-[#171901] mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00E676]" />
            Visão Geral em Linguagem Simples
          </h2>
          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            Bem-vindo à <strong>Zapella</strong>. Ao criar uma conta ou utilizar qualquer um de nossos serviços de automação de WhatsApp, CRM e inteligência artificial, você concorda expressamente com os termos descritos abaixo. Nosso compromisso é entregar tecnologia de ponta, segurança absoluta dos seus dados e transparência contratual sem pegadinhas ou fidelidades abusivas.
          </p>
        </div>

        {/* Cláusulas */}
        <div className="space-y-8 text-[#171901]">
          {/* Seção 1 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                01
              </span>
              Objeto e Natureza da Plataforma
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                A <strong>Zapella</strong> é uma plataforma de software como serviço (SaaS) projetada para otimizar e automatizar o atendimento ao cliente via WhatsApp comercial, oferecendo:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Secretária virtual com inteligência artificial para respostas instantâneas 24 horas por dia.</li>
                <li>Base de Conhecimento RAG (Retrieval-Augmented Generation) orientada por perguntas e respostas cadastradas pelo usuário.</li>
                <li>Funil CRM nativo estilo Kanban integrado aos diálogos do WhatsApp.</li>
                <li>Agendamento inteligente de reuniões e consultas via integração de links externos (Calendly, Cal.com e Google Calendar).</li>
                <li>Disparo e agendamento de mensagens para grupos de WhatsApp com blindagem antiban e intervalo humanizado.</li>
              </ul>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                02
              </span>
              Cadastro e Período de Teste Gratuito (7 Dias)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                Ao se registrar, o usuário tem direito a usufruir de <strong>7 (sete) dias de teste gratuito</strong> com acesso a todas as funcionalidades do plano selecionado, sem necessidade de inserção prévia de dados de cartão de crédito.
              </p>
              <p>
                O usuário é o único responsável pela veracidade dos dados cadastrados e pela guarda e confidencialidade de sua senha de acesso. Cada conta é intransferível e destinada ao uso da empresa contratante.
              </p>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                03
              </span>
              Conexão com WhatsApp e Políticas da Meta
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                A conexão do número de WhatsApp do contratante à plataforma Zapella é realizada via tecnologia de escaneamento de QR Code (semelhante ao WhatsApp Web).
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Boas Práticas e Diretrizes Contra SPAM
                </div>
                <p className="text-xs leading-relaxed">
                  É terminantemente proibido utilizar a Zapella para envio de mensagens privadas em massa para contatos não autorizados (SPAM), venda de produtos ilegais ou conteúdos fraudulentos. O contratante declara ciência de que o WhatsApp e a Meta Platforms Inc. possuem termos de uso próprios e que o uso indevido de números novos sem histórico pode gerar penalidades da própria operadora do aplicativo.
                </p>
              </div>
              <p>
                A Zapella implementa intervalos de segurança entre mensagens (jitter antiban) e recomenda que disparos em lote sejam realizados prioritariamente em grupos onde o usuário é administrador e os membros optaram por participar.
              </p>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                04
              </span>
              Propriedade Intelectual e Dados do Cliente
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                <strong>Seus dados pertencem a você:</strong> Todo o conteúdo cadastrado na Base de Conhecimento, produtos, valores, informações da sua empresa e contatos do seu CRM são de sua exclusiva propriedade intelectual.
              </p>
              <p>
                A Zapella não comercializa, não aluga e não utiliza seus dados de atendimento para alimentar modelos públicos de terceiros. A inteligência artificial opera como um processador técnico estrito para formular respostas aos seus clientes.
              </p>
            </div>
          </section>

          {/* Seção 5 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                05
              </span>
              Planos, Assinaturas e Cancelamento Sem Fidelidade
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                Os serviços da Zapella são disponibilizados por meio de planos mensais recorrentes (Starter, Pro Negócios e Enterprise):
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Sem Fidelidade:</strong> Não exigimos período mínimo de permanência nem cobramos qualquer tipo de multa rescisória.</li>
                <li><strong>Cancelamento Simples:</strong> O contratante pode solicitar o cancelamento a qualquer momento através do painel de controle ou dos canais de suporte.</li>
                <li><strong>Processamento Seguro:</strong> As transações e faturas são processadas com certificado de segurança e criptografia bancária via gateway Asaas.</li>
              </ul>
            </div>
          </section>

          {/* Seção 6 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                06
              </span>
              Disponibilidade (SLA) e Limitação de Responsabilidade
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                A infraestrutura da Zapella opera em servidores de alta disponibilidade em nuvem (Vercel, Supabase e nós redundantes). No entanto, o contratante compreende que a estabilidade do serviço depende da conectividade com a internet no aparelho do usuário e de serviços de terceiros (como a rede mundial de servidores do WhatsApp e provedores de LLM).
              </p>
              <p>
                A Zapella não se responsabiliza por eventuais instabilidades temporárias decorrentes de atualizações estruturais do aplicativo WhatsApp ou por falhas na internet do próprio usuário.
              </p>
            </div>
          </section>

          {/* Seção 7 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                07
              </span>
              Legislação Aplicável e Foro
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                Estes Termos de Uso são regidos e interpretados em conformidade com as leis da República Federativa do Brasil, especialmente o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
              <p>
                Fica eleito o Foro da Comarca da Capital do Estado do Rio de Janeiro para dirimir quaisquer dúvidas ou litígios decorrentes deste instrumento.
              </p>
            </div>
          </section>
        </div>

        {/* CTA Rodapé */}
        <div className="mt-12 text-center bg-white border border-[#E0E3E1] rounded-2xl p-8">
          <h3 className="text-base font-extrabold text-[#171901]">Ainda tem alguma dúvida sobre os nossos termos?</h3>
          <p className="text-xs text-[#4D4D61] mt-1.5 max-w-md mx-auto">
            Consulte nosso chat interativo de dúvidas frequentes ou entre em contato pelo e-mail oficial de atendimento.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#faq"
              className="px-5 py-2.5 rounded-xl border border-[#E0E3E1] text-xs font-bold text-[#171901] hover:bg-[#F4F5F4] transition-all"
            >
              Consultar Perguntas Frequentes
            </Link>
            <Link
              href="/privacidade"
              className="px-5 py-2.5 rounded-xl bg-[#171901] text-white text-xs font-bold hover:bg-[#2E7D5A] transition-all"
            >
              Ver Política de Privacidade
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#E0E3E1] py-8 px-6 lg:px-14 bg-white text-xs text-[#4D4D61]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Zapella. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#171901] transition-colors">Início</Link>
            <Link href="/termos" className="text-[#2E7D5A] font-bold">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-[#171901] transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
