import Link from 'next/link'
import { Crown, TrendingUp, Clock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdBanner } from '@/components/ad-banner'
import type { Design } from '@/lib/types'

interface SidebarProps {
  popularDesigns?: Design[]
  recentDesigns?: Design[]
}

export function Sidebar({ popularDesigns = [], recentDesigns = [] }: SidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="mx-auto max-w-[300px]">
        <AdBanner slot="sidebar" minHeight={600} />
      </div>

      {/* VIP Banner removed — Phase 1: all content is free */}

      {/* Popular Downloads */}
      {popularDesigns.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Descargas Populares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularDesigns.slice(0, 5).map((design, index) => (
              <Link
                key={design.id}
                href={`/designs/${design.slug}`}
                className="group flex items-start gap-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-0.5">
                  <p className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary">
                    {design.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {design.downloads.toLocaleString()} descargas
                  </p>
                </div>

              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Additions */}
      {recentDesigns.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Recién Agregados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDesigns.slice(0, 5).map((design) => (
              <Link
                key={design.id}
                href={`/designs/${design.slug}`}
                className="group flex items-start gap-3"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <Star className="h-3 w-3 text-emerald-500" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary">
                    {design.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(design.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </aside>
  )
}
