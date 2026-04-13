import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lembrymed — Lembretes inteligentes de medicação via WhatsApp',
  description: 'Nunca mais esqueça seus medicamentos. Lembretes automáticos via WhatsApp, 100% automatizado. Se esquecer, seu familiar é avisado.',
  openGraph: {
    title: 'Lembrymed — Cuidar é uma decisão',
    description: 'Lembretes inteligentes de medicação via WhatsApp. Assine por R$ 149/ano.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
