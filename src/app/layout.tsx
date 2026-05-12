import type { Metadata } from 'next';

import './globals.css';

import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Sistema de Exposiciones',
  description: 'Sistema de evaluación de exposiciones',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}