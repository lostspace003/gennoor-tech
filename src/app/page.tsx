import { PersonJsonLd } from '@/components/JsonLd'
import HeroSection from '@/components/home/HeroSection'
import TrustedBy from '@/components/home/TrustedBy'
import TrustpilotWidget from '@/components/TrustpilotWidget'
import ServicePillars from '@/components/home/ServicePillars'
import Metrics from '@/components/home/Metrics'
import Testimonials from '@/components/home/Testimonials'
import POCShowcase from '@/components/home/POCShowcase'
import LatestBlog from '@/components/home/LatestBlog'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />

      {/* Hero Section */}
      <HeroSection />

      {/* Trusted By Strip */}
      <TrustedBy />

      {/* Trustpilot Reviews */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <TrustpilotWidget />
      </div>

      {/* Service Pillars */}
      <ServicePillars />

      {/* Proof Metrics */}
      <Metrics />

      {/* Testimonials */}
      <Testimonials />

      {/* POC Showcase */}
      <POCShowcase />

      {/* Latest Blog */}
      <LatestBlog />

      {/* Final CTA */}
      <CTASection />
    </>
  )
}