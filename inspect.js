const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/FRONTE.html', 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
const script = scripts[1][1];

// Find occurrences of Portuguese words and UI texts
const matches = script.match(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g) || [];
const ptWords = matches
  .map(m => m.slice(1, -1))
  .filter(s => s.length > 5 && s.length < 80 && /[ãõáéíóúçêâô]/i.test(s));

console.log('PT UI strings count:', ptWords.length);
console.log(Array.from(new Set(ptWords)).slice(0, 100));
