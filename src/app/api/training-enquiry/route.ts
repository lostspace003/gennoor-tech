import { NextResponse } from 'next/server'
import { sendTrainingEnquiryEmail } from '@/lib/email-service'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`training-enquiry:${ip}`, 5, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 })
    }
    initAppInsights()
    const body = await request.json()
    const {
      name,
      email,
      phone,
      company,
      designation,
      trainingFor,
      teamSize,
      timeline,
      message,
      programTitle,
      programType,
      requestedFile,
      timestamp
    } = body

    // Every field is a short piece of text, whatever the browser sent
    for (const [key, max] of [['name', 120], ['email', 200], ['phone', 40], ['company', 160], ['designation', 120], ['trainingFor', 40], ['teamSize', 40], ['timeline', 40], ['message', 3000], ['programTitle', 200], ['programType', 40], ['requestedFile', 400], ['timestamp', 40]] as const) {
      const value = body[key]
      if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > max)) {
        return NextResponse.json({ success: false, message: 'Please check the form and try again.' }, { status: 400 })
      }
    }

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name and a valid email address.' },
        { status: 400 }
      )
    }

    console.log('Training Enquiry Received:', {
      name, email, phone, company, designation, trainingFor, teamSize,
      timeline, message, programTitle, programType, requestedFile, timestamp
    })

    trackEvent('TrainingEnquiry', {
      name, email, company: company || '', designation: designation || '',
      trainingFor: trainingFor || '', teamSize: teamSize || '',
      timeline: timeline || '', programTitle: programTitle || '',
      programType: programType || '',
    })

    // Save to Azure Table Storage
    const leadScore = timeline === 'immediate' || timeline === '1-month' ? 'HOT' : timeline === '2-months' ? 'WARM' : 'COLD'
    await saveEnquiry('TrainingEnquiry', {
      name, email, phone, company, designation, trainingFor, teamSize,
      timeline, message, programTitle, programType, leadScore, timestamp,
    })

    // Send emails using the email service
    await sendTrainingEnquiryEmail({
      name,
      email,
      phone,
      company,
      designation,
      trainingFor,
      teamSize,
      timeline,
      message,
      programTitle,
      programType,
      requestedFile
    })

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully. Course details will be sent to your email.'
    })

  } catch (error) {
    console.error('Error processing enquiry:', error)
    trackException(error instanceof Error ? error : new Error(String(error)), { route: 'training-enquiry' })
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process enquiry. Please try again.'
      },
      { status: 500 }
    )
  }
}
