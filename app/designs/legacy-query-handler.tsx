'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'

export function LegacyQueryHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const tag = searchParams.get('tag')
    const category = searchParams.get('category')

    if (tag) {
      router.replace(`/tags/${slugify(tag)}/`)
    } else if (category && category !== 'all') {
      router.replace(`/${slugify(category)}/`)
    }
  }, [searchParams, router])

  return null
}