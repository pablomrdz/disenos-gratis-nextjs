import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Privacidad | Diseños Gratis',
    description: 'Política de privacidad de Diseños Gratis. Información sobre cookies, AdSense y protección de datos.',
}

export default function PrivacyPage() {
    const lastUpdated = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Política de Privacidad</h1>
            <p className="mt-2 text-sm text-muted-foreground">Última actualización: {lastUpdated}</p>

            <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">1. Identificación y Titularidad</h2>
                    <p>
                        En cumplimiento con la normativa vigente en materia de protección de datos, le informamos que este sitio web, <strong>DiseñosGratis.com</strong>, se dedica a la distribución de recursos gráficos gratuitos y premium. Estamos comprometidos con la transparencia y la protección de su privacidad.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">2. Información que Recopilamos</h2>
                    <p className="mb-4">
                        Recopilamos información para mejorar su experiencia y garantizar la seguridad del servicio:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Datos de Navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas y tiempo de permanencia.</li>
                        <li><strong>Datos de Descarga:</strong> Registramos las descargas realizadas para análisis estadístico interno (tabla <code>downloads_stats</code>), con el fin de destacar los recursos más populares.</li>
                        <li><strong>Datos Personales:</strong> Nombre y correo electrónico si decide contactarnos voluntariamente o suscribirse a nuestro boletín.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">3. Publicidad y Cookies (Google AdSense)</h2>
                    <p className="mb-4">
                        Este sitio web utiliza <strong>Google AdSense</strong>, un servicio de publicidad proporcionado por Google Inc. ("Google"). Google utiliza cookies para mostrar anuncios relevantes a los usuarios.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg border border-border/50 text-sm">
                        <p className="mb-2"><strong>Aviso Importante sobre la Cookie DART:</strong></p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Google, como proveedor asociado, utiliza cookies para publicar anuncios en este sitio.</li>
                            <li>El uso de la cookie DART permite a Google prestar anuncios a los usuarios basándose en su visita a este y a otros sitios en Internet.</li>
                            <li>Los usuarios pueden inhabilitar el uso de la cookie DART a través del anuncio de Google y accediendo a la <a href="https://policies.google.com/technologies/ads" target="_blank" rel="nofollow noopener noreferrer" className="text-primary hover:underline">política de privacidad de la red de contenido</a>.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">4. Uso de la Información</h2>
                    <p>
                        Utilizamos la información recopilada exclusivamente para:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Personalizar su experiencia y responder a sus necesidades individuales.</li>
                        <li>Mantener y mejorar nuestro sitio web basándonos en las estadísticas de uso.</li>

                        <li>Enviar correos periódicos con nuevos recursos (solo si se ha suscrito explícitamente).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">5. Protección de Datos</h2>
                    <p>
                        Implementamos diversas medidas de seguridad para mantener la seguridad de su información personal. No vendemos, intercambiamos ni transferimos a terceros sus datos de identificación personal sin su consentimiento, excepto cuando sea necesario para operar nuestro sitio o cumplir con la ley.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">6. Derechos del Usuario (GDPR/CCPA)</h2>
                    <p>
                        Usted tiene derecho a acceder, rectificar o eliminar sus datos personales. Si desea ejercer estos derechos o tiene preguntas sobre nuestra política de privacidad, puede contactarnos a través de nuestra página de contacto.
                    </p>
                </section>
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
