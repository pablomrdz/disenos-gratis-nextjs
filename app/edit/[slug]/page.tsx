import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDesignBySlug, getPrimaryCategory } from '@/lib/data'
import { DesignEditor } from '@/components/editor/design-editor'
import { createServerSupabaseClient } from '@/lib/supabase'

// ISR: Cachear en CDN por 7 días
export const revalidate = 604800

/**
 * Solo pre-genera editores que realmente están habilitados.
 * Evita publicar /edit/[slug] para cada asset del catálogo.
 */
export async function generateStaticParams() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: designs, error } = await supabase
      .from('designs')
      .select('slug')
      .eq('is_editable', true)
      .not('editor_type', 'is', null)

    if (error) {
      console.error('Error generating static params for edit page:', error)
      return []
    }

    if (!designs || designs.length === 0) return []

    return designs.map((design) => ({
      slug: design.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for edit page:', error)
    return []
  }
}

interface EditPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const { slug } = await params
  const design = await getDesignBySlug(slug)

  if (!design || !design.is_editable || !design.editor_type) {
    return {
      title: 'Editor - Diseño no encontrado',
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `Editar: ${design.title}`,
    description: `Personaliza "${design.title}" con nuestro editor en línea y descarga tu versión única.`,
    robots: { index: false, follow: false },
  }
}

export default async function EditPage({ params }: EditPageProps) {
  const { slug } = await params
  const design = await getDesignBySlug(slug)

  if (!design || !design.is_editable || !design.editor_type) {
    notFound()
  }

  const categorySlug = getPrimaryCategory(design.category)
  const returnHref = `/${categorySlug}/${design.slug}`

  return <DesignEditor design={design} returnHref={returnHref} />
}
