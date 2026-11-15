const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/Backend.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

// Find where navigation state is set or sidebar items
const matches = script.match(/\[\s*\{\s*id:\s*["'][^"']+["'],\s*label:\s*["'][^"']+["']/g);
console.log('Tab/Menu matches:', matches);

// Let's search for the sidebar items or array of navigation
const navArrayMatch = script.match(/(\[\s*\{[^}]*id:\s*["'](?:dashboard|usuarios|overview)[^}]*\}\s*\])/);
console.log('Nav array:', navArrayMatch ? navArrayMatch[0] : 'not found');

// Let's search for useState for current tab
const tabStateMatch = script.match(/useState\(\s*["'](?:dashboard|visao|overview|usuarios|planos)["']\s*\)/i);
console.log('tabStateMatch:', tabStateMatch ? tabStateMatch[0] : 'not found');
