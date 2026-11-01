import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * PremiumInteractions
 *
 * Lightweight, non-intrusive accessibility and reading utilities:
 * - Ultra-thin, non-distracting reading scroll progress bar at the very top.
 * - Gentle, comfortable Back-to-Top button.
 * - Strictly NO cursor-following, NO mouse-position movement, NO 3D tilting,
 *   and NO page/background shifting while reading.
 */
export default function PremiumInteractions() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll Progress and Back-To-Top listener (Passive, pure calculation)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
          setScrollProgress(progress);
          setShowBackToTop(currentScroll > 380);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* 1. Thin Reading Scroll Progress Indicator at Top */}
      <div
        className="scroll-progress-line-container"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '3px',
          zIndex: 99999,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #F5A623 0%, #DC2626 100%)',
            transition: 'width 0.1s linear'
          }}
        />
      </div>

      {/* 2. Comfortable Floating Back-To-Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          className="back-to-top-floating-btn"
          title="ಮೇಲಕ್ಕೆ ಹೋಗಿ / Back to top"
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '1.5rem',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1.5px solid var(--color-flag-red)',
            color: 'var(--color-flag-red)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 999,
            transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease'
          }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
