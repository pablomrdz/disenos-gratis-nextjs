'use client'

import { useState } from 'react'
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
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog')

  const isVip = font.is_vip && font.premium_url
  const showLock = isVip && !isUnlocked

  const handleDownload = () => {
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
        <div className="relative bg-gradient-to-br from-muted/50 to-muted p-6">
          {/* VIP Badge */}
          {isVip && (
            <Badge className="absolute left-3 top-3 gap-1 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Crown className="h-3 w-3" />
              VIP
            </Badge>
          )}
          
          {/* Font Preview */}
          <div className="flex min-h-[120px] items-center justify-center">
            <p 
              className="text-center text-3xl leading-relaxed text-foreground md:text-4xl"
              style={{ fontFamily: 'serif' }}
            >
              {previewText.slice(0, 30)}
            </p>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">
                {font.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {font.tags?.join(', ')}
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 bg-amber-500/10 text-amber-600">
              <Type className="mr-1 h-3 w-3" />
              Font
            </Badge>
          </div>

          {/* Preview text input */}
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Type to preview..."
            className="mb-3 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="h-3 w-3" />
              {font.downloads.toLocaleString()} downloads
            </span>
            <Button
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              {showLock ? (
                <>
                  <Lock className="h-4 w-4" />
                  Unlock
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download
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
