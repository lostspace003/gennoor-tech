import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { listAllLmsCourses } from '@/lib/lms'
import { getCustomTaxonomy, saveCustomTaxonomy } from '@/lib/lms-taxonomy-store'
import { FACETS, MAX_CUSTOM_PER_FACET, cleanOptionName, mergedOptions, optionExists, slugifyOption, type Facet } from '@/lib/lms-taxonomy'

// Filter values: GET lists built-in + custom, POST adds a custom one, DELETE removes an unused custom one.
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const custom = await getCustomTaxonomy(true)
  return NextResponse.json({ custom, options: mergedOptions(custom) })
}

export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const body = await req.json().catch(() => ({}))
  const facet = body.facet as Facet
  if (!FACETS.includes(facet)) return NextResponse.json({ error: 'Unknown filter' }, { status: 400 })
  const name = cleanOptionName(body.name)
  if (!name) return NextResponse.json({ error: 'Use 2 to 40 letters or numbers, with no < > { } or backslash, and never the word free.' }, { status: 400 })
  const custom = await getCustomTaxonomy(true)
  if (optionExists(facet, name, custom)) return NextResponse.json({ error: `"${name}" already exists in this filter.` }, { status: 409 })
  const id = slugifyOption(name)
  if (facet === 'kind') {
    if (id.length < 2) return NextResponse.json({ error: 'That name has no letters or numbers to build an id from.' }, { status: 400 })
    if (custom.kind.length >= MAX_CUSTOM_PER_FACET) return NextResponse.json({ error: 'Too many custom types.' }, { status: 400 })
    custom.kind.push({ id, label: name })
  } else {
    if (custom[facet].length >= MAX_CUSTOM_PER_FACET) return NextResponse.json({ error: 'Too many custom values in this filter.' }, { status: 400 })
    custom[facet].push(name)
  }
  await saveCustomTaxonomy(custom)
  return NextResponse.json({ ok: true, name, id: facet === 'kind' ? id : name, custom, options: mergedOptions(custom) })
}

export async function DELETE(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const body = await req.json().catch(() => ({}))
  const facet = body.facet as Facet
  if (!FACETS.includes(facet) || typeof body.name !== 'string') return NextResponse.json({ error: 'Unknown filter' }, { status: 400 })
  const custom = await getCustomTaxonomy(true)
  const courses = await listAllLmsCourses()
  const key = body.name as string
  const used = courses.some(c =>
    facet === 'vendor' ? c.vendor === key : facet === 'level' ? c.level === key : facet === 'kind' ? c.kind === key : facet === 'topic' ? (c.topics_tags || []).includes(key) : (c.domains || []).includes(key),
  )
  if (used) return NextResponse.json({ error: 'A course still uses it. Change that course first.' }, { status: 409 })
  if (facet === 'kind') {
    if (!custom.kind.some(k => k.id === key)) return NextResponse.json({ error: 'Only custom values can be removed.' }, { status: 404 })
    custom.kind = custom.kind.filter(k => k.id !== key)
  } else {
    if (!custom[facet].includes(key)) return NextResponse.json({ error: 'Only custom values can be removed.' }, { status: 404 })
    custom[facet] = custom[facet].filter(x => x !== key)
  }
  await saveCustomTaxonomy(custom)
  return NextResponse.json({ ok: true, custom, options: mergedOptions(custom) })
}
