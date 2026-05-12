import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                    <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Sobre Nosotros</h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                    En DiseñosGratis.com nos apasiona ayudar a los creadores a llevar sus ideas al siguiente nivel. Somos una plataforma dedicada a ofrecer recursos de diseño de alta calidad, desde plantillas de sublimación hasta vectores para corte láser.
                </p>
            </div>

            <div className="mt-16 grid gap-12 sm:grid-cols-2">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Nuestra Misión</h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        Nuestra misión es democratizar el acceso a diseños profesionales. Creemos que cada emprendedor, sin importar su presupuesto, merece tener herramientas de calidad para hacer crecer su negocio o hobby.
                    </p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">¿Qué Ofrecemos?</h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        Ofrecemos miles de recursos gratuitos de alta calidad para emprendedores y creadores de contenido. Nuestro catálogo se actualiza semanalmente con las últimas tendencias.
                    </p>
                </div>
            </div>

            <div className="mt-20 border-t border-border/40 pt-12 text-center">
                <Link
                    href="/"
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    ← Volver al inicio
                </Link>
            </div>
        </div>
    )
}
