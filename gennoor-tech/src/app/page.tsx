import { PersonJsonLd } from '@/components/JsonLd'
import ScrollReveal from '@/components/ScrollReveal'
import HeroSection from '@/components/home/HeroSection'
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

      <ScrollReveal>
        <TrustedBy />
      </ScrollReveal>

      <ScrollReveal>
        <ServicePillars />
      </ScrollReveal>

      <ScrollReveal>
        <IntroVideo />
      </ScrollReveal>

      <ScrollReveal>
        <Metrics />
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
