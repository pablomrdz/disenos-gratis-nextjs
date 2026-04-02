import Link from 'next/link'
import { Search } from 'lucide-react'

export function RelatedSearches({ keywords }: { keywords?: string[] | null }) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="mt-12 rounded-2xl bg-muted/40 p-6">
      <h3 className="mb-4 text-sm font-semibold flex items-center gap-2 text-foreground">
        <Search className="h-4 w-4 text-primary" />
        Búsquedas Relacionadas
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, idx) => (
          <Link
            key={idx}
            href={`/search?q=${encodeURIComponent(keyword)}`}
            className="rounded-full border border-border/50 bg-white dark:bg-slate-900 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary shadow-sm"
          >
            {keyword}
          </Link>
        ))}
      </div>
    </div>
  )
}
