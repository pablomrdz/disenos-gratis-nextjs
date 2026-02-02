'use client'

import { useState } from 'react'
import { Check, Copy, Twitter, Facebook, Linkedin, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { Design } from '@/lib/types'

interface ShareToUnlockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  design: Design
  onUnlock: () => void
}

export function ShareToUnlockModal({
  open,
  onOpenChange,
  design,
  onUnlock,
}: ShareToUnlockModalProps) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/designs/${design.slug || design.id}` 
    : ''
  const shareText = `Check out this amazing design: ${design.title || 'Untitled Design'}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    handleShare()
  }

  const handleShare = () => {
    setShared(true)
    setTimeout(() => {
      onUnlock()
    }, 1000)
  }

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#4267B2]/10 hover:text-[#4267B2]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#0077B5]/10 hover:text-[#0077B5]',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'hover:bg-[#25D366]/10 hover:text-[#25D366]',
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share to Unlock VIP Content</DialogTitle>
          <DialogDescription className="text-center">
            Share this design on social media to unlock the premium download link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Share buttons */}
          <div className="flex justify-center gap-3">
            {shareLinks.map((link) => (
              <Button
                key={link.name}
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full transition-colors ${link.color}`}
                onClick={() => {
                  window.open(link.url, '_blank', 'width=600,height=400')
                  handleShare()
                }}
              >
                <link.icon className="h-5 w-5" />
                <span className="sr-only">Share on {link.name}</span>
              </Button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or copy link
              </span>
            </div>
          </div>

          {/* Copy link */}
          <div className="flex gap-2">
            <Input
              value={shareUrl}
              readOnly
              className="bg-muted/50"
            />
            <Button
              variant="secondary"
              className="shrink-0 gap-2"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Success message */}
          {shared && (
            <div className="rounded-lg bg-emerald-500/10 p-3 text-center text-sm text-emerald-600">
              <Check className="mx-auto mb-1 h-5 w-5" />
              Thank you for sharing! Unlocking content...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
