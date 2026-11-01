import React, { useState, useRef, useEffect } from 'react';
import SectionHeader from '../layout/SectionHeader';
import { playSpeech, stopSpeech } from '../../utils/kannadaSpeech';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Star,
  HelpCircle,
  Mic,
  Radio,
  ArrowRight,
  Award,
  Check,
  AlertCircle
} from 'lucide-react';

export default function GamesSection({ onBackToHome, langMode }) {
  const isKn = langMode === 'kn';

  const [activeGame, setActiveGame] = useState('match'); // 'match' | 'jalebi' | 'listen' | 'sound' | 'missing'

  // Persisted total score in localStorage
  const [totalScore, setTotalScore] = useState(() => {
    try {
      const s = localStorage.getItem('kannada_saathi_games_score');
      return s ? parseInt(s, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kannada_saathi_games_score', totalScore.toString());
    } catch (e) {}
  }, [totalScore]);

  // Shuffle helper function
  const shuffleList = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // ==========================================
  // GAME 1: Picture and Word Match
  // ==========================================
  const ALL_MATCH_ROUNDS = [
    {
      emoji: '🥭',
      nameEn: 'Mango',
      options: ['ಸೇಬು', 'ಮಾವಿನಹಣ್ಣು', 'ಬಾಳೆಹಣ್ಣು', 'ಕಿತ್ತಳೆ'],
      correct: 'ಮಾವಿನಹಣ್ಣು',
      factKn: 'ಮಾವಿನಹಣ್ಣು ಕರ್ನಾಟಕದ ಅತಿ ಪ್ರಿಯವಾದ ಹಣ್ಣುಗಳಲ್ಲಿ ಒಂದು.',
      factEn: 'Mango is one of the most beloved seasonal fruits in Karnataka.'
    },
    {
      emoji: '🐘',
      nameEn: 'Elephant',
      options: ['ಕುದುರೆ', 'ಆನೆ', 'ಹುಲಿ', 'ಜಿಂಕೆ'],
      correct: 'ಆನೆ',
      factKn: 'ಏಷ್ಯನ್ ಆನೆ ಕರ್ನಾಟಕ ರಾಜ್ಯದ ಅಧಿಕೃತ ಪ್ರಾಣಿಯಾಗಿದೆ.',
      factEn: 'The Asian Elephant is the official state animal of Karnataka.'
    },
    {
      emoji: '🦚',
      nameEn: 'Peacock',
      options: ['ಗಿಳಿ', 'ಕಾಗೆ', 'ನವಿಲು', 'ಗುಬ್ಬಚ್ಚಿ'],
      correct: 'ನವಿಲು',
      factKn: 'ನವಿಲು ಭಾರತದ ರಾಷ್ಟ್ರಪಕ್ಷಿ.',
      factEn: 'Peacock is the national bird of India.'
    },
    {
      emoji: '☀️',
      nameEn: 'Sun',
      options: ['ಚಂದ್ರ', 'ನಕ್ಷತ್ರ', 'ಸೂರ್ಯ', 'ಮೋಡ'],
      correct: 'ಸೂರ್ಯ',
      factKn: 'ಸೂರ್ಯನು ನಮಗೆ ಬೆಳಕು ಮತ್ತು ಜೀವಶಕ್ತಿ ನೀಡುತ್ತಾನೆ.',
      factEn: 'The sun provides light and energy to all life.'
    },
    {
      emoji: '🏠',
      nameEn: 'House',
      options: ['ಮನೆ', 'ಶಾಲೆ', 'ಅಂಗಡಿ', 'ಆಸ್ಪತ್ರೆ'],
      correct: 'ಮನೆ',
      factKn: '"ಮನೆಗೆ ಮಾರಿ, ಪರರಿಗೆ ಉಪಕಾರಿ" ಎಂಬುದು ಪ್ರಸಿದ್ಧ ಕನ್ನಡ ಗಾದೆ.',
      factEn: 'Mane means home or house in Kannada.'
    },
    {
      emoji: '🪷',
      nameEn: 'Lotus',
      options: ['ಕಮಲ', 'ಗುಲಾಬಿ', 'ಮಲ್ಲಿಗೆ', 'ಸೂರ್ಯಕಾಂತಿ'],
      correct: 'ಕಮಲ',
      factKn: 'ಕಮಲವು ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಪುಷ್ಪವಾಗಿದೆ.',
      factEn: 'Lotus is the national flower of India.'
    },
    {
      emoji: '🐅',
      nameEn: 'Tiger',
      options: ['ಸಿಂಹ', 'ಚಿರತೆ', 'ಹುಲಿ', 'ಕರಡಿ'],
      correct: 'ಹುಲಿ',
      factKn: 'ಹುಲಿಯು ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಪ್ರಾಣಿ. ನಾಗರಹೊಳೆ ಮತ್ತು ಬಂಡೀಪುರದಲ್ಲಿ ಹುಲಿಗಳಿವೆ.',
      factEn: 'Tiger is the national animal of India, thriving in Bandipur & Nagarahole.'
    },
    {
      emoji: '🐄',
      nameEn: 'Cow',
      options: ['ಕುರಿ', 'ಹಸು', 'ಆಡು', 'ಎಮ್ಮೆ'],
      correct: 'ಹಸು',
      factKn: 'ಹಸು ನಮಗೆ ಶುದ್ಧ ಮತ್ತು ಪೌಷ್ಟಿಕ ಹಾಲನ್ನು ನೀಡುತ್ತದೆ.',
      factEn: 'Cow gives nutritious milk and holds cultural reverence.'
    },
    {
      emoji: '🌙',
      nameEn: 'Moon',
      options: ['ಸೂರ್ಯ', 'ಚಂದ್ರ', 'ತಾರೆ', 'ಭೂಮಿ'],
      correct: 'ಚಂದ್ರ',
      factKn: 'ಚಂದ್ರಮಾಮ ರಾತ್ರಿಯ ನೀಲಾಕಾಶದಲ್ಲಿ ತಂಪಾದ ಬೆಳಕು ಬೀರುತ್ತಾನೆ.',
      factEn: 'The moon provides cool soothing light at night.'
    },
    {
      emoji: '🚆',
      nameEn: 'Train',
      options: ['ವಿಮಾನ', 'ಬಸ್', 'ರೈಲು', 'ದೋಣಿ'],
      correct: 'ರೈಲು',
      factKn: 'ರೈಲು ಸಾವಿರಾರು ಜನರನ್ನು ಒಂದೇ ಸಮಯದಲ್ಲಿ ಪ್ರಯಾಣ ಮಾಡಿಸುತ್ತದೆ.',
      factEn: 'Railu means train in Kannada.'
    },
    {
      emoji: '📚',
      nameEn: 'Book',
      options: ['ಪುಸ್ತಕ', 'ಕಾಗದ', 'ಲೇಖನಿ', 'ಮೇಜು'],
      correct: 'ಪುಸ್ತಕ',
      factKn: 'ಪುಸ್ತಕಗಳು ಜ್ಞಾನದ ಅಮೂಲ್ಯ ಭಂಡಾರ.',
      factEn: 'Pusthaka means book or scripture of knowledge.'
    },
    {
      emoji: '🌳',
      nameEn: 'Tree',
      options: ['ಗಿಡ', 'ಮರ', 'ಬಳ್ಳಿ', 'ಹುಲ್ಲು'],
      correct: 'ಮರ',
      factKn: 'ಮರಗಳು ನಮಗೆ ಶುದ್ಧ ಗಾಳಿ ಮತ್ತು ನೆರಳು ನೀಡುತ್ತವೆ.',
      factEn: 'Mara means tree, providing shade and clean oxygen.'
    },
    {
      emoji: '☕',
      nameEn: 'Coffee',
      options: ['ಹಾಲು', 'ಕಾಫಿ', 'ಚಹಾ', 'ನೀರು'],
      correct: 'ಕಾಫಿ',
      factKn: 'ಚಿಕ್ಕಮಗಳೂರು ಮತ್ತು ಕೊಡಗು ಕರ್ನಾಟಕದ ಪ್ರಸಿದ್ಧ ಕಾಫಿ ಬೀಡು.',
      factEn: 'Chikkamagaluru and Kodagu are Karnataka\'s famous coffee regions.'
    },
    {
      emoji: '🕊️',
      nameEn: 'Dove / Pigeon',
      options: ['ಕಾಗೆ', 'ಗಿಳಿ', 'ಪಾರಿವಾಳ', 'ಕೋಳಿ'],
      correct: 'ಪಾರಿವಾಳ',
      factKn: 'ಪಾರಿವಾಳ ಶಾಂತಿಯ ಸಂಕೇತವಾಗಿದೆ.',
      factEn: 'Paarivaala means pigeon or dove, the symbol of peace.'
    },
    {
      emoji: '🚗',
      nameEn: 'Car',
      options: ['ಕಾರು', 'ಸೈಕಲ್', 'ಆಟೋ', 'ಲಾರಿ'],
      correct: 'ಕಾರು',
      factKn: 'ಕಾರು ರಸ್ತೆಯಲ್ಲಿ ಚಲಿಸುವ ನಾಲ್ಕು ಚಕ್ರಗಳ ವಾಹನ.',
      factEn: 'Kaaru means automobile or car.'
    },
    {
      emoji: '🍎',
      nameEn: 'Apple',
      options: ['ಸೇಬು', 'ಕಿತ್ತಳೆ', 'ದ್ರಾಕ್ಷಿ', 'ದಾಳಿಂಬೆ'],
      correct: 'ಸೇಬು',
      factKn: 'ದಿನಕ್ಕೊಂದು ಸೇಬು ವೈದ್ಯರಿಂದ ದೂರವಿಡುತ್ತದೆ ಎಂಬ ಮಾತಿದೆ.',
      factEn: 'Seabu means apple in Kannada.'
    }
  ];

  const getShuffledMatchRounds = () => {
    return shuffleList(ALL_MATCH_ROUNDS).map((r) => ({
      ...r,
      options: shuffleList(r.options)
    }));
  };

  const [matchRounds, setMatchRounds] = useState(() => getShuffledMatchRounds());
  const [matchRoundIdx, setMatchRoundIdx] = useState(0);
  const [matchSelected, setMatchSelected] = useState(null);
  const [matchFeedback, setMatchFeedback] = useState(null);
  const [matchGameCompleted, setMatchGameCompleted] = useState(false);

  // ==========================================
  // GAME 2: Happy Jalebi / Word Building
  // ==========================================
  const jalebiLetters = ['ಕ', 'ನ್ನ', 'ಡ', 'ಸಾ', 'ಥಿ', 'ಲಿ', 'ನಾ', 'ಮ', 'ನೆ', 'ಹಾ', 'ಲು', 'ನೀ', 'ರು', 'ಶಾ', 'ಲೆ', 'ದೀ', 'ಪ', 'ಅ', 'ಮ್ಮ', 'ಹ', 'ಬ್ಬ', 'ಕಾ', 'ಫಿ', 'ದಾ', 'ರಿ', 'ಗು'];
  const jalebiTargetWords = [
    { word: 'ಕನ್ನಡ', hint: 'ನಮ್ಮ ಹೆಮ್ಮೆಯ ತಾಯ್ನುಡಿ (Mother tongue)' },
    { word: 'ಸಾಥಿ', hint: 'ಗೆಳೆಯ / ಒಡನಾಡಿ (Companion)' },
    { word: 'ಕಲಿ', hint: 'ವಿದ್ಯೆ ಕಲಿಯುವುದು (Learn)' },
    { word: 'ಮನೆ', hint: 'ವಾಸಿಸುವ ಸ್ಥಳ (Home)' },
    { word: 'ಹಾಲು', hint: 'ಪೌಷ್ಟಿಕ ಪಾನೀಯ (Milk)' },
    { word: 'ನೀರು', hint: 'ಜೀವಜಲ (Water)' },
    { word: 'ಶಾಲೆ', hint: 'ವಿದ್ಯಾ ಮಂದಿರ (School)' },
    { word: 'ನೆಲ', hint: 'ಭೂಮಿ / ಧರೆ (Land / Ground)' },
    { word: 'ದೀಪ', hint: 'ಬೆಳಕು ನೀಡುವ ಸಾಧನ (Lamp)' },
    { word: 'ಅಮ್ಮ', hint: 'ಪ್ರೀತಿಯ ತಾಯಿ (Mother)' },
    { word: 'ನಾಡು', hint: 'ಕರ್ನಾಟಕ ದೇಶ (Land / State)' },
    { word: 'ಹಬ್ಬ', hint: 'ಸಂತೋಷದ ಉತ್ಸವ (Festival)' },
    { word: 'ಕಾಫಿ', hint: 'ಮಲೆನಾಡ ಬಿಸಿ ಪಾನೀಯ (Coffee)' },
    { word: 'ದಾರಿ', hint: 'ಹೋಗುವ ಮಾರ್ಗ (Way / Path)' },
    { word: 'ಗುರು', hint: 'ಜ್ಞಾನ ನೀಡುವ ಶಿಕ್ಷಕ (Teacher)' }
  ];
  const [currentBuiltWord, setCurrentBuiltWord] = useState('');
  const [foundJalebiWords, setFoundJalebiWords] = useState([]);
  const [jalebiMessage, setJalebiMessage] = useState(null);

  // ==========================================
  // GAME 3: Listen & Speak Challenge
  // ==========================================
  const ALL_LISTEN_DRILLS = [
    { text: 'ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ', translit: 'Sirigannadam gelge, Sirigannadam baalge', meaning: 'May rich Kannada conquer, may rich Kannada thrive' },
    { text: 'ಕಾಯಕವೇ ಕೈಲಾಸ', translit: 'Kayakave Kailasa', meaning: 'Work is Worship' },
    { text: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?', translit: 'Namaskara, neevu hegiddiri?', meaning: 'Hello, how are you?' },
    { text: 'ಕನ್ನಡ ನಮ್ಮ ತಾಯ್ನುಡಿ', translit: 'Kannada namma thaaynudi', meaning: 'Kannada is our mother tongue' },
    { text: 'ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಬೆಂಗಳೂರು', translit: 'Karnatakada raajadhani Bengaluru', meaning: 'The capital of Karnataka is Bengaluru' },
    { text: 'ನನಗೆ ಕನ್ನಡ ಕಲಿಯಲು ತುಂಬಾ ಇಷ್ಟ', translit: 'Nanage Kannada kaliyalu thumba ishta', meaning: 'I really love learning Kannada' },
    { text: 'ಬೆಳಗಿನ ಶುಭೋದಯ, ದಿನ ಶುಭವಾಗಲಿ', translit: 'Belagina shubhodaya, dina shubhavagali', meaning: 'Good morning, have a wonderful day' },
    { text: 'ದಯವಿಟ್ಟು ನನಗೆ ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡಿ', translit: 'Dayavittu nanage swalpa sahaaya maadi', meaning: 'Please give me a little help' },
    { text: 'ಮೈಸೂರು ಅರಮನೆ ಅತ್ಯಂತ ಸುಂದರವಾಗಿದೆ', translit: 'Mysuru aramane athyantha sundaravaagide', meaning: 'Mysuru Palace is exceedingly beautiful' },
    { text: 'ಊಟ ಆಯಿತಾ? ಉಪಹಾರ ಸೇವಿಸಿದಿರಾ?', translit: 'Oota aayitha? Upahaara sevisidira?', meaning: 'Had your meal? Did you have breakfast?' },
    { text: 'ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ಹೋಗುವ ದಾರಿ ಯಾವುದು?', translit: 'Bus nildaana kke hoguva daari yaavudu?', meaning: 'Which way goes to the bus stand?' },
    { text: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು, ಮತ್ತೆ ಭೇಟಿಯಾಗೋಣ', translit: 'Thumba dhanyavaadagalu, maththe bhetiyaagona', meaning: 'Thank you very much, see you again' },
    { text: 'ಕರ್ನಾಟಕದ ನದಿ ಕಾವೇರಿ ಪವಿತ್ರವಾದದ್ದು', translit: 'Karnatakada nadi Kaveri pavithravaadaddu', meaning: 'Karnataka\'s river Kaveri is sacred' },
    { text: 'ಸತ್ಯವನ್ನೇ ನುಡಿಯಬೇಕು, ಧರ್ಮದಿಂದ ಬಾಳಬೇಕು', translit: 'Sathyavanney nudiyabeku, dharmadinda baalabeku', meaning: 'One must speak the truth and live righteously' }
  ];
  const [listenDrills, setListenDrills] = useState(() => shuffleList(ALL_LISTEN_DRILLS));
  const [listenDrillIdx, setListenDrillIdx] = useState(0);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speakFeedback, setSpeakFeedback] = useState(null);
  const [listenGameCompleted, setListenGameCompleted] = useState(false);

  // ==========================================
  // GAME 4: Letter & Sound Discrimination
  // ==========================================
  const ALL_SOUND_ROUNDS = [
    { targetSound: 'ಳ', prompt: 'ಧ್ವನಿ: "ಳ" (Retroflex L)', options: ['ಲ', 'ಳ', 'ರ', 'ಣ'], correct: 'ಳ' },
    { targetSound: 'ಣ', prompt: 'ಧ್ವನಿ: "ಣ" (Retroflex N)', options: ['ನ', 'ಮ', 'ಣ', 'ವ'], correct: 'ಣ' },
    { targetSound: 'ಶ', prompt: 'ಧ್ವನಿ: "ಶ" (Palatal Sha)', options: ['ಸ', 'ಶ', 'ಷ', 'ಹ'], correct: 'ಶ' },
    { targetSound: 'ಋ', prompt: 'ಧ್ವನಿ: "ಋ" (Vocalic Ru)', options: ['ಉ', 'ಋ', 'ಊ', 'ರೂ'], correct: 'ಋ' },
    { targetSound: 'ಜ್ಞ', prompt: 'ಧ್ವನಿ: "ಜ್ಞ" (Jna conjunct)', options: ['ಜ್ಞ', 'ತ್ರ', 'ಶ್ರ', 'ಕ್ಷ'], correct: 'ಜ್ಞ' },
    { targetSound: 'ಷ', prompt: 'ಧ್ವನಿ: "ಷ" (Retroflex Sha)', options: ['ಸ', 'ಶ', 'ಷ', 'ಫ'], correct: 'ಷ' },
    { targetSound: 'ಕ್ಷ', prompt: 'ಧ್ವನಿ: "ಕ್ಷ" (Ksha conjunct)', options: ['ಕ್ಷ', 'ಜ್ಞ', 'ತ್ರ', 'ಶ್ರ'], correct: 'ಕ್ಷ' },
    { targetSound: 'ಢ', prompt: 'ಧ್ವನಿ: "ಢ" (Aspirated Dha)', options: ['ಡ', 'ಢ', 'ದ', 'ಧ'], correct: 'ಢ' },
    { targetSound: 'ಠ', prompt: 'ಧ್ವನಿ: "ಠ" (Aspirated Tha)', options: ['ಟ', 'ಠ', 'ತ', 'ಥ'], correct: 'ಠ' },
    { targetSound: 'ಘ', prompt: 'ಧ್ವನಿ: "ಘ" (Aspirated Gha)', options: ['ಗ', 'ಘ', 'ಖ', 'ಧ'], correct: 'ಘ' },
    { targetSound: 'ಝ', prompt: 'ಧ್ವನಿ: "ಝ" (Aspirated Jha)', options: ['ಜ', 'ಝ', 'ಚ', 'ಛ'], correct: 'ಝ' },
    { targetSound: 'ಅಂ', prompt: 'ಧ್ವನಿ: "ಅಂ" (Anusvara Am)', options: ['ಅಂ', 'ಅಃ', 'ಆ', 'ಓ'], correct: 'ಅಂ' },
    { targetSound: 'ಐ', prompt: 'ಧ್ವನಿ: "ಐ" (Diphthong Ai)', options: ['ಎ', 'ಏ', 'ಐ', 'ಒ'], correct: 'ಐ' },
    { targetSound: 'ಔ', prompt: 'ಧ್ವನಿ: "ಔ" (Diphthong Au)', options: ['ಒ', 'ಓ', 'ಔ', 'ಅಂ'], correct: 'ಔ' }
  ];

  const getShuffledSoundRounds = () => {
    return shuffleList(ALL_SOUND_ROUNDS).map((r) => ({
      ...r,
      options: shuffleList(r.options)
    }));
  };

  const [soundRounds, setSoundRounds] = useState(() => getShuffledSoundRounds());
  const [soundRoundIdx, setSoundRoundIdx] = useState(0);
  const [soundSelected, setSoundSelected] = useState(null);
  const [soundFeedback, setSoundFeedback] = useState(null);
  const [soundGameCompleted, setSoundGameCompleted] = useState(false);

  // ==========================================
  // GAME 5: Find the Missing Word
  // ==========================================
  const ALL_MISSING_ROUNDS = [
    {
      sentenceKn: 'ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ______ ಆಗಿದೆ.',
      sentenceEn: 'The capital of Karnataka is ______.',
      options: ['ಮೈಸೂರು', 'ಬೆಂಗಳೂರು', 'ಮಂಗಳೂರು', 'ಹುಬ್ಬಳ್ಳಿ'],
      correct: 'ಬೆಂಗಳೂರು',
      explanationKn: 'ಬೆಂಗಳೂರು ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಆಡಳಿತ ರಾಜಧಾನಿ.',
      explanationEn: 'Bengaluru is the capital of Karnataka.'
    },
    {
      sentenceKn: 'ನಾಡಗೀತೆಯನ್ನು ರಚಿಸಿದವರು ರಾಷ್ಟ್ರಕವಿ ______.',
      sentenceEn: 'The state anthem was written by national poet ______.',
      options: ['ಕುವೆಂಪು', 'ಬೇಂದ್ರೆ', 'ದ.ರಾ.ಬೇಂದ್ರೆ', 'ಮಾಸ್ತಿ'],
      correct: 'ಕುವೆಂಪು',
      explanationKn: 'ಕುವೆಂಪುರವರು ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ ಗೀತೆಯನ್ನು ರಚಿಸಿದರು.',
      explanationEn: 'Kuvempu composed Jaya Bharata Jananiya Tanujate.'
    },
    {
      sentenceKn: 'ನಾವು ದಿನವೂ ಶುದ್ಧ ______ ಕುಡಿಯಬೇಕು.',
      sentenceEn: 'We should drink clean ______ every day.',
      options: ['ನೀರು', 'ಹಾಲು', 'ಎಣ್ಣೆ', 'ರಸ'],
      correct: 'ನೀರು',
      explanationKn: 'ಉತ್ತಮ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಶುದ್ಧ ನೀರು ಅತ್ಯಗತ್ಯ.',
      explanationEn: 'Clean water is essential for health.'
    },
    {
      sentenceKn: '"ಕಾಯಕವೇ ______" ಎಂಬುದು ಬಸವಣ್ಣನವರ ನುಡಿ.',
      sentenceEn: '"Work is ______" is the saying of Basavanna.',
      options: ['ಕೈಲಾಸ', 'ಮಂದಿರ', 'ದೇವಾಲಯ', 'ಸ್ವರ್ಗ'],
      correct: 'ಕೈಲಾಸ',
      explanationKn: 'ಕಾಯಕವೇ ಕೈಲಾಸ ಎಂದರೆ ಸತ್ಯಶುದ್ಧ ದುಡಿಮೆಯೇ ಪರಮ ಪೂಜೆ ಎಂದರ್ಥ.',
      explanationEn: 'Kayakave Kailasa means work itself is worship.'
    },
    {
      sentenceKn: 'ಕರ್ನಾಟಕದ ರಾಜ್ಯೋತ್ಸವವನ್ನು ಪ್ರತಿ ವರ್ಷ ______ ೧ ರಂದು ಆಚರಿಸಲಾಗುತ್ತದೆ.',
      sentenceEn: 'Karnataka Rajyotsava is celebrated every year on ______ 1.',
      options: ['ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್', 'ಜನವರಿ'],
      correct: 'ನವೆಂಬರ್',
      explanationKn: 'ನವೆಂಬರ್ ೧ ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಶುಭ ದಿನ.',
      explanationEn: 'November 1 is celebrated as Karnataka Rajyotsava.'
    },
    {
      sentenceKn: 'ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಎತ್ತರದ ಗಿರಿಶಿಖರ ______.',
      sentenceEn: 'The highest peak in Karnataka is ______.',
      options: ['ಮುಳ್ಳಯ್ಯನಗಿರಿ', 'ಕುದುರೆಮುಖ', 'ಚಾಮುಂಡಿ ಬೆಟ್ಟ', 'ಬಾಬಾಬುಡನಗಿರಿ'],
      correct: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ',
      explanationKn: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆಯಲ್ಲಿದ್ದು ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ಶಿಖರ.',
      explanationEn: 'Mullayyanagiri is Karnataka\'s highest peak.'
    },
    {
      sentenceKn: 'ವಿಶ್ವವಿಖ್ಯಾತ ಗೊಮ್ಮಟೇಶ್ವರ ಬಾಹುಬಲಿ ಪ್ರತಿಮೆ ______ ನಲ್ಲಿದೆ.',
      sentenceEn: 'The world-famous Gommateshwara statue is in ______.',
      options: ['ಶ್ರವಣಬೆಳಗೊಳ', 'ಹಂಪಿ', 'ಬಾದಾಮಿ', 'ಬೇಲೂರು'],
      correct: 'ಶ್ರವಣಬೆಳಗೊಳ',
      explanationKn: 'ಹಾಸನ ಜಿಲ್ಲೆಯ ಶ್ರವಣಬೆಳಗೊಳದಲ್ಲಿ ಏಕಶಿಲಾ ಬಾಹುಬಲಿ ಪ್ರತಿಮೆಯಿದೆ.',
      explanationEn: 'Gommateshwara is in Shravanabelagola.'
    },
    {
      sentenceKn: 'ದಸರಾ ಹಬ್ಬದ ಅದ್ಧೂರಿ ಜಂಬೂಸವಾರಿಯು ______ ನಗರದಲ್ಲಿ ನಡೆಯುತ್ತದೆ.',
      sentenceEn: 'The grand Dasara Jamboo Savari is held in ______.',
      options: ['ಮೈಸೂರು', 'ಧಾರವಾಡ', 'ಬೀದರ್', 'ಶಿವಮೊಗ್ಗ'],
      correct: 'ಮೈಸೂರು',
      explanationKn: 'ಮೈಸೂರಿನ ದಸರಾ ಹಬ್ಬ ನಾಡಹಬ್ಬವಾಗಿ ವಿಶ್ವಪ್ರಸಿದ್ಧಿ ಪಡೆದಿದೆ.',
      explanationEn: 'Mysuru Dasara is celebrated as the Naada Habba.'
    },
    {
      sentenceKn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯಕ್ಕೆ ಒಟ್ಟು ______ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು ಸಂದಿವೆ.',
      sentenceEn: 'Kannada literature has been honored with ______ Jnanpith awards.',
      options: ['ಎಂಟು (೮)', 'ಆರು (೬)', 'ಐದು (೫)', 'ಹತ್ತು (೧೦)'],
      correct: 'ಎಂಟು (೮)',
      explanationKn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯಕ್ಕೆ ಗರಿಷ್ಠ ೮ ಜ್ಞಾನಪೀಠ ಗೌರವಗಳು ಲಭಿಸಿವೆ.',
      explanationEn: 'Kannada has won 8 Jnanpith awards.'
    },
    {
      sentenceKn: 'ಕರ್ನಾಟಕದ ಜೀವನಾಡಿಯಾಗಿ ಹರಿಯುವ ಪವಿತ್ರ ನದಿ ______ ಆಗಿದೆ.',
      sentenceEn: 'The lifeline sacred river of Karnataka is ______.',
      options: ['ಕಾವೇರಿ', 'ಗಂಗಾ', 'ಯಮುನಾ', 'ನರ್ಮದಾ'],
      correct: 'ಕಾವೇರಿ',
      explanationKn: 'ತಲಕಾವೇರಿಯಲ್ಲಿ ಉಗಮಿಸುವ ಕಾವೇರಿ ಕರ್ನಾಟಕದ ಜೀವನಾಡಿ.',
      explanationEn: 'Kaveri is the sacred lifeline river of Karnataka.'
    },
    {
      sentenceKn: 'ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಲಾಂಛನದಲ್ಲಿರುವ ಪೌರಾಣಿಕ ಎರಡು ತಲೆಯ ಹಕ್ಕಿ ______.',
      sentenceEn: 'The mythical double-headed bird on Karnataka\'s emblem is ______.',
      options: ['ಗಂಡಭೇರುಂಡ', 'ಗರುಡ', 'ಹಂಸ', 'ಮಯೂರ'],
      correct: 'ಗಂಡಭೇರುಂಡ',
      explanationKn: 'ಗಂಡಭೇರುಂಡ ಅದ್ಭುತ ಶಕ್ತಿ ಮತ್ತು ಧೈರ್ಯದ ಸಂಕೇತ.',
      explanationEn: 'Gandaberunda is the mythical emblem bird.'
    },
    {
      sentenceKn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಭವ್ಯ ರಾಜಧಾನಿಯ ಅವಶೇಷಗಳು ______ ನಲ್ಲಿದೆ.',
      sentenceEn: 'The magnificent ruins of Vijayanagara empire are at ______.',
      options: ['ಹಂಪಿ', 'ಐಹೊಳೆ', 'ಪಟ್ಟದಕಲ್ಲು', 'ಚಿತ್ರದುರ್ಗ'],
      correct: 'ಹಂಪಿ',
      explanationKn: 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣವಾದ ಹಂಪಿ ತುಂಗಭದ್ರಾ ನದಿ ತೀರದಲ್ಲಿದೆ.',
      explanationEn: 'Hampi holds the UNESCO World Heritage ruins.'
    },
    {
      sentenceKn: 'ಸೂರ್ಯೋದಯವಾಗುವುದು ______ ದಿಕ್ಕಿನಲ್ಲಿ.',
      sentenceEn: 'The sun rises in the ______ direction.',
      options: ['ಪೂರ್ವ', 'ಪಶ್ಚಿಮ', 'ಉತ್ತರ', 'ದಕ್ಷಿಣ'],
      correct: 'ಪೂರ್ವ',
      explanationKn: 'ಸೂರ್ಯ ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ಪೂರ್ವ ದಿಕ್ಕಿನಲ್ಲಿ ಉದಯಿಸುತ್ತಾನೆ.',
      explanationEn: 'The sun rises in the East (Poorva).'
    },
    {
      sentenceKn: 'ಅನುಭವ ಮಂಟಪವನ್ನು ಸ್ಥಾಪಿಸಿ ವಚನ ಕ್ರಾಂತಿ ಮಾಡಿದವರು ______.',
      sentenceEn: 'The pioneer who established Anubhava Mantapa was ______.',
      options: ['ಬಸವಣ್ಣ', 'ಅಲ್ಲಮಪ್ರಭು', 'ಅಕ್ಕಮಹಾದೇವಿ', 'ಚನ್ನಬಸವಣ್ಣ'],
      correct: 'ಬಸವಣ್ಣ',
      explanationKn: 'ಜಗಜ್ಯೋತಿ ಬಸವಣ್ಣನವರು ೧೨ನೇ ಶತಮಾನದಲ್ಲಿ ಸಮಾನತೆಯ ಅನುಭವ ಮಂಟಪ ಸ್ಥಾಪಿಸಿದರು.',
      explanationEn: 'Basavanna founded the historic Anubhava Mantapa.'
    }
  ];

  const getShuffledMissingRounds = () => {
    return shuffleList(ALL_MISSING_ROUNDS).map((r) => ({
      ...r,
      options: shuffleList(r.options)
    }));
  };

  const [missingWordRounds, setMissingWordRounds] = useState(() => getShuffledMissingRounds());
  const [missingRoundIdx, setMissingRoundIdx] = useState(0);
  const [missingSelected, setMissingSelected] = useState(null);
  const [missingFeedback, setMissingFeedback] = useState(null);
  const [missingGameCompleted, setMissingGameCompleted] = useState(false);

  // Play audio helper with universal speech engine
  const playAudio = (text) => {
    if (!text) return;
    playSpeech({
      text,
      lang: 'kn',
      id: `game-${text}`
    });
  };

  // ==========================================
  // GAME 1 HANDLERS (Match)
  // ==========================================
  const handleMatchSelect = (opt) => {
    if (matchSelected) return;
    setMatchSelected(opt);
    const round = matchRounds[matchRoundIdx];
    if (opt === round.correct) {
      setMatchFeedback('correct');
      setTotalScore((s) => s + 10);
      playAudio(round.correct);
    } else {
      setMatchFeedback('wrong');
    }
  };

  const handleNextMatchRound = () => {
    if (matchRoundIdx < matchRounds.length - 1) {
      setMatchSelected(null);
      setMatchFeedback(null);
      setMatchRoundIdx((prev) => prev + 1);
    } else {
      setMatchGameCompleted(true);
    }
  };

  const handleRestartMatchGame = () => {
    setMatchRounds(getShuffledMatchRounds());
    setMatchRoundIdx(0);
    setMatchSelected(null);
    setMatchFeedback(null);
    setMatchGameCompleted(false);
  };

  // ==========================================
  // GAME 2 HANDLERS (Jalebi)
  // ==========================================
  const handleAddJalebiLetter = (char) => {
    setCurrentBuiltWord((prev) => prev + char);
  };

  const handleBackspaceJalebi = () => {
    setCurrentBuiltWord((prev) => prev.slice(0, -1));
  };

  const handleCheckJalebiWord = () => {
    if (!currentBuiltWord) return;
    const targetEntry = jalebiTargetWords.find((t) => t.word === currentBuiltWord);
    if (targetEntry) {
      if (foundJalebiWords.includes(currentBuiltWord)) {
        setJalebiMessage({
          type: 'info',
          text: isKn ? `"${currentBuiltWord}" ಪದವನ್ನು ನೀವು ಈಗಾಗಲೇ ಕಂಡುಹಿಡಿದಿದ್ದೀರಿ!` : `You already discovered "${currentBuiltWord}"!`
        });
      } else {
        const updated = [...foundJalebiWords, currentBuiltWord];
        setFoundJalebiWords(updated);
        setTotalScore((s) => s + 15);
        playAudio(currentBuiltWord);
        setJalebiMessage({
          type: 'success',
          text: isKn ? `ಅದ್ಭುತ! "${currentBuiltWord}" ಸರಿಯಾದ ಪದ (+೧೫ ಅಂಕಗಳು).` : `Great! "${currentBuiltWord}" is valid (+15 pts).`
        });
      }
    } else {
      setJalebiMessage({
        type: 'wrong',
        text: isKn ? `"${currentBuiltWord}" ಪದಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ. ಬೇರೆ ಅಕ್ಷರಗಳನ್ನು ಜೋಡಿಸಿ!` : `"${currentBuiltWord}" not in target list. Try another combination!`
      });
    }
    setCurrentBuiltWord('');
  };

  const handleRestartJalebiGame = () => {
    setFoundJalebiWords([]);
    setCurrentBuiltWord('');
    setJalebiMessage(null);
  };

  // ==========================================
  // GAME 3 HANDLERS (Listen & Speak)
  // ==========================================
  const recognitionRef = useRef(null);

  const handleStartSpeakingChallenge = () => {
    if (isRecognizing && recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
      setIsRecognizing(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeakFeedback({
        type: 'unsupported',
        text: isKn
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ರೊಫೋನ್ ಧ್ವನಿ ಗ್ರಹಿಕೆ ಬೆಂಬಲವಿಲ್ಲ.'
          : 'Web Speech recognition is not supported in this browser.'
      });
      return;
    }

    setIsRecognizing(true);
    setSpeakFeedback(null);
    setSpokenTranscript('');

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'kn-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let lastSpokenText = '';
      let evaluated = false;

      const evaluateSpeech = (spoken) => {
        if (evaluated || !spoken) return;
        evaluated = true;
        const currentTarget = listenDrills[listenDrillIdx]?.text || '';
        const cleanA = spoken.replace(/[,.?!]/g, '').trim();
        const cleanB = currentTarget.replace(/[,.?!]/g, '').trim();

        if (cleanA === cleanB || cleanB.includes(cleanA) || cleanA.includes(cleanB)) {
          setSpeakFeedback({
            type: 'success',
            text: isKn ? 'ಅತ್ಯುತ್ತಮ! ನಿಮ್ಮ ಉಚ್ಚಾರಣೆ ಅತ್ಯಂತ ನಿಖರವಾಗಿದೆ (+೨೦ ಅಂಕಗಳು).' : 'Excellent! Pronunciation was accurate (+20 pts).'
          });
          setTotalScore((s) => s + 20);
        } else {
          setSpeakFeedback({
            type: 'partial',
            text: isKn
              ? `ಧ್ವನಿ ಗ್ರಹಿಸಿದ್ದು: "${spoken}". ಮತ್ತೊಮ್ಮೆ ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ ಪ್ರಯತ್ನಿಸಿ.`
              : `Detected: "${spoken}". Try speaking clearly once more.`
          });
        }
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

        const currentText = (final || interim || '').trim();
        if (currentText) {
          lastSpokenText = currentText;
          setSpokenTranscript(currentText);
        }

        if (final && final.trim()) {
          evaluateSpeech(final.trim());
        }
      };

      recognition.onerror = (e) => {
        setIsRecognizing(false);
        if (e.error === 'not-allowed') {
          setSpeakFeedback({
            type: 'error',
            text: isKn
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ವಿಳಾಸ ಪಟ್ಟಿಯಲ್ಲಿ ಮೈಕ್ ಅನುಮತಿಸಿ.'
              : 'Microphone permission denied. Allow microphone access in your browser address bar.'
          });
        } else if (e.error !== 'no-speech') {
          setSpeakFeedback({
            type: 'error',
            text: isKn ? `ಧ್ವನಿ ದೋಷ: ${e.error}.` : `Microphone error: ${e.error}`
          });
        }
      };

      recognition.onend = () => {
        setIsRecognizing(false);
        if (!evaluated && lastSpokenText) {
          evaluateSpeech(lastSpokenText);
        }
      };

      recognition.start();
    } catch (e) {
      setIsRecognizing(false);
      setSpeakFeedback({
        type: 'error',
        text: isKn ? 'ಮೈಕ್ ಆರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Could not start microphone.'
      });
    }
  };

  const handleNextListenDrill = () => {
    if (listenDrillIdx < listenDrills.length - 1) {
      setListenDrillIdx((prev) => prev + 1);
      setSpeakFeedback(null);
      setSpokenTranscript('');
    } else {
      setListenGameCompleted(true);
    }
  };

  const handleRestartListenGame = () => {
    setListenDrills(shuffleList(ALL_LISTEN_DRILLS));
    setListenDrillIdx(0);
    setSpeakFeedback(null);
    setSpokenTranscript('');
    setListenGameCompleted(false);
  };

  // ==========================================
  // GAME 4 HANDLERS (Sound)
  // ==========================================
  const handleSoundSelect = (char) => {
    if (soundSelected) return;
    setSoundSelected(char);
    const round = soundRounds[soundRoundIdx];
    if (char === round.correct) {
      setSoundFeedback('correct');
      setTotalScore((s) => s + 10);
      playAudio(round.correct);
    } else {
      setSoundFeedback('wrong');
    }
  };

  const handleNextSoundRound = () => {
    if (soundRoundIdx < soundRounds.length - 1) {
      setSoundSelected(null);
      setSoundFeedback(null);
      setSoundRoundIdx((prev) => prev + 1);
    } else {
      setSoundGameCompleted(true);
    }
  };

  const handleRestartSoundGame = () => {
    setSoundRounds(getShuffledSoundRounds());
    setSoundRoundIdx(0);
    setSoundSelected(null);
    setSoundFeedback(null);
    setSoundGameCompleted(false);
  };

  // ==========================================
  // GAME 5 HANDLERS (Missing Word)
  // ==========================================
  const handleMissingSelect = (opt) => {
    if (missingSelected) return;
    setMissingSelected(opt);
    const round = missingWordRounds[missingRoundIdx];
    if (opt === round.correct) {
      setMissingFeedback('correct');
      setTotalScore((s) => s + 10);
      playAudio(round.correct);
    } else {
      setMissingFeedback('wrong');
    }
  };

  const handleNextMissingRound = () => {
    if (missingRoundIdx < missingWordRounds.length - 1) {
      setMissingSelected(null);
      setMissingFeedback(null);
      setMissingRoundIdx((prev) => prev + 1);
    } else {
      setMissingGameCompleted(true);
    }
  };

  const handleRestartMissingGame = () => {
    setMissingWordRounds(getShuffledMissingRounds());
    setMissingRoundIdx(0);
    setMissingSelected(null);
    setMissingFeedback(null);
    setMissingGameCompleted(false);
  };

  // Reset all scores
  const handleResetAllScores = () => {
    setTotalScore(0);
    localStorage.removeItem('kannada_saathi_games_score');
    handleRestartMatchGame();
    handleRestartJalebiGame();
    handleRestartListenGame();
    handleRestartSoundGame();
    handleRestartMissingGame();
  };


  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ಭಾಗ ೪ • ಕಲಿಕಾ ಆಟಗಳು"
        badgeEn="PART 4 • Educational Games Hub"
        titleKn="ಕನ್ನಡ ಗೇಮ್ಸ್ — ವಿನೋದ ಕಲಿಕೆ"
        titleEn="Kannada Educational Games Hub"
        taglineKn="ಚಿತ್ರ ಹೊಂದಾಣಿಕೆ, ಹ್ಯಾಪಿ ಜಿಲೇಬಿ, ಉಚ್ಚಾರಣಾ ಸವಾಲು, ಅಕ್ಷರ ಧ್ವನಿ ಮತ್ತು ಬಿಟ್ಟ ಪದಗಳ ಸಂವಾದಾತ್ಮಕ ಆಟಗಳು"
        taglineEn="Picture match, word builder, pronunciation challenges, sound discrimination, and sentence puzzles"
        icon={Gamepad2}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      <div className="section-body">
        {/* Game Stats & Score Banner */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'var(--color-flag-red)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Trophy size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                  {isKn ? 'ಒಟ್ಟು ಗಳಿಸಿದ ನೈಜ ಅಂಕಗಳು:' : 'Total Earned Score:'}
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-flag-red)' }}>
                  {totalScore}{' '}
                  <span style={{ fontSize: '0.82rem', color: '#000000', fontWeight: 600 }}>
                    {isKn ? 'ಅಂಕಗಳು' : 'pts'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DDD',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                🎮 {isKn ? '೫ ಸಕ್ರಿಯ ಆಟಗಳು' : '5 Active Games'}
              </span>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={handleResetAllScores}
                title={isKn ? "ಅಂಕಗಳನ್ನು ಮರುಹೊಂದಿಸಿ" : "Reset Scores"}
              >
                <RotateCcw size={14} />
                <span>{isKn ? 'ಅಂಕ ಮರುಹೊಂದಿಸಿ' : 'Reset'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Game Nav Selection Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'match', emoji: '🥭', titleKn: 'ಚಿತ್ರ & ಪದ ಹೊಂದಾಣಿಕೆ', titleEn: 'Picture & Word Match' },
            { id: 'jalebi', emoji: '🥨', titleKn: 'ಪದ ಕಟ್ಟುವಿಕೆ (ಜಿಲೇಬಿ)', titleEn: 'Word Builder (Jalebi)' },
            { id: 'listen', emoji: '🎙️', titleKn: 'ಆಲಿಸಿ ಮಾತನಾಡಿ ಸವಾಲು', titleEn: 'Listen & Speak' },
            { id: 'sound', emoji: '🔔', titleKn: 'ಅಕ್ಷರ ಮತ್ತು ಧ್ವನಿ ಆಟ', titleEn: 'Letter & Sound' },
            { id: 'missing', emoji: '🔍', titleKn: 'ಬಿಟ್ಟ ಪದ ಹುಡುಕಿ', titleEn: 'Missing Word' }
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              className={`filter-chip ${activeGame === g.id ? 'active' : ''}`}
              style={{
                padding: '0.65rem 0.75rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                justifyContent: 'center',
                textAlign: 'center'
              }}
              onClick={() => setActiveGame(g.id)}
            >
              <span>{g.emoji}</span>
              <span>{isKn ? g.titleKn : g.titleEn}</span>
            </button>
          ))}
        </div>

        {/* ========================================================
            GAME 1: Picture and Word Match
            ======================================================== */}
        {activeGame === 'match' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                  {isKn ? '೧. ಚಿತ್ರ ಮತ್ತು ಪದ ಹೊಂದಾಣಿಕೆ' : '1. Picture and Word Match'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn
                    ? 'ಚಿತ್ರವನ್ನು ನೋಡಿ, ಸರಿಯಾದ ಕನ್ನಡ ಪದವನ್ನು ಆರಿಸಿ:'
                    : 'Look at the picture and choose the accurate Kannada word:'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: 'var(--color-flag-red-soft)', color: 'var(--color-flag-red)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                  {isKn ? `ಹಂತ ${matchRoundIdx + 1} / ${matchRounds.length}` : `Round ${matchRoundIdx + 1} / ${matchRounds.length}`}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                  onClick={handleRestartMatchGame}
                  title="ಮತ್ತೊಮ್ಮೆ ಆಡಿ"
                >
                  <RotateCcw size={12} />
                  <span>{isKn ? 'ಮರುಹೊಂದಿಸಿ' : 'Restart'}</span>
                </button>
              </div>
            </div>

            {!matchGameCompleted ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) 1.5fr', gap: '1.5rem', alignItems: 'center' }}>
                  {/* Picture Box */}
                  <div
                    style={{
                      background: '#FFFDF7',
                      border: '2px solid var(--color-cream-border)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ fontSize: '4.5rem' }}>{matchRounds[matchRoundIdx].emoji}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>
                      {matchRounds[matchRoundIdx].nameEn}
                    </div>
                  </div>

                  {/* Options Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {matchRounds[matchRoundIdx].options.map((opt, idx) => {
                      const isSelected = matchSelected === opt;
                      const isCorrect = opt === matchRounds[matchRoundIdx].correct;
                      let bg = '#FFFFFF';
                      let border = '1px solid #CCC';
                      let color = '#111';

                      if (matchSelected) {
                        if (isCorrect) {
                          bg = '#D4EFDF';
                          border = '2px solid #27AE60';
                          color = '#196F3D';
                        } else if (isSelected) {
                          bg = '#FADBD8';
                          border = '2px solid #E74C3C';
                          color = '#922B21';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          style={{
                            background: bg,
                            border,
                            color,
                            padding: '0.85rem',
                            borderRadius: '12px',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            cursor: matchSelected ? 'default' : 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          className="kn-text"
                          onClick={() => handleMatchSelect(opt)}
                          disabled={Boolean(matchSelected)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feedback & Next Round */}
                {matchFeedback && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '0.85rem 1rem',
                      background: matchFeedback === 'correct' ? '#E8F8F5' : '#FDF2E9',
                      border: `1.5px solid ${matchFeedback === 'correct' ? '#2ECC71' : '#E67E22'}`,
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: matchFeedback === 'correct' ? '#1E8449' : '#A04000', fontSize: '0.92rem' }}>
                        {matchFeedback === 'correct'
                          ? (isKn ? '✓ ಸರಿಯಾದ ಉತ್ತರ! (+೧೦ ಅಂಕಗಳು)' : '✓ Correct! (+10 points)')
                          : (isKn ? `✗ ತಪ್ಪು ಉತ್ತರ! ಸರಿಯಾದ ಪದ: ${matchRounds[matchRoundIdx].correct}` : `✗ Incorrect. Correct word is: ${matchRounds[matchRoundIdx].correct}`)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.2rem' }}>
                        💡 {isKn ? matchRounds[matchRoundIdx].factKn : matchRounds[matchRoundIdx].factEn}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                      onClick={handleNextMatchRound}
                    >
                      <span>
                        {matchRoundIdx < matchRounds.length - 1
                          ? (isKn ? 'ಮುಂದಿನ ಚಿತ್ರ ▶' : 'Next Round ▶')
                          : (isKn ? 'ಫಲಿತಾಂಶ ನೋಡಿ 🏆' : 'View Results 🏆')}
                      </span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Trophy size={54} color="var(--color-flag-red)" style={{ marginBottom: '0.75rem' }} />
                <h4 className="kn-heading" style={{ fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>
                  {isKn ? 'ಅಭಿನಂದನೆಗಳು! ಎಲ್ಲಾ ೫ ಚಿತ್ರ-ಪದ ಹಂತಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ!' : 'Congratulations! All 5 Picture Match rounds completed!'}
                </h4>
                <p style={{ color: '#555', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  {isKn
                    ? 'ನೀವು ಕನ್ನಡ ಪದಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಗುರುತಿಸಿದ್ದೀರಿ.'
                    : 'You successfully matched everyday Kannada vocabulary with pictures.'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.4rem', fontSize: '0.95rem' }}
                  onClick={handleRestartMatchGame}
                >
                  <RotateCcw size={16} />
                  <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಡಿ (Play Again)' : 'Play Again'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            GAME 2: Happy Jalebi / Word Building
            ======================================================== */}
        {activeGame === 'jalebi' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                  {isKn ? '೨. ಹ್ಯಾಪಿ ಜಿಲೇಬಿ — ಅಕ್ಷರ ಸುರುಳಿಯ ಪದ ರಚನೆ' : '2. Happy Jalebi — Word Building Puzzle'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn
                    ? 'ಅಕ್ಷರಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಪದ ರಚಿಸಿ, "ಪರಿಶೀಲಿಸಿ" ಒತ್ತಿ ಅಂಕ ಗಳಿಸಿ:'
                    : 'Click letter tiles to build valid Kannada words and submit for points:'}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                onClick={handleRestartJalebiGame}
              >
                <RotateCcw size={12} />
                <span>{isKn ? 'ಮರುಹೊಂದಿಸಿ' : 'Restart'}</span>
              </button>
            </div>

            {/* Target Words status */}
            <div style={{ background: '#FFFDF0', border: '1px solid #FFE082', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#333' }}>
                {isKn
                  ? `ಹುಡುಕಬೇಕಾದ ಪದಗಳು (${foundJalebiWords.length} / ${jalebiTargetWords.length} ಪತ್ತೆಯಾಗಿವೆ):`
                  : `Target Words (${foundJalebiWords.length} / ${jalebiTargetWords.length} discovered):`}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                {jalebiTargetWords.map((t, idx) => {
                  const isFound = foundJalebiWords.includes(t.word);
                  return (
                    <span
                      key={idx}
                      style={{
                        background: isFound ? '#D4EFDF' : '#FFFFFF',
                        border: `1px solid ${isFound ? '#27AE60' : '#CCC'}`,
                        color: isFound ? '#196F3D' : '#888',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '14px',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                      title={t.hint}
                    >
                      {isFound ? `✓ ${t.word}` : `•••• (${t.hint})`}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Current built word tray */}
            <div
              style={{
                minHeight: '52px',
                background: '#FAFAFA',
                border: '2px dashed var(--color-flag-red)',
                borderRadius: '12px',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <div className="kn-heading" style={{ fontSize: '1.4rem', color: 'var(--color-flag-red)', fontWeight: 800 }}>
                {currentBuiltWord || (
                  <span style={{ fontSize: '0.85rem', color: '#AAA', fontWeight: 400, fontStyle: 'italic' }}>
                    {isKn ? 'ಇಲ್ಲಿ ರಚಿತ ಪದ ಗೋಚರಿಸುತ್ತದೆ...' : 'Built word appears here...'}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                  onClick={handleBackspaceJalebi}
                  disabled={!currentBuiltWord}
                  title="ಕೊನೆಯ ಅಕ್ಷರ ಅಳಿಸಿ"
                >
                  <span>⌫</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                  onClick={() => setCurrentBuiltWord('')}
                  disabled={!currentBuiltWord}
                >
                  <RotateCcw size={13} />
                  <span>{isKn ? 'ತೆರವು' : 'Clear'}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                  onClick={handleCheckJalebiWord}
                  disabled={!currentBuiltWord}
                >
                  <span>{isKn ? 'ಪದ ಪರಿಶೀಲಿಸಿ' : 'Submit'}</span>
                </button>
              </div>
            </div>

            {/* Letter Tiles Grid */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
              {jalebiLetters.map((char, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#FFFDF7',
                    border: '2px solid var(--color-flag-yellow)',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    transition: 'all 0.15s ease'
                  }}
                  className="kn-heading"
                  onClick={() => handleAddJalebiLetter(char)}
                >
                  {char}
                </button>
              ))}
            </div>

            {/* Jalebi Message */}
            {jalebiMessage && (
              <div
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  background: jalebiMessage.type === 'success' ? '#E8F8F5' : jalebiMessage.type === 'info' ? '#EBF5FB' : '#FDF2E9',
                  color: jalebiMessage.type === 'success' ? '#1E8449' : jalebiMessage.type === 'info' ? '#2471A3' : '#A04000',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              >
                {jalebiMessage.text}
              </div>
            )}

            {/* All words completed celebration */}
            {foundJalebiWords.length === jalebiTargetWords.length && (
              <div style={{ textAlign: 'center', marginTop: '1.25rem', padding: '1rem', background: '#FFFDF0', border: '2px solid var(--color-flag-yellow)', borderRadius: '12px' }}>
                <Sparkles size={32} color="var(--color-flag-red)" style={{ marginBottom: '0.5rem' }} />
                <h4 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-flag-red)' }}>
                  {isKn ? 'ಅದ್ಭುತ ಸಾಧನೆ! ಎಲ್ಲಾ ೫ ಪದಗಳನ್ನು ಕಂಡುಹಿಡಿದಿದ್ದೀರಿ!' : 'Outstanding! All 5 target words discovered!'}
                </h4>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: '0.75rem', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  onClick={handleRestartJalebiGame}
                >
                  <RotateCcw size={14} />
                  <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಟವಾಡಿ' : 'Play Jalebi Again'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            GAME 3: Listen & Speak Challenge
            ======================================================== */}
        {activeGame === 'listen' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                  {isKn ? '೩. ಆಲಿಸಿ ಮಾತನಾಡಿ ಸವಾಲು' : '3. Listen & Speak Challenge'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn
                    ? 'ಧ್ವನಿ ಆಲಿಸಿ, ಅದೇ ವಾಕ್ಯವನ್ನು ಮೈಕ್ರೋಫೋನ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ:'
                    : 'Listen to the Kannada sentence, then speak into the microphone to test accuracy:'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: 'var(--color-flag-red-soft)', color: 'var(--color-flag-red)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                  {isKn ? `ವಾಕ್ಯ ${listenDrillIdx + 1} / ${listenDrills.length}` : `Drill ${listenDrillIdx + 1} / ${listenDrills.length}`}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                  onClick={handleRestartListenGame}
                >
                  <RotateCcw size={12} />
                  <span>{isKn ? 'ಮರುಹೊಂದಿಸಿ' : 'Restart'}</span>
                </button>
              </div>
            </div>

            {!listenGameCompleted ? (
              <>
                {/* Target Card */}
                <div
                  style={{
                    background: '#FFFDF7',
                    border: '2px solid var(--color-flag-red)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '25px', marginBottom: '1rem' }}
                    onClick={() => playAudio(listenDrills[listenDrillIdx].text)}
                  >
                    <Volume2 size={16} />
                    <span>{isKn ? 'ವಾಕ್ಯ ಆಲಿಸಿ (Play Sound)' : 'Listen Sentence'}</span>
                  </button>

                  <div className="kn-heading" style={{ fontSize: '1.35rem', color: '#111', fontWeight: 800, lineHeight: 1.5 }}>
                    "{listenDrills[listenDrillIdx].text}"
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#777', fontStyle: 'italic', marginTop: '0.35rem' }}>
                    🔊 {listenDrills[listenDrillIdx].translit}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.25rem' }}>
                    {listenDrills[listenDrillIdx].meaning}
                  </div>
                </div>

                {/* Mic Action */}
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    className={`mic-pulse-btn ${isRecognizing ? 'listening' : ''}`}
                    style={{
                      width: '68px',
                      height: '68px',
                      margin: '0 auto',
                      background: isRecognizing ? 'var(--color-flag-yellow)' : 'var(--color-flag-red)',
                      color: isRecognizing ? '#111' : '#FFF'
                    }}
                    onClick={handleStartSpeakingChallenge}
                    disabled={isRecognizing}
                    title={isKn ? "ಮಾತನಾಡಲು ಒತ್ತಿ" : "Tap to Speak"}
                  >
                    {isRecognizing ? <Radio size={28} /> : <Mic size={28} />}
                  </button>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}>
                    {isRecognizing
                      ? (isKn ? 'ಧ್ವನಿ ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ' : 'Listening... Speak now')
                      : (isKn ? 'ಮೈಕ್ ಒತ್ತಿ ಗಟ್ಟಿಯಾಗಿ ಮಾತನಾಡಿ' : 'Tap mic and speak sentence aloud')}
                  </div>
                </div>

                {/* Feedback */}
                {speakFeedback && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: speakFeedback.type === 'success' ? '#E8F8F5' : '#FDF2E9',
                      color: speakFeedback.type === 'success' ? '#1E8449' : '#A04000',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    {speakFeedback.text}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                    onClick={handleNextListenDrill}
                  >
                    <span>
                      {listenDrillIdx < listenDrills.length - 1
                        ? (isKn ? 'ಮುಂದಿನ ವಾಕ್ಯ ▶' : 'Next Sentence ▶')
                        : (isKn ? 'ಫಲಿತಾಂಶ ನೋಡಿ 🏆' : 'View Results 🏆')}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Award size={54} color="var(--color-flag-red)" style={{ marginBottom: '0.75rem' }} />
                <h4 className="kn-heading" style={{ fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>
                  {isKn ? 'ಅಭಿನಂದನೆಗಳು! ಎಲ್ಲಾ ೫ ಉಚ್ಚಾರಣಾ ಸವಾಲುಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ!' : 'All 5 Pronunciation Drills Completed!'}
                </h4>
                <p style={{ color: '#555', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  {isKn
                    ? 'ನಿಮ್ಮ ಕನ್ನಡ ಉಚ್ಚಾರಣೆಯು ಅತ್ಯಂತ ಸ್ಪಷ್ಟ ಮತ್ತು ಸುಂದರವಾಗಿದೆ.'
                    : 'You practiced classical Kannada spoken sentences and proverbs.'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.4rem', fontSize: '0.95rem' }}
                  onClick={handleRestartListenGame}
                >
                  <RotateCcw size={16} />
                  <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಡಿ (Restart)' : 'Practice Again'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            GAME 4: Letter & Sound Discrimination
            ======================================================== */}
        {activeGame === 'sound' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                  {isKn ? '೪. ಅಕ್ಷರ ಮತ್ತು ಧ್ವನಿ ಆಟ' : '4. Letter & Sound Discrimination'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn
                    ? 'ಧ್ವನಿಯನ್ನು ಆಲಿಸಿ, ಸರಿಯಾದ ಕನ್ನಡ ಅಕ್ಷರವನ್ನು ಆರಿಸಿ:'
                    : 'Listen to the audio sound and pick the matching Kannada letter:'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: 'var(--color-flag-red-soft)', color: 'var(--color-flag-red)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                  {isKn ? `ಸವಾಲು ${soundRoundIdx + 1} / ${soundRounds.length}` : `Round ${soundRoundIdx + 1} / ${soundRounds.length}`}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                  onClick={handleRestartSoundGame}
                >
                  <RotateCcw size={12} />
                  <span>{isKn ? 'ಮರುಹೊಂದಿಸಿ' : 'Restart'}</span>
                </button>
              </div>
            </div>

            {!soundGameCompleted ? (
              <>
                {/* Play Sound Button */}
                <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.6rem', fontSize: '1.05rem', borderRadius: '30px' }}
                    onClick={() => playAudio(soundRounds[soundRoundIdx].targetSound)}
                  >
                    <Volume2 size={20} />
                    <span>{isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ (Play Sound)' : 'Click to Hear Sound'}</span>
                  </button>
                </div>

                {/* Sound Letter Options */}
                <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {soundRounds[soundRoundIdx].options.map((char, idx) => {
                    const isSelected = soundSelected === char;
                    const isCorrect = char === soundRounds[soundRoundIdx].correct;
                    let bg = '#FFFDF7';
                    let border = '2px solid var(--color-cream-border)';
                    let color = '#111';

                    if (soundSelected) {
                      if (isCorrect) {
                        bg = '#D4EFDF';
                        border = '2px solid #27AE60';
                        color = '#196F3D';
                      } else if (isSelected) {
                        bg = '#FADBD8';
                        border = '2px solid #E74C3C';
                        color = '#922B21';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '14px',
                          background: bg,
                          border,
                          color,
                          fontSize: '1.6rem',
                          fontWeight: 900,
                          cursor: soundSelected ? 'default' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="kn-heading"
                        onClick={() => handleSoundSelect(char)}
                        disabled={Boolean(soundSelected)}
                      >
                        {char}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Next */}
                {soundFeedback && (
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      background: soundFeedback === 'correct' ? '#E8F8F5' : '#FDF2E9',
                      border: `1.5px solid ${soundFeedback === 'correct' ? '#2ECC71' : '#E67E22'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: soundFeedback === 'correct' ? '#1E8449' : '#A04000', fontSize: '0.9rem' }}>
                      {soundFeedback === 'correct'
                        ? (isKn ? `✓ ನಿಖರ ಗ್ರಹಿಕೆ! ಸರಿಯಾದ ಅಕ್ಷರ "${soundRounds[soundRoundIdx].correct}" (+೧೦ ಅಂಕಗಳು).` : `✓ Correct sound! Letter "${soundRounds[soundRoundIdx].correct}" (+10 pts).`)
                        : (isKn ? `✗ ತಪ್ಪು ಉತ್ತರ. ಸರಿಯಾದ ಅಕ್ಷರ: "${soundRounds[soundRoundIdx].correct}".` : `✗ Incorrect. The sound was "${soundRounds[soundRoundIdx].correct}".`)}
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                      onClick={handleNextSoundRound}
                    >
                      <span>
                        {soundRoundIdx < soundRounds.length - 1
                          ? (isKn ? 'ಮುಂದಿನ ಅಕ್ಷರ ▶' : 'Next Sound ▶')
                          : (isKn ? 'ಫಲಿತಾಂಶ ನೋಡಿ 🏆' : 'View Results 🏆')}
                      </span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Trophy size={54} color="var(--color-flag-red)" style={{ marginBottom: '0.75rem' }} />
                <h4 className="kn-heading" style={{ fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>
                  {isKn ? 'ಅಭಿನಂದನೆಗಳು! ಎಲ್ಲಾ ೫ ಅಕ್ಷರ ಧ್ವನಿ ಸವಾಲುಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ!' : 'All 5 Sound Discrimination Rounds Completed!'}
                </h4>
                <p style={{ color: '#555', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  {isKn ? 'ವಿಶಿಷ್ಟ ಕನ್ನಡ ಧ್ವನಿಗಳನ್ನು ನೀವು ನಿಖರವಾಗಿ ಗ್ರಹಿಸಿದ್ದೀರಿ.' : 'You mastered subtle retroflex and conjunct sounds.'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.4rem', fontSize: '0.95rem' }}
                  onClick={handleRestartSoundGame}
                >
                  <RotateCcw size={16} />
                  <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಡಿ' : 'Play Again'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            GAME 5: Find the Missing Word
            ======================================================== */}
        {activeGame === 'missing' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                  {isKn ? '೫. ಬಿಟ್ಟ ಪದ ಹುಡುಕಿ' : '5. Find the Missing Word'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn
                    ? 'ವಾಕ್ಯವನ್ನು ಓದಿ, ಖಾಲಿ ಜಾಗಕ್ಕೆ ಸೂಕ್ತವಾದ ಪದವನ್ನು ಆರಿಸಿ:'
                    : 'Read the sentence and choose the grammatically correct word for the blank:'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: 'var(--color-flag-red-soft)', color: 'var(--color-flag-red)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                  {isKn ? `ಪ್ರಶ್ನೆ ${missingRoundIdx + 1} / ${missingWordRounds.length}` : `Question ${missingRoundIdx + 1} / ${missingWordRounds.length}`}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                  onClick={handleRestartMissingGame}
                >
                  <RotateCcw size={12} />
                  <span>{isKn ? 'ಮರುಹೊಂದಿಸಿ' : 'Restart'}</span>
                </button>
              </div>
            </div>

            {!missingGameCompleted ? (
              <>
                {/* Sentence Box */}
                <div
                  style={{
                    background: '#FFFDF7',
                    border: '2px solid var(--color-flag-yellow)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    textAlign: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div className="kn-heading" style={{ fontSize: '1.25rem', color: '#111', fontWeight: 800, lineHeight: 1.6 }}>
                    {missingWordRounds[missingRoundIdx].sentenceKn}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.35rem' }}>
                    {missingWordRounds[missingRoundIdx].sentenceEn}
                  </div>
                </div>

                {/* Options Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {missingWordRounds[missingRoundIdx].options.map((opt, idx) => {
                    const isSelected = missingSelected === opt;
                    const isCorrect = opt === missingWordRounds[missingRoundIdx].correct;
                    let bg = '#FFFFFF';
                    let border = '1px solid #CCC';
                    let color = '#111';

                    if (missingSelected) {
                      if (isCorrect) {
                        bg = '#D4EFDF';
                        border = '2px solid #27AE60';
                        color = '#196F3D';
                      } else if (isSelected) {
                        bg = '#FADBD8';
                        border = '2px solid #E74C3C';
                        color = '#922B21';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        style={{
                          background: bg,
                          border,
                          color,
                          padding: '0.85rem',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          fontWeight: 700,
                          cursor: missingSelected ? 'default' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="kn-text"
                        onClick={() => handleMissingSelect(opt)}
                        disabled={Boolean(missingSelected)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Next */}
                {missingFeedback && (
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      background: missingFeedback === 'correct' ? '#E8F8F5' : '#FDF2E9',
                      border: `1.5px solid ${missingFeedback === 'correct' ? '#2ECC71' : '#E67E22'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: missingFeedback === 'correct' ? '#1E8449' : '#A04000', fontSize: '0.9rem' }}>
                        {missingFeedback === 'correct'
                          ? (isKn ? '✓ ಸರಿಯಾದ ಉತ್ತರ! (+೧೦ ಅಂಕಗಳು)' : '✓ Correct! (+10 points)')
                          : (isKn ? `✗ ತಪ್ಪು ಉತ್ತರ. ಸರಿಯಾದ ಪದ: ${missingWordRounds[missingRoundIdx].correct}` : `✗ Incorrect. Correct word: ${missingWordRounds[missingRoundIdx].correct}`)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.2rem' }}>
                        💡 {isKn ? missingWordRounds[missingRoundIdx].explanationKn : missingWordRounds[missingRoundIdx].explanationEn}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                      onClick={handleNextMissingRound}
                    >
                      <span>
                        {missingRoundIdx < missingWordRounds.length - 1
                          ? (isKn ? 'ಮುಂದಿನ ಪ್ರಶ್ನೆ ▶' : 'Next Question ▶')
                          : (isKn ? 'ಫಲಿತಾಂಶ ನೋಡಿ 🏆' : 'View Results 🏆')}
                      </span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <Trophy size={54} color="var(--color-flag-red)" style={{ marginBottom: '0.75rem' }} />
                <h4 className="kn-heading" style={{ fontSize: '1.35rem', margin: '0 0 0.5rem 0' }}>
                  {isKn ? 'ಅಭಿನಂದನೆಗಳು! ಎಲ್ಲಾ ೫ ವಾಕ್ಯ ಒಗಟುಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ!' : 'All 5 Missing Word Puzzles Completed!'}
                </h4>
                <p style={{ color: '#555', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  {isKn ? 'ಕರ್ನಾಟಕದ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಇತಿಹಾಸದ ಜ್ಞಾನವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಾಬೀತುಪಡಿಸಿದ್ದೀರಿ.' : 'You demonstrated great knowledge of Karnataka heritage.'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.4rem', fontSize: '0.95rem' }}
                  onClick={handleRestartMissingGame}
                >
                  <RotateCcw size={16} />
                  <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಡಿ' : 'Play Again'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
