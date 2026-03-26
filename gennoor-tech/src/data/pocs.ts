export interface PoC {
  id: string
  title: string
  category: string
  description: string
  problem: string
  solution: string
  technologies: string[]
  githubUrl?: string
  architecture?: string
  metrics?: {
    label: string
    value: string
  }[]
}

export const pocs: PoC[] = [
  {
    id: 'multimodal-rag-banking',
    title: 'Multimodal RAG for Financial Documents',
    category: 'AI/ML',
    description: 'Hybrid search RAG system processing financial documents with text, tables, and charts for accurate retrieval with citations.',
    problem: 'Financial documents contain precise numbers (SWIFT, IBAN, dates) that pure vector search misses, plus visual elements like charts that need interpretation.',
    solution: 'Two-stage pipeline: Document cracking extracts text and images separately, with semantic chunking preserving table/figure context. Hybrid search combines keyword precision with semantic understanding.',
    technologies: [
      'Azure AI Search',
      'Azure AI Vision',
      'GPT-4o',
      'Hybrid Search',
      'Vector Embeddings',
      'Python'
    ],
    githubUrl: 'https://github.com/lostspace003/multimodal-rag-banking',
    architecture: `
    Multimodal RAG Pipeline for Banking
    ===================================

    == INGESTION PHASE ==

    [PDF Financial Document]
            |
        Document Cracking
            |
      +-----+-----+
      |           |
    Text       Images
      |           |
    Semantic    Vision
    Chunking   Embeddings
      |           |
      +-----+-----+
            |
    [Azure AI Search]
    - Hybrid Index
    - Keyword Search (SWIFT, IBAN, dates)
    - Vector Search (semantic meaning)
    - Semantic Ranking

    == RETRIEVAL PHASE ==

    [User Query]
         |
    Query Embedding
         |
    Hybrid Search
         |
    Retrieved Chunks + Images
         |
    [GPT-4o Multimodal]
         |
    Answer with Citations & Page Numbers

    Key: Preserves table/chart context in chunks`,
    metrics: [
      { label: 'Text Accuracy', value: '94.2%' },
      { label: 'Chart Understanding', value: '91.8%' },
      { label: 'Citation Coverage', value: '100%' },
      { label: 'Query Speed', value: '2.1s avg' }
    ]
  },
  {
    id: 'cv-fraud-detection',
    title: 'Computer Vision Fraud Detection for Banking',
    category: 'Security',
    description: 'Advanced CV pipeline for signature verification, document forgery detection, and MICR processing using multiple algorithms.',
    problem: 'Banks need to detect forged signatures, manipulated documents, and fraudulent cheques while processing thousands of documents daily.',
    solution: 'Multi-technique approach: ELA for forgery, ORB/SIFT for signatures, Laplacian for quality, SSIM for similarity, all integrated with Azure AI Vision.',
    technologies: [
      'OpenCV',
      'Azure AI Vision',
      'ORB/SIFT',
      'ELA',
      'Python',
      'FastAPI'
    ],
    githubUrl: 'https://github.com/lostspace003/cv-ocr-banking-pipeline',
    architecture: `
    Computer Vision Fraud Detection Pipeline
    ========================================

    [Document Input]
            |
    [Preprocessing Layer]
    - Auto-deskew
    - Contrast enhancement
    - Noise reduction (Gaussian filter)
            |
    ==== Parallel Analysis ====
            |
    +-------+-------+-------+
    |       |       |       |
    |       |       |       |
    Signature  Document  MICR
    Verify     Forgery   Extract
    |          |         |
    ORB/SIFT   ELA      Azure
    Features   Analysis  Vision
    |          |         |
    +-------+-------+-----+
            |
    [Fraud Score Engine]
    - SSIM Similarity Score
    - Laplacian Quality Check
    - Anomaly Detection
            |
    [Risk Assessment]
    Low < 30% | Medium 30-70% | High > 70%

    Metrics:
    - Signature Match: 96.3%
    - Forgery Detection: 93.7%
    - MICR Accuracy: 98.9%`,
    metrics: [
      { label: 'Signature Match', value: '96.3%' },
      { label: 'Forgery Detection', value: '93.7%' },
      { label: 'MICR Accuracy', value: '98.9%' },
      { label: 'Processing Speed', value: '1.2s' }
    ]
  },
  {
    id: 'ai-readiness-assessment',
    title: 'Interactive AI Readiness Assessment Tool',
    category: 'Strategy',
    description: 'HTML5-based interactive assessment framework for executives to evaluate organizational AI maturity.',
    problem: 'C-suite executives needed a structured way to assess their organization\'s AI readiness across multiple dimensions.',
    solution: 'Created interactive HTML assessments with Chart.js visualizations, covering strategy, governance, talent, budget, and transformation roadmap.',
    technologies: [
      'HTML5',
      'JavaScript',
      'Chart.js',
      'CSS3',
      'Local Storage'
    ],
    architecture: `
    AI Readiness Assessment Framework
    =================================

    5 Interactive HTML Assessment Modules:
    --------------------------------------

    Module 1: AI Strategy & Transformation
      * Current state analysis
      * Vision alignment check
      * Strategic goals mapping

    Module 2: AI Governance & Risk
      * Regulatory compliance (NCA, EU AI Act)
      * Ethical framework assessment
      * Risk appetite evaluation

    Module 3: Organizational Structure & Talent
      * Skills gap analysis
      * Change readiness score
      * Leadership alignment

    Module 4: AI Budgeting & ROI
      * Investment capacity
      * Value measurement framework
      * Cost-benefit analysis

    Module 5: Transformation Roadmap
      * Maturity gap identification
      * Priority action items
      * Quick wins vs long-term

    [Scoring Engine]
         |
    +---------+---------+
    |         |         |
    Weighted  Radar    Gap
    Scores    Charts   Analysis
    |         |         |
    +---------+---------+
            |
    [Executive Report Generation]

    Output: Actionable 90-day roadmap`,
    metrics: [
      { label: 'Organizations Assessed', value: '50+' },
      { label: 'Average Completion', value: '87%' },
      { label: 'Actionable Insights', value: '15 per org' }
    ]
  }
]

export const getPoCById = (id: string) => {
  return pocs.find(poc => poc.id === id)
}

export const getPoCsByCategory = (category: string) => {
  return pocs.filter(poc => poc.category === category)
}