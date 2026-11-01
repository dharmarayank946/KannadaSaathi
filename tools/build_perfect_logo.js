const fs = require('fs');
const path = require('path');
const sharp = require('../server/node_modules/sharp');

// 1. Read verified geographic boundary of Karnataka from karnataka_raw.svg
const rawSvg = fs.readFileSync(path.join(__dirname, 'karnataka_raw.svg'), 'utf8');
const paths = rawSvg.match(/<path[^>]+>/g);
const targetPathTag = paths[1];
const dMatch = targetPathTag.match(/d="([^"]+)"/);
const karnatakaPathD = dMatch[1];

// Verified Bounding Box:
// X: [201.886, 798.114] -> Width: 596.228, Centroid: 500
// Y: [45.455, 954.545]  -> Height: 909.09, Centroid: 500

// Goddess Bhuvaneshwari Vector Artwork
// Pure Yellow (#FFFF00), Pure Red (#FF0000), Pure Black (#000000), Pure White (#FFFFFF)
function getGoddessGroup() {
  return `
    <!-- ======================================================== -->
    <!-- GODDESS BHUVANESHWARI (MOTHER KARNATAKA / KANNADA MATHE) -->
    <!-- Centered, Proportionate, Traditional, Dignified          -->
    <!-- ======================================================== -->
    <g id="goddess-bhuvaneshwari">

      <!-- 1. DIVINE PRABHAVALI (RADIANT HALO) -->
      <g id="prabhavali">
        <circle cx="0" cy="-115" r="148" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
        <circle cx="0" cy="-115" r="136" fill="#FFFF00" stroke="#000000" stroke-width="3"/>
        ${Array.from({ length: 24 }).map((_, i) => {
          const angle = i * 15;
          const rad = angle * Math.PI / 180;
          return `<line x1="0" y1="-115" x2="${(Math.cos(rad) * 144).toFixed(1)}" y2="${(-115 + Math.sin(rad) * 144).toFixed(1)}" stroke="#000000" stroke-width="3"/>`;
        }).join('\n        ')}
        <circle cx="0" cy="-115" r="118" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
        <circle cx="0" cy="-115" r="102" fill="#FFFF00" stroke="#000000" stroke-width="2.5" stroke-dasharray="6 4"/>
        <circle cx="0" cy="-115" r="92" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      </g>

      <!-- 2. SACRED LOTUS THRONE (PADMA PEETHA) -->
      <g id="lotus-peetha" transform="translate(0, 240)">
        <polygon points="-160,50 160,50 180,75 -180,75" fill="#000000" stroke="#000000" stroke-width="2"/>
        <rect x="-170" y="70" width="340" height="15" rx="3" fill="#FFFF00" stroke="#000000" stroke-width="3"/>
        <rect x="-190" y="85" width="380" height="18" rx="4" fill="#FF0000" stroke="#000000" stroke-width="3.5"/>
        <rect x="-210" y="103" width="420" height="20" rx="5" fill="#000000"/>

        <!-- Lotus Petals Outer -->
        <path d="M 0 45 C -40 20, -90 10, -140 38 C -110 -5, -60 10, 0 45 Z" fill="#FF0000" stroke="#000000" stroke-width="3"/>
        <path d="M 0 45 C 40 20, 90 10, 140 38 C 110 -5, 60 10, 0 45 Z" fill="#FF0000" stroke="#000000" stroke-width="3"/>
        <path d="M 0 45 C -30 10, -60 -15, -95 10 C -70 -25, -30 -10, 0 45 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
        <path d="M 0 45 C 30 10, 60 -15, 95 10 C 70 -25, 30 -10, 0 45 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>

        <!-- Lotus Petals Center -->
        <path d="M 0 45 C -25 0, -45 -35, 0 -65 C 45 -35, 25 0, 0 45 Z" fill="#FFFF00" stroke="#000000" stroke-width="3.5"/>
        <path d="M 0 38 C -15 0, -25 -25, 0 -50 C 25 -25, 15 0, 0 38 Z" fill="#FF0000" stroke="#000000" stroke-width="2"/>
        <path d="M 0 30 C -8 5, -12 -12, 0 -35 C 12 -12, 8 5, 0 30 Z" fill="#FFFFFF"/>

        <path d="M -25 40 C -55 15, -75 -15, -45 -45 C -25 -20, -15 15, -25 40 Z" fill="#FFFF00" stroke="#000000" stroke-width="3"/>
        <path d="M 25 40 C 55 15, 75 -15, 45 -45 C 25 -20, 15 15, 25 40 Z" fill="#FFFF00" stroke="#000000" stroke-width="3"/>
        <path d="M -50 42 C -85 20, -110 -5, -80 -30 C -60 -10, -45 15, -50 42 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
        <path d="M 50 42 C 85 20, 110 -5, 80 -30 C 60 -10, 45 15, 50 42 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
      </g>

      <!-- 3. ROYAL SAREE PLEATS & LOWER DRAPERY -->
      <g id="saree-drape">
        <path d="M -80 70 C -110 130, -125 190, -110 240 L 110 240 C 125 190, 110 130, 80 70 Z"
              fill="#FF0000" stroke="#000000" stroke-width="4"/>

        <!-- Vertical Golden Zari Lines -->
        ${[-80, -55, -30, -5, 20, 45, 70].map((x, idx) => `
          <path d="M ${x * 0.7} 75 C ${x * 0.85} 130, ${x * 1.05} 190, ${x * 1.15} 235"
                fill="none" stroke="#FFFF00" stroke-width="${idx === 3 ? 6 : 4}" stroke-linecap="round"/>
          <path d="M ${x * 0.7} 75 C ${x * 0.85} 130, ${x * 1.05} 190, ${x * 1.15} 235"
                fill="none" stroke="#000000" stroke-width="1.5" stroke-dasharray="4 6"/>
        `).join('\n        ')}

        <!-- Golden Saree Hemline Border -->
        <path d="M -110 225 C -40 240, 40 240, 110 225 L 110 240 C 40 255, -40 255, -110 240 Z"
              fill="#FFFF00" stroke="#000000" stroke-width="3"/>
        ${Array.from({ length: 11 }).map((_, i) => {
          const x = -95 + i * 19;
          return `<polygon points="${x},226 ${x + 8},214 ${x + 16},226" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>`;
        }).join('\n        ')}

        <!-- Saree Pallu across shoulder -->
        <path d="M 65 -20 C 95 30, 105 100, 85 180 C 70 140, 60 70, 50 30 Z"
              fill="#FFFF00" stroke="#000000" stroke-width="3"/>
        <path d="M 85 180 C 75 200, 60 215, 45 220 C 55 195, 70 170, 85 180 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
      </g>

      <!-- 4. TORSO, BLOUSE & JEWELRY -->
      <g id="torso-jewelry">
        <path d="M -60 -10 C -65 25, -60 55, -50 75 L 50 75 C 60 55, 65 25, 60 -10 C 35 15, -35 15, -60 -10 Z"
              fill="#FF0000" stroke="#000000" stroke-width="3.5"/>

        <!-- Golden Kamarbandh / Oddiyana -->
        <rect x="-65" y="65" width="130" height="18" rx="4" fill="#FFFF00" stroke="#000000" stroke-width="3"/>
        <circle cx="0" cy="74" r="8" fill="#FF0000" stroke="#000000" stroke-width="2"/>
        <circle cx="0" cy="74" r="4" fill="#FFFFFF"/>
        <circle cx="-35" cy="74" r="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
        <circle cx="35" cy="74" r="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
        ${[-48, -24, 0, 24, 48].map(x => `
          <line x1="${x}" y1="83" x2="${x}" y2="95" stroke="#000000" stroke-width="2"/>
          <circle cx="${x}" cy="97" r="3.5" fill="#FFFF00" stroke="#000000" stroke-width="1"/>
        `).join('\n        ')}

        <!-- Grand Necklaces -->
        <path d="M -30 -22 C -15 -10, 15 -10, 30 -22" fill="none" stroke="#FFFF00" stroke-width="7"/>
        <path d="M -30 -22 C -15 -10, 15 -10, 30 -22" fill="none" stroke="#000000" stroke-width="2"/>

        <path d="M -40 -16 C -20 18, 20 18, 40 -16" fill="none" stroke="#FFFF00" stroke-width="5"/>
        <path d="M -40 -16 C -20 18, 20 18, 40 -16" fill="none" stroke="#000000" stroke-width="1.5" stroke-dasharray="3 3"/>
        ${[-25, -12, 0, 12, 25].map(x => `
          <circle cx="${x}" cy="${Math.abs(x) < 5 ? 17 : 14}" r="4" fill="#FFFF00" stroke="#000000" stroke-width="1.5"/>
          <circle cx="${x}" cy="${Math.abs(x) < 5 ? 17 : 14}" r="1.5" fill="#FF0000"/>
        `).join('\n        ')}

        <path d="M -50 -8 C -30 45, 30 45, 50 -8" fill="none" stroke="#FFFF00" stroke-width="6"/>
        <path d="M -50 -8 C -30 45, 30 45, 50 -8" fill="none" stroke="#000000" stroke-width="2"/>
        <polygon points="0,42 -14,60 0,72 14,60" fill="#FF0000" stroke="#000000" stroke-width="2"/>
        <circle cx="0" cy="57" r="5" fill="#FFFF00" stroke="#000000" stroke-width="1.5"/>
        <circle cx="0" cy="57" r="2" fill="#FFFFFF"/>
      </g>

      <!-- 5. FOUR SACRED ARMS & ATTRIBUTES -->
      <!-- Right Arm: Abhaya Mudra (Blessing & Protection) -->
      <g id="right-arm-abhaya">
        <path d="M -60 -5 C -90 10, -115 25, -120 60 C -105 65, -95 40, -55 20 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <rect x="-105" y="24" width="22" height="10" rx="3" fill="#FFFF00" stroke="#000000" stroke-width="2" transform="rotate(-30 -105 24)"/>

        <path d="M -120 60 C -135 45, -130 15, -115 -10 L -90 -5 C -105 20, -100 45, -95 65 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <rect x="-120" y="-8" width="28" height="12" rx="3" fill="#FFFF00" stroke="#000000" stroke-width="2" transform="rotate(18 -120 -8)"/>

        <g transform="translate(-112, -28)">
          <circle cx="0" cy="0" r="28" fill="#FFFF00" stroke="#000000" stroke-width="2" opacity="0.85"/>
          <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>

          <path d="M -12 18 C -16 6, -16 -8, -12 -22 C -6 -24, 0 -24, 6 -20 C 14 -12, 16 4, 12 18 Z"
                fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <path d="M -9 -22 L -9 -34 C -9 -38, -3 -38, -3 -34 L -3 -22" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
          <path d="M -3 -23 L -3 -38 C -3 -42, 3 -42, 3 -38 L 3 -23" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
          <path d="M 3 -22 L 3 -35 C 3 -39, 9 -39, 9 -35 L 9 -20" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
          <path d="M 9 -18 L 14 -28 C 17 -30, 20 -27, 18 -24 L 12 -12" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
          <path d="M -12 -5 C -18 -8, -22 -4, -18 2 L -12 8" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>

          <circle cx="0" cy="-4" r="7" fill="#FF0000" stroke="#000000" stroke-width="1.5"/>
          <circle cx="0" cy="-4" r="3" fill="#FFFF00"/>
          <circle cx="-6" cy="-33" r="3" fill="#FF0000"/>
          <circle cx="0" cy="-37" r="3" fill="#FF0000"/>
          <circle cx="6" cy="-34" r="3" fill="#FF0000"/>
          <circle cx="15" cy="-26" r="2.5" fill="#FF0000"/>
        </g>
      </g>

      <!-- Left Arm: Holding Sacred Golden Kalasha & Karnataka Flag -->
      <g id="left-arm-kalasha">
        <path d="M 60 -5 C 90 10, 115 25, 120 60 C 105 65, 95 40, 55 20 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <rect x="88" y="24" width="22" height="10" rx="3" fill="#FFFF00" stroke="#000000" stroke-width="2" transform="rotate(30 88 24)"/>

        <path d="M 120 60 C 125 75, 115 95, 90 105 L 70 85 C 90 75, 100 65, 95 50 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <rect x="76" y="85" width="24" height="10" rx="3" fill="#FFFF00" stroke="#000000" stroke-width="2" transform="rotate(-35 76 85)"/>

        <!-- Sacred Golden Kalasha -->
        <g transform="translate(100, 110)">
          <ellipse cx="0" cy="22" rx="18" ry="6" fill="#000000"/>
          <ellipse cx="0" cy="20" rx="16" ry="5" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <path d="M -16 20 C -32 10, -32 -10, -18 -22 L 18 -22 C 32 -10, 32 10, 16 20 Z"
                fill="#FFFF00" stroke="#000000" stroke-width="3.5"/>
          <ellipse cx="0" cy="-2" rx="14" ry="16" fill="#FF0000" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="-2" r="7" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
          <path d="M -18 -22 L -12 -30 L 12 -30 L 18 -22 Z" fill="#FFFF00" stroke="#000000" stroke-width="2.5"/>
          <ellipse cx="0" cy="-30" rx="14" ry="4" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>

          <!-- Mango Leaves -->
          <path d="M 0 -30 C -15 -42, -22 -55, -14 -65 C -7 -52, 0 -38, 0 -30 Z" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <path d="M 0 -30 C 15 -42, 22 -55, 14 -65 C 7 -52, 0 -38, 0 -30 Z" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <path d="M 0 -30 C -8 -45, -5 -65, 0 -75 C 5 -65, 8 -45, 0 -30 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>

          <!-- Coconut & Finial -->
          <path d="M -10 -30 C -15 -45, -10 -58, 0 -68 C 10 -58, 15 -45, 10 -30 Z"
                fill="#FF0000" stroke="#000000" stroke-width="2.5"/>
          <polygon points="0,-78 -5,-68 5,-68" fill="#FFFF00" stroke="#000000" stroke-width="1.5"/>

          <!-- Cradling hand -->
          <path d="M -22 10 C -28 5, -30 20, -18 26 L -6 24 C -14 18, -16 12, -22 10 Z"
                fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
        </g>

        <!-- Karnataka Flag on Staff -->
        <g transform="translate(145, 40)">
          <line x1="0" y1="-180" x2="0" y2="180" stroke="#000000" stroke-width="5" stroke-linecap="round"/>
          <line x1="0" y1="-180" x2="0" y2="180" stroke="#FFFF00" stroke-width="2.5" stroke-linecap="round"/>
          <polygon points="0,-195 -8,-178 8,-178" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="-176" r="4" fill="#FF0000" stroke="#000000" stroke-width="1.5"/>

          <g id="karnataka-flag-flutter" transform="translate(0, -170)">
            <path d="M 0 0 C 30 -8, 60 8, 90 0 L 90 35 C 60 43, 30 27, 0 35 Z"
                  fill="#FFFF00" stroke="#000000" stroke-width="2.5"/>
            <path d="M 0 35 C 30 27, 60 43, 90 35 L 90 70 C 60 78, 30 62, 0 70 Z"
                  fill="#FF0000" stroke="#000000" stroke-width="2.5"/>
            <line x1="90" y1="0" x2="90" y2="70" stroke="#000000" stroke-width="3"/>
            <circle cx="90" cy="0" r="2.5" fill="#FFFF00"/>
            <circle cx="90" cy="35" r="2.5" fill="#FFFF00"/>
            <circle cx="90" cy="70" r="2.5" fill="#FFFF00"/>
          </g>
        </g>
      </g>

      <!-- 6. SERENE DIVINE HEAD, FACE & ROYAL KIREETA (CROWN) -->
      <g id="head-crown">
        <!-- Cascading hair -->
        <path d="M -38 -60 C -55 -20, -58 20, -48 60 C -42 62, -38 45, -42 10 C -44 -15, -34 -45, -28 -55 Z"
              fill="#000000"/>
        <path d="M 38 -60 C 55 -20, 58 20, 48 60 C 42 62, 38 45, 42 10 C 44 -15, 34 -45, 28 -55 Z"
              fill="#000000"/>

        <!-- Neck -->
        <path d="M -22 -35 L -26 -15 C -26 -5, 26 -5, 26 -15 L 22 -35 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <line x1="-14" y1="-22" x2="14" y2="-22" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="-18" y1="-16" x2="18" y2="-16" stroke="#000000" stroke-width="1.8" stroke-linecap="round"/>
        <line x1="-12" y1="-10" x2="12" y2="-10" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Oval Face -->
        <path d="M -32 -65 C -36 -40, -32 -18, 0 -8 C 32 -18, 36 -40, 32 -65 C 24 -75, -24 -75, -32 -65 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>

        <!-- Ear Kundalas -->
        <g transform="translate(-36, -42)">
          <circle cx="0" cy="0" r="7" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="0" r="3" fill="#FF0000"/>
          <path d="M -6 7 L 6 7 L 8 18 L -8 18 Z" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="22" r="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
        </g>
        <g transform="translate(36, -42)">
          <circle cx="0" cy="0" r="7" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="0" r="3" fill="#FF0000"/>
          <path d="M -6 7 L 6 7 L 8 18 L -8 18 Z" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="22" r="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
        </g>

        <!-- Eyebrows -->
        <path d="M -24 -46 C -18 -51, -8 -49, -4 -45" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 24 -46 C 18 -51, 8 -49, 4 -45" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Sacred Kumkuma Tilaka -->
        <ellipse cx="0" cy="-48" rx="4.5" ry="5.5" fill="#FF0000" stroke="#000000" stroke-width="1.2"/>
        <circle cx="0" cy="-48" r="1.5" fill="#FFFF00"/>
        <path d="M -5 -40 C -2 -38, 2 -38, 5 -40" fill="none" stroke="#FFFF00" stroke-width="2"/>

        <!-- Eyes -->
        <path d="M -22 -40 C -15 -46, -7 -44, -3 -39 C -8 -36, -16 -36, -22 -40 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
        <circle cx="-12" cy="-40" r="3.2" fill="#000000"/>
        <circle cx="-13" cy="-41.5" r="1" fill="#FFFFFF"/>

        <path d="M 22 -40 C 15 -46, 7 -44, 3 -39 C 8 -36, 16 -36, 22 -40 Z"
              fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
        <circle cx="12" cy="-40" r="3.2" fill="#000000"/>
        <circle cx="11" cy="-41.5" r="1" fill="#FFFFFF"/>

        <!-- Nose & Pearl Ring -->
        <path d="M 0 -45 L 0 -26 C 0 -22, -4 -22, -6 -24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
        <path d="M -5 -24 C -2 -21, 2 -21, 5 -24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
        <circle cx="-5" cy="-25" r="2.2" fill="#FFFF00" stroke="#000000" stroke-width="1"/>
        <circle cx="-5" cy="-25" r="0.8" fill="#FFFFFF"/>

        <!-- Smile -->
        <path d="M -9 -16 C -4 -12, 4 -12, 9 -16" fill="none" stroke="#FF0000" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M -7 -15 C -3 -12, 3 -12, 7 -15" fill="none" stroke="#000000" stroke-width="1.2" stroke-linecap="round"/>

        <!-- Royal Kireeta (Crown) -->
        <g id="royal-crown" transform="translate(0, -65)">
          <path d="M -34 0 L 34 0 L 30 12 L -30 12 Z" fill="#FFFF00" stroke="#000000" stroke-width="3"/>
          ${[-24, -12, 0, 12, 24].map((x, i) => `
            <circle cx="${x}" cy="6" r="3" fill="${i % 2 === 0 ? '#FF0000' : '#FFFFFF'}" stroke="#000000" stroke-width="1.2"/>
          `).join('\n          ')}

          <polygon points="-38,0 38,0 32,-35 -32,-35" fill="#FFFF00" stroke="#000000" stroke-width="3.5"/>
          <path d="M -22 -15 Q 0 -25 22 -15" stroke="#FF0000" stroke-width="4" fill="none"/>
          <circle cx="0" cy="-20" r="6" fill="#FF0000" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="-20" r="2.5" fill="#FFFFFF"/>
          <circle cx="-16" cy="-16" r="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
          <circle cx="16" cy="-16" r="4" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>

          <polygon points="-28,-35 28,-35 20,-70 -20,-70" fill="#FFFF00" stroke="#000000" stroke-width="3"/>
          <polygon points="-16,-40 16,-40 12,-65 -12,-65" fill="#FF0000" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="-52" r="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5"/>
          <circle cx="0" cy="-52" r="2" fill="#FFFF00"/>

          <polygon points="-16,-70 16,-70 10,-95 -10,-95" fill="#FFFF00" stroke="#000000" stroke-width="2.5"/>
          <circle cx="0" cy="-82" r="4" fill="#FF0000" stroke="#000000" stroke-width="1.5"/>
          <circle cx="0" cy="-82" r="1.5" fill="#FFFFFF"/>

          <!-- Apex Kalasa -->
          <path d="M -8 -95 L 8 -95 L 12 -110 L -12 -110 Z" fill="#FFFF00" stroke="#000000" stroke-width="2.5"/>
          <circle cx="0" cy="-118" r="8" fill="#FFFF00" stroke="#000000" stroke-width="2.5"/>
          <circle cx="0" cy="-118" r="4" fill="#FF0000"/>
          <polygon points="0,-134 -4,-126 4,-126" fill="#FFFF00" stroke="#000000" stroke-width="2"/>
          <circle cx="0" cy="-135" r="2.5" fill="#FFFFFF" stroke="#000000" stroke-width="1"/>
        </g>
      </g>
    </g>
  `;
}

