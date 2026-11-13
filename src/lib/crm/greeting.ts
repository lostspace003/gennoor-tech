import type { Lead } from './types'

/**
 * The name and the company an email may use for a lead. Safe to import in the browser.
 *
 * The rule: a name is used only when it is clearly a first name. Anything doubtful gives ''
 * and the email is written without a name. Nothing is guessed, so a wrong name cannot go
 * out. The sender can set the name by hand (`lead.greeting`): that always wins, and an empty
 * text there means "write to this person without a name".
 */

const TITLES = new Set(['mr', 'mrs', 'ms', 'miss', 'mx', 'dr', 'prof', 'professor', 'shri', 'smt', 'sri', 'kumari', 'er', 'ca', 'cs', 'adv', 'capt', 'col', 'maj', 'lt', 'sir', 'madam', 'md', 'mohd'])

/** Words found in a name field that are not a person's name. */
const NOT_A_NAME = new Set([
  'info', 'admin', 'administrator', 'sales', 'hr', 'team', 'contact', 'support', 'hello', 'office', 'careers', 'career', 'enquiry', 'enquiries',
  'inquiry', 'marketing', 'accounts', 'training', 'learning', 'test', 'tester', 'user', 'customer', 'client', 'guest', 'none', 'unknown',
  'anonymous', 'the', 'not', 'null', 'undefined', 'name', 'company', 'manager', 'director', 'owner', 'founder', 'ceo', 'cto', 'webmaster',
])

/** What people type in a company field when they have none. */
const NO_COMPANY = new Set([
  'na', 'n/a', 'n.a', 'n.a.', 'none', 'nil', 'no', '-', '--', '.', 'self', 'self employed', 'self-employed', 'individual', 'freelance',
  'freelancer', 'student', 'personal', 'not applicable', 'unknown', 'test', 'company', 'your team', 'private', 'home', 'unemployed',
])

const titleCase = (word: string) => word.split(/([-'’])/).map((part) => (/^[-'’]$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())).join('')

/** The first name in a full name, or '' when it is not clearly one. */
export function firstNameFrom(name: string, company = ''): string {
  let full = (name || '').replace(/\(.*?\)/g, ' ').trim()
  if (!full) return ''
  // A comma: "Anil Kumar, PMP" is a name and then a qualification, so only the name counts.
  // One word before the comma ("Kumar, Anil" or "Anil, PMP") could be either way round: no name.
  if (full.includes(',')) {
    full = full.slice(0, full.indexOf(',')).trim()
    if (full.split(/\s+/).filter(Boolean).length < 2) return ''
  }
  const words = full.split(/\s+/).map((w) => w.replace(/^[.,;:]+|[.,;:]+$/g, '')).filter(Boolean)
  while (words.length && TITLES.has(words[0].toLowerCase())) words.shift()
  const word = words[0] || ''
  // An initial ("A", "AK"), an email-style name ("john.doe", "user12") or a mailbox word is not a name to greet with
  if (word.length < 3) return ''
  if (!/^\p{L}+(?:[-'’]\p{L}+)*$/u.test(word)) return ''
  if (NOT_A_NAME.has(word.toLowerCase())) return ''
  // The company typed where the name goes
  const firstOfCompany = (company || '').trim().split(/\s+/)[0]?.toLowerCase()
  if (firstOfCompany && firstOfCompany === word.toLowerCase()) return ''
  // ANIL and anil are Anil; a name with its own capitals (McDonald) is left as written
  return word === word.toUpperCase() || word === word.toLowerCase() ? titleCase(word) : word
}

/** A name typed by hand, tidied: spaces trimmed, never longer than a name is. */
export const tidyGreeting = (text: string) => text.replace(/\s+/g, ' ').trim().slice(0, 40)

/** The name to greet this lead with, or '' to write without a name. */
export function greetingOf(lead: Pick<Lead, 'name' | 'company' | 'greeting'>): string {
  if (typeof lead.greeting === 'string') return tidyGreeting(lead.greeting)
  return firstNameFrom(lead.name || '', lead.company || '')
}

/** True when the name was set by hand, so the automatic rule is not being used. */
export const greetingIsSet = (lead: Pick<Lead, 'greeting'>) => typeof lead.greeting === 'string'

/** The company to name in an email, or '' when there is none to name. */
export function companyOf(lead: Pick<Lead, 'company'>): string {
  const company = (lead.company || '').replace(/\s+/g, ' ').trim()
  return !company || NO_COMPANY.has(company.toLowerCase()) ? '' : company
}
