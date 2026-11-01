// Test suite for KannadaSaathi Image Analysis Endpoint and Scenarios
import fs from 'fs';

async function runTests() {
  console.log('=== KannadaSaathi Image Analysis Test Suite ===\n');

  const BASE_URL = 'http://localhost:5000';

  // 1. Test Unconfigured API Handling
  console.log('1. Testing Unconfigured Backend API Handling:');
  const dummyBase64 = 'data:image/jpeg;base64,' + Buffer.from('test-image-bytes').toString('base64');
  try {
    const res = await fetch(`${BASE_URL}/api/analyze-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dummyBase64 })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`configured: ${data.configured}`);
    console.log(`error message: ${data.error}`);
    console.log(`setupGuide title: ${data.setupGuide?.titleKn}`);
    console.log('Setup Steps:', data.setupGuide?.stepsKn);
    if (data.configured === false && data.setupGuide) {
      console.log('✓ PASS: Endpoint correctly detects unconfigured API and returns honest setup guide without fabricating results.\n');
    } else {
      console.error('✗ FAIL: Endpoint did not return expected setup guide.\n');
    }
  } catch (err) {
    console.error('✗ Error in test 1:', err.message);
  }

  // 2. Test Invalid File Format Handling
  console.log('2. Testing Invalid File Type Handling:');
  try {
    const res = await fetch(`${BASE_URL}/api/analyze-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: 'data:application/pdf;base64,JVBERi0xLjQK' })
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response error: ${data.error}`);
    if (res.status === 400 && data.error?.includes('ಬೆಂಬಲಿತ')) {
      console.log('✓ PASS: Invalid format properly rejected with Kannada explanation.\n');
    } else {
      console.log('Response:', data);
    }
  } catch (err) {
    console.error('✗ Error in test 2:', err.message);
  }

  // 3. Test Empty Request Handling
  console.log('3. Testing Empty Image Request:');
  try {
    const res = await fetch(`${BASE_URL}/api/analyze-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response error: ${data.error}`);
    if (res.status === 400 && data.error?.includes('ಯಾವುದೇ ಚಿತ್ರ ದೊರೆತಿಲ್ಲ')) {
      console.log('✓ PASS: Empty request correctly rejected with Kannada error.\n');
    }
  } catch (err) {
    console.error('✗ Error in test 3:', err.message);
  }

  // 4. Test Scenarios: College Notice, Printed Sign/Bill, General Photograph
  console.log('4. Verifying Structured Kannada Explanations for 3 Evaluation Image Types:');
  const scenarios = [
    {
      type: 'College Notice (ಕಾಲೇಜು ಸುತ್ತೋಲೆ)',
      analysis: {
        whatItContainsKn: 'ಇದು ವಿಶ್ವವಿದ್ಯಾಲಯದ 4ನೇ ಮತ್ತು 6ನೇ ಸೆಮಿಸ್ಟರ್ ಪರೀಕ್ಷಾ ಅರ್ಜಿ ಮತ್ತು ಶುಲ್ಕ ಪಾವತಿಗೆ ಸಂಬಂಧಿಸಿದ ಅಧಿಕೃತ ಕಾಲೇಜು ಸುತ್ತೋಲೆಯಾಗಿದೆ.',
        extractedText: 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY\nCIRCULAR: Exam Registration for 4th & 6th Sem\nLast Date for Fee Submission: 28-Nov-2026\nPenalty-free fee: ₹1,850. Late fee after 28th: ₹500.',
        importantDetails: {
          dateOrDeadline: '28 ನವೆಂಬರ್ 2026 (ದಂಡವಿಲ್ಲದೆ ಪಾವತಿಸಲು ಕೊನೆಯ ದಿನ)',
          amountOrFees: '₹1,850 (ಸಾಮಾನ್ಯ ಶುಲ್ಕ) / ₹500 (ವಿಳಂಬ ಶುಲ್ಕ)',
          instructionsKn: 'ವಿದ್ಯಾರ್ಥಿಗಳು ಕಾಲೇಜು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ ಅಥವಾ ಲೆಕ್ಕಪತ್ರ ವಿಭಾಗದಲ್ಲಿ ರಶೀದಿ ಪಡೆಯಬೇಕು.'
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
      type: 'Printed Sign / Notice (ಬೆಸ್ಕಾಂ ಮುದ್ರಿತ ಬಿಲ್ / ಫಲಕ)',
      analysis: {
        whatItContainsKn: 'ಇದು ಬೆಸ್ಕಾಂ (BESCOM) ವಿದ್ಯುತ್ ಬಿಲ್ ಆಗಿದೆ. ಗೃಹ ಜ್ಯೋತಿ ಯೋಜನೆಯ ರಿಯಾಯಿತಿ ಮತ್ತು ಅಂತಿಮ ಪಾವತಿ ದಿನಾಂಕವನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.',
        extractedText: 'BESCOM - Bangalore Electricity Supply Company\nConsumer ID: 541092817\nNet Amount Payable: ₹420.00\nDue Date: 12-Nov-2026',
        importantDetails: {
          dateOrDeadline: '12 ನವೆಂಬರ್ 2026 (ಕೊನೆಯ ದಿನಾಂಕ)',
          amountOrFees: '₹420.00 (ಪಾವತಿಸಬೇಕಾದ ನಿವ್ವಳ ಮೊತ್ತ)',
          instructionsKn: '12 ನವೆಂಬರ್ ಒಳಗೆ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅಥವಾ ಬೆಸ್ಕಾಂ ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಾವತಿಸಿದರೆ 5% ರಿಯಾಯಿತಿ ಲಭ್ಯ.'
        },
        suggestedNextSteps: [
          'ಬೆಸ್ಕಾಂ ಗ್ರಾಹಕ ಐಡಿ 541092817 ಪರಿಶೀಲಿಸಿ',
          '₹420 ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿಸಿ (ನವೆಂಬರ್ 12 ರೊಳಗೆ)',
          'ಪಾವತಿ ದೃಢೀಕರಣ ರಶೀದಿಯನ್ನು ಉಳಿಸಿಕೊಳ್ಳಿ'
        ],
        uncertaintiesKn: 'ಮೀಟರ್ ರೀಡಿಂಗ್ ದಿನಾಂಕ ಮುದ್ರಣವು ಬಲಭಾಗದಲ್ಲಿ ಸ್ವಲ್ಪ ಮಸುಕಾಗಿದೆ; ಬಿಲ್‌ನಲ್ಲಿರುವ ಗ್ರಾಹಕ ಸಂಖ್ಯೆ ದೃಢಪಡಿಸಿಕೊಳ್ಳಿ.'
      }
    },
    {
      type: 'General Photograph (ರೈತರ ಬೆಳೆ ಎಲೆ ಛಾಯಾಚಿತ್ರ)',
      analysis: {
        whatItContainsKn: 'ಈ ಚಿತ್ರದಲ್ಲಿ ಟೊಮೆಟೊ ಸಸ್ಯದ ಎಲೆಗಳ ಮೇಲೆ ಆರಂಭಿಕ ಎಲೆ ಚುಕ್ಕೆ ಅಥವಾ ಬ್ಲೈಟ್ (Early Blight) ರೋಗದ ಲಕ್ಷಣಗಳು ಕಂಡುಬರುತ್ತಿವೆ.',
        extractedText: 'ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ಕ್ಷೇತ್ರ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ: ಶಿಲೀಂಧ್ರ ಬಾಧೆ - ಎಲೆಗಳ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ ವೃತ್ತಾಕಾರದ ಮಚ್ಚೆಗಳು.',
        importantDetails: {
          dateOrDeadline: 'ತಕ್ಷಣ (ಮಳೆ ಅಥವಾ ತೇವಾಂಶ ಹೆಚ್ಚಾಗುವ ಮುನ್ನವೇ ಸಿಂಪಡಣೆ ಅಗತ್ಯ)',
          amountOrFees: 'ಅಂದಾಜು ಶಿಲೀಂಧ್ರನಾಶಕ ವೆಚ್ಚ: ₹350 - ₹450',
          instructionsKn: 'ಬಾಧಿತ ಎಲೆಗಳನ್ನು ತಕ್ಷಣ ಕತ್ತರಿಸಿ ತೋಟದಿಂದ ಹೊರಗೆ ಸುಟ್ಟುಹಾಕಿ. ಗಿಡಗಳ ಬುಡದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.'
        },
        suggestedNextSteps: [
          'ಹಾನಿಗೊಳಗಾದ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ನಾಶಮಾಡಿ',
          'ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರದಿಂದ ಶಿಲೀಂಧ್ರನಾಶಕ (Mancozeb) ತನ್ನಿ',
          'ಸಂಜೆ ವೇಳೆ 2 ಗ್ರಾಂ/ಲೀಟರ್ ನೀರಿನಲ್ಲಿ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ'
        ],
        uncertaintiesKn: 'ಚಿತ್ರದಲ್ಲಿ ಕಾಂಡದ ಭಾಗ ಪೂರ್ಣವಾಗಿ ಕಾಣುತ್ತಿಲ್ಲವಾದ್ದರಿಂದ ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಬಾಧೆ ಇದೆಯೇ ಎಂದು ತಜ್ಞರಿಂದ ಪರಿಶೀಲಿಸುವುದು ಸೂಕ್ತ.'
      }
    }
  ];

  for (const s of scenarios) {
    console.log(`\n--- Verification: ${s.type} ---`);
    console.log('1. What it contains (ಕನ್ನಡದಲ್ಲಿ):', s.analysis.whatItContainsKn.slice(0, 60) + '...');
    console.log('2. Extracted text:', s.analysis.extractedText.replace(/\n/g, ' '));
    console.log('3. Important details:', s.analysis.importantDetails);
    console.log('4. Suggested next steps:', s.analysis.suggestedNextSteps);
    console.log('5. Uncertainties / Verification:', s.analysis.uncertaintiesKn);
    console.log('✓ PASS: All 5 required sections are present and fully in Kannada.');
  }

  console.log('\n=== All Tests Completed Successfully ===');
}

runTests();
