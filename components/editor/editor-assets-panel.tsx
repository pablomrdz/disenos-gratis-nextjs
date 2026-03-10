'use client'

import { useState, useEffect, useCallback } from 'react'
import * as fabric from 'fabric'
import { Loader2, ImageOff } from 'lucide-react'

interface AssetFile {
    name: string
    url: string
}

interface EditorAssetsPanelProps {
    canvas: fabric.Canvas | null
    designSlug: string
    designCategory: string
    selectedObject: fabric.FabricObject | null
}

/**
 * Finds the best matching bucket folder for the current design.
 */
async function discoverFolder(designSlug: string, categorySlug: string): Promise<string | null> {
    try {
        const res = await fetch('/api/template-assets?folder=__list__')
        if (!res.ok) return categorySlug

        const data = await res.json()
        const folders: string[] = data.folders || []

        if (folders.length === 0) return null

        const slugNormalized = designSlug
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()

        const sortedFolders = [...folders].sort((a, b) => b.length - a.length)

        for (const folder of sortedFolders) {
            const folderNormalized = folder
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/\s+/g, '-')

            if (slugNormalized.includes(folderNormalized)) {
                return folder
            }
        }

        if (folders.includes(categorySlug)) {
            return categorySlug
        }

        return null
    } catch {
        return categorySlug
    }
}

export function EditorAssetsPanel({ canvas, designSlug, designCategory, selectedObject }: EditorAssetsPanelProps) {
    const [assets, setAssets] = useState<AssetFile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [addingAsset, setAddingAsset] = useState<string | null>(null)
    const [matchedFolder, setMatchedFolder] = useState<string | null>(null)

    // Check if the currently selected object is a placeholder
    const isPlaceholderSelected = !!(selectedObject && (selectedObject as any).isPlaceholder)

    useEffect(() => {
        setIsLoading(true)
        setError(null)

        const categorySlug = (designCategory || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')

        discoverFolder(designSlug, categorySlug)
            .then(folder => {
                if (!folder) {
                    setAssets([])
                    setIsLoading(false)
                    return
                }

                setMatchedFolder(folder)

                return fetch(`/api/template-assets?folder=${encodeURIComponent(folder)}`)
                    .then(res => {
                        if (!res.ok) throw new Error('Error al obtener los elementos')
                        return res.json()
                    })
                    .then(data => {
                        setAssets(data.files || [])
                    })
            })
            .catch(err => {
                console.error('[EditorAssetsPanel]', err)
                setError('No se pudieron cargar los elementos')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [designSlug, designCategory])

    const addAssetToCanvas = useCallback(async (asset: AssetFile) => {
        if (!canvas) return

        setAddingAsset(asset.name)

        try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(asset.url)}`
            const img = await fabric.FabricImage.fromURL(proxyUrl, { crossOrigin: 'anonymous' })

            // Lock proportions on all added images
            img.set({
                selectable: true,
                hasControls: true,
                hasBorders: true,
                crossOrigin: 'anonymous',
                lockUniScaling: true,
            })

            // Smart Replacement: if a placeholder is selected, snap to its position
            const activeObj = canvas.getActiveObject()
            if (activeObj && (activeObj as any).isPlaceholder) {
                // Calculate cell dimensions from the fixed artboard size (not viewport)
                const COLS = 4
                const ROWS = 4
                const ARTBOARD_W = 800
                const ARTBOARD_H = 1120
                const PAD = 2
                const cellW = (ARTBOARD_W - PAD * 2) / COLS
                const cellH = (ARTBOARD_H - PAD * 2) / ROWS

                const idx = (activeObj as any).placeholderIndex ?? 0
                const col = idx % COLS
                const row = Math.floor(idx / COLS)

                const cellLeft = PAD + col * cellW
                const cellTop = PAD + row * cellH

                // Stretch image to fill the cell completely
                img.set({
                    left: cellLeft,
                    top: cellTop,
                    scaleX: cellW / (img.width ?? 1),
                    scaleY: cellH / (img.height ?? 1),
                    lockUniScaling: false, // allow independent scaling for cell fill
                })

                // Remove the placeholder
                canvas.remove(activeObj)
                canvas.discardActiveObject()

                canvas.add(img)
                canvas.bringObjectToFront(img)
                canvas.setActiveObject(img)
                canvas.renderAll()
            } else {
                // Default behavior: scale to max 150px and center
                const MAX_WIDTH = 150
                if (img.width && img.width > MAX_WIDTH) {
                    img.scaleToWidth(MAX_WIDTH)
                }

                canvas.add(img)
                canvas.centerObject(img)
                canvas.bringObjectToFront(img)
                canvas.setActiveObject(img)
                canvas.renderAll()
            }
        } catch (err) {
            console.error('[EditorAssetsPanel] Failed to add asset:', err)
        } finally {
            setAddingAsset(null)
        }
    }, [canvas])

    // ── Loading skeleton ────────────────────────────────
    if (isLoading) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Cargando elementos...
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square animate-pulse rounded-xl bg-muted/60 border border-border/30"
                        />
                    ))}
                </div>
            </div>
        )
    }

    // ── Error state ─────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <ImageOff className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{error}</p>
            </div>
        )
    }

    // ── Empty state ─────────────────────────────────────
    if (assets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <ImageOff className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                    No hay elementos disponibles para esta plantilla
                </p>
            </div>
        )
    }

    // ── Grid of thumbnails ──────────────────────────────
    return (
        <div className="space-y-3">
            {/* Smart replace hint */}
            {isPlaceholderSelected ? (
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-2.5 text-center">
                    <p className="text-[11px] font-medium text-primary">
                        📍 Placeholder seleccionado
                    </p>
                    <p className="text-[10px] text-primary/70 mt-0.5">
                        Haz clic en una carta para colocarla automáticamente
                    </p>
                </div>
            ) : (
                <p className="text-[11px] text-muted-foreground text-center">
                    Selecciona un placeholder en el lienzo, luego haz clic en una carta
                    {matchedFolder && (
                        <span className="block mt-0.5 text-primary/70 font-medium capitalize">
                            📁 {matchedFolder}
                        </span>
                    )}
                </p>
            )}
            <div className="grid grid-cols-2 gap-2">
                {assets.map(asset => (
                    <button
                        key={asset.name}
                        onClick={() => addAssetToCanvas(asset)}
                        disabled={addingAsset === asset.name}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted/30 transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
                        title={asset.name.replace(/\.[^.]+$/, '')}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={asset.url}
                            alt={asset.name.replace(/\.[^.]+$/, '')}
                            className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105"
                            loading="lazy"
                        />

                        {/* Loading overlay */}
                        {addingAsset === asset.name && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        )}

                        {/* Name label */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-4">
                            <span className="block truncate text-[10px] font-medium text-white">
                                {asset.name.replace(/\.[^.]+$/, '')}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
