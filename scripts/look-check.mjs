/**
 * Does the public site follow the visitor's clock? Light by day, dark in the evening and at night, by the
 * hour on the visitor's own device (owner, 13 November 2026: "as per the zone in which the website is being
 * opened"). The rule is in src/lib/theme.ts; this opens the real pages and proves it.
 *
 *   npx next dev -p 3111          (in another terminal)
 *   node scripts/look-check.mjs   ends with ALL OK, or lists what is wrong and exits 1
 *   SITE=https://www.gennoor.com node scripts/look-check.mjs
 *
 * How: Chrome is told which time zone it is in, and the page's clock is set to a chosen moment before the
 * page loads. Every change of the look on <html> is written down from the first instant, so a flash of the
 * wrong look is caught even when it lasts less than a frame. It checks:
 *   - the same moment in several zones: light where it is day, dark where it is night
 *   - the edges: one minute before and exactly at the two changes of the day
 *   - the look is on the page before anything is drawn, and still right once the page is alive
 *   - a choice made with the switch: it holds across pages, runs out at the next change, and choosing what
 *     the clock gives anyway hands the look back to the clock
 *   - a choice kept the old way (before the site followed the clock) decides nothing and is removed
 *   - the admin centre and the lesson players are left alone
 *   - a page left open turns by itself at the change, and follows a choice made in another tab
 *   - a browser that will not keep the choice still follows the clock, and the switch still works on the page
 *     (--no-storage adds a browser that refuses storage altogether, which asks more than the look: every
 *     part of the page that uses storage must then cope)
 * Needs Chrome on this machine. Nothing is saved and nobody is signed in.
 */
import puppeteer from 'puppeteer-core'
import { readFileSync } from 'fs'

const base = process.env.SITE || 'http://localhost:3111'
const HOME = '/'
const KEY = 'gennoor.theme.choice'
const OLD_KEY = 'gennoor.theme'

// The hours are read from the rule itself, so this check and the site cannot disagree about them;
// what the look should be at a moment is then worked out here, apart from the site's own code.
const rule = readFileSync(new URL('../src/lib/theme.ts', import.meta.url), 'utf8')
const DAY_FROM = Number(/export const DAY_FROM = (\d+)/.exec(rule)?.[1])
const DAY_UNTIL = Number(/export const DAY_UNTIL = (\d+)/.exec(rule)?.[1])
if (!Number.isInteger(DAY_FROM) || !Number.isInteger(DAY_UNTIL) || DAY_FROM >= DAY_UNTIL) { console.log('Could not read DAY_FROM and DAY_UNTIL from src/lib/theme.ts'); process.exit(1) }
const FROM = `${String(DAY_FROM).padStart(2, '0')}:00`, UNTIL = `${String(DAY_UNTIL).padStart(2, '0')}:00`

const parts = (ms, zone) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ms)).map((x) => [x.type, x.value]))
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour, mi: +p.minute, s: +p.second }
}
/** The moment at which a clock in `zone` shows this date and time. */
const at = (zone, y, mo, d, h, mi = 0, s = 0) => {
  const wanted = Date.UTC(y, mo - 1, d, h, mi, s)
  let guess = wanted
  for (let i = 0; i < 3; i++) { const p = parts(guess, zone); guess += wanted - Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) }
  return guess
}
const clock = (ms, zone) => { const p = parts(ms, zone); return `${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}${p.s ? `:${String(p.s).padStart(2, '0')}` : ''}` }
const expected = (ms, zone) => { const h = parts(ms, zone).h; return h >= DAY_FROM && h < DAY_UNTIL ? 'light' : 'dark' }
const CLASS = { light: 'day', dark: 'stage' }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

let failed = 0
const ok = (good, what, detail = '') => { if (!good) failed++; console.log(`${good ? 'ok   ' : 'WRONG'} ${what}${!good && detail ? `\n        ${detail}` : ''}`) }

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })

