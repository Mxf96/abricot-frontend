import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.scss';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Abricot',
  description: 'Application SaaS de gestion de projets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}