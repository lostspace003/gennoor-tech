import { Metadata } from 'next'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'Your Gennoor Academy dashboard',
  description: 'See your course progress, what you have completed, what is pending, and the certificates you have earned.',
}

export default function DashboardPage() {
  return <DashboardClient />
}
