/**
 * Who gets in where: tries the site running on this machine as three people.
 *
 *   npx next build
 *   PORT=3111 HOSTNAME=127.0.0.1 node --env-file=.env.local .next/standalone/server.js     (in another terminal)
 *   npx tsx --env-file=.env.local scripts/access-check.ts                                  must end with ALL OK
 *
 * Use the built site, not `next dev`: on this machine the development server did not run the sign-in check
 * (middleware.ts) at all on 13 November 2026, so every page answered 200 and the check proved nothing.
 *
 * It signs nobody in at Microsoft. It makes a session cookie for this machine only, with the secret this
 * machine already has (never printed), for: someone on ADMIN_USERS, someone who has the CRM only, and
 * someone on neither list. Then it asks for a page of the admin centre, a page of the CRM, an address of
 * the admin centre and an address of the CRM, and checks each answer. It reads nothing from the stores
 * that holds a person's details and changes nothing.
 *
 * Run it after any change to src/lib/crm/users.ts, middleware.ts, src/lib/admin-auth.ts or src/lib/auth.ts.
 */
import { encode } from 'next-auth/jwt'
import { ADMIN_USERS, CRM_USERS } from '@/lib/crm/users'

const BASE = process.env.SITE || 'http://127.0.0.1:3111'
const COOKIE = 'authjs.session-token'
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'dev-secret-change-in-production'

const crmOnly = CRM_USERS.find((u) => !ADMIN_USERS.includes(u))
const people: Array<{ who: string; email: string | null; admin: boolean; crm: boolean }> = [
  { who: 'on ADMIN_USERS', email: ADMIN_USERS[0], admin: true, crm: true },
  ...(crmOnly ? [{ who: 'CRM only', email: crmOnly, admin: false, crm: true }] : []),
  { who: 'on neither list', email: 'someone.else@gennoor.com', admin: false, crm: false },
  { who: 'not signed in', email: null, admin: false, crm: false },
]

let failed = 0
const ok = (name: string, pass: boolean, detail: string) => { console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}  (${detail})`); if (!pass) failed++ }

async function ask(path: string, cookie: string) {
  const res = await fetch(BASE + path, { redirect: 'manual', headers: cookie ? { cookie } : {} })
  const to = res.headers.get('location') || ''
  return { status: res.status, to: to.replace(BASE, '') }
}

async function main() {
  if (!crmOnly) console.log('note: nobody has the CRM only at the moment, so that case is not tried')
  for (const p of people) {
    // Both names a session cookie can have (plain on http, "__Secure-" when the site believes it is on https)
    const token = { email: p.email, sub: `check-${p.email}`, name: 'Access check' }
    const cookie = p.email ? (await Promise.all([COOKIE, `__Secure-${COOKIE}`].map(async (name) => `${name}=${await encode({ token, secret, salt: name })}`))).join('; ') : ''
    const label = p.who

    const adminPage = await ask('/admin/campaign', cookie)
    if (p.admin) ok(`${label}: opens the admin centre`, adminPage.status === 200, `${adminPage.status}`)
    else if (p.crm) ok(`${label}: is taken from the admin centre to the CRM`, adminPage.status >= 300 && adminPage.status < 400 && adminPage.to.startsWith('/crm'), `${adminPage.status} to ${adminPage.to || '-'}`)
    else ok(`${label}: is sent to the sign-in page`, adminPage.status >= 300 && adminPage.status < 400 && adminPage.to.startsWith('/admin/login'), `${adminPage.status} to ${adminPage.to || '-'}`)

    const crmPage = await ask('/crm/emails', cookie)
    if (p.crm) ok(`${label}: opens the CRM`, crmPage.status === 200, `${crmPage.status}`)
    else ok(`${label}: cannot open the CRM`, crmPage.status >= 300 && crmPage.status < 400 && crmPage.to.startsWith('/admin/login'), `${crmPage.status} to ${crmPage.to || '-'}`)

    // An address of the admin centre (the film campaign, read only) and one of the CRM (a sample email, no lead read)
    const adminApi = await ask('/api/admin/campaign', cookie)
    ok(`${label}: the admin centre's address ${p.admin ? 'answers' : 'refuses'}`, p.admin ? adminApi.status === 200 : adminApi.status === 401, `${adminApi.status}`)
    const crmApi = await ask('/api/admin/leads/sequence?step=intro', cookie)
    ok(`${label}: the CRM's address ${p.crm ? 'answers' : 'refuses'}`, p.crm ? crmApi.status === 200 : crmApi.status === 401, `${crmApi.status}`)
    const log = await ask('/api/admin/auth-log', cookie)
    ok(`${label}: the sign-in log ${p.admin ? 'answers' : 'refuses'}`, p.admin ? log.status === 200 : log.status === 401, `${log.status}`)
  }
  console.log(failed ? `\n${failed} CHECK(S) FAILED` : '\nALL OK')
  process.exit(failed ? 1 : 0)
}
main().catch((e) => { console.error(String(e?.message || e)); process.exit(1) })
