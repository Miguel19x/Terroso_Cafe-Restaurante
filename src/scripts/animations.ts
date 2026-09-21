/**
 * animations.ts
 * Handles: fade-in on scroll for elements, animated counters for stats.
 */

// ── Fade-in / slide-up on scroll ─────────────────────────────────────────────
export function initScrollAnimations(): void {
  const setup = () => {
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
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    elements.forEach((el) => {
      // Si ya está en pantalla al cargar (como el Hero), animar suavemente
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        requestAnimationFrame(() => {
          el.classList.add('animate-in');
        });
      } else {
        observer.observe(el);
      }
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(setup, { timeout: 1000 });
  } else {
    setTimeout(setup, 30);
  }
}

// ── Animated counter with Venezuelan comma format (I18N-01) ─────────────────
function formatNumberVE(val: number, isDecimal: boolean): string {
  if (isDecimal) {
    return val.toLocaleString('es-VE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  return Math.floor(val).toString();
}

function animateCounter(el: HTMLElement, target: number, suffix: string, duration = 1500): void {
  const isDecimal = !Number.isInteger(target);
  const start = performance.now();

  function update(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic: suave desaceleración al final
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    if (progress < 1) {
      el.textContent = formatNumberVE(current, isDecimal) + suffix;
      requestAnimationFrame(update);
    } else {
      el.textContent = formatNumberVE(target, isDecimal) + suffix;
    }
  }

  requestAnimationFrame(update);
}

export function initCounters(): void {
  const setup = () => {
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
      { threshold: 0.2 }
    );

    counters.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const target = parseFloat(el.dataset.counter ?? '0');
        const suffix = el.dataset.suffix ?? '';
        animateCounter(el, target, suffix);
      } else {
        observer.observe(el);
      }
    });
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(setup, { timeout: 1500 });
  } else {
    setTimeout(setup, 60);
  }
}

// ── Scroll-to-top button (A11Y-02 & A11Y-01) ──────────────────────────────────
export function initScrollToTop(): void {
  const btn = document.querySelector<HTMLButtonElement>('#scroll-to-top');
  if (!btn) return;

  // Estado inicial accesible si está en la parte superior (A11Y-02)
  if (window.scrollY <= 400) {
    btn.setAttribute('tabindex', '-1');
    btn.setAttribute('aria-hidden', 'true');
  } else {
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-hidden', 'false');
  }

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 400) {
        btn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
        btn.classList.add('opacity-100', 'translate-y-0');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-hidden', 'false');
      } else {
        btn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
        btn.classList.remove('opacity-100', 'translate-y-0');
        btn.setAttribute('tabindex', '-1');
        btn.setAttribute('aria-hidden', 'true');
      }
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
