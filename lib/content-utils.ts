import type { Design } from './types'

/**
 * Detecta el tipo de contenido basado en la categoría
 */
export function detectContentType(design: Design): 'blog' | 'resource' {
    const blogCategories = ['blog', 'tutorial', 'guia', 'articulo']
    const category = design.category?.toLowerCase() || ''

    return blogCategories.some(cat => category.includes(cat)) ? 'blog' : 'resource'
}

/**
 * Extrae link de descarga de Drive o Mega del contenido
 */
export function extractDownloadLink(content: string): string | null {
    // Regex para detectar links de Google Drive
    const driveRegex = /https?:\/\/(?:drive\.google\.com|docs\.google\.com)\/[^\s<>"]+/i
    const driveMatch = content.match(driveRegex)
    if (driveMatch) return driveMatch[0]

    // Regex para detectar links de Mega
    const megaRegex = /https?:\/\/mega\.nz\/[^\s<>"]+/i
    const megaMatch = content.match(megaRegex)
    if (megaMatch) return megaMatch[0]

    // Regex para detectar links de Dropbox
    const dropboxRegex = /https?:\/\/(?:www\.)?dropbox\.com\/[^\s<>"]+/i
    const dropboxMatch = content.match(dropboxRegex)
    if (dropboxMatch) return dropboxMatch[0]

    return null
}

/**
 * Divide el contenido para insertar un ad después del primer párrafo
 */
export function splitContentForAd(content: string): { before: string; after: string } {
    // Intentar dividir por doble salto de línea (párrafos)
    const paragraphs = content.split(/\n\n+/)

    if (paragraphs.length > 1) {
        return {
            before: paragraphs[0],
            after: paragraphs.slice(1).join('\n\n')
        }
    }

    // Si no hay párrafos, dividir por punto seguido de espacio
    const sentences = content.split(/\.\s+/)

    if (sentences.length > 2) {
        return {
            before: sentences.slice(0, 2).join('. ') + '.',
            after: sentences.slice(2).join('. ')
        }
    }

    // Si el contenido es muy corto, no dividir
    return {
        before: content,
        after: ''
    }
}

/**
 * Formatea el nombre de una categoría para mostrar
 */
export function formatCategoryName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
