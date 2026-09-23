'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Database,
  EyeOff,
  UserCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Mail
} from 'lucide-react';

export default function PrivacidadePage() {
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
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Conformidade com a LGPD (Lei 13.709/2018)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171901] leading-tight">
          Política de Privacidade
        </h1>
        <p className="text-sm text-[#4D4D61] mt-3 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-[#2E7D5A]" />
          <span>Última atualização: 23 de Setembro de 2026</span>
        </p>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-4xl mx-auto px-6 lg:px-14 pb-24">
        {/* Destaque de Privacidade */}
        <div className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-base font-extrabold text-[#171901] mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#00E676]" />
            Compromisso Fundamental com a Sua Privacidade
          </h2>
          <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
            Na <strong>Zapella</strong>, a segurança e a confidencialidade dos dados da sua empresa e dos seus clientes são pilares inegociáveis. Esta Política de Privacidade explica de forma transparente como coletamos, tratamos, protegemos e armazenamos as informações no âmbito de nossa plataforma de automação e CRM para WhatsApp, em total conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>.
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
              Dados Coletados e Sua Origem
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>Para fornecer os serviços da Zapella, processamos as seguintes categorias de dados:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Dados Cadastrais do Usuário:</strong> Nome completo, e-mail corporativo, senha criptografada e nome da organização para autenticação e gestão de conta.
                </li>
                <li>
                  <strong>Dados da Base de Conhecimento da Empresa:</strong> Informações de produtos, serviços, horários, preços e perguntas frequentes fornecidas voluntariamente para instruir o robô de atendimento.
                </li>
                <li>
                  <strong>Dados de Atendimento no WhatsApp:</strong> Número de telefone, nome do contato no WhatsApp e mensagens enviadas pelos clientes finais estritamente para formulação de respostas pela secretária virtual e organização no Funil CRM.
                </li>
              </ul>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                02
              </span>
              Finalidade do Tratamento de Dados
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>Os dados tratados pela Zapella têm finalidades específicas e legítimas:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Execução dos serviços contratados (respostas automáticas em tempo real aos clientes no WhatsApp).</li>
                <li>Alimentação do Funil CRM nativo para que a empresa possa gerenciar suas oportunidades comerciais.</li>
                <li>Disparo agendado de comunicados e mensagens para grupos autorizados pelo contratante.</li>
                <li>Faturamento e emissão de cobranças através de parceiros financeiros homologados.</li>
                <li>Suporte técnico e segurança cibernética contra tentativas de invasão e fraudes.</li>
              </ul>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                03
              </span>
              Segurança, Isolamento e Criptografia
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                Adotamos rigorosas salvaguardas técnicas e administrativas para proteger os dados contra acessos não autorizados, destruição ou vazamento:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-[#E0E3E1] bg-[#F4F5F4]">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#171901] mb-1">
                    <Database className="w-4 h-4 text-[#2E7D5A]" />
                    Isolamento por Tenant (RLS)
                  </div>
                  <p className="text-[11px] text-[#4D4D61] leading-normal">
                    Cada cliente opera em um silo isolado no banco de dados com Row Level Security (RLS). Uma empresa nunca tem acesso aos dados de outra.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E0E3E1] bg-[#F4F5F4]">
                  <div className="flex items-center gap-2 font-bold text-xs text-[#171901] mb-1">
                    <Lock className="w-4 h-4 text-[#2E7D5A]" />
                    Criptografia TLS 1.3
                  </div>
                  <p className="text-[11px] text-[#4D4D61] leading-normal">
                    Todas as comunicações entre o seu navegador, o WhatsApp e nossos servidores são protegidas por criptografia de ponta a ponta em trânsito.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                04
              </span>
              Subprocessadores e Compartilhamento com Terceiros
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                A Zapella <strong>não vende, não aluga e não compartilha dados pessoais</strong> com fins comerciais ou publicitários de terceiros. Compartilhamos dados exclusivamente com provedores essenciais para a operação tecnológica:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Provedores de Inteligência Artificial (Google Gemini, Groq, OpenAI):</strong> Utilizados via API corporativa estritamente para gerar respostas instantâneas no momento do atendimento. Nossos acordos com esses provedores garantem que seus dados <em>não são utilizados para treinar modelos públicos de IA</em>.
                </li>
                <li>
                  <strong>Infraestrutura de Nuvem e Banco de Dados (Supabase e Vercel):</strong> Para hospedagem segura, armazenamento criptografado e alta disponibilidade.
                </li>
                <li>
                  <strong>Gateway Financeiro (Asaas):</strong> Para processamento seguro de pagamentos, assinaturas e notas fiscais.
                </li>
              </ul>
            </div>
          </section>

          {/* Seção 5 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                05
              </span>
              Direitos dos Titulares de Dados (LGPD Art. 18)
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>Em conformidade com a LGPD, você possui os seguintes direitos a qualquer momento:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {[
                  'Confirmação da existência de tratamento de dados;',
                  'Acesso completo e facilitado aos seus dados;',
                  'Correção de dados incompletos ou desatualizados;',
                  'Anonimização, bloqueio ou eliminação de dados desnecessários;',
                  'Portabilidade dos dados a outro fornecedor de serviço;',
                  'Revogação do consentimento e exclusão definitiva da conta.'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F4F5F4]">
                    <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seção 6 */}
          <section className="bg-white border border-[#E0E3E1] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#171901] mb-4 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#F4F5F4] text-[#2E7D5A] font-extrabold flex items-center justify-center text-xs shrink-0">
                06
              </span>
              Canal de Contato do DPO / Encarregado de Dados
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-[#4D4D61] leading-relaxed">
              <p>
                Para exercer seus direitos de titular, solicitar a exclusão de seus dados ou tirar dúvidas sobre nossas práticas de privacidade, entre em contato direto com o nosso Encarregado de Proteção de Dados:
              </p>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-xs font-semibold text-[#128C7E]">
                <Mail className="w-5 h-5 text-[#2E7D5A] shrink-0" />
                <div>
                  <p className="text-[#171901] font-bold">Encarregado de Proteção de Dados (DPO)</p>
                  <p className="text-[#4D4D61]">E-mail para solicitações: <span className="text-[#2E7D5A] underline">privacidade@zapella.com</span></p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA Rodapé */}
        <div className="mt-12 text-center bg-white border border-[#E0E3E1] rounded-2xl p-8">
          <h3 className="text-base font-extrabold text-[#171901]">Precisa de mais informações sobre nossos termos?</h3>
          <p className="text-xs text-[#4D4D61] mt-1.5 max-w-md mx-auto">
            Consulte nossos Termos de Uso completos ou utilize nosso assistente interativo de suporte.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/termos"
              className="px-5 py-2.5 rounded-xl border border-[#E0E3E1] text-xs font-bold text-[#171901] hover:bg-[#F4F5F4] transition-all"
            >
              Consultar Termos de Uso
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-[#171901] text-white text-xs font-bold hover:bg-[#2E7D5A] transition-all"
            >
              Voltar para o Início
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
            <Link href="/termos" className="hover:text-[#171901] transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="text-[#2E7D5A] font-bold">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
