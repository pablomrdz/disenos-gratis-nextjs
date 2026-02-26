import Link from 'next/link'
import type { Metadata } from 'next'
import { Mail, MessageSquare, ShieldAlert } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Contacto y Soporte | Diseños Gratis',
    description: 'Ponte en contacto con el equipo de Diseños Gratis. Soporte, consultas comerciales y reportes de copyright.',
}

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Hablemos</h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                    En <strong>Diseños Gratis</strong> valoramos tu feedback. Ya sea que tengas una consulta comercial, una sugerencia de contenido o necesites ayuda técnica, estamos aquí para escucharte.
                </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
                {/* Email Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 p-8 text-center transition-all hover:bg-muted/50 hover:shadow-lg">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Email</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Consultas generales y alianzas</p>
                    <a href="mailto:hola.disenosgratis@gmail.com" className="mt-4 block font-medium text-primary hover:underline">
                        hola.disenosgratis@gmail.com
                    </a>
                </div>

                {/* DMCA Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 p-8 text-center transition-all hover:bg-muted/50 hover:shadow-lg">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
                        <ShieldAlert className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">DMCA / Copyright</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Reportar infracciones</p>
                    <a href="mailto:hola.disenosgratis@gmail.com" className="mt-4 block font-medium text-amber-600 hover:underline">
                        hola.disenosgratis@gmail.com
                    </a>
                </div>
            </div>

            <div className="mt-16 rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">Formulario de Contacto</h3>
                <p className="text-center text-muted-foreground mb-8">
                    O envíanos un mensaje directo desde aquí. Te responderemos en menos de 24 horas.
                </p>
                {/* Placeholder para formulario real - Por ahora mantenemos el diseño limpio */}
                <div className="max-w-md mx-auto text-center p-6 border-2 border-dashed border-border rounded-xl bg-muted/20">
                    <p className="text-sm text-muted-foreground italic">
                        El formulario de contacto estará habilitado próximamente. Por favor utiliza el correo electrónico arriba mencionado.
                    </p>
                </div>
            </div>

            <div className="mt-20 border-t border-border/40 pt-12 text-center">
                <Link
                    href="/"
                    className="text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-2"
                >
                    <span>←</span> Volver al inicio
                </Link>
            </div>
        </div>
    )
}
