import { NextRequest, NextResponse } from 'next/server'
import {
  getBookingAppointments,
  cancelBookingAppointment,
  getConfiguredBusinessId,
} from '@/lib/microsoft-graph'
import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js'

function getGraphClient(): Client {
  const credential = new ClientSecretCredential(
    process.env.MS_GRAPH_TENANT_ID!,
    process.env.MS_GRAPH_CLIENT_ID!,
    process.env.MS_GRAPH_CLIENT_SECRET!,
  )
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  })
  return Client.initWithMiddleware({ authProvider })
}

export async function GET() {
  try {
    const businessId = getConfiguredBusinessId()
    const appointments = await getBookingAppointments(businessId)

    const formatted = appointments.map((apt: any) => ({
      id: apt.id,
      serviceName: apt.serviceName || 'Unknown Service',
      serviceId: apt.serviceId,
      startDateTime: apt.startDateTime,
      endDateTime: apt.endDateTime,
      duration: apt.duration,
      customerName: apt.customers?.[0]?.name || '',
      customerEmail: apt.customers?.[0]?.emailAddress || '',
      customerPhone: apt.customers?.[0]?.phone || '',
      customerNotes: apt.customerNotes || '',
      customerTimeZone: apt.customers?.[0]?.timeZone || '',
      staffMembers: apt.staffMemberIds || [],
      isLocationOnline: apt.isLocationOnline,
      joinWebUrl: apt.joinWebUrl || '',
      status: apt.status || 'booked',
      createdDateTime: apt.createdDateTime,
      lastUpdatedDateTime: apt.lastUpdatedDateTime,
    }))

    formatted.sort((a: any, b: any) => {
      const aDate = a.startDateTime?.dateTime || ''
      const bDate = b.startDateTime?.dateTime || ''
      return bDate.localeCompare(aDate)
    })

    return NextResponse.json({ success: true, appointments: formatted })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointments' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, action, cancellationMessage } = body
    const businessId = getConfiguredBusinessId()

    if (action === 'cancel') {
      await cancelBookingAppointment(
        businessId,
        appointmentId,
        cancellationMessage || 'This appointment has been cancelled by the organizer.',
      )
      return NextResponse.json({ success: true, message: 'Appointment cancelled' })
    }

    if (action === 'confirm') {
      const client = getGraphClient()
      await client
        .api(`/solutions/bookingBusinesses/${businessId}/appointments/${appointmentId}`)
        .patch({ status: 'confirmed' })
      return NextResponse.json({ success: true, message: 'Appointment confirmed' })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action. Use "cancel" or "confirm".' },
      { status: 400 },
    )
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update appointment' },
      { status: 500 },
    )
  }
}
