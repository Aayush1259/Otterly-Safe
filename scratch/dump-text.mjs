import http from 'http';
import { spawn } from 'child_process';

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9223',
  '--headless=new',
  '--disable-gpu',
  'http://localhost:5173/'
]);

await new Promise((resolve) => setTimeout(resolve, 2000));

http.get('http://127.0.0.1:9223/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    try {
      const list = JSON.parse(data);
      const tab = list.find(t => t.url.includes('localhost:5173'));
      if (!tab) {
        console.log('No tab found');
        chrome.kill();
        process.exit(1);
      }
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: { expression: 'document.querySelector("main") ? document.querySelector("main").innerText.slice(0, 500) : "NO MAIN FOUND"' }
        }));
      };
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === 1) {
          console.log('RENDERED MAIN TEXT:\n', msg.result.result.value);
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
