import fs from 'fs';

const content = fs.readFileSync('C:/Users/arang/.gemini/antigravity-ide/brain/d725f19b-a659-4855-9690-93df59c60d24/.system_generated/logs/transcript_full.jsonl', 'utf8');
for (const line of content.split('\n')) {
  if (line.includes('"step_index":1033') || line.includes('"step_index":1058')) {
    const obj = JSON.parse(line);
    for (const tc of obj.tool_calls) {
      console.log('STEP', obj.step_index, tc.name, tc.args.Description);
      console.log('TARGET:\n', tc.args.TargetContent);
      console.log('REPLACEMENT:\n', tc.args.ReplacementContent);
    }
  }
}
