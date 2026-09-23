'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function EnglishHeader() {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/en/dtf/', label: 'DTF Resources' },
    { href: '/en/tools/dtf-press-settings/', label: 'Press Settings' },
    { href: '/en/tools/dtf-size-guide/', label: 'Size Guide' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 text-black backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/en/dtf/" className="flex items-center gap-2"><img src="/logo.png" alt="Diseños Gratis" className="h-8 w-auto sm:h-10" /></Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground transition hover:text-primary">{link.label}</Link>)}
          <Link href="/dtf/" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary">Español</Link>
        </nav>
        <button type="button" className="rounded-lg p-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {open && (
        <nav className="border-t border-border/40 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-muted">{link.label}</Link>)}
            <Link href="/dtf/" className="rounded-lg px-3 py-3 text-sm font-semibold text-primary">Español</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
