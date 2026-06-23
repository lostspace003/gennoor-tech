// Azure Blob Storage base URL for all static assets
// Media served through our secured proxy route — blob storage is private
export const BLOB_URL = process.env.NEXT_PUBLIC_BLOB_URL || '/media'

export const siteConfig = {
  name: 'Gennoor Tech',
  tagline: 'Enterprise AI Transformation',
  brandPromise: 'Diagnose. Train. Innovate. Build. Sustain.',
  description: 'Enterprise AI transformation partner for organizations across GCC, Africa, and South Asia — from readiness diagnostic to deployed agents to long-term sustainment. Senior Microsoft-certified delivery, boutique speed, transparent pricing.',
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

  // Navigation structure — 6 tabs, competitor-benchmarked for SEO & discoverability
  navigation: {
    main: [
      {
        name: 'Training',
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
        name: 'Build & Consulting',
        href: '/services',
        children: [
          { name: 'For SMB', href: '/solutions/for-smb', description: 'Productized AI packages from $3k · 6-week pilots' },
          { name: 'For Enterprise', href: '/solutions/for-enterprise', description: 'Multi-quarter transformation programs · procurement-ready' },
          { name: 'AI Strategy & Consulting', href: '/services/ai-strategy', description: 'Enterprise AI roadmaps & governance' },
          { name: 'PoC Development', href: '/services/poc-development', description: 'Production-ready AI prototypes' },
          { name: 'Agentic AI Solutions', href: '/services/agentic-ai', description: 'Multi-agent orchestration' },
          { name: 'Collaboration', href: '/services/collaboration', description: 'Partnership opportunities' },
        ]
      },
      { name: 'The Gennoor Way', href: '/the-gennoor-way' },
      {
        name: 'Resources',
        href: '/resources/blog',
        children: [
          { name: 'Gennoor Academy', href: '/academy', description: '42 courses across 6 tracks · interactive AB-100 included', badge: 'New' },
          { name: 'Blog', href: '/resources/blog', description: 'AI insights & articles' },
          { name: 'Videos', href: '/resources/videos', description: 'Training videos & tutorials' },
          { name: 'Webinars', href: '/webinars', description: 'Live & recorded sessions' },
          { name: 'Workshops', href: '/workshops', description: 'Hands-on free workshops' },
          { name: 'AI Readiness', href: '/ai-readiness', description: 'Assess your AI readiness' },
        ]
      },
      {
        name: 'About',
        href: '/about',
        children: [
          { name: 'My Journey', href: '/about/journey', description: '14+ years in enterprise AI' },
          { name: 'Gennoor Tech', href: '/about/company', description: 'About the company' },
          { name: 'Team & Delivery', href: '/about/team-and-delivery', description: 'Senior-only model · operating cadence · capacity' },
          { name: 'Trust & Security', href: '/about/trust-and-security', description: 'Data, IP, compliance, sub-processors, stack' },
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
        title: 'Training',
        links: [
          { name: 'Training Programs', href: '/services/training' },
          { name: 'Azure AI Foundry Workshop', href: '/services/azure-ai-foundry-workshop' },
          { name: 'Copilot Studio Training', href: '/services/copilot-studio-training' },
          { name: 'Certifications', href: '/services/certifications' },
        ]
      },
      {
        title: 'Build & Consulting',
        links: [
          { name: 'For SMB', href: '/solutions/for-smb' },
          { name: 'For Enterprise', href: '/solutions/for-enterprise' },
          { name: 'The Gennoor Way', href: '/the-gennoor-way' },
          { name: 'PoC Development', href: '/services/poc-development' },
        ]
      },
      {
        title: 'Resources',
        links: [
          { name: 'Gennoor Academy', href: '/academy' },
          { name: 'Blog', href: '/resources/blog' },
          { name: 'Videos', href: '/resources/videos' },
          { name: 'AI Readiness', href: '/ai-readiness' },
        ]
      },
      {
        title: 'About',
        links: [
          { name: 'My Journey', href: '/about/journey' },
          { name: 'Team & Delivery', href: '/about/team-and-delivery' },
          { name: 'Trust & Security', href: '/about/trust-and-security' },
          { name: 'Certifications', href: '/about/certifications' },
        ]
      },
    ]
  },

  // Hero section content
  hero: {
    badge: 'Enterprise AI Transformation • GCC · Africa · South Asia',
    headline: 'We train your team and build your first production AI agent — fixed price, from $3k, live in 6 weeks.',
    brandPromise: 'Diagnose. Train. Innovate. Build. Sustain.',
    subheadline: 'Three ways we work: we train your people, build your production AI, and advise your leadership — from the first readiness diagnostic to your hundredth deployed agent.',
    cta1: { text: 'Run AI Readiness Diagnostic', href: '/ai-readiness' },
    cta2: { text: 'Talk to our team', href: '/contact' },
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