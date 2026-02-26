'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Download, Crown, Lock, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShareToUnlockModal } from '@/components/share-to-unlock-modal'
import type { Design } from '@/lib/types'

import { slugify } from '@/lib/utils'

interface FontCardProps {
  font: Design
}

export function FontCard({ font }: FontCardProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [previewText, setPreviewText] = useState('Texto de prueba')

  const isVip = font.is_vip && font.premium_url
  const showLock = isVip && !isUnlocked

  const mainCategory = (font.category || 'Tipografías').split(',')[0].trim()

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (showLock) {
      setShowShareModal(true)
      return
    }

    if (font.download_url) {
      window.open(font.download_url, '_blank')
    }
  }

  const handleUnlock = () => {
    setIsUnlocked(true)
    setShowShareModal(false)
  }

  return (
    <>
      <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
        {/* Main Image Preview (Visual appeal) */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <Link href={`/designs/${font.slug || font.id}`}>
            <Image
              src={font.image_url || font.thumbnail_url || "/placeholder.svg"}
              alt={font.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* VIP Badge */}
            {isVip && (
              <div className="absolute left-2 top-2 z-10">
                <Badge className="h-4 gap-1 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] text-white px-1.5 font-bold">
                  <Crown className="h-2 w-2" />
                  VIP
                </Badge>
              </div>
            )}
          </Link>
        </div>

        <CardContent className="p-2 flex flex-col justify-between min-h-[90px]">
          <div>
            <Link href={`/designs/${font.slug || font.id}`} className="hover:text-primary transition-colors">
              <h3 className="font-bold text-xs text-foreground line-clamp-1 sm:text-[13px]">
                {font.title}
              </h3>
            </Link>
            <div className="mt-1">
              <Link
                href={`/category/${slugify(mainCategory)}`}
                className="relative z-20 truncate text-[8px] font-uppercase tracking-wider text-muted-foreground uppercase bg-muted/50 px-1.5 py-0.5 rounded transition-colors hover:bg-primary/10 hover:text-primary min-w-0 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                {mainCategory.replace('-', ' ')}
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1 mt-auto pt-1">
            <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground shrink-0">
              <Download className="h-2 w-2" />
              {(font.downloads || 0).toLocaleString()}
            </span>
            <div className="relative z-10">
              <Link href={`/designs/${font.slug || font.id}`}>
                <Button size="sm" className="h-7 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white border-none text-[10px] font-bold px-4 transition-all duration-300">
                  Descargar
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareToUnlockModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        design={font}
        onUnlock={handleUnlock}
      />
    </>
  )
}
