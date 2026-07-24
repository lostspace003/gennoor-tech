// Test PDF generation locally
const { PDFGenerator } = require('./src/lib/pdf-generator.ts');
const fs = require('fs');

async function testPDFGeneration() {
  console.log('🎨 Generating Professional PDFs...\n');

  const generator = new PDFGenerator();

  // Test lead data
  const testLead = {
    name: 'John Smith',
    company: 'TechCorp Solutions',
    designation: 'CEO',
    email: 'john@techcorp.com'
  };

  try {
    // Generate Technical PDF
    console.log('📘 Generating Technical Deck...');
    const technicalPDF = await generator.generateDeck('technical', testLead);
    fs.writeFileSync('technical-deck-sample.pdf', Buffer.from(await technicalPDF.arrayBuffer()));
    console.log('✅ Technical PDF saved as: technical-deck-sample.pdf');

    // Generate Non-Technical PDF
    console.log('📗 Generating Non-Technical Deck...');
    const nonTechnicalPDF = await generator.generateDeck('non-technical', testLead);
    fs.writeFileSync('non-technical-deck-sample.pdf', Buffer.from(await nonTechnicalPDF.arrayBuffer()));
    console.log('✅ Non-Technical PDF saved as: non-technical-deck-sample.pdf');

    console.log('\n✨ PDFs generated successfully!');
    console.log('📁 Check your project root for the PDF files.');

  } catch (error) {
    console.error('❌ Error generating PDFs:', error);
  }
}

testPDFGeneration();