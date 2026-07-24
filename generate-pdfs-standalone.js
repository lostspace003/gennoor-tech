// Standalone PDF Generator for Gennoor CRM
// This generates professional Canva-style PDFs locally

const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default;
const fs = require('fs');
const path = require('path');

class StandalonePDFGenerator {
  constructor() {
    this.colors = {
      primary: '#2563eb',    // Blue
      secondary: '#7c3aed',  // Purple
      accent: '#06b6d4',     // Cyan
      success: '#10b981',    // Green
      warning: '#f59e0b',    // Amber
      danger: '#ef4444',     // Red
      dark: '#1e293b',       // Slate
      light: '#f8fafc',      // Light Gray
      gradient1: '#667eea',  // Indigo
      gradient2: '#764ba2',  // Purple
    };

    this.fonts = {
      title: { size: 32, style: 'bold' },
      heading: { size: 24, style: 'bold' },
      subheading: { size: 18, style: 'bold' },
      body: { size: 12, style: 'normal' },
      caption: { size: 10, style: 'normal' },
    };
  }

  generateTechnicalDeck(leadData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Page 1: Cover with gradient effect
    this.addGradientBackground(doc, this.colors.primary, this.colors.secondary);

    // Logo and branding
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(48);
    doc.setFont(undefined, 'bold');
    doc.text('G', 20, 40);

    doc.setFontSize(36);
    doc.text('Gennoor Tech', 50, 40);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('TRAIN. INNOVATE. BUILD.', 50, 50);

    // Title
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    const title = 'AI Transformation Solutions';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 100);

    // Subtitle for company
    doc.setFontSize(20);
    doc.setFont(undefined, 'normal');
    const companyText = `Prepared for ${leadData.company}`;
    const companyWidth = doc.getTextWidth(companyText);
    doc.text(companyText, (pageWidth - companyWidth) / 2, 120);

