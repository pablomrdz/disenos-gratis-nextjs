'use client'

import { useState, useEffect } from 'react'
import { 
  Download, 
  ExternalLink, 
  Crown, 
  Lock, 
  Share2,
  Check,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShareToUnlockModal } from '@/components/share-to-unlock-modal'
import type { Design } from '@/lib/types'

interface DownloadSectionProps {
  design: Design
  isVip: boolean
}

export function DownloadSection({ design, isVip }: DownloadSectionProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Check localStorage for unlock status
  useEffect(() => {
    const unlockedDesigns = JSON.parse(localStorage.getItem('unlockedDesigns') || '[]')
    if (unlockedDesigns.includes(design.id)) {
      setIsUnlocked(true)
    }
  }, [design.id])

  const handleUnlock = () => {
    const unlockedDesigns = JSON.parse(localStorage.getItem('unlockedDesigns') || '[]')
    if (!unlockedDesigns.includes(design.id)) {
      unlockedDesigns.push(design.id)
      localStorage.setItem('unlockedDesigns', JSON.stringify(unlockedDesigns))
    }
    setIsUnlocked(true)
    setShowShareModal(false)
  }

  const handleDownload = () => {
    if (isVip && !isUnlocked) {
      setShowShareModal(true)
      return
    }

    // Use premium_url if VIP and unlocked, otherwise use regular URLs
    const downloadUrl = isVip && isUnlocked && design.premium_url
      ? design.premium_url
      : design.external_url || design.download_url

    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  const handleWhatsAppShare = () => {
    const shareUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/designs/${design.slug || design.id}` 
      : ''
    const shareText = `Check out this amazing design: ${design.title || 'Untitled Design'}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    
    window.open(whatsappUrl, '_blank', 'width=600,height=400')
    
    // Unlock after sharing
    setTimeout(() => {
      handleUnlock()
    }, 1000)
  }

  const designType = design.type || 'internal'
  
  const getButtonLabel = () => {
    if (isVip && !isUnlocked) {
      return 'Share to Unlock'
    }
    
    if (design.external_url) {
      if (designType === 'canva') return 'Open in Canva'
      if (designType === 'capcut') return 'Open in CapCut'
      return 'Open External Link'
    }
    
    return 'Download Now'
  }

  const getButtonIcon = () => {
    if (isVip && !isUnlocked) {
      return <Lock className="h-5 w-5" />
    }
    if (design.external_url) {
      return <ExternalLink className="h-5 w-5" />
    }
    return <Download className="h-5 w-5" />
  }

  return (
    <>
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-muted/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {isVip ? 'VIP Download' : 'Free Download'}
                </h3>
                {isVip && (
                  <Badge className="gap-1 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
                {isVip && isUnlocked && (
                  <Badge variant="outline" className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
                    <Check className="h-3 w-3" />
                    Unlocked
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {isVip && !isUnlocked 
                  ? 'Share this design on social media to unlock the premium download'
                  : design.external_url 
                    ? `Opens in ${designType === 'canva' ? 'Canva' : designType === 'capcut' ? 'CapCut' : 'new tab'}`
                    : 'Click to download this design to your device'
                }
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {isVip && !isUnlocked ? (
                <>
                  {/* WhatsApp Share Button - Primary CTA */}
                  <Button 
                    size="lg" 
                    className="gap-2 bg-[#25D366] text-white hover:bg-[#25D366]/90"
                    onClick={handleWhatsAppShare}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Share on WhatsApp
                  </Button>
                  
                  {/* Other Share Options */}
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="h-5 w-5" />
                    More Options
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={handleDownload}
                >
                  {getButtonIcon()}
                  {getButtonLabel()}
                </Button>
              )}
            </div>
          </div>

          {/* VIP Benefits */}
          {isVip && !isUnlocked && (
            <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <h4 className="flex items-center gap-2 font-medium text-foreground">
                <Crown className="h-4 w-4 text-amber-500" />
                VIP Benefits Include:
              </h4>
              <ul className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Full resolution files
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  All editable layers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Commercial license
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Priority support
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share to Unlock Modal */}
      <ShareToUnlockModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        design={design}
        onUnlock={handleUnlock}
      />
    </>
  )
}
