import { siteConfig } from '@/lib/site-config'

const metrics = [
  {
    value: siteConfig.metrics.trainingPrograms,
    label: 'Training Programs Delivered',
    description: 'Across Fortune 500 companies'
  },
  {
    value: siteConfig.metrics.certifications,
    label: 'Active Microsoft Certifications',
    description: 'Held by our team'
  },
  {
    value: siteConfig.metrics.cSuiteLeaders,
    label: 'C-Suite Leaders Trained',
    description: 'In AI strategy & adoption'
  },
  {
    value: siteConfig.metrics.countries,
    label: 'Countries',
    description: 'Global delivery footprint'
  },
]

export default function Metrics() {
  return (
    <section className="section-padding bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-6 py-2 mb-4 text-xl font-semibold bg-white/10 backdrop-blur-sm text-white rounded-full">
            <span className="flex h-3 w-3 rounded-full bg-white mr-2 animate-pulse" />
            Gennoor Tech — By the Numbers
          </div>
          <p className="text-blue-100 text-lg max-w-3xl mx-auto">
            Delivering AI transformation for enterprises worldwide
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {metric.value}
                </div>
                <div className="text-blue-100 font-semibold mb-1">
                  {metric.label}
                </div>
                <div className="text-blue-200/80 text-sm">
                  {metric.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}