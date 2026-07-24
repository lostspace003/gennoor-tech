import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// Professional color palette
const colors = {
  primary: '#2563eb',    // Blue
  secondary: '#7c3aed',  // Purple
  accent: '#06b6d4',     // Cyan
  dark: '#1e293b',       // Dark slate
  light: '#f8fafc',      // Light background
  gradient1: '#3b82f6',  // Blue gradient
  gradient2: '#8b5cf6',  // Purple gradient
}

export class PDFGenerator {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
  }

  // Generate professional 2-page deck
  async generateDeck(type: 'technical' | 'non-technical', lead: any) {
    this.doc = new jsPDF()

    // Page 1 - Cover Page
    this.createCoverPage(type, lead)

    // Page 2 - Content Page
    this.doc.addPage()
    if (type === 'technical') {
      this.createTechnicalContent(lead)
    } else {
      this.createNonTechnicalContent(lead)
    }

    return this.doc.output('blob')
  }

  private createCoverPage(type: string, lead: any) {
    const doc = this.doc

    // Gradient background effect
    doc.setFillColor(37, 99, 235) // Primary blue
    doc.rect(0, 0, 210, 100, 'F')

    // Diagonal accent
    doc.setFillColor(124, 58, 237) // Secondary purple
    doc.triangle(0, 50, 0, 100, 100, 100, 'F')

    // Logo area (circular design like Gennoor)
    doc.setFillColor(255, 255, 255)
    doc.circle(30, 30, 15, 'F')

    // Gennoor Tech text logo
    doc.setTextColor(37, 99, 235)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('G', 27, 33)

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text('Gennoor Tech', 50, 30)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('TRAIN. INNOVATE. BUILD.', 50, 38)

    // Main title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    const title = type === 'technical'
      ? 'AI Technical Solutions'
      : 'AI Business Transformation'
    doc.text(title, 105, 65, { align: 'center' })

    // Subtitle
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('Customized for ' + (lead?.company || 'Your Organization'), 105, 78, { align: 'center' })

    // Content boxes with modern design
    const boxes = [
      { icon: '🎯', title: 'Strategic Approach', y: 120 },
      { icon: '🚀', title: 'Rapid Implementation', y: 150 },
      { icon: '📊', title: 'Measurable Results', y: 180 },
      { icon: '🔒', title: 'Enterprise Security', y: 210 }
    ]

    boxes.forEach(box => {
      // Box background
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(20, box.y - 10, 170, 25, 3, 3, 'F')

      // Icon background
      doc.setFillColor(37, 99, 235, 20)
      doc.circle(35, box.y, 8, 'F')

      // Icon
      doc.setFontSize(16)
      doc.text(box.icon, 31, box.y + 3)

      // Title
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(box.title, 50, box.y)

      // Description
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(100, 116, 139)
      const desc = this.getBoxDescription(box.title, type)
      doc.text(desc, 50, box.y + 7)
    })

    // Footer
    doc.setFillColor(30, 41, 59)
    doc.rect(0, 270, 210, 27, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.text('www.gennoor.com', 35, 283)
    doc.text('contact@gennoor.com', 105, 283, { align: 'center' })
    doc.text('+91 9326352241', 175, 283, { align: 'right' })
  }

  private createTechnicalContent(lead: any) {
    const doc = this.doc

    // Header with gradient
    doc.setFillColor(37, 99, 235)
    doc.rect(0, 0, 210, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Technical Implementation Roadmap', 105, 25, { align: 'center' })

    // Architecture diagram section
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(15, 50, 180, 80, 5, 5, 'F')

    doc.setTextColor(30, 41, 59)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('🏗️ System Architecture', 25, 65)

    // Architecture components
    const components = [
      { name: 'Azure AI Foundry', tech: 'GPT-4, Custom Models', x: 30, y: 85 },
      { name: 'Copilot Studio', tech: 'Agent Development', x: 110, y: 85 },
      { name: 'Power Platform', tech: 'Low-Code Solutions', x: 30, y: 105 },
      { name: 'Azure DevOps', tech: 'CI/CD Pipeline', x: 110, y: 105 }
    ]

    components.forEach(comp => {
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(comp.x, comp.y - 7, 70, 18, 2, 2, 'F')

      doc.setTextColor(37, 99, 235)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(comp.name, comp.x + 35, comp.y, { align: 'center' })

      doc.setTextColor(100, 116, 139)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(comp.tech, comp.x + 35, comp.y + 5, { align: 'center' })
    })

    // Technical specifications
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('⚙️ Technical Specifications', 25, 150)

    const specs = [
      ['Technology Stack', 'Azure AI, .NET Core, React, TypeScript'],
      ['Security', 'OAuth 2.0, Azure AD, End-to-End Encryption'],
      ['Scalability', 'Auto-scaling, Load Balancing, CDN'],
      ['Integration', 'REST APIs, GraphQL, Webhooks'],
      ['Performance', 'Sub-second response, 99.9% uptime'],
      ['Compliance', 'ISO 27001, GDPR, SOC 2']
    ]

    specs.forEach((spec, index) => {
      const y = 165 + (index * 15)

      doc.setFillColor(248, 250, 252)
      doc.rect(25, y - 5, 160, 12, 'F')

      doc.setTextColor(37, 99, 235)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(spec[0], 30, y)

      doc.setTextColor(71, 85, 105)
      doc.setFont('helvetica', 'normal')
      doc.text(spec[1], 70, y)
    })

    // Call to action
    doc.setFillColor(124, 58, 237)
    doc.roundedRect(40, 255, 130, 30, 5, 5, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Schedule Technical Deep Dive', 105, 268, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Let our architects design your solution', 105, 276, { align: 'center' })
  }

  private createNonTechnicalContent(lead: any) {
    const doc = this.doc

    // Header with gradient
    doc.setFillColor(124, 58, 237)
    doc.rect(0, 0, 210, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Business Value & ROI', 105, 25, { align: 'center' })

    // Value propositions with icons
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('💰 Expected Business Impact', 25, 55)

    const impacts = [
      { metric: '40%', desc: 'Productivity Increase', icon: '📈' },
      { metric: '60%', desc: 'Cost Reduction', icon: '💵' },
      { metric: '3x', desc: 'Faster Decision Making', icon: '⚡' },
      { metric: '85%', desc: 'Customer Satisfaction', icon: '😊' }
    ]

    impacts.forEach((impact, index) => {
      const x = 25 + (index % 2) * 90
      const y = 70 + Math.floor(index / 2) * 35

      doc.setFillColor(248, 250, 252)
      doc.roundedRect(x, y, 80, 30, 3, 3, 'F')

      // Icon
      doc.setFontSize(20)
      doc.text(impact.icon, x + 10, y + 18)

      // Metric
      doc.setTextColor(37, 99, 235)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(impact.metric, x + 30, y + 12)

      // Description
      doc.setTextColor(71, 85, 105)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(impact.desc, x + 30, y + 22)
    })

    // Success stories section
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('🏆 Success Stories', 25, 155)

    const stories = [
      {
        company: 'Global Bank',
        result: 'Automated 70% of customer queries',
        saving: '₹5 Cr annual savings'
      },
      {
        company: 'Healthcare Provider',
        result: 'Reduced diagnosis time by 50%',
        saving: '10,000+ patients served'
      },
      {
        company: 'Retail Chain',
        result: 'Improved inventory accuracy to 99%',
        saving: '₹2 Cr inventory cost saved'
      }
    ]

    stories.forEach((story, index) => {
      const y = 170 + (index * 25)

      doc.setFillColor(248, 250, 252)
      doc.roundedRect(25, y - 5, 160, 20, 3, 3, 'F')

      doc.setTextColor(124, 58, 237)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(story.company, 30, y)

      doc.setTextColor(71, 85, 105)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(story.result, 30, y + 6)

      doc.setTextColor(34, 197, 94)
      doc.setFont('helvetica', 'bold')
      doc.text(story.saving, 30, y + 12)
    })

    // Next steps
    doc.setFillColor(37, 99, 235)
    doc.roundedRect(40, 255, 130, 30, 5, 5, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Start Your AI Journey', 105, 268, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Book a discovery call today', 105, 276, { align: 'center' })
  }

  private getBoxDescription(title: string, type: string): string {
    const descriptions: any = {
      technical: {
        'Strategic Approach': 'Architecture-first design with scalable microservices',
        'Rapid Implementation': 'Agile sprints with CI/CD automation',
        'Measurable Results': 'Performance metrics and system monitoring',
        'Enterprise Security': 'Zero-trust architecture with Azure AD'
      },
      'non-technical': {
        'Strategic Approach': 'Align AI with your business goals',
        'Rapid Implementation': 'Go live in weeks, not months',
        'Measurable Results': 'Track ROI from day one',
        'Enterprise Security': 'Bank-grade security for your data'
      }
    }

    return descriptions[type === 'technical' ? 'technical' : 'non-technical'][title] || ''
  }
}

// Extend jsPDF with custom methods
declare module 'jspdf' {
  interface jsPDF {
    triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style: string): void
    roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style: string): void
    circle(x: number, y: number, r: number, style: string): void
  }
}

// Add triangle method
;(jsPDF as any).API.triangle = function(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style: string) {
  this.triangle(x1, y1, x2, y2, x3, y3, style)
}