import { redirect } from 'next/navigation'

// The CRM moved to its own app at /crm. Keep this path as a permanent
// redirect — old links (training deck, bookmarks) still land correctly.
export default function LegacyCrmRedirect() {
  redirect('/crm')
}
