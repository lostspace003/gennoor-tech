import { PersonJsonLd } from '@/components/JsonLd'
import ScrollReveal from '@/components/ScrollReveal'
import HeroSection from '@/components/home/HeroSection'
import GennoorWay from '@/components/home/GennoorWay'
import DualAudienceSelector from '@/components/home/DualAudienceSelector'
import TrustedBy from '@/components/home/TrustedBy'
import ServicePillars from '@/components/home/ServicePillars'
import IntroVideo from '@/components/home/IntroVideo'
import Metrics from '@/components/home/Metrics'
import Testimonials from '@/components/home/Testimonials'
import POCShowcase from '@/components/home/POCShowcase'
import FeaturedBuild from '@/components/home/FeaturedBuild'
import FeaturedNanheMomin from '@/components/home/FeaturedNanheMomin'
import YouTubeVideos from '@/components/home/YouTubeVideos'
import AIin45SecondsShorts from '@/components/home/AIin45SecondsShorts'
import LatestBlog from '@/components/home/LatestBlog'
import CTASection from '@/components/home/CTASection'
import AcademyCTA from '@/components/home/AcademyCTA'
import { ClaudePartnerStrip } from '@/components/ClaudePartner'

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />

      <HeroSection />

      {/* The methodology — the centerpiece of the new positioning */}
      <ScrollReveal>
        <GennoorWay />
      </ScrollReveal>

      {/* SMB vs Enterprise track selector */}
      <ScrollReveal>
        <DualAudienceSelector />
      </ScrollReveal>

      <ScrollReveal>
        <ServicePillars />
      </ScrollReveal>

      <Metrics />

      <ClaudePartnerStrip />

      <ScrollReveal>
        <TrustedBy />
      </ScrollReveal>

      <ScrollReveal>
        <AcademyCTA />
      </ScrollReveal>

      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal>
        <POCShowcase />
      </ScrollReveal>

      {/* Founder credibility — anchored toward the footer of the page */}
      <ScrollReveal>
        <IntroVideo />
      </ScrollReveal>

      <ScrollReveal>
        <YouTubeVideos />
      </ScrollReveal>

      <ScrollReveal>
        <AIin45SecondsShorts />
      </ScrollReveal>

      <ScrollReveal>
        <LatestBlog />
      </ScrollReveal>

      <ScrollReveal>
        <CTASection />
      </ScrollReveal>

      {/* Flagship product we shipped end-to-end — anchored just below the CTA */}
      <ScrollReveal>
        <FeaturedBuild />
      </ScrollReveal>

      {/* Newest PoC — an animated series produced end-to-end by our AI pipeline */}
      <ScrollReveal>
        <FeaturedNanheMomin />
      </ScrollReveal>
    </>
  )
}
