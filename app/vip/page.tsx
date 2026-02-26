import type { Metadata } from 'next'
import Link from 'next/link'
import { Crown, Check, Sparkles, Download, Zap, Shield, HeadphonesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DesignGrid } from '@/components/design-grid'
import { getDesigns } from '@/lib/data'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Acceso VIP - Desbloquea Recursos de Diseño Premium',
  description: 'Obtén acceso ilimitado a todas nuestras plantillas premium, tipografías y recursos de diseño con la membresía VIP de Diseños Gratis.',
}

const features = [
  {
    icon: Download,
    title: 'Descargas Ilimitadas',
    description: 'Descarga tantas plantillas premium como necesites, sin restricciones.',
  },
  {
    icon: Zap,
    title: 'Acceso Anticipado',
    description: 'Sé el primero en obtener nuestras nuevas plantillas antes que nadie.',
  },
  {
    icon: Shield,
    title: 'Licencia Comercial',
    description: 'Usa todos los recursos para proyectos personales y comerciales.',
  },
  {
    icon: Sparkles,
    title: 'Nuevos Lanzamientos',
    description: 'Acceso inmediato a nuestros últimos recursos de diseño cada semana.',
  },
]

const plans = [
  {
    name: 'Mensual',
    price: '$9.99',
    period: '/mes',
    description: 'Ideal para probar la experiencia VIP',
    features: [
      'Todas las plantillas premium',
      'Descargas ilimitadas',
      'Licencia comercial',
      'Nuevos lanzamientos',
    ],
    popular: false,
  },
  {
    name: 'Anual',
    price: '$79.99',
    period: '/año',
    description: 'La mejor oferta - Ahorra un 33%',
    features: [
      'Todas las plantillas premium',
      'Descargas ilimitadas',
      'Licencia comercial',
      'Acceso anticipado',
      'Contenido exclusivo',
      'Ahorro garantizado',
    ],
    popular: true,
  },
  {
    name: 'Vitalicio',
    price: '$199',
    period: 'pago único',
    description: 'Paga una vez, accede para siempre',
    features: [
      'Todo lo incluido en Anual',
      'Sin pagos recurrentes',
      'Actualizaciones futuras',
      'Recursos premium de por vida',
      'Insignia VIP permanente',
      'Contenido ultra-exclusivo',
    ],
    popular: false,
  },
]

export default async function VIPPage() {
  const vipDesigns = await getDesigns({ isVip: true, limit: 8 })

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <Badge className="gap-2 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-white">
            <Crown className="h-4 w-4" />
            Membresía VIP
          </Badge>

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Desbloquea Recursos de Diseño{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Premium
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Acceso ilimitado a nuestra biblioteca completa de plantillas, tipografías y recursos premium.
            Crea diseños asombrosos sin límites.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                    <feature.icon className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-y border-border/40 bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Elige tu Plan
            </h2>
            <p className="mt-2 text-muted-foreground">
              Todos los planes incluyen acceso total al contenido premium
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border-border/50 ${plan.popular ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Sparkles className="h-3 w-3" />
                      Más Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4 pt-6">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Empezar Ahora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Content Preview */}
      {vipDesigns.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Vista Previa VIP
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Un pequeño vistazo a lo que desbloquearás con tu acceso VIP
                </p>
              </div>
              <Link
                href="/designs?vip=true"
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
              >
                Ver todo el contenido VIP
              </Link>
            </div>

            <div className="mt-8">
              <DesignGrid designs={vipDesigns} showAds={false} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-background py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Crown className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ¿Listo para ser VIP?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Únete a miles de creadores de contenido que ya usan Diseños Gratis para sus proyectos diarios.
          </p>
          <Button size="lg" className="mt-8 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
            <Sparkles className="h-5 w-5" />
            Comenzar mi VIP Hoy
          </Button>
        </div>
      </section>
    </>
  )
}
