import Link from 'next/link'
import { Folder, Tag as TagIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import AdUnit from '@/components/AdUnit'
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
            {/* Top Ad - 300x250 */}
            <div className="flex justify-center min-h-[250px] w-[300px] mx-auto">
                <AdUnit
                    slot="3806846005"
                    style={{ display: "inline-block", width: "300px", height: "250px" }}
                />
            </div>

            {/* Bloque 1: Categorías Populares */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Folder className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Categorías</h3>
                </div>
                <ul className="space-y-2">
                    {popularCategories.map((item) => (
                        <li key={item.category}>
                            <Link
                                href={`/${slugify(item.category)}`}
                                className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                            >
                                <span className="text-foreground/80 group-hover:text-foreground">
                                    {formatCategoryName(item.category)}
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">
                                    {item.count}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <Link
                    href="/designs"
                    className="mt-4 block text-center text-sm text-primary hover:underline"
                >
                    Ver todo el catalogo
                </Link>
            </div>

            {/* Bottom Ad - 300x250 */}
            <div className="flex justify-center min-h-[250px] w-[300px] mx-auto">
                <AdUnit
                    slot="3806846005"
                    style={{ display: "inline-block", width: "300px", height: "250px" }}
                />
            </div>

            {/* Bloque 3: Etiquetas Relacionadas */}
            {tags.length > 0 && (
                <div className="rounded-xl border border-border/50 bg-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <TagIcon className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-foreground">Etiquetas Relacionadas</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/tags/${encodeURIComponent(tag)}`}
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
