// Tech-call booking: the slots we offer, the visitor's time zone, and the record we store.
// Calls are only offered 6:00-9:00 pm IST (30-minute calls); visitors see them in their own zone.
import { IST, istInstant, leadTimeZone } from '@/lib/crm/timezones'

export const TECH_CALL_TYPE = 'TechCall'
export const SLOT_MINUTES = 30
export const SLOT_STARTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'] // IST wall clock; last call ends 9:00 pm
export const DAYS_AHEAD = 14

export const COUNTRIES = [
  'India', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Egypt', 'Turkey',
  'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand', 'Vietnam',
  'Japan', 'South Korea', 'China', 'Hong Kong', 'Taiwan', 'United Kingdom', 'Ireland', 'Germany', 'France', 'Netherlands',
  'Belgium', 'Spain', 'Italy', 'Portugal', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland',
  'Czech Republic', 'Greece', 'Romania', 'Hungary', 'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile',
  'Colombia', 'Peru', 'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Morocco', 'Australia', 'New Zealand',
]

export type TechCallStatus = 'pending' | 'approved' | 'declined'

/** IANA zone for a country; IST when we cannot map it (the visitor then sees IST times). */
export function zoneForCountry(country: string, city?: string): string {
  return leadTimeZone(country, city) || IST
}

/** Today's date (IST) plus n days as YYYY-MM-DD, skipping nothing: every day has the same evening window. */
export function offeredDates(now = new Date()): string[] {
  const out: string[] = []
  const ist = new Date(now.getTime() + 5.5 * 3600_000)
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + i))
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

/** A slot is bookable if it is one of ours, on an offered date, and still at least 2 hours away. */
export function isOfferedSlot(date: string, time: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !SLOT_STARTS.includes(time)) return false
  if (!offeredDates(now).includes(date)) return false
  return istInstant(date, time).getTime() - now.getTime() > 2 * 3600_000
}

export function slotKey(date: string, time: string): string {
  return `${date} ${time}`
}
