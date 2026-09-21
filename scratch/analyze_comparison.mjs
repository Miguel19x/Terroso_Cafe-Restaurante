import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/arang/.gemini/antigravity-ide/brain/d725f19b-a659-4855-9690-93df59c60d24';
const data = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, 'scratch', 'unified_comparison.json'), 'utf8'));

const { beforeResults, afterResults } = data;

console.log('=== SUMMARY OF VIEWPORTS ===');
for (let i = 0; i < beforeResults.length; i++) {
  const bVp = beforeResults[i];
  const aVp = afterResults[i];
  console.log(`\n### Viewport: ${bVp.viewport.name} (${bVp.viewport.width}x${bVp.viewport.height})`);
  console.log(`Header Before: ${bVp.data.headerH}px, availH: ${bVp.data.availH}px | Header After: ${aVp.data.headerH}px, availH: ${aVp.data.availH}px`);

  console.log('| Sección | Before rawH | Before padY | Before Total | Before Delta | After rawH | After padY | After Total | After Delta | Cambio Total |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');

  for (let j = 0; j < bVp.data.sections.length; j++) {
    const sB = bVp.data.sections[j];
    const sA = aVp.data.sections[j];
    const diff = sA.totalWithPadding - sB.totalWithPadding;
    console.log(`| \`${sB.id}\` | ${sB.rawH} px | ${sB.padY} px | ${sB.totalWithPadding} px | ${sB.overflowDeltaPx > 0 ? '+' + sB.overflowDeltaPx + ' ❌' : sB.overflowDeltaPx + ' ✅'} | ${sA.rawH} px | ${sA.padY} px | ${sA.totalWithPadding} px | ${sA.overflowDeltaPx > 0 ? '+' + sA.overflowDeltaPx + ' ❌' : sA.overflowDeltaPx + ' ✅'} | ${diff > 0 ? '+' + diff : diff} px |`);
  }
}

console.log('\n\n=== TREGUAS TABLE ===');
const targetVps = ['laptop_real_1358x602_100', 'laptop_real_1086x482_125', 'monitor_1440x900'];

for (const vpName of targetVps) {
  const bVp = beforeResults.find(v => v.viewport.name === vpName);
  const aVp = afterResults.find(v => v.viewport.name === vpName);
  console.log(`\n### Treguas en ${vpName} (${bVp.viewport.width}x${bVp.viewport.height})`);
  console.log('| Transición | Tregua Antes | Tregua Después | Variación |');
  console.log('|---|---|---|---|');
  for (let i = 0; i < bVp.data.treguas.length; i++) {
    const tB = bVp.data.treguas[i];
    const tA = aVp.data.treguas[i];
    const diff = tA.treguaPx - tB.treguaPx;
    console.log(`| ${tB.pair} | ${tB.treguaPx} px | ${tA.treguaPx} px | ${diff > 0 ? '+' + diff : diff} px |`);
  }
}
