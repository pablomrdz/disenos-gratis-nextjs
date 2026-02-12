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
    default: 'DesignHub - Premium Digital Assets Marketplace',
    template: '%s | DesignHub',
  },
  description: 'Discover thousands of premium design templates, fonts, and resources for social media, presentations, and branding. Free and VIP downloads available.',
  keywords: ['design templates', 'canva templates', 'capcut templates', 'fonts', 'social media templates', 'branding', 'digital assets'],
  authors: [{ name: 'DesignHub Team' }],
  creator: 'DesignHub',
  publisher: 'DesignHub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://designhub.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://designhub.com',
    siteName: 'DesignHub',
    title: 'DesignHub - Premium Digital Assets Marketplace',
    description: 'Discover thousands of premium design templates, fonts, and resources.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DesignHub - Premium Digital Assets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DesignHub - Premium Digital Assets Marketplace',
    description: 'Discover thousands of premium design templates, fonts, and resources.',
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
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  generator: 'v0.app'
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
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
