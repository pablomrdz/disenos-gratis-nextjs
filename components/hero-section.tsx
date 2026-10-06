'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function HeroSection() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    router.push(query.length >= 2 ? `/search?q=${encodeURIComponent(query)}` : '/search/')
  }, [searchQuery, router])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-8 pb-4 sm:pt-10 sm:pb-6 sm:px-6 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary mb-3 sm:mb-4">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Plantillas Editables y Recursos de Diseño Premium</span>
        </div>

        <h1 className="text-balance text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl lg:leading-tight">
          Diseños y plantillas gratis para{' '}
          <span className="bg-gradient-to-r from-primary-dark via-primary to-primary-light bg-clip-text text-transparent">
            DTF, sublimación y más
          </span>
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-pretty text-sm sm:text-base text-muted-foreground">
          Miles de plantillas editables, fuentes y recursos de diseño.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full mt-4 sm:mt-5">
          <div className="flex max-w-2xl mx-auto gap-2">
            <div className="group relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar diseños por título..."
                className="h-10 border-border/70 bg-background/80 pl-9 pr-4 text-sm shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/50 hover:bg-background hover:shadow-md focus-visible:border-primary/60 focus-visible:ring-primary/20 focus-visible:shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="hidden h-10 gap-2 bg-primary px-5 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary/30 sm:flex"
            >
              Buscar
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 shrink-0 bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-primary/30 sm:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
