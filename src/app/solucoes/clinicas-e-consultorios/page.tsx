import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Star,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  HeartPulse,
  Stethoscope,
  CalendarCheck,
  BellRing,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { JsonLdSchemas } from '@/components/JsonLdSchemas';

export const metadata: Metadata = {
  title: 'CRM WhatsApp para Clínicas Médicas e Consultórios | Zapella',
  description: 'Secretária virtual com IA que agenda consultas 24/7 no WhatsApp da sua clínica. Reduza faltas em até 65%, integre com Google Calendar e automatize o pós-consulta.',
  keywords: [
    'CRM WhatsApp para Clínicas Médicas',
    'Secretária Virtual para Consultório',
    'Agendamento de Consultas WhatsApp',
    'Automação de WhatsApp para Dentistas',
    'Confirmação de Consulta Automática WhatsApp',
    'Zapella Clínicas'
  ],
  alternates: {
    canonical: 'https://www.zapella.app/solucoes/clinicas-e-consultorios',
  },
  openGraph: {
    title: 'CRM WhatsApp para Clínicas Médicas e Consultórios | Zapella',
    description: 'Secretária virtual com IA que agenda consultas 24/7 pelo WhatsApp, confirma presença e organiza seu funil de pacientes.',
    url: 'https://www.zapella.app/solucoes/clinicas-e-consultorios',
    siteName: 'Zapella',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function ClinicasConsultoriosPage() {
  const clinicFaqs = [
    {
      q: 'A Zapella consegue verificar meus horários vagos e agendar a consulta?',
      a: 'Sim! A Zapella integra-se perfeitamente com seu Google Calendar, Calendly ou Cal.com. A inteligência artificial entende a necessidade do paciente, oferece os horários disponíveis e envia o link ou confirma o agendamento automaticamente.'
    },
    {
      q: 'A IA sabe informar sobre os convênios e valores de procedimentos da minha clínica?',
      a: 'Com certeza! Você cadastra as regras da clínica na Base de Conhecimento RAG (convênios aceitos, valores de consultas particulares, preparos para exames). A IA consulta essas informações e responde com máxima precisão e humanização.'
    },
    {
      q: 'Como a Zapella ajuda a reduzir o índice de faltas e no-shows?',
      a: 'A ferramenta permite disparar mensagens automáticas de confirmação de consulta 24h e 2h antes do horário. Se o paciente precisar remarcar, a própria IA libera o horário e agenda uma nova data imediatamente.'
    },
    {
      q: 'Os dados dos pacientes estão protegidos de acordo com a LGPD?',
      a: 'Sim. A Zapella adota isolamento de dados nível bancário (Row Level Security em PostgreSQL) com criptografia ponta a ponta e mascaramento automático de dados sensíveis e prontuários (DLP/PII Masking).'
    },
    {
      q: 'Minha recepcionista humana ainda poderá responder as mensagens?',
      a: 'Sim! A Zapella conta com o recurso de Handover e Caixa de Entrada Unificada. Sua equipe pode intervir a qualquer segundo, assumir a conversa ou usar o Modo Copiloto, onde a IA sugere respostas e a secretária apenas aprova.'
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
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-md bg-[#00E676]/10 text-[#2E7D5A] border border-[#00E676]/20">
            Para Clínicas & Saúde
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4D4D61] hover:text-[#171901] hover:bg-[#F4F5F4] transition-all">
            Entrar
          </Link>
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl text-[#171901] font-extrabold text-xs shadow-md transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
          >
            Testar Grátis 7 Dias
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-24 px-6 lg:px-14 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold mb-8"
             style={{ background: 'rgba(0,230,118,0.08)', borderColor: 'rgba(0,230,118,0.30)', color: '#2E7D5A' }}>
          <Stethoscope className="w-4 h-4 text-[#2E7D5A]" />
          <span>Especialistas em Clínicas Médicas, Odontológicas e Estética</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#171901] tracking-tight max-w-5xl mx-auto leading-[1.12]">
          Nunca mais perca um paciente por{' '}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)' }}>
            demora no WhatsApp
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#4D4D61] max-w-3xl mx-auto font-medium leading-relaxed">
          Sua secretária virtual com inteligência artificial atende 24h por dia, agenda consultas diretamente no Google Calendar, confirma comparecimentos e organiza o prontuário dos contatos em um CRM Kanban nativo.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-[#171901] font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
          >
            <span>Quero Automatizar Minha Clínica</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#como-funciona"
            className="w-full sm:w-auto px-6 py-4 rounded-xl text-[#171901] font-bold text-sm border border-[#E0E3E1] hover:bg-[#F4F5F4] transition-all"
          >
            Ver Demonstração Prática
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#70727B] font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            <span>Resposta em 2,4 segundos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            <span>Integração Google Calendar</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            <span>Blindagem LGPD para Pacientes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            <span>7 dias de teste grátis</span>
          </div>
        </div>
      </section>

      {/* ── Problema vs Solução (Dores do Setor) ── */}
      <section className="py-20 bg-[#F8FAF9] border-y border-[#E0E3E1]/60 px-6 lg:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-[#171901] tracking-tight">
              O que acontece quando o paciente chama sua clínica às 21h ou no fim de semana?
            </h2>
            <p className="mt-3 text-sm text-[#4D4D61] font-medium">
              Mais de 62% das buscas por agendamento médico e odontológico ocorrem fora do horário comercial. Sem IA, ele busca o próximo consultório no Google.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl mb-6">
                ✕
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Recepção Sobrecarregada</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Sua secretária atende o telefone, recebe pacientes na porta e responde mensagens no WhatsApp ao mesmo tempo. Mensagens acumulam por horas.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl mb-6">
                !
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Faltas e Horários Perdidos</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Pacientes esquecem o horário marcado. Sem confirmações inteligentes e automáticas com 24h de antecedência, a taxa de no-show passa de 30%.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border-2 border-[#00E676] shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#00E676] text-[#171901] text-[10px] font-black px-3 py-1 rounded-bl-lg">
                SOLUÇÃO ZAPELLA
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center font-black text-xl mb-6">
                ✓
              </div>
              <h3 className="font-extrabold text-base text-[#171901] mb-2">Secretária IA 24 Horas</h3>
              <p className="text-xs text-[#4D4D61] leading-relaxed">
                Atendimento cordial e instantâneo a qualquer hora do dia ou da noite. O paciente escolhe o horário vago na hora e a consulta é confirmada no sistema.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recursos Específicos para Saúde ── */}
      <section id="como-funciona" className="py-24 px-6 lg:px-14 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5A]">Recursos Feitos para Consultórios</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171901] tracking-tight mt-2">
            Tudo o que sua clínica precisa em uma única tela
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-[#E0E3E1] bg-white hover:border-[#00E676] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center mb-4">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#171901] mb-2">Agendamento Integrado (Google Calendar & Cal.com)</h3>
            <p className="text-sm text-[#4D4D61] leading-relaxed">
              A secretária virtual envia links inteligentes com seus horários livres. Assim que o paciente agenda, o evento aparece na agenda do médico com o número e nome do paciente.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#E0E3E1] bg-white hover:border-[#00E676] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#7C4DFF]/10 text-[#7C4DFF] flex items-center justify-center mb-4">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#171901] mb-2">Lembretes & Confirmação Automática de Presença</h3>
            <p className="text-sm text-[#4D4D61] leading-relaxed">
              Dispare lembretes no dia anterior pelo WhatsApp. Se o paciente confirmar, o CRM atualiza para "Confirmado". Se cancelar, a IA já oferece novas datas para preencher o horário.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#E0E3E1] bg-white hover:border-[#00E676] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#00B0FF]/10 text-[#0091EA] flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#171901] mb-2">Funil Kanban de Pacientes (CRM Nativo)</h3>
            <p className="text-sm text-[#4D4D61] leading-relaxed">
              Acompanhe visualmente cada etapa: Novo Contato ➔ Avaliação Agendada ➔ Consulta Realizada ➔ Retorno Pendente ➔ Tratamento em Andamento.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-[#E0E3E1] bg-white hover:border-[#00E676] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#00E676]/10 text-[#2E7D5A] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#171901] mb-2">Base de Conhecimento com Convênios & Exames</h3>
            <p className="text-sm text-[#4D4D61] leading-relaxed">
              A IA tira dúvidas sobre Unimed, Bradesco Saúde, SulAmérica ou consultas particulares, além de orientar preparos de exames (jejum, documentos) com exatidão cirúrgica.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ de Clínicas (AEO) ── */}
      <section className="py-20 bg-[#F8FAF9] border-t border-[#E0E3E1] px-6 lg:px-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D5A]">Tire Suas Dúvidas</span>
            <h2 className="text-3xl font-extrabold text-[#171901] tracking-tight mt-2">
              Perguntas Frequentes de Médicos e Gestores de Clínicas
            </h2>
          </div>

          <div className="space-y-4">
            {clinicFaqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E0E3E1] shadow-sm">
                <h3 className="font-extrabold text-base text-[#171901] mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#00E676] shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#4D4D61] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final de Conversão ── */}
      <section className="py-24 px-6 lg:px-14 max-w-5xl mx-auto text-center">
        <div className="p-12 sm:p-16 rounded-3xl text-white relative overflow-hidden shadow-2xl"
             style={{ background: 'linear-gradient(135deg, #171901 0%, #1A2E22 100%)' }}>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Sua clínica pronta para atender 24 horas por dia
            </h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 font-medium">
              Comece agora mesmo com 7 dias de garantia incondicional. Sem contratos de fidelidade. Conecte o WhatsApp da sua clínica em menos de 3 minutos.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[#171901] font-extrabold text-sm shadow-xl transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00E676 0%, #1DE9B6 100%)' }}
            >
              <span>Ativar Minha Secretária IA Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="mt-4 text-xs text-gray-400">
              A partir de R$ 97/mês • Cancele quando quiser com 1 clique
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-[#E0E3E1] px-6 lg:px-14 text-center text-xs text-[#70727B] bg-white">
        <p>© 2026 Zapella. Todos os direitos reservados. Feito com segurança e privacidade para o setor de saúde.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/termos" className="hover:text-[#171901] transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-[#171901] transition-colors">Privacidade & LGPD</Link>
          <Link href="/" className="hover:text-[#171901] transition-colors">Página Inicial</Link>
        </div>
      </footer>
    </div>
  );
}
