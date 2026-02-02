import type { Metadata } from 'next'
import Link from 'next/link'
import { Crown, Check, Sparkles, Download, Zap, Shield, HeadphonesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DesignGrid } from '@/components/design-grid'
import { getDesigns } from '@/lib/data'

// Force SSR for SEO
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'VIP Access - Unlock Premium Design Resources',
  description: 'Get unlimited access to all premium templates, fonts, and design resources with DesignHub VIP membership.',
}

const features = [
  {
    icon: Download,
    title: 'Unlimited Downloads',
    description: 'Download as many premium templates as you need, no restrictions.',
  },
  {
    icon: Zap,
    title: 'Early Access',
    description: 'Be the first to get new templates before anyone else.',
  },
  {
    icon: Shield,
    title: 'Commercial License',
    description: 'Use all assets for personal and commercial projects.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Priority Support',
    description: 'Get help faster with dedicated VIP support.',
  },
]

const plans = [
  {
    name: 'Monthly',
    price: '$9.99',
    period: '/month',
    description: 'Perfect for trying out VIP',
    features: [
      'All premium templates',
      'Unlimited downloads',
      'Commercial license',
      'New releases access',
    ],
    popular: false,
  },
  {
    name: 'Yearly',
    price: '$79.99',
    period: '/year',
    description: 'Best value - Save 33%',
    features: [
      'All premium templates',
      'Unlimited downloads',
      'Commercial license',
      'New releases access',
      'Priority support',
      'Exclusive content',
    ],
    popular: true,
  },
  {
    name: 'Lifetime',
    price: '$199',
    period: 'one-time',
    description: 'Pay once, access forever',
    features: [
      'All premium templates',
      'Unlimited downloads',
      'Commercial license',
      'New releases access',
      'Priority support',
      'Exclusive content',
      'Future updates included',
    ],
    popular: false,
  },
]

export default async function VIPPage() {
  const vipDesigns = await getDesigns({ isVip: true, limit: 8 })

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <Badge className="gap-2 border-amber-500/30 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-white">
            <Crown className="h-4 w-4" />
            VIP Membership
          </Badge>
          
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Unlock{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Premium
            </span>{' '}
            Design Resources
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Get unlimited access to our entire library of premium templates, fonts, and design resources. 
            Create stunning designs without limits.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                    <feature.icon className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-y border-border/40 bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Choose Your Plan
            </h2>
            <p className="mt-2 text-muted-foreground">
              All plans include full access to premium content
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative border-border/50 ${plan.popular ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4 pt-6">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Content Preview */}
      {vipDesigns.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  VIP Content Preview
                </h2>
                <p className="mt-2 text-muted-foreground">
                  A glimpse of what you'll unlock with VIP access
                </p>
              </div>
              <Link
                href="/designs?vip=true"
                className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
              >
                View all VIP content
              </Link>
            </div>

            <div className="mt-8">
              <DesignGrid designs={vipDesigns} showAds={false} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-gradient-to-b from-muted/30 to-background py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Crown className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to go VIP?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of creators who use DesignHub VIP to create stunning designs every day.
          </p>
          <Button size="lg" className="mt-8 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
            <Sparkles className="h-5 w-5" />
            Start VIP Today
          </Button>
        </div>
      </section>
    </>
  )
}
