const fs = require('fs');

const rawSvg = fs.readFileSync('karnataka_raw.svg', 'utf8');
const paths = rawSvg.match(/<path[^>]+>/g);
const targetPathTag = paths[1];
const dMatch = targetPathTag.match(/d="([^"]+)"/);
const karnatakaPathD = dMatch[1];

// Small favicon: 64x64 viewBox
// Clean circular disc, outer border, verified outline with flag colors and temple kalasa
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <defs>
    <linearGradient id="favBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFD600"/>
      <stop offset="60%" stop-color="#D71920"/>
      <stop offset="100%" stop-color="#8F1118"/>
    </linearGradient>

    <linearGradient id="favSky" x1="0" y1="45" x2="0" y2="955" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#8F1118"/>
      <stop offset="40%" stop-color="#D71920"/>
      <stop offset="60%" stop-color="#FF6B00"/>
      <stop offset="100%" stop-color="#FFD600"/>
    </linearGradient>

    <clipPath id="favClip">
      <path d="${karnatakaPathD}"/>
    </clipPath>
  </defs>

  <!-- 1. Cream Circular Background -->
  <circle cx="32" cy="32" r="30" fill="#FFF8E7"/>

  <!-- 2. Outer Border (Yellow-to-Red) -->
  <circle cx="32" cy="32" r="30" fill="none" stroke="url(#favBorder)" stroke-width="2.5"/>

  <!-- 3. Verified Accurate Karnataka Outline Map Layer -->
  <g transform="translate(13, 6) scale(0.063)">
    <!-- Clipped Sunset and Temple Silhouette -->
    <g clip-path="url(#favClip)">
      <rect x="0" y="0" width="1000" height="1000" fill="url(#favSky)"/>
      <circle cx="500" cy="500" r="140" fill="#FFD600" opacity="0.9"/>
      
      <!-- Temple Silhouette -->
      <g transform="translate(500, 520)">
        <circle cx="0" cy="-140" r="16" fill="#FFD600"/>
        <polygon points="-30,-120 30,-120 40,-80 -40,-80" fill="#401313"/>
        <polygon points="-55,-80 55,-80 70,-30 -70,-30" fill="#401313"/>
        <polygon points="-90,-30 90,-30 110,40 -110,40" fill="#401313"/>
        <rect x="-120" y="40" width="240" height="80" fill="#401313"/>
        <path d="-40,120 L-40,60 Q 0,40 40,60 L40,120 Z" fill="#FFD600"/>
      </g>
    </g>

    <!-- Map Boundary Outline Stroke -->
    <path d="${karnatakaPathD}"
          fill="none"
          stroke="#401313"
          stroke-width="16"
          stroke-linejoin="round"/>
  </g>

  <!-- Flowing Ribbon Curve below map in Favicon -->
  <path d="M 12 46 C 18 52, 38 52, 52 46 C 44 54, 24 55, 12 46 Z" fill="#D71920"/>
  <path d="M 14 44 C 20 49, 36 49, 50 44 C 42 51, 22 52, 14 44 Z" fill="#FFD600"/>
</svg>`;

fs.writeFileSync('client/public/favicon.svg', faviconSvg);
console.log('Saved client/public/favicon.svg');
