import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from './translations';

const LanguageContext = createContext({
  langMode: 'kn',
  setLangMode: () => {},
  toggleLanguage: () => {},
  isKn: true,
  t: (keyPath, fallback = '') => fallback,
  trans: translations.kn
});

const STORAGE_KEY = 'kannada_saathi_lang';

export function LanguageProvider({ children }) {
  const [langMode, setLangModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'kn') {
        return saved;
      }
    } catch (e) {
      // localStorage may fail in private mode or restricted contexts
    }
    return 'kn';
  });

  const setLangMode = useCallback((mode) => {
    const validMode = mode === 'en' ? 'en' : 'kn';
    setLangModeState(validMode);
    try {
      localStorage.setItem(STORAGE_KEY, validMode);
    } catch (e) {
      console.warn('Failed to save language preference to localStorage:', e);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLangMode(langMode === 'kn' ? 'en' : 'kn');
  }, [langMode, setLangMode]);

  // Sync to document language and title attribute if desired
  useEffect(() => {
    try {
      document.documentElement.lang = langMode;
    } catch (e) {}
  }, [langMode]);

  const isKn = langMode === 'kn';
  const currentTranslations = translations[langMode] || translations.kn;

  // Helper t('nav.explore', 'ಅನ್ವೇಷಿಸಿ')
  const t = useCallback((keyPath, fallback = '') => {
    if (!keyPath) return fallback;
    const parts = keyPath.split('.');
    let curr = currentTranslations;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        // Fallback to Kannada translation if missing in English, then fallback arg
        let knFallback = translations.kn;
        for (const p of parts) {
          if (knFallback && typeof knFallback === 'object' && p in knFallback) {
            knFallback = knFallback[p];
          } else {
            knFallback = null;
            break;
          }
        }
        return (typeof knFallback === 'string' ? knFallback : fallback);
      }
    }
    return typeof curr === 'string' ? curr : fallback;
  }, [currentTranslations]);

  return (
    <LanguageContext.Provider
      value={{
        langMode,
        setLangMode,
        toggleLanguage,
        isKn,
        t,
        trans: currentTranslations
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
