import React, { useState, useRef, useEffect } from 'react';
import SectionHeader from '../layout/SectionHeader';
import { playSpeech, stopSpeech } from '../../utils/kannadaSpeech';
import {
  Smile,
  Volume2,
  PenTool,
  BookOpen,
  Sparkles,
  Star,
  Award,
  RotateCcw,
  Palette,
  Grid,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function KidsSection({ onBackToHome, langMode }) {
  const isKn = langMode === 'kn';

  const [activeCategory, setActiveCategory] = useState('swara'); // 'swara' | 'vyanjana' | 'kagunitha' | 'words' | 'sentences' | 'writing' | 'punctuation'
  const [selectedLetter, setSelectedLetter] = useState('ಅ');
  const [tracingLetter, setTracingLetter] = useState('ಅ');
  const [drawColor, setDrawColor] = useState('#000000');
  const [selectedKagunithaBase, setSelectedKagunithaBase] = useState('ಕ');

  // Digital Slate Canvas Ref
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Kids Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const kidsQuizList = [
    {
      qKn: 'ಆನೆ ಎಂಬ ಪದವು ಯಾವ ಅಕ್ಷರದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ?',
      qEn: 'Which letter does "Aane" (Elephant) start with?',
      options: ['ಅ', 'ಆ', 'ಇ', 'ಈ'],
      correctIdx: 1,
      icon: '🐘'
    },
    {
      qKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯ ಮೊದಲನೇ ಸ್ವರಾಕ್ಷರ ಯಾವುದು?',
      qEn: 'What is the very first vowel in the Kannada alphabet?',
      options: ['ಅ', 'ಕ', 'ಆ', 'ಮ'],
      correctIdx: 0,
      icon: '⭐'
    },
    {
      qKn: 'ಕಮಲ ಹೂವು ಯಾವ ವ್ಯಂಜನಾಕ್ಷರದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ?',
      qEn: 'Which consonant letter does "Kamala" (Lotus) start with?',
      options: ['ಗ', 'ಕ', 'ಚ', 'ತ'],
      correctIdx: 1,
      icon: '🪷'
    },
    {
      qKn: '"ಅಮ್ಮ" ಎಂಬ ಸುಂದರ ಪದದ ಅರ್ಥ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಏನು?',
      qEn: 'What does the Kannada word "Amma" mean in English?',
      options: ['Mother', 'Father', 'Teacher', 'Sister'],
      correctIdx: 0,
      icon: '❤️'
    },
    {
      qKn: 'ಸೂರ್ಯ ಶಬ್ದವು ಯಾವ ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ?',
      qEn: 'Which letter does "Surya" (Sun) start with?',
      options: ['ಶ', 'ಷ', 'ಸ', 'ಹ'],
      correctIdx: 2,
      icon: '☀️'
    },
    {
      qKn: 'ನವಿಲು ನಮ್ಮ ರಾಷ್ಟ್ರೀಯ ಪಕ್ಷಿ. ಇದರ ಆರಂಭದ ಅಕ್ಷರ ಯಾವುದು?',
      qEn: 'Which letter does "Navilu" (Peacock) start with?',
      options: ['ನ', 'ಪ', 'ಮ', 'ಬ'],
      correctIdx: 0,
      icon: '🦚'
    },
    {
      qKn: 'ಹಾಲು ಶಬ್ದದ ಸರಿಯಾದ ಮೊದಲ ಅಕ್ಷರ ಯಾವುದು?',
      qEn: 'What is the starting syllable for "Haalu" (Milk)?',
      options: ['ಪಾ', 'ಹಾ', 'ಮಾ', 'ವಾ'],
      correctIdx: 1,
      icon: '🥛'
    },
    {
      qKn: 'ಬೆಕ್ಕು ಎಂಬ ಮುದ್ದಾದ ಪ್ರಾಣಿಯ ಅರ್ಥವೇನು?',
      qEn: 'What animal is "Bekku" in English?',
      options: ['Dog', 'Cow', 'Cat', 'Goat'],
      correctIdx: 2,
      icon: '🐱'
    }
  ];

  const handleSelectQuizAnswer = (idx) => {
    if (quizAnswered) return;
    setQuizSelected(idx);
    setQuizAnswered(true);
    const isCorrect = idx === kidsQuizList[quizIdx].correctIdx;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      playCharSound(isKn ? 'ಸರಿ! ಬಹಳ ಒಳ್ಳೆಯದು!' : 'Correct! Well done!');
    } else {
      playCharSound(isKn ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!' : 'Try again next time!');
    }
  };

  const handleNextQuiz = () => {
    if (quizIdx + 1 < kidsQuizList.length) {
      setQuizIdx((prev) => prev + 1);
      setQuizSelected(null);
      setQuizAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setQuizSelected(null);
    setQuizAnswered(false);
    setQuizFinished(false);
  };

  const swaras = [
    { char: 'ಅ', nameEn: 'A', egKn: 'ಅಮ್ಮ', egEn: 'Amma (Mother)', sound: 'ಅ, ಅಮ್ಮ' },
    { char: 'ಆ', nameEn: 'Aa', egKn: 'ಆನೆ', egEn: 'Aane (Elephant)', sound: 'ಆ, ಆನೆ' },
    { char: 'ಇ', nameEn: 'I', egKn: 'ಇಲಿ', egEn: 'Ili (Mouse)', sound: 'ಇ, ಇಲಿ' },
    { char: 'ಈ', nameEn: 'Ee', egKn: 'ಈಜು', egEn: 'Eeju (Swim)', sound: 'ಈ, ಈಜು' },
    { char: 'ಉ', nameEn: 'U', egKn: 'ಉಡುಗೊರೆ', egEn: 'Udugore (Gift)', sound: 'ಉ, ಉಡುಗೊರೆ' },
    { char: 'ಊ', nameEn: 'Oo', egKn: 'ಊಟ', egEn: 'Oota (Meal)', sound: 'ಊ, ಊಟ' },
    { char: 'ಋ', nameEn: 'Ru', egKn: 'ಋಷಿ', egEn: 'Rushi (Sage)', sound: 'ಋ, ಋಷಿ' },
    { char: 'ಎ', nameEn: 'E', egKn: 'ಎಲೆ', egEn: 'Ele (Leaf)', sound: 'ಎ, ಎಲೆ' },
    { char: 'ಏ', nameEn: 'Ae', egKn: 'ಏಣಿ', egEn: 'Eani (Ladder)', sound: 'ಏ, ಏಣಿ' },
    { char: 'ಐ', nameEn: 'Ai', egKn: 'ಐದು', egEn: 'Aidu (Five)', sound: 'ಐ, ಐದು' },
    { char: 'ಒ', nameEn: 'O', egKn: 'ಒಂಟೆ', egEn: 'Onte (Camel)', sound: 'ಒ, ಒಂಟೆ' },
    { char: 'ಓ', nameEn: 'Oa', egKn: 'ಓಟ', egEn: 'Oata (Race)', sound: 'ಓ, ಓಟ' },
    { char: 'ಔ', nameEn: 'Au', egKn: 'ಔಷಧ', egEn: 'Oushadha (Medicine)', sound: 'ಔ, ಔಷಧ' },
    { char: 'ಅಂ', nameEn: 'Am', egKn: 'ಅಂಗಡಿ', egEn: 'Angadi (Shop)', sound: 'ಅಂ, ಅಂಗಡಿ' },
    { char: 'ಅಃ', nameEn: 'Aha', egKn: 'ಅಃ', egEn: 'Aha (Visarga)', sound: 'ಅಃ' }
  ];

  const fullVyanjanas = [
    { char: 'ಕ', egKn: 'ಕಮಲ (Lotus)', sound: 'ಕ, ಕಮಲ' },
    { char: 'ಖ', egKn: 'ಖಡ್ಗ (Sword)', sound: 'ಖ, ಖಡ್ಗ' },
    { char: 'ಗ', egKn: 'ಗಣೇಶ (Ganesha)', sound: 'ಗ, ಗಣೇಶ' },
    { char: 'ಘ', egKn: 'ಘಂಟೆ (Bell)', sound: 'ಘ, ಘಂಟೆ' },
    { char: 'ಙ', egKn: 'ಙ (Na)', sound: 'ಙ' },
    { char: 'ಚ', egKn: 'ಚಮಚ (Spoon)', sound: 'ಚ, ಚಮಚ' },
    { char: 'ಛ', egKn: 'ಛತ್ರಿ (Umbrella)', sound: 'ಛ, ಛತ್ರಿ' },
    { char: 'ಜ', egKn: 'ಜಲ (Water)', sound: 'ಜ, ಜಲ' },
    { char: 'ಝ', egKn: 'ಝರಿ (Stream)', sound: 'ಝ, ಝರಿ' },
    { char: 'ಞ', egKn: 'ಞ (Nya)', sound: 'ಞ' },
    { char: 'ಟ', egKn: 'ಟೊಮೆಟೊ (Tomato)', sound: 'ಟ, ಟೊಮೆಟೊ' },
    { char: 'ಠ', egKn: 'ಠಸ್ಸೆ (Stamp)', sound: 'ಠ, ಠಸ್ಸೆ' },
    { char: 'ಡ', egKn: 'ಡಮರು (Drum)', sound: 'ಡ, ಡಮರು' },
    { char: 'ಢ', egKn: 'ಢಕ್ಕೆ (Dhakke)', sound: 'ಢ, ಢಕ್ಕೆ' },
    { char: 'ಣ', egKn: 'ಬಾಣ (Arrow)', sound: 'ಣ, ಬಾಣ' },
    { char: 'ತ', egKn: 'ತಾಯಿ (Mother)', sound: 'ತ, ತಾಯಿ' },
    { char: 'ಥ', egKn: 'ರಥ (Chariot)', sound: 'ಥ, ರಥ' },
    { char: 'ದ', egKn: 'ದೀಪ (Lamp)', sound: 'ದ, ದೀಪ' },
    { char: 'ಧ', egKn: 'ಧನುಸ್ಸು (Bow)', sound: 'ಧ, ಧನುಸ್ಸು' },
    { char: 'ನ', egKn: 'ನವಿಲು (Peacock)', sound: 'ನ, ನವಿಲು' },
    { char: 'ಪ', egKn: 'ಪಾರಿವಾಳ (Pigeon)', sound: 'ಪ, ಪಾರಿವಾಳ' },
    { char: 'ಫ', egKn: 'ಫಲ (Fruit)', sound: 'ಫ, ಫಲ' },
    { char: 'ಬ', egKn: 'ಬೆಕ್ಕು (Cat)', sound: 'ಬ, ಬೆಕ್ಕು' },
    { char: 'ಭ', egKn: 'ಭಾರತ (Bharat)', sound: 'ಭ, ಭಾರತ' },
    { char: 'ಮ', egKn: 'ಮರ (Tree)', sound: 'ಮ, ಮರ' },
    { char: 'ಯ', egKn: 'ಯಜ್ಞ (Yajna)', sound: 'ಯ, ಯಜ್ಞ' },
    { char: 'ರ', egKn: 'ರೈಲು (Train)', sound: 'ರ, ರೈಲು' },
    { char: 'ಲ', egKn: 'ಲಡ್ಡು (Sweet)', sound: 'ಲ, ಲಡ್ಡು' },
    { char: 'ವ', egKn: 'ವಿಮಾನ (Aeroplane)', sound: 'ವ, ವಿಮಾನ' },
    { char: 'ಶ', egKn: 'ಶಂಖ (Conch)', sound: 'ಶ, ಶಂಖ' },
    { char: 'ಷ', egKn: 'ಷಣ್ಮುಖ (Shanmukha)', sound: 'ಷ, ಷಣ್ಮುಖ' },
    { char: 'ಸ', egKn: 'ಸೂರ್ಯ (Sun)', sound: 'ಸ, ಸೂರ್ಯ' },
    { char: 'ಹ', egKn: 'ಹಸು (Cow)', sound: 'ಹ, ಹಸು' },
    { char: 'ಳ', egKn: 'ಬಾಳೆ (Banana)', sound: 'ಳ, ಬಾಳೆ' }
  ];

  // Kagunitha suffixes map for combinations
  const kagunithaBases = ['ಕ', 'ಗ', 'ಚ', 'ಜ', 'ತ', 'ದ', 'ನ', 'ಪ', 'ಬ', 'ಮ', 'ರ', 'ಲ', 'ಸ', 'ಹ'];
  const kagunithaForms = {
    'ಕ': ['ಕ', 'ಕಾ', 'ಕಿ', 'ಕೀ', 'ಕು', 'ಕೂ', 'ಕೃ', 'ಕೆ', 'ಕೇ', 'ಕೈ', 'ಕೊ', 'ಕೋ', 'ಕೌ', 'ಕಂ', 'ಕಃ'],
    'ಗ': ['ಗ', 'ಗಾ', 'ಗಿ', 'ಗೀ', 'ಗು', 'ಗೂ', 'ಗೃ', 'ಗೆ', 'ಗೇ', 'ಗೈ', 'ಗೊ', 'ಗೋ', 'ಗೌ', 'ಗಂ', 'ಗಃ'],
    'ಚ': ['ಚ', 'ಚಾ', 'ಚಿ', 'ಚೀ', 'ಚು', 'ಚೂ', 'ಚೃ', 'ಚೆ', 'ಚೇ', 'ಚೈ', 'ಚೊ', 'ಚೋ', 'ಚೌ', 'ಚಂ', 'ಚಃ'],
    'ಜ': ['ಜ', 'ಜಾ', 'ಜಿ', 'ಜೀ', 'ಜು', 'ಜೂ', 'ಜೃ', 'ಜೆ', 'ಜೇ', 'ಜೈ', 'ಜೊ', 'ಜೋ', 'ಜೌ', 'ಜಂ', 'ಜಃ'],
    'ತ': ['ತ', 'ತಾ', 'ತಿ', 'ತೀ', 'ತು', 'ತೂ', 'ತೃ', 'ತೆ', 'ತೇ', 'ತೈ', 'ತೊ', 'ತೋ', 'ತೌ', 'ತಂ', 'ತಃ'],
    'ದ': ['ದ', 'ದಾ', 'ದಿ', 'ದೀ', 'ದು', 'ದೂ', 'ದೃ', 'ದೆ', 'ದೇ', 'ದೈ', 'ದೊ', 'ದೋ', 'ದೌ', 'ದಂ', 'ದಃ'],
    'ನ': ['ನ', 'ನಾ', 'ನಿ', 'ನೀ', 'ನು', 'ನೂ', 'ನೃ', 'ನೆ', 'ನೇ', 'ನೈ', 'ನೊ', 'ನೋ', 'ನೌ', 'ನಂ', 'ನಃ'],
    'ಪ': ['ಪ', 'ಪಾ', 'ಪಿ', 'ಪೀ', 'ಪು', 'ಪೂ', 'ಪೃ', 'ಪೆ', 'ಪೇ', 'ಪೈ', 'ಪೊ', 'ಪೋ', 'ಪೌ', 'ಪಂ', 'ಪಃ'],
    'ಬ': ['ಬ', 'ಬಾ', 'ಬಿ', 'ಬೀ', 'ಬು', 'ಬೂ', 'ಬೃ', 'ಬೆ', 'ಬೇ', 'ಬೈ', 'ಬೊ', 'ಬೋ', 'ಬೌ', 'ಬಂ', 'ಬಃ'],
    'ಮ': ['ಮ', 'ಮಾ', 'ಮಿ', 'ಮೀ', 'ಮು', 'ಮೂ', 'ಮೃ', 'ಮೆ', 'ಮೇ', 'ಮೈ', 'ಮೊ', 'ಮೋ', 'ಮೌ', 'ಮಂ', 'ಮಃ'],
    'ರ': ['ರ', 'ರಾ', 'ರಿ', 'ರೀ', 'ರು', 'ರೂ', 'ರೃ', 'ರೆ', 'ರೇ', 'ರೈ', 'ರೊ', 'ರೋ', 'ರೌ', 'ರಂ', 'ರಃ'],
    'ಲ': ['ಲ', 'ಲಾ', 'ಲಿ', 'ಲೀ', 'ಲು', 'ಲೂ', 'ಲೃ', 'ಲೆ', 'ಲೇ', 'ಲೈ', 'ಲೊ', 'ಲೋ', 'ಲೌ', 'ಲಂ', 'ಲಃ'],
    'ಸ': ['ಸ', 'ಸಾ', 'ಸಿ', 'ಸೀ', 'ಸು', 'ಸೂ', 'ಸೃ', 'ಸೆ', 'ಸೇ', 'ಸೈ', 'ಸೊ', 'ಸೋ', 'ಸೌ', 'ಸಂ', 'ಸಃ'],
    'ಹ': ['ಹ', 'ಹಾ', 'ಹಿ', 'ಹೀ', 'ಹು', 'ಹೂ', 'ಹೃ', 'ಹೆ', 'ಹೇ', 'ಹೈ', 'ಹೊ', 'ಹೋ', 'ಹೌ', 'ಹಂ', 'ಹಃ']
  };

  const kidWords = [
    { kn: 'ಸೂರ್ಯ', en: 'Sun', emoji: '☀️', pron: 'Soorya' },
    { kn: 'ಚಂದ್ರ', en: 'Moon', emoji: '🌙', pron: 'Chandra' },
    { kn: 'ಹೂವು', en: 'Flower', emoji: '🌸', pron: 'Hoovu' },
    { kn: 'ಹಕ್ಕಿ', en: 'Bird', emoji: '🐦', pron: 'Hakki' },
    { kn: 'ಬಾಳೆಹಣ್ಣು', en: 'Banana', emoji: '🍌', pron: 'Baalehannu' },
    { kn: 'ಪುಸ್ತಕ', en: 'Book', emoji: '📖', pron: 'Pusthaka' },
    { kn: 'ಆನೆ', en: 'Elephant', emoji: '🐘', pron: 'Aane' },
    { kn: 'ನವಿಲು', en: 'Peacock', emoji: '🦚', pron: 'Navilu' }
  ];

  const kidSentences = [
    { kn: 'ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ.', en: 'I go to school.' },
    { kn: 'ಆಕಾಶದಲ್ಲಿ ಪಕ್ಷಿಗಳು ಹಾರುತ್ತಿವೆ.', en: 'Birds are flying in the sky.' },
    { kn: 'ನನಗೆ ಹಣ್ಣುಗಳು ತುಂಬಾ ಇಷ್ಟ.', en: 'I like fruits very much.' },
    { kn: 'ತಾಯಿ ಪ್ರೀತಿಯಿಂದ ಊಟ ಬಡಿಸಿದರು.', en: 'Mother served food with love.' },
    { kn: 'ಕನ್ನಡ ನಮ್ಮ ಮುದ್ದಿನ ಭಾಷೆ.', en: 'Kannada is our sweet language.' }
  ];

  const punctuationItems = [
    { symbol: '।', nameKn: 'ಪೂರ್ಣವಿರಾಮ', nameEn: 'Full Stop (।)', usageKn: 'ವಾಕ್ಯ ಪೂರ್ಣಗೊಂಡಾಗ ಕೊನೆಯಲ್ಲಿ ಬಳಸಿ.', usageEn: 'Used at the end of a complete sentence.' },
    { symbol: ',', nameKn: 'ಅಲ್ಪವಿರಾಮ', nameEn: 'Comma (,)', usageKn: 'ವಾಕ್ಯದ ನಡುವೆ ಕಿರು ವಿರಾಮಕ್ಕಾಗಿ ಬಳಸಿ.', usageEn: 'Used for a brief pause between phrases.' },
    { symbol: '?', nameKn: 'ಪ್ರಶ್ನಾರ್ಥಕ ಚಿಹ್ನೆ', nameEn: 'Question Mark (?)', usageKn: 'ಪ್ರಶ್ನೆ ಕೇಳುವ ವಾಕ್ಯದ ಕೊನೆಯಲ್ಲಿ ಬಳಸಿ.', usageEn: 'Used at the end of an interrogative question.' },
    { symbol: '!', nameKn: 'ಭಾವಸೂಚಕ ಚಿಹ್ನೆ', nameEn: 'Exclamation Mark (!)', usageKn: 'ಆಶ್ಚರ್ಯ ಅಥವಾ ಆನಂದವನ್ನು ವ್ಯಕ್ತಪಡಿಸಲು ಬಳಸಿ.', usageEn: 'Used to express joy, surprise, or emotion.' }
  ];

  const playCharSound = (text) => {
    if (!text) return;
    playSpeech({
      text,
      lang: 'kn',
      id: `kids-${text}`
    });
  };

  // Canvas Drawing Handlers
  const getCanvasCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSlate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (activeCategory === 'writing') {
      clearSlate();
    }
  }, [activeCategory, tracingLetter]);

  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ಭಾಗ ೩ • ವರ್ಣಮಾಲೆ & ಗುಣಿತಾಕ್ಷರಗಳು"
        badgeEn="PART 3 • Alphabet & Letter Combinations"
        titleKn="ಮಕ್ಕಳ ಕನ್ನಡ ಕಲಿಕಾ ಲೋಕ"
        titleEn="Kids’ Kannada Learning Hub"
        taglineKn="ಸ್ವರಗಳು, ವ್ಯಂಜನಗಳು, ಗುಣಿತಾಕ್ಷರಗಳು, ಪದ ಭಂಡಾರ, ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್ ಮತ್ತು ಸರಳ ವಾಕ್ಯಗಳು"
        taglineEn="Vowels, consonants, letter combinations (Kagunitha), picture vocabulary, slate tracing, and sentences"
        icon={Smile}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      <div className="section-body">
        {/* Sub-Category Nav Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            { id: 'swara', titleKn: '⭐ ಸ್ವರಗಳು (೧೫)', titleEn: '⭐ Vowels (15)' },
            { id: 'vyanjana', titleKn: '🎨 ವ್ಯಂಜನಗಳು (೩೪)', titleEn: '🎨 Consonants (34)' },
            { id: 'kagunitha', titleKn: '🔡 ಗುಣಿತಾಕ್ಷರಗಳು', titleEn: '🔡 Letter Combinations' },
            { id: 'words', titleKn: '🍎 ಚಿತ್ರ ಪದಗಳು', titleEn: '🍎 Picture Words' },
            { id: 'sentences', titleKn: '📖 ಸರಳ ವಾಕ್ಯಗಳು', titleEn: '📖 Simple Sentences' },
            { id: 'writing', titleKn: '✍️ ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್', titleEn: '✍️ Digital Slate' },
            { id: 'punctuation', titleKn: '🔤 ವಿರಾಮಚಿಹ್ನೆಗಳು', titleEn: '🔤 Punctuation' },
            { id: 'quiz', titleKn: '🎯 ಮಕ್ಕಳ ರಸಪ್ರಶ್ನೆ', titleEn: '🎯 Kids Fun Quiz' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
              style={{ fontSize: '0.84rem', padding: '0.4rem 0.85rem' }}
              onClick={() => setActiveCategory(cat.id)}
            >
              {isKn ? cat.titleKn : cat.titleEn}
            </button>
          ))}
        </div>

        {/* Tab 1: Swara (Vowels) */}
        {activeCategory === 'swara' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? 'ಕನ್ನಡ ಸ್ವರಗಳು (೧೫ ಅಕ್ಷರಗಳು)' : 'Kannada Vowels (15 Letters)'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಯಾವುದೇ ಸ್ವರಾಕ್ಷರದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಸ್ಪಷ್ಟ ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ:'
                  : 'Click any vowel letter to listen to its authentic Kannada pronunciation:'}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.75rem'
              }}
            >
              {swaras.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{
                    background: selectedLetter === item.char ? 'var(--color-flag-yellow-soft)' : '#FFFDF7',
                    border: `1.5px solid ${selectedLetter === item.char ? 'var(--color-flag-red)' : 'var(--color-cream-border)'}`,
                    borderRadius: '12px',
                    padding: '0.85rem 0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  onClick={() => {
                    setSelectedLetter(item.char);
                    playCharSound(item.sound);
                  }}
                >
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-flag-red)' }} className="kn-heading">
                    {item.char}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#777', fontWeight: 600 }}>
                    {item.nameEn}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#333' }} className="kn-text">
                    {item.egKn}
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <span className="btn-audio-speaker-circle" style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}>
                      <Volume2 size={20} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Vyanjana (Consonants) */}
        {activeCategory === 'vyanjana' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? 'ಕನ್ನಡ ವ್ಯಂಜನಗಳು (೩೪ ಅಕ್ಷರಗಳು)' : 'Kannada Consonants (34 Letters)'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಅಕ್ಷರದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಉದಾಹರಣೆ ಸಮೇತ ಧ್ವನಿ ಆಲಿಸಿ:'
                  : 'Click on any consonant to hear its distinct phonetic sound and example:'}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '0.75rem'
              }}
            >
              {fullVyanjanas.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{
                    background: selectedLetter === item.char ? 'var(--color-flag-yellow-soft)' : '#FFFDF7',
                    border: `1.5px solid ${selectedLetter === item.char ? 'var(--color-flag-red)' : 'var(--color-cream-border)'}`,
                    borderRadius: '12px',
                    padding: '0.85rem 0.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  onClick={() => {
                    setSelectedLetter(item.char);
                    playCharSound(item.sound);
                  }}
                >
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-flag-red)' }} className="kn-heading">
                    {item.char}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#333' }} className="kn-text">
                    {item.egKn}
                  </div>
                  <div style={{ marginTop: '0.35rem' }}>
                    <span className="btn-audio-speaker-circle" style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}>
                      <Volume2 size={20} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Kagunitha (Letter Combinations) */}
        {activeCategory === 'kagunitha' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? 'ಕನ್ನಡ ಗುಣಿತಾಕ್ಷರಗಳು (ಕಾಗುಣಿತ)' : 'Kannada Letter Combinations (Kagunitha)'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಮೂಲ ವ್ಯಂಜನ ಆರಿಸಿ, ಅದರ ಸಂಪೂರ್ಣ ಕಾಗುಣಿತ ಮಾಲಿಕೆಯನ್ನು ಆಲಿಸಿ:'
                  : 'Select a base consonant to explore and hear its full vowel-combination series:'}
              </p>
            </div>

            {/* Base consonant selector */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                {isKn ? 'ವ್ಯಂಜನ ಆರಿಸಿ:' : 'Select Consonant:'}
              </span>
              {kagunithaBases.map((base) => (
                <button
                  key={base}
                  type="button"
                  className={`btn ${selectedKagunithaBase === base ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '1rem', fontWeight: 700 }}
                  onClick={() => setSelectedKagunithaBase(base)}
                >
                  {base}
                </button>
              ))}
            </div>

            {/* Kagunitha Series Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '0.65rem'
              }}
            >
              {(kagunithaForms[selectedKagunithaBase] || []).map((formChar, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '10px',
                    padding: '0.75rem 0.25rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                  onClick={() => playCharSound(formChar)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-flag-red)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-cream-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }} className="kn-heading">
                    {formChar}
                  </div>
                  <span className="btn-audio-speaker-circle" style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}>
                    <Volume2 size={18} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Picture Words */}
        {activeCategory === 'words' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? 'ಚಿತ್ರ ಮತ್ತು ನಿತ್ಯ ಪದಗಳು' : 'Illustrated Picture Vocabulary'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಚಿತ್ರ ನೋಡಿ ಪದ ಗುರುತಿಸಿ ಮತ್ತು ಸರಿಯಾದ ಉಚ್ಚಾರಣೆ ಕಲಿಯಿರಿ:'
                  : 'Look at the picture, recognize the Kannada word, and listen to its pronunciation:'}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.85rem'
              }}
            >
              {kidWords.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => playCharSound(item.kn)}
                >
                  <div style={{ fontSize: '2.5rem' }}>{item.emoji}</div>
                  <div className="kn-heading" style={{ fontSize: '1.2rem', color: 'var(--color-flag-red)', fontWeight: 800 }}>
                    {item.kn}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#7B5E00', fontStyle: 'italic', fontWeight: 600 }}>
                    {item.pron}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>
                    {item.en}
                  </div>
                  <span
                    className="btn-audio-speaker-circle"
                    style={{ marginTop: '0.35rem' }}
                    title={isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen'}
                    aria-label={isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen'}
                  >
                    <Volume2 size={22} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Simple Sentences */}
        {activeCategory === 'sentences' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? 'ಮಕ್ಕಳ ಸರಳ ವಾಕ್ಯಗಳು' : 'Simple Sentences for Kids'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಸರಳ ವಾಕ್ಯಗಳನ್ನು ಗಟ್ಟಿಯಾಗಿ ಓದಿ ಧ್ವನಿ ಆಲಿಸಿ:'
                  : 'Read aloud simple Kannada sentences and click to hear clear pronunciation:'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {kidSentences.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '10px',
                    padding: '0.85rem 1.1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div className="kn-heading" style={{ fontSize: '1.02rem', color: '#111' }}>
                      {s.kn}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.2rem' }}>
                      {s.en}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-audio-speaker-circle"
                    onClick={() => playCharSound(s.kn)}
                    title={isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen'}
                    aria-label={isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen'}
                  >
                    <Volume2 size={22} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Digital Slate Tracing Canvas */}
        {activeCategory === 'writing' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? '✍️ ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್' : '✍️ Digital Slate Tracing'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಅಕ್ಷರ ಆರಿಸಿ, ನಿಮ್ಮ ಮೌಸ್ ಅಥವಾ ಬೆರಳಿನಿಂದ ಸ್ಲೇಟಿನ ಮೇಲೆ ಅಕ್ಷರ ತಿದ್ದಿ ಬರೆಯಿರಿ:'
                  : 'Choose a Kannada letter, then trace with your mouse or finger on the slate:'}
              </p>
            </div>

            {/* Letter to Trace Selector */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                {isKn ? 'ತಿದ್ದಲು ಅಕ್ಷರ ಆರಿಸಿ:' : 'Letter to Trace:'}
              </span>
              {['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಕ', 'ಗ', 'ಚ', 'ಜ', 'ತ', 'ದ', 'ನ', 'ಪ', 'ಮ', 'ರ', 'ಲ', 'ಸ', 'ಹ', 'ಳ'].map((char) => (
                <button
                  key={char}
                  type="button"
                  className={`btn ${tracingLetter === char ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.95rem' }}
                  onClick={() => setTracingLetter(char)}
                >
                  {char}
                </button>
              ))}
            </div>

            {/* Drawing Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {isKn ? 'ಚಾಕ್ ಬಣ್ಣ:' : 'Chalk Color:'}
                </span>
                {[
                  { color: '#000000', nameKn: 'ಕಪ್ಪು', nameEn: 'Black' },
                  { color: '#FF0000', nameKn: 'ಕೆಂಪು', nameEn: 'Red' },
                  { color: '#E6A800', nameKn: 'ಹಳದಿ', nameEn: 'Yellow' }
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: c.color,
                      border: drawColor === c.color ? '3px solid #000000' : '1px solid #CCC',
                      cursor: 'pointer'
                    }}
                    title={isKn ? c.nameKn : c.nameEn}
                    onClick={() => setDrawColor(c.color)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={clearSlate}
              >
                <RotateCcw size={14} />
                <span>{isKn ? 'ಸ್ಲೇಟ್ ಅಳಿಸಿ' : 'Clear Slate'}</span>
              </button>
            </div>

            {/* Canvas Slate Box */}
            <div className="digital-slate-wrapper">
              <div className="slate-guide-watermark kn-heading">
                {tracingLetter}
              </div>

              <canvas
                ref={canvasRef}
                width={500}
                height={260}
                className="slate-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              {isKn
                ? '✦ ಮೇಲೆ ನೀಡಿರುವ ಅಕ್ಷರವನ್ನು ಸ್ಲೇಟ್‌ನ ಮೇಲೆ ತಿದ್ದಿ ಕೈಬರಹ ರೂಢಿಸಿಕೊಳ್ಳಿ.'
                : '✦ Trace over the background guide letter to master hand stroke motions.'}
            </p>
          </div>
        )}

        {/* Tab 7: Punctuation */}
        {activeCategory === 'punctuation' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? 'ಕನ್ನಡ ವಿರಾಮಚಿಹ್ನೆಗಳು' : 'Kannada Punctuation Marks'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಸರಿಯಾದ ಸ್ಥಳದಲ್ಲಿ ವಿರಾಮಚಿಹ್ನೆಗಳನ್ನು ಬಳಸುವ ಸರಳ ನಿಯಮಗಳು:'
                  : 'Rules and practical usage for punctuation marks in written Kannada:'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {punctuationItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      background: 'var(--color-flag-red)',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 900
                    }}
                  >
                    {item.symbol}
                  </div>
                  <div>
                    <div className="kn-heading" style={{ fontSize: '0.98rem', fontWeight: 700 }}>
                      {isKn ? item.nameKn : item.nameEn}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                      {isKn ? item.usageKn : item.usageEn}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Kids Fun Quiz */}
        {activeCategory === 'quiz' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--color-cream-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎯</span>
                  <span>{isKn ? 'ಮಕ್ಕಳ ಸಂವಾದಾತ್ಮಕ ಕನ್ನಡ ರಸಪ್ರಶ್ನೆ' : 'Kids’ Interactive Kannada Quiz'}</span>
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                  {isKn ? 'ಚಿತ್ರ ಮತ್ತು ಧ್ವನಿ ಆಧಾರಿತ ಸರಳ ಕನ್ನಡ ಪ್ರಶ್ನೋತ್ತರ' : 'Fun picture and sound based questions for children'}
                </p>
              </div>

              {!quizFinished && (
                <div style={{ background: 'var(--color-flag-yellow-soft)', border: '1px solid var(--color-flag-yellow-border)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>
                  {isKn ? `ಪ್ರಶ್ನೆ: ${quizIdx + 1} / ${kidsQuizList.length}` : `Question: ${quizIdx + 1} of ${kidsQuizList.length}`} • ⭐ {quizScore}
                </div>
              )}
            </div>

            {quizFinished ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉 ⭐ 🏆</div>
                <h3 className="kn-heading" style={{ fontSize: '1.4rem', color: 'var(--color-flag-red)' }}>
                  {isKn ? 'ಅದ್ಭುತ ಸಾಧನೆ, ಪುಟಾಣಿ ಗೆಳೆಯ!' : 'Superb Job, Little Champion!'}
                </h3>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111', margin: '0.5rem 0 1.25rem 0' }}>
                  {isKn
                    ? `ನಿಮ್ಮ ಅಂಕ: ${kidsQuizList.length} ರಲ್ಲಿ ${quizScore} ಸರಿ!`
                    : `Your Score: ${quizScore} out of ${kidsQuizList.length} correct!`}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}
                  onClick={handleRestartQuiz}
                >
                  <RotateCcw size={16} />
                  <span>{isKn ? 'ಮತ್ತೆ ಆಟ ಆಡಿ' : 'Play Again'}</span>
                </button>
              </div>
            ) : (
              <div>
                {/* Question Box */}
                <div style={{ background: 'var(--color-cream-card)', border: '1.5px solid var(--color-flag-yellow-border)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    {kidsQuizList[quizIdx].icon}
                  </div>
                  <div className="kn-heading" style={{ fontSize: '1.25rem', color: '#111', fontWeight: 800 }}>
                    {isKn ? kidsQuizList[quizIdx].qKn : kidsQuizList[quizIdx].qEn}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ marginTop: '0.75rem', padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                    onClick={() => playCharSound(kidsQuizList[quizIdx].qKn)}
                  >
                    <Volume2 size={14} />
                    <span>{isKn ? 'ಪ್ರಶ್ನೆ ಆಲಿಸಿ' : 'Listen to Question'}</span>
                  </button>
                </div>

                {/* Option Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {kidsQuizList[quizIdx].options.map((opt, oIdx) => {
                    const isSelected = quizSelected === oIdx;
                    const isCorrect = oIdx === kidsQuizList[quizIdx].correctIdx;

                    let bg = '#FFFDF7';
                    let border = '1.5px solid var(--color-cream-border)';
                    let color = '#111';

                    if (quizAnswered) {
                      if (isCorrect) {
                        bg = '#E8F8F0';
                        border = '2px solid #27AE60';
                        color = '#1E7E4E';
                      } else if (isSelected) {
                        bg = '#FDECEA';
                        border = '2px solid var(--color-flag-red)';
                        color = 'var(--color-flag-red)';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={quizAnswered}
                        style={{
                          background: bg,
                          border: border,
                          color: color,
                          borderRadius: '12px',
                          padding: '1.15rem 0.5rem',
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          cursor: quizAnswered ? 'default' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onClick={() => handleSelectQuizAnswer(oIdx)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                {quizAnswered && (
                  <div style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.55rem 1.4rem' }}
                      onClick={handleNextQuiz}
                    >
                      <span>{quizIdx + 1 === kidsQuizList.length ? (isKn ? 'ಫಲಿತಾಂಶ ನೋಡಿ' : 'See Results') : (isKn ? 'ಮುಂದಿನ ಪ್ರಶ್ನೆ ➔' : 'Next Question ➔')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
