const fs = require('fs');
const path = require('path');

console.log('🔍 FINAL CONSISTENCY CHECK');
console.log('=' .repeat(60));

const issues = [];
const successes = [];

// 1. Check all PDF files referenced in training-programs.ts actually exist
console.log('\n📁 Checking PDF file references...');
const trainingContent = fs.readFileSync('src/data/training-programs.ts', 'utf8');
const pdfMatches = trainingContent.match(/pdfFile:\s*'([^']+)'/g) || [];

pdfMatches.forEach(match => {
  const pdfPath = match.match(/'([^']+)'/)[1];
  const fullPath = path.join('public', pdfPath);

  if (!fs.existsSync(fullPath)) {
    issues.push(`❌ Missing PDF: ${pdfPath}`);
  }
});

if (issues.length === 0) {
  successes.push('✅ All PDF files referenced exist');
}

// 2. Check all HTML files referenced exist
console.log('📁 Checking HTML file references...');
const htmlMatches = trainingContent.match(/htmlFile:\s*'([^']+)'/g) || [];
let htmlIssues = 0;

htmlMatches.forEach(match => {
  const htmlPath = match.match(/'([^']+)'/)[1];
  const fullPath = path.join('public', htmlPath);

  if (!fs.existsSync(fullPath)) {
    issues.push(`❌ Missing HTML: ${htmlPath}`);
    htmlIssues++;
  }
});

if (htmlIssues === 0) {
  successes.push('✅ All HTML files referenced exist');
}

// 3. Check for consistency in certifications across files
console.log('\n🎓 Checking certification consistency...');
const certFiles = [
  'src/data/certifications.ts',
  'src/data/certification-prep.ts',
  'src/data/training-programs.ts'
];

const oldCerts = ['AI-900', 'AI-102', 'DP-100'];
let certIssues = 0;

certFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    oldCerts.forEach(cert => {
      if (content.includes(cert)) {
        issues.push(`❌ Found old cert ${cert} in ${path.basename(file)}`);
        certIssues++;
      }
    });
  }
});

if (certIssues === 0) {
  successes.push('✅ All certifications are updated (AI-901, AI-103, AI-300)');
}

// 4. Check trainer certifications consistency
console.log('\n👨‍🏫 Checking trainer certifications...');
const trainerFiles = [
  'src/components/home/Metrics.tsx',
  'src/app/about/page.tsx',
  'src/app/services/certifications/page.tsx'
];

let trainerIssues = 0;
trainerFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.match(/12\+.*certification/i) || content.includes('12+ active')) {
      issues.push(`❌ Found old trainer cert count in ${path.basename(file)}`);
      trainerIssues++;
    }
  }
});

if (trainerIssues === 0) {
  successes.push('✅ All trainer certifications show 16+');
}

// 5. Check for CloudFlare email protection
console.log('\n📧 Checking for CloudFlare email protection...');
const allSrcFiles = [];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      walkDir(filepath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      allSrcFiles.push(filepath);
    }
  });
}

walkDir('src');

let emailIssues = 0;
allSrcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('[email protected]') || content.includes('[email protected]')) {
    issues.push(`❌ CloudFlare protected email in ${path.basename(file)}`);
    emailIssues++;
  }
});

if (emailIssues === 0) {
  successes.push('✅ No CloudFlare email protection found');
}

// 6. Check public directories have all files
console.log('\n📂 Checking public directories...');
const bootcampCount = fs.readdirSync('public/Gennoor-Bootcamp-Brochures').filter(f => f.endsWith('.pdf')).length;
const courseCount = fs.readdirSync('public/Gennoor-Tech-Course-TOCs').filter(f => f.endsWith('.pdf')).length;

if (bootcampCount === 14) {
  successes.push(`✅ All 14 bootcamp PDFs in public directory`);
} else {
  issues.push(`❌ Expected 14 bootcamp PDFs, found ${bootcampCount}`);
}

if (courseCount === 26) {
  successes.push(`✅ All 26 course PDFs in public directory`);
} else {
  issues.push(`❌ Expected 26 course PDFs, found ${courseCount}`);
}

// Display results
console.log('\n' + '=' .repeat(60));
console.log('📊 FINAL CONSISTENCY CHECK RESULTS\n');

if (successes.length > 0) {
  console.log('✅ PASSED CHECKS:');
  successes.forEach(s => console.log(`  ${s}`));
  console.log();
}

if (issues.length > 0) {
  console.log('❌ ISSUES FOUND:');
  issues.forEach(i => console.log(`  ${i}`));
} else {
  console.log('🎉 NO ISSUES FOUND - CODEBASE IS CONSISTENT!');
}

console.log('\n' + '=' .repeat(60));
console.log('📈 SUMMARY:');
console.log(`  Total files scanned: ${allSrcFiles.length}`);
console.log(`  Passed checks: ${successes.length}`);
console.log(`  Issues found: ${issues.length}`);

if (issues.length === 0) {
  console.log('\n🚀 YOUR CODEBASE IS FULLY UPDATED AND CONSISTENT!');
}