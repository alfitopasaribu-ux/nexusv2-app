// Script untuk menghapus field "isLying" dan "reliability" dari saksi
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
  
  // Remove isLying and reliability from witnesses
  if (data.witnesses && Array.isArray(data.witnesses)) {
    data.witnesses.forEach(witness => {
      if (witness.isLying !== undefined) {
        delete witness.isLying;
        removed++;
      }
      if (witness.reliability !== undefined) {
        delete witness.reliability;
        removed++;
      }
    });
  }
  
  if (removed > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    totalRemoved += removed;
    console.log(`✓ ${file}: menghapus ${removed} field (isLying & reliability)`);
  }
});

console.log(`\n✅ Total field yang dihapus: ${totalRemoved} dari ${files.length} file`);

