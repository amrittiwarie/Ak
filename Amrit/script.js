/* ============================================================
   Portfolio — script.js
   Minimal JS: mobile nav, active link tracking, scroll fallback
   ============================================================ */

(() => {
  'use strict';

  /* ---- DOM refs ---- */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');
  const navItems  = document.querySelectorAll('[data-nav]');
  const sections  = document.querySelectorAll('section[id]');

  /* ============================================================
     1. Mobile navigation toggle
     ============================================================ */
  function openNav() {
    navLinks.classList.add('open');
    navOverlay.classList.add('visible');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navLinks.classList.remove('open');
    navOverlay.classList.remove('visible');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  navOverlay.addEventListener('click', closeNav);

  // Close nav when a link is clicked (mobile)
  navItems.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeNav();
    }
  });

  /* ============================================================
     2. Navbar background on scroll
     ============================================================ */
  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // initial check

  /* ============================================================
     3. Active navigation link tracking
     ============================================================ */
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* ============================================================
     4. Scroll-driven animation FALLBACK (IntersectionObserver)
        Only runs if native animation-timeline is unsupported.
     ============================================================ */
  const supportsScrollTimeline = CSS.supports(
    '(animation-timeline: view()) and (animation-range: entry)'
  );
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!supportsScrollTimeline && !prefersReducedMotion) {
    const revealTargets = document.querySelectorAll(
      '.section__header, .about__text, .about__stats, .skills__group, .timeline__item, .project-card, .contact__info, .contact__form-wrapper'
    );

    // Add the .reveal class so the CSS hides them initially
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // animate once
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
      }
    );

    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* ============================================================
     5. Contact form — simple client-side handling
     ============================================================ */
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const originalHTML = submitBtn.innerHTML;

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending…';

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Message Sent!';
      submitBtn.classList.remove('btn--primary');
      submitBtn.style.background = 'var(--color-success)';
      submitBtn.style.color = 'var(--color-slate-950)';

      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        submitBtn.classList.add('btn--primary');
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 3000);
    }, 1500);
  });

  /* ============================================================
     6. Smooth year in footer
     ============================================================ */
  // Year is already hardcoded in HTML, but this ensures it's always current
  const footerYear = document.querySelector('.footer__text');
  if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace(
      /&copy;\s*\d{4}/,
      `&copy; ${new Date().getFullYear()}`
    );
  }

})();
