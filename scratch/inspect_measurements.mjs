import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/arang/.gemini/antigravity-ide/brain/d725f19b-a659-4855-9690-93df59c60d24';
const beforeData = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, 'scratch', 'measurement_results.json'), 'utf8'));
const afterData = JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, 'scratch', 'remeasure_results.json'), 'utf8'));

console.log('=== BEFORE VIEWPORTS ===');
for (const r of beforeData.results) {
  console.log(r.viewport.name, `${r.data.vpW}x${r.data.vpH}`, 'headerH:', r.data.headerH, 'availH:', r.data.availH);
  for (const s of r.data.sections) {
    if (s.selector === '#reservas' || s.selector === '#galeria' || s.selector === '#testimonios') {
      console.log(`  ${s.selector}: sectionH=${s.sectionHeight}, contentH=${s.contentHeight}, contentScrollH=${s.contentScrollHeight}`);
    }
  }
}

console.log('\n=== AFTER VIEWPORTS ===');
for (const r of afterData.results) {
  console.log(r.viewport.name, `${r.data.vpW}x${r.data.vpH}`, 'headerH:', r.data.headerH, 'availH:', r.data.availH);
  for (const s of r.data.sections) {
    if (s.id === '#reservas' || s.id === '#galeria' || s.id === '#testimonios') {
      console.log(`  ${s.id}: rawContentH=${s.rawContentHeight}, padY=${s.padY}, totalWithPadding=${s.totalWithPadding}, availH=${s.availH}, delta=${s.overflowDeltaPx}`);
    }
  }
}
