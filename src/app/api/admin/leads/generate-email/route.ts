import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { leadIds, context } = await request.json()

    // Generate personalized email draft
    const draft = `Subject: Transform Your Business with Gennoor Tech's Innovative Solutions

Dear [Name],

I hope this message finds you well. I'm reaching out from Gennoor Tech because I believe we can add significant value to your organization's digital transformation journey.

At Gennoor Tech, we've helped numerous companies like yours achieve:
• 40% increase in operational efficiency through AI-powered automation
• 60% reduction in manual processes with our custom solutions
• Seamless digital transformation with minimal disruption

Our comprehensive services include:
✓ AI & Machine Learning Integration
✓ Custom Software Development
✓ Cloud Migration & Infrastructure
✓ Process Automation & Optimization
✓ Enterprise Training & Support

What sets us apart:
• Proven track record with 100+ successful implementations
• Industry-leading expertise in cutting-edge technologies
• Personalized approach tailored to your specific needs
• Ongoing support and continuous improvement

I'd love to schedule a brief 15-minute call to understand your current challenges and explore how Gennoor Tech can help accelerate your growth.

Are you available for a quick discussion this week? I'm happy to work around your schedule.

Looking forward to connecting with you soon.

Best regards,
${session.user?.email?.split('@')[0] || 'Team Gennoor'}
Gennoor Tech

P.S. Feel free to check out our recent success stories at gennoor.com

---
CC: admin@gennoor.com
This email is automatically CC'd to admin for quality assurance and follow-up.`

    return NextResponse.json({ draft })
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    )
  }
}