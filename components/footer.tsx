import Link from 'next/link'

const footerLinks = {
  resources: [
    { name: 'Todos los diseños', href: '/designs' },
    { name: 'Etiquetas y temas', href: '/tags' },
    { name: 'Blog', href: '/blog' },
    { name: 'Plantillas', href: '/plantillas' },
  ],
  categories: [
    { name: 'DTF', href: '/dtf' },
    { name: 'Sublimación', href: '/sublimacion' },
    { name: 'Vectores', href: '/vectores' },
    { name: 'Corte Láser', href: '/corte-laser' },
    { name: 'Vinil Textil', href: '/vinil-textil' },
    { name: 'Tipografías', href: '/tipografias' },
    { name: 'Fondos y Texturas', href: '/fondos-y-texturas' },
    { name: 'Recursos Gráficos', href: '/recursos-graficos' },
  ],
  company: [
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Política de Privacidad', href: '/privacy' },
    { name: 'Términos de Servicio', href: '/terms' },
  ],
  social: [
    { name: 'Facebook', href: 'https://facebook.com/disenosgratis' },
    { name: 'Instagram', href: 'https://instagram.com/_disenosgratis/' },
    { name: 'Pinterest', href: 'https://mx.pinterest.com/disenosgratis/' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@disenosgratis' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Diseños Gratis"
                className="h-8 w-auto sm:h-9"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Recursos gráficos gratuitos para DTF, sublimación, vinil textil, corte láser y proyectos creativos.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Recursos</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Categorías</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-1">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Compañía</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Síguenos</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {footerLinks.social.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Disenosgratis.com. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
