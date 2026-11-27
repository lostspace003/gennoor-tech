// The one-page catalogue in an email to a lead (owner, 27 November 2026: "one email which we can send to any of the
// client, but that should be optional"). The picture is drawn into the email, linked to the PDF, and the PDF is
// attached. Both are our own files on the site (catalog/README.md); nothing here is chosen by a name that came in.

const SITE = 'https://www.gennoor.com'
export const CATALOGUE_PDF_URL = `${SITE}/Gennoor-Tech-Catalog/Gennoor-Tech-Catalogue.pdf`
export const CATALOGUE_IMAGE_URL = `${SITE}/Gennoor-Tech-Catalog/Gennoor-Tech-Catalogue-email.png`
export const CATALOGUE_FILENAME = 'Gennoor-Tech-Catalogue.pdf'

/** The words a person starts from; they read and change them before sending. */
export const CATALOGUE_SUBJECT = 'What we do at Gennoor Tech, on one page'
export function catalogueBody(firstName: string): string {
  return `Dear ${firstName || 'there'},\n\nThank you for your time. As promised, here is everything we do on one page: the courses to start with today, and the training we build around a team's own work.\n\nEvery item in the catalogue is a link, so you can open the part that interests you. The PDF is attached as well.\n\nIf one of them fits your team, simply reply to this email and we will set up a short call.`
}

/** The catalogue block that goes under the words of the email. */
export function catalogueBlockHtml(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0 6px">
  <tr><td style="padding:0 0 10px;font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:1.5px;color:#64748b;text-transform:uppercase">What we do, on one page</td></tr>
  <tr><td style="padding:0"><a href="${CATALOGUE_PDF_URL}" style="text-decoration:none"><img src="${CATALOGUE_IMAGE_URL}" width="560" alt="Gennoor Tech: what we do. Learning Studio, AI Essentials, Claude certification prep, the AI Weekend, training built on your work, Claude automation courses, your own learning platform, a prototype first." style="display:block;width:100%;max-width:560px;height:auto;border:1px solid #e2e8f0;border-radius:12px"/></a></td></tr>
  <tr><td style="padding:10px 0 0;font-family:'Segoe UI',Arial,sans-serif;font-size:14px"><a href="${CATALOGUE_PDF_URL}" style="color:#2563EB;font-weight:700;text-decoration:none">Open the catalogue as a PDF &rarr;</a></td></tr>
</table>`
}

/** The PDF, read from our own site at sending time. Throws when it cannot be had, so the email is not sent without it. */
export async function cataloguePdf(): Promise<{ filename: string; content: Buffer; contentType: string }> {
  const res = await fetch(CATALOGUE_PDF_URL, { signal: AbortSignal.timeout(15_000) })
  const type = res.headers.get('content-type') || ''
  if (!res.ok || !type.includes('pdf')) throw new Error('The catalogue PDF could not be found on the site, so nothing was sent.')
  const content = Buffer.from(await res.arrayBuffer())
  if (content.length > 8_000_000) throw new Error('The catalogue PDF is too large to attach.')
  return { filename: CATALOGUE_FILENAME, content, contentType: 'application/pdf' }
}
