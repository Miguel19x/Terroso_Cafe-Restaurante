import fs from 'fs';

const content = fs.readFileSync('C:/Users/arang/.gemini/antigravity-ide/brain/d725f19b-a659-4855-9690-93df59c60d24/.system_generated/logs/transcript_full.jsonl', 'utf8');

const files = [
  'src/styles/global.css',
  'src/components/Hero.astro',
  'src/components/Menu.astro',
  'src/components/Gallery.astro',
  'src/components/Stats.astro',
  'src/components/History.astro',
  'src/components/Testimonials.astro',
  'src/components/Reservations.astro',
  'src/components/Footer.astro',
];

// Let's find step 885 or earlier where files were in Phase 1 state.
// We can check all replace_file_content calls after step 885.
const edits = [];
for (const line of content.split('\n')) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index >= 885 && obj.tool_calls) {
      for (const tc of obj.tool_calls) {
        if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
          edits.push({
            step: obj.step_index,
            tool: tc.name,
            file: tc.args.TargetFile,
            desc: tc.args.Description,
            target: tc.args.TargetContent,
            replacement: tc.args.ReplacementContent,
            chunks: tc.args.ReplacementChunks
          });
        }
      }
    }
  } catch(e) {}
}

console.log('Edits after step 885 (Phase 2):', edits.length);
for (const e of edits) {
  console.log(`Step ${e.step}: ${e.tool} on ${e.file ? e.file.split(/[\\\\/]/).slice(-2).join('/') : 'unknown'} - ${e.desc}`);
}
