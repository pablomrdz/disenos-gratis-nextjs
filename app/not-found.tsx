'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Home, Palette, ArrowRight } from 'lucide-react'

const POPULAR_CATEGORIES = [
    { name: 'Sublimación', slug: 'sublimacion' },
    { name: 'Vectores', slug: 'vectores' },
    { name: 'Plantillas', slug: 'plantillas' },
    { name: 'DTF', slug: 'dtf' },
    { name: 'Tipografías', slug: 'tipografias' },
    { name: 'Corte Láser', slug: 'corte-laser' },
]

export default function NotFound() {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20">
            {/* Fun Illustration */}
            <div className="relative mb-8">
                <div className="text-[120px] leading-none font-bold tracking-tighter bg-gradient-to-br from-primary/80 via-primary to-primary/60 bg-clip-text text-transparent select-none">
                    404
                </div>
                <div className="absolute -top-2 -right-4 text-4xl animate-bounce">
                    🎨
                </div>
                <div className="absolute -bottom-1 -left-3 text-3xl animate-pulse">
                    ✏️
                </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground sm:text-3xl text-center">
                ¡Ups! Esta página se nos escapó del lienzo
            </h1>
            <p className="mt-3 max-w-md text-center text-muted-foreground text-balance">
                No encontramos lo que buscas, pero tenemos miles de recursos gráficos esperándote. ¡Prueba buscando aquí!
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 w-full max-w-md">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar diseños, plantillas, vectores..."
                        className="w-full rounded-full border border-input bg-background py-3.5 pl-12 pr-28 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />

                    <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Buscar
                    </button>
                </div>
            </form>

            {/* Popular Categories */}
            <div className="mt-10 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-4">O explora categorías populares:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR_CATEGORIES.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/${cat.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
                        >
                            <Palette className="h-3.5 w-3.5" />
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Home Button */}
            <Link
                href="/"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:scale-105"
            >
                <Home className="h-4 w-4" />
                Volver al inicio
                <ArrowRight className="h-4 w-4" />
            </Link>
        </div>
    )
}
