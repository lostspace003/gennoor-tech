import { NextResponse } from 'next/server'
import { getBookingServices, getConfiguredBusinessId } from '@/lib/microsoft-graph'
import { trackEvent, initAppInsights } from '@/lib/analytics'
import { savePendingBooking } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: Request) {
  try {
    initAppInsights()
    const body = await request.json()
    const { serviceId, date, startTime, endTime, timezone, name, email, whatsapp, topic, country } = body

    if (!date || !startTime || !name || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: date, startTime, name, email' },
        { status: 400 },
      )
    }

    const businessId = getConfiguredBusinessId()
    const services = await getBookingServices(businessId)
    const service = serviceId ? services.find(s => s.id === serviceId) : services[0]

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'No booking service found' },
        { status: 404 },
      )
    }

    const booking = await savePendingBooking({
      serviceId: service.id,
      serviceName: service.displayName,
      date,
      startTime,
      endTime: endTime || startTime,
      timezone: timezone || 'UTC',
      name,
      email,
      whatsapp: whatsapp || '',
      topic: topic || '',
      country: country || '',
    })

    await sendEmail({
      to: email,
      from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
      subject: `Booking request received — ${service.displayName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#1e3a5f;padding:24px 28px;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px">Gennoor Tech</h1>
          </div>
          <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
              Hi <strong>${name}</strong>,
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
              We&rsquo;ve received your booking request. Our team will review and confirm shortly.
            </p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:0 0 16px">
              <p style="margin:0 0 6px;font-size:14px;color:#6b7280"><strong style="color:#111827">${service.displayName}</strong></p>
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Date: <strong style="color:#374151">${date}</strong></p>
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Time: <strong style="color:#374151">${startTime} UTC</strong></p>
              <p style="margin:0;font-size:13px;color:#6b7280">With: <strong style="color:#374151">Jalal Khan</strong></p>
            </div>
            <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:0">
              You&rsquo;ll receive a confirmation email with a Microsoft Teams meeting link once approved.
            </p>
          </div>
        </div>
      `,
    }).catch(() => {})

    const adminEmail = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'
    await sendEmail({
      to: adminEmail,
      from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
      subject: `New booking request: ${name} — ${service.displayName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#1e3a5f;padding:24px 28px;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px">New Booking Request</h1>
          </div>
          <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
            <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin:0 0 16px">
              <p style="margin:0;font-size:14px;color:#92400e"><strong>Action required:</strong> Review and accept/reject this booking.</p>
            </div>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:0 0 16px">
              <p style="margin:0 0 6px;font-size:14px;color:#111827"><strong>${service.displayName}</strong></p>
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Customer: <strong style="color:#374151">${name}</strong></p>
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Email: <strong style="color:#374151">${email}</strong></p>
              ${whatsapp ? `<p style="margin:0 0 4px;font-size:13px;color:#6b7280">WhatsApp: <strong style="color:#374151">${whatsapp}</strong></p>` : ''}
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Date: <strong style="color:#374151">${date}</strong></p>
              <p style="margin:0 0 4px;font-size:13px;color:#6b7280">Time: <strong style="color:#374151">${startTime} – ${endTime} UTC</strong></p>
              ${topic ? `<p style="margin:0;font-size:13px;color:#6b7280">Topic: <strong style="color:#374151">${topic}</strong></p>` : ''}
            </div>
            <a href="${siteUrl}/admin" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600">
              Open Dashboard
            </a>
          </div>
        </div>
      `,
    }).catch(() => {})

    trackEvent('BookingRequestCreated', { name, email, service: service.displayName, date, startTime })

    return NextResponse.json({
      success: true,
      message: 'Booking request received. You will be notified once confirmed.',
      bookingId: booking.rowKey,
    })
  } catch (error) {
    console.error('Error creating booking request:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit booking request. Please try again.' },
      { status: 500 },
    )
  }
}
