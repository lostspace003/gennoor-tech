// Quick check of the studio admin rule: npx tsx scripts/check-studio-admin.ts
import { isStudioAdmin, isReservedAdminEmail } from '../src/lib/learner-auth'

const ms = { email: 'Admin@Gennoor.com', name: 'A', provider: 'microsoft' as const }
const cases: Array<[string, boolean, boolean]> = [
  ['microsoft admin', isStudioAdmin(ms), true],
  ['otp admin address', isStudioAdmin({ ...ms, provider: 'otp' }), false],
  ['password admin address', isStudioAdmin({ ...ms, provider: 'password' }), false],
  ['google admin address', isStudioAdmin({ ...ms, provider: 'google' }), false],
  ['microsoft other user', isStudioAdmin({ ...ms, email: 'someone@gennoor.com' }), false],
  ['microsoft lookalike', isStudioAdmin({ ...ms, email: 'admin@gennoor.com.evil.io' }), false],
  ['no session', isStudioAdmin(null), false],
  ['reserved address (blocked for otp)', isReservedAdminEmail(' ADMIN@gennoor.com '), true],
]
process.env.STUDIO_ADMIN_TENANT_ID = 'tenant-1'
cases.push(['tenant mismatch', isStudioAdmin({ ...ms, tid: 'other' }), false], ['tenant match', isStudioAdmin({ ...ms, tid: 'Tenant-1' }), true])
let bad = 0
for (const [n, got, want] of cases) { if (got !== want) bad++; console.log(got === want ? 'ok  ' : 'FAIL', n) }
process.exit(bad ? 1 : 0)
