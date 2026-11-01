import React, { useState, useEffect, useRef } from 'react';
import { playSpeech, stopSpeech } from '../utils/kannadaSpeech';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Trash2,
  Info,
  StopCircle,
  XCircle,
  Edit3,
  HelpCircle,
  Bell,
  ListTodo
} from 'lucide-react';

export default function VoicePanel({ onSendToSolve, langMode, onLogActivity, serverStatus, speechRate = 0.95 }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [micPermissionState, setMicPermissionState] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const [micError, setMicError] = useState(null);
  const [ttsNotice, setTtsNotice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      textKn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕನ್ನಡಸಾಥಿ. ನಿಮ್ಮ ಧ್ವನಿಯ ಮೂಲಕ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ ಸಹಾಯ ಪಡೆಯಿರಿ.',
      textEn: 'Hello! I am your KannadaSaathi. Speak in Kannada to ask questions or seek help.',
      timestamp: 'ಈಗ',
      mode: 'demo-mode'
    }
  ]);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  const isGeminiLive = Boolean(serverStatus?.details?.geminiConfigured);

  // Check speech recognition & voice support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
      setMicError('ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ Web Speech Recognition API ಲಭ್ಯವಿಲ್ಲ. Google Chrome ಅಥವಾ Microsoft Edge ನಲ್ಲಿ ನೇರ ಧ್ವನಿ ಗ್ರಹಿಕೆ ಬೆಂಬಲವಿದೆ. ನೀವು ಕೆಳಗೆ ಪಠ್ಯವನ್ನು ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಬಹುದು.');
    } else {
      setMicSupported(true);
    }

    // Populate available TTS voices
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      stopSpeaking();
      abortListening();
    };
  }, []);

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, isLoading]);

  // Request microphone permission and start speech recognition ONLY when user clicks
  const startListening = () => {
    setMicError(null);
    setTtsNotice(null);
    stopSpeaking();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ Web Speech Recognition ಬೆಂಬಲವಿಲ್ಲ. ದಯವಿಟ್ಟು Google Chrome ಬಳಸಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ.');
      return;
    }

    try {
      // Abort any existing instance
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'kn-IN'; // Kannada (India)

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermissionState('granted');
        setMicError(null);
      };

      recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setTranscript(fullTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed') {
          setMicPermissionState('denied');
          setMicError('ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ವಿಳಾಸ ಪಟ್ಟಿಯಲ್ಲಿ (Address bar) ಮೈಕ್ರೊಫೋನ್ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಅನುಮತಿಸಿ, ಅಥವಾ ಕೆಳಗೆ ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಿ.');
        } else if (event.error === 'no-speech') {
          setMicError('ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ರೊಫೋನ್ ಹತ್ತಿರವಿಟ್ಟು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.');
        } else if (event.error === 'network') {
          setMicError('ನೆಟ್‌ವರ್ಕ್ ಸಂಪರ್ಕದಲ್ಲಿ ವ್ಯತ್ಯಯವಾಗಿದೆ. ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ.');
        } else {
          setMicError(`ಧ್ವನಿ ಗ್ರಹಿಕೆಯಲ್ಲಿ ತೊಂದರೆ (${event.error}). ಕೆಳಗಿನ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ನೇರವಾಗಿ ಬರೆಯಬಹುದು.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setMicError('ಧ್ವನಿ ಗ್ರಹಿಕೆ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ: ' + err.message);
    }
  };

  // Stop listening and keep recognized transcript for review / editing
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Abort / cancel listening and reset transcript
  const cancelListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    setIsListening(false);
    setTranscript('');
    setMicError(null);
  };

  // Retry voice input after error or empty recording
  const retryListening = () => {
    setMicError(null);
    setTranscript('');
    startListening();
  };

  // Send message to the backend KannadaSaathi chat endpoint
  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || transcript).trim();
    if (!text) {
      setMicError('ದಯವಿಟ್ಟು ಪ್ರಶ್ನೆಯನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ.');
      return;
    }

    // Stop listening before sending
    stopListening();
    setMicError(null);
    setTtsNotice(null);

    // Add user message to conversation stream
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      textKn: text,
      timestamp: new Date().toLocaleTimeString('kn-IN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setTranscript('');
    setIsLoading(true);

    try {
      let replyKn = '';
      let replyMode = 'demo-mode';

      // Always route to Express backend: POST /api/chat
      try {
        let resp = null;
        try {
          resp = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, lang: 'kn' })
          });
        } catch (fetchErr) {
          resp = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, lang: 'kn' })
          });
        }

        if (resp && resp.ok) {
          const data = await resp.json();
          if (data && data.reply) {
            replyKn = data.reply;
            replyMode = data.mode || (data.success ? 'live-api' : 'demo-mode');
          }
        }
      } catch (backendErr) {
        console.warn('Backend chat service unreachable, using local fallback:', backendErr);
      }

      // If backend was unreachable or returned empty, use local fallback
      if (!replyKn) {
        replyKn = generateSmartKannadaResponse(text);
        replyMode = 'offline-demo';
      }

      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        textKn: replyKn,
        timestamp: new Date().toLocaleTimeString('kn-IN', { hour: '2-digit', minute: '2-digit' }),
        mode: replyMode
      };

      setMessages((prev) => [...prev, assistantMsg]);
      onLogActivity?.({
        type: 'voice',
        title: `ಧ್ವನಿ ಸಂಭಾಷಣೆ: ${text.slice(0, 30)}...`,
        timestamp: new Date().toLocaleTimeString('kn-IN')
      });

      // Attempt to read aloud with strict Kannada voice verification
      speakKannada(replyKn, assistantMsg.id);
    } catch (err) {
      console.error('Chat error:', err);
      setMicError('ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯುವಲ್ಲಿ ತೊಂದರೆಯಾಗಿದೆ: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartKannadaResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('ಹವಾಮಾನ') || q.includes('ಮಳೆ') || q.includes('weather')) {
      return 'ಕರ್ನಾಟಕದಲ್ಲಿ ಇಂದಿನ ಹವಾಮಾನವು ಸಾಮಾನ್ಯವಾಗಿ ಆಹ್ಲಾದಕರವಾಗಿದೆ. ಹೆಚ್ಚಿನ ನಾಗರಿಕ ಸೇವೆಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ವಿವರಗಳನ್ನು "ಅನ್ವೇಷಿಸಿ" ವಿಭಾಗದಲ್ಲಿ ನೋಡಬಹುದು.';
    }
    if (q.includes('ಬೆಳೆ') || q.includes('ರೈತ') || q.includes('ಯೋಜನೆ') || q.includes('farmer')) {
      return 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಕೃಷಿ ಇಲಾಖೆಯಿಂದ "ರೈತ ಸಿರಿ" ಮತ್ತು "ಕಿಸಾನ್ ಸಮ್ಮಾನ್" ಯೋಜನೆಗಳ ನೋಂದಣಿ ಚಾಲ್ತಿಯಲ್ಲಿದೆ. ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ ಅಥವಾ ಕೃಷಿ ಭವನದಲ್ಲಿ ಹೆಚ್ಚಿನ ವಿವರ ಪಡೆಯಬಹುದು. ಬೇಕಿದ್ದರೆ ನೆನಪೋಲೆ ಪಟ್ಟಿಗೆ ಸೇರಿಸಿಕೊಳ್ಳಿ.';
    }
    if (q.includes('ನೆನಪಿಸು') || q.includes('ಕೆಲಸ') || q.includes('remind') || q.includes('ಮಾಡಬೇಕು')) {
      return `ಖಂಡಿತ, "${query}" ಎಂಬ ಕೆಲಸವನ್ನು ಗುರುತಿಸಲಾಗಿದೆ. ಈ ಕಾರ್ಯವನ್ನು ನೀವು "ಪರಿಹರಿಸು" ವಿಭಾಗದಲ್ಲಿ ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ನಿಮ್ಮ ನೆನಪೋಲೆ ಪಟ್ಟಿಗೆ (Reminders) ಸೇರಿಸಬಹುದು.`;
    }
    if (q.includes('ನಮಸ್ಕಾರ') || q.includes('ಹಲೋ') || q.includes('hi') || q.includes('hello')) {
      return 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ದಿನ ಶುಭವಾಗಲಿ. ನಾನು ನಿಮ್ಮ ಕನ್ನಡಸಾಥಿ. ನಿಮಗೆ ಯಾವ ವಿಷಯದಲ್ಲಿ ಸಹಾಯ ಬೇಕು ತಿಳಿಸಿ?';
    }
    return `ನಿಮ್ಮ ಪ್ರಶ್ನೆ: "${query}" ಅನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಈ ಕುರಿತು ಅಗತ್ಯ ವಿವರಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ. ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ಇನ್ನಷ್ಟು ತಿಳಿದುಕೊಳ್ಳಬಹುದು.`;
  };

  // Text-To-Speech with universal speech utility (backend fallback for authentic Kannada audio)
  const speakKannada = (text, messageId = null) => {
    setTtsNotice(null);
    if (!text || !text.trim()) return;

    // If currently speaking this message, toggle off
    if (isSpeaking && currentSpeakingId === messageId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setIsSpeaking(true);
    setCurrentSpeakingId(messageId);

    playSpeech({
      text: text.trim(),
      lang: 'kn',
      id: messageId || 'voice-msg',
      onStart: () => {
        setIsSpeaking(true);
        setCurrentSpeakingId(messageId);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
      },
      onError: (errMsg) => {
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
        setTtsNotice('ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್‌ನಲ್ಲಿ ತೊಂದರೆಯಾಗಿದೆ: ' + errMsg);
      }
    });
  };

  const stopSpeaking = () => {
    stopSpeech();
    setIsSpeaking(false);
    setCurrentSpeakingId(null);
  };

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([]);
  };

  const quickPrompts = [
    'ಗೃಹ ಜ್ಯೋತಿ ೨೦೦ ಯೂನಿಟ್ ನಿಯಮಗಳೇನು?',
    'ರೈತರಿಗೆ ಸರ್ಕಾರದ ಹೊಸ ಯೋಜನೆಗಳೇನು?',
    'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಐತಿಹಾಸಿಕ ತಾಣಗಳು ಯಾವುವು?',
    'ನಾಳೆ ಬೆಳಿಗ್ಗೆ 10 ಗಂಟೆಗೆ ಪರೀಕ್ಷಾ ಶುಲ್ಕ ಪಾವತಿಸಲು ನೆನಪಿಸು'
  ];

  return (
    <div className="panel-container">
      {/* Header */}
      <div className="panel-header">
        <div className="panel-header-left">
          <div className="panel-header-icon">
            <Mic size={22} />
          </div>
          <div>
            <h2 className="panel-header-title kn-heading">
              ಮಾತನಾಡು — Kannada Voice Assistant
            </h2>
            <p className="panel-header-subtitle">
              ಕನ್ನಡದಲ್ಲಿ ನೈಸರ್ಗಿಕವಾಗಿ ಮಾತನಾಡಿ, ಆಲಿಸಿ ಮತ್ತು ಸಂಭಾಷಣೆ ನಡೆಸಿ
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isGeminiLive ? (
            <span className="mode-badge badge-live" title="Google Gemini ಲೈವ್ ಮಾದರಿ ಸಕ್ರಿಯವಾಗಿದೆ">
              <CheckCircle2 size={13} />
              <span>ಲೈವ್ AI ಸಕ್ರಿಯ (Gemini)</span>
            </span>
          ) : (
            <span className="mode-badge badge-demo" title="ಬ್ಯಾಕೆಂಡ್ ನಿಯಮ-ಆಧಾರಿತ ಜ್ಞಾನ ಭಂಡಾರದಿಂದ ಉತ್ತರಿಸಲಾಗುತ್ತಿದೆ">
              <Info size={13} />
              <span>ಡೆಮೋ ಸಹಾಯಕ (Rule-Based Helper)</span>
            </span>
          )}
        </div>
      </div>

      <div className="panel-body">
        {/* Suggestion Prompts */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} style={{ color: 'var(--color-flag-red)' }} /> ಸಲಹೆಗಳು:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="scenario-pill-btn"
              onClick={() => {
                setTranscript(prompt);
                handleSendMessage(prompt);
              }}
            >
              {prompt}
            </button>
          ))}

          {messages.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: 'auto', padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
              onClick={handleClearChat}
              title="ಸಂಭಾಷಣೆ ತೆರವುಗೊಳಿಸಿ (Clear Chat)"
            >
              <Trash2 size={13} />
              <span>ತೆರವುಗೊಳಿಸಿ</span>
            </button>
          )}
        </div>

        {/* Empty State when chat is empty */}
        {messages.length === 0 && (
          <div className="empty-state-card fade-in">
            <div className="empty-state-icon-wrap">
              <Mic size={24} />
            </div>
            <div className="empty-state-title">ಸಂಭಾಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ</div>
            <div className="empty-state-desc">
              ಕೆಳಗಿನ ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಮೇಲಿನ ಸಲಹೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ.
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={startListening}
            >
              <Mic size={16} />
              <span>ಮಾತನಾಡಲು ಒತ್ತಿ (Click to Speak)</span>
            </button>
          </div>
        )}

        {/* Conversation Stream */}
        {messages.length > 0 && (
          <div className="voice-stream-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender} fade-in`}>
                <div style={{ fontSize: '0.96rem' }}>{msg.textKn}</div>
                {langMode === 'bilingual' && msg.textEn && (
                  <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px', fontStyle: 'italic' }}>
                    {msg.textEn}
                  </div>
                )}

                <div className="bubble-actions">
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      {/* Assistant Mode Badges */}
                      {(msg.mode === 'gemini-live' || msg.mode === 'live-api') && (
                        <span className="mode-badge badge-live" title="Google Gemini ಲೈವ್ ಮಾದರಿಯಿಂದ ಉತ್ತರಿಸಲಾಗಿದೆ">
                          ✨ ಲೈವ್ AI
                        </span>
                      )}
                      {(msg.mode === 'demo-mode' || msg.mode === 'demo') && (
                        <span className="mode-badge badge-demo" title="ಬ್ಯಾಕೆಂಡ್ ನಿಯಮ-ಆಧಾರಿತ ಜ್ಞಾನ ಭಂಡಾರದಿಂದ ಉತ್ತರಿಸಲಾಗಿದೆ">
                          ⚙️ ಡೆಮೋ ಸಹಾಯಕ
                        </span>
                      )}
                      {msg.mode === 'offline-demo' && (
                        <span className="mode-badge badge-offline" title="ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲದ ಕಾರಣ ಆಫ್‌ಲೈನ್ ಉತ್ತರ">
                          ⚠️ ಆಫ್‌ಲೈನ್
                        </span>
                      )}

                      {/* Read Aloud Button */}
                      <button
                        type="button"
                        style={{
                          background: currentSpeakingId === msg.id ? 'var(--color-flag-yellow-light)' : 'none',
                          border: currentSpeakingId === msg.id ? '1px solid var(--color-flag-yellow)' : 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: '2px 6px',
                          cursor: 'pointer',
                          color: currentSpeakingId === msg.id ? 'var(--color-text-main)' : 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                        onClick={() => speakKannada(msg.textKn, msg.id)}
                        title={currentSpeakingId === msg.id ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ (Stop Playback)' : 'ಕನ್ನಡದಲ್ಲಿ ಆಲಿಸಿ (Read Aloud)'}
                      >
                        {currentSpeakingId === msg.id ? (
                          <>
                            <VolumeX size={14} style={{ color: 'var(--color-flag-red)' }} />
                            <span>ನಿಲ್ಲಿಸಿ</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={14} style={{ color: 'var(--color-flag-red)' }} />
                            <span>ಆಲಿಸಿ</span>
                          </>
                        )}
                      </button>

                      {/* Connected Workflows to Solve tab */}
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.74rem', marginLeft: '0.35rem' }}
                        onClick={() => onSendToSolve({ actionType: 'plan', title: 'ಧ್ವನಿ ಸಂಭಾಷಣೆಯಿಂದ ಕ್ರಿಯಾ ಯೋಜನೆ', query: msg.textKn.slice(0, 100), originalText: msg.textKn })}
                        title="ಕ್ರಿಯಾ ಯೋಜನೆ ರಚಿಸಿ (Create Action Plan)"
                      >
                        <Sparkles size={13} style={{ color: 'var(--color-flag-red)' }} />
                        <span>ಯೋಜನೆ</span>
                      </button>

                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.74rem', marginLeft: '0.35rem' }}
                        onClick={() => onSendToSolve({ actionType: 'checklist', title: 'ಧ್ವನಿ ಸಂಭಾಷಣೆಯಿಂದ ಕಾರ್ಯ', tasks: [msg.textKn.slice(0, 90)] })}
                        title="ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ಮಾಡಿ (Make Checklist)"
                      >
                        <ListTodo size={13} style={{ color: 'var(--color-flag-red)' }} />
                        <span>ಪಟ್ಟಿ</span>
                      </button>

                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.74rem', marginLeft: '0.35rem' }}
                        onClick={() => onSendToSolve({ actionType: 'reminder', title: msg.textKn.slice(0, 60) })}
                        title="ನೆನಪೋಲೆ ಸೇರಿಸಿ (Add Reminder)"
                      >
                        <Bell size={13} style={{ color: 'var(--color-flag-red)' }} />
                        <span>ನೆನಪಿಸು</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-bubble assistant fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="spinner" style={{ borderColor: 'rgba(215, 25, 32, 0.2)', borderTopColor: 'var(--color-flag-red)' }}></div>
                <span style={{ fontSize: '0.85rem' }}>ಕನ್ನಡಸಾಥಿ ಯೋಚಿಸುತ್ತಿದೆ...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}

        {/* Error notification for mic issues or browser incompatibilities */}
        {micError && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: '#FDEDEC', border: '1px solid #F5B7B1', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }} className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <div>{micError}</div>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
              onClick={retryListening}
            >
              <RefreshCw size={12} />
              <span>ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ</span>
            </button>
          </div>
        )}

        {/* Speech Synthesis Limitation Notice (Honest explanation if no Kannada TTS voice) */}
        {ttsNotice && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', color: '#92400E', fontSize: '0.82rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }} className="fade-in">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#B45309' }} />
              <div>{ttsNotice}</div>
            </div>
            <button
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              onClick={() => setTtsNotice(null)}
            >
              <XCircle size={16} />
            </button>
          </div>
        )}

        {/* Center Mic Action Cluster with Visual States */}
        <div className="mic-button-cluster">
          <button
            type="button"
            className={`mic-pulse-btn ${!micSupported || micPermissionState === 'denied' ? 'disabled' : isListening ? 'listening' : isSpeaking ? 'speaking' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={!micSupported}
            title={
              !micSupported
                ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ Web Speech API ಲಭ್ಯವಿಲ್ಲ'
                : isListening
                ? 'ಧ್ವನಿ ಗ್ರಹಿಕೆ ನಿಲ್ಲಿಸಿ (Stop Listening)'
                : 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಒತ್ತಿ (Click to Speak Kannada)'
            }
          >
            {isListening ? <MicOff size={34} /> : <Mic size={34} />}
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: isListening ? 'var(--color-flag-red)' : 'var(--color-text-main)' }}>
              {!micSupported
                ? 'ವೆಬ್ ಸ್ಪೀಚ್ ಬೆಂಬಲವಿಲ್ಲ (Web Speech Unavailable)'
                : micPermissionState === 'denied'
                ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ'
                : isListening
                ? 'ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಚಾಲ್ತಿಯಲ್ಲಿದೆ... ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ'
                : isSpeaking
                ? 'ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್ ಚಾಲ್ತಿಯಲ್ಲಿದೆ (Speaking...)'
                : 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ'}
            </div>

            {/* Audio Waves Animated when recording */}
            {isListening && (
              <div className="audio-waves-container" style={{ justifyContent: 'center', marginTop: '6px' }}>
                <div className="audio-wave-bar"></div>
                <div className="audio-wave-bar"></div>
                <div className="audio-wave-bar"></div>
                <div className="audio-wave-bar"></div>
                <div className="audio-wave-bar"></div>
                <div className="audio-wave-bar"></div>
              </div>
            )}

            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              ಭಾಷೆ: ಕನ್ನಡ (kn-IN) • Chrome / Edge Speech API
            </div>
          </div>

          {/* Start, Stop, Cancel, Retry Toolbar */}
          <div className="voice-actions-toolbar">
            {isListening ? (
              <>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={stopListening}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                >
                  <StopCircle size={15} />
                  <span>ನಿಲ್ಲಿಸಿ & ಪರಿಶೀಲಿಸಿ (Stop)</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelListening}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                >
                  <XCircle size={15} />
                  <span>ರದ್ದುಮಾಡಿ (Cancel)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={startListening}
                  disabled={!micSupported}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                >
                  <Mic size={15} />
                  <span>ಮಾತನಾಡಿ (Record Voice)</span>
                </button>

                {micError && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={retryListening}
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                  >
                    <RefreshCw size={15} />
                    <span>ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ (Retry)</span>
                  </button>
                )}
              </>
            )}

            {isSpeaking && (
              <button
                type="button"
                className="btn btn-secondary fade-in"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', borderColor: 'var(--color-flag-red)', color: 'var(--color-flag-red)' }}
                onClick={stopSpeaking}
              >
                <VolumeX size={15} />
                <span>ಮಾತನಾಡುವುದು ನಿಲ್ಲಿಸಿ (Stop Playback)</span>
              </button>
            )}
          </div>
        </div>

        {/* Editable Recognized Kannada Text Card (Before Submission) */}
        <div className="transcript-review-card">
          <div className="transcript-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Edit3 size={14} />
              <span>ಗ್ರಹಿಸಲಾದ ಪಠ್ಯ (ಸಂಪಾದಿಸಬಹುದು / Editable Input):</span>
            </span>
            {transcript && (
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                onClick={() => setTranscript('')}
                title="ಪಠ್ಯ ತೆರವುಗೊಳಿಸಿ"
              >
                <Trash2 size={12} />
                <span>ತೆರವುಗೊಳಿಸಿ</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <input
              type="text"
              className="kn-text"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-cream-border)',
                outline: 'none',
                fontSize: '0.96rem',
                background: '#FFFFFF'
              }}
              placeholder="ಮಾತನಾಡಿದ ಪಠ್ಯ ಇಲ್ಲಿ ಬರುತ್ತದೆ. ಕಳುಹಿಸುವ ಮುನ್ನ ತಿದ್ದಬಹುದು ಅಥವಾ ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಿ..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={!transcript.trim() || isLoading}
              onClick={() => handleSendMessage()}
              title="ಕಳುಹಿಸಿ (Send to KannadaSaathi)"
              style={{ padding: '0.75rem 1.25rem' }}
            >
              {isLoading ? (
                <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#FFF' }}></div>
              ) : (
                <Send size={18} />
              )}
              <span>ಕಳುಹಿಸಿ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
