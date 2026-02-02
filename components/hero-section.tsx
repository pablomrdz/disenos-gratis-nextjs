import Link from 'next/link'
import { ArrowRight, Sparkles, Download, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdSlot } from '@/components/ad-slot'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Premium Design Resources</span>
            </div>
            
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Create stunning designs in{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                minutes
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground lg:mx-0">
              Access thousands of premium templates, fonts, and design resources. 
              Perfect for social media, presentations, and branding projects.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button asChild size="lg" className="gap-2">
                <Link href="/designs">
                  Browse Designs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
                <Link href="/vip">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Get VIP Access
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border/50 pt-8">
              <div>
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground lg:justify-start">
                  <Download className="h-5 w-5 text-primary" />
                  50K+
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Downloads</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground lg:justify-start">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  1000+
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Templates</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground lg:justify-start">
                  <Users className="h-5 w-5 text-emerald-500" />
                  25K+
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Creators</p>
              </div>
            </div>
          </div>

          {/* Right content - Hero Ad */}
          <div className="hidden lg:block">
            <AdSlot variant="hero" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
