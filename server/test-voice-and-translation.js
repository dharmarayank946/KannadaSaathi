import { translateText } from '../client/src/utils/translationService.js';

async function runTestSuite() {
  console.log('====================================================');
  console.log('KannadaSaathi Voice, Speaker & Translation Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  // Test 1: EN -> KN via Dictionary
  try {
    const q1 = 'Where is the bus stand?';
    const r1 = await translateText(q1, 'en', 'kn');
    console.log(`[Test 1] EN -> KN (Dict): "${q1}" => "${r1.translatedText}" (Engine: ${r1.engine})`);
    if (r1.translatedText && r1.translatedText.includes('ಬಸ್')) {
      console.log('✓ PASS: Dictionary translation accurate.\n');
      passed++;
    } else {
      console.error('✗ FAIL: Expected Kannada translation containing "ಬಸ್".\n');
      failed++;
    }
  } catch (e) {
    console.error('✗ FAIL Test 1:', e.message);
    failed++;
  }

  // Test 2: EN -> KN Neural (Colloquial / Everyday sentence)
  try {
    const q2 = 'Can you please give me a ticket to Bengaluru?';
    const r2 = await translateText(q2, 'en', 'kn');
    console.log(`[Test 2] EN -> KN (Neural): "${q2}" => "${r2.translatedText}" (Engine: ${r2.engine})`);
    if (r2.translatedText && (r2.translatedText.includes('ಬೆಂಗಳೂರು') || r2.translatedText.includes('ಟಿಕೆಟ್'))) {
      console.log('✓ PASS: Neural EN->KN translation successful.\n');
      passed++;
    } else {
      console.error('✗ FAIL: Neural translation missing expected Kannada keywords.\n');
      failed++;
    }
  } catch (e) {
    console.error('✗ FAIL Test 2:', e.message);
    failed++;
  }

  // Test 3: KN -> EN Translation
  try {
    const q3 = 'ಕನ್ನಡ ಸಾಹಿತ್ಯವು ಸಾವಿರಾರು ವರ್ಷಗಳ ಇತಿಹಾಸವನ್ನು ಹೊಂದಿದೆ.';
    const r3 = await translateText(q3, 'kn', 'en');
    console.log(`[Test 3] KN -> EN (Neural): "${q3}" => "${r3.translatedText}" (Engine: ${r3.engine})`);
    if (r3.translatedText && r3.translatedText.toLowerCase().includes('kannada') && r3.translatedText.toLowerCase().includes('history')) {
      console.log('✓ PASS: Neural KN->EN translation successful.\n');
      passed++;
    } else {
      console.error('✗ FAIL: Expected English translation to mention Kannada history.\n');
      failed++;
    }
  } catch (e) {
    console.error('✗ FAIL Test 3:', e.message);
    failed++;
  }

  // Test 4: Live Voice Duo Conversation Exchange Simulation
  try {
    const p1KannadaSpeech = 'ನಾನು ಮೈಸೂರು ಅರಮನೆ ನೋಡಲು ಬಯಸುತ್ತೇನೆ';
    const p1Res = await translateText(p1KannadaSpeech, 'kn', 'en');
    console.log(`[Test 4.1] Duo Person 1 (KN -> EN): "${p1KannadaSpeech}" => "${p1Res.translatedText}"`);

    const p2EnglishSpeech = 'The Mysore Palace is open from 10 AM to 5:30 PM';
    const p2Res = await translateText(p2EnglishSpeech, 'en', 'kn');
    console.log(`[Test 4.2] Duo Person 2 (EN -> KN): "${p2EnglishSpeech}" => "${p2Res.translatedText}"`);

    if (p1Res.translatedText && p2Res.translatedText && p2Res.translatedText.includes('ಮೈಸೂರು')) {
      console.log('✓ PASS: Duo bidirectional voice translation verified.\n');
      passed++;
    } else {
      console.error('✗ FAIL: Duo bidirectional translation failed.\n');
      failed++;
    }
  } catch (e) {
    console.error('✗ FAIL Test 4:', e.message);
    failed++;
  }

  console.log('====================================================');
  console.log(`Total Tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
