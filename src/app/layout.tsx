import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/css-reset.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce',
  description: 'Created by Fabio e Fred',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
