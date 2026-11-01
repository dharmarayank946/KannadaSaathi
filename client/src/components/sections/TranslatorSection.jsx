import React, { useState, useEffect, useRef } from 'react';
import SectionHeader from '../layout/SectionHeader';
import { playSpeech, stopSpeech } from '../../utils/kannadaSpeech';
import {
  Languages,
  Mic,
  MicOff,
  Volume2,
  ArrowRightLeft,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  RotateCcw,
  VolumeX,
  Radio,
  Send,
  Info,
  ShieldCheck,
  User,
  Users,
  Repeat,
  X,
  HelpCircle,
  Play,
  Square
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en', nameKn: 'ಆಂಗ್ಲ (English)', nameEn: 'English', bcp47: 'en-IN', flag: '🌐' },
  { code: 'kn', nameKn: 'ಕನ್ನಡ', nameEn: 'Kannada', bcp47: 'kn-IN', flag: '🟡🔴' },
  { code: 'hi', nameKn: 'ಹಿಂದಿ (हिंदी)', nameEn: 'Hindi', bcp47: 'hi-IN', flag: '🇮🇳' },
  { code: 'te', nameKn: 'ತೆಲುಗು (తెలుగు)', nameEn: 'Telugu', bcp47: 'te-IN', flag: '🇮🇳' },
  { code: 'ta', nameKn: 'ತಮಿಳು (தமிழ்)', nameEn: 'Tamil', bcp47: 'ta-IN', flag: '🇮🇳' },
  { code: 'mr', nameKn: 'ಮರಾಠಿ (मराठी)', nameEn: 'Marathi', bcp47: 'mr-IN', flag: '🇮🇳' }
];

