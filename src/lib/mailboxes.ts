/**
 * Every Gennoor mailbox and what the site does with it.
 * `sends` = the site sends mail from this address. `receives` = the address is shown to
 * people, so they write to it. `ready` = the mailbox exists but nothing on the site uses it yet.
 */
export type MailboxUse = 'sends' | 'receives' | 'copy' | 'ready'

export interface MailboxInfo {
  address: string
  group: 'Site' | 'Team' | 'Spare'
  purpose: string
  uses: MailboxUse[]
  /** Where the site uses it, in plain words. */
  usedFor: string
  /** How to start using a spare mailbox. */
  connect?: string
}

export const MAILBOXES: MailboxInfo[] = [
  { address: 'admin@gennoor.com', group: 'Site', purpose: 'Main admin mailbox', uses: ['sends', 'copy', 'receives'],
    usedFor: 'Gets a copy of every enquiry, booking, webinar sign-up and chatbot lead. Reads CRM replies.' },
  { address: 'info@gennoor.com', group: 'Site', purpose: 'General sender', uses: ['sends'],
    usedFor: 'Sends reports, newsletter confirmations, Claude workshop confirmations, chatbot lead alerts and the weekly CRM digest.' },
  { address: 'sales@gennoor.com', group: 'Site', purpose: 'Sales sender', uses: ['sends', 'copy'],
    usedFor: 'CRM outreach and follow-ups go out as sales. Copied on contact enquiries. Replies are read in the CRM inbox.' },
  { address: 'schedule@gennoor.com', group: 'Site', purpose: 'Calls and bookings', uses: ['sends'],
    usedFor: 'Sends call-booking confirmations, reminders and reschedule notices.' },
  { address: 'training@gennoor.com', group: 'Site', purpose: 'Training enquiries', uses: ['sends', 'copy', 'receives'],
    usedFor: 'Receives every Custom training request (the button at the top right of every page) and sends the visitor confirmation. Copied on certification and expert-call requests.' },
  { address: 'enquiry@gennoor.com', group: 'Site', purpose: 'Contact form sender', uses: ['sends'],
    usedFor: 'Sends the reply a visitor gets after using the contact form or certification enquiry. Each topic is copied to the right mailbox: training to training@, Learning Studio to support@, everything else to sales@.' },
  { address: 'webinar@gennoor.com', group: 'Site', purpose: 'Webinar sign-ups', uses: ['sends'],
    usedFor: 'Sends webinar registration confirmations.' },
  { address: 'support@gennoor.com', group: 'Site', purpose: 'Learner support', uses: ['sends', 'receives'],
    usedFor: 'Sends learners their sign-in codes and password resets. Learner replies land here.' },
  { address: 'hr@gennoor.com', group: 'Site', purpose: 'Work with us', uses: ['sends', 'receives'],
    usedFor: 'Applications from the Work with us page (/join) arrive here with the resume attached, and the applicant gets a confirmation from it.' },
  { address: 'contact@gennoor.com', group: 'Site', purpose: 'Public contact address', uses: ['receives'],
    usedFor: 'Shown on the Contact page and in search results. Mail sent to it is read here.' },

  { address: 'jalalkhan@gennoor.com', group: 'Team', purpose: 'Jalal', uses: ['receives'], usedFor: 'Personal mailbox. CRM user.' },
  { address: 'yusufchaudhary@gennoor.com', group: 'Team', purpose: 'Yusuf', uses: ['receives'], usedFor: 'Personal mailbox. CRM user.' },
  { address: 'aditya@gennoor.com', group: 'Team', purpose: 'Aditya', uses: ['receives'], usedFor: 'Personal mailbox.' },
  { address: 'zaid@gennoor.com', group: 'Team', purpose: 'Zaid', uses: ['receives'], usedFor: 'Personal mailbox.' },
  { address: 'deepanshu@gennoor.com', group: 'Team', purpose: 'Deepanshu', uses: ['receives'], usedFor: 'Personal mailbox.' },
  { address: 'jalalceo@gennoor.com', group: 'Team', purpose: 'Jalal (CEO)', uses: ['receives'], usedFor: 'Personal mailbox.' },

  { address: 'marketing@gennoor.com', group: 'Spare', purpose: 'Marketing', uses: ['ready'], usedFor: 'Not used yet.',
    connect: 'Set EMAIL_FROM_MARKETING to this address, then use it as the sender for newsletters or campaigns.' },
  { address: 'socialmedia@gennoor.com', group: 'Spare', purpose: 'Social media accounts', uses: ['ready'], usedFor: 'Not used yet.',
    connect: 'Use this address to sign up for LinkedIn, YouTube and other social accounts so notifications go to one place.' },
  { address: 'escalation@gennoor.com', group: 'Spare', purpose: 'Urgent issues', uses: ['ready'], usedFor: 'Not used yet.',
    connect: 'Set EMAIL_ESCALATION to this address and the site can copy it on failed bookings or payments.' },
  { address: 'customercare@gennoor.com', group: 'Spare', purpose: 'Customer care', uses: ['ready'], usedFor: 'Not used yet.',
    connect: 'In the Microsoft 365 admin centre, forward it to support@, or add it as a second learner support address.' },
]

export const LIVE_ADDRESSES = MAILBOXES.map(m => m.address)
