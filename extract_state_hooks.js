const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/Backend.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

// Search for names in the text
const ptMatches = script.match(/[a-zA-Z0-9_$]+:\s*\[\s*\{[^}]+\}\s*\]/g) || [];
console.log('Object array properties:', ptMatches.slice(0, 15));

// Search for state hooks
const stateMatches = script.match(/useState\(\s*(\[[^\]]+\])\s*\)/g) || [];
console.log('State array hooks count:', stateMatches.length);
stateMatches.slice(0, 8).forEach(s => console.log(s.slice(0, 200)));
