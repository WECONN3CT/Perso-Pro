/* Typewriter for hero word "Maßgeschneiderte"
 * - Variable per-character delays (80–200ms)
 * - Longer pauses for uppercase and umlauts
 * - Occasional typo simulation with backspace correction
 * - Blinking cursor that persists 2s after done
 * - Optional sound hooks (simple Audio elements)
 */
(function () {
  const targetSelector = '.hero-script';
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

    // Measure full width responsive
    const fullWidth = () => text.getBoundingClientRect().width;
    function speedForChar(ch) {
      // sehr sanfte, enge Ranges für gleichmäßige Bewegung
      if (/[aegosßöäü]/i.test(ch)) return randomBetween(20, 26);
      if (/[mntuirl]/i.test(ch)) return randomBetween(26, 34);
      return randomBetween(22, 30);
    }

    const widths = [];
    const total = word.length;
    let cumulative = 0;
    for (let i = 0; i < total; i++) {
      const chunk = 1 / total;
      cumulative += chunk;
      widths.push({ idx: i, fraction: cumulative, char: word[i], speed: speedForChar(word[i]) });
    }

    let currentIndex = 0;
    await new Promise((resolve) => {
      function step() {
        const totalW = fullWidth();
        if (currentIndex >= widths.length) { resolve(); return; }
        const target = widths[currentIndex];
        const targetPx = target.fraction * totalW;
        const currentPx = reveal.offsetWidth;
        const delta = targetPx - currentPx;
        const dir = Math.sign(delta);
        // Sehr weicher Progress: konstanter kleiner Schritt + sanftes Ease
        const stepPx = Math.max(0.5, Math.min(Math.abs(delta), target.speed * 0.36));
        const next = currentPx + dir * stepPx;
        reveal.style.width = `${next}px`;

        if (Math.abs(delta) < 0.8) {
          currentIndex++;
          const pause = /[aouäöüßg]/i.test(target.char) ? randomBetween(22, 40) : randomBetween(12, 26);
          setTimeout(() => requestAnimationFrame(step), pause);
        } else {
          requestAnimationFrame(step);
        }
      }
      setTimeout(() => requestAnimationFrame(step), 240);
    });
  }

  function bootstrap() {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    const full = 'Maßgeschneiderte';
    // Start the non-SVG fluid reveal on scroll into view
    const startAnimation = () => {
      const fallbackTimeout = setTimeout(() => { if (!el.textContent) el.textContent = full; }, 150);
      typeWord(el, full).finally(() => clearTimeout(fallbackTimeout));
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { startAnimation(); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();


