// Azure Blob Storage base URL for all static assets
// Media served through our secured proxy route — blob storage is private
export const BLOB_URL = process.env.NEXT_PUBLIC_BLOB_URL || '/media'

export const siteConfig = {
  name: 'Gennoor Tech',
  tagline: 'Practical AI and cloud knowledge',
  description:
    'Gennoor Tech gives people practical AI and cloud knowledge through certification courses, real projects and interactive learning. Certified in the Claude Partner Network. Based in Mumbai, India.',
  url: 'https://gennoor.com',
  email: 'contact@gennoor.com',
  location: 'Mumbai, India',
  social: {
    linkedin: 'https://www.linkedin.com/company/gennoor-tech-private-limited/',
    github: 'https://github.com/lostspace003',
    microsoftLearn: 'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab',
    youtube: 'https://www.youtube.com/@GennoorTech',
    twitter: '',
  },

  // Navigation structure (the left rail is built from src/lib/portal-nav.ts)
  navigation: {
    main: [
      { name: 'Claude', href: '/claude' },
      { name: 'Training', href: '/training' },
      { name: 'Automation', href: '/automation' },
      { name: 'Learning Studio', href: '/studio' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ] as { name: string; href: string; children?: { name: string; href: string; description?: string; badge?: string }[] }[],

    footer: [
      {
        title: 'Claude',
        links: [
          { name: 'Claude Partner Network', href: '/claude' },
          { name: 'AI Weekend (monthly, live)', href: '/ai-weekend' },
          { name: 'Claude workshop recap', href: '/workshops/claude-cowork' },
        ],
      },
      {
        title: 'Training and automation',
        links: [
          { name: 'Training for organizations', href: '/training' },
          { name: 'Automation we build', href: '/automation' },
          { name: 'Training programs', href: '/services/training' },
          { name: 'Certification preparation', href: '/services/certifications' },
          { name: 'Webinars and expert sessions', href: '/webinars' },
        ],
      },
      {
        title: 'Learning Studio',
        links: [
          { name: 'Certifications & Projects', href: '/studio' },
          { name: 'AI Essentials', href: '/ai-academy' },
          { name: 'Community', href: '/community' },
        ],
      },
      {
        title: 'Company',
        links: [
          { name: 'About', href: '/about' },
          { name: 'Blog', href: '/resources/blog' },
          { name: 'Work with us', href: '/join' },
          { name: 'Contact', href: '/contact' },
        ],
      },
    ],
  },
}
