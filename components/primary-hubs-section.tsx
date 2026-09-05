import Link from 'next/link'
import {
  ArrowRight,
  Shirt,
  Sparkles,
  Type,
  ImageIcon,
} from 'lucide-react'

const hubs = [
  {
    title: 'Diseños DTF gratis',
    description:
      'Imágenes, plantillas y diseños PNG en alta resolución listos para imprimir en playeras y proyectos DTF.',
    href: '/dtf/',
    cta: 'Explorar diseños DTF',
    icon: Shirt,
  },
  {
    title: 'Diseños para sublimación',
    description:
      'Plantillas y recursos para sublimar tazas, playeras, termos y otros productos personalizados.',
    href: '/sublimacion/',
    cta: 'Explorar sublimación',
    icon: Sparkles,
  },
  {
    title: 'Tipografías gratis',
    description:
      'Fuentes descargables para diseño gráfico, playeras, sublimación, corte y proyectos creativos.',
    href: '/tipografias/',
    cta: 'Explorar tipografías',
    icon: Type,
  },
  {
    title: 'Recursos gráficos gratis',
    description:
      'Imágenes PNG, logos, fondos y otros recursos visuales listos para descargar y usar en tus diseños.',
    href: '/recursos-graficos/',
    cta: 'Explorar recursos',
    icon: ImageIcon,
  },
]

export function PrimaryHubsSection() {
  return (
    <section className="border-t border-border/40 bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Explora nuestros recursos principales
          </h2>

          <p className="mt-3 text-muted-foreground">
            Encuentra diseños, plantillas, tipografías y recursos gratuitos
            organizados por el tipo de proyecto que quieres crear.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hubs.map((hub) => {
            const Icon = hub.icon

            return (
              <article
                key={hub.href}
                className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  <Link
                    href={hub.href}
                    className="hover:text-primary"
                  >
                    {hub.title}
                  </Link>
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {hub.description}
                </p>

                <Link
                  href={hub.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {hub.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}