/* ═══════════════════════════════════════════════════════════════
   RADLEY 2030 — PART 1  ·  main.js
   Lenis smooth scroll + GSAP ScrollTrigger animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── 1. LENIS + GSAP SETUP ──────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  // Drive Lenis from GSAP's ticker so ScrollTrigger stays in sync
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Keep ScrollTrigger updated on every Lenis scroll event
  lenis.on('scroll', ScrollTrigger.update);


  // ── 2. NAV SMOOTH SCROLL ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -56, duration: 1.6 });
    });
  });


  // ── 3. PARALLAX IMAGES ────────────────────────────────────────
  gsap.utils.toArray('.parallax-wrap').forEach(wrap => {
    const img = wrap.querySelector('.parallax-img');
    if (!img) return;
    gsap.fromTo(img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }
    );
  });


  // ── 4. MANTRA HERO ANIMATION ──────────────────────────────────
  const mantra = document.querySelector('.reveal-mantra');
  if (mantra) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mantra,
        start: 'top 90%',
        once: true,
      },
    });

    tl.to(mantra, {
      opacity: 1,
      y: 0,
      duration: 1.3,
      ease: 'power3.out',
    }).to(mantra, {
      scale: 1.005,
      duration: 2.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.2,
    });
  }


  // ── 5. UNIVERSAL TEXT REVEALS ─────────────────────────────────
  // Each .reveal element triggers individually as it enters the viewport,
  // creating a natural cascade as you scroll through a section.
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });


  // ── 6. CALLOUT BLOCK REVEALS (slide from left) ─────────────────
  gsap.utils.toArray('.reveal-callout').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true,
      },
    });
  });


  // ── 7. CARD ANIMATIONS (staggered entrance) ────────────────────
  function animateCardGroup(groupSelector) {
    const cards = gsap.utils.toArray(groupSelector + ' .reveal-card');
    if (!cards.length) return;
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: groupSelector,
        start: 'top 80%',
        once: true,
      },
    });
  }

  animateCardGroup('#continuity-cards');
  animateCardGroup('#ai-cards');
  animateCardGroup('#next-5-years .card-grid-1x3');


  // ── 8. PILL ANIMATIONS (pop in with stagger) ───────────────────
  gsap.utils.toArray('.pill-group').forEach(group => {
    const pills = group.querySelectorAll('.reveal-pill');
    gsap.to(pills, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.5)',
      stagger: 0.08,
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        once: true,
      },
    });
  });


  // ── 9. SHIFT TABLE ANIMATION ──────────────────────────────────
  const shiftTable = document.querySelector('.shift-table');
  if (shiftTable) {
    const fromRows  = gsap.utils.toArray('.shift-col--from .shift-row');
    const fromDels  = gsap.utils.toArray('.shift-col--from .shift-row del');
    const toRows    = gsap.utils.toArray('.shift-col--to .shift-row');
    const fromHdr   = document.querySelector('.shift-col--from .shift-header');
    const toHdr     = document.querySelector('.shift-col--to .shift-header');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: shiftTable,
        start: 'top 75%',
        once: true,
      },
    });

    // FROM header fades in
    tl.to(fromHdr, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform' }, 0);

    // FROM rows fade in with stagger
    tl.to(fromRows, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
    }, 0.2);

    // Strikethrough each FROM item sequentially
    tl.add(() => {
      fromDels.forEach((del, i) => {
        gsap.delayedCall(i * 0.14, () => del.classList.add('struck'));
      });
    }, '+=0.4');

    // TO header fades in
    tl.to(toHdr, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform' }, '+=0.9');

    // TO rows fade in with stagger
    tl.to(toRows, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.12,
    }, '-=0.2');
  }


  // ── 10. SCROLLTRIGGER REFRESH ─────────────────────────────────
  // Recalculate positions once all assets are loaded
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

})();
