import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdUnit from '@/components/AdUnit'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { MockupEditor } from '@/components/mockup/MockupEditor'
import { getMockupTemplateBySlug } from '@/lib/mockup-data'

export const revalidate = 604800

interface MockupPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: MockupPageProps): Promise<Metadata> {
  const { slug } = await params
  const mockup = await getMockupTemplateBySlug(slug)

  if (!mockup) {
    return { title: 'Mockup no encontrado', robots: { index: false, follow: false } }
  }

  return {
    title: mockup.meta_title,
    description: mockup.meta_description,
    alternates: { canonical: `/mockups/${mockup.slug}/` },
    openGraph: {
      type: 'website',
      title: mockup.meta_title,
      description: mockup.meta_description,
      images: [{ url: mockup.background_url, alt: mockup.background_alt }],
    },
  }
}

export default async function MockupPage({ params }: MockupPageProps) {
  const { slug } = await params
  const mockup = await getMockupTemplateBySlug(slug)

  if (!mockup) notFound()

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        name: mockup.h1,
        description: mockup.meta_description,
        totalTime: 'PT2M',
        step: mockup.seo_content.steps.map((text, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          text,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://disenosgratis.com/' },
          { '@type': 'ListItem', position: 2, name: 'Mockups', item: 'https://disenosgratis.com/mockups/' },
          { '@type': 'ListItem', position: 3, name: mockup.title },
        ],
      },
    ],
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <Breadcrumbs items={[
        { label: 'Inicio', href: '/' },
        { label: 'Mockups', href: '/mockups/' },
        { label: mockup.title },
      ]} />
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-primary">Generador de mockups</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{mockup.h1}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{mockup.intro}</p>
      </header>

      <div className="mb-8">
        <p className="mb-2 text-center text-xs text-muted-foreground">Anuncio</p>
        <AdUnit slot="9549519747" format="auto" style={{ display: 'block', minHeight: '120px' }} />
      </div>

      <MockupEditor preset={mockup} />

      <section className="mx-auto mt-12 max-w-4xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Crea tu {mockup.primary_keyword} en línea</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{mockup.seo_content.summary}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Cómo usar este generador de mockups</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-muted-foreground">
            {mockup.seo_content.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>

        <div className="rounded-xl border bg-muted/30 p-6">
          <h2 className="text-2xl font-bold">¿Para qué puedes usar este mockup?</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Úsalo para presentar diseños DTF, logos, ilustraciones y prendas personalizadas antes de imprimirlas.
            También puedes combinarlo con los recursos de <Link className="font-medium text-primary hover:underline" href="/dtf/">diseños DTF gratis</Link> de DiseñosGratis.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
          <div className="mt-4 divide-y rounded-xl border">
            {mockup.seo_content.faqs.map((faq) => (
              <details key={faq.question} className="p-5">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
