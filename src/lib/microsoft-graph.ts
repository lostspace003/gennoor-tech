import { ClientSecretCredential } from '@azure/identity'
import { Client } from '@microsoft/microsoft-graph-client'
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js'

let graphClient: Client | null = null

function getGraphClient(): Client {
  if (graphClient) return graphClient

  const tenantId = process.env.MS_GRAPH_TENANT_ID
  const clientId = process.env.MS_GRAPH_CLIENT_ID
  const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('Microsoft Graph credentials not configured. Set MS_GRAPH_TENANT_ID, MS_GRAPH_CLIENT_ID, MS_GRAPH_CLIENT_SECRET.')
  }

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret)
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  })

  graphClient = Client.initWithMiddleware({ authProvider })
  return graphClient
}

// ─── Booking Business ────────────────────────────────────────

export async function getBookingBusinesses() {
  const client = getGraphClient()
  const result = await client.api('/solutions/bookingBusinesses').get()
  return result.value as BookingBusiness[]
}

export async function getBookingBusiness(businessId: string) {
  const client = getGraphClient()
  return await client.api(`/solutions/bookingBusinesses/${businessId}`).get() as BookingBusiness
}

// ─── Services ────────────────────────────────────────────────

export async function getBookingServices(businessId: string) {
  const client = getGraphClient()
  const result = await client.api(`/solutions/bookingBusinesses/${businessId}/services`).get()
  return result.value as BookingService[]
}

export async function createBookingService(
  businessId: string,
  service: {
    displayName: string
    description?: string
    defaultDuration: string
    defaultPrice: number
    defaultPriceType: string
    isLocationOnline: boolean
    staffMemberIds: string[]
  },
) {
  const client = getGraphClient()
  return await client
    .api(`/solutions/bookingBusinesses/${businessId}/services`)
    .post(service)
}

export async function deleteBookingService(businessId: string, serviceId: string) {
  const client = getGraphClient()
  await client.api(`/solutions/bookingBusinesses/${businessId}/services/${serviceId}`).delete()
}

export async function updateBookingService(
  businessId: string,
  serviceId: string,
  updates: Partial<{
    displayName: string
    description: string
    defaultDuration: string
    defaultPrice: number
  }>,
) {
  const client = getGraphClient()
  return await client
    .api(`/solutions/bookingBusinesses/${businessId}/services/${serviceId}`)
    .patch(updates)
}

// ─── Staff Availability ──────────────────────────────────────

export async function getStaffAvailability(
  businessId: string,
  staffIds: string[],
  startDateTime: string,
  endDateTime: string,
) {
  const client = getGraphClient()
  const result = await client
    .api(`/solutions/bookingBusinesses/${businessId}/getStaffAvailability`)
    .post({
      staffIds,
      startDateTime: { dateTime: startDateTime, timeZone: 'UTC' },
      endDateTime: { dateTime: endDateTime, timeZone: 'UTC' },
    })
  return result.value as StaffAvailabilityItem[]
}

// ─── Appointments ────────────────────────────────────────────

export async function createBookingAppointment(
  businessId: string,
  appointment: CreateAppointmentPayload,
) {
  const client = getGraphClient()
  return await client
    .api(`/solutions/bookingBusinesses/${businessId}/appointments`)
    .post(appointment)
}

export async function getBookingAppointments(businessId: string) {
  const client = getGraphClient()
  const result = await client
    .api(`/solutions/bookingBusinesses/${businessId}/appointments`)
    .get()
  return result.value
}

export async function cancelBookingAppointment(
  businessId: string,
  appointmentId: string,
  cancellationMessage: string,
) {
  const client = getGraphClient()
  await client
    .api(`/solutions/bookingBusinesses/${businessId}/appointments/${appointmentId}/cancel`)
    .post({ cancellationMessage })
}

// ─── Helper: get configured business ID ──────────────────────

export function getConfiguredBusinessId(): string {
  const id = process.env.MS_BOOKINGS_BUSINESS_ID
  if (!id) throw new Error('MS_BOOKINGS_BUSINESS_ID not configured')
  return id
}

// ─── Types ───────────────────────────────────────────────────

export interface BookingBusiness {
  id: string
  displayName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    countryOrRegion: string
    postalCode: string
  }
  businessType: string
  webSiteUrl: string
  defaultCurrencyIso: string
  businessHours: BusinessHours[]
}

export interface BusinessHours {
  day: string
  timeSlots: { startTime: string; endTime: string }[]
}

export interface BookingService {
  id: string
  displayName: string
  description: string
  defaultDuration: string
  defaultPrice: number
  defaultPriceType: string
  isLocationOnline: boolean
  maximumAttendeesCount: number
  staffMemberIds: string[]
  isAnonymousJoinEnabled: boolean
}

export interface StaffAvailabilityItem {
  staffId: string
  availabilityItems: {
    status: string
    startDateTime: { dateTime: string; timeZone: string }
    endDateTime: { dateTime: string; timeZone: string }
    serviceId: string
  }[]
}

export interface CreateAppointmentPayload {
  serviceId: string
  serviceName: string
  serviceLocation?: {
    displayName: string
    locationType: string
  }
  startDateTime: { dateTime: string; timeZone: string }
  endDateTime: { dateTime: string; timeZone: string }
  isLocationOnline: boolean
  staffMemberIds?: string[]
  customers: {
    '@odata.type': '#microsoft.graph.bookingCustomerInformation'
    name: string
    emailAddress: string
    phone?: string
    notes?: string
    timeZone?: string
  }[]
  customerNotes?: string
  optOutOfCustomerEmail?: boolean
}
