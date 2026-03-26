import AnimatedLogoShowcase from '@/components/AnimatedLogoShowcase'

export const metadata = {
  title: 'Animated Logo Showcase | Gennoor Tech',
  description: 'View all animated logo variants and brand identity elements',
}

export default function LogoShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Animated Logo Showcase
            </h1>
            <p className="text-xl text-gray-600">
              Interactive brand identity with smooth animations and adaptive theming
            </p>
          </div>

          {/* Logo Showcase */}
          <AnimatedLogoShowcase />

          {/* Technical Details */}
          <div className="mt-16 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Animation Features
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Sequential Pop Animation:</strong> Each dot appears with a bouncing effect in sequence</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Pulse Effect:</strong> Continuous subtle pulsing after the initial animation</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Slide & Fade:</strong> Text elements slide in and fade to full opacity</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Glow Effect:</strong> Subtle glow animation on the entire logo</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Professional Design:</strong> Clean and modern appearance with brand colors</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">✓</span>
                <span><strong>Multiple Variants:</strong> Hero (video-aligned), horizontal, stacked, icon, and compact versions</span>
              </li>
            </ul>
          </div>

          {/* Usage Examples */}
          <div className="mt-8 p-8 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Usage in Components
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
              <code>{`import GennoorLogo from '@/components/GennoorLogo'

// Hero variant aligned to video width (512px)
<GennoorLogo variant="hero" />

// Horizontal variant for full-width sections (945px)
<GennoorLogo variant="horizontal" />

// Compact variant for navigation bars
<GennoorLogo variant="compact" />

// Icon variant for loading states
<GennoorLogo variant="icon" />

// Stacked variant for splash screens
<GennoorLogo variant="stacked" />`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}