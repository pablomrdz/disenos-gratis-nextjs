import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
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
    default: 'Diseños y plantillas gratis para DTF, sublimación y más | Diseñosgratis.com',
    template: '%s | Diseñosgratis.com',
  },
  description: 'Descarga diseños, fondos, texturas, plantillas y archivos. Recursos para sublimación, DTF, vinil textil y proyectos creativos.',
  keywords: ['diseños gratis', 'plantillas sublimación', 'DTF', 'vinil textil', 'fondos y texturas', 'recursos gráficos', 'corte láser'],
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
    title: 'Diseños y plantillas gratis para DTF, sublimación y más | Diseñosgratis.com',
    description: 'Descarga diseños, fondos, texturas, plantillas y archivos. Recursos para sublimación, DTF, vinil textil y proyectos creativos.',
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
    title: 'Diseños y plantillas gratis para DTF, sublimación y más | Diseñosgratis.com',
    description: 'Descarga diseños, fondos, texturas, plantillas y archivos. Recursos para sublimación, DTF, vinil textil y proyectos creativos.',
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
        {/* Google AdSense - Auto Ads */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1784471620247875" 
          strategy="afterInteractive" 
          crossOrigin="anonymous" 
        />
        {/* Microsoft Clarity Tracking Code */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wqjwv2mcae");
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
        <GoogleAnalytics gaId="G-QPKCT2ZXX0" />
      </body>
    </html>
  )
}
