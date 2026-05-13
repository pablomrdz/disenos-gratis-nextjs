import React from 'react'
import { cn } from '@/lib/utils'

interface RichTextProps {
  content: string
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null

  // Limpieza dinámica: eliminar ez-toc-container
  let cleanContent = content.replace(/<div id="ez-toc-container".*?<\/div>/s, '')

  return (
    <div
      className={cn("prose prose-slate lg:prose-lg max-w-none dark:prose-invert", className)}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  )
}
