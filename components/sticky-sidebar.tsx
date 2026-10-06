import Link from 'next/link'
import { Folder, Tag as TagIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCategoryName } from '@/lib/content-utils'
import { slugify } from '@/lib/utils'

interface StickySidebarProps {
    popularCategories: Array<{ category: string; count: number }>
    tags: string[]
    className?: string
}

export function StickySidebar({ popularCategories, tags, className }: StickySidebarProps) {
    return (
        <div className={`sticky top-8 space-y-6 ${className || ''}`}>
            {/* Bloque 1: Categorías Populares */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Folder className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold text-foreground">Categorías</h3>
                </div>
                <ul className="space-y-1.5">
                    {popularCategories.map((item) => (
                        <li key={item.category}>
                            <Link
                                href={`/${slugify(item.category)}/`}
                                className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm transition-all duration-200 hover:border-primary/15 hover:bg-primary/5"
                            >
                                <span className="text-foreground/80 transition-colors group-hover:text-link-accent">
                                    {formatCategoryName(item.category)}
                                </span>
                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-background group-hover:text-link-accent">
                                    {item.count}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <Link
                    href="/designs/"
                    className="group mt-4 flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold text-link-accent transition-all duration-200 hover:bg-primary/5 hover:shadow-sm"
                >
                    Ver todo el catalogo
                </Link>
            </div>

            {/* Bloque 3: Etiquetas Relacionadas */}
            {tags.length > 0 && (
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <TagIcon className="h-4 w-4" />
                        </span>
                        <h3 className="font-semibold text-foreground">Etiquetas Relacionadas</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/tags/${slugify(tag)}/`}
                                className="group"
                            >
                                <Badge
                                    variant="outline"
                                    className="bg-transparent text-xs transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                >
                                    {tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
