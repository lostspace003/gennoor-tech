import { NextResponse } from 'next/server'
import {
  createBookingAppointment,
  getBookingServices,
  getConfiguredBusinessId,
  type CreateAppointmentPayload,
} from '@/lib/microsoft-graph'
import { trackEvent, trackException, initAppInsights } from '@/lib/analytics'
import { saveEnquiry } from '@/lib/azure-storage'

export async function POST(request: Request) {
  try {
    initAppInsights()
    const body = await request.json()
    const {
      serviceId,
      date,
      startTime,
      endTime,
      timezone,
      name,
      email,
      whatsapp,
      topic,
    } = body

    if (!date || !startTime || !name || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: date, startTime, name, email' },
        { status: 400 },
      )
    }

    const businessId = getConfiguredBusinessId()

    const services = await getBookingServices(businessId)
    const service = serviceId
      ? services.find(s => s.id === serviceId)
      : services[0]

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'No booking service found' },
        { status: 404 },
      )
    }

    const durationMatch = service.defaultDuration?.match(/PT(\d+)H?(\d+)?M?/)
    const durationMinutes = durationMatch
      ? (parseInt(durationMatch[1] || '0') * 60) + parseInt(durationMatch[2] || '0')
      : 30

    const startDateTime = `${date}T${startTime}:00`
    const computedEnd = endTime
      ? `${date}T${endTime}:00`
      : (() => {
          const start = new Date(`${date}T${startTime}:00`)
          start.setMinutes(start.getMinutes() + durationMinutes)
          return start.toISOString().replace('Z', '').split('.')[0]
        })()

    const appointment: CreateAppointmentPayload = {
      serviceId: service.id,
      serviceName: service.displayName,
      startDateTime: {
        dateTime: startDateTime,
        timeZone: 'UTC',
      },
      endDateTime: {
        dateTime: computedEnd,
        timeZone: 'UTC',
      },
      isLocationOnline: true,
      customers: [
        {
          '@odata.type': '#microsoft.graph.bookingCustomerInformation',
          name,
          emailAddress: email,
          phone: whatsapp || '',
          notes: topic || '',
          timeZone: 'UTC',
        },
      ],
      customerNotes: [
        topic ? `Topic: ${topic}` : '',
        whatsapp ? `WhatsApp: ${whatsapp}` : '',
      ].filter(Boolean).join(' | '),
      optOutOfCustomerEmail: false,
    }

    const result = await createBookingAppointment(businessId, appointment)

    trackEvent('BookingCreated', {
      name,
      email,
      service: service.displayName,
      date,
      startTime,
    })

    await saveEnquiry('BookingAppointment', {
      name,
      email,
      whatsapp,
      topic,
      service: service.displayName,
      date,
      startTime,
      timezone,
      appointmentId: result.id,
      joinWebUrl: result.joinWebUrl || '',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      appointment: {
        id: result.id,
        joinUrl: result.joinWebUrl,
        startDateTime: result.startDateTime,
        endDateTime: result.endDateTime,
        service: service.displayName,
      },
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    trackException(
      error instanceof Error ? error : new Error(String(error)),
      { route: 'bookings/create' },
    )
    return NextResponse.json(
      { success: false, message: 'Failed to create booking. Please try again.' },
      { status: 500 },
    )
  }
}