/**
 * Runs in the page before any of its own code: sets the clock, writes down every look <html> is given, and
 * puts things in storage (or takes storage away).
 */
function prepare(now, ticking, stored, noStorage) {
  const Real = Date
  const started = Real.now()
  let from = now
  const current = () => (ticking ? from + (Real.now() - started) : from)
  function Pinned(...args) {
    if (!new.target) return new Real(current()).toString()
    return Reflect.construct(Real, args.length ? args : [current()], new.target)
  }
  Object.setPrototypeOf(Pinned, Real)
  Pinned.prototype = Real.prototype
  Pinned.now = () => current()
  window.Date = Pinned
  window.__setNow = (ms) => { from = ms - (ticking ? Real.now() - started : 0) }

  if (noStorage === 'all') {
    // a browser that refuses storage altogether: even asking for it is an error
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('The operation is insecure.', 'SecurityError') } })
  } else if (noStorage === 'look') {
    // the browser will not read or keep the look's own choice (storage full, or blocked for this site)
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      const real = Storage.prototype[method]
      Storage.prototype[method] = function (key, ...rest) {
        if (String(key).startsWith('gennoor.theme')) throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
        return real.call(this, key, ...rest)
      }
    }
  } else if (stored) { try { for (const [k, v] of Object.entries(stored)) { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v) } } catch { /* nothing to prepare */ } }

  // every look <html> has had, in order, with the address and whether the page had a body yet
  window.__looks = []
  const note = (cls) => {
    const look = `${/\bstage\b/.test(cls) ? 'stage' : ''}${/\bday\b/.test(cls) ? 'day' : ''}`
    const last = window.__looks[window.__looks.length - 1]
    if (!last || last.look !== look || last.path !== location.pathname) window.__looks.push({ look, path: location.pathname, body: !!document.body })
  }
  new MutationObserver((records) => {
    for (const r of records) if (r.type === 'attributes' && r.target === document.documentElement) note(r.oldValue || '')
    if (document.documentElement) note(document.documentElement.className)
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true })
}

async function open(context, { zone, now, path = HOME, ticking = false, stored = null, noStorage = false, alive = true, timeout = 90_000 }) {
  const page = await context.newPage()
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 })
  await page.emulateTimezone(zone)
  await page.evaluateOnNewDocument(prepare, now, ticking, stored, noStorage)
  await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 180_000 })
  // "alive": the page's own code has taken over (the switch lights one of its halves only then)
  if (alive) await page.waitForSelector('[role="group"][aria-label="Look of the site"] button[aria-pressed="true"]', { timeout })
  else await wait(2500)
  return page
}
const state = (page) => page.evaluate((key, old) => {
  let choice = null, oldChoice = null
  try { choice = localStorage.getItem(key); oldChoice = localStorage.getItem(old) } catch { /* no storage */ }
  return { looks: window.__looks.filter((l) => l.look), now: document.documentElement.className, choice, oldChoice, lit: document.querySelector('[role="group"][aria-label="Look of the site"] button[aria-pressed="true"]')?.textContent.trim().toLowerCase() || null }
}, KEY, OLD_KEY)
const press = (page, label) => page.evaluate((l) => { [...document.querySelectorAll('[role="group"][aria-label="Look of the site"] button')].find((b) => b.textContent.trim() === l).click() }, label)
const has = (cls, look) => new RegExp(`\\b${CLASS[look]}\\b`).test(cls) && !new RegExp(`\\b${CLASS[look === 'light' ? 'dark' : 'light']}\\b`).test(cls)
const until = async (page, look, ms = 4000) => { const end = Date.now() + ms; while (Date.now() < end) { if (has(await page.evaluate(() => document.documentElement.className), look)) return true; await wait(100) } return false }
/** One page, from its first instant: only the wanted look, on the page before the body, and the switch agrees. */
const steady = (s, look) => {
  const wrong = s.looks.filter((l) => l.look !== CLASS[look])
  if (!s.looks.length) return 'no look was ever put on the page'
  if (wrong.length) return `the page showed ${s.looks.map((l) => l.look).join(' then ')}`
  if (s.looks[0].body) return 'the look arrived after the page had started to be drawn'
  if (!has(s.now, look)) return `<html> ends as "${s.now}"`
  if (s.lit !== look) return `the switch lights "${s.lit}"`
  return ''
}

