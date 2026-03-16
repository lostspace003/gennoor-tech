import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function CTASection() {
  const benefits = [
    '14+ years of enterprise experience',
    'Hands-on PoC development',
    'Microsoft Certified Trainer',
    'Global delivery expertise'
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Bring AI to Your Organization?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Whether you need strategic guidance, team training, or hands-on implementation,
              I'm here to help you navigate your AI transformation journey.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center text-sm text-gray-700"
                >
                  <CheckCircle className="w-5 h-5 text-success mr-2 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact#book"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors group"
              >
                Book a Discovery Call
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-md text-primary-600 bg-white border-2 border-primary-600 hover:bg-primary-50 transition-colors"
              >
                Explore Services
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No commitment required • 30-minute consultation • Let's discuss your AI goals
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}