export interface AuthorProfile {
  id: string
  name: string
  initials: string
  role: string
  credentials: string
  bio: string
  photoUrl?: string
  links: {
    linkedin?: string
    twitter?: string
    github?: string
    microsoftLearn?: string
    about?: string
    certifications?: string
  }
}

export const authors: Record<string, AuthorProfile> = {
  'jalal-ahmed-khan': {
    id: 'jalal-ahmed-khan',
    name: 'Jalal Ahmed Khan',
    initials: 'JK',
    role: 'Founder, Gennoor Tech',
    credentials: 'Microsoft Certified Trainer · 16+ active certifications',
    bio: '14+ years in enterprise AI and cloud technologies. Delivered AI transformation programs for Fortune 500 companies across 6 countries including Boeing, Aramco, HDFC Bank, and Siemens. Holds 16 active Microsoft certifications including Azure AI Engineer (AI-102), Power BI Analyst (PL-300), and Copilot specialist credentials.',
    photoUrl: '/api/content/intro-content/founder.png',
    links: {
      linkedin: 'https://www.linkedin.com/in/lostspace003/',
      github: 'https://github.com/lostspace003',
      microsoftLearn: 'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab',
      about: '/about/founder',
      certifications: '/about/certifications',
    },
  },
}

export const DEFAULT_AUTHOR_ID = 'jalal-ahmed-khan'

export function resolveAuthor(authorField: string): AuthorProfile {
  const direct = authors[authorField]
  if (direct) return direct
  for (const a of Object.values(authors)) {
    if (a.name === authorField) return a
  }
  return authors[DEFAULT_AUTHOR_ID]
}
