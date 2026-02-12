import Link from 'next/link'

export default function PrivacyPage() {
    const lastUpdated = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Política de Privacidad</h1>
            <p className="mt-2 text-sm text-muted-foreground">Última actualización: {lastUpdated}</p>

            <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">1. Información que Recopilamos</h2>
                    <p>
                        Recopilamos información personal básica como su nombre y correo electrónico cuando se registra para una cuenta o se suscribe a nuestro boletín. También recopilamos datos de uso anónimos a través de cookies para mejorar nuestra plataforma.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">2. Cómo Usamos su Información</h2>
                    <p>
                        Utilizamos su información para proporcionarle acceso a nuestros recursos, procesar sus descargas y enviarle actualizaciones sobre nuevos contenidos o promociones de interés.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">3. Protección de Datos</h2>
                    <p>
                        Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal. No vendemos ni compartimos sus datos con terceros con fines comerciales.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">4. Cookies</h2>
                    <p>
                        Utilizamos cookies para entender y guardar sus preferencias para futuras visitas. Puede desactivar las cookies en la configuración de su navegador, aunque esto podría afectar la funcionalidad del sitio.
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
