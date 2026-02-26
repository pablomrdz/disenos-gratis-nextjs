import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const footerLinks = {
  resources: [
    { name: 'Blog', href: '/blog' },
  ],
  categories: [
    { name: 'Sublimación', href: '/category/sublimacion' },
    { name: 'DTF', href: '/category/dtf' },
    { name: 'Vinil Textil', href: '/category/vinil-textil' },
    { name: 'Tipografías', href: '/category/tipografias' },
  ],
  company: [
    { name: 'Sobre Nosotros', href: '/about' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Política de Privacidad', href: '/privacy' },
    { name: 'Términos de Servicio', href: '/terms' },
  ],
  social: [
    { name: 'Pinterest', href: 'https://pinterest.com' },
    { name: 'TikTok', href: 'https://tiktok.com' },
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'YouTube', href: 'https://youtube.com' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
              Recursos de diseño premium para creadores, marketers y marcas. Plantillas gratuitas y VIP para cada proyecto.
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
            {new Date().getFullYear()} DiseñosGratis.com. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
