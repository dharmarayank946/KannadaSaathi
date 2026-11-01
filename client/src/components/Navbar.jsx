import React, { useState, useEffect } from 'react';
import {
  Globe,
  Menu,
  X,
  Languages,
  GraduationCap,
  Users,
  BookOpen,
  Presentation,
  Home,
  User,
  Landmark,
  ChevronRight
} from 'lucide-react';

export default function Navbar({
  langMode,
  setLangMode,
  serverStatus,
  currentSection,
  onSelectSection,
  onResetToHome
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(null);

  const isKn = langMode === 'kn';

  // Read profile avatar from localStorage on mount and section changes
  useEffect(() => {
    try {
      const p = localStorage.getItem('kannada_saathi_user_profile');
      if (p) {
        const parsed = JSON.parse(p);
        setProfileAvatar(parsed.photoUrl || null);
      }
    } catch (e) {}
  }, [currentSection]);

  // Close fullscreen menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Requested 6 Core Desktop Navigation Destinations in exact order
  const NAV_ITEMS = [
    { id: 'home', titleKn: 'ಮುಖಪುಟ', titleEn: 'Home', icon: Home },
    { id: 'everyday', titleKn: 'ದೈನಂದಿನ ಸಂಭಾಷಣೆ', titleEn: 'Daily Conversations', icon: Users },
    { id: 'teacher', titleKn: 'ಕನ್ನಡ ಕಲಿಕೆ', fullTitleKn: 'ಕನ್ನಡ ಕಲಿಕೆ & ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್', titleEn: 'Kannada Learning', icon: GraduationCap },
    { id: 'stories', titleKn: 'ಕಥೆಗಳು', titleEn: 'Stories', icon: BookOpen },
    { id: 'student', titleKn: 'ಭಾಷಣಗಳು', titleEn: 'Speeches', icon: Presentation },
    { id: 'heritage', titleKn: 'ಪರಂಪರೆ', titleEn: 'Heritage', icon: Landmark }
  ];

  // Fullscreen Navigation Overlay Destinations
  const FULLSCREEN_NAV_ITEMS = [
    { id: 'home', titleKn: 'ಮುಖಪುಟ', titleEn: 'Home', descKn: 'ಕನ್ನಡಸಾಥಿ ಮುಖಪುಟ ಮತ್ತು ಧ್ವನಿ ಸಂಭಾಷಣೆ', descEn: 'Platform homepage & voice translator', icon: Home, num: '01' },
    { id: 'everyday', titleKn: 'ದೈನಂದಿನ ಸಂಭಾಷಣೆ', titleEn: 'Daily Conversations', descKn: 'ಪ್ರಯಾಣ, ಹೋಟೆಲ್, ಮಾರುಕಟ್ಟೆ ನೈಜ ಸಂವಾದಗಳು', descEn: 'Real-world practical dialogues', icon: Users, num: '02' },
    { id: 'teacher', titleKn: 'ಕನ್ನಡ ಕಲಿಕೆ', fullTitleKn: 'ಕನ್ನಡ ಕಲಿಕೆ & ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್', titleEn: 'Kannada Learning', descKn: 'ಅಕ್ಷರಮಾಲೆ, ಸಚಿತ್ರ ಪದಕೋಶ, ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್', descEn: 'Alphabet, vocabulary & slate tracing', icon: GraduationCap, num: '03' },
    { id: 'stories', titleKn: 'ಕಥೆಗಳು', titleEn: 'Stories', descKn: 'ನೀತಿ ಕಥೆಗಳು & ಸಾಲು-ಸಾಲಿನ ಧ್ವನಿ ಉಚ್ಚಾರಣೆ', descEn: 'Illustrated moral fables with audio', icon: BookOpen, num: '04' },
    { id: 'student', titleKn: 'ಭಾಷಣಗಳು', titleEn: 'Speeches', descKn: 'ಶಾಲಾ-ಕಾಲೇಜು ವೇದಿಕೆ ಭಾಷಣಗಳು & ಸಿದ್ಧತೆ', descEn: 'Ready-to-deliver student speeches', icon: Presentation, num: '05' },
    { id: 'heritage', titleKn: 'ಪರಂಪರೆ', titleEn: 'Heritage', descKn: '೯ ಸಾಂಸ್ಕೃತಿಕ ವಿಭಾಗಗಳು, ವಾಸ್ತುಶಿಲ್ಪ & ಇತಿಹಾಸ', descEn: '9 heritage categories, sites & culture', icon: Landmark, num: '06' },
    { id: 'profile', titleKn: 'ನನ್ನ ಪ್ರೊಫೈಲ್', titleEn: 'My Profile', descKn: 'ಕಲಿಕಾ ಸಾಧನೆಗಳು, ಪ್ರಗತಿ & ಖಾತೆ ಸೆಟ್ಟಿಂಗ್ಸ್', descEn: 'Learning stats, badges & preferences', icon: User, num: '07' }
  ];

  const handleNavClick = (secId, e) => {
    if (secId === 'home') {
      onResetToHome(e);
    } else {
      onSelectSection(secId, 'all', '', e);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="top-navbar">
      <div className="navbar-inner">
        {/* Left: Clean Brand with Official Voice of Karnataka Logo */}
        <div
          className="brand-section"
          onClick={() => {
            onResetToHome();
            setIsMobileMenuOpen(false);
          }}
          title={isKn ? "ಕನ್ನಡಸಾಥಿ ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ" : "Go to KannadaSaathi Homepage"}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}
        >
          <img
            src="/kannada-saathi-logo.png"
            alt="KannadaSaathi Logo - Voice of Karnataka"
            className="navbar-brand-logo"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'contain',
              display: 'block',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
            }}
          />
          <div className="brand-titles">
            <div className="brand-name" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-flag-red)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {isKn ? 'ಕನ್ನಡಸಾಥಿ' : 'KannadaSaathi'}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B45309', letterSpacing: '0.03em' }}>
              {isKn ? 'ಧ್ವನಿ • ಪರಂಪರೆ' : 'Voice of Karnataka'}
            </div>
          </div>
        </div>

        {/* Center: Clean Desktop Navigation - All Core Destinations */}
        <nav className="nav-desktop-links" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link-item nav-link-magnetic ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(item.id, e)}
                title={isKn ? (item.fullTitleKn || item.titleKn) : item.titleEn}
              >
                <Icon size={14} />
                <span>{isKn ? item.titleKn : item.titleEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Language Pill (K | E) and Circular Profile Avatar */}
        <div className="nav-actions">
          {/* Compact K | E language switcher */}
          <div className="compact-lang-switcher" role="group" aria-label="Language Selector">
            <button
              type="button"
              className={`lang-badge-btn ${isKn ? 'active' : ''}`}
              onClick={() => setLangMode('kn')}
              aria-label="ಕನ್ನಡ"
              title="ಕನ್ನಡ (Kannada)"
            >
              ಕ
            </button>
            <span className="lang-badge-divider">|</span>
            <button
              type="button"
              className={`lang-badge-btn ${!isKn ? 'active' : ''}`}
              onClick={() => setLangMode('en')}
              aria-label="English"
              title="English"
            >
              E
            </button>
          </div>

          {/* Circular Profile Avatar Button */}
          <button
            type="button"
            className={`nav-profile-avatar-btn ${currentSection === 'profile' ? 'active' : ''}`}
            onClick={(e) => handleNavClick('profile', e)}
            title={isKn ? "ನನ್ನ ಕಲಿಕಾ ಪ್ರೊಫೈಲ್ & ಖಾತೆ ಸೆಟ್ಟಿಂಗ್ಸ್" : "My Learning Profile & Account Settings"}
            aria-label={isKn ? "ಪ್ರೊಫೈಲ್" : "Profile"}
          >
            {profileAvatar ? (
              <img
                src={profileAvatar}
                alt="Profile Avatar"
                className="nav-profile-avatar-img"
              />
            ) : (
              <div className="nav-profile-avatar-circle">
                <User size={16} />
              </div>
            )}
          </button>

          {/* Fullscreen Menu Trigger Button */}
          <button
            type="button"
            className="navbar-menu-toggle-btn mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title={isKn ? 'ಪೂರ್ಣ ಮೆನು ತೆರೆಯಿರಿ' : 'Open Fullscreen Menu'}
            aria-label={isKn ? 'ಮೆನು ತೆರೆಯಿರಿ' : 'Open Menu'}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Fullscreen Navigation Overlay (Awwwards Style) */}
      {isMobileMenuOpen && (
        <div className="fullscreen-nav-overlay" role="dialog" aria-modal="true" aria-label="Fullscreen Navigation Menu">
          {/* Top Bar with Brand & Close Button */}
          <div className="fullscreen-nav-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="/kannada-saathi-logo.png"
                alt="KannadaSaathi Logo"
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'contain' }}
              />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-flag-red)', lineHeight: 1.1 }}>
                  {isKn ? 'ಕನ್ನಡಸಾಥಿ' : 'KannadaSaathi'}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309' }}>
                  {isKn ? 'ಧ್ವನಿ • ಪರಂಪರೆ • ಸಮಗ್ರ ಮಾರ್ಗದರ್ಶಿ' : 'Voice & Heritage Platform'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Language Switcher in Fullscreen Menu */}
              <div className="compact-lang-switcher">
                <button
                  type="button"
                  className={`lang-badge-btn ${isKn ? 'active' : ''}`}
                  onClick={() => setLangMode('kn')}
                >
                  ಕ
                </button>
                <span className="lang-badge-divider">|</span>
                <button
                  type="button"
                  className={`lang-badge-btn ${!isKn ? 'active' : ''}`}
                  onClick={() => setLangMode('en')}
                >
                  E
                </button>
              </div>

              {/* Prominent Circular Close Button */}
              <button
                type="button"
                className="fullscreen-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                title={isKn ? "ಮೆನು ಮುಚ್ಚಿ (Esc)" : "Close Menu (Esc)"}
                aria-label="Close Menu"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Title Banner */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '0.5rem', padding: '0 1rem' }}>
            <h2 className="kn-heading" style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text-main)', margin: 0 }}>
              {isKn ? 'ಕನ್ನಡಸಾಥಿ ಮುಖ್ಯ ವಿಭಾಗಗಳು' : 'KannadaSaathi Main Destinations'}
            </h2>
            <p className="kn-text" style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.35rem 0 0' }}>
              {isKn ? 'ನೀವು ಭೇಟಿ ನೀಡಲು ಇಷ್ಟಪಡುವ ವಿಭಾಗವನ್ನು ಆರಿಸಿ:' : 'Choose a section to explore:'}
            </p>
          </div>

          {/* Center: 8 Navigation Cards Grid */}
          <div className="fullscreen-nav-grid">
            {FULLSCREEN_NAV_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <div
                  key={item.id}
                  className={`fullscreen-nav-card ${isActive ? 'active' : ''}`}
                  style={{ '--item-idx': idx }}
                  onClick={(e) => handleNavClick(item.id, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleNavClick(item.id, e);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: isActive ? 'var(--color-flag-red)' : '#FFF0ED',
                        color: isActive ? '#FFFFFF' : 'var(--color-flag-red)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActive ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isActive ? 'var(--color-flag-red)' : '#B45309', opacity: 0.85 }}>
                          {item.num}.
                        </span>
                        <span className="kn-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                          {isKn ? (item.fullTitleKn || item.titleKn) : item.titleEn}
                        </span>
                        {isActive && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'var(--color-flag-red)', color: '#FFF', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                            {isKn ? 'ಪ್ರಸ್ತುತ' : 'CURRENT'}
                          </span>
                        )}
                      </div>
                      <div className="kn-text" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                        {isKn ? item.descKn : item.descEn}
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={18} color={isActive ? 'var(--color-flag-red)' : '#999'} style={{ flexShrink: 0, marginLeft: '0.5rem' }} />
                </div>
              );
            })}
          </div>

          {/* Footer Cultural Tagline */}
          <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--color-cream-border)', marginTop: 'auto' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-flag-red)', letterSpacing: '0.02em' }}>
              {isKn ? 'ಕನ್ನಡ ಮಾತನಾಡಿ. ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ ✦' : 'Speak Kannada. Explore Karnataka ✦'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
