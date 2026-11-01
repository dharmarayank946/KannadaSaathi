import React, { useState, useEffect, useRef } from 'react';
import SectionHeader from '../layout/SectionHeader';
import { useKannadaSpeech } from '../../utils/kannadaSpeech';
import {
  Presentation,
  Volume2,
  Sparkles,
  Copy,
  Check,
  Clock,
  RotateCcw,
  Play,
  Pause,
  BookOpen,
  BookmarkPlus,
  Send,
  AlertCircle,
  FileText,
  CheckCircle2,
  Layers,
  StopCircle
} from 'lucide-react';

export default function StudentSection({ onBackToHome, langMode }) {
  const isKn = langMode === 'kn';

  const [activeTab, setActiveTab] = useState('speech'); // 'speech' | 'notes' | 'presentation'

  // Speech Generator Form State
  const [topic, setTopic] = useState('ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ');
  const [speechLang, setSpeechLang] = useState('kn');
  const [speechDuration, setSpeechDuration] = useState('2-3 min');
  const [speechLevel, setSpeechLevel] = useState('school');
  const [isGenerating, setIsGenerating] = useState(false);
  const [speechError, setSpeechError] = useState(null);

  // Generated Speech Result
  const [generatedSpeech, setGeneratedSpeech] = useState({
    title: 'ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ ಶಾಲಾ ಭಾಷಣ',
    introduction: 'ಗೌರವಾನ್ವಿತ ಮುಖ್ಯ ಅತಿಥಿಗಳೇ, ಪ್ರಾಂಶುಪಾಲರೇ, ಪೂಜ್ಯ ಗುರುಗಳೇ ಹಾಗೂ ನನ್ನ ಪ್ರೀತಿಯ ಸಹಪಾಠಿಗಳೇ, ಎಲ್ಲರಿಗೂ ೬೯ನೇ ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು.',
    mainPoints: [
      '೧೯೫೬ರ ನವೆಂಬರ್ ೧ ರಂದು ಭಾಷಾವಾರು ಪ್ರಾಂತ್ಯಗಳ ಆಧಾರದ ಮೇಲೆ ಮೈಸೂರು ರಾಜ್ಯ ಉದಯವಾಯಿತು; ನಂತರ ೧೯೭೩ರಲ್ಲಿ "ಕರ್ನಾಟಕ" ಎಂದು ಮರುನಾಮಕರಣಗೊಂಡಿತು.',
      'ಕನ್ನಡ ಭಾಷೆಗೆ ೨೫೦೦ಕ್ಕೂ ಹೆಚ್ಚು ವರ್ಷಗಳ ಪ್ರಾಚೀನ ಇತಿಹಾಸವಿದ್ದು, ಶಾಸ್ತ್ರೀಯ ಭಾಷೆಯ ಉನ್ನತ ಸ್ಥಾನಮಾನ ದೊರೆತಿದೆ.',
      'ಪಂಪ, ರನ್ನ, ಬಸವಣ್ಣ, ಕುವೆಂಪು, ಬೇಂದ್ರೆಯವರಿಂದ ಹಿಡಿದು ಎಂಟು ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ಪುರಸ್ಕೃತರ ಭವ್ಯ ಸಾಹಿತ್ಯ ಪರಂಪರೆ ನಮ್ಮದು.',
      'ದೈನಂದಿನ ಜೀವನದಲ್ಲಿ ಕನ್ನಡವನ್ನು ಹೆಮ್ಮೆಯಿಂದ ಬಳಸುವ ಮೂಲಕ ನಮ್ಮ ಸಂಸ್ಕೃತಿಯನ್ನು ಉಳಿಸಿ ಬೆಳೆಸಬೇಕಾಗಿದೆ.'
    ],
    conclusion: 'ಎಲ್ಲಾದ್ರೂ ಇರು, ಎಂತಾದ್ರೂ ಇರು, ಎಂದೆಂದಿಗೂ ನೀ ಕನ್ನಡವಾಗಿರು! ಜೈ ಹಿಂದ್! ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ!',
    fullSpeech: `ಗೌರವಾನ್ವಿತ ಮುಖ್ಯ ಅತಿಥಿಗಳೇ, ಪ್ರಾಂಶುಪಾಲರೇ, ಪೂಜ್ಯ ಗುರುಗಳೇ ಹಾಗೂ ನನ್ನ ಪ್ರೀತಿಯ ಸಹಪಾಠಿಗಳೇ, ಎಲ್ಲರಿಗೂ ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು!

"ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ" ಎಂಬ ಕವಿವಾಣಿಯಂತೆ, ನವೆಂಬರ್ ೧ ನಮ್ಮೆಲ್ಲ ಕನ್ನಡಿಗರಿಗೂ ಹೆಮ್ಮೆಯ ಸಂಭ್ರಮದ ದಿನ. ೧೯೫೬ರಲ್ಲಿ ಮೈಸೂರು ರಾಜ್ಯವಾಗಿ ಏಕೀಕರಣಗೊಂಡ ನಮ್ಮ ನಾಡು, ೧೯೭೩ರಲ್ಲಿ 'ಕರ್ನಾಟಕ' ಎಂದು ನಾಮಕರಣಗೊಂಡಿತು.

ಕನ್ನಡ ಭಾಷೆಗೆ ಎರಡು ಸಾವಿರ ವರ್ಷಗಳಿಗೂ ಮೀರಿದ ಭವ್ಯ ಇತಿಹಾಸವಿದೆ. ಪಂಪ, ರನ್ನ, ಬಸವಣ್ಣ, ಅಲ್ಲಮಪ್ರಭು, ಕುಮಾರವ್ಯಾಸರಿಂದ ಹಿಡಿದು ಎಂಟು ಜ್ಞಾನಪೀಠ ಪುರಸ್ಕೃತರವರೆಗೆ ನಮ್ಮ ಸಾಹಿತ್ಯ ಲೋಕ ವಿಶ್ವಮಾನ್ಯವಾಗಿದೆ.

ಕೇವಲ ನವೆಂಬರ್ ತಿಂಗಳಿನಲ್ಲಿ ಮಾತ್ರವಲ್ಲದೆ, ದಿನನಿತ್ಯದ ಬದುಕಿನಲ್ಲಿ ನಾವು ಕನ್ನಡವನ್ನು ಬಳಸಬೇಕು, ಪ್ರೀತಿಸಬೇಕು ಮತ್ತು ಮುಂದಿನ ಪೀಳಿಗೆಗೆ ಉಳಿಸಿ ಬೆಳೆಸಬೇಕು.

"ಎಲ್ಲಾದ್ರೂ ಇರು, ಎಂತಾದ್ರೂ ಇರು, ಎಂದೆಂದಿಗೂ ನೀ ಕನ್ನಡವಾಗಿರು!"

ಧನ್ಯವಾದಗಳು! ಜೈ ಹಿಂದ್! ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!`,
    isAiGenerated: false
  });

  const [editableFullSpeech, setEditableFullSpeech] = useState(generatedSpeech.fullSpeech);
  const [isCopied, setIsCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Suggestions for quick selection
  const topicSuggestions = [
    { labelKn: '🚩 ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ', labelEn: '🚩 Karnataka Rajyotsava', query: 'ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ' },
    { labelKn: '🇮🇳 ಸ್ವಾತಂತ್ರ್ಯ ದಿನಾಚರಣೆ', labelEn: '🇮🇳 Independence Day', query: 'ಸ್ವಾತಂತ್ರ್ಯ ದಿನಾಚರಣೆ' },
    { labelKn: '🏛️ ಗಣರಾಜ್ಯೋತ್ಸವ', labelEn: '🏛️ Republic Day', query: 'ಗಣರಾಜ್ಯೋತ್ಸವ' },
    { labelKn: '🌱 ವಿಶ್ವ ಪರಿಸರ ದಿನ', labelEn: '🌱 Environment Day', query: 'ಪರಿಸರ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಗಿಡ ನೆಡುವಿಕೆ' },
    { labelKn: '💻 ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಶಿಕ್ಷಣ', labelEn: '💻 Tech & Education', query: 'ವಿಜ್ಞಾನ ಮತ್ತು ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಕನ್ನಡ' }
  ];

  // Presentation Rehearsal Timer State
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Sync editable text when generated speech changes
  useEffect(() => {
    setEditableFullSpeech(generatedSpeech.fullSpeech);
  }, [generatedSpeech]);

  // Handle Speech Generation API Call
  const handleGenerateSpeech = async (e) => {
    if (e) e.preventDefault();
    const cleanTopic = topic.trim();
    if (!cleanTopic) return;

    setIsGenerating(true);
    setSpeechError(null);

    try {
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: cleanTopic,
          language: speechLang,
          duration: speechDuration,
          level: speechLevel
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'AI_CONFIG_REQUIRED') {
          setSpeechError(
            isKn
              ? 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಭಾಷಣ ಸೃಷ್ಟಿಗೆ ಸರ್ವರ್‌ನಲ್ಲಿ GEMINI_API_KEY ಸಂರಚನೆಯ ಅಗತ್ಯವಿದೆ. ಕೆಳಗಿನ ಪರಿಶೀಲಿತ ಶಿಫಾರಸು ವಿಷಯಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.'
              : 'AI generation service requires GEMINI_API_KEY in server/.env. Please choose from the curated verified speech topics below.'
          );
        } else {
          setSpeechError(data.error || (isKn ? 'ಭಾಷಣ ಸೃಷ್ಟಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to generate speech.'));
        }
        setIsGenerating(false);
        return;
      }

      setGeneratedSpeech(data);
      setEditableFullSpeech(data.fullSpeech);
      setIsGenerating(false);
    } catch (err) {
      setSpeechError(
        isKn
          ? 'ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಸರ್ವರ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.'
          : 'Could not connect to backend speech service. Please ensure the server is running.'
      );
      setIsGenerating(false);
    }
  };

  // Timer useEffect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableFullSpeech);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const { playSpeech, stopSpeech, activeId, isSpeaking } = useKannadaSpeech();

  const handleReadAloud = () => {
    if (activeId === 'student-full-speech' && isSpeaking) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    if (!editableFullSpeech) return;

    setIsPlayingAudio(true);
    playSpeech({
      text: editableFullSpeech,
      lang: speechLang === 'en' ? 'en' : 'kn',
      id: 'student-full-speech',
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleSaveToCompanion = () => {
    const saved = localStorage.getItem('kannada_saathi_phrases');
    let list = [];
    if (saved) {
      try { list = JSON.parse(saved); } catch (e) {}
    }
    list.unshift({
      id: Date.now(),
      kn: `${generatedSpeech.title}: ${editableFullSpeech.slice(0, 100)}...`,
      en: 'Student Speech Note',
      date: isKn ? 'ಉಳಿಸಲಾಗಿದೆ' : 'Saved'
    });
    localStorage.setItem('kannada_saathi_phrases', JSON.stringify(list));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ಭಾಗ ೭ • ವಿದ್ಯಾರ್ಥಿ ಭಾಷಣ ಸೃಷ್ಟಿಕರ್ತ"
        badgeEn="PART 7 • Student Speech Generator"
        titleKn="ವಿದ್ಯಾರ್ಥಿ ಭಾಷಣ ಸೃಷ್ಟಿಕರ್ತ"
        titleEn="Student Speech Generator & Assistant"
        taglineKn="ಶಾಲಾ-ಕಾಲೇಜು ವೇದಿಕೆ ಭಾಷಣಗಳು, ರಚನಾತ್ಮಕ ಸಾರಾಂಶ, ಮಾದರಿ ವಾಚನ ಮತ್ತು ಅಭ್ಯಾಸ ಟೈಮರ್"
        taglineEn="AI & curated speech generator with structured intro, key points, conclusion, copy, and TTS"
        icon={Presentation}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      <div className="section-body">
        {/* Module Nav Tabs */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            { id: 'speech', titleKn: '🎙️ ಭಾಷಣ ಸೃಷ್ಟಿಕರ್ತ (Speech Generator)', titleEn: '🎙️ Speech Generator' },
            { id: 'notes', titleKn: '📝 ಶೈಕ್ಷಣಿಕ ನೋಟ್ಸ್ & ಸಾರಾಂಶ', titleEn: '📝 Study Notes' },
            { id: 'presentation', titleKn: '⏱️ ಪ್ರಸ್ತುತಿ ಟೈಮರ್ & ಅಭ್ಯಾಸ', titleEn: '⏱️ Rehearsal Timer' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`filter-chip ${activeTab === t.id ? 'active' : ''}`}
              style={{ fontSize: '0.88rem', padding: '0.45rem 0.95rem' }}
              onClick={() => setActiveTab(t.id)}
            >
              {isKn ? t.titleKn : t.titleEn}
            </button>
          ))}
        </div>

        {/* Tab 1: Speech Generator Workspace */}
        {activeTab === 'speech' && (
          <div>
            {/* Input & Configuration Card */}
            <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem', border: '1px solid var(--color-cream-border)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-flag-red)' }}>
                  {isKn ? 'ಯಾವುದೇ ವಿಷಯದ ಮೇಲೆ ಭಾಷಣ ರಚಿಸಿ' : 'Generate Structured Speech on Any Topic'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                  {isKn
                    ? 'ವಿಷಯ ನಮೂದಿಸಿ, ಭಾಷೆ ಮತ್ತು ಶಾಲಾ/ಕಾಲೇಜು ಹಂತ ಆರಿಸಿ "ಭಾಷಣ ರಚಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ:'
                    : 'Enter your topic, pick language, level and duration, then generate a full structured speech:'}
                </p>
              </div>

              <form onSubmit={handleGenerateSpeech}>
                {/* Search / Topic Input Field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#111' }}>
                    {isKn ? 'ಭಾಷಣದ ವಿಷಯ:' : 'Speech Topic:'}
                  </label>
                  <input
                    type="text"
                    className="select-input"
                    style={{ width: '100%', fontSize: '1.02rem', padding: '0.65rem 1rem', borderRadius: '10px' }}
                    placeholder={isKn ? 'ಉದಾಹರಣೆ: ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ, ಸ್ವಾತಂತ್ರ್ಯ ದಿನ, ಪರಿಸರ ಸಂರಕ್ಷಣೆ...' : 'e.g. Karnataka Rajyotsava, Independence Day, Clean Environment, Artificial Intelligence...'}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>

                {/* Quick Topic Suggestions */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                    {isKn ? 'ಜನಪ್ರಿಯ ವಿಷಯಗಳ ಶಿಫಾರಸು:' : 'Popular Topic Suggestions:'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                    {topicSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`topic-suggestion-pill ${topic === sug.query ? 'active' : ''}`}
                        onClick={() => {
                          setTopic(sug.query);
                        }}
                      >
                        {isKn ? sug.labelKn : sug.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Controls Grid Aligned with Submit Button */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
                  {/* Language */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: '#333' }}>
                      {isKn ? 'ಭಾಷೆ:' : 'Language:'}
                    </label>
                    <select
                      className="select-input"
                      style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1.5px solid #D1D5DB', padding: '0.5rem 0.75rem', fontSize: '0.9rem', background: '#FFF' }}
                      value={speechLang}
                      onChange={(e) => setSpeechLang(e.target.value)}
                    >
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  {/* Level */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: '#333' }}>
                      {isKn ? 'ಶೈಕ್ಷಣಿಕ ಹಂತ:' : 'Target Level:'}
                    </label>
                    <select
                      className="select-input"
                      style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1.5px solid #D1D5DB', padding: '0.5rem 0.75rem', fontSize: '0.9rem', background: '#FFF' }}
                      value={speechLevel}
                      onChange={(e) => setSpeechLevel(e.target.value)}
                    >
                      <option value="school">{isKn ? 'ಶಾಲೆ (School Level)' : 'School Level'}</option>
                      <option value="college">{isKn ? 'ಕಾಲೇಜು (College Level)' : 'College Level'}</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: '#333' }}>
                      {isKn ? 'ಅವಧಿ:' : 'Speech Duration:'}
                    </label>
                    <select
                      className="select-input"
                      style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1.5px solid #D1D5DB', padding: '0.5rem 0.75rem', fontSize: '0.9rem', background: '#FFF' }}
                      value={speechDuration}
                      onChange={(e) => setSpeechDuration(e.target.value)}
                    >
                      <option value="2-3 min">{isKn ? '೨ ರಿಂದ ೩ ನಿಮಿಷ (ಶಿಫಾರಸು)' : '2 to 3 minutes'}</option>
                      <option value="3-5 min">{isKn ? '೩ ರಿಂದ ೫ ನಿಮಿಷ' : '3 to 5 minutes'}</option>
                      <option value="5+ min">{isKn ? '೫+ ನಿಮಿಷ' : '5+ minutes'}</option>
                    </select>
                  </div>

                  {/* Submit Action Perfectly Aligned */}
                  <div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isGenerating}
                      style={{
                        width: '100%',
                        height: '44px',
                        padding: '0 1.25rem',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '10px',
                        background: 'var(--color-flag-red)',
                        color: '#FFFFFF',
                        border: 'none',
                        boxShadow: '0 2px 6px rgba(185, 28, 28, 0.25)',
                        cursor: isGenerating ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Sparkles size={16} />
                      <span>{isGenerating ? (isKn ? 'ರಚಿಸಲಾಗುತ್ತಿದೆ...' : 'Generating...') : (isKn ? 'ಭಾಷಣ ರಚಿಸಿ' : 'Generate Speech')}</span>
                    </button>
                  </div>
                </div>

                {speechError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-flag-red)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    <span>{speechError}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Generated Speech Display Workspace */}
            <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1.5px solid var(--color-flag-yellow-border)' }}>
              {/* Header with Badges & Action Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid #EEE' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 className="kn-heading" style={{ fontSize: '1.3rem', margin: 0, color: '#111' }}>
                      {generatedSpeech.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', background: generatedSpeech.isAiGenerated ? '#E8F8F5' : 'var(--color-flag-yellow-soft)', color: generatedSpeech.isAiGenerated ? '#1E8449' : '#886200', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                      {generatedSpeech.isAiGenerated ? '✨ Gemini AI' : '📘 Verified Curated Database'}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: '#F0F4FF', color: '#1B6594', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                      ⏱ {speechDuration}
                    </span>
                  </div>
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    type="button"
                    className={`btn-compact-speaker ${isPlayingAudio ? 'speaking' : ''}`}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                    onClick={handleReadAloud}
                  >
                    {isPlayingAudio ? <StopCircle size={15} /> : <Volume2 size={15} />}
                    <span>{isPlayingAudio ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ವಾಚನ ಆಲಿಸಿ' : 'Read Aloud')}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '12px' }}
                    onClick={handleSaveToCompanion}
                  >
                    {savedNotice ? <Check size={15} color="#2ECC71" /> : <BookmarkPlus size={15} />}
                    <span>{savedNotice ? (isKn ? 'ಉಳಿಸಲಾಗಿದೆ' : 'Saved') : (isKn ? 'ಟಿಪ್ಪಣಿ ಉಳಿಸಿ' : 'Save')}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '12px' }}
                    onClick={handleCopy}
                  >
                    {isCopied ? <Check size={15} color="#2ECC71" /> : <Copy size={15} />}
                    <span>{isCopied ? (isKn ? 'ನಕಲಾಗಿದೆ' : 'Copied') : (isKn ? 'ನಕಲಿಸಿ' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* 3 Structured Pillars: Intro, Main Points, Conclusion */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Introduction Box */}
                <div className="speech-pillar-card speech-pillar-intro">
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>✦</span>
                    <span>{isKn ? '೧. ಆರಂಭ / ಪೀಠಿಕೆ (Introduction)' : '1. Introduction'}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#1F2937', lineHeight: 1.65, margin: 0 }}>
                    {generatedSpeech.introduction}
                  </p>
                </div>

                {/* Main Points Box */}
                <div className="speech-pillar-card speech-pillar-points">
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#BE123C', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>✦</span>
                    <span>{isKn ? '೨. ಮುಖ್ಯ ಅಂಶಗಳು (Key Points)' : '2. Key Points'}</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.86rem', color: '#1F2937', lineHeight: 1.65 }}>
                    {generatedSpeech.mainPoints && generatedSpeech.mainPoints.map((pt, pIdx) => (
                      <li key={pIdx} style={{ marginBottom: '0.3rem' }}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* Conclusion Box */}
                <div className="speech-pillar-card speech-pillar-conclusion">
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>✦</span>
                    <span>{isKn ? '೩. ಮುಕ್ತಾಯ (Conclusion)' : '3. Conclusion'}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#1F2937', lineHeight: 1.65, margin: 0 }}>
                    {generatedSpeech.conclusion}
                  </p>
                </div>
              </div>

              {/* Full Editable Speech Area */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: '#111' }}>
                  {isKn ? 'ಸಂಪೂರ್ಣ ಭಾಷಣದ ಪಠ್ಯ (ಸಂಪಾದಿಸಬಹುದು):' : 'Full Speech Text (Editable Teleprompter):'}
                </label>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '260px',
                    background: '#FFFFFF',
                    border: '1.5px solid var(--color-cream-border)',
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  className="kn-text"
                  value={editableFullSpeech}
                  onChange={(e) => setEditableFullSpeech(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Study Notes Workspace */}
        {activeTab === 'notes' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--color-cream-border)' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? 'ಕನ್ನಡ ವಿಷಯಗಳ ಸಾರಾಂಶ ಮತ್ತು ನೋಟ್ಸ್' : 'Kannada Subject Notes & Summaries'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                {isKn
                  ? 'ಪರಿಶೀಲಿತ ಚಾರಿತ್ರಿಕ ಮತ್ತು ಸಾಹಿತ್ಯಿಕ ಟಿಪ್ಪಣಿಗಳು (ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆಗಾಗಿ):'
                  : 'Curated historical and literary revision notes for exams:'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1rem' }}>
              <div
                style={{
                  background: '#FFFDF7',
                  border: '1px solid var(--color-cream-border)',
                  borderRadius: '12px',
                  padding: '1.15rem'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-flag-red)', textTransform: 'uppercase' }}>
                  {isKn ? 'ಚರಿತ್ರೆ & ಏಕೀಕರಣ' : 'History & Unification'}
                </div>
                <h4 className="kn-heading" style={{ fontSize: '1.05rem', color: '#111', margin: '0.35rem 0' }}>
                  {isKn ? 'ಕರ್ನಾಟಕದ ಏಕೀಕರಣ ಚರಿತ್ರೆ' : 'History of Karnataka Unification'}
                </h4>
                <p className="kn-text" style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.6 }}>
                  {isKn
                    ? 'ಆಲೂರು ವೆಂಕಟರಾವ್, ಹುಯಿಲಗೋಳ ನಾರಾಯಣರಾವ್ ಮುಂತಾದ ಮಹನೀಯರ ಪರಿಶ್ರಮದಿಂದ ೧೯೫೬ರ ನವೆಂಬರ್ ೧ ರಂದು ಮೈಸೂರು ರಾಜ್ಯವಾಗಿ ಏಕೀಕರಣಗೊಂಡಿತು. ೧೯೭೩ರ ನವೆಂಬರ್ ೧ ರಂದು ಡಿ. ದೇವರಾಜ ಅರಸು ಅವರ ಕಾಲದಲ್ಲಿ "ಕರ್ನಾಟಕ" ಎಂದು ಮರುನಾಮಕರಣವಾಯಿತು.'
                    : 'Through the historic efforts of Aluru Venkatarao and others, the state unified on Nov 1, 1956 as Mysore State, later officially renamed Karnataka on Nov 1, 1973.'}
                </p>
              </div>

              <div
                style={{
                  background: '#FFFDF7',
                  border: '1px solid var(--color-cream-border)',
                  borderRadius: '12px',
                  padding: '1.15rem'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-flag-red)', textTransform: 'uppercase' }}>
                  {isKn ? 'ಸಾಹಿತ್ಯ & ಪ್ರಶಸ್ತಿಗಳು' : 'Literature & Awards'}
                </div>
                <h4 className="kn-heading" style={{ fontSize: '1.05rem', color: '#111', margin: '0.35rem 0' }}>
                  {isKn ? '೮ ಜ್ಞಾನಪೀಠ ಪುರಸ್ಕೃತರ ಪಟ್ಟಿ' : 'The 8 Jnanpith Awardees of Kannada'}
                </h4>
                <p className="kn-text" style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.6 }}>
                  {isKn
                    ? '೧. ಕುವೆಂಪು (ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ) • ೨. ದ.ರಾ.ಬೇಂದ್ರೆ (ನಾಕುತಂತಿ) • ೩. ಶಿವರಾಮ ಕಾರಂತ (ಮೂಕಜ್ಜಿಯ ಕನಸುಗಳು) • ೪. ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್ • ೫. ವಿ.ಕೃ.ಗೋಕಾಕ್ • ೬. ಯು.ಆರ್.ಅನಂತಮೂರ್ತಿ • ೭. ಗಿರೀಶ್ ಕಾರ್ನಾಡ್ • ೮. ಚಂದ್ರಶೇಖರ ಕಂಬಾರ.'
                    : '1. Kuvempu • 2. D.R. Bendre • 3. K. Shivaram Karanth • 4. Masti Venkatesha Iyengar • 5. V.K. Gokak • 6. U.R. Ananthamurthy • 7. Girish Karnad • 8. Chandrashekhara Kambara.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Presentation Rehearsal Timer */}
        {activeTab === 'presentation' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem', textAlign: 'center', border: '1px solid var(--color-cream-border)' }}>
            <Presentation size={40} color="var(--color-flag-red)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 className="kn-heading" style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>
              {isKn ? 'ಪ್ರಸ್ತುತಿ ಅಭ್ಯಾಸ ಮತ್ತು ಸಮಯಪಾಲನೆ' : 'Presentation Rehearsal Timer'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
              {isKn
                ? 'ನಿಗದಿತ ಕಾಲಾವಧಿಯಲ್ಲಿ ಭಾಷಣವನ್ನು ಅಚ್ಚುಕಟ್ಟಾಗಿ ಪ್ರಸ್ತುತಪಡಿಸಲು ಟೈಮರ್ ಬಳಸಿ ಅಭ್ಯಾಸ ನಡೆಸಿ:'
                : 'Practice delivering your speech within the target time window:'}
            </p>

            {/* Big Stopwatch Display */}
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'var(--color-flag-yellow-soft)',
                border: '4px solid var(--color-flag-yellow-border)',
                margin: '0 auto 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: timerSeconds <= 30 ? 'var(--color-flag-red)' : '#111' }}>
                {formatTime(timerSeconds)}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>
                {isKn ? 'ಉಳಿದ ಸಮಯ' : 'Remaining'}
              </span>
            </div>

            {/* Timer Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className={`btn ${isTimerRunning ? 'btn-secondary' : 'btn-primary'}`}
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.95rem' }}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                <span>
                  {isTimerRunning
                    ? (isKn ? 'ವಿರಾಮ (Pause)' : 'Pause Timer')
                    : (isKn ? 'ಅಭ್ಯಾಸ ಆರಂಭಿಸಿ' : 'Start Rehearsal')}
                </span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1rem', fontSize: '0.95rem' }}
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(180);
                }}
              >
                <RotateCcw size={16} />
                <span>{isKn ? 'ಮರುಹೊಂದಿಸಿ' : 'Reset'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
