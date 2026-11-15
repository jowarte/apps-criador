const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/Backend.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

// Find occurrences of users state
const userPos = script.indexOf('Camila Duarte');
console.log('User pos:', userPos);
if (userPos !== -1) {
  console.log(script.slice(userPos - 200, userPos + 600));
}

// Find occurrences of plans
const planPos = script.indexOf('Free');
console.log('Plan pos:', planPos);
if (planPos !== -1) {
  console.log(script.slice(planPos - 100, planPos + 600));
}
