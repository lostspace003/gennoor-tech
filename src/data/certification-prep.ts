export interface CertificationProgram {
  id: string
  code: string
  title: string
  provider: 'Microsoft' | 'Google' | 'AWS' | 'GitHub' | 'AI CERTs'
  level: 'Fundamentals' | 'Associate' | 'Expert' | 'Specialty'
  description: string
  examDuration: string
  passingScore: string
  prerequisites: string[]
  topics: string[]
  price: string
  validityPeriod: string
  htmlContent?: string
}

export interface CertificationWithSlug extends CertificationProgram {
  slug: string
}

function certSlug(code: string, title: string): string {
  return `${code}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function getAllCertifications(): CertificationWithSlug[] {
  const all = [...microsoftCertifications, ...googleCertifications, ...awsCertifications, ...githubCertifications, ...aiCertsCertifications]
  return all.map(c => ({ ...c, slug: certSlug(c.code, c.title) }))
}

export function getCertificationBySlug(slug: string): CertificationWithSlug | undefined {
  return getAllCertifications().find(c => c.slug === slug)
}

export const microsoftCertifications: CertificationProgram[] = [
  // AI Certifications (Latest 2025-2026)
  {
    id: 'ms-ai-901',
    code: 'AI-901',
    title: 'Azure AI Fundamentals',
    provider: 'Microsoft',
    level: 'Fundamentals',
    description: 'Demonstrates foundational knowledge of AI concepts, Microsoft Foundry, and generative AI capabilities. This certification replaces AI-901 and focuses on modern AI architectures.',
    examDuration: '60 minutes',
    passingScore: '700/1000',
    prerequisites: [],
    topics: [
      'AI workloads and Microsoft Foundry fundamentals',
      'Fundamental principles of machine learning and generative AI',
      'Computer vision and multimodal AI workloads',
      'Natural Language Processing and conversational AI',
      'Generative AI and prompt engineering basics',
      'Responsible AI principles and governance'
    ],
    price: '$99 USD',
    validityPeriod: 'No expiration'
  },
  {
    id: 'ms-ai-103',
    code: 'AI-103',
    title: 'Azure AI App and Agent Developer Associate',
    provider: 'Microsoft',
    level: 'Associate',
    description: 'Build generative apps, multistep reasoning workflows, and production-ready agents with multi-agent orchestration capabilities. Replaces AI-103.',
    examDuration: '180 minutes',
    passingScore: '700/1000',
    prerequisites: ['Experience with generative AI architectures', 'Familiarity with Microsoft Foundry', 'Understanding of agentic AI patterns'],
    topics: [
      'Plan and manage AI resources in Microsoft Foundry',
      'Build generative apps and reasoning workflows',
      'Develop production-ready AI agents',
      'Implement multi-agent orchestration',
      'Deploy and monitor AI solutions at scale',
      'Implement RAG patterns and vector databases'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'ms-ab-100',
    code: 'AB-100',
    title: 'Agentic AI Business Solutions Architect',
    provider: 'Microsoft',
    level: 'Specialty',
    description: 'Design and architect autonomous AI agents and multi-agent systems for enterprise business solutions.',
    examDuration: '150 minutes',
    passingScore: '700/1000',
    prerequisites: ['Experience with AI/ML concepts', 'Understanding of agent architectures', 'Business solution design experience'],
    topics: [
      'Design agent architecture and orchestration',
      'Implement tool integration and function calling',
      'Build multi-agent collaboration systems',
      'Integrate with enterprise systems',
      'Implement agent memory and context management',
      'Deploy and monitor agent solutions'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'ms-ab-730',
    code: 'AB-730',
    title: 'AI Business Professional',
    provider: 'Microsoft',
    level: 'Associate',
    description: 'Use generative AI and Copilot to streamline business workflows and improve outcomes without coding. Focus on business value and AI implementation.',
    examDuration: '120 minutes',
    passingScore: '700/1000',
    prerequisites: ['Business analysis experience', 'Understanding of business processes'],
    topics: [
      'Identify AI opportunities in business workflows',
      'Implement Copilot solutions for business processes',
      'Measure and optimize AI business impact',
      'Manage AI adoption and change management',
      'Ensure responsible AI in business contexts',
      'Create AI-powered business automations'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'ms-ab-731',
    code: 'AB-731',
    title: 'AI Transformation Leader',
    provider: 'Microsoft',
    level: 'Expert',
    description: 'Define business value of AI, integrate AI solutions using Copilot and Foundry Tools, and drive company-wide AI adoption for transformative impact.',
    examDuration: '180 minutes',
    passingScore: '700/1000',
    prerequisites: ['Leadership experience', 'Strategic planning skills', 'Change management experience'],
    topics: [
      'Develop AI transformation strategy',
      'Lead organizational AI adoption',
      'Integrate AI across business units',
      'Measure AI transformation success',
      'Build AI-ready culture and workforce',
      'Govern AI initiatives at enterprise scale'
    ],
    price: '$300 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'ms-ab-900',
    code: 'AB-900',
    title: 'Microsoft 365 Copilot and Agent Administration Fundamentals',
    provider: 'Microsoft',
    level: 'Fundamentals',
    description: 'Configure, secure, and support AI-powered Microsoft 365 environments. Entry-level certification for managing Copilot and agent services.',
    examDuration: '60 minutes',
    passingScore: '700/1000',
    prerequisites: [],
    topics: [
      'Microsoft 365 Copilot architecture and components',
      'Configure Copilot settings and policies',
      'Manage agent services and permissions',
      'Implement security and compliance for AI',
      'Monitor and troubleshoot Copilot services',
      'Support end-user adoption and training'
    ],
    price: '$99 USD',
    validityPeriod: 'No expiration'
  },
  {
    id: 'ms-ai-300',
    code: 'AI-300',
    title: 'Machine Learning Operations (MLOps) Engineer Associate',
    provider: 'Microsoft',
    level: 'Associate',
    description: 'Deploy, operationalize, and maintain ML and generative AI solutions in production. Automate, govern, deploy, monitor, and optimize performance. Replaces AI-300.',
    examDuration: '180 minutes',
    passingScore: '700/1000',
    prerequisites: ['Experience with ML model deployment', 'Understanding of CI/CD for AI/ML', 'Knowledge of containerization'],
    topics: [
      'Design and implement MLOps strategies',
      'Deploy and operationalize ML models',
      'Implement continuous integration and delivery for ML',
      'Monitor and maintain ML solutions in production',
      'Implement model governance and compliance',
      'Optimize ML model performance and costs'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },

  // Azure Development & Architecture
  {
    id: 'ms-az-204',
    code: 'AZ-204',
    title: 'Azure Developer Associate',
    provider: 'Microsoft',
    level: 'Associate',
    description: 'Design, build, test, and maintain cloud applications and services on Microsoft Azure.',
    examDuration: '120 minutes',
    passingScore: '700/1000',
    prerequisites: ['1-2 years development experience', 'Proficiency with Azure SDKs'],
    topics: [
      'Develop Azure compute solutions',
      'Develop for Azure storage',
      'Implement Azure security',
      'Monitor, troubleshoot, and optimize solutions',
      'Connect to and consume Azure services'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'ms-az-305',
    code: 'AZ-305',
    title: 'Azure Solutions Architect Expert',
    provider: 'Microsoft',
    level: 'Expert',
    description: 'Design cloud and hybrid solutions that run on Microsoft Azure, including compute, network, storage, monitoring, and security.',
    examDuration: '120 minutes',
    passingScore: '700/1000',
    prerequisites: ['Pass AZ-104 or AZ-204', 'Expert-level Azure administration skills'],
    topics: [
      'Design identity, governance, and monitoring solutions',
      'Design data storage solutions',
      'Design business continuity solutions',
      'Design infrastructure solutions'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'ms-az-400',
    code: 'AZ-400',
    title: 'DevOps Engineer Expert',
    provider: 'Microsoft',
    level: 'Expert',
    description: 'Combine people, process, and technologies to continuously deliver valuable products and services.',
    examDuration: '120 minutes',
    passingScore: '700/1000',
    prerequisites: ['Pass AZ-104 or AZ-204', 'Experience with DevOps practices'],
    topics: [
      'Configure processes and communications',
      'Design and implement source control',
      'Design and implement build and release pipelines',
      'Develop a security and compliance plan',
      'Implement an instrumentation strategy'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },

  // Power Platform
  {
    id: 'ms-pl-900',
    code: 'PL-900',
    title: 'Power Platform Fundamentals',
    provider: 'Microsoft',
    level: 'Fundamentals',
    description: 'Demonstrate the business value and product capabilities of Microsoft Power Platform.',
    examDuration: '45 minutes',
    passingScore: '700/1000',
    prerequisites: [],
    topics: [
      'Describe the business value of Microsoft Power Platform',
      'Identify foundational components',
      'Describe Power Apps capabilities',
      'Describe Power Automate capabilities',
      'Describe Power BI capabilities',
      'Describe Power Virtual Agents capabilities'
    ],
    price: '$99 USD',
    validityPeriod: 'No expiration'
  },
  {
    id: 'ms-pl-200',
    code: 'PL-200',
    title: 'Power Platform Functional Consultant Associate',
    provider: 'Microsoft',
    level: 'Associate',
    description: 'Configure Microsoft Power Platform, create apps and automation, and extend the platform.',
    examDuration: '100 minutes',
    passingScore: '700/1000',
    prerequisites: ['Understanding of Power Platform capabilities'],
    topics: [
      'Configure Microsoft Dataverse',
      'Create apps using Power Apps',
      'Create and manage Power Automate',
      'Implement Power Virtual Agents chatbots',
      'Integrate Power Platform with other services'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'ms-pl-300',
    code: 'PL-300',
    title: 'Power BI Data Analyst Associate',
    provider: 'Microsoft',
    level: 'Associate',
    description: 'Design and build scalable data models, clean and transform data, and enable advanced analytics.',
    examDuration: '100 minutes',
    passingScore: '700/1000',
    prerequisites: ['Experience with data modeling and visualization'],
    topics: [
      'Prepare the data',
      'Model the data',
      'Visualize and analyze the data',
      'Deploy and maintain assets'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'ms-pl-400',
    code: 'PL-400',
    title: 'Power Platform Developer Associate',
    provider: 'Microsoft',
    level: 'Associate',
    description: 'Design, develop, test, secure, and troubleshoot Power Platform solutions.',
    examDuration: '120 minutes',
    passingScore: '700/1000',
    prerequisites: ['Development experience', 'Power Platform knowledge'],
    topics: [
      'Create a technical design',
      'Configure Microsoft Dataverse',
      'Create and configure Power Apps',
      'Configure business process automation',
      'Extend the platform',
      'Develop integrations'
    ],
    price: '$165 USD',
    validityPeriod: '2 years'
  },

  // Microsoft 365
  {
    id: 'ms-ms-900',
    code: 'MS-900',
    title: 'Microsoft 365 Fundamentals',
    provider: 'Microsoft',
    level: 'Fundamentals',
    description: 'Demonstrate foundational knowledge on the considerations and benefits of adopting cloud services and Microsoft 365.',
    examDuration: '45 minutes',
    passingScore: '700/1000',
    prerequisites: [],
    topics: [
      'Describe cloud concepts',
      'Describe Microsoft 365 apps and services',
      'Describe security, compliance, privacy, and trust',
      'Describe Microsoft 365 pricing, licensing, and support'
    ],
    price: '$99 USD',
    validityPeriod: 'No expiration'
  },

  // Security
  {
    id: 'ms-sc-900',
    code: 'SC-900',
    title: 'Security, Compliance, and Identity Fundamentals',
    provider: 'Microsoft',
    level: 'Fundamentals',
    description: 'Demonstrate foundational knowledge of security, compliance, and identity concepts.',
    examDuration: '45 minutes',
    passingScore: '700/1000',
    prerequisites: [],
    topics: [
      'Describe security and compliance concepts',
      'Describe identity concepts',
      'Describe Microsoft Entra capabilities',
      'Describe Microsoft security solutions',
      'Describe Microsoft compliance solutions'
    ],
    price: '$99 USD',
    validityPeriod: 'No expiration'
  }
]

export const googleCertifications: CertificationProgram[] = [
  {
    id: 'gc-cloud-digital-leader',
    code: 'CDL',
    title: 'Cloud Digital Leader',
    provider: 'Google',
    level: 'Fundamentals',
    description: 'Demonstrate knowledge of cloud concepts and Google Cloud products, services, tools, features, benefits, and use cases.',
    examDuration: '90 minutes',
    passingScore: '70%',
    prerequisites: [],
    topics: [
      'Digital transformation with Google Cloud',
      'Innovating with Google Cloud AI/ML',
      'Infrastructure modernization',
      'Understanding Google Cloud security',
      'Scaling with Google Cloud operations'
    ],
    price: '$99 USD',
    validityPeriod: '3 years'
  },
  {
    id: 'gc-ml-engineer',
    code: 'MLE',
    title: 'Professional Machine Learning Engineer',
    provider: 'Google',
    level: 'Expert',
    description: 'Design, build, and productionize ML models to solve business challenges using Google Cloud technologies.',
    examDuration: '120 minutes',
    passingScore: '70%',
    prerequisites: ['3+ years industry experience', '1+ years GCP experience'],
    topics: [
      'Frame ML problems',
      'Architect ML solutions',
      'Design data preparation and processing systems',
      'Develop ML models',
      'Automate & orchestrate ML pipelines',
      'Monitor, optimize, and maintain ML solutions'
    ],
    price: '$200 USD',
    validityPeriod: '2 years'
  },
  {
    id: 'gc-data-engineer',
    code: 'DE',
    title: 'Professional Data Engineer',
    provider: 'Google',
    level: 'Expert',
    description: 'Design, build, operationalize, secure, and monitor data processing systems on Google Cloud.',
    examDuration: '120 minutes',
    passingScore: '70%',
    prerequisites: ['3+ years industry experience', '1+ years GCP experience'],
    topics: [
      'Design data processing systems',
      'Build and operationalize data processing systems',
      'Operationalize machine learning models',
      'Ensure solution quality'
    ],
    price: '$200 USD',
    validityPeriod: '2 years'
  }
]

export const awsCertifications: CertificationProgram[] = [
  {
    id: 'aws-cloud-practitioner',
    code: 'CLF-C02',
    title: 'AWS Certified Cloud Practitioner',
    provider: 'AWS',
    level: 'Fundamentals',
    description: 'Validate overall understanding of the AWS Cloud, independent of specific technical roles.',
    examDuration: '90 minutes',
    passingScore: '700/1000',
    prerequisites: [],
    topics: [
      'Cloud concepts',
      'Security and compliance',
      'Core AWS services',
      'Economics of the AWS Cloud'
    ],
    price: '$100 USD',
    validityPeriod: '3 years'
  },
  {
    id: 'aws-ai-practitioner',
    code: 'AIF-C01',
    title: 'AWS Certified AI Practitioner',
    provider: 'AWS',
    level: 'Fundamentals',
    description: 'Validate knowledge of AI, machine learning, and generative AI concepts and use cases on AWS.',
    examDuration: '90 minutes',
    passingScore: '700/1000',
    prerequisites: [],
    topics: [
      'Fundamentals of AI and ML',
      'Fundamentals of generative AI',
      'Applications of foundation models',
      'Guidelines for responsible AI',
      'Security, compliance, and governance for AI'
    ],
    price: '$100 USD',
    validityPeriod: '3 years'
  },
  {
    id: 'aws-ml-engineer',
    code: 'MLE-C01',
    title: 'AWS Certified Machine Learning Engineer - Associate',
    provider: 'AWS',
    level: 'Associate',
    description: 'Build, deploy, and maintain machine learning solutions in the AWS Cloud for business problems.',
    examDuration: '170 minutes',
    passingScore: '720/1000',
    prerequisites: ['1+ years AWS ML/AI experience'],
    topics: [
      'Data preparation for ML',
      'ML model development',
      'Deployment and orchestration of ML workflows',
      'ML solution monitoring, maintenance, and security'
    ],
    price: '$150 USD',
    validityPeriod: '3 years'
  },
  {
    id: 'aws-ml-specialty',
    code: 'MLS-C01',
    title: 'AWS Certified Machine Learning - Specialty',
    provider: 'AWS',
    level: 'Specialty',
    description: 'Design, implement, deploy, and maintain machine learning solutions for given business problems.',
    examDuration: '180 minutes',
    passingScore: '750/1000',
    prerequisites: ['2+ years ML/deep learning experience on AWS'],
    topics: [
      'Data engineering',
      'Exploratory data analysis',
      'Modeling',
      'Machine learning implementation and operations'
    ],
    price: '$300 USD',
    validityPeriod: '3 years'
  }
]

export const githubCertifications: CertificationProgram[] = [
  {
    id: 'gh-foundations',
    code: 'GH-900',
    title: 'GitHub Foundations',
    provider: 'GitHub',
    level: 'Fundamentals',
    description: 'Demonstrate understanding of GitHub platform, products, and best practices for collaboration.',
    examDuration: '75 minutes',
    passingScore: '70%',
    prerequisites: [],
    topics: [
      'Introduction to Git and GitHub',
      'Working with repositories',
      'Collaboration features',
      'Modern development practices',
      'Project management on GitHub',
      'Community and open source'
    ],
    price: '$99 USD',
    validityPeriod: '3 years'
  },
  {
    id: 'gh-actions',
    code: 'GH-300',
    title: 'GitHub Actions',
    provider: 'GitHub',
    level: 'Associate',
    description: 'Demonstrate proficiency in automating workflows and CI/CD pipelines with GitHub Actions.',
    examDuration: '90 minutes',
    passingScore: '70%',
    prerequisites: ['Experience with GitHub', 'Basic YAML knowledge'],
    topics: [
      'GitHub Actions fundamentals',
      'Workflow syntax and structure',
      'Creating custom actions',
      'Managing secrets and environments',
      'CI/CD implementation',
      'Monitoring and troubleshooting workflows'
    ],
    price: '$99 USD',
    validityPeriod: '3 years'
  },
  {
    id: 'gh-copilot',
    code: 'GH-200',
    title: 'GitHub Copilot',
    provider: 'GitHub',
    level: 'Associate',
    description: 'Master AI-powered coding with GitHub Copilot for enhanced developer productivity.',
    examDuration: '75 minutes',
    passingScore: '70%',
    prerequisites: ['Programming experience'],
    topics: [
      'GitHub Copilot fundamentals',
      'Prompt engineering for code generation',
      'Code completion and suggestions',
      'Test generation',
      'Documentation with Copilot',
      'Best practices and security'
    ],
    price: '$99 USD',
    validityPeriod: '3 years'
  }
]

export const aiCertsCertifications: CertificationProgram[] = [
  {
    id: 'aic-executive',
    code: 'AI+ Executive',
    title: 'AI+ Executive',
    provider: 'AI CERTs',
    level: 'Expert',
    description: 'Executive-level certification for leaders driving AI adoption. Covers strategic AI implementation, ROI measurement, governance frameworks, and organizational transformation with AI.',
    examDuration: '90 minutes',
    passingScore: 'Pass/Fail',
    prerequisites: ['Leadership or management experience', 'Basic understanding of AI concepts'],
    topics: [
      'AI strategy and business transformation',
      'ROI measurement and AI investment decisions',
      'AI governance and ethical frameworks',
      'Organizational change management for AI',
      'AI risk assessment and mitigation',
      'Building AI-ready teams and culture'
    ],
    price: '$299 USD',
    validityPeriod: '1 year'
  },
  {
    id: 'aic-security-l1',
    code: 'AI+ Security L1',
    title: 'AI+ Security Level 1',
    provider: 'AI CERTs',
    level: 'Associate',
    description: 'Foundational AI security certification covering the threat landscape for AI systems, secure AI development practices, data privacy in AI, and AI risk management fundamentals.',
    examDuration: '90 minutes',
    passingScore: 'Pass/Fail',
    prerequisites: ['Basic cybersecurity knowledge', 'Familiarity with AI/ML concepts'],
    topics: [
      'AI threat landscape and attack vectors',
      'Secure AI development lifecycle',
      'Data privacy and protection in AI systems',
      'AI risk management fundamentals',
      'Bias detection and mitigation',
      'Regulatory compliance for AI (EU AI Act, NIST)'
    ],
    price: '$299 USD',
    validityPeriod: '1 year'
  },
  {
    id: 'aic-security-l2',
    code: 'AI+ Security L2',
    title: 'AI+ Security Level 2',
    provider: 'AI CERTs',
    level: 'Expert',
    description: 'Advanced AI security certification covering adversarial machine learning, AI red teaming, enterprise AI security architecture, compliance frameworks, and incident response for AI systems.',
    examDuration: '120 minutes',
    passingScore: 'Pass/Fail',
    prerequisites: ['AI+ Security Level 1 or equivalent', 'Experience with AI/ML systems'],
    topics: [
      'Adversarial machine learning and defenses',
      'AI red teaming and penetration testing',
      'Enterprise AI security architecture',
      'AI compliance and audit frameworks',
      'Incident response for AI systems',
      'Supply chain security for AI models'
    ],
    price: '$399 USD',
    validityPeriod: '1 year'
  }
]

export const allCertifications = [
  ...microsoftCertifications,
  ...googleCertifications,
  ...awsCertifications,
  ...githubCertifications,
  ...aiCertsCertifications
]