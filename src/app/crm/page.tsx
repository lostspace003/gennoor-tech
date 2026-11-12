import { redirect } from 'next/navigation'

// The CRM opens on Today: the list of what to do next.
export default function CrmIndex() {
  redirect('/crm/queue')
}