const QUICK_TRANSLATE_SAMPLES = [
  { en: 'Hi', kn: 'ನಮಸ್ಕಾರ' },
  { en: 'Where is the bus stand?', kn: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?' },
  { en: 'How much does it cost?', kn: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?' },
  { en: 'Please use the meter', kn: 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ' },
  { en: 'I am learning Kannada; could you please speak slowly?', kn: 'ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ; ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ' },
  { en: 'Where am I?', kn: 'ನಾನು ಎಲ್ಲಿದ್ದೇನೆ?' },
  { en: 'Authentic Mysuru dosa', kn: 'ಅಸಲಿ ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ' },
  { en: 'Thank you very much for your help', kn: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು' }
];

const PRESET_CATEGORIES = [
  {
    id: 'greetings',
    titleKn: 'ಪರಿಚಯ ಮತ್ತು ವಂದನೆಗಳು',
    titleEn: 'Greetings & Introductions',
    phrases: [
      { kn: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?', en: 'Hello, how are you?', hi: 'नमस्ते, आप कैसे हैं?' },
      { kn: 'ನಾನು ಆರಾಮಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು.', en: 'I am fine, thank you.', hi: 'मैं ठीक हूँ, धन्यवाद।' },
      { kn: 'ನಿಮ್ಮ ಹೆಸರೇನು?', en: 'What is your name?', hi: 'आपका नाम क्या है?' },
      { kn: 'ನನ್ನ ಹೆಸರು ಗೆಳೆಯ.', en: 'My name is friend.', hi: 'मेरा नाम मित्र है।' },
      { kn: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು!', en: 'Thank you very much!', hi: 'बहुत-बहुत धन्यवाद!' }
    ]
  },
  {
    id: 'travel',
    titleKn: 'ಪ್ರಯಾಣ ಮತ್ತು ದಾರಿ',
    titleEn: 'Travel & Directions',
    phrases: [
      { kn: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', en: 'Where is the bus stop?', hi: 'बस स्टॉप कहाँ है?' },
      { kn: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', en: 'Where is the railway station?', hi: 'रेलवे स्टेशन कहाँ है?' },
      { kn: 'ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಯಾವ ಬಸ್ ಹೋಗುತ್ತದೆ?', en: 'Which bus goes to Majestic?', hi: 'मैजेस्टिक के लिए कौन सी बस जाती है?' },
      { kn: 'ಮುಂದಿನ ವೃತ್ತದಲ್ಲಿ ಎಡಕ್ಕೆ ತಿರುಗಿ.', en: 'Take a left at the next circle.', hi: 'अगले चौराहे पर बाएं मुड़ें।' },
      { kn: 'ಇಲ್ಲೇ ನಿಲ್ಲಿಸಿ, ಧನ್ಯವಾದ.', en: 'Stop here, thank you.', hi: 'यहीं रोकिए, धन्यवाद।' }
    ]
  },
  {
    id: 'shopping',
    titleKn: 'ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಖರೀದಿ',
    titleEn: 'Market & Shopping',
    phrases: [
      { kn: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?', en: 'How much does this cost?', hi: 'इसकी कीमत क्या है?' },
      { kn: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ?', en: 'Can you reduce the price?', hi: 'क्या आप दाम थोड़ा कम करेंगे?' },
      { kn: 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ.', en: 'Put the meter please.', hi: 'कृपया मीटर चालू करें।' },
      { kn: 'ನಾನು ಇದನ್ನು ಕೊಳ್ಳಲು ಬಯಸುತ್ತೇನೆ.', en: 'I want to buy this.', hi: 'मैं यह खरीदना चाहता हूँ।' }
    ]
  },
  {
    id: 'dining',
    titleKn: 'ಉಪಹಾರ ಮತ್ತು ಊಟ',
    titleEn: 'Dining & Food',
    phrases: [
      { kn: 'ಬೆಳಗಿನ ತಿಂಡಿಗೆ ಏನೇನಿದೆ?', en: 'What is available for breakfast?', hi: 'नाश्ते में क्या है?' },
      { kn: 'ದಯವಿಟ್ಟು ಕುಡಿಯಲು ನೀರು ಕೊಡಿ.', en: 'Please give me water.', hi: 'कृपया मुझे पानी दीजिए।' },
      { kn: 'ದಯವಿಟ್ಟು ಬಿಲ್ ತನ್ನಿ.', en: 'Please bring the bill.', hi: 'कृपया बिल लाइए।' },
      { kn: 'ಊಟ ತುಂಬಾ ರುಚಿಕರವಾಗಿದೆ!', en: 'The food is very tasty!', hi: 'खाना बहुत स्वादिष्ट है!' }
    ]
  },
  {
    id: 'emergency',
    titleKn: 'ತುರ್ತು ಮತ್ತು ನೆರವು',
    titleEn: 'Emergency & Health',
    phrases: [
      { kn: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ.', en: 'Please help me.', hi: 'कृपया मेरी मदद करें।' },
      { kn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', en: 'Where is the hospital?', hi: 'अस्पताल कहाँ है?' },
      { kn: 'ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಕರೆಯಿರಿ.', en: 'Call a doctor.', hi: 'डॉक्टर को बुलाइए।' },
      { kn: 'ನನಗೆ ಸರಿಯಾಗಿ ಕನ್ನಡ ಬರುವುದಿಲ್ಲ, ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.', en: 'I do not know Kannada well, please speak slowly.', hi: 'मुझे कन्नड़ ठीक से नहीं आती, धीरे बोलिए।' }
    ]
  }
];

export default function TranslatorSection({ onBackToHome, langMode, serverStatus }) {
  const isKn = langMode === 'kn';

  // Sub-tabs: 'direct' (Direct Translator) | 'duo' (Shared-Phone Dual Speaker) | 'phrases' (Quick Phrases)
  const [translatorTab, setTranslatorTab] = useState('direct');

  // Direct Translator State
  const [directSourceLang, setDirectSourceLang] = useState('en');
  const [directTargetLang, setDirectTargetLang] = useState('kn');
  const [directInputText, setDirectInputText] = useState('');
  const [directResult, setDirectResult] = useState(null);
  const [isDirectLoading, setIsDirectLoading] = useState(false);
  const [isDirectMicListening, setIsDirectMicListening] = useState(false);
  const [directError, setDirectError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isReplaying, setIsReplaying] = useState(false);

  // Two-Way Face-to-Face Conversation State
  const [isDuoActive, setIsDuoActive] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('person1'); // 'person1' or 'person2'
  const [duoStatus, setDuoStatus] = useState('idle'); // 'idle' | 'listening' | 'translating' | 'speaking'
  const [person1Lang, setPerson1Lang] = useState('kn');
  const [person2Lang, setPerson2Lang] = useState('en');
  const [duoSpeechError, setDuoSpeechError] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [person1ManualText, setPerson1ManualText] = useState('');
  const [person2ManualText, setPerson2ManualText] = useState('');
  const [latestExchange, setLatestExchange] = useState(null);
  const [conversation, setConversation] = useState([]);

  // Presets state
  const [activePresetTab, setActivePresetTab] = useState('greetings');

  // Refs
  const directRecognitionRef = useRef(null);
  const duoRecognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Scroll to latest message in duo mode
  useEffect(() => {
    if (translatorTab === 'duo' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, translatorTab]);

  // Clean up any active speech recognition on unmount
  useEffect(() => {
    return () => {
      if (directRecognitionRef.current) {
        try { directRecognitionRef.current.abort(); } catch (e) {}
      }
      if (duoRecognitionRef.current) {
        try { duoRecognitionRef.current.abort(); } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-to-Speech Playback Helper using universal speech system
  const speakText = (text, langCode, onComplete) => {
    if (!text || !text.trim()) {
      onComplete?.();
      return;
    }
    setIsReplaying(true);
    playSpeech({
      text: text.trim(),
      lang: langCode || 'kn',
      id: `trans-${text.slice(0, 30)}`,
      onStart: () => setIsReplaying(true),
      onEnd: () => {
        setIsReplaying(false);
        onComplete?.();
      },
      onError: () => {
        setIsReplaying(false);
        onComplete?.();
      }
    });
  };

  // Copy with Visual Feedback
  const handleCopy = (key, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ==========================================
  // DIRECT TRANSLATOR HANDLERS
  // ==========================================

  const handleSwapDirectLanguages = () => {
    const prevSrc = directSourceLang;
    const prevTgt = directTargetLang;
    setDirectSourceLang(prevTgt);
    setDirectTargetLang(prevSrc);

    // If there is already a result, swap result to input
    if (directResult && directResult.translatedText) {
      setDirectInputText(directResult.translatedText);
      setDirectResult({
        originalText: directResult.translatedText,
        translatedText: directResult.originalText,
        sourceLang: prevTgt,
        targetLang: prevSrc,
        transliteration: '',
        engine: directResult.engine
      });
    }
  };

  const handleExecuteDirectTranslation = async (overrideText) => {
    const textToTranslate = (overrideText !== undefined ? overrideText : directInputText).trim();
    if (!textToTranslate) return;

    setIsDirectLoading(true);
    setDirectError(null);

    try {
      let response = null;
      let translatedText = '';
      let transliteration = '';
      let engineName = '';
      let modeName = '';

      try {
        response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textToTranslate,
            sourceLang: directSourceLang,
            targetLang: directTargetLang
          })
        });

        if (!response.ok) {
          response = await fetch('http://localhost:5000/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: textToTranslate,
              sourceLang: directSourceLang,
              targetLang: directTargetLang
            })
          });
        }

        if (response && response.ok) {
          const data = await response.json();
          if (data.success && data.translatedText) {
            translatedText = data.translatedText;
            transliteration = data.transliteration || '';
            engineName = data.engine || 'KannadaSaathi Neural Engine';
            modeName = data.mode || 'live-neural';
          }
        }
      } catch (e) {
        console.warn('Backend translation failed, trying direct neural service:', e);
      }

      // Direct neural service fallback
      if (!translatedText) {
        try {
          const neuralUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${directSourceLang}|${directTargetLang}`;
          const nResp = await fetch(neuralUrl);
          if (nResp.ok) {
            const nData = await nResp.json();
            if (nData.responseData && nData.responseData.translatedText) {
              const resText = nData.responseData.translatedText.trim();
              if (resText && !resText.toUpperCase().includes('QUERY LENGTH LIMIT')) {
                translatedText = resText;
                engineName = 'MyMemory Live Neural Translation';
                modeName = 'direct-neural';
              }
            }
          }
        } catch (nErr) {
          console.warn('Direct neural translation service failed:', nErr);
        }
      }

      if (translatedText) {
        setDirectResult({
          originalText: textToTranslate,
          translatedText,
          transliteration,
          engine: engineName,
          sourceLang: directSourceLang,
          targetLang: directTargetLang,
          mode: modeName
        });

        // Auto-speak in target language
        if (autoSpeak) {
          speakText(translatedText, directTargetLang);
        }
      } else {
        const errorMsg = isKn ? 'ಅನುವಾದ ಪ್ರಕ್ರಿಯೆ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Translation service could not be reached. Please check connection and try again.';
        setDirectError(errorMsg);
        setDirectResult(null);
      }
    } catch (err) {
      console.warn('Direct translation network error:', err);
      // Fallback check in local preset categories
      let localFallback = null;
      const clean = textToTranslate.toLowerCase().trim().replace(/[.,?!]+$/, '');
      for (const cat of PRESET_CATEGORIES) {
        for (const p of cat.phrases) {
          const from = (p[directSourceLang] || '').toLowerCase().trim().replace(/[.,?!]+$/, '');
          if (from === clean && p[directTargetLang]) {
            localFallback = p[directTargetLang];
            break;
          }
        }
        if (localFallback) break;
      }

      if (localFallback) {
        setDirectResult({
          originalText: textToTranslate,
          translatedText: localFallback,
          transliteration: '',
          engine: isKn ? 'ಪರಿಶೀಲಿತ ದೈನಂದಿನ ಶಬ್ದಕೋಶ' : 'Verified Spoken Dictionary',
          sourceLang: directSourceLang,
          targetLang: directTargetLang,
          mode: 'offline-verified'
        });
        if (autoSpeak) speakText(localFallback, directTargetLang);
      } else {
        setDirectError(
          isKn
            ? 'ಸರ್ವರ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ (ದಯವಿಟ್ಟು ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಪರಿಶೀಲಿಸಿ).'
            : 'Unable to reach backend translation server on port 5000. Please ensure the backend is running.'
        );
      }
    } finally {
      setIsDirectLoading(false);
    }
  };

  const handleStartDirectSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDirectError(
        isKn
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗ್ರಹಿಕೆ (Web Speech) ಬೆಂಬಲವಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯವನ್ನು ನೇರವಾಗಿ ಬರೆಯಿರಿ.'
          : 'Web Speech recognition is not supported in this browser. Please type directly.'
      );
      return;
    }

    if (isDirectMicListening) {
      if (directRecognitionRef.current) {
        try { directRecognitionRef.current.stop(); } catch (e) {}
      }
      setIsDirectMicListening(false);
      return;
    }

    setDirectError(null);
    setIsDirectMicListening(true);

    try {
      const recognition = new SpeechRecognition();
      directRecognitionRef.current = recognition;

      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === directSourceLang);
      recognition.lang = langObj?.bcp47 || (directSourceLang === 'kn' ? 'kn-IN' : 'en-IN');
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsDirectMicListening(true);
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setDirectInputText(transcript);
          handleExecuteDirectTranslation(transcript);
        }
      };

      recognition.onerror = (e) => {
        console.warn('Direct mic error:', e.error);
        setIsDirectMicListening(false);
        if (e.error === 'not-allowed') {
          setDirectError(
            isKn
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಬಳಕೆಗೆ ಅನುಮತಿ ನೀಡಿ.'
              : 'Microphone permission was denied. Please allow microphone access in your browser address bar.'
          );
        } else if (e.error === 'no-speech') {
          setDirectError(
            isKn
              ? 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ.'
              : 'No speech was detected. Please tap the mic and speak clearly.'
          );
        } else {
          setDirectError(
            isKn
              ? `ಧ್ವನಿ ದೋಷ: ${e.error}. ದಯವಿಟ್ಟು ಪಠ್ಯ ಬರೆದು ಪ್ರಯತ್ನಿಸಿ.`
              : `Microphone error: ${e.error}. You can also type text directly.`
          );
        }
      };

      recognition.onend = () => {
        setIsDirectMicListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsDirectMicListening(false);
      setDirectError(
        isKn
          ? 'ಧ್ವನಿ ಆರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯವನ್ನು ಬರೆಯಿರಿ.'
          : 'Could not access microphone. Please type directly into the box.'
      );
    }
  };

  // ==========================================
  // TWO-WAY FACE-TO-FACE CONVERSATION HANDLERS
  // ==========================================

  const handleStartConversation = () => {
    stopSpeech();
    if (duoRecognitionRef.current) {
      try { duoRecognitionRef.current.abort(); } catch (e) {}
    }
    setIsDuoActive(true);
    setCurrentTurn('person1');
    setDuoStatus('idle');
    setDuoSpeechError(null);
  };

  const handleEndConversation = () => {
    stopSpeech();
    if (duoRecognitionRef.current) {
      try { duoRecognitionRef.current.abort(); } catch (e) {}
    }
    setIsDuoActive(false);
    setDuoStatus('idle');
    setDuoSpeechError(null);
  };

  const handleClearConversation = () => {
    stopSpeech();
    if (duoRecognitionRef.current) {
      try { duoRecognitionRef.current.abort(); } catch (e) {}
    }
    setConversation([]);
    setLatestExchange(null);
    setDuoSpeechError(null);
    setDuoStatus('idle');
  };

  const handleTranslateDuoMessage = async (text, speaker) => {
    if (!text || !text.trim()) return;
    const trimmed = text.trim();
    setDuoStatus('translating');
    setDuoSpeechError(null);

    const isP1 = speaker === 'person1';
    const sourceLang = isP1 ? person1Lang : person2Lang;
    const targetLang = isP1 ? person2Lang : person1Lang;
    const nextSpeaker = isP1 ? 'person2' : 'person1';

    try {
      let response = null;
      try {
        response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: trimmed,
            sourceLang,
            targetLang
          })
        });
      } catch (err) {
        response = await fetch('http://localhost:5000/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: trimmed,
            sourceLang,
            targetLang
          })
        });
      }

      let translated = '';
      let modeUsed = 'live';
      let transliteration = '';

      if (response && response.ok) {
        const data = await response.json();
        if (data.success && data.translatedText) {
          translated = data.translatedText;
          modeUsed = data.mode || 'live';
          transliteration = data.transliteration || '';
        }
      }

      // Direct neural translation fallback
      if (!translated) {
        try {
          const neuralUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${sourceLang}|${targetLang}`;
          const nResp = await fetch(neuralUrl);
          if (nResp.ok) {
            const nData = await nResp.json();
            if (nData.responseData && nData.responseData.translatedText) {
              const resText = nData.responseData.translatedText.trim();
              if (resText && !resText.toUpperCase().includes('QUERY LENGTH LIMIT')) {
                translated = resText;
                modeUsed = 'neural-direct';
              }
            }
          }
        } catch (nErr) {
          console.warn('Duo direct neural translation error:', nErr);
        }
      }

      if (!translated) {
        translated = isKn ? 'ಅನುವಾದ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ತೊಂದರೆ' : 'Translation service unavailable';
        modeUsed = 'error';
      }

      const p1Obj = SUPPORTED_LANGUAGES.find(l => l.code === person1Lang);
      const p2Obj = SUPPORTED_LANGUAGES.find(l => l.code === person2Lang);

      const newEntry = {
        id: Date.now(),
        speaker,
        speakerLabelKn: isP1 ? `ವ್ಯಕ್ತಿ ೧ (${p1Obj?.nameKn || 'ಕನ್ನಡ'})` : `ವ್ಯಕ್ತಿ ೨ (${p2Obj?.nameKn || 'ಆಂಗ್ಲ'})`,
        speakerLabelEn: isP1 ? `Person 1 (${p1Obj?.nameEn || 'Kannada'})` : `Person 2 (${p2Obj?.nameEn || 'English'})`,
        sourceLang,
        targetLang,
        originalText: trimmed,
        translatedText: translated,
        transliteration,
        mode: modeUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setLatestExchange(newEntry);
      setConversation(prev => [newEntry, ...prev]);

      if (isP1) setPerson1ManualText('');
      else setPerson2ManualText('');

      if (autoSpeak && modeUsed !== 'error') {
        setDuoStatus('speaking');
        speakText(translated, targetLang, () => {
          // Playback finished: advance turn to the other person and allow them to respond
          setCurrentTurn(nextSpeaker);
          setDuoStatus('idle');
        });
      } else {
        setCurrentTurn(nextSpeaker);
        setDuoStatus('idle');
      }

    } catch (err) {
      console.warn('Duo translation error:', err);
      setDuoSpeechError(
        isKn
          ? 'ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಸಂಪರ್ಕದಲ್ಲಿ ತೊಂದರೆಯಾಗಿದೆ.'
          : 'Unable to connect to backend translation server.'
      );
      setDuoStatus('idle');
    }
  };

  const startDuoListeningFor = (speaker) => {
    // If audio is currently playing, stop it first before opening microphone
    if (duoStatus === 'speaking') {
      stopSpeech();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDuoSpeechError(
        isKn
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗ್ರಹಿಕೆ (Web Speech) ಬೆಂಬಲವಿಲ್ಲ. ಕೆಳಗೆ ಪಠ್ಯ ಬರೆಯಿರಿ.'
          : 'Web Speech recognition is not supported in this browser. Please type directly.'
      );
      return;
    }

    // Toggle off if already listening
    if (duoStatus === 'listening' && currentTurn === speaker) {
      if (duoRecognitionRef.current) {
        try { duoRecognitionRef.current.stop(); } catch (e) {}
      }
      setDuoStatus('idle');
      return;
    }

    // Ensure conversation is marked active and turn is locked to this speaker
    setIsDuoActive(true);
    setCurrentTurn(speaker);
    setDuoSpeechError(null);
    setDuoStatus('listening');

    try {
      const recognition = new SpeechRecognition();
      duoRecognitionRef.current = recognition;

      const langCode = speaker === 'person1' ? person1Lang : person2Lang;
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
      recognition.lang = langConfig?.bcp47 || (langCode === 'kn' ? 'kn-IN' : 'en-IN');
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setDuoStatus('listening');
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0]?.[0]?.transcript;
        if (transcript) {
          handleTranslateDuoMessage(transcript, speaker);
        } else {
          setDuoStatus('idle');
          setDuoSpeechError(
            isKn ? 'ಧ್ವನಿ ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Could not recognise speech. Please try again.'
          );
        }
      };

      recognition.onerror = (e) => {
        setDuoStatus('idle');
        if (e.error === 'not-allowed') {
          setDuoSpeechError(
            isKn
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ ಬಳಕೆಗೆ ಅನುಮತಿ ನೀಡಿ.'
              : 'Microphone permission was denied. Please allow microphone access in your browser.'
          );
        } else if (e.error === 'no-speech') {
          setDuoSpeechError(
            isKn ? 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ.' : 'No speech detected. Please speak clearly.'
          );
        } else {
          setDuoSpeechError(
            isKn ? `ಧ್ವನಿ ಗ್ರಹಿಕೆ ದೋಷ: ${e.error}` : `Recognition error: ${e.error}`
          );
        }
      };

      recognition.onend = () => {
        // Only set idle if not already transitioning to translating or speaking
        setDuoStatus((curr) => (curr === 'listening' ? 'idle' : curr));
      };

      recognition.start();
    } catch (e) {
      setDuoStatus('idle');
      setDuoSpeechError(isKn ? 'ಮೈಕ್ ಆರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Could not start microphone.');
    }
  };

  const handleSwapDuoLanguages = () => {
    const temp = person1Lang;
    setPerson1Lang(person2Lang);
    setPerson2Lang(temp);
  };

  const handleSelectSamplePhrase = (phrase) => {
    if (directSourceLang === 'en') {
      setDirectInputText(phrase.en);
      handleExecuteDirectTranslation(phrase.en);
    } else {
      setDirectInputText(phrase.kn);
      handleExecuteDirectTranslation(phrase.kn);
    }
  };

  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ಮುಖ್ಯ ವೈಶಿಷ್ಟ್ಯ • VOICE FIRST"
        badgeEn="PRIMARY FEATURE • VOICE FIRST"
        titleKn="ಕನ್ನಡ ಧ್ವನಿ ಸಂಭಾಷಣೆ ಮತ್ತು ಅನುವಾದಕ"
        titleEn="Kannada Voice Conversation & Translator"
        taglineKn="ನೈಜ ಧ್ವನಿ ಗ್ರಹಿಕೆ ಮತ್ತು ತತ್‌ಕ್ಷಣ ಅನುವಾದ: ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ, ಧ್ವನಿ ಆಲಿಸಿ"
        taglineEn="Instant speech recognition & audio translation: Speak naturally, listen aloud"
        icon={Languages}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      {/* Mode Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.65rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem',
          borderBottom: '2px solid var(--color-cream-border)',
          paddingBottom: '0.75rem'
        }}
      >
        <button
          type="button"
          className={`filter-chip trans-mode-shortcut-direct ${translatorTab === 'direct' ? 'active' : ''}`}
          onClick={() => setTranslatorTab('direct')}
          style={{ padding: '0.6rem 1.15rem', fontSize: '0.9rem', fontWeight: 700 }}
        >
          <span>🎯</span>
          <span>{isKn ? 'ನೇರ ಅನುವಾದಕ (English ⇄ Kannada)' : 'Direct Translator (English ⇄ Kannada)'}</span>
        </button>

        <button
          type="button"
          className={`filter-chip trans-mode-shortcut-duo ${translatorTab === 'duo' ? 'active' : ''}`}
          onClick={() => setTranslatorTab('duo')}
          style={{ padding: '0.6rem 1.15rem', fontSize: '0.9rem', fontWeight: 700 }}
        >
          <span>👥</span>
          <span>{isKn ? 'ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ (Shared Phone)' : 'Face-to-Face Dual Speaker'}</span>
        </button>

        <button
          type="button"
          className={`filter-chip trans-mode-shortcut-phrases ${translatorTab === 'phrases' ? 'active' : ''}`}
          onClick={() => setTranslatorTab('phrases')}
          style={{ padding: '0.6rem 1.15rem', fontSize: '0.9rem', fontWeight: 700 }}
        >
          <span>⚡</span>
          <span>{isKn ? 'ದೈನಂದಿನ ವಾಕ್ಯಕೋಶ (Everyday Phrases)' : 'Everyday Spoken Presets'}</span>
        </button>
      </div>

      {/* Engine Status & Auto-Audio Pill Banner */}
      <div
        style={{
          background: '#FFFDF7',
          border: '1px solid var(--color-cream-border)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldCheck size={18} color="var(--color-flag-red)" />
          <span>
            {isKn ? (
              <>
                <strong>ತಂತ್ರಜ್ಞಾನ ಸ್ಥಿತಿ: </strong>
                {serverStatus.connected ? 'ಸರ್ವರ್ ಸಂಪರ್ಕಿತವಾಗಿದೆ' : 'ಸ್ಥಳೀಯ ಕೋಶ ಮೋಡ್'} •{' '}
                {serverStatus.details?.geminiConfigured
                  ? 'Google Gemini AI ಸಕ್ರಿಯ'
                  : 'MyMemory Live Neural + ಪರಿಶೀಲಿತ ಶಬ್ದಕೋಶ ಸಕ್ರಿಯ'}
              </>
            ) : (
              <>
                <strong>Engine Status: </strong>
                {serverStatus.connected ? 'Backend Live' : 'Local Standalone'} •{' '}
                {serverStatus.details?.geminiConfigured
                  ? 'Google Gemini AI Active'
                  : 'MyMemory Neural Translation + Verified Spoken Dictionary Active'}
              </>
            )}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={isKn ? 'ಸ್ವಯಂಚಾಲಿತ ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಬದಲಿಸಿ' : 'Toggle auto voice playback'}
          >
            {autoSpeak ? <Volume2 size={14} color="#2ECC71" /> : <VolumeX size={14} color="#E74C3C" />}
            <span>
              {isKn
                ? (autoSpeak ? 'ಧ್ವನಿ: ಆನ್ (Auto-Play)' : 'ಧ್ವನಿ: ಆಫ್')
                : (autoSpeak ? 'Auto-Voice: ON' : 'Auto-Voice: OFF')}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: DIRECT TRANSLATOR (English ⇄ Kannada)
          ======================================================== */}
      {translatorTab === 'direct' && (
        <div className="direct-translator-container">
          {/* Language Direction Switcher Bar */}
          <div
            className="card-box"
            style={{
              background: '#FFFFFF',
              border: '2px solid var(--color-flag-red)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0 6px 20px rgba(215, 25, 32, 0.06)'
            }}
          >
            {/* Direction Selector Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--color-cream-border)',
                paddingBottom: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  {isKn ? 'ಅನುವಾದದ ದಿಕ್ಕು:' : 'Translation Direction:'}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className={`btn ${directSourceLang === 'en' && directTargetLang === 'kn' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', borderRadius: '20px' }}
                    onClick={() => {
                      setDirectSourceLang('en');
                      setDirectTargetLang('kn');
                    }}
                  >
                    English ➔ ಕನ್ನಡ
                  </button>
                  <button
                    type="button"
                    className={`btn ${directSourceLang === 'kn' && directTargetLang === 'en' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', borderRadius: '20px' }}
                    onClick={() => {
                      setDirectSourceLang('kn');
                      setDirectTargetLang('en');
                    }}
                  >
                    ಕನ್ನಡ ➔ English
                  </button>
                </div>
              </div>

              {/* Advanced Language Dropdowns + Swap */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  className="select-input"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                  value={directSourceLang}
                  onChange={(e) => setDirectSourceLang(e.target.value)}
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {isKn ? l.nameKn : l.nameEn}</option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn btn-secondary swap-btn"
                  onClick={handleSwapDirectLanguages}
                  title={isKn ? "ಭಾಷೆಗಳನ್ನು ಅದಲು-ಬದಲು ಮಾಡಿ" : "Swap Languages"}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  <ArrowRightLeft size={16} />
                </button>

                <select
                  className="select-input"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                  value={directTargetLang}
                  onChange={(e) => setDirectTargetLang(e.target.value)}
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {isKn ? l.nameKn : l.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Notification Alert */}
            {directError && (
              <div
                style={{
                  background: '#FDF2E9',
                  border: '1px solid #F5CBA7',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#B9770E',
                  fontSize: '0.85rem'
                }}
              >
                <AlertCircle size={18} />
                <div style={{ flex: 1 }}>{directError}</div>
                <button
                  type="button"
                  onClick={() => setDirectError(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Side-by-side Input and Output Workspace */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.25rem'
              }}
            >
              {/* SOURCE INPUT CARD */}
              <div
                style={{
                  background: '#FAFAFA',
                  border: '1.5px solid var(--color-cream-border)',
                  borderRadius: '14px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-flag-red)' }}>
                    {SUPPORTED_LANGUAGES.find(l => l.code === directSourceLang)?.flag}{' '}
                    {isKn
                      ? `${SUPPORTED_LANGUAGES.find(l => l.code === directSourceLang)?.nameKn} (ಮೂಲ ಪಠ್ಯ)`
                      : `${SUPPORTED_LANGUAGES.find(l => l.code === directSourceLang)?.nameEn} (Source)`}
                  </span>
                  {directInputText && (
                    <button
                      type="button"
                      onClick={() => setDirectInputText('')}
                      style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      <X size={14} />
                      <span>{isKn ? 'ತೆರವುಗೊಳಿಸಿ' : 'Clear'}</span>
                    </button>
                  )}
                </div>

                <textarea
                  className="search-input"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1.02rem',
                    lineHeight: 1.5,
                    resize: 'vertical',
                    borderRadius: '10px'
                  }}
                  placeholder={
                    directSourceLang === 'en'
                      ? 'Type English sentence here, or click the mic to speak...'
                      : 'ಇಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ...'
                  }
                  value={directInputText}
                  onChange={(e) => setDirectInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleExecuteDirectTranslation();
                    }
                  }}
                  disabled={isDirectLoading}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {/* Microphone Button with Active Crimson Listening Indicator */}
                  <button
                    type="button"
                    className={`btn ${isDirectMicListening ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      padding: '0.48rem 1rem',
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      borderRadius: '25px',
                      background: isDirectMicListening ? 'var(--color-flag-red)' : '#FFF1F1',
                      color: isDirectMicListening ? '#FFFFFF' : 'var(--color-flag-red)',
                      borderColor: isDirectMicListening ? '#991B1B' : '#FECACA',
                      boxShadow: isDirectMicListening ? '0 0 0 4px rgba(220, 38, 38, 0.25)' : '0 2px 6px rgba(220, 38, 38, 0.08)',
                      fontWeight: 800
                    }}
                    onClick={handleStartDirectSpeechRecognition}
                    disabled={isDirectLoading}
                    title={isKn ? "ಮೈಕ್ರೊಫೋನ್ ಮೂಲಕ ಮಾತನಾಡಿ" : "Speak using microphone"}
                  >
                    {isDirectMicListening ? <Radio size={16} className="pulse-icon" /> : <Mic size={16} />}
                    <span>
                      {isDirectMicListening
                        ? (isKn ? 'ಧ್ವನಿ ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ' : 'Listening... Speak now')
                        : (isKn ? 'ಧ್ವನಿ ಮೂಲಕ ಮಾತನಾಡಿ' : 'Speak with Mic')}
                    </span>
                  </button>

                  {/* Character count & Submit button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>
                      {directInputText.length} {isKn ? 'ಅಕ್ಷರಗಳು' : 'chars'}
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem', fontWeight: 700 }}
                      onClick={() => handleExecuteDirectTranslation()}
                      disabled={!directInputText.trim() || isDirectLoading}
                    >
                      {isDirectLoading ? (
                        <>
                          <Sparkles size={15} className="pulse-icon" />
                          <span>{isKn ? 'ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...' : 'Translating...'}</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>{isKn ? 'ಅನುವಾದಿಸಿ' : 'Translate'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* TARGET OUTPUT RESULT CARD */}
              <div
                style={{
                  background: directResult ? '#FFFDF7' : '#FBFBFB',
                  border: `2px solid ${directResult ? 'var(--color-flag-yellow)' : 'var(--color-cream-border)'}`,
                  borderRadius: '14px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#27AE60' }}>
                      {SUPPORTED_LANGUAGES.find(l => l.code === directTargetLang)?.flag}{' '}
                      {isKn
                        ? `${SUPPORTED_LANGUAGES.find(l => l.code === directTargetLang)?.nameKn} (ಅನುವಾದ)`
                        : `${SUPPORTED_LANGUAGES.find(l => l.code === directTargetLang)?.nameEn} (Translation)`}
                    </span>

                    {directResult && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          background: '#E8F8F5',
                          color: '#1E8449',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '10px',
                          fontWeight: 700
                        }}
                      >
                        ✦ {directResult.engine}
                      </span>
                    )}
                  </div>

                  {directResult ? (
                    <div>
                      {/* Main Translated Text */}
                      <div
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: 'var(--color-text-main)',
                          lineHeight: 1.5,
                          marginBottom: '0.5rem'
                        }}
                        className={directResult.targetLang === 'kn' ? 'kn-heading' : ''}
                      >
                        {directResult.translatedText}
                      </div>

                      {/* Transliteration / Pronunciation Helper */}
                      {directResult.transliteration && (
                        <div
                          style={{
                            background: '#FFF8E7',
                            border: '1px solid #FFE082',
                            borderRadius: '8px',
                            padding: '0.45rem 0.75rem',
                            fontSize: '0.88rem',
                            color: '#7B5E00',
                            fontFamily: 'monospace',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            marginBottom: '0.75rem'
                          }}
                        >
                          <span>🔊</span>
                          <span><strong>ಉಚ್ಚಾರಣೆ: </strong>{directResult.transliteration}</span>
                        </div>
                      )}

                      {/* Original Echo */}
                      <div style={{ fontSize: '0.82rem', color: '#777', fontStyle: 'italic', marginTop: '0.35rem' }}>
                        "{directResult.originalText}"
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#999' }}>
                      <Languages size={40} style={{ opacity: 0.35, marginBottom: '0.65rem' }} />
                      <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600 }}>
                        {isKn
                          ? 'ಎಡಭಾಗದಲ್ಲಿ ಬರೆದು "ಅನುವಾದಿಸಿ" ಒತ್ತಿ ಅಥವಾ ಧ್ವನಿ ಬಳಸಿ.'
                          : 'Type text on the left or tap the mic to view live translation.'}
                      </p>
                      <span style={{ fontSize: '0.78rem', opacity: 0.75 }}>
                        {isKn ? 'ನಿಖರವಾದ ನೈಜ ಧ್ವನಿ ಮತ್ತು ಉಚ್ಚಾರಣಾ ವಿವರಗಳು ಇಲ್ಲಿ ಕಾಣುತ್ತವೆ.' : 'Authentic Kannada script, Romanized pronunciation, and audio.'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Output Action Buttons: Audio Replay + Copy */}
                {directResult && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-cream-border)'
                    }}
                  >
                    <button
                      type="button"
                      className={`btn-compact-speaker ${isReplaying ? 'speaking' : ''}`}
                      style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                      onClick={() => speakText(directResult.translatedText, directResult.targetLang)}
                      title={isKn ? "ಧ್ವನಿಯನ್ನು ಮತ್ತೆ ಕೇಳಿ" : "Listen aloud"}
                    >
                      <Volume2 size={15} />
                      <span>{isReplaying ? (isKn ? 'ಆಲಿಸುತ್ತಿದೆ...' : 'Playing...') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ (Replay)' : 'Listen Aloud')}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      onClick={() => handleCopy('direct-translation', directResult.translatedText)}
                      title={isKn ? "ಅನುವಾದ ನಕಲಿಸಿ" : "Copy translation"}
                    >
                      {copiedKey === 'direct-translation' ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                      <span>{copiedKey === 'direct-translation' ? (isKn ? 'ನಕಲಾಗಿದೆ!' : 'Copied!') : (isKn ? 'ಅನುವಾದ ನಕಲಿಸಿ' : 'Copy')}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                      onClick={() => handleCopy('direct-original', directResult.originalText)}
                      title={isKn ? "ಮೂಲ ಪಠ್ಯ ನಕಲಿಸಿ" : "Copy original text"}
                    >
                      {copiedKey === 'direct-original' ? <Check size={13} color="#2ECC71" /> : <Copy size={13} />}
                      <span>{copiedKey === 'direct-original' ? (isKn ? 'ಮೂಲ ನಕಲಾಗಿದೆ' : 'Copied') : (isKn ? 'ಮೂಲ ನಕಲಿಸಿ' : 'Copy Original')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick 1-Click Sample Sentences */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-cream-border)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                💡 {isKn ? 'ತ್ವರಿತ ಪರೀಕ್ಷೆಗೆ ಉದಾಹರಣಾ ವಾಕ್ಯಗಳು (ಕ್ಲಿಕ್ ಮಾಡಿ ನೋಡಿ):' : 'Click to Test Everyday Sample Phrases:'}
              </span>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {QUICK_TRANSLATE_SAMPLES.map((sample, idx) => {
                  const label = directSourceLang === 'en' ? sample.en : sample.kn;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="tag-pill"
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        background: '#FFFFFF',
                        border: '1px solid #DDD',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onClick={() => handleSelectSamplePhrase(sample)}
                    >
                      ✦ {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: FACE-TO-FACE TWO-WAY CONVERSATION
          ======================================================== */}
      {translatorTab === 'duo' && (
        <div className="duo-translator-container" style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          {/* Main Conversation Control Card */}
          <div
            className="card-box"
            style={{
              background: '#FFFFFF',
              border: isDuoActive ? '2px solid var(--color-flag-red)' : '1px solid var(--color-cream-border)',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: isDuoActive ? '0 8px 30px rgba(215, 25, 32, 0.08)' : '0 4px 16px rgba(0,0,0,0.04)',
              marginBottom: '1.25rem'
            }}
          >
            {/* Top Toolbar: Mode Badge & Start/End Session Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--color-cream-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: isDuoActive ? 'var(--color-flag-red-soft)' : '#F0F0F0',
                    color: isDuoActive ? 'var(--color-flag-red)' : '#666',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}
                >
                  <Users size={15} />
                  <span>{isKn ? 'ಮುಖಾಮುಖಿ ಸಂಭಾಷಣೆ' : 'Face-to-Face Conversation'}</span>
                </span>
                {isDuoActive && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: '#E8F8F5',
                      color: '#27AE60',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    ● {isKn ? 'ಸಕ್ರಿಯ' : 'Active'}
                  </span>
                )}
              </div>

              {/* Action Buttons: Start/End & Clear */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {!isDuoActive ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'var(--color-flag-red)',
                      color: '#FFF',
                      borderRadius: '12px',
                      fontWeight: 700
                    }}
                    onClick={handleStartConversation}
                  >
                    <Play size={14} fill="#FFF" />
                    <span>{isKn ? 'ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ' : 'Start Conversation'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: '#C0392B',
                      borderColor: '#E6B0AA',
                      background: '#FDEDEC',
                      borderRadius: '12px',
                      fontWeight: 700
                    }}
                    onClick={handleEndConversation}
                  >
                    <Square size={13} fill="#C0392B" />
                    <span>{isKn ? 'ಸಂಭಾಷಣೆ ಮುಗಿಸಿ' : 'End Conversation'}</span>
                  </button>
                )}

                {conversation.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '12px'
                    }}
                    onClick={handleClearConversation}
                    title={isKn ? "ಎಲ್ಲ ಸಂದೇಶಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ" : "Clear all messages"}
                  >
                    <RotateCcw size={13} />
                    <span>{isKn ? 'ತೆರವು' : 'Clear'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error Notification Banner if any */}
            {duoSpeechError && (
              <div
                style={{
                  background: '#FDF2E9',
                  border: '1px solid #F5CBA7',
                  borderRadius: '10px',
                  padding: '0.65rem 1rem',
                  marginBottom: '1rem',
                  color: '#B9770E',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} />
                  <span>{duoSpeechError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDuoSpeechError(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#B9770E' }}
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Turn Status Indicator Bar */}
            <div
              style={{
                textAlign: 'center',
                padding: '0.45rem 0.75rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                fontWeight: 600,
                fontSize: '0.88rem',
                background:
                  duoStatus === 'listening'
                    ? '#FFF9E6'
                    : duoStatus === 'translating'
                    ? '#EBF5FB'
                    : duoStatus === 'speaking'
                    ? '#E8F8F5'
                    : '#F8F9F9',
                color:
                  duoStatus === 'listening'
                    ? '#B7950B'
                    : duoStatus === 'translating'
                    ? '#2980B9'
                    : duoStatus === 'speaking'
                    ? '#27AE60'
                    : '#555',
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {duoStatus === 'listening' && (
                <>
                  <Radio size={16} className="animate-pulse" />
                  <span>
                    {currentTurn === 'person1'
                      ? (isKn ? 'ವ್ಯಕ್ತಿ ೧ ಧ್ವನಿ ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ' : 'Listening to Person 1... speak now')
                      : (isKn ? 'ವ್ಯಕ್ತಿ ೨ ಧ್ವನಿ ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ' : 'Listening to Person 2... speak now')}
                  </span>
                </>
              )}
              {duoStatus === 'translating' && (
                <>
                  <Sparkles size={16} />
                  <span>{isKn ? 'ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...' : 'Translating recognized speech...'}</span>
                </>
              )}
              {duoStatus === 'speaking' && (
                <>
                  <Volume2 size={16} />
                  <span>{isKn ? 'ಅನುವಾದಿತ ವಾಕ್ಯ ಆಲಿಸುತ್ತಿದೆ...' : 'Reading translated sentence aloud...'}</span>
                </>
              )}
              {duoStatus === 'idle' && (
                <span>
                  {isDuoActive
                    ? currentTurn === 'person1'
                      ? (isKn ? '👉 ವ್ಯಕ್ತಿ ೧ ರ ಸರದಿ: ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ' : '👉 Person 1\'s turn: tap the mic and speak')
                      : (isKn ? '👉 ವ್ಯಕ್ತಿ ೨ ರ ಸರದಿ: ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ' : '👉 Person 2\'s turn: tap the mic and speak')
                    : (isKn ? 'ಸಂಭಾಷಣೆ ಆರಂಭಿಸಲು "ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ" ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ' : 'Tap Start or any mic button to begin')}
                </span>
              )}
            </div>

            {/* Two-Side Interactive Speaker Interface (Person 1 vs Person 2) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr)',
                gap: '0.85rem',
                alignItems: 'stretch'
              }}
              className="shared-phone-grid"
            >
              {/* ================= PERSON 1 SIDE ================= */}
              <div
                style={{
                  background:
                    currentTurn === 'person1'
                      ? '#FFFFFF'
                      : '#FAFAFA',
                  border:
                    currentTurn === 'person1'
                      ? '2px solid var(--color-flag-red)'
                      : '1px solid #E5E7EB',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.65rem',
                  textAlign: 'center',
                  boxShadow: currentTurn === 'person1' ? '0 4px 14px rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Header Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.92rem' }}>
                  <User size={16} color="var(--color-flag-red)" />
                  <span>{isKn ? 'ವ್ಯಕ್ತಿ ೧' : 'Person 1'}</span>
                  {currentTurn === 'person1' && (
                    <span style={{ fontSize: '0.68rem', background: 'var(--color-flag-yellow)', color: '#111', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: 800 }}>
                      {isKn ? 'ಸರದಿ' : 'TURN'}
                    </span>
                  )}
                </div>

                {/* Spoken Language Picker */}
                <select
                  className="select-input"
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.5rem',
                    fontSize: '0.82rem',
                    borderRadius: '8px'
                  }}
                  value={person1Lang}
                  onChange={(e) => setPerson1Lang(e.target.value)}
                  disabled={duoStatus !== 'idle'}
                  title={isKn ? "ವ್ಯಕ್ತಿ ೧ ಮಾತನಾಡುವ ಭಾಷೆ" : "Person 1 Spoken Language"}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {isKn ? lang.nameKn : lang.nameEn}
                    </option>
                  ))}
                </select>

                {/* Big Clear Mic Button */}
                <button
                  type="button"
                  className={`mic-pulse-btn ${currentTurn === 'person1' && duoStatus === 'listening' ? 'listening' : ''}`}
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0.3rem 0',
                    background:
                      currentTurn === 'person1' && duoStatus === 'listening'
                        ? 'var(--color-flag-yellow)'
                        : 'var(--color-flag-red)',
                    color: currentTurn === 'person1' && duoStatus === 'listening' ? '#111' : '#FFF',
                    cursor: duoStatus === 'speaking' || duoStatus === 'translating' ? 'not-allowed' : 'pointer',
                    opacity: duoStatus === 'speaking' || duoStatus === 'translating' ? 0.7 : 1,
                    boxShadow: currentTurn === 'person1' ? '0 4px 14px rgba(215,25,32,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => startDuoListeningFor('person1')}
                  disabled={duoStatus === 'speaking' || duoStatus === 'translating'}
                  title={isKn ? "ವ್ಯಕ್ತಿ ೧: ಮಾತನಾಡಿ" : "Person 1: Speak"}
                >
                  {currentTurn === 'person1' && duoStatus === 'listening' ? <Radio size={26} /> : <Mic size={26} />}
                </button>

                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: currentTurn === 'person1' ? 'var(--color-flag-red)' : 'var(--color-text-muted)' }}>
                  {currentTurn === 'person1' && duoStatus === 'listening'
                    ? (isKn ? 'ಆಲಿಸುತ್ತಿದೆ...' : 'Listening...')
                    : (isKn ? 'ಮಾತನಾಡಲು ಒತ್ತಿ' : 'Tap to Speak')}
                </span>

                {/* Optional Quick Type Input */}
                <div style={{ width: '100%', marginTop: '0.2rem', display: 'flex', gap: '0.3rem' }}>
                  <input
                    type="text"
                    className="search-input"
                    style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem', flex: 1, borderRadius: '8px' }}
                    placeholder={isKn ? 'ಅಥವಾ ಇಲ್ಲಿ ಬರೆಯಿರಿ...' : 'Or type text...'}
                    value={person1ManualText}
                    onChange={(e) => setPerson1ManualText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTranslateDuoMessage(person1ManualText, 'person1');
                    }}
                    disabled={duoStatus !== 'idle'}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 0.55rem', borderRadius: '8px' }}
                    onClick={() => handleTranslateDuoMessage(person1ManualText, 'person1')}
                    disabled={!person1ManualText.trim() || duoStatus !== 'idle'}
                    title={isKn ? "ಕಳುಹಿಸಿ" : "Send"}
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>

              {/* ================= MIDDLE SWAP ================= */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary swap-btn"
                  onClick={handleSwapDuoLanguages}
                  disabled={duoStatus !== 'idle'}
                  title={isKn ? "ಭಾಷೆಗಳನ್ನು ಅದಲು-ಬದಲು ಮಾಡಿ" : "Swap Languages"}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  <ArrowRightLeft size={16} />
                </button>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {isKn ? 'ಅದಲು-ಬದಲು' : 'Swap'}
                </span>
              </div>

              {/* ================= PERSON 2 SIDE ================= */}
              <div
                style={{
                  background:
                    currentTurn === 'person2'
                      ? 'linear-gradient(180deg, #F4FBF7 0%, #E8F8F5 100%)'
                      : '#FAFAFA',
                  border:
                    currentTurn === 'person2'
                      ? '2px solid #27AE60'
                      : '1.5px solid var(--color-cream-border)',
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.65rem',
                  textAlign: 'center',
                  boxShadow: currentTurn === 'person2' ? '0 4px 18px rgba(39, 174, 96, 0.18)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Header Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.92rem' }}>
                  <User size={16} color="#27AE60" />
                  <span>{isKn ? 'ವ್ಯಕ್ತಿ ೨' : 'Person 2'}</span>
                  {currentTurn === 'person2' && (
                    <span style={{ fontSize: '0.68rem', background: '#27AE60', color: '#FFF', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: 800 }}>
                      {isKn ? 'ಸರದಿ' : 'TURN'}
                    </span>
                  )}
                </div>

                {/* Spoken Language Picker */}
                <select
                  className="select-input"
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.5rem',
                    fontSize: '0.82rem',
                    borderRadius: '8px'
                  }}
                  value={person2Lang}
                  onChange={(e) => setPerson2Lang(e.target.value)}
                  disabled={duoStatus !== 'idle'}
                  title={isKn ? "ವ್ಯಕ್ತಿ ೨ ಮಾತನಾಡುವ ಭಾಷೆ" : "Person 2 Spoken Language"}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {isKn ? lang.nameKn : lang.nameEn}
                    </option>
                  ))}
                </select>

                {/* Big Clear Mic Button */}
                <button
                  type="button"
                  className={`mic-pulse-btn ${currentTurn === 'person2' && duoStatus === 'listening' ? 'listening' : ''}`}
                  style={{
                    width: '64px',
                    height: '64px',
                    margin: '0.3rem 0',
                    background:
                      currentTurn === 'person2' && duoStatus === 'listening'
                        ? 'var(--color-flag-yellow)'
                        : '#27AE60',
                    color: currentTurn === 'person2' && duoStatus === 'listening' ? '#111' : '#FFF',
                    cursor: duoStatus === 'speaking' || duoStatus === 'translating' ? 'not-allowed' : 'pointer',
                    opacity: duoStatus === 'speaking' || duoStatus === 'translating' ? 0.7 : 1,
                    boxShadow: currentTurn === 'person2' ? '0 4px 14px rgba(39,174,96,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => startDuoListeningFor('person2')}
                  disabled={duoStatus === 'speaking' || duoStatus === 'translating'}
                  title={isKn ? "ವ್ಯಕ್ತಿ ೨: ಮಾತನಾಡಿ" : "Person 2: Speak"}
                >
                  {currentTurn === 'person2' && duoStatus === 'listening' ? <Radio size={26} /> : <Mic size={26} />}
                </button>

                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: currentTurn === 'person2' ? '#27AE60' : 'var(--color-text-muted)' }}>
                  {currentTurn === 'person2' && duoStatus === 'listening'
                    ? (isKn ? 'ಆಲಿಸುತ್ತಿದೆ...' : 'Listening...')
                    : (isKn ? 'ಮಾತನಾಡಲು ಒತ್ತಿ' : 'Tap to Speak')}
                </span>

                {/* Optional Quick Type Input */}
                <div style={{ width: '100%', marginTop: '0.2rem', display: 'flex', gap: '0.3rem' }}>
                  <input
                    type="text"
                    className="search-input"
                    style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem', flex: 1, borderRadius: '8px' }}
                    placeholder={isKn ? 'ಅಥವಾ ಇಲ್ಲಿ ಬರೆಯಿರಿ...' : 'Or type text...'}
                    value={person2ManualText}
                    onChange={(e) => setPerson2ManualText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTranslateDuoMessage(person2ManualText, 'person2');
                    }}
                    disabled={duoStatus !== 'idle'}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 0.55rem', borderRadius: '8px', background: '#27AE60', borderColor: '#27AE60' }}
                    onClick={() => handleTranslateDuoMessage(person2ManualText, 'person2')}
                    disabled={!person2ManualText.trim() || duoStatus !== 'idle'}
                    title={isKn ? "ಕಳುಹಿಸಿ" : "Send"}
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              PROMINENT LATEST TRANSLATED SENTENCE BUBBLE
              ======================================================== */}
          {latestExchange && (
            <div
              className="card-box"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: `2px solid ${latestExchange.speaker === 'person1' ? 'var(--color-flag-red)' : '#27AE60'}`,
                padding: '1.1rem 1.25rem',
                marginBottom: '1.25rem',
                boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.6rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      background: latestExchange.speaker === 'person1' ? 'var(--color-flag-red-soft)' : '#E8F8F5',
                      color: latestExchange.speaker === 'person1' ? 'var(--color-flag-red)' : '#27AE60'
                    }}
                  >
                    {isKn ? latestExchange.speakerLabelKn : latestExchange.speakerLabelEn}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {latestExchange.timestamp}
                  </span>
                </div>

                {/* Replay & Copy buttons */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', borderRadius: '8px' }}
                    onClick={() => speakText(latestExchange.translatedText, latestExchange.targetLang)}
                    title={isKn ? "ಮತ್ತೊಮ್ಮೆ ಆಲಿಸಿ" : "Replay translated audio"}
                  >
                    <Volume2 size={14} />
                    <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಲಿಸಿ' : 'Replay'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.55rem', fontSize: '0.78rem', borderRadius: '8px' }}
                    onClick={() => handleCopy(`duo-latest-${latestExchange.id}`, latestExchange.translatedText)}
                    title={isKn ? "ನಕಲಿಸಿ" : "Copy"}
                  >
                    {copiedKey === `duo-latest-${latestExchange.id}` ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Original sentence */}
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', display: 'block', fontWeight: 600 }}>
                  {isKn ? 'ಹೇಳಿದ ವಾಕ್ಯ (Original):' : 'Spoken Sentence:'}
                </span>
                <span style={{ fontStyle: 'italic' }}>"{latestExchange.originalText}"</span>
              </div>

              {/* Translated sentence (Prominent) */}
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text-main)',
                  lineHeight: 1.4,
                  marginTop: '0.35rem'
                }}
                className={latestExchange.targetLang === 'kn' ? 'kn-text' : ''}
              >
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: latestExchange.speaker === 'person1' ? 'var(--color-flag-red)' : '#27AE60', display: 'block', fontWeight: 700 }}>
                  {isKn ? 'ಅನುವಾದ (Translated Output):' : 'Translated Reply:'}
                </span>
                {latestExchange.translatedText}
              </div>

              {latestExchange.transliteration && (
                <div style={{ fontSize: '0.82rem', color: '#7F8C8D', fontStyle: 'italic', marginTop: '0.35rem' }}>
                  🔊 {latestExchange.transliteration}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: EVERYDAY SPOKEN PRESETS
          ======================================================== */}
      {translatorTab === 'phrases' && (
        <div className="presets-container">
          <div
            className="card-box"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-cream-border)',
              padding: '1.25rem'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? 'ದೈನಂದಿನ ಉಪಯೋಗಿ ವಾಕ್ಯಗಳು' : 'Everyday Spoken Kannada Categories'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಪ್ರಯಾಣ, ಮಾರುಕಟ್ಟೆ, ಹೋಟೆಲ್ ಮತ್ತು ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ಬಳಸುವ ಅಧಿಕೃತ ವಾಕ್ಯಗಳು. ಕ್ಲಿಕ್ ಮಾಡಿ ಧ್ವನಿ ಆಲಿಸಿ:'
                  : 'Verified natural phrases for auto rides, dining, shopping, and emergencies with instant Kannada audio:'}
              </p>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-chip ${activePresetTab === cat.id ? 'active' : ''}`}
                  style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
                  onClick={() => setActivePresetTab(cat.id)}
                >
                  {isKn ? cat.titleKn : cat.titleEn}
                </button>
              ))}
            </div>

            {/* Phrases list in active category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.85rem' }}>
              {PRESET_CATEGORIES.find(c => c.id === activePresetTab)?.phrases.map((phrase, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.4 }} className="kn-heading">
                      {phrase.kn}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.2rem' }}>
                      {phrase.en}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      className="btn-compact-speaker"
                      onClick={() => speakText(phrase.kn, 'kn')}
                      title="ಧ್ವನಿ ಆಲಿಸಿ"
                    >
                      <Volume2 size={14} />
                      <span>{isKn ? 'ಆಲಿಸಿ' : 'Listen'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                      onClick={() => handleCopy(`phrase-${idx}`, phrase.kn)}
                      title="ನಕಲಿಸಿ"
                    >
                      {copiedKey === `phrase-${idx}` ? <Check size={14} color="#2ECC71" /> : <Copy size={14} />}
                      <span>{copiedKey === `phrase-${idx}` ? (isKn ? 'ನಕಲಾಗಿದೆ' : 'Copied') : (isKn ? 'ನಕಲಿಸಿ' : 'Copy')}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', marginLeft: 'auto' }}
                      onClick={() => {
                        setDirectSourceLang('en');
                        setDirectTargetLang('kn');
                        setDirectInputText(phrase.en);
                        setTranslatorTab('direct');
                        handleExecuteDirectTranslation(phrase.en);
                      }}
                      title="ಅನುವಾದಕದಲ್ಲಿ ನೋಡಿ"
                    >
                      <span>{isKn ? 'ಅನುವಾದಿಸಿ ➔' : 'Translate ➔'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
