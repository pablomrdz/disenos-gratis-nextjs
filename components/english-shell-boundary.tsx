'use client'

import { usePathname } from 'next/navigation'
import { EnglishHeader } from '@/components/english-header'
import { EnglishFooter } from '@/components/english-footer'

export function EnglishShellBoundary({ children, spanishHeader, spanishFooter }: { children: React.ReactNode; spanishHeader: React.ReactNode; spanishFooter: React.ReactNode }) {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith('/en')

  if (isEnglish) {
    return <div className="flex min-h-screen flex-col"><EnglishHeader /><main className="flex-1" lang="en">{children}</main><EnglishFooter /></div>
  }

  return <div className="flex min-h-screen flex-col">{spanishHeader}<main className="flex-1">{children}</main>{spanishFooter}</div>
}
