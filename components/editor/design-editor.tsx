'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import * as fabric from 'fabric'
import { EditorCanvas } from './editor-canvas'
import { EditorToolbar } from './editor-toolbar'
import { EditorHeader } from './editor-header'
import { loadCustomFontFromSupabase } from '@/lib/font-loader'
import { AdUnit } from '@/components/AdUnit'
import type { Design } from '@/lib/types'

// ── LocalStorage persistence helpers ────────────────────────────
const LS_PREFIX = 'dg-state-'

function getStorageKey(slug: string): string {
    return `${LS_PREFIX}${slug}`
}

function saveCanvasState(slug: string, canvas: fabric.Canvas) {
    try {
        const json = canvas.toJSON(['isPlaceholder', 'placeholderIndex', 'hasCard'])
        localStorage.setItem(getStorageKey(slug), JSON.stringify(json))
    } catch (err) {
        console.warn('[DesignEditor] Failed to save state:', err)
    }
}

function loadCanvasState(slug: string): object | null {
    try {
        const raw = localStorage.getItem(getStorageKey(slug))
        if (raw) return JSON.parse(raw)
    } catch {
        // Ignore corrupt data
    }
    return null
}

function clearCanvasState(slug: string) {
    try {
        localStorage.removeItem(getStorageKey(slug))
    } catch {
        // Ignore
    }
}

interface DesignEditorProps {
    design: Design
}

export function DesignEditor({ design }: DesignEditorProps) {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
    const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null)
    const [customFontFamily, setCustomFontFamily] = useState<string>('Arial')
    const [isFontReady, setIsFontReady] = useState<boolean>(!design.font_family) // Ready if no custom font
    const [hasSavedState, setHasSavedState] = useState(false)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const slug = design.slug || design.id

    // Load custom font
    useEffect(() => {
        if (design.font_family) {
            loadCustomFontFromSupabase(design.font_family).then((loadedFont) => {
                setCustomFontFamily(loadedFont)
                setIsFontReady(true)
            })
        }
    }, [design.font_family])

    // Check if a saved state exists on mount
    useEffect(() => {
        setHasSavedState(!!loadCanvasState(slug))
    }, [slug])

    // ── Debounced auto-save (2 seconds) ─────────────────────────
    useEffect(() => {
        if (!canvas) return

        const scheduleSave = () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
            debounceTimerRef.current = setTimeout(() => {
                saveCanvasState(slug, canvas)
                setHasSavedState(true)
            }, 2000)
        }

        // Listen to all meaningful canvas mutations
        canvas.on('object:modified', scheduleSave)
        canvas.on('object:added', scheduleSave)
        canvas.on('object:removed', scheduleSave)

        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
            canvas.off('object:modified', scheduleSave)
            canvas.off('object:added', scheduleSave)
            canvas.off('object:removed', scheduleSave)
        }
    }, [canvas, slug])

    // ── Restore canvas state once canvas is ready ────────────────
    const handleCanvasReady = useCallback((c: fabric.Canvas | null) => {
        setCanvas(c)

        if (c) {
            const saved = loadCanvasState(slug)
            if (saved) {
                // loadFromJSON returns a promise in Fabric.js v6+
                c.loadFromJSON(saved).then(() => {
                    c.renderAll()
                    // Recalculate offset after restore
                    requestAnimationFrame(() => c.calcOffset())
                }).catch((err: unknown) => {
                    console.warn('[DesignEditor] Failed to restore state:', err)
                })
            }
        }
    }, [slug])

    const handleSelectionChange = useCallback((obj: fabric.FabricObject | null) => {
        setSelectedObject(obj)
    }, [])

    const handleClearState = useCallback(() => {
        clearCanvasState(slug)
        setHasSavedState(false)
        // Reload page to get fresh canvas
        window.location.reload()
    }, [slug])

    const imageUrl = design.image_url || design.thumbnail_url || '/placeholder.svg'

    return (
        <div className="flex h-[100dvh] flex-col bg-muted/30">
            {/* Top Bar */}
            <EditorHeader
                title={design.title}
                slug={slug}
                canvas={canvas}
                hasSavedState={hasSavedState}
                onClearState={handleClearState}
            />

            {/* Desktop Ad Banner — 728x90 leaderboard, above the editor workspace */}
            <div className="hidden md:flex items-center justify-center border-b border-border/30 bg-muted/20 py-1" style={{ minHeight: 94 }}>
                <AdUnit
                    slot="9549519747"
                    format="auto"
                    style={{ display: "inline-block", width: "728px", height: "90px" }}
                />
            </div>

            {/* Main Editor Area */}
            <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Sidebar (Toolbar) */}
                <div className="hidden w-[260px] shrink-0 md:block">
                    <EditorToolbar
                        canvas={canvas}
                        selectedObject={selectedObject}
                        onSelectionChange={handleSelectionChange}
                        defaultFontFamily={customFontFamily}
                        designSlug={design.slug}
                        designCategory={design.category}
                        isLoteria={isLoteriaSlug(design.slug)}
                    />
                </div>

                {/* Canvas Area */}
                <div className="flex flex-1 flex-col min-h-0">
                    <div className="flex-1 min-h-0">
                        {isFontReady && (
                            <EditorCanvas
                                imageUrl={imageUrl}
                                fontFamily={customFontFamily}
                                designSlug={design.slug}
                                setCanvas={handleCanvasReady}
                                onSelectionChange={handleSelectionChange}
                            />
                        )}
                        {!isFontReady && (
                            <div className="flex items-center justify-center h-full text-muted-foreground w-full bg-muted/20 animate-pulse rounded-xl border border-border/50">
                                Cargando editor con fuente personalizada...
                            </div>
                        )}
                    </div>

                    {/* Mobile Toolbar (Bottom Sheet style) */}
                    <div className="block border-t border-border/50 md:hidden">
                        <div className="max-h-[40vh] overflow-y-auto">
                            <EditorToolbar
                                canvas={canvas}
                                selectedObject={selectedObject}
                                onSelectionChange={handleSelectionChange}
                                defaultFontFamily={customFontFamily}
                                designSlug={design.slug}
                                designCategory={design.category}
                                isLoteria={isLoteriaSlug(design.slug)}
                            />
                        </div>
                    </div>

                    {/* Mobile Ad Banner — 320x50 fixed at bottom */}
                    <div className="flex md:hidden items-center justify-center border-t border-border/30 bg-muted/20 py-1 shrink-0" style={{ minHeight: 54 }}>
                        <AdUnit
                            slot="6765960189"
                            format="auto"
                            style={{ display: "inline-block", width: "320px", height: "50px" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Helper to detect lotería templates
function isLoteriaSlug(slug?: string): boolean {
    if (!slug) return false
    return slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes('loteria')
}
