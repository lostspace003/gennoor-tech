'use client'

import { InfoTip as PortalInfoTip } from '@/components/crm/shared'

/** Small "i" button with a plain-English explanation. Uses the portal version so panels with overflow never clip it. */
export default function InfoTip({ text }: { text: string }) {
  return <span className="ml-1 inline-flex align-middle"><PortalInfoTip text={text} /></span>
}
