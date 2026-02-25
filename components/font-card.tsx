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

interface FontCardProps {
  font: Design
}

export function FontCard({ font }: FontCardProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [previewText, setPreviewText] = useState('Texto de prueba')

  const isVip = font.is_vip && font.premium_url
  const showLock = isVip && !isUnlocked

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
        <div className="relative aspect-square overflow-hidden bg-muted">
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
                <Badge className="h-5 gap-1 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] text-white px-1.5 font-bold">
                  <Crown className="h-2.5 w-2.5" />
                  VIP
                </Badge>
              </div>
            )}
            <div className="absolute right-2 top-2 z-10">
              <Badge variant="outline" className="h-5 bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] px-1.5">
                <Type className="mr-1 h-2.5 w-2.5" />
                Fuente
              </Badge>
            </div>
          </Link>
        </div>

        <CardContent className="p-3">
          <Link href={`/designs/${font.slug || font.id}`} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-sm text-foreground line-clamp-1">
              {font.title}
            </h3>
          </Link>

          {/* Mini Interactive Preview Area */}
          <div className="mt-2 space-y-1.5">
            <div className="flex h-10 items-center justify-center rounded-md bg-muted/50 px-2">
              <p className="text-center text-xs text-foreground line-clamp-1" style={{ fontFamily: 'serif' }}>
                {previewText}
              </p>
            </div>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Prueba la fuente aquí..."
              className="w-full rounded border border-border bg-background px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Download className="h-2.5 w-2.5" />
              {(font.downloads || 0).toLocaleString()}
            </span>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-7 px-3 text-[10px] gap-1"
            >
              {showLock ? (
                <>
                  <Lock className="h-3 w-3" />
                  Desbloquear
                </>
              ) : (
                <>
                  <Download className="h-3 w-3" />
                  Descargar
                </>
              )}
            </Button>
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
