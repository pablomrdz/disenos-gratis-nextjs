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
    switch (designType) {
      case 'canva':
        return 'Canva Template'
      case 'capcut':
        return 'CapCut Template'
      case 'font':
        return 'Font Download'
      default:
        return 'Direct Download'
    }
  }

  const getTypeColor = () => {
    switch (designType) {
      case 'canva':
        return 'bg-[#00C4CC]/10 text-[#00C4CC] border-[#00C4CC]/20'
      case 'capcut':
        return 'bg-[#FF0050]/10 text-[#FF0050] border-[#FF0050]/20'
      case 'font':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
      default:
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
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
        className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={design.thumbnail_url || "/placeholder.svg"}
            alt={design.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <Button
                size="sm"
                className="flex-1 gap-2"
                onClick={handleDownload}
              >
                {showLock ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Unlock
                  </>
                ) : design.external_url ? (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
              <Button size="sm" variant="secondary" asChild>
                <Link href={`/designs/${design.slug || design.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* VIP Badge */}
          {isVip && (
            <div className="absolute left-3 top-3">
              <Badge className="gap-1 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                <Crown className="h-3 w-3" />
                VIP
              </Badge>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute right-3 top-3">
            <Badge variant="outline" className={`${getTypeColor()} backdrop-blur-sm`}>
              {getTypeLabel()}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <Link href={`/designs/${design.slug || design.id}`} className="group/link">
            <h3 className="line-clamp-1 font-semibold text-foreground transition-colors group-hover/link:text-primary">
              {design.title || 'Untitled Design'}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {design.description || 'No description available'}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {(design.category || 'general').replace('-', ' ')}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="h-3 w-3" />
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
