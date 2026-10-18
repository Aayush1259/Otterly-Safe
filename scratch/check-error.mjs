import http from 'http';

// 1. Launch Chrome with remote debugging
import { spawn } from 'child_process';

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--remote-debugging-port=9222',
  '--headless=new',
  '--disable-gpu',
  'http://localhost:5173/'
]);

await new Promise((resolve) => setTimeout(resolve, 2000));

// 2. Fetch WebSocket URL from Chrome
http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    try {
      const list = JSON.parse(data);
      console.log('Tabs:', list.map(t => ({ title: t.title, url: t.url, ws: t.webSocketDebuggerUrl })));
      const tab = list.find(t => t.url.includes('localhost:5173'));
      if (!tab || !tab.webSocketDebuggerUrl) {
        console.log('No matching tab found');
        chrome.kill();
        process.exit(0);
      }

      // 3. Connect WebSocket (Node 22 has built-in WebSocket)
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.exceptionThrown') {
          console.error('EXCEPTION THROWN:', JSON.stringify(msg.params.exceptionDetails, null, 2));
        } else if (msg.method === 'Runtime.consoleAPICalled') {
          console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description));
        }
      };

      setTimeout(() => {
        console.log('Done listening');
        ws.close();
        chrome.kill();
        process.exit(0);
      }, 3000);
    } catch (e) {
      console.error('Error parsing tab list:', e);
      chrome.kill();
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Failed to query chrome debugging port:', err);
  chrome.kill();
  process.exit(1);
});
