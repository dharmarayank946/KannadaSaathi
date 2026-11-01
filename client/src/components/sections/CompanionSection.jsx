import React, { useState, useEffect } from 'react';
import SectionHeader from '../layout/SectionHeader';
import { playSpeech, stopSpeech } from '../../utils/kannadaSpeech';
import {
  Bookmark,
  Star,
  RotateCcw,
  CheckCircle2,
  Plus,
  Volume2,
  Sparkles,
  Award,
  Trash2,
  Save,
  HelpCircle,
  HardDrive,
  Layers
} from 'lucide-react';

export default function CompanionSection({ onBackToHome, langMode }) {
  const isKn = langMode === 'kn';

  const [activeTab, setActiveTab] = useState('phrases'); // 'phrases' | 'difficult' | 'revision'
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  // Saved Phrases state (synced with localStorage)
  const [savedPhrases, setSavedPhrases] = useState(() => {
    const saved = localStorage.getItem('kannada_saathi_phrases');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, kn: 'ನನಗೆ ಕನ್ನಡ ಮಾತನಾಡಲು ತುಂಬಾ ಇಷ್ಟ.', en: 'I like speaking Kannada very much.', date: isKn ? 'ಉಳಿಸಲಾಗಿದೆ' : 'Saved' },
      { id: 2, kn: 'ದಯವಿಟ್ಟು ನನಗೆ ದಾರಿ ತೋರಿಸಿ.', en: 'Please show me the way.', date: isKn ? 'ಉಳಿಸಲಾಗಿದೆ' : 'Saved' },
      { id: 3, kn: 'ಕರ್ನಾಟಕದ ಸಂಸ್ಕೃತಿ ಅದ್ಭುತವಾಗಿದೆ.', en: 'The culture of Karnataka is wonderful.', date: isKn ? 'ಉಳಿಸಲಾಗಿದೆ' : 'Saved' }
    ];
  });

  // Difficult words state
  const [difficultWords, setDifficultWords] = useState(() => {
    const saved = localStorage.getItem('kannada_saathi_diff_words');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, kn: 'ಶ್ರೇಷ್ಠತೆ', pron: 'Shreshtathe', en: 'Excellence', tipKn: 'ಉಚ್ಚಾರಣೆ: ಶ್ರೇ-ಷ್ಠ-ತೆ', tipEn: 'Conjunct: Shra + Shta' },
      { id: 2, kn: 'ವ್ಯಾಕರಣ', pron: 'Vyaakarana', en: 'Grammar', tipKn: 'ಸಂಯುಕ್ತಾಕ್ಷರ ಗಮನಿಸಿ: ವ್ಯ', tipEn: 'Conjunct: Vya' },
      { id: 3, kn: 'ಪ್ರಜ್ಞಾಪೂರ್ವಕ', pron: 'Prajnaapoorvaka', en: 'Consciously', tipKn: 'ಜ್ಞ ನಾಸಿಕ ಧ್ವನಿ', tipEn: 'Nasal jna sound' }
    ];
  });

  // New phrase form state
  const [isAddingPhrase, setIsAddingPhrase] = useState(false);
  const [newKn, setNewKn] = useState('');
  const [newEn, setNewEn] = useState('');

  // New word form state
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [newWordKn, setNewWordKn] = useState('');
  const [newWordEn, setNewWordEn] = useState('');
  const [newWordPron, setNewWordPron] = useState('');

  const flashcards = [
    { kn: 'ಆತಿಥ್ಯ', en: 'Hospitality', hintKn: 'ಮನೆಗೆ ಬಂದ ಅತಿಥಿಗಳನ್ನು ಸತ್ಕರಿಸುವ ಪದ್ಧತಿ', hintEn: 'Warm reception and welcoming of guests' },
    { kn: 'ಪ್ರಾಮಾಣಿಕತೆ', en: 'Honesty / Integrity', hintKn: 'ಸತ್ಯ ಮತ್ತು ಧರ್ಮದ ದಾರಿ', hintEn: 'Adherence to truth and moral principles' },
    { kn: 'ಪರಿಶ್ರಮ', en: 'Hard Work / Diligence', hintKn: 'ಯಶಸ್ಸಿಗೆ ಅತ್ಯಗತ್ಯವಾದ ದುಡಿಮೆ', hintEn: 'Dedicated effort essential for success' },
    { kn: 'ಸಹಾನುಭೂತಿ', en: 'Empathy', hintKn: 'ಇತರರ ಕಷ್ಟಗಳನ್ನು ಗ್ರಹಿಸಿ ಸ್ಪಂದಿಸುವುದು', hintEn: 'Understanding and sharing others’ feelings' }
  ];

  const currentCard = flashcards[flashcardIndex];

  const playWordAudio = (word) => {
    if (!word) return;
    playSpeech({
      text: word,
      lang: 'kn',
      id: `companion-${word}`
    });
  };

  const handleAddPhrase = (e) => {
    e.preventDefault();
    if (!newKn.trim()) return;
    const newItem = {
      id: Date.now(),
      kn: newKn.trim(),
      en: newEn.trim() || (isKn ? 'ಕಸ್ಟಮ್ ವಾಕ್ಯ' : 'Custom Phrase'),
      date: isKn ? 'ಈಗಷ್ಟೇ' : 'Just now'
    };
    const updated = [newItem, ...savedPhrases];
    setSavedPhrases(updated);
    localStorage.setItem('kannada_saathi_phrases', JSON.stringify(updated));
    setNewKn('');
    setNewEn('');
    setIsAddingPhrase(false);
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    if (!newWordKn.trim()) return;
    const newItem = {
      id: Date.now(),
      kn: newWordKn.trim(),
      en: newWordEn.trim() || (isKn ? 'ಕಸ್ಟಮ್ ಪದ' : 'Custom Word'),
      pron: newWordPron.trim() || newWordKn.trim(),
      tipKn: 'ವೈಯಕ್ತಿಕವಾಗಿ ಸೇರಿಸಲಾದ ಪದ',
      tipEn: 'Personally added word'
    };
    const updated = [newItem, ...difficultWords];
    setDifficultWords(updated);
    localStorage.setItem('kannada_saathi_diff_words', JSON.stringify(updated));
    setNewWordKn('');
    setNewWordEn('');
    setNewWordPron('');
    setIsAddingWord(false);
  };

  const handleDeletePhrase = (id) => {
    const updated = savedPhrases.filter((p) => p.id !== id);
    setSavedPhrases(updated);
    localStorage.setItem('kannada_saathi_phrases', JSON.stringify(updated));
  };

  const handleDeleteWord = (id) => {
    const updated = difficultWords.filter((w) => w.id !== id);
    setDifficultWords(updated);
    localStorage.setItem('kannada_saathi_diff_words', JSON.stringify(updated));
  };

  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ಭಾಗ ೮ • ವೈಯಕ್ತಿಕ ಸಂಗ್ರಹ"
        badgeEn="PART 8 • Personal Phrasebook"
        titleKn="ವೈಯಕ್ತಿಕ ಕನ್ನಡ ಸಂಗಾತಿ"
        titleEn="Personal Kannada Companion"
        taglineKn="ಉಳಿಸಿದ ನುಡಿಗಟ್ಟುಗಳು, ಕಷ್ಟಕರ ಪದಗಳ ನಿಧಿ ಮತ್ತು ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ ನಿತ್ಯ ಪುನರಾವರ್ತನೆ"
        taglineEn="Saved phrasebook, vocabulary vault, flashcard revision, and local device preferences"
        icon={Bookmark}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      <div className="section-body">
        {/* Honest Local-Only Storage Banner */}
        <div
          className="card-box"
          style={{
            marginBottom: '1.25rem',
            background: '#FFFDF0',
            border: '2px solid var(--color-flag-yellow)',
            borderRadius: '14px',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--color-flag-yellow)',
                  color: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HardDrive size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111' }}>
                  {isKn
                    ? 'ಸ್ಥಳೀಯ ಬ್ರೌಸರ್ ಸಂಗ್ರಹ (ಖಾತೆಯ ಅಗತ್ಯವಿಲ್ಲ)'
                    : 'Local Device Storage (No Cloud Account Required)'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  {isKn
                    ? `ನಿಮ್ಮ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ${savedPhrases.length} ವಾಕ್ಯಗಳು ಮತ್ತು ${difficultWords.length} ಕಷ್ಟಕರ ಶಬ್ದಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇರಿಸಲಾಗಿದೆ.`
                    : `${savedPhrases.length} phrases and ${difficultWords.length} vocabulary words saved locally in your browser.`}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <div style={{ textAlign: 'center', padding: '0.4rem 0.85rem', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #DDD' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-flag-red)' }}>{savedPhrases.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#666' }}>{isKn ? 'ಉಳಿಸಿದ ವಾಕ್ಯ' : 'Phrases'}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '0.4rem 0.85rem', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #DDD' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111' }}>{difficultWords.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#666' }}>{isKn ? 'ಶಬ್ದ ಭಂಡಾರ' : 'Words'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            { id: 'phrases', titleKn: '📌 ಉಳಿಸಿದ ನುಡಿಗಟ್ಟುಗಳು', titleEn: '📌 Saved Phrases' },
            { id: 'difficult', titleKn: '🔍 ಕಷ್ಟಕರ ಶಬ್ದ ಭಂಡಾರ', titleEn: '🔍 Vocabulary Vault' },
            { id: 'revision', titleKn: '🗂️ ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ ಪುನರಾವರ್ತನೆ', titleEn: '🗂️ Flashcard Revision' }
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

        {/* Tab 1: Saved Phrases */}
        {activeTab === 'phrases' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                  {isKn ? 'ಉಳಿಸಿದ ದೈನಂದಿನ ನುಡಿಗಟ್ಟುಗಳು' : 'Saved Daily Phrases'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn
                    ? 'ಅಧ್ಯಯನ ಅಥವಾ ಸಂಭಾಷಣೆಗಳಿಂದ ನೀವು ಉಳಿಸಿಕೊಂಡಿರುವ ಮುಖ್ಯ ವಾಕ್ಯಗಳು:'
                    : 'Key sentences you bookmarked from conversations and study modules:'}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                onClick={() => setIsAddingPhrase(!isAddingPhrase)}
              >
                <Plus size={14} />
                <span>{isKn ? 'ಹೊಸ ವಾಕ್ಯ ಸೇರಿಸಿ' : 'Add New Phrase'}</span>
              </button>
            </div>

            {/* Add phrase form */}
            {isAddingPhrase && (
              <form
                onSubmit={handleAddPhrase}
                style={{
                  background: '#FFFDF7',
                  border: '1.5px solid var(--color-flag-red)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                      {isKn ? 'ಕನ್ನಡ ವಾಕ್ಯ:' : 'Kannada Phrase:'}
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder={isKn ? 'ಕನ್ನಡ ವಾಕ್ಯ ಬರೆಯಿರಿ...' : 'Enter Kannada text...'}
                      value={newKn}
                      onChange={(e) => setNewKn(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                      {isKn ? 'ಆಂಗ್ಲ ಅರ್ಥ:' : 'English Meaning:'}
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder={isKn ? 'ಇಂಗ್ಲಿಷ್ ಅರ್ಥ ಬರೆಯಿರಿ...' : 'Enter English translation...'}
                      value={newEn}
                      onChange={(e) => setNewEn(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    onClick={() => setIsAddingPhrase(false)}
                  >
                    <span>{isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                  >
                    <Save size={13} />
                    <span>{isKn ? 'ಉಳಿಸಿ' : 'Save Phrase'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Phrases List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {savedPhrases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  {isKn ? 'ಇನ್ನೂ ಯಾವುದೇ ವಾಕ್ಯಗಳನ್ನು ಉಳಿಸಿಲ್ಲ.' : 'No phrases saved yet.'}
                </div>
              ) : (
                savedPhrases.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFDF7',
                      border: '1px solid var(--color-cream-border)',
                      borderRadius: '12px',
                      padding: '0.9rem 1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div className="kn-heading" style={{ fontSize: '1.05rem', color: '#111', fontWeight: 700 }}>
                        {item.kn}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.2rem' }}>
                        {item.en}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={() => playWordAudio(item.kn)}
                        title={isKn ? "ಧ್ವನಿ ಆಲಿಸಿ" : "Listen audio"}
                      >
                        <Volume2 size={13} />
                        <span>{isKn ? 'ಆಲಿಸಿ' : 'Listen'}</span>
                      </button>

                      <button
                        type="button"
                        className="btn-icon"
                        style={{ padding: '0.35rem', color: '#E74C3C' }}
                        onClick={() => handleDeletePhrase(item.id)}
                        title={isKn ? "ತೆಗೆದುಹಾಕಿ" : "Delete phrase"}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Difficult Words */}
        {activeTab === 'difficult' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                  {isKn ? 'ಕಷ್ಟಕರ ಶಬ್ದಗಳ ನಿಧಿ' : 'Vocabulary Vault'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn
                    ? 'ವಿಶಿಷ್ಟ ಉಚ್ಚಾರಣೆ ಮತ್ತು ಸಂಯುಕ್ತಾಕ್ಷರಗಳಿರುವ ಕಷ್ಟಕರ ಕನ್ನಡ ಪದಗಳು:'
                    : 'Tricky words with complex conjuncts or distinct pronunciations:'}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                onClick={() => setIsAddingWord(!isAddingWord)}
              >
                <Plus size={14} />
                <span>{isKn ? 'ಹೊಸ ಪದ ಸೇರಿಸಿ' : 'Add New Word'}</span>
              </button>
            </div>

            {/* Add word form */}
            {isAddingWord && (
              <form
                onSubmit={handleAddWord}
                style={{
                  background: '#FFFDF7',
                  border: '1.5px solid var(--color-flag-red)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                      {isKn ? 'ಕನ್ನಡ ಪದ:' : 'Kannada Word:'}
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="ಉದಾ: ಶ್ರೇಷ್ಠತೆ"
                      value={newWordKn}
                      onChange={(e) => setNewWordKn(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                      {isKn ? 'ಉಚ್ಚಾರಣೆ:' : 'Pronunciation:'}
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="Shreshtathe"
                      value={newWordPron}
                      onChange={(e) => setNewWordPron(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                      {isKn ? 'ಆಂಗ್ಲ ಅರ್ಥ:' : 'English Meaning:'}
                    </label>
                    <input
                      type="text"
                      className="search-input"
                      style={{ width: '100%' }}
                      placeholder="Excellence"
                      value={newWordEn}
                      onChange={(e) => setNewWordEn(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    onClick={() => setIsAddingWord(false)}
                  >
                    <span>{isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                  >
                    <Save size={13} />
                    <span>{isKn ? 'ಉಳಿಸಿ' : 'Save Word'}</span>
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
              {difficultWords.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="kn-heading" style={{ fontSize: '1.2rem', color: 'var(--color-flag-red)', fontWeight: 800 }}>
                      {item.kn}
                    </span>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => playWordAudio(item.kn)}
                      style={{ padding: '0.3rem', background: '#F5F5F5', borderRadius: '50%' }}
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#777', fontStyle: 'italic' }}>
                    🔊 {item.pron}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#333' }}>
                    {item.en}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.3rem', paddingTop: '0.3rem', borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>💡 {isKn ? item.tipKn : item.tipEn}</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#E74C3C', cursor: 'pointer', padding: 0 }}
                      onClick={() => handleDeleteWord(item.id)}
                      title={isKn ? "ತೆಗೆದುಹಾಕಿ" : "Delete"}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Flashcard Revision */}
        {activeTab === 'revision' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0 }}>
                {isKn ? 'ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ ನಿತ್ಯ ಪುನರಾವರ್ತನೆ' : 'Spaced Flashcard Revision'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                {isKn
                  ? 'ಕಾರ್ಡ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಅರ್ಥ ವೀಕ್ಷಿಸಿ ಮತ್ತು ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ:'
                  : 'Click card to flip and reveal meaning and pronunciation tip:'}
              </p>
            </div>

            {/* Flashcard Component */}
            <div
              style={{
                maxWidth: '420px',
                minHeight: '220px',
                margin: '0 auto 1.5rem',
                background: flashcardFlipped ? 'var(--color-flag-yellow-soft)' : '#FFFDF7',
                border: '2px solid var(--color-flag-red)',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            >
              {!flashcardFlipped ? (
                <>
                  <span style={{ fontSize: '0.78rem', color: '#999', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {isKn ? 'ಕನ್ನಡ ಪದ (ತಿರುಗಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ):' : 'Kannada Word (Click to flip):'}
                  </span>
                  <div className="kn-heading" style={{ fontSize: '2.2rem', color: 'var(--color-flag-red)', fontWeight: 900 }}>
                    {currentCard.kn}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ marginTop: '1rem', padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playWordAudio(currentCard.kn);
                    }}
                  >
                    <Volume2 size={14} />
                    <span>{isKn ? 'ಆಲಿಸಿ' : 'Listen'}</span>
                  </button>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {isKn ? 'ಅರ್ಥ & ವಿವರಣೆ:' : 'Meaning & Context:'}
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>
                    {currentCard.en}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#555', marginTop: '0.5rem', lineHeight: 1.5 }}>
                    💡 {isKn ? currentCard.hintKn : currentCard.hintEn}
                  </div>
                </>
              )}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1rem' }}
                onClick={() => {
                  setFlashcardFlipped(false);
                  setFlashcardIndex(prev => (prev === 0 ? flashcards.length - 1 : prev - 1));
                }}
              >
                <span>{isKn ? '◀ ಹಿಂದಿನ ಕಾರ್ಡ್' : '◀ Previous'}</span>
              </button>

              <span style={{ fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                {flashcardIndex + 1} / {flashcards.length}
              </span>

              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem' }}
                onClick={() => {
                  setFlashcardFlipped(false);
                  setFlashcardIndex(prev => (prev + 1) % flashcards.length);
                }}
              >
                <span>{isKn ? 'ಮುಂದಿನ ಕಾರ್ಡ್ ▶' : 'Next ▶'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
