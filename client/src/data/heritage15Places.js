/**
 * heritage15Places.js
 * Exactly 15 unique Historical Places & Architectural Monuments of Karnataka.
 * Single data source for Priority 2 requirements:
 * Title Kn: ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
 * Title En: Historical Places & Architectural Monuments
 *
 * Filters:
 * 1. 'historical' -> ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು (Historical Places)
 * 2. 'monument'   -> ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು (Architectural Monuments)
 *
 * All local images downloaded and verified under /images/heritage/
 */

export const HERITAGE_15_PLACES = [
  {
    number: 1,
    id: 'hampi',
    titleKn: 'ಹಂಪಿ',
    titleEn: 'Hampi',
    subtitleKn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಭವ್ಯ ರಾಜಧಾನಿ',
    subtitleEn: 'Imperial Capital of the Vijayanagara Empire',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಹೊಸಪೇಟೆ, ವಿಜಯನಗರ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Hosapete, Vijayanagara District',
    dynastyKn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ (೧೪-೧೬ನೇ ಶತಮಾನ)',
    dynastyEn: 'Vijayanagara Empire (14th–16th Century CE)',
    descKn: 'ತುಂಗಭದ್ರಾ ನದಿಯ ತೀರದಲ್ಲಿರುವ ಹಂಪಿ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣ. ಇಲ್ಲಿನ ವಿಠ್ಠಲ ದೇಗುಲದ ಕಲ್ಲಿನ ರಥ (Stone Chariot), ೫೬ ಸಂಗೀತ ಸ್ತಂಭಗಳು ಮತ್ತು ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯವು ಭಾರತೀಯ ವಾಸ್ತುಶಿಲ್ಪದ ಪರಮೋಚ್ಛ ಶಿಖರ.',
    descEn: 'Located on the banks of Tungabhadra River, Hampi is a UNESCO World Heritage site celebrated for the iconic monolithic Stone Chariot, 56 musical pillars at Vittala Temple, and Virupaksha Temple.',
    imagePath: '/images/heritage/hampi.jpg',
    sourceUrl: 'https://whc.unesco.org/en/list/241/',
    sourceName: 'UNESCO World Heritage Centre / ASI',
    isUnesco: true,
    unescoYear: '1986',
    attribution: {
      source: 'Wikimedia Commons / ASI',
      license: 'CC BY-SA 4.0 / Public Domain',
      author: 'Deepak TL / Wikimedia Commons'
    }
  },
  {
    number: 2,
    id: 'mysore-palace',
    titleKn: 'ಮೈಸೂರು ಅರಮನೆ (ಅಂಬಾವಿಲಾಸ)',
    titleEn: 'Mysore Palace (Amba Vilas)',
    subtitleKn: 'ಒಡೆಯರ್ ರಾಜಮನೆತನದ ಭವ್ಯ ಅರಮನೆ',
    subtitleEn: 'Royal Seat of the Wadiyar Dynasty',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಮೈಸೂರು ನಗರ, ಮೈಸೂರು ಜಿಲ್ಲೆ',
    townDistrictEn: 'Mysuru City, Mysuru District',
    dynastyKn: 'ಒಡೆಯರ್ ರಾಜವಂಶ (ಹೆನ್ರಿ ಇರ್ವಿನ್ ವಾಸ್ತುಶಿಲ್ಪ, ೧೯೧೨)',
    dynastyEn: 'Wadiyar Dynasty (Indo-Saracenic design by Henry Irwin, 1912)',
    descKn: 'ಇಂಡೋ-ಸಾರ್ಸೆನಿಕ್ ಶೈಲಿಯ ಅದ್ಭುತ ವಾಸ್ತುಶಿಲ್ಪದ ಅಂಬಾವಿಲಾಸ ಅರಮನೆಯಲ್ಲಿ ಚಿನ್ನದ ಸಿಂಹಾಸನ, ಕಲ್ಯಾಣ ಮಂಟಪದ ಬೆಲ್ಜಿಯಂ ಬಣ್ಣದ ಗಾಜು ಮತ್ತು ದಸರಾ ಸಮಯದಲ್ಲಿ ೧ ಲಕ್ಷ ದೀಪಗಳ ದೀಪಾಲಂಕಾರ ಕಂಗೊಳಿಸುತ್ತದೆ.',
    descEn: 'A masterpiece of Indo-Saracenic architecture completed in 1912 for the Wadiyars. World-renowned for its stained-glass Kalyana Mantapa, golden throne, and illumination with nearly 100,000 light bulbs.',
    imagePath: '/images/heritage/mysore-palace.jpg',
    sourceUrl: 'https://mysorepalace.karnataka.gov.in/',
    sourceName: 'Mysore Palace Board / Karnataka Tourism',
    isUnesco: false,
    attribution: {
      source: 'Supplied link / Kannada Prabha & Wikimedia Commons',
      license: 'Public Domain / Editorial Karnataka Heritage',
      author: 'Wadiyar Heritage Archives'
    }
  },
  {
    number: 3,
    id: 'gol-gumbaz',
    titleKn: 'ಗೋಲ್ ಗುಂಬಜ್',
    titleEn: 'Gol Gumbaz',
    subtitleKn: 'ವಿಶ್ವದ ಎರಡನೇ ಅತಿ ದೊಡ್ಡ ಕಂಬಗಳಿಲ್ಲದ ಗುಮ್ಮಟ',
    subtitleEn: 'World’s Second-Largest Unsupported Dome',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ವಿಜಯಪುರ (ಬಿಜಾಪುರ), ವಿಜಯಪುರ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Vijayapura (Bijapur), Vijayapura District',
    dynastyKn: 'ಆದಿಲ್ ಶಾಹಿ ರಾಜವಂಶ (ಮೊಹಮ್ಮದ್ ಆದಿಲ್ ಶಾಹ್, ೧೬೫೬)',
    dynastyEn: 'Adil Shahi Dynasty (Mohammed Adil Shah, 1656 CE)',
    descKn: 'ವಿಜಯಪುರದ ಮೊಹಮ್ಮದ್ ಆದಿಲ್ ಶಾಹ್‌ನ ಭವ್ಯ ಸಮಾಧಿ ಭವನ. ಯಾವುದೇ ಕಂಬಗಳ ಆಧಾರವಿಲ್ಲದ ೪೪ ಮೀಟರ್ ಅಗಲದ ಬೃಹತ್ ಗುಮ್ಮಟ ಹಾಗೂ ೧೧ ಬಾರಿ ಶಬ್ದ ಅನುರಣಿಸುವ ಪಿಸುಗುಟ್ಟುವ ಮೊಗಸಾಲೆ (Whispering Gallery) ಇಲ್ಲಿನ ವಿಶೇಷ.',
    descEn: 'The monumental mausoleum of Mohammed Adil Shah featuring a colossal 44-meter acoustic dome built without pillars and the famous Whispering Gallery where the faintest whisper echoes 11 times.',
    imagePath: '/images/heritage/gol-gumbaz.jpg',
    sourceUrl: 'https://asidharwadcircle.karnataka.gov.in/',
    sourceName: 'Archaeological Survey of India (ASI Dharwad Circle)',
    isUnesco: false,
    attribution: {
      source: 'Supplied link / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      author: 'Ashok Prabhakaran / Wikimedia'
    }
  },
  {
    number: 4,
    id: 'badami-cave-temples',
    titleKn: 'ಬಾದಾಮಿ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು',
    titleEn: 'Badami Cave Temples',
    subtitleKn: 'ಕೆಂಪು ಮರಳುಗಲ್ಲಿನ ಬಂಡೆ ಕೊರೆದ ಗುಹಾ ದೇಗುಲಗಳು',
    subtitleEn: 'Rock-Cut Cave Shrines in Red Sandstone',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಬಾದಾಮಿ, ಬಾಗಲಕೋಟೆ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Badami, Bagalkote District',
    dynastyKn: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು (೬-೮ನೇ ಶತಮಾನ)',
    dynastyEn: 'Badami Chalukyas (6th–8th Century CE)',
    descKn: 'ಅಗಸ್ತ್ಯ ತೀರ್ಥ ಕೆರೆಯ ದಂಡೆಯ ಕೆಂಪು ಮರಳುಗಲ್ಲಿನ ಬಂಡೆಗಳಲ್ಲಿ ಕೊರೆಯಲಾದ ೪ ಗುಹಾ ದೇವಾಲಯಗಳು. ೧೮ ಕೈಗಳ ನರ್ತನ ನಟರಾಜ, ವರಾಹ ಮತ್ತು ತ್ರಿವಿಕ್ರಮ ಶಿಲ್ಪಗಳು ಚಾಲುಕ್ಯ ಕಲೆಯ ಅದ್ಭುತ ನಿದರ್ಶನಗಳು.',
    descEn: 'Four magnificent rock-cut cave temples sculpted into red sandstone cliffs overlooking Agastya Lake, renowned for the 18-armed dancing Nataraja, Vishnu reliefs, and Jain Tirthankara sanctums.',
    imagePath: '/images/heritage/badami-cave-temples.jpg',
    sourceUrl: 'https://karnatakatourism.org/tour-item/badami/',
    sourceName: 'Karnataka Tourism / ASI Dharwad Circle',
    isUnesco: false,
    attribution: {
      source: 'Supplied link / Turuhi & Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      author: 'Sanyam Bahga / Wikimedia'
    }
  },
  {
    number: 5,
    id: 'belur-chennakeshava-temple',
    titleKn: 'ಬೇಲೂರು ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ',
    titleEn: 'Belur Chennakeshava Temple',
    subtitleKn: 'ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆಯ ದಿವ್ಯ ನಕ್ಷತ್ರಾಕಾರ ದೇಗುಲ',
    subtitleEn: 'Exquisite Hoysala Star-Shaped Temple',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಬೇಲೂರು, ಹಾಸನ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Belur, Hassan District',
    dynastyKn: 'ಹೊಯ್ಸಳ ಸಾಮ್ರಾಜ್ಯ (ವಿಷ್ಣುವರ್ಧನ, ೧೧೧೭)',
    dynastyEn: 'Hoysala Empire (King Vishnuvardhana, 1117 CE)',
    descKn: '೧೧೧೭ರಲ್ಲಿ ತಲಕಾಡು ವಿಜಯದ ನೆನಪಿನಲ್ಲಿ ನಿರ್ಮಿತವಾದ ಹೊಯ್ಸಳ ದೇಗುಲ. ಕಪ್ಪು ಬಳಪದ ಕಲ್ಲಿನಲ್ಲಿ ಕೆತ್ತಲಾದ ೪೨ ದರ್ಪಣ ಸುಂದರಿ ಮದನಿಕೆಯರು ಮತ್ತು ನಕ್ಷತ್ರಾಕಾರದ ಜಗತಿ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ಮಾನ್ಯತೆ ಪಡೆದಿವೆ.',
    descEn: 'Commissioned in 1117 CE by King Vishnuvardhana. Globally celebrated for its star-shaped soapstone plinth and 42 Madanika bracket figures. Inscribed on UNESCO World Heritage list in 2023.',
    imagePath: '/images/heritage/belur-chennakeshava-temple.jpg',
    sourceUrl: 'https://whc.unesco.org/en/list/1670/',
    sourceName: 'UNESCO World Heritage Centre / Sacred Ensembles of the Hoysalas',
    isUnesco: true,
    unescoYear: '2023',
    attribution: {
      source: 'Supplied link / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
      author: 'Bikashrd / Wikimedia Commons'
    }
  },
  {
    number: 6,
    id: 'halebidu-hoysaleswara-temple',
    titleKn: 'ಹಳೇಬೀಡು ಹೊಯ್ಸಳೇಶ್ವರ ದೇವಾಲಯ',
    titleEn: 'Halebidu Hoysaleswara Temple',
    subtitleKn: '೩೫,೦೦೦ ಕೆತ್ತನೆಗಳ ಹೊಯ್ಸಳ ದ್ವಿಕೂಟ ದೇಗುಲ',
    subtitleEn: 'Twin-Sanctum Masterpiece with 35,000 Carvings',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಹಳೇಬೀಡು (ದ್ವಾರಸಮುದ್ರ), ಹಾಸನ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Halebidu (Dwarasamudra), Hassan District',
    dynastyKn: 'ಹೊಯ್ಸಳ ಸಾಮ್ರಾಜ್ಯ (೧೧೨೧)',
    dynastyEn: 'Hoysala Empire (King Vishnuvardhana & Ketamalla, 1121 CE)',
    descKn: 'ಹೊಯ್ಸಳರ ರಾಜಧಾನಿ ದ್ವಾರಸಮುದ್ರದಲ್ಲಿದ್ದ ದ್ವಿಕೂಟ ಶಿವ ದೇವಾಲಯ. ಇದರ ಹೊರಗೋಡೆಗಳಲ್ಲಿ ರಾಮಾಯಣ, ಮಹಾಭಾರತ ಮತ್ತು ಭಾಗವತದ ಕಥೆಗಳನ್ನು ವಿವರಿಸುವ ೩೫,೦೦೦ಕ್ಕೂ ಹೆಚ್ಚು ಸಾಟಿಯಿಲ್ಲದ ಕೆತ್ತನೆಗಳಿವೆ.',
    descEn: 'Twin-shrine Shiva temple in ancient Dwarasamudra showcasing an exterior relief of over 35,000 intricate soapstone sculptures narrating Indian epics. Inscribed as a UNESCO World Heritage site in 2023.',
    imagePath: '/images/heritage/halebidu-hoysaleswara-temple.jpg',
    sourceUrl: 'https://whc.unesco.org/en/list/1670/',
    sourceName: 'UNESCO World Heritage Centre / ASI',
    isUnesco: true,
    unescoYear: '2023',
    attribution: {
      source: 'Supplied link / Holidify & Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      author: 'Dineshkannambadi / Wikimedia'
    }
  },
  {
    number: 7,
    id: 'shravanabelagola-gomateshwara',
    titleKn: 'ಶ್ರವಣಬೆಳಗೊಳ ಗೊಮ್ಮಟೇಶ್ವರ',
    titleEn: 'Shravanabelagola Gomateshwara',
    subtitleKn: '೫೭ ಅಡಿ ಎತ್ತರದ ವಿಶ್ವವಿಖ್ಯಾತ ಏಕಶಿಲಾ ಬಾಹುಬಲಿ',
    subtitleEn: '57-Foot Monolithic Bahubali Colossus',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಶ್ರವಣಬೆಳಗೊಳ, ಹಾಸನ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Shravanabelagola, Hassan District',
    dynastyKn: 'ಪಶ್ಚಿಮ ಗಂಗ ರಾಜವಂಶ (ಚಾವುಂಡರಾಯ, ೯೮೧)',
    dynastyEn: 'Western Ganga Dynasty (Chavundaraya, 981 CE)',
    descKn: 'ವಿಂಧ್ಯಗಿರಿ ಬೆಟ್ಟದ ತುದಿಯಲ್ಲಿ ಕ್ರಿ.ಶ. ೯೮೧ರಲ್ಲಿ ಚಾವುಂಡರಾಯನಿಂದ ಕೆತ್ತಲ್ಪಟ್ಟ ೫೭ ಅಡಿ ಎತ್ತರದ ಏಕಶಿಲಾ ಬಾಹುಬಲಿ ಮೂರ್ತಿ. ತ್ಯಾಗ ಮತ್ತು ಅಹಿಂಸೆಯ ಪ್ರತೀಕವಾಗಿದ್ದು, ಪ್ರತಿ ೧೨ ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಮಹಾಮಸ್ತಕಾಭಿಷೇಕ ಜರುಗುತ್ತದೆ.',
    descEn: 'The 57-foot (17.5 m) monolithic granite colossus erected atop Vindhyagiri Hill in 981 CE by Chavundaraya. Symbolizing peace and renunciation, it hosts the sacred Mahamastakabhisheka every 12 years.',
    imagePath: '/images/heritage/shravanabelagola-gomateshwara.jpg',
    sourceUrl: 'https://karnatakatourism.org/tour-item/shravanabelagola/',
    sourceName: 'Archaeology & Heritage Department Karnataka',
    isUnesco: false,
    attribution: {
      source: 'Supplied link / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      author: 'Ananth H V / Wikimedia'
    }
  },
  {
    number: 8,
    id: 'pattadakal-monuments',
    titleKn: 'ಪಟ್ಟದಕಲ್ಲು ಸ್ಮಾರಕ ಸಮೂಹ',
    titleEn: 'Pattadakal Monuments',
    subtitleKn: 'ನಾಗರ ಮತ್ತು ದ್ರಾವಿಡ ಶೈಲಿಗಳ ಪವಿತ್ರ ಸಂಗಮ',
    subtitleEn: 'Confluence of Nagara & Dravidian Architecture',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಪಟ್ಟದಕಲ್ಲು, ಬಾಗಲಕೋಟೆ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Pattadakal, Bagalkote District',
    dynastyKn: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು (೭-೮ನೇ ಶತಮಾನ)',
    dynastyEn: 'Badami Chalukyas (7th–8th Century CE)',
    descKn: 'ಚಾಲುಕ್ಯ ರಾಜರ ಪಟ್ಟಾಭಿಷೇಕದ ತಾಣವಾಗಿದ್ದ ಮಲಪ್ರಭಾ ನದೀ ತೀರದ ಯುನೆಸ್ಕೋ ತಾಣ. ಉತ್ತರ ಭಾರತೀಯ (ನಾಗರ) ಮತ್ತು ದಕ್ಷಿಣ ಭಾರತೀಯ (ದ್ರಾವಿಡ) ಶೈಲಿಗಳು ಸಾಮರಸ್ಯದಿಂದ ಬೆರೆತ ಅದ್ಭುತ ದೇಗುಲ ಸಂಕೀರ್ಣ.',
    descEn: 'A UNESCO World Heritage site on the Malaprabha River where Badami Chalukya kings were crowned. Celebrated for the harmonious synthesis of northern Nagara and southern Dravidian temple architecture.',
    imagePath: '/images/heritage/pattadakal-monuments.jpg',
    sourceUrl: 'https://whc.unesco.org/en/list/373/',
    sourceName: 'UNESCO World Heritage Centre / ASI',
    isUnesco: true,
    unescoYear: '1987',
    attribution: {
      source: 'Supplied link / TourMyIndia & Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      author: 'Mukherjee / Wikimedia'
    }
  },
  {
    number: 9,
    id: 'aihole-historic-temples',
    titleKn: 'ಐಹೊಳೆ ಐತಿಹಾಸಿಕ ದೇವಾಲಯಗಳು',
    titleEn: 'Aihole Historic Temples',
    subtitleKn: 'ಭಾರತೀಯ ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪದ ತೊಟ್ಟಿಲು',
    subtitleEn: 'Cradle of Indian Temple Architecture',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಐಹೊಳೆ, ಬಾಗಲಕೋಟೆ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Aihole, Bagalkote District',
    dynastyKn: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು (೫-೮ನೇ ಶತಮಾನ)',
    dynastyEn: 'Badami Chalukyas (5th–8th Century CE)',
    descKn: '೧೨೦ಕ್ಕೂ ಹೆಚ್ಚು ಪ್ರಾಚೀನ ಶಿಲಾ ದೇಗುಲಗಳಿರುವ ‘ಭಾರತೀಯ ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪದ ಪ್ರಯೋಗಶಾಲೆ’. ಬೌದ್ಧ ಚೈತ್ಯಾಕಾರದ ದುರ್ಗಾ ದೇಗುಲ, ಲಾಡ್ ಖಾನ್ ದೇವಾಲಯ ಮತ್ತು ಮೇಗುತಿ ಶಾಸನಗಳು ಇಲ್ಲಿವೆ.',
    descEn: 'Known as the "Cradle of Indian Temple Architecture," housing over 120 stone temples. Features the apsidal Durga Temple, the historic Lad Khan temple, and poet Ravikirti’s 634 CE Meguti inscription.',
    imagePath: '/images/heritage/aihole-historic-temples.jpg',
    sourceUrl: 'https://karnatakatourism.org/tour-item/aihole/',
    sourceName: 'ASI Dharwad Circle / Architectural Digest India',
    isUnesco: false,
    attribution: {
      source: 'Supplied link / Architectural Digest & Wikimedia',
      license: 'CC BY-SA 4.0',
      author: 'Ms Sarah Welch / Wikimedia'
    }
  },
  {
    number: 10,
    id: 'chitradurga-fort',
    titleKn: 'ಚಿತ್ರದುರ್ಗದ ಕಲ್ಲಿನ ಕೋಟೆ',
    titleEn: 'Chitradurga Fort',
    subtitleKn: 'ಏಳು ಸುತ್ತಿನ ಕಲ್ಲಿನ ಅಜೇಯ ಕೋಟೆ ಮತ್ತು ಓಬವ್ವನ ಕಿಂಡಿ',
    subtitleEn: 'Seven-Ringed Stone Citadel of Brave Onake Obavva',
    filterType: 'historical', // ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು
    townDistrictKn: 'ಚಿತ್ರದುರ್ಗ ನಗರ, ಚಿತ್ರದುರ್ಗ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Chitradurga City, Chitradurga District',
    dynastyKn: 'ಚಿತ್ರದುರ್ಗದ ನಾಯಕರು, ವಿಜಯನಗರ (೧೦-೧೮ನೇ ಶತಮಾನ)',
    dynastyEn: 'Nayakas of Chitradurga & Vijayanagara (10th–18th Century CE)',
    descKn: 'ಏಳು ಸುತ್ತಿನ ಬೃಹತ್ ಕಲ್ಲಿನ ಪ್ರಾಕಾರಗಳು, ೧೯ ಹೆಬ್ಬಾಗಿಲುಗಳು, ಮಳೆನೀರು ಕೊಯ್ಲು ಜಲಾಶಯಗಳು ಮತ್ತು ಶತ್ರು ಸೈನಿಕರನ್ನು ಒನಕೆಯಿಂದ ಸಂಹರಿಸಿದ ವೀರವನಿತೆ ಓಬವ್ವಳ "ಓಬವ್ವನ ಕಿಂಡಿ"ಯನ್ನು ಹೊಂದಿರುವ ಅಜೇಯ ಕೋಟೆ.',
    descEn: 'An impregnable hill citadel featuring seven concentric fortification walls, 19 gateway bastions, interconnected rainwater harvesting tanks, and the legendary crevice defended by heroine Onake Obavva.',
    imagePath: '/images/heritage/chitradurga-fort.jpg',
    sourceUrl: 'https://karnatakatourism.org/tour-item/chitradurga-fort/',
    sourceName: 'Archaeological Survey of India / KSTDC',
    isUnesco: false,
    attribution: {
      source: 'Supplied link / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      author: 'Pavithrah / Wikimedia'
    }
  },
  {
    number: 11,
    id: 'bidar-fort',
    titleKn: 'ಬೀದರ್ ಕೋಟೆ ಮತ್ತು ರಂಗೀನ್ ಮಹಲ್',
    titleEn: 'Bidar Fort & Rangin Mahal',
    subtitleKn: 'ಬಹಮನಿ ಸುಲ್ತಾನರ ಕೆಂಪು ಜಂಬುಮಣ್ಣಿನ ಭವ್ಯ ಕೋಟೆ',
    subtitleEn: 'Laterite Citadel with Inlaid Rangin Mahal & Karez',
    filterType: 'historical', // ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು
    townDistrictKn: 'ಬೀದರ್ ನಗರ, ಬೀದರ್ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Bidar City, Bidar District',
    dynastyKn: 'ಬಹಮನಿ ಮತ್ತು ಬರೀದ್ ಶಾಹಿ ಸುಲ್ತಾನರು (ಅಹ್ಮದ್ ಶಾಹ್ ವಾಲಿ, ೧೪೨೭)',
    dynastyEn: 'Bahmani Sultanate (Ahmad Shah Wali, 1427 CE) & Barid Shahis',
    descKn: 'ಕೆಂಪು ಜಂಬುಮಣ್ಣಿನ ಬಂಡೆಯಲ್ಲಿ ನಿರ್ಮಿತವಾದ ಭವ್ಯ ಕೋಟೆ. ಮದರ್-ಆಫ್-ಪರ್ಲ್ ಕೆತ್ತನೆಗಳುಳ್ಳ ರಂಗೀನ್ ಮಹಲ್, ಸೋಲ್ಹಾ ಕಂಬಾ ಮಸೀದಿ ಮತ್ತು ಪ್ರಾಚೀನ ಕರೇಜ್ (ಭೂಗತ ಸುರಂಗ ನೀರಾವರಿ) ವ್ಯವಸ್ಥೆಯನ್ನು ಒಳಗೊಂಡಿದೆ.',
    descEn: 'A colossal bastion built on red laterite soil in 1427 CE. Features the exquisite Rangin Mahal with wood inlays and Persian tilework, Solah Khamba Mosque, and the historic subterranean Karez water canal system.',
    imagePath: '/images/heritage/bidar-fort.jpg',
    sourceUrl: 'https://karnatakatourism.org/tour-item/bidar-fort/',
    sourceName: 'Archaeological Survey of India / Karnataka Tourism',
    isUnesco: false,
    attribution: {
      source: 'Supplied link / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      author: 'Vsvinaykumar / Wikimedia'
    }
  },
  {
    number: 12,
    id: 'srirangapatna-fort',
    titleKn: 'ಶ್ರೀರಂಗಪಟ್ಟಣ ಕೋಟೆ ಮತ್ತು ಜುಮ್ಮಾ ಮಸೀದಿ',
    titleEn: 'Srirangapatna Fort & Jama Masjid',
    subtitleKn: 'ಕಾವೇರಿ ದ್ವೀಪ ಕೋಟೆ, ರಂಗನಾಥಸ್ವಾಮಿ ದೇಗುಲ ಮತ್ತು ಟಿಪ್ಪು ನೆಲೆ',
    subtitleEn: 'Historic Island Fort on the Cauvery River',
    filterType: 'historical', // ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು
    townDistrictKn: 'ಶ್ರೀರಂಗಪಟ್ಟಣ, ಮಂಡ್ಯ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Srirangapatna, Mandya District',
    dynastyKn: 'ವಿಜಯನಗರ, ಒಡೆಯರ್, ಹೈದರಾಲಿ ಮತ್ತು ಟಿಪ್ಪು ಸುಲ್ತಾನ್ (೧೫-೧೮ನೇ ಶತಮಾನ)',
    dynastyEn: 'Vijayanagara, Mysore Kings & Tipu Sultan (15th–18th Century CE)',
    descKn: 'ಕಾವೇರಿ ನದಿಯಿಂದ ಸುತ್ತುವರೆದ ನಡುಗಡ್ಡೆ ಕೋಟೆ. ಶ್ರೀ ರಂಗನಾಥಸ್ವಾಮಿ ದೇವಾಲಯ, ಟಿಪ್ಪು ಸುಲ್ತಾನನ ಜುಮ್ಮಾ ಮಸೀದಿ (ಮಸ್ಜಿದ್-ಎ-ಅಲಾ), ದರಿಯಾ ದೌಲತ್ ಬಾಗ್ ಮತ್ತು ೧೭೯೯ರ ಆಂಗ್ಲೋ-ಮೈಸೂರು ಯುದ್ಧದ ಸ್ಮಾರಕಗಳು ಇಲ್ಲಿವೆ.',
    descEn: 'Encircled by the Cauvery River, this island citadel houses Sri Ranganathaswamy Temple, Tipu Sultan’s Jama Masjid (Masjid-i-Ala), Dariya Daulat teakwood summer palace, and the 1799 battle fortifications.',
    imagePath: '/images/heritage/srirangapatna-fort.jpg',
    sourceUrl: 'https://karnatakatourism.org/tour-item/srirangapatna/',
    sourceName: 'ASI Bengaluru Circle / Karnataka Tourism',
    isUnesco: false,
    attribution: {
      source: 'Supplied link / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
      author: 'Coyau / Wikimedia Commons'
    }
  },
  {
    number: 13,
    id: 'banavasi',
    titleKn: 'ಬನವಾಸಿ',
    titleEn: 'Banavasi',
    subtitleKn: 'ಕದಂಬ ಸಾಮ್ರಾಜ್ಯದ ಕರ್ನಾಟಕದ ಪ್ರಥಮ ರಾಜಧಾನಿ',
    subtitleEn: 'First Capital of Karnataka under the Kadambas',
    filterType: 'historical', // ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು
    townDistrictKn: 'ಬನವಾಸಿ, ಉತ್ತರ ಕನ್ನಡ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Banavasi, Uttara Kannada District',
    dynastyKn: 'ಕದಂಬ ರಾಜವಂಶ (೪-೬ನೇ ಶತಮಾನ)',
    dynastyEn: 'Kadamba Dynasty (4th–6th Century CE)',
    descKn: 'ಕರ್ನಾಟಕದ ಪ್ರಪ್ರಥಮ ಸ್ವತಂತ್ರ ರಾಜವಂಶ ಕದಂಬರ ರಾಜಧಾನಿ. ಆದಿಕವಿ ಪಂಪನು "ಮಾನವನಾಗಿ ಹುಟ್ಟಿದರೆ ಬನವಾಸಿಯಲ್ಲಿ ಹುಟ್ಟಬೇಕು" ಎಂದು ಹಾಡಿದ ಪವಿತ್ರ ತಾಣ. ಮಧುಕೇಶ್ವರ ದೇವಾಲಯದ ಶಿಲ್ಪಕಲೆ ಮತ್ತು ಕಲ್ಲಿನ ಮಂಚ ವಿಶ್ವಪ್ರಸಿದ್ಧ.',
    descEn: 'The ancient capital of the Kadambas, Karnataka’s first native dynasty. Immortalized by poet Adikavi Pampa. Houses the Madhukeshwara temple with its monolithic stone cot and carved pillared halls.',
    imagePath: '/images/heritage/banavasi.jpg',
    sourceUrl: 'https://karnatakatourism.org/tour-item/banavasi/',
    sourceName: 'Karnataka Tourism / ASI',
    isUnesco: false,
    attribution: {
      source: 'Wikimedia Commons / ASI',
      license: 'CC BY-SA 3.0',
      author: 'Dineshkannambadi / Wikimedia'
    }
  },
  {
    number: 14,
    id: 'kudalasangama',
    titleKn: 'ಕೂಡಲಸಂಗಮ',
    titleEn: 'Kudalasangama',
    subtitleKn: 'ಕೃಷ್ಣಾ-ಮಲಪ್ರಭಾ ಸಂಗಮ ಹಾಗೂ ಜಗಜ್ಯೋತಿ ಬಸವಣ್ಣನವರ ಐಕ್ಯ ತಾಣ',
    subtitleEn: 'Sacred Confluence & Basavanna’s Resting Shrine',
    filterType: 'historical', // ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು
    townDistrictKn: 'ಕೂಡಲಸಂಗಮ, ಬಾಗಲಕೋಟೆ ಜಿಲ್ಲೆ',
    townDistrictEn: 'Kudalasangama, Bagalkote District',
    dynastyKn: 'ಕಲ್ಯಾಣ ಚಾಲುಕ್ಯರು & ಜಗಜ್ಯೋತಿ ಬಸವಣ್ಣ (೧೨ನೇ ಶತಮಾನ)',
    dynastyEn: 'Kalyana Chalukyas & Jagadjyoti Basavanna (12th Century CE)',
    descKn: 'ಕೃಷ್ಣಾ ಮತ್ತು ಮಲಪ್ರಭಾ ನದಿಗಳು ಒಂದಾಗುವ ಪವಿತ್ರ ಸಂಗಮ. ೧೨ನೇ ಶತಮಾನದ ಸಾಮಾಜಿಕ ಕ್ರಾಂತಿಯ ಹರಿಕಾರ ಜಗಜ್ಯೋತಿ ಬಸವಣ್ಣನವರು ವಿದ್ಯಾಭ್ಯಾಸ ಮಾಡಿ ಲಿಂಗೈಕ್ಯರಾದ ಪುಣ್ಯಭೂಮಿ. ನದಿಯ ನಡುವಿನ ಐಕ್ಯ ಮಂಟಪ ಮತ್ತು ಸಂಗಮನಾಥ ದೇವಾಲಯ ಪ್ರಸಿದ್ಧ.',
    descEn: 'The sacred river confluence of Krishna and Malaprabha where 12th-century philosopher-statesman Jagadjyoti Basavanna received education and attained spiritual union (Aikya). Features the glass-encased Aikya Mantapa.',
    imagePath: '/images/heritage/kudalasangama.jpg',
    sourceUrl: 'https://karnatakatourism.org/tour-item/kudalasangama/',
    sourceName: 'Kudalasangama Development Board / Karnataka Tourism',
    isUnesco: false,
    attribution: {
      source: 'Wikimedia Commons / Karnataka Tourism',
      license: 'CC BY-SA 3.0',
      author: 'Manjunath Doddamani / Wikimedia'
    }
  },
  {
    number: 15,
    id: 'somanathapura-chennakeshava-temple',
    titleKn: 'ಸೋಮನಾಥಪುರ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ',
    titleEn: 'Somanathapura Chennakeshava Temple',
    subtitleKn: 'ಹೊಯ್ಸಳ ತ್ರಿಕೂಟ ಶೈಲಿಯ ಅಖಂಡ ಶಿಲ್ಪಕಲಾ ವೈಭವ',
    subtitleEn: 'UNESCO-Inscribed Trikuta Hoysala Masterpiece',
    filterType: 'monument', // ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು
    townDistrictKn: 'ಸೋಮನಾಥಪುರ (ಟಿ. ನರಸೀಪುರ), ಮೈಸೂರು ಜಿಲ್ಲೆ',
    townDistrictEn: 'Somanathapura (T. Narasipura), Mysuru District',
    dynastyKn: 'ಹೊಯ್ಸಳ ಸಾಮ್ರಾಜ್ಯ (ಸೋಮನಾಥ ದಂಡನಾಯಕ, ೧೨೫೮)',
    dynastyEn: 'Hoysala Empire (General Somanatha, 1258 CE)',
    descKn: '೧೨೫೮ರಲ್ಲಿ ನಿರ್ಮಿತವಾದ ಹೊಯ್ಸಳರ ಅದ್ವಿತೀಯ ತ್ರಿಕೂಟ (ಮೂರು ಗರ್ಭಗುಡಿ) ದೇವಾಲಯ. ಕೇಶವ, ಜನಾರ್ದನ ಮತ್ತು ವೇಣುಗೋಪಾಲ ಮೂರ್ತಿಗಳು, ೧೬ ವಿಭಿನ್ನ ಸೀಲಿಂಗ್ ಕೆತ್ತನೆಗಳು ಹಾಗೂ ನಕ್ಷತ್ರಾಕಾರದ ಜಗತಿ ೨೦೨೩ರಲ್ಲಿ ಯುನೆಸ್ಕೋ ಮಾನ್ಯತೆ ಪಡೆದಿವೆ.',
    descEn: 'A perfectly preserved 1258 CE trikuta (triple-shrine) Hoysala masterpiece dedicated to Keshava, Janardhana, and Venugopala. Celebrated for 16 ornate ceiling domes. Inscribed on UNESCO World Heritage list in 2023.',
    imagePath: '/images/heritage/somanathapura-chennakeshava-temple.jpg',
    sourceUrl: 'https://whc.unesco.org/en/list/1670/',
    sourceName: 'UNESCO World Heritage Centre / ASI',
    isUnesco: true,
    unescoYear: '2023',
    attribution: {
      source: 'Wikimedia Commons / ASI',
      license: 'CC BY-SA 2.0',
      author: 'Jean-Pierre Dalbéra / Wikimedia'
    }
  }
];

export const HERITAGE_MAIN_SECTION = {
  titleKn: 'ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು',
  titleEn: 'Historical Places & Architectural Monuments',
  descKn: 'ಕರ್ನಾಟಕದ ಪರಂಪರೆಯನ್ನು ಸಾರುವ ೧೫ ಅಪ್ರತಿಮ ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು. ಇವುಗಳನ್ನು ನೈಜ ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ ಮತ್ತು ಅನ್ವೇಷಿಸಿ.',
  descEn: '15 iconic historical places and architectural monuments celebrating Karnataka’s heritage. Listen to descriptions in authentic audio.',
  totalCount: 15,
  filters: [
    { id: 'all', labelKn: 'ಎಲ್ಲಾ ೧೫ ತಾಣಗಳು', labelEn: 'All 15 Places' },
    { id: 'historical', labelKn: 'ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು', labelEn: 'Historical Places' },
    { id: 'monument', labelKn: 'ವಾಸ್ತುಶಿಲ್ಪದ ಸ್ಮಾರಕಗಳು', labelEn: 'Architectural Monuments' }
  ]
};
