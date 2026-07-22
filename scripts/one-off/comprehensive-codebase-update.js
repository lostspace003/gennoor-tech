const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE CODEBASE UPDATE SCANNER');
console.log('=' .repeat(60));

// Define what we're looking for and what to replace
const replacements = {
  certifications: {
    'AI-900': 'AI-901',
    'AI-102': 'AI-103',
    'DP-100': 'AI-300'
  },
  trainerCerts: {
    '12\\+ active Microsoft certifications': '16+ active Microsoft certifications',
    '12\\+ Microsoft certifications': '16+ Microsoft certifications',
    '12 active certifications': '16+ active certifications'
  },
  platforms: {
    'Azure OpenAI Studio': 'Azure AI Foundry',
    'OpenAI Studio': 'AI Foundry'
  }
};

// Files to scan
const filesToScan = [
  'src/data/certifications.ts',
  'src/data/certification-prep.ts',
  'src/data/training-programs.ts',
  'src/data/trainers.ts',
  'src/lib/site-config.ts',
  'src/components/home/HeroSection.tsx',
  'src/components/home/Metrics.tsx',
  'src/components/home/ServicePillars.tsx',
  'src/components/home/Testimonials.tsx',
  'src/components/layout/Footer.tsx',
  'src/app/about/page.tsx',
  'src/app/about/certifications/page.tsx',
  'src/app/about/journey/page.tsx'
];

const issues = [];
const fixes = [];

// Function to scan file for issues
function scanFile(filepath) {
  if (!fs.existsSync(filepath)) {
    console.log(`  ⚠️  File not found: ${filepath}`);
    return;
  }

  let content = fs.readFileSync(filepath, 'utf8');
  const originalContent = content;
  let fileIssues = [];

  // Check for old certifications
  for (const [old, newCert] of Object.entries(replacements.certifications)) {
    const regex = new RegExp(`\\b${old}\\b`, 'g');
    const matches = content.match(regex);
    if (matches) {
      fileIssues.push(`Found ${matches.length} instances of ${old}`);
      content = content.replace(regex, newCert);
    }
  }

  // Check for old trainer cert counts
  for (const [old, newCount] of Object.entries(replacements.trainerCerts)) {
    const regex = new RegExp(old, 'gi');
    const matches = content.match(regex);
    if (matches) {
      fileIssues.push(`Found ${matches.length} instances of old trainer cert count`);
      content = content.replace(regex, newCount);
    }
  }

  // Check for old platform names
  for (const [old, newPlatform] of Object.entries(replacements.platforms)) {
    const regex = new RegExp(old, 'g');
    const matches = content.match(regex);
    if (matches) {
      fileIssues.push(`Found ${matches.length} instances of ${old}`);
      content = content.replace(regex, newPlatform);
    }
  }

  // Check for CloudFlare email protection
  const cfEmailRegex = /\[email\s+protected\]/gi;
  const cfMatches = content.match(cfEmailRegex);
  if (cfMatches) {
    fileIssues.push(`Found ${cfMatches.length} CloudFlare protected emails`);
    // Don't auto-replace emails, just flag them
  }

  // Save if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf8');
    fixes.push(`✅ Fixed: ${path.basename(filepath)}`);
    fileIssues.forEach(issue => issues.push(`  - ${issue}`));
  } else if (fileIssues.length > 0) {
    issues.push(`⚠️  ${path.basename(filepath)}: ${fileIssues.join(', ')}`);
  }
}

// Scan all files
console.log('\n📂 Scanning TypeScript/React files...');
filesToScan.forEach(file => {
  console.log(`  Checking: ${file}`);
  scanFile(file);
});

// Also check for common issues in other data files
console.log('\n📂 Scanning other data files...');

// Check if all courses/bootcamps have PDF links in training-programs.ts
const trainingContent = fs.readFileSync('src/data/training-programs.ts', 'utf8');
const pdfCount = (trainingContent.match(/pdfFile:/g) || []).length;
const expectedPrograms = 40; // 14 bootcamps + 26 courses
if (pdfCount !== expectedPrograms) {
  issues.push(`PDF links: Found ${pdfCount}, expected ${expectedPrograms}`);
}

// Check site config
console.log('  Checking: src/lib/site-config.ts');
scanFile('src/lib/site-config.ts');

// Display results
console.log('\n' + '=' .repeat(60));
console.log('📊 SCAN RESULTS\n');

if (fixes.length > 0) {
  console.log('✅ FIXED FILES:');
  fixes.forEach(fix => console.log(`  ${fix}`));
  console.log();
}

if (issues.length > 0) {
  console.log('⚠️  ISSUES FOUND:');
  issues.forEach(issue => console.log(`  ${issue}`));
} else {
  console.log('✅ No issues found!');
}

console.log('\n' + '=' .repeat(60));
console.log('✅ Codebase scan complete!');
console.log(`   Files scanned: ${filesToScan.length}`);
console.log(`   Files fixed: ${fixes.length}`);
console.log(`   Issues logged: ${issues.length}`);