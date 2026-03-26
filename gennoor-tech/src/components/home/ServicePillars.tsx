import Link from 'next/link'
import { Brain, GraduationCap, Code2, Bot, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const icons = {
  Strategy: Brain,
  GraduationCap: GraduationCap,
  Code2: Code2,
  Bot: Bot,
}

export default function ServicePillars() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How We Transform Organizations with AI
          </h2>
          <p className="text-lg text-gray-600">
            From strategic planning to hands-on implementation, delivering end-to-end AI transformation services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.services.map((service, index) => {
            const Icon = icons[service.icon as keyof typeof icons]
            return (
              <Link
                key={service.title}
                href={service.href}
                className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 block"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center text-primary-600 text-sm font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600/5 to-accent-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}