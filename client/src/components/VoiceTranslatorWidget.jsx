import React, { useState, useRef, useEffect } from 'react';
import {
  Languages,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import { playSpeech, stopSpeech, useKannadaSpeech } from '../utils/kannadaSpeech';

const SUPPORTED_LANGUAGES = [
  { code: 'en', nameKn: 'ಆಂಗ್ಲ (English)', nameEn: 'English', bcp47: 'en-IN', flag: '🌐' },
  { code: 'kn', nameKn: 'ಕನ್ನಡ', nameEn: 'Kannada', bcp47: 'kn-IN', flag: '🟡🔴' },
  { code: 'hi', nameKn: 'ಹಿಂದಿ (हिंदी)', nameEn: 'Hindi', bcp47: 'hi-IN', flag: '🇮🇳' },
  { code: 'te', nameKn: 'ತೆಲುಗು (తెలుగు)', nameEn: 'Telugu', bcp47: 'te-IN', flag: '🇮🇳' },
  { code: 'ta', nameKn: 'ತಮಿಳು (தமிழ்)', nameEn: 'Tamil', bcp47: 'ta-IN', flag: '🇮🇳' },
  { code: 'mr', nameKn: 'ಮರಾಠಿ (मराठी)', nameEn: 'Marathi', bcp47: 'mr-IN', flag: '🇮🇳' }
];

const QUICK_PHRASE_SAMPLES = [
  { en: 'Where is the bus stand?', kn: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?' },
  { en: 'How much does this cost?', kn: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?' },
  { en: 'Please use the meter.', kn: 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ.' },
  { en: 'I am learning Kannada, please speak slowly.', kn: 'ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.' },
  { en: 'Where can I find authentic Mysore Masala Dosa?', kn: 'ಅಸಲಿ ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?' },
  { en: 'Thank you very much for your help.', kn: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು.' }
];

export default function VoiceTranslatorWidget({
  langMode = 'kn',
  onOpenFullTranslator,
  titleKn,
  titleEn,
  badgeKn,
  badgeEn,
  descKn,
  descEn
}) {
  const isKn = langMode === 'kn';
  const { isSpeaking, activeId } = useKannadaSpeech();

  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('kn');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef(null);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) { }
      }
    };
  }, []);

  const handleSwapLanguages = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);

    if (result && result.translatedText) {
      setInputText(result.translatedText);
      setResult({
        originalText: result.translatedText,
        translatedText: result.originalText,
        sourceLang: prevTgt,
        targetLang: prevSrc,
        engine: result.engine
      });
    }
  };

  const handleTranslate = async (overrideText = null) => {
    const query = (overrideText !== null ? overrideText : inputText).trim();
    if (!query) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Step 1: Check verified local spoken dictionary for instantaneous zero-latency match
      const cleanQ = query.toLowerCase().trim().replace(/[.,?!]+$/, '');
      const dictMatch = QUICK_PHRASE_SAMPLES.find(
        (p) => (p[sourceLang] || '').toLowerCase().trim().replace(/[.,?!]+$/, '') === cleanQ
      );

      if (dictMatch && dictMatch[targetLang]) {
        const translated = dictMatch[targetLang];
        setResult({
          originalText: query,
          translatedText: translated,
          transliteration: '',
          engine: isKn ? 'ಪರಿಶೀಲಿತ ಶಬ್ದಕೋಶ (Verified Spoken Dictionary)' : 'Verified Spoken Dictionary',
          sourceLang,
          targetLang
        });
        playSpeech({
          text: translated,
          lang: targetLang,
          id: `widget-${translated.slice(0, 30)}`
        });
        setIsLoading(false);
        return;
      }

      // Step 2: Try Backend API (/api/translate or localhost:5000/api/translate)
      let translatedText = '';
      let transliteration = '';
      let engineName = '';

      try {
        let resp = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: query, sourceLang, targetLang })
        });

        if (!resp.ok) {
          resp = await fetch('http://localhost:5000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: query, sourceLang, targetLang })
          });
        }

        if (resp.ok) {
          const data = await resp.json();
          if (data.success && data.translatedText) {
            translatedText = data.translatedText;
            transliteration = data.transliteration || '';
            engineName = data.engine || 'KannadaSaathi Live Neural Engine';
          }
        }
      } catch (backendErr) {
        console.warn('Backend translation service unreachable, trying direct neural service:', backendErr);
      }

      // Step 3: Direct Neural Service Fallback (Google Neural & MyMemory)
      if (!translatedText) {
        try {
          const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang)}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(query)}`;
          const gRes = await fetch(gUrl);
          if (gRes.ok) {
            const gData = await gRes.json();
            if (Array.isArray(gData) && Array.isArray(gData[0])) {
              const fullTranslation = gData[0]
                .filter((seg) => seg && typeof seg[0] === 'string')
                .map((seg) => seg[0])
                .join('')
                .trim();
              if (fullTranslation) {
                translatedText = fullTranslation;
                engineName = 'Google Live Neural Gateway';
              }
            }
          }
        } catch (gErr) {
          // Continue to MyMemory fallback
        }

        if (!translatedText) {
          try {
            const neuralUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${sourceLang}|${targetLang}`;
            const neuralResp = await fetch(neuralUrl);
            if (neuralResp.ok) {
              const neuralData = await neuralResp.json();
              if (neuralData.responseData && neuralData.responseData.translatedText) {
                const cleanedNeural = neuralData.responseData.translatedText.trim();
                if (cleanedNeural && !cleanedNeural.toUpperCase().includes('QUERY LENGTH LIMIT')) {
                  translatedText = cleanedNeural;
                  engineName = 'MyMemory Live Neural Translation';
                }
              }
            }
          } catch (neuralErr) {
            console.warn('Direct neural service error:', neuralErr);
          }
        }
      }

      // If valid translation obtained
      if (translatedText) {
        const resObj = {
          originalText: query,
          translatedText,
          transliteration,
          engine: engineName,
          sourceLang,
          targetLang
        };
        setResult(resObj);

        // Read aloud translated text in target language
        playSpeech({
          text: translatedText,
          lang: targetLang,
          id: `widget-${translatedText.slice(0, 30)}`
        });
      } else {
        setErrorMsg(
          isKn
            ? 'ಅನುವಾದ ಪ್ರಕ್ರಿಯೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
            : 'Translation service could not be reached. Please check network and try again.'
        );
      }
    } catch (err) {
      console.error('Translation error:', err);
      setErrorMsg(
        isKn
          ? 'ಅನುವಾದ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ತಾಂತ್ರಿಕ ಅಡಚಣೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
          : 'Translation request failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSpeechRecognition = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg(
        isKn
          ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ Web Speech Recognition ಬೆಂಬಲವಿಲ್ಲ. ದಯವಿಟ್ಟು ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಿ.'
          : 'Web Speech recognition is not supported in this browser. Please type directly.'
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
      }
      setIsListening(false);
      return;
    }

    setErrorMsg(null);

    // Explicitly prompt for microphone access via getUserMedia if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (permErr) {
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
          setErrorMsg(
            isKn
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಅನುಮತಿಸಿ.'
              : 'Microphone permission denied. Please allow microphone access in your browser settings.'
          );
          setIsListening(false);
          return;
        }
      }
    }

    setIsListening(true);

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang);
      recognition.lang = langObj?.bcp47 || (sourceLang === 'kn' ? 'kn-IN' : 'en-IN');
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (e) => {
        let interim = '';
        let final = '';

        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            final += e.results[i][0].transcript;
          } else {
            interim += e.results[i][0].transcript;
          }
        }

        if (interim) {
          setInputText(interim);
        }

        if (final && final.trim()) {
          const cleanFinal = final.trim();
          setInputText(cleanFinal);
          handleTranslate(cleanFinal);
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setErrorMsg(
            isKn
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಅನುಮತಿಸಿ.'
              : 'Microphone permission denied. Please allow microphone access in browser settings.'
          );
        } else if (e.error === 'no-speech') {
          // Soft notice, no harsh error banner
        } else if (e.error === 'network') {
          setErrorMsg(
            isKn
              ? 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಗಾಗಿ ನೆಟ್‌ವರ್ಕ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ.'
              : 'Network error occurred during speech recognition. Please check your connection.'
          );
        } else {
          setErrorMsg(isKn ? `ಧ್ವನಿ ದೋಷ: ${e.error}` : `Voice input error: ${e.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Recognition start error:', err);
      setIsListening(false);
      setErrorMsg(isKn ? 'ಮೈಕ್ ಆರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ.' : 'Could not activate microphone.');
    }
  };

  const handleSpeakResult = () => {
    if (!result || !result.translatedText) return;
    const speechId = `widget-${result.translatedText.slice(0, 30)}`;
    if (activeId === speechId && isSpeaking) {
      stopSpeech();
      return;
    }
    playSpeech({
      text: result.translatedText,
      lang: result.targetLang || targetLang,
      id: speechId
    });
  };

  const handleCopy = () => {
    if (!result || !result.translatedText) return;
    navigator.clipboard.writeText(result.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCurrentAudioPlaying = result && activeId === `widget-${result.translatedText.slice(0, 30)}` && isSpeaking;

  return (
    <div className="voice-translator-widget-root">
      {/* Widget Header Banner */}
      <div className="translator-widget-header">
        <div className="widget-header-left">
          <div className="widget-header-icon-box">
            <Languages size={24} />
          </div>
          <div>
            <div className="widget-header-badge">
              <Sparkles size={12} />
              <span>{isKn ? (badgeKn || 'ಮುಖ್ಯ ವೈಶಿಷ್ಟ್ಯ • VOICE FIRST') : (badgeEn || 'PRIMARY FEATURE • VOICE FIRST')}</span>
            </div>
            <h2 className="widget-header-title kn-heading">
              {isKn ? (titleKn || 'ಕನ್ನಡ ಧ್ವನಿ ಸಂಭಾಷಣೆ ಮತ್ತು ಅನುವಾದಕ') : (titleEn || 'Kannada Voice Conversation & Translator')}
            </h2>
            <p className="widget-header-desc kn-text">
              {isKn
                ? (descKn || 'ಮೈಕ್ರೊಫೋನ್ ಮೂಲಕ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ. ನೈಜ ಧ್ವನಿ ಉಚ್ಚಾರಣೆ ಮತ್ತು ತತ್‌ಕ್ಷಣ ಅನುವಾದ ಪಡೆಯಿರಿ.')
                : (descEn || 'Speak with your microphone or type naturally. Get instant accurate translations and real audio playback.')}
            </p>
          </div>
        </div>

        {onOpenFullTranslator && (
          <button
            type="button"
            className="btn-widget-open-full"
            onClick={onOpenFullTranslator}
            title={isKn ? 'ಪೂರ್ಣ ಅನುವಾದಕ ತೆರೆಯಿರಿ' : 'Open Full Screen Translator'}
          >
            <span>{isKn ? 'ದ್ವಿಮುಖ ಸಂವಾದ ತೆರೆಯಿರಿ' : 'Open Two-Way Duo'}</span>
            <Languages size={15} />
          </button>
        )}
      </div>

      {/* Language Bar Controls */}
      <div className="translator-lang-bar">
        {/* Source Language Selector */}
        <div className="lang-select-group">
          <label className="lang-label">{isKn ? 'ಮೂಲ ಭಾಷೆ (From)' : 'From Language'}</label>
          <select
            className="lang-select-dropdown"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {isKn ? l.nameKn : l.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          type="button"
          className="btn-lang-swap"
          onClick={handleSwapLanguages}
          title={isKn ? 'ಭಾಷೆಗಳನ್ನು ಅದಲು-ಬದಲು ಮಾಡಿ' : 'Swap languages'}
          aria-label={isKn ? 'ಭಾಷೆ ಬದಲಿಸಿ' : 'Swap languages'}
        >
          <ArrowRightLeft size={18} />
        </button>

        {/* Target Language Selector */}
        <div className="lang-select-group">
          <label className="lang-label">{isKn ? 'ಗುರಿ ಭಾಷೆ (To)' : 'To Language'}</label>
          <select
            className="lang-select-dropdown"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {isKn ? l.nameKn : l.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Two Clear Language Panels Grid */}
      <div className="translator-two-panel-grid">
        {/* PANEL 1: Input Panel */}
        <div className="translator-panel input-panel">
          <div className="panel-top-bar">
            <span className="panel-lang-badge">
              {SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.flag}{' '}
              {isKn ? SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.nameKn : SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.nameEn}
            </span>
            {inputText && (
              <button
                type="button"
                className="btn-clear-text"
                onClick={() => {
                  setInputText('');
                  setResult(null);
                  setErrorMsg(null);
                }}
                title={isKn ? 'ತೆರವುಗೊಳಿಸಿ' : 'Clear'}
              >
                <X size={15} />
                <span>{isKn ? 'ತೆರವು' : 'Clear'}</span>
              </button>
            )}
          </div>

          <textarea
            className="translator-textarea kn-text"
            placeholder={
              sourceLang === 'kn'
                ? 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...'
                : sourceLang === 'en'
                  ? 'Speak in English or type here (e.g. "Where is the bus stand?")...'
                  : 'Type or speak here...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
            rows={4}
          />

          <div className="panel-bottom-bar">
            <button
              type="button"
              className={`btn-mic-action ${isListening ? 'listening' : ''}`}
              onClick={handleStartSpeechRecognition}
              title={isListening ? (isKn ? 'ಧ್ವನಿ ಗ್ರಹಿಕೆ ನಿಲ್ಲಿಸಿ' : 'Stop Listening') : (isKn ? 'ಮೈಕ್ ಮೂಲಕ ಮಾತನಾಡಿ' : 'Speak into Microphone')}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span>{isListening ? (isKn ? 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Listening...') : (isKn ? 'ಮಾತನಾಡಿ (Mic)' : 'Speak (Mic)')}</span>
              {isListening && (
                <div className="mic-wave-pulse" aria-hidden="true">
                  <span /><span /><span />
                </div>
              )}
            </button>

            <button
              type="button"
              className="btn-submit-translate"
              onClick={() => handleTranslate()}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? (
                <div className="spinner-sm" />
              ) : (
                <Languages size={17} />
              )}
              <span>{isLoading ? (isKn ? 'ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...' : 'Translating...') : (isKn ? 'ಅನುವಾದಿಸಿ' : 'Translate')}</span>
            </button>
          </div>
        </div>

        {/* PANEL 2: Output Panel */}
        <div className="translator-panel output-panel">
          <div className="panel-top-bar">
            <span className="panel-lang-badge target">
              {SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.flag}{' '}
              {isKn ? SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.nameKn : SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.nameEn}
            </span>
            {result?.engine && (
              <span className="engine-badge">
                <Sparkles size={11} />
                <span>{result.engine}</span>
              </span>
            )}
          </div>

          <div className="output-content-area">
            {isLoading ? (
              <div className="output-loading-state">
                <div className="spinner" style={{ width: '28px', height: '28px', margin: '0 auto 10px' }} />
                <p className="kn-text" style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                  {isKn ? 'ನಿಖರ ಧ್ವನಿ ಅನುವಾದ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...' : 'Synthesizing voice translation...'}
                </p>
              </div>
            ) : result && result.translatedText ? (
              <div className="output-result-box fade-in">
                <div className="translated-main-text kn-heading">
                  {result.translatedText}
                </div>
                {result.transliteration && (
                  <div className="translated-translit-text">
                    {result.transliteration}
                  </div>
                )}
              </div>
            ) : (
              <div className="output-placeholder-state">
                <Languages size={32} style={{ color: '#D1D5DB', marginBottom: '8px' }} />
                <p className="kn-text" style={{ fontSize: '0.88rem', color: '#888', margin: 0 }}>
                  {isKn
                    ? 'ಅನುವಾದಿತ ಫಲಿತಾಂಶ ಮತ್ತು ಧ್ವನಿ ಉಚ್ಚಾರಣೆ ಇಲ್ಲಿ ಪ್ರದರ್ಶನಗೊಳ್ಳುತ್ತದೆ.'
                    : 'Translated speech output and pronunciation will appear here.'}
                </p>
              </div>
            )}
          </div>

          <div className="panel-bottom-bar output-actions">
            {result && result.translatedText ? (
              <>
                <button
                  type="button"
                  className={`btn-audio-play ${isCurrentAudioPlaying ? 'playing' : ''}`}
                  onClick={handleSpeakResult}
                  title={isCurrentAudioPlaying ? (isKn ? 'ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ' : 'Stop Audio') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen to Spoken Output')}
                >
                  {isCurrentAudioPlaying ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  <span>{isCurrentAudioPlaying ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಆಲಿಸಿ (Listen)' : 'Listen')}</span>
                </button>

                {isCurrentAudioPlaying && (
                  <div className="audio-wave-bars" aria-label="Audio wave playing" aria-hidden="true">
                    <span /><span /><span /><span /><span />
                  </div>
                )}

                <button
                  type="button"
                  className="btn-replay-action"
                  onClick={handleSpeakResult}
                  title={isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಲಿಸಿ' : 'Replay Audio'}
                >
                  <RotateCcw size={15} />
                  <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ' : 'Replay'}</span>
                </button>

                <button
                  type="button"
                  className="btn-copy-action"
                  onClick={handleCopy}
                  title={isKn ? 'ಪಠ್ಯ ನಕಲಿಸಿ' : 'Copy Text'}
                >
                  {copied ? <Check size={15} color="#16A34A" /> : <Copy size={15} />}
                  <span>{copied ? (isKn ? 'ನಕಲಿಸಲಾಗಿದೆ!' : 'Copied!') : (isKn ? 'ನಕಲಿಸಿ' : 'Copy')}</span>
                </button>
              </>
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                {isKn ? 'ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಸಿದ್ಧವಾಗಿದೆ' : 'Audio engine ready'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message if any */}
      {errorMsg && (
        <div className="translator-widget-error">
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Phrase Samples Chips */}
      <div className="translator-quick-chips-wrapper">
        <span className="quick-chips-label">
          ✦ {isKn ? 'ತ್ವರಿತ ಪರೀಕ್ಷಾ ವಾಕ್ಯಗಳು (ಕ್ಲಿಕ್ ಮಾಡಿ):' : 'Sample Phrases (Click to test):'}
        </span>
        <div className="quick-chips-row">
          {QUICK_PHRASE_SAMPLES.map((phrase, i) => (
            <button
              key={i}
              type="button"
              className="quick-phrase-pill"
              onClick={() => {
                const text = sourceLang === 'kn' ? phrase.kn : phrase.en;
                setInputText(text);
                handleTranslate(text);
              }}
            >
              <span>{sourceLang === 'kn' ? phrase.kn : phrase.en}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

