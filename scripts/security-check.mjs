#!/usr/bin/env node
/**
 * The rules of docs/SECURITY.md that a machine can check. It reads the code; it never reads a secret and,
 * unless asked, never uses the network. It ends with "ALL OK" or with a list of what is wrong and why.
 *
 *   node scripts/security-check.mjs            every rule
 *   node scripts/security-check.mjs --audit    also asks npm whether an installed package has a known hole (network)
 *   node scripts/security-check.mjs --list     prints every address of the site and how it is guarded
 *
 * It runs before every pull request (the skill `gennoor-ship`) and again on GitHub before the build, so a
 * change that breaks a rule cannot reach the live site by accident.
 *
 * When it fails on something you added on purpose (a new public form, a new place that shows HTML), the fix is
 * never to weaken the rule. Read the section of docs/SECURITY.md it names, do what it says, and then add your
 * file to the list below WITH THE REASON. The lists are the record of every decision to leave a door open.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, relative, sep } from 'node:path'

const args = process.argv.slice(2)
const ROOT = process.cwd()
const API = 'src/app/api'
const problems = []
const fail = (rule, where, what) => problems.push({ rule, where, what })

// ───────────────────────────────────────── the lists: every door left open, and why ─────────────────────

/**
 * Addresses anyone on the internet may call without signing in. Each one is here on purpose.
 * A new address that has no sign-in check and is not on this list fails the check.
 * limit: false means "has no rateLimit() call, and that is right, for the reason given".
 */
const PUBLIC = {
  'admin/template': { why: 'a blank sample spreadsheet for the CRM import; holds no data', limit: false },
  'auth/[...nextauth]': { why: 'the staff sign-in itself (Auth.js)', limit: false },
  'autopilot-action': { why: 'acts only on a link signed by us (verifyAction); GET shows, POST does', limit: false },
  'book-expert-call': { why: 'public form' },
  'bookings/availability': { why: 'free times for the booking calendar; no personal data', limit: false },
  'bookings/create': { why: 'public form: book a call' },
  'bookings/services': { why: 'the list of call types; no personal data', limit: false },
  'certificates/[certId]/pdf': { why: 'a certificate is public to whoever holds its id (the verify link printed on it)' },
  'certification-enquiry': { why: 'public form' },
  'claude-cowork-register': { why: 'public form' },
  'contact-enquiry': { why: 'public form' },
  'cron/autopilot': { why: 'the scheduler; refuses without its secret (cronAuthorized)', limit: false },
  'custom-training': { why: 'public form' },
  'events': { why: 'the public list of events; registrants are not in it', limit: false },
  'events/[id]/image': { why: 'the cover picture of a public event', limit: false },
  'events/register': { why: 'public form' },
  'gennoorcare': { why: 'the public chatbot' },
  'gennoorcare/feedback': { why: 'thumbs up or down on a chatbot answer' },
  'gennoorcare/lead': { why: 'a visitor leaves their details with the chatbot' },
  'indexnow': { why: 'tells search engines a page changed; refuses without ADMIN_SECRET', limit: false },
  'join': { why: 'public form' },
  'learner/courses/[courseId]/claim-cert': { why: 'claims a certificate with an emailed code' },
  'learner/forgot-password': { why: 'sends a reset code to the address on file' },
  'learner/login-google': { why: 'sign-in: checks the token Google signed', limit: false },
  'learner/login-microsoft': { why: 'sign-in: sends the browser to Microsoft', limit: false },
  'learner/login-microsoft/callback': { why: 'sign-in: Microsoft sends the browser back; state is checked', limit: false },
  'learner/login-otp': { why: 'sign-in: needs the verified address AND the proof cookie of the browser that typed the code' },
  'learner/login-password': { why: 'sign-in' },
  'learner/logout': { why: 'removes the cookie; nothing to protect', limit: false },
  'learner/reset-password': { why: 'sets a password with an emailed code' },
  'lms/caption': { why: 'captions: open for preview lessons only (requireLesson)', limit: false },
  'lms/catalog': { why: 'the public list of courses', limit: false },
  'lms/chat': { why: 'the ask bot of a lesson: checks the lesson is open to this person itself' },
  'lms/coupon': { why: 'checks a coupon code' },
  'lms/hls/key': { why: 'the video key: only with a short-lived link signed by us (verifyHlsToken)' },
  'lms/hls/playlist': { why: 'the video playlist: only with a short-lived link signed by us (verifyHlsToken)', limit: false },
  'lms/play': { why: 'hands out the signed video link: open for preview lessons only (requireLesson)' },
  'log-pageview': { why: 'counts a page view', limit: false },
  'newsletter-confirm': { why: 'confirms an address with the signed link from the email', limit: false },
  'newsletter-subscribe': { why: 'public form' },
  'outline-download': { why: 'public form: course outline by email' },
  'outline/[slug]': { why: 'a course outline, by the signed link from the email' },
  'send-otp': { why: 'emails a code; limited per mailbox, per day and per caller' },
  'tech-call/request': { why: 'public form; needs a verified address and the proof cookie' },
  'tech-call/respond': { why: 'yes or no to a proposed time, by the signed link from the email' },
  'tech-call/slots': { why: 'free times; no personal data' },
  'toc-thumb/[slug]': { why: 'a course picture', limit: false },
  'training-enquiry': { why: 'public form' },
  'unsubscribe': { why: 'stops emails, by the signed link from the email', limit: false },
  'verify-otp': { why: 'checks an emailed code' },
  'webinar-register': { why: 'public form' },
  'weekend/coupon': { why: 'checks a coupon code' },
  'weekend/pay': { why: 'starts a payment for a registration' },
  'weekend/pay/verify': { why: 'confirms a payment; the payment signature is checked' },
  'weekend/pay/webhook': { why: 'the payment company calls it; its signature is checked', limit: false },
  'weekend/register': { why: 'public form' },
}

