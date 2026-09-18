'use client'

import { useState, useEffect, useCallback } from 'react'
import * as fabric from 'fabric'
import { Loader2, ImageOff, Shuffle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface AssetFile {
    name: string
    url: string
}

interface EditorAssetsPanelProps {
    canvas: fabric.Canvas | null
    designSlug: string
    designCategory: string
    selectedObject: fabric.FabricObject | null
    isLoteria?: boolean
}

async function discoverFolder(
    designSlug: string,
    categorySlug: string
): Promise<string | null> {
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

            if (slugNormalized.includes(folderNormalized)) return folder
        }

        if (folders.includes(categorySlug)) return categorySlug

        return null
    } catch {
        return categorySlug
    }
}

export function EditorAssetsPanel({
    canvas,
    designSlug,
    designCategory,
    selectedObject,
    isLoteria = false,
}: EditorAssetsPanelProps) {
    const [assets, setAssets] = useState<AssetFile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [addingAsset, setAddingAsset] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [matchedFolder, setMatchedFolder] = useState<string | null>(null)

    const isPlaceholderSelected = Boolean(
        selectedObject && (selectedObject as any).isPlaceholder
    )

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
            .then((folder) => {
                if (!folder) {
                    setAssets([])
                    setIsLoading(false)
                    return
                }

                setMatchedFolder(folder)

                return fetch(
                    `/api/template-assets?folder=${encodeURIComponent(folder)}`
                )
                    .then((res) => {
                        if (!res.ok) throw new Error('Error al obtener los elementos')
                        return res.json()
                    })
                    .then((data) => {
                        setAssets(data.files || [])
                    })
            })
            .catch((err) => {
                console.error('[EditorAssetsPanel]', err)
                setError('No se pudieron cargar los elementos')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [designSlug, designCategory])

    const loadAssetImage = useCallback(async (asset: AssetFile) => {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(asset.url)}`

        return fabric.FabricImage.fromURL(proxyUrl, {
            crossOrigin: 'anonymous',
        })
    }, [])

    const placeOnPlaceholder = useCallback(
        (
            img: fabric.FabricImage,
            targetPlaceholder: fabric.FabricObject,
            activate = true
        ) => {
            if (!canvas) return

            img.set({
                selectable: true,
                hasControls: true,
                hasBorders: true,
                crossOrigin: 'anonymous',
                lockUniScaling: false,
                originX: 'left',
                originY: 'top',
                left: targetPlaceholder.left,
                top: targetPlaceholder.top,
                scaleX: targetPlaceholder.width! / img.width!,
                scaleY: targetPlaceholder.height! / img.height!,
            })

            const placeholderIndex = (targetPlaceholder as any).placeholderIndex
            ;(img as any).isLoteriaCard = true
            ;(img as any).placeholderIndex = placeholderIndex
            ;(targetPlaceholder as any).hasCard = true

            canvas.add(img)
            canvas.bringObjectToFront(img)

            if (activate) {
                canvas.discardActiveObject()
                canvas.setActiveObject(img)
            }
        },
        [canvas]
    )

    const addAssetToCanvas = useCallback(
        async (asset: AssetFile) => {
            if (!canvas || isGenerating) return

            setAddingAsset(asset.name)

            try {
                const img = await loadAssetImage(asset)
                const placeholders = canvas
                    .getObjects()
                    .filter((obj: any) => obj.isPlaceholder === true)

                const hasLoteriaGrid = placeholders.length > 0
                const activeObj = canvas.getActiveObject()

                let targetPlaceholder: fabric.FabricObject | undefined

                if (
                    activeObj &&
                    (activeObj as any).isPlaceholder &&
                    !(activeObj as any).hasCard
                ) {
                    targetPlaceholder = activeObj
                } else {
                    targetPlaceholder = placeholders.find(
                        (obj: any) => obj.hasCard === false
                    )
                }

                if (targetPlaceholder) {
                    placeOnPlaceholder(img, targetPlaceholder)
                    canvas.renderAll()
                    return
                }

                if (hasLoteriaGrid) {
                    toast.info('La tabla ya tiene sus 16 espacios ocupados.')
                    return
                }

                const MAX_WIDTH = 150
                if (img.width && img.width > MAX_WIDTH) {
                    img.scaleToWidth(MAX_WIDTH)
                }

                img.set({
                    selectable: true,
                    hasControls: true,
                    hasBorders: true,
                    crossOrigin: 'anonymous',
                    lockUniScaling: true,
                })

                canvas.add(img)
                canvas.centerObject(img)
                canvas.bringObjectToFront(img)
                canvas.setActiveObject(img)
                canvas.renderAll()
            } catch (err) {
                console.error('[EditorAssetsPanel] Failed to add asset:', err)
                toast.error('No se pudo cargar esta imagen.')
            } finally {
                setAddingAsset(null)
            }
        },
        [canvas, isGenerating, loadAssetImage, placeOnPlaceholder]
    )

    const generateRandomBoard = useCallback(async () => {
        if (!canvas || !isLoteria || assets.length < 16) return

        const placeholders = canvas
            .getObjects()
            .filter((obj: any) => obj.isPlaceholder === true)
            .sort(
                (a: any, b: any) =>
                    (a.placeholderIndex ?? 0) - (b.placeholderIndex ?? 0)
            )

        if (placeholders.length !== 16) {
            toast.error('No se encontró la cuadrícula completa de 16 espacios.')
            return
        }

        setIsGenerating(true)

        try {
            canvas.discardActiveObject()

            canvas
                .getObjects()
                .filter((obj: any) => obj.isLoteriaCard === true)
                .forEach((obj) => canvas.remove(obj))

            placeholders.forEach((placeholder: any) => {
                placeholder.hasCard = false
            })

            const selection = [...assets]
                .sort(() => Math.random() - 0.5)
                .slice(0, 16)

            for (let index = 0; index < selection.length; index += 1) {
                const img = await loadAssetImage(selection[index])
                placeOnPlaceholder(img, placeholders[index], false)
            }

            canvas.discardActiveObject()
            canvas.renderAll()
            toast.success('Tabla aleatoria lista: 16 cartas sin repetir.')
        } catch (err) {
            console.error('[EditorAssetsPanel] Random board failed:', err)
            toast.error('No se pudo generar la tabla. Intenta de nuevo.')
        } finally {
            setIsGenerating(false)
        }
    }, [assets, canvas, isLoteria, loadAssetImage, placeOnPlaceholder])

    if (isLoading) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Cargando elementos...
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-square animate-pulse rounded-xl border border-border/30 bg-muted/60"
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <ImageOff className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{error}</p>
            </div>
        )
    }

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

    return (
        <div className="space-y-3">
            {isLoteria && (
                <Button
                    type="button"
                    onClick={generateRandomBoard}
                    disabled={!canvas || isGenerating || assets.length < 16}
                    className="w-full gap-2 rounded-xl"
                    variant="outline"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Shuffle className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Generando tabla...' : 'Generar tabla aleatoria'}
                </Button>
            )}

            {isPlaceholderSelected ? (
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-2.5 text-center">
                    <p className="text-[11px] font-medium text-primary">
                        📍 Espacio seleccionado
                    </p>
                    <p className="mt-0.5 text-[10px] text-primary/70">
                        Haz clic en una carta para colocarla aquí
                    </p>
                </div>
            ) : (
                <p className="text-center text-[11px] text-muted-foreground">
                    {isLoteria
                        ? 'Haz clic en una carta para ocupar el siguiente espacio disponible.'
                        : 'Haz clic en un elemento para añadirlo al lienzo.'}
                    {matchedFolder && (
                        <span className="mt-0.5 block font-medium capitalize text-primary/70">
                            📁 {matchedFolder}
                        </span>
                    )}
                </p>
            )}

            <div className="grid grid-cols-2 gap-2">
                {assets.map((asset) => (
                    <button
                        key={asset.name}
                        onClick={() => addAssetToCanvas(asset)}
                        disabled={addingAsset === asset.name || isGenerating}
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

                        {addingAsset === asset.name && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        )}

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
