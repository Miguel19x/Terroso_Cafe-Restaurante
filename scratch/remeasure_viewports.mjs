import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\arang\\.gemini\\antigravity-ide\\brain\\d725f19b-a659-4855-9690-93df59c60d24';
const PORT = 9222;

const VIEWPORTS = [
  { name: 'laptop_real_1358x602_100', width: 1358, height: 602, dpr: 1 },
  { name: 'laptop_real_1086x482_125', width: 1086, height: 482, dpr: 1.25 },
  { name: 'laptop_1366x640', width: 1366, height: 640, dpr: 1 },
  { name: 'laptop_1280x600', width: 1280, height: 600, dpr: 1 },
  { name: 'monitor_1440x900', width: 1440, height: 900, dpr: 1 },
  { name: 'tablet_1024x768', width: 1024, height: 768, dpr: 1 },
  { name: 'movil_390x844', width: 390, height: 844, dpr: 3 },
  { name: 'movil_360x640', width: 360, height: 640, dpr: 2 },
  { name: 'movil_landscape_844x390', width: 844, height: 390, dpr: 2 },
];

async function main() {
  console.log('Launching Edge headless...');
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\arang\\.gemini\\antigravity-ide\\brain\\d725f19b-a659-4855-9690-93df59c60d24\\scratch\\edge_profile_remeasure',
    'about:blank'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const pages = await listRes.json();
    const page = pages.find((p) => p.type === 'page') || pages[0];
    const wsUrl = page.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);

    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    await new Promise((resolve) => ws.onopen = resolve);

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

    console.log('Navigating to http://localhost:4323...');
    await send('Page.navigate', { url: 'http://localhost:4323' });
    await new Promise((r) => setTimeout(r, 2000));

    const results = [];

    for (const vp of VIEWPORTS) {
      console.log(`\n=== Measuring Viewport: ${vp.name} (${vp.width}x${vp.height}, DPR ${vp.dpr}) ===`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.dpr,
        mobile: vp.width < 768
      });

      await new Promise((r) => setTimeout(r, 500));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const header = document.querySelector('#site-header');
          const headerRect = header ? header.getBoundingClientRect() : { height: 0 };
          const headerH = Math.round(headerRect.height);
          const vpW = window.innerWidth;
          const vpH = window.innerHeight;
          const availH = vpH - headerH;

          const sectionSelectors = ['#inicio', '#menu', '#galeria', '#cifras', '#historia', '#testimonios', '#reservas', 'footer'];
          const sections = [];

          for (let i = 0; i < sectionSelectors.length; i++) {
            const sel = sectionSelectors[i];
            const el = document.querySelector(sel);
            if (!el) continue;

            const cs = window.getComputedStyle(el);
            const padTop = parseFloat(cs.paddingTop) || 0;
            const padBottom = parseFloat(cs.paddingBottom) || 0;
            const padY = Math.round(padTop + padBottom);

            const sectionRect = el.getBoundingClientRect();
            const contentEl = el.querySelector('.max-w-7xl') || el.firstElementChild;
            let rawContentHeight = 0;
            if (sel === '#galeria') {
              const headerEl = el.querySelector('.max-w-7xl');
              const trackEl = el.querySelector('#continuous-gallery-track') || el.querySelector('.gallery-card');
              if (headerEl && trackEl) {
                rawContentHeight = Math.round(trackEl.getBoundingClientRect().bottom - headerEl.getBoundingClientRect().top);
              } else {
                rawContentHeight = Math.round(sectionRect.height - padY);
              }
            } else {
              rawContentHeight = Math.round(contentEl ? contentEl.getBoundingClientRect().height : (sectionRect.height - padY));
            }

            // Total height including padding
            const totalWithPadding = Math.round(rawContentHeight + padY);

            // Last element inside this section
            const lastTextOrEl = contentEl ? (contentEl.lastElementChild || contentEl) : el.lastElementChild;
            const lastBottom = lastTextOrEl ? lastTextOrEl.getBoundingClientRect().bottom : sectionRect.bottom;

            let treguaPx = null;
            if (i < sectionSelectors.length - 1) {
              const nextEl = document.querySelector(sectionSelectors[i+1]);
              if (nextEl) {
                const nextContent = nextEl.querySelector('.max-w-7xl') || nextEl.firstElementChild;
                const nextFirstEl = nextContent ? (nextContent.firstElementChild || nextContent) : nextEl.firstElementChild;
                const nextTop = nextFirstEl ? nextFirstEl.getBoundingClientRect().top : nextEl.getBoundingClientRect().top;
                treguaPx = Math.round(nextTop - lastBottom);
              }
            }

            const overflowPx = Math.max(0, rawContentHeight + padY - availH);

            sections.push({
              id: sel,
              rawContentHeight,
              padTop: Math.round(padTop),
              padBottom: Math.round(padBottom),
              padY,
              totalWithPadding,
              availH,
              overflows: (rawContentHeight + padY) > availH,
              overflowDeltaPx: Math.round((rawContentHeight + padY) - availH),
              treguaNextPx: treguaPx
            });
          }

          return {
            vpW,
            vpH,
            headerH,
            availH,
            sections
          };
        })()`,
        returnByValue: true
      });

      const vpData = evalRes.result.value;
      results.push({ viewport: vp, data: vpData });

      // Screenshot for verification
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75 });
      const shotPath = path.join(ARTIFACTS_DIR, `screenshot_${vp.name}.jpg`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${shotPath}`);
    }

    const outPath = path.join(ARTIFACTS_DIR, 'scratch', 'remeasure_results.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    console.log(`\nRemeasurements saved to ${outPath}`);

    ws.close();
  } finally {
    edgeProc.kill();
  }
}

main().catch(console.error);
