'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Download,
  ExternalLink,
  Loader2,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AdUnit from '@/components/AdUnit'
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

export function DownloadSection({ design }: DownloadSectionProps) {
  const [phase, setPhase] = useState<DownloadPhase>('idle')
  const [progress, setProgress] = useState(0)

  // ── SECURITY: URL stored in ref, never rendered in DOM ────────
  const downloadUrlRef = useRef<string | null>(null)
  const analyticsLoggedRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Resolve the download URL once on mount (kept out of DOM)
  useEffect(() => {
    const externalLink = extractDriveLink(design.description || '')
    downloadUrlRef.current = externalLink || design.download_url || design.external_url || null
  }, [design])

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
  }, [phase, logDownloadStat])

  // ── Execute final download ────────────────────────────────────
  const executeDownload = useCallback(() => {
    const url = downloadUrlRef.current

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  // ── Render helpers ────────────────────────────────────────────
  const getProgressText = () => {
    if (progress < 20) return 'Iniciando descarga...'
    if (progress < 50) return `Preparando archivos... ${progress}%`
    if (progress < 80) return `Preparando descarga... ${progress}%`
    if (progress < 100) return `Casi listo... ${progress}%`
    return '¡Listo!'
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-muted/50">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* ── Left info ──────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Descarga Gratis
              </h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {phase === 'ready'
                ? '¡Tu descarga está lista!'
                : phase === 'loading'
                  ? getProgressText()
                  : 'Haz clic para descargar este diseño'
              }
            </p>
          </div>

          {/* ── Right CTA ──────────────────────────────────── */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                <div className="space-y-4 flex flex-col items-center">
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

            {/* Personalizar y Descargar CTA */}
            {(design.category === 'Plantillas' || (design.slug && design.slug.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('loteria'))) && (
              <Link href={`/edit/${design.slug || design.id}`}>
                <Button
                  size="lg"
                  className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] transition-all text-base font-bold px-6"
                >
                  <Pencil className="h-5 w-5" />
                  Personalizar y Descargar Gratis
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* AdSync Ad Unit permanently mounted */}
        <div
          className={`w-full mt-8 min-h-[250px] flex justify-center transition-opacity duration-500 ${
            phase === 'ready' ? 'opacity-100' : 'opacity-0 h-[250px] overflow-hidden'
          }`}
        >
          <AdUnit
            slot="1352493197"
            format="fluid"
            layoutKey="-fb+5w+4e-db+86"
            style={{ display: "block" }}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
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
