'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, Sparkles, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mega Menu Data Structure - Expertly aligned with WordPress backend
const megaMenuCategories = [
  {
    title: 'Técnicas y Proyectos',
    href: '/designs',
    items: [
      { name: 'Sublimación', href: '/sublimacion', description: 'Plantillas y diseños para tazas, playeras y más.' },
      { name: 'DTF / Impresión', href: '/dtf', description: 'Archivos listos para impresión textil y transfers.' },
      { name: 'Corte y Grabado', href: '/corte-laser', description: 'Vectores para corte láser y plotter (SVG, DXF).' },
      { name: 'Vinil Textil', href: '/vinil-textil', description: 'Diseños optimizados para corte en vinilo.' },
      { name: 'Tipografías', href: '/tipografias', description: 'Fuentes premium para tus proyectos creativos.' },
    ],
  },
  {
    title: 'Formatos de Archivo',
    href: '/designs',
    items: [
      { name: 'Imágenes PNG', href: '/tags/png', description: 'Recursos con fondo transparente en alta resolución.' },
      { name: 'Vectores (SVG/Ai)', href: '/vectores', description: 'Archivos editables para Illustrator y Corel.' },
      { name: 'Photoshop (PSD)', href: '/tags/psd', description: 'Plantillas editables en capas para Photoshop.' },
      { name: 'Corte (Studio3/DXF)', href: '/tags/studio3', description: 'Archivos listos para Silhouette Cameo y Cricut.' },
      { name: 'Fondos y Texturas', href: '/fondos-y-texturas', description: 'Papel digital y texturas para tus fondos.' },
    ],
  },
  {
    title: 'Temas y Personajes',
    href: '/tags/personajes',
    items: [
      { name: 'Disney y Pixar', href: '/tags/disney', description: 'Mickey, Princesas y tus personajes favoritos.' },
      { name: 'Anime y Manga', href: '/tags/anime', description: 'Diseños de Goku, Naruto y cultura japonesa.' },
      { name: 'Películas', href: '/tags/peliculas', description: 'Inspiración en los mejores títulos del cine.' },
      { name: 'Series de TV', href: '/tags/series', description: 'Tus shows favoritos en formato digital.' },
      { name: 'Videojuegos / Gamers', href: '/tags/videojuegos', description: 'Recursos de tus juegos preferidos.' },
      { name: 'Marcas y Logos', href: '/tags/logos', description: 'Vectores de marcas reconocidas.' },
    ],
  },
  {
    title: 'Eventos y Festividades',
    href: '/tags/eventos',
    items: [
      { name: 'Día del Padre', href: '/tags/dia-del-padre', description: 'El regalo perfecto para papá en su día.' },
      { name: 'Día de las Madres', href: '/tags/dia-de-las-madres', description: 'Diseños tiernos para celebrar a mamá.' },
      { name: 'Amor y Amistad', href: '/tags/dia-del-amor-y-la-amistad', description: 'San Valentín y detalles románticos.' },
      { name: 'Navidad / Halloween', href: '/tags/navidad', description: 'Todo para tus decoraciones de temporada.' },
      { name: 'Cumpleaños / Fiestas', href: '/tags/cumpleanos', description: 'Recursos para fiestas inolvidables.' },
      { name: 'Baby Shower', href: '/tags/baby-shower', description: 'Diseños dulces para la llegada del bebé.' },
    ],
  },
];

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileExpandedSections, setMobileExpandedSections] = useState<string[]>([]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  const handleMobileSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, router]);

  const toggleMobileSection = (title: string) => {
    setMobileExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95 text-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Diseños Gratis"
            className="h-8 w-auto sm:h-10"
          />
        </Link>

        {/* Desktop Mega Menu - CSS Only version for stability */}
        <nav className="hidden lg:flex lg:flex-1 lg:justify-center">
          <ul className="flex items-center gap-6">
            <li className="group relative py-4">
              <button className="flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-black focus:outline-none">
                Categorías
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Mega Menu Dropdown */}
              <div className="absolute left-1/2 top-full z-[100] mt-0 w-[1000px] -translate-x-1/2 transform rounded-lg border border-slate-200 bg-white p-6 shadow-xl opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
                {/* Bridge to prevent closing when moving mouse */}
                <div className="absolute -top-4 left-0 h-4 w-full bg-transparent"></div>

                <div className="grid grid-cols-4 gap-6">
                  {megaMenuCategories.map((group) => (
                    <div key={group.title} className="space-y-4">
                      <Link
                        href={group.href}
                        className="block rounded-md px-2 py-1 text-sm font-bold text-black hover:bg-slate-100"
                      >
                        {group.title}
                      </Link>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="group/item block rounded-md p-2 transition-colors hover:bg-slate-50"
                          >
                            <div className="text-sm font-medium leading-none text-black group-hover/item:text-primary">
                              {item.name}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-snug text-gray-500">
                              {item.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer link for Mega Menu */}
                <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                  <Link
                    href="/tags"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Explorar todas las etiquetas y temas →
                  </Link>
                </div>
              </div>
            </li>

            <li>
              <Link
                href="/blog"
                className="text-sm font-medium text-foreground transition-colors hover:text-black"
              >
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden items-center md:flex">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Buscar diseños..."
                  className="w-[200px] text-black bg-white border-slate-300"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery.trim()) {
                      setSearchOpen(false);
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

          {/* VIP Button - Using brand colors now? No, the user wants to maintain the "VIP vibe" but maybe sync the dark part with our brand dark */}
          <Button asChild className="hidden gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 sm:flex shadow-sm">
            <Link href="/vip">
              <Sparkles className="h-4 w-4" />
              Acceso VIP
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

      {/* Mobile Menu - Accordion Style */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-white lg:hidden h-[calc(100vh-64px)] overflow-y-auto">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            <form onSubmit={handleMobileSearch} className="mb-6 flex gap-2">
              <Input
                type="search"
                placeholder="Buscar diseños..."
                className="flex-1 bg-white text-black border-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="sm" disabled={searchQuery.trim().length < 2}>
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="space-y-1">
              {megaMenuCategories.map((group) => {
                const isExpanded = mobileExpandedSections.includes(group.title);
                return (
                  <div key={group.title} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => toggleMobileSection(group.title)}
                      className="flex w-full items-center justify-between py-3 text-sm font-bold text-black"
                    >
                      {group.title}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-4 pb-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                        {group.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center justify-between rounded-md py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 px-2"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span>{item.name}</span>
                            <ChevronRight className="h-3 w-3 text-gray-300" />
                          </Link>
                        ))}
                        <Link
                          href={group.href}
                          className="block mt-2 text-xs font-semibold text-primary px-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Ver todo en {group.title} →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-1 pt-6 border-t border-gray-100 mt-4">
              <Link
                href="/blog"
                className="block rounded-md px-3 py-3 text-sm font-bold text-black hover:bg-slate-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </div>

            <div className="pt-6">
              <Button asChild className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                <Link href="/vip" onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles className="h-4 w-4" />
                  Obtener Acceso VIP
                </Link>
              </Button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8 mb-4">
              © {new Date().getFullYear()} DiseñosGratis.com
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
