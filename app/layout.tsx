import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Sans_Lao } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansLao = Noto_Sans_Lao({
  subsets: ['lao'],
  variable: '--font-lao',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'MIS — Lao PDR Ministry of Health',
  description: 'Management Information System for Lao public hospitals — EDCF Loan LAO-14',
  generator: 'CWIT',
}

export const viewport: Viewport = {
  themeColor: '#0F766E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansLao.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
