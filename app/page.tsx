'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  Truck,
  BarChart3,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

// Lazy-load WorldMap so it never blocks initial paint
const WorldMap = dynamic(
  () => import('@/components/ui/world-map').then((m) => m.WorldMap),
  { ssr: false }
)

const LOGISTICS_DOTS = [
  // Kolkata → New York
  { start: { lat: 22.57, lng: 88.36 }, end: { lat: 40.71, lng: -74.00 } },
  // London → Delhi
  { start: { lat: 51.50, lng: -0.12 }, end: { lat: 28.61, lng: 77.20 } },
  // Dubai → Tokyo
  { start: { lat: 25.20, lng: 55.27 }, end: { lat: 35.68, lng: 139.69 } },
  // Mumbai → Los Angeles
  { start: { lat: 19.07, lng: 72.87 }, end: { lat: 34.05, lng: -118.24 } },
  // Singapore → Frankfurt
  { start: { lat: 1.35, lng: 103.82 }, end: { lat: 50.11, lng: 8.68 } },
  // Shanghai → Rotterdam
  { start: { lat: 31.23, lng: 121.47 }, end: { lat: 51.92, lng: 4.47 } },
]

// Self-contained inline flip card for landing page
// (does not use the dashboard FlipCard which expects FlipCardData shape)
function LandingFlipCard({
  front,
  back,
}: {
  front: { icon?: React.ReactNode; title: string; description: string }
  back: { benefits?: string[]; items?: string[]; content?: React.ReactNode }
}) {
  const [flipped, setFlipped] = useState(false)
  const items = back.benefits ?? back.items ?? []

  return (
    <div
      className="relative h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass-panel p-6 flex flex-col justify-between border border-white/10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-primary">{front.icon}</div>
          <div>
            <h4 className="text-lg font-pepi-thin text-on-surface mb-2">{front.title}</h4>
            <p className="text-sm font-biotif-pro text-on-surface-variant">{front.description}</p>
          </div>
          <span className="text-xs text-on-surface-variant/50">hover for details</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between border border-primary/30 bg-primary/5"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <ul className="space-y-3 flex-1">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-on-surface">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          {back.content}
        </div>
      </motion.div>
    </div>
  )
}

