import type { Metadata } from 'next';
import './globals.css';
import { JsonLdSchemas } from '@/components/JsonLdSchemas';

export const metadata: Metadata = {
  title: 'Zapella — Secretária Virtual Inteligente e CRM para WhatsApp',
  description: 'Automatize o atendimento da sua empresa com a Zapella. Secretária virtual com IA humanizada via WhatsApp, CRM Kanban nativo, agendamento de consultas e proteção antiban.',
  keywords: [
    'CRM WhatsApp',
    'Secretária Virtual IA',
    'Automação de WhatsApp',
    'Atendimento WhatsApp 24/7',
    'Chatbot Humanizado',
    'Funil Kanban WhatsApp',
    'Agendador de Grupos WhatsApp',
    'Zapella'
  ],
  authors: [{ name: 'Zapella' }],
  metadataBase: new URL('https://www.zapella.app'),
  alternates: {
    canonical: 'https://www.zapella.app',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Zapella — Secretária Virtual Inteligente e CRM para WhatsApp',
    description: 'Automatize o atendimento da sua empresa com a Zapella. IA conversacional humanizada 24/7 via WhatsApp, CRM Kanban e proteção antiban.',
    url: 'https://www.zapella.app',
    siteName: 'Zapella',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zapella — Secretária Virtual Inteligente para WhatsApp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zapella — Secretária Virtual Inteligente e CRM para WhatsApp',
    description: 'Automatize o atendimento da sua empresa com a Zapella. IA conversacional humanizada 24/7 via WhatsApp.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <JsonLdSchemas />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
