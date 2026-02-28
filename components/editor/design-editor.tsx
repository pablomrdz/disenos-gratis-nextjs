'use client'

import { useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import { EditorCanvas } from './editor-canvas'
import { EditorToolbar } from './editor-toolbar'
import { EditorHeader } from './editor-header'
import type { Design } from '@/lib/types'

interface DesignEditorProps {
    design: Design
}

export function DesignEditor({ design }: DesignEditorProps) {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
    const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null)

    const handleSelectionChange = useCallback((obj: fabric.FabricObject | null) => {
        setSelectedObject(obj)
    }, [])

    const imageUrl = design.image_url || design.thumbnail_url || '/placeholder.svg'

    return (
        <div className="flex h-[100dvh] flex-col bg-muted/30">
            {/* Top Bar */}
            <EditorHeader
                title={design.title}
                slug={design.slug || design.id}
                canvas={canvas}
            />

            {/* Main Editor Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (Toolbar) */}
                <div className="hidden w-[260px] shrink-0 md:block">
                    <EditorToolbar
                        canvas={canvas}
                        selectedObject={selectedObject}
                        onSelectionChange={handleSelectionChange}
                    />
                </div>

                {/* Canvas Area */}
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
                        <EditorCanvas
                            imageUrl={imageUrl}
                            setCanvas={setCanvas}
                            onSelectionChange={handleSelectionChange}
                        />
                    </div>

                    {/* Mobile Toolbar (Bottom Sheet style) */}
                    <div className="block border-t border-border/50 md:hidden">
                        <div className="max-h-[40vh] overflow-y-auto">
                            <EditorToolbar
                                canvas={canvas}
                                selectedObject={selectedObject}
                                onSelectionChange={handleSelectionChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
