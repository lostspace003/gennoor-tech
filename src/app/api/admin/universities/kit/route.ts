import { NextResponse } from 'next/server'
import { requireCampaignUser } from '@/lib/crm/universities-access'
import { FORM_BANNER_PNG_BASE64 } from '@/data/university-banner'
import { FORM_SCRIPT } from '@/data/university-form-script'

// The two files of the toolkit that build the evaluation form in Google: the script that creates it and the banner
// for its header. A file is picked from this list of ours; the name in the request is only compared to it.
const FILES: Record<string, { name: string; type: string; body: () => BodyInit }> = {
  script: { name: 'GENNOOR_Create_Evaluation_Google_Form.gs', type: 'text/plain; charset=utf-8', body: () => FORM_SCRIPT },
  banner: { name: 'GENNOOR_Google_Form_Header_Banner.png', type: 'image/png', body: () => new Uint8Array(Buffer.from(FORM_BANNER_PNG_BASE64, 'base64')) },
}

export async function GET(request: Request) {
  const user = await requireCampaignUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const which = new URL(request.url).searchParams.get('file') || ''
  const file = Object.prototype.hasOwnProperty.call(FILES, which) ? FILES[which] : null
  if (!file) return NextResponse.json({ error: 'There is no such file' }, { status: 404 })
  return new NextResponse(file.body(), {
    headers: { 'Content-Type': file.type, 'Content-Disposition': `attachment; filename="${file.name}"`, 'Cache-Control': 'no-store' },
  })
}
