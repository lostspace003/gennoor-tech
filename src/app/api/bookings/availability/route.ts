import { NextRequest, NextResponse } from 'next/server'
import {
  getStaffAvailability,
  getBookingServices,
  getConfiguredBusinessId,
} from '@/lib/microsoft-graph'

const JALAL_KHAN_STAFF_ID = 'd0598bb5-a70c-4145-9007-6b5f7370a60d'

const IST_START_HOUR = 9
const IST_END_HOUR = 18

function toIST(utcDateStr: string): Date {
  const utc = new Date(utcDateStr + (utcDateStr.endsWith('Z') ? '' : 'Z'))
  return new Date(utc.getTime() + 5.5 * 60 * 60 * 1000)
}

function isWithinISTBusinessHours(utcStart: string, utcEnd: string): boolean {
  const istStart = toIST(utcStart)
  const istEnd = toIST(utcEnd)
  const startHour = istStart.getUTCHours() + istStart.getUTCMinutes() / 60
  const endHour = istEnd.getUTCHours() + istEnd.getUTCMinutes() / 60
  return startHour >= IST_START_HOUR && endHour <= IST_END_HOUR
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')
    const timezone = searchParams.get('timezone') || 'UTC'

    if (!date) {
      return NextResponse.json(
        { success: false, message: 'date parameter is required (YYYY-MM-DD)' },
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

    const startDateTime = `${date}T00:00:00`
    const endDateTime = `${date}T23:59:59`

    const availability = await getStaffAvailability(
      businessId,
      [JALAL_KHAN_STAFF_ID],
      startDateTime,
      endDateTime,
    )

    const slots: { start: string; end: string; status: string }[] = []
    for (const staff of availability) {
      for (const item of staff.availabilityItems) {
        if (
          item.status === 'available' &&
          isWithinISTBusinessHours(item.startDateTime.dateTime, item.endDateTime.dateTime)
        ) {
          slots.push({
            start: item.startDateTime.dateTime,
            end: item.endDateTime.dateTime,
            status: item.status,
          })
        }
      }
    }

    slots.sort((a, b) => a.start.localeCompare(b.start))

    return NextResponse.json({
      success: true,
      date,
      timezone,
      service: {
        id: service.id,
        name: service.displayName,
        duration: service.defaultDuration,
      },
      slots,
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch availability' },
      { status: 500 },
    )
  }
}
