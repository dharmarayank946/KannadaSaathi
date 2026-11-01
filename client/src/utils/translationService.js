/**
 * translationService.js
 * Production-grade, high-reliability translation service for KannadaSaathi.
 *
 * Multi-Tier Resilient Translation Architecture:
 * 1. Verified Spoken Dictionary: Instant zero-latency lookup for common everyday phrases.
 * 2. Backend Translation API: Calls /api/translate or localhost:5000/api/translate (with Gemini AI if configured).
 * 3. Direct Google Neural Gateway: Instant, high-accuracy neural translation for arbitrary sentences.
 * 4. MyMemory Neural Gateway: Secondary fallback service.
 *
 * Never returns fake translations. Returns structured result or descriptive error.
 */

// Curated high-frequency spoken bilingual phrases for instant match
export const VERIFIED_SPOKEN_PHRASES = [
  { en: 'Where is the bus stand?', kn: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?' },
  { en: 'Where is the bus stop?', kn: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?' },
  { en: 'How much does this cost?', kn: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?' },
  { en: 'How much is this?', kn: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?' },
  { en: 'Please use the meter.', kn: 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ.' },
  { en: 'I am learning Kannada, please speak slowly.', kn: 'ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.' },
  { en: 'Where can I find authentic Mysore Masala Dosa?', kn: 'ಅಸಲಿ ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?' },
  { en: 'Thank you very much for your help.', kn: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು.' },
  { en: 'Thank you very much.', kn: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು.' },
  { en: 'Thank you.', kn: 'ಧನ್ಯವಾದಗಳು.' },
  { en: 'Hello, how are you?', kn: 'ನಮಸ್ಕಾರ, ಹೇಗಿದ್ದೀರಿ?' },
  { en: 'Hello.', kn: 'ನಮಸ್ಕಾರ.' },
  { en: 'Good morning.', kn: 'ಶುಭೋದಯ.' },
  { en: 'Good night.', kn: 'ಶುಭ ರಾತ್ರಿ.' },
  { en: 'What is your name?', kn: 'ನಿಮ್ಮ ಹೆಸರೇನು?' },
  { en: 'My name is KannadaSaathi.', kn: 'ನನ್ನ ಹೆಸರು ಕನ್ನಡಸಾಥಿ.' },
  { en: 'Where are you going?', kn: 'ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?' },
  { en: 'I need water.', kn: 'ನನಗೆ ನೀರು ಬೇಕು.' },
  { en: 'Help me please.', kn: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ.' }
];

/**
 * Transliterate basic Kannada script phonetically to Latin
 */
export function simpleTransliterate(knText) {
  if (!knText || typeof knText !== 'string') return '';
  const charMap = {
    'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo', 'ಋ': 'ru',
    'ಎ': 'e', 'ಏ': 'ae', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oa', 'ಔ': 'au', 'ಅಂ': 'am', 'ಅಃ': 'ah',
    'ಕ': 'ka', 'ಖ': 'kha', 'ಗ': 'ga', 'ಘ': 'gha', 'ಙ': 'nga',
    'ಚ': 'cha', 'ಛ': 'chha', 'ಜ': 'ja', 'ಝ': 'jha', 'ಞ': 'nya',
    'ಟ': 'ta', 'ಠ': 'tha', 'ಡ': 'da', 'ಢ': 'dha', 'ಣ': 'na',
    'ತ': 'tha', 'ಥ': 'thha', 'ದ': 'dha', 'ಧ': 'dhha', 'ನ': 'na',
    'ಪ': 'pa', 'ಫ': 'pha', 'ಬ': 'ba', 'ಭ': 'bha', 'ಮ': 'ma',
    'ಯ': 'ya', 'ರ': 'ra', 'ಲ': 'la', 'ವ': 'va', 'ಶ': 'sha', 'ಷ': 'ssha', 'ಸ': 'sa', 'ಹ': 'ha', 'ಳ': 'la'
  };
  let result = '';
  for (const char of knText) {
    result += charMap[char] || char;
  }
  return result;
}

/**
 * Clean and normalize text for dictionary matching
 */
function normalizeQuery(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[.,?!;:।॥"'\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Main translation execution function
 *
 * @param {Object} options
 * @param {string} options.text - Input query
 * @param {string} [options.sourceLang='en'] - Source language code ('en', 'kn', 'hi', etc.)
 * @param {string} [options.targetLang='kn'] - Target language code ('kn', 'en', etc.)
 * @returns {Promise<{ success: boolean, translatedText: string, transliteration: string, engine: string, error?: string }>}
 */
export async function translateText(textOrOptions, optSourceLang = 'en', optTargetLang = 'kn') {
  let text = '';
  let sourceLang = 'en';
  let targetLang = 'kn';

  if (typeof textOrOptions === 'object' && textOrOptions !== null) {
    text = textOrOptions.text || '';
    sourceLang = textOrOptions.sourceLang || 'en';
    targetLang = textOrOptions.targetLang || 'kn';
  } else {
    text = textOrOptions || '';
    sourceLang = optSourceLang || 'en';
    targetLang = optTargetLang || 'kn';
  }

  const cleanInput = (text || '').trim();
  if (!cleanInput) {
    return {
      success: false,
      error: 'Empty input text'
    };
  }

  // Identity translation
  if (sourceLang === targetLang) {
    return {
      success: true,
      originalText: cleanInput,
      translatedText: cleanInput,
      transliteration: targetLang === 'kn' ? simpleTransliterate(cleanInput) : '',
      engine: 'Identity (Same Language)'
    };
  }

  // -------------------------------------------------------------
  // TIER 1: Instant Local Verified Spoken Dictionary Match
  // -------------------------------------------------------------
  const normalized = normalizeQuery(cleanInput);
  const dictMatch = VERIFIED_SPOKEN_PHRASES.find((p) => {
    const srcNorm = normalizeQuery(p[sourceLang] || '');
    return srcNorm === normalized;
  });

  if (dictMatch && dictMatch[targetLang]) {
    const translation = dictMatch[targetLang];
    return {
      success: true,
      originalText: cleanInput,
      translatedText: translation,
      transliteration: targetLang === 'kn' ? simpleTransliterate(translation) : '',
      engine: 'ಪರಿಶೀಲಿತ ಶಬ್ದಕೋಶ (Verified Spoken Dictionary)',
      mode: 'dictionary'
    };
  }

  // -------------------------------------------------------------
  // TIER 2: Direct Google Neural Translation RPC (Fast, Free, No API Key Required)
  // Works seamlessly for both KN -> EN and EN -> KN
  // -------------------------------------------------------------
  try {
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang)}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(cleanInput)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const gRes = await fetch(gUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (gRes.ok) {
      const gData = await gRes.json();
      if (Array.isArray(gData) && Array.isArray(gData[0])) {
        const fullTranslation = gData[0]
          .filter((seg) => seg && typeof seg[0] === 'string')
          .map((seg) => seg[0])
          .join('')
          .trim();

        if (fullTranslation) {
          return {
            success: true,
            originalText: cleanInput,
            translatedText: fullTranslation,
            transliteration: targetLang === 'kn' ? simpleTransliterate(fullTranslation) : '',
            engine: 'Google Live Neural Gateway',
            mode: 'neural'
          };
        }
      }
    }
  } catch (gErr) {
    // Proceed to Tier 3 if Google RPC was blocked or timed out
  }

  // -------------------------------------------------------------
  // TIER 3: Backend API Service (/api/translate or localhost:5000)
  // -------------------------------------------------------------
  try {
    let bResp = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanInput, sourceLang, targetLang })
    });

    if (!bResp.ok) {
      bResp = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanInput, sourceLang, targetLang })
      });
    }

    if (bResp && bResp.ok) {
      const bData = await bResp.json();
      if (bData.success && bData.translatedText) {
        return {
          success: true,
          originalText: cleanInput,
          translatedText: bData.translatedText,
          transliteration: bData.transliteration || (targetLang === 'kn' ? simpleTransliterate(bData.translatedText) : ''),
          engine: bData.engine || 'KannadaSaathi Backend Engine',
          mode: bData.mode || 'backend'
        };
      }
    }
  } catch (bErr) {
    // Proceed to Tier 4
  }

  // -------------------------------------------------------------
  // TIER 4: MyMemory Neural Translation Service (Public Fallback)
  // -------------------------------------------------------------
  try {
    const pair = `${sourceLang}|${targetLang}`;
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanInput)}&langpair=${encodeURIComponent(pair)}`;
    const mResp = await fetch(myMemoryUrl);

    if (mResp.ok) {
      const mData = await mResp.json();
      if (mData?.responseData?.translatedText) {
        const cleanedM = mData.responseData.translatedText.trim();
        if (cleanedM && !cleanedM.toUpperCase().includes('QUERY LENGTH LIMIT')) {
          return {
            success: true,
            originalText: cleanInput,
            translatedText: cleanedM,
            transliteration: targetLang === 'kn' ? simpleTransliterate(cleanedM) : '',
            engine: 'MyMemory Live Neural Translation',
            mode: 'mymemory'
          };
        }
      }
    }
  } catch (mErr) {
    // Failed all tiers
  }

  // Failure fallback
  return {
    success: false,
    error: 'ಅನುವಾದ ಸೇವೆ ತಲುಪಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನೆಟ್‌ವರ್ಕ್ ಪರಿಶೀಲಿಸಿ ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
  };
}
