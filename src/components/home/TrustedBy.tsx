import Image from 'next/image'
import { siteConfig, BLOB_URL } from '@/lib/site-config'

// Company logo configurations
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
  'Wipro': { src: `${BLOB_URL}/logos/companies/wipro.svg`, width: 90, height: 35 }
}

export default function TrustedBy() {
  return (
    <section className="py-12 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-600 mb-8 uppercase tracking-wider">
          Trusted by Fortune 500 Companies & Government Bodies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
          {siteConfig.trustedBy.map((company, index) => {
            const logo = companyLogos[company]
            if (logo) {
              return (
                <div
                  key={company}
                  className="opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-300"
                  title={company}
                >
                  <Image
                    src={logo.src}
                    alt={`${company} logo`}
                    width={logo.width}
                    height={logo.height}
                    className="object-contain"
                  />
                </div>
              )
            }
            // Fallback to text display for companies without logos
            return (
              <div
                key={company}
                className="flex items-center justify-center h-10 px-6 bg-gray-100 rounded-lg"
                title={company}
              >
                <span className="text-lg font-semibold text-gray-600">{company}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}