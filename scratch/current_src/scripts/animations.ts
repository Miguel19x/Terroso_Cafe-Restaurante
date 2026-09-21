/**
 * animations.ts
 * Handles: fade-in on scroll for elements, animated counters for stats.
 */

// ── Fade-in / slide-up on scroll ─────────────────────────────────────────────
export function initScrollAnimations(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// ── Animated counter ─────────────────────────────────────────────────────────
function animateCounter(el: HTMLElement, target: number, suffix: string, duration = 1400): void {
  const isDecimal = !Number.isInteger(target);
  const start = performance.now();

  function update(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isDecimal ? current.toFixed(1) + suffix : Math.floor(current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

export function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.counter ?? '0');
          const suffix = el.dataset.suffix ?? '';
          animateCounter(el, target, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

// ── Scroll-to-top button ──────────────────────────────────────────────────────
export function initScrollToTop(): void {
  const btn = document.querySelector<HTMLButtonElement>('#scroll-to-top');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 400) {
        btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
        btn.classList.add('opacity-100', 'translate-y-0');
      } else {
        btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
        btn.classList.remove('opacity-100', 'translate-y-0');
      }
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
