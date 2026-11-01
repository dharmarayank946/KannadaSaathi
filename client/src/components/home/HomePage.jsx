import React from 'react';
import {
  Mic,
  ArrowRight,
  BookOpen,
  Users,
  GraduationCap,
  Landmark,
  ChevronRight,
  Languages,
  Sparkles,
  Presentation,
  Grid,
  Award
} from 'lucide-react';
import FaceToFaceConversationSection from './FaceToFaceConversationSection';
import VoiceTranslatorWidget from '../VoiceTranslatorWidget';
import ConnectedCommunication3D from './ConnectedCommunication3D';
import RajyotsavaLiveTracker from '../common/RajyotsavaLiveTracker';

export default function HomePage({ onSelectSection, langMode = 'kn' }) {
  const isKn = langMode === 'kn';

  // 6 Comprehensive Quick Start Features for KannadaSaathi
  const quickStartFeatures = [
    {
      id: 'translator',
      icon: Languages,
      badgeKn: 'ಧ್ವನಿ ಅನುವಾದ • VOICE FIRST',
      badgeEn: 'Voice First • Instant Translate',
      badgeColor: '#FFF1F1',
      badgeTextColor: '#DC2626',
      titleKn: 'ಕನ್ನಡ ಧ್ವನಿ ಸಂಭಾಷಣೆ ಮತ್ತು ಅನುವಾದಕ',
      titleEn: 'Voice Translator & Conversation',
      descKn: 'ಮೈಕ್ರೊಫೋನ್ ಮೂಲಕ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ. ಇಂಗ್ಲಿಷ್-ಕನ್ನಡ ನೈಜ ಧ್ವನಿ ಉಚ್ಚಾರಣೆ ಮತ್ತು ತತ್‌ಕ್ಷಣ ಅನುವಾದ ಪಡೆಯಿರಿ.',
      descEn: 'Instant speech recognition and real voice pronunciation between English and Kannada.',
      actionKn: 'ಧ್ವನಿ ಅನುವಾದ ಆರಂಭಿಸಿ',
      actionEn: 'Start Voice Translator'
    },
    {
      id: 'everyday',
      icon: Users,
      badgeKn: 'ಅಗ್ರ ಆದ್ಯತೆ • ದಿನನಿತ್ಯ ಬಳಕೆ',
      badgeEn: 'High Priority • Everyday Spoken',
      badgeColor: '#FFF7ED',
      badgeTextColor: '#C2410C',
      titleKn: 'ದೈನಂದಿನ ಸಂಭಾಷಣೆಗಳು',
      titleEn: 'Daily Conversations',
      descKn: 'ಆಟೋ, ಬಸ್, ತರಕಾರಿ ಮಾರುಕಟ್ಟೆ, ಹೋಟೆಲ್, ಕಚೇರಿ, ಕಾಲೇಜು ಮತ್ತು ಸಂದರ್ಶನಗಳ ನೈಜ ಕನ್ನಡ ಸಂವಾದಗಳು.',
      descEn: 'Real-world dialogues for travel, auto-rickshaw, markets, dining, workplace, college, and interviews.',
      actionKn: 'ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ ಮಾಡಿ',
      actionEn: 'Practice Dialogues'
    },
    {
      id: 'teacher',
      icon: GraduationCap,
      badgeKn: 'ಸಮಗ್ರ ಕಲಿಕೆ • ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್',
      badgeEn: 'All-In-One • Slate & Letters',
      badgeColor: '#FFFDF0',
      badgeTextColor: '#B45309',
      titleKn: 'ಕನ್ನಡ ಕಲಿಕೆ (ಕನ್ನಡ ಗುರು & ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್)',
      titleEn: 'Kannada Learning Hub',
      descKn: 'ಸ್ವರಗಳು, ವ್ಯಂಜನಗಳು, ಗುಣಿತಾಕ್ಷರ, ಚಿತ್ರ ಶಬ್ದಕೋಶ, ವಾಕ್ಯ ರಚನೆ, ರಸಪ್ರಶ್ನೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್ ಬರಹ ಅಭ್ಯಾಸ.',
      descEn: 'Step-by-step vowels, consonants, Kagunitha, vocabulary, quiz, and digital slate letter tracing.',
      actionKn: 'ಕಲಿಕೆ ಆರಂಭಿಸಿ',
      actionEn: 'Start Learning'
    },
    {
      id: 'stories',
      icon: BookOpen,
      badgeKn: 'ನೀತಿ ಕಥೆಗಳು • ಆಡಿಯೋ',
      badgeEn: 'Moral Stories • Audio',
      badgeColor: '#F0FDF4',
      badgeTextColor: '#15803D',
      titleKn: 'ಕನ್ನಡ ಕಥಾ ಲೋಕ',
      titleEn: 'Kannada Stories',
      descKn: 'ಜಾಣ ಕಾಗೆ, ಪುಣ್ಯಕೋಟಿ ಮತ್ತು ತೆನಾಲಿ ರಾಮನ ಸಚಿತ್ರ ನೀತಿ ಕಥೆಗಳು. ಸಾಲು-ಸಾಲಿನ ಧ್ವನಿ ಉಚ್ಚಾರಣೆ ಮತ್ತು ಹಂಚಿಕೆ.',
      descEn: 'Illustrated classic fables like The Clever Crow and Punyakoti with line-by-line audio and sharing.',
      actionKn: 'ಕಥೆಗಳನ್ನು ಓದಿ & ಆಲಿಸಿ',
      actionEn: 'Read & Listen Stories'
    },
    {
      id: 'student',
      icon: Presentation,
      badgeKn: 'ವೇದಿಕೆ & ಭಾಷಣಗಳು',
      badgeEn: 'Speeches & Topics',
      badgeColor: '#EFF6FF',
      badgeTextColor: '#1D4ED8',
      titleKn: 'ವಿದ್ಯಾರ್ಥಿ ಭಾಷಣ ವೇದಿಕೆ',
      titleEn: 'Student Speeches',
      descKn: 'ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ, ಸ್ವಾತಂತ್ರ್ಯ ದಿನಾಚರಣೆ ಮತ್ತು ಗಣರಾಜ್ಯೋತ್ಸವದ ಶಾಲಾ-ಕಾಲೇಜು ಭಾಷಣಗಳ ಸಿದ್ಧತೆ ಮತ್ತು ಧ್ವನಿ.',
      descEn: 'Ready-to-deliver speeches for Rajyotsava, Independence Day, and Republic Day with audio readout and copy.',
      actionKn: 'ಭಾಷಣ ಸಿದ್ಧಪಡಿಸಿ',
      actionEn: 'Prepare Speeches'
    },
    {
      id: 'heritage',
      icon: Landmark,
      badgeKn: 'ಸಂಸ್ಕೃತಿ • ೯ ವಿಭಾಗಗಳು',
      badgeEn: 'Culture • 9 Categories',
      badgeColor: '#FEF2F2',
      badgeTextColor: '#B91C1C',
      titleKn: 'ಕರ್ನಾಟಕ ಪರಂಪರೆ & ಸಂಸ್ಕೃತಿ',
      titleEn: 'Karnataka Heritage',
      descKn: '೧೦ ವಾಸ್ತುಶಿಲ್ಪ ತಾಣಗಳು, ಯಕ್ಷಗಾನ, ಮೈಸೂರು ಪಾಕ್, ಹಲ್ಮಿಡಿ ಶಾಸನ, ಶಿವಶರಣರ ವಚನಗಳು ಮತ್ತು ಜ್ಞಾನಪೀಠ ಪುರಸ್ಕೃತರು.',
      descEn: 'Explore 10 historical sites, Yakshagana, cuisine, Halmidi stone inscription, Vachanas, and Jnanpith laureates.',
      actionKn: 'ಪರಂಪರೆ ಅನ್ವೇಷಿಸಿ',
      actionEn: 'Explore Heritage'
    }
  ];

  const handleCardClick = (item, e) => {
    if (item.id === 'translator') {
      handleScrollToSharedPhone();
      return;
    }
    onSelectSection(item.id, 'all', '', e);
  };

  const handleScrollToSharedPhone = () => {
    const el = document.getElementById('home-shared-phone-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="homepage-redesign-root">
      {/* ==================================================================== */}
      {/* HERO SECTION (EXTENDS TO BOTTOM OF FIRST VIEWPORT, BALANCED & CLEAN) */}
      {/* ==================================================================== */}
      <section
        className="hero-fullscreen-container"
        aria-label={isKn ? "ಕನ್ನಡಸಾಥಿ ಮುಖಪುಟ ಪರಿಚಯ" : "KannadaSaathi Homepage Hero"}
      >
        {/* Animated 3D Connected Communication Background Sculpture */}
        <ConnectedCommunication3D />

        {/* Subtle decorative curved background glows */}
        <div className="hero-bg-curve hero-bg-curve-yellow" aria-hidden="true" />
        <div className="hero-bg-curve hero-bg-curve-red" aria-hidden="true" />
        <div className="hero-bg-pattern-overlay" aria-hidden="true" />

        <div className="hero-content-wrapper hero-clean-centered-wrapper">
          <div className="hero-left-content hero-centered-content">
            {/* Refined Pill Tag */}
            <div className="hero-badge-pill hero-animate-badge">
              <span className="hero-badge-spark">✦</span>
              <span>
                {isKn ? 'ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಭಾಷಾ & ಸಾಂಸ್ಕೃತಿಕ ವೇದಿಕೆ' : 'Voice & Cultural Platform for Karnataka'}
              </span>
            </div>

            {/* Crisp, Single-Layer Heading (Eliminates duplication and ligature overlap) */}
            <h1 className="hero-headline kn-heading hero-animate-headline">
              {isKn ? (
                <>
                  <span className="hero-headline-primary">ಕನ್ನಡ ಮಾತನಾಡಿ.</span>{' '}
                  <span className="hero-headline-accent">ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ</span>
                </>
              ) : (
                <>
                  <span className="hero-headline-primary">Speak Kannada.</span>{' '}
                  <span className="hero-headline-accent">Explore Karnataka</span>
                </>
              )}
            </h1>

            {/* Supporting Text */}
            <p className="hero-subtext kn-text hero-animate-subtext">
              {isKn
                ? 'ಒಂದೇ ಫೋನ್‌ನಲ್ಲಿ ಮುಖಾಮುಖಿ ಕುಳಿತು ಇಬ್ಬರೂ ತಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರಾಗವಾಗಿ ಸಂಭಾಷಿಸಿ. ಕನ್ನಡ ಕಲಿಯಿರಿ ಮತ್ತು ಕರ್ನಾಟಕದ ಭವ್ಯ ಪರಂಪರೆಯನ್ನು ಅನ್ವೇಷಿಸಿ.'
                : 'Communicate face-to-face across languages on a shared phone. Learn Kannada and explore Karnataka’s magnificent heritage.'}
            </p>

            {/* EXACTLY TWO PROMINENT HERO CTA BUTTONS with Magnetic, Liquid, 3D Physical & Arrow Chase */}
            <div className="hero-two-cta-row hero-animate-ctas">
              {/* PRIMARY CTA: Face-to-Face Shared Phone Conversation */}
              <button
                type="button"
                className="btn-hero-primary-speak btn-magnetic liquid-btn btn-3d-physical arrow-chase-btn"
                onClick={handleScrollToSharedPhone}
                aria-label={isKn ? "ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ" : "Start Face-to-Face Conversation"}
              >
                <div className="btn-hero-icon-pulse">
                  <Users size={20} />
                </div>
                <span className="btn-hero-text">
                  {isKn ? 'ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ' : 'Face-to-Face Conversation'}
                </span>
                <ArrowRight size={18} className="btn-hero-arrow arrow-chase-icon" />
              </button>

              {/* SECONDARY CTA: "Explore Karnataka" (Heritage Explorer) */}
              <button
                type="button"
                className="btn-hero-secondary-explore btn-magnetic btn-3d-physical arrow-chase-btn"
                onClick={(e) => onSelectSection('heritage', 'all', '', e)}
                aria-label={isKn ? "ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ (ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ ನೋಡಿ)" : "Explore Karnataka (View Heritage Explorer)"}
              >
                <Landmark size={19} className="btn-secondary-icon" />
                <span className="btn-hero-text">
                  {isKn ? 'ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ' : 'Explore Karnataka'}
                </span>
                <ChevronRight size={18} className="btn-secondary-chevron arrow-chase-icon" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 1: SHARED PHONE / FACE-TO-FACE CONVERSATION (ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ) */}
      {/* ==================================================================== */}
      <section
        id="home-shared-phone-section"
        className="home-shared-phone-section reveal-on-scroll"
        aria-label={isKn ? "ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ" : "Face-to-Face Conversation"}
      >
        <FaceToFaceConversationSection langMode={langMode} />
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: DIRECT VOICE TRANSLATION (ನೇರ ಅನುವಾದ - English to Kannada) */}
      {/* ==================================================================== */}
      <section
        id="home-direct-voice-translator"
        className="home-direct-voice-translator reveal-on-scroll"
        aria-label={isKn ? "ನೇರ ಅನುವಾದ" : "Direct Voice Translation"}
      >
        <VoiceTranslatorWidget
          langMode={langMode}
          titleKn="ನೇರ ಅನುವಾದ (English to Kannada)"
          titleEn="Direct Translation (English to Kannada)"
          badgeKn="ನೇರ ಧ್ವನಿ ಅನುವಾದ • REAL-TIME SPEECH"
          badgeEn="Real-Time Speech Translation"
          descKn="ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ, ಕನ್ನಡದಲ್ಲಿ ತಕ್ಷಣ ಕೇಳಿ ಮತ್ತು ಓದಿ."
          descEn="Speak in English, hear and read in Kannada with instant speech recognition."
          onOpenFullTranslator={handleScrollToSharedPhone}
        />
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: QUICK START (ತ್ವರಿತ ಆರಂಭ)                                   */}
      {/* ==================================================================== */}
      <section
        id="home-quick-start"
        className="home-core-features-section reveal-on-scroll"
        aria-label={isKn ? "ತ್ವರಿತ ಆರಂಭ" : "Quick Start"}
      >
        <div className="features-section-inner">
          {/* Live Accurate Kannada Rajyotsava Celebration / Countdown Tracker */}
          <RajyotsavaLiveTracker langMode={langMode} />

          <div className="features-head-group">
            <div className="features-mini-tag">
              <Sparkles size={14} color="var(--color-flag-red)" />
              <span>{isKn ? 'ತ್ವರಿತ ಆರಂಭ • QUICK START' : 'QUICK START • ALL FEATURES'}</span>
            </div>
            <h2 className="kn-heading features-main-heading">
              {isKn ? 'ಕನ್ನಡಸಾಥಿ ತ್ವರಿತ ಆರಂಭ (Quick Start)' : 'Explore KannadaSaathi Features'}
            </h2>
            <p className="kn-text features-subtitle">
              {isKn
                ? 'ಧ್ವನಿ ಅನುವಾದ, ದೈನಂದಿನ ಸಂಭಾಷಣೆ, ಸಮಗ್ರ ಕಲಿಕೆ, ನೀತಿ ಕಥೆಗಳು, ವಿದ್ಯಾರ್ಥಿ ಭಾಷಣ ಹಾಗೂ ಕರ್ನಾಟಕದ ಭವ್ಯ ಪರಂಪರೆ:'
                : 'Instant access to voice translation, daily dialogues, lessons, moral stories, student speeches, and heritage:'}
            </p>
          </div>

          {/* 6 Core Feature Cards Grid */}
          <div className="features-cards-grid reveal-on-scroll">
            {quickStartFeatures.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="feature-card-item"
                  style={{ '--stagger-index': index }}
                  onClick={() => handleCardClick(feat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleCardClick(feat);
                  }}
                >
                  <div className="feature-card-top">
                    <div className="feature-icon-box">
                      <Icon size={22} />
                    </div>
                    <span
                      className="feature-pill-badge"
                      style={{ background: feat.badgeColor, color: feat.badgeTextColor }}
                    >
                      {isKn ? feat.badgeKn : feat.badgeEn}
                    </span>
                  </div>

                  <div className="feature-card-body">
                    <h3 className="kn-heading feature-item-title">
                      {isKn ? feat.titleKn : feat.titleEn}
                    </h3>
                    <p className="kn-text feature-item-desc">
                      {isKn ? feat.descKn : feat.descEn}
                    </p>
                  </div>

                  <div className="feature-card-footer">
                    <span className="feature-action-label">
                      {isKn ? feat.actionKn : feat.actionEn}
                    </span>
                    <ChevronRight size={15} className="feature-action-chevron" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
