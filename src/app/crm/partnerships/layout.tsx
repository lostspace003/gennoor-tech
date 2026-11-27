import PartnershipTabs from '@/components/crm/PartnershipTabs'

// Every partnership campaign under one tab of the CRM: the sub-tabs are the campaigns (data/partnership-campaigns.ts).
export default function PartnershipsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PartnershipTabs />
      {children}
    </>
  )
}
