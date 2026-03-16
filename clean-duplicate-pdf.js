const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/data/training-programs.ts', 'utf8');

// Remove duplicate pdfFile entries
// Pattern to find duplicate pdfFile lines
const lines = content.split('\n');
const cleanedLines = [];
let lastWasPdfFile = false;

for (const line of lines) {
  if (line.includes('pdfFile:')) {
    if (!lastWasPdfFile) {
      cleanedLines.push(line);
      lastWasPdfFile = true;
    }
    // Skip duplicate pdfFile lines
  } else {
    cleanedLines.push(line);
    lastWasPdfFile = false;
  }
}

content = cleanedLines.join('\n');

// Write back
fs.writeFileSync('src/data/training-programs.ts', content);

console.log('✅ Cleaned duplicate pdfFile entries');

// Count final stats
const pdfCount = (content.match(/pdfFile:/g) || []).length;
const courseCount = (content.match(/id: 'course-/g) || []).length;
const bootcampCount = (content.match(/id: 'bootcamp-/g) || []).length;

console.log(`📊 Final Stats:`);
console.log(`   Courses: ${courseCount}`);
console.log(`   Bootcamps: ${bootcampCount}`);
console.log(`   Total PDF links: ${pdfCount}`);
console.log(`   ✅ Should be: ${courseCount + bootcampCount}`);