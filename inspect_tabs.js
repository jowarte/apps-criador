const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/Backend.html', 'utf8');

// Find navigation tabs / sidebar items
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

// Let's search for navigation items or state like tabs
const navMatches = script.match(/(?:dashboard|usuarios|planos|pwas|templates|anuncios|webhooks|config|financeiro|ia)/gi);
console.log('Nav occurrences count:', navMatches ? navMatches.length : 0);

// Search for sidebar menu labels
const menuLabels = [
  'Dashboard', 'Visão Geral', 'Usuários', 'Planos', 'PWAs', 'Páginas de Vendas', 
  'Templates', 'Converter', 'Anúncios', 'Financeiro', 'Faturas', 'Webhooks', 'Configurações', 'Chaves'
];

menuLabels.forEach(label => {
  const count = (script.match(new RegExp(label, 'gi')) || []).length;
  console.log(`${label}: ${count}`);
});
