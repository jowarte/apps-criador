const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/Backend.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

// Let's find arrays defined in script
const arrays = ['users', 'plans', 'apps', 'invoices', 'webhooks', 'campaigns', 'ads'];
console.log('Searching data models...');

const userSample = script.match(/\[\s*\{\s*id:\s*["'][^"']+["'],\s*name:\s*["'][^"']+["'][^\]]*\]/);
if (userSample) {
  console.log('User sample found:', userSample[0].slice(0, 500));
}

// Find mock data
const matches = script.match(/const\s+([a-zA-Z0-9_$]+)\s*=\s*(\[\s*\{[\s\S]*?\}\s*\]);/g);
if (matches) {
  console.log(`Found ${matches.length} const array declarations`);
  matches.slice(0, 10).forEach(m => console.log(m.slice(0, 120)));
}
