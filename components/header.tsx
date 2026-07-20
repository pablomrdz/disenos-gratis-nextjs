'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, Sparkles, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mega Menu Data Structure - Optimizada con Inteligencia de Search Console y Supabase
const megaMenuCategories = [
  {
    title: 'Técnicas y Proyectos',
    items: [
      { 
        name: 'DTF / Impresión Textil', 
        href: '/dtf', 
        description: 'Archivos en 300 DPI y semitonos para impresión textil y transfers.' 
      },
      { 
        name: 'Sublimación', 
        href: '/sublimacion', 
        description: 'Plantillas editables para tazas de 11oz, playeras, termos y cojines.' 
      },
      { 
        name: 'Tipografías Deportivas', 
        href: '/tipografias', 
        description: 'Fuentes de números de jersey, Selección Mexicana 2026 y TTF/OTF.' 
      },
      { 
        name: 'Corte y Grabado Láser', 
        href: '/corte-laser', 
        description: 'Vectores para MDF, acrílico, plotter y láser (SVG, DXF, CDR).' 
      },
      { 
        name: 'Vinil Textil', 
        href: '/vinil-textil', 
        description: 'Diseños limpios a un color y multicapa para plotter de corte.' 
      },
    ],
  },
  {
    title: 'Formatos y Recursos',
    items: [
      { 
        name: 'DTF en Semitonos', 
        href: '/tags/semitono', 
        description: 'Diseños con trama de puntos para ahorrar tinta y dar suavidad al tacto.' 
      },
      { 
        name: 'Imágenes PNG sin Fondo', 
        href: '/tags/png', 
        description: 'Recursos transparentes en alta resolución listos para ensamblar tu arte.' 
      },
      { 
        name: 'Vectores Editables (SVG/AI)', 
        href: '/vectores', 
        description: 'Archivos trazados editables en Illustrator, CorelDraw e Inkscape.' 
      },
      { 
        name: 'Archivos Photoshop (PSD)', 
        href: '/tags/psd', 
        description: 'Plantillas en capas organizadas con objetos inteligentes para maquetar.' 
      },
      { 
        name: 'Corte (Studio3 / Silhouette)', 
        href: '/tags/silhouette', 
        description: 'Archivos Studio3 y DXF optimizados para Silhouette Cameo y Cricut.' 
      },
      { 
        name: 'Fondos y Texturas', 
        href: '/fondos-y-texturas', 
        description: 'Papeles digitales, fondos para Zoom y texturas retro de alta definición.' 
      },
    ],
  },
  {
    title: 'Temas y Personajes',
    items: [
      { 
        name: 'Disney y Pixar', 
        href: '/tags/disney', 
        description: 'Stitch, Toy Story 5, Mickey Mouse y Princesas en PNG y vectores.' 
      },
      { 
        name: 'Anime y Manga', 
        href: '/tags/anime', 
        description: 'One Piece (Carteles Wanted), Dragon Ball, Pokémon y cultura geek.' 
      },
      { 
        name: 'Tradiciones y Lotería', 
        href: '/tags/loteria', 
        description: 'Plantillas de Lotería Mexicana editables e imprimibles en PDF.' 
      },
      { 
        name: 'Películas y Series', 
        href: '/tags/peliculas', 
        description: 'Diseños inspirados en los mejores estrenos de cine y shows de TV.' 
      },
      { 
        name: 'Videojuegos / Gamers', 
        href: '/tags/videojuegos', 
        description: 'Personajes retro, gaming y vectores para la comunidad gamer.' 
      },
      { 
        name: 'Marcas y Logos', 
        href: '/tags/logos', 
        description: 'Logotipos vectorizados de marcas reconocidas e isotipos limpios.' 
      },
    ],
  },
  {
    title: 'Eventos y Festividades',
    items: [
      { 
        name: 'Día del Padre', 
        href: '/tags/dia-del-padre', 
        description: 'Vectores y plantillas de "Papá e Hijos" para playeras y tazas.' 
      },
      { 
        name: 'Día de las Madres', 
        href: '/tags/dia-de-las-madres', 
        description: 'Diseños florales, frases emotivas y regalables para mamá.' 
      },
      { 
        name: 'Navidad y Halloween', 
        href: '/tags/halloween', 
        description: 'Personajes de terror infantiles, brujas, calaveras y pino navideño.' 
      },
      { 
        name: 'Fiestas Patrias y Religiosas', 
        href: '/tags/revolucion-mexicana', 
        description: 'Virgen de Guadalupe, Independencia, Día de Muertos y folklore.' 
      },
      { 
        name: 'Cumpleaños y Fiestas', 
        href: '/tags/cumpleanos', 
        description: 'Kits imprimibles, invitaciones, toppers de pastel y banners.' 
      },
      { 
        name: 'Baby Shower y Bautizos', 
        href: '/tags/baby-shower', 
        description: 'Diseños tiernos en acuarela y tonos pastel para eventos infantiles.' 
      },
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

        {/* Desktop Mega Menu */}
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
                      {/* Título de Columna NO Clickeable */}
                      <h3 className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 select-none">
                        {group.title}
                      </h3>
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

            <li>
              <Link
                href="/plantillas/"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-blue-800 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.03] active:scale-[0.97]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Edita y Descarga Online
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
              <Link
                href="/plantillas/"
                className="flex items-center gap-2 rounded-xl mx-3 mt-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary to-blue-800 shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4" />
                Edita y Descarga Online
              </Link>
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