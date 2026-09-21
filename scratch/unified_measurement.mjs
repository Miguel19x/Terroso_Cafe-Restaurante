import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\arang\\.gemini\\antigravity-ide\\brain\\d725f19b-a659-4855-9690-93df59c60d24';
const PORT_CDP = 9224;

const VIEWPORTS = [
  { name: 'laptop_real_1358x602_100', width: 1358, height: 602, dpr: 1, mobile: false },
  { name: 'laptop_real_1086x482_125', width: 1086, height: 482, dpr: 1.25, mobile: false },
  { name: 'laptop_1366x640', width: 1366, height: 640, dpr: 1, mobile: false },
  { name: 'laptop_1280x600', width: 1280, height: 600, dpr: 1, mobile: false },
  { name: 'tablet_1024x768', width: 1024, height: 768, dpr: 1, mobile: false },
  { name: 'monitor_1440x900', width: 1440, height: 900, dpr: 1, mobile: false },
  { name: 'movil_360x640', width: 360, height: 640, dpr: 2, mobile: true },
  { name: 'movil_390x844', width: 390, height: 844, dpr: 3, mobile: true },
  { name: 'movil_landscape_844x390', width: 844, height: 390, dpr: 2, mobile: true },
  { name: 'gap_800x600', width: 800, height: 600, dpr: 1, mobile: false }
];

// Helper: static server for before build
function createStaticServer(port, dir) {
  const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.woff2': 'font/woff2'
  };
  return http.createServer((req, res) => {
    let p = req.url.split('?')[0];
    if (p === '/') p = '/index.html';
    const fp = path.join(dir, p);
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
      fs.createReadStream(fp).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }).listen(port);
}

// In-browser measurement function (runs identical in both builds)
const MEASURE_EXPRESSION = `(() => {
  const header = document.querySelector('#site-header');
  const headerRect = header ? header.getBoundingClientRect() : { height: 0 };
  const headerH = Math.round(headerRect.height);
  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  const availH = vpH - headerH;

  const sectionSelectors = ['#inicio', '#menu', '#galeria', '#cifras', '#historia', '#testimonios', '#reservas', 'footer'];

  // Helper to find visible leaf or container bounding box
  function getContentBounds(sel) {
    const sec = document.querySelector(sel);
    if (!sec) return null;

    if (sel === '#galeria') {
      const headerEl = sec.querySelector('.max-w-7xl');
      const trackEl = sec.querySelector('#continuous-gallery-track') || sec.querySelector('.gallery-card');
      const top = headerEl ? (headerEl.getBoundingClientRect().top + window.scrollY) : (sec.getBoundingClientRect().top + window.scrollY);
      const bottom = trackEl ? (trackEl.getBoundingClientRect().bottom + window.scrollY) : (sec.getBoundingClientRect().bottom + window.scrollY);
      return { top, bottom, height: Math.round(bottom - top) };
    }

    const contentEl = sec.querySelector('.max-w-7xl') || sec.firstElementChild;
    if (!contentEl) {
      const r = sec.getBoundingClientRect();
      return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, height: Math.round(r.height) };
    }

    // Find all visible child elements inside contentEl
    const allEls = Array.from(contentEl.querySelectorAll('*')).filter(el => {
      if (el.classList.contains('pointer-events-none') && (el.classList.contains('blur-3xl') || el.classList.contains('rounded-full'))) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

    let top = contentEl.getBoundingClientRect().top + window.scrollY;
    let bottom = contentEl.getBoundingClientRect().bottom + window.scrollY;

    if (allEls.length > 0) {
      let minTop = Infinity;
      let maxBottom = -Infinity;
      for (const el of allEls) {
        const r = el.getBoundingClientRect();
        const elTop = r.top + window.scrollY;
        const elBottom = r.bottom + window.scrollY;
        if (elTop < minTop) minTop = elTop;
        if (elBottom > maxBottom) maxBottom = elBottom;
      }
      top = minTop;
      bottom = maxBottom;
    }

    return { top, bottom, height: Math.round(bottom - top) };
  }

  const sectionsData = [];
  const sectionBounds = [];

  for (let i = 0; i < sectionSelectors.length; i++) {
    const sel = sectionSelectors[i];
    const sec = document.querySelector(sel);
    if (!sec) continue;

    const cs = window.getComputedStyle(sec);
    const padTop = parseFloat(cs.paddingTop) || 0;
    const padBottom = parseFloat(cs.paddingBottom) || 0;
    const padY = Math.round(padTop + padBottom);

    const bounds = getContentBounds(sel);
    sectionBounds.push({ id: sel, bounds });

    const rawH = bounds ? bounds.height : 0;
    const totalWithPadding = Math.round(rawH + padY);
    const overflowDeltaPx = Math.round(totalWithPadding - availH);

    sectionsData.push({
      id: sel,
      rawH,
      padTop: Math.round(padTop),
      padBottom: Math.round(padBottom),
      padY,
      totalWithPadding,
      availH,
      overflows: overflowDeltaPx > 0,
      overflowDeltaPx
    });
  }

  // Calculate Tregua: top del primer elemento de contenido del bloque B - bottom del último elemento de contenido del bloque A
  const treguas = [];
  for (let i = 0; i < sectionBounds.length - 1; i++) {
    const bA = sectionBounds[i];
    const bB = sectionBounds[i + 1];
    const treguaPx = (bA.bounds && bB.bounds) ? Math.round(bB.bounds.top - bA.bounds.bottom) : null;
    treguas.push({
      pair: bA.id + ' → ' + bB.id,
      treguaPx
    });
  }

  return {
    vpW,
    vpH,
    headerH,
    availH,
    sections: sectionsData,
    treguas
  };
})()`;

