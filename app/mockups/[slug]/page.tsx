import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MockupEditor } from '@/components/mockup/MockupEditor'
import { getMockupPreset } from '@/components/mockup/mockup-presets'

interface MockupPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [{ slug: 'mvp-1' }, { slug: 'mvp-2' }]
}

export async function generateMetadata({ params }: MockupPageProps): Promise<Metadata> {
  const { slug } = await params
  const preset = getMockupPreset(slug)

  if (!preset) {
    return { title: 'Mockup no encontrado', robots: { index: false, follow: false } }
  }

  return {
    title: preset.title,
    description: `${preset.description} Sube tu diseño y descárgalo sin enviar tu archivo a ningún servidor.`,
  }
}

export default async function MockupPage({ params }: MockupPageProps) {
  const { slug } = await params
  const preset = getMockupPreset(slug)

  if (!preset) notFound()

  return <MockupEditor preset={preset} />
}
