import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/home/HomePage';
import ExploreSection from './components/sections/ExploreSection';
import TeacherSection from './components/sections/TeacherSection';
import KidsSection from './components/sections/KidsSection';
import GamesSection from './components/sections/GamesSection';
import EverydaySection from './components/sections/EverydaySection';
import StoriesSection from './components/sections/StoriesSection';
import StudentSection from './components/sections/StudentSection';
import CompanionSection from './components/sections/CompanionSection';
import HeritageSection from './components/sections/HeritageSection';
import ProfilePage from './components/profile/ProfilePage';
import HistoryModal from './components/HistoryModal';
import SettingsModal from './components/SettingsModal';
import FloatingHeritageAssistant from './components/chat/FloatingHeritageAssistant';
import PremiumInteractions from './components/common/PremiumInteractions';
import PageAtmosphere from './components/common/PageAtmosphere';

const LANG_STORAGE_KEY = 'kannada_saathi_lang';

export default function App() {
  const [currentSection, setCurrentSection] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        const valid = ['home', 'everyday', 'teacher', 'stories', 'student', 'heritage', 'profile'];
        if (valid.includes(hash)) return hash;
      }
    } catch (e) {}
    return 'home';
  }); 
  // 'home' | 'everyday' | 'teacher' | 'stories' | 'student' | 'heritage' | 'profile'
  const [heritageInitialTab, setHeritageInitialTab] = useState('all');
  const [heritageInitialQuery, setHeritageInitialQuery] = useState('');
  
  // Persisted language state
  const [langMode, setLangModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'kn') return saved;
    } catch (e) {}
    return 'kn';
  });

  const setLangMode = useCallback((mode) => {
    const validMode = mode === 'en' ? 'en' : 'kn';
    setLangModeState(validMode);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, validMode);
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = langMode;
    } catch (e) {}
  }, [langMode]);

  // Permanently enforce Light Mode only across the entire application
  useEffect(() => {
    try {
      localStorage.removeItem('kannada_saathi_theme');
      document.documentElement.setAttribute('data-theme', 'light');
    } catch (e) {}
  }, []);

  const isKn = langMode === 'kn';
  const [speechRate, setSpeechRate] = useState(0.95);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Activity History in localStorage
  const [activityHistory, setActivityHistory] = useState(() => {
    const saved = localStorage.getItem('kannada_saathi_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { type: 'teacher', title: 'ದಿನದ ೧೫ ನಿಮಿಷಗಳ ಕನ್ನಡ ಪಾಠ ಆರಂಭ / Started 15-min Kannada lesson', timestamp: 'ಇತ್ತೀಚೆಗೆ' },
      { type: 'games', title: 'ಚಿತ್ರ ಮತ್ತು ಪದ ಹೊಂದಾಣಿಕೆ ಆಟ / Picture and word match game', timestamp: 'ಇತ್ತೀಚೆಗೆ' }
    ];
  });

  // Server health check
  const [serverStatus, setServerStatus] = useState({ connected: false, checked: false });

  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  // Global High-Performance Scroll-Triggered Reveal Observer
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const observeElements = () => {
      const targets = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
      targets.forEach((el) => observer.observe(el));
    };

    observeElements();
    const timer = setTimeout(observeElements, 250);
    const interval = setInterval(observeElements, 1200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentSection]);

  const checkServerHealth = async () => {
    try {
      let res = null;
      try {
        res = await fetch('/api/health');
      } catch (e) {
        res = await fetch('http://localhost:5000/api/health');
      }
      if (res && res.ok) {
        const data = await res.json();
        setServerStatus({ connected: true, checked: true, details: data });
      } else {
        setServerStatus({ connected: false, checked: true });
      }
    } catch (e) {
      setServerStatus({ connected: false, checked: true });
    }
  };

  // Synchronize Browser Back / Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const hash = (window.location.hash || '').replace('#', '');
      const validSections = ['home', 'everyday', 'teacher', 'stories', 'student', 'heritage', 'profile'];
      const next = validSections.includes(hash) ? hash : 'home';
      setCurrentSection(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const applyNavigation = (secId, initialTab = 'all', initialQuery = '', updateHistory = true) => {
    if (secId === 'translator') {
      setCurrentSection('home');
      setTimeout(() => {
        const el = document.getElementById('home-shared-phone-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return;
    }

    const targetSection = secId === 'explore' ? 'heritage' : (secId === 'kids' ? 'teacher' : secId);
    setCurrentSection(targetSection);

    if (targetSection === 'heritage') {
      setHeritageInitialTab(initialTab || 'all');
      setHeritageInitialQuery(initialQuery || '');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });

    if (updateHistory) {
      try {
        const newHash = targetSection === 'home' ? '' : `#${targetSection}`;
        if (window.location.hash !== newHash) {
          window.history.pushState({ section: targetSection }, '', newHash || window.location.pathname);
        }
      } catch (e) {}
    }

    setActivityHistory((prev) => {
      const title = isKn ? `ವಿಭಾಗ ವೀಕ್ಷಣೆ: ${targetSection}` : `Opened section: ${targetSection}`;
      const timeStr = isKn ? 'ಈಗಷ್ಟೇ' : 'Just now';
      const updated = [
        { type: targetSection, title, timestamp: timeStr },
        ...prev.slice(0, 20)
      ];
      try {
        localStorage.setItem('kannada_saathi_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleSelectSection = (secId, initialTab = 'all', initialQuery = '', clickEvent = null) => {
    if (secId === 'translator') {
      if (currentSection !== 'home') {
        setCurrentSection('home');
      }
      setTimeout(() => {
        const el = document.getElementById('home-shared-phone-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return;
    }

    const targetSection = secId === 'explore' ? 'heritage' : (secId === 'kids' ? 'teacher' : secId);
    if (targetSection === currentSection) return;

    // Detect click coordinates for smooth circular reveal on destination page
    const evt =
      initialTab && typeof initialTab === 'object' && ('clientX' in initialTab || 'nativeEvent' in initialTab)
        ? initialTab
        : (clickEvent && typeof clickEvent === 'object' && ('clientX' in clickEvent || 'nativeEvent' in clickEvent)
            ? clickEvent
            : null);

    const clientX = evt?.clientX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    const clientY = evt?.clientY ?? (typeof window !== 'undefined' ? 70 : 0);

    try {
      document.documentElement.style.setProperty('--click-x', `${Math.round(clientX)}px`);
      document.documentElement.style.setProperty('--click-y', `${Math.round(clientY)}px`);
    } catch (e) {}

    const actualTab = typeof initialTab === 'string' ? initialTab : 'all';
    const actualQuery = typeof initialQuery === 'string' ? initialQuery : '';

    // Instantaneous, non-blocking navigation — destination page mounts immediately
    applyNavigation(targetSection, actualTab, actualQuery);
  };

  const handleResetToHome = (clickEvent = null) => {
    if (currentSection === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    handleSelectSection('home', 'all', '', clickEvent);
  };

  return (
    <div className="app-container">
      {/* Premium Website Interactions (Scroll progress, custom cursor, back-to-top) */}
      <PremiumInteractions />

      {/* Top Sticky Navbar */}
      <Navbar
        langMode={langMode}
        setLangMode={setLangMode}
        serverStatus={serverStatus}
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        onResetToHome={handleResetToHome}
      />

      {/* Main Dynamic Workspace with Smooth Page Transition & Cultural Atmosphere */}
      <main className={`main-platform-workspace section-theme-${currentSection}`}>
        {/* Dynamic Multi-Layered Cultural Background Atmosphere */}
        <PageAtmosphere currentSection={currentSection} />

        <div key={currentSection} className={`page-transition-wrap page-content-${currentSection}`}>
          {currentSection === 'home' && (
            <HomePage
              onSelectSection={handleSelectSection}
              langMode={langMode}
            />
          )}

          {currentSection === 'explore' && (
            <ExploreSection
              onBackToHome={handleResetToHome}
              langMode={langMode}
              onSwitchSection={handleSelectSection}
            />
          )}

          {currentSection === 'teacher' && (
            <TeacherSection
              onBackToHome={handleResetToHome}
              langMode={langMode}
            />
          )}

          {currentSection === 'kids' && (
            <KidsSection
              onBackToHome={handleResetToHome}
              langMode={langMode}
            />
          )}

          {currentSection === 'games' && (
            <GamesSection
              onBackToHome={handleResetToHome}
              langMode={langMode}
            />
          )}

          {currentSection === 'everyday' && (
            <EverydaySection
              onBackToHome={handleResetToHome}
              langMode={langMode}
            />
          )}

          {currentSection === 'stories' && (
            <StoriesSection
              onBackToHome={handleResetToHome}
              langMode={langMode}
            />
          )}

          {currentSection === 'student' && (
            <StudentSection
              onBackToHome={handleResetToHome}
              langMode={langMode}
            />
          )}

          {currentSection === 'companion' && (
            <CompanionSection
              onBackToHome={handleResetToHome}
              langMode={langMode}
            />
          )}

          {currentSection === 'heritage' && (
            <HeritageSection
              onBackToHome={handleResetToHome}
              langMode={langMode}
              initialCategory={heritageInitialTab}
              initialQuery={heritageInitialQuery}
            />
          )}

          {currentSection === 'profile' && (
            <ProfilePage
              onBackToHome={handleResetToHome}
              langMode={langMode}
              setLangMode={setLangMode}
              speechRate={speechRate}
              setSpeechRate={setSpeechRate}
            />
          )}
        </div>
      </main>

      {/* History and Settings Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={activityHistory}
        langMode={langMode}
        onClearHistory={() => {
          setActivityHistory([]);
          localStorage.removeItem('kannada_saathi_history');
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        langMode={langMode}
        setLangMode={setLangMode}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
      />

      {/* Global Floating AI Heritage Assistant (Bottom Right) */}
      <FloatingHeritageAssistant langMode={langMode} />

      {/* Footer */}
      <Footer onSelectSection={handleSelectSection} langMode={langMode} />
    </div>
  );
}
