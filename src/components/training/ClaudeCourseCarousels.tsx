import CourseCarousel from '@/components/home/CourseCarousel'
import { claudeCards } from '@/lib/catalogue'
import { TOC_DOMAINS } from '@/lib/toc-courses'

/** The Claude courses with a live trainer, one carousel per domain. Used on /claude and /training so the two always match. */
export default function ClaudeCourseCarousels({ className = 'bg-white' }: { className?: string }) {
  return (
    <section id="courses" className={`${className} px-6 py-16 lg:py-[90px]`}>
      <div className="max-w-[1080px] mx-auto">
        <h2 className="display-section text-center">Claude courses with a live trainer.</h2>
        <p className="lede mt-3.5 max-w-[620px] mx-auto text-center">Hands-on training, online or at your destination, with an outline, a promo video and a call with our team.</p>
        {TOC_DOMAINS.map(domain => (
          <div key={domain} className="mt-14">
            <h3 className="font-heading text-[22px] font-bold tracking-[-0.01em] text-gray-900 mb-5">{domain}</h3>
            <CourseCarousel cards={claudeCards(domain)} label={`${domain} courses`} />
          </div>
        ))}
      </div>
    </section>
  )
}