/**
 * Files that put HTML into a page with dangerouslySetInnerHTML (or innerHTML) WITHOUT safeHtml(), and why that
 * is right there. Anything a stranger could have had a hand in must go through safeHtml() + CONTAINED instead
 * (src/lib/safe-html.ts) and then needs no entry here.
 */
const RAW_HTML_OK = {}

/** Things that were once wrong and must stay fixed: file, what it must contain, why. */
const LOCKS = [
  ['src/app/api/learner/complete-profile/route.ts', 'plainField(', 'a learner\'s name, organisation and role are saved as plain words'],
  ['src/app/api/learner/profile/route.ts', 'plainField(', 'a learner\'s name, organisation and role are saved as plain words'],
  ['src/app/api/learner/login-otp/route.ts', 'hasOtpProof(', 'sign-in by code needs the proof cookie of the browser that typed the code'],
  ['src/app/api/tech-call/request/route.ts', 'hasOtpProof(', 'a verified address counts only for the browser that verified it'],
  ['src/app/api/verify-otp/route.ts', 'setOtpProof(', 'the browser that typed the code gets the proof'],
  ['src/app/api/learner/login-password/route.ts', 'learner-login-pw-id:', 'password sign-in is limited per account name, not only per caller'],
  ['src/lib/learner-auth.ts', "process.env.NODE_ENV === 'production') throw", 'no built-in sign-in secret on the live site'],
  ['next.config.js', 'poweredByHeader: false', 'the site does not announce what it is built with'],
  ['next.config.js', 'Content-Security-Policy', 'the safety headers stay'],
]

/** The oldest versions without a known serious hole (npm audit, 20 November 2026). Raise them, never lower them. */
const MIN_VERSION = { next: '16.4.6', 'next-auth': '5.0.0-beta.32', dompurify: '3.4.18' }

// ───────────────────────────────────────── reading the code ─────────────────────────────────────────────

const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { if (name !== 'node_modules' && name !== '.next') walk(p, out) } else out.push(p)
  }
  return out
}
const rel = (p) => relative(ROOT, p).split(sep).join('/')
const read = (p) => readFileSync(p, 'utf8')

