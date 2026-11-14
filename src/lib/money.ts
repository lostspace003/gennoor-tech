/**
 * One price, in the visitor's own money (the owner, 14 November 2026: "Don't show both the prices ... if I'm
 * in India, show in INR, and if I'm outside India, show in dollars only").
 *
 * Where someone is, is read from the clock setting of their device (India has one time zone). It needs no
 * outside service and nothing about the visitor leaves the browser. It is a reading of the device, not a
 * proof: a person in India whose device is set to another country's time sees dollars.
 * No server imports: pages, forms and emails all read this.
 */
export type Currency = 'INR' | 'USD'

export const money = (amount: number, currency: Currency): string =>
  currency === 'USD' ? `$${amount.toFixed(2)}` : `₹${Math.round(amount).toLocaleString('en-IN')}`

/** In the browser only. False when the device does not say. */
export function looksLikeIndia(): boolean {
  try { return /^Asia\/(Kolkata|Calcutta)$/.test(Intl.DateTimeFormat().resolvedOptions().timeZone) } catch { return false }
}
