import { BLOB_URL } from '@/lib/site-config'

export interface Certification {
  id: string
  name: string
  code: string
  issuer: string
  category: 'Expert' | 'Associate' | 'Fundamentals' | 'AI Transformation' | 'Agentic AI' | 'GitHub' | 'AI CERTs' | 'Applied Skills'
  dateEarned?: string
  expiryDate?: string
  credlyBadge?: string
  pdfPath?: string // Path to PDF certificate in public/certificates/
  description?: string
  skills?: string[]
}

export const certifications: Certification[] = [
  // MCT - Microsoft Certified Trainer
  {
    id: 'mct',
    name: 'Microsoft Certified Trainer',
    code: 'MCT 2024-2025',
    issuer: 'Microsoft',
    category: 'Expert',
    dateEarned: 'Since 2022 (Annual Renewal)',
    description: 'Elite status authorizing delivery of official Microsoft training worldwide. Requires proven technical expertise, instructional excellence, and annual renewal based on student feedback.',
    skills: ['Official Microsoft Training', 'Enterprise Education', 'Technical Leadership', 'Curriculum Development', 'Global Delivery'],
    pdfPath: `${BLOB_URL}/certificates/0-mct-certifcate.pdf`
  },
  // AI Transformation & Leadership
  {
    id: 'ab-731',
    name: 'AI Transformation Leader',
    code: 'AB-731',
    issuer: 'Microsoft',
    category: 'AI Transformation',
    description: 'Leading AI transformation initiatives across organizations',
    skills: ['AI Strategy', 'Change Management', 'Digital Transformation'],
    pdfPath: `${BLOB_URL}/certificates/10-ab731.pdf`
  },
  {
    id: 'ab-730',
    name: 'AI Business Professional',
    code: 'AB-730',
    issuer: 'Microsoft',
    category: 'AI Transformation',
    description: 'Business-focused AI implementation and strategy',
    skills: ['AI ROI', 'Business Strategy', 'AI Governance'],
    pdfPath: `${BLOB_URL}/certificates/11-ab730.pdf`
  },
  {
    id: 'ab-100',
    name: 'Agentic AI Business Solutions Architect',
    code: 'AB-100',
    issuer: 'Microsoft',
    category: 'Agentic AI',
    dateEarned: 'March 2026',
    description: 'Designing and architecting agentic AI solutions for enterprises',
    skills: ['Multi-Agent Systems', 'AI Orchestration', 'Enterprise Architecture'],
    pdfPath: `${BLOB_URL}/certificates/5-ab100.pdf`
  },

  // Expert Level
  {
    id: 'az-400',
    name: 'DevOps Engineer Expert',
    code: 'AZ-400',
    issuer: 'Microsoft',
    category: 'Expert',
    description: 'Designing and implementing DevOps practices',
    skills: ['CI/CD', 'Azure DevOps', 'Infrastructure as Code', 'Git'],
    pdfPath: `${BLOB_URL}/certificates/3-az400.pdf`
  },

  // Associate Level
  {
    id: 'ai-103',
    name: 'Azure AI App and Agent Developer Associate',
    code: 'AI-103',
    issuer: 'Microsoft',
    category: 'Associate',
    description: 'Building generative apps, multistep reasoning workflows, and production-ready agents with multi-agent orchestration (Replaces AI-103)',
    skills: ['Azure OpenAI', 'Microsoft Foundry', 'Multi-Agent Systems', 'RAG Patterns', 'Agentic AI'],
    pdfPath: `${BLOB_URL}/certificates/6-ai103.pdf`
  },
  {
    id: 'pl-400',
    name: 'Power Platform Developer Associate',
    code: 'PL-400',
    issuer: 'Microsoft',
    category: 'Associate',
    description: 'Designing, developing, and deploying Power Platform solutions',
    skills: ['Power Apps', 'Power Automate', 'Dataverse', 'PCF'],
    pdfPath: `${BLOB_URL}/certificates/2-pl400.pdf`
  },
  {
    id: 'pl-200',
    name: 'Power Platform Functional Consultant Associate',
    code: 'PL-200',
    issuer: 'Microsoft',
    category: 'Associate',
    description: 'Configuring Power Platform solutions for organizations',
    skills: ['Model-driven Apps', 'Canvas Apps', 'Power BI', 'Business Process Flows'],
    pdfPath: `${BLOB_URL}/certificates/14-pl200.pdf`
  },
  {
    id: 'pl-100',
    name: 'Power Platform App Maker',
    code: 'PL-100',
    issuer: 'Microsoft',
    category: 'Associate',
    description: 'Building Power Platform applications',
    skills: ['Canvas Apps', 'Model-driven Apps', 'Power Automate', 'Dataverse'],
    pdfPath: `${BLOB_URL}/certificates/15-pl100.pdf`
  },
  {
    id: 'ai-300',
    name: 'Machine Learning Operations (MLOps) Engineer Associate',
    code: 'AI-300',
    issuer: 'Microsoft',
    category: 'Associate',
    description: 'Deploy, operationalize, and maintain ML and generative AI solutions in production (Replaces AI-300)',
    skills: ['MLOps', 'Azure ML', 'Model Deployment', 'CI/CD for ML', 'Model Monitoring'],
    pdfPath: `${BLOB_URL}/certificates/4-ai300.pdf`
  },
  {
    id: 'az-204',
    name: 'Azure Developer Associate',
    code: 'AZ-204',
    issuer: 'Microsoft',
    category: 'Associate',
    description: 'Developing solutions for Microsoft Azure',
    skills: ['Azure Functions', 'App Service', 'Storage', 'Azure AD'],
    pdfPath: `${BLOB_URL}/certificates/7-az204.pdf`
  },

  // Fundamentals
  {
    id: 'ai-901',
    name: 'Azure AI Fundamentals',
    code: 'AI-901',
    issuer: 'Microsoft',
    category: 'Fundamentals',
    description: 'Understanding AI concepts, Microsoft Foundry, and generative AI capabilities (Replaces AI-901)',
    skills: ['AI Concepts', 'Microsoft Foundry', 'Generative AI', 'Prompt Engineering', 'Responsible AI'],
    pdfPath: `${BLOB_URL}/certificates/12-ai901.pdf`
  },
  {
    id: 'ab-900',
    name: 'Microsoft 365 Copilot and Agent Administration Fundamentals',
    code: 'AB-900',
    issuer: 'Microsoft',
    category: 'Fundamentals',
    description: 'Configure, secure, and support AI-powered Microsoft 365 environments',
    skills: ['Microsoft 365 Copilot', 'Agent Services', 'AI Security', 'Copilot Administration'],
    pdfPath: `${BLOB_URL}/certificates/16-ab900.pdf`
  },
  {
    id: 'pl-900',
    name: 'Power Platform Fundamentals',
    code: 'PL-900',
    issuer: 'Microsoft',
    category: 'Fundamentals',
    description: 'Understanding the capabilities of Power Platform',
    skills: ['Power Apps Basics', 'Power Automate', 'Power BI', 'Power Virtual Agents'],
    pdfPath: `${BLOB_URL}/certificates/13-pl900.pdf`
  },

  // GitHub Certifications
  {
    id: 'gh-900',
    name: 'GitHub Foundations',
    code: 'GH-900',
    issuer: 'GitHub',
    category: 'GitHub',
    description: 'Core concepts of GitHub and version control',
    skills: ['Git', 'GitHub', 'Version Control', 'Collaboration'],
    pdfPath: `${BLOB_URL}/certificates/9-github-foundations.pdf`
  },
  {
    id: 'gh-300',
    name: 'GitHub Copilot',
    code: 'GH-300',
    issuer: 'GitHub',
    category: 'GitHub',
    description: 'Using GitHub Copilot for AI-powered development',
    skills: ['AI Coding', 'Copilot', 'Code Generation', 'Productivity'],
    pdfPath: `${BLOB_URL}/certificates/8-github-copilot.pdf`
  },

  // AI CERTs Certifications
  {
    id: 'aict',
    name: 'AI CERTs Certified Trainer',
    code: 'AICT',
    issuer: 'AI CERTs',
    category: 'AI CERTs',
    dateEarned: 'April 2026',
    description: 'Authorized to deliver official AI CERTs training programs worldwide. Certified by AI CERTs (Russell Sarder, Chairman & CEO).',
    skills: ['AI CERTs Training Delivery', 'AI+ Certification Programs', 'Enterprise AI Education'],
    pdfPath: `${BLOB_URL}/certificates/17-aict.pdf`
  },
  {
    id: 'ai-executive',
    name: 'AI+ Executive',
    code: 'AI+ Executive',
    issuer: 'AI CERTs',
    category: 'AI CERTs',
    dateEarned: 'April 2026',
    expiryDate: 'April 2027',
    description: 'Executive-level AI certification covering strategic AI implementation, leadership, and organizational transformation.',
    skills: ['AI Strategy', 'Executive Leadership', 'AI Governance', 'Business Transformation'],
    pdfPath: `${BLOB_URL}/certificates/18-ai-executive.pdf`
  },
  {
    id: 'ai-security-l1',
    name: 'AI+ Security Level 1',
    code: 'AI+ Security L1',
    issuer: 'AI CERTs',
    category: 'AI CERTs',
    dateEarned: 'April 2026',
    expiryDate: 'April 2027',
    description: 'Foundational AI security certification covering threat landscapes, secure AI development, and AI risk management.',
    skills: ['AI Security Fundamentals', 'Threat Modeling', 'Secure AI Development', 'Risk Assessment'],
    pdfPath: `${BLOB_URL}/certificates/19-ai-security-l1.pdf`
  },
  {
    id: 'ai-security-l2',
    name: 'AI+ Security Level 2',
    code: 'AI+ Security L2',
    issuer: 'AI CERTs',
    category: 'AI CERTs',
    dateEarned: 'April 2026',
    expiryDate: 'April 2027',
    description: 'Advanced AI security certification covering adversarial ML, AI compliance frameworks, and enterprise AI security architecture.',
    skills: ['Adversarial ML', 'AI Compliance', 'Security Architecture', 'Red Teaming AI'],
    pdfPath: `${BLOB_URL}/certificates/20-ai-security-l2.pdf`
  },

  // Applied Skills
  {
    id: 'as-001',
    name: 'Streamline Business Workflows with AI Chat',
    code: 'Applied Skill',
    issuer: 'Microsoft',
    category: 'Applied Skills',
    description: 'Building AI-powered chat solutions for business workflows',
    skills: ['Conversational AI', 'Business Automation', 'Chatbots'],
    pdfPath: `${BLOB_URL}/certificates/1-applied-skill=streamline-business-workflows-with-Ai-chat.pdf`
  },
  // Add more Applied Skills certifications as needed
]

// Helper functions
export const getCertificationsByCategory = (category: Certification['category']) => {
  return certifications.filter(cert => cert.category === category)
}

export const getActiveCertificationsCount = () => {
  return certifications.length
}

// Microsoft Learn Stats
export const microsoftLearnStats = {
  hours: '376+',
  modules: 506,
  learningPaths: 126,
  exams: 20,
  trophies: 88,
  points: 45000, // Update with actual
  profileUrl: 'https://learn.microsoft.com/en-us/users/lostspace003/transcript/vjw63s4jxnmmwre?tab=credentials-tab'
}

// MCT Status
export const mctStatus = {
  status: 'Active',
  since: '2022',
  currentYear: '2024-2025',
  id: 'MCT',
  specializations: [
    'Azure AI',
    'Power Platform',
    'Microsoft 365 Copilot',
    'Agentic AI'
  ]
}

// AICT Status
export const aictStatus = {
  status: 'Active',
  since: '2026',
  id: 'AICT4398',
  programs: [
    'AI+ Executive',
    'AI+ Security Level 1',
    'AI+ Security Level 2'
  ]
}