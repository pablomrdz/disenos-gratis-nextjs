'use client'

import { useState, useEffect } from 'react'
import * as fabric from 'fabric'
import {
    Type,
    Square,
    Circle,
    Triangle,
    Minus,
    Palette,
    Trash2,
    Bold,
    Italic,
    Loader2,
    Image,
} from 'lucide-react'
import { EditorAssetsPanel } from './editor-assets-panel'
import { Button } from '@/components/ui/button'
import { DESIGN_FONTS, loadFont, fetchAllFontsFromSupabase } from '@/lib/font-loader'

interface EditorToolbarProps {
    canvas: fabric.Canvas | null
    selectedObject: fabric.FabricObject | null
    onSelectionChange: (obj: fabric.FabricObject | null) => void
    defaultFontFamily?: string
    designSlug?: string
    designCategory?: string
    isLoteria?: boolean
}

const PRESET_COLORS = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
    '#319bb9', '#2c8aa5',
]

const FONT_SIZES = [14, 18, 24, 32, 48, 64, 80]

type ToolTab = 'text' | 'shapes' | 'assets' | 'properties'

export function EditorToolbar({
    canvas,
    selectedObject,
    onSelectionChange,
    defaultFontFamily = 'Arial',
    designSlug,
    designCategory,
    isLoteria = false,
}: EditorToolbarProps) {
    const [activeTab, setActiveTab] = useState<ToolTab>(
        isLoteria && designSlug ? 'assets' : 'text'
    )
    const [isFontLoading, setIsFontLoading] = useState(false)
    const [, setRevision] = useState(0)
    const [fontFamilies, setFontFamilies] = useState<string[]>(
        DESIGN_FONTS.map((font) => font.name)
    )

    const isPlaceholder = Boolean((selectedObject as any)?.isPlaceholder)
    const canEditSelected = Boolean(selectedObject && !isPlaceholder)

    useEffect(() => {
        if (isLoteria) return

        fetchAllFontsFromSupabase().then(() => {
            setFontFamilies(DESIGN_FONTS.map((font) => font.name))
        })
    }, [isLoteria])

    useEffect(() => {
        if (isLoteria && (activeTab === 'text' || activeTab === 'shapes')) {
            setActiveTab('assets')
        }

        if (activeTab === 'properties' && !canEditSelected) {
            setActiveTab(isLoteria && designSlug ? 'assets' : 'text')
        }
    }, [activeTab, canEditSelected, designSlug, isLoteria])

    const addText = () => {
        if (!canvas || isLoteria) return

        const text = new fabric.IText('Tu texto aquí', {
            fontFamily: defaultFontFamily,
            fontSize: 32,
            fill: '#000000',
            fontWeight: 'normal',
            fontStyle: 'normal',
        })

        canvas.add(text)
        canvas.centerObject(text)
        canvas.bringObjectToFront(text)
        canvas.setActiveObject(text)
        canvas.renderAll()
        onSelectionChange(text)
        setActiveTab('properties')
    }

    const addShape = (type: 'rect' | 'circle' | 'triangle' | 'line') => {
        if (!canvas || isLoteria) return

        let shape: fabric.FabricObject
        const cx = canvas.width! / 2
        const cy = canvas.height! / 2

        switch (type) {
            case 'rect':
                shape = new fabric.Rect({
                    left: cx - 50,
                    top: cy - 40,
                    width: 100,
                    height: 80,
                    fill: '#3b82f6',
                    stroke: '#1e40af',
                    strokeWidth: 2,
                    rx: 8,
                    ry: 8,
                })
                break
            case 'circle':
                shape = new fabric.Circle({
                    left: cx - 40,
                    top: cy - 40,
                    radius: 40,
                    fill: '#22c55e',
                    stroke: '#15803d',
                    strokeWidth: 2,
                })
                break
            case 'triangle':
                shape = new fabric.Triangle({
                    left: cx - 40,
                    top: cy - 40,
                    width: 80,
                    height: 70,
                    fill: '#f97316',
                    stroke: '#c2410c',
                    strokeWidth: 2,
                })
                break
            case 'line':
                shape = new fabric.Line([cx - 60, cy, cx + 60, cy], {
                    stroke: '#000000',
                    strokeWidth: 3,
                })
                break
            default:
                return
        }

        canvas.add(shape)
        canvas.centerObject(shape)
        canvas.bringObjectToFront(shape)
        canvas.setActiveObject(shape)
        canvas.renderAll()
        onSelectionChange(shape)
        setActiveTab('properties')
    }

    const deleteSelected = () => {
        if (!canvas || !selectedObject || isPlaceholder) return

        const selectedAny = selectedObject as any

        if (selectedAny.isLoteriaCard && typeof selectedAny.placeholderIndex === 'number') {
            const placeholder = canvas
                .getObjects()
                .find(
                    (obj: any) =>
                        obj.isPlaceholder &&
                        obj.placeholderIndex === selectedAny.placeholderIndex
                ) as any

            if (placeholder) placeholder.hasCard = false
        }

        canvas.remove(selectedObject)
        canvas.discardActiveObject()
        canvas.renderAll()
        onSelectionChange(null)
        setActiveTab(isLoteria && designSlug ? 'assets' : 'text')
    }

    const updateProperty = async (prop: string, value: any) => {
        if (!canvas || !selectedObject || isPlaceholder) return

        if (prop === 'fontFamily') {
            const font = DESIGN_FONTS.find((item) => item.name === value)

            if (font?.url) {
                setIsFontLoading(true)
                try {
                    await loadFont(font.name, font.url)
                } finally {
                    setIsFontLoading(false)
                }
            }
        }

        selectedObject.set(prop as keyof fabric.FabricObject, value)
        canvas.renderAll()
        setRevision((revision) => revision + 1)
    }

    const isTextObject =
        selectedObject instanceof fabric.IText ||
        selectedObject instanceof fabric.Textbox

    return (
        <div className="flex h-full w-full flex-col overflow-y-auto bg-background">
            <div className="flex border-b border-border/50">
                {!isLoteria && (
                    <>
                        <button
                            onClick={() => setActiveTab('text')}
                            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                                activeTab === 'text'
                                    ? 'border-b-2 border-primary bg-primary/5 text-primary'
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            }`}
                        >
                            <Type className="mx-auto mb-1 h-4 w-4" />
                            Texto
                        </button>

                        <button
                            onClick={() => setActiveTab('shapes')}
                            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                                activeTab === 'shapes'
                                    ? 'border-b-2 border-primary bg-primary/5 text-primary'
                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            }`}
                        >
                            <Square className="mx-auto mb-1 h-4 w-4" />
                            Formas
                        </button>
                    </>
                )}

                {designSlug && (
                    <button
                        onClick={() => setActiveTab('assets')}
                        className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                            activeTab === 'assets'
                                ? 'border-b-2 border-primary bg-primary/5 text-primary'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                    >
                        <Image className="mx-auto mb-1 h-4 w-4" />
                        {isLoteria ? 'Cartas' : 'Elementos'}
                    </button>
                )}

                {canEditSelected && (
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                            activeTab === 'properties'
                                ? 'border-b-2 border-primary bg-primary/5 text-primary'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                    >
                        <Palette className="mx-auto mb-1 h-4 w-4" />
                        Editar
                    </button>
                )}
            </div>

            <div className="flex-1 space-y-4 p-4">
                {!isLoteria && activeTab === 'text' && (
                    <>
                        <Button onClick={addText} className="w-full gap-2 rounded-xl" size="lg">
                            <Type className="h-5 w-5" />
                            Añadir Texto
                        </Button>
                        <p className="text-center text-[11px] text-muted-foreground">
                            Haz clic para agregar texto editable al lienzo
                        </p>
                    </>
                )}

                {!isLoteria && activeTab === 'shapes' && (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => addShape('rect')}
                            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                        >
                            <Square className="h-8 w-8 text-blue-500" />
                            <span className="text-xs text-muted-foreground">Rectángulo</span>
                        </button>
                        <button
                            onClick={() => addShape('circle')}
                            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                        >
                            <Circle className="h-8 w-8 text-green-500" />
                            <span className="text-xs text-muted-foreground">Círculo</span>
                        </button>
                        <button
                            onClick={() => addShape('triangle')}
                            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                        >
                            <Triangle className="h-8 w-8 text-orange-500" />
                            <span className="text-xs text-muted-foreground">Triángulo</span>
                        </button>
                        <button
                            onClick={() => addShape('line')}
                            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                        >
                            <Minus className="h-8 w-8 text-gray-500" />
                            <span className="text-xs text-muted-foreground">Línea</span>
                        </button>
                    </div>
                )}

                {activeTab === 'assets' && designSlug && (
                    <EditorAssetsPanel
                        canvas={canvas}
                        designSlug={designSlug}
                        designCategory={designCategory || ''}
                        selectedObject={selectedObject}
                        isLoteria={isLoteria}
                    />
                )}

                {activeTab === 'properties' && canEditSelected && (
                    isLoteria ? (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                                <p className="text-sm font-semibold text-foreground">Carta seleccionada</p>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    Puedes eliminarla y después elegir otra carta para ocupar ese espacio.
                                </p>
                            </div>

                            <Button
                                variant="destructive"
                                onClick={deleteSelected}
                                className="w-full gap-2 rounded-xl"
                            >
                                <Trash2 className="h-4 w-4" />
                                Quitar carta
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-foreground">
                                    Color de Relleno
                                </label>
                                <div className="grid grid-cols-6 gap-1.5">
                                    {PRESET_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => updateProperty('fill', color)}
                                            className="h-7 w-7 rounded-lg border-2 transition-transform hover:scale-110"
                                            style={{
                                                backgroundColor: color,
                                                borderColor:
                                                    (selectedObject?.fill as string) === color
                                                        ? '#319bb9'
                                                        : 'transparent',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {isTextObject && selectedObject && (
                                <>
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground">
                                            Tipografía
                                            {isFontLoading && (
                                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                            )}
                                        </label>
                                        <select
                                            disabled={isFontLoading}
                                            value={(selectedObject as fabric.IText).fontFamily || 'Arial'}
                                            onChange={(event) =>
                                                updateProperty('fontFamily', event.target.value)
                                            }
                                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-50"
                                        >
                                            {fontFamilies.map((font) => (
                                                <option key={font} value={font}>
                                                    {font}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-foreground">
                                            Tamaño
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {FONT_SIZES.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => updateProperty('fontSize', size)}
                                                    className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                                                        (selectedObject as fabric.IText).fontSize === size
                                                            ? 'bg-primary text-white'
                                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-foreground">
                                            Estilo
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    updateProperty(
                                                        'fontWeight',
                                                        (selectedObject as fabric.IText).fontWeight === 'bold'
                                                            ? 'normal'
                                                            : 'bold'
                                                    )
                                                }
                                                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                                                    (selectedObject as fabric.IText).fontWeight === 'bold'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                            >
                                                <Bold className="mx-auto h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateProperty(
                                                        'fontStyle',
                                                        (selectedObject as fabric.IText).fontStyle === 'italic'
                                                            ? 'normal'
                                                            : 'italic'
                                                    )
                                                }
                                                className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${
                                                    (selectedObject as fabric.IText).fontStyle === 'italic'
                                                        ? 'bg-primary text-white'
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                            >
                                                <Italic className="mx-auto h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="mb-2 block text-xs font-medium text-foreground">
                                    Opacidad: {Math.round((selectedObject?.opacity ?? 1) * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={Math.round((selectedObject?.opacity ?? 1) * 100)}
                                    onChange={(event) =>
                                        updateProperty('opacity', parseInt(event.target.value) / 100)
                                    }
                                    className="w-full accent-primary"
                                />
                            </div>

                            <Button
                                variant="destructive"
                                onClick={deleteSelected}
                                className="w-full gap-2 rounded-xl"
                            >
                                <Trash2 className="h-4 w-4" />
                                Eliminar Elemento
                            </Button>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
