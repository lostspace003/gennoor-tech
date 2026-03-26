export interface CaseStudy {
  id: string
  title: string
  client: string
  industry: string
  duration: string
  participants?: string
  challenge: string
  approach: string[]
  technologies: string[]
  outcomes: string[]
  testimonial?: {
    quote: string
    author: string
    role: string
  }
  deliverables?: string[]
  githubRepo?: string
  architecture?: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'mcit-saudi-ai-leadership',
    title: 'AI Leadership Mastery for Senior Executives',
    client: 'MCIT Saudi Arabia',
    industry: 'Government',
    duration: '10 Days',
    participants: '50+ Senior Executives & C-Suite Leaders',
    challenge: 'MCIT needed to equip Saudi senior executives with strategic AI understanding aligned with Vision 2030, moving beyond technical details to focus on governance, ROI, and organizational transformation.',
    approach: [
      'Designed comprehensive 10-day executive bootcamp (2 weeks) blending strategy with applied innovation',
      'Week 1: Delivered AI foundations, Microsoft ecosystem, and governance frameworks',
      'Week 2: Focused on leadership modules - strategy, governance, talent, budgeting, and roadmap execution',
      'Created AI Readiness & Maturity Assessment framework for organizations',
      'Developed interactive HTML-based assessments and visualizations for each day',
      'Delivered hands-on sessions with Microsoft 365 Copilot and Azure AI Studio',
      'Facilitated panel discussions with Microsoft Arabia and industry leaders'
    ],
    technologies: [
      'Microsoft 365 Copilot',
      'Azure AI Studio',
      'Power BI',
      'Microsoft Fabric',
      'Interactive HTML Assessments',
      'Chart.js Visualizations'
    ],
    outcomes: [
      'Executives developed actionable AI roadmaps for their organizations',
      'Created organizational AI Governance Charters',
      'Benchmarked AI maturity across participating organizations',
      'Delivered AI Value Maps identifying quick wins and long-term impact',
      'Established network of Saudi AI leaders championing innovation',
      'Aligned strategies with Saudi Vision 2030 and national AI initiatives',
      'Practical exposure through Microsoft 365 Copilot and Azure AI demos'
    ],
    deliverables: [
      'AI Strategy Templates and Frameworks',
      '10 Interactive HTML Assessment Modules (one per day)',
      'Microsoft Technology Quizzes for each module',
      'AI Governance and Risk Management Tools',
      'Organizational Readiness Reports',
      'AI for Leaders module content',
      'Curated Resource Kits (podcasts, reports, tools)',
      'Week 1: Technical foundations content',
      'Week 2: Leadership-focused modules'
    ],
    architecture: `
    Saudi AI Leadership Framework - 10 Day Program
    ===============================================

    == WEEK 1: Foundations ==

    Day 1: AI Awareness & Vision
      -> AI Readiness Assessment
      -> Vision 2030 Alignment

    Day 2: AI Landscape & Positioning
      -> Microsoft AI Ecosystem
      -> Power BI Executive Insights

    Day 3: Responsible AI & Governance
      -> Saudi & Global Regulations (NCA, EU AI Act)
      -> AI Governance Charter Design

    Day 4: Strategic Roadmap Design
      -> AI Maturity Gap Analysis
      -> Value Map & Quick Wins Identification

    Day 5: Leading AI Adoption
      -> Culture & Change Management
      -> Initial Roadmap Development

    == WEEK 2: Leadership Focus ==

    Day 6: AI Strategy & Business Transformation
      -> Organizational goals alignment
      -> High-value use case identification

    Day 7: AI Governance, KSA Regulations & Risk
      -> Local regulatory framework
      -> Risk management strategies

    Day 8: Organizational Structure & Talent
      -> Operating model design
      -> Skills & talent development

    Day 9: AI Budgeting, Cost & ROI
      -> Investment planning
      -> Business value measurement

    Day 10: Transformation Roadmap & Execution
      -> Multi-year roadmap finalization
      -> Capstone presentations

    Deliverables: AI Strategy | Governance Charter | Roadmap | Assessment Reports`
  },
  {
    id: 'bank-tanzania-ai-agents',
    title: 'AI Agents Implementation for Banking Transformation',
    client: 'Bank of Tanzania',
    industry: 'Banking & Financial Services',
    duration: '10 Days',
    participants: 'AI Engineers, Developers, Architects, IT Managers',
    challenge: 'Bank of Tanzania needed to modernize their operations with AI agents for customer service automation and secure information sharing across departments.',
    approach: [
      'Delivered comprehensive 10-day program on Agentic AI and multi-agent systems',
      'Built autonomous AI agents using open-source LLMs (LLaMA 2, Mistral)',
      'Implemented multi-agent orchestration with LangChain and AutoGPT',
      'Integrated blockchain/DLT for secure inter-agent communication',
      'Created three capstone projects: customer support agent, multi-agent collaboration system, and compliance assistant'
    ],
    technologies: [
      'LangGraph',
      'CrewAI',
      'LangChain',
      'AutoGPT',
      'Blockchain/DLT',
      'MLflow',
      'Stable-Baselines3',
      'RLlib',
      'Hugging Face models'
    ],
    outcomes: [
      'Delivered working chatbot prototype for customer support',
      'Established governance framework for agent systems',
      'Trained team on guardrails, monitoring, and compliance',
      'Created collaborative report generation system with multi-agent orchestration',
      'Implemented secure data sharing using blockchain ledger'
    ],
    deliverables: [
      'Unofficial PowerPoints and PDFs',
      'Labs on Colab/Jupyter (Koenig DC)',
      '3 capstone project implementations',
      'Agent governance and performance tracking with MLflow'
    ],
    architecture: `
    Multi-Agent Banking System Architecture
    ========================================

    [Customer Agent]   [Compliance Agent]   [Report Generator]
           |                  |                     |
           +------------------+---------------------+
                             |
                   [LangChain Orchestration]
                             |
                   [Blockchain/DLT Layer]
                   - Secure Communication
                   - Immutable Audit Trail
                   - Agent Coordination
                             |
                    [MLflow Monitoring]
                    - Performance Tracking
                    - Model Governance
                    - A/B Testing

    Tech Stack: LangGraph | CrewAI | AutoGPT | RLlib`
  },

  {
    id: 'ey-copilot-studio',
    title: 'Enterprise Copilot Studio & Agent Flows Training',
    client: 'EY (Ernst & Young)',
    industry: 'Professional Services',
    duration: 'Multi-Module Program',
    participants: 'Senior Consultants and Solution Architects',
    challenge: 'EY needed to upskill their team on Microsoft\'s latest Copilot Studio capabilities, Agent Flows, and MCP integration for client implementations.',
    approach: [
      'Developed custom curriculum covering the new Power Platform capabilities',
      'Created hands-on labs for Agent Flows with Human-in-the-Loop (HITL)',
      'Built MCP servers for Dataverse integration',
      'Demonstrated Agent Builder vs Power Apps Vibe comparison',
      'Implemented real-world scenarios with Plan Designer'
    ],
    technologies: [
      'Microsoft Copilot Studio',
      'Agent Flows',
      'MCP (Model Context Protocol)',
      'Dataverse',
      'Power Apps Vibe',
      'Plan Designer',
      'Power Platform',
      'Azure SQL'
    ],
    outcomes: [
      'Team gained expertise in building enterprise agents',
      'Delivered working HITL workflows for client scenarios',
      'Created reusable MCP server templates',
      'Established best practices for agent governance',
      'Built pricing and credit management guidelines for Copilot Studio'
    ],
    deliverables: [
      'HITL Agent Flow Lab Guide',
      'Workflow Designer documentation',
      'MCP Server Setup Guide',
      'Agent Governance Executive Report',
      'Copilot Studio Credits & Pricing Guide'
    ]
  },

  {
    id: 'banking-doc-intelligence',
    title: 'AI-Powered Document Processing for Banking Operations',
    client: 'Multiple Banks (HDFC, ICICI, Axis)',
    industry: 'Banking & Financial Services',
    duration: 'PoC Development + Implementation',
    challenge: 'Banks needed to automate document processing for KYC, cheque processing, invoice handling, and fraud detection while maintaining accuracy and compliance.',
    approach: [
      'Built classification-then-extraction workflow with GPT-4o routing',
      'Integrated Azure AI Document Intelligence prebuilt and custom models',
      'Implemented OpenCV preprocessing (deskewing, enhancement, noise reduction)',
      'Created multimodal RAG with hybrid search for precise financial data',
      'Developed FastAPI REST API with Docker containerization'
    ],
    technologies: [
      'Azure AI Document Intelligence',
      'GPT-4o Vision',
      'OpenCV',
      'FastAPI',
      'Python 3.10+',
      'Docker',
      'Azure AI Search',
      'Hybrid Search (Vector + Keyword)'
    ],
    outcomes: [
      'Invoices: 2.3 seconds processing, 96.5% accuracy',
      'ID Cards: 1.8 seconds processing, 98.2% accuracy',
      'Cheques: 3.1 seconds processing, 94.8% accuracy with MICR extraction',
      'KYC Forms: 4.2 seconds processing, 92.1% accuracy',
      'Auto-routing for documents below 85% confidence for human review'
    ],
    githubRepo: 'https://github.com/lostspace003/azure-doc-intelligence-banking-pipeline',
    deliverables: [
      'Production FastAPI application with 5 document endpoints',
      'KYC/AML validation rules implementation',
      'PII masking in logs for compliance',
      'Comprehensive audit trails',
      'Docker deployment configuration'
    ],
    architecture: `
    Banking Document Processing Pipeline
    ====================================

    [Document Upload via FastAPI]
              |
              v
    [GPT-4o Vision Classification]
              |
    +---------+---------+---------+
    |         |         |         |
 Invoice   Cheque   KYC/ID   Trade Docs
    |         |         |         |
    v         v         v         v
    [Azure AI Document Intelligence]
    - Prebuilt Models
    - Custom Models
    - Field Extraction
              |
              v
    [Confidence Check: 85% Threshold]
              |
         Pass / Fail
           /       \\
    [Return JSON]  [Human Review Queue]

    Processing Times:
    - Invoices: 2.3s (96.5% accuracy)
    - ID Cards: 1.8s (98.2% accuracy)
    - Cheques: 3.1s (94.8% accuracy)
    - KYC Forms: 4.2s (92.1% accuracy)`
  },

  {
    id: 'copilot-mcp-servers',
    title: 'Custom MCP Servers for Copilot Studio Database Integration',
    client: 'Tech Mahindra & Enterprise Clients',
    industry: 'Technology',
    duration: 'Development & Deployment',
    challenge: 'Organizations needed to connect Microsoft Copilot Studio agents with their Azure SQL databases for natural language querying and data operations.',
    approach: [
      'Developed MCP (Model Context Protocol) server with 12 comprehensive tools',
      'Implemented parameterized queries for SQL injection prevention',
      'Added mandatory WHERE clauses for destructive operations',
      'Created Adaptive Card visualizations for charts and data',
      'Used Cloudflare Tunnel for secure local testing'
    ],
    technologies: [
      'Microsoft Copilot Studio',
      'MCP (Model Context Protocol)',
      'Azure SQL Database',
      'Python',
      'Adaptive Cards',
      'Cloudflare Tunnel',
      'Streamable-HTTP Transport'
    ],
    outcomes: [
      'Business users query databases in natural language',
      'Reduced SQL query writing time by 80%',
      'Full CRUD operations with safety guardrails',
      'Interactive data visualizations in Copilot chat',
      'Reusable template for other database integrations'
    ],
    githubRepo: 'https://github.com/lostspace003/copilot-studio-azure-sql-mcp',
    deliverables: [
      '12 MCP Tools: execute_query, list_tables, get_schema, get_data, create_record, update_record, delete_record, search, create_table, drop_table, database_info, visualize_data',
      'HTTP endpoint registration guide',
      'Parameterized query implementation',
      'Adaptive Card chart templates'
    ],
    architecture: `
    MCP Server - 12 Database Tools
    ==============================

    [Copilot Studio Agent]
            |
            | Natural Language Query
            v
    [MCP Server (HTTP Endpoint)]
            |
            v
    +------ 12 Tools Available ------+
    |                                |
    | Query Operations:              |
    |   - execute_query              |
    |   - search                     |
    |                                |
    | Schema Operations:             |
    |   - list_tables                |
    |   - get_table_schema           |
    |   - get_database_info          |
    |                                |
    | Data Operations:               |
    |   - get_table_data             |
    |   - create_record              |
    |   - update_record (WHERE)      |
    |   - delete_record (WHERE)      |
    |                                |
    | Table Management:              |
    |   - create_table               |
    |   - drop_table                 |
    |                                |
    | Visualization:                 |
    |   - visualize_data             |
    |   (Adaptive Cards)             |
    +--------------------------------+
            |
            v
    [Azure SQL Database]

    Security: Parameterized Queries | WHERE Required`
  },

  {
    id: 'python-ai-training',
    title: 'Foundational Python & AI Training Programs',
    client: 'Koenig Solutions Global Delivery',
    industry: 'Education & Training',
    duration: '10 Days per Program',
    participants: 'Beginners, IT professionals, Data enthusiasts',
    challenge: 'Organizations needed comprehensive Python and AI training that progresses from basics to advanced deep learning, tailored for Microsoft AI certifications.',
    approach: [
      'Developed 10-day intensive program from Python basics to transformers',
      'Created hands-on labs using Colab/Jupyter notebooks',
      'Built progression: Python → Data Analysis → ML → Deep Learning → NLP',
      'Aligned content with Microsoft AI-103 certification requirements',
      'Included capstone projects for practical application'
    ],
    technologies: [
      'Python',
      'NumPy, Pandas, Matplotlib',
      'TensorFlow/Keras',
      'Scikit-learn',
      'BERT, GPT',
      'CNN, RNN',
      'Transformers'
    ],
    outcomes: [
      'Trained 100+ professionals in Python for AI',
      'Students successfully built end-to-end AI workflows',
      'Created reusable training materials on GitHub',
      'Participants achieved Microsoft AI certifications',
      'Delivered practical skills for immediate application'
    ],
    githubRepo: 'https://github.com/lostspace003/python-for-ai102',
    deliverables: [
      'Complete Jupyter notebooks for all modules',
      'Unofficial PPTs and PDFs',
      'Hands-on labs on Koenig DC',
      'Capstone project templates'
    ]
  },

  {
    id: 'prompt-engineering',
    title: 'Local Prompt Engineering Training with Ollama',
    client: 'Open Source Community',
    industry: 'Education & Training',
    duration: 'Self-paced',
    challenge: 'Developers needed to learn prompt engineering without expensive API keys or cloud dependencies.',
    approach: [
      'Created 6 comprehensive Jupyter notebooks',
      'Used Ollama with Qwen3 for completely local execution',
      'Covered zero-shot, few-shot, chain-of-thought prompting',
      'Implemented role-based prompting patterns',
      'Made everything 100% free and API-key free'
    ],
    technologies: [
      'Ollama',
      'Qwen3 LLM',
      'Jupyter Notebooks',
      'Python',
      'Local LLM deployment'
    ],
    outcomes: [
      'Enabled developers to learn prompt engineering at zero cost',
      'All training runs locally without internet dependency',
      'Created reusable prompt patterns and templates',
      'Gained GitHub stars and community contributions',
      'Democratized access to AI training materials'
    ],
    githubRepo: 'https://github.com/lostspace003/prompt-engineering-ollama',
    deliverables: [
      '6 comprehensive Jupyter notebooks',
      'Local setup instructions',
      'Prompt pattern library',
      'Best practices documentation'
    ]
  }
]

export const getCaseStudyBySlug = (slug: string) => {
  return caseStudies.find(study => study.id === slug)
}

export const getCaseStudiesByIndustry = (industry: string) => {
  return caseStudies.filter(study => study.industry === industry)
}

export const getFeaturedCaseStudies = () => {
  // Return top 3 case studies for homepage
  return caseStudies.slice(0, 3)
}