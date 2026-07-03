 (function () {
  'use strict';
  function initCardStack() {
    const section = document.querySelector('.projects.section');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.project-card'));
    const total = cards.length;
    if (total < 2) return;

    /* ── wrap the grid in a sticky scroll container ── */
    const grid = section.querySelector('.projects__grid');
    grid.style.display = 'block'; // override CSS grid while stacking

    /* outer scroll track — tall enough for each card to have scroll space */
    const SCROLL_PER_CARD = window.innerHeight * 0.85;
    const track = document.createElement('div');
    track.className = 'stack-track';
    track.style.cssText = `
      position: relative;
      height: ${SCROLL_PER_CARD * total + window.innerHeight * 0.5}px;
    `;

    /* sticky stage that holds all cards */
    const stage = document.createElement('div');
    stage.className = 'stack-stage';
    stage.style.cssText = `
      position: sticky;
      top: 0;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1200px;
      overflow: hidden;
    `;

    /* move cards into stage */
    cards.forEach((card, i) => {
      card.style.cssText += `
        position: absolute;
        width: min(680px, 90vw);
        will-change: transform, opacity;
        transition: none;        /* we drive this via rAF */
        backface-visibility: hidden;
        transform-origin: center 60%;
      `;
      card.dataset.stackIndex = i;
      stage.appendChild(card);
    });

    track.appendChild(stage);
    grid.replaceWith(track);
    track.appendChild(grid); // keep grid in DOM for AOS / other refs (hidden)
    grid.style.display = 'none';

    /* ── render loop ── */
    function render() {
      const rect   = track.getBoundingClientRect();
      const trackH = track.offsetHeight - window.innerHeight;
      // how far we've scrolled INTO the track (0 → 1)
      const progress = Math.max(0, Math.min(1, -rect.top / trackH));
      // which "slot" are we on (can be fractional)
      const slot = progress * (total - 1);

      cards.forEach((card, i) => {
        const dist = i - slot; // negative = behind, 0 = front, positive = not yet shown

        let translateY, translateZ, scaleXY, opacity, rotateX, zIndex;

        if (dist > 1) {
          /* ── not yet arrived — stack below viewport ── */
          translateY =  120 + (dist - 1) * 60;
          translateZ = -80  * dist;
          scaleXY    = 0.88;
          opacity    = 0;
          rotateX    = -3;
          zIndex     = 0;

        } else if (dist >= 0 && dist <= 1) {
          /* ── arriving card (0 = fully front, 1 = just below) ── */
          const t    = dist; // 0..1
          translateY =  t  * 120;
          translateZ = -t  * 80;
          scaleXY    = 1 - t * 0.12;
          opacity    = 1 - t * 0.35;
          rotateX    = t  * -3;
          zIndex     = Math.round((1 - t) * 100);

        } else if (dist < 0 && dist >= -1) {
          /* ── exiting card (slides back + shrinks) ── */
          const t    = -dist; // 0..1
          translateY = -t  * 40;
          translateZ = -t  * 200;
          scaleXY    = 1 - t * 0.18;
          opacity    = 1 - t * 0.65;
          rotateX    = t  * 4;
          zIndex     = Math.round((1 - t) * 90);

        } else {
          /* ── long gone — fully behind ── */
          const t = Math.abs(dist) - 1;
          translateY = -40 - t * 20;
          translateZ = -200 - t * 60;
          scaleXY    = 0.82 - t * 0.04;
          opacity    = 0;
          rotateX    = 6;
          zIndex     = 0;
        }

        card.style.zIndex   = zIndex;
        card.style.opacity  = Math.max(0, Math.min(1, opacity));
        card.style.filter   = 'none';
        card.style.transform = `
          translateY(${translateY.toFixed(2)}px)
          translateZ(${translateZ.toFixed(2)}px)
          scale(${scaleXY.toFixed(4)})
          rotateX(${rotateX.toFixed(2)}deg)
        `;
      });
    }

    /* ── progress indicator dots ── */
    const dots = document.createElement('div');
    dots.className = 'stack-dots';
    dots.style.cssText = `
      position: absolute;
      right: 28px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 200;
    `;
    cards.forEach((_, i) => {
      const d = document.createElement('span');
      d.style.cssText = `
        width: 7px; height: 7px;
        border-radius: 50%;
        background: rgba(91,110,245,0.3);
        border: 1px solid rgba(91,110,245,0.5);
        transition: background 0.3s, transform 0.3s;
        display: block;
      `;
      d.dataset.dotIdx = i;
      dots.appendChild(d);
    });
    stage.appendChild(dots);

    /* ── card counter label ── */
    const counter = document.createElement('div');
    counter.className = 'stack-counter';
    counter.style.cssText = `
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Syne', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(91,110,245,0.6);
      z-index: 200;
      pointer-events: none;
    `;
    stage.appendChild(counter);

    function updateUI() {
      const rect   = track.getBoundingClientRect();
      const trackH = track.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / trackH));
      const active = Math.round(progress * (total - 1));

      dots.querySelectorAll('span').forEach((d, i) => {
        if (i === active) {
          d.style.background  = 'var(--accent-primary, #5b6ef5)';
          d.style.transform   = 'scale(1.4)';
          d.style.boxShadow   = '0 0 8px rgba(91,110,245,0.8)';
        } else {
          d.style.background  = 'rgba(91,110,245,0.25)';
          d.style.transform   = 'scale(1)';
          d.style.boxShadow   = 'none';
        }
      });

      counter.textContent = `${active + 1} / ${total}`;
    }

    /* ── scroll label hint (disappears after first scroll) ── */
    const hint = document.createElement('div');
    hint.style.cssText = `
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.75rem;
      color: rgba(91,110,245,0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      z-index: 200;
      pointer-events: none;
      animation: hint-bounce 1.5s ease-in-out infinite;
    `;
    hint.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6">
        <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
      </svg>
      <span>scroll through projects</span>
    `;
    stage.appendChild(hint);
    window.addEventListener('scroll', () => {
      if (hint.parentNode) hint.style.opacity = '0';
    }, { once: true });

    /* ── RAF loop ── */
    let raf;
    function loop() {
      render();
      updateUI();
      raf = requestAnimationFrame(loop);
    }

    /* Only run RAF when section is near viewport */
    const visObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          loop();
        } else {
          cancelAnimationFrame(raf);
        }
      });
    }, { rootMargin: '200px' });
    visObs.observe(track);

    /* initial render */
    render(); updateUI();
  }

  /* ──────────────────────────────────────────────────────────
     2.  CERTIFICATIONS  — HORIZONTAL CAROUSEL ON SCROLL
         Cards slide in from the right as you scroll down.
     ────────────────────────────────────────────────────────── */
  function initCertScroll() {
    const grid = document.querySelector('.certifications__grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.cert-card'));
    cards.forEach((card, i) => {
      card.style.cssText += `
        opacity: 0;
        transform: translateX(60px) scale(0.94);
        transition: opacity 0.55s ${i * 0.07}s cubic-bezier(0.4,0,0.2,1),
                    transform 0.55s ${i * 0.07}s cubic-bezier(0.4,0,0.2,1);
      `;
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          cards.forEach(c => {
            c.style.opacity   = '1';
            c.style.transform = 'translateX(0) scale(1)';
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    obs.observe(grid);
  }

  /* ──────────────────────────────────────────────────────────
     3.  ACHIEVEMENTS  — FLIP-IN FROM LEFT
     ────────────────────────────────────────────────────────── */
  function initAchievementFlip() {
    const cards = document.querySelectorAll('.achievement-card');
    cards.forEach((card, i) => {
      card.style.cssText += `
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity 0.55s ${i * 0.08}s cubic-bezier(0.4,0,0.2,1),
                    transform 0.55s ${i * 0.08}s cubic-bezier(0.4,0,0.2,1);
        will-change: transform, opacity;
      `;
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const card = e.target;
          card.style.opacity   = '1';
          card.style.transform = 'translateX(0)';
          obs.unobserve(card);
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(c => obs.observe(c));
  }

  /* ──────────────────────────────────────────────────────────
     4.  SKILLS  — BAR COUNT-UP WITH STAGGER
     ────────────────────────────────────────────────────────── */
  function initSkillCountUp() {
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, i) => {
      skill.style.cssText += `
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity 0.5s ${i * 0.1}s ease,
                    transform 0.5s ${i * 0.1}s ease;
      `;
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const skill = e.target;
          skill.style.opacity   = '1';
          skill.style.transform = 'translateX(0)';
          const bar = skill.querySelector('.skill__progress');
          const pct = skill.querySelector('.skill__percentage');
          const target = parseInt(bar?.dataset.percentage || 0);
          if (bar) {
            setTimeout(() => { bar.style.width = target + '%'; }, 200 + i * 100);
          }
          if (pct) {
            let count = 0;
            const step = () => {
              count = Math.min(count + 2, target);
              pct.textContent = count + '%';
              if (count < target) requestAnimationFrame(step);
            };
            setTimeout(step, 300 + i * 100);
          }
          obs.unobserve(skill);
        }
      });
    }, { threshold: 0.3 });
    skills.forEach(s => obs.observe(s));
  }

  /* ──────────────────────────────────────────────────────────
     5.  ABOUT SECTION  — SPLIT REVEAL
         Image slides from left, text from right
     ────────────────────────────────────────────────────────── */
  function initAboutReveal() {
    const img  = document.querySelector('.about__image');
    const text = document.querySelector('.about__text');
    if (!img || !text) return;

    img.style.cssText += `
      opacity: 0;
      transform: translateX(-50px) scale(0.96);
      transition: opacity 0.8s 0.1s cubic-bezier(0.4,0,0.2,1),
                  transform 0.8s 0.1s cubic-bezier(0.4,0,0.2,1);
    `;
    text.style.cssText += `
      opacity: 0;
      transform: translateX(50px);
      transition: opacity 0.8s 0.25s cubic-bezier(0.4,0,0.2,1),
                  transform 0.8s 0.25s cubic-bezier(0.4,0,0.2,1);
    `;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          img.style.opacity    = '1';
          img.style.transform  = 'translateX(0) scale(1)';
          text.style.opacity   = '1';
          text.style.transform = 'translateX(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(document.querySelector('.about.section'));
  }

  /* ──────────────────────────────────────────────────────────
     6.  SECTION TITLE  — LETTER-BY-LETTER REVEAL
     ────────────────────────────────────────────────────────── */
  function initTitleReveal() {
    const titles = document.querySelectorAll('.section__title');
    titles.forEach(title => {
      // Split into chars preserving the <span> for gradient
      const html = title.innerHTML;
      // Only wrap the plain text nodes, not the span
      const parts = [];
      title.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const chars = node.textContent.split('').map((ch, i) => {
            if (ch === ' ') return ' ';
            return `<span class="title-char" style="
              display:inline-block;
              opacity:0;
              transform:translateY(20px);
              transition:opacity 0.4s ease, transform 0.4s ease;
            ">${ch}</span>`;
          });
          parts.push(chars.join(''));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // wrap span children too
          const inner = node.textContent.split('').map(ch => {
            if (ch === ' ') return ' ';
            return `<span class="title-char" style="
              display:inline-block;
              opacity:0;
              transform:translateY(20px);
              transition:opacity 0.4s ease, transform 0.4s ease;
            ">${ch}</span>`;
          }).join('');
          parts.push(`<span class="${node.className}">${inner}</span>`);
        }
      });
      title.innerHTML = parts.join('');

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const chars = e.target.querySelectorAll('.title-char');
            chars.forEach((ch, i) => {
              setTimeout(() => {
                ch.style.opacity   = '1';
                ch.style.transform = 'translateY(0)';
              }, i * 35);
            });
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      obs.observe(title);
    });
  }

  /* ──────────────────────────────────────────────────────────
     7.  CONTACT FORM  — FIELD FOCUS GLOW + LABEL FLOAT
     ────────────────────────────────────────────────────────── */
  function initContactAnimations() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.style.cssText += `
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.7s 0.2s ease, transform 0.7s 0.2s ease;
    `;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          form.style.opacity   = '1';
          form.style.transform = 'translateY(0)';
          obs.unobserve(form);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(form);
  }

  /* ──────────────────────────────────────────────────────────
     8.  HERO  — STAGGERED ENTRANCE
     ────────────────────────────────────────────────────────── */
  function initHeroEntrance() {
    const items = document.querySelectorAll('.hero__text .reveal-up');
    items.forEach((el, i) => {
      el.style.transitionDelay = `${0.1 + i * 0.12}s`;
      // Trigger after a tiny paint delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.add('visible');
        });
      });
    });
    const img = document.querySelector('.hero__image.reveal-up');
    if (img) {
      img.style.transitionDelay = '0.5s';
      requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('visible')));
    }
  }

  /* ──────────────────────────────────────────────────────────
     INJECT CSS for hint bounce + stack transitions
     ────────────────────────────────────────────────────────── */
  function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes hint-bounce {
        0%,100% { transform: translateX(-50%) translateY(0); }
        50%      { transform: translateX(-50%) translateY(8px); }
      }

      /* Stack track section title stays above sticky stage */
      .stack-track .section__title-wrapper {
        position: relative;
        z-index: 300;
        text-align: center;
        padding-bottom: 20px;
      }

      /* Project card base inside stack */
      .stack-stage .project-card {
        box-shadow:
          0 30px 80px rgba(0,0,0,0.6),
          0 0 60px rgba(91,110,245,0.15),
          inset 0 1px 0 rgba(255,255,255,0.06);
        border: 1px solid rgba(91,110,245,0.22);
      }

      /* Preserve 3D on stage */
      .stack-stage {
        transform-style: preserve-3d;
      }

      /* Dot indicator hover */
      .stack-dots span:hover {
        background: var(--accent-cyan, #22d3ee) !important;
        cursor: default;
      }

      /* Mobile: disable stack, revert to normal grid */
      @media (max-width: 700px) {
        .stack-stage {
          perspective: none !important;
          height: auto !important;
          position: relative !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 20px !important;
          padding: 20px !important;
        }
        .stack-stage .project-card {
          position: relative !important;
          width: 100% !important;
          opacity: 1 !important;
          transform: none !important;
          filter: none !important;
        }
        .stack-track {
          height: auto !important;
        }
        .stack-dots,
        .stack-counter { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── INIT ALL ─────────────────────────────────── */
  function init() {
    injectCSS();
    initHeroEntrance();
    initAboutReveal();
    initSkillCountUp();
    initCardStack();       // ← the main star: 3D stack scroll
    initCertScroll();
    initAchievementFlip();
    initContactAnimations();
    initTitleReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();