const fs = require('fs');

// Read the training-programs.ts file
let content = fs.readFileSync('src/data/training-programs.ts', 'utf8');

// Pattern to find course entries without pdfFile
const coursePattern = /htmlFile:\s*'([^']+\.html)'/g;

// Replace each htmlFile with htmlFile + pdfFile
content = content.replace(coursePattern, (match, htmlPath) => {
  // Create PDF path from HTML path
  const pdfPath = htmlPath.replace('.html', '.pdf');

  // Check if pdfFile already exists after this htmlFile
  const nextLines = content.substring(content.indexOf(match), content.indexOf(match) + 200);
  if (nextLines.includes('pdfFile:')) {
    return match; // Already has pdfFile, don't add
  }

  // Add pdfFile after htmlFile
  return `${match},\n    pdfFile: '${pdfPath}'`;
});

// Also update bootcamp entries
const bootcampPattern = /htmlFile:\s*'([^']+Bootcamp[^']+\.html)'/g;
content = content.replace(bootcampPattern, (match, htmlPath) => {
  const pdfPath = htmlPath.replace('.html', '.pdf');

  // Check if pdfFile already exists
  const nextLines = content.substring(content.indexOf(match), content.indexOf(match) + 200);
  if (nextLines.includes('pdfFile:')) {
    return match;
  }

  return `${match},\n    pdfFile: '${pdfPath}'`;
});

// Write back
fs.writeFileSync('src/data/training-programs.ts', content);

console.log('✅ Updated training-programs.ts with PDF links');

// Count how many pdfFile entries we have now
const pdfCount = (content.match(/pdfFile:/g) || []).length;
const courseCount = (content.match(/id: 'course-/g) || []).length;
const bootcampCount = (content.match(/id: 'bootcamp-/g) || []).length;

console.log(`📊 Stats:`);
console.log(`   Courses: ${courseCount}`);
console.log(`   Bootcamps: ${bootcampCount}`);
console.log(`   Total PDF links: ${pdfCount}`);
console.log(`   Expected: ${courseCount + bootcampCount}`);