/** The text between the brace at `open` and its partner (strings and comments are skipped well enough for our code). */
function block(src, open) {
  let depth = 0
  for (let i = open; i < src.length; i++) {
    const c = src[i]
    if (c === '"' || c === "'" || c === '`') {
      const q = c
      for (i++; i < src.length && src[i] !== q; i++) if (src[i] === '\\') i++
      continue
    }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) break; continue }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; if (i <= 0) break; continue }
    if (c === '{') depth++
    else if (c === '}' && --depth === 0) return src.slice(open, i + 1)
  }
  return src.slice(open)
}

/** The body of the function called `name` in this file ('' if it is not here). */
function bodyOf(src, name) {
  const m = new RegExp(`(?:function\\s+${name}\\s*\\(|(?:const|let)\\s+${name}\\s*=\\s*(?:async\\s*)?(?:\\([^)]*\\)|\\w+)\\s*(?::[^=]+)?=>)`).exec(src)
  if (!m) return ''
  const open = src.indexOf('{', m.index + m[0].length - 1)
  return open < 0 ? '' : block(src, open)
}

const STAFF = /\b(verifyAdmin|requireCrmUser|cronAuthorized)\s*\(|\bisAdminUser\s*\(/
const SIGNED_IN = /\b(verifyAdmin|requireCrmUser|cronAuthorized|verifyLearnerSession|requireEnrolled|requireLesson|verifyHlsToken|verifyAction)\s*\(|\bisAdminUser\s*\(|\bisStudioAdmin\s*\(/

/** Every handler a route file exports: [{ method, body }]. A handler may hand its work to a function of the same file. */
function handlers(src) {
  const out = []
  const fn = /export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)\s*\(/g
  let m
  while ((m = fn.exec(src))) {
    // skip the parameter list, then take the body
    let i = m.index + m[0].length, depth = 1
    for (; i < src.length && depth > 0; i++) { if (src[i] === '(') depth++; else if (src[i] === ')') depth-- }
    const open = src.indexOf('{', i)
    out.push({ method: m[1], body: open < 0 ? '' : block(src, open) })
  }
  const alias = /export\s+const\s+(GET|POST|PUT|PATCH|DELETE)\s*=\s*([^\n;]+)/g
  while ((m = alias.exec(src))) {
    const name = (m[2].match(/^\s*(\w+)\s*$/) || [])[1]
    out.push({ method: m[1], body: name ? bodyOf(src, name) || m[2] : m[2] })
  }
  const reexport = /export\s*\{([^}]+)\}\s*(?:from\s*['"][^'"]+['"])?/g
  while ((m = reexport.exec(src))) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()
      if (/^(GET|POST|PUT|PATCH|DELETE)$/.test(name || '')) out.push({ method: name, body: m[0] })
    }
  }
  return out
}

/** True when the handler checks `guard` itself, or the first thing it does is call a function of this file that does. */
function guarded(src, body, guard) {
  if (guard.test(body)) return true
  for (const call of body.matchAll(/\b([A-Za-z_]\w*)\s*\(/g)) {
    const inner = bodyOf(src, call[1])
    if (inner && inner !== body && guard.test(inner)) return true
  }
  return false
}

const routeFiles = walk(join(ROOT, API)).filter((p) => /[\\/]route\.ts$/.test(p))
const routes = routeFiles.map((p) => {
  const src = read(p)
  const path = rel(p).slice(API.length + 1).replace(/\/?route\.ts$/, '')
  return { path, file: rel(p), src, handlers: handlers(src) }
}).sort((a, b) => a.path.localeCompare(b.path))

// ───────────────────────────────────────── rule 1 and 2: who may call each address ──────────────────────

const staffArea = (path) => /^(admin|crm)(\/|$)/.test(path)
for (const r of routes) {
  if (r.handlers.length === 0 && r.path !== 'auth/[...nextauth]') fail('addresses', r.file, 'no handler was recognised in this file: write it as `export async function GET(...)` so it can be checked')
  if (staffArea(r.path) && !PUBLIC[r.path]) {
    for (const h of r.handlers) {
      if (!guarded(r.src, h.body, STAFF)) fail('staff addresses', r.file, `${h.method} does not check who is calling. Every method of an admin or CRM address starts with verifyAdmin() or requireCrmUser() and returns 401 when it fails (docs/SECURITY.md, "Who may call an address")`)
    }
    continue
  }
  const open = r.handlers.filter((h) => !guarded(r.src, h.body, SIGNED_IN)).map((h) => h.method)
  if (open.length && !PUBLIC[r.path]) {
    fail('public addresses', r.file, `${open.join(', ')} can be called by anyone and this address is not on the PUBLIC list. If it must be public, read docs/SECURITY.md ("A public address") and add it to PUBLIC in scripts/security-check.mjs with the reason; otherwise check the sign-in first.`)
  }
}
for (const path of Object.keys(PUBLIC)) {
  if (!routes.some((r) => r.path === path)) fail('public addresses', `PUBLIC['${path}']`, 'this address no longer exists: remove it from the list')
}

// ───────────────────────────────────────── rule 3: a public address that writes is limited ──────────────

for (const r of routes) {
  const entry = PUBLIC[r.path]
  if (!entry || entry.limit === false) continue
  if (!/\brateLimit\s*\(/.test(r.src)) fail('limits', r.file, 'a public address with no rateLimit(): a stranger can call it without end (docs/SECURITY.md, "Limits")')
}

// ───────────────────────────────────────── rule 4: no secret written in the code ─────────────────────────

const codeFiles = [...walk(join(ROOT, 'src')), join(ROOT, 'middleware.ts'), ...walk(join(ROOT, 'services'))]
  .filter((p) => existsSync(p) && /\.(ts|tsx|js|mjs|cjs|py)$/.test(p))
for (const p of codeFiles) {
  const src = read(p)
  const lines = src.split(/\r?\n/)
  lines.forEach((line, i) => {
    if (/process\.env\.[A-Z0-9_]*(SECRET|PASSWORD|PASSWD|TOKEN|PRIVATE)[A-Z0-9_]*\s*(\|\||\?\?)\s*['"`][^'"`]{3,}/.test(line)) {
      fail('secrets', `${rel(p)}:${i + 1}`, 'a secret falls back to a value written in the code. On the live site a missing secret must stop the feature, never fall back (docs/SECURITY.md, "Secrets"; the pattern is learnerSecretText() in src/lib/learner-auth.ts)')
    }
    if (/x-forwarded-for/i.test(line) && rel(p) !== 'src/lib/rate-limit.ts') {
      fail('caller address', `${rel(p)}:${i + 1}`, 'reads X-Forwarded-For by hand: a caller can type anything into it. Use clientIp() from src/lib/rate-limit.ts')
    }
  })
}
try {
  const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split(/\r?\n/)
  for (const f of tracked) {
    if (/(^|\/)\.env(\.local|\.production|\.development)?$/.test(f) || /\.(pem|pfx|p12)$/.test(f)) fail('secrets', f, 'a file of secrets is kept in the repository: remove it and change every secret that was in it')
  }
} catch { /* not a git folder (a packed copy): nothing to look at */ }

// ───────────────────────────────────────── rule 5: HTML we did not write ─────────────────────────────────

for (const p of walk(join(ROOT, 'src')).filter((f) => /\.(tsx|ts)$/.test(f))) {
  const src = read(p)
  if (!/dangerouslySetInnerHTML|\.innerHTML\s*=|insertAdjacentHTML/.test(src)) continue
  const file = rel(p)
  if (RAW_HTML_OK[file]) continue
  const lines = src.split(/\r?\n/)
  lines.forEach((line, i) => {
    if (!/dangerouslySetInnerHTML|\.innerHTML\s*=|insertAdjacentHTML/.test(line)) return
    if (/^\s*(\/\/|\*|\/\*)/.test(line) || /^\s*\{\/\*/.test(line)) return
    if (/safeHtml\(/.test(line)) return
    fail('HTML we did not write', `${file}:${i + 1}`, 'puts HTML into the page without safeHtml(). If a stranger, a learner, an email or a model could have had a hand in that HTML, show it with safeHtml() and CONTAINED (src/lib/safe-html.ts). If it is only our own fixed content, add this file to RAW_HTML_OK in scripts/security-check.mjs with the reason.')
  })
}
for (const file of Object.keys(RAW_HTML_OK)) {
  if (!existsSync(join(ROOT, file))) fail('HTML we did not write', `RAW_HTML_OK['${file}']`, 'this file no longer exists: remove it from the list')
}

// ───────────────────────────────────────── rule 6: what was fixed stays fixed ────────────────────────────

for (const [file, must, why] of LOCKS) {
  if (!existsSync(join(ROOT, file))) { fail('locks', file, `the file is gone, and with it: ${why}. If it moved, move the lock in scripts/security-check.mjs`); continue }
  if (!read(join(ROOT, file)).includes(must)) fail('locks', file, `no longer contains \`${must}\`: ${why}`)
}

// ───────────────────────────────────────── rule 7: packages ──────────────────────────────────────────────

const num = (v) => { const m = String(v).replace(/^[^\d]*/, '').match(/^(\d+)\.(\d+)\.(\d+)(?:-[a-z]+\.(\d+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? Infinity : +m[4]] : [0, 0, 0, 0] }
const older = (a, b) => { const x = num(a), y = num(b); for (let i = 0; i < 4; i++) { if (x[i] !== y[i]) return x[i] < y[i] } return false }
const pkg = JSON.parse(read(join(ROOT, 'package.json')))
for (const [name, min] of Object.entries(MIN_VERSION)) {
  const declared = pkg.dependencies?.[name] || pkg.devDependencies?.[name]
  if (!declared) continue
  let installed = declared
  try { installed = JSON.parse(read(join(ROOT, 'node_modules', name, 'package.json'))).version } catch { /* not installed here: judge by package.json */ }
  if (older(installed, min)) fail('packages', `package.json: ${name}`, `${installed} is older than ${min}, the oldest version without a known serious hole. Run npm install ${name}@${min} or newer`)
}
if (args.includes('--audit')) {
  try {
    let text = ''
    try { text = execSync('npm audit --omit=dev --json', { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }) } catch (e) { text = String(e.stdout || '') }
    const report = JSON.parse(text)
    const count = report.metadata?.vulnerabilities || {}
    console.log(`npm audit (packages the live site uses): ${count.critical || 0} critical, ${count.high || 0} high, ${count.moderate || 0} moderate`)
    for (const [name, v] of Object.entries(report.vulnerabilities || {})) {
      if (v.severity === 'critical') fail('packages', name, `a known CRITICAL hole (npm audit). Upgrade it before anything else: ${v.via.filter((a) => typeof a !== 'string').map((a) => a.title).slice(0, 2).join('; ')}`)
    }
  } catch (e) {
    fail('packages', 'npm audit', `could not be read (${String(e.message || e).slice(0, 120)}). It needs the network.`)
  }
}

// ───────────────────────────────────────── the answer ────────────────────────────────────────────────────

if (args.includes('--list')) {
  for (const r of routes) {
    const how = r.handlers.map((h) => `${h.method}:${guarded(r.src, h.body, STAFF) ? 'staff' : guarded(r.src, h.body, SIGNED_IN) ? 'signed-in/signed link' : 'ANYONE'}`).join(' ')
    console.log(`${r.path.padEnd(58)} ${how}${PUBLIC[r.path] ? `   (public: ${PUBLIC[r.path].why})` : ''}`)
  }
  console.log('')
}
const staffCount = routes.filter((r) => staffArea(r.path)).length
console.log(`${routes.length} addresses read: ${staffCount} for staff, ${Object.keys(PUBLIC).length} public on purpose, the rest for signed-in learners.`)
if (problems.length === 0) {
  console.log('ALL OK')
} else {
  const byRule = {}
  for (const p of problems) (byRule[p.rule] ||= []).push(p)
  for (const [rule, list] of Object.entries(byRule)) {
    console.log(`\n✗ ${rule} (${list.length})`)
    for (const p of list) console.log(`  ${p.where}\n      ${p.what}`)
  }
  console.log(`\n${problems.length} thing${problems.length === 1 ? '' : 's'} to put right. The rules are in docs/SECURITY.md.`)
  process.exit(1)
}
