// Gennoor Tech - Comprehensive Service Catalogue Generator
// Creates detailed, professional multi-page PDFs for technical and non-technical audiences

const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default;
const fs = require('fs');
const path = require('path');

class GennoorCatalogueGenerator {
  constructor() {
    // Gennoor brand colors
    this.colors = {
      primary: '#1E3A8A',      // Deep Blue
      secondary: '#3B82F6',    // Bright Blue
      accent: '#06B6D4',       // Cyan
      success: '#10B981',      // Green
      warning: '#F59E0B',      // Amber
      dark: '#0F172A',         // Dark
      gray: '#64748B',         // Gray
      light: '#F8FAFC',        // Light
      white: '#FFFFFF'
    };

    // Load logo if available
    const logoPath = path.join(__dirname, 'public/logos/gennoor-tech-logo-horizontal-dark_1200x410_email-signature.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      this.logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }
  }

  // =============================================
  // TECHNICAL CATALOGUE - DETAILED VERSION
  // =============================================
  generateTechnicalCatalogue(leadData) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;

    // ========== PAGE 1: COVER PAGE ==========
    this.addGradientBackground(doc, this.colors.primary, this.colors.secondary);

    // Logo and branding
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', margin, 20, 90, 31);
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(42);
      doc.setFont(undefined, 'bold');
      doc.text('GENNOOR TECH', margin, 40);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('TRAIN. INNOVATE. BUILD.', margin, 58);

    // Main title
    doc.setFontSize(36);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Services', pageWidth / 2, 120, { align: 'center' });

    doc.setFontSize(28);
    doc.text('Catalogue 2024', pageWidth / 2, 135, { align: 'center' });

    // Customization box
    doc.setFillColor(255, 255, 255);
    doc.setGState(doc.GState({ opacity: 0.95 }));
    doc.roundedRect(margin, 160, pageWidth - 2 * margin, 50, 5, 5, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Prepared Exclusively For:', pageWidth / 2, 175, { align: 'center' });

    doc.setFontSize(18);
    doc.text(leadData.company, pageWidth / 2, 190, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`${leadData.name} | ${leadData.designation}`, pageWidth / 2, 200, { align: 'center' });

    // Version and date
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Version 2.0 | ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

    // ========== PAGE 2: TABLE OF CONTENTS ==========
    doc.addPage();
    this.addHeader(doc, 'Technical Services Overview');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Contents', margin, 50);

    const contents = [
      { title: '1. Cloud Infrastructure Solutions', page: '3' },
      { title: '2. AI & Machine Learning Services', page: '4' },
      { title: '3. Software Development', page: '5' },
      { title: '4. Data Engineering & Analytics', page: '6' },
      { title: '5. Security & Compliance', page: '7' },
      { title: '6. DevOps & Automation', page: '8' },
      { title: '7. Technical Training Programs', page: '9' },
      { title: '8. Support & Maintenance', page: '10' },
      { title: '9. Implementation Roadmap', page: '11' },
      { title: '10. Pricing & Packages', page: '12' }
    ];

    let yPos = 70;
    contents.forEach((item, index) => {
      // Alternating background
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, 'F');
      }

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(item.title, margin + 5, yPos);

      // Page number
      doc.setTextColor(100, 116, 139);
      doc.text(item.page, pageWidth - margin - 20, yPos);

      // Dotted line
      doc.setDrawColor(200, 200, 200);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(margin + 120, yPos - 1, pageWidth - margin - 25, yPos - 1);
      doc.setLineDashPattern([], 0);

      yPos += 12;
    });

    // ========== PAGE 3: CLOUD INFRASTRUCTURE ==========
    doc.addPage();
    this.addHeader(doc, 'Cloud Infrastructure Solutions');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('1. Cloud Infrastructure Solutions', margin, 50);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const cloudIntro = 'Enterprise-grade cloud solutions built on Microsoft Azure, designed for scalability, security, and performance.';
    doc.text(cloudIntro, margin, 60, { maxWidth: pageWidth - 2 * margin });