// =========================================================================
// PRIMARY BRAND LOGO: 1000 x 1000 SQUARE (1:1 Aspect Ratio)
// Features:
// 1. Karnataka Map Silhouette as Outer Shape
// 2. Upper section = Pure Yellow (#FFFF00)
// 3. Lower section = Pure Red (#FF0000)
// 4. Centered Goddess Bhuvaneshwari Artwork (undistorted)
// 5. Black (#000000) Typography: ಕನ್ನಡಸಾಥಿ & KannadaSaathi
// 6. White (#FFFFFF) Background, Zero maroon/orange/burgundy
// =========================================================================
function buildSquareBrandLogo() {
  const mapScale = 0.82;
  const mapCenterX = 500;
  const mapCenterY = 435;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <title>KannadaSaathi (ಕನ್ನಡಸಾಥಿ) Official Logo</title>
  <desc>Karnataka map silhouette with pure yellow (#FFFF00) top, pure red (#FF0000) bottom, Goddess Bhuvaneshwari centered, and black (#000000) titles.</desc>

  <defs>
    <!-- ClipPath using exact verified Karnataka boundary outline -->
    <clipPath id="karMapClip">
      <path d="${karnatakaPathD}"/>
    </clipPath>
  </defs>

  <!-- PURE WHITE BACKGROUND (#FFFFFF) -->
  <rect width="1000" height="1000" fill="#FFFFFF"/>

  <!-- ======================================================== -->
  <!-- 1. KARNATAKA STATE SILHOUETTE (OUTER SHAPE)              -->
  <!-- ======================================================== -->
  <g transform="translate(${mapCenterX}, ${mapCenterY}) scale(${mapScale}) translate(-500, -500)">
    <!-- Flag Dual Colors Clipped strictly to Karnataka Map -->
    <g clip-path="url(#karMapClip)">
      <!-- Upper Section: Pure Yellow (#FFFF00) -->
      <rect x="0" y="0" width="1000" height="500" fill="#FFFF00"/>
      <!-- Lower Section: Pure Red (#FF0000) -->
      <rect x="0" y="500" width="1000" height="500" fill="#FF0000"/>
      <!-- Flag bisection seam -->
      <line x1="0" y1="500" x2="1000" y2="500" stroke="#000000" stroke-width="4"/>
    </g>

    <!-- Centered Goddess Bhuvaneshwari Illustration (Centroid 500, 500) -->
    <g transform="translate(500, 500)">
      ${getGoddessGroup()}
    </g>

    <!-- Verified Geographic Boundary Outline (Pure Black #000000) -->
    <path d="${karnatakaPathD}"
          fill="none"
          stroke="#000000"
          stroke-width="11"
          stroke-linejoin="round"
          stroke-linecap="round"/>
  </g>

  <!-- ======================================================== -->
  <!-- 2. BRAND TITLES: STRICTLY PURE BLACK (#000000)           -->
  <!-- ======================================================== -->
  <g text-anchor="middle">
    <!-- Kannada Title: ಕನ್ನಡಸಾಥಿ -->
    <text x="500" y="875"
          font-family="'Noto Sans Kannada', 'Segoe UI', Arial, sans-serif"
          font-weight="900"
          font-size="64"
          fill="#000000"
          letter-spacing="0.02em">ಕನ್ನಡಸಾಥಿ</text>

    <!-- Decorative Clean Division Rule -->
    <g transform="translate(0, 895)">
      <line x1="330" y1="0" x2="500" y2="0" stroke="#FFFF00" stroke-width="5" stroke-linecap="round"/>
      <line x1="500" y1="0" x2="670" y2="0" stroke="#FF0000" stroke-width="5" stroke-linecap="round"/>
      <circle cx="500" cy="0" r="5" fill="#000000"/>
    </g>

    <!-- English Title: KannadaSaathi -->
    <text x="500" y="940"
          font-family="'Plus Jakarta Sans', -apple-system, Arial, sans-serif"
          font-weight="800"
          font-size="28"
          fill="#000000"
          letter-spacing="0.22em">KANNADASAATHI</text>

    <!-- Tagline: Real-Time Kannada Life Assistant -->
    <text x="500" y="975"
          font-family="'Plus Jakarta Sans', 'Noto Sans Kannada', sans-serif"
          font-weight="600"
          font-size="16"
          fill="#000000"
          letter-spacing="0.06em">ನೋಡು • ಮಾತನಾಡು • ತಿಳಿದುಕೋ • ಪರಿಹರಿಸು</text>
  </g>
</svg>`;
}

// =========================================================================
// EMBLEM ALONE (Pure Silhouette, Full 1000x1000 frame)
// =========================================================================
function buildMapEmblem() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <title>Karnataka Map Silhouette Emblem</title>
  <defs>
    <clipPath id="emblemKarClip">
      <path d="${karnatakaPathD}"/>
    </clipPath>
  </defs>

  <rect width="1000" height="1000" fill="#FFFFFF"/>

  <g clip-path="url(#emblemKarClip)">
    <rect x="0" y="0" width="1000" height="500" fill="#FFFF00"/>
    <rect x="0" y="500" width="1000" height="500" fill="#FF0000"/>
    <line x1="0" y1="500" x2="1000" y2="500" stroke="#000000" stroke-width="4"/>
  </g>

  <g transform="translate(500, 500)">
    ${getGoddessGroup()}
  </g>

  <path d="${karnatakaPathD}"
        fill="none"
        stroke="#000000"
        stroke-width="10"
        stroke-linejoin="round"
        stroke-linecap="round"/>
</svg>`;
}

// =========================================================================
// SIMPLIFIED FAVICON (64 x 64)
// High clarity at 16x16 and 32x32 pixels
// =========================================================================
function buildFavicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <title>KannadaSaathi Favicon</title>
  <defs>
    <clipPath id="favKarOutline">
      <path d="${karnatakaPathD}"/>
    </clipPath>
  </defs>

  <!-- Pure White Background -->
  <rect width="64" height="64" fill="#FFFFFF"/>

  <!-- Centered Scaled Karnataka Map Silhouette -->
  <g transform="translate(32, 32) scale(0.062) translate(-500, -500)">
    <g clip-path="url(#favKarOutline)">
      <!-- Pure Yellow Top -->
      <rect x="0" y="0" width="1000" height="500" fill="#FFFF00"/>
      <!-- Pure Red Bottom -->
      <rect x="0" y="500" width="1000" height="500" fill="#FF0000"/>
      <line x1="0" y1="500" x2="1000" y2="500" stroke="#000000" stroke-width="14"/>
    </g>

    <!-- Bold Stylized Center Emblem: Sacred Halo, Crown & Abhaya -->
    <g transform="translate(500, 500)">
      <circle cx="0" cy="-60" r="160" fill="#FFFFFF" stroke="#000000" stroke-width="24"/>
      <circle cx="0" cy="-60" r="130" fill="#FFFF00" stroke="#000000" stroke-width="16"/>

      <ellipse cx="0" cy="220" rx="220" ry="80" fill="#FFFFFF" stroke="#000000" stroke-width="24"/>
      <ellipse cx="0" cy="220" rx="180" ry="60" fill="#FF0000" stroke="#000000" stroke-width="16"/>

      <polygon points="-120,-40 120,-40 90,-160 -90,-160" fill="#FFFF00" stroke="#000000" stroke-width="24"/>
      <polygon points="-70,-160 70,-160 0,-250" fill="#FFFF00" stroke="#000000" stroke-width="24"/>
      <circle cx="0" cy="-90" r="35" fill="#FF0000" stroke="#000000" stroke-width="16"/>
      <circle cx="0" cy="-260" r="22" fill="#FFFFFF" stroke="#000000" stroke-width="14"/>

      <circle cx="0" cy="80" r="85" fill="#FFFFFF" stroke="#000000" stroke-width="20"/>
      <circle cx="0" cy="80" r="45" fill="#FF0000"/>
    </g>

    <!-- Verified Boundary Stroke -->
    <path d="${karnatakaPathD}"
          fill="none"
          stroke="#000000"
          stroke-width="32"
          stroke-linejoin="round"/>
  </g>
</svg>`;
}

async function run() {
  const squareLogoSvg = buildSquareBrandLogo();
  const mapEmblemSvg = buildMapEmblem();
  const favSvg = buildFavicon();

  const publicLogoDir = path.join(__dirname, '..', 'client', 'public', 'logo');
  const distLogoDir = path.join(__dirname, '..', 'client', 'dist', 'logo');
  const publicDir = path.join(__dirname, '..', 'client', 'public');
  const distDir = path.join(__dirname, '..', 'client', 'dist');

  // Write SVGs
  fs.writeFileSync(path.join(publicLogoDir, 'kannadasaathi-logo.svg'), squareLogoSvg);
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), squareLogoSvg);
  fs.writeFileSync(path.join(distLogoDir, 'kannadasaathi-logo.svg'), squareLogoSvg);
  fs.writeFileSync(path.join(distDir, 'logo.svg'), squareLogoSvg);

  fs.writeFileSync(path.join(publicLogoDir, 'karnataka-emblem.svg'), mapEmblemSvg);
  fs.writeFileSync(path.join(distLogoDir, 'karnataka-emblem.svg'), mapEmblemSvg);

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), favSvg);
  fs.writeFileSync(path.join(distDir, 'favicon.svg'), favSvg);

  console.log('✓ SVGs written successfully.');

  // Generate High-Res PNGs
  // 1. Logo 1024x1024
  await sharp(Buffer.from(squareLogoSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(publicLogoDir, 'kannadasaathi-logo.png'));
  fs.copyFileSync(path.join(publicLogoDir, 'kannadasaathi-logo.png'), path.join(distLogoDir, 'kannadasaathi-logo.png'));
  console.log('✓ Generated client/public/logo/kannadasaathi-logo.png (1024x1024)');

  // 2. Square App Icon 512x512
  await sharp(Buffer.from(squareLogoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicLogoDir, 'app-icon.png'));
  console.log('✓ Generated client/public/logo/app-icon.png (512x512)');

  // 3. Favicon 192x192
  await sharp(Buffer.from(favSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'favicon-192.png'));
  console.log('✓ Generated client/public/favicon-192.png (192x192)');
}

run().catch(console.error);
