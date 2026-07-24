// Professional PDF Generator for Gennoor CRM with Logo
// Creates high-quality 2-page PDFs (Technical and Non-Technical)

const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default;
const fs = require('fs');
const path = require('path');

class ProfessionalPDFGenerator {
  constructor() {
    // Gennoor brand colors
    this.colors = {
      primary: '#0066CC',      // Gennoor Blue
      secondary: '#003D7A',    // Dark Blue
      accent: '#00A0E3',       // Light Blue
      success: '#00C853',      // Green
      text: '#1A1A1A',         // Dark text
      light: '#F5F7FA',        // Light background
      white: '#FFFFFF'
    };

    // Read and encode logo as base64
    const logoPath = path.join(__dirname, 'public/logos/gennoor-tech-logo-horizontal-dark_760x260_website-header.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      this.logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }
  }

  generateTechnicalPDF(leadData) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;

    // ========== PAGE 1: PROFESSIONAL COVER ==========
    // Blue gradient background
    this.addProfessionalBackground(doc, '#0066CC', '#003D7A');

    // Add logo if available
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', margin, 20, 80, 27);
    } else {
      // Fallback: Text logo
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.setFont(undefined, 'bold');
      doc.text('Gennoor Tech', margin, 35);
    }

    // Tagline
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('TRAIN. INNOVATE. BUILD.', margin, 55);

    // Main title with professional styling
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    const title = 'Technical Blueprint';
    doc.text(title, pageWidth / 2, 110, { align: 'center' });

    doc.setFontSize(24);
    doc.setFont(undefined, 'normal');
    doc.text('AI Transformation Solutions', pageWidth / 2, 125, { align: 'center' });

    // Company customization box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(255, 255, 255);
    doc.roundedRect(margin, 145, pageWidth - 2 * margin, 40, 5, 5, 'FD');

