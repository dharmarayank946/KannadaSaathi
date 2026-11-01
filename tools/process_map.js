const fs = require('fs');
const content = fs.readFileSync('karnataka_raw.svg', 'utf8');
const paths = content.match(/<path[^>]+>/g);
const targetPathTag = paths[1];
const dMatch = targetPathTag.match(/d="([^"]+)"/);
const d = dMatch[1];

const numbers = d.replace(/[A-Za-z]/g, ' ').trim().split(/[\s,]+/).map(Number);
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
for (let i = 0; i < numbers.length; i += 2) {
  const x = numbers[i], y = numbers[i + 1];
  if (!isNaN(x) && !isNaN(y)) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

console.log(JSON.stringify({
  minX, maxX, minY, maxY,
  width: maxX - minX,
  height: maxY - minY,
  centerX: (minX + maxX) / 2,
  centerY: (minY + maxY) / 2
}, null, 2));
