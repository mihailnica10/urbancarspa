import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, ArrowRight, Zap, Palette, Share2, Lock, BarChart3, Globe } from 'lucide-react'

export function SaaSHomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
              Beautiful Landing Pages
              <span className="block text-primary mt-2">for Your Business</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Create and manage stunning, customizable landing pages in minutes.
              Perfect for auto detailers, salons, restaurants, and any local business.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://admin.clin.ro">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, powerful features to help your business stand out
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Palette className="w-6 h-6" />}
              title="Custom Branding"
              description="Personalize colors, logos, and themes to match your brand identity perfectly."
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6" />}
              title="Social Links"
              description="Connect all your social media accounts - Instagram, Facebook, TikTok, and more."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Custom Buttons"
              description="Add action buttons for appointments, phone calls, directions, or any link you need."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Secure Hosting"
              description="Built on Cloudflare's global network for lightning-fast, secure performance."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Easy Management"
              description="Intuitive admin dashboard to update your page in real-time, no coding needed."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Custom Domain"
              description="Get your own subdomain or use our clin.ro/[yourname] URL."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Sign Up"
              description="Create your account at admin.clin.ro in seconds."
            />
            <StepCard
              number="2"
              title="Customize"
              description="Add your branding, colors, social links, and buttons."
            />
            <StepCard
              number="3"
              title="Go Live"
              description="Your page is instantly available at clin.ro/[your-slug]."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Simple Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              name="Free"
              price="€0"
              period="forever"
              features={[
                'One landing page',
                'Basic customization',
                'Up to 3 social links',
                'clin.ro subdomain',
              ]}
              cta="Get Started"
              href="https://admin.clin.ro"
            />
            <PricingCard
              name="Pro"
              price="€9"
              period="month"
              features={[
                'Unlimited landing pages',
                'Full customization',
                'Unlimited social links',
                'Custom domain support',
                'Priority support',
              ]}
              cta="Coming Soon"
              href="#"
              highlighted
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Launch Your Page?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join hundreds of businesses using clin.ro to grow their online presence.
          </p>
          <Button size="lg" asChild>
            <a href="https://admin.clin.ro">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} clin.ro. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="https://admin.clin.ro" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="p-6">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <Card className="p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  highlighted = false,
}: {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  href: string
  highlighted?: boolean
}) {
  return (
    <Card className={`p-8 ${highlighted ? 'border-primary shadow-lg' : ''}`}>
      <h3 className="text-2xl font-bold text-foreground mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground">/{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map(feature => (
          <li key={feature} className="flex items-center gap-3 text-muted-foreground">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={highlighted ? 'default' : 'outline'} asChild>
        <a href={href}>{cta}</a>
      </Button>
    </Card>
  )
}
