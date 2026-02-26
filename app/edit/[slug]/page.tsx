import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDesignBySlug } from '@/lib/data'
import { DesignEditor } from '@/components/editor/design-editor'

// ISR: Static with 1 hour revalidation
export const revalidate = 3600

interface EditPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
    const { slug } = await params
    const design = await getDesignBySlug(slug)

    if (!design) {
        return { title: 'Editor - Diseño no encontrado' }
    }

    return {
        title: `Editar: ${design.title}`,
        description: `Personaliza "${design.title}" con nuestro editor en línea y descarga tu versión única.`,
        robots: { index: false, follow: false }, // Don't index editor pages
    }
}

export default async function EditPage({ params }: EditPageProps) {
    const { slug } = await params
    const design = await getDesignBySlug(slug)

    if (!design) {
        notFound()
    }

    return <DesignEditor design={design} />
}
