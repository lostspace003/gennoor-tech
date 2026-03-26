import { NextResponse } from 'next/server'
import { sendTrainingEnquiryEmail } from '@/lib/email-service'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { saveEnquiry } from '@/lib/azure-storage'

export async function POST(request: Request) {
  try {
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
