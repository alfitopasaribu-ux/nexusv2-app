// Script untuk menghapus field "lieScore" dari semua file kasus
const fs = require('fs');
const path = require('path');

const casesDir = path.join(__dirname, 'cases');

// Get all case files
const files = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));

let totalRemoved = 0;

files.forEach(file => {
  const filePath = path.join(casesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let removed = 0;
  
  // Remove lieScore from suspects
  if (data.suspects && Array.isArray(data.suspects)) {
    data.suspects.forEach(suspect => {
      if (suspect.lieScore !== undefined) {
        delete suspect.lieScore;
        removed++;
      }
    });
  }
  
  if (removed > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    totalRemoved += removed;
    console.log(`✓ ${file}: menghapus ${removed} lieScore`);
  }
});

console.log(`\n✅ Total lieScore yang dihapus: ${totalRemoved} dari ${files.length} file`);

