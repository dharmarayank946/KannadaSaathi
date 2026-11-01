// Sample pre-rendered documents and scenarios for quick evaluation

export const SAMPLE_SCENARIOS = [
  {
    id: 'college_notice',
    titleKn: 'ಕಾಲೇಜು ಪರೀಕ್ಷಾ ಸುತ್ತೋಲೆ',
    titleEn: 'College Exam Circular',
    category: 'ನೋಟಿಸ್ / Circular',
    descriptionKn: 'ಸೆಮಿಸ್ಟರ್ ಪರೀಕ್ಷಾ ಶುಲ್ಕ ಮತ್ತು ಅಂತಿಮ ದಿನಾಂಕದ ಅಧಿಕೃತ ಸೂಚನೆ',
    descriptionEn: 'Official circular regarding semester exam fees and deadline',
    imageUrl: 'https://images.unsplash.com/photo-1584697964190-7bb85c678a5e?auto=format&fit=crop&w=800&q=80',
    mockAnalysis: {
      whatItContainsKn: 'ಇದು ವಿಶ್ವವಿದ್ಯಾಲಯದ 4ನೇ ಮತ್ತು 6ನೇ ಸೆಮಿಸ್ಟರ್ ಪರೀಕ್ಷಾ ಅರ್ಜಿ ಮತ್ತು ಶುಲ್ಕ ಪಾವತಿಗೆ ಸಂಬಂಧಿಸಿದ ಅಧಿಕೃತ ಕಾಲೇಜು ಸುತ್ತೋಲೆಯಾಗಿದೆ.',
      summaryKn: 'ಇದು ವಿಶ್ವವಿದ್ಯಾಲಯದ 4ನೇ ಮತ್ತು 6ನೇ ಸೆಮಿಸ್ಟರ್ ಪರೀಕ್ಷಾ ಅರ್ಜಿ ಮತ್ತು ಶುಲ್ಕ ಪಾವತಿಗೆ ಸಂಬಂಧಿಸಿದ ಅಧಿಕೃತ ಕಾಲೇಜು ಸುತ್ತೋಲೆಯಾಗಿದೆ.',
      extractedText: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY\nCIRCULAR: Exam Registration for 4th & 6th Sem\nLast Date for Fee Submission: 28-Nov-2026\nPenalty-free fee: ₹1,850. Late fee after 28th: ₹500.\nVenue: College Accounts Section / Online Student Portal.',
      importantDetails: {
        dateOrDeadline: '28 ನವೆಂಬರ್ 2026 (ದಂಡವಿಲ್ಲದೆ ಪಾವತಿಸಲು ಕೊನೆಯ ದಿನ)',
        amountOrFees: '₹1,850 (ಸಾಮಾನ್ಯ ಶುಲ್ಕ) / ₹500 (ವಿಳಂಬ ಶುಲ್ಕ)',
        instructionsKn: 'ವಿದ್ಯಾರ್ಥಿಗಳು ಕಾಲೇಜು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ ಅಥವಾ ಲೆಕ್ಕಪತ್ರ ವಿಭಾಗದಲ್ಲಿ ರಶೀದಿ ಪಡೆಯಬೇಕು.',
        actionRequiredKn: '1. ಕಾಲೇಜು ಐಡಿ ಪರಿಶೀಲನೆ 2. ₹1,850 ಶುಲ್ಕ ಪಾವತಿ 3. ರಶೀದಿಯನ್ನು ವಿಭಾಗ ಮುಖ್ಯಸ್ಥರಿಗೆ (HOD) ಸಲ್ಲಿಸುವುದು.'
      },
      suggestedNextSteps: [
        'ಕಾಲೇಜು ಪರೀಕ್ಷಾ ಶುಲ್ಕ ₹1,850 ಪಾವತಿಸಿ',
        'ಶುಲ್ಕ ಪಾವತಿ ರಶೀದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಪ್ರಿಂಟ್ ತೆಗೆದುಕೊಳ್ಳಿ',
        'HOD ಕಚೇರಿಗೆ ಅರ್ಜಿ ಮತ್ತು ರಶೀದಿ ಸಲ್ಲಿಸಿ (ನವೆಂಬರ್ 28 ರೊಳಗೆ)'
      ],
      uncertaintiesKn: 'ಆನ್‌ಲೈನ್ ಪಾವತಿ ಸರ್ವರ್ ನಿರ್ವಹಣೆ ವಿವರಗಳನ್ನು ನೋಟಿಸ್‌ನಲ್ಲಿ ಉಲ್ಲೇಖಿಸಿಲ್ಲ, ಕಾಲೇಜು ಲೆಕ್ಕಪತ್ರ ವಿಭಾಗದಲ್ಲಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'
    }
  },
  {
    id: 'farmer_crop',
    titleKn: 'ರೈತರ ಬೆಳೆ ಎಲೆ ರೋಗ ಲಕ್ಷಣ',
    titleEn: 'Farmer Crop Leaf Symptoms',
    category: 'ಕೃಷಿ / Agriculture',
    descriptionKn: 'ಟೊಮೆಟೊ ಎಲೆಗಳ ಮೇಲಿನ ಕಂದು ಮಚ್ಚೆಗಳು ಮತ್ತು ಹಳದಿ ಅಂಚುಗಳು',
    descriptionEn: 'Tomato leaf brown spots and yellow margin symptoms',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    mockAnalysis: {
      whatItContainsKn: 'ಈ ಚಿತ್ರದಲ್ಲಿ ಟೊಮೆಟೊ ಸಸ್ಯದ ಎಲೆಗಳ ಮೇಲೆ ಆರಂಭಿಕ ಎಲೆ ಚುಕ್ಕೆ ಅಥವಾ ಬ್ಲೈಟ್ (Early Blight) ರೋಗದ ಲಕ್ಷಣಗಳು ಕಂಡುಬರುತ್ತಿವೆ.',
      summaryKn: 'ಈ ಚಿತ್ರದಲ್ಲಿ ಟೊಮೆಟೊ ಸಸ್ಯದ ಎಲೆಗಳ ಮೇಲೆ ಆರಂಭಿಕ ಎಲೆ ಚುಕ್ಕೆ ಅಥವಾ ಬ್ಲೈಟ್ (Early Blight) ರೋಗದ ಲಕ್ಷಣಗಳು ಕಂಡುಬರುತ್ತಿವೆ.',
      extractedText: 'ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ಕ್ಷೇತ್ರ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ: ಶಿಲೀಂಧ್ರ ಬಾಧೆ - ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ ವೃತ್ತಾಕಾರದ ಮಚ್ಚೆಗಳು.',
      importantDetails: {
        dateOrDeadline: 'ತಕ್ಷಣ (ಮಳೆ ಅಥವಾ ತೇವಾಂಶ ಹೆಚ್ಚಾಗುವ ಮುನ್ನವೇ ಸಿಂಪಡಣೆ ಅಗತ್ಯ)',
        amountOrFees: 'ಅಂದಾಜು ಶಿಲೀಂಧ್ರನಾಶಕ ವೆಚ್ಚ: ₹350 - ₹450',
        instructionsKn: 'ಬಾಧಿತ ಎಲೆಗಳನ್ನು ತಕ್ಷಣ ಕತ್ತರಿಸಿ ತೋಟದಿಂದ ಹೊರಗೆ ಸುಟ್ಟುಹಾಕಿ. ಗಿಡಗಳ ಬುಡದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
        actionRequiredKn: 'ಮ್ಯಾಂಕೋಜೆಬ್ (Mancozeb 75% WP) 2 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ ಅಥವಾ ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.'
      },
      suggestedNextSteps: [
        'ಹಾನಿಗೊಳಗಾದ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ನಾಶಮಾಡಿ',
        'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರದಿಂದ ಶಿಲೀಂಧ್ರನಾಶಕ (Mancozeb) ತನ್ನಿ',
        'ಸಂಜೆ ವೇಳೆ 2 ಗ್ರಾಂ/ಲೀಟರ್ ನೀರಿನಲ್ಲಿ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ'
      ],
      uncertaintiesKn: 'ಚಿತ್ರದಲ್ಲಿ ಕಾಂಡದ ಭಾಗ ಪೂರ್ಣವಾಗಿ ಕಾಣುತ್ತಿಲ್ಲವಾದ್ದರಿಂದ ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಬಾಧೆ ಇದೆಯೇ ಎಂದು ತಜ್ಞರಿಂದ ಪರಿಶೀಲಿಸುವುದು ಸೂಕ್ತ.'
    }
  },
  {
    id: 'electricity_bill',
    titleKn: 'ಬೆಸ್ಕಾಂ ವಿದ್ಯುತ್ ಬಿಲ್',
    titleEn: 'Electricity Bill (BESCOM)',
    category: 'ಬಿಲ್ / Utility Bill',
    descriptionKn: 'ಮಾಸಿಕ ವಿದ್ಯುತ್ ಬಳಕೆ, ಒಟ್ಟು ಮೊತ್ತ ಮತ್ತು ಗೃಹ ಜ್ಯೋತಿ ಲೆಕ್ಕಾಚಾರ',
    descriptionEn: 'Monthly power consumption and bill payment due date',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    mockAnalysis: {
      whatItContainsKn: 'ಇದು ಬೆಸ್ಕಾಂ (BESCOM) ವಿದ್ಯುತ್ ಬಿಲ್ ಆಗಿದೆ. ಗೃಹ ಜ್ಯೋತಿ ಯೋಜನೆಯ ರಿಯಾಯಿತಿ ಮತ್ತು ಅಂತಿಮ ಪಾವತಿ ದಿನಾಂಕವನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.',
      summaryKn: 'ಇದು ಬೆಸ್ಕಾಂ (BESCOM) ವಿದ್ಯುತ್ ಬಿಲ್ ಆಗಿದೆ. ಗೃಹ ಜ್ಯೋತಿ ಯೋಜನೆಯ ರಿಯಾಯಿತಿ ಮತ್ತು ಅಂತಿಮ ಪಾವತಿ ದಿನಾಂಕವನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.',
      extractedText: 'BESCOM - Bangalore Electricity Supply Company\nConsumer ID: 541092817\nBilling Period: 01-Oct-2026 to 31-Oct-2026\nNet Amount Payable: ₹420.00\nDue Date: 12-Nov-2026\nDisconnection Date: 20-Nov-2026',
      importantDetails: {
        dateOrDeadline: '12 ನವೆಂಬರ್ 2026 (ಕೊನೆಯ ದಿನಾಂಕ)',
        amountOrFees: '₹420.00 (ಪಾವತಿಸಬೇಕಾದ ನಿವ್ವಳ ಮೊತ್ತ)',
        instructionsKn: '12 ನವೆಂಬರ್ ಒಳಗೆ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅಥವಾ ಬೆಸ್ಕಾಂ ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಾವತಿಸಿದರೆ 5% ರಿಯಾಯಿತಿ ಲಭ್ಯ.',
        actionRequiredKn: 'ಗ್ರಾಹಕ ಸಂಖ್ಯೆ 541092817 ಬಳಸಿ UPI ಅಥವಾ ಬೆಸ್ಕಾಂ ಅಧಿಕೃತ ಆ್ಯಪ್ ಮೂಲಕ ₹420 ಪಾವತಿಸಿ.'
      },
      suggestedNextSteps: [
        'ಬೆಸ್ಕಾಂ ಗ್ರಾಹಕ ಐಡಿ 541092817 ಪರಿಶೀಲಿಸಿ',
        '₹420 ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿಸಿ (ನವೆಂಬರ್ 12 ರೊಳಗೆ)',
        'ಪಾವತಿ ದೃಢೀಕರಣ ರಶೀದಿಯನ್ನು ಉಳಿಸಿಕೊಳ್ಳಿ'
      ],
      uncertaintiesKn: 'ಮೀಟರ್ ರೀಡಿಂಗ್ ದಿನಾಂಕ ಮುದ್ರಣವು ಬಲಭಾಗದಲ್ಲಿ ಸ್ವಲ್ಪ ಮಸುಕಾಗಿದೆ; ಬಿಲ್‌ನಲ್ಲಿರುವ ಗ್ರಾಹಕ ಸಂಖ್ಯೆ ದೃಢಪಡಿಸಿಕೊಳ್ಳಿ.'
    }
  }
];

