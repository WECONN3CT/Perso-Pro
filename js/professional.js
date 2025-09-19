/* Typewriter for hero word "Maßgeschneiderte"
 * - Variable per-character delays (80–200ms)
 * - Longer pauses for uppercase and umlauts
 * - Occasional typo simulation with backspace correction
 * - Blinking cursor that persists 2s after done
 * - Optional sound hooks (simple Audio elements)
 */
(function () {
  const targetSelector = '.hero-title .hero-word-script';
  const svgMountSelector = '.hero-title';
  const cursorClass = 'tw-cursor';
  const enableSounds = false; // set true to enable sounds if provided

  const typeSoundUrl = 'sounds/typewriter-key.mp3';
  const endBellUrl = 'sounds/typewriter-ding.mp3';
  let keyAudio, endAudio;
  if (enableSounds) {
    try {
      keyAudio = new Audio(typeSoundUrl);
      keyAudio.preload = 'auto';
      endAudio = new Audio(endBellUrl);
      endAudio.preload = 'auto';
    } catch (_) {}
  }

  function isUpperOrUmlaut(ch) {
    return /[A-ZÄÖÜẞ]/.test(ch);
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function chooseTyposFor(word) {
    // choose 0-2 typos positions excluding last char
    const count = Math.random() < 0.6 ? 1 : (Math.random() < 0.2 ? 2 : 0);
    const positions = new Set();
    while (positions.size < count) {
      const idx = randomBetween(1, Math.max(1, word.length - 3));
      positions.add(idx);
    }
    return Array.from(positions).sort((a,b)=>a-b);
  }

  function createCursor() {
    const cursor = document.createElement('span');
    cursor.className = cursorClass;
    cursor.setAttribute('aria-hidden', 'true');
    return cursor;
  }

  function playKey() { if (enableSounds && keyAudio) { try { keyAudio.currentTime = 0; keyAudio.play(); } catch(_){} } }
  function playBell() { if (enableSounds && endAudio) { try { endAudio.currentTime = 0; endAudio.play(); } catch(_){} } }

  async function typeWord(el, word) {
    if (!el) return;
    // Build reveal structure: wrapper span with relative positioning
    el.style.position = 'relative';
    const reveal = document.createElement('span');
    reveal.className = 'hw-reveal';
    const text = document.createElement('span');
    text.className = 'hw-text';
    text.textContent = word;
    const pen = document.createElement('span');
    pen.className = 'hw-pen';
    reveal.appendChild(text);
    el.textContent = '';
    el.appendChild(reveal);
    el.appendChild(pen);

    // Measure full width responsive
    const fullWidth = () => text.getBoundingClientRect().width;
    function speedForChar(ch) {
      // slower for curves, faster for straight-ish
      if (/[aegosßöäü]/i.test(ch)) return randomBetween(26, 40); // slower px/ms
      if (/[mntuirl]/i.test(ch)) return randomBetween(40, 60); // faster
      return randomBetween(32, 52);
    }

    // Generate waypoints widths for fluid reveal with variable speeds and pauses
    const widths = [];
    const total = word.length;
    let cumulative = 0;
    for (let i = 0; i < total; i++) {
      const ch = word[i];
      const ratio = (i + 1) / total;
      // approximate char width fraction
      const chunk = 1 / total;
      cumulative += chunk;
      widths.push({ idx: i, fraction: cumulative, char: ch, speed: speedForChar(ch) });
    }

    // Animate reveal width and move pen
    const start = performance.now();
    let currentIndex = 0;

    await new Promise((resolve) => {
      function step(now) {
        const totalW = fullWidth();
        if (currentIndex >= widths.length) { resolve(); return; }
        const target = widths[currentIndex];
        // next target width in pixels
        const targetPx = target.fraction * totalW;
        const currentPx = reveal.offsetWidth;
        const delta = targetPx - currentPx;
        const dir = Math.sign(delta);
        const advance = Math.max(0.6, Math.min(Math.abs(delta), target.speed * 0.6)); // px per frame approx
        const next = currentPx + dir * advance;
        reveal.style.width = `${next}px`;
        pen.style.transform = `translateX(${next}px)`;
        // jitter for hand wobble
        pen.style.opacity = String(0.88 + Math.random() * 0.12);
        pen.style.transform += ` translateY(${(Math.sin(now/120)+Math.random()*0.2).toFixed(2)}px)`;

        // natural pauses at joins
        if (Math.abs(delta) < 1) {
          currentIndex++;
          // brief pause between letters
          const pause = /[aouäöüßg]/i.test(target.char) ? randomBetween(40, 90) : randomBetween(20, 60);
          setTimeout(() => requestAnimationFrame(step), pause);
        } else {
          requestAnimationFrame(step);
        }
      }
      // initial delay
      setTimeout(() => requestAnimationFrame(step), 220);
    });

    // finalize: ensure full width
    reveal.style.width = `${fullWidth()}px`;
    // hide pen elegantly
    pen.style.transition = 'opacity 360ms ease, transform 420ms ease';
    pen.style.opacity = '0';
    pen.style.transform += ' scale(0.85)';
  }

  function buildHandwritingSVG(word, mountRect) {
    // Stroke-based via <textPath> fallback: uses Dear Script (browser must have it / or local @font-face).
    // For pixel-perfect Dear Script, replace with exported glyph paths.
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'handwriting-svg');
    const width = Math.max(600, mountRect.width);
    const height = Math.max(120, mountRect.height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMinYMid meet');

    // Path baseline (slightly wavy to suggest natural movement)
    const baseline = document.createElementNS(svgNS, 'path');
    const dBase = `M10 ${height*0.6} C ${width*0.25} ${height*0.55}, ${width*0.5} ${height*0.65}, ${width*0.75} ${height*0.6} S ${width-10} ${height*0.62}, ${width-10} ${height*0.6}`;
    baseline.setAttribute('d', dBase);
    baseline.setAttribute('id', 'hw-baseline');
    baseline.setAttribute('fill', 'none');
    baseline.setAttribute('stroke', 'none');
    svg.appendChild(baseline);

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('class', 'hw-text');
    text.setAttribute('font-family', 'Dear Script, cursive');
    text.setAttribute('font-size', String(height * 0.45));
    text.setAttribute('dominant-baseline', 'middle');
    const textPath = document.createElementNS(svgNS, 'textPath');
    textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#hw-baseline');
    textPath.textContent = word;
    text.appendChild(textPath);
    svg.appendChild(text);

    // Create an invisible stroke outline clone for animation measurement
    const outline = document.createElementNS(svgNS, 'path');
    outline.setAttribute('d', baseline.getAttribute('d'));
    outline.setAttribute('class', 'hw-stroke hw-animate');
    outline.setAttribute('opacity', '0');
    svg.appendChild(outline);

    const pen = document.createElementNS(svgNS, 'circle');
    pen.setAttribute('class', 'hw-pen');
    pen.setAttribute('r', '5');
    pen.setAttribute('cx', '10');
    pen.setAttribute('cy', String(height*0.6));
    svg.appendChild(pen);

    return { svg, path: outline, pen };
  }

  function animatePath(path, pen, duration = 3500) {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    path.getBoundingClientRect();
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      // easeInOut for realistic acceleration
      const eased = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
      const draw = length * (1 - eased);
      path.style.strokeDashoffset = String(draw);
      // move pen along current point
      const pos = path.getPointAtLength(length * eased);
      pen.setAttribute('cx', pos.x.toFixed(2));
      pen.setAttribute('cy', pos.y.toFixed(2));
      // subtle pen opacity jitter
      pen.style.opacity = String(0.85 + Math.random()*0.15);
      if (t < 1) requestAnimationFrame(frame); else pen.style.opacity = '0';
    }
    requestAnimationFrame(frame);
  }

  function bootstrap() {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    const full = 'Maßgeschneiderte';
    // Build SVG handwriting and mount right after hero title wrapper
    const mount = document.querySelector(svgMountSelector);
    if (mount) {
      // Hide script span text content (we use stroke animation instead)
      el.style.visibility = 'hidden';
      const rect = mount.getBoundingClientRect();
      const { svg, path, pen } = buildHandwritingSVG(full, rect);
      mount.appendChild(svg);

      const startAnimation = () => {
        animatePath(path, pen, 3600);
      };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { startAnimation(); io.disconnect(); } });
    }, { threshold: 0.4 });
      io.observe(svg);
      // Fallback for very weak devices: show entire stroke
      setTimeout(() => {
        try {
          const len = path.getTotalLength();
          if (!len || !isFinite(len)) {
            path.style.strokeDashoffset = '0';
            pen.style.opacity = '0';
          }
        } catch(_) {}
      }, 600);
    } else {
      // fallback to previous type effect if mount missing
      const fallbackTimeout = setTimeout(() => { if (!el.textContent) el.textContent = full; }, 150);
      typeWord(el, full).finally(() => clearTimeout(fallbackTimeout));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();


