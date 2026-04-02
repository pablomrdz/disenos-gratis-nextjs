import { permanentRedirect, notFound } from 'next/navigation'
import { getDesignBySlug, getPrimaryCategory } from '@/lib/data'

export const revalidate = 3600

interface LegacyDesignPageProps {
  params: Promise<{ slug: string }>
}

export default async function LegacyDesignPage({ params }: LegacyDesignPageProps) {
  const { slug } = await params
  const design = await getDesignBySlug(slug)

  if (!design) {
    notFound()
  }

  // Generate canonical category from the design data
  const rawCategory = design.category || 'general'
  const primaryCategory = getPrimaryCategory(rawCategory)

  // SEO 301 Redirect to the new Silo Structure URL
  permanentRedirect(`/${primaryCategory}/${slug}`)
}
