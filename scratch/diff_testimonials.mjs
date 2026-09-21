import fs from 'fs';

const b = fs.readFileSync('scratch/pre_phase2_src/components/Testimonials.astro', 'utf8').split('\n');
const a = fs.readFileSync('src/components/Testimonials.astro', 'utf8').split('\n');

console.log('Comparing Testimonials.astro lines...');
for (let i = 0; i < Math.max(b.length, a.length); i++) {
  if (b[i] !== a[i]) {
    console.log(`Line ${i+1}:`);
    console.log(`- BEFORE: ${b[i] || '<EOF>'}`);
    console.log(`+ AFTER:  ${a[i] || '<EOF>'}`);
  }
}
