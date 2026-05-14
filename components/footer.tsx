import Link from 'next/link'
import { Sparkles, Download, Users } from 'lucide-react'

const footerLinks = {
  resources: [
    { name: 'Blog', href: '/blog' },
  ],
  categories: [
    { name: 'Sublimación', href: '/sublimacion' },
    { name: 'DTF', href: '/dtf' },
    { name: 'Vinil Textil', href: '/vinil-textil' },
    { name: 'Tipografías', href: '/tipografias' },
  ],
  company: [
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Política de Privacidad', href: '/privacy' },
    { name: 'Términos de Servicio', href: '/terms' },
  ],
  social: [
    { name: 'Pinterest', href: 'https://mx.pinterest.com/disenosgratis/' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@disenosgratis' },
    { name: 'Instagram', href: 'https://instagram.com/_disenosgratis/' }
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Stats Section moved from Hero */}
        <div className="grid grid-cols-3 gap-4 border-b border-border/40 pb-12 mb-12">
          <div className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <p className="text-sm text-muted-foreground">Descargas Libres</p>
            </div>
          </div>
          <div className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <Sparkles className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">1000+</div>
              <p className="text-sm text-muted-foreground">Plantillas Premium</p>
            </div>
          </div>
          <div className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
              <Users className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <p className="text-sm text-muted-foreground">Creadores Activos</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Diseños Gratis"
                className="h-8 w-auto sm:h-9"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Recursos de diseño premium para creadores, marketers y marcas. Plantillas gratuitas listas para imprimir.
            </p>
          </div>

          {/* Resources */}
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

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Categorías</h3>
            <ul className="mt-4 space-y-3">
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

          {/* Company */}
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

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Síguenos</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} Disenosgratis.com. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
