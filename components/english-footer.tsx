import Link from 'next/link'

export function EnglishFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div><img src="/logo.png" alt="Diseños Gratis" className="h-8 w-auto" /><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Free DTF design resources, practical printing tools and downloadable creative assets.</p></div>
        <div><h2 className="text-sm font-semibold">DTF Resources</h2><div className="mt-4 space-y-3"><Link href="/en/dtf/" className="block text-sm text-muted-foreground hover:text-foreground">DTF resource center</Link><Link href="/en/tools/dtf-press-settings/" className="block text-sm text-muted-foreground hover:text-foreground">Heat press settings</Link><Link href="/en/tools/dtf-size-guide/" className="block text-sm text-muted-foreground hover:text-foreground">Size & placement guide</Link></div></div>
        <div><h2 className="text-sm font-semibold">Site</h2><div className="mt-4 space-y-3"><Link href="/dtf/" className="block text-sm text-muted-foreground hover:text-foreground">Spanish DTF library</Link><Link href="/privacy/" className="block text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link><Link href="/terms/" className="block text-sm text-muted-foreground hover:text-foreground">Terms</Link></div></div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} DiseñosGratis.com</div>
    </footer>
  )
}
