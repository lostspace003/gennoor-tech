import { ArrowLeft, Code2, Zap, Shield, Rocket, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import POCDemoSection from './POCDemoSection'

export default function PoCDevelopmentPage() {
  const pocTypes = [
    {
      title: "Document Intelligence",
      description: "Extract insights from PDFs, invoices, contracts",
      tech: ["Azure Document Intelligence", "OCR", "NLP"],
      timeline: "2-4 weeks"
    },
    {
      title: "Intelligent Chatbots",
      description: "Customer service and internal support automation",
      tech: ["Azure OpenAI", "Copilot Studio", "LangChain"],
      timeline: "3-5 weeks"
    },
    {
      title: "Process Automation",
      description: "Workflow automation with AI decision-making",
      tech: ["Power Automate", "AI Builder", "Logic Apps"],
      timeline: "2-3 weeks"
    },
    {
      title: "Predictive Analytics",
      description: "Forecasting and anomaly detection solutions",
      tech: ["Azure ML", "Databricks", "Power BI"],
      timeline: "4-6 weeks"
    }
  ]

  const process = [
    {
      phase: "Discovery",
      description: "Understand use case and success criteria",
      deliverables: ["Requirements document", "Technical architecture"]
    },
    {
      phase: "Development",
      description: "Build MVP with core functionality",
      deliverables: ["Working prototype", "API documentation"]
    },
    {
      phase: "Validation",
      description: "Test with real data and refine",
      deliverables: ["Test results", "Performance metrics"]
    },
    {
      phase: "Handover",
      description: "Documentation and knowledge transfer",
      deliverables: ["Source code", "Deployment guide", "Training"]
    }
  ]

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Proof of Concept Development
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform ideas into working prototypes. We build production-ready PoCs that demonstrate
              real business value and can scale to full implementation.
            </p>
            <Link
              href="/contact#book"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Discuss Your PoC Idea
            </Link>
          </div>
        </div>
      </section>

      {/* Why PoC */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Start with a PoC?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Rapid Validation</h3>
              <p className="text-gray-600">Test feasibility and value in weeks, not months</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Minimize Risk</h3>
              <p className="text-gray-600">Small investment to validate before full rollout</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Accelerate Buy-in</h3>
              <p className="text-gray-600">Show tangible results to stakeholders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live POC Demo */}
      <POCDemoSection />

      {/* PoC Types */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Common PoC Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pocTypes.map((poc) => (
              <div key={poc.title} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start mb-4">
                  <Code2 className="w-6 h-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{poc.title}</h3>
                    <p className="text-gray-600 mb-4">{poc.description}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Technologies: </span>
                        <span className="text-sm text-gray-600">{poc.tech.join(", ")}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Timeline: </span>
                        <span className="text-sm text-primary-600">{poc.timeline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our PoC Development Process
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((phase, index) => (
                <div key={phase.phase} className="relative">
                  <div className="bg-white rounded-lg p-6 shadow-md h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold">{phase.phase}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{phase.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">Deliverables:</p>
                      {phase.deliverables.map((item) => (
                        <div key={item} className="flex items-start text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <div className="w-6 h-0.5 bg-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Technology Expertise
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Azure OpenAI", "LangChain", "Copilot Studio", "Power Platform",
                "Azure ML", "Document Intelligence", "Cognitive Services", "Databricks",
                "Python", "TypeScript", ".NET", "React",
                "FastAPI", "Next.js", "PostgreSQL", "CosmosDB"
              ].map((tech) => (
                <div key={tech} className="bg-white rounded-lg px-4 py-3 text-center shadow-sm">
                  <span className="text-sm font-medium text-gray-700">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Build Your AI Proof of Concept?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's turn your AI vision into a working prototype that demonstrates real value
          </p>
          <Link
            href="/contact#book"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Your PoC Project
          </Link>
        </div>
      </section>
    </main>
  )
}