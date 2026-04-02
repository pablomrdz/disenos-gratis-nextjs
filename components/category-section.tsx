import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTopCategories } from '@/lib/data'
import { slugify, getCategoryIcon, getCategoryColor } from '@/lib/utils'

// Helper function to format category names
function formatCategoryName(slug: string): string {
  return slug
    .split(',')[0]
    .split(/[- ]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function CategorySection() {
  const topCategories = await getTopCategories(12) // Fetch more for pills

  return (
    <section className="pt-6 pb-0 sm:py-8 sm:pb-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Explorar Categorías
          </h2>
          <Link
            href="/designs"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto pb-4 pt-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory">
          {/* Used CSS Grid on desktop to enforce exactly 5 columns taking full width, while keeping mobile flex */}
          <div className="flex sm:grid sm:grid-cols-5 sm:gap-y-8 sm:gap-x-4 sm:justify-items-center gap-3 flex-nowrap justify-start w-full px-2 py-2">
            {topCategories
              .map((item) => (
                <Link
                  key={item.category}
                  href={`/${slugify(item.category)}`}
                  className="group snap-start relative flex-shrink-0"
                >
                  {/* w-[76px] -> w-[88px], sm:w-[110px] -> sm:w-[128px] */}
                  <div className="flex flex-col items-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 select-none w-[88px] sm:w-[128px]">

                    {/* Icon container: h-16 w-16 -> h-20 w-20, sm:h-24 sm:w-24 -> sm:h-28 sm:w-28 */}
                    <div className={`flex h-20 w-20 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-full shadow-sm hover:shadow-md border border-border/40 ${getCategoryColor(item.category)}`}>
                      {/* Icon size: h-7 w-7 -> h-9 w-9, sm:h-12 w-12 -> sm:h-14 sm:w-14 */}
                      {getCategoryIcon(item.category, "h-9 w-9 sm:h-14 sm:w-14")}
                    </div>

                    {/* Category Name */}
                    <span className="text-[11px] sm:text-sm font-medium text-slate-700 group-hover:text-primary text-center leading-tight px-1 sm:px-2 line-clamp-2">
                      {formatCategoryName(item.category)}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