    // Technical highlights box
    doc.setFillColor(255, 255, 255, 0.9);
    doc.roundedRect(20, 140, pageWidth - 40, 100, 5, 5, 'F');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Excellence', 30, 155);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const techPoints = [
      '• Enterprise-grade Azure Architecture',
      '• 99.9% Uptime SLA Guarantee',
      '• End-to-end Security & Compliance',
      '• Scalable Microservices Design',
      '• Real-time Analytics Pipeline'
    ];

    let yPos = 170;
    techPoints.forEach(point => {
      doc.text(point, 30, yPos);
      yPos += 10;
    });

    // Footer
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    const date = new Date().toLocaleDateString();
    doc.text(date, 20, pageHeight - 20);
    doc.text('Confidential', pageWidth - 40, pageHeight - 20);

    // Page 2: Technical Architecture
    doc.addPage();
    this.addGradientBackground(doc, this.colors.gradient1, this.colors.gradient2);

    // Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('System Architecture', 20, 30);

    // Architecture diagram area
    doc.setFillColor(255, 255, 255, 0.95);
    doc.roundedRect(15, 45, pageWidth - 30, 90, 5, 5, 'F');

    // Draw simplified architecture
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(2);

    // Frontend box
    doc.setFillColor(224, 242, 254);
    doc.rect(25, 55, 50, 30, 'FD');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text('React/Next.js', 35, 70);
    doc.text('Frontend', 38, 78);

    // API Gateway
    doc.setFillColor(237, 233, 254);
    doc.rect(85, 55, 50, 30, 'FD');
    doc.text('API Gateway', 95, 70);
    doc.text('Azure APIM', 96, 78);

    // Backend Services
    doc.setFillColor(219, 234, 254);
    doc.rect(145, 55, 50, 30, 'FD');
    doc.text('Microservices', 153, 70);
    doc.text('.NET Core', 157, 78);

    // Database layer
    doc.setFillColor(254, 243, 199);
    doc.rect(25, 95, 50, 30, 'FD');
    doc.text('Azure SQL', 38, 110);
    doc.text('Database', 39, 118);

    // Storage
    doc.setFillColor(254, 226, 226);
    doc.rect(85, 95, 50, 30, 'FD');
    doc.text('Blob Storage', 94, 110);
    doc.text('Files & Media', 94, 118);

    // AI Services
    doc.setFillColor(233, 213, 255);
    doc.rect(145, 95, 50, 30, 'FD');
    doc.text('Azure OpenAI', 154, 110);
    doc.text('GPT-4 Models', 153, 118);

    // Technical specifications
    doc.setFillColor(255, 255, 255, 0.95);
    doc.roundedRect(15, 145, pageWidth - 30, 100, 5, 5, 'F');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Specifications', 25, 160);

    // Create specifications table
    autoTable(doc, {
      startY: 165,
      head: [['Component', 'Technology', 'Specifications']],
      body: [
        ['Frontend', 'Next.js 14', 'TypeScript, Server Components, Edge Runtime'],
        ['Backend', '.NET 8', 'C#, Minimal APIs, Azure Functions'],
        ['Database', 'Azure SQL', 'Geo-redundant, Auto-scaling, 99.99% SLA'],
        ['AI/ML', 'Azure OpenAI', 'GPT-4, Custom Fine-tuning, RAG Pipeline'],
        ['Security', 'Azure AD B2C', 'OAuth 2.0, MFA, Zero-trust Architecture'],
        ['Monitoring', 'App Insights', 'Real-time telemetry, Custom dashboards']
      ],
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9, cellPadding: 3 }
    });

    // Footer
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('© 2024 Gennoor Tech - Proprietary & Confidential', pageWidth / 2 - 50, pageHeight - 10);

    return doc;
  }

  generateNonTechnicalDeck(leadData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Page 1: Business-focused cover
    this.addGradientBackground(doc, this.colors.secondary, this.colors.accent);

    // Logo and branding
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(48);
    doc.setFont(undefined, 'bold');
    doc.text('G', 20, 40);

    doc.setFontSize(36);
    doc.text('Gennoor Tech', 50, 40);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Your AI Transformation Partner', 50, 50);

    // Title
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    const title = 'Transform Your Business with AI';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 100);

    // Company personalization
    doc.setFontSize(20);
    doc.setFont(undefined, 'normal');
    const companyText = `Customized for ${leadData.company}`;
    const companyWidth = doc.getTextWidth(companyText);
    doc.text(companyText, (pageWidth - companyWidth) / 2, 120);

    // Business value box
    doc.setFillColor(255, 255, 255, 0.9);
    doc.roundedRect(20, 140, pageWidth - 40, 100, 5, 5, 'F');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Why Choose Gennoor?', 30, 155);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const valuePoints = [
      '✓ 40% Average Cost Reduction',
      '✓ 3x Productivity Improvement',
      '✓ 60-Day Implementation Timeline',
      '✓ 24/7 Dedicated Support',
      '✓ 100% Success Rate'
    ];

    let yPos = 170;
    valuePoints.forEach(point => {
      doc.text(point, 30, yPos);
      yPos += 10;
    });

    // Call to action
    doc.setFillColor(16, 185, 129);
    doc.roundedRect((pageWidth - 120) / 2, 250, 120, 20, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Start Your Journey', (pageWidth - doc.getTextWidth('Start Your Journey')) / 2, 263);

    // Page 2: ROI and Success Stories
    doc.addPage();
    this.addGradientBackground(doc, this.colors.gradient2, this.colors.gradient1);

    // Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('Your ROI Calculator', 20, 30);

    // ROI visualization
    doc.setFillColor(255, 255, 255, 0.95);
    doc.roundedRect(15, 45, pageWidth - 30, 80, 5, 5, 'F');

    // ROI metrics
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Expected Returns', 25, 60);

    // Draw simple bar chart
    const metrics = [
      { label: 'Year 1', value: 150, color: this.colors.success },
      { label: 'Year 2', value: 280, color: this.colors.primary },
      { label: 'Year 3', value: 420, color: this.colors.secondary }
    ];

    const barWidth = 40;
    const maxHeight = 40;
    let xPos = 30;

    metrics.forEach(metric => {
      const barHeight = (metric.value / 500) * maxHeight;
      doc.setFillColor(...this.hexToRgb(metric.color));
      doc.rect(xPos, 110 - barHeight, barWidth, barHeight, 'F');

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.text(metric.label, xPos + 10, 115);

      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${metric.value}%`, xPos + 10, 75 - barHeight);

      xPos += 55;
    });

    // Success stories
    doc.setFillColor(255, 255, 255, 0.95);
    doc.roundedRect(15, 135, pageWidth - 30, 90, 5, 5, 'F');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Success Stories', 25, 150);

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    const stories = [
      '🏭 Manufacturing: 45% reduction in defect rates using AI quality control',
      '🏥 Healthcare: 30% faster diagnosis with AI-powered imaging analysis',
      '🏦 Banking: 60% reduction in fraud with real-time AI monitoring',
      '🛒 Retail: 35% increase in sales through AI personalization'
    ];

    yPos = 165;
    stories.forEach(story => {
      doc.text(story, 25, yPos);
      yPos += 15;
    });

    // Contact section
    doc.setFillColor(255, 255, 255, 0.95);
    doc.roundedRect(15, 235, pageWidth - 30, 40, 5, 5, 'F');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Ready to Transform?', 25, 250);

    doc.setFont(undefined, 'normal');
    doc.text('📧 contact@gennoor.com  |  📞 +91 9326352241', 25, 262);
    doc.text('🌐 www.gennoor.com', 25, 270);

    // Footer
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('© 2024 Gennoor Tech - Your Success, Our Mission', pageWidth / 2 - 50, pageHeight - 10);

    return doc;
  }

  addGradientBackground(doc, color1, color2) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const steps = 100;

    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.round(rgb1[0] * (1 - ratio) + rgb2[0] * ratio);
      const g = Math.round(rgb1[1] * (1 - ratio) + rgb2[1] * ratio);
      const b = Math.round(rgb1[2] * (1 - ratio) + rgb2[2] * ratio);

      doc.setFillColor(r, g, b);
      doc.rect(0, (pageHeight / steps) * i, pageWidth, pageHeight / steps + 1, 'F');
    }
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }

  async generateAndSave(type, leadData, outputPath) {
    try {
      const doc = type === 'technical'
        ? this.generateTechnicalDeck(leadData)
        : this.generateNonTechnicalDeck(leadData);

      // Save to file
      const pdfOutput = doc.output('arraybuffer');
      fs.writeFileSync(outputPath, Buffer.from(pdfOutput));

      console.log(`✅ PDF saved to: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error(`❌ Error generating PDF: ${error.message}`);
      throw error;
    }
  }
}

