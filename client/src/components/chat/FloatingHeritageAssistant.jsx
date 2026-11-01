import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Volume2,
  X,
  Sparkles,
  RotateCcw,
  MessageSquare
} from 'lucide-react';

const HERITAGE_CHAT_SUGGESTIONS = [
  { qKn: 'ಹಂಪಿಯ ಕಲ್ಲಿನ ರಥದ ಮಹತ್ವವೇನು?', qEn: 'What is the significance of Hampi Stone Chariot?' },
  { qKn: 'ಮೈಸೂರು ದಸರಾ ಇತಿಹಾಸ ಮತ್ತು ಆಚರಣೆ', qEn: 'History and celebration of Mysuru Dasara' },
  { qKn: 'ಹಲ್ಮಿಡಿ ಶಾಸನದ ವಿಶೇಷತೆಯೇನು?', qEn: 'What is the significance of the Halmidi inscription?' },
  { qKn: 'ಬಸವಣ್ಣನವರ ಕಾಯಕವೇ ಕೈಲಾಸ ತತ್ವ', qEn: 'Basavanna’s "Work is Worship" philosophy' },
  { qKn: 'ಕನ್ನಡದ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ವಿಜೇತರು ಯಾರು?', qEn: 'Who are the Jnanpith award winners in Kannada?' },
  { qKn: 'ಕರ್ನಾಟಕದ ಯುನೆಸ್ಕೋ ತಾಣಗಳು ಯಾವುವು?', qEn: 'Which are the UNESCO sites in Karnataka?' }
];

