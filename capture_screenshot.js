const { spawn } = require('child_process');
const fs = require('fs');

async function captureScreenshot() {
  console.log('Starting Chrome to capture screenshot of http://localhost:5173/ ...');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=d:\\Projects\\KannadaSaathi\\.chrome-screenshot-profile',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const targetsRes = await fetch('http://127.0.0.1:9222/json/list');
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.url.includes('localhost:5173'));
    if (!pageTarget) {
      console.error('No page target found');
      chromeProcess.kill();
      return;
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let msgIdCounter = 1;
    const send = (method, params = {}) => new Promise((resolve) => {
      const mid = msgIdCounter++;
      const handler = (event) => {
        const d = JSON.parse(event.data);
        if (d.id === mid) {
          ws.removeEventListener('message', handler);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });

    await new Promise(r => setTimeout(r, 2000));

    // Capture standard viewport screenshot
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshot-viewport.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved screenshot-viewport.png (1280x800)');

    // Scroll down 600px and capture screenshot of Voice Translator
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 600);`
    });
    await new Promise(r => setTimeout(r, 1000));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshot-scrolled.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved screenshot-scrolled.png (scrolled 600px)');

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    chromeProcess.kill();
  }
}

captureScreenshot();

