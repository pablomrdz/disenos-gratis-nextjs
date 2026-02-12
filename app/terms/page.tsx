import Link from 'next/link'

export default function TermsPage() {
    const lastUpdated = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Términos de Servicio</h1>
            <p className="mt-2 text-sm text-muted-foreground">Última actualización: {lastUpdated}</p>

            <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">1. Licencia de Uso</h2>
                    <p>
                        Todos los recursos descargables en DiseñosGratis.com están sujetos a una licencia de uso personal y comercial limitada. Puede usar los diseños para sus proyectos, pero no está permitido revender los archivos digitales originales.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">2. Membresía VIP</h2>
                    <p>
                        La membresía VIP otorga acceso a contenidos exclusivos. Los pagos no son reembolsables debido a la naturaleza digital del producto, pero puede cancelar su suscripción en cualquier momento.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">3. Responsabilidad</h2>
                    <p>
                        DiseñosGratis.com no se hace responsable de las pérdidas o daños resultantes del uso de nuestros diseños. Los usuarios son responsables de verificar que el material sea apto para sus necesidades específicas.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">4. Modificaciones</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Se notificará a los usuarios sobre cambios significativos a través del correo electrónico registrado.
                    </p>
                </section>
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
