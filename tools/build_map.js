const fs = require('fs');

// Read raw official SVG
const rawSvg = fs.readFileSync('karnataka_raw.svg', 'utf8');
const paths = rawSvg.match(/<path[^>]+>/g);
const targetPathTag = paths[1];
const dMatch = targetPathTag.match(/d="([^"]+)"/);
const karnatakaPathD = dMatch[1];

// Generate standalone official Karnataka boundary SVG
const mapSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" fill="none">
  <defs>
    <!-- Karnataka Flag Dual Tone Gradient (Top Yellow, Bottom Red) -->
    <linearGradient id="karFlagGrad" x1="0" y1="45" x2="0" y2="955" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFD600"/>
      <stop offset="48%" stop-color="#FFD600"/>
      <stop offset="50%" stop-color="#D71920"/>
      <stop offset="100%" stop-color="#D71920"/>
    </linearGradient>
    <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#541515" flood-opacity="0.25"/>
    </filter>
  </defs>
  <!-- Official Verified Geographic Outline of Karnataka (DataMeet / Survey of India based) -->
  <path d="${karnatakaPathD}" fill="url(#karFlagGrad)" stroke="#541515" stroke-width="4" stroke-linejoin="round" filter="url(#mapShadow)"/>
</svg>`;

fs.writeFileSync('client/public/karnataka-map.svg', mapSvg);
console.log('Saved client/public/karnataka-map.svg');
