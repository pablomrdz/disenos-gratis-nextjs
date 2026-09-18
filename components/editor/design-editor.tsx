'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import * as fabric from 'fabric'
import { EditorCanvas } from './editor-canvas'
import { EditorToolbar } from './editor-toolbar'
import { EditorHeader } from './editor-header'
import { InvitationCanvas } from './invitation-canvas'
import { InvitationEditorPanel } from './invitation-editor-panel'
import { loadCustomFontFromSupabase } from '@/lib/font-loader'
import type { Design } from '@/lib/types'

// ── LocalStorage persistence helpers ────────────────────────────
const LS_PREFIX = 'dg-state-'

function getStorageKey(slug: string): string {
    return `${LS_PREFIX}${slug}`
}

function saveCanvasState(slug: string, canvas: fabric.Canvas) {
    try {
        const json = canvas.toJSON(['isPlaceholder', 'placeholderIndex', 'hasCard', 'isLoteriaCard', 'editorFieldId', 'isEditorBackground'])
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
    returnHref: string
}

export function DesignEditor({ design, returnHref }: DesignEditorProps) {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
    const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null)
    const [customFontFamily, setCustomFontFamily] = useState<string>('Arial')
    const [isFontReady, setIsFontReady] = useState<boolean>(!design.font_family) // Ready if no custom font
    const [hasSavedState, setHasSavedState] = useState(false)
    const [filledSlots, setFilledSlots] = useState(0)
    const [canvasRevision, setCanvasRevision] = useState(0)
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const slug = design.slug || design.id
    const isLoteria = design.editor_type === 'loteria' || isLoteriaSlug(design.slug)
    const isInvitation = design.editor_type === 'invitation' && Boolean(design.editor_config)
    const totalSlots = isLoteria ? 16 : undefined

    const syncFilledSlots = useCallback((currentCanvas: fabric.Canvas | null) => {
        if (!currentCanvas || !isLoteria) {
            setFilledSlots(0)
            return
        }

        const count = currentCanvas
            .getObjects()
            .filter((obj: any) => obj.isPlaceholder === true && obj.hasCard === true)
            .length

        setFilledSlots(count)
    }, [isLoteria])

    // Treat the editor as an app-sized workspace and prevent the site shell
    // from creating a second page scroll underneath it.
    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [])

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
        const handleMutation = () => {
            scheduleSave()
            syncFilledSlots(canvas)
        }

        canvas.on('object:modified', handleMutation)
        canvas.on('object:added', handleMutation)
        canvas.on('object:removed', handleMutation)

        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
            canvas.off('object:modified', handleMutation)
            canvas.off('object:added', handleMutation)
            canvas.off('object:removed', handleMutation)
        }
    }, [canvas, slug, syncFilledSlots])

    // ── Restore canvas state once canvas is ready ────────────────
    const handleCanvasReady = useCallback((c: fabric.Canvas | null) => {
        setCanvas(c)

        if (c) {
            const saved = loadCanvasState(slug)
            if (saved) {
                // loadFromJSON returns a promise in Fabric.js v6+
                c.loadFromJSON(saved).then(() => {
                    c.renderAll()
                    syncFilledSlots(c)
                    setCanvasRevision((revision) => revision + 1)
                    requestAnimationFrame(() => c.calcOffset())
                }).catch((err: unknown) => {
                    console.warn('[DesignEditor] Failed to restore state:', err)
                })
            } else {
                syncFilledSlots(c)
                setCanvasRevision((revision) => revision + 1)
            }
        }
    }, [slug, syncFilledSlots])

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
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 flex min-h-0 flex-col overflow-hidden bg-muted/30">
            {/* Top Bar */}
            <EditorHeader
                title={design.title}
                slug={slug}
                canvas={canvas}
                returnHref={returnHref}
                itemId={design.id}
                category={design.category}
                editorType={design.editor_type || 'fabric'}
                exportWidth={design.editor_config?.canvas.exportWidth}
                exportHeight={design.editor_config?.canvas.exportHeight}
                filledSlots={filledSlots}
                totalSlots={totalSlots}
                hasSavedState={hasSavedState}
                onClearState={handleClearState}
            />

            {/* Main Editor Area */}
            <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Sidebar (Toolbar) */}
                <div className="hidden w-[280px] shrink-0 overflow-hidden border-r border-border/50 md:block">
                    {isInvitation && design.editor_config ? (
                        <InvitationEditorPanel
                            canvas={canvas}
                            config={design.editor_config}
                            revision={canvasRevision}
                        />
                    ) : (
                        <EditorToolbar
                            canvas={canvas}
                            selectedObject={selectedObject}
                            onSelectionChange={handleSelectionChange}
                            defaultFontFamily={customFontFamily}
                            designSlug={design.slug}
                            designCategory={design.category}
                            isLoteria={isLoteria}
                        />
                    )}
                </div>

                {/* Canvas Area */}
                <div className="flex flex-1 flex-col min-h-0">
                    <div className="flex-1 min-h-0">
                        {isFontReady && (
                            isInvitation && design.editor_config ? (
                                <InvitationCanvas
                                    config={design.editor_config}
                                    setCanvas={handleCanvasReady}
                                    onSelectionChange={handleSelectionChange}
                                />
                            ) : (
                                <EditorCanvas
                                    imageUrl={imageUrl}
                                    fontFamily={customFontFamily}
                                    designSlug={design.slug}
                                    editorType={design.editor_type}
                                    setCanvas={handleCanvasReady}
                                    onSelectionChange={handleSelectionChange}
                                />
                            )
                        )}
                        {!isFontReady && (
                            <div className="flex items-center justify-center h-full text-muted-foreground w-full bg-muted/20 animate-pulse rounded-xl border border-border/50">
                                Cargando editor con fuente personalizada...
                            </div>
                        )}
                    </div>

                    {/* Mobile Toolbar (Bottom Sheet style) */}
                    <div className="block border-t border-border/50 md:hidden">
                        <div className="max-h-[36vh] overflow-y-auto">
                            {isInvitation && design.editor_config ? (
                                <InvitationEditorPanel
                                    canvas={canvas}
                                    config={design.editor_config}
                                    revision={canvasRevision}
                                />
                            ) : (
                                <EditorToolbar
                                    canvas={canvas}
                                    selectedObject={selectedObject}
                                    onSelectionChange={handleSelectionChange}
                                    defaultFontFamily={customFontFamily}
                                    designSlug={design.slug}
                                    designCategory={design.category}
                                    isLoteria={isLoteria}
                                />
                            )}
                        </div>
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
