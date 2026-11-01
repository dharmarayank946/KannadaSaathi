import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useKannadaSpeech } from '../../utils/kannadaSpeech';
import RajyotsavaLiveTracker from '../common/RajyotsavaLiveTracker';
import {
  ArrowLeft,
  Search,
  Landmark,
  UtensilsCrossed,
  Palette,
  Sparkles,
  Trees,
  Scissors,
  FileCode,
  Flame,
  BookMarked,
  FileText,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  X,
  ChevronRight,
  Info,
  HelpCircle,
  Bot,
  Send,
  RotateCcw,
  Award,
  Calendar,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

import {
  HERITAGE_CATEGORIES,
  HISTORICAL_LANDMARKS_12,
  ALL_HISTORICAL_15,
  ARTS_AND_FOLK_15,
  KARNATAKA_CUISINE_15,
  FESTIVALS_15,
  NATURE_AND_TOURISM_15,
  HANDICRAFTS_15,
  KANNADA_INSCRIPTIONS_DATA,
  SHIVASHARANAS_15,
  LITERATURE_AND_JNANPITH_10,
  CIVIC_HERITAGE_10,
  HERITAGE_QUIZ_QUESTIONS,
  HERITAGE_CHAT_SUGGESTIONS
} from '../../data/heritageCompleteData';

import { HERITAGE_ALL_62_TOPICS } from '../../data/heritageTopicsData';

import {
  HERITAGE_15_PLACES,
  HERITAGE_MAIN_SECTION
} from '../../data/heritage15Places';

import { civicHeritageData } from '../../data/karnatakaData';

// Icon resolver for category tabs and cards
const ICON_MAP = {
  Landmark,
  Palette,
  UtensilsCrossed,
  Sparkles,
  Trees,
  Scissors,
  FileCode,
  Flame,
  BookMarked,
  FileText,
  HelpCircle,
  Bot
};

export default function HeritageSection({ onBackToHome, langMode = 'kn', initialCategory = 'all', initialQuery = '' }) {
  const isKn = langMode === 'kn';

  // Navigation tab state
  const [activeTab, setActiveTab] = useState(() => {
    if (initialCategory === 'heritage' || initialCategory === 'historical') return 'historical';
    if (initialCategory === 'food' || initialCategory === 'cuisine') return 'cuisine';
    return initialCategory || 'all';
  });

  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedItem, setSelectedItem] = useState(null);
  const [heritageSubFilter, setHeritageSubFilter] = useState('all'); // 'all' | 'historical' | 'monument'

  // Audio Speech state with universal speech system (with Play, Pause, Resume, Stop)
  const { playSpeech, pauseSpeech, resumeSpeech, stopSpeech, activeId, isSpeaking, isPaused } = useKannadaSpeech();
  const [speakingCardId, setSpeakingCardId] = useState(null);
  const [speechNotice, setSpeechNotice] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    setSpeakingCardId(isSpeaking ? activeId : null);
  }, [activeId, isSpeaking]);

  // Heritage Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizHasAnswered, setQuizHasAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Heritage Chatbot state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      textKn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕನ್ನಡಸಾಥಿ ಪರಂಪರೆ ಸಹಾಯಕ. ಕರ್ನಾಟಕದ ಐತಿಹಾಸಿಕ ತಾಣಗಳು, ವಾಸ್ತುಶಿಲ್ಪ, ಆಹಾರ, ಹಬ್ಬಗಳು, ವಚನ ಸಾಹಿತ್ಯ ಅಥವಾ ಶಾಸನಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
      textEn: 'Namaskara! I am your KannadaSaathi Heritage Assistant. Ask me anything about Karnataka’s historical sites, architecture, cuisine, festivals, Vachana literature, or inscriptions.',
      timestamp: 'ಈಗಷ್ಟೇ'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatEngineMode, setChatEngineMode] = useState('verified-local'); // 'live-api' | 'verified-local'
  const chatBottomRef = useRef(null);

  // Check backend Gemini live status on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.geminiConfigured) {
          setChatEngineMode('live-api');
        } else {
          setChatEngineMode('verified-local');
        }
      })
      .catch(() => {
        setChatEngineMode('verified-local');
      });
  }, []);

  // Sync initial category when prop changes
  useEffect(() => {
    if (initialCategory) {
      if (initialCategory === 'heritage' || initialCategory === 'historical') {
        setActiveTab('historical');
      } else if (initialCategory === 'food' || initialCategory === 'cuisine') {
        setActiveTab('cuisine');
      } else {
        setActiveTab(initialCategory);
      }
    }
  }, [initialCategory]);

  // Clean speech synthesis when leaving or changing tabs
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingCardId(null);
    }
  }, [activeTab]);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (activeTab === 'assistant' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Tabs navigation definition (9 Core Cultural Categories + All Topics per Prompt)
  const navTabs = [
    { id: 'all', labelKn: 'ಎಲ್ಲಾ ವಿಷಯಗಳು', labelEn: 'All Topics', icon: Sparkles },
    { id: 'historical', labelKn: 'ಐತಿಹಾಸಿಕ ಸ್ಮಾರಕಗಳು ಮತ್ತು ಪರಂಪರೆ', labelEn: 'Historical Monuments & Heritage', icon: Landmark },
    { id: 'folk_arts', labelKn: 'ಜನಪದ ಕಲೆಗಳು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ನೃತ್ಯಗಳು', labelEn: 'Folk Arts & Traditional Dances', icon: Palette },
    { id: 'festivals', labelKn: 'ಕರ್ನಾಟಕದ ಹಬ್ಬಗಳು', labelEn: 'Festivals of Karnataka', icon: Sparkles },
    { id: 'nature', labelKn: 'ಗಿರಿಧಾಮಗಳು, ಅರಣ್ಯಗಳು ಮತ್ತು ವನ್ಯಜೀವಿಗಳು', labelEn: 'Hill Stations, Forests & Wildlife', icon: Trees },
    { id: 'handicrafts', labelKn: 'ಸಾಂಪ್ರದಾಯಿಕ ಕರಕುಶಲ ಕಲೆಗಳು', labelEn: 'Traditional Handicrafts', icon: Scissors },
    { id: 'textiles', labelKn: 'ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪು ಮತ್ತು ಕಸೂತಿ', labelEn: 'Traditional Textiles & Embroidery', icon: Sparkles },
    { id: 'inscriptions', labelKn: 'ಶಾಸನಗಳು ಮತ್ತು ಭಾಷೆಯ ಇತಿಹಾಸ', labelEn: 'Inscriptions & Language History', icon: FileCode },
    { id: 'sharanas', labelKn: 'ವಚನಕಾರರು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ವ್ಯಕ್ತಿತ್ವಗಳು', labelEn: 'Vachanakaras & Spiritual Figures', icon: Flame },
    { id: 'literature', labelKn: 'ಕನ್ನಡದ ಪ್ರಮುಖ ಕವಿಗಳು ಮತ್ತು ಲೇಖಕರು', labelEn: 'Prominent Poets & Writers', icon: BookMarked },
    { id: 'civic', labelKn: 'ಕನ್ನಡ ಗೀತೆಗಳು ಮತ್ತು ಸಂವಿಧಾನ', labelEn: 'Songs & Constitution', icon: FileText }
  ];

  // Helper normalizer for title matching
  const normTitle = (str) => {
    return (str || '')
      .normalize('NFC')
      .replace(/[—\-\(\)\s&]/g, '')
      .toLowerCase();
  };

  // ============================================================================
  // UNIFIED SEARCH LIST (All 62 Heritage Topics with verified Google Share Links
  // Merged with all existing items - ZERO duplications, all items preserved)
  // ============================================================================
  const unifiedSearchableItems = useMemo(() => {
    // 1. Build map of all 62 required topics
    const reqMap = new Map();
    HERITAGE_ALL_62_TOPICS.forEach((req) => {
      reqMap.set(req.titleKn, req);
    });

    // 2. Gather all base existing items across categories
    const baseExisting = [];

    // 1. Historical Places (All 15 items preserved)
    HERITAGE_15_PLACES.forEach((item) => {
      baseExisting.push({
        ...item,
        location: isKn ? item.townDistrictKn : item.townDistrictEn,
        imageUrl: item.imagePath || item.imageUrl,
        categoryId: 'historical',
        categoryNameKn: 'ಐತಿಹಾಸಿಕ ಸ್ಮಾರಕಗಳು ಮತ್ತು ಪರಂಪರೆ',
        categoryNameEn: 'Historical Monuments & Heritage',
        categoryColor: '#B91C1C'
      });
    });

    // 2. Folk Arts (All 15+ items preserved)
    ARTS_AND_FOLK_15.forEach((item) => {
      baseExisting.push({
        ...item,
        categoryId: 'folk_arts',
        categoryNameKn: 'ಜನಪದ ಕಲೆಗಳು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ನೃತ್ಯಗಳು',
        categoryNameEn: 'Folk Arts & Traditional Dances',
        categoryColor: '#D97706'
      });
    });

    // 3. Festivals (All 15 items preserved)
    FESTIVALS_15.forEach((item) => {
      baseExisting.push({
        ...item,
        categoryId: 'festivals',
        categoryNameKn: 'ಕರ್ನಾಟಕದ ಹಬ್ಬಗಳು',
        categoryNameEn: 'Festivals of Karnataka',
        categoryColor: '#7C3AED'
      });
    });

    // 4. Nature & Tourism (All 15 items preserved)
    NATURE_AND_TOURISM_15.forEach((item) => {
      baseExisting.push({
        ...item,
        categoryId: 'nature',
        categoryNameKn: 'ಗಿರಿಧಾಮಗಳು, ಅರಣ್ಯಗಳು ಮತ್ತು ವನ್ಯಜೀವಿಗಳು',
        categoryNameEn: 'Hill Stations, Forests & Wildlife',
        categoryColor: '#059669'
      });
    });

    // 5. Handicrafts (All 15 items preserved)
    HANDICRAFTS_15.forEach((item) => {
      baseExisting.push({
        ...item,
        categoryId: 'handicrafts',
        categoryNameKn: 'ಸಾಂಪ್ರದಾಯಿಕ ಕರಕುಶಲ ಕಲೆಗಳು',
        categoryNameEn: 'Traditional Handicrafts',
        categoryColor: '#0891B2'
      });
    });

    // 6. Inscriptions & Language History (All items preserved)
    KANNADA_INSCRIPTIONS_DATA.forEach((item) => {
      baseExisting.push({
        ...item,
        categoryId: 'inscriptions',
        categoryNameKn: 'ಶಾಸನಗಳು ಮತ್ತು ಭಾಷೆಯ ಇತಿಹಾಸ',
        categoryNameEn: 'Inscriptions & Language History',
        categoryColor: '#4338CA'
      });
    });

    // 7. Shivasharanas & Spiritual Figures (All items preserved)
    SHIVASHARANAS_15.forEach((item) => {
      baseExisting.push({
        ...item,
        titleKn: item.titleKn || item.nameKn,
        titleEn: item.titleEn || item.nameEn,
        subtitleKn: item.subtitleKn || (item.ankitaKn ? `ಅಂಕಿತನಾಮ: ${item.ankitaKn}` : item.periodKn),
        subtitleEn: item.subtitleEn || (item.ankitaEn ? `Pen Name: ${item.ankitaEn}` : item.periodEn),
        vachanaExcerptKn: item.vachanaSampleKn,
        categoryId: 'sharanas',
        categoryNameKn: 'ವಚನಕಾರರು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ವ್ಯಕ್ತಿತ್ವಗಳು',
        categoryNameEn: 'Vachanakaras & Spiritual Figures',
        categoryColor: '#EA580C'
      });
    });

    // 8. Literature & Jnanpith (All items preserved)
    LITERATURE_AND_JNANPITH_10.forEach((item) => {
      baseExisting.push({
        ...item,
        titleKn: item.titleKn || item.nameKn,
        titleEn: item.titleEn || item.nameEn,
        subtitleKn: item.subtitleKn || (item.year ? `ವರ್ಷ: ${item.year}` : item.masterpieceKn),
        subtitleEn: item.subtitleEn || (item.yearEn ? `Year: ${item.yearEn}` : item.masterpieceEn),
        categoryId: 'literature',
        categoryNameKn: 'ಕನ್ನಡದ ಪ್ರಮುಖ ಕವಿಗಳು ಮತ್ತು ಲೇಖಕರು',
        categoryNameEn: 'Prominent Poets & Writers',
        categoryColor: '#9333EA'
      });
    });

    // 9. Civic Heritage (Songs & Constitution)
    CIVIC_HERITAGE_10.forEach((item) => {
      baseExisting.push({
        ...item,
        categoryId: 'civic',
        categoryNameKn: 'ಕನ್ನಡ ಗೀತೆಗಳು ಮತ್ತು ಸಂವಿಧಾನ',
        categoryNameEn: 'Songs & Constitution',
        categoryColor: '#B91C1C'
      });
    });

    // 3. Merge: Match existing items with required 62 topics to update title & share link in-place (no duplicates)
    const merged = [];
    const matchedReqKeys = new Set();

    baseExisting.forEach((ex) => {
      const exTitle = ex.titleKn || ex.nameKn || '';
      let matchedReq = null;
      for (const [reqTitle, reqObj] of reqMap.entries()) {
        if (
          exTitle === reqTitle ||
          normTitle(exTitle) === normTitle(reqTitle) ||
          (normTitle(exTitle).startsWith(normTitle(reqTitle)) && normTitle(reqTitle).length >= 4)
        ) {
          matchedReq = reqObj;
          matchedReqKeys.add(reqTitle);
          break;
        }
      }

      if (matchedReq) {
        merged.push({
          ...ex,
          imageUrl: (matchedReq.imageUrl !== undefined && matchedReq.imageUrl !== null) ? matchedReq.imageUrl : ex.imageUrl,
          titleKn: matchedReq.titleKn, // use exact supplied Kannada title
          titleEn: matchedReq.titleEn || ex.titleEn,
          categoryId: matchedReq.category,
          categoryNameKn: matchedReq.categoryNameKn,
          categoryColor: matchedReq.categoryColor || ex.categoryColor,
          sourceUrl: matchedReq.sourceUrl,
          originalUrl: matchedReq.originalUrl,
          sourceName: matchedReq.sourceName || 'Google Share Reference',
          linkStatus: matchedReq.linkStatus || 'valid',
          verificationNotice: matchedReq.verificationNotice,
          secondaryUrl: matchedReq.secondaryUrl
        });
      } else {
        merged.push(ex);
      }
    });

    // 4. Append required topics that were not matched to any existing item (e.g. Bidriware, Rosewood Inlay, Ganjifa Cards, 2nd Basavanna ref)
    for (const [reqTitle, reqObj] of reqMap.entries()) {
      if (!matchedReqKeys.has(reqTitle)) {
        merged.push({
          id: reqObj.id,
          titleKn: reqObj.titleKn,
          titleEn: reqObj.titleEn,
          subtitleKn: reqObj.subtitleKn,
          subtitleEn: reqObj.subtitleEn,
          descKn: reqObj.descKn,
          descEn: reqObj.descEn,
          location: reqObj.location,
          imageUrl: reqObj.imageUrl,
          categoryId: reqObj.category,
          categoryNameKn: reqObj.categoryNameKn,
          categoryNameEn: reqObj.categoryNameEn,
          categoryColor: reqObj.categoryColor,
          sourceUrl: reqObj.sourceUrl,
          originalUrl: reqObj.originalUrl,
          sourceName: reqObj.sourceName,
          linkStatus: reqObj.linkStatus,
          verificationNotice: reqObj.verificationNotice,
          secondaryUrl: reqObj.secondaryUrl,
          vachanaExcerptKn: reqObj.vachanaExcerptKn
        });
      }
    }

    return merged;
  }, [isKn]);

  // Filtered items based on activeTab and searchQuery
  const displayedItems = useMemo(() => {
    let base = unifiedSearchableItems;

    if (activeTab !== 'all' && activeTab !== 'quiz' && activeTab !== 'assistant') {
      base = base.filter((item) => item.categoryId === activeTab);
    }

    if (!searchQuery.trim()) return base;

    const q = searchQuery.toLowerCase().trim().normalize('NFC');
    const filterFn = (item) => {
      const matchTitleKn = (item.titleKn || '').normalize('NFC').toLowerCase().includes(q);
      const matchTitleEn = (item.titleEn || '').normalize('NFC').toLowerCase().includes(q);
      const matchSubtitleKn = (item.subtitleKn || '').normalize('NFC').toLowerCase().includes(q);
      const matchSubtitleEn = (item.subtitleEn || '').normalize('NFC').toLowerCase().includes(q);
      const matchDescKn = (item.descKn || '').normalize('NFC').toLowerCase().includes(q);
      const matchDescEn = (item.descEn || '').normalize('NFC').toLowerCase().includes(q);
      const matchLocation = (item.location || item.placeKn || '').normalize('NFC').toLowerCase().includes(q);
      const matchDynasty = (item.dynasty || item.dynastyKn || '').normalize('NFC').toLowerCase().includes(q);
      const matchCategory = (item.categoryNameKn || '').normalize('NFC').toLowerCase().includes(q) || (item.categoryNameEn || '').normalize('NFC').toLowerCase().includes(q);
      return matchTitleKn || matchTitleEn || matchSubtitleKn || matchSubtitleEn || matchDescKn || matchDescEn || matchLocation || matchDynasty || matchCategory;
    };

    let results = base.filter(filterFn);
    // If no results in specific tab, search across all items
    if (results.length === 0 && activeTab !== 'all') {
      results = unifiedSearchableItems.filter(filterFn);
    }
    return results;
  }, [unifiedSearchableItems, activeTab, searchQuery]);

  // ============================================================================
  // VOICE-FIRST TEXT-TO-SPEECH PLAYBACK HELPER (Universal Speech Integration)
  // ============================================================================
  const speakText = (id, textKn, textEn) => {
    // Toggle off if currently playing this item
    if (activeId === id && isSpeaking) {
      stopSpeech();
      setSpeakingCardId(null);
      return;
    }

    setSpeechNotice(null);
    const textToSpeak = isKn ? textKn : (textEn || textKn);
    if (!textToSpeak || !textToSpeak.trim()) return;

    playSpeech({
      text: textToSpeak,
      lang: isKn ? 'kn' : 'en',
      id: id,
      onStart: () => setSpeakingCardId(id),
      onEnd: () => setSpeakingCardId(null),
      onError: (errMsg) => {
        setSpeakingCardId(null);
        setSpeechNotice(
          isKn
            ? 'ಧ್ವನಿ ಪ್ಲೇಬ್ಯಾಕ್‌ನಲ್ಲಿ ತೊಂದರೆ: ' + errMsg
            : 'Audio playback notice: ' + errMsg
        );
      }
    });
  };

  const stopSpeaking = () => {
    stopSpeech();
    setSpeakingCardId(null);
  };

  // ============================================================================
  // HERITAGE QUIZ HANDLERS (Requirement 5)
  // ============================================================================
  const currentQuizItem = HERITAGE_QUIZ_QUESTIONS[quizIndex];

  const handleSelectQuizOption = (optionIndex) => {
    if (quizHasAnswered) return;
    setSelectedQuizOption(optionIndex);
    setQuizHasAnswered(true);

    if (optionIndex === currentQuizItem.correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    stopSpeaking();
    if (quizIndex + 1 < HERITAGE_QUIZ_QUESTIONS.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
      setQuizHasAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    stopSpeaking();
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizHasAnswered(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // ============================================================================
  // HERITAGE CHATBOT HANDLERS (Requirement 5)
  // ============================================================================
  const handleSendChat = async (promptText) => {
    const question = (promptText || chatInput || '').trim();
    if (!question || isChatLoading) return;

    stopSpeaking();
    setChatInput('');

    const userMsg = {
      id: 'user_' + Date.now(),
      sender: 'user',
      textKn: question,
      textEn: question,
      timestamp: isKn ? 'ನೀವು ಕೇಳಿದ್ದು' : 'You asked'
    };

    setChatMessages((prev) => [...prev, userMsg]);
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
      console.warn('Backend /api/chat unavailable, using intelligent local knowledge base:', err);
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
      replyKn = 'ಜಗಜ್ಯೋತಿ ಬಸವಣ್ಣನವರ "ಕಾಯಕವೇ ಕೈಲಾಸ" ತತ್ತ್ವದ ಅರ್ಥ: ಯಾವುದೇ ಪ್ರಮಾಣಿಕ ದುಡಿಮೆಯು ದೇವರ ಪೂಜೆಗೆ ಸಮಾನವಾಗಿದೆ. ಕಾಯಕದಲ್ಲಿ ಜಾತಿ, ಲಿಂಗ ಅಥವಾ ಅಂತಸ್ತುಗಳ ಭೇದವಿರುವುದಿಲ್ಲ. ಎಲ್ಲರೂ ಸಮಾಜಕ್ಕೆ ಸ್ವಾವಲಂಬಿ ಕೊಡುಗೆ ನೀಡುವುದು ಅವರ ಮುಖ್ಯ ಸಂದೇಶವಾಗಿತ್ತು.';
      replyEn = 'Jagajjyothi Basavanna’s philosophy "Work is Worship" (Kayakave Kailasa) asserts that honest, dedicated labour itself is divine. Rejecting caste and social hierarchy, it teaches that every honest profession is sacred.';
    } else if (qLower.includes('ಮೈಸೂರು ಪಾಕ್') || qLower.includes('mysore pak')) {
      replyKn = 'ಮೈಸೂರು ಪಾಕ್ ಸಿಹಿಯು ೧೯೩೫ರಲ್ಲಿ ಮೈಸೂರು ಅರಮನೆಯ ರಾಜ ಅಡುಗೆಯವರಾದ ಕಾಕಾಸುರ ಮಾದಪ್ಪನವರಿಂದ ಸೃಷ್ಟಿಸಲ್ಪಟ್ಟಿತು. ಕಡಲೆಹಿಟ್ಟು, ಸಕ್ಕರೆ ಪಾಕ ಮತ್ತು ಶುದ್ಧ ತುಪ್ಪದಿಂದ ತಯಾರಿಸಿದ ಈ ಸಿಹಿಯನ್ನು ಮೆಚ್ಚಿದ ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ ಅವರು ಇದಕ್ಕೆ "ಮೈಸೂರು ಪಾಕ್" ಎಂದು ನಾಮಕರಣ ಮಾಡಿದರು.';
      replyEn = 'Mysore Pak was created in 1935 by the royal head-chef Kakasura Madappa in the kitchens of Mysore Palace. Maharaja Nalwadi Krishnaraja Wodeyar relished the melt-in-mouth sweet and named it "Mysore Pak".';
    } else if (qLower.includes('ಜ್ಞಾನಪೀಠ') || qLower.includes('jnanpith')) {
      replyKn = 'ಕನ್ನಡ ಭಾಷೆಯು ಭಾರತದಲ್ಲೇ ಎರಡನೇ ಅತಿ ಹೆಚ್ಚು ೮ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳನ್ನು ಮುಡಿಗೇರಿಸಿಕೊಂಡಿದೆ. ಪ್ರಶಸ್ತಿ ಪುರಸ್ಕೃತರು: ಕುವೆಂಪು (೧೯೬೭), ದ.ರಾ. ಬೇಂದ್ರೆ (೧೯೭೩), ಶಿವರಾಮ ಕಾರಂತ (೧೯೭೭), ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್ (೧೯೮೩), ವಿ.ಕೃ. ಗೋಕಾಕ (೧೯೯೦), ಯು.ಆರ್. ಅನಂತಮೂರ್ತಿ (೧೯೯೪), ಗಿರೀಶ್ ಕಾರ್ನಾಡ್ (೧೯೯೮), ಮತ್ತು ಚಂದ್ರಶೇಖರ ಕಂಬಾರ (೨೦೧೦).';
      replyEn = 'Kannada has won 8 prestigious Jnanpith Awards, the second highest for any Indian language: Kuvempu (1967), D. R. Bendre (1973), K. Shivaram Karanth (1977), Masti Venkatesha Iyengar (1983), V. K. Gokak (1990), U. R. Ananthamurthy (1994), Girish Karnad (1998), and Chandrashekhara Kambara (2010).';
    } else if (qLower.includes('ಯುನೆಸ್ಕೋ') || qLower.includes('unesco')) {
      replyKn = 'ಕರ್ನಾಟಕದಲ್ಲಿ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ಮಾನ್ಯತೆ ಪಡೆದ ತಾಣಗಳು: ಹಂಪಿಯ ಸ್ಮಾರಕಗಳ ಸಮೂಹ (೧೯೮೬), ಪಟ್ಟದಕಲ್ಲು ಸ್ಮಾರಕಗಳ ಸಮೂಹ (೧೯೮೭), ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಪರಿಸರ ತಾಣಗಳು (೨೦೧೨), ಮತ್ತು ಬೇಲೂರು, ಹಳೇಬೀಡು ಹಾಗೂ ಸೋಮನಾಥಪುರದ ಹೊಯ್ಸಳ ಪವಿತ್ರ ಮಂದಿರಗಳ ಸಮೂಹ (೨೦೨೩).';
      replyEn = 'UNESCO World Heritage properties in Karnataka include: Group of Monuments at Hampi (1986), Group of Monuments at Pattadakal (1987), Western Ghats natural reserves (2012), and the Sacred Ensembles of the Hoysalas at Belur, Halebidu, and Somanathapura (2023).';
    } else {
      replyKn = `ಕರ್ನಾಟಕದ ಪರಂಪರೆಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆ "${question}" ಅತ್ಯಂತ ಮಹತ್ವದ್ದು. ಕರ್ನಾಟಕದ ಭವ್ಯ ಇತಿಹಾಸ, ಹೊಯ್ಸಳ ಮತ್ತು ಚಾಲುಕ್ಯ ಶಿಲ್ಪಕಲೆ, ವಚನ ಸಾಹಿತ್ಯ, ರುಚಿಕರ ಆಹಾರ ಹಾಗೂ ಹಬ್ಬಗಳ ಬಗೆಗಿನ ವಿವರಗಳನ್ನು ನೀವು ಮೇಲಿನ ವಿಭಾಗಗಳ ಮೂಲಕವೂ ಆಲಿಸಬಹುದು ಮತ್ತು ಓದಬಹುದು.`;
      replyEn = `Your question about Karnataka’s heritage regarding "${question}" is significant. You can explore verified details, audio narrations, and architectural sources across all our 10 cultural categories above.`;
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

  return (
    <div className="heritage-page-container">
      {/* 1. Header with Breadcrumb & Back Button */}
      <div className="section-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          className="section-back-btn btn-back-home"
          onClick={onBackToHome}
          aria-label={isKn ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Home'}
        >
          <ArrowLeft size={16} />
          <span>{isKn ? 'ಮುಖಪುಟ' : 'Home'}</span>
        </button>

        <div className="section-badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} color="var(--color-flag-red)" />
          <span>{isKn ? 'ನಮ್ಮ ಕನ್ನಡ, ನಮ್ಮ ಸಂಸ್ಕೃತಿ' : 'Our Kannada, Our Culture'}</span>
        </div>
      </div>

      {/* 2. Hero Section */}
      <div className="heritage-hero-banner">
        <div className="heritage-hero-inner">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-flag-red)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <span>✦</span>
            <span>{isKn ? 'ಸಮಗ್ರ ಕರ್ನಾಟಕ ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ' : 'Complete Cultural Heritage of Karnataka'}</span>
          </div>

          <h1 className="heritage-hero-title kn-heading">
            {isKn ? 'ನಮ್ಮ ಕನ್ನಡ, ನಮ್ಮ ಸಂಸ್ಕೃತಿ' : 'Our Kannada, Our Culture'}
          </h1>
          <p className="heritage-hero-tagline">
            {isKn
              ? 'ಶ್ರೀಗಂಧದ ನಾಡು, ವೀರರ ನೆಲೆ, ಸಾಹಿತ್ಯದ ತವರು, ವಾಸ್ತುಶಿಲ್ಪದ ವೈಭವ'
              : 'Land of Sandalwood, Valour, Architecture, and Timeless Literature'}
          </p>

          {/* Search Bar Field (Requirement 6) */}
          <div className="heritage-search-bar-wrap">
            <div className="heritage-search-input-box">
              <Search size={20} className="heritage-search-icon" />
              <input
                type="text"
                className="heritage-search-input"
                placeholder={
                  isKn
                    ? 'ಕರ್ನಾಟಕದ ಬಗ್ಗೆ ಹುಡುಕಿ… (ಹಂಪಿ, ಮಸಾಲ ದೋಸೆ, ಯಕ್ಷಗಾನ, ಹಲ್ಮಿಡಿ, ಬಸವಣ್ಣ, ಕುವೆಂಪು, ನಾಡಗೀತೆ)'
                    : 'Search Karnataka (Hampi, Dosa, Yakshagana, Halmidi, Basavanna, Kuvempu, Anthem)...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={isKn ? 'ಕರ್ನಾಟಕದ ಬಗ್ಗೆ ಹುಡುಕಿ' : 'Search Karnataka'}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="heritage-search-clear"
                  onClick={() => setSearchQuery('')}
                  title={isKn ? 'ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ' : 'Clear search'}
                  aria-label={isKn ? 'ಹುಡುಕಾಟ ತೆರವುಗೊಳಿಸಿ' : 'Clear search'}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="search-results-count">
                <span>
                  {displayedItems.length} {isKn ? 'ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿವೆ' : 'results found for'} “{searchQuery}”
                </span>
              </div>
            )}
          </div>

          {/* Real-Time Live Date-Accurate Kannada Rajyotsava Celebration & Countdown Tracker */}
          <RajyotsavaLiveTracker langMode={langMode} />

          {/* Speech Audio Notice Banner if active or unsupported */}
          {speechNotice && (
            <div
              style={{
                marginTop: '1rem',
                background: '#FFFDF0',
                border: '1.5px solid var(--color-flag-yellow)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                fontSize: '0.86rem',
                color: '#854D0E',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Info size={16} />
              <span>{speechNotice}</span>
              <button
                type="button"
                onClick={() => setSpeechNotice(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', color: '#854D0E' }}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Category Navigation Tabs */}
      <div className="heritage-tabs-scroll-wrapper">
        <div className="heritage-tabs-row" role="tablist">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`heritage-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                  stopSpeaking();
                }}
              >
                <Icon size={16} />
                <span>{isKn ? tab.labelKn : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================================== */}
      {/* 4. MAIN CONTENT AREA */}
      {/* ====================================================================== */}
      <div className="heritage-content-grid-area">
        {/* ==================================================================== */}
        {/* A. 10 CATEGORIES LANDING GRID (Requirement 1) — Shown on 'all' tab    */}
        {/* ==================================================================== */}
        {activeTab === 'all' && !searchQuery && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="section-mini-head" style={{ marginBottom: '1.25rem' }}>
              <span className="mini-tag">ಸಾಂಸ್ಕೃತಿಕ ೯ ಪ್ರಮುಖ ವಿಭಾಗಗಳು</span>
              <h2 className="kn-heading" style={{ fontSize: '1.5rem', margin: '0.2rem 0 0 0' }}>
                {isKn ? 'ಕರ್ನಾಟಕದ ೯ ಸಾಂಸ್ಕೃತಿಕ ವಿಭಾಗಗಳು' : 'The 9 Cultural Categories of Karnataka'}
              </h2>
              <p className="kn-text" style={{ color: '#666666', fontSize: '0.92rem', margin: '0.35rem 0 0 0' }}>
                {isKn
                  ? 'ನಿಮ್ಮ ಆಸಕ್ತಿಯ ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಪ್ರತಿಯೊಂದು ವಿಭಾಗದ ಧ್ವನಿ ವಿವರಣೆ ಆಲಿಸಿ:'
                  : 'Select any cultural category below to explore verified stories, landmarks, and voice audio:'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.25rem' }}>
              {HERITAGE_CATEGORIES.map((cat, idx) => {
                const IconComponent = ICON_MAP[cat.icon] || Landmark;
                const isCurrentlySpeaking = speakingCardId === `cat_${cat.id}`;

                return (
                  <div
                    key={cat.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #E8E8E8',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    {/* Category Image */}
                    <div style={{ height: '150px', position: 'relative', overflow: 'hidden', background: '#F0F0F0' }}>
                      <img
                        src={cat.imageUrl}
                        alt={isKn ? cat.titleKn : cat.titleEn}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.parentElement.innerHTML = `
                            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #FDF4E3; color: #854D0E; font-size: 0.82rem; font-weight: 700; gap: 0.4rem;">
                              <span>🖼️ ${isKn ? 'ಚಿತ್ರ ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯ' : 'Image coming soon'}</span>
                            </div>
                          `;
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(0, 0, 0, 0.72)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          borderRadius: '9999px',
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <span style={{ color: 'var(--color-flag-yellow)' }}>#{idx + 1}</span>
                        <span>{cat.itemCount} {isKn ? 'ವಿಷಯಗಳು' : 'Topics'}</span>
                      </div>
                    </div>

                    {/* Category Body */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <div style={{ color: cat.color || 'var(--color-flag-red)' }}>
                            <IconComponent size={20} />
                          </div>
                          <h3 className="kn-heading" style={{ fontSize: '1.18rem', margin: 0, color: '#111111' }}>
                            {isKn ? cat.titleKn : cat.titleEn}
                          </h3>
                        </div>

                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#777777', marginBottom: '0.65rem' }}>
                          {isKn ? cat.titleEn : cat.titleKn}
                        </div>

                        {/* Short Description with Audio Speaker Button Beside It */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                          <p className="kn-text" style={{ fontSize: '0.86rem', color: '#444444', lineHeight: 1.55, margin: 0, flex: 1 }}>
                            {isKn ? cat.descKn : cat.descEn}
                          </p>
                          <button
                            type="button"
                            className="btn-audio-icon"
                            onClick={() =>
                              speakText(
                                `cat_${cat.id}`,
                                `${cat.titleKn}. ${cat.descKn}`,
                                `${cat.titleEn}. ${cat.descEn}`
                              )
                            }
                            title={isCurrentlySpeaking ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen aloud')}
                            aria-label={isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen aloud'}
                            style={{
                              background: isCurrentlySpeaking ? 'var(--color-flag-red)' : '#F5F5F5',
                              color: isCurrentlySpeaking ? '#FFFFFF' : '#333333',
                              flexShrink: 0
                            }}
                          >
                            {isCurrentlySpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* Explore Button */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setActiveTab(cat.id);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          padding: '0.55rem 1rem',
                          fontSize: '0.84rem',
                          fontWeight: 700
                        }}
                      >
                        <span>{isKn ? 'ಈ ವಿಭಾಗವನ್ನು ಅನ್ವೇಷಿಸಿ' : 'Explore Category'}</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* B. HISTORICAL PLACES & ARCHITECTURE                                  */}
        {/* ==================================================================== */}

        {/* ==================================================================== */}
        {/* C. CIVIC HERITAGE SECTION (ನಾಡಗೀತೆ, ಸಂವಿಧಾನ ಪೀಠಿಕೆ, ಗೀತೆಗಳು)         */}
        {/* ==================================================================== */}
        {activeTab === 'civic' && (
          <div className="civic-heritage-showcase">
            <div className="civic-banner-title">
              <div className="section-mini-head">
                <span className="mini-tag">ಪವಿತ್ರ ಪರಂಪರೆ & ಸಂವಿಧಾನ (Songs & Constitution)</span>
                <h2 className="kn-heading" style={{ fontSize: '1.45rem', margin: '0.2rem 0 0 0' }}>
                  {isKn ? 'ಕನ್ನಡ ನಾಡಗೀತೆ, ಸಂವಿಧಾನದ ಪೀಠಿಕೆ ಮತ್ತು ರಾಷ್ಟ್ರಗೀತೆ' : 'Karnataka State Anthem, Constitution Preamble & Anthems'}
                </h2>
              </div>
              <p className="kn-text" style={{ color: '#555555', marginTop: '0.4rem', fontSize: '0.92rem' }}>
                {isKn
                  ? 'ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ನಾಡಗೀತೆ, ಭಾರತದ ಸಂವಿಧಾನದ ಪವಿತ್ರ ಪೀಠಿಕೆಯ ಕನ್ನಡ ಅವತರಣಿಕೆ, ಭಾರತದ ರಾಷ್ಟ್ರಗೀತೆ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಗೀತೆಗಳ ಅಧಿಕೃತ ಹಾಗೂ ಕಾನೂನುಬದ್ಧ ವಿವರಗಳು.'
                  : 'Official, legal text and background of the Karnataka State Anthem, the Constitution of India Preamble in Kannada, India’s National Anthem, and National Song.'}
              </p>
            </div>

            <div className="civic-cards-grid">
              {/* Naada Geethe Card */}
              <div className="civic-card naada-geethe-card">
                <div className="civic-card-header">
                  <div className="civic-badge-karnataka">
                    {isKn ? 'ಕರ್ನಾಟಕದ ರಾಜ್ಯ ಗೀತೆ' : 'Karnataka State Anthem'}
                  </div>
                  <button
                    type="button"
                    className="btn-audio-listen"
                    onClick={() =>
                      speakText(
                        'naadageethe',
                        `${civicHeritageData.naadaGeethe.titleKn}. ${civicHeritageData.naadaGeethe.stanzas[0].lines.join(' ')}`,
                        `${civicHeritageData.naadaGeethe.titleKn}. State Anthem of Karnataka by Rashtrakavi Kuvempu.`
                      )
                    }
                    title={isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen to Anthem'}
                  >
                    <Volume2 size={16} />
                    <span>{isKn ? 'ಕೇಳಿ' : 'Listen'}</span>
                  </button>
                </div>

                <h3 className="kn-heading civic-card-title">
                  {civicHeritageData.naadaGeethe.titleKn}
                </h3>
                <div className="civic-card-author">
                  {civicHeritageData.naadaGeethe.poetKn}
                </div>
                <p className="civic-card-desc kn-text">
                  {civicHeritageData.naadaGeethe.descKn}
                </p>

                <div className="naada-geethe-stanzas-box">
                  {civicHeritageData.naadaGeethe.stanzas.map((st) => (
                    <div key={st.id} className="stanza-item">
                      <div className="stanza-lines kn-text">
                        {st.lines.map((line, idx) => (
                          <div key={idx} className="line-text">{line}</div>
                        ))}
                      </div>
                      <div className="stanza-meaning kn-text">
                        <strong>ಅರ್ಥ:</strong> {st.meaningKn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constitution Preamble in Kannada Card */}
              <div className="civic-card preamble-card">
                <div className="civic-card-header">
                  <div className="civic-badge-gold">
                    {isKn ? 'ಸಂವಿಧಾನದ ಪೀಠಿಕೆ (Preamble)' : 'Constitution Preamble in Kannada'}
                  </div>
                  <button
                    type="button"
                    className="btn-audio-listen"
                    onClick={() =>
                      speakText(
                        'preamble',
                        civicHeritageData.constitutionPreamble.officialPreambleKn,
                        'Preamble of the Constitution of India in Kannada: We the people of India...'
                      )
                    }
                    title={isKn ? 'ಪೀಠಿಕೆ ಆಲಿಸಿ' : 'Listen to Preamble'}
                  >
                    <Volume2 size={16} />
                    <span>{isKn ? 'ಕೇಳಿ' : 'Listen'}</span>
                  </button>
                </div>

                <h3 className="kn-heading civic-card-title">
                  {civicHeritageData.constitutionPreamble.titleKn}
                </h3>
                <div className="civic-card-author">
                  {civicHeritageData.constitutionPreamble.subtitleKn}
                </div>

                <div className="preamble-text-box kn-text">
                  <pre className="preamble-pre-text">
                    {civicHeritageData.constitutionPreamble.officialPreambleKn}
                  </pre>
                </div>

                <div className="preamble-pillars-section">
                  <h4 className="kn-heading" style={{ fontSize: '1rem', color: '#000000', marginBottom: '0.65rem' }}>
                    {isKn ? 'ಸಂವಿಧಾನದ ೫ ಮೂಲಸ್ಥಂಭಗಳ ಸರಳ ವಿವರಣೆ:' : '5 Core Pillars of the Constitution Explained:'}
                  </h4>
                  <div className="pillars-list">
                    {civicHeritageData.constitutionPreamble.pillars.map((pil, idx) => (
                      <div key={idx} className="pillar-item">
                        <CheckCircle2 size={15} color="var(--color-flag-red)" />
                        <div className="kn-text">
                          <strong>{pil.titleKn}:</strong> {pil.descKn}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* National Anthem & National Song Card */}
              <div className="civic-card dual-anthem-card">
                <div className="dual-anthem-col">
                  <div className="civic-badge-green">
                    {civicHeritageData.nationalAnthem.statusBadge}
                  </div>
                  <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: '0.6rem 0 0.2rem' }}>
                    {civicHeritageData.nationalAnthem.titleKn}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#666666', marginBottom: '0.5rem' }}>
                    {civicHeritageData.nationalAnthem.poetKn} • {civicHeritageData.nationalAnthem.durationKn}
                  </div>
                  <div className="anthem-lyrics-box kn-text">
                    {civicHeritageData.nationalAnthem.lines.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                  <div className="anthem-explanation kn-text">
                    {civicHeritageData.nationalAnthem.explanationKn}
                  </div>
                </div>

                <div className="dual-anthem-divider"></div>

                <div className="dual-anthem-col">
                  <div className="civic-badge-orange">
                    {civicHeritageData.nationalSong.statusBadge}
                  </div>
                  <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: '0.6rem 0 0.2rem' }}>
                    {civicHeritageData.nationalSong.titleKn}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#666666', marginBottom: '0.5rem' }}>
                    {civicHeritageData.nationalSong.poetKn}
                  </div>
                  <div className="anthem-lyrics-box kn-text">
                    {civicHeritageData.nationalSong.lines.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                  <div className="anthem-explanation kn-text">
                    {civicHeritageData.nationalSong.explanationKn}
                  </div>
                  <div className="difference-callout kn-text">
                    <Info size={14} color="var(--color-flag-red)" />
                    <span>{civicHeritageData.nationalSong.differenceNoteKn}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* D. HERITAGE QUIZ TAB (Requirement 5)                                 */}
        {/* ==================================================================== */}
        {activeTab === 'quiz' && (
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #EAEAEA',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              maxWidth: '820px',
              margin: '0 auto 3rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)'
            }}
          >
            {!quizCompleted ? (
              <div>
                {/* Quiz Header & Live Score/Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-flag-red)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    <HelpCircle size={15} />
                    <span>{isKn ? 'ಕರ್ನಾಟಕ ಪರಂಪರೆ ರಸಪ್ರಶ್ನೆ' : 'Karnataka Heritage Quiz'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                      {isKn ? `ಪ್ರಸ್ತುತ ಅಂಕ: ${quizScore}` : `Current Score: ${quizScore}`}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#666666' }}>
                      {isKn ? `ಪ್ರಶ್ನೆ ${quizIndex + 1} / ${HERITAGE_QUIZ_QUESTIONS.length}` : `Question ${quizIndex + 1} of ${HERITAGE_QUIZ_QUESTIONS.length}`}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#666666', marginBottom: '1rem' }}>
                  {isKn
                    ? 'ಕರ್ನಾಟಕದ ಇತಿಹಾಸ, ಹಬ್ಬಗಳು, ಜಾನಪದ ಕಲೆ, ಆಹಾರ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಯ ಜ್ಞಾನ ಪರೀಕ್ಷೆ:'
                    : 'Test your knowledge on Karnataka’s history, festivals, folk traditions, cuisine, and heritage:'}
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: '#F0F0F0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.75rem' }}>
                  <div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-flag-yellow) 0%, var(--color-flag-red) 100%)',
                      width: `${((quizIndex + 1) / HERITAGE_QUIZ_QUESTIONS.length) * 100}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>

                {/* Question Text with Audio Readout */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
                  <h3 className="kn-heading" style={{ fontSize: '1.35rem', margin: 0, color: '#111111', lineHeight: 1.45 }}>
                    {isKn ? currentQuizItem.qKn : currentQuizItem.qEn}
                  </h3>
                  <button
                    type="button"
                    className="btn-audio-icon"
                    onClick={() =>
                      speakText(
                        `quiz_${currentQuizItem.id}`,
                        currentQuizItem.qKn,
                        currentQuizItem.qEn
                      )
                    }
                    title={isKn ? 'ಪ್ರಶ್ನೆ ಆಲಿಸಿ' : 'Listen to question'}
                    aria-label={isKn ? 'ಪ್ರಶ್ನೆ ಆಲಿಸಿ' : 'Listen to question'}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                  {(isKn ? currentQuizItem.optionsKn : currentQuizItem.optionsEn).map((optionText, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isCorrect = idx === currentQuizItem.correct;

                    let bg = '#FAFAFA';
                    let border = '1.5px solid #E0E0E0';
                    let color = '#222222';

                    if (quizHasAnswered) {
                      if (isCorrect) {
                        bg = '#F0FDF4';
                        border = '2px solid #22C55E';
                        color = '#15803D';
                      } else if (isSelected) {
                        bg = '#FEF2F2';
                        border = '2px solid #EF4444';
                        color = '#B91C1C';
                      }
                    } else if (isSelected) {
                      bg = '#FFFDF0';
                      border = '2px solid var(--color-flag-yellow)';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectQuizOption(idx)}
                        disabled={quizHasAnswered}
                        style={{
                          background: bg,
                          border,
                          borderRadius: '14px',
                          padding: '1rem 1.25rem',
                          textAlign: 'left',
                          fontSize: '0.98rem',
                          fontWeight: 600,
                          color,
                          cursor: quizHasAnswered ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          fontFamily: 'var(--font-kannada)'
                        }}
                      >
                        <span>{optionText}</span>
                        {quizHasAnswered && isCorrect && <CheckCircle2 size={20} color="#22C55E" />}
                        {quizHasAnswered && isSelected && !isCorrect && <XCircle size={20} color="#EF4444" />}
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Explanation Feedback Box */}
                {quizHasAnswered && (
                  <div
                    style={{
                      background: selectedQuizOption === currentQuizItem.correct ? '#F0FDF4' : '#FFF7ED',
                      border: `1.5px solid ${selectedQuizOption === currentQuizItem.correct ? '#86EFAC' : '#FDBA74'}`,
                      borderRadius: '14px',
                      padding: '1.25rem',
                      marginBottom: '1.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.92rem', color: selectedQuizOption === currentQuizItem.correct ? '#166534' : '#9A3412' }}>
                        {selectedQuizOption === currentQuizItem.correct ? (
                          <>
                            <CheckCircle2 size={16} />
                            <span>{isKn ? 'ಸರಿಯಾದ ಉತ್ತರ!' : 'Correct Answer!'}</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} />
                            <span>{isKn ? 'ತಪ್ಪಾದ ಉತ್ತರ!' : 'Incorrect!'}</span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-audio-icon"
                        onClick={() =>
                          speakText(
                            `quiz_exp_${currentQuizItem.id}`,
                            currentQuizItem.explanationKn,
                            currentQuizItem.explanationEn
                          )
                        }
                        title={isKn ? 'ವಿವರಣೆ ಆಲಿಸಿ' : 'Listen to explanation'}
                        aria-label={isKn ? 'ವಿವರಣೆ ಆಲಿಸಿ' : 'Listen to explanation'}
                        style={{
                          width: '28px',
                          height: '28px',
                          background: speakingCardId === `quiz_exp_${currentQuizItem.id}` ? 'var(--color-flag-red)' : '#FFFFFF',
                          color: speakingCardId === `quiz_exp_${currentQuizItem.id}` ? '#FFFFFF' : '#444444',
                          border: '1px solid #D1D5DB'
                        }}
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                    <p className="kn-text" style={{ fontSize: '0.9rem', color: '#333333', lineHeight: 1.6, margin: 0 }}>
                      {isKn ? currentQuizItem.explanationKn : currentQuizItem.explanationEn}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                {quizHasAnswered && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextQuiz}
                      style={{ padding: '0.65rem 1.5rem', fontSize: '0.94rem' }}
                    >
                      <span>
                        {quizIndex + 1 < HERITAGE_QUIZ_QUESTIONS.length
                          ? (isKn ? 'ಮುಂದಿನ ಪ್ರಶ್ನೆ' : 'Next Question')
                          : (isKn ? 'ಫಲಿತಾಂಶ ನೋಡಿ' : 'View Results')}
                      </span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Completed Score Card */
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#FEF3C7', border: '2px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#B45309' }}>
                  <Award size={36} />
                </div>
                <h3 className="kn-heading" style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0', color: '#111111' }}>
                  {isKn ? 'ಅಭಿನಂದನೆಗಳು! ರಸಪ್ರಶ್ನೆ ಪೂರ್ಣಗೊಂಡಿದೆ!' : 'Congratulations! Quiz Completed!'}
                </h3>
                <p className="kn-text" style={{ fontSize: '1.05rem', color: '#555555', margin: '0 0 1.5rem 0' }}>
                  {isKn
                    ? `ನಿಮ್ಮ ಅಂಕಗಳು: ${HERITAGE_QUIZ_QUESTIONS.length} ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ${quizScore} ಸರಿ!`
                    : `Your Score: ${quizScore} out of ${HERITAGE_QUIZ_QUESTIONS.length} correct!`}
                </p>

                <div style={{ display: 'inline-flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleRestartQuiz}
                    style={{ padding: '0.65rem 1.5rem' }}
                  >
                    <RotateCcw size={16} />
                    <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಡಿ' : 'Restart Quiz'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('all')}
                    style={{ padding: '0.65rem 1.5rem' }}
                  >
                    <span>{isKn ? 'ಎಲ್ಲಾ ವಿಷಯಗಳು' : 'All Topics'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* E. HERITAGE CHATBOT TAB (Requirement 5)                              */}
        {/* ==================================================================== */}
        {activeTab === 'assistant' && (
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #EAEAEA',
              borderRadius: '24px',
              padding: '2rem 1.75rem',
              maxWidth: '860px',
              margin: '0 auto 3rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '560px'
            }}
          >
            {/* Chatbot Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1.5px solid #EEEEEE', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-flag-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0, color: '#111111' }}>
                    {isKn ? 'ಕನ್ನಡಸಾಥಿ ಪರಂಪರೆ ಸಹಾಯಕ' : 'KannadaSaathi Heritage Assistant'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', marginTop: '0.2rem' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: chatEngineMode === 'live-api' ? '#10B981' : '#F59E0B',
                        display: 'inline-block'
                      }}
                    />
                    <span style={{ color: chatEngineMode === 'live-api' ? '#059669' : '#B45309', fontWeight: 700 }}>
                      {chatEngineMode === 'live-api'
                        ? (isKn ? 'ಸಂಪರ್ಕಿತ • Google Gemini 1.5 Live' : 'Connected • Google Gemini 1.5 Live')
                        : (isKn ? 'ಮಾದರಿ ಆವೃತ್ತಿ • ಪರಿಶೀಲಿತ ಜ್ಞಾನ ಎಂಜಿನ್' : 'Demo Mode • Verified Heritage Knowledge Engine')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setChatMessages([
                    {
                      id: 'welcome_' + Date.now(),
                      sender: 'assistant',
                      textKn: 'ನಮಸ್ಕಾರ! ಕರ್ನಾಟಕದ ಯಾವುದೇ ಐತಿಹಾಸಿಕ ತಾಣ, ಆಹಾರ, ಹಬ್ಬ ಅಥವಾ ಸಾಹಿತ್ಯದ ಬಗ್ಗೆ ಕೇಳಿ.',
                      textEn: 'Namaskara! Ask me anything about Karnataka’s historical sites, cuisine, festivals, or literature.',
                      timestamp: 'ಈಗಷ್ಟೇ'
                    }
                  ])
                }
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
                title={isKn ? 'ಸಂಭಾಷಣೆ ತೆರವುಗೊಳಿಸಿ' : 'Clear Chat'}
              >
                <RotateCcw size={13} />
                <span>{isKn ? 'ತೆರವುಗೊಳಿಸಿ' : 'Clear'}</span>
              </button>
            </div>

            {/* Suggested Question Chips */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#666666', marginBottom: '0.5rem' }}>
                {isKn ? 'ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು (ಕ್ಲಿಕ್ ಮಾಡಿ):' : 'Suggested questions (click to ask):'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {HERITAGE_CHAT_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendChat(isKn ? sug.kn : sug.en)}
                    style={{
                      background: '#F8F8F8',
                      border: '1px solid #E0E0E0',
                      borderRadius: '9999px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#222222',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-kannada)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    💬 {isKn ? sug.kn : sug.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1.25rem', minHeight: '260px', maxHeight: '420px' }}>
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isCurrentlySpeaking = speakingCardId === `chat_${msg.id}`;

                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        background: isUser ? 'var(--color-flag-red)' : '#F5F5F5',
                        color: isUser ? '#FFFFFF' : '#111111',
                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding: '0.9rem 1.15rem',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        fontFamily: 'var(--font-kannada)'
                      }}
                    >
                      {isKn ? msg.textKn : msg.textEn}
                    </div>

                    {/* Bot Meta & Speaker Button */}
                    {!isUser && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn-audio-icon"
                          onClick={() =>
                            speakText(
                              `chat_${msg.id}`,
                              msg.textKn,
                              msg.textEn
                            )
                          }
                          title={isKn ? 'ಉತ್ತರ ಆಲಿಸಿ' : 'Listen to answer'}
                          aria-label={isKn ? 'ಉತ್ತರ ಆಲಿಸಿ' : 'Listen to answer'}
                          style={{
                            width: '26px',
                            height: '26px',
                            background: isCurrentlySpeaking ? 'var(--color-flag-red)' : '#EEEEEE',
                            color: isCurrentlySpeaking ? '#FFFFFF' : '#444444'
                          }}
                        >
                          {isCurrentlySpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>
                        <span style={{ fontSize: '0.7rem', color: '#777777', fontWeight: 600 }}>
                          {msg.source ? `ಮೂಲ: ${msg.source}` : msg.timestamp}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {isChatLoading && (
                <div style={{ alignSelf: 'flex-start', background: '#F5F5F5', borderRadius: '16px', padding: '0.75rem 1rem', fontSize: '0.84rem', color: '#666666', fontStyle: 'italic' }}>
                  {isKn ? 'ಉತ್ತರ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ…' : 'Generating response…'}
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              style={{ display: 'flex', gap: '0.65rem' }}
            >
              <input
                type="text"
                placeholder={isKn ? 'ಕರ್ನಾಟಕದ ಪರಂಪರೆಯ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ…' : 'Ask a question about Karnataka’s heritage…'}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  background: '#F9F9F9',
                  border: '1.5px solid #E0E0E0',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-kannada)',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!chatInput.trim() || isChatLoading}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '12px' }}
              >
                <Send size={16} />
                <span>{isKn ? 'ಕೇಳಿ' : 'Ask'}</span>
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* F. GENERAL CATEGORY ITEMS GRID & SEARCH RESULTS                      */}
        {/* ==================================================================== */}
        {activeTab !== 'quiz' && activeTab !== 'assistant' && (
          <div className="heritage-items-grid-section">
            <div className="section-mini-head">
              <span className="mini-tag">ಕರ್ನಾಟಕದ ವೈಭವ • {displayedItems.length} ವಿಷಯಗಳು</span>
              <h2 className="kn-heading" style={{ fontSize: '1.45rem', margin: 0 }}>
                {searchQuery
                  ? (isKn ? `“${searchQuery}” ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು` : `Search results for “${searchQuery}”`)
                  : (navTabs.find((t) => t.id === activeTab)?.[isKn ? 'labelKn' : 'labelEn'] || (isKn ? 'ವಿಷಯಗಳು' : 'Topics'))}
              </h2>
            </div>

            <div className="heritage-cards-grid">
              {displayedItems.map((item) => {
                const isCurrentlySpeaking = speakingCardId === `item_${item.id}`;

                return (
                  <div key={item.id} className="heritage-showcase-card reveal-on-scroll">
                    {/* Item Image with Fallback */}
                    <div className="heritage-card-thumb-wrap">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={isKn ? item.titleKn : item.titleEn}
                          className="heritage-card-thumb"
                          loading="lazy"
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            if (img.naturalHeight > img.naturalWidth * 1.1) {
                              img.classList.add('is-portrait');
                            }
                          }}
                          onError={(e) => {
                            e.currentTarget.parentElement.innerHTML = `
                              <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #FFFDF0; color: #854D0E; font-size: 0.8rem; font-weight: 700; gap: 0.3rem;">
                                <span>🖼️ ${isKn ? 'ಚಿತ್ರ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ' : 'Verified Heritage Reference'}</span>
                                <span style="font-size: 0.7rem; color: #A16207;">${item.titleEn}</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFDF0', color: '#854D0E', padding: '1rem', textAlign: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '1.75rem' }}>🪔</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400E' }}>
                            {isKn ? 'ಐತಿಹಾಸಿಕ ಭಾವಚಿತ್ರ ಲಭ್ಯವಿಲ್ಲ' : 'Historical Portrait Not Available'}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#B45309' }}>
                            {isKn ? '೧೨ನೇ ಶತಮಾನದ ಐತಿಹಾಸಿಕ ದಾಖಲೆ' : '12th Century Epigraphical Record'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Category & Location Badges */}
                    <div className="card-top-category-row">
                      <span
                        className="category-badge-chip"
                        style={{ borderLeft: `4px solid ${item.categoryColor || 'var(--color-flag-red)'}` }}
                      >
                        {isKn ? item.categoryNameKn : item.categoryNameEn}
                      </span>
                      {item.location && (
                        <span className="location-pill">
                          <MapPin size={12} />
                          <span>{item.location}</span>
                        </span>
                      )}
                      {item.region && (
                        <span className="location-pill">
                          <MapPin size={12} />
                          <span>{item.region}</span>
                        </span>
                      )}
                      {item.linkStatus === 'needs_verification' && (
                        <span
                          className="badge-needs-verification"
                          title={item.verificationNotice || (isKn ? 'ಲಿಂಕ್ ಪರಿಶೀಲಿಸಬೇಕು' : 'Link needs verification')}
                        >
                          <AlertCircle size={11} />
                          <span>{isKn ? 'ಲಿಂಕ್ ಪರಿಶೀಲಿಸಬೇಕು' : 'Link needs verification'}</span>
                        </span>
                      )}
                    </div>

                    {/* Titles */}
                    <h3 className="heritage-card-title kn-heading">
                      {isKn ? (item.titleKn || item.nameKn) : (item.titleEn || item.nameEn)}
                    </h3>
                    {(item.subtitleKn || item.subtitleEn) && (
                      <div className="heritage-card-subtitle">
                        {isKn ? (item.subtitleKn || item.subtitleEn) : (item.subtitleEn || item.subtitleKn)}
                      </div>
                    )}

                    {/* Short Description with Speaker Audio Button Beside It */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginBottom: '0.85rem' }}>
                      <p className="heritage-card-desc kn-text" style={{ flex: 1, margin: 0 }}>
                        {isKn ? item.descKn : item.descEn}
                      </p>
                      <button
                        type="button"
                        className="btn-audio-icon"
                        onClick={() =>
                          speakText(
                            `item_${item.id}`,
                            `${item.titleKn || item.nameKn}. ${item.descKn}`,
                            `${item.titleEn || item.nameEn}. ${item.descEn}`
                          )
                        }
                        title={isCurrentlySpeaking ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen in audio')}
                        aria-label={isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen in audio'}
                        style={{
                          background: isCurrentlySpeaking ? 'var(--color-flag-red)' : '#F5F5F5',
                          color: isCurrentlySpeaking ? '#FFFFFF' : '#444444',
                          flexShrink: 0
                        }}
                      >
                        {isCurrentlySpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                    </div>

                    {/* Highlights mini chips */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="heritage-highlights-chips">
                        {item.highlights.slice(0, 3).map((hl, i) => (
                          <span key={i} className="highlight-mini-chip">
                            ✦ {hl}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Vachana Excerpt for Sharanas */}
                    {item.vachanaExcerptKn && (
                      <div
                        style={{
                          background: '#FFFDF0',
                          borderLeft: '3px solid var(--color-flag-yellow)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontStyle: 'italic',
                          color: '#555555',
                          marginBottom: '0.85rem'
                        }}
                      >
                        “{isKn ? item.vachanaExcerptKn : (item.vachanaExcerptEn || item.vachanaExcerptKn)}”
                      </div>
                    )}

                    {/* Actions: View Details (ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ) & Learn More (ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ) */}
                    <div className="heritage-card-actions">
                      <div className="heritage-card-actions-left">
                        {item.sourceUrl && item.linkStatus !== 'needs_verification' ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-view-details"
                            title={isKn ? 'ಗೂಗಲ್ ಶೇರ್‌ನಲ್ಲಿ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View Details on Google Share'}
                          >
                            <ExternalLink size={13} />
                            <span>{isKn ? 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View Details'}</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="btn-view-details"
                            onClick={() => setSelectedItem(item)}
                            style={{ background: '#D97706' }}
                            title={item.verificationNotice || (isKn ? 'ಲಿಂಕ್ ಪರಿಶೀಲಿಸಬೇಕು' : 'Link needs verification')}
                          >
                            <AlertCircle size={13} />
                            <span>{isKn ? 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View Details'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn-learn-more-kn"
                          onClick={() => setSelectedItem(item)}
                        >
                          <span>{isKn ? 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ' : 'Learn More'}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {displayedItems.length === 0 && (
              <div className="empty-search-state">
                <p className="kn-text" style={{ fontSize: '1rem', color: '#444444', margin: 0 }}>
                  {isKn
                    ? `“${searchQuery}” ಗೆ ಸಂಬಂಧಿಸಿದ ವಿಷಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಪದವನ್ನು ಹುಡುಕಿ ನೋಡಿ.`
                    : `No results found for “${searchQuery}”. Please try a different search keyword.`}
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  {isKn ? 'ಎಲ್ಲಾ ವಿಷಯಗಳನ್ನು ತೋರಿಸಿ' : 'Show All Topics'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================== */}
      {/* 5. ITEM DETAIL MODAL (Requirements 6 & 7)                              */}
      {/* ====================================================================== */}
      {selectedItem && (
        <div className="heritage-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div
            className="heritage-modal-card zoom-transition-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="modal-header-row">
              <span className="modal-category-tag">
                {isKn ? selectedItem.categoryNameKn : (selectedItem.categoryNameEn || selectedItem.categoryNameKn)}
              </span>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedItem(null)}
                aria-label={isKn ? 'ಮುಚ್ಚಿರಿ' : 'Close'}
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="kn-heading modal-item-title">
              {isKn ? (selectedItem.titleKn || selectedItem.nameKn) : (selectedItem.titleEn || selectedItem.nameEn)}
            </h2>
            <div className="modal-item-subtitle">
              {isKn ? (selectedItem.subtitleKn || selectedItem.subtitleEn) : (selectedItem.subtitleEn || selectedItem.subtitleKn)}
            </div>

            {/* Banner Image */}
            {selectedItem.imageUrl && (
              <div className="modal-banner-image-wrap">
                <img
                  src={selectedItem.imageUrl}
                  alt={isKn ? (selectedItem.titleKn || selectedItem.nameKn) : (selectedItem.titleEn || selectedItem.nameEn)}
                  className="modal-banner-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.parentElement.innerHTML = `
                      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #FDF4E3; color: #854D0E; font-size: 0.88rem; font-weight: 700; gap: 0.4rem;">
                        <span>🖼️ ${isKn ? 'ಚಿತ್ರ ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯ' : 'Image coming soon'}</span>
                        <span style="font-size: 0.74rem; color: #A16207;">${selectedItem.titleEn}</span>
                      </div>
                    `;
                  }}
                />
              </div>
            )}

            {/* Modal Body */}
            <div className="modal-body-content">
              {/* Verification Alert if link needs verification */}
              {selectedItem.linkStatus === 'needs_verification' && (
                <div
                  style={{
                    background: '#FFFBEB',
                    border: '1.5px solid #FCD34D',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    marginBottom: '1.25rem',
                    color: '#92400E'
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', marginBottom: '0.2rem' }}>
                      {isKn ? 'ಲಿಂಕ್ ಪರಿಶೀಲಿಸಬೇಕು (Link Needs Verification)' : 'Link Needs Verification'}
                    </div>
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {selectedItem.verificationNotice || (isKn ? 'ಮೂಲ ಲಿಂಕ್ ಪರಿಶೀಲನೆಯ ಹಂತದಲ್ಲಿದೆ.' : 'Source link is under verification.')}
                    </div>
                  </div>
                </div>
              )}

              {/* Secondary Reference Link (e.g. Basavanna 2nd URL) */}
              {selectedItem.secondaryUrl && (
                <div
                  style={{
                    background: '#F0FDF4',
                    border: '1.5px solid #BBF7D0',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    marginBottom: '1.25rem',
                    color: '#166534'
                  }}
                >
                  <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', marginBottom: '0.2rem' }}>
                      {isKn ? 'ಪರಿಶೀಲನೆಗಾಗಿ ಹೆಚ್ಚುವರಿ ಉಲ್ಲೇಖ (Secondary Reference):' : 'Secondary Reference for Verification:'}
                    </div>
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      <a
                        href={selectedItem.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#15803D', fontWeight: 700, wordBreak: 'break-all', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <span>{selectedItem.secondaryUrl}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <p className="kn-text modal-full-desc">
                {isKn ? selectedItem.descKn : selectedItem.descEn}
              </p>

              {/* Vachana or Inscription special block */}
              {selectedItem.vachanaExcerptKn && (
                <div
                  style={{
                    background: '#FFFDF0',
                    border: '1.5px solid var(--color-flag-yellow)',
                    borderRadius: '14px',
                    padding: '1.15rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#B45309', marginBottom: '0.35rem' }}>
                    {isKn ? 'ವಚನ ಸಾಹಿತ್ಯ (ಅಂಕಿತನಾಮ: ' + (selectedItem.ankitaKn || '') + ')' : 'Vachana (Ankita: ' + (selectedItem.ankitaEn || '') + ')'}
                  </div>
                  <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: '0.94rem', color: '#111111', lineHeight: 1.65 }}>
                    “{isKn ? selectedItem.vachanaExcerptKn : (selectedItem.vachanaExcerptEn || selectedItem.vachanaExcerptKn)}”
                  </blockquote>
                </div>
              )}

              {/* Halmidi or Inscription Full Excerpt */}
              {selectedItem.fullInscriptionExcerptKn && (
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '14px',
                    padding: '1.15rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '0.45rem' }}>
                    {isKn ? 'ಶಾಸನದ ಅಧಿಕೃತ ವಾಕ್ಯಗಳು (ಕನ್ನಡ ಲಿಪಿ):' : 'Official Inscription Excerpt:'}
                  </div>
                  <pre
                    style={{
                      fontFamily: 'var(--font-kannada)',
                      fontSize: '0.88rem',
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                      color: '#0F172A',
                      margin: 0
                    }}
                  >
                    {selectedItem.fullInscriptionExcerptKn}
                  </pre>
                </div>
              )}

              {/* Highlights */}
              {selectedItem.highlights && selectedItem.highlights.length > 0 && (
                <div className="modal-highlights-box">
                  <h4 className="kn-heading" style={{ fontSize: '0.98rem', marginBottom: '0.5rem' }}>
                    {isKn ? 'ವಿಶೇಷತೆಗಳು ಮತ್ತು ಮುಖ್ಯ ಅಂಶಗಳು:' : 'Key Highlights & Historical Significance:'}
                  </h4>
                  <ul className="modal-highlights-list">
                    {selectedItem.highlights.map((h, i) => (
                      <li key={i} className="kn-text">
                        <CheckCircle2 size={14} color="var(--color-flag-red)" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meta details */}
              {selectedItem.location && (
                <div className="modal-meta-row kn-text">
                  <strong>{isKn ? 'ಸ್ಥಳ:' : 'Location:'}</strong> {selectedItem.location}
                </div>
              )}
              {selectedItem.period && (
                <div className="modal-meta-row kn-text">
                  <strong>{isKn ? 'ಕಾಲಘಟ್ಟ / ರಾಜವಂಶ:' : 'Period / Dynasty:'}</strong> {selectedItem.period} • {selectedItem.dynasty}
                </div>
              )}
              {selectedItem.awardYear && (
                <div className="modal-meta-row kn-text">
                  <strong>{isKn ? 'ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ವರ್ಷ:' : 'Jnanpith Award Year:'}</strong> {selectedItem.awardYear}
                </div>
              )}
              {selectedItem.sourceUrl && (
                <div className="modal-meta-row kn-text" style={{ marginTop: '0.75rem' }}>
                  <strong>{isKn ? 'ಅಧಿಕೃತ ಪರಂಪರೆ ಮೂಲ:' : 'Reliable Heritage Source:'}</strong>{' '}
                  <a
                    href={selectedItem.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-flag-red)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>{selectedItem.sourceName || 'ಅಧಿಕೃತ ಮೂಲ'}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer with View Details & Voice Audio Button */}
            <div className="modal-footer-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                {selectedItem.sourceUrl && selectedItem.linkStatus !== 'needs_verification' && (
                  <a
                    href={selectedItem.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.55rem 1.15rem',
                      fontSize: '0.88rem'
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>{isKn ? 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View Details'}</span>
                  </a>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    speakText(
                      `modal_${selectedItem.id}`,
                      `${selectedItem.titleKn || selectedItem.nameKn}. ${selectedItem.descKn}`,
                      `${selectedItem.titleEn || selectedItem.nameEn}. ${selectedItem.descEn}`
                    )
                  }
                >
                  <Volume2 size={16} />
                  <span>
                    {speakingCardId === `modal_${selectedItem.id}`
                      ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop Audio')
                      : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen to Audio')}
                  </span>
                </button>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedItem(null)}
              >
                {isKn ? 'ಮುಚ್ಚಿರಿ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}