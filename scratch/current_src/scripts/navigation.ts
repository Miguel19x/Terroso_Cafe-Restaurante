/**
 * navigation.ts
 * Handles: active nav link highlighting, header scroll effects,
 * smooth scroll for anchor links, and mobile hamburger menu.
 */

export function initNavigation(): void {
  // ── Smooth scroll ─────────────────────────────────────────────────────────
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href')!.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
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

  // ── Mobile hamburger menu ─────────────────────────────────────────────────
  const menuBtn = document.querySelector<HTMLButtonElement>('#mobile-menu-btn');
  const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu');
  const menuIcon = document.querySelector<HTMLElement>('#menu-icon');

  if (menuBtn && mobileMenu) {
    function openMobileMenu(): void {
      mobileMenu!.removeAttribute('inert');
      mobileMenu!.classList.remove('invisible', '-translate-y-2', 'opacity-0', 'pointer-events-none');
      mobileMenu!.classList.add('translate-y-0', 'opacity-100');
      if (menuIcon) menuIcon.textContent = 'close';
      menuBtn!.setAttribute('aria-expanded', 'true');
      menuBtn!.setAttribute('aria-label', 'Cerrar menú de navegación');
    }

    function closeMobileMenu(): void {
      mobileMenu!.setAttribute('inert', '');
      mobileMenu!.classList.remove('translate-y-0', 'opacity-100');
      mobileMenu!.classList.add('-translate-y-2', 'opacity-0', 'pointer-events-none', 'invisible');
      if (menuIcon) menuIcon.textContent = 'menu';
      menuBtn!.setAttribute('aria-expanded', 'false');
      menuBtn!.setAttribute('aria-label', 'Abrir menú de navegación');
    }

    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.hasAttribute('inert');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on Escape key press and restore focus to trigger button
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !mobileMenu.hasAttribute('inert')) {
        closeMobileMenu();
        menuBtn.focus();
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }
}
