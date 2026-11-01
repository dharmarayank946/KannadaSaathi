import React from 'react';

export default function Footer({ onSelectSection, langMode = 'kn' }) {
  const isKn = langMode === 'kn';

  return (
    <footer className="app-footer" style={{ borderTop: '1px solid #E8E8E8', background: '#FFFFFF', padding: '1.5rem 1rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #F0F0F0' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-flag-red)' }}>
              {isKn ? 'ಕನ್ನಡಸಾಥಿ' : 'KannadaSaathi'}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#666666', margin: '0.2rem 0 0 0' }}>
              {isKn ? 'ಕರ್ನಾಟಕದ ಭಾಷಾ ಕಲಿಕೆ, ಸಂಭಾಷಣೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಸಂಗಾತಿ' : 'Language learning, conversation, and cultural companion for Karnataka'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="footer-nav-btn"
              onClick={() => onSelectSection('home')}
              style={{ background: 'none', border: 'none', color: '#333', fontSize: '0.84rem', cursor: 'pointer', fontWeight: 600 }}
            >
              {isKn ? 'ಮುಖಪುಟ' : 'Home'}
            </button>
            <button
              type="button"
              className="footer-nav-btn"
              onClick={() => onSelectSection('everyday')}
              style={{ background: 'none', border: 'none', color: '#333', fontSize: '0.84rem', cursor: 'pointer', fontWeight: 600 }}
            >
              {isKn ? 'ದೈನಂದಿನ ಸಂಭಾಷಣೆ' : 'Daily Conversations'}
            </button>
            <button
              type="button"
              className="footer-nav-btn"
              onClick={() => onSelectSection('teacher')}
              style={{ background: 'none', border: 'none', color: '#333', fontSize: '0.84rem', cursor: 'pointer', fontWeight: 600 }}
            >
              {isKn ? 'ಕನ್ನಡ ಕಲಿಕೆ' : 'Kannada Learning'}
            </button>
            <button
              type="button"
              className="footer-nav-btn"
              onClick={() => onSelectSection('stories')}
              style={{ background: 'none', border: 'none', color: '#333', fontSize: '0.84rem', cursor: 'pointer', fontWeight: 600 }}
            >
              {isKn ? 'ಕಥೆಗಳು' : 'Stories'}
            </button>
            <button
              type="button"
              className="footer-nav-btn"
              onClick={() => onSelectSection('student')}
              style={{ background: 'none', border: 'none', color: '#333', fontSize: '0.84rem', cursor: 'pointer', fontWeight: 600 }}
            >
              {isKn ? 'ಭಾಷಣಗಳು' : 'Speeches'}
            </button>
            <button
              type="button"
              className="footer-nav-btn"
              onClick={() => onSelectSection('heritage')}
              style={{ background: 'none', border: 'none', color: '#333', fontSize: '0.84rem', cursor: 'pointer', fontWeight: 600 }}
            >
              {isKn ? 'ಪರಂಪರೆ' : 'Heritage'}
            </button>
            <button
              type="button"
              className="footer-nav-btn"
              onClick={() => onSelectSection('profile')}
              style={{ background: 'none', border: 'none', color: '#333', fontSize: '0.84rem', cursor: 'pointer', fontWeight: 600 }}
            >
              {isKn ? 'ಪ್ರೊಫೈಲ್' : 'Profile'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.85rem', fontSize: '0.78rem', color: '#777777' }}>
          <div>
            {isKn
              ? '© ೨೦೨೬ ಕನ್ನಡಸಾಥಿ — ಸಮಸ್ತ ಕನ್ನಡಿಗರಿಗಾಗಿ ಹೆಮ್ಮೆಯಿಂದ ರೂಪಿಸಲಾಗಿದೆ.'
              : '© 2026 KannadaSaathi — Crafted with care for Karnataka.'}
          </div>
          <div style={{ fontWeight: 600, color: 'var(--color-flag-red)' }}>
            {isKn ? 'ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ' : 'Sirigannadam Gelge, Sirigannadam Baalge'}
          </div>
        </div>
      </div>
    </footer>
  );
}
