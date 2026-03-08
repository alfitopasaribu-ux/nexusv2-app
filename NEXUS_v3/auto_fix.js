const fs = require('fs');
const path = require('path');

const files = {
  'vercel.json': JSON.stringify({
    framework: 'vite',
    buildCommand: 'npm run build',
    outputDirectory: 'frontend/dist',
    rewrites: [{ source: '/api/(.*)', destination: '/api/$1' }]
  }, null, 2),
  
  'api/health.js': `module.exports = (req, res) => {
  const ok = !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_'));
  res.json({ status: 'NEXUS ONLINE', version: '3.0.0', aiReady: ok, model: 'llama-3.3-70b-versatile', ts: new Date().toISOString() });
};`,
  
  'api/cases/index.js': `const fs = require('fs');
const path = require('path');
module.exports = (req, res) => {
  const casesDir = path.join(__dirname, '../../cases');
  const list = [];
  for (let i = 1; i <= 50; i++) {
    const file = path.join(casesDir, \`case\${String(i).padStart(2,'0')}.json\`);
    if (fs.existsSync(file)) {
      const c = JSON.parse(fs.readFileSync(file, 'utf-8'));
      list.push({ id: i, title: c.title, difficulty: c.difficulty, type: c.type, pointReward: c.pointReward });
    }
  }
  res.json({ success: true, cases: list, total: list.length });
};`
};

Object.entries(files).forEach(([filepath, content]) => {
  const dir = path.dirname(filepath);
  if (dir !== '.' && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content);
  console.log('Created:', filepath);
});