try {
  // the first load of a page on a development server compiles it: do that once, outside the checks
  { const c = await browser.createBrowserContext(); const p = await open(c, { zone: 'Asia/Kolkata', now: at('Asia/Kolkata', 2026, 11, 14, 12), timeout: 240_000 }); await p.close(); await c.close() }

  console.log(`The rule: light from ${FROM} to ${UNTIL} on the visitor's own clock, dark the rest of the time.\n`)

  console.log('The same moment, in different places')
  const moment = Date.UTC(2026, 10, 14, 6, 30)
  const seen = new Set()
  for (const zone of ['Asia/Kolkata', 'Asia/Dubai', 'Africa/Nairobi', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Australia/Sydney']) {
    const want = expected(moment, zone)
    seen.add(want)
    const c = await browser.createBrowserContext()
    const p = await open(c, { zone, now: moment })
    const problem = steady(await state(p), want)
    ok(!problem, `${clock(moment, zone)} in ${zone}: ${want}`, problem)
    await c.close()
  }
  ok(seen.size === 2, 'that moment is day in some of those places and night in others')

  console.log('\nThe edges of the day (India)')
  const Z = 'Asia/Kolkata'
  for (const [h, mi, s] of [[DAY_FROM - 1, 59, 30], [DAY_FROM, 0, 0], [DAY_UNTIL - 1, 59, 30], [DAY_UNTIL, 0, 0], [0, 0, 0], [12, 0, 0], [23, 59, 59]]) {
    const now = at(Z, 2026, 11, 14, h, mi, s)
    const want = expected(now, Z)
    const c = await browser.createBrowserContext()
    const p = await open(c, { zone: Z, now })
    const problem = steady(await state(p), want)
    ok(!problem, `${clock(now, Z)}: ${want}`, problem)
    await c.close()
  }
  ok(expected(at(Z, 2026, 11, 14, DAY_FROM - 1, 59, 30), Z) === 'dark' && expected(at(Z, 2026, 11, 14, DAY_FROM), Z) === 'light' && expected(at(Z, 2026, 11, 14, DAY_UNTIL - 1, 59, 30), Z) === 'light' && expected(at(Z, 2026, 11, 14, DAY_UNTIL), Z) === 'dark', 'the four edges are: dark, light, light, dark')

  console.log('\nA choice made with the switch')
  {
    const c = await browser.createBrowserContext()
    const ten = at(Z, 2026, 11, 14, 10)
    const evening = at(Z, 2026, 11, 14, DAY_UNTIL)
    let p = await open(c, { zone: Z, now: ten })
    await press(p, 'Dark')
    ok(await until(p, 'dark'), 'at 10:00 the visitor presses Dark: the page turns dark')
    let s = await state(p)
    ok(s.choice === `dark|${evening}`, `the choice is kept until ${UNTIL} that day`, `kept as ${s.choice}, wanted dark|${evening}`)
    ok(s.lit === 'dark', 'the switch lights Dark')
    await p.close()
    p = await open(c, { zone: Z, now: at(Z, 2026, 11, 14, 17, 30) })
    let problem = steady(await state(p), 'dark')
    ok(!problem, 'another page at 17:30: still dark, from its first instant', problem)
    await p.close()
    p = await open(c, { zone: Z, now: at(Z, 2026, 11, 15, 7, 30) })
    s = await state(p)
    problem = steady(s, 'light')
    ok(!problem, 'the next morning at 07:30: light again, the choice has run out', problem)
    ok(s.choice === null, 'and the choice that ran out is no longer kept', `still kept: ${s.choice}`)
    await press(p, 'Dark')
    await until(p, 'dark')
    await press(p, 'Light')
    ok(await until(p, 'light'), 'Dark, then Light again: the page is light')
    s = await state(p)
    ok(s.choice === null, 'choosing what the clock gives anyway keeps nothing: the clock decides', `kept: ${s.choice}`)
    await p.close()
    // the other way round: light asked for in the evening lasts the night and no longer
    const nine = at(Z, 2026, 11, 14, 21)
    p = await open(c, { zone: Z, now: nine })
    await press(p, 'Light')
    ok(await until(p, 'light'), 'at 21:00 the visitor presses Light: the page turns light')
    s = await state(p)
    ok(s.choice === `light|${at(Z, 2026, 11, 15, DAY_FROM)}`, `the choice is kept until ${FROM} the next morning`, `kept as ${s.choice}`)
    await p.close()
    p = await open(c, { zone: Z, now: at(Z, 2026, 11, 15, 2) })
    problem = steady(await state(p), 'light')
    ok(!problem, 'a page at 02:00 that night: still light, from its first instant', problem)
    await p.close()
    p = await open(c, { zone: Z, now: at(Z, 2026, 11, 15, 19) })
    problem = steady(await state(p), 'dark')
    ok(!problem, 'the next evening at 19:00: dark again', problem)
    await c.close()
  }

  console.log('\nA choice kept the old way, before the site followed the clock')
  {
    const c = await browser.createBrowserContext()
    const p = await open(c, { zone: Z, now: at(Z, 2026, 11, 14, 22), stored: { [OLD_KEY]: 'light' } })
    const s = await state(p)
    const problem = steady(s, 'dark')
    ok(!problem, 'an old "light" at 22:00 does not make the page light', problem)
    ok(s.oldChoice === null, 'and the old choice is removed', `still there: ${s.oldChoice}`)
    await c.close()
    const c2 = await browser.createBrowserContext()
    const p2 = await open(c2, { zone: Z, now: at(Z, 2026, 11, 14, 11), stored: { [OLD_KEY]: 'dark' } })
    const problem2 = steady(await state(p2), 'light')
    ok(!problem2, 'an old "dark" at 11:00 does not make the page dark', problem2)
    await c2.close()
  }

  console.log('\nThe pages that keep their own look')
  {
    const noon = at(Z, 2026, 11, 14, 12)
    const night = at(Z, 2026, 11, 14, 22)
    for (const [path, name] of [['/ai-academy/ab-100/course-introduction', 'a lesson of the AI Academy'], ['/studio/ai-103/learn', 'the lesson screen of the Learning Studio']]) {
      for (const [now, when] of [[noon, 'noon'], [night, 'night']]) {
        const c = await browser.createBrowserContext()
        const p = await open(c, { zone: Z, now, path, alive: false })
        const s = await p.evaluate((start) => ({ here: location.pathname, looks: window.__looks.filter((l) => l.look && l.path.startsWith(start)).map((l) => l.look) }), path)
        // the address must still be the lesson's own for this to mean anything (a page that sends the visitor elsewhere proves nothing)
        ok(s.here === path && s.looks.length === 0, `${name} at ${when}: no look is put on it`, s.here !== path ? `the page moved to ${s.here}, so nothing was checked` : `it was given ${s.looks.join(', ')}`)
        await c.close()
      }
    }
    for (const [stored, want, words] of [[null, '', 'light (its paper) when nothing was chosen, at night'], [{ 'gennoor.admin.theme': 'dark' }, 'stage', 'dark when the person there chose dark, at noon']]) {
      const c = await browser.createBrowserContext()
      const p = await open(c, { zone: Z, now: stored ? noon : night, path: '/admin', alive: false, stored })
      const s = await p.evaluate(() => window.__looks.filter((l) => /^\/(admin|crm)(\/|$)/.test(l.path)).map((l) => l.look))
      const never = stored ? !s.includes('day') && s.filter(Boolean).every((l) => l === 'stage') && s.includes('stage') : s.every((l) => l === '')
      ok(never, `the admin centre is ${words}: the clock does not touch it`, `on /admin the page was given: ${s.map((l) => l || 'nothing').join(', ') || 'nothing'} (wanted ${want || 'nothing'})`)
      await c.close()
    }
  }

  console.log('\nA page that stays open')
  {
    // the page's clock runs here; what the page showed is read from the record, so a slow machine cannot fool the check
    const order = async (page) => (await state(page)).looks.map((l) => l.look).join(' then ')
    let c = await browser.createBrowserContext()
    let p = await open(c, { zone: Z, now: at(Z, 2026, 11, 14, DAY_UNTIL - 1, 59, 50), ticking: true })
    const turned = await until(p, 'dark', 40_000)
    let seenOrder = await order(p)
    ok(turned && seenOrder === 'day then stage', `opened ten seconds before ${UNTIL}: light, then dark by itself when the clock passes ${UNTIL}, with no reload`, `the page showed ${seenOrder}`)
    ok((await state(p)).lit === 'dark', 'and the switch follows')
    await c.close()
    c = await browser.createBrowserContext()
    p = await open(c, { zone: Z, now: at(Z, 2026, 11, 14, DAY_FROM - 1, 59, 50), ticking: true })
    const lit = await until(p, 'light', 40_000)
    seenOrder = await order(p)
    ok(lit && seenOrder === 'stage then day', `opened ten seconds before ${FROM}: dark, then light by itself when the clock passes ${FROM}`, `the page showed ${seenOrder}`)
    await c.close()
    c = await browser.createBrowserContext()
    p = await open(c, { zone: Z, now: at(Z, 2026, 11, 14, 12) })
    await p.evaluate((ms) => { window.__setNow(ms); document.dispatchEvent(new Event('visibilitychange')) }, at(Z, 2026, 11, 14, 20))
    ok(await until(p, 'dark'), 'left open at noon and looked at again at 20:00: dark')
    // a choice made in another tab of the same browser
    const other = await open(c, { zone: Z, now: at(Z, 2026, 11, 14, 20) })
    await press(other, 'Light')
    ok(await until(other, 'light'), 'in a second tab the visitor presses Light')
    ok(await until(p, 'light'), 'the first tab follows that choice without a reload')
    await c.close()
  }

  // --no-storage adds the same for a browser that refuses storage altogether. That asks more than the look:
  // every part of the page that uses storage must then cope, or the page does not open at all.
  for (const [mode, title] of [['look', 'A browser that will not keep the choice (storage full, or blocked for this site)'], ...(process.argv.includes('--no-storage') ? [['all', 'A browser that refuses storage altogether (--no-storage)']] : [])]) {
    console.log(`\n${title}`)
    const c = await browser.createBrowserContext()
    let p = null
    try { p = await open(c, { zone: Z, now: at(Z, 2026, 11, 14, 12), noStorage: mode, timeout: 30_000 }) } catch { /* said below */ }
    if (!p) {
      ok(false, 'the page opens', 'the page did not come alive: some part of it asks for storage without allowing for a refusal (the look itself does allow for it)')
    } else {
      const problem = steady(await state(p), 'light')
      ok(!problem, 'at noon the page is light: the clock decides', problem)
      await press(p, 'Dark')
      ok(await until(p, 'dark'), 'the switch still works on the page')
      await p.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))
      await wait(600)
      ok(has((await state(p)).now, 'dark'), 'and the choice holds while the page is open')
    }
    await c.close()
  }
} catch (e) {
  failed++
  console.log(`WRONG the check itself stopped: ${String(e?.message || e).slice(0, 300)}`)
}
await browser.close()
console.log(failed ? `\n${failed} thing(s) are wrong` : '\nALL OK')
process.exit(failed ? 1 : 0)
