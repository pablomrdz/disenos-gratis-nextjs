import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import AdUnit from '@/components/AdUnit'
import { DtfSizeGuideTool } from '@/components/dtf-size-guide-tool'

export const metadata: Metadata = {
  title: 'DTF Size Guide & Placement Chart for Shirts',
  description: 'Use this free DTF size guide to estimate transfer width and placement for adult, youth, toddler and infant shirts.',
  alternates: { canonical: '/en/tools/dtf-size-guide/' },
  openGraph: {
    title: 'DTF Size Guide & Placement Chart for Shirts',
    description: 'Interactive DTF transfer sizing and placement guide for shirts.',
    url: '/en/tools/dtf-size-guide/',
    locale: 'en_US',
    type: 'website',
  },
}

const chart = [
  ['Onesie / Infant', '3.5–5 in', '1–1.5 in'],
  ['Toddler', '5–7 in', '1.5–2 in'],
  ['Youth', '7–9 in', '2–2.5 in'],
  ['Adult XS–S', '9–10 in', '2.5–3 in'],
  ['Adult M–L', '10–11 in', '2.5–3 in'],
  ['Adult XL–2XL', '11–12 in', '3–3.5 in'],
  ['Adult 3XL–4XL', '12–13.5 in', '3–3.5 in'],
]

export default function DtfSizeGuidePage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/en/dtf/" className="hover:text-foreground">DTF resources</Link>
          <ChevronRight className="h-4 w-4" /><span className="text-foreground">Size guide</span>
        </nav>

        <header className="mt-5 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Free DTF tool</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">DTF Size Guide & Placement Chart</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">Pick a garment size and placement to estimate a practical DTF transfer width before you print or build a gang sheet.</p>
        </header>

        <section className="mt-7"><DtfSizeGuideTool /></section>

        <div className="my-8 min-h-[250px] w-full overflow-hidden">
          <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">Advertisement</p>
          <AdUnit slot="9549519747" format="auto" style={{ display: 'block', width: '100%' }} className="w-full" />
        </div>

        <article className="prose prose-slate max-w-none lg:prose-lg">
          <h2>DTF shirt size chart</h2>
          <p>The ideal transfer width depends on the printable area of the garment, not only the size printed on the tag. Use this chart as a starting point, then measure the actual shirt before producing a full order.</p>

          <div className="not-prose overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-muted/60"><tr><th className="px-4 py-3 font-semibold">Garment</th><th className="px-4 py-3 font-semibold">Front width</th><th className="px-4 py-3 font-semibold">Start below collar</th></tr></thead>
              <tbody>{chart.map((row) => <tr key={row[0]} className="border-t border-border/60">{row.map((cell) => <td key={cell} className="px-4 py-3">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>

          <h2>DTF placement by print location</h2>
          <h3>Front center</h3><p>Center the artwork visually on the torso rather than relying only on the shirt seams. Adult front designs commonly start roughly 2.5–3.5 inches below the collar depending on shirt size and artwork height.</p>
          <h3>Left chest</h3><p>A 3–4 inch wide design is a useful starting range for many adult left-chest prints. Position it relative to the wearer's chest, not at the geometric center of the shirt half.</p>
          <h3>Full back</h3><p>Back designs can usually run wider than front designs. Measure between the side seams and leave enough visual space around the artwork.</p>

          <h2>How to choose the right DTF transfer size</h2>
          <ol><li>Lay the garment flat without stretching it.</li><li>Measure the available printable width between the side seams.</li><li>Choose the artwork width based on garment size and placement.</li><li>Print a paper proof at actual size when the artwork shape is unusual.</li><li>Keep the same visual proportion across a size run rather than forcing one width onto every shirt.</li></ol>

          <h2>Frequently asked questions</h2>
          <h3>What size should my DTF design be?</h3><p>For an adult medium or large shirt, a front-center design around 10–11 inches wide is a useful starting point. Smaller youth and toddler garments generally need narrower artwork.</p>
          <h3>What size DTF should I use for a youth shirt?</h3><p>A range around 7–9 inches wide works as a practical starting point for many youth shirts, depending on the exact garment and artwork proportions.</p>
          <h3>How far below the collar should a DTF design go?</h3><p>Many adult front designs start about 2.5–3.5 inches below the collar. Youth and toddler garments usually need less distance.</p>
        </article>

        <div className="my-10 min-h-[250px] w-full overflow-hidden">
          <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">Advertisement</p>
          <AdUnit slot="8149719229" format="auto" style={{ display: 'block', width: '100%' }} className="w-full" />
        </div>

        <section className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold">Need heat press settings too?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Compare starting temperature, time and pressure ranges for cotton, polyester and blends.</p>
          <Link href="/en/tools/dtf-press-settings/" className="mt-4 inline-flex font-semibold text-primary hover:underline">Open DTF Press Settings →</Link>
        </section>
      </div>
    </div>
  )
}
