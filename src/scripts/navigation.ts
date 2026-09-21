/**
 * navigation.ts
 * Handles: active nav link highlighting, header scroll effects,
 * smooth scroll for anchor links, and mobile hamburger menu.
 */

export function initNavigation(): void {
  // ── Smooth scroll (FUNC-01 & A11Y-01) ────────────────────────────────────
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Update URL hash without causing a jump, maintaining browser history & back button (FUNC-01)
        history.pushState(null, '', '#' + targetId);

        // Accessible focus transfer for assistive technologies and keyboard users (WCAG 2.4.3)
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
        target.focus({ preventScroll: true });
      }
    });
  });

  // ── Header shrink & scroll progress ─────────────────────────────────────────
  const header = document.querySelector<HTMLElement>('#site-header');
  const progressBar = document.querySelector<HTMLElement>('#scroll-progress');

  window.addEventListener(
    'scroll',
    () => {
      const scrollY = window.scrollY;

      if (header) {
        if (scrollY > 40) {
          header.classList.add('shadow-[0_4px_24px_-2px_rgba(43,33,26,0.12)]', 'header-compact');
        } else {
          header.classList.remove('shadow-[0_4px_24px_-2px_rgba(43,33,26,0.12)]', 'header-compact');
        }
      }

      if (progressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
      }
    },
    { passive: true }
  );

  // ── Active nav link via IntersectionObserver ──────────────────────────────
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]');
  const sections = document.querySelectorAll<HTMLElement>('section[id]');

  const activeClasses = ['bg-primary/10', 'text-primary', 'font-semibold'];
  const inactiveClasses = ['text-on-surface-variant', 'hover:text-on-surface', 'font-medium'];

  function setActive(id: string) {
    navLinks.forEach((link) => {
      const linkTarget = link.getAttribute('href')?.replace('#', '');
      if (linkTarget === id) {
        link.classList.add(...activeClasses);
        link.classList.remove(...inactiveClasses);
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove(...activeClasses);
        link.classList.add(...inactiveClasses);
        link.removeAttribute('aria-current');
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  // ── Mobile hamburger menu with focus trap & background isolation (A11Y-03) ──
  const menuBtn = document.querySelector<HTMLButtonElement>('#mobile-menu-btn');
  const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu');
  const menuIcon = document.querySelector<HTMLElement>('#menu-icon');
  const mainEl = document.querySelector<HTMLElement>('main');
  const footerEl = document.querySelector<HTMLElement>('footer');

  if (menuBtn && mobileMenu) {
    function getFocusableElements(): HTMLElement[] {
      return Array.from(
        mobileMenu!.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    function openMobileMenu(): void {
      mobileMenu!.removeAttribute('inert');
      mobileMenu!.classList.remove('invisible', '-translate-y-2', 'opacity-0', 'pointer-events-none');
      mobileMenu!.classList.add('translate-y-0', 'opacity-100');
      if (menuIcon) menuIcon.textContent = 'close';
      menuBtn!.setAttribute('aria-expanded', 'true');
      menuBtn!.setAttribute('aria-label', 'Cerrar menú de navegación');

      // A11Y-03: Isolate background content from screen readers & keyboard Tab
      mainEl?.setAttribute('inert', '');
      footerEl?.setAttribute('inert', '');
      document.body.classList.add('overflow-hidden');

      // Transfer focus into the mobile menu
      const focusables = getFocusableElements();
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }

    function closeMobileMenu(returnFocus = true): void {
      mobileMenu!.setAttribute('inert', '');
      mobileMenu!.classList.remove('translate-y-0', 'opacity-100');
      mobileMenu!.classList.add('-translate-y-2', 'opacity-0', 'pointer-events-none', 'invisible');
      if (menuIcon) menuIcon.textContent = 'menu';
      menuBtn!.setAttribute('aria-expanded', 'false');
      menuBtn!.setAttribute('aria-label', 'Abrir menú de navegación');

      // Restore background content
      mainEl?.removeAttribute('inert');
      footerEl?.removeAttribute('inert');
      document.body.classList.remove('overflow-hidden');

      if (returnFocus) {
        menuBtn!.focus();
      }
    }

    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.hasAttribute('inert');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on Escape key press and manage focus trap
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!mobileMenu.hasAttribute('inert')) {
        if (e.key === 'Escape') {
          closeMobileMenu();
          return;
        }

        // Focus trap between menu items and trigger button
        if (e.key === 'Tab') {
          const focusables = [menuBtn, ...getFocusableElements()];
          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu(false);
      });
    });
  }
}
