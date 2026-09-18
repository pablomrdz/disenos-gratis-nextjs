'use client'

import { useEffect, useState } from 'react'
import * as fabric from 'fabric'
import type { EditorConfig } from '@/lib/types'

interface InvitationEditorPanelProps {
    canvas: fabric.Canvas | null
    config: EditorConfig
    revision?: number
}

export function InvitationEditorPanel({
    canvas,
    config,
    revision = 0,
}: InvitationEditorPanelProps) {
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(
            (config.textFields || []).map((field) => [field.id, field.defaultText])
        )
    )

    useEffect(() => {
        if (!canvas) return

        const next: Record<string, string> = {}

        for (const field of config.textFields || []) {
            const object = canvas
                .getObjects()
                .find((obj: any) => obj.editorFieldId === field.id) as fabric.Textbox | undefined

            next[field.id] = object?.text ?? field.defaultText
        }

        setValues(next)
    }, [canvas, config.textFields, revision])

    const updateField = (fieldId: string, value: string) => {
        setValues((current) => ({ ...current, [fieldId]: value }))

        if (!canvas) return

        const object = canvas
            .getObjects()
            .find((obj: any) => obj.editorFieldId === fieldId) as fabric.Textbox | undefined

        if (!object) return

        object.set('text', value)
        object.setCoords()
        canvas.renderAll()
        canvas.fire('object:modified', { target: object } as any)
    }

    return (
        <div className="h-full overflow-y-auto bg-background">
            <div className="border-b border-border/50 px-4 py-3">
                <h2 className="text-sm font-semibold text-foreground">Personaliza tu invitación</h2>
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                    Edita los datos y verás los cambios directamente en la invitación.
                </p>
            </div>

            <div className="space-y-4 p-4">
                {(config.textFields || []).map((field) => {
                    const value = values[field.id] ?? field.defaultText
                    const multiline = field.id.includes('address') || field.id.includes('location') || field.id.includes('rsvp')

                    return (
                        <label key={field.id} className="block">
                            <span className="mb-1.5 block text-xs font-medium text-foreground">
                                {field.label}
                            </span>

                            {multiline ? (
                                <textarea
                                    value={value}
                                    onChange={(event) => updateField(field.id, event.target.value)}
                                    rows={2}
                                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                                />
                            ) : (
                                <input
                                    value={value}
                                    onChange={(event) => updateField(field.id, event.target.value)}
                                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                                />
                            )}
                        </label>
                    )
                })}

                <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
                    <p className="text-[11px] leading-5 text-muted-foreground">
                        Esta es la primera versión del editor. Después afinaremos tipografías y posiciones sin cambiar la estructura.
                    </p>
                </div>
            </div>
        </div>
    )
}
