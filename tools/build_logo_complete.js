const fs = require('fs');

const rawSvg = fs.readFileSync('karnataka_raw.svg', 'utf8');
const paths = rawSvg.match(/<path[^>]+>/g);
const targetPathTag = paths[1];
const dMatch = targetPathTag.match(/d="([^"]+)"/);
const karnatakaPathD = dMatch[1];

// We know the map coordinates are in [minX: 201.886, maxX: 798.114, minY: 45.4545, maxY: 954.545]
// Center is (500, 500).
// In a 500x500 logo viewBox:
// We can scale the 1000x1000 map by factor 0.36, centered at (250, 240).
// Scale = 0.36
// Map width = 596 * 0.36 = 214.5px, height = 909 * 0.36 = 327.2px.
// Translation: 250 - 500 * 0.36 = 250 - 180 = 70.
// Y translation: 240 - 500 * 0.36 = 240 - 180 = 60.

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <!-- Karnataka Flag Vertical Gradient: Top Yellow #FFD600, Bottom Red #D71920 -->
    <linearGradient id="flagSplitGrad" x1="0" y1="45" x2="0" y2="955" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFF066"/>
      <stop offset="10%" stop-color="#FFD600"/>
      <stop offset="49%" stop-color="#FFD600"/>
      <stop offset="50%" stop-color="#D71920"/>
      <stop offset="90%" stop-color="#D71920"/>
      <stop offset="100%" stop-color="#B30E14"/>
    </linearGradient>

    <!-- Warm Cream Radial Gradient for Base Disc -->
    <radialGradient id="creamBase" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="65%" stop-color="#FFF8E7"/>
      <stop offset="100%" stop-color="#FCEFD2"/>
    </radialGradient>

    <!-- Gold Accent Gradient -->
    <linearGradient id="goldRim" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFE57F"/>
      <stop offset="50%" stop-color="#FFD600"/>
      <stop offset="100%" stop-color="#D49A00"/>
    </linearGradient>

    <!-- Drop Shadows for Depth -->
    <filter id="mapElevation" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#541515" flood-opacity="0.22"/>
    </filter>

    <filter id="templeElevation" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#350A0B" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- 1. Outer Circular Base: Warm Cream with Flag Yellow & Maroon Borders -->
  <circle cx="250" cy="250" r="240" fill="url(#creamBase)"/>
  <circle cx="250" cy="250" r="240" fill="none" stroke="url(#goldRim)" stroke-width="8"/>
  <circle cx="250" cy="250" r="232" fill="none" stroke="#541515" stroke-width="2.5" stroke-dasharray="6 4" opacity="0.6"/>

  <!-- 2. Verified Accurate Geographic Karnataka Map Layer -->
  <!-- Scaled uniformly without any distortion, preserving exact survey coordinates -->
  <g transform="translate(70, 48) scale(0.36)" filter="url(#mapElevation)">
    <!-- Map Silhouette in Karnataka Flag Colors -->
    <path d="${karnatakaPathD}"
          fill="url(#flagSplitGrad)"
          stroke="#541515"
          stroke-width="5"
          stroke-linejoin="round"
          stroke-linecap="round"/>
  </g>

  <!-- 3. Traditional Karnataka Temple Motif (Hampi Virupaksha / Hoysala Shikhara) -->
  <!-- Positioned culturally at the heart of Karnataka, rendered in Dark Maroon #541515 with Gold Details -->
  <g transform="translate(250, 235)" filter="url(#templeElevation)">
    <!-- Central Temple Gopuram -->
    <!-- Top Sacred Kalasa (Finial) -->
    <circle cx="0" cy="-78" r="4" fill="#FFD600" stroke="#541515" stroke-width="1.5"/>
    <path d="M-2.5 -74 L2.5 -74 L3.5 -68 L-3.5 -68 Z" fill="#FFD600" stroke="#541515" stroke-width="1.2"/>
    <path d="M-6 -68 L6 -68 L7 -62 L-7 -62 Z" fill="#541515"/>

    <!-- Shikhara Tier 1 (Apex Tier) -->
    <path d="M-12 -62 L12 -62 L15 -52 L-15 -52 Z" fill="#541515" stroke="#FFD600" stroke-width="1.2"/>
    <circle cx="0" cy="-57" r="2.2" fill="#FFD600"/>

    <!-- Shikhara Tier 2 -->
    <path d="M-18 -52 L18 -52 L22 -40 L-22 -40 Z" fill="#541515" stroke="#FFD600" stroke-width="1.2"/>
    <path d="M-10 -46 Q 0 -50 10 -46" stroke="#FFD600" stroke-width="1.2" fill="none"/>
    <circle cx="-9" cy="-45" r="2" fill="#FFD600"/>
    <circle cx="0" cy="-45" r="2.5" fill="#FFD600"/>
    <circle cx="9" cy="-45" r="2" fill="#FFD600"/>

    <!-- Shikhara Tier 3 -->
    <path d="M-26 -40 L26 -40 L31 -26 L-31 -26 Z" fill="#541515" stroke="#FFD600" stroke-width="1.2"/>
    <circle cx="-16" cy="-33" r="2" fill="#FFD600"/>
    <circle cx="-5.5" cy="-33" r="2.2" fill="#FFD600"/>
    <circle cx="5.5" cy="-33" r="2.2" fill="#FFD600"/>
    <circle cx="16" cy="-33" r="2" fill="#FFD600"/>

    <!-- Shikhara Tier 4 (Broad Tier) -->
    <path d="M-35 -26 L35 -26 L41 -10 L-41 -10 Z" fill="#541515" stroke="#FFD600" stroke-width="1.2"/>
    <circle cx="-25" cy="-18" r="2" fill="#FFD600"/>
    <circle cx="-12" cy="-18" r="2.2" fill="#FFD600"/>
    <circle cx="0" cy="-18" r="2.6" fill="#FFD600"/>
    <circle cx="12" cy="-18" r="2.2" fill="#FFD600"/>
    <circle cx="25" cy="-18" r="2" fill="#FFD600"/>

    <!-- Temple Base / Mahadwara (Grand Entrance) -->
    <path d="M-45 -10 L45 -10 L45 22 L-45 22 Z" fill="#541515" stroke="#541515" stroke-width="1.5"/>
    <!-- Entrance Arch / Doorway -->
    <path d="M-14 22 L-14 4 Q 0 -5 14 4 L14 22 Z" fill="#FFF8E7" stroke="#FFD600" stroke-width="1.5"/>
    <circle cx="0" cy="5" r="3" fill="#D71920"/>
    <!-- Pillars on flanking sides -->
    <line x1="-34" y1="-10" x2="-34" y2="22" stroke="#FFD600" stroke-width="2"/>
    <line x1="-24" y1="-10" x2="-24" y2="22" stroke="#FFD600" stroke-width="1.5"/>
    <line x1="24" y1="-10" x2="24" y2="22" stroke="#FFD600" stroke-width="1.5"/>
    <line x1="34" y1="-10" x2="34" y2="22" stroke="#FFD600" stroke-width="2"/>

    <!-- Base Plinth -->
    <rect x="-52" y="22" width="104" height="6" rx="2" fill="#D71920" stroke="#FFD600" stroke-width="1.2"/>
    <rect x="-56" y="28" width="112" height="5" rx="1.5" fill="#541515"/>
  </g>

  <!-- 4. KannadaSaathi Branding Banner Ribbon -->
  <g transform="translate(250, 410)">
    <!-- Ribbon Background Plaque -->
    <path d="M-170 -26 L170 -26 Q 185 0 170 26 L-170 26 Q -185 0 -170 -26 Z"
          fill="#541515"
          stroke="#FFD600"
          stroke-width="3"
          filter="url(#mapElevation)"/>

    <!-- Inner Ribbon Inlay -->
    <path d="M-160 -20 L160 -20 L155 20 L-155 20 Z" fill="#FFF8E7"/>

    <!-- Kannada Script Brand Title -->
    <text x="0" y="3"
          font-family="'Noto Sans Kannada', 'Segoe UI', sans-serif"
          font-weight="900"
          font-size="28"
          fill="#541515"
          text-anchor="middle"
          letter-spacing="0.04em">ಕನ್ನಡಸಾಥಿ</text>

    <!-- English Subtitle Tagline -->
    <text x="0" y="16"
          font-family="'Plus Jakarta Sans', sans-serif"
          font-weight="700"
          font-size="10"
          fill="#D71920"
          text-anchor="middle"
          letter-spacing="0.18em">KANNADASAATHI</text>

    <!-- Side Star Sparkles -->
    <polygon points="-142,-2 -139,-8 -133,-5 -136,1 -130,4 -136,7 -133,13 -139,10 -142,16 -145,10 -151,13 -148,7 -154,4 -148,1 -151,-5 -145,-8" fill="#FFD600" transform="scale(0.7) translate(-60, 0)"/>
    <polygon points="142,-2 145,-8 151,-5 148,1 154,4 148,7 151,13 145,10 142,16 139,10 133,13 136,7 130,4 136,1 133,-5 139,-8" fill="#FFD600" transform="scale(0.7) translate(60, 0)"/>
  </g>
