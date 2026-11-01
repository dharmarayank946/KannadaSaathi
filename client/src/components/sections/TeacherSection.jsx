import React, { useState, useEffect } from 'react';
import SectionHeader from '../layout/SectionHeader';
import { useKannadaSpeech } from '../../utils/kannadaSpeech';
import {
  GraduationCap,
  Clock,
  BookOpen,
  Volume2,
  Square,
  Mic,
  CheckCircle2,
  ChevronRight,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Check,
  Grid,
  FileText
} from 'lucide-react';

const KANNADA_SWARAS = [
  { char: 'ಅ', pron: 'A', nameEn: 'Short A', egKn: 'ಅರಸ', egPron: 'Arasa', egEn: 'King' },
  { char: 'ಆ', pron: 'Aa', nameEn: 'Long Aa', egKn: 'ಆನೆ', egPron: 'Aane', egEn: 'Elephant' },
  { char: 'ಇ', pron: 'I', nameEn: 'Short I', egKn: 'ಇಲಿ', egPron: 'Ili', egEn: 'Rat' },
  { char: 'ಈ', pron: 'Ee', nameEn: 'Long Ee', egKn: 'ಈಜು', egPron: 'Eeju', egEn: 'Swimming' },
  { char: 'ಉ', pron: 'U', nameEn: 'Short U', egKn: 'ಉಡುಪು', egPron: 'Udupu', egEn: 'Dress' },
  { char: 'ಊ', pron: 'Oo', nameEn: 'Long Oo', egKn: 'ಊಟ', egPron: 'Oota', egEn: 'Meal / Food' },
  { char: 'ಋ', pron: 'Ru', nameEn: 'Vocalic Ru', egKn: 'ಋಷಿ', egPron: 'Rushi', egEn: 'Sage' },
  { char: 'ಎ', pron: 'E', nameEn: 'Short E', egKn: 'ಎಲೆ', egPron: 'Ele', egEn: 'Leaf' },
  { char: 'ಏ', pron: 'Ae', nameEn: 'Long Ae', egKn: 'ಏಣಿ', egPron: 'Eani', egEn: 'Ladder' },
  { char: 'ಐ', pron: 'Ai', nameEn: 'Diphthong Ai', egKn: 'ಐದು', egPron: 'Aidu', egEn: 'Five' },
  { char: 'ಒ', pron: 'O', nameEn: 'Short O', egKn: 'ಒಂಟೆ', egPron: 'Onte', egEn: 'Camel' },
  { char: 'ಓ', pron: 'Oa', nameEn: 'Long Oa', egKn: 'ಓಟ', egPron: 'Oata', egEn: 'Running / Race' },
  { char: 'ಔ', pron: 'Au', nameEn: 'Diphthong Au', egKn: 'ಔಷಧ', egPron: 'Oushadha', egEn: 'Medicine' },
  { char: 'ಅಂ', pron: 'Am', nameEn: 'Anusvara Am', egKn: 'ಅಂಗಡಿ', egPron: 'Angadi', egEn: 'Shop' },
  { char: 'ಅಃ', pron: 'Aha', nameEn: 'Visarga Aha', egKn: 'ಅಃ', egPron: 'Aha', egEn: 'Visarga' }
];

