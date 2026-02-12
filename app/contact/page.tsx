import Link from 'next/link'
import { Mail, MessageSquare } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Contacto</h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
                    ¿Tienes alguna duda o sugerencia? Nos encantaría escucharte. Completa el formulario o escríbenos directamente.
                </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-8 text-center transition-colors hover:bg-muted/50">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Email</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Soporte general y consultas</p>
                    <p className="mt-4 font-medium text-primary">hola@disenosgratis.com</p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-muted/30 p-8 text-center transition-colors hover:bg-muted/50">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                        <MessageSquare className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">WhatsApp</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Soporte rápido para miembros VIP</p>
                    <p className="mt-4 font-medium text-emerald-600">+1 (555) 123-4567</p>
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
