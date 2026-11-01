import React, { useState } from 'react';
import SectionHeader from '../layout/SectionHeader';
import { useKannadaSpeech } from '../../utils/kannadaSpeech';
import {
  Users,
  Volume2,
  Bus,
  Car,
  ShoppingBag,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  Compass,
  MessageCircle,
  Search,
  Check,
  BookmarkPlus,
  Award,
  X
} from 'lucide-react';

export default function EverydaySection({ onBackToHome, langMode }) {
  const isKn = langMode === 'kn';
  const { playSpeech, stopSpeech, activeId, isSpeaking } = useKannadaSpeech();

  const [activeScenario, setActiveScenario] = useState('buses');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(null);

  const scenarios = [
    { id: 'buses', titleKn: 'ಬಸ್ ಪ್ರಯಾಣ & ಸಾರಿಗೆ', titleEn: 'City & KSRTC Buses', icon: Bus },
    { id: 'autorickshaw', titleKn: 'ಆಟೋರಿಕ್ಷಾ ಚಾಲಕರೊಂದಿಗೆ', titleEn: 'Auto-Rickshaw Travel', icon: Car },
    { id: 'market', titleKn: 'ಮಾರುಕಟ್ಟೆ & ತರಕಾರಿ', titleEn: 'Markets & Groceries', icon: ShoppingBag },
    { id: 'restaurant', titleKn: 'ಹೋಟೆಲ್ & ಉಪಹಾರ', titleEn: 'Restaurants & Dining', icon: UtensilsCrossed },
    { id: 'office', titleKn: 'ಕಚೇರಿ & ಉದ್ಯೋಗ', titleEn: 'Offices & Workplace', icon: Briefcase },
    { id: 'interview', titleKn: 'ಉದ್ಯೋಗ ಸಂದರ್ಶನ', titleEn: 'Job Interview & Career', icon: Award },
    { id: 'college', titleKn: 'ಕಾಲೇಜು & ಸ್ನೇಹಿತರು', titleEn: 'College & Friends', icon: GraduationCap },
    { id: 'travel', titleKn: 'ಪ್ರವಾಸ & ರೈಲು ನಿಲ್ದಾಣ', titleEn: 'Travel & Stations', icon: Compass },
    { id: 'everyday', titleKn: 'ದೈನಂದಿನ ಸಂದರ್ಭಗಳು', titleEn: 'Everyday Situations', icon: MessageCircle }
  ];

  const dialogueData = {
    buses: {
      titleKn: 'ನಗರ ಬಸ್ ಪ್ರಯಾಣ (BMTC / KSRTC)',
      titleEn: 'City Bus Travel (BMTC / KSRTC)',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಕಂಡಕ್ಟರ್ ಸರ್, ಈ ಬಸ್ ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ಹೋಗುತ್ತದೆಯೇ?',
          translit: 'Conductor sir, ee bus Majestic bus stand ge hogutthadeye?',
          en: 'Conductor sir, does this bus go to the Majestic bus stand?'
        },
        {
          speakerKn: 'ಕಂಡಕ್ಟರ್',
          speakerEn: 'Conductor',
          kn: 'ಹೌದು, ಬಸ್ ಹತ್ತಿ. ಎಲ್ಲಿಗೆ ಟಿಕೆಟ್ ಬೇಕು?',
          translit: 'Haudu, bus hatthi. Ellige ticket beku?',
          en: 'Yes, please get in. Where do you need a ticket to?'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಶಿವಾಜಿನಗರಕ್ಕೆ ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ. ಎಷ್ಟು ರೂಪಾಯಿ?',
          translit: 'Shivajinagara-kke ondu ticket kodi. Eshtu roopaayi?',
          en: 'One ticket to Shivajinagar please. How much is it?'
        },
        {
          speakerKn: 'ಕಂಡಕ್ಟರ್',
          speakerEn: 'Conductor',
          kn: 'ಇಪ್ಪತ್ತು ರೂಪಾಯಿ. ಚಿಲ್ಲರೆ ಇದ್ದರೆ ಕೊಡಿ.',
          translit: 'Ippatthu roopaayi. Chillare iddare kodi.',
          en: 'Twenty rupees. Please give exact change if you have.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನಿಲ್ದಾಣ ಬಂದಾಗ ದಯವಿಟ್ಟು ನನಗೆ ತಿಳಿಸಿ.',
          translit: 'Nildaana bandaaga dayavittu nanage thilisi.',
          en: 'Please let me know when the stop arrives.'
        }
      ]
    },
    autorickshaw: {
      titleKn: 'ಆಟೋರಿಕ್ಷಾ ಚಾಲಕರೊಂದಿಗೆ ಸಂಭಾಷಣೆ',
      titleEn: 'Auto-Rickshaw Travel & Fare',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಅಣ್ಣಾ, ಇಂದಿರಾನಗರಕ್ಕೆ ಹೋಗಬೇಕಿತ್ತು. ಬರ್ತೀರಾ?',
          translit: 'Anna, Indiranagara-kke hogabekittu. Bartheera?',
          en: 'Brother, I need to go to Indiranagar. Will you come?'
        },
        {
          speakerKn: 'ಆಟೋ ಚಾಲಕ',
          speakerEn: 'Auto Driver',
          kn: 'ಬನ್ನಿ ಸಾರ್, ಹತ್ತಿ. ಮೀಟರ್ ಹಾಕ್ತೀನಿ.',
          translit: 'Banni sir, hatthi. Meter haaktheeni.',
          en: 'Come in sir, please sit. I will use the meter.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ ಹೋಗಿ.',
          translit: 'Dayavittu meter haaki hogi.',
          en: 'Please use the meter.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಅಲ್ಲಿಗೆ ತಲುಪಲು ಎಷ್ಟು ಸಮಯ ಬೇಕಾಗಬಹುದು?',
          translit: 'Allige thalupalu eshtu samaya bekaagabahudu?',
          en: 'How much time will it take to reach there?'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಧನ್ಯವಾದಗಳು, ಇಲ್ಲೇ ಎಡಗಡೆ ನಿಲ್ಲಿಸಿ. ಯುಪಿಐ / ಗೂಗಲ್ ಪೇ ಇದೆಯೇ?',
          translit: 'Dhanyavaadagalu, ille edagade nillisi. UPI / Google Pay ideye?',
          en: 'Thank you, please stop right here on the left. Do you accept UPI / Google Pay?'
        }
      ]
    },
    market: {
      titleKn: 'ತರಕಾರಿ & ಹಣ್ಣಿನ ಮಾರುಕಟ್ಟೆ',
      titleEn: 'Vegetable & Fruit Market Shopping',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಅಣ್ಣಾ, ಟೊಮೆಟೊ ಒಂದು ಕಿಲೋಗೆ ಎಷ್ಟು ಬೆಲೆ?',
          translit: 'Anna, tomato ondu kilo-ge eshtu bele?',
          en: 'Brother, how much is one kilo of tomatoes?'
        },
        {
          speakerKn: 'ವ್ಯಾಪಾರಿ',
          speakerEn: 'Shopkeeper',
          kn: 'ಕಿಲೋಗೆ ಮೂವತ್ತು ರೂಪಾಯಿ ಸಾರ್, ತಾಜಾ ತರಕಾರಿ.',
          translit: 'Kilo-ge moovatthu roopaayi sir, thaaja tharakaari.',
          en: 'Thirty rupees per kilo sir, very fresh vegetables.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಒಂದು ಕಿಲೋ ಈರುಳ್ಳಿ ಮತ್ತು ಅರ್ಧ ಕಿಲೋ ಆಲೂಗಡ್ಡೆ ತೂಗಿ ಕೊಡಿ.',
          translit: 'Ondu kilo eerulli matthu ardha kilo aaloogadde thoogi kodi.',
          en: 'Please weigh one kilo of onions and half a kilo of potatoes.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಸ್ವಲ್ಪ ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು ಉಚಿತವಾಗಿ ಹಾಕಿ ಕೊಡಿ.',
          translit: 'Swalpa kotthambari soppu uchithavaagi haaki kodi.',
          en: 'Please add a little coriander leaves on top.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಒಟ್ಟು ಎಷ್ಟು ಹಣವಾಯಿತು?',
          translit: 'Ottu eshtu hanavaayithu?',
          en: 'How much is the total amount?'
        }
      ]
    },
    restaurant: {
      titleKn: 'ಹೋಟೆಲ್ & ಉಪಹಾರ ಭೋಜನ',
      titleEn: 'Restaurant & Dining Interaction',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನಮಸ್ಕಾರ, ನಮಗೆ ಅಧಿಕೃತ ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ ಸಿಗುತ್ತದೆಯೇ?',
          translit: 'Namaskara, namage adhikrutha Mysuru masala dose sigutthadeye?',
          en: 'Hello, can we get authentic Mysuru masala dosa here?'
        },
        {
          speakerKn: 'ಸರ್ವರ್',
          speakerEn: 'Waiter',
          kn: 'ಖಂಡಿತ ಸಾರ್, ಗರಿಗರಿಯಾದ ತುಪ್ಪದ ಮಸಾಲ ದೋಸೆ ಸಿದ್ಧವಿದೆ.',
          translit: 'Khanditha sir, garigariyaada thuppada masala dose siddhavide.',
          en: 'Certainly sir, crisp ghee masala dosa is ready.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಕಾರ ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಮತ್ತು ಚಟ್ನಿ ಜಾಸ್ತಿ ಕೊಡಿ.',
          translit: 'Kaara swalpa kadime maadi matthu chutney jaasthi kodi.',
          en: 'Please make it less spicy and give extra chutney.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಊಟವಾದ ನಂತರ ಎರಡು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ತನ್ನಿ.',
          translit: 'Ootavaada nanthara eradu bisi filter coffee thanni.',
          en: 'After the meal, please bring two hot filter coffees.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಬಿಲ್ ತನ್ನಿ ದಯವಿಟ್ಟು.',
          translit: 'Bill thanni dayavittu.',
          en: 'Please bring the bill.'
        }
      ]
    },
    office: {
      titleKn: 'ಕಚೇರಿ & ಉದ್ಯೋಗ ಸ್ಥಳದ ಸಂವಾದ',
      titleEn: 'Office & Workplace Discussions',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಶುಭೋದಯ, ಇಂದಿನ ಯೋಜನಾ ಸಭೆಯ ಸಮಯ ಯಾವಾಗ?',
          translit: 'Shubhodaya, indina yojana sabheya samaya yaavaaga?',
          en: 'Good morning, when is today’s project review meeting?'
        },
        {
          speakerKn: 'ಸಹೋದ್ಯೋಗಿ',
          speakerEn: 'Colleague',
          kn: 'ಸರಿಯಾಗಿ ೧೧:೩೦ಕ್ಕೆ ಕಾನ್ಫರೆನ್ಸ್ ಕೋಣೆಯಲ್ಲಿ ನಡೆಯಲಿದೆ.',
          translit: 'Sariyaagi 11:30 kke conference koneyalli nadeyalide.',
          en: 'It is scheduled sharply at 11:30 AM in the conference room.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನನ್ನ ವರದಿಯ ಸ್ಲೈಡ್‌ಗಳನ್ನು ಈಗಾಗಲೇ ಇಮೇಲ್ ಮಾಡಿದ್ದೇನೆ.',
          translit: 'Nanna varadiya slide-galannu eegaagale email maaddene.',
          en: 'I have already emailed my report slides.'
        },
        {
          speakerKn: 'ಸಹೋದ್ಯೋಗಿ',
          speakerEn: 'Colleague',
          kn: 'ಧನ್ಯವಾದಗಳು, ಸಭೆಯ ನಂತರ ಒಟ್ಟಿಗೆ ಕಾಫಿ ಕುಡಿಯೋಣ.',
          translit: 'Dhanyavaadagalu, sabheya nanthara ottige coffee kudiyona.',
          en: 'Thank you, let us have coffee together after the meeting.'
        }
      ]
    },
    interview: {
      titleKn: 'ಉದ್ಯೋಗ ಸಂದರ್ಶನ & ವೃತ್ತಿ (Job Interview)',
      titleEn: 'Job Interview & Career Dialogues',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನಮಸ್ಕಾರ ಸರ್, ನಾನು ಸಂದರ್ಶನಕ್ಕಾಗಿ ಒಳಗೆ ಬರಬಹುದೇ?',
          translit: 'Namaskara sir, naanu sandarshanakkaagi olage barabahude?',
          en: 'Good morning sir, may I come in for the interview?'
        },
        {
          speakerKn: 'ಸಂದರ್ಶಕರು',
          speakerEn: 'Interviewer',
          kn: 'ಖಂಡಿತ ಬನ್ನಿ, ಕುಳಿತುಕೊಳ್ಳಿ. ನಿಮ್ಮ ಕಿರು ಪರಿಚಯ ಮಾಡಿಕೊಡಿ.',
          translit: 'Khanditha banni, kulithukolli. Nimma kiru parichaya maadikodi.',
          en: 'Please come in and have a seat. Could you introduce yourself briefly?'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನನ್ನ ಹೆಸರು ರಾಹುಲ್. ನಾನು ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್‌ನಲ್ಲಿ ಬಿ.ಇ. ಪದವಿ ಮುಗಿಸಿದ್ದೇನೆ ಮತ್ತು ಮೂರು ವರ್ಷಗಳ ಸಾಫ್ಟ್‌ವೇರ್ ಅನುಭವವಿದೆ.',
          translit: 'Nanna hesaru Rahul. Naanu computer science nalli B.E. padavi mugisiddene matthu mooru varshagala software anubhava ide.',
          en: 'My name is Rahul. I graduated in Computer Science and bring 3 years of software development experience.'
        },
        {
          speakerKn: 'ಸಂದರ್ಶಕರು',
          speakerEn: 'Interviewer',
          kn: 'ತುಂಬಾ ಸಂತೋಷ. ನಮ್ಮ ಸಂಸ್ಥೆಯಲ್ಲಿ ಹೊಸ ತಂತ್ರಜ್ಞಾನಗಳನ್ನು ಕಲಿಯಲು ನಿಮಗೆ ಆಸಕ್ತಿಯಿದೆಯೇ?',
          translit: 'Thumba santhosha. Namma samstheyalli hosa thanthrajnaanagalannu kaliyalu nimage aasakti ideye?',
          en: 'Very good. Are you keen on adapting to new tools and tech stacks at our firm?'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಖಂಡಿತವಾಗಿಯೂ ಸರ್, ಹೊಸ ಕೌಶಲ್ಯಗಳನ್ನು ಕಲಿಯಲು ಮತ್ತು ತಂಡದೊಂದಿಗೆ ಬೆಳೆಯಲು ನಾನು ಸದಾ ಉತ್ಸುಕನಾಗಿದ್ದೇನೆ.',
          translit: 'Khandithavaagiyoo sir, hosa kaushalyagalannu kaliyalu matthu thandadondige beleyalu naanu sadaa utsukanaagiddene.',
          en: 'Definitely sir, I am eager to continuously learn and contribute to team milestones.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಈ ಉತ್ತಮ ಅವಕಾಶ ನೀಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಫಲಿತಾಂಶವನ್ನು ಯಾವಾಗ ನಿರೀಕ್ಷಿಸಬಹುದು?',
          translit: 'Ee utthama avakaasha neediddakkaagi dhanyavaadagalu. Phalithaamshavannu yaavaaga nireekshisabahudu?',
          en: 'Thank you for this opportunity. By when can I expect an update on the results?'
        }
      ]
    },
    college: {
      titleKn: 'ಕಾಲೇಜು ಕ್ಯಾಂಪಸ್ & ಸ್ನೇಹಿತರು',
      titleEn: 'College Campus & Studies',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನಮಸ್ಕಾರ ಸ್ನೇಹಿತರೆ, ಇವತ್ತಿನ ಉಪನ್ಯಾಸದ ನೋಟ್ಸ್ ಇದೆಯೇ?',
          translit: 'Namaskara snehithare, ivatthina upanyaasada notes ideye?',
          en: 'Hello friends, do you have today\'s lecture notes?'
        },
        {
          speakerKn: 'ಗೆಳೆಯ',
          speakerEn: 'Friend',
          kn: 'ಹೌದು, ಲೈಬ್ರರಿಯಲ್ಲಿ ಕುಳಿತು ಒಟ್ಟಿಗೆ ಓದೋಣ ಬನ್ನಿ.',
          translit: 'Haudu, library-yalli kulithu ottige odona banni.',
          en: 'Yes, come let us sit together in the library and study.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಸೆಮಿಸ್ಟರ್ ಪರೀಕ್ಷೆಗಳು ಮುಂದಿನ ತಿಂಗಳು ಆರಂಭವಾಗುತ್ತಿವೆ.',
          translit: 'Semester pareekshegalu mundina thingalu aarambhavaagutthive.',
          en: 'Semester examinations are beginning next month.'
        },
        {
          speakerKn: 'ಗೆಳೆಯ',
          speakerEn: 'Friend',
          kn: 'ಚಿಂತೆ ಮಾಡಬೇಡ, ನಾವು ಒಟ್ಟಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿದರೆ ಉತ್ತಮ ಅಂಕ ಪಡೆಯಬಹುದು.',
          translit: 'Chinthe maadabeda, naavu ottaagi abhyaasa maadidare utthama anka padeyabahudu.',
          en: 'Do not worry, if we study together we can score good marks.'
        }
      ]
    },
    travel: {
      titleKn: 'ಪ್ರವಾಸ & ರೈಲು ನಿಲ್ದಾಣ',
      titleEn: 'Travel & Railway Station Inquiries',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನಮಸ್ಕಾರ, ಮೈಸೂರು ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರೈಲು ಯಾವ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಬರುತ್ತದೆ?',
          translit: 'Namaskara, Mysuru express railu yaava platform-ge barutthade?',
          en: 'Hello, which platform does the Mysuru Express train arrive at?'
        },
        {
          speakerKn: 'ಅಧಿಕಾರಿ',
          speakerEn: 'Station Officer',
          kn: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಸಂಖ್ಯೆ ಮೂರಕ್ಕೆ ಬರುತ್ತದೆ, ಸೇತುವೆಯ ಮೂಲಕ ಹೋಗಿ.',
          translit: 'Platform sankhye moorakke barutthade, sethuveya moolaka hogi.',
          en: 'It arrives at platform number 3, please take the foot overbridge.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಹಂಪಿಯ ಐತಿಹಾಸಿಕ ತಾಣಗಳನ್ನು ನೋಡಲು ಎಷ್ಟು ದಿನ ಬೇಕು?',
          translit: 'Hampiya aithihaasika thaanagalannu nodalu eshtu dina beku?',
          en: 'How many days are needed to see the historic sites of Hampi?'
        },
        {
          speakerKn: 'ಮಾರ್ಗದರ್ಶಿ',
          speakerEn: 'Guide',
          kn: 'ಎರಡು ಅಥವಾ ಮೂರು ದಿನಗಳು ಸಾಕು ಸಾರ್.',
          translit: 'Eradu athava mooru dinagalu saaku sir.',
          en: 'Two to three days are sufficient sir.'
        }
      ]
    },
    everyday: {
      titleKn: 'ದೈನಂದಿನ ಸಾರ್ವಜನಿಕ ಸಂದರ್ಭಗಳು',
      titleEn: 'Everyday Helpful Kannada Sentences',
      dialogues: [
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.',
          translit: 'Naanu Kannada kaliyuttheeddene, dayavittu nidhaanavaagi maathanaadi.',
          en: 'I am learning Kannada; could you please speak slowly?'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನಾನು ಎಲ್ಲಿದ್ದೇನೆ? ಈ ಸ್ಥಳದ ಹೆಸರು ಏನು?',
          translit: 'Naanu elliddene? Ee sthalada hesaru enu?',
          en: 'Where am I? What is the name of this place?'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು.',
          translit: 'Nimma sahaayakke thumba dhanyavaadagalu.',
          en: 'Thank you very much for your help.'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ದಯವಿಟ್ಟು ನನಗೆ ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡುವಿರಾ?',
          translit: 'Dayavittu nanage swalpa sahaaya maaduveera?',
          en: 'Could you please help me a little?'
        },
        {
          speakerKn: 'ನೀವು',
          speakerEn: 'You',
          kn: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
          translit: 'Idara bele eshtu?',
          en: 'How much does this cost?'
        }
      ]
    }
  };

  const playAudio = (text) => {
    if (!text) return;
    const speechId = `everyday-${text}`;
    if (activeId === speechId && isSpeaking) {
      stopSpeech();
      return;
    }
    playSpeech({
      text,
      lang: 'kn',
      id: speechId
    });
  };

  const handleSavePhrase = (d) => {
    const saved = localStorage.getItem('kannada_saathi_phrases');
    let list = [];
    if (saved) {
      try { list = JSON.parse(saved); } catch (e) {}
    }
    const exists = list.some(item => item.kn === d.kn);
    if (!exists) {
      const newItem = {
        id: Date.now(),
        kn: d.kn,
        en: d.en,
        date: isKn ? 'ಉಳಿಸಲಾಗಿದೆ' : 'Saved'
      };
      list.unshift(newItem);
      localStorage.setItem('kannada_saathi_phrases', JSON.stringify(list));
      setSavedFeedback(d.kn);
      setTimeout(() => setSavedFeedback(null), 2500);
    } else {
      setSavedFeedback(d.kn);
      setTimeout(() => setSavedFeedback(null), 2500);
    }
  };

  // Global search across all categories if search query present
  const isSearching = Boolean(searchQuery.trim());
  let displayDialogues = [];

  if (isSearching) {
    const q = searchQuery.toLowerCase().trim().normalize('NFC');
    Object.keys(dialogueData).forEach(catKey => {
      const cat = dialogueData[catKey];
      const catMatch = (cat.titleKn && cat.titleKn.toLowerCase().includes(q)) || (cat.titleEn && cat.titleEn.toLowerCase().includes(q));
      cat.dialogues.forEach(d => {
        if (
          catMatch ||
          d.kn.toLowerCase().normalize('NFC').includes(q) ||
          d.en.toLowerCase().normalize('NFC').includes(q) ||
          (d.translit && d.translit.toLowerCase().includes(q)) ||
          (d.speakerKn && d.speakerKn.toLowerCase().includes(q)) ||
          (d.speakerEn && d.speakerEn.toLowerCase().includes(q))
        ) {
          displayDialogues.push({
            ...d,
            categoryKey: catKey,
            categoryTitle: isKn ? cat.titleKn : cat.titleEn
          });
        }
      });
    });
  } else {
    const currentDialogueSet = dialogueData[activeScenario] || dialogueData.buses;
    displayDialogues = currentDialogueSet.dialogues;
  }

  return (
    <div className="section-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      <SectionHeader
        badgeKn="ಅಗ್ರ ಆದ್ಯತೆ • ದಿನನಿತ್ಯ ಬಳಕೆ"
        badgeEn="HIGH PRIORITY • Practical Dialogues"
        titleKn="ದೈನಂದಿನ ಕನ್ನಡ ಸಂಭಾಷಣೆಗಳು"
        titleEn="Everyday Kannada Conversations"
        taglineKn="ಬಸ್, ಆಟೋ, ಮಾರುಕಟ್ಟೆ, ಹೋಟೆಲ್, ಕಚೇರಿ, ಉದ್ಯೋಗ ಸಂದರ್ಶನ, ಕಾಲೇಜು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸ್ಥಳಗಳ ನೈಜ ಸಂವಾದಗಳು"
        taglineEn="Realistic practical dialogues for buses, auto-rickshaws, markets, dining, workplace, job interviews, and everyday interactions"
        icon={Users}
        onBackToHome={onBackToHome}
        langMode={langMode}
      />

      <div className="section-body">
        {/* Prominent Search Bar (Requirement 3) */}
        <div style={{ marginBottom: '1.25rem', background: '#FFFFFF', padding: '1rem', borderRadius: '16px', border: '1.5px solid var(--color-cream-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', color: 'var(--color-flag-red)' }} />
            <input
              type="text"
              className="search-input"
              style={{
                width: '100%',
                paddingLeft: '3rem',
                paddingRight: searchQuery ? '2.5rem' : '1rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                borderRadius: '12px',
                border: '1.5px solid var(--color-flag-yellow-border)',
                fontSize: '0.95rem'
              }}
              placeholder={isKn ? 'ಎಲ್ಲಾ ಸಂಭಾಷಣೆಗಳಲ್ಲಿ ಹುಡುಕಿ (ಉದಾ: ಬಸ್, ಆಟೋ, ಟೊಮೆಟೊ, ದೋಸೆ, ಸಂದರ್ಶನ, ಕಾಫಿ, ಸಹಾಯ)...' : 'Search all dialogues (e.g. bus, auto meter, tomato, dosa, interview, coffee, help)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#888',
                  padding: '0.25rem'
                }}
                title={isKn ? 'ತೆರವುಗೊಳಿಸಿ' : 'Clear search'}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {isSearching && (
            <div style={{ marginTop: '0.65rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-flag-red)' }}>
              ✦ {displayDialogues.length} {isKn ? 'ಸಂಭಾಷಣಾ ಸಾಲುಗಳು ಕಂಡುಬಂದಿವೆ' : 'dialogue lines found'}
            </div>
          )}
        </div>

        {/* 8 Scenario Category Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
          {scenarios.map((s) => {
            const Icon = s.icon;
            const isActive = !isSearching && activeScenario === s.id;
            return (
              <button
                key={s.id}
                type="button"
                className={`filter-chip ${isActive ? 'active' : ''}`}
                style={{
                  padding: '0.65rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  justifyContent: 'flex-start'
                }}
                onClick={() => {
                  setActiveScenario(s.id);
                  setSearchQuery('');
                }}
              >
                <Icon size={16} />
                <span style={{ fontWeight: 600 }}>{isKn ? s.titleKn : s.titleEn}</span>
              </button>
            );
          })}
        </div>

        {/* Conversation Dialogue Display Box */}
        <div className="card-box" style={{ background: '#FFFFFF', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--color-cream-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #EEE' }}>
            <h3 className="kn-heading" style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-flag-red)' }}>
              {isSearching
                ? (isKn ? `ಹುಡುಕಾಟದ ಫಲಿತಾಂಶಗಳು: "${searchQuery}"` : `Search Results for: "${searchQuery}"`)
                : (isKn ? dialogueData[activeScenario]?.titleKn : dialogueData[activeScenario]?.titleEn)}
            </h3>
            <span style={{ fontSize: '0.78rem', background: '#F5F5F5', padding: '0.2rem 0.6rem', borderRadius: '12px', color: '#666' }}>
              {displayDialogues.length} {isKn ? 'ಸಂಭಾಷಣಾ ಸಾಲುಗಳು' : 'dialogues'}
            </span>
          </div>

          {displayDialogues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666' }}>
              {isKn ? 'ಯಾವುದೇ ಸಂಭಾಷಣೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಪದವನ್ನು ಹುಡುಕಿ ನೋಡಿ.' : 'No conversations found matching your search. Try another keyword.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayDialogues.map((d, idx) => {
                const isUser = d.speakerKn === 'ನೀವು' || d.speakerEn === 'You';
                return (
                  <div
                    key={idx}
                    className={`dialogue-bubble-card reveal-on-scroll ${isUser ? 'user-turn' : 'partner-turn'}`}
                    style={{ '--bubble-index': idx }}
                  >
                  <div style={{ flex: 1 }}>
                    {/* Category pill if search active */}
                    {d.categoryTitle && (
                      <span style={{ display: 'inline-block', background: 'var(--color-flag-yellow-soft)', color: '#886200', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '8px', marginBottom: '0.35rem' }}>
                        {d.categoryTitle}
                      </span>
                    )}

                    {/* Speaker Badge */}
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-flag-red)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      {isKn ? d.speakerKn : d.speakerEn}
                    </div>

                    {/* Kannada Text */}
                    <div className="kn-heading" style={{ fontSize: '1.1rem', color: '#111', fontWeight: 700, lineHeight: 1.5 }}>
                      "{d.kn}"
                    </div>

                    {/* Pronunciation Transliteration */}
                    <div style={{ fontSize: '0.82rem', color: '#777', fontStyle: 'italic', marginTop: '0.25rem' }}>
                      🔊 {d.translit}
                    </div>

                    {/* English Translation */}
                    <div style={{ fontSize: '0.88rem', color: '#444', marginTop: '0.35rem' }}>
                      {d.en}
                    </div>
                  </div>

                  {/* Actions: Speak & Bookmark */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className={`btn-compact-speaker ${activeId === `everyday-${d.kn}` && isSpeaking ? 'speaking' : ''}`}
                      onClick={() => playAudio(d.kn)}
                      title={isKn ? "ಧ್ವನಿ ಆಲಿಸಿ" : "Listen audio"}
                    >
                      <Volume2 size={14} />
                      <span>{activeId === `everyday-${d.kn}` && isSpeaking ? (isKn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (isKn ? 'ಆಲಿಸಿ' : 'Listen')}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => handleSavePhrase(d)}
                      title={isKn ? "ವಾಕ್ಯ ಸಂಗಾತಿಯಲ್ಲಿ ಉಳಿಸಿ" : "Save to Companion"}
                    >
                      {savedFeedback === d.kn ? <Check size={14} color="#2ECC71" /> : <BookmarkPlus size={14} />}
                      <span>{savedFeedback === d.kn ? (isKn ? 'ಉಳಿಸಲಾಗಿದೆ' : 'Saved') : (isKn ? 'ಉಳಿಸಿ' : 'Save')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
