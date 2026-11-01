import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Landmark,
  Film,
  Users,
  CheckCircle2,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { playSpeech, stopSpeech } from '../../utils/kannadaSpeech';

export default function HeroCommunicationVideo({ langMode = 'kn' }) {
  const isKn = langMode === 'kn';
  const containerRef = useRef(null);

  // Mode: 'video' (Communication Story) | 'hampi' (Hampi Stone Chariot Landmark)
  const [activeVisualMode, setActiveVisualMode] = useState('video');

  // Video loop playback state (6-8 seconds cycle)
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [isSpeakingHampi, setIsSpeakingHampi] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  // Total loop duration: 7.5 seconds
  const LOOP_DURATION = 7.5;

  // Reduced motion preference check
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }
  }, []);

  // 1. IntersectionObserver: Pause when outside viewport, resume when in viewport
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!prefersReducedMotion) {
              setIsPlaying(true);
            }
          } else {
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // 2. Playback Timer Loop (6-8 seconds loop, progresses every 100ms)
  useEffect(() => {
    if (!isPlaying || activeVisualMode !== 'video' || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setProgressSeconds((prev) => {
        const next = prev + 0.1;
        if (next >= LOOP_DURATION) {
          return 0; // Seamless loop restart
        }
        return parseFloat(next.toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, activeVisualMode, prefersReducedMotion]);

  // Determine current scene phase (0 to 7.5s)
  // Phase 1: 0.0s - 2.0s -> Language Barrier
  // Phase 2: 2.0s - 3.8s -> Opening KannadaSaathi on phone
  // Phase 3: 3.8s - 5.8s -> Voice Translation in action
  // Phase 4: 5.8s - 7.5s -> Smiling, connected & understanding
  const currentPhase =
    progressSeconds < 2.0 ? 1 :
    progressSeconds < 3.8 ? 2 :
    progressSeconds < 5.8 ? 3 : 4;

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleRestart = (e) => {
    e.stopPropagation();
    setProgressSeconds(0);
    setIsPlaying(true);
  };

  const handleListenHampi = (e) => {
    e.stopPropagation();
    if (isSpeakingHampi) {
      stopSpeech();
      setIsSpeakingHampi(false);
      return;
    }
    const knText = 'ಹಂಪಿಯ ವಿಜಯ ವಿಠ್ಠಲ ದೇಗುಲದ ಕಲ್ಲಿನ ರಥ. ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಶಿಲ್ಪಕಲೆಯ ಅದ್ಭುತ ಸಂಕೇತ ಹಾಗೂ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣ.';
    const enText = 'Stone Chariot at Vijaya Vittala Temple, Hampi. A magnificent UNESCO World Heritage architectural landmark of the Vijayanagara Empire.';
    setIsSpeakingHampi(true);
    playSpeech({
      text: isKn ? knText : enText,
      lang: isKn ? 'kn' : 'en',
      id: 'hampi-hero-card',
      onStart: () => setIsSpeakingHampi(true),
      onEnd: () => setIsSpeakingHampi(false),
      onError: () => setIsSpeakingHampi(false)
    });
  };

  return (
    <div className="hero-visual-card" ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Visual Switcher Pills (Video Story vs Landmark) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.85rem',
          background: 'var(--color-cream-subtle)',
          borderBottom: '1px solid var(--color-cream-border)',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            className={`btn ${activeVisualMode === 'video' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.74rem', borderRadius: '20px', fontWeight: 800 }}
            onClick={() => setActiveVisualMode('video')}
          >
            <Film size={12} />
            <span>{isKn ? 'ಸಂವಾದ ಕಥೆ (೬-೮ ಸೆ)' : 'Communication Video'}</span>
          </button>
          <button
            type="button"
            className={`btn ${activeVisualMode === 'hampi' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.74rem', borderRadius: '20px', fontWeight: 800 }}
            onClick={() => setActiveVisualMode('hampi')}
          >
            <Landmark size={12} />
            <span>{isKn ? 'ಹಂಪಿ ಸ್ಮಾರಕ' : 'Hampi Landmark'}</span>
          </button>
        </div>

        {activeVisualMode === 'video' && (
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-flag-red)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            ● {isKn ? 'ಲೂಪ್ ವಿಡಿಯೋ' : 'Looping Story'}
          </span>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODE A: 6-8 SECOND COMMUNICATION STORY VIDEO SCENE             */}
      {/* ============================================================== */}
      {activeVisualMode === 'video' ? (
        <div className="hero-communication-video-container" style={{ position: 'relative', background: '#0F172A', color: '#FFFFFF', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {/* Top Video Overlay Bar */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
              zIndex: 3
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', fontWeight: 700 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
              <span>{isKn ? 'ಮುಖಾಮುಖಿ ಧ್ವನಿ ಸಂಭಾಷಣೆ' : 'Face-to-Face Communication'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                0:0{Math.floor(progressSeconds)} / 0:0{Math.floor(LOOP_DURATION)}
              </span>
              <button
                type="button"
                onClick={handleTogglePlay}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              </button>
            </div>
          </div>

          {/* Animated 4-Scene Stage Canvas */}
          <div
            className="video-scene-stage"
            style={{
              flex: 1,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
              textAlign: 'center'
            }}
          >
            {/* SCENE 1: Struggling with language barrier */}
            {currentPhase === 1 && (
              <div className="scene-fade-in" style={{ maxWidth: '320px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  🗣️ ❓ 🧕
                </div>
                <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#FCD34D', fontWeight: 700, marginBottom: '0.2rem' }}>
                    ೧. ಭಾಷಾ ಅಡೆತಡೆ (Language Barrier)
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    "Where is the temple?"
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.25rem' }}>
                    "ಏನು ಹೇಳ್ತಿದ್ದೀರಾ? ನನಗೆ ತಿಳಿಯುತ್ತಿಲ್ಲ..."
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 2: Opening KannadaSaathi on phone */}
            {currentPhase === 2 && (
              <div className="scene-fade-in" style={{ maxWidth: '320px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  📱 ✨
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.25)', backdropFilter: 'blur(6px)', padding: '0.75rem', borderRadius: '12px', border: '1.5px solid var(--color-flag-red)', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#FEF08A', fontWeight: 700, marginBottom: '0.2rem' }}>
                    ೨. ಕನ್ನಡಸಾಥಿ ಆರಂಭ (Opening App)
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFF' }}>
                    ಕನ್ನಡಸಾಥಿ ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#FCA5A5', marginTop: '0.2rem' }}>
                    ಒಂದೇ ಫೋನ್‌ನಲ್ಲಿ ಇಬ್ಬರೂ ಸರದಿಯಂತೆ ಮಾತನಾಡಲು ಸಿದ್ಧ!
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 3: Voice translation in real-time */}
            {currentPhase === 3 && (
              <div className="scene-fade-in" style={{ maxWidth: '320px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  🎙️ ➔ 🔊
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.25)', backdropFilter: 'blur(6px)', padding: '0.75rem', borderRadius: '12px', border: '1.5px solid var(--color-flag-yellow)', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#FEF08A', fontWeight: 700, marginBottom: '0.2rem' }}>
                    ೩. ನೈಜ ಧ್ವನಿ ಅನುವಾದ (Live Translation)
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>
                    "ದೇವಾಲಯ ಎಲ್ಲಿದೆ?"
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#FEF3C7', marginTop: '0.25rem' }}>
                    ➔ "ಮುಂದೆ ಹೋಗಿ ಎಡಕ್ಕೆ ತಿರುಗಿ" 🔊
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 4: Smiling, connected & communicating */}
            {currentPhase === 4 && (
              <div className="scene-fade-in" style={{ maxWidth: '320px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  😊 🤝 😄
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.25)', backdropFilter: 'blur(6px)', padding: '0.75rem', borderRadius: '12px', border: '1.5px solid #22C55E', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#86EFAC', fontWeight: 700, marginBottom: '0.2rem' }}>
                    ೪. ಸೌಹಾರ್ದ & ಸಂಪರ್ಕ (Connected!)
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>
                    "ಧನ್ಯವಾದಗಳು! / Thank you!"
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#DCFCE7', marginTop: '0.25rem' }}>
                    ಸಂವಹನ ಯಶಸ್ವಿ • ಭಾಷೆ ಎಂದಿಗೂ ಅಡ್ಡಿಯಲ್ಲ
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Video Progress Bar & Phase Breadcrumbs */}
          <div style={{ padding: '0.5rem 0.85rem', background: 'rgba(0,0,0,0.5)', zIndex: 3 }}>
            {/* Progress track */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.4rem' }}>
              <div
                style={{
                  width: `${(progressSeconds / LOOP_DURATION) * 100}%`,
                  height: '100%',
                  background: 'var(--color-flag-red)',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>

            {/* 4 Steps timeline pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem', textAlign: 'center', fontSize: '0.66rem' }}>
              <span style={{ color: currentPhase === 1 ? 'var(--color-flag-yellow)' : '#94A3B8', fontWeight: currentPhase === 1 ? 800 : 500 }}>
                ೧. ಅಡೆತಡೆ
              </span>
              <span style={{ color: currentPhase === 2 ? 'var(--color-flag-yellow)' : '#94A3B8', fontWeight: currentPhase === 2 ? 800 : 500 }}>
                ೨. ಆ್ಯಪ್ ಓಪನ್
              </span>
              <span style={{ color: currentPhase === 3 ? 'var(--color-flag-yellow)' : '#94A3B8', fontWeight: currentPhase === 3 ? 800 : 500 }}>
                ೩. ಧ್ವನಿ ಅನುವಾದ
              </span>
              <span style={{ color: currentPhase === 4 ? '#22C55E' : '#94A3B8', fontWeight: currentPhase === 4 ? 800 : 500 }}>
                ೪. ಸಂಪರ್ಕ 🤝
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* MODE B: AUTHENTIC HAMPI STONE CHARIOT LANDMARK CARD            */
        /* ============================================================== */
        <div>
          <div className="hero-visual-img-wrap">
            {!imgLoadError ? (
              <img
                src="/images/heritage/hampi.jpg"
                alt={isKn ? "ಹಂಪಿಯ ಕಲ್ಲಿನ ರಥ, ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ" : "Hampi Stone Chariot, Karnataka"}
                className="hero-visual-img"
                loading="eager"
                onError={() => setImgLoadError(true)}
              />
            ) : (
              <div className="hero-visual-fallback">
                <Landmark size={36} color="var(--color-flag-red)" />
                <div className="fallback-title kn-heading">
                  {isKn ? 'ವಿಜಯ ವಿಠ್ಠಲ ಕಲ್ಲಿನ ರಥ' : 'Stone Chariot, Hampi'}
                </div>
                <div className="fallback-sub kn-text">
                  {isKn ? 'ವಿಜಯನಗರ ಜಿಲ್ಲೆ • ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ' : 'Vijayanagara District • UNESCO World Heritage'}
                </div>
              </div>
            )}
          </div>

          <div className="hero-visual-caption">
            <div className="caption-text-group">
              <div className="caption-title kn-heading">
                {isKn ? 'ಕಲ್ಲಿನ ರಥ • ಹಂಪಿ' : 'Stone Chariot • Hampi'}
              </div>
              <div className="caption-location kn-text">
                <MapPin size={13} color="var(--color-flag-red)" />
                <span>{isKn ? 'ವಿಜಯ ವಿಠ್ಠಲ ದೇಗುಲ, ಹೊಸಪೇಟೆ' : 'Vijaya Vittala Temple, Hosapete'}</span>
              </div>
              <div className="caption-sub">
                {isKn ? 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ • ೧೬ನೇ ಶತಮಾನ' : 'Vijayanagara Empire • 16th Century CE'}
              </div>
            </div>

            <button
              type="button"
              className="btn-hampi-listen"
              onClick={handleListenHampi}
              title={isSpeakingHampi ? (isKn ? 'ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ' : 'Stop Audio') : (isKn ? 'ವಿವರಣೆ ಕೇಳಿ' : 'Listen aloud')}
              aria-label={isKn ? 'ಕೇಳಿ' : 'Listen'}
            >
              {isSpeakingHampi ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isSpeakingHampi ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಕೇಳಿ' : 'Listen')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

