const fs = require('fs');

const rawSvg = fs.readFileSync('karnataka_raw.svg', 'utf8');
const paths = rawSvg.match(/<path[^>]+>/g);
const targetPathTag = paths[1];
const dMatch = targetPathTag.match(/d="([^"]+)"/);
const karnatakaPathD = dMatch[1];

// Canvas: 1000 x 1000
// Outer circle: r = 470 (94% of canvas)
// Map scale = 0.585
// Map offset: translate(207, 45) -> width: ~348, height: ~532 (53.2% of canvas height)
// Center of canvas: (500, 500)

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <defs>
    <!-- Yellow to Red Outer Border Gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFD600"/>
      <stop offset="50%" stop-color="#D71920"/>
      <stop offset="100%" stop-color="#8F1118"/>
    </linearGradient>

    <!-- Warm Sunset Sky Gradient for inside Karnataka Map -->
    <linearGradient id="sunsetSky" x1="500" y1="50" x2="500" y2="950" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#8F1118"/>
      <stop offset="25%" stop-color="#D71920"/>
      <stop offset="50%" stop-color="#FF6B00"/>
      <stop offset="75%" stop-color="#FFB300"/>
      <stop offset="100%" stop-color="#FFD600"/>
    </linearGradient>

    <!-- Sun Glow Gradient -->
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="40%" stop-color="#FFF3B0"/>
      <stop offset="75%" stop-color="#FFD600"/>
      <stop offset="100%" stop-color="#FFD600" stop-opacity="0"/>
    </radialGradient>

    <!-- Ribbon Gradient: Yellow to Primary Red to Deep Red -->
    <linearGradient id="ribbonGradYellow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF380"/>
      <stop offset="50%" stop-color="#FFD600"/>
      <stop offset="100%" stop-color="#F5A800"/>
    </linearGradient>

    <linearGradient id="ribbonGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E82C33"/>
      <stop offset="60%" stop-color="#D71920"/>
      <stop offset="100%" stop-color="#8F1118"/>
    </linearGradient>

    <!-- Soft Drop Shadows -->
    <filter id="shadowMap" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#401313" flood-opacity="0.22"/>
    </filter>

    <filter id="shadowRibbon" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#401313" flood-opacity="0.28"/>
    </filter>

    <!-- Official Verified Geographic Outline of Karnataka as Clipping Mask -->
    <clipPath id="karnatakaClip">
      <path d="${karnatakaPathD}"/>
    </clipPath>
  </defs>

  <!-- ========================================== -->
  <!-- LAYER 1: Warm Cream Circular Background    -->
  <!-- ========================================== -->
  <circle cx="500" cy="500" r="470" fill="#FFF8E7"/>

  <!-- ========================================== -->
  <!-- LAYER 2: Thin Outer Yellow-to-Red Border   -->
  <!-- ========================================== -->
  <circle cx="500" cy="500" r="470" fill="none" stroke="url(#borderGrad)" stroke-width="8"/>
  <circle cx="500" cy="500" r="460" fill="none" stroke="#D71920" stroke-width="1.5" stroke-opacity="0.3"/>

  <!-- Subtle concentric decorative ring in safe area -->
  <circle cx="500" cy="500" r="446" fill="none" stroke="#FFD600" stroke-width="1" stroke-dasharray="4 6" opacity="0.6"/>

  <!-- ============================================================== -->
  <!-- LAYER 3 & 4: Karnataka State Outline with Sunset & Temple      -->
  <!-- Centered in upper-middle area (54% height of canvas)            -->
  <!-- ============================================================== -->
  <g transform="translate(207, 45) scale(0.585)" filter="url(#shadowMap)">

    <!-- CLIPPED CONTENT (Layer 4): Sunset & Temple strictly inside map -->
    <g clip-path="url(#karnatakaClip)">
      <!-- 4a. Karnataka-inspired Sunset Sky -->
      <rect x="0" y="0" width="1000" height="1000" fill="url(#sunsetSky)"/>

      <!-- 4b. Radiant Golden Sun setting in the Deccan landscape -->
      <circle cx="500" cy="460" r="140" fill="url(#sunGlow)"/>
      <circle cx="500" cy="460" r="65" fill="#FFFFFF" opacity="0.9"/>

      <!-- 4c. Hampi Boulders / Deccan Plateau Ridges in silhouette -->
      <path d="M150 720 Q 280 640 400 680 Q 520 730 650 670 Q 760 620 860 690 L 860 1000 L 150 1000 Z" fill="#7A151A" opacity="0.85"/>
      <path d="M180 770 Q 320 710 460 740 Q 600 780 720 730 Q 810 690 850 740 L 850 1000 L 180 1000 Z" fill="#541014"/>

      <!-- 4d. Karnataka Temple Motif (Hampi Virupaksha / Hoysala Shikhara) -->
      <!-- Centered within the silhouette, rising majestically against the sunset -->
      <g transform="translate(500, 520)">
        <!-- Sacred Kalasa (Finial) -->
        <circle cx="0" cy="-142" r="7" fill="#FFD600"/>
        <path d="M -4 -135 L 4 -135 L 6 -122 L -6 -122 Z" fill="#FFD600"/>
        
        <!-- Shikhara Tier 1 (Apex) -->
        <path d="M -16 -122 L 16 -122 L 20 -102 L -20 -102 Z" fill="#401313"/>
        <circle cx="0" cy="-112" r="4" fill="#FFD600"/>

        <!-- Shikhara Tier 2 -->
        <path d="M -28 -102 L 28 -102 L 34 -78 L -34 -78 Z" fill="#401313"/>
        <path d="M -18 -88 Q 0 -96 18 -88" stroke="#FFD600" stroke-width="2.5" fill="none"/>
        <circle cx="-14" cy="-88" r="3.5" fill="#FFD600"/>
        <circle cx="0" cy="-88" r="4.5" fill="#FFD600"/>
        <circle cx="14" cy="-88" r="3.5" fill="#FFD600"/>

        <!-- Shikhara Tier 3 -->
        <path d="M -42 -78 L 42 -78 L 50 -50 L -50 -50 Z" fill="#401313"/>
        <path d="M -30 -62 Q 0 -72 30 -62" stroke="#FFD600" stroke-width="2.5" fill="none"/>
        <circle cx="-25" cy="-62" r="3.5" fill="#FFD600"/>
        <circle cx="-8" cy="-62" r="4" fill="#FFD600"/>
        <circle cx="8" cy="-62" r="4" fill="#FFD600"/>
        <circle cx="25" cy="-62" r="3.5" fill="#FFD600"/>

        <!-- Shikhara Tier 4 (Broad Tier) -->
        <path d="M -58 -50 L 58 -50 L 68 -16 L -68 -16 Z" fill="#401313"/>
        <circle cx="-42" cy="-32" r="3.5" fill="#FFD600"/>
        <circle cx="-21" cy="-32" r="4" fill="#FFD600"/>
        <circle cx="0" cy="-32" r="5" fill="#FFD600"/>
        <circle cx="21" cy="-32" r="4" fill="#FFD600"/>
        <circle cx="42" cy="-32" r="3.5" fill="#FFD600"/>

        <!-- Temple Mandapa Base & Grand Entrance (Mahadwara) -->
        <path d="M -78 -16 L 78 -16 L 78 50 L -78 50 Z" fill="#401313"/>
        
        <!-- Entrance Archway illuminated with temple warmth -->
        <path d="M -24 50 L -24 16 Q 0 -2 24 16 L 24 50 Z" fill="#FFD600"/>
        <path d="M -16 50 L -16 24 Q 0 10 16 24 L 16 50 Z" fill="#D71920"/>

        <!-- Pillars flanking the entrance -->
        <line x1="-58" y1="-16" x2="-58" y2="50" stroke="#FFD600" stroke-width="3"/>
        <line x1="-42" y1="-16" x2="-42" y2="50" stroke="#FFD600" stroke-width="2.5"/>
        <line x1="42" y1="-16" x2="42" y2="50" stroke="#FFD600" stroke-width="2.5"/>
        <line x1="58" y1="-16" x2="58" y2="50" stroke="#FFD600" stroke-width="3"/>

        <!-- Plinth Basements -->
        <rect x="-90" y="50" width="180" height="12" rx="3" fill="#D71920" stroke="#FFD600" stroke-width="1.5"/>
        <rect x="-100" y="62" width="200" height="10" rx="2" fill="#401313"/>
      </g>
    </g>

    <!-- LAYER 3 (Border): Verified Geographic Boundary Contour Outline -->
    <!-- Crisp boundary drawn independently on top of the clipped landscape -->
    <path d="${karnatakaPathD}"
          fill="none"
          stroke="#D71920"
          stroke-width="5"
          stroke-linejoin="round"
          stroke-linecap="round"/>
    <path d="${karnatakaPathD}"
          fill="none"
          stroke="#401313"
          stroke-width="2"
          stroke-linejoin="round"
          opacity="0.8"/>
  </g>

  <!-- ========================================================================= -->
  <!-- LAYER 5: Flowing Yellow-and-Red Ribbon Accent                             -->
  <!-- Positioned to the left and curving beneath the state silhouette           -->
  <!-- Strictly does NOT obscure or distort the map boundary                      -->
  <!-- ========================================================================= -->
  <g filter="url(#shadowRibbon)">
    <!-- Red lower ribbon band (sweeping under map) -->
    <path d="M 125 560
             C 110 610, 150 645, 230 655
             C 320 665, 450 645, 540 655
             C 610 662, 650 685, 690 710
             C 645 690, 580 675, 520 670
             C 410 660, 290 680, 200 665
             C 140 655, 100 620, 115 570
             Z"
          fill="url(#ribbonGradRed)"/>

    <!-- Yellow upper ribbon band (flowing seamlessly along the red) -->
    <path d="M 115 550
             C 105 595, 140 630, 215 640
             C 305 650, 435 630, 525 640
             C 595 648, 635 670, 675 695
             C 640 675, 575 660, 515 655
             C 405 645, 285 665, 195 650
             C 135 640, 95 605, 105 560
             Z"
          fill="url(#ribbonGradYellow)"/>

    <!-- Ribbon Left Folded Tail -->
    <path d="M 105 560 L 80 595 L 115 590 Z" fill="#8F1118"/>
    <path d="M 115 550 L 95 580 L 125 575 Z" fill="#FFD600"/>
  </g>

  <!-- ========================================================================= -->
  <!-- LAYER 6: Small, Tasteful Leaf Accent Near Brand Name                      -->
  <!-- Symbolizing vitality, life assistance, and growth                         -->
  <!-- ========================================================================= -->
  <g transform="translate(230, 755) rotate(-22)">
    <!-- Dual-tone leaf in Karnataka flag colors -->
    <path d="M 0 0 C -12 -18, -12 -38, 0 -50 C 12 -38, 12 -18, 0 0 Z" fill="#FFD600" stroke="#8F1118" stroke-width="2"/>
    <path d="M 0 0 C 0 -20, 4 -35, 0 -50 C -4 -35, 0 -20, 0 0 Z" fill="#D71920"/>
    <line x1="0" y1="0" x2="0" y2="-48" stroke="#401313" stroke-width="1.8"/>
    <circle cx="0" cy="-52" r="2.5" fill="#FFD600"/>
  </g>

  <!-- ========================================================================= -->
  <!-- LAYER 7 & 8: Typography Wordmarks                                         -->
  <!-- Lower third of canvas, centered, readable, high contrast                  -->
  <!-- ========================================================================= -->
  <g text-anchor="middle">
    <!-- LAYER 7: Kannada Brand Name: ಕನ್ನಡಸಾಥಿ -->
    <text x="500" y="800"
          font-family="'Noto Sans Kannada', 'Segoe UI', sans-serif"
          font-weight="900"
          font-size="64"
          fill="#401313"
          letter-spacing="0.02em">ಕನ್ನಡಸಾಥಿ</text>

    <!-- Decorative Gold Accent Underline -->
    <path d="M 350 820 L 650 820" stroke="#FFD600" stroke-width="3" stroke-linecap="round"/>
    <circle cx="500" cy="820" r="4.5" fill="#D71920"/>

    <!-- LAYER 8: English Brand Name Directly Beneath: KannadaSaathi -->
    <text x="500" y="865"
          font-family="'Plus Jakarta Sans', -apple-system, sans-serif"
          font-weight="800"
          font-size="24"
          fill="#8F1118"
          letter-spacing="0.22em">KANNADASAATHI</text>
  </g>
</svg>`;

fs.writeFileSync('client/public/logo/kannadasaathi-logo.svg', logoSvg);
// Also update the default logo.svg so all existing references load this exact SVG
fs.writeFileSync('client/public/logo.svg', logoSvg);
console.log('Saved client/public/logo/kannadasaathi-logo.svg and client/public/logo.svg');
