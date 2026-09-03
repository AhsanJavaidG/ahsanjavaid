/* Shared portfolio motion system.
   Loaded on all pages. Progressive-enhancement only — page still works if JS is off.
   Respects prefers-reduced-motion. */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- 1. Scroll progress bar -------- */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;
    function update() {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
      bar.style.width = pct + '%';
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* -------- 2. Skip link -------- */
  function injectSkipLink() {
    if (document.querySelector('.skip-link')) return;
    const link = document.createElement('a');
    link.href = '#main';
    link.className = 'skip-link';
    link.textContent = 'Skip to main content';
    document.body.insertBefore(link, document.body.firstChild);

    let main = document.querySelector('main');
    if (!main) main = document.querySelector('article');
    if (main && !main.id) main.id = 'main';
  }

  /* -------- 3. Reveal on scroll (IntersectionObserver) -------- */
  function initReveal() {
    if (reduceMotion) {
      document.querySelectorAll('.reveal, .text-reveal').forEach(el => el.classList.add('is-in'));
      return;
    }
    const targets = document.querySelectorAll('.reveal, .text-reveal');
    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(t => io.observe(t));
  }

  /* -------- 4. Text reveal: split into words -------- */
  function initTextReveal() {
    document.querySelectorAll('.text-reveal').forEach(el => {
      if (el.dataset.split) return;
      const text = el.textContent;
      el.textContent = '';
      const words = text.trim().split(/\s+/);
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.style.transitionDelay = (i * 0.04) + 's';
        span.textContent = w + ' ';
        el.appendChild(span);
      });
      el.dataset.split = '1';
    });
  }

  /* -------- 5. Count-up on scroll (data-count="42") -------- */
  function initCounters() {
    if (reduceMotion) {
      document.querySelectorAll('.count-up[data-count]').forEach(el => {
        el.textContent = el.dataset.count;
      });
      return;
    }
    const counters = document.querySelectorAll('.count-up[data-count]');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        animateCounter(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(c => io.observe(c));
  }

  function animateCounter(el) {
    const raw = el.dataset.count;
    // Parse: strip leading sign / trailing suffix, keep as number
    const match = String(raw).match(/^(-?)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) { el.textContent = raw; return; }
    const sign = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const decimals = (match[2].split('.')[1] || '').length;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = sign + value.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = sign + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* -------- 6. Cursor spotlight — track mouse for .spotlight cells -------- */
  function initSpotlight() {
    if (reduceMotion) return;
    document.querySelectorAll('.spotlight').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mouse-x', x + '%');
        el.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  /* -------- 7. Magnetic buttons -------- */
  function initMagnet() {
    if (reduceMotion) return;
    document.querySelectorAll('.magnet').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* -------- 8. Card tilt on mouse (subtle 3D) -------- */
  function initTilt() {
    if (reduceMotion) return;
    document.querySelectorAll('.tilt').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        el.style.transform = `perspective(1000px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* -------- 9. Console signature (for the curious) -------- */
  function consoleSig() {
    if (window.__ajsig) return;
    window.__ajsig = 1;
    const css = 'font: 500 14px "Fraunces", serif; color: #2b5aa8; padding: 4px 0;';
    console.log('%c✎ Ahsan Javaid · Product Designer', css);
    console.log('%cIf you\'re inspecting this — say hi. ahsang2003@yahoo.com', 'color: #5c6a80; font-family: monospace; font-size: 12px;');
  }

  /* -------- Boot -------- */
  function boot() {
    injectSkipLink();
    initScrollProgress();
    initTextReveal();
    initReveal();
    initCounters();
    initSpotlight();
    initMagnet();
    initTilt();
    consoleSig();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
