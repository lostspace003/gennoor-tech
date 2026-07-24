import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Authorized emails
const AUTHORIZED_EMAILS = [
  'admin@gennoor.com',
  'contact@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'jalalkhan@gennoor.com'
]

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !AUTHORIZED_EMAILS.includes(session.user?.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, context } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Simulate AI research response
    const lead = context?.selectedLead
    const companyName = lead?.Company || 'the company'
    const contactName = lead?.Name || 'the contact'

    // Generate mock research data
    const researchResult = {
      company: companyName,
      website: lead?.Website || `https://www.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      employees: '50-200',
      revenue: '₹10-50 Cr',
      industry: lead?.Industry || 'Technology',
      technologies: ['Cloud Services', 'Microsoft 365', 'Legacy Systems'],
      painPoints: [
        'Manual processes needing automation',
        'Lack of AI/ML implementation',
        'Cloud migration pending',
        'Employee training requirements'
      ],
      opportunities: [
        'AI enablement for process automation',
        'Cloud migration and optimization',
        'Employee upskilling programs',
        'Digital transformation initiatives'
      ]
    }

    // Generate email draft
    const emailDraft = `Subject: Transform ${companyName}'s Operations with AI - Exclusive Webinar Invite

To: ${contactName}
From: ${session.user?.email}
CC: admin@gennoor.com

---

Dear ${contactName},

I hope this message finds you well. I'm reaching out from Gennoor Tech regarding an exciting opportunity for ${companyName}.

Based on our research, we've identified that ${companyName} could significantly benefit from:
• AI-powered process automation (40% efficiency gain potential)
• Cloud migration and optimization services
• Custom training programs for your team

We'd like to offer you a **FREE 1-day exclusive webinar** for your organization, covering:
- Latest AI/ML implementation strategies
- Microsoft Azure & cloud solutions
- Hands-on demonstrations
- ROI analysis for your specific use cases

Would you be available for a 15-minute call this week to discuss how we can help ${companyName} achieve its digital transformation goals?

Best regards,
${session.user?.email?.split('@')[0]}
Gennoor Tech

P.S. This exclusive webinar offer is limited - secure your spot today!

---
This email is CC'd to admin@gennoor.com for quality assurance.`

    // Return structured response
    return NextResponse.json({
      response: `Research completed for ${companyName}. I've analyzed their profile and drafted a personalized outreach email. The company appears to be a good fit for our AI enablement and cloud migration services.`,
      researchResult,
      emailDraft,
      metadata: {
        model: 'gpt-4-simulation',
        timestamp: new Date().toISOString(),
        user: session.user?.email,
        note: 'This is simulated data. Configure OpenAI API key for real AI research.'
      }
    })

  } catch (error) {
    console.error('Error in AI research:', error)
    return NextResponse.json({
      error: 'Research service temporarily unavailable',
      details: 'Please try again or contact admin@gennoor.com'
    }, { status: 500 })
  }
}