    doc.setTextColor(0, 102, 204);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`Prepared for: ${leadData.company}`, pageWidth / 2, 160, { align: 'center' });

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`${leadData.name} | ${leadData.designation}`, pageWidth / 2, 172, { align: 'center' });

    // Key highlights section
    doc.setFillColor(255, 255, 255);
    doc.setGState(doc.GState({ opacity: 0.95 }));
    doc.roundedRect(margin, 200, pageWidth - 2 * margin, 70, 5, 5, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setTextColor(0, 61, 122);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Excellence', margin + 10, 215);

    // Technical highlights with icons
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    const techHighlights = [
      '✓ Cloud-Native Architecture on Microsoft Azure',
      '✓ Enterprise Security & Compliance (ISO 27001, SOC 2)',
      '✓ AI/ML Integration with Azure OpenAI (GPT-4)',
      '✓ 99.99% Uptime SLA with Auto-Scaling',
      '✓ Real-time Analytics & Business Intelligence'
    ];

    let yPos = 230;
    techHighlights.forEach(item => {
      doc.text(item, margin + 10, yPos);
      yPos += 8;
    });

    // Footer
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('© 2024 Gennoor Tech | Confidential', pageWidth / 2, pageHeight - 15, { align: 'center' });

    // ========== PAGE 2: TECHNICAL ARCHITECTURE ==========
    doc.addPage();

    // Clean white background for technical content
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header with logo
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', margin, 10, 60, 20);
    }

    // Page title
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('System Architecture & Implementation', margin, 50);

    // Architecture section
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, 60, pageWidth - 2 * margin, 80, 3, 3, 'F');

    // Draw architecture diagram
    this.drawArchitectureDiagram(doc, margin + 10, 70, pageWidth - 2 * margin - 20);

    // Technical specifications table
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Specifications', margin, 155);

    autoTable(doc, {
      startY: 160,
      head: [['Layer', 'Technology', 'Specifications']],
      body: [
        ['Frontend', 'Next.js 14 + React', 'TypeScript, Tailwind CSS, Server Components'],
        ['Backend', '.NET 8 + Node.js', 'Microservices, REST APIs, GraphQL'],
        ['Database', 'Azure SQL + Cosmos DB', 'Multi-region, Automatic failover, <10ms latency'],
        ['AI/ML', 'Azure OpenAI Service', 'GPT-4, Custom fine-tuning, RAG pipeline'],
        ['Security', 'Azure AD B2C + KeyVault', 'OAuth 2.0, MFA, Zero-trust, Encryption at rest'],
        ['DevOps', 'GitHub Actions + Azure', 'CI/CD, IaC, Automated testing, Blue-Green deploy']
      ],
      theme: 'striped',
      headStyles: {
        fillColor: [0, 102, 204],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      margin: { left: margin, right: margin }
    });

    // Implementation timeline
    const finalY = doc.lastAutoTable.finalY || 220;

    doc.setTextColor(0, 61, 122);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Implementation Timeline', margin, finalY + 15);

    // Timeline visualization
    doc.setDrawColor(0, 160, 227);
    doc.setLineWidth(2);
    doc.line(margin + 10, finalY + 25, pageWidth - margin - 10, finalY + 25);

    // Timeline milestones
    const milestones = [
      { week: 'Week 1-2', task: 'Discovery & Planning' },
      { week: 'Week 3-4', task: 'Core Development' },
      { week: 'Week 5-6', task: 'Integration & Testing' },
      { week: 'Week 7-8', task: 'Deployment & Training' }
    ];

    const spacing = (pageWidth - 2 * margin - 20) / milestones.length;
    milestones.forEach((milestone, index) => {
      const x = margin + 10 + (index * spacing) + spacing / 2;

      // Milestone dot
      doc.setFillColor(0, 160, 227);
      doc.circle(x, finalY + 25, 3, 'F');

      // Milestone text
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text(milestone.week, x, finalY + 35, { align: 'center' });

      doc.setFont(undefined, 'normal');
      doc.text(milestone.task, x, finalY + 40, { align: 'center' });
    });

    // Footer with contact
    doc.setTextColor(102, 102, 102);
    doc.setFontSize(10);
    doc.text('For technical inquiries: tech@gennoor.com | +91 9326352241', pageWidth / 2, pageHeight - 15, { align: 'center' });

    return doc;
  }

  generateBusinessPDF(leadData) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;

    // ========== PAGE 1: BUSINESS-FOCUSED COVER ==========
    // Professional gradient background
    this.addProfessionalBackground(doc, '#00A0E3', '#0066CC');

    // Add logo
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', margin, 20, 80, 27);
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.setFont(undefined, 'bold');
      doc.text('Gennoor Tech', margin, 35);
    }

    // Tagline
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Your AI Transformation Partner', margin, 55);

    // Main title
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    doc.text('Transform Your Business', pageWidth / 2, 110, { align: 'center' });

    doc.setFontSize(24);
    doc.setFont(undefined, 'normal');
    doc.text('with AI-Powered Solutions', pageWidth / 2, 125, { align: 'center' });

    // Personalized for company
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 145, pageWidth - 2 * margin, 40, 5, 5, 'FD');

    doc.setTextColor(0, 102, 204);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`Customized for: ${leadData.company}`, pageWidth / 2, 160, { align: 'center' });

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Attention: ${leadData.name}, ${leadData.designation}`, pageWidth / 2, 172, { align: 'center' });

    // Value proposition
    doc.setFillColor(255, 255, 255);
    doc.setGState(doc.GState({ opacity: 0.95 }));
    doc.roundedRect(margin, 200, pageWidth - 2 * margin, 70, 5, 5, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));

    doc.setTextColor(0, 61, 122);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Why Partner with Gennoor?', margin + 10, 215);

    const valueProps = [
      '★ 40% Average Cost Reduction in Operations',
      '★ 3x Productivity Improvement',
      '★ ROI Within 6 Months',
      '★ 24/7 Expert Support',
      '★ 100% Client Success Rate'
    ];

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    let yPos = 230;
    valueProps.forEach(item => {
      doc.text(item, margin + 10, yPos);
      yPos += 8;
    });

    // CTA button visual
    doc.setFillColor(0, 200, 83);
    doc.roundedRect(pageWidth / 2 - 40, 275, 80, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Schedule Your Demo', pageWidth / 2, 283, { align: 'center' });

    // Footer
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('© 2024 Gennoor Tech | Transforming Businesses', pageWidth / 2, pageHeight - 15, { align: 'center' });

    // ========== PAGE 2: ROI & SUCCESS STORIES ==========
    doc.addPage();

    // Clean background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header with logo
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', margin, 10, 60, 20);
    }

    // Page title
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Your Return on Investment', margin, 50);

    // ROI visualization
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, 60, pageWidth - 2 * margin, 60, 3, 3, 'F');

    // Draw ROI chart
    this.drawROIChart(doc, margin + 10, 70, pageWidth - 2 * margin - 20);

    // Success stories section
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Client Success Stories', margin, 140);

    const stories = [
      {
        industry: '🏭 Manufacturing',
        result: '45% reduction in defects',
        detail: 'AI-powered quality control system'
      },
      {
        industry: '🏥 Healthcare',
        result: '30% faster diagnosis',
        detail: 'ML-enhanced medical imaging'
      },
      {
        industry: '🏦 Banking',
        result: '60% fraud reduction',
        detail: 'Real-time AI monitoring system'
      },
      {
        industry: '🛒 Retail',
        result: '35% sales increase',
        detail: 'Personalized recommendation engine'
      }
    ];

    let storyY = 150;
    stories.forEach(story => {
      // Story box
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(margin, storyY, pageWidth - 2 * margin, 22, 2, 2, 'F');

      doc.setTextColor(0, 102, 204);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(story.industry, margin + 5, storyY + 8);

      doc.setTextColor(0, 200, 83);
      doc.text(story.result, margin + 50, storyY + 8);

      doc.setTextColor(102, 102, 102);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(story.detail, margin + 5, storyY + 16);

      storyY += 25;
    });

    // Next steps section
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Your Journey Starts Here', margin, storyY + 10);

    // Steps
    const steps = [
      '1. Schedule a Discovery Call',
      '2. Receive Custom Proposal',
      '3. Start Pilot Project',
      '4. Scale Across Organization'
    ];

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');

    let stepY = storyY + 20;
    steps.forEach(step => {
      doc.text(step, margin + 10, stepY);
      stepY += 7;
    });

    // Contact section
    doc.setFillColor(0, 102, 204);
    doc.roundedRect(margin, pageHeight - 45, pageWidth - 2 * margin, 25, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Ready to Transform?', pageWidth / 2, pageHeight - 35, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('📧 contact@gennoor.com  |  📞 +91 9326352241  |  🌐 www.gennoor.com', pageWidth / 2, pageHeight - 27, { align: 'center' });

    return doc;
  }

  drawArchitectureDiagram(doc, x, y, width) {
    const boxHeight = 20;
    const boxWidth = width / 3 - 10;

    // Frontend layer
    doc.setFillColor(224, 242, 254);
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'F');
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(10);
    doc.text('Frontend', x + boxWidth / 2, y + 8, { align: 'center' });
    doc.setFontSize(8);
    doc.text('React + Next.js', x + boxWidth / 2, y + 14, { align: 'center' });

    // API layer
    doc.setFillColor(237, 233, 254);
    doc.roundedRect(x + boxWidth + 10, y, boxWidth, boxHeight, 2, 2, 'F');
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(10);
    doc.text('API Gateway', x + boxWidth + 10 + boxWidth / 2, y + 8, { align: 'center' });
    doc.setFontSize(8);
    doc.text('Azure APIM', x + boxWidth + 10 + boxWidth / 2, y + 14, { align: 'center' });

    // Backend layer
    doc.setFillColor(219, 234, 254);
    doc.roundedRect(x + (boxWidth + 10) * 2, y, boxWidth, boxHeight, 2, 2, 'F');
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(10);
    doc.text('Backend', x + (boxWidth + 10) * 2 + boxWidth / 2, y + 8, { align: 'center' });
    doc.setFontSize(8);
    doc.text('.NET + Node.js', x + (boxWidth + 10) * 2 + boxWidth / 2, y + 14, { align: 'center' });

    // Data layer
    y += 30;

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'F');
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(10);
    doc.text('Database', x + boxWidth / 2, y + 8, { align: 'center' });
    doc.setFontSize(8);
    doc.text('Azure SQL', x + boxWidth / 2, y + 14, { align: 'center' });

    doc.setFillColor(254, 226, 226);
    doc.roundedRect(x + boxWidth + 10, y, boxWidth, boxHeight, 2, 2, 'F');
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(10);
    doc.text('Storage', x + boxWidth + 10 + boxWidth / 2, y + 8, { align: 'center' });
    doc.setFontSize(8);
    doc.text('Blob Storage', x + boxWidth + 10 + boxWidth / 2, y + 14, { align: 'center' });

    doc.setFillColor(233, 213, 255);
    doc.roundedRect(x + (boxWidth + 10) * 2, y, boxWidth, boxHeight, 2, 2, 'F');
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(10);
    doc.text('AI Services', x + (boxWidth + 10) * 2 + boxWidth / 2, y + 8, { align: 'center' });
    doc.setFontSize(8);
    doc.text('Azure OpenAI', x + (boxWidth + 10) * 2 + boxWidth / 2, y + 14, { align: 'center' });

    // Connection arrows
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(1);

    // Horizontal connections
    doc.line(x + boxWidth, y - 20, x + boxWidth + 10, y - 20);
    doc.line(x + (boxWidth + 10) * 2 - 10, y - 20, x + (boxWidth + 10) * 2, y - 20);

    // Vertical connections
    doc.line(x + boxWidth / 2, y - 10, x + boxWidth / 2, y);
    doc.line(x + boxWidth + 10 + boxWidth / 2, y - 10, x + boxWidth + 10 + boxWidth / 2, y);
    doc.line(x + (boxWidth + 10) * 2 + boxWidth / 2, y - 10, x + (boxWidth + 10) * 2 + boxWidth / 2, y);
  }

  drawROIChart(doc, x, y, width) {
    const barWidth = 30;
    const maxHeight = 35;
    const data = [
      { label: 'Year 1', value: 150, color: [0, 200, 83] },
      { label: 'Year 2', value: 280, color: [0, 102, 204] },
      { label: 'Year 3', value: 420, color: [0, 160, 227] }
    ];

    let xPos = x + 20;

    data.forEach(item => {
      const barHeight = (item.value / 500) * maxHeight;

      // Bar
      doc.setFillColor(...item.color);
      doc.rect(xPos, y + maxHeight - barHeight, barWidth, barHeight, 'F');

      // Value
      doc.setTextColor(0, 61, 122);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${item.value}%`, xPos + barWidth / 2, y + maxHeight - barHeight - 5, { align: 'center' });

      // Label
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(item.label, xPos + barWidth / 2, y + maxHeight + 8, { align: 'center' });

      xPos += 50;
    });

    // ROI label
    doc.setTextColor(0, 61, 122);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('ROI Growth', x + width - 60, y + 15);
  }

  addProfessionalBackground(doc, color1, color2) {
    const pageWidth = 210;
    const pageHeight = 297;

    // Create gradient effect with rectangles
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
        ? this.generateTechnicalPDF(leadData)
        : this.generateBusinessPDF(leadData);

      const pdfOutput = doc.output('arraybuffer');
      fs.writeFileSync(outputPath, Buffer.from(pdfOutput));

      console.log(`✅ Professional PDF saved: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      throw error;
    }
  }
}

// Main execution
async function main() {
  console.log('🎨 Gennoor CRM - Professional PDF Generator V2\n');
  console.log('📁 Output: ./local-pdfs/\n');

  const generator = new ProfessionalPDFGenerator();

  // Sample lead
  const lead = {
    name: 'John Smith',
    company: 'TechCorp Solutions',
    designation: 'Chief Technology Officer',
    email: 'john@techcorp.com'
  };

  const outputDir = path.join(__dirname, 'local-pdfs');

  console.log(`📋 Generating professional PDFs for ${lead.company}...`);

  // Generate technical deck
  const techPath = path.join(outputDir, 'Gennoor_Technical_Blueprint.pdf');
  await generator.generateAndSave('technical', lead, techPath);

  // Generate business deck
  const bizPath = path.join(outputDir, 'Gennoor_Business_Proposal.pdf');
  await generator.generateAndSave('business', lead, bizPath);

  console.log('\n✨ Professional PDFs generated successfully!');
  console.log('📂 Check ./local-pdfs/ folder');
  console.log('\n🎯 Features:');
  console.log('  • Professional Gennoor branding with logo');
  console.log('  • High-quality 2-page design');
  console.log('  • Technical & Business focused versions');
  console.log('  • Clean, modern layout');
  console.log('  • Customized for each lead');
}

main().catch(console.error);