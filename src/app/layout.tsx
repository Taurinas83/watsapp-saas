import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zapella — Secretária Virtual Inteligente para WhatsApp',
  description: 'Automatize o atendimento da sua empresa com a Zapella. IA conversacional humanizada via WhatsApp, com supervisão em tempo real e base de conhecimento personalizada.',
  metadataBase: new URL('https://watsapp-saas.vercel.app'),
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Zapella — Secretária Virtual Inteligente para WhatsApp',
    description: 'Automatize o atendimento da sua empresa com a Zapella. IA conversacional humanizada 24/7 via WhatsApp.',
    url: 'https://watsapp-saas.vercel.app',
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
    title: 'Zapella — Secretária Virtual Inteligente para WhatsApp',
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
