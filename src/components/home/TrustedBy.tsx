'use client'

import Image from 'next/image'
import { siteConfig, BLOB_URL } from '@/lib/site-config'

/**
 * "Teams we've trained at" — a quiet grayscale logo band with a hairline
 * bottom border, per the Home prototype's Trusted-by section. The real
 * company logo assets are kept (the prototype fell back to text).
 */

const companyLogos: Record<string, { src: string; width: number; height: number }> = {
  'Microsoft': { src: `${BLOB_URL}/logos/companies/microsoft.svg`, width: 160, height: 35 },
  'IBM': { src: `${BLOB_URL}/logos/companies/ibm.svg`, width: 80, height: 35 },
  'EY': { src: `${BLOB_URL}/logos/companies/ey.svg`, width: 60, height: 35 },
  'Boeing': { src: `${BLOB_URL}/logos/companies/boeing.svg`, width: 120, height: 35 },
  'Saudi Aramco': { src: `${BLOB_URL}/logos/companies/saudi-aramco.svg`, width: 120, height: 35 },
  'HDFC Bank': { src: `${BLOB_URL}/logos/companies/hdfc.svg`, width: 120, height: 35 },
  'Siemens': { src: `${BLOB_URL}/logos/companies/siemens.svg`, width: 100, height: 35 },
  'TCS': { src: `${BLOB_URL}/logos/companies/tcs.svg`, width: 80, height: 35 },
  'Capgemini': { src: `${BLOB_URL}/logos/companies/capgemini.svg`, width: 120, height: 35 },
  'Wipro': { src: `${BLOB_URL}/logos/companies/wipro.svg`, width: 90, height: 35 },
}

export default function TrustedBy() {
  return (
    <section className="bg-white py-[72px] px-8 border-b border-[#e8e8ed]">
      <div className="max-w-[1080px] mx-auto text-center">
        <div className="kicker !tracking-[0.14em] mb-6">Teams we&rsquo;ve trained at</div>
        <div className="flex flex-wrap justify-center items-center gap-y-3.5 gap-x-9">
          {siteConfig.trustedBy.map(company => {
            const logo = companyLogos[company]
            if (logo) {
              return (
                <div
                  key={company}
                  title={company}
                  className="opacity-40 hover:opacity-80 transition-opacity duration-300"
                >
                  <Image
                    src={logo.src}
                    alt={`${company} logo`}
                    width={logo.width}
                    height={logo.height}
                    className="object-contain grayscale"
                  />
                </div>
              )
            }
            return (
              <span key={company} title={company} className="text-[17px] font-semibold text-[#a1a1a6]">
                {company}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
