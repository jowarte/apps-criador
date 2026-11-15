const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/Backend.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

const match = script.match(/\[\s*\{\s*id:\s*1,\s*name:\s*["']Free["']/);
console.log('Match Free:', match);
const freePos = script.indexOf('name:"Free"');
console.log('freePos:', freePos);
if (freePos !== -1) {
  console.log(script.slice(freePos - 100, freePos + 400));
}