const KANNADA_VYANJANAS = [
  // Ka-varga
  { char: 'ಕ', pron: 'Ka', group: 'ಕ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ಕಮಲ', egPron: 'Kamala', egEn: 'Lotus' },
  { char: 'ಖ', pron: 'Kha', group: 'ಕ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಖಡ್ಗ', egPron: 'Khadga', egEn: 'Sword' },
  { char: 'ಗ', pron: 'Ga', group: 'ಕ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ಗಣಪತಿ', egPron: 'Ganapati', egEn: 'Ganesha' },
  { char: 'ಘ', pron: 'Gha', group: 'ಕ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಘಂಟೆ', egPron: 'Ghante', egEn: 'Bell' },
  { char: 'ಙ', pron: 'Nga', group: 'ಕ-ವರ್ಗ (ಅನುನಾಸಿಕ)', egKn: 'ವಾಙ್ಮಯ', egPron: 'Vaangmaya', egEn: 'Literature' },
  // Cha-varga
  { char: 'ಚ', pron: 'Cha', group: 'ಚ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ಚಮಚ', egPron: 'Chamacha', egEn: 'Spoon' },
  { char: 'ಛ', pron: 'Chha', group: 'ಚ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಛತ್ರಿ', egPron: 'Chhatri', egEn: 'Umbrella' },
  { char: 'ಜ', pron: 'Ja', group: 'ಚ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ಜಲ', egPron: 'Jala', egEn: 'Water' },
  { char: 'ಝ', pron: 'Jha', group: 'ಚ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಝರಿ', egPron: 'Jhari', egEn: 'Waterfall' },
  { char: 'ಞ', pron: 'Nya', group: 'ಚ-ವರ್ಗ (ಅನುನಾಸಿಕ)', egKn: 'ಜ್ಞಾನ', egPron: 'Jnaana', egEn: 'Knowledge' },
  // Ta-varga
  { char: 'ಟ', pron: 'Ta', group: 'ಟ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ಟೊಮೆಟೊ', egPron: 'Tomato', egEn: 'Tomato' },
  { char: 'ಠ', pron: 'Tha', group: 'ಟ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಠಸ್ಸೆ', egPron: 'Thasse', egEn: 'Seal / Stamp' },
  { char: 'ಡ', pron: 'Da', group: 'ಟ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ಡಮರು', egPron: 'Damaru', egEn: 'Small Drum' },
  { char: 'ಢ', pron: 'Dha', group: 'ಟ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಢಕ್ಕೆ', egPron: 'Dhakke', egEn: 'War Drum' },
  { char: 'ಣ', pron: 'Na', group: 'ಟ-ವರ್ಗ (ಅನುನಾಸಿಕ)', egKn: 'ಬಾಣ', egPron: 'Baana', egEn: 'Arrow' },
  // Tha-varga
  { char: 'ತ', pron: 'Tha', group: 'ತ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ತಾಯಿ', egPron: 'Thaayi', egEn: 'Mother' },
  { char: 'ಥ', pron: 'Thha', group: 'ತ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ರಥ', egPron: 'Ratha', egEn: 'Chariot' },
  { char: 'ದ', pron: 'Da', group: 'ತ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ದೀಪ', egPron: 'Deepa', egEn: 'Lamp' },
  { char: 'ಧ', pron: 'Dha', group: 'ತ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಧನುಸ್ಸು', egPron: 'Dhanussu', egEn: 'Bow' },
  { char: 'ನ', pron: 'Na', group: 'ತ-ವರ್ಗ (ಅನುನಾಸಿಕ)', egKn: 'ನವಿಲು', egPron: 'Navilu', egEn: 'Peacock' },
  // Pa-varga
  { char: 'ಪ', pron: 'Pa', group: 'ಪ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ಪಾರಿವಾಳ', egPron: 'Paarivaala', egEn: 'Pigeon' },
  { char: 'ಫ', pron: 'Pha', group: 'ಪ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಫಲ', egPron: 'Phala', egEn: 'Fruit' },
  { char: 'ಬ', pron: 'Ba', group: 'ಪ-ವರ್ಗ (ಅಲ್ಪಪ್ರಾಣ)', egKn: 'ಬೆಕ್ಕು', egPron: 'Bekku', egEn: 'Cat' },
  { char: 'ಭ', pron: 'Bha', group: 'ಪ-ವರ್ಗ (ಮಹಾಪ್ರಾಣ)', egKn: 'ಭಾರತ', egPron: 'Bhaaratha', egEn: 'India' },
  { char: 'ಮ', pron: 'Ma', group: 'ಪ-ವರ್ಗ (ಅನುನಾಸಿಕ)', egKn: 'ಮರ', egPron: 'Mara', egEn: 'Tree' },
  // Avargiya Vyanjanas
  { char: 'ಯ', pron: 'Ya', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ', egKn: 'ಯಜ್ಞ', egPron: 'Yajna', egEn: 'Sacred fire' },
  { char: 'ರ', pron: 'Ra', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ', egKn: 'ರೈಲು', egPron: 'Railu', egEn: 'Train' },
  { char: 'ಲ', pron: 'La', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ', egKn: 'ಲಡ್ಡು', egPron: 'Laddu', egEn: 'Sweet Laddu' },
  { char: 'ವ', pron: 'Va', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ', egKn: 'ವಿಮಾನ', egPron: 'Vimaana', egEn: 'Aeroplane' },
  { char: 'ಶ', pron: 'Sha', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ (ತಾಲು)', egKn: 'ಶಂಖ', egPron: 'Shankha', egEn: 'Conch' },
  { char: 'ಷ', pron: 'Sha', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ (ಮೂರ್ಧ)', egKn: 'ಷಣ್ಮುಖ', egPron: 'Shanmukha', egEn: 'Six-faced' },
  { char: 'ಸ', pron: 'Sa', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ (ದಂತ)', egKn: 'ಸೂರ್ಯ', egPron: 'Soorya', egEn: 'Sun' },
  { char: 'ಹ', pron: 'Ha', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ (ಕಂಠ)', egKn: 'ಹಸು', egPron: 'Hasu', egEn: 'Cow' },
  { char: 'ಳ', pron: 'La', group: 'ಅವರ್ಗೀಯ ವ್ಯಂಜನ (ಮೂರ್ಧ)', egKn: 'ಬಾಳೆ', egPron: 'Baale', egEn: 'Banana' }
];

const KAGUNITHA_BASES = ['ಕ', 'ಗ', 'ಚ', 'ಜ', 'ತ', 'ದ', 'ನ', 'ಪ', 'ಬ', 'ಮ', 'ರ', 'ಲ', 'ಸ', 'ಹ'];

const KAGUNITHA_MAP = {
  'ಕ': { base: 'k', forms: ['ಕ', 'ಕಾ', 'ಕಿ', 'ಕೀ', 'ಕು', 'ಕೂ', 'ಕೃ', 'ಕೆ', 'ಕೇ', 'ಕೈ', 'ಕೊ', 'ಕೋ', 'ಕೌ', 'ಕಂ', 'ಕಃ'], prons: ['ka', 'kaa', 'ki', 'kee', 'ku', 'koo', 'kru', 'ke', 'kay', 'kai', 'ko', 'koa', 'kau', 'kam', 'kah'] },
  'ಗ': { base: 'g', forms: ['ಗ', 'ಗಾ', 'ಗಿ', 'ಗೀ', 'ಗು', 'ಗೂ', 'ಗೃ', 'ಗೆ', 'ಗೇ', 'ಗೈ', 'ಗೊ', 'ಗೋ', 'ಗೌ', 'ಗಂ', 'ಗಃ'], prons: ['ga', 'gaa', 'gi', 'gee', 'gu', 'goo', 'gru', 'ge', 'gay', 'gai', 'go', 'goa', 'gau', 'gam', 'gah'] },
  'ಚ': { base: 'ch', forms: ['ಚ', 'ಚಾ', 'ಚಿ', 'ಚೀ', 'ಚು', 'ಚೂ', 'ಚೃ', 'ಚೆ', 'ಚೇ', 'ಚೈ', 'ಚೊ', 'ಚೋ', 'ಚೌ', 'ಚಂ', 'ಚಃ'], prons: ['cha', 'chaa', 'chi', 'chee', 'chu', 'choo', 'chru', 'che', 'chay', 'chai', 'cho', 'choa', 'chau', 'cham', 'chah'] },
  'ಜ': { base: 'j', forms: ['ಜ', 'ಜಾ', 'ಜಿ', 'ಜೀ', 'ಜು', 'ಜೂ', 'ಜೃ', 'ಜೆ', 'ಜೇ', 'ಜೈ', 'ಜೊ', 'ಜೋ', 'ಜೌ', 'ಜಂ', 'ಜಃ'], prons: ['ja', 'jaa', 'ji', 'jee', 'ju', 'joo', 'jru', 'je', 'jay', 'jai', 'jo', 'joa', 'jau', 'jam', 'jah'] },
  'ತ': { base: 'th', forms: ['ತ', 'ತಾ', 'ತಿ', 'ತೀ', 'ತು', 'ತೂ', 'ತೃ', 'ತೆ', 'ತೇ', 'ತೈ', 'ತೊ', 'ತೋ', 'ತೌ', 'ತಂ', 'ತಃ'], prons: ['tha', 'thaa', 'thi', 'thee', 'thu', 'thoo', 'thru', 'the', 'thay', 'thai', 'tho', 'thoa', 'thau', 'tham', 'thah'] },
  'ದ': { base: 'd', forms: ['ದ', 'ದಾ', 'ದಿ', 'ದೀ', 'ದು', 'ದೂ', 'ದೃ', 'ದೆ', 'ದೇ', 'ದೈ', 'ದೊ', 'ದೋ', 'ದೌ', 'ದಂ', 'ದಃ'], prons: ['da', 'daa', 'di', 'dee', 'du', 'doo', 'dru', 'de', 'day', 'dai', 'do', 'doa', 'dau', 'dam', 'dah'] },
  'ನ': { base: 'n', forms: ['ನ', 'ನಾ', 'ನಿ', 'ನೀ', 'ನು', 'ನೂ', 'ನೃ', 'ನೆ', 'ನೇ', 'ನೈ', 'ನೊ', 'ನೋ', 'ನೌ', 'ನಂ', 'ನಃ'], prons: ['na', 'naa', 'ni', 'nee', 'nu', 'noo', 'nru', 'ne', 'nay', 'nai', 'no', 'noa', 'nau', 'nam', 'nah'] },
  'ಪ': { base: 'p', forms: ['ಪ', 'ಪಾ', 'ಪಿ', 'ಪೀ', 'ಪು', 'ಪೂ', 'ಪೃ', 'ಪೆ', 'ಪೇ', 'ಪೈ', 'ಪೊ', 'ಪೋ', 'ಪೌ', 'ಪಂ', 'ಪಃ'], prons: ['pa', 'paa', 'pi', 'pee', 'pu', 'poo', 'pru', 'pe', 'pay', 'pai', 'po', 'poa', 'pau', 'pam', 'pah'] },
  'ಬ': { base: 'b', forms: ['ಬ', 'ಬಾ', 'ಬಿ', 'ಬೀ', 'ಬು', 'ಬೂ', 'ಬೃ', 'ಬೆ', 'ಬೇ', 'ಬೈ', 'ಬೊ', 'ಬೋ', 'ಬೌ', 'ಬಂ', 'ಬಃ'], prons: ['ba', 'baa', 'bi', 'bee', 'bu', 'boo', 'bru', 'be', 'bay', 'bai', 'bo', 'boa', 'bau', 'bam', 'bah'] },
  'ಮ': { base: 'm', forms: ['ಮ', 'ಮಾ', 'ಮಿ', 'ಮೀ', 'ಮು', 'ಮೂ', 'ಮೃ', 'ಮೆ', 'ಮೇ', 'ಮೈ', 'ಮೊ', 'ಮೋ', 'ಮೌ', 'ಮಂ', 'ಮಃ'], prons: ['ma', 'maa', 'mi', 'mee', 'mu', 'moo', 'mru', 'me', 'may', 'mai', 'mo', 'moa', 'mau', 'mam', 'mah'] },
  'ರ': { base: 'r', forms: ['ರ', 'ರಾ', 'ರಿ', 'ರೀ', 'ರು', 'ರೂ', 'ರೃ', 'ರೆ', 'ರೇ', 'ರೈ', 'ರೊ', 'ರೋ', 'ರೌ', 'ರಂ', 'ರಃ'], prons: ['ra', 'raa', 'ri', 'ree', 'ru', 'roo', 'rru', 're', 'ray', 'rai', 'ro', 'roa', 'rau', 'ram', 'rah'] },
  'ಲ': { base: 'l', forms: ['ಲ', 'ಲಾ', 'ಲಿ', 'ಲೀ', 'ಲು', 'ಲೂ', 'ಲೃ', 'ಲೆ', 'ಲೇ', 'ಲೈ', 'ಲೊ', 'ಲೋ', 'ಲೌ', 'ಲಂ', 'ಲಃ'], prons: ['la', 'laa', 'li', 'lee', 'lu', 'loo', 'lru', 'le', 'lay', 'lai', 'lo', 'loa', 'lau', 'lam', 'lah'] },
  'ಸ': { base: 's', forms: ['ಸ', 'ಸಾ', 'ಸಿ', 'ಸೀ', 'ಸು', 'ಸೂ', 'ಸೃ', 'ಸೆ', 'ಸೇ', 'ಸೈ', 'ಸೊ', 'ಸೋ', 'ಸೌ', 'ಸಂ', 'ಸಃ'], prons: ['sa', 'saa', 'si', 'see', 'su', 'soo', 'sru', 'se', 'say', 'sai', 'so', 'soa', 'sau', 'sam', 'sah'] },
  'ಹ': { base: 'h', forms: ['ಹ', 'ಹಾ', 'ಹಿ', 'ಹೀ', 'ಹು', 'ಹೂ', 'ಹೃ', 'ಹೆ', 'ಹೇ', 'ಹೈ', 'ಹೊ', 'ಹೋ', 'ಹೌ', 'ಹಂ', 'ಹಃ'], prons: ['ha', 'haa', 'hi', 'hee', 'hu', 'hoo', 'hru', 'he', 'hay', 'hai', 'ho', 'hoa', 'hau', 'ham', 'hah'] }
};

const KID_PICTURE_WORDS = [
  { kn: 'ಸೂರ್ಯ', en: 'Sun', emoji: '☀️', pron: 'Soorya', eg: 'ಸೂರ್ಯ ಬೆಳಿಗ್ಗೆ ಪ್ರಕಾಶಮಾನವಾಗಿ ಉದಯಿಸುತ್ತಾನೆ.' },
  { kn: 'ಚಂದ್ರ', en: 'Moon', emoji: '🌙', pron: 'Chandra', eg: 'ರಾತ್ರಿ ಆಕಾಶದಲ್ಲಿ ಚಂದ್ರ ಬೆಳ್ಳಗೆ ಹೊಳೆಯುತ್ತಾನೆ.' },
  { kn: 'ಹೂವು', en: 'Flower', emoji: '🌸', pron: 'Hoovu', eg: 'ತೋಟದಲ್ಲಿ ಸುಂದರ ಹೂವು ಘಮಘಮಿಸುತ್ತದೆ.' },
  { kn: 'ಹಕ್ಕಿ', en: 'Bird', emoji: '🐦', pron: 'Hakki', eg: 'ಮರದ ಕೊಂಬೆಯ ಮೇಲೆ ಮುದ್ದಾದ ಹಕ್ಕಿ ಹಾಡುತ್ತಿದೆ.' },
  { kn: 'ಬಾಳೆಹಣ್ಣು', en: 'Banana', emoji: '🍌', pron: 'Baalehannu', eg: 'ಬಾಳೆಹಣ್ಣು ತುಂಬಾ ರುಚಿಕರ ಹಾಗೂ ಪೌಷ್ಟಿಕ.' },
  { kn: 'ಪುಸ್ತಕ', en: 'Book', emoji: '📖', pron: 'Pusthaka', eg: 'ನಾನು ಪ್ರತಿದಿನ ಕನ್ನಡ ಪುಸ್ತಕ ಓದುತ್ತೇನೆ.' },
  { kn: 'ಆನೆ', en: 'Elephant', emoji: '🐘', pron: 'Aane', eg: 'ಕಾಡಿನಲ್ಲಿ ದೊಡ್ಡ ಆನೆ ಗಂಭೀರವಾಗಿ ಸಾಗಿದೆ.' },
  { kn: 'ನವಿಲು', en: 'Peacock', emoji: '🦚', pron: 'Navilu', eg: 'ನವಿಲು ಗರಿ ಬಿಚ್ಚಿ ಸುಂದರವಾಗಿ ಕುಣಿಯುತ್ತದೆ.' },
  { kn: 'ಬೆಕ್ಕು', en: 'Cat', emoji: '🐱', pron: 'Bekku', eg: 'ಮುದ್ದಾದ ಬೆಕ್ಕು ಬಟ್ಟಲಲ್ಲಿ ಹಾಲು ಕುಡಿಯುತ್ತಿದೆ.' },
  { kn: 'ಹಾಲು', en: 'Milk', emoji: '🥛', pron: 'Haalu', eg: 'ಬೆಳಿಗ್ಗೆ ಬೆಚ್ಚನೆಯ ಹಾಲು ಕುಡಿಯುವುದು ಆರೋಗ್ಯಕ್ಕೆ ಹಿತ.' }
];

const KID_SIMPLE_SENTENCES = [
  { kn: 'ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ.', en: 'I go to school.', pron: 'Naanu shaalege hogutthene.' },
  { kn: 'ಆಕಾಶದಲ್ಲಿ ಪಕ್ಷಿಗಳು ಹಾರುತ್ತಿವೆ.', en: 'Birds are flying in the sky.', pron: 'Aakaashadalli pakshigalu haarutthive.' },
  { kn: 'ನನಗೆ ಸಿಹಿ ಹಣ್ಣುಗಳು ತುಂಬಾ ಇಷ್ಟ.', en: 'I like sweet fruits very much.', pron: 'Nanage sihi hannugalu thumba ishta.' },
  { kn: 'ತಾಯಿ ಪ್ರೀತಿಯಿಂದ ಊಟ ಬಡಿಸಿದರು.', en: 'Mother served food with love.', pron: 'Thaayi preethiyinda oota badisidaru.' },
  { kn: 'ಕನ್ನಡ ನಮ್ಮ ಮುದ್ದಿನ ತಾಯ್ನುಡಿ.', en: 'Kannada is our sweet mother tongue.', pron: 'Kannada namma muddina thaaynudi.' },
  { kn: 'ನಾವು ದಿನವೂ ಹೊಸ ಕನ್ನಡ ಪದಗಳನ್ನು ಕಲಿಯೋಣ.', en: 'Let us learn new Kannada words every day.', pron: 'Naavu dinavoo hosa kannada padagalannu kaliyona.' }
];

const KID_PICTURE_QUIZ = [
  {
    qKn: 'ಆನೆ ಎಂಬ ಪದವು ಯಾವ ಅಕ್ಷರದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ?',
    qEn: 'Which letter does "Aane" (Elephant) start with?',
    options: ['ಅ', 'ಆ', 'ಇ', 'ಈ'],
    correctIdx: 1,
    icon: '🐘',
    explanationKn: 'ಆನೆ "ಆ" ಅಕ್ಷರದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ (ಆ - ಆನೆ).'
  },
  {
    qKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯ ಮೊದಲನೇ ಸ್ವರಾಕ್ಷರ ಯಾವುದು?',
    qEn: 'What is the very first vowel in the Kannada alphabet?',
    options: ['ಅ', 'ಕ', 'ಆ', 'ಮ'],
    correctIdx: 0,
    icon: '⭐',
    explanationKn: '"ಅ" ಕನ್ನಡ ವರ್ಣಮಾಲೆಯ ಪ್ರಥಮ ಸ್ವರ.'
  },
  {
    qKn: 'ಕಮಲ ಹೂವು ಯಾವ ವ್ಯಂಜನಾಕ್ಷರದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ?',
    qEn: 'Which consonant letter does "Kamala" (Lotus) start with?',
    options: ['ಗ', 'ಕ', 'ಚ', 'ತ'],
    correctIdx: 1,
    icon: '🪷',
    explanationKn: 'ಕಮಲ "ಕ" ವ್ಯಂಜನದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ (ಕ - ಕಮಲ).'
  },
  {
    qKn: '"ಅಮ್ಮ" ಎಂಬ ಸುಂದರ ಪದದ ಅರ್ಥ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಏನು?',
    qEn: 'What does the Kannada word "Amma" mean in English?',
    options: ['Mother', 'Father', 'Teacher', 'Sister'],
    correctIdx: 0,
    icon: '❤️',
    explanationKn: '"ಅಮ್ಮ" ಎಂದರೆ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ Mother ಎಂದರ್ಥ.'
  },
  {
    qKn: 'ಸೂರ್ಯ ಶಬ್ದವು ಯಾವ ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ?',
    qEn: 'Which letter does "Surya" (Sun) start with?',
    options: ['ಶ', 'ಷ', 'ಸ', 'ಹ'],
    correctIdx: 2,
    icon: '☀️',
    explanationKn: 'ಸೂರ್ಯ ಶಬ್ದವು "ಸ" ಅಕ್ಷರದಿಂದ ಆರಂಭವಾಗುತ್ತದೆ.'
  },
  {
    qKn: 'ನವಿಲು ನಮ್ಮ ರಾಷ್ಟ್ರೀಯ ಪಕ್ಷಿ. ಇದರ ಆರಂಭದ ಅಕ್ಷರ ಯಾವುದು?',
    qEn: 'Which letter does "Navilu" (Peacock) start with?',
    options: ['ನ', 'ಪ', 'ಮ', 'ಬ'],
    correctIdx: 0,
    icon: '🦚',
    explanationKn: 'ನವಿಲು "ನ" ಅಕ್ಷರದಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.'
  },
  {
    qKn: 'ಬೆಕ್ಕು ಎಂಬ ಮುದ್ದಾದ ಪ್ರಾಣಿಯ ಅರ್ಥವೇನು?',
    qEn: 'What animal is "Bekku" in English?',
    options: ['Dog', 'Cow', 'Cat', 'Goat'],
    correctIdx: 2,
    icon: '🐱',
    explanationKn: '"ಬೆಕ್ಕು" ಎಂದರೆ Cat ಎಂದರ್ಥ.'
  }
];

export default function TeacherSection({ onBackToHome, langMode, initialTab }) {
  const isKn = langMode === 'kn';

  // Tabs: 'letters' | 'vocabulary' | 'grammar' | 'formation' | 'pronunciation' | 'reading' | 'quiz' | 'slate'
  const [activeTab, setActiveTab] = useState(initialTab || 'letters');
  const [currentLevel, setCurrentLevel] = useState('beginner'); // 'beginner' | 'intermediate' | 'advanced'
  
  // Sub-modes for kids & integrated learning
  const [vocabMode, setVocabMode] = useState('all'); // 'all' | 'level' | 'pictures'
  const [sentencesMode, setSentencesMode] = useState('all'); // 'all' | 'daily' | 'kids'
  const [quizMode, setQuizMode] = useState('standard'); // 'standard' | 'kids'

  // Kids Quiz state
  const [kidsQuizIdx, setKidsQuizIdx] = useState(0);
  const [kidsQuizScore, setKidsQuizScore] = useState(0);
  const [kidsQuizSelected, setKidsQuizSelected] = useState(null);
  const [kidsQuizAnswered, setKidsQuizAnswered] = useState(false);
  const [kidsQuizFinished, setKidsQuizFinished] = useState(false);
  
  // Interactive letter / Kagunitha state
  const [lettersMode, setLettersMode] = useState('swara'); // 'swara' | 'vyanjana' | 'kagunitha'
  const [selectedKagunithaBase, setSelectedKagunithaBase] = useState('ಕ');

  // Completed steps with persistent localStorage
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('kannada_saathi_teacher_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      letters: false,
      vocabulary: false,
      grammar: false,
      formation: false,
      pronunciation: false,
      reading: false,
      quiz: false
    };
  });

  const [voiceNotice, setVoiceNotice] = useState(null);

  // Interactive sentence formation state
  const [selectedWordOrder, setSelectedWordOrder] = useState([]);
  const [formationResult, setFormationResult] = useState(null);

  // Interactive quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [resetToast, setResetToast] = useState(false);

  // Digital Slate Canvas state
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#000000');
  const [tracingLetter, setTracingLetter] = useState('ಅ');

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawColor;
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

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kannada_saathi_teacher_progress', JSON.stringify(completedSteps));
    } catch (e) {}
  }, [completedSteps]);

  const lessonPillars = [
    { id: 'letters', titleKn: 'ಅಕ್ಷರಮಾಲೆ & ಗುಣಿತಾಕ್ಷರ', titleEn: 'Letters & Kagunitha', time: isKn ? '೩ ನಿಮಿಷ' : '3 min', icon: Grid, accentColor: '#D97706', pastelBg: '#FEF3C7' },
    { id: 'vocabulary', titleKn: 'ಶಬ್ದಕೋಶ', titleEn: 'Vocabulary', time: isKn ? '೩ ನಿಮಿಷ' : '3 min', icon: BookOpen, accentColor: '#E11D48', pastelBg: '#FFE4DE' },
    { id: 'grammar', titleKn: 'ವ್ಯಾಕರಣ ಸೂತ್ರ', titleEn: 'Grammar', time: isKn ? '೨ ನಿಮಿಷ' : '2 min', icon: Award, accentColor: '#EA580C', pastelBg: '#FFE8D6' },
    { id: 'formation', titleKn: 'ವಾಕ್ಯ ರಚನೆ', titleEn: 'Sentence Formation', time: isKn ? '೨ ನಿಮಿಷ' : '2 min', icon: Sparkles, accentColor: '#0284C7', pastelBg: '#E0F2FE' },
    { id: 'pronunciation', titleKn: 'ಉಚ್ಚಾರಣೆ', titleEn: 'Pronunciation', time: isKn ? '೨ ನಿಮಿಷ' : '2 min', icon: Volume2, accentColor: '#DC2626', pastelBg: '#FFF1F1' },
    { id: 'reading', titleKn: 'ನಿತ್ಯ ವಾಕ್ಯಗಳು', titleEn: 'Daily Sentences', time: isKn ? '೨ ನಿಮಿಷ' : '2 min', icon: FileText, accentColor: '#B45309', pastelBg: '#FEF3C7' },
    { id: 'quiz', titleKn: 'ಜ್ಞಾನ ರಸಪ್ರಶ್ನೆ', titleEn: 'Quiz & Revision', time: isKn ? '೧ ನಿಮಿಷ' : '1 min', icon: CheckCircle2, accentColor: '#16A34A', pastelBg: '#DCFCE7' },
    { id: 'slate', titleKn: 'ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್', titleEn: 'Digital Slate', time: isKn ? 'ಬರಹ' : 'Writing', icon: Sparkles, accentColor: '#7C3AED', pastelBg: '#EDE9FE' }
  ];

  const levelData = {
    beginner: {
      titleKn: 'ಆರಂಭಿಕ ಹಂತ (Level 1: Beginner)',
      titleEn: 'Level 1: Beginner',
      vocabulary: [
        { kn: 'ಮನೆ', pron: 'Mane', en: 'House / Home', eg: 'ಇದು ನನ್ನ ಸುಂದರ ಮನೆ.' },
        { kn: 'ನೀರು', pron: 'Neeru', en: 'Water', eg: 'ದಯವಿಟ್ಟು ಕುಡಿಯಲು ನೀರು ಕೊಡಿ.' },
        { kn: 'ಊಟ', pron: 'Oota', en: 'Meal / Food', eg: 'ನಿಮ್ಮ ಊಟವಾಯಿತೇ?' },
        { kn: 'ಸ್ನೇಹಿತ', pron: 'Snehita', en: 'Friend', eg: 'ಅವನು ನನ್ನ ಆತ್ಮೀಯ ಸ್ನೇಹಿತ.' },
        { kn: 'ಪುಸ್ತಕ', pron: 'Pusthaka', en: 'Book', eg: 'ನಾನು ಕನ್ನಡ ಪುಸ್ತಕ ಓದುತ್ತಿದ್ದೇನೆ.' },
        { kn: 'ಶಾಲೆ', pron: 'Shaale', en: 'School', eg: 'ಮಕ್ಕಳು ಶಾಲೆಗೆ ಹೋಗುತ್ತಾರೆ.' },
        { kn: 'ಹಣ್ಣು', pron: 'Hannu', en: 'Fruit', eg: 'ಮಾವಿನಹಣ್ಣು ತುಂಬಾ ಸಿಹಿಯಾಗಿದೆ.' },
        { kn: 'ದಾರಿ', pron: 'Daari', en: 'Way / Path / Road', eg: 'ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ದಾರಿ ಯಾವುದು?' }
      ],
      grammar: {
        topicKn: 'ಮೂಲ ವಾಕ್ಯ ರಚನೆ: ಕರ್ತೃ + ಕರ್ಮ + ಕ್ರಿಯಾಪದ (SOV ನಿಯಮ)',
        topicEn: 'Basic Sentence Structure: Subject + Object + Verb (SOV Rule)',
        formulaKn: 'ನಾನು (ಕರ್ತೃ) + ಹಣ್ಣು (ಕರ್ಮ) + ತಿನ್ನುತ್ತೇನೆ (ಕ್ರಿಯಾಪದ)',
        formulaEn: 'I (Subject) + Fruit (Object) + Eat (Verb)',
        ruleKn: 'ಕನ್ನಡದಲ್ಲಿ ಕ್ರಿಯಾಪದವು (Verb) ಯಾವಾಗಲೂ ವಾಕ್ಯದ ಕೊನೆಯಲ್ಲಿ ಬರುತ್ತದೆ. ಉದಾಹರಣೆಗೆ: "ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ".',
        ruleEn: 'In Kannada, the verb always appears at the end of the sentence. Example: "I go to school" -> "I school-to go".'
      },
      formation: {
        promptKn: 'ಕೆಳಗಿನ ಶಬ್ದಗಳನ್ನು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಜೋಡಿಸಿ ವಾಕ್ಯ ರಚಿಸಿ:',
        promptEn: 'Arrange the following words in correct Kannada SOV order:',
        targetMeaning: 'I drink water (ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ)',
        words: ['ಕುಡಿಯುತ್ತೇನೆ', 'ನಾನು', 'ನೀರು'],
        correctOrder: ['ನಾನು', 'ನೀರು', 'ಕುಡಿಯುತ್ತೇನೆ']
      },
      pronunciation: [
        { char: 'ಳ', pron: 'La (Retroflex L)', tipKn: 'ನಾಲಗೆಯ ತುದಿಯನ್ನು ಮೇಲ್ಭಾಗದ ಅಂಗುಳಕ್ಕೆ ತಿರುಗಿಸಿ ಮೃದುವಾಗಿ ಉಚ್ಚರಿಸಿ.', tipEn: 'Curl the tip of the tongue against the hard palate.', audioEg: 'ಕನ್ನಡ, ಬಾಳೆಹಣ್ಣು' },
        { char: 'ಣ', pron: 'Na (Retroflex N)', tipKn: 'ನಾಲಗೆಯನ್ನು ಅಂಗುಳದ ಮಧ್ಯಕ್ಕೆ ತಾಗಿಸಿ ನಾದ ಹೊರಡಿಸಿ.', tipEn: 'Touch the retroflex palate for deep nasal sound.', audioEg: 'ಬಾಣ, ಗುಣ' },
        { char: 'ಋ', pron: 'Ru (Vocalic R)', tipKn: 'ಅಂಗುಳದ ಮೇಲ್ಭಾಗದಿಂದ ಸ್ಪರ್ಶಿಸುವ ಸ್ವರ ನಾದ.', tipEn: 'Pronounced as pure resonant vocalic Ru.', audioEg: 'ಋಷಿ, ಋತು' }
      ],
      reading: [
        { kn: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?', pron: 'Namaskaara, neevu hegiddiri?', en: 'Hello, how are you?' },
        { kn: 'ನಾನು ಆರಾಮಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು.', pron: 'Naanu aaraamaagiddene, dhanyavaadagalu.', en: 'I am fine, thank you.' },
        { kn: 'ಬೆಳಿಗ್ಗೆ ಬೇಗ ಏಳುವುದು ಆರೋಗ್ಯಕ್ಕೆ ತುಂಬಾ ಒಳ್ಳೆಯದು.', pron: 'Beligge bega eluvudu aarogyakke thumba olleyadu.', en: 'Waking up early in the morning is very good for health.' },
        { kn: 'ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಬೆಂಗಳೂರು ಒಂದು ಹಸಿರು ಉದ್ಯಾನ ನಗರಿ.', pron: 'Karnatakada raajadhani Bengaluru ondu hasiru udyaana nagari.', en: 'Karnataka’s capital Bengaluru is a green garden city.' },
        { kn: 'ಕನ್ನಡ ನಮ್ಮ ತಾಯ್ನುಡಿ, ಇದನ್ನು ಪ್ರೀತಿಯಿಂದ ಕಲಿಯೋಣ.', pron: 'Kannada namma thaaynudi, idhannu preethiyinda kaliyona.', en: 'Kannada is our mother tongue, let us learn it with love.' }
      ],
      quiz: [
        {
          qKn: 'ಕನ್ನಡ ವಾಕ್ಯದಲ್ಲಿ ಕ್ರಿಯಾಪದ (Verb) ಎಲ್ಲಿ ಬರುತ್ತದೆ?',
          qEn: 'Where does the verb appear in a standard Kannada sentence?',
          options: isKn ? ['ವಾಕ್ಯದ ಆರಂಭದಲ್ಲಿ', 'ವಾಕ್ಯದ ಕೊನೆಯಲ್ಲಿ', 'ಕರ್ತೃವಿನ ಮೊದಲು'] : ['At the beginning', 'At the end', 'Before subject'],
          correctIdx: 1,
          explanationKn: 'ಕನ್ನಡವು ಕರ್ತೃ-ಕರ್ಮ-ಕ್ರಿಯಾಪದ (SOV) ರಚನೆಯನ್ನು ಅನುಸರಿಸುತ್ತದೆ. ಕ್ರಿಯಾಪದ ಕೊನೆಯಲ್ಲಿ ಬರುತ್ತದೆ.',
          explanationEn: 'Kannada strictly follows the Subject-Object-Verb (SOV) pattern.'
        },
        {
          qKn: '"Water" ಎಂಬ ಶಬ್ದಕ್ಕೆ ಸರಿಯಾದ ಕನ್ನಡ ಪದ ಯಾವುದು?',
          qEn: 'What is the correct Kannada word for "Water"?',
          options: isKn ? ['ಮನೆ', 'ಊಟ', 'ನೀರು'] : ['Mane (House)', 'Oota (Meal)', 'Neeru (Water)'],
          correctIdx: 2,
          explanationKn: 'ನೀರು ಎಂದರೆ ಜಲ ಅಥವಾ Water ಎಂದರ್ಥ.',
          explanationEn: 'Neeru means water.'
        },
        {
          qKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಒಟ್ಟು ಎಷ್ಟು ಸ್ವರಗಳಿವೆ?',
          qEn: 'How many Swaras (vowels) are there in the standard Kannada alphabet?',
          options: isKn ? ['೧೫ ಸ್ವರಗಳು', '೧೨ ಸ್ವರಗಳು', '೧೮ ಸ್ವರಗಳು'] : ['15 Swaras', '12 Swaras', '18 Swaras'],
          correctIdx: 0,
          explanationKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಅ ದಿಂದ ಅಃ ವರೆಗೆ ಒಟ್ಟು ೧೫ ಸ್ವರಗಳನ್ನು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.',
          explanationEn: 'There are 15 vowels in standard Kannada alphabet (including Am and Aha).'
        }
      ]
    },
    intermediate: {
      titleKn: 'ಮಧ್ಯಮ ಹಂತ (Level 2: Intermediate)',
      titleEn: 'Level 2: Intermediate',
      vocabulary: [
        { kn: 'ಪರಿಶ್ರಮ', pron: 'Parishrama', en: 'Diligence / Hard Work', eg: 'ಪರಿಶ್ರಮಕ್ಕೆ ತಕ್ಕ ಪ್ರತಿಫಲ ದೊರೆಯುತ್ತದೆ.' },
        { kn: 'ಸಂಸ್ಕೃತಿ', pron: 'Samskruthi', en: 'Culture / Tradition', eg: 'ಕರ್ನಾಟಕದ ಸಂಸ್ಕೃತಿ ಅತ್ಯಂತ ಶ್ರೀಮಂತವಾಗಿದೆ.' },
        { kn: 'ಆತಿಥ್ಯ', pron: 'Aathithya', en: 'Hospitality', eg: 'ಕನ್ನಡಿಗರು ತಮ್ಮ ಪ್ರೀತಿಯ ಆತಿಥ್ಯಕ್ಕೆ ಹೆಸರುವಾಸಿ.' },
        { kn: 'ಆತ್ಮವಿಶ್ವಾಸ', pron: 'Aatmavishvaasa', en: 'Self Confidence', eg: 'ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಕನ್ನಡ ಮಾತನಾಡಿ.' },
        { kn: 'ಸೌಹಾರ್ದತೆ', pron: 'Sauhaardathe', en: 'Harmony / Goodwill', eg: 'ಸಮಾಜದಲ್ಲಿ ಸೌಹಾರ್ದತೆ ಕಾಪಾಡಬೇಕು.' }
      ],
      grammar: {
        topicKn: 'ಕಾಲಗಳು: ಭೂತಕಾಲ, ವರ್ತಮಾನಕಾಲ, ಭವಿಷ್ಯತ್ಕಾಲದ ಪ್ರತ್ಯಯಗಳು',
        topicEn: 'Tenses: Past, Present, and Future Tense verb modifications',
        formulaKn: 'ಹೋಗು (ಧಾತು) -> ಹೋದೆ (ಭೂತ) | ಹೋಗುತ್ತಿದ್ದೇನೆ (ವರ್ತಮಾನ) | ಹೋಗುತ್ತೇನೆ (ಭವಿಷ್ಯತ್)',
        formulaEn: 'Root verb "Hogu" (Go) -> Hode (Went) | Hogutthiddene (Going) | Hoguttheene (Will go)',
        ruleKn: 'ಕರ್ತೃವಿನ ಪುರುಷ, ಲಿಂಗ ಹಾಗೂ ವಚನಕ್ಕೆ ತಕ್ಕಂತೆ ಕ್ರಿಯಾಪದದ ಪ್ರತ್ಯಯಗಳು ನಿಖರವಾಗಿ ಹೊಂದಿಕೊಳ್ಳುತ್ತವೆ.',
        ruleEn: 'Verb suffixes adjust based on the grammatical person, gender, and singular/plural form of the subject.'
      },
      formation: {
        promptKn: 'ಭವಿಷ್ಯತ್ಕಾಲದ ಸರಿಯಾದ ವಾಕ್ಯವನ್ನು ರೂಪಿಸಿ:',
        promptEn: 'Form the correct future tense sentence:',
        targetMeaning: 'Tomorrow we will go to Mysuru (ನಾಳೆ ನಾವು ಮೈಸೂರಿಗೆ ಹೋಗುತ್ತೇವೆ)',
        words: ['ಹೋಗುತ್ತೇವೆ', 'ನಾಳೆ', 'ಮೈಸೂರಿಗೆ', 'ನಾವು'],
        correctOrder: ['ನಾಳೆ', 'ನಾವು', 'ಮೈಸೂರಿಗೆ', 'ಹೋಗುತ್ತೇವೆ']
      },
      pronunciation: [
        { char: 'ಜ್ಞ', pron: 'Jna / Gnya', tipKn: 'ಜ್ಞಾನ, ವಿಜ್ಞಾನ ಶಬ್ದಗಳಲ್ಲಿ "ಗ್ನ್ಯ" ಎಂಬ ಸಂಯುಕ್ತ ಧ್ವನಿ.', tipEn: 'Resonant conjunct sound seen in Jnana and Vijnana.', audioEg: 'ಜ್ಞಾನ, ಪ್ರಜ್ಞೆ' },
        { char: 'ಶ್ರ', pron: 'Shra', tipKn: 'ಶ ಮತ್ತು ರ ಸಂಯೋಗದ ಸ್ಪಷ್ಟ ಗಂಭೀರ ಉಚ್ಚಾರಣೆ.', tipEn: 'Clear conjunct of Sha and Ra.', audioEg: 'ಶ್ರಮ, ಶ್ರಾವಣ' },
        { char: 'ಕ್ಷ', pron: 'Ksha', tipKn: 'ಕ ಮತ್ತು ಷ ಸಂಯೋಗದ ದೃಢ ಉಚ್ಚಾರಣೆ.', tipEn: 'Conjunct of Ka and Sha.', audioEg: 'ರಕ್ಷಣೆ, ಪಕ್ಷಿ' }
      ],
      reading: [
        { kn: 'ನಾಡಗೀತೆ "ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ"ಯನ್ನು ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ರಚಿಸಿದ್ದಾರೆ.', pron: 'Naadageethe Jaya Bharatha Jananiya Tanujaathe kuvempu rachisiddaare.', en: 'The state anthem was penned by national poet Kuvempu.' },
        { kn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯವು ಎಂಟು ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳನ್ನು ಪಡೆದು ಭಾರತದಲ್ಲಿ ಅಗ್ರಸ್ಥಾನದಲ್ಲಿದೆ.', pron: 'Kannada saahithyavu entu jnaanapeetha prashasthigalannu padedhu agrasthaanadallide.', en: 'Kannada literature leads in India with eight prestigious Jnanpith awards.' },
        { kn: 'ಹಂಪಿಯ ಕಲ್ಲಿನ ರಥವು ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಶಿಲ್ಪಕಲೆಯ ಅದ್ಭುತ ಸಂಕೇತವಾಗಿದೆ.', pron: 'Hampiya kallina rathavu vijayanagara saamraajyada shilpakaleya adbhutha sankeethavaagide.', en: 'The stone chariot of Hampi is a magnificent symbol of Vijayanagara architecture.' }
      ],
      quiz: [
        {
          qKn: '"ಹೋಗು" ಧಾತುವಿನ ಭೂತಕಾಲದ ರೂಪ ಯಾವುದು (ನಾನು ಕರ್ತೃವಾದಾಗ)?',
          qEn: 'What is the past tense form of root verb "Hogu" (for subject "I")?',
          options: isKn ? ['ಹೋಗುತ್ತೇನೆ', 'ಹೋದೆ', 'ಹೋಗುತ್ತಿದ್ದೇನೆ'] : ['Hoguttheene (Will go)', 'Hode (Went)', 'Hogutthiddene (Am going)'],
          correctIdx: 1,
          explanationKn: '"ಹೋದೆ" ಎಂಬುದು ಭೂತಕಾಲದ ಪ್ರಥಮ ಪುರುಷ ಏಕವಚನ ರೂಪ.',
          explanationEn: '"Hode" is the first-person singular past tense form.'
        },
        {
          qKn: 'ಕನ್ನಡಕ್ಕೆ ಒಟ್ಟು ಎಷ್ಟು ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು ಸಂದಿವೆ?',
          qEn: 'How many Jnanpith awards has Kannada literature received?',
          options: isKn ? ['೫ ಪ್ರಶಸ್ತಿಗಳು', '೮ ಪ್ರಶಸ್ತಿಗಳು', '೧೦ ಪ್ರಶಸ್ತಿಗಳು'] : ['5 Awards', '8 Awards', '10 Awards'],
          correctIdx: 1,
          explanationKn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯಕ್ಕೆ ಒಟ್ಟು ಎಂಟು (೮) ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು ದೊರೆತಿವೆ.',
          explanationEn: 'Kannada literature has proudly received 8 Jnanpith awards.'
        }
      ]
    },
    advanced: {
      titleKn: 'ಪ್ರೌಢ ಹಂತ (Level 3: Advanced)',
      titleEn: 'Level 3: Advanced',
      vocabulary: [
        { kn: 'ಸಾರ್ವಭೌಮತೆ', pron: 'Saarvabhoumathe', en: 'Sovereignty', eg: 'ಭಾರತವು ಒಂದು ಸಾರ್ವಭೌಮ ಗಣರಾಜ್ಯ.' },
        { kn: 'ಸುಸ್ಥಿರತೆ', pron: 'Susthirathe', en: 'Sustainability', eg: 'ಸುಸ್ಥಿರ ಅಭಿವೃದ್ಧಿಗೆ ಪರಿಸರ ರಕ್ಷಣೆ ಅನಿವಾರ್ಯ.' },
        { kn: 'ವಿಕೇಂದ್ರೀಕರಣ', pron: 'Vikeendreekarana', en: 'Decentralization', eg: 'ಪಂಚಾಯತ್ ರಾಜ್ ಅಧಿಕಾರ ವಿಕೇಂದ್ರೀಕರಣಕ್ಕೆ ಉದಾಹರಣೆ.' },
        { kn: 'ಸಾಮರಸ್ಯ', pron: 'Saamarasya', en: 'Social Harmony', eg: 'ವೈವಿಧ್ಯತೆಯಲ್ಲಿ ಸಾಮರಸ್ಯವೇ ಭಾರತದ ಬಲ.' }
      ],
      grammar: {
        topicKn: 'ಕನ್ನಡ ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು (The 8 Grammatical Cases)',
        topicEn: 'Kannada Vibhakti Cases and their nominal postpositions',
        formulaKn: 'ಪ್ರಥಮಾ (ಉ), ದ್ವಿತೀಯಾ (ಅನ್ನು), ತೃತೀಯಾ (ಇಂದ), ಚತುರ್ಥಿ (ಗೆ/ಕ್ಕೆ), ಪಂಚಮೀ (ದೆಸೆಯಿಂದ), ಷಷ್ಠೀ (ಅ), ಸಪ್ತಮೀ (ಅಲ್ಲಿ)',
        formulaEn: 'Prathama (Nominative), Dvitiya (Accusative), Tritiya (Instrumental), Chaturthi (Dative), Panchami (Ablative), Shasthi (Genitive), Saptami (Locative)',
        ruleKn: 'ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು ನಾಮಪದದೊಂದಿಗೆ ಸೇರಿ ವಾಕ್ಯದಲ್ಲಿ ಅದರ ಪಾತ್ರವನ್ನು ನಿಖರವಾಗಿ ನಿರ್ಧರಿಸುತ್ತವೆ.',
        ruleEn: 'Vibhakti case markers bind to nouns to indicate their role as subject, object, instrument, destination, possessive, or location.'
      },
      formation: {
        promptKn: 'ಷಷ್ಠೀ ಮತ್ತು ಸಪ್ತಮೀ ವಿಭಕ್ತಿಯುಕ್ತ ವಾಕ್ಯವನ್ನು ಸರಿಯಾಗಿ ಜೋಡಿಸಿ:',
        promptEn: 'Construct the sentence with genitive and locative case markers:',
        targetMeaning: 'There are many historical temples in Karnataka (ಕರ್ನಾಟಕದ ಊರುಗಳಲ್ಲಿ ಐತಿಹಾಸಿಕ ದೇವಾಲಯಗಳಿವೆ)',
        words: ['ದೇವಾಲಯಗಳಿವೆ', 'ಐತಿಹಾಸಿಕ', 'ಕರ್ನಾಟಕದ', 'ಊರುಗಳಲ್ಲಿ'],
        correctOrder: ['ಕರ್ನಾಟಕದ', 'ಊರುಗಳಲ್ಲಿ', 'ಐತಿಹಾಸಿಕ', 'ದೇವಾಲಯಗಳಿವೆ']
      },
      pronunciation: [
        { char: 'ಛಂದಸ್ಸು', pron: 'Chandassu', tipKn: 'ವಚನ ಮತ್ತು ಪದ್ಯಗಳ ಲಯಬದ್ಧ ಗಾಯನ ಹಾಗೂ ಯತಿ ಸ್ಥಾನಗಳ ನಿಲುಗಡೆ.', tipEn: 'Metrical rhythm, cadence, and pause in classical recitation.', audioEg: 'ಕಾಯಕವೇ ಕೈಲಾಸ' },
        { char: 'ಸಂಸ್ಕೃತ-ಕನ್ನಡ ತದ್ಭವ', pron: 'Tatsama-Tadbhavas', tipKn: 'ಸಂಸ್ಕೃತ ಪದಗಳು ಕನ್ನಡದ ಧ್ವನಿ ಸೌಂದರ್ಯಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುವ ರೀತಿ.', tipEn: 'Phonetic adaptation of classical loan words.', audioEg: 'ವರ್ಷ -> ವರುಷ, ಕಾರ್ಯ -> ಕಜ್ಜ' }
      ],
      reading: [
        { kn: 'ಬಸವಣ್ಣನವರ ವಚನ: "ಕಳಬೇಡ, ಕೊಲಬೇಡ, ಹುಸಿಯ ನುಡಿಯಲು ಬೇಡ, ಮುನಿಯಬೇಡ, ಅನ್ಯರಿಗೆ ಅಸಹ್ಯಪಡಬೇಡ."', pron: 'Kalabeda kolabeda husiya nudiyalu beda, muniyabeda anyarige asahyapadabeda.', en: 'Basavanna’s Vachana: "Do not steal, do not kill, do not utter lies, do not get angry, do not feel revulsion towards others."' },
        { kn: 'ಇದೇ ಅಂತರಂಗ ಶುದ್ಧಿ, ಇದೇ ಬಹಿರಂಗ ಶುದ್ಧಿ, ಇದೇ ನಮ್ಮ ಕೂಡಲಸಂಗಮದೇವನೊಲಿಸುವ ಪರಿ.', pron: 'Ide antharanga shuddhi, ide bahiranga shuddhi, ide namma Koodalasangamadevanolisuva pari.', en: 'This alone is internal purity, this alone is external purity, this alone pleases our Lord of Meeting Rivers.' }
      ],
      quiz: [
        {
          qKn: 'ಷಷ್ಠೀ ವಿಭಕ್ತಿಯ ಪ್ರತ್ಯಯ ಯಾವುದು?',
          qEn: 'What is the case suffix for Shasthi Vibhakti (Genitive / Possessive)?',
          options: isKn ? ['ಅನ್ನು', 'ಅ', 'ಇಂದ'] : ['Annu (Accusative)', 'A (Genitive)', 'Inda (Instrumental)'],
          correctIdx: 1,
          explanationKn: 'ಷಷ್ಠೀ ವಿಭಕ್ತಿಯ ಪ್ರತ್ಯಯ "ಅ" ಆಗಿದೆ. ಉದಾ: ಮರದ, ಕರ್ನಾಟಕದ, ನಮ್ಮ.',
          explanationEn: 'The suffix for Shasthi is "a", as in Karnatakada (of Karnataka).'
        },
        {
          qKn: '"ಕಾಯಕವೇ ಕೈಲಾಸ" ಎಂಬ ಪ್ರಸಿದ್ಧ ತತ್ವವನ್ನು ಸಾರಿದವರು ಯಾರು?',
          qEn: 'Who proclaimed the profound philosophy "Kayakave Kailasa" (Work is Worship)?',
          options: isKn ? ['ಜಗಜ್ಯೋತಿ ಬಸವಣ್ಣ', 'ಕನಕದಾಸರು', 'ಪುರಂದರದಾಸರು'] : ['Jagajyothi Basavanna', 'Kanakadasa', 'Purandaradasa'],
          correctIdx: 0,
          explanationKn: '೧೨ನೇ ಶತಮಾನದ ಸಮಾಜ ಸುಧಾರಕ ಜಗಜ್ಯೋತಿ ಬಸವಣ್ಣನವರು ಈ ತತ್ತ್ವ ನೀಡಿದರು.',
          explanationEn: '12th-century philosopher and social reformer Basavanna proclaimed this.'
        }
      ]
    }
  };

  const currentData = levelData[currentLevel];

  const { playSpeech, stopSpeech, activeId, isSpeaking } = useKannadaSpeech();

  // Universal Kannada Speech helper with genuine pronunciation & stop/replay
  const handleSpeak = (text, id) => {
    if (!text) return;
    const speechId = id || `teacher-${text}`;
    playSpeech({
      text,
      lang: 'kn',
      id: speechId
    });
  };

  // Toggle step complete
  const handleToggleComplete = (pillarId) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [pillarId]: !prev[pillarId]
    }));
  };

  // Word formation click handlers
  const handleAddWordToFormation = (word) => {
    if (selectedWordOrder.includes(word)) return;
    const newArr = [...selectedWordOrder, word];
    setSelectedWordOrder(newArr);
    if (newArr.length === currentData.formation.correctOrder.length) {
      const isCorrect = newArr.every((w, i) => w === currentData.formation.correctOrder[i]);
      setFormationResult(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        setCompletedSteps(prev => ({ ...prev, formation: true }));
      }
    }
  };

  const handleResetFormation = () => {
    setSelectedWordOrder([]);
    setFormationResult(null);
  };

  // Quiz submission handler
  const handleSelectQuizOption = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleCheckQuiz = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    currentData.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctIdx) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    if (correctCount === currentData.quiz.length) {
      setCompletedSteps(prev => ({ ...prev, quiz: true }));
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSelectKidsQuiz = (optIdx) => {
    if (kidsQuizAnswered) return;
    setKidsQuizSelected(optIdx);
    setKidsQuizAnswered(true);
    const isCorrect = optIdx === KID_PICTURE_QUIZ[kidsQuizIdx].correctIdx;
    if (isCorrect) {
      setKidsQuizScore((prev) => prev + 1);
      handleSpeak(isKn ? 'ಸರಿ! ಬಹಳ ಒಳ್ಳೆಯದು!' : 'Correct! Well done!', `kid-quiz-feedback`);
    } else {
      handleSpeak(isKn ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ!' : 'Try again!', `kid-quiz-feedback`);
    }
  };

  const handleNextKidsQuiz = () => {
    if (kidsQuizIdx + 1 < KID_PICTURE_QUIZ.length) {
      setKidsQuizIdx((prev) => prev + 1);
      setKidsQuizSelected(null);
      setKidsQuizAnswered(false);
    } else {
      setKidsQuizFinished(true);
    }
  };

  const handleResetKidsQuiz = () => {
    setKidsQuizIdx(0);
    setKidsQuizScore(0);
    setKidsQuizSelected(null);
    setKidsQuizAnswered(false);
    setKidsQuizFinished(false);
  };

  const handleResetAllProgress = () => {
    const confirmMsg = isKn
      ? 'ಎಲ್ಲಾ ಪಾಠಗಳ ಕಲಿಕಾ ಪ್ರಗತಿಯನ್ನು ಮರುಹೊಂದಿಸಲು ಖಚಿತಪಡಿಸಿ:'
      : 'Are you sure you want to reset all lesson progress?';
    if (!window.confirm(confirmMsg)) return;

    const fresh = {
      letters: false,
      vocabulary: false,
      grammar: false,
      formation: false,
      pronunciation: false,
      reading: false,
      quiz: false
    };
    setCompletedSteps(fresh);
    localStorage.removeItem('kannada_saathi_teacher_progress');
    handleResetFormation();
    handleResetQuiz();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 3000);
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / lessonPillars.length) * 100);

  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ಭಾಗ ೨ • ಸಂವಾದಾತ್ಮಕ ಕನ್ನಡ ಗುರು"
        badgeEn="PART 2 • Interactive Kannada Teacher"
        titleKn="ಕನ್ನಡ ಗುರು — ಅಕ್ಷರ, ಶಬ್ದಕೋಶ & ವ್ಯಾಕರಣ"
        titleEn="Kannada Teacher — Letters, Vocabulary & Grammar"
        taglineKn="ಅಕ್ಷರಮಾಲೆ, ಗುಣಿತಾಕ್ಷರ, ನಿತ್ಯ ವಾಕ್ಯಗಳು, ನಿಖರ ಉಚ್ಚಾರಣೆ ಮತ್ತು ಸ್ವಯಂ-ಮೌಲ್ಯಮಾಪನ"
        taglineEn="Master the alphabet, Kagunitha vowel combinations, daily sentences, and interactive quizzes"
        icon={GraduationCap}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      <div className="section-body">
        {/* Progress & Level Selector Header Banner */}
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
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Clock size={18} color="var(--color-flag-red)" />
                <span className="kn-heading" style={{ fontSize: '1.05rem', color: '#000000', fontWeight: 800 }}>
                  {isKn
                    ? `ಕಲಿಕಾ ಪ್ರಗತಿ: ${completedCount} / ${lessonPillars.length} ಹಂತಗಳು ಪೂರ್ಣ (${progressPercent}%)`
                    : `Learning Progress: ${completedCount} / ${lessonPillars.length} steps completed (${progressPercent}%)`}
                </span>
              </div>
              <div style={{ width: '260px', height: '8px', background: '#E0E0E0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-flag-yellow), var(--color-flag-red))',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Level Selector & Reset Progress */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                {isKn ? 'ಹಂತ:' : 'Level:'}
              </span>
              <button
                type="button"
                className={`btn ${currentLevel === 'beginner' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => {
                  setCurrentLevel('beginner');
                  handleResetFormation();
                  handleResetQuiz();
                }}
              >
                {isKn ? 'ಆರಂಭಿಕ (L1)' : 'Beginner (L1)'}
              </button>
              <button
                type="button"
                className={`btn ${currentLevel === 'intermediate' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => {
                  setCurrentLevel('intermediate');
                  handleResetFormation();
                  handleResetQuiz();
                }}
              >
                {isKn ? 'ಮಧ್ಯಮ (L2)' : 'Intermediate (L2)'}
              </button>
              <button
                type="button"
                className={`btn ${currentLevel === 'advanced' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={() => {
                  setCurrentLevel('advanced');
                  handleResetFormation();
                  handleResetQuiz();
                }}
              >
                {isKn ? 'ಪ್ರೌಢ (L3)' : 'Advanced (L3)'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                onClick={handleResetAllProgress}
                title={isKn ? "ಎಲ್ಲಾ ಪ್ರಗತಿಯನ್ನು ಮರುಹೊಂದಿಸಿ" : "Reset all progress"}
              >
                <RotateCcw size={13} />
                <span>{isKn ? 'ಮರುಹೊಂದಿಸಿ' : 'Reset'}</span>
              </button>
            </div>
          </div>
          {resetToast && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.85rem', background: '#E8F8F5', color: '#1E8449', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
              <CheckCircle2 size={15} />
              <span>{isKn ? 'ಕಲಿಕಾ ಪ್ರಗತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಹೊಂದಿಸಲಾಗಿದೆ!' : 'Learning progress successfully reset!'}</span>
            </div>
          )}
        </div>

        {/* 7-Pillar Navigation Tabs */}
        <div className="teacher-tabs-nav" role="tablist">
          {lessonPillars.map((p) => {
            const Icon = p.icon;
            const isDone = completedSteps[p.id];
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={activeTab === p.id}
                className="teacher-tab-btn"
                onClick={() => setActiveTab(p.id)}
              >
                <div
                  className="teacher-tab-icon-wrap"
                  style={{
                    background: p.pastelBg || '#F9FAFB',
                    color: p.accentColor
                  }}
                >
                  <Icon size={17} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.15rem' }}>
                  <span className="teacher-tab-title" style={{ fontSize: '0.82rem' }}>
                    {isKn ? p.titleKn : p.titleEn}
                  </span>
                  {isDone && <CheckCircle2 size={13} color="#16A34A" />}
                </div>
                <span className="teacher-tab-time" style={{ fontSize: '0.72rem' }}>
                  {p.time}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 0: LETTERS & KAGUNITHA (ಅಕ್ಷರಮಾಲೆ & ಗುಣಿತಾಕ್ಷರ)
            ======================================================== */}
        {activeTab === 'letters' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0 }}>
                  {isKn ? 'ಕನ್ನಡ ಅಕ್ಷರಮಾಲೆ ಮತ್ತು ಗುಣಿತಾಕ್ಷರಗಳು' : 'Kannada Alphabet & Kagunitha Combinations'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn
                    ? 'ಅಕ್ಷರಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಸ್ಪಷ್ಟ ಧ್ವನಿ ಆಲಿಸಿ ಮತ್ತು ಸಂಯೋಗ ರಚನೆಗಳನ್ನು ಕಲಿಯಿರಿ:'
                    : 'Click any letter to hear its accurate Kannada pronunciation aloud:'}
                </p>
              </div>

              {/* Sub-mode switch */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn ${lettersMode === 'swara' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => setLettersMode('swara')}
                >
                  {isKn ? '೧೫ ಸ್ವರಗಳು (Swaras)' : '15 Vowels (Swaras)'}
                </button>
                <button
                  type="button"
                  className={`btn ${lettersMode === 'vyanjana' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => setLettersMode('vyanjana')}
                >
                  {isKn ? '೩೪ ವ್ಯಂಜನಗಳು (Vyanjanas)' : '34 Consonants'}
                </button>
                <button
                  type="button"
                  className={`btn ${lettersMode === 'kagunitha' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => setLettersMode('kagunitha')}
                >
                  {isKn ? 'ಗುಣಿತಾಕ್ಷರ (Kagunitha)' : 'Kagunitha Matrix'}
                </button>
              </div>
            </div>

            {/* SWARAS GRID */}
            {lettersMode === 'swara' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {KANNADA_SWARAS.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#FFFDF7',
                        border: '1.5px solid var(--color-flag-red)',
                        borderRadius: '12px',
                        padding: '1rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.35rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <span className="kn-heading" style={{ fontSize: '1.8rem', color: 'var(--color-flag-red)', fontWeight: 900 }}>
                        {s.char}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>
                        {s.pron}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#666' }}>
                        {s.egKn} ({s.egEn})
                      </span>
                      <button
                        type="button"
                        className={`btn-audio-speaker-circle ${activeId === `swara-${s.char}` && isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(`${s.char}, ${s.egKn}`, `swara-${s.char}`)}
                        title={activeId === `swara-${s.char}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen')}
                        aria-label={activeId === `swara-${s.char}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen')}
                      >
                        {activeId === `swara-${s.char}` && isSpeaking ? (
                          <Square size={18} fill="currentColor" />
                        ) : (
                          <Volume2 size={22} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VYANJANAS GRID */}
            {lettersMode === 'vyanjana' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {KANNADA_VYANJANAS.map((v, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: activeId === `vyanjana-${v.char}` && isSpeaking ? '#FFF3E0' : '#FAFAFA',
                        border: activeId === `vyanjana-${v.char}` && isSpeaking ? '2px solid var(--color-flag-red)' : '1px solid #CCC',
                        borderRadius: '12px',
                        padding: '1rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.35rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <span className="kn-heading" style={{ fontSize: '1.6rem', color: '#111', fontWeight: 900 }}>
                        {v.char}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-flag-red)' }}>
                        {v.pron}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#555' }}>
                        {v.egKn} ({v.egEn})
                      </span>
                      <button
                        type="button"
                        className={`btn-audio-speaker-circle ${activeId === `vyanjana-${v.char}` && isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(`${v.char}, ${v.egKn}`, `vyanjana-${v.char}`)}
                        title={activeId === `vyanjana-${v.char}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen')}
                        aria-label={activeId === `vyanjana-${v.char}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen')}
                      >
                        {activeId === `vyanjana-${v.char}` && isSpeaking ? (
                          <Square size={18} fill="currentColor" />
                        ) : (
                          <Volume2 size={22} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KAGUNITHA COMBINATIONS */}
            {lettersMode === 'kagunitha' && (
              <div>
                {/* Consonant Selector Pills */}
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                    {isKn ? 'ಗುಣಿತಾಕ್ಷರ ಕಲಿಯಲು ಮೂಲ ವ್ಯಂಜನವನ್ನು ಆಯ್ಕೆಮಾಡಿ:' : 'Select base consonant to generate Kagunitha:'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {KAGUNITHA_BASES.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`filter-chip ${selectedKagunithaBase === b ? 'active' : ''}`}
                        style={{ padding: '0.35rem 0.85rem', fontSize: '1.05rem', fontWeight: 800 }}
                        onClick={() => setSelectedKagunithaBase(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 15 Kagunitha Forms for Selected Base */}
                <div style={{ background: '#FFFDF7', border: '2px solid var(--color-flag-yellow)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-flag-red)', marginBottom: '0.75rem' }}>
                    ✦ "{selectedKagunithaBase}" {isKn ? 'ಅಕ್ಷರದ ೧೫ ಗುಣಿತಾಕ್ಷರ ರೂಪಗಳು (ಕ್ಲಿಕ್ ಮಾಡಿ ಧ್ವನಿ ಆಲಿಸಿ):' : 'Kagunitha forms with audio playback:'}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '0.65rem' }}>
                    {KAGUNITHA_MAP[selectedKagunithaBase]?.forms.map((form, idx) => {
                      const pron = KAGUNITHA_MAP[selectedKagunithaBase]?.prons[idx];
                      return (
                        <div
                          key={idx}
                          style={{
                            background: activeId === `kagunitha-${form}` && isSpeaking ? '#FFF3E0' : '#FFFFFF',
                            border: activeId === `kagunitha-${form}` && isSpeaking ? '2px solid var(--color-flag-red)' : '1px solid #DDD',
                            borderRadius: '12px',
                            padding: '0.75rem 0.4rem',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span className="kn-heading" style={{ fontSize: '1.5rem', color: '#111', fontWeight: 800 }}>
                            {form}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>
                            {pron}
                          </span>
                          <button
                            type="button"
                            className={`btn-audio-speaker-circle ${activeId === `kagunitha-${form}` && isSpeaking ? 'speaking' : ''}`}
                            style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
                            onClick={() => handleSpeak(form, `kagunitha-${form}`)}
                            title={`${form} (${pron})`}
                            aria-label={`${form} (${pron})`}
                          >
                            {activeId === `kagunitha-${form}` && isSpeaking ? (
                              <Square size={16} fill="currentColor" />
                            ) : (
                              <Volume2 size={20} />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Mark Step Complete Button */}
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className={`btn ${completedSteps.letters ? 'btn-secondary' : 'btn-primary'}`}
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                onClick={() => handleToggleComplete('letters')}
              >
                <CheckCircle2 size={16} color={completedSteps.letters ? '#2ECC71' : '#FFF'} />
                <span>
                  {completedSteps.letters
                    ? (isKn ? 'ಅಕ್ಷರಮಾಲೆ ಮುಕ್ತಾಯಗೊಂಡಿದೆ ✓' : 'Alphabet Step Completed ✓')
                    : (isKn ? 'ಹಂತ ಪೂರ್ಣಗೊಳಿಸಿ (Mark Done)' : 'Mark Step Done')}
                </span>
              </button>
            </div>
          </div>
        )}

                

        {/* ========================================================
            TAB 1: VOCABULARY (ಶಬ್ದಕೋಶ & ಚಿತ್ರ ಶಬ್ದಕೋಶ)
            ======================================================== */}
        {activeTab === 'vocabulary' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0 }}>
                  {isKn ? 'ಕನ್ನಡ ಶಬ್ದಕೋಶ ಮತ್ತು ಚಿತ್ರ ಪದಗಳು' : 'Kannada Vocabulary & Picture Words'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn ? 'ನಿತ್ಯ ಬಳಕೆಯ ಪದಗಳು, ಸಚಿತ್ರ ಪದಗಳು, ಉಚ್ಚಾರಣೆ ಮತ್ತು ಉದಾಹರಣೆಗಳು:' : 'Daily vocabulary, illustrated picture words, pronunciation, and usage:'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`btn ${vocabMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={() => setVocabMode('all')}
                  >
                    {isKn ? 'ಎಲ್ಲವೂ (All)' : 'All'}
                  </button>
                  <button
                    type="button"
                    className={`btn ${vocabMode === 'pictures' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={() => setVocabMode('pictures')}
                  >
                    {isKn ? 'ಚಿತ್ರ ಪದಕೋಶ (Picture Words)' : 'Picture Words'}
                  </button>
                  <button
                    type="button"
                    className={`btn ${vocabMode === 'level' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={() => setVocabMode('level')}
                  >
                    {isKn ? 'ಹಂತವಾರು (Level)' : 'Level Vocab'}
                  </button>
                </div>

                <button
                  type="button"
                  className={`btn ${completedSteps.vocabulary ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => handleToggleComplete('vocabulary')}
                >
                  <CheckCircle2 size={15} color={completedSteps.vocabulary ? '#2ECC71' : '#FFF'} />
                  <span>{completedSteps.vocabulary ? (isKn ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed') : (isKn ? 'ಪೂರ್ಣವೆಂದು ಗುರುತಿಸಿ' : 'Mark Done')}</span>
                </button>
              </div>
            </div>

            {/* ILLUSTRATED PICTURE VOCABULARY SECTION */}
            {(vocabMode === 'all' || vocabMode === 'pictures') && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🎨</span>
                  <h4 className="kn-heading" style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-flag-red)' }}>
                    {isKn ? 'ಸಚಿತ್ರ ಶಬ್ದಕೋಶ (Illustrated Picture Vocabulary)' : 'Illustrated Picture Vocabulary'}
                  </h4>
                  <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 700 }}>
                    {KID_PICTURE_WORDS.length} {isKn ? 'ಪದಗಳು' : 'words'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                  {KID_PICTURE_WORDS.map((item, idx) => (
                    <div
                      key={`pic-${idx}`}
                      style={{
                        background: '#FFFDF9',
                        border: '1.5px solid #FDE68A',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.4rem',
                        transition: 'transform 0.15s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item.emoji}</span>
                          <div>
                            <span className="kn-heading" style={{ fontSize: '1.25rem', color: 'var(--color-flag-red)', fontWeight: 800, display: 'block' }}>
                              {item.kn}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#7B5E00', fontStyle: 'italic', fontWeight: 600 }}>
                              {item.pron}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`btn-audio-speaker-circle ${activeId === `kid-vocab-${item.kn}` && isSpeaking ? 'speaking' : ''}`}
                          onClick={() => handleSpeak(`${item.kn}. ${item.eg}`, `kid-vocab-${item.kn}`)}
                          title={activeId === `kid-vocab-${item.kn}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop audio') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen audio')}
                          aria-label={activeId === `kid-vocab-${item.kn}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop audio') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen audio')}
                        >
                          {activeId === `kid-vocab-${item.kn}` && isSpeaking ? (
                            <Square size={18} fill="currentColor" />
                          ) : (
                            <Volume2 size={22} />
                          )}
                        </button>
                      </div>

                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#444' }}>
                        {item.en}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#666', borderTop: '1px dashed #FDE68A', paddingTop: '0.35rem' }}>
                        {item.eg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEVEL-WISE VOCABULARY SECTION */}
            {(vocabMode === 'all' || vocabMode === 'level') && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>📖</span>
                  <h4 className="kn-heading" style={{ fontSize: '1.05rem', margin: 0, color: '#111' }}>
                    {currentData.titleKn} — {isKn ? 'ಶಬ್ದಕೋಶ' : 'Level Vocabulary'}
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                  {currentData.vocabulary.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#FFFDF7',
                        border: '1px solid var(--color-cream-border)',
                        borderRadius: '12px',
                        padding: '0.9rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.45rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="kn-heading" style={{ fontSize: '1.35rem', color: 'var(--color-flag-red)', fontWeight: 800 }}>
                          {item.kn}
                        </span>
                        <button
                          type="button"
                          className={`btn-audio-speaker-circle ${activeId === `vocab-${item.kn}` && isSpeaking ? 'speaking' : ''}`}
                          onClick={() => handleSpeak(`${item.kn}. ${item.eg}`, `vocab-${item.kn}`)}
                          title={activeId === `vocab-${item.kn}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop audio') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen audio')}
                          aria-label={activeId === `vocab-${item.kn}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop audio') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen audio')}
                        >
                          {activeId === `vocab-${item.kn}` && isSpeaking ? (
                            <Square size={18} fill="currentColor" />
                          ) : (
                            <Volume2 size={22} />
                          )}
                        </button>
                      </div>

                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>
                        🔊 {item.pron} • <span style={{ color: '#555' }}>{item.en}</span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#666', borderTop: '1px dashed #EEE', paddingTop: '0.35rem' }}>
                        <strong>{isKn ? 'ಉದಾಹರಣೆ:' : 'Usage:'}</strong> {item.eg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

                

        {/* ========================================================
            TAB 2: GRAMMAR (ವ್ಯಾಕರಣ ಸೂತ್ರ)
            ======================================================== */}
        {activeTab === 'grammar' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0 }}>
                  {currentData.grammar.topicKn}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.2rem' }}>
                  {currentData.grammar.topicEn}
                </div>
              </div>

              <button
                type="button"
                className={`btn ${completedSteps.grammar ? 'btn-secondary' : 'btn-primary'}`}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                onClick={() => handleToggleComplete('grammar')}
              >
                <CheckCircle2 size={15} color={completedSteps.grammar ? '#2ECC71' : '#FFF'} />
                <span>{completedSteps.grammar ? (isKn ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed') : (isKn ? 'ಪೂರ್ಣವೆಂದು ಗುರುತಿಸಿ' : 'Mark Done')}</span>
              </button>
            </div>

            <div style={{ background: '#FFFDF7', border: '2px solid var(--color-flag-yellow)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-flag-red)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                {isKn ? 'ಸೂತ್ರದ ಮಾದರಿ:' : 'Grammar Formula:'}
              </div>
              <div className="kn-heading" style={{ fontSize: '1.2rem', color: '#111', fontWeight: 800, marginBottom: '0.35rem' }}>
                {currentData.grammar.formulaKn}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#555', fontStyle: 'italic' }}>
                {currentData.grammar.formulaEn}
              </div>
            </div>

            <div style={{ background: '#FAFAFA', borderRadius: '12px', padding: '1rem', border: '1px solid #E5E5E5' }}>
              <div style={{ fontSize: '0.92rem', color: '#222', lineHeight: 1.6 }} className="kn-text">
                <strong>{isKn ? 'ನಿಯಮ:' : 'Rule:'}</strong> {currentData.grammar.ruleKn}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#555', marginTop: '0.35rem' }}>
                {currentData.grammar.ruleEn}
              </div>
            </div>
          </div>
        )}

                

        {/* ========================================================
            TAB 3: SENTENCE FORMATION (ವಾಕ್ಯ ರಚನೆ)
            ======================================================== */}
        {activeTab === 'formation' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0 }}>
                  {isKn ? 'ಸಂವಾದಾತ್ಮಕ ವಾಕ್ಯ ರಚನಾ ವ್ಯಾಯಾಮ' : 'Interactive Sentence Formation'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn ? currentData.formation.promptKn : currentData.formation.promptEn}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                onClick={handleResetFormation}
              >
                <RotateCcw size={13} />
                <span>{isKn ? 'ಮರುಹೊಂದಿಸಿ' : 'Reset'}</span>
              </button>
            </div>

            <div style={{ background: '#FFFDF0', border: '1px solid #FFE082', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-flag-red)' }}>
                {isKn ? 'ರಚಿಸಬೇಕಾದ ವಾಕ್ಯದ ಅರ್ಥ:' : 'Target Meaning:'}
              </span>
              <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#111', marginTop: '0.2rem' }}>
                {currentData.formation.targetMeaning}
              </div>
            </div>

            {/* Dropped / Built sentence tray */}
            <div
              style={{
                minHeight: '60px',
                background: '#FAFAFA',
                border: '2px dashed var(--color-flag-red)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginBottom: '1rem'
              }}
            >
              {selectedWordOrder.length === 0 ? (
                <span style={{ color: '#999', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  {isKn ? 'ಕೆಳಗಿನ ಶಬ್ದಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಇಲ್ಲಿ ಜೋಡಿಸಿ...' : 'Click words below in correct SOV order...'}
                </span>
              ) : (
                selectedWordOrder.map((w, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--color-flag-yellow)',
                      color: '#111',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '1.05rem',
                      fontWeight: 800
                    }}
                    className="kn-heading"
                  >
                    {w}
                  </span>
                ))
              )}
            </div>

            {/* Available clickable words */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {currentData.formation.words.map((w, i) => {
                const isUsed = selectedWordOrder.includes(w);
                return (
                  <button
                    key={i}
                    type="button"
                    style={{
                      padding: '0.6rem 1.1rem',
                      borderRadius: '10px',
                      background: isUsed ? '#E0E0E0' : '#FFFFFF',
                      border: `1.5px solid ${isUsed ? '#CCC' : 'var(--color-flag-red)'}`,
                      color: isUsed ? '#888' : '#111',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      cursor: isUsed ? 'default' : 'pointer'
                    }}
                    className="kn-text"
                    onClick={() => handleAddWordToFormation(w)}
                    disabled={isUsed}
                  >
                    {w}
                  </button>
                );
              })}
            </div>

            {/* Formation Result */}
            {formationResult && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: formationResult === 'correct' ? '#E8F8F5' : '#FDF2E9',
                  color: formationResult === 'correct' ? '#1E8449' : '#A04000',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {formationResult === 'correct' ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>{isKn ? '✓ ಅದ್ಭುತ! ಸರಿಯಾದ ಕನ್ನಡ ವಾಕ್ಯ ರಚನೆಯಾಗಿದೆ (+೧೦ ಅಂಕಗಳು).' : '✓ Perfect! Correct Kannada sentence formed.'}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} />
                    <span>{isKn ? '✗ ತಪ್ಪಾಗಿದೆ. ಶಬ್ದಗಳನ್ನು ಸರಿಯಾದ ಕರ್ತೃ-ಕರ್ಮ-ಕ್ರಿಯಾಪದ ಕ್ರಮದಲ್ಲಿ ಮತ್ತೊಮ್ಮೆ ಜೋಡಿಸಿ.' : '✗ Incorrect order. Try again in SOV order.'}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

                

        {/* ========================================================
            TAB 4: PRONUNCIATION (ಉಚ್ಚಾರಣೆ)
            ======================================================== */}
        {activeTab === 'pronunciation' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0 }}>
                  {isKn ? 'ಉಚ್ಚಾರಣಾ ಕೌಶಲ್ಯ ಮತ್ತು ಧ್ವನಿ ಸೌಂದರ್ಯ' : 'Pronunciation & Phonetic Articulation'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn ? 'ನಾಲಗೆಯ ಸ್ಪರ್ಶ ಸ್ಥಾನ ಮತ್ತು ಸೂಕ್ಷ್ಮ ಧ್ವನಿ ವ್ಯತ್ಯಾಸಗಳು:' : 'Master tricky Kannada retroflex and nasal consonants:'}
                </p>
              </div>

              <button
                type="button"
                className={`btn ${completedSteps.pronunciation ? 'btn-secondary' : 'btn-primary'}`}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                onClick={() => handleToggleComplete('pronunciation')}
              >
                <CheckCircle2 size={15} color={completedSteps.pronunciation ? '#2ECC71' : '#FFF'} />
                <span>{completedSteps.pronunciation ? (isKn ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed') : (isKn ? 'ಪೂರ್ಣವೆಂದು ಗುರುತಿಸಿ' : 'Mark Done')}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {currentData.pronunciation.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFDF7',
                    border: '1.5px solid var(--color-flag-red)',
                    borderRadius: '12px',
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="kn-heading" style={{ fontSize: '2.2rem', color: 'var(--color-flag-red)', fontWeight: 900, lineHeight: 1 }}>
                      {item.char}
                    </span>
                    <button
                      type="button"
                      className={`btn-audio-speaker-circle ${activeId === `pron-${item.char}` && isSpeaking ? 'speaking' : ''}`}
                      onClick={() => handleSpeak(`${item.char}. ${item.audioEg}`, `pron-${item.char}`)}
                      title={activeId === `pron-${item.char}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop pronunciation') : (isKn ? 'ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ' : 'Hear pronunciation')}
                      aria-label={activeId === `pron-${item.char}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop pronunciation') : (isKn ? 'ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ' : 'Hear pronunciation')}
                    >
                      <Volume2 size={22} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#333' }}>
                    {item.pron}
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.5 }} className="kn-text">
                    💡 <strong>{isKn ? 'ಉಚ್ಚಾರಣಾ ಸೂತ್ರ:' : 'Tip:'}</strong> {isKn ? item.tipKn : item.tipEn}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#777', borderTop: '1px dashed #EEE', paddingTop: '0.4rem' }}>
                    <strong>{isKn ? 'ಉದಾಹರಣೆಗಳು:' : 'Examples:'}</strong> {item.audioEg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

                

        {/* ========================================================
            TAB 5: DAILY-USE SENTENCES & READING (ನಿತ್ಯ ವಾಕ್ಯಗಳು & ಸರಳ ವಾಕ್ಯಗಳು)
            ======================================================== */}
        {activeTab === 'reading' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0 }}>
                  {isKn ? 'ದೈನಂದಿನ ವಾಕ್ಯಗಳು ಮತ್ತು ಸರಳ ವಾಚನ' : 'Daily-Use Sentences & Reading Practice'}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn ? 'ದೈನಂದಿನ ವಾಕ್ಯಗಳು, ಮಕ್ಕಳ ಸರಳ ವಾಕ್ಯಗಳು, ಉಚ್ಚಾರಣೆ ಹಾಗೂ ಅರ್ಥ:' : 'Daily sentences, simple kid sentences, phonetics, and English translation:'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`btn ${sentencesMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={() => setSentencesMode('all')}
                  >
                    {isKn ? 'ಎಲ್ಲವೂ (All)' : 'All'}
                  </button>
                  <button
                    type="button"
                    className={`btn ${sentencesMode === 'kids' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={() => setSentencesMode('kids')}
                  >
                    {isKn ? 'ಮಕ್ಕಳ ಸರಳ ವಾಕ್ಯಗಳು' : 'Simple Sentences'}
                  </button>
                  <button
                    type="button"
                    className={`btn ${sentencesMode === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={() => setSentencesMode('daily')}
                  >
                    {isKn ? 'ದೈನಂದಿನ ವಾಕ್ಯಗಳು' : 'Daily Sentences'}
                  </button>
                </div>

                <button
                  type="button"
                  className={`btn ${completedSteps.reading ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => handleToggleComplete('reading')}
                >
                  <CheckCircle2 size={15} color={completedSteps.reading ? '#2ECC71' : '#FFF'} />
                  <span>{completedSteps.reading ? (isKn ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed') : (isKn ? 'ಪೂರ್ಣವೆಂದು ಗುರುತಿಸಿ' : 'Mark Done')}</span>
                </button>
              </div>
            </div>

            {/* KIDS SIMPLE SENTENCES */}
            {(sentencesMode === 'all' || sentencesMode === 'kids') && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🧒</span>
                  <h4 className="kn-heading" style={{ fontSize: '1.05rem', margin: 0, color: '#2563EB' }}>
                    {isKn ? 'ಮಕ್ಕಳ ಹಾಗೂ ಆರಂಭಿಕರ ಸರಳ ವಾಕ್ಯಗಳು' : 'Simple Sentences for Beginners & Kids'}
                  </h4>
                  <span style={{ fontSize: '0.75rem', background: '#DBEAFE', color: '#1D4ED8', padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 700 }}>
                    {KID_SIMPLE_SENTENCES.length} {isKn ? 'ವಾಕ್ಯಗಳು' : 'sentences'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {KID_SIMPLE_SENTENCES.map((s, idx) => (
                    <div
                      key={`kid-s-${idx}`}
                      style={{
                        background: '#F8FAFC',
                        border: '1.5px solid #BFDBFE',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div className="kn-heading" style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 800 }}>
                          {s.kn}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#2563EB', fontStyle: 'italic', marginTop: '0.15rem' }}>
                          🔊 {s.pron}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
                          {s.en}
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn-audio-speaker-circle ${activeId === `kid-reading-${s.kn}` && isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(s.kn, `kid-reading-${s.kn}`)}
                        title={activeId === `kid-reading-${s.kn}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop sentence') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen sentence')}
                        aria-label={activeId === `kid-reading-${s.kn}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop sentence') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen sentence')}
                      >
                        {activeId === `kid-reading-${s.kn}` && isSpeaking ? (
                          <Square size={18} fill="currentColor" />
                        ) : (
                          <Volume2 size={22} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEVEL DAILY SENTENCES */}
            {(sentencesMode === 'all' || sentencesMode === 'daily') && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🗣️</span>
                  <h4 className="kn-heading" style={{ fontSize: '1.05rem', margin: 0, color: '#111' }}>
                    {currentData.titleKn} — {isKn ? 'ದೈನಂದಿನ ವಾಕ್ಯಗಳು' : 'Daily Sentences'}
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {currentData.reading.map((sentence, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#FFFDF7',
                        border: '1px solid var(--color-cream-border)',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div className="kn-heading" style={{ fontSize: '1.15rem', color: '#111', fontWeight: 800, lineHeight: 1.5 }}>
                          {sentence.kn}
                        </div>
                        {sentence.pron && (
                          <div style={{ fontSize: '0.82rem', color: '#7B5E00', fontStyle: 'italic', marginTop: '0.2rem' }}>
                            🔊 {sentence.pron}
                          </div>
                        )}
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                          {sentence.en}
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn-audio-speaker-circle ${activeId === `reading-${sentence.kn}` && isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleSpeak(sentence.kn, `reading-${sentence.kn}`)}
                        title={activeId === `reading-${sentence.kn}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop sentence') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen sentence')}
                        aria-label={activeId === `reading-${sentence.kn}` && isSpeaking ? (isKn ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop sentence') : (isKn ? 'ಧ್ವನಿ ಆಲಿಸಿ' : 'Listen sentence')}
                      >
                        {activeId === `reading-${sentence.kn}` && isSpeaking ? (
                          <Square size={18} fill="currentColor" />
                        ) : (
                          <Volume2 size={22} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 6: QUIZ & REVISION (ಜ್ಞಾನ ಪರೀಕ್ಷೆ & ಮಕ್ಕಳ ಚಿತ್ರ ರಸಪ್ರಶ್ನೆ)
            ======================================================== */}
        {activeTab === 'quiz' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 className="kn-heading" style={{ fontSize: '1.2rem', margin: 0 }}>
                  {quizMode === 'kids' ? (isKn ? 'ಮಕ್ಕಳ ಚಿತ್ರ ರಸಪ್ರಶ್ನೆ' : 'Kids Illustrated Quiz') : (isKn ? 'ಜ್ಞಾನ ಪರೀಕ್ಷೆ — ರಸಪ್ರಶ್ನೆ' : 'Quiz & Knowledge Revision')}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
                  {isKn ? 'ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ ತಕ್ಷಣದ ಅಂಕಗಳು ಮತ್ತು ಫಲಿತಾಂಶವನ್ನು ಪಡೆಯಿರಿ:' : 'Answer the quiz to assess your score and review instant explanations:'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn ${quizMode === 'standard' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                  onClick={() => setQuizMode('standard')}
                >
                  {isKn ? 'ಸಾಮಾನ್ಯ ರಸಪ್ರಶ್ನೆ' : 'Standard Quiz'}
                </button>
                <button
                  type="button"
                  className={`btn ${quizMode === 'kids' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                  onClick={() => setQuizMode('kids')}
                >
                  {isKn ? 'ಮಕ್ಕಳ ಚಿತ್ರ ರಸಪ್ರಶ್ನೆ 🎨' : 'Kids Picture Quiz 🎨'}
                </button>
                {quizMode === 'standard' ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={handleResetQuiz}
                  >
                    <RotateCcw size={14} />
                    <span>{isKn ? 'ಮರುಪ್ರಶ್ನೆ' : 'Reset'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                    onClick={handleResetKidsQuiz}
                  >
                    <RotateCcw size={14} />
                    <span>{isKn ? 'ಮರುಪ್ರಶ್ನೆ' : 'Reset'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* KIDS PICTURE QUIZ MODE */}
            {quizMode === 'kids' && (
              <div>
                {!kidsQuizFinished ? (
                  <div
                    style={{
                      background: '#FFFDF9',
                      border: '2px solid #FDE68A',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      maxWidth: '650px',
                      margin: '0 auto',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-flag-red)' }}>
                        {isKn ? `ಪ್ರಶ್ನೆ ${kidsQuizIdx + 1} / ${KID_PICTURE_QUIZ.length}` : `Question ${kidsQuizIdx + 1} of ${KID_PICTURE_QUIZ.length}`}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, background: '#DCFCE7', color: '#16A34A', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                        🏆 {isKn ? `ಅಂಕಗಳು: ${kidsQuizScore}` : `Score: ${kidsQuizScore}`}
                      </span>
                    </div>

                    <div style={{ fontSize: '3rem', margin: '0.5rem 0' }}>
                      {KID_PICTURE_QUIZ[kidsQuizIdx].icon}
                    </div>

                    <h4 className="kn-heading" style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 800, marginBottom: '1.25rem' }}>
                      {isKn ? KID_PICTURE_QUIZ[kidsQuizIdx].qKn : KID_PICTURE_QUIZ[kidsQuizIdx].qEn}
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {KID_PICTURE_QUIZ[kidsQuizIdx].options.map((opt, optIdx) => {
                        const isChosen = kidsQuizSelected === optIdx;
                        const isCorrect = optIdx === KID_PICTURE_QUIZ[kidsQuizIdx].correctIdx;
                        let btnBg = '#FFFFFF';
                        let btnBorder = '1.5px solid #E2E8F0';
                        let btnColor = '#1E293B';

                        if (kidsQuizAnswered) {
                          if (isCorrect) {
                            btnBg = '#DCFCE7';
                            btnBorder = '2px solid #16A34A';
                            btnColor = '#15803D';
                          } else if (isChosen) {
                            btnBg = '#FEE2E2';
                            btnBorder = '2px solid #DC2626';
                            btnColor = '#B91C1C';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            style={{
                              background: btnBg,
                              border: btnBorder,
                              color: btnColor,
                              padding: '0.9rem',
                              borderRadius: '12px',
                              fontSize: '1.15rem',
                              fontWeight: 800,
                              cursor: kidsQuizAnswered ? 'default' : 'pointer',
                              transition: 'all 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem'
                            }}
                            onClick={() => handleSelectKidsQuiz(optIdx)}
                          >
                            <span>{opt}</span>
                            {kidsQuizAnswered && isCorrect && <CheckCircle2 size={18} color="#16A34A" />}
                          </button>
                        );
                      })}
                    </div>

                    {kidsQuizAnswered && (
                      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <div
                          style={{
                            padding: '0.65rem 1rem',
                            borderRadius: '10px',
                            background: kidsQuizSelected === KID_PICTURE_QUIZ[kidsQuizIdx].correctIdx ? '#DCFCE7' : '#FEF3C7',
                            color: kidsQuizSelected === KID_PICTURE_QUIZ[kidsQuizIdx].correctIdx ? '#15803D' : '#B45309',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            marginBottom: '1rem'
                          }}
                        >
                          💡 {KID_PICTURE_QUIZ[kidsQuizIdx].explanationKn}
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '0.6rem 1.8rem', fontSize: '0.95rem' }}
                          onClick={handleNextKidsQuiz}
                        >
                          <span>{kidsQuizIdx + 1 < KID_PICTURE_QUIZ.length ? (isKn ? 'ಮುಂದಿನ ಪ್ರಶ್ನೆ' : 'Next Question') : (isKn ? 'ಫಲಿತಾಂಶ ನೋಡಿ' : 'View Results')}</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#FFFDF0',
                      border: '2px solid var(--color-flag-yellow)',
                      borderRadius: '16px',
                      padding: '2rem 1.5rem',
                      maxWidth: '500px',
                      margin: '0 auto',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                    <h3 className="kn-heading" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-flag-red)', margin: '0 0 0.5rem 0' }}>
                      {isKn ? 'ಅಭಿನಂದನೆಗಳು! ರಸಪ್ರಶ್ನೆ ಪೂರ್ಣಗೊಂಡಿದೆ!' : 'Congratulations! Quiz Complete!'}
                    </h3>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16A34A', margin: '0.5rem 0' }}>
                      {isKn ? `ನಿಮ್ಮ ಒಟ್ಟು ಅಂಕಗಳು: ${kidsQuizScore} / ${KID_PICTURE_QUIZ.length}` : `Your Score: ${kidsQuizScore} / ${KID_PICTURE_QUIZ.length}`}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.25rem' }}>
                      {kidsQuizScore >= 5
                        ? (isKn ? 'ಅತ್ಯುತ್ತಮ ಪ್ರದರ್ಶನ! ನಿಮ್ಮ ಕನ್ನಡ ಜ್ಞಾನ ಅದ್ಭುತವಾಗಿದೆ 🌟' : 'Excellent work! Your Kannada knowledge is shining 🌟')
                        : (isKn ? 'ಉತ್ತಮ ಪ್ರಯತ್ನ! ಮತ್ತೆ ಆಡಿ ಇನ್ನೂ ಹೆಚ್ಚು ಕಲಿಯಿರಿ.' : 'Great effort! Play again to learn even more.')}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleResetKidsQuiz}
                      style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
                    >
                      <RotateCcw size={16} />
                      <span>{isKn ? 'ಮತ್ತೊಮ್ಮೆ ಆಡಿ (Play Again)' : 'Play Again'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STANDARD LEVEL QUIZ MODE */}
            {quizMode === 'standard' && (
              <div>
                {/* Quiz questions list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {currentData.quiz.map((q, qIdx) => {
                    const userSelected = quizAnswers[qIdx];
                    return (
                      <div
                        key={qIdx}
                        style={{
                          background: '#FFFDF7',
                          border: '1px solid var(--color-cream-border)',
                          borderRadius: '12px',
                          padding: '1rem 1.15rem'
                        }}
                      >
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111', marginBottom: '0.75rem' }} className="kn-heading">
                          {qIdx + 1}. {isKn ? q.qKn : q.qEn}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                          {q.options.map((opt, optIdx) => {
                            const isChosen = userSelected === optIdx;
                            let btnBg = '#FFFFFF';
                            let btnBorder = '1px solid #DDD';
                            let btnColor = '#333';

                            if (quizSubmitted) {
                              if (optIdx === q.correctIdx) {
                                btnBg = '#D4EFDF';
                                btnBorder = '2px solid #27AE60';
                                btnColor = '#196F3D';
                              } else if (isChosen) {
                                btnBg = '#FADBD8';
                                btnBorder = '2px solid #E74C3C';
                                btnColor = '#922B21';
                              }
                            } else if (isChosen) {
                              btnBg = 'var(--color-flag-red)';
                              btnBorder = '2px solid var(--color-flag-red)';
                              btnColor = '#FFFFFF';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                style={{
                                  background: btnBg,
                                  border: btnBorder,
                                  color: btnColor,
                                  padding: '0.65rem 0.85rem',
                                  borderRadius: '8px',
                                  textAlign: 'left',
                                  cursor: quizSubmitted ? 'default' : 'pointer',
                                  fontSize: '0.9rem',
                                  fontWeight: 700,
                                  transition: 'all 0.15s ease'
                                }}
                                onClick={() => !quizSubmitted && handleSelectQuizOption(qIdx, optIdx)}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div
                            style={{
                              marginTop: '0.75rem',
                              padding: '0.55rem 0.85rem',
                              background: userSelected === q.correctIdx ? '#E8F8F5' : '#FDF2E9',
                              border: `1px solid ${userSelected === q.correctIdx ? '#2ECC71' : '#E74C3C'}`,
                              borderRadius: '8px',
                              fontSize: '0.84rem',
                              color: userSelected === q.correctIdx ? '#196F3D' : '#A04000',
                              fontWeight: 600
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

                {/* Quiz Action & Score Banner */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  {!quizSubmitted ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '0.6rem 1.8rem', fontSize: '0.95rem' }}
                      onClick={handleCheckQuiz}
                      disabled={Object.keys(quizAnswers).length < currentData.quiz.length}
                    >
                      <CheckCircle2 size={16} />
                      <span>{isKn ? 'ಉತ್ತರ ಪರಿಶೀಲಿಸಿ (Check Answers)' : 'Submit Quiz'}</span>
                    </button>
                  ) : (
                    <div
                      style={{
                        background: '#FFFDF0',
                        border: '2px solid var(--color-flag-yellow)',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'inline-block',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-flag-red)' }}>
                        {isKn
                          ? `ನಿಮ್ಮ ಅಂಕಗಳು: ${quizScore} / ${currentData.quiz.length}`
                          : `Your Score: ${quizScore} / ${currentData.quiz.length}`}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.25rem' }}>
                        {quizScore === currentData.quiz.length
                          ? (isKn ? 'ಅದ್ಭುತ! ಎಲ್ಲಾ ಉತ್ತರಗಳು ನಿಖರವಾಗಿವೆ 🏆' : 'Outstanding! All answers correct 🏆')
                          : (isKn ? 'ಉತ್ತಮ ಪ್ರಯತ್ನ! ವಿವರಣೆಗಳನ್ನು ಗಮನಿಸಿ ಮತ್ತೊಮ್ಮೆ ಅಭ್ಯಾಸ ಮಾಡಿ.' : 'Good effort! Review explanations and try again.')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 7: DIGITAL SLATE (ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್ ಬರಹ ಅಭ್ಯಾಸ)
            ======================================================== */}
        {activeTab === 'slate' && (
          <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {isKn ? '✍️ ಡಿಜಿಟಲ್ ಸ್ಲೇಟ್ ಬರಹ ಅಭ್ಯಾಸ' : '✍️ Digital Slate Handwriting Practice'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {isKn
                  ? 'ಕನ್ನಡ ಅಕ್ಷರ ಆರಿಸಿ, ನಿಮ್ಮ ಮೌಸ್ ಅಥವಾ ಟಚ್ ಸ್ಕ್ರೀನ್ ಮೂಲಕ ಸ್ಲೇಟಿನ ಮೇಲೆ ಅಕ್ಷರ ತಿದ್ದಿ ಬರೆಯಿರಿ:'
                  : 'Select a Kannada letter and trace with your mouse or touchscreen over the guide on the slate:'}
              </p>
            </div>

            {/* Letter to Trace Selector */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                {isKn ? 'ತಿದ್ದಲು ಅಕ್ಷರ ಆರಿಸಿ:' : 'Letter to Trace:'}
              </span>
              {['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಕ', 'ಗ', 'ಚ', 'ಜ', 'ತ', 'ದ', 'ನ', 'ಪ', 'ಮ', 'ರ', 'ಲ', 'ಸ', 'ಹ', 'ಳ'].map((char) => (
                <button
                  key={char}
                  type="button"
                  className={`btn ${tracingLetter === char ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.95rem', minWidth: '38px' }}
                  onClick={() => {
                    setTracingLetter(char);
                    clearSlate();
                    handleSpeak(char, `slate-char-${char}`);
                  }}
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
                  { color: '#000000', nameKn: 'ಕಪ್ಪು (Black)', nameEn: 'Black' },
                  { color: '#DC2626', nameKn: 'ಕೆಂಪು (Red)', nameEn: 'Red' },
                  { color: '#D97706', nameKn: 'ಹಳದಿ (Gold)', nameEn: 'Gold' },
                  { color: '#2563EB', nameKn: 'ನೀಲಿ (Blue)', nameEn: 'Blue' }
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: c.color,
                      border: drawColor === c.color ? '3px solid #111111' : '1px solid #CCC',
                      cursor: 'pointer'
                    }}
                    title={isKn ? c.nameKn : c.nameEn}
                    onClick={() => setDrawColor(c.color)}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ minHeight: '44px', padding: '0.45rem 0.95rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                  onClick={() => handleSpeak(tracingLetter, `slate-speak-${tracingLetter}`)}
                  title={isKn ? 'ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ' : 'Hear Sound'}
                >
                  <Volume2 size={20} color="var(--color-flag-red)" />
                  <span>{isKn ? 'ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ' : 'Hear Sound'}</span>
                </button>
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
            </div>

            {/* Canvas Slate Box */}
            <div
              className="digital-slate-wrapper"
              style={{
                position: 'relative',
                background: '#F8FAFC',
                border: '3px solid #CBD5E1',
                borderRadius: '16px',
                overflow: 'hidden',
                margin: '0 auto',
                maxWidth: '600px',
                height: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div
                className="slate-guide-watermark kn-heading"
                style={{
                  position: 'absolute',
                  fontSize: '9rem',
                  color: 'rgba(0, 0, 0, 0.08)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%'
                }}
              >
                {tracingLetter}
              </div>

              <canvas
                ref={canvasRef}
                width={600}
                height={280}
                style={{
                  width: '100%',
                  height: '100%',
                  cursor: 'crosshair',
                  touchAction: 'none'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.65rem' }}>
              {isKn
                ? '✦ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಕಾಣುವ ಅಕ್ಷರದ ಮೇಲೆ ತಿದ್ದಿ ಬರೆಯಿರಿ. ತಿದ್ದಿದ ನಂತರ "ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.'
                : '✦ Trace over the background guide letter with strokes. Click "Hear Sound" to reinforce pronunciation.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
