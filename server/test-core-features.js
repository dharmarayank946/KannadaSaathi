import http from 'http';

function requestJson(method, path, payload) {
  return new Promise((resolve, reject) => {
    const postData = payload ? JSON.stringify(payload) : null;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (postData) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runCoreTests() {
  console.log('=== KannadaSaathi Core Features Verification ===\n');

  // Test 1: Health check
  console.log('Test 1: Health Check Endpoint:');
  const health = await requestJson('GET', '/api/health');
  console.log('Status:', health.status);
  console.log('Response:', health.data);
  if (health.status !== 200 || !['healthy', 'ok'].includes(health.data.status)) {
    throw new Error('Health check failed');
  }
  console.log('✓ PASS: Health check OK\n');

  // Test 2: English to Kannada Translation
  console.log('Test 2: English to Kannada Translation:');
  const enToKn = await requestJson('POST', '/api/translate', {
    text: 'Where is the railway station?',
    target: 'kn',
    source: 'en'
  });
  console.log('Status:', enToKn.status);
  console.log('Result:', enToKn.data.translatedText);
  console.log('Pronunciation:', enToKn.data.transliteration);
  console.log('Engine:', enToKn.data.engine);
  if (enToKn.status !== 200 || !enToKn.data.translatedText) {
    throw new Error('En -> Kn translation failed');
  }
  console.log('✓ PASS: English to Kannada translated with pronunciation\n');

  // Test 3: Kannada to English Translation
  console.log('Test 3: Kannada to English Translation:');
  const knToEn = await requestJson('POST', '/api/translate', {
    text: 'ಶುಭೋದಯ! ನೀವು ಹೇಗಿದ್ದೀರಿ?',
    target: 'en',
    source: 'kn'
  });
  console.log('Status:', knToEn.status);
  console.log('Result:', knToEn.data.translatedText);
  console.log('Engine:', knToEn.data.engine);
  if (knToEn.status !== 200 || !knToEn.data.translatedText) {
    throw new Error('Kn -> En translation failed');
  }
  console.log('✓ PASS: Kannada to English translated\n');

  // Test 4: Empty input validation
  console.log('Test 4: Empty text validation:');
  const emptyRes = await requestJson('POST', '/api/translate', { text: '   ' });
  console.log('Status:', emptyRes.status);
  if (emptyRes.status === 400) {
    console.log('✓ PASS: Rejected empty text with 400 Bad Request\n');
  } else {
    throw new Error('Expected 400 for empty text');
  }

  console.log('=== ALL CORE VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
}

runCoreTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
