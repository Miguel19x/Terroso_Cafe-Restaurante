import { spawn } from 'child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9223;

async function main() {
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--user-data-dir=C:\\Users\\arang\\.gemini\\antigravity-ide\\brain\\d725f19b-a659-4855-9690-93df59c60d24\\scratch\\edge_profile_inspect',
    'about:blank'
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const pages = await listRes.json();
    const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.id && pending.has(d.id)) {
        const { resolve } = pending.get(d.id);
        pending.delete(d.id);
        resolve(d.result);
      }
    };
    await new Promise((r) => ws.onopen = r);
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://localhost:4323' });
    await new Promise((r) => setTimeout(r, 2000));

    // Test 1358x602
    await send('Emulation.setDeviceMetricsOverride', { width: 1358, height: 602, deviceScaleFactor: 1, mobile: false });
    await new Promise((r) => setTimeout(r, 500));

    const res1358 = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#reservas');
        const grid = sec.querySelector('.grid');
        const col1 = grid.children[0];
        const col2 = grid.children[1];
        const card = col2.querySelector('.bg-surface-container-lowest');
        return {
          secH: sec.getBoundingClientRect().height,
          gridH: grid.getBoundingClientRect().height,
          col1H: col1.getBoundingClientRect().height,
          col2H: col2.getBoundingClientRect().height,
          cardH: card ? card.getBoundingClientRect().height : 0,
          cardChildren: card ? Array.from(card.children).map(c => ({ tag: c.tagName, cls: c.className, h: c.getBoundingClientRect().height })) : []
        };
      })()`,
      returnByValue: true
    });
    console.log('1358x602 inspection:', res1358.result?.value || res1358.exceptionDetails || res1358);

    // Test 1086x482
    await send('Emulation.setDeviceMetricsOverride', { width: 1086, height: 482, deviceScaleFactor: 1.25, mobile: false });
    await new Promise((r) => setTimeout(r, 500));

    const res1086 = await send('Runtime.evaluate', {
      expression: `(() => {
        const sec = document.querySelector('#reservas');
        const grid = sec.querySelector('.grid');
        const col1 = grid.children[0];
        const col2 = grid.children[1];
        const card = col2.querySelector('.bg-surface-container-lowest');
        return {
          secH: sec.getBoundingClientRect().height,
          gridH: grid.getBoundingClientRect().height,
          col1H: col1.getBoundingClientRect().height,
          col2H: col2.getBoundingClientRect().height,
          cardH: card ? card.getBoundingClientRect().height : 0,
          cardChildren: card ? Array.from(card.children).map(c => ({ tag: c.tagName, cls: c.className, h: c.getBoundingClientRect().height })) : []
        };
      })()`,
      returnByValue: true
    });
    console.log('1086x482 inspection:', JSON.stringify(res1086.result.value, null, 2));

    ws.close();
  } finally {
    edgeProc.kill();
  }
}
main().catch(console.error);
