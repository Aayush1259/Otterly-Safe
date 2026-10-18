import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9226',
  '--headless=new',
  '--window-size=1440,900',
  '--disable-gpu',
  'http://localhost:5173/'
]);

await new Promise((resolve) => setTimeout(resolve, 2500));

http.get('http://127.0.0.1:9226/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    try {
      const list = JSON.parse(data);
      const tab = list.find(t => t.url.includes('localhost:5173'));
      if (!tab) {
        chrome.kill();
        process.exit(1);
      }
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        // Find button that contains "Begin Defense Activity"
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: { expression: 'Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Begin Defense Activity"))?.click()' }
        }));
      };
      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          await new Promise(r => setTimeout(r, 600));
          ws.send(JSON.stringify({
            id: 2,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        } else if (msg.id === 2) {
          const buf = Buffer.from(msg.result.data, 'base64');
          fs.writeFileSync('scratch/screenshot-onboarding-game.png', buf);
          console.log('Saved screenshot to scratch/screenshot-onboarding-game.png');
          ws.close();
          chrome.kill();
          process.exit(0);
        }
      };
    } catch (e) {
      console.error(e);
      chrome.kill();
      process.exit(1);
    }
  });
});
