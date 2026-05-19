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
import YouTubeVideos from '@/components/home/YouTubeVideos'
import LatestBlog from '@/components/home/LatestBlog'
import CTASection from '@/components/home/CTASection'
import AcademyCTA from '@/components/home/AcademyCTA'

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
        <TrustedBy />
      </ScrollReveal>

      <ScrollReveal>
        <ServicePillars />
      </ScrollReveal>

      <ScrollReveal>
        <Metrics />
      </ScrollReveal>

      <ScrollReveal>
        <POCShowcase />
      </ScrollReveal>

      <ScrollReveal>
        <AcademyCTA />
      </ScrollReveal>

      {/* Founder credibility — moved down to footer-of-page position */}
      <ScrollReveal>
        <IntroVideo />
      </ScrollReveal>

      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal>
        <YouTubeVideos />
      </ScrollReveal>

      <ScrollReveal>
        <LatestBlog />
      </ScrollReveal>

      <ScrollReveal>
        <CTASection />
      </ScrollReveal>
    </>
  )
}
