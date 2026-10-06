import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AdUnit from '@/components/AdUnit'
import { Breadcrumbs } from '@/components/breadcrumbs'
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
    <main>
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Mockups' }]} />
          <header className="mt-5 max-w-3xl">
            <p className="text-sm font-semibold text-primary">Herramientas para personalización</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Generador de mockups de playeras gratis</h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Crea una vista previa profesional de tus diseños DTF, logos e ilustraciones sobre playeras con modelo. Todo se procesa directamente en tu navegador.
            </p>
          </header>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-center text-xs text-muted-foreground">Anuncio</p>
          <AdUnit slot="9549519747" format="auto" style={{ display: 'block', minHeight: '120px' }} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <section aria-labelledby="mockup-tools-heading">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 id="mockup-tools-heading" className="text-2xl font-bold tracking-tight">Elige el formato de tu mockup</h2>
                  <p className="mt-2 text-muted-foreground">Selecciona un formato, sube tu diseño y descárgalo listo para compartir.</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {mockups.map((mockup) => (
                  <article key={mockup.id} className="overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative h-48 bg-muted sm:h-56">
                      <Image
                        src={mockup.background_url}
                        alt={mockup.background_alt}
                        fill
                        sizes="(min-width: 1280px) 380px, (min-width: 640px) 45vw, 100vw"
                        className="object-cover object-top"
                        unoptimized
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-sm font-medium text-primary">{mockup.format_label}</p>
                      <h3 className="mt-1 text-lg font-bold leading-snug">{mockup.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{mockup.intro}</p>
                      <Link
                        href={`/mockups/${mockup.slug}/`}
                        className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Crear mockup
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-12 max-w-3xl space-y-5" aria-labelledby="mockups-guide-heading">
              <h2 id="mockups-guide-heading" className="text-2xl font-bold tracking-tight">Mockups de playeras para presentar tus diseños</h2>
              <p className="leading-7 text-muted-foreground">
                Un mockup de playera te permite mostrar cómo lucirá un diseño antes de imprimirlo. Es útil para enviar propuestas a clientes, publicar catálogos, preparar contenido para Instagram o validar la escala de un logo y de un diseño DTF.
              </p>
              <p className="leading-7 text-muted-foreground">
                Empieza por el formato que corresponda a tu publicación: vertical para historias y reels, o cuadrado para publicaciones del feed. Puedes arrastrar, escalar y girar el archivo dentro del área de impresión. El resultado se descarga como PNG y tu archivo no se sube a nuestros servidores.
              </p>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-lg font-bold">Antes de crear tu mockup</h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>Usa PNG con fondo transparente para un acabado más natural.</li>
                <li>Verifica que tu diseño tenga buena resolución antes de imprimir.</li>
                <li>La guía azul te ayuda a posicionar el arte y no aparece en la descarga.</li>
              </ul>
            </div>
            <div className="rounded-xl border bg-muted/40 p-5">
              <h2 className="text-lg font-bold">¿También necesitas diseños?</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Encuentra archivos listos para personalizar e imprimir en playeras.</p>
              <Link href="/dtf/" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">Explorar diseños DTF →</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
