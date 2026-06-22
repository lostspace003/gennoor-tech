import { NextRequest, NextResponse } from 'next/server'
import {
  createBookingAppointment,
  cancelBookingAppointment,
  getBookingServices,
  getConfiguredBusinessId,
  type CreateAppointmentPayload,
} from '@/lib/microsoft-graph'
import { getPendingBookings, updatePendingBooking, deletePendingBooking } from '@/lib/azure-storage'
import { sendEmail } from '@/lib/email-service'
import { trackEvent, initAppInsights } from '@/lib/analytics'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

// User-supplied values (booking form fields, admin free text) get interpolated
// into email HTML — escape them so markup/scripts can't be injected.
const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Human-friendly date/time for emails. date = 'YYYY-MM-DD', time = 'HH:MM' (UTC).
function formatWhen(date: string, time: string, durationMinutes: number) {
  const start = new Date(`${date}T${time}:00Z`)
  const end = new Date(start.getTime() + durationMinutes * 60000)
  const clock = (d: Date) => {
    let h = d.getUTCHours()
    const m = d.getUTCMinutes()
    const ampm = h < 12 ? 'AM' : 'PM'
    h = h % 12 || 12
    return `${h}:${String(m).padStart(2, '0')} ${ampm}`
  }
  return {
    dateLabel: `${WEEKDAYS[start.getUTCDay()]}, ${start.getUTCDate()} ${MONTHS[start.getUTCMonth()]} ${start.getUTCFullYear()}`,
    timeLabel: `${clock(start)} – ${clock(end)} (UTC)`,
    durationLabel: durationMinutes >= 60 ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 ? (durationMinutes % 60) + 'm' : ''}`.trim() : `${durationMinutes} minutes`,
  }
}

export async function GET(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

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
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  try {
    initAppInsights()
    const body = await request.json()
    const { rowKey, action, message: adminMessage, newDate, newStartTime, newEndTime, notes, subject, replyBody } = body

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
        optOutOfCustomerEmail: true,
      }

      const result = await createBookingAppointment(businessId, appointment)

      await updatePendingBooking(rowKey, {
        status: 'accepted',
        graphAppointmentId: result.id,
        joinWebUrl: result.joinWebUrl || '',
        acceptedAt: new Date().toISOString(),
      })

      const when = formatWhen(booking.date, booking.startTime, durationMinutes)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'
      const row = (label: string, value: string) =>
        `<tr>
          <td style="padding:10px 14px;border-bottom:1px solid #eef2f7;font-size:13px;color:#64748b;width:120px;vertical-align:top">${label}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #eef2f7;font-size:14px;color:#0f172a;font-weight:600">${value}</td>
        </tr>`

      await sendEmail({
        to: booking.email,
        from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
        subject: `Confirmed: ${service.displayName} with Jalal Khan — ${when.dateLabel}`,
        html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;padding:24px 12px;margin:0">
            <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0">
              <!-- header -->
              <div style="background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);padding:34px 28px;text-align:center">
                <div style="font-size:30px;line-height:1;margin-bottom:8px">✅</div>
                <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700">Your call is confirmed</h1>
                <p style="color:#dbeafe;margin:6px 0 0;font-size:14px">Gennoor Tech · ${esc(service.displayName)}</p>
              </div>
              <!-- body -->
              <div style="padding:30px 28px">
                <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 22px">
                  Hi <strong>${esc(booking.name)}</strong>, thanks for booking time with us. Your session with
                  <strong>Jalal Khan</strong> is locked in — everything you need is below.
                </p>

                <!-- details card -->
                <table style="width:100%;border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin:0 0 24px">
                  ${row('Service', esc(service.displayName))}
                  ${row('Date', when.dateLabel)}
                  ${row('Time', when.timeLabel)}
                  ${row('Duration', when.durationLabel)}
                  ${row('Host', 'Jalal Khan · Founder &amp; Principal AI Consultant, Gennoor Tech')}
                  ${row('Format', 'Online · Microsoft Teams (link below)')}
                  ${booking.topic ? row('Your topic', esc(booking.topic)) : ''}
                </table>

                ${result.joinWebUrl ? `
                  <div style="text-align:center;margin:0 0 26px">
                    <a href="${result.joinWebUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:9px;font-size:15px;font-weight:700">
                      Join Microsoft Teams Meeting
                    </a>
                    <p style="color:#94a3b8;font-size:12px;margin:10px 0 0">A calendar invite with this link has also been emailed to you — save it to your calendar.</p>
                  </div>
                ` : ''}

                <!-- what to expect -->
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:18px 20px;margin:0 0 22px">
                  <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1e3a8a">What to expect</p>
                  <ul style="margin:0;padding-left:18px;color:#1e40af;font-size:13px;line-height:1.9">
                    <li>A focused ${when.durationLabel} conversation about your goals and questions.</li>
                    <li>Practical, no-obligation guidance tailored to your situation.</li>
                    <li>Clear next steps and recommended options by the end of the call.</li>
                  </ul>
                </div>

                <!-- prep -->
                <p style="color:#475569;font-size:13px;line-height:1.7;margin:0 0 22px">
                  <strong style="color:#0f172a">To get the most out of it:</strong> join from a quiet spot with a stable connection,
                  and jot down any specific challenges or outcomes you'd like to cover.
                </p>

                <!-- reschedule -->
                <div style="border-top:1px solid #e5e7eb;padding-top:18px;margin:0 0 8px">
                  <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">
                    Need to reschedule or can't make it?
                    <a href="${siteUrl}/resources/calendar" style="color:#2563eb;font-weight:600;text-decoration:none">Pick a new time here</a>,
                    or just reply to this email.
                  </p>
                </div>

                <!-- contact -->
                <div style="margin-top:20px">
                  <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f172a">Get in touch</p>
                  <table style="width:100%;color:#475569;font-size:13px;line-height:1.9">
                    <tr><td style="width:90px;color:#94a3b8">Email</td><td><a href="mailto:schedule@gennoor.com" style="color:#2563eb;text-decoration:none">schedule@gennoor.com</a></td></tr>
                    <tr><td style="color:#94a3b8">WhatsApp</td><td><a href="https://wa.me/919326352241" style="color:#2563eb;text-decoration:none">+91 93263 52241</a></td></tr>
                    <tr><td style="color:#94a3b8">Website</td><td><a href="${siteUrl}" style="color:#2563eb;text-decoration:none">www.gennoor.com</a></td></tr>
                  </table>
                </div>
              </div>

              <!-- footer -->
              <div style="background:#0f172a;padding:22px 28px;text-align:center">
                <p style="color:#cbd5e1;margin:0;font-size:13px;font-weight:600">Gennoor Tech</p>
                <p style="color:#64748b;margin:5px 0 0;font-size:11px">Enterprise AI Training, Certification &amp; Solutions</p>
                <p style="color:#475569;margin:8px 0 0;font-size:11px">© ${new Date().getFullYear()} Gennoor Tech. See you on the call!</p>
              </div>
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
        subject: `Booking update — ${esc(booking.serviceName)}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#1e3a5f;padding:24px 28px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Gennoor Tech</h1>
            </div>
            <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Hi <strong>${esc(booking.name)}</strong>,
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Unfortunately, we&rsquo;re unable to confirm your booking for <strong>${esc(booking.serviceName)}</strong> on ${booking.date} at ${booking.startTime} UTC.
              </p>
              ${adminMessage ? `
                <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin:0 0 16px">
                  <p style="margin:0;font-size:14px;color:#92400e">${esc(adminMessage)}</p>
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
        subject: `Please reschedule — ${esc(booking.serviceName)}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#1e3a5f;padding:24px 28px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Gennoor Tech</h1>
            </div>
            <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Hi <strong>${esc(booking.name)}</strong>,
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                We&rsquo;d love to meet, but the requested time for <strong>${esc(booking.serviceName)}</strong> on ${booking.date} at ${booking.startTime} UTC doesn&rsquo;t work for us.
              </p>
              ${adminMessage ? `
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;margin:0 0 16px">
                  <p style="margin:0;font-size:14px;color:#1e40af"><strong>Message from Jalal:</strong> ${esc(adminMessage)}</p>
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

    // ── CANCEL (accepted booking) ──
    if (action === 'cancel') {
      if (!booking.graphAppointmentId) {
        return NextResponse.json({ success: false, message: 'No Graph appointment to cancel.' }, { status: 400 })
      }

      const businessId = getConfiguredBusinessId()
      await cancelBookingAppointment(businessId, booking.graphAppointmentId, adminMessage || 'This appointment has been cancelled.')

      await updatePendingBooking(rowKey, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        adminMessage: adminMessage || '',
      })

      await sendEmail({
        to: booking.email,
        from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
        subject: `Cancelled: ${esc(booking.serviceName)} with Jalal Khan`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#991b1b;padding:24px 28px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Booking Cancelled</h1>
            </div>
            <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Hi <strong>${esc(booking.name)}</strong>,
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Your booking for <strong>${esc(booking.serviceName)}</strong> on ${booking.date} at ${booking.startTime} UTC has been cancelled.
              </p>
              ${adminMessage ? `
                <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin:0 0 16px">
                  <p style="margin:0;font-size:14px;color:#991b1b">${esc(adminMessage)}</p>
                </div>
              ` : ''}
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Feel free to book a new time:
              </p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'}/resources/calendar" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600">
                Book Another Time
              </a>
            </div>
          </div>
        `,
      }).catch(() => {})

      trackEvent('BookingCancelled', { name: booking.name, email: booking.email })

      return NextResponse.json({ success: true, message: 'Booking cancelled. Calendar event removed and customer notified.' })
    }

    // ── RESCHEDULE (accepted booking) ──
    if (action === 'reschedule') {
      if (!newDate || !newStartTime) {
        return NextResponse.json({ success: false, message: 'newDate and newStartTime are required for reschedule.' }, { status: 400 })
      }

      const businessId = getConfiguredBusinessId()

      if (booking.graphAppointmentId) {
        await cancelBookingAppointment(businessId, booking.graphAppointmentId, 'Rescheduled to a new time.').catch(() => {})
      }

      const services = await getBookingServices(businessId)
      const service = services.find(s => s.id === booking.serviceId) || services[0]

      const durationMatch = service?.defaultDuration?.match(/PT(\d+)H?(\d+)?M?/)
      const durationMinutes = durationMatch
        ? (parseInt(durationMatch[1] || '0') * 60) + parseInt(durationMatch[2] || '0')
        : 30

      const startDateTime = `${newDate}T${newStartTime}:00`
      const computedEnd = newEndTime && newEndTime !== newStartTime
        ? `${newDate}T${newEndTime}:00`
        : (() => {
            const start = new Date(`${newDate}T${newStartTime}:00Z`)
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
        optOutOfCustomerEmail: true,
      }

      const result = await createBookingAppointment(businessId, appointment)

      await updatePendingBooking(rowKey, {
        status: 'accepted',
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime || newStartTime,
        graphAppointmentId: result.id,
        joinWebUrl: result.joinWebUrl || '',
        rescheduledAt: new Date().toISOString(),
        adminMessage: adminMessage || '',
      })

      await sendEmail({
        to: booking.email,
        from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
        subject: `Rescheduled: ${service.displayName} with Jalal Khan`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#065f46;padding:24px 28px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Booking Rescheduled</h1>
            </div>
            <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Hi <strong>${esc(booking.name)}</strong>, your meeting has been rescheduled to a new time.
              </p>
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:0 0 16px">
                <p style="margin:0 0 6px;font-size:14px;color:#111827"><strong>${service.displayName}</strong></p>
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280">New Date: <strong style="color:#374151">${newDate}</strong></p>
                <p style="margin:0 0 4px;font-size:13px;color:#6b7280">New Time: <strong style="color:#374151">${newStartTime} UTC</strong></p>
                <p style="margin:0;font-size:13px;color:#6b7280">With: <strong style="color:#374151">Jalal Khan</strong></p>
              </div>
              ${result.joinWebUrl ? `
                <a href="${result.joinWebUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;margin:0 0 16px">
                  Join Teams Meeting
                </a>
              ` : ''}
              ${adminMessage ? `
                <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;margin:0 0 16px">
                  <p style="margin:0;font-size:14px;color:#1e40af"><strong>Note from Jalal:</strong> ${esc(adminMessage)}</p>
                </div>
              ` : ''}
              <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:16px 0 0">
                An updated calendar invite has been sent to your email.
              </p>
            </div>
          </div>
        `,
      }).catch(() => {})

      trackEvent('BookingRescheduled', { name: booking.name, email: booking.email, newDate, newStartTime })

      return NextResponse.json({
        success: true,
        message: 'Booking rescheduled. New calendar event created and customer notified.',
        joinWebUrl: result.joinWebUrl,
      })
    }

    // ── UPDATE NOTES ──
    if (action === 'update-notes') {
      await updatePendingBooking(rowKey, { outcomeNotes: notes || '[]' })
      return NextResponse.json({ success: true, message: 'Notes updated.' })
    }

    // ── SEND REPLY ──
    if (action === 'send-reply') {
      if (!replyBody) {
        return NextResponse.json({ success: false, message: 'replyBody is required.' }, { status: 400 })
      }

      await sendEmail({
        to: booking.email,
        from: process.env.EMAIL_FROM_SCHEDULE || 'schedule@gennoor.com',
        subject: subject || `Re: ${esc(booking.serviceName)}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#1e3a5f;padding:24px 28px;border-radius:12px 12px 0 0">
              <h1 style="color:#fff;margin:0;font-size:20px">Gennoor Tech</h1>
            </div>
            <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
                Hi <strong>${esc(booking.name)}</strong>,
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px;white-space:pre-wrap">
                ${esc(replyBody)}
              </p>
              <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:16px 0 0">
                Best regards,<br />Jalal Khan<br />Gennoor Tech
              </p>
            </div>
          </div>
        `,
      })

      trackEvent('BookingReplyEmail', { name: booking.name, email: booking.email })

      return NextResponse.json({ success: true, message: 'Reply sent.' })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action.' },
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

export async function DELETE(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  try {
    const { rowKeys } = await request.json()
    if (!Array.isArray(rowKeys) || rowKeys.length === 0) {
      return NextResponse.json(
        { success: false, message: 'rowKeys array is required' },
        { status: 400 },
      )
    }

    const results = await Promise.allSettled(
      rowKeys.map(key => deletePendingBooking(key))
    )

    const deleted = results.filter(r => r.status === 'fulfilled').length
    return NextResponse.json({ success: true, message: `${deleted} booking(s) deleted.`, deleted })
  } catch (error) {
    console.error('Error deleting bookings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete bookings' },
      { status: 500 },
    )
  }
}
