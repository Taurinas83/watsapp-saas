import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atendente Virtual WhatsApp SaaS',
  description: 'Plataforma SaaS de atendente virtual inteligente via WhatsApp para pequenos negócios',
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
