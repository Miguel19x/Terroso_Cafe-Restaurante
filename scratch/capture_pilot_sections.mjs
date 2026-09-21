import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\arang\\.gemini\\antigravity-ide\\brain\\d725f19b-a659-4855-9690-93df59c60d24';
const PORT_CDP = 9226;

const VIEWPORTS = [
  { name: '1358x602', width: 1358, height: 602, dpr: 1 },
  { name: '1086x482', width: 1086, height: 482, dpr: 1.25 }
];

const SECTIONS = ['#inicio', '#historia', '#reservas'];

export async function capturePilot(label, url = 'http://localhost:4323') {
  console.log(`Capturing pilot sections for ${label}...`);
  const profileDir = path.join(ARTIFACTS_DIR, 'scratch', `edge_pilot_${label}`);
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch(e) {}
  }

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT_CDP}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profileDir}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    console.log('Connecting to Edge...');
    const listRes = await fetch(`http://127.0.0.1:${PORT_CDP}/json/list`);
    const pages = await listRes.json();
    console.log('Pages found:', pages.length);
    const ws = new WebSocket(pages[0].webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();
    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && pending.has(d.id)) {
        const { resolve, reject } = pending.get(d.id);
        pending.delete(d.id);
        if (d.error) reject(d.error);
        else resolve(d.result);
      }
    };
    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 2000));

    for (const vp of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.dpr,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 600));

      for (const sel of SECTIONS) {
        // Scroll to section and get its rect
        const rectRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.querySelector('${sel}');
            if (!el) return null;
            el.scrollIntoView({ block: 'start' });
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height };
          })()`,
          returnByValue: true
        });

        await new Promise(r => setTimeout(r, 400));

        const rect = rectRes.result.value;
        if (rect) {
          // Take screenshot of viewport showing the section
          const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
          const shotName = `pilot_${label}_${sel.replace('#', '')}_${vp.name}.jpg`;
          const shotPath = path.join(ARTIFACTS_DIR, shotName);
          fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
          console.log(`Saved screenshot: ${shotName}`);
        }
      }
    }
    ws.close();
  } finally {
    edgeProc.kill();
  }
}

capturePilot('before_fluid').catch(console.error);
