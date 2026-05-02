import { NextResponse } from 'next/server'
import { getBookingServices, getConfiguredBusinessId } from '@/lib/microsoft-graph'

export async function GET() {
  try {
    const businessId = getConfiguredBusinessId()
    const services = await getBookingServices(businessId)

    const formatted = services.map(svc => ({
      id: svc.id,
      name: svc.displayName,
      description: svc.description,
      duration: svc.defaultDuration,
      price: svc.defaultPrice,
      priceType: svc.defaultPriceType,
      isOnline: svc.isLocationOnline,
      staffIds: svc.staffMemberIds,
    }))

    return NextResponse.json({ success: true, services: formatted })
  } catch (error) {
    console.error('Error fetching booking services:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch services' },
      { status: 500 },
    )
  }
}
