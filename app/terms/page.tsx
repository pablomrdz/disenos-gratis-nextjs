import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Términos de Servicio | Diseños Gratis',
    description: 'Términos y condiciones de uso para Diseños Gratis. Licencias, derechos de autor y política de uso aceptable.',
}

export default function TermsPage() {
    const lastUpdated = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Términos de Servicio</h1>
            <p className="mt-2 text-sm text-muted-foreground">Última actualización: {lastUpdated}</p>

            <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">1. Aceptación de los Términos</h2>
                    <p>
                        Al acceder y utilizar <strong>DiseñosGratis.com</strong>, usted acepta cumplir y estar legalmente vinculado por los siguientes términos y condiciones. Si no está de acuerdo con alguno de estos términos, le rogamos que no utilice nuestro sitio web ni descargue nuestros recursos.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">2. Licencia de Uso</h2>
                    <p className="mb-4">
                        Se concede permiso para descargar los recursos gráficos (imágenes, vectores, plantillas) disponibles en DiseñosGratis.com bajo las siguientes condiciones:
                    </p>

                    <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20 text-sm mb-4">
                        <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">✅ Usted PUEDE:</p>
                        <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                            <li>Utilizar los recursos para proyectos personales y comerciales.</li>
                            <li>Modificar, adaptar y crear obras derivadas a partir de nuestros recursos.</li>
                            <li>Utilizar los recursos en redes sociales, sitios web, videos y material impreso.</li>
                        </ul>
                    </div>

                    <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 text-sm">
                        <p className="font-semibold text-red-700 dark:text-red-400 mb-2">❌ Usted NO PUEDE:</p>
                        <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                            <li><strong>Revender, redistribuir o sublicenciar</strong> los archivos originales tal cual (ej. vender el archivo .PSD o .AI).</li>
                            <li>Incluir nuestros recursos en otros sitios de stock, packs de descarga o repositorios.</li>
                            <li>Utilizar los recursos de manera que compita directamente con el servicio de DiseñosGratis.com.</li>
                            <li>Atribuirse la autoría exclusiva de los diseños originales.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">3. Membresía VIP</h2>
                    <p>
                        La membresía VIP otorga acceso preferencial a descargas directas y contenido exclusivo. Al suscribirse, usted entiende que:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>El pago es por el servicio de acceso y curaduría, no por la compra de derechos de autor.</li>
                        <li>Debido a la naturaleza digital e irrevocable de los productos descargables, <strong>no ofrecemos reembolsos</strong> una vez que se ha descargado algún material, salvo excepciones técnicas comprobables.</li>
                        <li>Puede cancelar su suscripción en cualquier momento para evitar futuros cargos.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">4. Propiedad Intelectual</h2>
                    <p>
                        Todos los recursos, marcas, logotipos y contenidos de este sitio son propiedad de DiseñosGratis.com o de sus respectivos creadores y están protegidos por leyes de propiedad intelectual. El contenido de terceros se utiliza bajo licencia o permiso.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">5. Limitación de Responsabilidad</h2>
                    <p>
                        Los materiales en DiseñosGratis.com se proporcionan "tal cual". No ofrecemos garantías, expresas o implícitas, sobre la precisión o fiabilidad de los materiales. En ningún caso seremos responsables por daños (incluyendo, sin limitación, daños por pérdida de datos o beneficios) que surjan del uso o la imposibilidad de usar nuestros recursos.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-foreground mb-4 font-heading">6. Modificaciones</h2>
                    <p>
                        Nos reservamos el derecho de revisar estos términos de servicio en cualquier momento sin previo aviso. Al utilizar este sitio web, usted acepta estar obligado por la versión actual de estos términos.
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
