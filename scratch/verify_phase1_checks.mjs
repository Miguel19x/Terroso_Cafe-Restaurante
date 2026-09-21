import { spawn } from 'child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9224;

async function main() {
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--user-data-dir=C:\\Users\\arang\\.gemini\\antigravity-ide\\brain\\d725f19b-a659-4855-9690-93df59c60d24\\scratch\\edge_profile_verify_p1',
    'about:blank'
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const pages = await listRes.json();
    const targetPage = pages.find((p) => p.type === 'page') || pages[0];
    const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
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
    await send('Page.navigate', { url: 'http://localhost:4323' });
    await new Promise((r) => setTimeout(r, 2500));

    // Test 1: Flujo de WhatsApp con los radios
    const waTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const initialHref = document.querySelector('#res-whatsapp-link').href;
        
        // Change radios
        const radioGuest = document.querySelector('#guests-6');
        radioGuest.checked = true;
        radioGuest.dispatchEvent(new Event('change', { bubbles: true }));

        const radioTime = document.querySelector('#time-lunch');
        radioTime.checked = true;
        radioTime.dispatchEvent(new Event('change', { bubbles: true }));

        const radioArea = document.querySelector('#area-indoor');
        radioArea.checked = true;
        radioArea.dispatchEvent(new Event('change', { bubbles: true }));

        const updatedHref = document.querySelector('#res-whatsapp-link').href;
        return {
          initialHref,
          updatedHref,
          containsGuest: updatedHref.includes(encodeURIComponent('5 a 6 personas')),
          containsTime: updatedHref.includes(encodeURIComponent('Almuerzo de temporada')),
          containsArea: updatedHref.includes(encodeURIComponent('Salón Principal'))
        };
      })()`,
      returnByValue: true
    });
    console.log('WhatsApp Radios Flow Test:', JSON.stringify(waTest.result.value, null, 2));

    // Test 2: Menú móvil (inert, escape key, focus restoration)
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
    await new Promise((r) => setTimeout(r, 500));

    const menuTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const menu = document.querySelector('#mobile-menu');
        const btn = document.querySelector('#mobile-menu-btn');
        
        const initialInert = menu.hasAttribute('inert');
        const initialAriaExpanded = btn.getAttribute('aria-expanded');

        // Click to open
        btn.click();
        const openInert = menu.hasAttribute('inert');
        const openAriaExpanded = btn.getAttribute('aria-expanded');

        // Press Escape
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        const closeInert = menu.hasAttribute('inert');
        const closeAriaExpanded = btn.getAttribute('aria-expanded');
        const activeElIsBtn = document.activeElement === btn;

        return {
          initialInert,
          initialAriaExpanded,
          openInert,
          openAriaExpanded,
          closeInert,
          closeAriaExpanded,
          activeElIsBtn
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile Menu Test:', JSON.stringify(menuTest.result.value, null, 2));

    // Test 3: Contrast check for #bacda9
    function getLuminance(hex) {
      const rgb = [0, 2, 4].map(idx => parseInt(hex.slice(idx, idx + 2), 16) / 255).map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    }
    function contrastRatio(hex1, hex2) {
      const l1 = getLuminance(hex1.replace('#', ''));
      const l2 = getLuminance(hex2.replace('#', ''));
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    console.log('Contrast of #bacda9 on #536346 (bg-secondary):', contrastRatio('#bacda9', '#536346').toFixed(2) + ':1');
    console.log('Contrast of #bacda9 on #111f08 (on-secondary-fixed):', contrastRatio('#bacda9', '#111f08').toFixed(2) + ':1');
    console.log('Contrast of #bacda9 on #1e1b16 (on-surface):', contrastRatio('#bacda9', '#1e1b16').toFixed(2) + ':1');
    console.log('Contrast of #d5e9c4 on #536346 (secondary-container on secondary):', contrastRatio('#d5e9c4', '#536346').toFixed(2) + ':1');

    ws.close();
  } finally {
    edgeProc.kill();
  }
}
main().catch(console.error);
