import React, { useState, useEffect } from 'react';
import { Award, Sparkles, Calendar, Clock, Flag } from 'lucide-react';
import { getRajyotsavaStatus } from '../../utils/karnatakaFestivalCalendar';

/**
 * RajyotsavaLiveTracker
 *
 * Real-time, date-accurate live tracker for Kannada Rajyotsava:
 * - Formation date: November 1, 1956
 * - Today: Nov 1, 2026 -> 70th Anniversary
 * - On Nov 1: Renders active statewide celebration banner (No countdown)
 * - Rest of year: Dynamic live countdown (Days, Hours, Minutes, Seconds)
 * - Auto-rolls over to next year after Nov 1
 * - Live second-by-second tick in Asia/Kolkata timezone
 */
export default function RajyotsavaLiveTracker({ langMode = 'kn', variant = 'full' }) {
  const isKn = langMode === 'kn';
  const [status, setStatus] = useState(() => getRajyotsavaStatus());

  useEffect(() => {
    // Live update every second
    const timer = setInterval(() => {
      setStatus(getRajyotsavaStatus());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    isToday,
    celebrationYear,
    anniversaryNumber,
    days,
    hours,
    minutes,
    seconds,
    messageKn,
    messageEn
  } = status;

  // Convert numbers to Kannada numerals if in Kannada mode
  const toKnNum = (num) => {
    if (!isKn) return String(num).padStart(2, '0');
    const knDigits = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];
    return String(num)
      .split('')
      .map((d) => knDigits[parseInt(d, 10)] || d)
      .join('');
  };

  // Compact variant (e.g. for header, banner or modal)
  if (variant === 'compact') {
    return (
      <div
        className="rajyotsava-compact-badge"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          background: isToday ? '#FFF5F5' : '#FFFDF0',
          border: `1.5px solid ${isToday ? 'var(--color-flag-red)' : 'var(--color-flag-yellow-border)'}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          fontSize: '0.84rem'
        }}
      >
        <span style={{ fontSize: '1rem' }}>🟡🔴</span>
        {isToday ? (
          <span style={{ fontWeight: 800, color: 'var(--color-flag-red)' }}>
            {isKn ? `ಇಂದು ೭೦ನೇ ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ ಸಂಭ್ರಮ!` : `Happy 70th Kannada Rajyotsava!`}
          </span>
        ) : (
          <span style={{ fontWeight: 700, color: '#854D0E' }}>
            {isKn
              ? `${toKnNum(anniversaryNumber)}ನೇ ರಾಜ್ಯೋತ್ಸವಕ್ಕೆ: ${toKnNum(days)} ದಿನಗಳು`
              : `${anniversaryNumber}th Rajyotsava in: ${days} days`}
          </span>
        )}
      </div>
    );
  }

  // Full Feature Card Variant
  return (
    <div
      className="card-box rajyotsava-tracker-card"
      style={{
        background: isToday
          ? 'linear-gradient(135deg, #FFF9F9 0%, #FFFDF5 50%, #FFF5F5 100%)'
          : 'linear-gradient(135deg, #FFFDF8 0%, #FFFDF5 100%)',
        border: `2px solid ${isToday ? 'var(--color-flag-red)' : 'var(--color-flag-yellow-border)'}`,
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        margin: '1.25rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Banner Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F5A623 0%, #DC2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 3px 8px rgba(220, 38, 38, 0.25)'
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-flag-red)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {isToday
                ? (isKn ? '✦ ಇಂದು ಐತಿಹಾಸಿಕ ಸಂಭ್ರಮ • OFFICIAL CELEBRATION' : '✦ OFFICIAL CELEBRATION TODAY')
                : (isKn ? '✦ ನೈಜ-ಸಮಯ ಕ್ಷಣಗಣನೆ • LIVE ACCURATE COUNTDOWN' : '✦ REAL-TIME DATE ACCURATE COUNTDOWN')}
            </div>
            <h3 className="kn-heading" style={{ margin: 0, fontSize: '1.15rem', color: '#111827' }}>
              {isKn
                ? `ಕರ್ನಾಟಕ ಏಕೀಕರಣ & ರಾಜ್ಯೋತ್ಸವ (೧೯೫೬ — ${celebrationYear})`
                : `Karnataka Unification & Rajyotsava (1956 — ${celebrationYear})`}
            </h3>
          </div>
        </div>

        {/* Anniversary Pill */}
        <div
          style={{
            background: isToday ? 'var(--color-flag-red)' : '#FEF3C7',
            color: isToday ? '#FFFFFF' : '#B45309',
            fontWeight: 800,
            fontSize: '0.82rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Sparkles size={14} />
          <span>
            {isKn
              ? `${toKnNum(anniversaryNumber)}ನೇ ವಾರ್ಷಿಕೋತ್ಸವ`
              : `${anniversaryNumber}th Anniversary`}
          </span>
        </div>
      </div>

      {/* Main Body: If Today -> Celebration View; Else -> Accurate Ticker */}
      {isToday ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '14px',
            padding: '1.25rem',
            border: '1.5px solid var(--color-flag-red-border, #FECACA)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>
            💛🔴 🎊 💛🔴
          </div>
          <h4
            className="kn-heading"
            style={{
              fontSize: '1.35rem',
              color: 'var(--color-flag-red)',
              margin: '0.25rem 0 0.5rem 0',
              fontWeight: 900
            }}
          >
            {isKn
              ? `ಇಂದು ೭೦ನೇ ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ ದಿನದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು!`
              : `Happy 70th Karnataka Rajyotsava (Formation Day) Today!`}
          </h4>
          <p
            className="kn-text"
            style={{
              fontSize: '0.92rem',
              color: '#4B5563',
              maxWidth: '720px',
              margin: '0 auto 0.75rem auto',
              lineHeight: 1.55
            }}
          >
            {isKn
              ? '೧ ನವೆಂಬರ್ ೧೯೫೬ ರಂದು ಮೈಸೂರು ರಾಜ್ಯವಾಗಿ ಉದಯಿಸಿ, ೧೯೭೩ ರಲ್ಲಿ "ಕರ್ನಾಟಕ" ಎಂದು ಮರುನಾಮಕರಣಗೊಂಡ ನಮ್ಮ ಹೆಮ್ಮೆಯ ನಾಡಿಗೆ ೭೦ ವರ್ಷಗಳ ಸುವರ್ಣ ಸಂಭ್ರಮ. ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ!'
              : 'Commemorating the historic formation of unified Karnataka on November 1, 1956. Celebrating 70 proud years of Kannada language, culture, and rich heritage across the state.'}
          </p>
          <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', background: '#FEF3C7', color: '#92400E', padding: '0.25rem 0.65rem', borderRadius: '8px', fontWeight: 700 }}>
              ✓ ಅಧಿಕೃತ ದಿನಾಂಕ: ನವೆಂಬರ್ ೧ (November 1)
            </span>
            <span style={{ fontSize: '0.8rem', background: '#FEE2E2', color: '#991B1B', padding: '0.25rem 0.65rem', borderRadius: '8px', fontWeight: 700 }}>
              ✓ ಸ್ಥಾಪನೆ: ೧ ನವೆಂಬರ್ ೧೯೫೬ (1956)
            </span>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#4B5563' }}>
            {isKn
              ? `ಮುಂದಿನ ${toKnNum(anniversaryNumber)}ನೇ ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವಕ್ಕೆ (೧ ನವೆಂಬರ್ ${celebrationYear}) ಉಳಿದಿರುವ ನಿಖರ ಸಮಯ:`
              : `Accurate live countdown to the ${anniversaryNumber}th Karnataka Rajyotsava (November 1, ${celebrationYear}):`}
          </p>

          {/* 4 Unit Live Countdown Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              maxWidth: '560px'
            }}
          >
            {/* Days */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--color-flag-yellow-border)',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-flag-red)' }}>
                {toKnNum(days)}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280' }}>
                {isKn ? 'ದಿನಗಳು' : 'Days'}
              </div>
            </div>

            {/* Hours */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--color-flag-yellow-border)',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#B45309' }}>
                {toKnNum(hours)}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280' }}>
                {isKn ? 'ಗಂಟೆಗಳು' : 'Hours'}
              </div>
            </div>

            {/* Minutes */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--color-flag-yellow-border)',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1F2937' }}>
                {toKnNum(minutes)}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280' }}>
                {isKn ? 'ನಿಮಿಷಗಳು' : 'Minutes'}
              </div>
            </div>

            {/* Seconds */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid var(--color-flag-yellow-border)',
                borderRadius: '12px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-flag-red)' }}>
                {toKnNum(seconds)}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280' }}>
                {isKn ? 'ಸೆಕೆಂಡುಗಳು' : 'Seconds'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

