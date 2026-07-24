import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { EmailClient } from '@azure/communication-email'

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING || ''

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { leadId, type, title, date, time, materials } = await request.json()

    // Create follow-up record
    const followUp = {
      id: `FOLLOWUP-${Date.now()}`,
      leadId,
      type, // 'webinar' | 'call' | 'email'
      title,
      scheduledDate: date,
      scheduledTime: time,
      materials: materials || [],
      reminderSent: false,
      completed: false,
      createdBy: session.user?.email,
      createdAt: new Date().toISOString()
    }

    // Schedule calendar invite
    if (type === 'webinar') {
      // Create calendar event content
      const calendarContent = {
        subject: `Webinar: ${title}`,
        start: new Date(`${date}T${time}`),
        duration: 120, // 2 hours for webinar
        location: 'Microsoft Teams',
        description: `
          Join us for an exclusive webinar on AI transformation.

          Agenda:
          - Introduction to AI Solutions
          - Live Demo
          - Q&A Session

          Materials will be shared during the session.
        `
      }

      // Send calendar invite via email
      if (!connectionString) {
        console.log('Email service not configured - skipping invite')
        return NextResponse.json({ success: true, followUp, emailSkipped: true })
      }
      const emailClient = new EmailClient(connectionString)
      const emailMessage = {
        senderAddress: 'DoNotReply@gennoor.com',
        recipients: {
          to: [{ address: leadId }], // Assuming leadId is email
          cc: [{ address: 'admin@gennoor.com' }]
        },
        content: {
          subject: `Webinar Invitation: ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>You're Invited to Our Exclusive Webinar</h2>
              <h3>${title}</h3>
              <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${time} IST</p>
              <p><strong>Duration:</strong> 2 Hours</p>
              <p><strong>Platform:</strong> Microsoft Teams</p>

              <div style="background: #f0f9ff; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <p><strong>What You'll Learn:</strong></p>
                <ul>
                  <li>AI Strategy for Your Business</li>
                  <li>Live Demonstrations</li>
                  <li>Implementation Roadmap</li>
                  <li>Q&A with Experts</li>
                </ul>
              </div>

              <p>The Teams link will be shared 30 minutes before the webinar.</p>

              <p>Best regards,<br/>Team Gennoor</p>
            </div>
          `
        }
      }

      await emailClient.beginSend(emailMessage)
    }

    return NextResponse.json({
      success: true,
      followUp
    })

  } catch (error) {
    console.error('Schedule follow-up error:', error)
    return NextResponse.json({ error: 'Failed to schedule follow-up' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get upcoming follow-ups
    // In production, this would query the database
    const mockFollowUps = [
      {
        id: 'FOLLOWUP-001',
        type: 'webinar',
        title: 'AI Transformation Strategy',
        scheduledDate: new Date().toISOString(),
        scheduledTime: '14:00',
        reminderSent: false,
        completed: false
      }
    ]

    return NextResponse.json({ followUps: mockFollowUps })

  } catch (error) {
    console.error('Get follow-ups error:', error)
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 })
  }
}