import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'samba access',
    template: '%s | samba access',
  },
  description: 'Portal de acesso unificado para gestão de usuários e permissões da rede escolar.',
  keywords: ['acesso', 'usuários', 'permissões', 'gestão escolar'],
  authors: [{ name: 'samba' }],
  creator: 'samba',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'samba access',
    title: 'samba access',
    description: 'Portal de acesso unificado para gestão de usuários e permissões da rede escolar.',
  },
  twitter: {
    card: 'summary',
    title: 'samba access',
    description: 'Portal de acesso unificado para gestão de usuários e permissões da rede escolar.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased overflow-x-hidden min-h-screen bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
