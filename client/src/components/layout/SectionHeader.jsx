import React from 'react';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

export default function SectionHeader({
  badge,
  badgeKn,
  badgeEn,
  titleKn,
  titleEn,
  taglineKn,
  taglineEn,
  icon: IconComponent,
  onBackToHome,
  langMode
}) {
  const isKn = langMode === 'kn';
  const displayBadge = isKn ? (badgeKn || badge?.split('•')[0]?.trim() || badge) : (badgeEn || badge?.split('•')[1]?.trim() || badge);
  const displayTitle = isKn ? titleKn : titleEn;
  const displayTagline = isKn ? taglineKn : taglineEn;

  return (
    <div className="section-hero-header">
      <div className="section-hero-inner">
        <button
          type="button"
          onClick={onBackToHome}
          className="section-back-btn"
          title={isKn ? "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ" : "Back to Homepage"}
        >
          <ArrowLeft size={16} />
          <span>{isKn ? 'ಮುಖಪುಟ' : 'Home'}</span>
        </button>

        {displayBadge && (
          <div className="section-hero-badge">
            <Sparkles size={13} />
            <span>{displayBadge}</span>
          </div>
        )}

        <div className="section-hero-title-row">
          {IconComponent && (
            <div className="section-hero-icon-box">
              <IconComponent size={28} />
            </div>
          )}
          <div>
            <h1 className="section-hero-title kn-heading">
              {displayTitle}
            </h1>
            <p className="section-hero-tagline">
              {displayTagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
