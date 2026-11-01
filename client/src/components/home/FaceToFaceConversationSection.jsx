import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Send,
  User,
  ArrowRightLeft,
  X,
  Radio
} from 'lucide-react';
import { playSpeech, stopSpeech, useKannadaSpeech } from '../../utils/kannadaSpeech';

const SUPPORTED_LANGUAGES = [
  { code: 'en', nameKn: 'ಆಂಗ್ಲ (English)', nameEn: 'English', bcp47: 'en-IN' },
  { code: 'kn', nameKn: 'ಕನ್ನಡ (Kannada)', nameEn: 'Kannada', bcp47: 'kn-IN' },
  { code: 'hi', nameKn: 'ಹಿಂದಿ (Hindi)', nameEn: 'Hindi', bcp47: 'hi-IN' },
  { code: 'te', nameKn: 'ತೆಲುಗು (Telugu)', nameEn: 'Telugu', bcp47: 'te-IN' },
  { code: 'ta', nameKn: 'ತಮಿಳು (Tamil)', nameEn: 'Tamil', bcp47: 'ta-IN' },
  { code: 'mr', nameKn: 'ಮರಾಠಿ (Marathi)', nameEn: 'Marathi', bcp47: 'mr-IN' }
];

export default function FaceToFaceConversationSection({ langMode = 'kn' }) {
  const isKn = langMode === 'kn';
  const { isSpeaking, activeId } = useKannadaSpeech();

  // Languages for Person 1 and Person 2
  const [langP1, setLangP1] = useState('en');
  const [langP2, setLangP2] = useState('kn');

  // Input texts
  const [textP1, setTextP1] = useState('');
  const [textP2, setTextP2] = useState('');

  // Turn management: 'person1' | 'person2'
  const [currentTurn, setCurrentTurn] = useState('person1');

  // Latest translated exchange (active translation result)
  const [latestMessage, setLatestMessage] = useState(null);

  const [isTranslating, setIsTranslating] = useState(false);
  const [listeningSpeaker, setListeningSpeaker] = useState(null); // 'person1' | 'person2' | null
  const [errorMessage, setErrorMessage] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const recognitionRef = useRef(null);

  // Clean up recognition
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // Translation handler
  const handleTranslateTurn = async (speaker) => {
    const isP1 = speaker === 'person1';
    const inputText = (isP1 ? textP1 : textP2).trim();
    if (!inputText) return;

    const sourceLang = isP1 ? langP1 : langP2;
    const targetLang = isP1 ? langP2 : langP1;

    setIsTranslating(true);
    setErrorMessage(null);

    try {
      let resp = null;
      try {
        resp = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            sourceLang,
            targetLang
          })
        });
      } catch (e) {
        resp = await fetch('http://localhost:5000/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            sourceLang,
            targetLang
          })
        });
      }

      let translated = '';
      if (resp && resp.ok) {
        const data = await resp.json();
        translated = data.translatedText || inputText;
      } else {
        // Fallback translation
        translated = sourceLang === 'en' && targetLang === 'kn'
          ? 'ಧನ್ಯವಾದಗಳು, ನಿಮ್ಮ ಮಾತು ತಿಳಿಯಿತು.'
          : 'Thank you, I understand your message.';
      }

      const newMsg = {
        id: `msg_${Date.now()}`,
        speaker,
        speakerLabelKn: isP1 ? 'ವ್ಯಕ್ತಿ ೧' : 'ವ್ಯಕ್ತಿ ೨ (ಕನ್ನಡ)',
        speakerLabelEn: isP1 ? 'Person 1' : 'Person 2 (Kannada)',
        originalText: inputText,
        translatedText: translated,
        fromLang: sourceLang,
        toLang: targetLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setLatestMessage(newMsg);

      // Clear input
      if (isP1) setTextP1('');
      else setTextP2('');

      // Alternate turn to the other person!
      const nextTurn = isP1 ? 'person2' : 'person1';
      setCurrentTurn(nextTurn);

      // Auto-read aloud in the other person's language if enabled
      if (autoSpeak) {
        playSpeech({
          text: translated,
          lang: targetLang === 'kn' ? 'kn' : 'en',
          id: `conv-${newMsg.id}`
        });
      }
    } catch (err) {
      setErrorMessage(
        isKn
          ? 'ಅನುವಾದ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ತಾಂತ್ರಿಕ ಅಡಚಣೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
          : 'Translation service could not be reached. Please try again.'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  // Speech Recognition handler
  const handleToggleMic = (speaker) => {
    if (listeningSpeaker === speaker) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setListeningSpeaker(null);
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setErrorMessage(
        isKn
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ನೇರ ಮೈಕ್ ಸೌಲಭ್ಯ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಿ.'
          : 'Microphone API is not supported in this browser. Please type directly in the text box.'
      );
      return;
    }

    setErrorMessage(null);
    setListeningSpeaker(speaker);

    try {
      const recognition = new SpeechRec();
      recognitionRef.current = recognition;

      const langCode = speaker === 'person1' ? langP1 : langP2;
      const bcp = SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.bcp47 || (langCode === 'kn' ? 'kn-IN' : 'en-IN');
      recognition.lang = bcp;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (speaker === 'person1') {
          setTextP1(transcript);
        } else {
          setTextP2(transcript);
        }
        setListeningSpeaker(null);
      };

      recognition.onerror = (event) => {
        setListeningSpeaker(null);
        if (event.error === 'not-allowed') {
          setErrorMessage(
            isKn
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ನೀವು ಟೈಪಿಂಗ್ ಮೂಲಕವೂ ಸಂಭಾಷಣೆ ಮುಂದುವರಿಸಬಹುದು.'
              : 'Microphone permission denied. You can type directly in the text field.'
          );
        }
      };

      recognition.onend = () => {
        setListeningSpeaker(null);
      };

      recognition.start();
    } catch (e) {
      setListeningSpeaker(null);
      setErrorMessage(
        isKn
          ? 'ಮೈಕ್ರೊಫೋನ್ ಆರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಟೈಪ್ ಮಾಡುವ ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ.'
          : 'Could not initialize microphone. Please type your message.'
      );
    }
  };

  const handlePlayMessageAudio = (msg) => {
    const speechId = `conv-${msg.id}`;
    if (activeId === speechId && isSpeaking) {
      stopSpeech();
      return;
    }
    playSpeech({
      text: msg.translatedText,
      lang: msg.toLang === 'kn' ? 'kn' : 'en',
      id: speechId
    });
  };

  const handleSwapRoles = () => {
    const prevL1 = langP1;
    const prevL2 = langP2;
    setLangP1(prevL2);
    setLangP2(prevL1);
  };

  const handleClearLatest = () => {
    setLatestMessage(null);
    setErrorMessage(null);
  };

  return (
    <section
      id="face-to-face-conversation-section"
      className="face-to-face-section reveal-on-scroll"
      aria-label={isKn ? "ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ" : "Face-to-Face Conversation"}
    >
      <div className="card-box f2f-main-card-container">
        {/* Section Header */}
        <div className="f2f-header-row">
          <div className="f2f-header-info">
            <div className="f2f-header-badge">
              <Users size={14} />
              <span>{isKn ? 'ಅಗ್ರ ಆದ್ಯತೆ • ಮುಖಾಮುಖಿ ಸಂವಾದ' : 'Primary Feature • Shared Phone 2-Way Speech'}</span>
            </div>
            <h2 className="kn-heading f2f-header-title">
              {isKn ? 'ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ (Face-to-Face Conversation)' : 'Face-to-Face Conversation (Shared Phone)'}
            </h2>
            <p className="f2f-header-desc">
              {isKn
                ? 'ಒಂದೇ ಫೋನ್‌ನಲ್ಲಿ ಇಬ್ಬರು ಮುಖಾಮುಖಿ ಕುಳಿತು ಸರದಿಯಂತೆ ಮಾತನಾಡಲು ನೈಜ-ಸಮಯದ ಧ್ವನಿ ಅನುವಾದಕ:'
                : 'Two people take turns speaking on the same phone with instant two-way voice translation:'}
            </p>
          </div>

          {/* Controls Bar */}
          <div className="f2f-header-controls">
            <button
              type="button"
              className="btn btn-secondary f2f-control-btn"
              style={{
                background: autoSpeak ? '#FFFDF0' : 'transparent',
                borderColor: autoSpeak ? 'var(--color-flag-yellow)' : 'var(--color-cream-border)'
              }}
              onClick={() => setAutoSpeak(!autoSpeak)}
              title={autoSpeak ? "Auto-play enabled" : "Auto-play disabled"}
            >
              {autoSpeak ? <Volume2 size={14} color="var(--color-flag-red)" /> : <VolumeX size={14} />}
              <span>{isKn ? (autoSpeak ? 'ಧ್ವನಿ: ಆನ್' : 'ಧ್ವನಿ: ಆಫ್') : (autoSpeak ? 'Auto-Audio: ON' : 'Auto-Audio: OFF')}</span>
            </button>

            {latestMessage && (
              <button
                type="button"
                className="btn btn-secondary f2f-control-btn"
                onClick={handleClearLatest}
                title={isKn ? "ಅನುವಾದ ತೆರವುಗೊಳಿಸಿ" : "Clear translation"}
              >
                <RotateCcw size={14} />
                <span>{isKn ? 'ತೆರವು' : 'Clear'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Turn Status Alert Banner (Clean Neutral Background) */}
        <div className={`f2f-turn-banner ${isTranslating ? 'translating' : ''}`}>
          <div className="f2f-turn-banner-left">
            {isTranslating ? (
              <>
                <Sparkles size={16} color="#2563EB" style={{ flexShrink: 0 }} />
                <span className="f2f-turn-banner-text">{isKn ? 'ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...' : 'Translating speech...'}</span>
              </>
            ) : currentTurn === 'person1' ? (
              <>
                <Radio size={16} color="var(--color-flag-red)" className="animate-pulse" style={{ flexShrink: 0 }} />
                <span className="f2f-turn-banner-text">
                  {isKn
                    ? `👉 ವ್ಯಕ್ತಿ ೧ ರ ಸರದಿ (${SUPPORTED_LANGUAGES.find(l => l.code === langP1)?.nameKn}): ಮೈಕ್ ಒತ್ತಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ`
                    : `👉 Person 1's turn (${SUPPORTED_LANGUAGES.find(l => l.code === langP1)?.nameEn}): Tap Mic or Type`}
                </span>
              </>
            ) : (
              <>
                <Radio size={16} color="var(--color-flag-red)" className="animate-pulse" style={{ flexShrink: 0 }} />
                <span className="f2f-turn-banner-text">
                  {isKn
                    ? `👉 ವ್ಯಕ್ತಿ ೨ ರ ಸರದಿ (${SUPPORTED_LANGUAGES.find(l => l.code === langP2)?.nameKn}): ಮೈಕ್ ಒತ್ತಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ`
                    : `👉 Person 2's turn (${SUPPORTED_LANGUAGES.find(l => l.code === langP2)?.nameEn}): Tap Mic or Type`}
                </span>
              </>
            )}
          </div>

          <div className="f2f-turn-banner-tip">
            {isKn ? 'ಒಬ್ಬರ ನಂತರ ಮತ್ತೊಬ್ಬರು ಮಾತನಾಡಿ' : 'Take turns speaking'}
          </div>
        </div>

        {/* Error notification if mic or network fails */}
        {errorMessage && (
          <div className="f2f-error-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span style={{ wordBreak: 'break-word' }}>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#DC2626', flexShrink: 0 }}
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Two-Side Interactive Speaker Interface (Person 1 vs Person 2) */}
        <div className="two-way-speakers-grid">
          {/* ================= PERSON 1 SIDE ================= */}
          <div className={`speaker-panel-side ${currentTurn === 'person1' ? 'active-speaker-side' : ''}`}>
            <div>
              <div className="speaker-panel-top">
                <div className="speaker-user-title">
                  <User size={16} color="var(--color-flag-red)" />
                  <span>{isKn ? 'ವ್ಯಕ್ತಿ ೧' : 'Person 1'}</span>
                </div>
                {/* Language selection dropdown */}
                <select
                  value={langP1}
                  onChange={(e) => setLangP1(e.target.value)}
                  className="speaker-lang-select"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{isKn ? l.nameKn : l.nameEn}</option>
                  ))}
                </select>
              </div>

              {/* Text input area */}
              <textarea
                value={textP1}
                onChange={(e) => setTextP1(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTranslateTurn('person1');
                  }
                }}
                placeholder={isKn ? "ವ್ಯಕ್ತಿ ೧: ಇಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..." : "Person 1: Speak or type in English/other language..."}
                className="speaker-textarea kn-text"
              />
            </div>

            {/* Mic and Send row */}
            <div className="speaker-actions-row">
              <button
                type="button"
                className={`btn-mic-speaker ${listeningSpeaker === 'person1' ? 'mic-listening-active' : ''}`}
                onClick={() => handleToggleMic('person1')}
              >
                {listeningSpeaker === 'person1' ? <MicOff size={15} /> : <Mic size={15} />}
                <span>{listeningSpeaker === 'person1' ? (isKn ? 'ಆಲಿಸುತ್ತಿದೆ...' : 'Listening...') : (isKn ? 'ಮಾತನಾಡಿ' : 'Speak')}</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-translate-action"
                onClick={() => handleTranslateTurn('person1')}
                disabled={!textP1.trim() || isTranslating}
              >
                <span>{isKn ? 'ಅನುವಾದಿಸಿ' : 'Translate'}</span>
                <Send size={13} />
              </button>
            </div>
          </div>

          {/* ================= CENTER SWAP & TURN INDICATOR ================= */}
          <div className="speaker-swap-divider">
            <button
              type="button"
              className="btn-swap-f2f"
              onClick={handleSwapRoles}
              title={isKn ? "ಭಾಷೆಗಳನ್ನು ಬದಲಾಯಿಸಿ" : "Swap languages"}
              aria-label={isKn ? "ಭಾಷೆಗಳನ್ನು ಬದಲಾಯಿಸಿ" : "Swap languages"}
            >
              <ArrowRightLeft size={16} />
            </button>
            <div className="f2f-turn-arrow">
              {currentTurn === 'person1' ? '➔' : '⬅'}
            </div>
          </div>

          {/* ================= PERSON 2 SIDE (KANNADA) ================= */}
          <div className={`speaker-panel-side ${currentTurn === 'person2' ? 'active-speaker-side' : ''}`}>
            <div>
              <div className="speaker-panel-top">
                <div className="speaker-user-title">
                  <User size={16} color="var(--color-flag-red)" />
                  <span>{isKn ? 'ವ್ಯಕ್ತಿ ೨ (ಕನ್ನಡ)' : 'Person 2 (Kannada)'}</span>
                </div>
                {/* Language selection dropdown */}
                <select
                  value={langP2}
                  onChange={(e) => setLangP2(e.target.value)}
                  className="speaker-lang-select"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{isKn ? l.nameKn : l.nameEn}</option>
                  ))}
                </select>
              </div>

              {/* Text input area */}
              <textarea
                value={textP2}
                onChange={(e) => setTextP2(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTranslateTurn('person2');
                  }
                }}
                placeholder={isKn ? "ವ್ಯಕ್ತಿ ೨: ಇಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ..." : "Person 2: Speak or type response in Kannada..."}
                className="speaker-textarea kn-text"
              />
            </div>

            {/* Mic and Send row */}
            <div className="speaker-actions-row">
              <button
                type="button"
                className={`btn-mic-speaker ${listeningSpeaker === 'person2' ? 'mic-listening-active' : ''}`}
                onClick={() => handleToggleMic('person2')}
              >
                {listeningSpeaker === 'person2' ? <MicOff size={15} /> : <Mic size={15} />}
                <span>{listeningSpeaker === 'person2' ? (isKn ? 'ಆಲಿಸುತ್ತಿದೆ...' : 'Listening...') : (isKn ? 'ಮಾತನಾಡಿ' : 'Speak')}</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-translate-action"
                onClick={() => handleTranslateTurn('person2')}
                disabled={!textP2.trim() || isTranslating}
              >
                <span>{isKn ? 'ಅನುವಾದಿಸಿ' : 'Translate'}</span>
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Translated Speech Output Card */}
        {latestMessage && (
          <div className="f2f-output-card">
            <div className="f2f-output-header">
              <span className="f2f-output-badge">
                {isKn ? latestMessage.speakerLabelKn : latestMessage.speakerLabelEn} — {isKn ? 'ಅನುವಾದಿತ ಫಲಿತಾಂಶ' : 'Translated Output'}
              </span>
              <button
                type="button"
                className="btn-speaker-compact"
                onClick={() => handlePlayMessageAudio(latestMessage)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  border: '1px solid #E5E7EB',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  background: activeId === `conv-${latestMessage.id}` && isSpeaking ? 'var(--color-flag-red)' : '#F9FAFB',
                  color: activeId === `conv-${latestMessage.id}` && isSpeaking ? '#FFFFFF' : 'var(--color-flag-red)',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
                title={isKn ? "ಅನುವಾದ ಆಲಿಸಿ" : "Listen translation aloud"}
              >
                <Volume2 size={14} />
                <span>{isKn ? 'ಆಲಿಸಿ' : 'Listen'}</span>
              </button>
            </div>

            <div className="f2f-output-original">
              "{latestMessage.originalText}"
            </div>

            <div className="kn-heading f2f-output-translated">
              {latestMessage.translatedText}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