export default function LandingPage() {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Real-Time Tracking',
      description: 'Monitor your shipments in real-time with live GPS tracking and instant updates',
      benefits: ['Live GPS positioning', 'Instant notifications', 'Historical route data']
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Gain insights with powerful analytics and comprehensive reporting tools',
      benefits: ['Performance dashboards', 'Custom reports', 'Predictive analytics']
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, 2FA, and compliance certifications',
      benefits: ['End-to-end encryption', 'Two-factor auth', 'Compliance certified']
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Automated Workflows',
      description: 'Streamline operations with intelligent automation and smart routing',
      benefits: ['Smart routing', 'Auto scheduling', 'Intelligent alerts']
    },
  ]

  const stats = [
    { label: 'Active Users', value: '2,500+' },
    { label: 'Shipments Tracked', value: '50K+' },
    { label: 'Countries Served', value: '45+' },
    { label: 'Uptime', value: '99.9%' },
  ]

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-sm bg-background/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-pepi-thin text-on-surface">SmartLogistics</h1>
            <p className="text-xs text-on-surface-variant font-biotif-pro">Supply Chain OS</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="px-6 py-2 text-on-surface hover:text-primary transition-colors font-biotif-pro"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors font-biotif-pro"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">

        {/* LAYER 1 — World Map background */}
        <div className="absolute inset-0 scale-110 opacity-30 sm:opacity-35 pointer-events-none select-none">
          <WorldMap dots={LOGISTICS_DOTS} lineColor="#0ea5e9" />
        </div>

        {/* LAYER 2 — Gradient + blur overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial vignette so edges fade to black */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,rgba(0,0,0,0.85)_100%)]" />
          {/* Top + bottom hard fades so map doesn't bleed into nav/stats */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
          {/* Left-side darkening so text stays readable */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </div>

        {/* LAYER 3 — Hero content (unchanged) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-7xl sm:text-8xl font-pepi-thin leading-none text-on-surface">
                  Supply Chain
                  <br />
                  <span className="text-primary">Reimagined</span>
                </h1>
                <p className="text-xl text-on-surface-variant max-w-xl font-biotif-pro">
                  The intelligent platform for modern logistics. Real-time tracking, predictive analytics,
                  and autonomous optimization—all in one place.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-primary text-on-primary font-biotif-pro font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 group w-fit"
                >
                  Launch Dashboard
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
                <Link
                  href="/signup"
                  className="px-8 py-4 border border-white/20 hover:border-white/40 text-on-surface font-biotif-pro font-semibold flex items-center justify-center transition-colors text-center"
                >
                  Start Free Trial
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Floating labels over the map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] lg:h-[600px] hidden md:block"
            >
              {/* Rotating border accent */}
              <motion.div
                className="absolute top-0 right-0 w-48 h-48 border-2 border-primary/20"
                animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              {/* Floating label — Live Tracking */}
              <motion.div
                className="absolute bottom-20 left-10 px-4 py-3 bg-surface-container-low/80 backdrop-blur-sm border border-white/10 max-w-xs"
                animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-sm font-biotif-pro text-on-surface-variant">
                  🚚 <span className="text-on-surface font-semibold">Live Tracking</span>
                </p>
              </motion.div>

              {/* Floating label — Real Analytics */}
              <motion.div
                className="absolute top-32 right-0 px-4 py-3 bg-surface-container-low/80 backdrop-blur-sm border border-white/10 max-w-xs"
                animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <p className="text-sm font-biotif-pro text-on-surface-variant">
                  📊 <span className="text-on-surface font-semibold">Real Analytics</span>
                </p>
              </motion.div>

              {/* Extra floating label — AI Route */}
              <motion.div
                className="absolute top-64 left-20 px-4 py-3 bg-violet-500/10 backdrop-blur-sm border border-violet-400/20 max-w-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.9, 0.4], y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              >
                <p className="text-sm font-biotif-pro text-violet-300/80">
                  🤖 <span className="font-semibold">AI Route Analysis</span>
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="border border-white/10 bg-surface-container-low/50 p-6"
              >
                <p className="text-3xl sm:text-4xl font-pepi-thin text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-on-surface-variant font-biotif-pro">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-pepi-thin text-on-surface mb-4">
            Powerful Features
          </h3>
          <p className="text-xl font-biotif-pro text-on-surface-variant max-w-2xl mx-auto">
            Everything you need to optimize your supply chain operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <LandingFlipCard
                front={{
                  icon: feature.icon,
                  title: feature.title,
                  description: feature.description,
                }}
                back={{ benefits: feature.benefits }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-pepi-thin text-on-surface mb-4">How It Works</h3>
          <p className="text-xl font-biotif-pro text-on-surface-variant max-w-2xl mx-auto">
            Get up and running in minutes with our intuitive platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: '01',
              title: 'Connect',
              desc: 'Link your suppliers, warehouses, and delivery partners',
              benefits: ['Easy API Integration', 'Third-party plugins', 'Quick onboarding']
            },
            {
              num: '02',
              title: 'Track',
              desc: 'Monitor shipments in real-time with GPS and sensors',
              benefits: ['Global coverage', 'IoT sensor data', 'Real-time sync']
            },
            {
              num: '03',
              title: 'Optimize',
              desc: 'Use AI insights to reduce costs and improve efficiency',
              benefits: ['Route optimization', 'Fuel efficiency', 'Predictive maintenance']
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <LandingFlipCard
                front={{
                  icon: <div className="text-5xl font-bold font-pepi-thin text-primary/30">{step.num}</div>,
                  title: step.title,
                  description: step.desc,
                }}
                back={{ benefits: step.benefits }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-5xl font-pepi-thin text-on-surface mb-4">
            Simple Pricing
          </h3>
          <p className="text-xl font-biotif-pro text-on-surface-variant max-w-2xl mx-auto">
            Choose the plan that fits your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter',
              price: '$99',
              features: [
                'Up to 100 shipments/month',
                'Basic tracking',
                'Email support',
              ],
              benefits: ['100 API Calls', 'Standard SLA', '1 User Account']
            },
            {
              name: 'Pro',
              price: '$299',
              features: [
                'Unlimited shipments',
                'Advanced analytics',
                'Priority support',
                'Custom integrations',
              ],
              benefits: ['Unlimited API Calls', '99.9% Uptime SLA', '5 User Accounts', 'Custom Webhooks']
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              features: [
                'Everything in Pro',
                'Dedicated account manager',
                'Custom solutions',
                'SLA guarantee',
              ],
              benefits: ['On-prem deployment', '24/7 Phone Support', 'Unlimited Users', 'Dedicated Success Manager']
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <LandingFlipCard
                front={{
                  title: plan.name,
                  description: `${plan.price} / mo`,
                  icon: (
                    <div className="space-y-2 mt-2">
                      {plan.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-2 text-left">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-sm text-on-surface-variant">{feature}</span>
                        </div>
                      ))}
                    </div>
                  ),
                }}
                back={{
                  items: plan.benefits,
                  content: (
                    <button className="w-full py-3 bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors text-sm">
                      Select Plan
                    </button>
                  ),
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="border border-white/10 bg-surface-container-low p-12 text-center space-y-8">
          <h2 className="text-5xl sm:text-6xl font-pepi-thin text-on-surface">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl font-biotif-pro text-on-surface-variant">
            Join thousands of logistics companies optimizing their operations.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-primary text-on-primary font-biotif-pro font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-xl font-pepi-thin text-on-surface mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-on-surface-variant text-sm font-biotif-pro">
                <li><Link href="#" className="hover:text-on-surface transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-on-surface transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-on-surface transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-pepi-thin text-on-surface mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-on-surface-variant text-sm font-biotif-pro">
                <li><Link href="#" className="hover:text-on-surface transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-on-surface transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-on-surface transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-pepi-thin text-on-surface mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-on-surface-variant text-sm font-biotif-pro">
                <li><Link href="#" className="hover:text-on-surface transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-on-surface transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-on-surface transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-pepi-thin text-on-surface mb-4">
                Follow
              </h4>
              <ul className="space-y-2 text-on-surface-variant text-sm font-biotif-pro">
                <li><Link href="#" className="hover:text-on-surface transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-on-surface transition-colors">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-on-surface transition-colors">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-on-surface-variant text-sm font-biotif-pro">
            <p>&copy; 2024 SmartLogistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
