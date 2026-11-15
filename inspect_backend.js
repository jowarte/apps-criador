const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/Backend.html', 'utf8');

console.log('HTML length:', html.length);
console.log('Title:', (html.match(/<title>([^<]*)<\/title>/i) || [])[1]);

// Find scripts
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Total scripts:', scripts.length);

scripts.forEach((s, idx) => {
  console.log(`Script ${idx} len: ${s[1].length}, preview: ${s[0].slice(0, 80)}`);
});

// Search for Portuguese UI texts in script or html
const matches = html.match(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g) || [];
const ptWords = Array.from(new Set(
  matches
    .map(m => m.slice(1, -1))
    .filter(s => s.length > 4 && s.length < 60 && /[ãõáéíóúçêâô]/i.test(s))
)).slice(0, 100);

console.log('Sample PT UI strings in Backend.html:', ptWords);
