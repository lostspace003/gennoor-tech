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
    linkedin: 'https://www.linkedin.com/in/jalal-khan-b8319955/',
    github: 'https://github.com/lostspace003',
    microsoftLearn: 'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab',
    youtube: 'https://www.youtube.com/@GennoorTech',
    twitter: '',
  },

  // Navigation structure from strategy document
  navigation: {
    main: [
      { name: 'Home', href: '/' },
      {
        name: 'About',
        href: '/about',
        children: [
          { name: 'My Journey', href: '/about/journey' },
          { name: 'Certifications', href: '/about/certifications' },
          { name: 'Gennoor Tech', href: '/about/company' },
        ]
      },
      {
        name: 'Services',
        href: '/services',
        children: [
          { name: 'AI Strategy & Consulting', href: '/services/ai-strategy' },
          { name: 'Corporate Training', href: '/services/training' },
          { name: 'PoC Development', href: '/services/poc-development' },
          { name: 'Agentic AI Solutions', href: '/services/agentic-ai' },
          { name: 'Collaboration', href: '/services/collaboration' },
        ]
      },
      {
        name: 'Portfolio',
        href: '/portfolio',
        children: [
          { name: 'Case Studies', href: '/portfolio/case-studies' },
          { name: 'PoCs & Demos', href: '/portfolio/demos' },
          { name: 'Open Source', href: '/portfolio/open-source' },
          { name: 'Client Testimonials', href: '/portfolio/testimonials' },
        ]
      },
      { name: 'Blog', href: '/resources/blog' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Contact', href: '/contact' },
    ],

    footer: [
      {
        title: 'Services',
        links: [
          { name: 'AI Strategy', href: '/services/ai-strategy' },
          { name: 'Corporate Training', href: '/services/training' },
          { name: 'PoC Development', href: '/services/poc-development' },
          { name: 'Agentic AI', href: '/services/agentic-ai' },
        ]
      },
      {
        title: 'About',
        links: [
          { name: 'My Journey', href: '/about/journey' },
          { name: 'Certifications', href: '/about/certifications' },
          { name: 'Case Studies', href: '/portfolio/case-studies' },
          { name: 'PoCs & Demos', href: '/portfolio/demos' },
        ]
      },
      {
        title: 'Company',
        links: [
          { name: 'About', href: '/about' },
          { name: 'Portfolio', href: '/portfolio' },
          { name: 'Contact', href: '/contact' },
          { name: 'Privacy', href: '/privacy' },
        ]
      },
    ]
  },

  // Hero section content
  hero: {
    headline: 'Transform Your Organization with Practical AI Solutions — Expert-Led Training from Strategy to Implementation',
    subheadline: 'Drawing from 14+ years working with Fortune 500 companies across 6 countries',
    cta1: { text: 'Book a Discovery Call', href: '/resources/calendar' },
    cta2: { text: 'Explore My Work', href: '/portfolio' },
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