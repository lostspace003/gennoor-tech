'use client'

import Image from 'next/image'
import { siteConfig, BLOB_URL } from '@/lib/site-config'
import { motion } from 'framer-motion'

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
    <section className="py-14 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-400 mb-10 uppercase tracking-[0.2em]">
          Trusted by Fortune 500 Companies & Government Bodies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14">
          {siteConfig.trustedBy.map((company, index) => {
            const logo = companyLogos[company]
            if (logo) {
              return (
                <motion.div
                  key={company}
                  className="opacity-40 hover:opacity-80 transition-all duration-500"
                  title={company}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 0.4, y: 0 }}
                  whileHover={{ opacity: 0.8, scale: 1.08 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <Image
                    src={logo.src}
                    alt={`${company} logo`}
                    width={logo.width}
                    height={logo.height}
                    className="object-contain grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </motion.div>
              )
            }
            return (
              <div
                key={company}
                className="flex items-center justify-center h-10 px-6 rounded-xl glass-card"
                title={company}
              >
                <span className="text-lg font-semibold text-gray-500">{company}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
