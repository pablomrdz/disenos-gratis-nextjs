import Link from 'next/link'
import { Crown, TrendingUp, Clock, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AdSlot } from '@/components/ad-slot'
import type { Design } from '@/lib/types'

interface SidebarProps {
  popularDesigns?: Design[]
  recentDesigns?: Design[]
}

export function Sidebar({ popularDesigns = [], recentDesigns = [] }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* VIP Banner */}
      <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Go VIP</h3>
              <p className="text-sm text-muted-foreground">
                Unlock all premium content
              </p>
            </div>
          </div>
          <Link
            href="/vip"
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-amber-600 hover:to-orange-600"
          >
            Get VIP Access
          </Link>
        </CardContent>
      </Card>

      {/* Sidebar Ad */}
      <AdSlot variant="sidebar" />

      {/* Popular Downloads */}
      {popularDesigns.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Popular Downloads
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
                    {design.downloads.toLocaleString()} downloads
                  </p>
                </div>
                {design.is_vip && (
                  <Badge className="shrink-0 bg-amber-500/10 text-amber-600" variant="outline">
                    <Crown className="mr-1 h-3 w-3" />
                    VIP
                  </Badge>
                )}
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
              Recent Additions
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
