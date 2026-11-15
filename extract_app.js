const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/FRONTE.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

// Find where the app definitions start before Yu
const startPos = script.indexOf('Meu Guia Low Carb') - 500;
const appCode = script.slice(Math.max(0, startPos));
fs.writeFileSync('c:/Users/Usuario/Documents/MINEAPPs/app_extracted.js', appCode);
console.log('Saved app_extracted.js, length:', appCode.length);
