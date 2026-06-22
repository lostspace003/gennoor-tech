import { NextRequest, NextResponse } from 'next/server'
import {
  getStaffAvailability,
  getBookingServices,
  getConfiguredBusinessId,
} from '@/lib/microsoft-graph'

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const IST_START_HOUR = 9
const IST_END_HOUR = 18

function isSlotWithinISTBusinessHours(utcStart: Date, utcEnd: Date): boolean {
  const istStart = new Date(utcStart.getTime() + IST_OFFSET_MS)
  const istEnd = new Date(utcEnd.getTime() + IST_OFFSET_MS)
  const startHour = istStart.getUTCHours() + istStart.getUTCMinutes() / 60
  const endHour = istEnd.getUTCHours() + istEnd.getUTCMinutes() / 60
  return (
    startHour >= IST_START_HOUR &&
    endHour <= IST_END_HOUR &&
    istStart.getUTCDate() === istEnd.getUTCDate()
  )
}

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return 30
  return (parseInt(match[1] || '0') * 60) + parseInt(match[2] || '0')
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

    const durationMinutes = parseDuration(service.defaultDuration)
    const durationMs = durationMinutes * 60 * 1000

    const startDateTime = `${date}T00:00:00`
    const endDateTime = `${date}T23:59:59`

    // Derive staff from the service itself so this never goes stale when the
    // Bookings business / staff are recreated (the old hardcoded id broke here).
    const staffIds = service.staffMemberIds?.length ? service.staffMemberIds : []
    if (staffIds.length === 0) {
      return NextResponse.json({
        success: true,
        date,
        timezone,
        service: { id: service.id, name: service.displayName, duration: service.defaultDuration },
        slots: [],
      })
    }

    const availability = await getStaffAvailability(
      businessId,
      staffIds,
      startDateTime,
      endDateTime,
    )

    const slots: { start: string; end: string; status: string }[] = []

    for (const staff of availability) {
      for (const item of staff.availabilityItems) {
        if (item.status !== 'available') continue

        const blockStart = new Date(
          item.startDateTime.dateTime + (item.startDateTime.dateTime.endsWith('Z') ? '' : 'Z'),
        )
        const blockEnd = new Date(
          item.endDateTime.dateTime + (item.endDateTime.dateTime.endsWith('Z') ? '' : 'Z'),
        )

        let cursor = new Date(blockStart)
        while (cursor.getTime() + durationMs <= blockEnd.getTime()) {
          const slotEnd = new Date(cursor.getTime() + durationMs)

          if (isSlotWithinISTBusinessHours(cursor, slotEnd)) {
            slots.push({
              start: cursor.toISOString().split('.')[0],
              end: slotEnd.toISOString().split('.')[0],
              status: 'available',
            })
          }

          cursor = slotEnd
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
