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
  'gennoor-team': {
    id: 'gennoor-team',
    name: 'Gennoor Tech Team',
    initials: 'G',
    role: 'Gennoor Tech',
    credentials: 'AI training and automation, Mumbai',
    bio: 'Written by the Gennoor Tech team.',
    links: {
      linkedin: 'https://www.linkedin.com/company/gennoor-tech-private-limited/',
      about: '/about',
    },
  },
}

export const DEFAULT_AUTHOR_ID = 'gennoor-team'

export function resolveAuthor(authorField: string): AuthorProfile {
  const direct = authors[authorField]
  if (direct) return direct
  for (const a of Object.values(authors)) {
    if (a.name === authorField) return a
  }
  return authors[DEFAULT_AUTHOR_ID]
}
