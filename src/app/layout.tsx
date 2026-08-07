import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ayavis.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'AYAVIS Consulting Services',
  description: 'AYAVIS helps organizations turn complex ambitions into resilient, intelligent, and operable technology solutions.',
  keywords: ['consulting', 'technology strategy', 'enterprise architecture', 'cloud', 'digital transformation'],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'AYAVIS Consulting Services',
    description: 'Strategize. Design. Build. Operate.',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AYAVIS Consulting Services',
    description: 'Strategize. Design. Build. Operate.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
