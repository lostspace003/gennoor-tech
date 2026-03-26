const fs = require('fs');
const path = require('path');

// Define the certification replacements
const replacements = [
  // Old to new certification codes
  { old: 'AI-900', new: 'AI-901' },
  { old: 'AI-102', new: 'AI-103' },
  { old: 'DP-100', new: 'AI-300' },

  // Update certification names
  { old: 'Azure AI Engineer Associate', new: 'Azure AI App & Agent Developer Associate' },
  { old: 'Azure Data Scientist Associate', new: 'Machine Learning Operations (MLOps) Engineer Associate' },

  // Update trainer certification list - exact match
  {
    old: '12+ active Microsoft certifications</strong> including AB-100, AI-102, AZ-400, AZ-204, AZ-305, DP-100, PL-400, PL-200, and PL-300',
    new: '16+ active Microsoft certifications</strong> including AB-100, AB-730, AB-731, AI-103, AI-300, AZ-400, AZ-204, AZ-305, PL-400, PL-200, and PL-300'
  }
];

// Directories to process
const directories = [
  'Gennoor-Bootcamp-Brochures',
  'Gennoor-Tech-Course-TOCs'
];

function updateFile(filePath, fileType) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Apply all replacements
    replacements.forEach(({ old, new: newText }) => {
      if (content.includes(old)) {
        content = content.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
        modified = true;
        console.log(`  ✓ Replaced: ${old} → ${newText}`);
      }
    });

    // Additional specific updates for certification descriptions
    if (content.includes('AI-901')) {
      content = content.replace(
        /Azure AI Fundamentals(?!.*\(New\))/g,
        'Azure AI Fundamentals (New 2026)'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔄 Starting certification updates...\n');

let totalUpdated = 0;

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  console.log(`\n📁 Processing ${dir}:`);

  if (!fs.existsSync(dirPath)) {
    console.log(`  ⚠️ Directory not found: ${dirPath}`);
    return;
  }

  // Process HTML files
  const htmlFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
  console.log(`  Found ${htmlFiles.length} HTML files`);

  htmlFiles.forEach(file => {
    const filePath = path.join(dirPath, file);
    console.log(`\n  Processing: ${file}`);
    if (updateFile(filePath, 'html')) {
      totalUpdated++;
    }
  });
});

console.log('\n' + '='.repeat(50));
console.log(`\n✅ Update complete! ${totalUpdated} files modified.`);
console.log('\n📝 Next steps:');
console.log('1. Review the HTML files to ensure updates are correct');
console.log('2. Update corresponding DOCX files manually in Microsoft Word');
console.log('3. Convert DOCX to PDF using Word (File > Save As > PDF)');
console.log('4. Replace existing PDFs with the new versions');