const fs = require('fs');

// Read the training-programs.ts file
let content = fs.readFileSync('src/data/training-programs.ts', 'utf8');

// Add timestamp as query parameter to force cache refresh
const timestamp = Date.now();

// Update HTML file references with cache busting parameter
content = content.replace(/htmlFile:\s*'([^']+\.html)'/g, (match, path) => {
  return `htmlFile: '${path}?v=${timestamp}'`;
});

// Write back
fs.writeFileSync('src/data/training-programs.ts', content);

console.log(`✅ Added cache-busting parameter to all HTML files`);
console.log(`   Timestamp: ${timestamp}`);
console.log(`   Now all HTML files will load fresh content`);
console.log('\n💡 Browser will be forced to load new content!');