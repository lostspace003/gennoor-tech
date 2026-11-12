import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLmsCourse } from '@/lib/lms'
import { createCoupon, deleteCoupon, getCoupon, listCoupons, newCode, normalCode, setCouponActive, validCode } from '@/lib/lms-coupons'

export const dynamic = 'force-dynamic'

/** Staff: every coupon code and how often it has been used. */
export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ coupons: await listCoupons() })
  } catch (e) {
    console.error('coupon list failed', e)
    return NextResponse.json({ error: 'Could not load the coupon codes' }, { status: 500 })
  }
}

/**
 * Managers: make a coupon code.
 *   { code?, percent, expiresAt?, maxUses?, slug?, note? }
 * No code given: one is made up. No expiresAt: it never ends. No maxUses: no limit.
 * No slug: it works for every course.
 */
export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can make coupon codes' }, { status: 403 })
  try {
    const b = await req.json()
    const percent = Math.round(Number(b.percent))
    if (!(percent >= 1 && percent <= 100)) return NextResponse.json({ error: 'The discount must be between 1 and 100 percent.' }, { status: 400 })

    let expiresAt = ''
    if (b.expiresAt) {
      const t = Date.parse(String(b.expiresAt))
      if (!Number.isFinite(t) || t <= Date.now()) return NextResponse.json({ error: 'The end time must be in the future.' }, { status: 400 })
      expiresAt = new Date(t).toISOString()
    }
    const maxUses = b.maxUses ? Math.round(Number(b.maxUses)) : 0
    if (!(maxUses >= 0 && maxUses <= 1_000_000)) return NextResponse.json({ error: 'The number of people must be 1 or more, or empty for no limit.' }, { status: 400 })

    const slug = String(b.slug || '')
    if (slug && !(await getLmsCourse(slug))) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })

    const typed = normalCode(b.code)
    if (typed && !validCode(typed)) return NextResponse.json({ error: 'A code is 3 to 24 letters, digits or dashes.' }, { status: 400 })
    const fields = { percent, slug, expiresAt, maxUses, note: String(b.note || '').slice(0, 200), createdBy: user.email }

    let code = typed
    if (typed) {
      if (!(await createCoupon({ code: typed, ...fields }))) return NextResponse.json({ error: `The code ${typed} already exists. Choose another.` }, { status: 409 })
    } else {
      let made = false
      for (let i = 0; i < 5 && !made; i++) {
        code = newCode()
        made = await createCoupon({ code, ...fields })
      }
      if (!made) return NextResponse.json({ error: 'Could not make a code. Please try again.' }, { status: 500 })
    }
    return NextResponse.json({ success: true, code, coupons: await listCoupons() })
  } catch (e) {
    console.error('coupon create failed', e)
    return NextResponse.json({ error: 'Could not make the coupon code' }, { status: 500 })
  }
}

/** Managers: switch a code off or back on. { code, active } */
export async function PATCH(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can change coupon codes' }, { status: 403 })
  try {
    const b = await req.json()
    const code = normalCode(b.code)
    if (!(await getCoupon(code))) return NextResponse.json({ error: 'Unknown code' }, { status: 404 })
    await setCouponActive(code, !!b.active)
    return NextResponse.json({ success: true, coupons: await listCoupons() })
  } catch (e) {
    console.error('coupon change failed', e)
    return NextResponse.json({ error: 'Could not change the coupon code' }, { status: 500 })
  }
}

/** Managers: delete a code for good. { code } */
export async function DELETE(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can delete coupon codes' }, { status: 403 })
  try {
    const b = await req.json()
    const code = normalCode(b.code)
    if (!validCode(code)) return NextResponse.json({ error: 'Unknown code' }, { status: 404 })
    await deleteCoupon(code)
    return NextResponse.json({ success: true, coupons: await listCoupons() })
  } catch (e) {
    console.error('coupon delete failed', e)
    return NextResponse.json({ error: 'Could not delete the coupon code' }, { status: 500 })
  }
}
