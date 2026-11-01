import React from 'react';
import { X, Settings, Shield, Volume2, Globe, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, langMode, setLangMode, speechRate, setSpeechRate }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(8, 38, 28, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', maxWidth: '480px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }} className="fade-in">
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', background: '#FFFDF7', borderBottom: '1px solid var(--color-cream-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src="/logo/kannadasaathi-logo.svg" alt="ಕನ್ನಡಸಾಥಿ ಲೋಗೋ" style={{ width: '28px', height: '28px', objectFit: 'contain', aspectRatio: '1 / 1' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              ಸೆಟ್ಟಿಂಗ್‌ಗಳು & ಗೌಪ್ಯತೆ (Settings & Privacy)
            </h3>
          </div>
          <button
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          {/* Language preference */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Globe size={16} /> ಭಾಷಾ ಪ್ರದರ್ಶನ (Language Display):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn ${langMode === 'kn' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem' }}
                onClick={() => setLangMode('kn')}
              >
                <span>ಕನ್ನಡ (Kannada)</span>
              </button>
              <button
                type="button"
                className={`btn ${langMode === 'en' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem' }}
                onClick={() => setLangMode('en')}
              >
                <span>English</span>
              </button>
            </div>
          </div>

          {/* Voice rate */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <Volume2 size={16} /> ಮಾತನಾಡುವ ವೇಗ (Speech Rate: {speechRate}x):
            </label>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-light)', marginTop: '4px' }}>
              <span>ನಿಧಾನ (0.75x)</span>
              <span>ಸಾಮಾನ್ಯ (1.0x)</span>
              <span>ವೇಗ (1.25x)</span>
            </div>
          </div>

          {/* Privacy statement */}
          <div style={{ background: 'var(--color-primary-soft)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
              <Shield size={16} /> ಗೌಪ್ಯತೆ ಮತ್ತು ಸುರಕ್ಷತೆ (Privacy Guaranteed)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              ನಿಮ್ಮ ಕ್ಯಾಮೆರಾ ಅಥವಾ ಮೈಕ್ರೊಫೋನ್ ನಿಮ್ಮ ಸ್ಪಷ್ಟ ಅನುಮತಿಯಿಲ್ಲದೆ ಎಂದಿಗೂ ಸಕ್ರಿಯಗೊಳ್ಳುವುದಿಲ್ಲ. ನಿಮ್ಮ ನೆನಪೋಲೆಗಳು ಮತ್ತು ಕಾರ್ಯಗಳು ನಿಮ್ಮದೇ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', background: '#FCFBF7', borderTop: '1px solid var(--color-cream-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 1.25rem' }}
            onClick={onClose}
          >
            ಸರಿ (Done)
          </button>
        </div>
      </div>
    </div>
  );
}
