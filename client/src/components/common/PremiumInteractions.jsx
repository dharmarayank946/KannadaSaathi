import React, { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

export default function PremiumInteractions() {
  // 1. Scroll Progress State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 2. Custom Cursor State
  const [isDesktop, setIsDesktop] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isInputHovered, setIsInputHovered] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef(null);

  // Check if device is desktop with mouse pointer and no reduced motion
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsDesktop(finePointer && !reducedMotion);
  }, []);

  // Scroll Progress and Back-To-Top listener
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

          // Subtle decorative parallax for hero curves if present
          const yellowCurve = document.querySelector('.hero-bg-curve-yellow');
          const redCurve = document.querySelector('.hero-bg-curve-red');
          if (yellowCurve) {
            yellowCurve.style.transform = `translateY(${currentScroll * 0.1}px) rotate(${currentScroll * 0.02}deg)`;
          }
          if (redCurve) {
            redCurve.style.transform = `translateY(${currentScroll * 0.08}px) rotate(-${currentScroll * 0.02}deg)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth lerp loop for custom cursor ring
  useEffect(() => {
    if (!isDesktop) return;

    const renderCursor = () => {
      // Lerp for outer ring
      ringPos.current.x += (cursorPos.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (cursorPos.y - ringPos.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(renderCursor);
    };

    animFrameRef.current = requestAnimationFrame(renderCursor);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [cursorPos, isDesktop]);

  // Mouse move listener for custom cursor
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      if (!cursorVisible) setCursorVisible(true);

      const target = e.target;
      if (!target) return;

      // Check if cursor is over input fields
      const isInput = !!target.closest('input, textarea, select, [contenteditable="true"]');
      setIsInputHovered(isInput);

      // Check if cursor is over clickable elements
      const isClickable = !!target.closest(
        'button, a, [role="button"], .clickable, .filter-chip, .btn, .vocab-card, .heritage-showcase-card, .feature-card-item, .dialogue-bubble-card, .learning-shortcut-tile'
      );
      setIsHovered(isClickable && !isInput);
    };

    const handleMouseLeaveWindow = () => {
      setCursorVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setCursorVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [isDesktop, cursorVisible]);

  // 3D Tilt Cards & Magnetic Buttons effect
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (reducedMotion || isTouch) return;

    // 1. 3D Tilt Cards
    const cardSelectors =
      '.heritage-showcase-card, .feature-card-item, .vocab-card, .dialogue-bubble-card, .learning-shortcut-tile, .learning-shortcut-card, .card-box';
    const cards = document.querySelectorAll(cardSelectors);

    const handleCardMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
      const rotateY = ((x - centerX) / centerX) * 6;  // max -6 to +6 deg

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease-out';
    };

    const handleCardMouseLeave = (e) => {
      const card = e.currentTarget;
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.4s ease-out';
    };

    cards.forEach((card) => {
      card.addEventListener('mousemove', handleCardMouseMove);
      card.addEventListener('mouseleave', handleCardMouseLeave);
    });

    // 2. Magnetic Buttons & Navigation Links
    const buttonSelectors =
      '.btn-hero-primary-speak, .btn-hero-secondary-explore, .btn-primary, .btn-widget-open-full, .btn-view-details, .btn-magnetic, .nav-link-item, .fullscreen-close-btn, .btn-3d-physical';
    const buttons = document.querySelectorAll(buttonSelectors);

    const handleButtonMouseMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const pullX = x * 0.22; // subtle magnetic pull (max ~6px)
      const pullY = y * 0.22;

      btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0) scale(1.02)`;
      btn.style.transition = 'transform 0.12s ease-out';
    };

    const handleButtonMouseLeave = (e) => {
      const btn = e.currentTarget;
      btn.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
      btn.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    };

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', handleButtonMouseMove);
      btn.addEventListener('mouseleave', handleButtonMouseLeave);
    });

    // 3. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleCardMouseMove);
        card.removeEventListener('mouseleave', handleCardMouseLeave);
      });
      buttons.forEach((btn) => {
        btn.removeEventListener('mousemove', handleButtonMouseMove);
        btn.removeEventListener('mouseleave', handleButtonMouseLeave);
      });
      observer.disconnect();
    };
  });

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* 1. Thin Scroll Progress Indicator at Top */}
      <div
        className="scroll-progress-line-container"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '3.5px',
          zIndex: 99999,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #F5A623 0%, #DC2626 50%, #991B1B 100%)',
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)',
            transition: 'width 0.1s ease-out'
          }}
        />
      </div>

      {/* 2. Creative Floating Back-To-Top Button */}
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
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 999,
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* 3. Subtle Creative Custom Cursor (Desktop Pointer Only) */}
      {isDesktop && cursorVisible && (
        <div
          className="custom-cursor-layer"
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            pointerEvents: 'none',
            zIndex: 999999,
            opacity: isInputHovered ? 0 : 1,
            transition: 'opacity 0.15s ease'
          }}
        >
          {/* Inner Sharp Dot */}
          <div
            ref={dotRef}
            className={`custom-cursor-dot ${isHovered ? 'hovered' : ''}`}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#DC2626',
              boxShadow: '0 0 4px rgba(245, 166, 35, 0.8)',
              marginTop: '-4px',
              marginLeft: '-4px',
              pointerEvents: 'none',
              transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
              transition: 'width 0.2s ease, height 0.2s ease'
            }}
          />

          {/* Smooth Trailing Outer Ring */}
          <div
            ref={ringRef}
            className={`custom-cursor-ring ${isHovered ? 'hovered' : ''}`}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: isHovered ? '46px' : '30px',
              height: isHovered ? '46px' : '30px',
              borderRadius: '50%',
              border: isHovered ? '1.5px solid #F5A623' : '1.5px solid rgba(220, 38, 38, 0.45)',
              background: isHovered ? 'rgba(245, 166, 35, 0.1)' : 'transparent',
              marginTop: isHovered ? '-23px' : '-15px',
              marginLeft: isHovered ? '-23px' : '-15px',
              pointerEvents: 'none',
              transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease'
            }}
          />
        </div>
      )}
    </>
  );
}
