import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/json-ld'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: {
    default: 'Diseños Gratis - Recursos Gráficos Premium & Gratis',
    template: '%s | Diseños Gratis',
  },
  description: 'Descubre miles de plantillas de Canva, CapCut, fuentes y recursos de diseño para redes sociales y branding. Descargas gratis y VIP disponibles.',
  keywords: ['plantillas de diseño', 'canva gratis', 'capcut gratis', 'tipografías', 'redes sociales', 'recursos gráficos'],
  authors: [{ name: 'Equipo Diseños Gratis' }],
  creator: 'Diseños Gratis',
  publisher: 'Diseños Gratis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://disenosgratis.com'),
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://disenosgratis.com',
    siteName: 'Diseños Gratis',
    title: 'Diseños Gratis - Recursos Gráficos Premium & Gratis',
    description: 'Descubre miles de plantillas editables, fuentes y recursos de diseño gratis.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Diseños Gratis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diseños Gratis - Recursos Gráficos Premium & Gratis',
    description: 'Descubre miles de plantillas editables, fuentes y recursos de diseño gratis.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
  generator: 'Next.js'
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        {/* Google AdSense - Auto Ads (Descomentar cuando esté listo)
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADS_CLIENT}`}
          crossOrigin="anonymous"
        />
        */}
      </head>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
