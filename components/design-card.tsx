'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, ExternalLink, Crown, Share2, Lock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShareToUnlockModal } from '@/components/share-to-unlock-modal'
import type { Design } from '@/lib/types'
import { slugify } from '@/lib/utils'

interface DesignCardProps {
  design: Design
}

export function DesignCard({ design }: DesignCardProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Show VIP badge if premium_url exists (VIP designs have premium_url)
  const isVip = Boolean(design.premium_url)
  const showLock = isVip && !isUnlocked

  const designType = design.type || 'internal'

  const getTypeLabel = () => {
    if (isVip) return 'Acceso VIP'

    switch (designType) {
      case 'canva':
        return 'Plantilla Canva'
      case 'capcut':
        return 'Plantilla CapCut'
      case 'font':
        return 'Descarga de Fuente'
      default:
        return 'Descarga Directa'
    }
  }

  const getTypeColor = () => {
    if (isVip) return 'bg-amber-500/10 text-amber-600 border-amber-500/30'

    switch (designType) {
      case 'canva':
        return 'bg-[#00C4CC]/10 text-[#00C4CC] border-[#00C4CC]/30'
      case 'capcut':
        return 'bg-[#FF0050]/10 text-[#FF0050] border-[#FF0050]/30'
      case 'font':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30'
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
    }
  }

  const handleDownload = () => {
    if (showLock) {
      setShowShareModal(true)
      return
    }

    // If unlocked VIP, use premium_url
    if (isVip && isUnlocked && design.premium_url) {
      window.open(design.premium_url, '_blank')
      return
    }

    // Otherwise use external_url or download_url
    if (design.external_url) {
      window.open(design.external_url, '_blank')
    } else if (design.download_url) {
      window.open(design.download_url, '_blank')
    }
  }

  const handleUnlock = () => {
    setIsUnlocked(true)
    setShowShareModal(false)
  }

  return (
    <>
      <Card
        className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Link href={`/designs/${design.slug || design.id}`}>
            <Image
              src={design.image_url || design.thumbnail_url || "/placeholder.svg"}
              alt={design.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>

          {/* Overlay on hover - Compact */}
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-300 z-20 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {showLock ? (
              <>
                <Lock className="mr-1 h-3.5 w-3.5" />
                Desbloquear
              </>
            ) : (
              <>
                <Download className="mr-1 h-3.5 w-3.5" />
                Descargar
              </>
            )}
            <Button size="sm" variant="secondary" className="h-8 w-8 rounded-full p-0 pointer-events-auto" asChild onClick={(e) => e.stopPropagation()}>
              <Link href={`/designs/${design.slug || design.id}`}>
                <Eye className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* VIP Badge - Smaller */}
          {isVip && (
            <div className="absolute left-2 top-2 z-10">
              <Badge className="h-5 gap-1 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] text-white px-1.5 font-bold">
                <Crown className="h-2.5 w-2.5" />
                VIP
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-2.5 relative">
          <div className="group/link block relative z-10">
            {/* Title needs to decode entities like &#8211; */}
            <Link href={`/designs/${design.slug || design.id}`}>
              <h3
                className="line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover/link:text-primary"
                dangerouslySetInnerHTML={{ __html: design.title || 'Untitled Design' }}
              />
            </Link>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <Link
              href={`/category/${slugify((design.category || 'general').split(',')[0])}`}
              className="relative z-20 truncate text-[10px] font-uppercase tracking-wider text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded transition-colors hover:bg-primary/10 hover:text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              {(design.category || 'general').split(',')[0].trim().replace('-', ' ')}
            </Link>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
              <Download className="h-2.5 w-2.5" />
              {(design.downloads ?? 0).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <ShareToUnlockModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        design={design}
        onUnlock={handleUnlock}
      />
    </>
  )
}
