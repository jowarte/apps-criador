const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/Backend.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

const pos = script.indexOf('Bh=');
console.log('Bh pos:', pos);
console.log(script.slice(pos - 400, pos + 400));
