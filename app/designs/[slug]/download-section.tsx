'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Download,
  ExternalLink,
  Crown,
  Lock,
  Share2,
  Check,
  MessageCircle,
  Loader2,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShareToUnlockModal } from '@/components/share-to-unlock-modal'
import { createClient } from '@supabase/supabase-js'
import type { Design } from '@/lib/types'

// ── Supabase client (client-side) ───────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// ── Duration config ─────────────────────────────────────────────
const WAIT_DURATION_MS = 5000
const TICK_INTERVAL_MS = 50

interface DownloadSectionProps {
  design: Design
  isVip: boolean
}

type DownloadPhase = 'idle' | 'loading' | 'ready'

export function DownloadSection({ design, isVip }: DownloadSectionProps) {
  const [phase, setPhase] = useState<DownloadPhase>('idle')
  const [progress, setProgress] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // ── SECURITY: URL stored in ref, never rendered in DOM ────────
  const downloadUrlRef = useRef<string | null>(null)
  const analyticsLoggedRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Resolve the download URL once on mount (kept out of DOM)
  useEffect(() => {
    const externalLink = extractDriveLink(design.description || '')
    downloadUrlRef.current = externalLink || design.download_url || design.external_url || null
  }, [design])

  // Check localStorage for VIP unlock status
  useEffect(() => {
    try {
      const unlockedDesigns = JSON.parse(localStorage.getItem('unlockedDesigns') || '[]')
      if (unlockedDesigns.includes(design.id)) {
        setIsUnlocked(true)
      }
    } catch {
      // Ignore parse errors
    }
  }, [design.id])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // ── Analytics: insert into downloads_stats ────────────────────
  const logDownloadStat = useCallback(async () => {
    if (analyticsLoggedRef.current) return
    analyticsLoggedRef.current = true

    try {
      await supabaseClient.from('downloads_stats').insert({
        design_id: design.id,
        category: design.category || 'general',
      })
    } catch (err) {
      console.error('[Download] Analytics error:', err)
    }
  }, [design.id, design.category])

  // ── Start the 5-second loading sequence ───────────────────────
  const startDownloadSequence = useCallback(() => {
    if (phase !== 'idle') return

    // VIP gate
    if (isVip && !isUnlocked) {
      setShowShareModal(true)
      return
    }

    setPhase('loading')
    setProgress(0)
    analyticsLoggedRef.current = false

    const startTime = Date.now()

    // Log analytics early in the sequence
    logDownloadStat()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(Math.round((elapsed / WAIT_DURATION_MS) * 100), 100)
      setProgress(pct)

      if (elapsed >= WAIT_DURATION_MS) {
        if (timerRef.current) clearInterval(timerRef.current)
        setProgress(100)
        setPhase('ready')
      }
    }, TICK_INTERVAL_MS)
  }, [phase, isVip, isUnlocked, logDownloadStat])

  // ── Execute final download ────────────────────────────────────
  const executeDownload = useCallback(() => {
    const url = isVip && isUnlocked && design.premium_url
      ? design.premium_url
      : downloadUrlRef.current

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [isVip, isUnlocked, design.premium_url])

  // ── VIP unlock handler ────────────────────────────────────────
  const handleUnlock = () => {
    try {
      const unlockedDesigns = JSON.parse(localStorage.getItem('unlockedDesigns') || '[]')
      if (!unlockedDesigns.includes(design.id)) {
        unlockedDesigns.push(design.id)
        localStorage.setItem('unlockedDesigns', JSON.stringify(unlockedDesigns))
      }
    } catch {
      // Ignore
    }
    setIsUnlocked(true)
    setShowShareModal(false)
  }

  const handleWhatsAppShare = () => {
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/designs/${design.slug || design.id}`
      : ''
    const shareText = `¡Mira este diseño increíble! ${design.title || 'Diseño Gratis'}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
    window.open(whatsappUrl, '_blank', 'width=600,height=400')
    setTimeout(() => handleUnlock(), 1000)
  }

  // ── Render helpers ────────────────────────────────────────────
  const designType = design.type || 'internal'

  const getProgressText = () => {
    if (progress < 20) return 'Iniciando descarga...'
    if (progress < 50) return `Preparando archivos... ${progress}%`
    if (progress < 80) return `Preparando descarga... ${progress}%`
    if (progress < 100) return `Casi listo... ${progress}%`
    return '¡Listo!'
  }

  return (
    <>
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-muted/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* ── Left info ──────────────────────────────────── */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {isVip ? 'Descarga VIP' : 'Descarga Gratis'}
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
                    Desbloqueado
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {isVip && !isUnlocked
                  ? 'Comparte este diseño en redes sociales para desbloquear la descarga'
                  : phase === 'ready'
                    ? '¡Tu descarga está lista!'
                    : phase === 'loading'
                      ? getProgressText()
                      : 'Haz clic para descargar este diseño'
                }
              </p>
            </div>

            {/* ── Right CTA ──────────────────────────────────── */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {isVip && !isUnlocked ? (
                <>
                  <Button
                    size="lg"
                    className="gap-2 bg-[#25D366] text-white hover:bg-[#25D366]/90"
                    onClick={handleWhatsAppShare}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Compartir en WhatsApp
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="h-5 w-5" />
                    Más Opciones
                  </Button>
                </>
              ) : (
                <div className="w-full min-w-[240px] sm:w-auto">
                  {/* ── Phase: IDLE ──────────────────────────── */}
                  {phase === 'idle' && (
                    <button
                      onClick={startDownloadSequence}
                      className="
                        group relative w-full overflow-hidden rounded-xl
                        bg-gradient-to-r from-emerald-500 to-teal-500
                        px-8 py-3.5 font-semibold text-white
                        shadow-lg shadow-emerald-500/25
                        transition-all duration-300
                        hover:shadow-xl hover:shadow-emerald-500/30
                        hover:scale-[1.02]
                        active:scale-[0.98]
                      "
                    >
                      {/* Shimmer effect */}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative flex items-center justify-center gap-2">
                        <Download className="h-5 w-5" />
                        Descargar
                      </span>
                    </button>
                  )}

                  {/* ── Phase: LOADING (progress bar) ────────── */}
                  {phase === 'loading' && (
                    <div className="space-y-2">
                      <button
                        disabled
                        className="
                          relative w-full cursor-not-allowed overflow-hidden rounded-xl
                          bg-gray-700 px-8 py-3.5 font-semibold text-white/80
                        "
                      >
                        {/* Animated progress fill */}
                        <span
                          className="
                            absolute inset-y-0 left-0
                            bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
                            transition-all duration-200 ease-out
                          "
                          style={{ width: `${progress}%` }}
                        />
                        {/* Pulse glow on the leading edge */}
                        <span
                          className="
                            absolute inset-y-0 w-8
                            bg-gradient-to-r from-transparent to-white/20
                            animate-pulse
                          "
                          style={{ left: `calc(${Math.min(progress, 95)}% - 16px)` }}
                        />
                        <span className="relative flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          {getProgressText()}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* ── Phase: READY ─────────────────────────── */}
                  {phase === 'ready' && (
                    <button
                      onClick={executeDownload}
                      className="
                        group relative w-full overflow-hidden rounded-xl
                        px-8 py-3.5 font-semibold text-white
                        shadow-lg transition-all duration-300
                        hover:shadow-xl hover:scale-[1.02]
                        active:scale-[0.98]
                        animate-in fade-in-0 zoom-in-95 duration-500
                      "
                      style={{
                        backgroundColor: '#4dd06a',
                        boxShadow: '0 10px 25px -5px rgba(77, 208, 106, 0.3)',
                      }}
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative flex items-center justify-center gap-2">
                        ✅ Descargar Ahora
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* Edit Design Button */}
              <Link href={`/edit/${design.slug || design.id}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-xl border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"
                >
                  <Pencil className="h-5 w-5" />
                  Editar Diseño
                </Button>
              </Link>
            </div>
          </div>

          {/* ── VIP Benefits ─────────────────────────────────── */}
          {isVip && !isUnlocked && (
            <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <h4 className="flex items-center gap-2 font-medium text-foreground">
                <Crown className="h-4 w-4 text-amber-500" />
                Beneficios Premium:
              </h4>
              <ul className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Archivos en resolución completa
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Todas las capas editables
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Licencia comercial
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Acceso a contenido exclusivo
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

// ── Helper: extract drive/mega links from content ───────────────
function extractDriveLink(content: string): string | null {
  const driveRegex = /https?:\/\/(?:drive\.google\.com|docs\.google\.com)\/[^\s<>"]+/i
  const driveMatch = content.match(driveRegex)
  if (driveMatch) return driveMatch[0]

  const megaRegex = /https?:\/\/mega\.nz\/[^\s<>"]+/i
  const megaMatch = content.match(megaRegex)
  if (megaMatch) return megaMatch[0]

  const dropboxRegex = /https?:\/\/(?:www\.)?dropbox\.com\/[^\s<>"]+/i
  const dropboxMatch = content.match(dropboxRegex)
  if (dropboxMatch) return dropboxMatch[0]

  return null
}
