import fs from 'fs';

const text = fs.readFileSync('scratch/user_step_latest.txt', 'utf8');

console.log('Text length:', text.length);

const finalIdx = text.indexOf('"final-screenshot"');
if (finalIdx !== -1) {
  console.log('final-screenshot index:', finalIdx);
  // find next property
  const after = text.slice(finalIdx);
  // find base64 data end
  const dataEnd = after.indexOf('"}');
  if (dataEnd !== -1) {
    console.log('Rest of text after screenshot:');
    console.log(after.slice(dataEnd, dataEnd + 2000));
  } else {
    console.log('No dataEnd found in after, length:', after.length);
  }
}

