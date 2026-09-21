import { spawn } from 'child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const edge = spawn(EDGE_PATH, [
    '--headless=new', '--remote-debugging-port=9227', '--disable-gpu', '--no-first-run', 'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9227/json/list');
    const pages = await listRes.json();
    const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise(r => {
        const curId = id++;
        const handler = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === curId) { ws.removeEventListener('message', handler); r(d.result); }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:4323' });
    await new Promise(r => setTimeout(r, 2000));

    for (const [w, h] of [[1358, 602], [1086, 482], [1440, 900]]) {
      console.log(`\n=== Viewport ${w}x${h} ===`);
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
      await new Promise(r => setTimeout(r, 500));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const t = document.querySelector('#testimonials-track');
          const tCs = t ? window.getComputedStyle(t) : {};
          const tControls = document.querySelector('#testimonials-controls');
          const tControlsDisplay = tControls ? window.getComputedStyle(tControls).display : 'none';

          const cifras = document.querySelector('#cifras');
          const cifrasCards = Array.from(document.querySelectorAll('#cifras .relative.overflow-hidden')).map(c => {
            const r = c.getBoundingClientRect();
            const cs = window.getComputedStyle(c);
            return { w: Math.round(r.width), h: Math.round(r.height), pad: cs.padding };
          });

          const menu = document.querySelector('#menu');
          const menuCards = Array.from(document.querySelectorAll('#menu .menu-item-card')).map(c => {
            const r = c.getBoundingClientRect();
            const img = c.querySelector('img');
            const imgR = img ? img.getBoundingClientRect() : {};
            return { w: Math.round(r.width), h: Math.round(r.height), imgH: Math.round(imgR.height) };
          });

          return {
            testimonials: {
              trackDisplay: tCs.display,
              trackH: t ? Math.round(t.getBoundingClientRect().height) : 0,
              controlsDisplay: tControlsDisplay,
            },
            cifras: {
              sectionH: cifras ? Math.round(cifras.getBoundingClientRect().height) : 0,
              cards: cifrasCards
            },
            menu: {
              sectionH: menu ? Math.round(menu.getBoundingClientRect().height) : 0,
              card0: menuCards[0]
            }
          };
        })()`,
        returnByValue: true
      });

      console.log(JSON.stringify(evalRes.result.value, null, 2));
    }

    ws.close();
  } finally {
    edge.kill();
  }
}

main().catch(console.error);
