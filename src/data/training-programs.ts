import { BLOB_URL } from '@/lib/site-config'

export interface TrainingProgram {
  id: string
  title: string
  category: 'bootcamp' | 'course'
  duration: string
  level: string
  audience: string
  description: string
  highlights: string[]
  modules?: string[]
  htmlFile: string
  docFile: string
  pdfFile?: string
  technology: string
  certification: string
  industry: string
}

export const bootcamps: TrainingProgram[] = [
  {
    id: 'bootcamp-1',
    title: 'AI Transformation for Business Leaders',
    category: 'bootcamp',
    duration: '5 days',
    level: 'Executive',
    audience: 'C-Suite, Senior Management',
    description: 'Master AI strategy and transformation to lead your organization into the future.',
    highlights: [
      'AI Strategy Development',
      'ROI & Business Case Building',
      'Change Management',
      'Risk & Governance'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-1-AI-Transformation-Business-Leaders.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-1-AI-Transformation-Business-Leaders.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-1-AI-Transformation-Business-Leaders.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'bootcamp-2',
    title: 'GenAI Copilot Mastery',
    category: 'bootcamp',
    duration: '5 days',
    level: 'Intermediate',
    audience: 'Business Users, Analysts',
    description: 'Master Microsoft Copilot and generative AI tools for maximum productivity.',
    highlights: [
      'Microsoft 365 Copilot',
      'GitHub Copilot',
      'Copilot Studio',
      'Custom AI Assistants'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-2-GenAI-Copilot-Mastery.html?v=1773462701727`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-2-GenAI-Copilot-Mastery.docx`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-2-GenAI-Copilot-Mastery.pdf`,
    technology: 'Microsoft',
    certification: 'Yes',
    industry: 'Cross-Industry'
  },
  {
    id: 'bootcamp-3',
    title: 'Agentic AI Engineering',
    category: 'bootcamp',
    duration: '10 days',
    level: 'Advanced',
    audience: 'AI Engineers, Developers',
    description: 'Build autonomous AI agents and multi-agent systems for enterprise applications.',
    highlights: [
      'Agent Architecture',
      'LangChain & LangGraph',
      'Multi-Agent Systems',
      'Production Deployment'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-3-Agentic-AI-Engineering.html?v=1773462701727`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-3-Agentic-AI-Engineering.docx`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-3-Agentic-AI-Engineering.pdf`,
    technology: 'Open Source',
    certification: 'Yes',
    industry: 'Technology'
  },
  {
    id: 'bootcamp-4',
    title: 'Data Science & Machine Learning',
    category: 'bootcamp',
    duration: '8 days',
    level: 'Intermediate',
    audience: 'Data Scientists, Analysts',
    description: 'Comprehensive data science and ML fundamentals with hands-on projects.',
    highlights: [
      'Statistical Analysis',
      'Machine Learning Algorithms',
      'Feature Engineering',
      'Model Deployment'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-4-Data-Science-Machine-Learning.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-4-Data-Science-Machine-Learning.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-4-Data-Science-Machine-Learning.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'bootcamp-5',
    title: 'Deep Learning & Computer Vision',
    category: 'bootcamp',
    duration: '10 days',
    level: 'Advanced',
    audience: 'ML Engineers, Researchers',
    description: 'Master deep learning and computer vision for cutting-edge AI applications.',
    highlights: [
      'Neural Networks',
      'CNNs & RNNs',
      'Computer Vision',
      'Transfer Learning'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-5-Deep-Learning-Computer-Vision.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-5-Deep-Learning-Computer-Vision.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-5-Deep-Learning-Computer-Vision.docx`,
    technology: 'Open Source',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'bootcamp-6',
    title: 'Production AI & MLOps',
    category: 'bootcamp',
    duration: '7 days',
    level: 'Advanced',
    audience: 'ML Engineers, DevOps',
    description: 'Deploy and manage AI systems at scale with MLOps best practices.',
    highlights: [
      'Model Versioning',
      'CI/CD for ML',
      'Monitoring & Observability',
      'Kubernetes & Docker'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-6-Production-AI-MLOps.html?v=1773462701727`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-6-Production-AI-MLOps.docx`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-6-Production-AI-MLOps.pdf`,
    technology: 'Multi-Cloud',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'bootcamp-7',
    title: 'AI Development Framework',
    category: 'bootcamp',
    duration: '5 days',
    level: 'Intermediate',
    audience: 'Developers, Architects',
    description: 'Build robust AI applications with modern frameworks and best practices.',
    highlights: [
      'LangChain',
      'Semantic Kernel',
      'Vector Databases',
      'RAG Architecture'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-7-AI-Development-Framework.html?v=1773462701727`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-7-AI-Development-Framework.docx`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-7-AI-Development-Framework.pdf`,
    technology: 'Open Source',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'bootcamp-8',
    title: 'Microsoft AI for Developers',
    category: 'bootcamp',
    duration: '5 days',
    level: 'Intermediate',
    audience: 'Developers, Engineers',
    description: 'Master Microsoft AI services with Azure AI Foundry and Azure OpenAI for enterprise solutions.',
    highlights: [
      'Azure AI Foundry',
      'Azure OpenAI Service',
      'Cognitive Services',
      'Responsible AI'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-8-Microsoft-AI-for-Developers.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-8-Microsoft-AI-for-Developers.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-8-Microsoft-AI-for-Developers.docx`,
    technology: 'Microsoft',
    certification: 'Yes',
    industry: 'Cross-Industry'
  },
  {
    id: 'bootcamp-9',
    title: 'AI on Google Cloud',
    category: 'bootcamp',
    duration: '5 days',
    level: 'Intermediate',
    audience: 'Cloud Engineers, Developers',
    description: 'Build and deploy AI solutions on Google Cloud Platform.',
    highlights: [
      'Vertex AI',
      'AutoML',
      'BigQuery ML',
      'TensorFlow on GCP'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-9-AI-on-Google-Cloud.html?v=1773462701727`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-9-AI-on-Google-Cloud.docx`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-9-AI-on-Google-Cloud.pdf`,
    technology: 'Google Cloud',
    certification: 'Yes',
    industry: 'Cross-Industry'
  },
  {
    id: 'bootcamp-10',
    title: 'AI on AWS',
    category: 'bootcamp',
    duration: '5 days',
    level: 'Intermediate',
    audience: 'Cloud Engineers, Developers',
    description: 'Leverage AWS AI services for scalable machine learning solutions.',
    highlights: [
      'SageMaker',
      'Rekognition',
      'Comprehend',
      'Bedrock'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-10-AI-on-AWS.html?v=1773462701727`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-10-AI-on-AWS.docx`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-10-AI-on-AWS.pdf`,
    technology: 'AWS',
    certification: 'Yes',
    industry: 'Cross-Industry'
  },
  {
    id: 'bootcamp-11',
    title: 'AB100 Certification Prep',
    category: 'bootcamp',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'AI Professionals',
    description: 'Prepare for the Agentic AI AB100 certification exam.',
    highlights: [
      'Agent Architecture',
      'Prompt Engineering',
      'Tool Integration',
      'Exam Preparation'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-11-AB100-Certification-Prep.html?v=1773462701727`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-11-AB100-Certification-Prep.docx`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-11-AB100-Certification-Prep.pdf`,
    technology: 'Cross-Platform',
    certification: 'Yes',
    industry: 'Technology'
  },
  {
    id: 'bootcamp-12',
    title: 'Development using Claude AI',
    category: 'bootcamp',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'Developers',
    description: 'Build applications with Claude AI and Anthropic APIs.',
    highlights: [
      'Claude API',
      'Prompt Engineering',
      'Function Calling',
      'Production Best Practices'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-12-Development-using-Claude-AI.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-12-Development-using-Claude-AI.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-12-Development-using-Claude-AI.docx`,
    technology: 'Claude/Anthropic',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'bootcamp-13',
    title: 'Azure AI Foundry & Semantic Kernel',
    category: 'bootcamp',
    duration: '5 days',
    level: 'Advanced',
    audience: 'AI Engineers, Solution Architects',
    description: 'Master the new Azure AI Foundry platform with deep-dive into Semantic Kernel orchestration.',
    highlights: [
      'Azure AI Foundry Platform',
      'Semantic Kernel Deep-Dive',
      'Advanced RAG Systems',
      'Production Deployment'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-13-Azure-AI-Foundry-Semantic-Kernel.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-13-Azure-AI-Foundry-Semantic-Kernel.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-13-Azure-AI-Foundry-Semantic-Kernel.docx`,
    technology: 'Microsoft Azure',
    certification: 'AI-103 Aligned',
    industry: 'Technology'
  },
  {
    id: 'bootcamp-14',
    title: 'Microsoft Applied Skills Bootcamp',
    category: 'bootcamp',
    duration: '5 days',
    level: 'Intermediate',
    audience: 'Job Seekers, Developers, Cloud Engineers',
    description: 'Earn 6 Microsoft Applied Skills in 5 days - practical, hands-on validation employers demand.',
    highlights: [
      '6 Applied Skills Credentials',
      'Performance-Based Assessments',
      '100% Hands-On Labs',
      'All Exam Vouchers Included'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-14-Microsoft-Applied-Skills.html?v=1773462701727`,
    docFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-14-Microsoft-Applied-Skills.docx`,
    pdfFile: `${BLOB_URL}/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-14-Microsoft-Applied-Skills.pdf`,
    technology: 'Microsoft Azure',
    certification: 'Yes',
    industry: 'Cross-Industry'
  }
]

export const courses: TrainingProgram[] = [
  {
    id: 'course-1',
    title: 'AI Transformation for Business Leaders',
    category: 'course',
    duration: '2 days',
    level: 'Executive',
    audience: 'C-Suite, Senior Management',
    description: 'Strategic AI adoption and transformation for business leaders.',
    highlights: [
      'AI Strategy',
      'Business Cases',
      'Risk Management',
      'Governance'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/01-AI-Transformation-Business-Leaders.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/01-AI-Transformation-Business-Leaders.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/01-AI-Transformation-Business-Leaders.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-2',
    title: 'Generative AI & Copilot Mastery',
    category: 'course',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'Business Users',
    description: 'Master generative AI tools and Microsoft Copilot ecosystem.',
    highlights: [
      'Copilot for M365',
      'Prompt Engineering',
      'Custom Copilots',
      'Productivity Optimization'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/02-Generative-AI-Copilot-Mastery.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/02-Generative-AI-Copilot-Mastery.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/02-Generative-AI-Copilot-Mastery.docx`,
    technology: 'Microsoft',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-3',
    title: 'Agentic AI Engineering',
    category: 'course',
    duration: '5 days',
    level: 'Advanced',
    audience: 'AI Engineers',
    description: 'Build autonomous AI agents and multi-agent systems.',
    highlights: [
      'Agent Design',
      'Tool Integration',
      'Multi-Agent Systems',
      'Production Deployment'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/03-Agentic-AI-Engineering.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/03-Agentic-AI-Engineering.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/03-Agentic-AI-Engineering.docx`,
    technology: 'Open Source',
    certification: 'Yes',
    industry: 'Technology'
  },
  {
    id: 'course-4',
    title: 'Data Science & Machine Learning',
    category: 'course',
    duration: '4 days',
    level: 'Intermediate',
    audience: 'Data Scientists',
    description: 'Comprehensive data science and ML fundamentals.',
    highlights: [
      'Statistical Analysis',
      'ML Algorithms',
      'Model Training',
      'Evaluation Metrics'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/04-Data-Science-Machine-Learning.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/04-Data-Science-Machine-Learning.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/04-Data-Science-Machine-Learning.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-5',
    title: 'Deep Learning & Computer Vision',
    category: 'course',
    duration: '5 days',
    level: 'Advanced',
    audience: 'ML Engineers',
    description: 'Advanced deep learning and computer vision techniques.',
    highlights: [
      'Neural Networks',
      'CNNs',
      'Object Detection',
      'Image Segmentation'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/05-Deep-Learning-Computer-Vision.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/05-Deep-Learning-Computer-Vision.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/05-Deep-Learning-Computer-Vision.docx`,
    technology: 'Open Source',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'course-6',
    title: 'Production AI & MLOps',
    category: 'course',
    duration: '3 days',
    level: 'Advanced',
    audience: 'ML Engineers, DevOps',
    description: 'Deploy and manage AI systems at scale.',
    highlights: [
      'Model Deployment',
      'CI/CD for ML',
      'Monitoring',
      'Scalability'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/06-Production-AI-MLOps.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/06-Production-AI-MLOps.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/06-Production-AI-MLOps.docx`,
    technology: 'Multi-Cloud',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'course-7',
    title: 'AI Development Framework',
    category: 'course',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'Developers',
    description: 'Build AI applications with modern frameworks.',
    highlights: [
      'LangChain',
      'Vector DBs',
      'RAG Systems',
      'API Integration'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/07-AI-Development-Framework.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/07-AI-Development-Framework.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/07-AI-Development-Framework.docx`,
    technology: 'Open Source',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'course-8',
    title: 'Microsoft AI for Developers',
    category: 'course',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'Developers',
    description: 'Master Microsoft AI services with Azure AI Foundry and Azure OpenAI.',
    highlights: [
      'Azure AI Foundry',
      'Azure OpenAI',
      'Cognitive Services',
      'Semantic Kernel'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/08-Microsoft-AI-for-Developers.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/08-Microsoft-AI-for-Developers.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/08-Microsoft-AI-for-Developers.docx`,
    technology: 'Microsoft',
    certification: 'Yes',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-9',
    title: 'AI on Google Cloud',
    category: 'course',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'Cloud Engineers',
    description: 'Build AI solutions on Google Cloud Platform.',
    highlights: [
      'Vertex AI',
      'AutoML',
      'BigQuery ML',
      'AI Platform'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/09-AI-on-Google-Cloud.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/09-AI-on-Google-Cloud.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/09-AI-on-Google-Cloud.docx`,
    technology: 'Google Cloud',
    certification: 'Yes',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-10',
    title: 'AI on AWS',
    category: 'course',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'Cloud Engineers',
    description: 'Leverage AWS AI services for ML solutions.',
    highlights: [
      'SageMaker',
      'Bedrock',
      'Rekognition',
      'Comprehend'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/10-AI-on-AWS.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/10-AI-on-AWS.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/10-AI-on-AWS.docx`,
    technology: 'AWS',
    certification: 'Yes',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-11',
    title: 'AB100 Certification Prep',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'AI Professionals',
    description: 'Prepare for Agentic AI AB100 certification.',
    highlights: [
      'Exam Objectives',
      'Practice Tests',
      'Key Concepts',
      'Tips & Strategies'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/11-AB100-Certification-Prep.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/11-AB100-Certification-Prep.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/11-AB100-Certification-Prep.docx`,
    technology: 'Cross-Platform',
    certification: 'Yes',
    industry: 'Technology'
  },
  {
    id: 'course-12',
    title: 'Development using Claude AI',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'Developers',
    description: 'Build with Claude AI and Anthropic APIs.',
    highlights: [
      'Claude API',
      'SDK Integration',
      'Best Practices',
      'Use Cases'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/12-Development-using-Claude-AI.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/12-Development-using-Claude-AI.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/12-Development-using-Claude-AI.docx`,
    technology: 'Claude/Anthropic',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'course-13',
    title: 'Executive AI Leadership',
    category: 'course',
    duration: '1 day',
    level: 'Executive',
    audience: 'C-Suite',
    description: 'AI leadership and strategy for executives.',
    highlights: [
      'AI Vision',
      'Strategic Planning',
      'Change Management',
      'ROI Measurement'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/13-Executive-AI-Leadership.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/13-Executive-AI-Leadership.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/13-Executive-AI-Leadership.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-14',
    title: 'Azure AI Fundamentals',
    category: 'course',
    duration: '3 days',
    level: 'Beginner',
    audience: 'IT Professionals',
    description: 'Foundation course for Azure AI services with updated 2025-2026 certification.',
    highlights: [
      'AI Concepts',
      'Azure AI Foundry Services',
      'Cognitive Services',
      'AI-901 Exam Prep'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/14-Azure-AI-Fundamentals.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/14-Azure-AI-Fundamentals.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/14-Azure-AI-Fundamentals.docx`,
    technology: 'Microsoft',
    certification: 'AI-901',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-15',
    title: 'Microsoft Copilot Mastery',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'Business Users',
    description: 'Master all Microsoft Copilot products.',
    highlights: [
      'Copilot for M365',
      'Copilot Studio',
      'GitHub Copilot',
      'Power Platform'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/15-Microsoft-Copilot-Mastery.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/15-Microsoft-Copilot-Mastery.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/15-Microsoft-Copilot-Mastery.docx`,
    technology: 'Microsoft',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-16',
    title: 'Power Platform + AI',
    category: 'course',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'Citizen Developers',
    description: 'Build AI-powered apps with Power Platform.',
    highlights: [
      'Power Apps',
      'Power Automate',
      'AI Builder',
      'Dataverse'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/16-Power-Platform-AI.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/16-Power-Platform-AI.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/16-Power-Platform-AI.docx`,
    technology: 'Microsoft',
    certification: 'Yes',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-17',
    title: 'Prompt Engineering Masterclass',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'All Roles',
    description: 'Master the art of prompt engineering.',
    highlights: [
      'Prompt Design',
      'Chain of Thought',
      'Few-Shot Learning',
      'Advanced Techniques'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/17-Prompt-Engineering-Masterclass.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/17-Prompt-Engineering-Masterclass.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/17-Prompt-Engineering-Masterclass.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-18',
    title: 'GitHub Copilot for Developers',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'Developers',
    description: 'Accelerate development with GitHub Copilot.',
    highlights: [
      'Code Generation',
      'Test Writing',
      'Documentation',
      'Best Practices'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/18-GitHub-Copilot-for-Developers.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/18-GitHub-Copilot-for-Developers.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/18-GitHub-Copilot-for-Developers.docx`,
    technology: 'Microsoft',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'course-19',
    title: 'RAG Engineering',
    category: 'course',
    duration: '3 days',
    level: 'Advanced',
    audience: 'AI Engineers',
    description: 'Build production RAG systems.',
    highlights: [
      'Vector Databases',
      'Chunking Strategies',
      'Retrieval Optimization',
      'Hybrid Search'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/19-RAG-Engineering.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/19-RAG-Engineering.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/19-RAG-Engineering.docx`,
    technology: 'Open Source',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'course-20',
    title: 'AI Security & Responsible AI',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'All Technical Roles',
    description: 'Security and ethics in AI systems.',
    highlights: [
      'AI Security',
      'Bias Mitigation',
      'Privacy',
      'Compliance'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/20-AI-Security-Responsible-AI.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/20-AI-Security-Responsible-AI.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/20-AI-Security-Responsible-AI.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-21',
    title: 'AI for BFSI',
    category: 'course',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'BFSI Professionals',
    description: 'AI applications in Banking, Financial Services, and Insurance.',
    highlights: [
      'Risk Assessment',
      'Fraud Detection',
      'Customer Analytics',
      'Regulatory Compliance'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/21-AI-for-BFSI.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/21-AI-for-BFSI.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/21-AI-for-BFSI.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'BFSI'
  },
  {
    id: 'course-22',
    title: 'AI for Government',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'Government Officials',
    description: 'AI solutions for public sector and governance.',
    highlights: [
      'Citizen Services',
      'Smart Cities',
      'Policy Analytics',
      'Digital Governance'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/22-AI-for-Government.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/22-AI-for-Government.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/22-AI-for-Government.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Government'
  },
  {
    id: 'course-23',
    title: 'Fine-Tuning Custom LLMs',
    category: 'course',
    duration: '4 days',
    level: 'Advanced',
    audience: 'ML Engineers',
    description: 'Fine-tune and deploy custom language models.',
    highlights: [
      'Model Selection',
      'Fine-Tuning Techniques',
      'LoRA & QLoRA',
      'Deployment Strategies'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/23-Fine-Tuning-Custom-LLMs.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/23-Fine-Tuning-Custom-LLMs.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/23-Fine-Tuning-Custom-LLMs.docx`,
    technology: 'Open Source',
    certification: 'No',
    industry: 'Technology'
  },
  {
    id: 'course-24',
    title: 'N8N AI Workflow Automation',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'Automation Engineers',
    description: 'Build AI-powered automation workflows with N8N.',
    highlights: [
      'Workflow Design',
      'AI Node Integration',
      'Custom Functions',
      'Enterprise Deployment'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/24-N8N-AI-Workflow-Automation.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/24-N8N-AI-Workflow-Automation.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/24-N8N-AI-Workflow-Automation.docx`,
    technology: 'Open Source',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-25',
    title: 'Conversational AI & Chatbots',
    category: 'course',
    duration: '3 days',
    level: 'Intermediate',
    audience: 'Developers',
    description: 'Build intelligent conversational AI systems.',
    highlights: [
      'Dialogue Management',
      'NLU/NLG',
      'Multi-turn Conversations',
      'Voice Integration'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/25-Conversational-AI-Chatbots.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/25-Conversational-AI-Chatbots.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/25-Conversational-AI-Chatbots.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Cross-Industry'
  },
  {
    id: 'course-26',
    title: 'AI Testing & Quality Assurance',
    category: 'course',
    duration: '2 days',
    level: 'Intermediate',
    audience: 'QA Engineers',
    description: 'Test and validate AI systems effectively.',
    highlights: [
      'AI Testing Strategies',
      'Model Validation',
      'Performance Testing',
      'Bias Detection'
    ],
    htmlFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/26-AI-Testing-Quality-Assurance.html?v=1773462701727`,
    pdfFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/26-AI-Testing-Quality-Assurance.pdf`,
    docFile: `${BLOB_URL}/Gennoor-Tech-Course-TOCs/26-AI-Testing-Quality-Assurance.docx`,
    technology: 'Cross-Platform',
    certification: 'No',
    industry: 'Technology'
  }
]

export const allPrograms = [...bootcamps, ...courses]