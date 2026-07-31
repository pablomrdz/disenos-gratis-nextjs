import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDesignBySlug } from '@/lib/data'
import { DesignEditor } from '@/components/editor/design-editor'
import { createServerSupabaseClient } from '@/lib/supabase'

// ISR: Cachear en CDN por 7 días
export const revalidate = 604800

/**
 * Pre-genera las páginas del editor para todos los diseños
 * en tiempo de build para evitar SSR dinámico en caliente.
 */
export async function generateStaticParams() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: designs } = await supabase
      .from('designs')
      .select('slug')

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

  if (!design) {
    return { title: 'Editor - Diseño no encontrado' }
  }

  return {
    title: `Editar: ${design.title}`,
    description: `Personaliza "${design.title}" con nuestro editor en línea y descarga tu versión única.`,
    robots: { index: false, follow: false }, // No indexar páginas del editor en Google
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