// Main execution
async function main() {
  console.log('🎨 Gennoor CRM - Professional PDF Generator\n');
  console.log('📁 Output Directory: ./local-pdfs/\n');

  const generator = new StandalonePDFGenerator();

  // Sample lead data
  const sampleLeads = [
    {
      name: 'John Smith',
      company: 'TechCorp Solutions',
      designation: 'CEO',
      email: 'john@techcorp.com'
    },
    {
      name: 'Sarah Johnson',
      company: 'Innovation Labs',
      designation: 'CTO',
      email: 'sarah@innovationlabs.com'
    },
    {
      name: 'Michael Chen',
      company: 'Future Dynamics',
      designation: 'Director',
      email: 'michael@futuredynamics.com'
    }
  ];

  const outputDir = path.join(__dirname, 'local-pdfs');

  // Generate PDFs for each lead
  for (const lead of sampleLeads) {
    console.log(`📋 Generating PDFs for ${lead.name} (${lead.company})...`);

    // Generate technical deck
    const techFilename = `${lead.company.replace(/\s+/g, '_')}_Technical_Deck.pdf`;
    const techPath = path.join(outputDir, techFilename);
    await generator.generateAndSave('technical', lead, techPath);

    // Generate non-technical deck
    const bizFilename = `${lead.company.replace(/\s+/g, '_')}_Business_Deck.pdf`;
    const bizPath = path.join(outputDir, bizFilename);
    await generator.generateAndSave('non-technical', lead, bizPath);

    console.log('');
  }

  console.log('✨ All PDFs generated successfully!');
  console.log(`📂 Check the ${outputDir} folder for your PDFs.`);
  console.log('\n🎯 Features included:');
  console.log('  • Professional Canva-style design');
  console.log('  • Gradient backgrounds');
  console.log('  • Company personalization');
  console.log('  • Technical architecture diagrams');
  console.log('  • ROI calculators');
  console.log('  • Success stories');
  console.log('  • Gennoor branding throughout');
}

// Run the generator
main().catch(console.error);