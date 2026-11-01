import React, { useState } from 'react';
import SectionHeader from '../layout/SectionHeader';
import { playSpeech, stopSpeech } from '../../utils/kannadaSpeech';
import {
  BookOpen,
  Volume2,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Star,
  RotateCcw,
  Share2,
  ArrowLeft,
  Check
} from 'lucide-react';

export default function StoriesSection({ onBackToHome, langMode }) {
  const isKn = langMode === 'kn';

  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const handleShareStory = async () => {
    const shareData = {
      title: isKn ? currentStory.titleKn : currentStory.titleEn,
      text: isKn
        ? `ಕನ್ನಡಸಾಥಿಯಲ್ಲಿ "${currentStory.titleKn}" ಕಥೆಯನ್ನು ಓದಿ ಮತ್ತು ಆಲಿಸಿ!`
        : `Read and listen to "${currentStory.titleEn}" on KannadaSaathi!`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      } catch (e) {}
    }
  };

  const stories = [
    {
      id: 'story1',
      titleKn: 'ಜಾಣ ಕಾಗೆಯ ಕಥೆ',
      titleEn: 'The Clever Crow',
      themeKn: 'ಬುದ್ಧಿವಂತಿಕೆ ಮತ್ತು ಪರಿಶ್ರಮ',
      themeEn: 'Wisdom & Resourcefulness',
      moralKn: 'ಕಷ್ಟದ ಸಂದರ್ಭದಲ್ಲಿ ಬುದ್ಧಿ ಮತ್ತು ತಾಳ್ಮೆಯಿಂದ ಉಪಾಯ ಹುಡುಕಿದರೆ ಯಶಸ್ಸು ಖಚಿತ.',
      moralEn: 'Where there is a will, there is a way through patience and wisdom.',
      lines: [
        {
          kn: 'ಒಂದು ಬೇಸಿಗೆಯ ಬಿಸಿಲಿನ ದಿನ, ಬಾಯಾರಿದ ಕಾಗೆಯೊಂದು ನೀರಿಗಾಗಿ ಎಲ್ಲೆಡೆ ಹುಡುಕುತ್ತಿತ್ತು.',
          translit: 'Ondu besigeya bisilina dina, baayarida kaageyondu neerigaagi ellede hudukutthittu.',
          en: 'On a hot summer day, a thirsty crow was searching everywhere for water.'
        },
        {
          kn: 'ಕೊನೆಗೆ ಅದಕ್ಕೆ ತೋಟವೊಂದರಲ್ಲಿ ಒಂದು ಹೂಜಿ ಕಂಡಿತು. ಆದರೆ ಹೂಜಿಯ ಕೆಳಭಾಗದಲ್ಲಿ ಮಾತ್ರ ಸ್ವಲ್ಪ ನೀರಿತ್ತು.',
          translit: 'Konege adakke thotavondaralli ondu hooji kandithu. Aadare hoojiya kelabhaagadalli maathra swalpa neerittu.',
          en: 'Finally, it saw a pitcher in a garden. But there was only a little water at the very bottom.'
        },
        {
          kn: 'ಕಾಗೆಯ ಕೊಕ್ಕು ನೀರಿಗೆ ತಲುಪಲಿಲ್ಲ. ಆಗ ಕಾಗೆಗೆ ಒಂದು ಜಾಣ ಉಪಾಯ ಹೊಳೆಯಿತು.',
          translit: 'Kaageya kokku neerige thalupalilla. Aaga kaagege ondu jaana upaaya holeyithu.',
          en: 'The crow\'s beak could not reach the water. Then a clever idea struck the crow.'
        },
        {
          kn: 'ಅದು ಸುತ್ತಲೂ ಬಿದ್ದಿದ್ದ ಸಣ್ಣ ಸಣ್ಣ ಕಲ್ಲುಗಳನ್ನು ಒಂದೊಂದಾಗಿ ತಂದು ಹೂಜಿಯೊಳಗೆ ಹಾಕಿತು.',
          translit: 'Adu sutthalu biddidda sanna sanna kallugalannu ondondaagi thandu hoojiyolage haakithu.',
          en: 'It brought small pebbles lying around one by one and dropped them into the pitcher.'
        },
        {
          kn: 'ನೀರಿನ ಮಟ್ಟ ನಿಧಾನವಾಗಿ ಮೇಲಕ್ಕೆ ಬಂದಿತು. ಕಾಗೆ ತೃಪ್ತಿಯಿಂದ ನೀರು ಕುಡಿದು ಸಂತೋಷದಿಂದ ಹಾರಿಹೋಯಿತು.',
          translit: 'Neerina matta nidhaanavaagi melakke bandithu. Kaage thrupthiyinda neeru kudidu santhoshadinda haarihoyithu.',
          en: 'The water level rose gradually. The crow drank water to its satisfaction and flew away happily.'
        }
      ],
      vocab: [
        { kn: 'ಬಾಯಾರಿಕೆ', en: 'Thirst' },
        { kn: 'ಹೂಜಿ', en: 'Pitcher / Pot' },
        { kn: 'ಕೊಕ್ಕು', en: 'Beak' },
        { kn: 'ಉಪಾಯ', en: 'Clever Idea' },
        { kn: 'ತೃಪ್ತಿ', en: 'Satisfaction' }
      ],
      quiz: [
        {
          qKn: 'ಕಾಗೆ ನೀರಿಗಾಗಿ ಹುಡುಕುತ್ತಿದ್ದ ಕಾಲ ಯಾವುದು?',
          qEn: 'In what season was the crow searching for water?',
          options: isKn ? ['ಮಳೆಗಾಲ', 'ಬೇಸಿಗೆ ಕಾಲ', 'ಚಳಿಗಾಲ'] : ['Monsoon', 'Summer season', 'Winter'],
          correct: 1,
          explanationKn: 'ಬೇಸಿಗೆಯ ಬಿಸಿಲಿನ ದಿನದಲ್ಲಿ ಕಾಗೆ ಬಾಯಾರಿಕೆಯಿಂದ ನೀರು ಹುಡುಕುತ್ತಿತ್ತು.',
          explanationEn: 'The crow searched for water on a hot summer day.'
        },
        {
          qKn: 'ನೀರಿನ ಮಟ್ಟ ಮೇಲೆ ಬರಲು ಕಾಗೆ ಏನು ಮಾಡಿತು?',
          qEn: 'What did the crow do to raise the water level?',
          options: isKn ? ['ಹೂಜಿಯನ್ನು ಮುರಿಯಿತು', 'ಸಣ್ಣ ಕಲ್ಲುಗಳನ್ನು ಹಾಕಿತು', 'ಬೇರೆ ಕಾಗೆಗಳನ್ನು ಕರೆದಿತು'] : ['Broke the pitcher', 'Dropped small stones', 'Called other crows'],
          correct: 1,
          explanationKn: 'ಸಣ್ಣ ಕಲ್ಲುಗಳನ್ನು ಹೂಜಿಯಲ್ಲಿ ಹಾಕಿದಾಗ ನೀರಿನ ಮಟ್ಟ ಮೇಲಕ್ಕೆ ಬಂದಿತು.',
          explanationEn: 'Dropping pebbles into the pitcher displaced the water upwards.'
        }
      ]
    },
    {
      id: 'story2',
      titleKn: 'ಪುಣ್ಯಕೋಟಿ ಮತ್ತು ಹುಲಿ',
      titleEn: 'Punyakoti and the Tiger',
      themeKn: 'ಸತ್ಯ ಮತ್ತು ಪ್ರಾಮಾಣಿಕತೆ',
      themeEn: 'Truthfulness & Keeping Promises',
      moralKn: 'ಸತ್ಯವೇ ಭಗವಂತ. ಕೊಟ್ಟ ಮಾತನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವುದು ಎಲ್ಲಕ್ಕಿಂತ ಶ್ರೇಷ್ಠ ಗುಣ.',
      moralEn: 'Truthfulness and honouring one’s word melt hostility and win universal respect.',
      lines: [
        {
          kn: 'ಕರ್ನಾಟಕದ ಪ್ರಸಿದ್ಧ ಜನಪದ ಕಥೆಯ ಪ್ರಕಾರ, ಪುಣ್ಯಕೋಟಿ ಎಂಬ ಸತ್ಯವಂತ ಹಸುವೊಂದು ಹಸಿರು ಹುಲ್ಲುಗಾವಲಿನಲ್ಲಿ ಮೇಯುತ್ತಿತ್ತು.',
          translit: 'Karnatakada prasiddha janapada katheya prakaara, Punyakoti emba sathyavanta hasuvondu hasiru hullugaavalalli meyutthittu.',
          en: 'According to famous Karnataka folklore, a truthful cow named Punyakoti was grazing in a lush green pasture.'
        },
        {
          kn: 'ಅರ್ಬುದ ಎಂಬ ಹಸಿದ ಹುಲಿಯೊಂದು ಪುಣ್ಯಕೋಟಿಯನ್ನು ಬೇಟೆಯಾಡಲು ಮುಂದಾಯಿತು.',
          translit: 'Arbuda emba hasida huliyondu Punyakotiyannu beteyaadalu mundaayithu.',
          en: 'A hungry tiger named Arbuda stepped forward to hunt Punyakoti.'
        },
        {
          kn: 'ಪುಣ್ಯಕೋಟಿಯು, "ನನ್ನ ಕರುವಿಗೆ ಹಾಲುಣಿಸಿ ಮರಳಿ ಬರುತ್ತೇನೆ, ಆಣೆಗೂ ತಪ್ಪುವುದಿಲ್ಲ" ಎಂದು ಬೇಡಿಕೊಂಡಿತು.',
          translit: 'Punyakotiyu, "Nanna karuvige haalunisi marali baruttheene, aanegoo thappuvudilla" endu bedikondithu.',
          en: 'Punyakoti pleaded, "I will feed my little calf and return, I will not break my promise."'
        },
        {
          kn: 'ಕರುವಿಗೆ ಪ್ರೀತಿಯಿಂದ ಹಾಲುಣಿಸಿ, ಆಶೀರ್ವದಿಸಿ ಕೊಟ್ಟ ಮಾತಿನಂತೆ ಹುಲಿಯ ಬಳಿಗೆ ವಾಪಸ್ ಬಂದಿತು.',
          translit: 'Karuvige preethiyinda haalunisi, aasheervadisi kotta maathinanthe huliya balige vaapas bandithu.',
          en: 'After feeding and blessing the calf, it returned truthfully to the tiger.'
        },
        {
          kn: 'ಹಸುವಿನ ಸತ್ಯನಿಷ್ಠೆಯನ್ನು ಕಂಡು ಹುಲಿಯ ಹೃದಯ ಕರಗಿತು ಮತ್ತು ಅದಕ್ಕೆ ಕೈಮುಗಿದು ಕಾಡಿಗೆ ಮರಳಿತು.',
          translit: 'Hasuvina sathyanishteyannu kandu huliya hrudaya karagithu matthu adakke kaimugidu kaadige maralithu.',
          en: 'Beholding the cow’s utmost truthfulness, the tiger’s heart softened; it bowed and returned peacefully to the forest.'
        }
      ],
      vocab: [
        { kn: 'ಪುಣ್ಯಕೋಟಿ', en: 'Truthful Cow' },
        { kn: 'ಕರು', en: 'Little Calf' },
        { kn: 'ಸತ್ಯನಿಷ್ಠೆ', en: 'Steadfast Truthfulness' },
        { kn: 'ಹುಲ್ಲುಗಾವಲು', en: 'Green Pasture' }
      ],
      quiz: [
        {
          qKn: 'ಪುಣ್ಯಕೋಟಿ ಹುಲಿಗೆ ಏನು ಭರವಸೆ ನೀಡಿತು?',
          qEn: 'What promise did Punyakoti give to the tiger?',
          options: isKn ? ['ಕರುವಿಗೆ ಹಾಲುಣಿಸಿ ಮರಳಿ ಬರುವುದಾಗಿ', 'ಓಡಿ ಹೋಗುವುದಾಗಿ', 'ಬೇರೆ ಹಸುವನ್ನು ಕಳುಹಿಸುವುದಾಗಿ'] : ['To nurse calf and return', 'To run away', 'To send another cow'],
          correct: 0,
          explanationKn: 'ಪುಣ್ಯಕೋಟಿಯು ಕರುವಿಗೆ ಹಾಲುಣಿಸಿ ಮರಳಿ ಬರುವುದಾಗಿ ಸತ್ಯವಚನ ನೀಡಿತು.',
          explanationEn: 'Punyakoti promised to return after feeding her calf.'
        },
        {
          qKn: 'ಹುಲಿಯ ಹೆಸರೇನು?',
          qEn: 'What was the tiger’s name in the folk ballad?',
          options: isKn ? ['ಅರ್ಬುದ', 'ವೀರ', 'ಶೇರ್'] : ['Arbuda', 'Veera', 'Sher'],
          correct: 0,
          explanationKn: 'ಜನಪದ ಗೀತೆಯಲ್ಲಿ ಹುಲಿಯ ಹೆಸರು ಅರ್ಬುದ.',
          explanationEn: 'In the folklore song, the tiger is named Arbuda.'
        }
      ]
    },
    {
      id: 'story3',
      titleKn: 'ತೆನಾಲಿ ರಾಮ ಮತ್ತು ಕಳ್ಳರು',
      titleEn: 'Tenali Rama and the Thieves',
      themeKn: 'ಸಮಯಪ್ರಜ್ಞೆ ಮತ್ತು ಹಾಸ್ಯ',
      themeEn: 'Wit, Humor & Quick Thinking',
      moralKn: 'ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಅಪಾಯವನ್ನು ಉಪಕಾರವನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿಕೊಳ್ಳಬಹುದು.',
      moralEn: 'Presence of mind can turn a threat into an advantage.',
      lines: [
        {
          kn: 'ವಿಜಯನಗರದ ರಾಜ ಆಸ್ಥಾನದ ವಿದೂಷಕ ತೆನಾಲಿ ರಾಮನ ತೋಟದ ಸುತ್ತಲೂ ಒಂದು ರಾತ್ರಿ ಕಳ್ಳರು ನುಸುಳಿದರು.',
          translit: 'Vijayanagarada raaja aasthaanada vidooshaka Tenali Raamana thotada sutthalu ondu raathri kallaru nusulidaru.',
          en: 'One night, thieves lurked around the garden of Vijayanagara royal court wit Tenali Rama.'
        },
        {
          kn: 'ಕಳ್ಳರ ಇರುವಿಕೆಯನ್ನು ಅರಿತ ರಾಮನು ತನ್ನ ಪತ್ನಿಗೆ ಜೋರಾಗಿ ಹೇಳಿದನು: "ಚಿನ್ನಾಭರಣಗಳನ್ನು ಪೆಟ್ಟಿಗೆಯಲ್ಲಿಟ್ಟು ಬಾವಿಗೆ ಎಸೆಯೋಣ."',
          translit: 'Kallara iruvikeyannu aritha Raamanu thanna patnige joraagi helidanu: "Chinnaabharanagalannu pettigeyallittu baavige eseyona."',
          en: 'Noticing the thieves, Rama loudly told his wife: "Let us put our valuables into a trunk and hide it in the well."'
        },
        {
          kn: 'ರಾಮನು ಆಭರಣಗಳ ಬದಲು ದೊಡ್ಡ ಕಲ್ಲುಗಳಿದ್ದ ಭಾರವಾದ ಪೆಟ್ಟಿಗೆಯನ್ನು ಬಾವಿಗೆ ಎಸೆದನು.',
          translit: 'Raamanu aabharanagala badalu dodda kallugalidda bhaaravaada pettigeyannu baavige esedanu.',
          en: 'Instead of jewels, Rama dropped a heavy trunk filled with large stones into the well.'
        },
        {
          kn: 'ಕಳ್ಳರು ಪೆಟ್ಟಿಗೆ ತೆಗೆಯಲು ರಾತ್ರಿಯಿಡೀ ಬಾವಿಯಿಂದ ನೀರು ಸೇದಿ ತೋಟಕ್ಕೆ ಹರಿಸಿದರು.',
          translit: 'Kallaru pettige tegeyalu raatriyidi baaviyinda neeru sedi thotakke harisidaru.',
          en: 'The thieves spent the entire night drawing water from the well to get the trunk, irrigating the whole garden.'
        },
        {
          kn: 'ಬೆಳಗಾದಾಗ ರಾಮನು ಬಂದು: "ನನ್ನ ತೋಟಕ್ಕೆ ಉಚಿತವಾಗಿ ನೀರುಣಿಸಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು" ಎಂದು ನಗುತ್ತಾ ಕಳ್ಳರನ್ನು ಪೊಲೀಸರಿಗೆ ಒಪ್ಪಿಸಿದನು.',
          translit: 'Belagaadaaga Raamanu bandu: "Nanna thotakke uchithavaagi neerunisiddakke dhanyavaadagalu" endu nagutthaa kallarannu policerige oppisidanu.',
          en: 'In the morning Rama emerged smiling: "Thank you for watering my garden for free!" and handed them over to the guards.'
        }
      ],
      vocab: [
        { kn: 'ವಿದೂಷಕ', en: 'Court Wit / Humorist' },
        { kn: 'ಕಳ್ಳರು', en: 'Thieves' },
        { kn: 'ಬಾವಿ', en: 'Well' },
        { kn: 'ತೋಟ', en: 'Garden' }
      ],
      quiz: [
        {
          qKn: 'ರಾಮನು ಬಾವಿಗೆ ಎಸೆದ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ ಏನಿತ್ತು?',
          qEn: 'What was inside the trunk that Tenali Rama threw into the well?',
          options: isKn ? ['ಚಿನ್ನಾಭರಣ', 'ದೊಡ್ಡ ಕಲ್ಲುಗಳು', 'ಹಣ್ಣುಗಳು'] : ['Gold jewelry', 'Heavy stones', 'Fruits'],
          correct: 1,
          explanationKn: 'ರಾಮನು ಕಳ್ಳರನ್ನು ವಂಚಿಸಲು ಕಲ್ಲುಗಳನ್ನು ತುಂಬಿದ ಪೆಟ್ಟಿಗೆಯನ್ನು ಎಸೆದನು.',
          explanationEn: 'Rama placed heavy stones inside to fool the thieves into draining the well.'
        }
      ]
    }
  ];

  const currentStory = stories[selectedStoryIndex];

  const playSentenceAudio = (text, idx) => {
    if (!text) return;
    if (activeSentenceIdx === idx) {
      stopSpeech();
      setActiveSentenceIdx(null);
      return;
    }
    setActiveSentenceIdx(idx);
    setIsPlayingAll(false);
    playSpeech({
      text,
      lang: 'kn',
      id: `story-line-${idx}`,
      onStart: () => setActiveSentenceIdx(idx),
      onEnd: () => setActiveSentenceIdx(null),
      onError: () => setActiveSentenceIdx(null)
    });
  };

  const handlePlayFullStory = () => {
    if (isPlayingAll) {
      stopSpeech();
      setIsPlayingAll(false);
      setActiveSentenceIdx(null);
      return;
    }

    const fullText = currentStory.lines.map(l => l.kn).join(' ');
    if (!fullText) return;

    setIsPlayingAll(true);
    setActiveSentenceIdx(null);
    playSpeech({
      text: fullText,
      lang: 'kn',
      id: `story-full-${selectedStoryIndex}`,
      onStart: () => setIsPlayingAll(true),
      onEnd: () => {
        setIsPlayingAll(false);
        setActiveSentenceIdx(null);
      },
      onError: () => {
        setIsPlayingAll(false);
        setActiveSentenceIdx(null);
      }
    });
  };

  const handleSelectQuiz = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ಭಾಗ ೬ • ಕಥಾ ಸೌರಭ"
        badgeEn="PART 6 • Voice of Kannada Stories"
        titleKn="ಕನ್ನಡ ಕಥಾ ಲೋಕ — ಸಚಿತ್ರ ಕಥೆಗಳು"
        titleEn="Voice of Kannada Stories"
        taglineKn="ಜಾಣ ಕಾಗೆ, ಪುಣ್ಯಕೋಟಿ ಮತ್ತು ತೆನಾಲಿ ರಾಮನ ನೈಜ ನೀತಿ ಕಥೆಗಳು — ಸಾಲು ಸಾಲಾಗಿ ಓದಿ ಆಲಿಸಿ"
        taglineEn="Folktales and fables with sentence-by-sentence reading, pronunciation, vocabulary, and quizzes"
        icon={BookOpen}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      <div className="section-body">
        {/* Story Shared Navigation Header (Requirement 6) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBackToHome}
            style={{
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              background: '#FFFFFF',
              border: '1.5px solid var(--color-cream-border)',
              color: 'var(--color-flag-red)'
            }}
          >
            <ArrowLeft size={16} />
            <span>{isKn ? 'ಮುಖಪುಟಕ್ಕೆ' : 'Back to Home'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {shareToast && (
              <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Check size={14} /> {isKn ? 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!' : 'Link copied!'}
              </span>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleShareStory}
              style={{
                borderRadius: '9999px',
                padding: '0.45rem 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.84rem',
                fontWeight: 700,
                background: '#FFFFFF'
              }}
              title={isKn ? 'ಕಥೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ' : 'Share this story'}
            >
              <Share2 size={15} />
              <span>{isKn ? 'ಹಂಚಿಕೊಳ್ಳಿ' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Story Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {stories.map((st, idx) => (
            <button
              key={st.id}
              type="button"
              className={`filter-chip ${selectedStoryIndex === idx ? 'active' : ''}`}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              onClick={() => {
                setSelectedStoryIndex(idx);
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsPlayingAll(false);
                setActiveSentenceIdx(null);
                handleResetQuiz();
              }}
            >
              📖 {isKn ? st.titleKn : st.titleEn}
            </button>
          ))}
        </div>

        {/* Active Story Workspace */}
        <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Story Title & Full Read Aloud Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #EEE', marginBottom: '1.25rem' }}>
            <div>
              <h2 className="kn-heading" style={{ fontSize: '1.35rem', color: 'var(--color-flag-red)', margin: 0 }}>
                {isKn ? currentStory.titleKn : currentStory.titleEn}
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                💡 {isKn ? `ಧ್ಯೇಯ: ${currentStory.themeKn}` : `Theme: ${currentStory.themeEn}`}
              </div>
            </div>

            <button
              type="button"
              className={`btn ${isPlayingAll ? 'btn-secondary' : 'btn-primary'}`}
              style={{ padding: '0.55rem 1.25rem', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              onClick={handlePlayFullStory}
            >
              {isPlayingAll ? <Pause size={16} /> : <Play size={16} />}
              <span>
                {isPlayingAll
                  ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Pause Story')
                  : (isKn ? 'ಸಂಪೂರ್ಣ ಕಥೆ ಆಲಿಸಿ' : 'Listen Full Story')}
              </span>
            </button>
          </div>

          {/* Sentence-by-Sentence Reader */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {currentStory.lines.map((line, idx) => {
              const isActive = activeSentenceIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: isActive ? 'var(--color-flag-yellow-soft)' : '#FFFDF7',
                    border: `1.5px solid ${isActive ? 'var(--color-flag-yellow)' : 'var(--color-cream-border)'}`,
                    borderRadius: '12px',
                    padding: '1rem 1.15rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: 'var(--color-flag-red-soft)',
                        color: 'var(--color-flag-red)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginTop: '0.2rem'
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <div className="kn-heading" style={{ fontSize: '1.08rem', color: '#111', lineHeight: 1.6, fontWeight: 700 }}>
                        {line.kn}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#777', fontStyle: 'italic', marginTop: '0.3rem' }}>
                        🔊 {line.translit}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: '#444', marginTop: '0.25rem' }}>
                        {line.en}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={() => playSentenceAudio(line.kn, idx)}
                    title={isKn ? "ಈ ಸಾಲನ್ನು ಆಲಿಸಿ" : "Listen to this sentence"}
                  >
                    <Volume2 size={14} />
                    <span>{isKn ? 'ಆಲಿಸಿ' : 'Listen'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Moral Box */}
          <div
            style={{
              background: '#FFFDF0',
              border: '2px dashed var(--color-flag-yellow)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-flag-red)', textTransform: 'uppercase' }}>
              🌟 {isKn ? 'ಕಥೆಯ ನೀತಿ:' : 'Moral of the Story:'}
            </div>
            <div className="kn-heading" style={{ fontSize: '1.05rem', color: '#111', fontWeight: 700, marginTop: '0.35rem' }}>
              {isKn ? currentStory.moralKn : currentStory.moralEn}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
              {isKn ? currentStory.moralEn : currentStory.moralKn}
            </div>
          </div>

          {/* Vocabulary Bank */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 className="kn-heading" style={{ fontSize: '1rem', color: '#111', marginBottom: '0.65rem' }}>
              📚 {isKn ? 'ಕಥೆಯಲ್ಲಿನ ಪ್ರಮುಖ ಶಬ್ದಕೋಶ:' : 'Key Vocabulary from this Story:'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
              {currentStory.vocab.map((v, vIdx) => (
                <div
                  key={vIdx}
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid var(--color-cream-border)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div className="kn-heading" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-flag-red)' }}>
                      {v.kn}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#555' }}>
                      {v.en}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => playSentenceAudio(v.kn, null)}
                    style={{ padding: '0.25rem', background: '#F5F5F5', borderRadius: '50%' }}
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Comprehension Quiz */}
          {currentStory.quiz && currentStory.quiz.length > 0 && (
            <div style={{ borderTop: '1px solid #EEE', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 className="kn-heading" style={{ fontSize: '1.05rem', color: '#111', margin: 0 }}>
                  🧠 {isKn ? 'ಕಥಾ ಗ್ರಹಿಕೆ ಪ್ರಶ್ನೋತ್ತರ:' : 'Story Comprehension Quiz:'}
                </h4>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                  onClick={handleResetQuiz}
                >
                  <RotateCcw size={12} />
                  <span>{isKn ? 'ಮರುಪ್ರಶ್ನೆ' : 'Reset'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentStory.quiz.map((q, qIdx) => {
                  const userChoice = quizAnswers[qIdx];
                  return (
                    <div
                      key={qIdx}
                      style={{
                        background: '#FFFDF7',
                        border: '1px solid var(--color-cream-border)',
                        borderRadius: '10px',
                        padding: '1rem'
                      }}
                    >
                      <div className="kn-heading" style={{ fontSize: '0.98rem', fontWeight: 700, color: '#111', marginBottom: '0.65rem' }}>
                        {qIdx + 1}. {isKn ? q.qKn : q.qEn}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        {q.options.map((opt, optIdx) => {
                          const isChosen = userChoice === optIdx;
                          let bg = '#FFFFFF';
                          let border = '1px solid #CCC';
                          let color = '#222';

                          if (quizSubmitted) {
                            if (optIdx === q.correct) {
                              bg = '#D4EFDF';
                              border = '2px solid #27AE60';
                              color = '#196F3D';
                            } else if (isChosen) {
                              bg = '#FADBD8';
                              border = '2px solid #E74C3C';
                              color = '#922B21';
                            }
                          } else if (isChosen) {
                            bg = 'var(--color-flag-red)';
                            border = '2px solid var(--color-flag-red)';
                            color = '#FFF';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              style={{
                                background: bg,
                                border,
                                color,
                                padding: '0.55rem 0.85rem',
                                borderRadius: '8px',
                                textAlign: 'left',
                                cursor: quizSubmitted ? 'default' : 'pointer',
                                fontSize: '0.88rem',
                                fontWeight: 600
                              }}
                              onClick={() => !quizSubmitted && handleSelectQuiz(qIdx, optIdx)}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            background: userChoice === q.correct ? '#E8F8F5' : '#FDF2E9',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            color: userChoice === q.correct ? '#196F3D' : '#A04000'
                          }}
                        >
                          💡 <strong>{isKn ? 'ವಿವರಣೆ:' : 'Explanation:'}</strong>{' '}
                          {isKn ? q.explanationKn : q.explanationEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.4rem' }}
                  onClick={handleSubmitQuiz}
                  disabled={quizSubmitted || Object.keys(quizAnswers).length < currentStory.quiz.length}
                >
                  <CheckCircle2 size={16} />
                  <span>{isKn ? 'ಉತ್ತರ ಪರಿಶೀಲಿಸಿ' : 'Submit Quiz'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
