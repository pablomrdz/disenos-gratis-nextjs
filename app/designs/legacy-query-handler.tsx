'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export function LegacyQueryHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const tag = searchParams.get('tag')
    const category = searchParams.get('category')

    if (tag) {
      router.replace(`/tags/${encodeURIComponent(tag)}`)
    } else if (category && category !== 'all') {
      router.replace(`/${category}`)
    }
  }, [searchParams, router])

  return null
}