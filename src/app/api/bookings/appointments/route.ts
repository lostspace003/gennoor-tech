import { NextRequest, NextResponse } from 'next/server'
import {
  createBookingAppointment,
  getBookingServices,
  getConfiguredBusinessId,
  type CreateAppointmentPayload,
} from '@/lib/microsoft-graph'
import { getPendingBookings, updatePendingBooking } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'
import { trackEvent, initAppInsights } from '@/lib/analytics'

export async function GET() {
  try {
    const bookings = await getPendingBookings()
    return NextResponse.json({ success: true, appointments: bookings })
  } catch (error) {
    console.error('Error fetching pending bookings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    initAppInsights()
    const body = await request.json()
    const { rowKey, action, message: adminMessage } = body

    if (!rowKey || !action) {
      return NextResponse.json(
        { success: false, message: 'rowKey and action are required' },
        { status: 400 },
      )
    }

    const bookings = await getPendingBookings()
    const booking = bookings.find(b => b.rowKey === rowKey)
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 },
      )
    }

    // ── ACCEPT ──
    if (action === 'accept') {
      const businessId = getConfiguredBusinessId()
      const services = await getBookingServices(businessId)
      const service = services.find(s => s.id === booking.serviceId) || services[0]

      const durationMatch = service?.defaultDuration?.match(/PT(\d+)H?(\d+)?M?/)
      const durationMinutes = durationMatch
        ? (parseInt(durationMatch[1] || '0') * 60) + parseInt(durationMatch[2] || '0')
        : 30

      const startDateTime = `${booking.date}T${booking.startTime}:00`
      const computedEnd = booking.endTime && booking.endTime !== booking.startTime
        ? `${booking.date}T${booking.endTime}:00`
        : (() => {
            const start = new Date(`${booking.date}T${booking.startTime}:00Z`)
            start.setMinutes(start.getMinutes() + durationMinutes)
            return start.toISOString().split('.')[0]
          })()

      const appointment: CreateAppointmentPayload = {
        serviceId: service.id,
        serviceName: service.displayName,
        startDateTime: { dateTime: startDateTime, timeZone: 'UTC' },
        endDateTime: { dateTime: computedEnd, timeZone: 'UTC' },
        isLocationOnline: true,
        staffMemberIds: service.staffMemberIds?.length ? service.staffMemberIds : undefined,
        customers: [{
          '@odata.type': '#microsoft.graph.bookingCustomerInformation',
          name: booking.name,
          emailAddress: booking.email,
          phone: booking.whatsapp || '',
          notes: booking.topic || '',
          timeZone: 'UTC',
        }],
        customerNotes: [
          booking.topic ? `Topic: ${booking.topic}` : '',
          booking.whatsapp ? `WhatsApp: ${booking.whatsapp}` : '',
        ].filter(Boolean).join(' | '),
        optOutOfCustomerEmail: false,
      }

      const result = await createBookingAppointment(businessId, appointment)

      await updatePendingBooking(rowKey, {
        status: 'accepted',
        graphAppointmentId: result.id,
        joinWebUrl: result.joinWebUrl || '',
        acceptedAt: new Date().toISOString(),
      })

      await sendEmail({
        to: booking.email,
        from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
        subject: `Confirmed: ${service.displayName} with Jalal Khan`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#065f46;padding:24px 28px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Booking Confirmed!</h1>
            </div>
            <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Hi <strong>${booking.name}</strong>, your meeting has been confirmed.
              </p>
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:0 0 16px">
                <p style="margin:0 0 6px;font-size:14px;color:#111827"><strong>${service.displayName}</strong></p>
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Date: <strong style="color:#374151">${booking.date}</strong></p>
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Time: <strong style="color:#374151">${booking.startTime} UTC</strong></p>
                <p style="margin:0;font-size:13px;color:#6b7280">With: <strong style="color:#374151">Jalal Khan</strong></p>
              </div>
              ${result.joinWebUrl ? `
                <a href="${result.joinWebUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;margin:0 0 16px">
                  Join Teams Meeting
                </a>
              ` : ''}
              <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:16px 0 0">
                A calendar invite has also been sent to your email.
              </p>
            </div>
          </div>
        `,
      }).catch(() => {})

      trackEvent('BookingAccepted', { name: booking.name, email: booking.email, service: service.displayName })

      return NextResponse.json({
        success: true,
        message: 'Booking confirmed. Customer notified with Teams link.',
        joinWebUrl: result.joinWebUrl,
      })
    }

    // ── REJECT ──
    if (action === 'reject') {
      await updatePendingBooking(rowKey, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        adminMessage: adminMessage || '',
      })

      await sendEmail({
        to: booking.email,
        from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
        subject: `Booking update — ${booking.serviceName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#1e3a5f;padding:24px 28px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Gennoor Tech</h1>
            </div>
            <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Hi <strong>${booking.name}</strong>,
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Unfortunately, we&rsquo;re unable to confirm your booking for <strong>${booking.serviceName}</strong> on ${booking.date} at ${booking.startTime} UTC.
              </p>
              ${adminMessage ? `
                <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin:0 0 16px">
                  <p style="margin:0;font-size:14px;color:#92400e">${adminMessage}</p>
                </div>
              ` : ''}
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Please feel free to book a different slot:
              </p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'}/resources/calendar" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600">
                Book Another Time
              </a>
            </div>
          </div>
        `,
      }).catch(() => {})

      trackEvent('BookingRejected', { name: booking.name, email: booking.email })

      return NextResponse.json({ success: true, message: 'Booking rejected. Customer notified.' })
    }

    // ── SUGGEST CHANGE ──
    if (action === 'suggest-change') {
      await updatePendingBooking(rowKey, {
        status: 'change-requested',
        adminMessage: adminMessage || 'Please pick a different time.',
        changeRequestedAt: new Date().toISOString(),
      })

      await sendEmail({
        to: booking.email,
        from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
        subject: `Please reschedule — ${booking.serviceName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#1e3a5f;padding:24px 28px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Gennoor Tech</h1>
            </div>
            <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Hi <strong>${booking.name}</strong>,
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                We&rsquo;d love to meet, but the requested time for <strong>${booking.serviceName}</strong> on ${booking.date} at ${booking.startTime} UTC doesn&rsquo;t work for us.
              </p>
              ${adminMessage ? `
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;margin:0 0 16px">
                  <p style="margin:0;font-size:14px;color:#1e40af"><strong>Message from Jalal:</strong> ${adminMessage}</p>
                </div>
              ` : ''}
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Please pick a new time that works for you:
              </p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'}/resources/calendar" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600">
                Reschedule
              </a>
            </div>
          </div>
        `,
      }).catch(() => {})

      trackEvent('BookingChangeRequested', { name: booking.name, email: booking.email })

      return NextResponse.json({ success: true, message: 'Change suggestion sent to customer.' })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action. Use "accept", "reject", or "suggest-change".' },
      { status: 400 },
    )
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update booking' },
      { status: 500 },
    )
  }
}
