const fs = require('fs');
const html = fs.readFileSync('Backend.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

['templates', 'ia', 'faturas', 'anuncios', 'webhooks'].forEach(tab => {
  const needle = `e==="${tab}"`;
  const idx = script.indexOf(needle);
  console.log('=== Tab:', tab, 'index:', idx);
  if (idx !== -1) {
    console.log(script.slice(idx, idx + 1000));
  }
});
