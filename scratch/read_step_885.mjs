import fs from 'fs';

const content = fs.readFileSync('C:/Users/arang/.gemini/antigravity-ide/brain/d725f19b-a659-4855-9690-93df59c60d24/.system_generated/logs/transcript_full.jsonl', 'utf8');
for (const line of content.split('\n')) {
  if (line.includes('"step_index":885')) {
    const obj = JSON.parse(line);
    console.log(obj.content.slice(0, 4000));
    break;
  }
}