</svg>`;

fs.writeFileSync('client/public/logo.svg', logoSvg);
console.log('Saved client/public/logo.svg successfully!');

// Generate responsive favicon.svg (crisp at small 16x16 / 32x32 / 64x64 sizes)
// Showing the authentic state boundary with temple gopuram
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <defs>
    <linearGradient id="favFlagGrad" x1="0" y1="45" x2="0" y2="955" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFD600"/>
      <stop offset="48%" stop-color="#FFD600"/>
      <stop offset="50%" stop-color="#D71920"/>
      <stop offset="100%" stop-color="#D71920"/>
    </linearGradient>
  </defs>

  <!-- Cream Circular Base -->
  <circle cx="32" cy="32" r="30" fill="#FFF8E7" stroke="#FFD600" stroke-width="2.5"/>
  <circle cx="32" cy="32" r="28" fill="none" stroke="#541515" stroke-width="0.8"/>

  <!-- Accurate Karnataka Outline Map Layer -->
  <g transform="translate(8, 5) scale(0.048)">
    <path d="${karnatakaPathD}"
          fill="url(#favFlagGrad)"
          stroke="#541515"
          stroke-width="18"
          stroke-linejoin="round"/>
  </g>

  <!-- Central Temple Motif Silhouette in Maroon & Gold -->
  <g transform="translate(32, 33) scale(0.38)">
    <!-- Kalasa -->
    <circle cx="0" cy="-35" r="3" fill="#FFD600" stroke="#541515" stroke-width="1"/>
    <!-- Tiers -->
    <polygon points="-6,-30 6,-30 8,-22 -8,-22" fill="#541515"/>
    <polygon points="-11,-22 11,-22 14,-12 -14,-12" fill="#541515" stroke="#FFD600" stroke-width="1"/>
    <polygon points="-17,-12 17,-12 21,-2 -21,-2" fill="#541515"/>
    <!-- Base & Arch -->
    <rect x="-24" y="-2" width="48" height="24" fill="#541515"/>
    <path d="M-8 22 L-8 6 Q 0 0 8 6 L8 22 Z" fill="#FFF8E7"/>
    <circle cx="0" cy="7" r="2.5" fill="#D71920"/>
  </g>
</svg>`;

fs.writeFileSync('client/public/favicon.svg', faviconSvg);
console.log('Saved client/public/favicon.svg successfully!');
