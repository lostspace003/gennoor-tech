import HeroSection from '@/components/home/HeroSection'
import TrustedBy from '@/components/home/TrustedBy'
import ServicePillars from '@/components/home/ServicePillars'
import Metrics from '@/components/home/Metrics'
import Testimonials from '@/components/home/Testimonials'
import LatestBlog from '@/components/home/LatestBlog'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Trusted By Strip */}
      <TrustedBy />

      {/* Service Pillars */}
      <ServicePillars />

      {/* Proof Metrics */}
      <Metrics />

      {/* Testimonials */}
      <Testimonials />

      {/* Latest Blog */}
      <LatestBlog />

      {/* Final CTA */}
      <CTASection />
    </>
  )
}