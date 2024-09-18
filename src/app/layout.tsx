import Navbar from '@/components/Navbar'
import CssBaseline from '@mui/material/CssBaseline'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-commerce',
  description: 'Created by Fabio e Fred',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <CssBaseline>
          <Navbar />
          {children}
        </CssBaseline>
      </body>
    </html>
  )
}