    // Services table
    autoTable(doc, {
      startY: 70,
      head: [['Service', 'Description', 'Technologies']],
      body: [
        ['Cloud Migration', 'Seamless migration of on-premises infrastructure to Azure cloud', 'Azure Migrate, Site Recovery, Database Migration Service'],
        ['Infrastructure Design', 'Architecture design for high availability and disaster recovery', 'Azure Well-Architected Framework, Landing Zones'],
        ['Container Orchestration', 'Kubernetes deployment and management', 'AKS, Container Registry, Service Mesh'],
        ['Serverless Computing', 'Event-driven architecture with Functions', 'Azure Functions, Logic Apps, Event Grid'],
        ['Hybrid Cloud', 'Connect on-premises with cloud seamlessly', 'Azure Arc, ExpressRoute, VPN Gateway']
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [30, 58, 138],
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 75 },
        2: { cellWidth: 60 }
      },
      margin: { left: margin, right: margin }
    });

    // Technical specifications
    const tableEnd = doc.lastAutoTable.finalY || 140;

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Specifications:', margin, tableEnd + 15);

    const specs = [
      '• 99.99% SLA guarantee with geo-redundant deployments',
      '• Auto-scaling from 1 to 10,000+ instances',
      '• Multi-region active-active configurations',
      '• Sub-10ms latency with Azure Front Door',
      '• ISO 27001, SOC 2, HIPAA compliant infrastructure'
    ];

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    let specY = tableEnd + 25;
    specs.forEach(spec => {
      doc.text(spec, margin + 5, specY);
      specY += 7;
    });

    // ========== PAGE 4: AI & ML SERVICES ==========
    doc.addPage();
    this.addHeader(doc, 'AI & Machine Learning Services');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('2. AI & Machine Learning Services', margin, 50);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Cutting-edge AI solutions powered by Azure OpenAI and custom ML models.', margin, 60);

    // AI Services breakdown
    const aiServices = [
      {
        title: 'Generative AI Solutions',
        items: [
          'GPT-4 integration for content generation',
          'Custom fine-tuned models for your domain',
          'RAG (Retrieval Augmented Generation) pipelines',
          'Prompt engineering and optimization'
        ]
      },
      {
        title: 'Computer Vision',
        items: [
          'Object detection and classification',
          'OCR and document processing',
          'Video analytics and surveillance',
          'Quality control automation'
        ]
      },
      {
        title: 'Natural Language Processing',
        items: [
          'Sentiment analysis and text mining',
          'Language translation and localization',
          'Chatbots and virtual assistants',
          'Document summarization'
        ]
      },
      {
        title: 'Predictive Analytics',
        items: [
          'Demand forecasting',
          'Customer churn prediction',
          'Anomaly detection',
          'Risk assessment models'
        ]
      }
    ];

    let aiY = 75;
    aiServices.forEach(service => {
      // Service title box
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(margin, aiY, pageWidth - 2 * margin, 8, 2, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(service.title, margin + 5, aiY + 5.5);

      aiY += 12;

      // Service items
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      service.items.forEach(item => {
        doc.text(`• ${item}`, margin + 10, aiY);
        aiY += 6;
      });

      aiY += 5;
    });

    // ========== PAGE 5: SOFTWARE DEVELOPMENT ==========
    doc.addPage();
    this.addHeader(doc, 'Software Development');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('3. Custom Software Development', margin, 50);

    // Development services table
    autoTable(doc, {
      startY: 60,
      head: [['Platform', 'Technologies', 'Use Cases']],
      body: [
        ['Web Applications', 'React, Next.js, Angular, Vue.js, TypeScript', 'Enterprise portals, E-commerce, SaaS platforms'],
        ['Mobile Apps', 'React Native, Flutter, Swift, Kotlin', 'iOS/Android apps, Cross-platform solutions'],
        ['Backend Systems', '.NET Core, Node.js, Python, Java', 'APIs, Microservices, Integration layers'],
        ['Desktop Applications', 'Electron, WPF, WinForms, Qt', 'Business tools, Data analysis software'],
        ['IoT Solutions', 'Azure IoT Hub, Edge Computing', 'Smart devices, Industrial IoT, Monitoring']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 138],
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 70 },
        2: { cellWidth: 65 }
      },
      margin: { left: margin, right: margin }
    });

    // Development methodology
    const devEnd = doc.lastAutoTable.finalY || 120;

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Our Development Process:', margin, devEnd + 15);

    // Process visualization
    const processes = [
      { phase: 'Discovery', duration: '1-2 weeks', color: [16, 185, 129] },
      { phase: 'Design', duration: '2-3 weeks', color: [59, 130, 246] },
      { phase: 'Development', duration: '8-12 weeks', color: [139, 92, 246] },
      { phase: 'Testing', duration: '2-3 weeks', color: [245, 158, 11] },
      { phase: 'Deployment', duration: '1 week', color: [6, 182, 212] }
    ];

    let processX = margin;
    const processY = devEnd + 25;
    const boxWidth = 35;

    processes.forEach(process => {
      // Process box
      doc.setFillColor(...process.color);
      doc.roundedRect(processX, processY, boxWidth, 25, 2, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(process.phase, processX + boxWidth / 2, processY + 10, { align: 'center' });

      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(process.duration, processX + boxWidth / 2, processY + 18, { align: 'center' });

      processX += boxWidth + 2;
    });

    // ========== PAGE 6: DATA ENGINEERING ==========
    doc.addPage();
    this.addHeader(doc, 'Data Engineering & Analytics');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('4. Data Engineering & Analytics', margin, 50);

    // Data pipeline visualization
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, 60, pageWidth - 2 * margin, 60, 3, 3, 'F');

    // Pipeline stages
    const pipelineStages = [
      { name: 'Ingestion', tools: 'Event Hubs, IoT Hub, Kafka', y: 70 },
      { name: 'Processing', tools: 'Databricks, Synapse, Stream Analytics', y: 85 },
      { name: 'Storage', tools: 'Data Lake, SQL Database, Cosmos DB', y: 100 },
      { name: 'Analytics', tools: 'Power BI, Tableau, Custom Dashboards', y: 115 }
    ];

    pipelineStages.forEach((stage, index) => {
      // Arrow
      if (index > 0) {
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(2);
        doc.line(margin + 10, stage.y - 10, margin + 10, stage.y - 5);

        // Arrowhead
        doc.setFillColor(59, 130, 246);
        doc.triangle(margin + 10, stage.y - 3, margin + 8, stage.y - 6, margin + 12, stage.y - 6, 'F');
      }

      // Stage box
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin + 15, stage.y - 8, 50, 12, 2, 2, 'F');

      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(stage.name, margin + 20, stage.y - 2);

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(stage.tools, margin + 70, stage.y - 2);
    });

    // Data services
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Our Data Services:', margin, 135);

    const dataServices = [
      '✓ Real-time data streaming and processing',
      '✓ Data warehouse design and implementation',
      '✓ ETL/ELT pipeline development',
      '✓ Business intelligence and reporting',
      '✓ Machine learning model deployment',
      '✓ Data governance and quality management'
    ];

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    let dataY = 145;
    dataServices.forEach(service => {
      doc.text(service, margin + 5, dataY);
      dataY += 8;
    });

    // ========== PAGE 7: SECURITY & COMPLIANCE ==========
    doc.addPage();
    this.addHeader(doc, 'Security & Compliance');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('5. Security & Compliance Framework', margin, 50);

    // Security layers
    autoTable(doc, {
      startY: 60,
      head: [['Security Layer', 'Implementation', 'Standards']],
      body: [
        ['Identity & Access', 'Azure AD, MFA, Conditional Access, PIM', 'OAuth 2.0, SAML, OpenID'],
        ['Network Security', 'Firewall, DDoS Protection, NSG, WAF', 'Zero Trust Architecture'],
        ['Data Protection', 'Encryption at rest/transit, Key Vault', 'AES-256, TLS 1.3'],
        ['Application Security', 'SAST, DAST, Dependency Scanning', 'OWASP Top 10'],
        ['Compliance', 'Audit logs, Policy enforcement', 'ISO 27001, SOC 2, GDPR']
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [30, 58, 138],
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: margin, right: margin }
    });

    // Security certifications
    const secEnd = doc.lastAutoTable.finalY || 120;

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Certifications & Compliance:', margin, secEnd + 15);

    // Certification badges (visual representation)
    const certs = ['ISO 27001', 'SOC 2', 'HIPAA', 'GDPR', 'PCI DSS'];
    let certX = margin;

    certs.forEach(cert => {
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(certX, secEnd + 25, 35, 15, 2, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(cert, certX + 17.5, secEnd + 34, { align: 'center' });

      certX += 37;
    });

    // ========== PAGE 8: DEVOPS & AUTOMATION ==========
    doc.addPage();
    this.addHeader(doc, 'DevOps & Automation');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('6. DevOps & Automation Services', margin, 50);

    // DevOps pipeline
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, 60, pageWidth - 2 * margin, 40, 3, 3, 'F');

    // CI/CD Pipeline visualization
    const pipelineSteps = ['Code', 'Build', 'Test', 'Deploy', 'Monitor'];
    const stepWidth = (pageWidth - 2 * margin - 20) / pipelineSteps.length;

    pipelineSteps.forEach((step, index) => {
      const stepX = margin + 10 + (index * stepWidth);

      // Step circle
      doc.setFillColor(59, 130, 246);
      doc.circle(stepX + stepWidth / 2, 80, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(step, stepX + stepWidth / 2, 82, { align: 'center' });

      // Connection line
      if (index < pipelineSteps.length - 1) {
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(2);
        doc.line(stepX + stepWidth / 2 + 8, 80, stepX + stepWidth + stepWidth / 2 - 8, 80);
      }
    });

    // DevOps tools and services
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Our DevOps Stack:', margin, 110);

    const devopsTools = [
      { category: 'Version Control', tools: 'Git, GitHub, Azure DevOps, GitLab' },
      { category: 'CI/CD', tools: 'GitHub Actions, Azure Pipelines, Jenkins' },
      { category: 'Containerization', tools: 'Docker, Kubernetes, Helm, Istio' },
      { category: 'IaC', tools: 'Terraform, Bicep, ARM Templates, Pulumi' },
      { category: 'Monitoring', tools: 'Application Insights, Prometheus, Grafana' },
      { category: 'Testing', tools: 'Selenium, Cypress, Jest, Postman' }
    ];

    let toolY = 120;
    devopsTools.forEach(tool => {
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(tool.category + ':', margin + 5, toolY);

      doc.setTextColor(100, 116, 139);
      doc.setFont(undefined, 'normal');
      doc.text(tool.tools, margin + 40, toolY);

      toolY += 8;
    });

    // ========== PAGE 9: TRAINING PROGRAMS ==========
    doc.addPage();
    this.addHeader(doc, 'Technical Training Programs');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('7. Technical Training & Certification', margin, 50);

    // Training programs table
    autoTable(doc, {
      startY: 60,
      head: [['Program', 'Duration', 'Topics Covered', 'Certification']],
      body: [
        ['Cloud Architect', '5 days', 'Azure fundamentals, Architecture patterns, Security', 'AZ-305'],
        ['AI Engineer', '5 days', 'ML concepts, Azure AI services, Model deployment', 'AI-102'],
        ['DevOps Engineer', '4 days', 'CI/CD, IaC, Containerization, Monitoring', 'AZ-400'],
        ['Data Engineer', '5 days', 'Data pipelines, ETL, Analytics, Databricks', 'DP-203'],
        ['Full Stack Dev', '10 days', 'React, Node.js, .NET, Databases, Cloud', 'Custom']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [30, 58, 138],
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25 },
        2: { cellWidth: 80 },
        3: { cellWidth: 30 }
      },
      margin: { left: margin, right: margin }
    });

    const trainEnd = doc.lastAutoTable.finalY || 120;

    // Training benefits
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Why Choose Gennoor Training?', margin, trainEnd + 15);

    const benefits = [
      '✅ Microsoft certified trainers with 10+ years experience',
      '✅ Hands-on labs with real-world scenarios',
      '✅ 24/7 access to cloud lab environment',
      '✅ Post-training support for 3 months',
      '✅ 95% certification pass rate',
      '✅ Corporate batch discounts available'
    ];

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    let benY = trainEnd + 25;
    benefits.forEach(benefit => {
      doc.text(benefit, margin + 5, benY);
      benY += 8;
    });

    // ========== PAGE 10: SUPPORT & MAINTENANCE ==========
    doc.addPage();
    this.addHeader(doc, 'Support & Maintenance');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('8. Support & Maintenance Plans', margin, 50);

    // Support tiers
    const supportTiers = [
      {
        name: 'ESSENTIAL',
        color: [100, 116, 139],
        features: [
          'Business hours support (9-6 IST)',
          'Email & ticket support',
          '48-hour response SLA',
          'Monthly health checks',
          'Quarterly reviews'
        ],
        price: '₹50,000/month'
      },
      {
        name: 'PROFESSIONAL',
        color: [59, 130, 246],
        features: [
          'Extended support (8-8 IST)',
          'Phone & remote support',
          '24-hour response SLA',
          'Bi-weekly health checks',
          'Monthly reviews',
          'Performance optimization'
        ],
        price: '₹1,00,000/month'
      },
      {
        name: 'ENTERPRISE',
        color: [139, 92, 246],
        features: [
          '24/7 dedicated support',
          'On-site support available',
          '4-hour response SLA',
          'Weekly health checks',
          'Dedicated account manager',
          'Proactive monitoring',
          'Disaster recovery planning'
        ],
        price: 'Custom pricing'
      }
    ];

    let tierY = 60;
    supportTiers.forEach(tier => {
      // Tier header
      doc.setFillColor(...tier.color);
      doc.roundedRect(margin, tierY, pageWidth - 2 * margin, 10, 2, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(tier.name, margin + 5, tierY + 7);
      doc.text(tier.price, pageWidth - margin - 5, tierY + 7, { align: 'right' });

      tierY += 13;

      // Features
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      tier.features.forEach(feature => {
        doc.text(`• ${feature}`, margin + 10, tierY);
        tierY += 6;
      });

      tierY += 5;
    });

    // ========== PAGE 11: IMPLEMENTATION ROADMAP ==========
    doc.addPage();
    this.addHeader(doc, 'Implementation Roadmap');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('9. Your Implementation Journey', margin, 50);

    // Timeline visualization
    const phases = [
      {
        month: 'Month 1',
        phase: 'Discovery & Planning',
        activities: [
          'Requirements gathering',
          'Current state assessment',
          'Architecture design',
          'Project planning'
        ],
        deliverables: 'Technical blueprint, Project plan'
      },
      {
        month: 'Month 2-3',
        phase: 'Foundation Setup',
        activities: [
          'Infrastructure provisioning',
          'Security implementation',
          'Core services deployment',
          'Integration setup'
        ],
        deliverables: 'Cloud infrastructure, Security framework'
      },
      {
        month: 'Month 4-5',
        phase: 'Development & Migration',
        activities: [
          'Application development',
          'Data migration',
          'API development',
          'Testing & QA'
        ],
        deliverables: 'Applications, Migrated data'
      },
      {
        month: 'Month 6',
        phase: 'Optimization & Training',
        activities: [
          'Performance tuning',
          'User training',
          'Documentation',
          'Go-live preparation'
        ],
        deliverables: 'Optimized system, Trained team'
      }
    ];

    let phaseY = 60;
    phases.forEach((phase, index) => {
      // Phase box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, phaseY, pageWidth - 2 * margin, 45, 3, 3, 'F');

      // Month indicator
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(margin + 5, phaseY + 5, 30, 8, 2, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(phase.month, margin + 20, phaseY + 10, { align: 'center' });

      // Phase name
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(phase.phase, margin + 40, phaseY + 10);

      // Activities
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');

      let actY = phaseY + 18;
      phase.activities.forEach(activity => {
        doc.text(`• ${activity}`, margin + 10, actY);
        actY += 5;
      });

      // Deliverables
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('Deliverables: ', margin + 100, phaseY + 25);
      doc.setFont(undefined, 'normal');
      doc.text(phase.deliverables, margin + 125, phaseY + 25);

      phaseY += 50;
    });

    // ========== PAGE 12: PRICING & PACKAGES ==========
    doc.addPage();
    this.addHeader(doc, 'Investment & ROI');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('10. Investment Options', margin, 50);

    // Engagement models
    autoTable(doc, {
      startY: 60,
      head: [['Engagement Model', 'Best For', 'Duration', 'Investment']],
      body: [
        ['Project-Based', 'Defined scope, Fixed timeline', '3-12 months', '₹25L - ₹2Cr'],
        ['Dedicated Team', 'Long-term development, Flexibility', '6+ months', '₹8-15L/month'],
        ['Time & Material', 'Evolving requirements, Agile', 'Flexible', '₹8,000-15,000/day'],
        ['Managed Services', 'Complete outsourcing, SLA-based', '12+ months', '₹5-20L/month'],
        ['Hybrid Model', 'Mix of onsite/offshore', '6+ months', 'Custom quote']
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [30, 58, 138],
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: margin, right: margin }
    });

    const priceEnd = doc.lastAutoTable.finalY || 120;

    // ROI calculation
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Expected Return on Investment:', margin, priceEnd + 15);

    // ROI visualization
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, priceEnd + 25, pageWidth - 2 * margin, 50, 3, 3, 'F');

    const roiMetrics = [
      { metric: 'Cost Reduction', value: '40%', color: [16, 185, 129] },
      { metric: 'Productivity Gain', value: '3x', color: [59, 130, 246] },
      { metric: 'Time to Market', value: '50% faster', color: [139, 92, 246] },
      { metric: 'ROI Timeline', value: '6-9 months', color: [245, 158, 11] }
    ];

    let roiX = margin + 10;
    roiMetrics.forEach(metric => {
      // Metric box
      doc.setFillColor(...metric.color);
      doc.roundedRect(roiX, priceEnd + 35, 40, 25, 2, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(metric.value, roiX + 20, priceEnd + 45, { align: 'center' });

      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(metric.metric, roiX + 20, priceEnd + 53, { align: 'center' });

      roiX += 45;
    });

    // ========== FINAL PAGE: CONTACT & NEXT STEPS ==========
    doc.addPage();
    this.addGradientBackground(doc, this.colors.secondary, this.colors.primary);

    // Logo
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', margin, 30, 90, 31);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    doc.text('Ready to Transform?', pageWidth / 2, 100, { align: 'center' });

    doc.setFontSize(18);
    doc.setFont(undefined, 'normal');
    doc.text("Let's Build Your Future Together", pageWidth / 2, 115, { align: 'center' });

    // Contact information box
    doc.setFillColor(255, 255, 255);
    doc.setGState(doc.GState({ opacity: 0.95 }));
    doc.roundedRect(margin, 140, pageWidth - 2 * margin, 80, 5, 5, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Get in Touch:', pageWidth / 2, 155, { align: 'center' });

    const contactInfo = [
      '📧 Email: contact@gennoor.com',
      '📞 Phone: +91 9326352241',
      '🌐 Website: www.gennoor.com',
      '📍 Location: Mumbai, India',
      '💼 LinkedIn: linkedin.com/company/gennoor'
    ];

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    let contactY = 170;
    contactInfo.forEach(info => {
      doc.text(info, pageWidth / 2, contactY, { align: 'center' });
      contactY += 10;
    });

    // Thank you message
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('Thank you for considering Gennoor Tech as your technology partner.', pageWidth / 2, 250, { align: 'center' });
    doc.text('We look forward to accelerating your digital transformation journey.', pageWidth / 2, 260, { align: 'center' });

    // Footer
    doc.setFontSize(10);
    doc.text('© 2024 Gennoor Tech. All rights reserved. | Confidential & Proprietary', pageWidth / 2, pageHeight - 20, { align: 'center' });

    return doc;
  }

  // =============================================
  // NON-TECHNICAL CATALOGUE - BUSINESS VERSION
  // =============================================
  generateBusinessCatalogue(leadData) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    let margin = 15;

    // ========== PAGE 1: COVER ==========
    this.addGradientBackground(doc, this.colors.accent, this.colors.secondary);

    // Logo
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', margin, 20, 90, 31);
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(42);
      doc.setFont(undefined, 'bold');
      doc.text('GENNOOR TECH', margin, 40);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('Your Partner in Digital Transformation', margin, 58);

    // Title
    doc.setFontSize(36);
    doc.setFont(undefined, 'bold');
    doc.text('Business Solutions', pageWidth / 2, 120, { align: 'center' });

    doc.setFontSize(28);
    doc.text('Catalogue 2024', pageWidth / 2, 135, { align: 'center' });

    // Customization
    doc.setFillColor(255, 255, 255);
    doc.setGState(doc.GState({ opacity: 0.95 }));
    doc.roundedRect(margin, 160, pageWidth - 2 * margin, 50, 5, 5, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setTextColor(6, 182, 212);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Exclusively Prepared For:', pageWidth / 2, 175, { align: 'center' });

    doc.setFontSize(18);
    doc.text(leadData.company, pageWidth / 2, 190, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`${leadData.name} | ${leadData.designation}`, pageWidth / 2, 200, { align: 'center' });

    // ========== PAGE 2: EXECUTIVE SUMMARY ==========
    doc.addPage();
    this.addHeader(doc, 'Executive Summary');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Why Gennoor Tech?', margin, 50);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const summary = 'Gennoor Tech transforms businesses through cutting-edge AI and cloud solutions. We combine deep technical expertise with business acumen to deliver measurable results that drive growth, efficiency, and innovation.';
    doc.text(summary, margin, 60, { maxWidth: pageWidth - 2 * margin });

    // Key differentiators
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Our Key Differentiators:', margin, 85);

    const differentiators = [
      {
        icon: '🎯',
        title: '100% Success Rate',
        desc: 'Every client project delivered on time and within budget'
      },
      {
        icon: '🚀',
        title: '3x Faster Implementation',
        desc: 'Rapid deployment with pre-built accelerators'
      },
      {
        icon: '💡',
        title: 'Industry Expertise',
        desc: '15+ years serving Fortune 500 companies'
      },
      {
        icon: '🛡️',
        title: 'Enterprise Security',
        desc: 'Bank-grade security and compliance standards'
      },
      {
        icon: '🤝',
        title: '24/7 Support',
        desc: 'Round-the-clock assistance from expert team'
      },
      {
        icon: '📈',
        title: 'Proven ROI',
        desc: 'Average 300% ROI within first year'
      }
    ];

    let diffY = 100;
    let diffX = margin;

    differentiators.forEach((diff, index) => {
      if (index === 3) {
        diffY += 45;
        diffX = margin;
      }

      // Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(diffX, diffY, 55, 40, 3, 3, 'F');

      // Icon
      doc.setFontSize(20);
      doc.text(diff.icon, diffX + 27.5, diffY + 12, { align: 'center' });

      // Title
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(diff.title, diffX + 27.5, diffY + 22, { align: 'center' });

      // Description
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(diff.desc, 50);
      doc.text(descLines, diffX + 27.5, diffY + 28, { align: 'center' });

      diffX += 60;
    });

    // ========== PAGE 3: BUSINESS CHALLENGES WE SOLVE ==========
    doc.addPage();
    this.addHeader(doc, 'Business Solutions');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Challenges We Solve', margin, 50);

    const challenges = [
      {
        challenge: 'High Operational Costs',
        solution: 'AI-powered automation reduces costs by 40%',
        icon: '💰'
      },
      {
        challenge: 'Slow Decision Making',
        solution: 'Real-time analytics for instant insights',
        icon: '⏱️'
      },
      {
        challenge: 'Customer Dissatisfaction',
        solution: 'AI chatbots provide 24/7 instant support',
        icon: '😟'
      },
      {
        challenge: 'Security Concerns',
        solution: 'Enterprise-grade security with compliance',
        icon: '🔐'
      },
      {
        challenge: 'Scalability Issues',
        solution: 'Cloud solutions that grow with your business',
        icon: '📊'
      },
      {
        challenge: 'Legacy System Constraints',
        solution: 'Seamless modernization without disruption',
        icon: '🔧'
      }
    ];

    let chalY = 60;
    challenges.forEach(chal => {
      // Challenge box
      doc.setFillColor(254, 226, 226);
      doc.roundedRect(margin, chalY, 85, 20, 3, 3, 'F');

      // Solution box
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(margin + 90, chalY, 85, 20, 3, 3, 'F');

      // Icon
      doc.setFontSize(14);
      doc.text(chal.icon, margin + 5, chalY + 12);

      // Challenge text
      doc.setTextColor(153, 27, 27);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(chal.challenge, margin + 15, chalY + 8);

      // Arrow
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(2);
      doc.line(margin + 86, chalY + 10, margin + 89, chalY + 10);

      // Solution text
      doc.setTextColor(22, 101, 52);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const solLines = doc.splitTextToSize(chal.solution, 80);
      doc.text(solLines, margin + 92, chalY + 8);

      chalY += 25;
    });

    // ========== PAGE 4: INDUSTRY SOLUTIONS ==========
    doc.addPage();
    this.addHeader(doc, 'Industry Solutions');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Industry-Specific Solutions', margin, 50);

    const industries = [
      {
        name: 'Manufacturing',
        icon: '🏭',
        solutions: [
          'Predictive maintenance to prevent downtime',
          'Quality control with computer vision',
          'Supply chain optimization',
          'IoT-enabled smart factories'
        ],
        result: '45% reduction in defects'
      },
      {
        name: 'Healthcare',
        icon: '🏥',
        solutions: [
          'AI-powered diagnosis assistance',
          'Patient data management',
          'Telemedicine platforms',
          'Drug discovery acceleration'
        ],
        result: '30% faster patient care'
      },
      {
        name: 'Banking & Finance',
        icon: '🏦',
        solutions: [
          'Fraud detection systems',
          'Risk assessment automation',
          'Customer service chatbots',
          'Regulatory compliance'
        ],
        result: '60% fraud reduction'
      },
      {
        name: 'Retail & E-commerce',
        icon: '🛒',
        solutions: [
          'Personalized recommendations',
          'Inventory management',
          'Dynamic pricing optimization',
          'Customer behavior analysis'
        ],
        result: '35% sales increase'
      }
    ];

    let indY = 60;
    industries.forEach(industry => {
      // Industry header
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(margin, indY, pageWidth - 2 * margin, 12, 3, 3, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${industry.icon} ${industry.name}`, margin + 5, indY + 8);

      // Result badge
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(pageWidth - margin - 50, indY + 2, 45, 8, 2, 2, 'F');
      doc.setFontSize(9);
      doc.text(industry.result, pageWidth - margin - 27.5, indY + 7, { align: 'center' });

      indY += 15;

      // Solutions
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      industry.solutions.forEach(solution => {
        doc.text(`• ${solution}`, margin + 10, indY);
        indY += 6;
      });

      indY += 5;
    });

    // ========== PAGE 5: SUCCESS STORIES ==========
    doc.addPage();
    this.addHeader(doc, 'Client Success Stories');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Real Results, Real Impact', margin, 50);

    const stories = [
      {
        client: 'Global Manufacturing Corp',
        industry: 'Manufacturing',
        challenge: 'High defect rates and production delays',
        solution: 'Implemented AI-powered quality control and predictive maintenance',
        results: [
          '45% reduction in defect rates',
          '30% improvement in production efficiency',
          '₹5 Cr annual savings'
        ],
        testimonial: '"Gennoor transformed our operations. The ROI exceeded our expectations."'
      },
      {
        client: 'Leading Healthcare Network',
        industry: 'Healthcare',
        challenge: 'Long patient wait times and inefficient processes',
        solution: 'Deployed AI diagnosis assistance and patient management system',
        results: [
          '40% reduction in diagnosis time',
          '25% increase in patient satisfaction',
          '2x improvement in staff productivity'
        ],
        testimonial: '"The AI solution has revolutionized how we serve our patients."'
      },
      {
        client: 'National Bank',
        industry: 'Banking',
        challenge: 'Rising fraud incidents and compliance issues',
        solution: 'Built real-time fraud detection and compliance automation',
        results: [
          '60% reduction in fraud losses',
          '100% regulatory compliance',
          '₹10 Cr saved annually'
        ],
        testimonial: '"Gennoor\'s solution gave us peace of mind and significant savings."'
      }
    ];

    let storyY = 60;
    stories.forEach(story => {
      // Story container
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, storyY, pageWidth - 2 * margin, 60, 3, 3, 'F');

      // Client name
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(story.client, margin + 5, storyY + 8);

      // Industry tag
      doc.setFillColor(139, 92, 246);
      doc.roundedRect(pageWidth - margin - 40, storyY + 3, 35, 7, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(story.industry, pageWidth - margin - 22.5, storyY + 7.5, { align: 'center' });

      // Challenge
      doc.setTextColor(239, 68, 68);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('Challenge: ', margin + 5, storyY + 16);
      doc.setTextColor(100, 116, 139);
      doc.setFont(undefined, 'normal');
      doc.text(story.challenge, margin + 25, storyY + 16);

      // Solution
      doc.setTextColor(16, 185, 129);
      doc.setFont(undefined, 'bold');
      doc.text('Solution: ', margin + 5, storyY + 22);
      doc.setTextColor(100, 116, 139);
      doc.setFont(undefined, 'normal');
      const solText = doc.splitTextToSize(story.solution, 150);
      doc.text(solText, margin + 22, storyY + 22);

      // Results
      doc.setTextColor(59, 130, 246);
      doc.setFont(undefined, 'bold');
      doc.text('Results:', margin + 5, storyY + 32);

      let resY = storyY + 37;
      story.results.forEach(result => {
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(`✓ ${result}`, margin + 10, resY);
        resY += 5;
      });

      // Testimonial
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont(undefined, 'italic');
      doc.text(story.testimonial, margin + 5, storyY + 55);

      storyY += 65;
    });

    // ========== PAGE 6: OUR PROCESS ==========
    doc.addPage();
    this.addHeader(doc, 'Our Process');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('How We Work With You', margin, 50);

    const process = [
      {
        step: '1',
        title: 'Discovery',
        duration: '1 Week',
        activities: [
          'Understand your business goals',
          'Identify pain points',
          'Assess current systems',
          'Define success metrics'
        ],
        icon: '🔍'
      },
      {
        step: '2',
        title: 'Strategy',
        duration: '2 Weeks',
        activities: [
          'Design solution architecture',
          'Create implementation roadmap',
          'Define project milestones',
          'Prepare cost-benefit analysis'
        ],
        icon: '📋'
      },
      {
        step: '3',
        title: 'Implementation',
        duration: '8-12 Weeks',
        activities: [
          'Agile development sprints',
          'Regular progress updates',
          'Continuous testing',
          'User training sessions'
        ],
        icon: '⚙️'
      },
      {
        step: '4',
        title: 'Launch',
        duration: '1 Week',
        activities: [
          'System deployment',
          'Go-live support',
          'Performance monitoring',
          'Issue resolution'
        ],
        icon: '🚀'
      },
      {
        step: '5',
        title: 'Support',
        duration: 'Ongoing',
        activities: [
          '24/7 technical support',
          'Regular maintenance',
          'Performance optimization',
          'Continuous improvements'
        ],
        icon: '🛡️'
      }
    ];

    let procY = 60;
    process.forEach((proc, index) => {
      // Step circle
      doc.setFillColor(59, 130, 246);
      doc.circle(margin + 10, procY + 10, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(proc.step, margin + 10, procY + 13, { align: 'center' });

      // Connection line
      if (index < process.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(margin + 10, procY + 18, margin + 10, procY + 35);
        doc.setLineDashPattern([], 0);
      }

      // Process details box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin + 25, procY, pageWidth - margin - 30, 30, 3, 3, 'F');

      // Icon and title
      doc.setFontSize(16);
      doc.text(proc.icon, margin + 30, procY + 10);

      doc.setTextColor(30, 58, 138);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(proc.title, margin + 45, procY + 10);

      // Duration badge
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(pageWidth - margin - 40, procY + 4, 35, 7, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(proc.duration, pageWidth - margin - 22.5, procY + 8.5, { align: 'center' });

      // Activities
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');

      let actY = procY + 16;
      proc.activities.forEach(activity => {
        doc.text(`• ${activity}`, margin + 30, actY);
        actY += 4;
      });

      procY += 35;
    });

    // ========== PAGE 7: INVESTMENT & ROI ==========
    doc.addPage();
    this.addHeader(doc, 'Investment & Returns');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Your Investment & Expected Returns', margin, 50);

    // ROI timeline
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Return on Investment Timeline:', margin, 65);

    // ROI visualization
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, 75, pageWidth - 2 * margin, 60, 3, 3, 'F');

    const roiData = [
      { month: 'Month 0-3', status: 'Investment', value: -100, color: [239, 68, 68] },
      { month: 'Month 4-6', status: 'Break-even', value: 0, color: [245, 158, 11] },
      { month: 'Month 7-9', status: '50% ROI', value: 50, color: [59, 130, 246] },
      { month: 'Month 10-12', status: '150% ROI', value: 150, color: [16, 185, 129] },
      { month: 'Year 2', status: '300% ROI', value: 300, color: [139, 92, 246] }
    ];

    let roiX = margin + 15;
    roiData.forEach(roi => {
      // Bar height (positive up, negative down)
      const barHeight = Math.abs(roi.value) / 10;
      const barY = roi.value >= 0 ? 105 - barHeight : 105;

      // Bar
      doc.setFillColor(...roi.color);
      doc.rect(roiX, barY, 25, barHeight, 'F');

      // Label
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text(roi.month, roiX + 12.5, 120, { align: 'center' });

      doc.setFont(undefined, 'normal');
      doc.text(roi.status, roiX + 12.5, 125, { align: 'center' });

      roiX += 35;
    });

    // Baseline
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(1);
    doc.line(margin, 105, pageWidth - margin, 105);

    // Investment packages
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Investment Packages:', margin, 150);

    const packages = [
      {
        name: 'STARTER',
        price: '₹10-25 Lakhs',
        duration: '3 months',
        includes: [
          'Basic cloud setup',
          'One AI solution',
          'Training for 10 users',
          '3 months support'
        ],
        best: 'Small businesses'
      },
      {
        name: 'PROFESSIONAL',
        price: '₹25-50 Lakhs',
        duration: '6 months',
        includes: [
          'Complete cloud migration',
          'Multiple AI solutions',
          'Training for 50 users',
          '6 months support'
        ],
        best: 'Growing companies'
      },
      {
        name: 'ENTERPRISE',
        price: '₹50L+',
        duration: '12 months',
        includes: [
          'Full digital transformation',
          'Custom AI development',
          'Unlimited training',
          '24/7 dedicated support'
        ],
        best: 'Large enterprises'
      }
    ];

    let packY = 160;
    packages.forEach(pack => {
      // Package box
      const boxHeight = 50;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, packY, 55, boxHeight, 3, 3, 'F');

      // Package name
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(margin, packY, 55, 10, 3, 3, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(pack.name, margin + 27.5, packY + 7, { align: 'center' });

      // Price
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(pack.price, margin + 27.5, packY + 18, { align: 'center' });

      // Duration
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(pack.duration, margin + 27.5, packY + 25, { align: 'center' });

      // Best for
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(8);
      doc.setFont(undefined, 'italic');
      doc.text(`Best for: ${pack.best}`, margin + 27.5, packY + 45, { align: 'center' });

      // Includes
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');

      let incY = packY + 32;
      pack.includes.forEach(inc => {
        doc.text(`• ${inc}`, margin + 3, incY);
        incY += 3.5;
      });

      margin += 60;
    });

    margin = 15; // Reset margin

    // ========== PAGE 8: WHY NOW ==========
    doc.addPage();
    this.addHeader(doc, 'Why Act Now');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('The Cost of Waiting', margin, 50);

    // Opportunity cost visualization
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(margin, 60, pageWidth - 2 * margin, 50, 3, 3, 'F');

    doc.setTextColor(153, 27, 27);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Every Month You Wait, You Lose:', margin + 10, 75);

    const losses = [
      '₹5-10 Lakhs in operational inefficiencies',
      '20% of potential productivity gains',
      'Market share to AI-enabled competitors',
      'Valuable customer insights and data'
    ];

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    let lossY = 85;
    losses.forEach(loss => {
      doc.text(`• ${loss}`, margin + 15, lossY);
      lossY += 8;
    });

    // Benefits of starting now
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(margin, 120, pageWidth - 2 * margin, 50, 3, 3, 'F');

    doc.setTextColor(22, 101, 52);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Start Today and Gain:', margin + 10, 135);

    const gains = [
      'Immediate cost savings through automation',
      'Competitive advantage in your market',
      'Enhanced customer satisfaction',
      'Data-driven decision making'
    ];

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    let gainY = 145;
    gains.forEach(gain => {
      doc.text(`• ${gain}`, margin + 15, gainY);
      gainY += 8;
    });

    // Limited time offer
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(margin, 180, pageWidth - 2 * margin, 30, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('🎯 Special Offer for Q1 2024', pageWidth / 2, 192, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('20% discount on all packages + Free consultation worth ₹50,000', pageWidth / 2, 202, { align: 'center' });

    // ========== PAGE 9: NEXT STEPS ==========
    doc.addPage();
    this.addHeader(doc, 'Get Started');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Your Journey Starts Here', margin, 50);

    // Steps to get started
    const nextSteps = [
      {
        step: '1',
        title: 'Schedule a Discovery Call',
        desc: '30-minute call to understand your needs',
        action: 'Call +91 9326352241',
        time: 'Today'
      },
      {
        step: '2',
        title: 'Get Your Custom Proposal',
        desc: 'Detailed solution and investment plan',
        action: 'Delivered in 48 hours',
        time: 'This Week'
      },
      {
        step: '3',
        title: 'Proof of Concept',
        desc: 'See results with a pilot project',
        action: 'Start implementation',
        time: '2 Weeks'
      },
      {
        step: '4',
        title: 'Full Implementation',
        desc: 'Complete transformation begins',
        action: 'Go live',
        time: '1 Month'
      }
    ];

    let stepY = 60;
    nextSteps.forEach(step => {
      // Step number circle
      doc.setFillColor(59, 130, 246);
      doc.circle(margin + 10, stepY + 15, 10, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(step.step, margin + 10, stepY + 19, { align: 'center' });

      // Step content box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin + 30, stepY, pageWidth - margin - 35, 35, 3, 3, 'F');

      // Title
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(step.title, margin + 35, stepY + 10);

      // Timeline badge
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(pageWidth - margin - 35, stepY + 4, 30, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(step.time, pageWidth - margin - 20, stepY + 9, { align: 'center' });

      // Description
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(step.desc, margin + 35, stepY + 18);

      // Action
      doc.setTextColor(59, 130, 246);
      doc.setFont(undefined, 'bold');
      doc.text(step.action, margin + 35, stepY + 26);

      stepY += 40;
    });

    // ========== FINAL PAGE: CONTACT ==========
    doc.addPage();
    this.addGradientBackground(doc, this.colors.accent, this.colors.secondary);

    // Logo
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', margin, 30, 90, 31);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont(undefined, 'bold');
    doc.text("Let's Transform", pageWidth / 2, 100, { align: 'center' });
    doc.text('Your Business', pageWidth / 2, 115, { align: 'center' });
    doc.text('Together', pageWidth / 2, 130, { align: 'center' });

    // Contact CTA
    doc.setFillColor(255, 255, 255);
    doc.setGState(doc.GState({ opacity: 0.95 }));
    doc.roundedRect(margin, 150, pageWidth - 2 * margin, 90, 5, 5, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Start Your Transformation Today', pageWidth / 2, 165, { align: 'center' });

    const contacts = [
      '📞 Call: +91 9326352241',
      '📧 Email: contact@gennoor.com',
      '🌐 Visit: www.gennoor.com',
      '📍 Office: Mumbai, India',
      '💼 LinkedIn: /company/gennoor'
    ];

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    let conY = 180;
    contacts.forEach(contact => {
      doc.text(contact, pageWidth / 2, conY, { align: 'center' });
      conY += 10;
    });

    // Special offer reminder
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(margin + 20, 245, pageWidth - 2 * margin - 40, 20, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Limited Time: 20% Off + Free Consultation', pageWidth / 2, 256, { align: 'center' });

    // Thank you
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Thank you for considering Gennoor Tech as your transformation partner.', pageWidth / 2, pageHeight - 30, { align: 'center' });
    doc.text('© 2024 Gennoor Tech. All rights reserved.', pageWidth / 2, pageHeight - 20, { align: 'center' });

    return doc;
  }

  // Helper methods
  addHeader(doc, title) {
    const pageWidth = 210;

    // Header background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, 25, 'F');

    // Logo area
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', 10, 5, 45, 15);
    }

    // Title
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(title, pageWidth - 15, 15, { align: 'right' });

    // Divider line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(0, 25, pageWidth, 25);
  }

  addGradientBackground(doc, color1, color2) {
    const pageWidth = 210;
    const pageHeight = 297;
    const steps = 50;

    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;

      const r1 = parseInt(color1.slice(1, 3), 16);
      const g1 = parseInt(color1.slice(3, 5), 16);
      const b1 = parseInt(color1.slice(5, 7), 16);

      const r2 = parseInt(color2.slice(1, 3), 16);
      const g2 = parseInt(color2.slice(3, 5), 16);
      const b2 = parseInt(color2.slice(5, 7), 16);

      const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

      doc.setFillColor(r, g, b);
      doc.rect(0, (pageHeight / steps) * i, pageWidth, pageHeight / steps + 1, 'F');
    }
  }

  async generateAndSave(type, leadData, outputPath) {
    try {
      const doc = type === 'technical'
        ? this.generateTechnicalCatalogue(leadData)
        : this.generateBusinessCatalogue(leadData);

      const pdfOutput = doc.output('arraybuffer');
      fs.writeFileSync(outputPath, Buffer.from(pdfOutput));

      console.log(`✅ Catalogue saved: ${outputPath}`);
      console.log(`📄 Pages: ${doc.getNumberOfPages()}`);
      console.log(`📊 Size: ${(pdfOutput.byteLength / 1024).toFixed(2)} KB`);

      return outputPath;
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      throw error;
    }
  }
}

// Main execution
async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('           GENNOOR TECH - COMPREHENSIVE CATALOGUE GENERATOR     ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('📚 Generating detailed service catalogues...');
  console.log('📁 Output directory: ./local-pdfs/');
  console.log('');

  const generator = new GennoorCatalogueGenerator();

  // Lead data
  const lead = {
    name: 'John Smith',
    company: 'TechCorp Solutions',
    designation: 'Chief Executive Officer',
    email: 'john@techcorp.com'
  };

  const outputDir = path.join(__dirname, 'local-pdfs');

  console.log(`👤 Client: ${lead.name}`);
  console.log(`🏢 Company: ${lead.company}`);
  console.log(`📧 Contact: ${lead.email}`);
  console.log('');
  console.log('─────────────────────────────────────────────────────────────');

  // Generate technical catalogue
  console.log('');
  console.log('📘 Generating Technical Catalogue...');
  console.log('   • Cloud Infrastructure Solutions');
  console.log('   • AI & Machine Learning Services');
  console.log('   • Software Development');
  console.log('   • Data Engineering');
  console.log('   • Security & Compliance');
  console.log('   • DevOps & Automation');
  console.log('   • Technical Training');
  console.log('   • Implementation Roadmap');

  const techPath = path.join(outputDir, 'Gennoor_Technical_Services_Catalogue_2024.pdf');
  await generator.generateAndSave('technical', lead, techPath);

  console.log('');
  console.log('─────────────────────────────────────────────────────────────');

  // Generate business catalogue
  console.log('');
  console.log('📗 Generating Business Catalogue...');
  console.log('   • Executive Summary');
  console.log('   • Business Challenges & Solutions');
  console.log('   • Industry-Specific Solutions');
  console.log('   • Client Success Stories');
  console.log('   • Our Process');
  console.log('   • Investment & ROI');
  console.log('   • Why Act Now');
  console.log('   • Getting Started');

  const bizPath = path.join(outputDir, 'Gennoor_Business_Solutions_Catalogue_2024.pdf');
  await generator.generateAndSave('business', lead, bizPath);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    ✨ GENERATION COMPLETE! ✨                   ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('📊 Summary:');
  console.log('   ✅ Technical Catalogue: 12+ pages of detailed technical content');
  console.log('   ✅ Business Catalogue: 9+ pages of business-focused content');
  console.log('');
  console.log('🎯 Features Included:');
  console.log('   • Professional Gennoor branding with logo');
  console.log('   • Comprehensive service descriptions');
  console.log('   • Industry-specific solutions');
  console.log('   • Success stories and testimonials');
  console.log('   • ROI calculations and timelines');
  console.log('   • Implementation roadmaps');
  console.log('   • Pricing and investment options');
  console.log('   • Contact information and CTAs');
  console.log('');
  console.log('📂 Files saved to: ./local-pdfs/');
  console.log('');
}

main().catch(console.error);