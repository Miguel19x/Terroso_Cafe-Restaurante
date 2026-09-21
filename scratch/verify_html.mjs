const res = await fetch('http://localhost:4323');
const html = await res.text();

console.log('1. Radio inputs present:', html.includes('type="radio"'));
console.log('2. Fieldset count:', (html.match(/<fieldset/g) || []).length);
console.log('3. Mobile menu has inert:', html.includes('id="mobile-menu"') && html.includes('inert'));
console.log('4. WhatsApp placeholder removed (uses siteConfig):', !html.includes('584120000000'));
console.log('5. Watermark icons aria-hidden count:', (html.match(/aria-hidden="true"/g) || []).length);
console.log('6. Footer legal links have min-h-11:', html.includes('min-h-11 inline-flex items-center px-2 py-1 hover:text-primary-fixed'));
console.log('7. InfoStrip dot has aria-hidden:', html.includes('<span class="text-secondary-container hidden sm:inline" aria-hidden="true">•</span>'));
