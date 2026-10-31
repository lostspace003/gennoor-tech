// Time zone helpers without a library: "09:30 in Asia/Kolkata on 2026-11-02" -> a UTC instant, and back.
function offsetMinutes(utc: Date, tz: string): number {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(utc).map(p => [p.type, p.value]))
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second)
  return Math.round((asUtc - Math.floor(utc.getTime() / 1000) * 1000) / 60000)
}

/** The UTC instant at which the wall clock in `tz` reads `date` + `hhmm`. */
export function zonedToUtc(date: string, hhmm: string, tz: string): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const guess = new Date(Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10), h, m))
  return new Date(guess.getTime() - offsetMinutes(guess, tz) * 60000)
}

/** Local calendar date (YYYY-MM-DD) and minutes since local midnight for an instant. */
export function localParts(utc: Date, tz: string): { date: string; minutes: number; dow: number } {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(utc).map(x => [x.type, x.value]))
  const date = `${p.year}-${p.month}-${p.day}`
  return { date, minutes: +p.hour * 60 + +p.minute, dow: new Date(`${date}T00:00:00Z`).getUTCDay() }
}

export const hhmmToMinutes = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
export const isWeekend = (dow: number) => dow === 0 || dow === 6
