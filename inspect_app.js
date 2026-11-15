const fs = require('fs');
const html = fs.readFileSync('c:/Users/Usuario/Documents/MINEAPPs/FRONTE.html', 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)][1][1];

// Let's find the JSX-like structure or react elements rendered in the root component
// We know from earlier: qd.createRoot(document.getElementById("root")).render(c(Xd.default.StrictMode,{children:c(Yu,{})}));
// So Yu is the main App component!
// Let's find the definition of Yu in script
const yuPos = script.lastIndexOf('function Yu(');
console.log('Yu function pos:', yuPos);
if (yuPos !== -1) {
  console.log(script.slice(yuPos, yuPos + 4000));
} else {
  // search regex
  const m = script.match(/function ([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*\{[^}]*createRoot/);
  console.log('Root match:', m);
  // Let's find where Yu is defined
  const idx = script.indexOf('Yu=');
  console.log('Yu= pos:', idx);
  // Or let's search for "Yu("
  const matchYu = script.match(/(?:function\s+Yu|var\s+Yu\s*=|const\s+Yu\s*=)/);
  console.log('matchYu:', matchYu);
}
