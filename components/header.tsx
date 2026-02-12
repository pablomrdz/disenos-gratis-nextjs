'use client'

import React from "react"

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const categories = [
  { name: 'Sublimación', slug: 'sublimacion', description: 'Plantillas para sublimar tazas, remeras y más' },
  { name: 'DTF', slug: 'dtf', description: 'Diseños listos para impresión DTF' },
  { name: 'Vinilo', slug: 'vinilo', description: 'Vectores para corte en vinilo' },
  { name: 'Tipografías', slug: 'tipografias', description: 'Fuentes premium y gratuitas' },
  { name: 'Corte Láser', slug: 'corte-laser', description: 'Vectores para MDF y acrílico' },
  { name: 'Plantillas', slug: 'plantillas', description: 'Agendas, invitaciones y más' },
]

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }, [searchQuery, router])

  const handleMobileSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
      setSearchQuery('')
    }
  }, [searchQuery, router])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">DiseñosGratis.com</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Categories</NavigationMenuTrigger>
                <NavigationMenuContent className="z-[100] bg-white text-slate-900 shadow-xl border border-slate-200 ring-1 ring-black/5 !opacity-100 !visible">
                  <ul className="grid w-[500px] gap-2 p-4 md:grid-cols-2">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/category/${category.slug}`}
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-foreground">{category.name}</div>
                            <p className="mt-1 line-clamp-1 text-sm leading-snug text-muted-foreground">
                              {category.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link href="/category/tipografias" className="px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Fonts
          </Link>
          <Link href="/blog" className="px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Blog
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden items-center md:flex">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search designs..."
                  className="w-[200px]"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery.trim()) {
                      setSearchOpen(false)
                    }
                  }}
                />
                <Button type="submit" size="sm" disabled={searchQuery.trim().length < 2}>
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          {/* VIP Button */}
          <Button asChild className="hidden gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 sm:flex">
            <Link href="/vip">
              <Sparkles className="h-4 w-4" />
              VIP Access
            </Link>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <form onSubmit={handleMobileSearch} className="mb-4 flex gap-2">
              <Input
                type="search"
                placeholder="Search designs..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="sm" disabled={searchQuery.trim().length < 2}>
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <div className="space-y-1">
              <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Categories
              </p>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="space-y-1 pt-4">
              <Link
                href="/category/tipografias"
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fonts
              </Link>
              <Link
                href="/blog"
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </div>
            <div className="pt-4">
              <Button asChild className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Link href="/vip" onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles className="h-4 w-4" />
                  VIP Access
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
