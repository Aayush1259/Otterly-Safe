import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9231',
  '--headless=new',
  '--window-size=1440,900',
  '--disable-gpu',
  'http://localhost:5173/'
]);

await new Promise((resolve) => setTimeout(resolve, 2500));

http.get('http://127.0.0.1:9231/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    try {
      const list = JSON.parse(data);
      const tab = list.find(t => t.url.includes('localhost:5173'));
      const ws = new WebSocket(tab.webSocketDebuggerUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: { expression: 'Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Mini-Games"))?.click()' }
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
          fs.writeFileSync('scratch/screenshot-activities-menu.png', Buffer.from(msg.result.data, 'base64'));
          console.log('Saved scratch/screenshot-activities-menu.png');
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