export default function FloatingHeritageAssistant({ langMode = 'kn' }) {
  const isKn = langMode === 'kn';
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatEngineMode, setChatEngineMode] = useState('verified'); // 'verified' | 'live-api'
  const [activeVoiceId, setActiveVoiceId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef(null);

  // Initial welcome message
  const initialMessages = [
    {
      id: 'welcome_1',
      sender: 'assistant',
      textKn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕರ್ನಾಟಕ ಪರಂಪರೆ AI ಸಹಾಯಕ. ಹಂಪಿ, ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ, ಮೈಸೂರು ದಸರಾ, ವಚನ ಸಾಹಿತ್ಯ, ಜನಪದ ಕಲೆ, ಅಥವಾ ರುಚಿಕರ ಆಹಾರದ ಬಗ್ಗೆ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.',
      textEn: 'Namaskara! I am your Karnataka Heritage AI Assistant. Feel free to ask about Hampi, Hoysala temples, Mysuru Dasara, Vachana literature, folk arts, or royal cuisines.',
      source: 'Verified Heritage Knowledge Engine',
      timestamp: isKn ? 'ಪರಂಪರೆ ಸಹಾಯಕ' : 'Heritage Assistant'
    }
  ];

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('kannada_heritage_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialMessages;
  });

  // Save chat to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kannada_heritage_chat', JSON.stringify(chatMessages));
    } catch (e) {}
  }, [chatMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen, isChatLoading]);

  // Stop TTS on unmount or close
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (msgId, textKn, textEn) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (activeVoiceId === msgId && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveVoiceId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = isKn ? (textKn || textEn) : (textEn || textKn);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isKn ? 'kn-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveVoiceId(msgId);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveVoiceId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveVoiceId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleAskAssistant = async (forcedQuery = null) => {
    const question = (forcedQuery || inputVal || '').trim();
    if (!question) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      textKn: question,
      textEn: question,
      timestamp: isKn ? 'ನೀವು' : 'You'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsChatLoading(true);

    try {
      // 1. Try real server API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          lang: isKn ? 'kn' : 'en'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          setChatEngineMode(data.mode === 'gemini-live' ? 'live-api' : 'verified');
          const botMsg = {
            id: 'bot_' + Date.now(),
            sender: 'assistant',
            textKn: data.reply,
            textEn: data.reply,
            source: data.source || (data.mode === 'gemini-live' ? 'Google Gemini 1.5' : 'Verified Heritage Knowledge Engine'),
            timestamp: isKn ? 'ಪರಂಪರೆ ಸಹಾಯಕ' : 'Heritage Assistant'
          };
          setChatMessages((prev) => [...prev, botMsg]);
          setIsChatLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend /api/chat unreachable, using local knowledge base:', err);
    }

    // 2. Client-side intelligent verified Heritage Answer matcher
    const qLower = question.toLowerCase();
    let replyKn = '';
    let replyEn = '';

    if (qLower.includes('ಹಂಪಿ') || qLower.includes('ರಥ') || qLower.includes('hampi') || qLower.includes('chariot')) {
      replyKn = 'ಹಂಪಿಯ ವಿಜಯ ವಿಠ್ಠಲ ದೇವಾಲಯದ ಆವರಣದಲ್ಲಿರುವ ವಿಶ್ವವಿಖ್ಯಾತ ಕಲ್ಲಿನ ರಥವು ವಾಸ್ತವವಾಗಿ ಗರುಡನಿಗೆ ಸಮರ್ಪಿತವಾದ ದೇಗುಲವಾಗಿದೆ. ೧೬ನೇ ಶತಮಾನದಲ್ಲಿ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಚಕ್ರವರ್ತಿ ಶ್ರೀ ಕೃಷ್ಣದೇವರಾಯರ ಕಾಲದಲ್ಲಿ ಇದನ್ನು ನಿರ್ಮಿಸಲಾಯಿತು. ಇದು ಭಾರತೀಯ ಕರೆನ್ಸಿ ೫೦ ರೂಪಾಯಿ ನೋಟಿನಲ್ಲೂ ರಾರಾಜಿಸುತ್ತಿದೆ.';
      replyEn = 'The world-famous Stone Chariot in the Vijaya Vittala temple complex at Hampi is actually a sanctum dedicated to Garuda. Built in the 16th century during the reign of Vijayanagara emperor Sri Krishnadevaraya, it is also featured on the Indian ₹50 currency note.';
    } else if (qLower.includes('ಹಲ್ಮಿಡಿ') || qLower.includes('ಶಾಸನ') || qLower.includes('halmidi') || qLower.includes('inscription')) {
      replyKn = 'ಹಲ್ಮಿಡಿ ಶಾಸನವು (ಸುಮಾರು ಕ್ರಿ.ಶ. ೪೫೦) ಕನ್ನಡ ಭಾಷೆ ಮತ್ತು ಲಿಪಿಯಲ್ಲಿ ದೊರೆತಿರುವ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಅಧಿಕೃತ ಶಿಲಾಶಾಸನವಾಗಿದೆ. ಇದು ಹಾಸನ ಜಿಲ್ಲೆಯ ಬೇಲೂರು ತಾಲ್ಲೂಕಿನ ಹಲ್ಮಿಡಿ ಗ್ರಾಮದಲ್ಲಿ ೧೯೩೬ರಲ್ಲಿ ಡಾ. ಎಂ. ಎಚ್. ಕೃಷ್ಣ ಅವರಿಂದ ಸಂಶೋಧಿಸಲ್ಪಟ್ಟಿತು. ಇದು ಕದಂಬ ದೊರೆ ಕಾಕುಸ್ಥವರ್ಮನ ಆಳ್ವಿಕೆಗೆ ಸೇರಿದೆ.';
      replyEn = 'The Halmidi inscription (c. 450 CE) is the earliest known epigraph written in classical Kannada language and script. Discovered in 1936 by Dr. M. H. Krishna at Halmidi village in Belur taluk (Hassan district), it chronicles the Kadamba king Kakusthavarma.';
    } else if (qLower.includes('ಬಸವಣ್ಣ') || qLower.includes('ಕಾಯಕ') || qLower.includes('basavanna') || qLower.includes('kayaka')) {
      replyKn = 'ಜಗಜ್ಯೋತಿ ಬಸವಣ್ಣನವರ "ಕಾಯಕವೇ ಕೈಲಾಸ" ತತ್ತ್ವದ ಅರ್ಥ: ಯಾವುದೇ ಪ್ರಾಮಾಣಿಕ ದುಡಿಮೆಯು ದೇವರ ಪೂಜೆಗೆ ಸಮಾನವಾಗಿದೆ. ಕಾಯಕದಲ್ಲಿ ಜಾತಿ, ಲಿಂಗ ಅಥವಾ ಅಂತಸ್ತುಗಳ ಭೇದವಿರುವುದಿಲ್ಲ. ಎಲ್ಲರೂ ಸಮಾಜಕ್ಕೆ ಸ್ವಾವಲಂಬಿ ಕೊಡುಗೆ ನೀಡುವುದು ಅವರ ಮುಖ್ಯ ಸಂದೇಶವಾಗಿತ್ತು.';
      replyEn = 'Jagajjyothi Basavanna’s philosophy "Work is Worship" (Kayakave Kailasa) asserts that honest, dedicated labour itself is divine. Rejecting caste and social hierarchy, it teaches that every honest profession is sacred.';
    } else if (qLower.includes('ಮೈಸೂರು') || qLower.includes('ದಸರಾ') || qLower.includes('mysuru') || qLower.includes('dasara')) {
      replyKn = 'ಮೈಸೂರು ದಸರಾವು ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ನಾಡಹಬ್ಬವಾಗಿದೆ. ಇದನ್ನು ೧೬೧೦ರಲ್ಲಿ ಶ್ರೀರಂಗಪಟ್ಟಣದಲ್ಲಿ ರಾಜ ಒಡೆಯರ್ ಪ್ರಾರಂಭಿಸಿದರು. ವಿಜಯದಶಮಿಯಂದು ಜಂಬೂಸವಾರಿ ಮೆರವಣಿಗೆಯಲ್ಲಿ ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಿಯ ಚಿನ್ನದ ಅಂಬಾರಿಯನ್ನು ಆನೆಯು ಹೊತ್ತು ಸಾಗುವುದು ಈ ಹಬ್ಬದ ಮುಖ್ಯ ವೈಭವ.';
      replyEn = 'Mysuru Dasara is the official state festival (Naadahabba) of Karnataka, initiated in 1610 at Srirangapatna by Raja Wodeyar. The grand finale features the famous Jamboo Savari where Goddess Chamundeshwari is carried in a 750kg golden howdah on an elephant.';
    } else if (qLower.includes('ಮೈಸೂರು ಪಾಕ್') || qLower.includes('mysore pak')) {
      replyKn = 'ಮೈಸೂರು ಪಾಕ್ ಸಿಹಿಯು ೧೯೩೫ರಲ್ಲಿ ಮೈಸೂರು ಅರಮನೆಯ ರಾಜ ಅಡುಗೆಯವರಾದ ಕಾಕಾಸುರ ಮಾದಪ್ಪನವರಿಂದ ಸೃಷ್ಟಿಸಲ್ಪಟ್ಟಿತು. ಕಡಲೆಹಿಟ್ಟು, ಸಕ್ಕರೆ ಪಾಕ ಮತ್ತು ಶುದ್ಧ ತುಪ್ಪದಿಂದ ತಯಾರಿಸಿದ ಈ ಸಿಹಿಯನ್ನು ಮೆಚ್ಚಿದ ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ ಅವರು ಇದಕ್ಕೆ "ಮೈಸೂರು ಪಾಕ್" ಎಂದು ನಾಮಕರಣ ಮಾಡಿದರು.';
      replyEn = 'Mysore Pak was created in 1935 by royal chef Kakasura Madappa in Mysore Palace. Delighted by the melt-in-mouth confection, Maharaja Nalwadi Krishnaraja Wodeyar officially named it "Mysore Pak".';
    } else if (qLower.includes('ಜ್ಞಾನಪೀಠ') || qLower.includes('jnanpith')) {
      replyKn = 'ಕನ್ನಡ ಭಾಷೆಯು ಭಾರತದಲ್ಲೇ ಎರಡನೇ ಅತಿ ಹೆಚ್ಚು ೮ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳನ್ನು ಮುಡಿಗೇರಿಸಿಕೊಂಡಿದೆ: ಕುವೆಂಪು (೧೯೬೭), ದ.ರಾ. ಬೇಂದ್ರೆ (೧೯೭೩), ಶಿವರಾಮ ಕಾರಂತ (೧೯೭೭), ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್ (೧೯೮೩), ವಿ.ಕೃ. ಗೋಕಾಕ (೧೯೯೦), ಯು.ಆರ್. ಅನಂತಮೂರ್ತಿ (೧೯೯೪), ಗಿರೀಶ್ ಕಾರ್ನಾಡ್ (೧೯೯೮), ಮತ್ತು ಚಂದ್ರಶೇಖರ ಕಂಬಾರ (೨೦೧೦).';
      replyEn = 'Kannada has won 8 prestigious Jnanpith Awards, the second highest for any Indian language: Kuvempu (1967), D. R. Bendre (1973), K. Shivaram Karanth (1977), Masti Venkatesha Iyengar (1983), V. K. Gokak (1990), U. R. Ananthamurthy (1994), Girish Karnad (1998), and Chandrashekhara Kambara (2010).';
    } else if (qLower.includes('ಯುನೆಸ್ಕೋ') || qLower.includes('unesco')) {
      replyKn = 'ಕರ್ನಾಟಕದಲ್ಲಿ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣಗಳು: ಹಂಪಿಯ ಸ್ಮಾರಕಗಳು (೧೯೮೬), ಪಟ್ಟದಕಲ್ಲು (೧೯೮೭), ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು (೨೦೧೨), ಮತ್ತು ಬೇಲೂರು, ಹಳೇಬೀಡು ಹಾಗೂ ಸೋಮನಾಥಪುರದ ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳ ಸಮೂಹ (೨೦೨೩).';
      replyEn = 'UNESCO World Heritage properties in Karnataka include: Monuments of Hampi (1986), Pattadakal (1987), Western Ghats (2012), and the Sacred Ensembles of the Hoysalas at Belur, Halebidu, and Somanathapura (2023).';
    } else {
      replyKn = `ಕರ್ನಾಟಕದ ಪರಂಪರೆಯ ಕುರಿತು ನಿಮ್ಮ ಪ್ರಶ್ನೆ "${question}" ಅತ್ಯಂತ ಸ್ವಾಗತಾರ್ಹ. ಕರ್ನಾಟಕದ ಭವ್ಯ ಇತಿಹಾಸ, ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ, ವಚನ ಸಾಹಿತ್ಯ, ರುಚಿಕರ ಆಹಾರ ಹಾಗೂ ಹಬ್ಬಗಳ ಬಗೆಗಿನ ಪರಿಶೀಲಿಸಿದ ಮಾಹಿತಿಯನ್ನು ಕನ್ನಡಸಾಥಿಯಲ್ಲಿ ಆಲಿಸಬಹುದು ಮತ್ತು ಕಲಿಯಬಹುದು.`;
      replyEn = `Your question about Karnataka’s heritage regarding "${question}" is significant. You can explore verified details, audio narrations, and architectural sources across all our cultural categories.`;
    }

    const botMsg = {
      id: 'bot_' + Date.now(),
      sender: 'assistant',
      textKn: replyKn,
      textEn: replyEn,
      source: 'Verified Heritage Knowledge Engine',
      timestamp: isKn ? 'ಪರಂಪರೆ ಸಹಾಯಕ' : 'Heritage Assistant'
    };

    setChatMessages((prev) => [...prev, botMsg]);
    setIsChatLoading(false);
  };

  const handleClearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveVoiceId(null);
    setChatMessages(initialMessages);
    localStorage.removeItem('kannada_heritage_chat');
  };

  return (
    <>
      {/* 1. Global Floating Pill Trigger Button in Bottom-Right Corner */}
      <button
        type="button"
        className="floating-heritage-chat-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={isKn ? "ಕನ್ನಡ AI (AI Chatbot)" : "Kannada AI (Chatbot)"}
        aria-label={isKn ? "ಕನ್ನಡ AI ತೆರೆಯಿರಿ" : "Open Kannada AI"}
      >
        <div className="floating-heritage-icon-box">
          <Bot size={16} />
        </div>
        <span className="kn-heading floating-heritage-chat-text" style={{ letterSpacing: '0.01em' }}>
          {isKn ? 'ಕನ್ನಡ AI' : 'Kannada AI'}
        </span>
      </button>

      {/* 2. Global Floating Chatbot Modal / Panel */}
      {isOpen && (
        <div
          className="floating-heritage-panel"
          role="dialog"
          aria-label="Karnataka Heritage Assistant AI"
        >
          {/* Header */}
          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'linear-gradient(135deg, #FFFDF0 0%, #FFF5EB 100%)',
              borderBottom: '1px solid var(--color-cream-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--color-flag-red)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(200, 16, 46, 0.25)'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div className="kn-heading" style={{ fontSize: '0.95rem', color: '#111111', lineHeight: 1.2 }}>
                  {isKn ? 'ಪರಂಪರೆ AI ಸಹಾಯಕ' : 'Heritage AI Assistant'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={11} />
                  <span>{isKn ? 'ಪರಿಶೀಲಿಸಿದ ಜ್ಞಾನ ಭಂಡಾರ' : 'Verified Knowledge Engine'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={handleClearChat}
                title={isKn ? 'ಸಂಭಾಷಣೆ ತೆರವುಗೊಳಿಸಿ' : 'Clear chat'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#666666',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={isKn ? 'ಮುಚ್ಚಿ' : 'Close'}
                aria-label={isKn ? 'ಮುಚ್ಚಿ' : 'Close'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#555555',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              background: '#FAFAF8'
            }}
          >
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              const text = isKn ? (msg.textKn || msg.text) : (msg.textEn || msg.textKn || msg.text);
              const isSpeakingMsg = activeVoiceId === msg.id && isSpeaking;

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: isUser ? 'var(--color-flag-red)' : '#FFFFFF',
                    color: isUser ? '#FFFFFF' : '#222222',
                    border: isUser ? 'none' : '1px solid #E5E7EB',
                    borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    padding: '0.7rem 0.9rem',
                    fontSize: '0.84rem',
                    lineHeight: 1.55,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-kannada)' }}>{text}</div>

                  {!isUser && (
                    <div
                      style={{
                        marginTop: '0.45rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #F3F4F6',
                        paddingTop: '0.35rem'
                      }}
                    >
                      <span style={{ fontSize: '0.66rem', color: '#888888', fontWeight: 600 }}>
                        {msg.source}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakText(msg.id, msg.textKn, msg.textEn)}
                        style={{
                          background: isSpeakingMsg ? 'var(--color-flag-red)' : '#F3F4F6',
                          color: isSpeakingMsg ? '#FFFFFF' : '#374151',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.2rem 0.5rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}
                      >
                        <Volume2 size={12} />
                        <span>{isSpeakingMsg ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಆಲಿಸಿ' : 'Listen')}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {isChatLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.6rem 0.9rem',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px 16px 16px 2px',
                  fontSize: '0.8rem',
                  color: '#666666',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-flag-red)', animation: 'pulse 1s infinite' }} />
                <span>{isKn ? 'ಉತ್ತರವನ್ನು ತಯಾರಿಸಲಾಗುತ್ತಿದೆ…' : 'Generating heritage response…'}</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              background: '#FFFDF7',
              borderTop: '1px solid #EEEEEE',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            {HERITAGE_CHAT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAskAssistant(isKn ? sug.qKn : sug.qEn)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.72rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '9999px',
                  background: '#FFFFFF',
                  border: '1px solid var(--color-flag-yellow-border)',
                  color: '#4B5563',
                  cursor: 'pointer',
                  fontWeight: 600,
                  flexShrink: 0,
                  transition: 'background 0.15s ease'
                }}
              >
                💬 {isKn ? sug.qKn : sug.qEn}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAssistant();
            }}
            style={{
              padding: '0.65rem 0.75rem',
              background: '#FFFFFF',
              borderTop: '1px solid #EEEEEE',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={isKn ? 'ಕರ್ನಾಟಕದ ಪರಂಪರೆ ಬಗ್ಗೆ ಕೇಳಿ…' : 'Ask about Karnataka’s heritage…'}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                borderRadius: '9999px',
                border: '1.5px solid #D1D5DB',
                fontSize: '0.84rem',
                outline: 'none',
                fontFamily: 'var(--font-kannada)'
              }}
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isChatLoading}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: inputVal.trim() && !isChatLoading ? 'var(--color-flag-red)' : '#E5E7EB',
                color: '#FFFFFF',
                border: 'none',
                cursor: inputVal.trim() && !isChatLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                flexShrink: 0
              }}
              title={isKn ? 'ಕಳುಹಿಸಿ' : 'Send'}
              aria-label={isKn ? 'ಕಳುಹಿಸಿ' : 'Send'}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

