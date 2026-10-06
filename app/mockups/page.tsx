import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getActiveMockupTemplates } from '@/lib/mockup-data'

export const revalidate = 604800

export const metadata: Metadata = {
  title: 'Generador de mockups de playeras gratis',
  description: 'Crea mockups de playeras gratis en línea. Sube tu diseño, ajústalo sobre una playera con modelo y descarga el resultado en PNG.',
  alternates: { canonical: '/mockups/' },
}

export default async function MockupsPage() {
  const mockups = await getActiveMockupTemplates()

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold text-primary">Herramientas para personalización</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Generador de mockups de playeras gratis</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Muestra diseños DTF, logos e ilustraciones sobre playeras con modelo. Tu archivo se procesa directamente en tu navegador.
        </p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        {mockups.map((mockup) => (
          <article key={mockup.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="relative aspect-square bg-muted">
              <Image
                src={mockup.background_url}
                alt={mockup.background_alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-6">
              <p className="text-sm font-medium text-primary">{mockup.format_label}</p>
              <h2 className="mt-2 text-xl font-bold">{mockup.title}</h2>
              <p className="mt-3 text-muted-foreground">{mockup.intro}</p>
              <Link
                href={`/mockups/${mockup.slug}/`}
                className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Crear mockup
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
