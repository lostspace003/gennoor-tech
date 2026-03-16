const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/data/training-programs.ts', 'utf8');

// For each training program, keep only the first pdfFile entry
const programs = content.split(/(?=\s*{\s*id:\s*'(?:course|bootcamp)-)/);

const fixed = programs.map(program => {
  if (!program.trim()) return program;

  // Find all pdfFile lines in this program
  const pdfMatches = program.match(/^\s*pdfFile:.*$/gm);

  if (pdfMatches && pdfMatches.length > 1) {
    // Keep only the first pdfFile, remove others
    let firstFound = false;
    const lines = program.split('\n');
    const filtered = lines.filter(line => {
      if (line.includes('pdfFile:')) {
        if (!firstFound) {
          firstFound = true;
          return true;
        }
        return false; // Skip duplicate
      }
      return true;
    });
    return filtered.join('\n');
  }

  return program;
});

content = fixed.join('');

// Write back
fs.writeFileSync('src/data/training-programs.ts', content);

console.log('✅ Fixed duplicate pdfFile entries');

// Count final stats
const pdfCount = (content.match(/pdfFile:/g) || []).length;
const courseCount = (content.match(/id: 'course-/g) || []).length;
const bootcampCount = (content.match(/id: 'bootcamp-/g) || []).length;

console.log(`📊 Final Stats:`);
console.log(`   Courses: ${courseCount}`);
console.log(`   Bootcamps: ${bootcampCount}`);
console.log(`   Total PDF links: ${pdfCount}`);

if (pdfCount === courseCount + bootcampCount) {
  console.log(`   ✅ Perfect! Each program has exactly one PDF link`);
} else {
  console.log(`   ⚠️ Mismatch: Expected ${courseCount + bootcampCount} but found ${pdfCount}`);
}