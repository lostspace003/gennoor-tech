import Link from 'next/link'
import { Award, Linkedin, ArrowRight } from 'lucide-react'

export default function AuthorBio() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Jalal Ahmed Khan</h3>
          <p className="text-sm text-primary-600 font-medium mb-3">
            Microsoft Certified Trainer | Enterprise AI Consultant
          </p>
          <p className="text-gray-600 text-sm mb-4">
            14+ years of enterprise experience across 6 countries. Microsoft Certified Trainer with 16 active certifications.
            Trained 50+ C-suite leaders at Fortune 500 companies including Boeing, Saudi Aramco, HDFC Bank, and Siemens.
            Founder of Gennoor Tech — helping enterprises transform through practical AI solutions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about/journey"
              className="inline-flex items-center text-sm text-primary-600 font-medium hover:underline"
            >
              Read my story <ArrowRight className="ml-1 w-3 h-3" />
            </Link>
            <a
              href="https://www.linkedin.com/in/jalal-khan-b8319955/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600"
            >
              <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
