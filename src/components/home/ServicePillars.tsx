'use client'

import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'

/**
 * "What we do." — four quiet white cards on the #f5f5f7 panel, per the Home
 * prototype's Services section. Data stays in siteConfig.services.
 */

export default function ServicePillars() {
  return (
    <section className="bg-[#f5f5f7] py-16 lg:py-24 px-8">
      <div className="max-w-[1080px] mx-auto">
        <h2 className="display-section text-center mb-3">What we do.</h2>
        <p className="lede text-center mb-14">
          Strategy, training, and working software. Priced up front.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteConfig.services.map(service => (
            <Link
              key={service.title}
              href={service.href}
              className="bg-white border border-[#e8e8ed] hover:border-[#d2d2d7] rounded-[18px] px-6 py-7 flex flex-col text-gray-900 transition-colors"
            >
              <div className="text-[17px] font-bold mb-2">{service.title}</div>
              <div className="text-[13px] leading-normal text-[#6e6e73] mb-[18px]">
                {service.description}
              </div>
              <div className="text-[13px] font-semibold text-primary-600 mt-auto">
                Learn more ›
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
