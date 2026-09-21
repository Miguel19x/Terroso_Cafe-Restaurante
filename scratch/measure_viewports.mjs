import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\arang\\.gemini\\antigravity-ide\\brain\\d725f19b-a659-4855-9690-93df59c60d24';
const PORT = 9222;

const VIEWPORTS = [
  { name: 'movil_360x640', width: 360, height: 640, dpr: 2 },
  { name: 'movil_390x844', width: 390, height: 844, dpr: 3 },
  { name: 'movil_landscape_844x390', width: 844, height: 390, dpr: 2 },
  { name: 'tablet_1024x768', width: 1024, height: 768, dpr: 1 },
  { name: 'laptop_1366x768_100', width: 1366, height: 768, dpr: 1 },
  { name: 'laptop_1093x614_125', width: 1093, height: 614, dpr: 1.25 },
  { name: 'monitor_1440x900', width: 1440, height: 900, dpr: 1 },
];

async function main() {
  console.log('Launching Edge headless...');
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\arang\\.gemini\\antigravity-ide\\brain\\d725f19b-a659-4855-9690-93df59c60d24\\scratch\\edge_profile',
    'about:blank'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const pages = await listRes.json();
    const page = pages.find((p) => p.type === 'page') || pages[0];
    const wsUrl = page.webSocketDebuggerUrl;

    console.log('Connecting to WebSocket:', wsUrl);
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
    await new Promise((r) => setTimeout(r, 2500));

    const results = [];

    for (const vp of VIEWPORTS) {
      console.log(`\n=== Measuring Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.dpr,
        mobile: vp.width < 768
      });

      await new Promise((r) => setTimeout(r, 600));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const header = document.querySelector('#site-header');
          const headerH = header ? header.getBoundingClientRect().height : 0;
          const vpW = window.innerWidth;
          const vpH = window.innerHeight;
          const availH = vpH - headerH;

          const sections = ['#inicio', '#menu', '#galeria', '#cifras', '#historia', '#testimonios', '#reservas', 'footer'];
          const sectionData = [];

          for (let i = 0; i < sections.length; i++) {
            const sel = sections[i];
            const el = document.querySelector(sel);
            if (!el) continue;

            const rect = el.getBoundingClientRect();
            // Inner content wrapper
            const content = el.querySelector('.max-w-7xl') || el.firstElementChild;
            const contentRect = content ? content.getBoundingClientRect() : rect;
            const contentScrollH = content ? content.scrollHeight : el.scrollHeight;

            // Distancia al siguiente bloque
            let treguaPx = null;
            if (i < sections.length - 1) {
              const nextEl = document.querySelector(sections[i+1]);
              if (nextEl) {
                const nextContent = nextEl.querySelector('.max-w-7xl') || nextEl.firstElementChild;
                const nextRect = nextContent ? nextContent.getBoundingClientRect() : nextEl.getBoundingClientRect();
                // Tregua = distancia entre el final del contenido de este bloque y el inicio del contenido del siguiente
                treguaPx = Math.round(nextRect.top - contentRect.bottom);
              }
            }

            sectionData.push({
              selector: sel,
              sectionHeight: Math.round(rect.height),
              contentHeight: Math.round(contentRect.height),
              contentScrollHeight: Math.round(contentScrollH),
              availableHeight: Math.round(availH),
              overflowsAvailable: contentScrollH > availH + 2,
              overflowsSection: contentScrollH > rect.height + 2,
              treguaNextPx: treguaPx
            });
          }

          return {
            vpW,
            vpH,
            headerH: Math.round(headerH),
            availH: Math.round(availH),
            sections: sectionData
          };
        })()`,
        returnByValue: true
      });

      const vpData = evalRes.result.value;
      results.push({ viewport: vp, data: vpData });

      // Screenshot
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75 });
      const shotPath = path.join(ARTIFACTS_DIR, `screenshot_${vp.name}.jpg`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${shotPath}`);
    }

    // Check I-01: Focus-visible on rounded buttons
    console.log('\n=== Checking I-01: focus-visible outline and border-radius ===');
    const focusTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.menu-filter-btn') || document.querySelector('a[href="#reservas"]');
        if (!btn) return 'no btn found';
        btn.focus();
        const cs = window.getComputedStyle(btn);
        return {
          tag: btn.tagName,
          classes: btn.className,
          outline: cs.outline,
          outlineOffset: cs.outlineOffset,
          borderRadius: cs.borderRadius,
          boxShadow: cs.boxShadow
        };
      })()`,
      returnByValue: true
    });
    console.log('Focus test result:', JSON.stringify(focusTest.result.value, null, 2));

    const outPath = path.join(ARTIFACTS_DIR, 'scratch', 'measurement_results.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify({ results, focusTest: focusTest.result.value }, null, 2));
    console.log(`\nMeasurements saved to ${outPath}`);

    ws.close();
  } finally {
    edgeProc.kill();
  }
}

main().catch(console.error);
