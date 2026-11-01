// Test Suite for KannadaSaathi Action Plan Generator
import http from 'http';

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
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
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('=== KannadaSaathi Action Plan Test Suite ===\n');

  // 1. Test Scholarship Action Plan
  console.log('1. Testing Scholarship Plan Generation:');
  const res1 = await postJson('/api/action-plan', { query: 'ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಹೇಗೆ?' });
  console.log('Status:', res1.status);
  console.log('Title (Kn):', res1.data.plan?.titleKn);
  console.log('Title (En):', res1.data.plan?.titleEn);
  console.log('Summary (Kn):', res1.data.plan?.summaryKn);
  console.log('Estimated Duration:', res1.data.plan?.estimatedDurationKn);
  console.log('Verification Source:', res1.data.plan?.verificationSource);
  console.log('Required Documents Count:', res1.data.plan?.requiredDocumentsKn?.length);
  console.log('Steps Count:', res1.data.plan?.stepsKn?.length);
  console.log('First Step:', res1.data.plan?.stepsKn?.[0]);
  console.log('Warnings Count:', res1.data.plan?.warningsKn?.length);
  if (
    res1.status === 200 &&
    res1.data.plan?.titleKn &&
    res1.data.plan?.stepsKn?.length >= 5 &&
    res1.data.plan?.requiredDocumentsKn?.length > 0 &&
    res1.data.plan?.warningsKn?.length > 0
  ) {
    console.log('✓ PASS: Scholarship plan generated with all required sections.\n');
  } else {
    console.error('✗ FAIL: Scholarship plan structure invalid.');
    process.exit(1);
  }

  // 2. Test Exam Prep Action Plan
  console.log('2. Testing Exam Preparation Plan Generation:');
  const res2 = await postJson('/api/action-plan', { query: 'ಕಾಲೇಜು ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆ ವೇಳಾಪಟ್ಟಿ' });
  console.log('Status:', res2.status);
  console.log('Title (Kn):', res2.data.plan?.titleKn);
  console.log('Steps (English Title Sample):', res2.data.plan?.stepsEn?.[0]?.title);
  if (res2.status === 200 && res2.data.plan?.stepsKn?.length > 0) {
    console.log('✓ PASS: Exam preparation plan verified.\n');
  } else {
    console.error('✗ FAIL: Exam preparation plan invalid.');
    process.exit(1);
  }

  // 3. Test Small Business Launch Action Plan
  console.log('3. Testing Small Business Launch Plan Generation:');
  const res3 = await postJson('/api/action-plan', { query: 'ಹೊಸ ಸಣ್ಣ ಉದ್ಯಮ MSME ಆರಂಭಿಸುವುದು ಹೇಗೆ?' });
  console.log('Status:', res3.status);
  console.log('Title (Kn):', res3.data.plan?.titleKn);
  console.log('Udyam Warning:', res3.data.plan?.warningsKn?.[0]);
  if (res3.status === 200 && res3.data.plan?.requiredDocumentsKn?.length > 0) {
    console.log('✓ PASS: Small Business plan verified.\n');
  } else {
    console.error('✗ FAIL: Small Business plan invalid.');
    process.exit(1);
  }

  // 4. Test Hackathon Preparation Plan
  console.log('4. Testing Hackathon Preparation Plan Generation:');
  const res4 = await postJson('/api/action-plan', { query: 'ಕಾಲೇಜು ಕೋಡಿಂಗ್ ಹ್ಯಾಕಥಾನ್ ಗೆಲ್ಲುವುದು ಹೇಗೆ?' });
  console.log('Status:', res4.status);
  console.log('Title (Kn):', res4.data.plan?.titleKn);
  console.log('Duration:', res4.data.plan?.estimatedDurationKn);
  if (res4.status === 200 && res4.data.plan?.stepsKn?.length > 0) {
    console.log('✓ PASS: Hackathon plan verified.\n');
  } else {
    console.error('✗ FAIL: Hackathon plan invalid.');
    process.exit(1);
  }

  // 5. Test Government Scheme Application Plan
  console.log('5. Testing Government Scheme Application Plan Generation:');
  const res5 = await postJson('/api/action-plan', { query: 'ಸೇವಾ ಸಿಂಧು ಸರ್ಕಾರಿ ಯೋಜನೆ ಅರ್ಜಿ' });
  console.log('Status:', res5.status);
  console.log('Title (Kn):', res5.data.plan?.titleKn);
  console.log('Verification Source:', res5.data.plan?.verificationSource);
  if (res5.status === 200 && res5.data.plan?.stepsKn?.length > 0) {
    console.log('✓ PASS: Government scheme plan verified.\n');
  } else {
    console.error('✗ FAIL: Government scheme plan invalid.');
    process.exit(1);
  }

  // 6. Test Custom Arbitrary Task Plan
  console.log('6. Testing Custom Arbitrary Task Plan Generation:');
  const res6 = await postJson('/api/action-plan', { query: 'ಹೊಸ ಮನೆ ನಿರ್ಮಾಣಕ್ಕೆ ಮುನ್ನ ಗೃಹ ಸಾಲ ಮತ್ತು ಪರವಾನಗಿ' });
  console.log('Status:', res6.status);
  console.log('Title (Kn):', res6.data.plan?.titleKn);
  console.log('Steps Count:', res6.data.plan?.stepsKn?.length);
  if (res6.status === 200 && res6.data.plan?.stepsKn?.length > 0) {
    console.log('✓ PASS: Custom task plan generated gracefully.\n');
  } else {
    console.error('✗ FAIL: Custom task plan invalid.');
    process.exit(1);
  }

  // 7. Test Empty Input Validation
  console.log('7. Testing Empty Query Validation:');
  const res7 = await postJson('/api/action-plan', { query: '' });
  console.log('Status:', res7.status);
  console.log('Error message:', res7.data.error);
  if (res7.status === 400) {
    console.log('✓ PASS: Empty query correctly rejected with HTTP 400.\n');
  } else {
    console.error('✗ FAIL: Expected HTTP 400 for empty query.');
    process.exit(1);
  }

  console.log('=== All Action Plan Tests Passed Successfully ===');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
