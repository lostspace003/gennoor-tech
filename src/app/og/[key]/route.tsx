import { ogImageResponse } from '@/lib/og-card'
import { OG_PAGES } from '@/lib/og-pages'

// The share picture of a fixed page: /og/training, /og/ai-weekend, ... (the list is src/lib/og-pages.ts).
// Made once when the site is built. A key that is not in the list is not found: nobody can have
// the site draw a picture with words of their own.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(OG_PAGES).map((key) => ({ key }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const card = OG_PAGES[key]
  if (!card) return new Response('Not found', { status: 404 })
  return ogImageResponse(card)
}
