import React, { memo } from 'react';

/**
 * PageAtmosphere - Premium, Multi-Layered Cultural Background Atmosphere
 *
 * Implements page-specific ambient lighting, layered gradients, flowing curves,
 * cultural patterns, and delicate floating particles for KannadaSaathi.
 *
 * Concepts:
 * - Home: Flowing silk-inspired atmosphere (Mysore silk weaves & drapery)
 * - Everyday: Subtle sound-wave patterns (Acoustic dialogues & speech waveforms)
 * - Teacher: Subtle Kannada letter-inspired decorative elements ('ಅ', 'ಆ', 'ಕ', 'ಜ್ಞ', 'ಶ್ರೀ')
 * - Stories: Warm paper-inspired textures & storybook ambient warmth
 * - Student (Speeches): Elegant audio-wave patterns & podium resonance arcs
 * - Heritage: Traditional Karnataka-inspired geometric & Hoysala / Kasuti cultural patterns
 *
 * Strictly maintains:
 * - Light theme: Cream, ivory, crimson red, warm gold, white, subtle pastels
 * - Behind all content (pointer-events: none, z-index: 0)
 * - 100% text contrast and readability preservation
 * - Smooth rendering on mobile and desktop; respects prefers-reduced-motion
 */
const PageAtmosphere = ({ currentSection = 'home' }) => {
  // Normalize section identifier
  const section = currentSection || 'home';

  return (
    <div
      className={`page-atmosphere-root atmosphere-${section}`}
      aria-hidden="true"
    >
      {/* ------------------------------------------------------------- */}
      {/* LAYER 1: Base Multi-Stop Ambient Mesh Gradients               */}
      {/* ------------------------------------------------------------- */}
      <div className="atmosphere-base-canvas" />

      {/* ------------------------------------------------------------- */}
      {/* LAYER 2: Soft Floating Ambient Glow Orbs                       */}
      {/* ------------------------------------------------------------- */}
      <div className="atmosphere-glow-orb orb-primary" />
      <div className="atmosphere-glow-orb orb-secondary" />
      <div className="atmosphere-glow-orb orb-tertiary" />

      {/* ------------------------------------------------------------- */}
      {/* LAYER 3: Page-Specific SVG Art & Cultural Motifs               */}
      {/* ------------------------------------------------------------- */}
      {section === 'home' && (
        <div className="atmosphere-specific-layer atmosphere-silk-wrap">
          {/* Flowing Mysore Silk Wave SVG */}
          <svg
            className="atmosphere-svg-full silk-svg"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="silkGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.09" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#B45309" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="silkCrimsonGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.06" />
                <stop offset="60%" stopColor="#B91C1C" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="silkSheenRibbon" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Silk Wave Ribbon 1 (Top-Right to Bottom-Left) */}
            <path
              className="silk-ribbon-path-1"
              d="M-50,180 C320,100 480,360 880,240 C1200,140 1350,320 1500,280 L1500,600 C1300,560 1150,720 780,620 C420,520 220,740 -50,680 Z"
              fill="url(#silkGoldGrad1)"
            />

            {/* Silk Wave Ribbon 2 (Crimson-Gold drape) */}
            <path
              className="silk-ribbon-path-2"
              d="M-80,480 C260,380 540,680 940,540 C1300,420 1380,640 1520,590 L1520,860 C1280,820 1020,950 680,870 C340,790 140,940 -80,890 Z"
              fill="url(#silkCrimsonGrad)"
            />

            {/* Delicate Silk Zari Accent Contours */}
            <path
              className="silk-contour-line"
              d="M-30,220 C340,140 500,400 900,280 C1220,180 1370,360 1480,320"
              stroke="url(#silkSheenRibbon)"
              strokeWidth="2"
              strokeDasharray="6 6"
              fill="none"
            />
            <path
              className="silk-contour-line-2"
              d="M-30,520 C310,420 590,720 990,580 C1350,460 1420,680 1480,630"
              stroke="url(#silkGoldGrad1)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      )}

      {section === 'everyday' && (
        <div className="atmosphere-specific-layer atmosphere-soundwave-wrap">
          {/* Conversational Soundwaves SVG */}
          <svg
            className="atmosphere-svg-full soundwave-svg"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waveGradRed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.01" />
                <stop offset="30%" stopColor="#DC2626" stopOpacity="0.08" />
                <stop offset="70%" stopColor="#B45309" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="waveGradGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.09" />
                <stop offset="80%" stopColor="#DC2626" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Ripple Soundwave 1 */}
            <path
              className="soundwave-track-1"
              d="M-20,280 Q160,210 360,280 T760,280 T1160,280 T1460,280"
              stroke="url(#waveGradRed)"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Ripple Soundwave 2 (Interleaved) */}
            <path
              className="soundwave-track-2"
              d="M-20,330 Q180,410 380,330 T780,330 T1180,330 T1460,330"
              stroke="url(#waveGradGold)"
              strokeWidth="2"
              fill="none"
            />
            {/* Dialogue Ripple Pulse 3 */}
            <path
              className="soundwave-track-3"
              d="M-20,620 Q200,560 400,620 T800,620 T1200,620 T1460,620"
              stroke="url(#waveGradRed)"
              strokeWidth="2"
              fill="none"
            />
            {/* Concentric Speech Bubble Echo Arcs (Left Margin) */}
            <circle cx="90" cy="420" r="140" stroke="#DC2626" strokeOpacity="0.04" strokeWidth="1.5" fill="none" />
            <circle cx="90" cy="420" r="210" stroke="#D4AF37" strokeOpacity="0.035" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            <circle cx="90" cy="420" r="290" stroke="#DC2626" strokeOpacity="0.025" strokeWidth="1.5" fill="none" />

            {/* Concentric Speech Bubble Echo Arcs (Right Margin) */}
            <circle cx="1350" cy="500" r="160" stroke="#D4AF37" strokeOpacity="0.04" strokeWidth="1.5" fill="none" />
            <circle cx="1350" cy="500" r="240" stroke="#DC2626" strokeOpacity="0.03" strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
          </svg>
        </div>
      )}

      {section === 'teacher' && (
        <div className="atmosphere-specific-layer atmosphere-akshara-wrap">
          {/* Subtle Kannada Script Letters & Calligraphy Elements */}
          <div className="akshara-watermark akshara-a" title="ಅ">ಅ</div>
          <div className="akshara-watermark akshara-aa" title="ಆ">ಆ</div>
          <div className="akshara-watermark akshara-ka" title="ಕ">ಕ</div>
          <div className="akshara-watermark akshara-jna" title="ಜ್ಞ">ಜ್ಞ</div>
          <div className="akshara-watermark akshara-shree" title="ಶ್ರೀ">ಶ್ರೀ</div>

          {/* Akshara Flow Curves SVG */}
          <svg
            className="atmosphere-svg-full akshara-svg"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="1180" cy="220" r="180" stroke="#D4AF37" strokeOpacity="0.05" strokeWidth="2" strokeDasharray="8 6" fill="none" />
            <circle cx="1180" cy="220" r="120" stroke="#DC2626" strokeOpacity="0.04" strokeWidth="1.5" fill="none" />
            <circle cx="160" cy="680" r="220" stroke="#D4AF37" strokeOpacity="0.045" strokeWidth="2" strokeDasharray="10 8" fill="none" />
            <path
              d="M100,200 C300,120 450,260 700,180"
              stroke="#D4AF37"
              strokeOpacity="0.05"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      )}

      {section === 'stories' && (
        <div className="atmosphere-specific-layer atmosphere-parchment-wrap">
          {/* Warm Paper / Storybook Texture SVG & Candlelit Aura */}
          <div className="parchment-top-glow" />
          <svg
            className="atmosphere-svg-full parchment-svg"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="storyBookAura" cx="50%" cy="20%" r="65%">
                <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#FFFDF7" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Storybook Golden Aura */}
            <rect x="0" y="0" width="1440" height="900" fill="url(#storyBookAura)" />

            {/* Subtle Deckle Story Wave Edges */}
            <path
              d="M0,80 Q360,50 720,85 T1440,75"
              stroke="#B45309"
              strokeOpacity="0.06"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M0,820 Q360,845 720,815 T1440,830"
              stroke="#B45309"
              strokeOpacity="0.06"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Classical Story Scroll Watermark in Corner */}
            <circle cx="1320" cy="740" r="160" stroke="#B45309" strokeOpacity="0.04" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
            <circle cx="120" cy="240" r="130" stroke="#D4AF37" strokeOpacity="0.045" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      )}

      {section === 'student' && (
        <div className="atmosphere-specific-layer atmosphere-speech-wrap">
          {/* Speeches & Oratory Audio-Wave / Podium Resonance SVG */}
          <svg
            className="atmosphere-svg-full speech-svg"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="podiumArcGold" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Acoustic Radiation Arcs from Bottom Center (Podium) */}
            <ellipse cx="720" cy="920" rx="360" ry="240" stroke="url(#podiumArcGold)" strokeWidth="2" fill="none" />
            <ellipse cx="720" cy="920" rx="540" ry="360" stroke="#D4AF37" strokeOpacity="0.05" strokeWidth="1.5" strokeDasharray="8 6" fill="none" />
            <ellipse cx="720" cy="920" rx="720" ry="480" stroke="#DC2626" strokeOpacity="0.04" strokeWidth="1.5" fill="none" />
            <ellipse cx="720" cy="920" rx="900" ry="600" stroke="#D4AF37" strokeOpacity="0.03" strokeWidth="1.5" strokeDasharray="12 8" fill="none" />

            {/* Frequency Acoustic Wave Silhouette along mid-horizon */}
            <path
              className="speech-frequency-wave"
              d="M-50,420 Q120,380 240,420 T480,420 T720,400 T960,420 T1200,420 T1490,400"
              stroke="#D4AF37"
              strokeOpacity="0.07"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      )}

      {section === 'heritage' && (
        <div className="atmosphere-specific-layer atmosphere-heritage-wrap">
          {/* Traditional Karnataka Cultural & Hoysala / Kasuti Geometric Patterns */}
          <svg
            className="atmosphere-svg-full heritage-svg"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Hoysala Star-Jali Lattice Pattern */}
              <pattern id="hoysalaJaliPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                {/* Kasuti diamond cross-stitch & Hoysala filigree */}
                <path
                  d="M30,5 L55,30 L30,55 L5,30 Z"
                  stroke="#D4AF37"
                  strokeWidth="1"
                  strokeOpacity="0.08"
                  fill="none"
                />
                <circle cx="30" cy="30" r="6" stroke="#DC2626" strokeWidth="0.8" strokeOpacity="0.07" fill="none" />
                <path
                  d="M0,0 L12,12 M60,0 L48,12 M0,60 L12,48 M60,60 L48,48"
                  stroke="#D4AF37"
                  strokeWidth="0.8"
                  strokeOpacity="0.06"
                  fill="none"
                />
              </pattern>
            </defs>

            {/* Subtle Full-Canvas Hoysala Geometric Jali Overlay */}
            <rect width="1440" height="900" fill="url(#hoysalaJaliPattern)" />

            {/* Majestic Architectural Temple Arch Silhouettes (Corners) */}
            <g opacity="0.08" transform="translate(40, 60)">
              {/* Left Heritage Arch Motif */}
              <path
                d="M0,260 L0,120 Q0,0 120,0 L160,0 Q280,0 280,120 L280,260"
                stroke="#D4AF37"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M20,260 L20,130 Q20,20 130,20 L150,20 Q260,20 260,130 L260,260"
                stroke="#DC2626"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
            </g>

            <g opacity="0.08" transform="translate(1120, 60)">
              {/* Right Heritage Arch Motif */}
              <path
                d="M0,260 L0,120 Q0,0 120,0 L160,0 Q280,0 280,120 L280,260"
                stroke="#D4AF37"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M20,260 L20,130 Q20,20 130,20 L150,20 Q260,20 260,130 L260,260"
                stroke="#DC2626"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
            </g>
          </svg>
        </div>
      )}

      {/* Fallback / General Karnataka Cultural Ambience for other sections */}
      {!['home', 'everyday', 'teacher', 'stories', 'student', 'heritage'].includes(section) && (
        <div className="atmosphere-specific-layer atmosphere-general-wrap">
          <svg
            className="atmosphere-svg-full general-svg"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="720" cy="450" r="400" stroke="#D4AF37" strokeOpacity="0.04" strokeWidth="2" strokeDasharray="10 8" fill="none" />
            <circle cx="720" cy="450" r="260" stroke="#DC2626" strokeOpacity="0.03" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* LAYER 4: Delicate Floating Golden Particles (Golden Dust)     */}
      {/* ------------------------------------------------------------- */}
      <div className="atmosphere-particles-wrap">
        <div className="floating-dust-particle p1" />
        <div className="floating-dust-particle p2" />
        <div className="floating-dust-particle p3" />
        <div className="floating-dust-particle p4" />
        <div className="floating-dust-particle p5" />
        <div className="floating-dust-particle p6" />
        <div className="floating-dust-particle p7" />
        <div className="floating-dust-particle p8" />
      </div>
    </div>
  );
};

export default memo(PageAtmosphere);

