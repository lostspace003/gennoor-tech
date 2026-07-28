// Country/city → IANA time zone for leads, plus IST anchoring helpers.
// The CRM team works in IST; leads are worldwide. Every schedule picker treats
// the selected wall-clock time as IST and converts for display/email from the
// lead's country (city wins for multi-zone countries like the US).

export const IST = 'Asia/Kolkata'

// Selected date+time are ALWAYS Indian Standard Time, regardless of the
// browser or server time zone (Azure runs UTC — a bare `new Date(...)` there
// silently shifts the time by 5h30m).
export function istInstant(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+05:30`)
}

// An ISO instant → the IST wall-clock date/time strings the pickers use.
export function isoToIstParts(iso: string): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date(iso))
  const get = (t: string) => parts.find((p) => p.type === t)?.value || ''
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` }
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')

// City overrides first — matters for multi-zone countries (US, Canada,
// Australia...). Single-zone countries resolve via COUNTRY_TZ.
const CITY_TZ: Record<string, string> = {
  newyork: 'America/New_York', boston: 'America/New_York', miami: 'America/New_York', atlanta: 'America/New_York', washington: 'America/New_York', washingtondc: 'America/New_York',
  chicago: 'America/Chicago', austin: 'America/Chicago', dallas: 'America/Chicago', houston: 'America/Chicago',
  denver: 'America/Denver', phoenix: 'America/Phoenix',
  sanfrancisco: 'America/Los_Angeles', losangeles: 'America/Los_Angeles', seattle: 'America/Los_Angeles', sandiego: 'America/Los_Angeles',
  toronto: 'America/Toronto', montreal: 'America/Toronto', ottawa: 'America/Toronto',
  vancouver: 'America/Vancouver', calgary: 'America/Edmonton',
  sydney: 'Australia/Sydney', melbourne: 'Australia/Melbourne', brisbane: 'Australia/Brisbane', perth: 'Australia/Perth', adelaide: 'Australia/Adelaide',
}

const COUNTRY_TZ: Record<string, string> = {
  india: IST, bharat: IST,
  // Gulf & Middle East
  saudiarabia: 'Asia/Riyadh', ksa: 'Asia/Riyadh', kingdomofsaudiarabia: 'Asia/Riyadh',
  uae: 'Asia/Dubai', unitedarabemirates: 'Asia/Dubai',
  qatar: 'Asia/Qatar', kuwait: 'Asia/Kuwait', bahrain: 'Asia/Bahrain', oman: 'Asia/Muscat',
  jordan: 'Asia/Amman', lebanon: 'Asia/Beirut', iraq: 'Asia/Baghdad', israel: 'Asia/Jerusalem',
  egypt: 'Africa/Cairo', turkey: 'Europe/Istanbul', turkiye: 'Europe/Istanbul', iran: 'Asia/Tehran',
  // South Asia
  pakistan: 'Asia/Karachi', bangladesh: 'Asia/Dhaka', srilanka: 'Asia/Colombo', nepal: 'Asia/Kathmandu',
  // Southeast & East Asia
  singapore: 'Asia/Singapore', malaysia: 'Asia/Kuala_Lumpur', indonesia: 'Asia/Jakarta',
  philippines: 'Asia/Manila', thailand: 'Asia/Bangkok', vietnam: 'Asia/Ho_Chi_Minh',
  japan: 'Asia/Tokyo', southkorea: 'Asia/Seoul', korea: 'Asia/Seoul',
  china: 'Asia/Shanghai', hongkong: 'Asia/Hong_Kong', taiwan: 'Asia/Taipei',
  // Europe
  unitedkingdom: 'Europe/London', uk: 'Europe/London', england: 'Europe/London', greatbritain: 'Europe/London', scotland: 'Europe/London', ireland: 'Europe/Dublin',
  germany: 'Europe/Berlin', france: 'Europe/Paris', netherlands: 'Europe/Amsterdam', belgium: 'Europe/Brussels',
  spain: 'Europe/Madrid', italy: 'Europe/Rome', portugal: 'Europe/Lisbon', switzerland: 'Europe/Zurich', austria: 'Europe/Vienna',
  sweden: 'Europe/Stockholm', norway: 'Europe/Oslo', denmark: 'Europe/Copenhagen', finland: 'Europe/Helsinki',
  poland: 'Europe/Warsaw', czechrepublic: 'Europe/Prague', czechia: 'Europe/Prague', greece: 'Europe/Athens', romania: 'Europe/Bucharest', hungary: 'Europe/Budapest',
  russia: 'Europe/Moscow', ukraine: 'Europe/Kyiv',
  // Americas
  usa: 'America/New_York', us: 'America/New_York', unitedstates: 'America/New_York', unitedstatesofamerica: 'America/New_York', america: 'America/New_York',
  canada: 'America/Toronto',
  mexico: 'America/Mexico_City', brazil: 'America/Sao_Paulo', brasil: 'America/Sao_Paulo',
  argentina: 'America/Argentina/Buenos_Aires', chile: 'America/Santiago', colombia: 'America/Bogota', peru: 'America/Lima',
  // Africa
  southafrica: 'Africa/Johannesburg', nigeria: 'Africa/Lagos', kenya: 'Africa/Nairobi',
  ghana: 'Africa/Accra', morocco: 'Africa/Casablanca', tunisia: 'Africa/Tunis', algeria: 'Africa/Algiers', ethiopia: 'Africa/Addis_Ababa', tanzania: 'Africa/Dar_es_Salaam', uganda: 'Africa/Kampala',
  // Oceania
  australia: 'Australia/Sydney', newzealand: 'Pacific/Auckland',
}

// Resolve a lead's IANA zone from country (city overrides). Null when we
// can't map it — callers then fall back to showing IST only.
export function leadTimeZone(country?: string, city?: string): string | null {
  if (city) {
    const c = CITY_TZ[norm(city)]
    if (c) return c
  }
  if (country) {
    const c = COUNTRY_TZ[norm(country)]
    if (c) return c
  }
  return null
}

// "Friday, 1 August, 8:30 am GST" — the lead-facing rendering of an instant.
export function formatInZone(instant: Date, timeZone: string): string {
  return instant.toLocaleString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZone, timeZoneName: 'short',
  })
}

// Compact "8:30 am GST" time-only rendering for live picker previews.
export function formatTimeInZone(instant: Date, timeZone: string): string {
  return instant.toLocaleString('en-IN', {
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZone, timeZoneName: 'short',
  })
}
