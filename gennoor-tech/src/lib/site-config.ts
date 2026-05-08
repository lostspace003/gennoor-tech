// Azure Blob Storage base URL for all static assets
// Media served through our secured proxy route — blob storage is private
export const BLOB_URL = process.env.NEXT_PUBLIC_BLOB_URL || '/media'

export const siteConfig = {
  name: 'Gennoor Tech',
  tagline: 'Enterprise AI Training & Solutions',
  description: 'Transform your organization with practical AI solutions. Expert-led training from strategy to implementation, drawing from 14+ years working with Fortune 500 companies across 6 countries.',
  url: 'https://gennoor.com',
  email: 'contact@gennoor.com',
  phone: '+91-XXXXXXXXXX',
  social: {
    linkedin: 'https://www.linkedin.com/in/lostspace003/',
    github: 'https://github.com/lostspace003',
    microsoftLearn: 'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab',
    youtube: 'https://www.youtube.com/@GennoorTech',
    twitter: '',
  },

  // Navigation structure — 5 tabs, competitor-benchmarked for SEO & discoverability
  navigation: {
    main: [
      {
        name: 'Programs',
        href: '/services/training',
        children: [
          { name: 'Training Programs', href: '/services/training', description: 'Corporate AI training courses' },
          { name: 'Azure AI Foundry Workshop', href: '/services/azure-ai-foundry-workshop', description: 'Hands-on Azure AI workshop' },
          { name: 'Copilot Studio Training', href: '/services/copilot-studio-training', description: 'Build AI copilots with Microsoft' },
          { name: 'Enterprise AI Roadmap', href: '/services/enterprise-ai-roadmap-workshop', description: 'Strategic AI planning workshop' },
          { name: 'Certifications', href: '/services/certifications', description: 'Microsoft certification prep' },
        ]
      },
      {
        name: 'Services',
        href: '/services',
        children: [
          { name: 'AI Strategy & Consulting', href: '/services/ai-strategy', description: 'Enterprise AI roadmaps & governance' },
          { name: 'PoC Development', href: '/services/poc-development', description: 'Production-ready AI prototypes' },
          { name: 'Agentic AI Solutions', href: '/services/agentic-ai', description: 'Multi-agent orchestration' },
          { name: 'Collaboration', href: '/services/collaboration', description: 'Partnership opportunities' },
        ]
      },
      {
        name: 'Resources',
        href: '/resources/blog',
        children: [
          { name: 'AI Academy', href: '/ai-academy', description: 'Free AI courses & learning paths', badge: 'Free' },
          { name: 'Blog', href: '/resources/blog', description: 'AI insights & articles' },
          { name: 'Videos', href: '/resources/videos', description: 'Training videos & tutorials' },
          { name: 'Workshops & Webinars', href: '/webinars', description: 'Live sessions & recordings' },
          { name: 'Claude Cowork', href: '/claude-cowork', description: 'Free 4-hour Claude workshop', badge: 'Closed' },
          { name: 'AI Readiness', href: '/ai-readiness', description: 'Assess your AI readiness' },
        ]
      },
      {
        name: 'About',
        href: '/about',
        children: [
          { name: 'My Journey', href: '/about/journey', description: '14+ years in enterprise AI' },
          { name: 'Gennoor Tech', href: '/about/company', description: 'About the company' },
          { name: 'Certifications', href: '/about/certifications', description: '16 professional credentials' },
          { name: 'Case Studies', href: '/portfolio/case-studies', description: 'Client success stories' },
          { name: 'Testimonials', href: '/portfolio/testimonials', description: 'What clients say' },
          { name: 'Open Source', href: '/portfolio/open-source', description: 'Community contributions' },
        ]
      },
      { name: 'Contact', href: '/contact' },
    ],

    footer: [
      {
        title: 'Programs',
        links: [
          { name: 'Training Programs', href: '/services/training' },
          { name: 'Azure AI Foundry Workshop', href: '/services/azure-ai-foundry-workshop' },
          { name: 'Copilot Studio Training', href: '/services/copilot-studio-training' },
          { name: 'Certifications', href: '/services/certifications' },
        ]
      },
      {
        title: 'Services',
        links: [
          { name: 'AI Strategy', href: '/services/ai-strategy' },
          { name: 'PoC Development', href: '/services/poc-development' },
          { name: 'Agentic AI', href: '/services/agentic-ai' },
          { name: 'Collaboration', href: '/services/collaboration' },
        ]
      },
      {
        title: 'Resources',
        links: [
          { name: 'AI Academy', href: '/ai-academy' },
          { name: 'Blog', href: '/resources/blog' },
          { name: 'Videos', href: '/resources/videos' },
          { name: 'AI Readiness', href: '/ai-readiness' },
        ]
      },
      {
        title: 'About',
        links: [
          { name: 'My Journey', href: '/about/journey' },
          { name: 'Certifications', href: '/about/certifications' },
          { name: 'Case Studies', href: '/portfolio/case-studies' },
          { name: 'Open Source', href: '/portfolio/open-source' },
        ]
      },
    ]
  },

  // Hero section content
  hero: {
    headline: 'Transform Your Organization with Practical AI Solutions — Expert-Led Training from Strategy to Implementation',
    subheadline: 'Drawing from 14+ years working with Fortune 500 companies across 6 countries',
    cta1: { text: 'Book a Discovery Call', href: '/resources/calendar' },
    cta2: { text: 'Check Your AI Readiness', href: '/ai-readiness' },
  },

  // Trusted by companies
  trustedBy: [
    'Microsoft', 'IBM', 'EY', 'Boeing', 'Saudi Aramco',
    'HDFC Bank', 'Siemens', 'TCS', 'Capgemini', 'Wipro'
  ],

  // Key metrics
  metrics: {
    trainingPrograms: '80+',
    certifications: '16',
    cSuiteLeaders: '50+',
    webinarParticipants: '500+',
    countries: '6+',
    yearsExperience: '14+'
  },

  // Service pillars
  services: [
    {
      title: 'AI Strategy & Consulting',
      description: 'Enterprise AI roadmaps, ROI modeling, and governance frameworks',
      icon: 'Strategy',
      href: '/services/ai-strategy'
    },
    {
      title: 'Corporate Training',
      description: 'Executive bootcamps and technical workshops on Azure AI, Copilot, Power Platform',
      icon: 'GraduationCap',
      href: '/services/training'
    },
    {
      title: 'PoC Development',
      description: 'Production-ready prototypes for document intelligence, chatbots, and automation',
      icon: 'Code2',
      href: '/services/poc-development'
    },
    {
      title: 'Agentic AI Solutions',
      description: 'Multi-agent orchestration with LangChain, CrewAI, and Copilot Studio',
      icon: 'Bot',
      href: '/services/agentic-ai'
    }
  ]
}