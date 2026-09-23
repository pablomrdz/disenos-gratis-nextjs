import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import AdUnit from '@/components/AdUnit'
import { DtfPressSettingsTool } from '@/components/dtf-press-settings-tool'

export const metadata: Metadata = {
  title: 'DTF Heat Press Settings: Temperature, Time & Pressure',
  description: 'Use this free DTF heat press settings guide to compare starting temperature, time and pressure ranges for cotton, polyester and blends.',
  alternates: { canonical: '/en/tools/dtf-press-settings/' },
  openGraph: {
    title: 'DTF Heat Press Settings: Temperature, Time & Pressure',
    description: 'Interactive DTF heat press settings guide for cotton, polyester and blends.',
    url: '/en/tools/dtf-press-settings/',
    locale: 'en_US',
    type: 'website',
  },
}

const rows = [
  ['100% Cotton', '310–325°F', '12–15 sec', 'Medium–high'],
  ['100% Polyester', '275–290°F', '8–12 sec', 'Medium'],
  ['Cotton / Polyester Blend', '290–310°F', '10–15 sec', 'Medium'],
  ['Performance Polyester', '260–285°F', '8–10 sec', 'Light–medium'],
]

export default function DtfPressSettingsPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/en/dtf/" className="hover:text-foreground">DTF resources</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Press settings</span>
        </nav>

        <header className="mt-5 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Free DTF tool</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">DTF Heat Press Settings: Temperature, Time & Pressure</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            Choose a fabric to get a practical starting point for pressing DTF transfers. Always verify the instructions supplied with your film or transfer before production.
          </p>
        </header>

        <section className="mt-7"><DtfPressSettingsTool /></section>

        <div className="my-8 min-h-[250px] w-full overflow-hidden">
          <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">Advertisement</p>
          <AdUnit slot="9549519747" format="auto" style={{ display: 'block', width: '100%' }} className="w-full" />
        </div>

        <article className="prose prose-slate max-w-none lg:prose-lg">
          <h2>DTF heat press settings chart</h2>
          <p>There is no single temperature that is correct for every DTF transfer. Film, adhesive powder, press calibration and garment chemistry all matter. Use the values below as test settings, not as a replacement for your supplier instructions.</p>

          <div className="not-prose overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-muted/60"><tr><th className="px-4 py-3 font-semibold">Fabric</th><th className="px-4 py-3 font-semibold">Temperature</th><th className="px-4 py-3 font-semibold">Time</th><th className="px-4 py-3 font-semibold">Pressure</th></tr></thead>
              <tbody>{rows.map((row) => <tr key={row[0]} className="border-t border-border/60">{row.map((cell) => <td key={cell} className="px-4 py-3">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>

          <h2>How to press a DTF transfer</h2>
          <ol><li>Pre-press the garment briefly to remove moisture and wrinkles.</li><li>Position the transfer and confirm the artwork is straight.</li><li>Press using the transfer supplier's recommended temperature, time and pressure.</li><li>Peel only when the film instructions say to peel: hot, warm or cold.</li><li>When recommended by the supplier, cover and press again for a short finishing press.</li></ol>

          <h2>Why DTF settings change by fabric</h2>
          <p>Cotton usually tolerates more heat than polyester. Polyester and performance garments may require lower temperatures to reduce scorching, gloss marks or dye migration. A calibrated press and a small production test are more reliable than assuming one recipe works for every garment.</p>

          <h2>Common DTF pressing problems</h2>
          <h3>Transfer does not stick</h3><p>Check pressure, actual platen temperature, press time and whether the film is being peeled at the correct stage.</p>
          <h3>Polyester changes color</h3><p>Reduce heat when the transfer system allows it and test for dye migration before producing the full order.</p>
          <h3>Edges lift after peeling</h3><p>Confirm even pressure across the platen and follow the recommended finishing press for the transfer you are using.</p>

          <h2>Frequently asked questions</h2>
          <h3>What temperature should DTF be pressed at?</h3><p>Many DTF systems operate somewhere in the high-200s to low-300s °F, but the correct temperature depends on the transfer film and garment. Start with the supplier specification and adjust only after testing.</p>
          <h3>How long should I press a DTF transfer?</h3><p>Common workflows use roughly 8–15 seconds for the first press, but the exact time is film-specific.</p>
          <h3>Should DTF use high pressure?</h3><p>Medium pressure is common, while some systems call for medium-high pressure. Uneven pressure is often more problematic than the label itself.</p>
        </article>

        <div className="my-10 min-h-[250px] w-full overflow-hidden">
          <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">Advertisement</p>
          <AdUnit slot="8149719229" format="auto" style={{ display: 'block', width: '100%' }} className="w-full" />
        </div>

        <section className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-xl font-bold">Next: choose the right DTF size</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Use the DTF Size & Placement Guide to choose a starting transfer width for adult, youth, toddler and infant garments.</p>
          <Link href="/en/tools/dtf-size-guide/" className="mt-4 inline-flex font-semibold text-primary hover:underline">Open the DTF Size Guide →</Link>
        </section>
      </div>
    </div>
  )
}
