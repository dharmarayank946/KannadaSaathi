import React from 'react';
import {
  Landmark,
  Languages,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  Calendar,
  ExternalLink,
  Heart,
  Globe,
  Award
} from 'lucide-react';

/**
 * Restored Complete Responsive Footer for KannadaSaathi
 *
 * Requirements:
 * - KannadaSaathi logo, name, brand mission
 * - 4-column structured responsive grid (Desktop -> Tablet -> Mobile)
 * - Navigation links for all major sections
 * - Useful citizen and cultural links
 * - Live date-accurate Kannada Rajyotsava anniversary & formation tribute (1956)
 * - Copyright with dynamic current year
 * - Social, open-source & verified heritage links
 * - Strict adherence to crimson-red, gold and white theme
 */
export default function Footer({ onSelectSection, langMode = 'kn' }) {
  const isKn = langMode === 'kn';
  const currentYear = new Date().getFullYear();

  // Dynamic Rajyotsava Anniversary calculation (Nov 1, 1956)
  const rajyotsavaAnniversary = currentYear - 1956;

  const handleNav = (secId) => {
    if (typeof onSelectSection === 'function') {
      onSelectSection(secId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer" role="contentinfo" aria-label={isKn ? "ಕನ್ನಡಸಾಥಿ ಪಾದಲೇಖ (Footer)" : "KannadaSaathi Footer"}>
      <div className="footer-inner-clean">
        <div className="footer-grid-4">
          {/* COLUMN 1: Brand & Cultural Identity */}
          <div className="footer-col-brand">
            <div className="footer-logo-row">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F5A623 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                }}
              >
                ಕ
              </div>
              <div>
                <div className="footer-brand-title">
                  {isKn ? 'ಕನ್ನಡಸಾಥಿ' : 'KannadaSaathi'}
                </div>
                <div className="footer-brand-sub">
                  {isKn ? 'ಧ್ವನಿ • ಪರಂಪರೆ • ಕಲಿಕೆ' : 'Voice • Heritage • Learning'}
                </div>
              </div>
            </div>

            <div className="footer-brand-tagline">
              {isKn ? 'ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ' : 'Sirigannadam Gelge, Sirigannadam Baalge'}
            </div>

            <p className="footer-brand-desc">
              {isKn
                ? 'ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಭಾಷಾ ಕಲಿಕೆ, ನೈಜ-ಸಮಯ ಧ್ವನಿ ಸಂಭಾಷಣೆ, ಸಾಹಿತ್ಯ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಯ ಸಮಗ್ರ ಡಿಜಿಟಲ್ ವೇದಿಕೆ.'
                : 'Empowering Karnataka with real-time voice translation, interactive language lessons, authentic literature, and rich cultural heritage.'}
            </p>

            {/* State Anthem / Rajyotsava Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#FFFDF0',
                border: '1.5px solid var(--color-flag-yellow-border)',
                borderRadius: '10px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                color: '#854D0E',
                fontWeight: 700,
                marginTop: '0.5rem'
              }}
            >
              <Award size={15} color="#D97706" />
              <span>
                {isKn
                  ? `ಕರ್ನಾಟಕ ಏಕೀಕರಣ (೧೯೫೬ — ${currentYear}) • ${rajyotsavaAnniversary}ನೇ ವರ್ಷ`
                  : `Karnataka Unification (1956 — ${currentYear}) • ${rajyotsavaAnniversary}th Year`}
              </span>
            </div>
          </div>

          {/* COLUMN 2: Main Navigation Links */}
          <div>
            <h4 className="footer-col-title kn-heading" style={{ fontWeight: 800 }}>
              {isKn ? 'ಮುಖ್ಯ ವಿಭಾಗಗಳು' : 'Navigation Links'}
            </h4>
            <ul className="footer-nav-list">
              <li>
                <button type="button" onClick={() => handleNav('home')}>
                  ✦ {isKn ? 'ಮುಖಪುಟ (Home)' : 'Home'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('everyday')}>
                  ✦ {isKn ? 'ದೈನಂದಿನ ಸಂಭಾಷಣೆ (Daily Dialogues)' : 'Daily Conversations'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('teacher')}>
                  ✦ {isKn ? 'ಕನ್ನಡ ಕಲಿಕೆ — ಅಕ್ಷರ & ವ್ಯಾಕರಣ' : 'Kannada Learning'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('stories')}>
                  ✦ {isKn ? 'ಕಥಾ ಲೋಕ — ಸಚಿತ್ರ ಕಥೆಗಳು' : 'Moral Stories'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('student')}>
                  ✦ {isKn ? 'ವಿದ್ಯಾರ್ಥಿ ಭಾಷಣ ಸೃಷ್ಟಿಕರ್ತ' : 'Student Speeches'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('heritage')}>
                  ✦ {isKn ? 'ಕರ್ನಾಟಕ ಪರಂಪರೆ & ಇತಿಹಾಸ' : 'Cultural Heritage'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('profile')}>
                  ✦ {isKn ? 'ಪ್ರೊಫೈಲ್ & ಸೆಟ್ಟಿಂಗ್ಸ್' : 'Profile & Settings'}
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Useful Cultural & Citizen Resources */}
          <div>
            <h4 className="footer-col-title kn-heading" style={{ fontWeight: 800 }}>
              {isKn ? 'ಉಪಯುಕ್ತ ಸಂಪನ್ಮೂಲಗಳು' : 'Useful Resources'}
            </h4>
            <ul className="footer-nav-list">
              <li>
                <button type="button" onClick={() => handleNav('heritage')}>
                  ✦ {isKn ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ ಸಂಭ್ರಮ' : 'Kannada Rajyotsava'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('heritage')}>
                  ✦ {isKn ? 'ವಚನ ಸಾಹಿತ್ಯ & ಶರಣರ ವಚನಗಳು' : 'Vachana Literature'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('home')}>
                  ✦ {isKn ? 'ಮುಖಾಮುಖಿ ಧ್ವನಿ ಸಂಭಾಷಣೆ' : 'Face-to-Face Voice Talk'}
                </button>
              </li>
              <li>
                <a
                  href="https://karnataka.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#444444',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  ✦ {isKn ? 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಅಧಿಕೃತ ಪೋರ್ಟಲ್' : 'Karnataka State Portal'}
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://sevasindhu.karnataka.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#444444',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  ✦ {isKn ? 'ಸೇವಾ ಸಿಂಧು ನಾಗರಿಕ ಸೇವೆಗಳು' : 'Seva Sindhu Citizen Portal'}
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Community, Social & Technology */}
          <div>
            <h4 className="footer-col-title kn-heading" style={{ fontWeight: 800 }}>
              {isKn ? 'ಸಮುದಾಯ & ಸಾಮಾಜಿಕ ಸಂಪರ್ಕ' : 'Community & Social'}
            </h4>
            <div className="footer-info-card" style={{ marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', fontWeight: 700, color: 'var(--color-flag-red)', fontSize: '0.84rem' }}>
                <Sparkles size={15} />
                <span>{isKn ? 'ಮುಕ್ತ & ನೈಜ-ಸಮಯ ತಂತ್ರಜ್ಞಾನ' : 'Real-Time Language Tech'}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#555555', lineHeight: 1.45 }}>
                {isKn
                  ? 'ಕನ್ನಡ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ (Speech Recognition), ನೈಜ ಉಚ್ಚಾರಣೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಜ್ಞಾನ ಭಂಡಾರ.'
                  : 'Engineered for seamless speech recognition, authentic pronunciation, and rich heritage exploration.'}
              </p>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <a
                href="https://karnataka.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                title="Karnataka Government"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.78rem',
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <Globe size={13} color="var(--color-flag-red)" />
                <span>Portal</span>
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Source"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.78rem',
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <span>GitHub</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="footer-bottom-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#666666' }}>
            <span>
              {isKn
                ? `© ${currentYear} ಕನ್ನಡಸಾಥಿ — ಸಮಸ್ತ ಕನ್ನಡಿಗರಿಗಾಗಿ ಪ್ರೀತಿಯಿಂದ ರೂಪಿಸಲಾಗಿದೆ.`
                : `© ${currentYear} KannadaSaathi — Crafted with care for Karnataka.`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', color: '#777777', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-flag-red)', fontWeight: 700 }}>
              <Heart size={13} fill="var(--color-flag-red)" />
              {isKn ? 'ಕನ್ನಡವೇ ಸತ್ಯ, ಕನ್ನಡವೇ ನಿತ್ಯ' : 'Kannadave Satya, Kannadave Nitya'}
            </span>
            <span>•</span>
            <span>{isKn ? 'ಗೌಪ್ಯತೆ & ನಿಯಮಗಳು' : 'Privacy & Terms'}</span>
            <span>•</span>
            <span>{isKn ? 'ಆವೃತ್ತಿ ೨.೪' : 'v2.4 Live'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
