import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zapella — Secretária Virtual Inteligente para WhatsApp',
  description: 'Automatize o atendimento da sua empresa com a Zapella. IA conversacional humanizada via WhatsApp, com supervisão em tempo real e base de conhecimento personalizada.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
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
