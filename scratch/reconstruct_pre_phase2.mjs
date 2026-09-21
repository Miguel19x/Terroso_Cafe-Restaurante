import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('C:/Users/arang/.gemini/antigravity-ide/brain/d725f19b-a659-4855-9690-93df59c60d24/.system_generated/logs/transcript_full.jsonl', 'utf8');

// We want to get the files right before step 904.
// Let's create a snapshot of src/ right now as current_src/
const backupDir = 'scratch/current_src';
fs.mkdirSync(backupDir, { recursive: true });

// Copy current src/ to scratch/current_src/
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f);
    const d = path.join(dest, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
copyDir('src', backupDir);
console.log('Backed up current src to scratch/current_src');

// Now, to get the pre-Phase 2 files:
// If we reverse each edit from the last to the first, we will get the exact pre-Phase 2 state!
// Let's collect all edits after step 885 in forward order.
const edits = [];
for (const line of content.split('\n')) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index >= 885 && obj.tool_calls) {
      for (const tc of obj.tool_calls) {
        if (tc.name === 'replace_file_content' && tc.args.TargetFile.includes('src')) {
          edits.push({
            step: obj.step_index,
            file: tc.args.TargetFile,
            target: tc.args.TargetContent,
            replacement: tc.args.ReplacementContent,
            allowMultiple: tc.args.AllowMultiple
          });
        }
      }
    }
  } catch(e) {}
}

console.log(`Found ${edits.length} edits on src/ after step 885`);

// Reversing edits to get pre_phase2_src
const preDir = 'scratch/pre_phase2_src';
copyDir('src', preDir);

for (let i = edits.length - 1; i >= 0; i--) {
  const e = edits[i];
  // Calculate relative path in preDir
  const relPath = path.relative(process.cwd(), e.file);
  const targetPath = path.join(preDir, relPath.replace(/^src[\\/]/, ''));
  let fileContent = fs.readFileSync(targetPath, 'utf8');
  if (fileContent.includes(e.replacement)) {
    fileContent = fileContent.replace(e.replacement, e.target);
    fs.writeFileSync(targetPath, fileContent, 'utf8');
    console.log(`Reverted step ${e.step} on ${path.basename(targetPath)}`);
  } else {
    console.warn(`WARNING: Could not find replacement for step ${e.step} in ${targetPath}`);
  }
}

console.log('pre_phase2_src created successfully.');
