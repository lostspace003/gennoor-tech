import { redirect } from 'next/navigation'

// This page was folded into Today. Old links and bookmarks land there.
export default function Moved() {
  redirect('/crm/queue')
}