async function runMeasurementsOnUrl(url, label, portCdp) {
  console.log(`\n========================================`);
  console.log(`Running measurements for: ${label} (${url}) on CDP port ${portCdp}`);
  console.log(`========================================`);

  const profileDir = path.join(ARTIFACTS_DIR, 'scratch', 'edge_profile_unified_' + label);
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch(e) {}
  }

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${portCdp}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profileDir}`,
    'about:blank'
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${portCdp}/json/list`);
    const pages = await listRes.json();
    const page = pages.find((p) => p.type === 'page') || pages[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.id && pending.has(d.id)) {
        const { resolve, reject } = pending.get(d.id);
        pending.delete(d.id);
        if (d.error) reject(d.error);
        else resolve(d.result);
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
    await send('DOM.enable');
    await send('Runtime.enable');

    await send('Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 2500));

    const results = [];

    for (const vp of VIEWPORTS) {
      process.stdout.write(`Measuring ${vp.name} (${vp.width}x${vp.height})... `);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.dpr,
        mobile: vp.mobile
      });

      await new Promise((r) => setTimeout(r, 500));

      const evalRes = await send('Runtime.evaluate', {
        expression: MEASURE_EXPRESSION,
        returnByValue: true
      });

      const data = evalRes.result.value;
      results.push({ viewport: vp, data });
      console.log(`done. (Header: ${data.headerH}px, availH: ${data.availH}px)`);
    }

    ws.close();
    return results;
  } finally {
    edgeProc.kill();
    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function main() {
  // 1. Ensure server for dist_before is running on 4324
  const serverBefore = createStaticServer(4324, path.resolve('scratch/dist_before'));
  console.log('Started static server for dist_before on http://localhost:4324');

  // 2. Ensure server for current fluid build (dist) is running on 4325
  const serverAfter = createStaticServer(4325, path.resolve('dist'));
  console.log('Started static server for dist (FLUID) on http://localhost:4325');

  try {
    const beforeResults = await runMeasurementsOnUrl('http://localhost:4324', 'BEFORE', 9224);
    await new Promise((r) => setTimeout(r, 2000));
    const afterResults = await runMeasurementsOnUrl('http://localhost:4325', 'AFTER', 9225);

    const outPath = path.join(ARTIFACTS_DIR, 'scratch', 'unified_comparison.json');
    fs.writeFileSync(outPath, JSON.stringify({ beforeResults, afterResults }, null, 2));
    console.log(`\nComparison saved to ${outPath}`);
  } finally {
    serverBefore.close();
    serverAfter.close();
  }
}

main().catch(console.error);