export const KARNATAKA_CITIES = [
  { nameKn: 'ಬೆಂಗಳೂರು', nameEn: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { nameKn: 'ಮೈಸೂರು', nameEn: 'Mysuru', lat: 12.2958, lon: 76.6394 },
  { nameKn: 'ಹುಬ್ಬಳ್ಳಿ - ಧಾರವಾಡ', nameEn: 'Hubballi', lat: 15.3647, lon: 75.1240 },
  { nameKn: 'ಮಂಗಳೂರು', nameEn: 'Mangaluru', lat: 12.9141, lon: 74.8560 },
  { nameKn: 'ಬೆಳಗಾವಿ', nameEn: 'Belagavi', lat: 15.8497, lon: 74.4977 },
  { nameKn: 'ಕಲಬುರಗಿ', nameEn: 'Kalaburagi', lat: 17.3297, lon: 76.8343 },
  { nameKn: 'ಶಿವಮೊಗ್ಗ', nameEn: 'Shivamogga', lat: 13.9299, lon: 75.5681 },
  { nameKn: 'ದಾವಣಗೆರೆ', nameEn: 'Davanagere', lat: 14.4644, lon: 75.9218 },
  { nameKn: 'ಬಳ್ಳಾರಿ', nameEn: 'Ballari', lat: 15.1394, lon: 76.9214 },
  { nameKn: 'ಉಡುಪಿ', nameEn: 'Udupi', lat: 13.3409, lon: 74.7421 }
];
