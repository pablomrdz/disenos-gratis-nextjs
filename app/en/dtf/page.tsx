import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Download, Gauge, Ruler, Sparkles } from 'lucide-react'
import AdUnit from '@/components/AdUnit'

export const metadata: Metadata = {
  title: 'Free DTF Designs, Tools & Resources',
  description: 'Free DTF resources for creators: design downloads, heat press settings, shirt size guides and practical tools for DTF printing.',
  alternates: {
    canonical: '/en/dtf/',
    languages: { en: '/en/dtf/', es: '/dtf/', 'x-default': '/dtf/' },
  },
  openGraph: {
    title: 'Free DTF Designs, Tools & Resources',
    description: 'Free DTF designs, heat press settings, size guides and practical DTF resources.',
    url: '/en/dtf/',
    locale: 'en_US',
    type: 'website',
  },
}

const resources = [
  { title: 'DTF Heat Press Settings', description: 'Compare starting temperature, time and pressure ranges for cotton, polyester and blends.', href: '/en/tools/dtf-press-settings/', icon: Gauge },
  { title: 'DTF Size & Placement Guide', description: 'Choose a starting transfer width and placement for adult, youth, toddler and infant shirts.', href: '/en/tools/dtf-size-guide/', icon: Ruler },
]

export default function EnglishDtfHub() {
  return (
    <div className="bg-background">
      <section className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">DTF resource center</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Free DTF Designs, Tools & Resources</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Find free DTF design resources and practical tools for sizing, placement and heat pressing. Built for creators who want useful answers without digging through long guides.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="#tools" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm">Explore free tools <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/dtf/" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground"><Download className="h-4 w-4" /> Browse current DTF designs</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="min-h-[250px] w-full overflow-hidden">
          <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">Advertisement</p>
          <AdUnit slot="9549519747" format="auto" style={{ display: 'block', width: '100%' }} className="w-full" />
        </div>

        <section id="tools" className="py-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">DTF tools</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Solve the production question first</h2>
            <p className="mt-3 leading-7 text-muted-foreground">These tools turn common DTF questions into quick, usable starting points. Keep your transfer supplier's specifications as the final authority for the material you are pressing.</p>
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Link key={resource.href} href={resource.href} className="group rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-xl font-bold">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{resource.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-primary"><Sparkles className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.14em]">Free DTF designs</span></div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Free designs for shirts and DTF projects</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Our current design library includes free DTF-ready resources, character designs, halftone artwork and downloadable packs. We are expanding the English catalog next.</p>
              <Link href="/dtf/" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">Browse the current free DTF library <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6">
              <p className="text-sm font-semibold">Coming next</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground"><li>• Free English DTF design packs</li><li>• Gang Sheet Builder</li><li>• Printable placement charts</li><li>• Seasonal DTF collections</li></ul>
            </div>
          </div>
        </section>

        <article className="prose prose-slate mt-10 max-w-none lg:prose-lg">
          <h2>What is DTF printing?</h2>
          <p>Direct-to-film (DTF) printing places printed artwork on a transfer film and then applies the design to a garment with heat and pressure. The workflow is popular because full-color artwork can be applied to many common apparel fabrics without cutting vinyl layers.</p>
          <h2>Start with the right size and press settings</h2>
          <p>A good DTF result depends on more than the artwork itself. Transfer width, placement, temperature, time and pressure all affect the finished garment. Use the tools above as practical starting points, then test with the exact transfer film and garment you plan to use.</p>
        </article>

        <div className="my-10 min-h-[250px] w-full overflow-hidden">
          <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">Advertisement</p>
          <AdUnit slot="8149719229" format="auto" style={{ display: 'block', width: '100%' }} className="w-full" />
        </div>
      </div>
    </div>
  )
}
