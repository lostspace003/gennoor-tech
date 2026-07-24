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

    const { leadIds, content, cc } = await request.json()

    // Log email send attempt
    console.log('Sending email to leads:', {
      leadCount: leadIds.length,
      sender: session.user?.email,
      cc: cc || 'admin@gennoor.com',
      timestamp: new Date().toISOString()
    })

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    // For now, simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Log success
    const emailLog = {
      id: `EMAIL-${Date.now()}`,
      leadIds,
      sender: session.user?.email,
      cc: 'admin@gennoor.com',
      content,
      status: 'sent',
      sentAt: new Date().toISOString()
    }

    console.log('Email sent successfully:', emailLog)

    return NextResponse.json({
      success: true,
      message: `Email sent to ${leadIds.length} leads`,
      emailId: emailLog.id,
      cc: 'admin@gennoor.com'
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}