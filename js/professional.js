/* Typewriter for hero word "Maßgeschneiderte"
 * - Variable per-character delays (80–200ms)
 * - Longer pauses for uppercase and umlauts
 * - Occasional typo simulation with backspace correction
 * - Blinking cursor that persists 2s after done
 * - Optional sound hooks (simple Audio elements)
 */
(function () {
  const targetSelector = '.hero-title .hero-word-script';
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
    // Fallback: if JS breaks show full text
    if (!el) return;
    const original = word;
    el.textContent = '';

    const cursor = createCursor();
    el.after(cursor);

    const typoPositions = chooseTyposFor(word);
    let output = '';
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const baseDelay = randomBetween(80, 200);
      const extra = isUpperOrUmlaut(ch) ? randomBetween(80, 160) : (Math.random() < 0.2 ? randomBetween(30, 80) : 0);
      const delay = baseDelay + extra;

      // Occasional deliberate pause to simulate thinking
      if (Math.random() < 0.06) {
        await new Promise(r => setTimeout(r, randomBetween(120, 260)));
      }

      // Typo handling
      if (typoPositions.includes(i)) {
        // insert wrong character (neighbor or random letter)
        const wrong = 'asdfjklöuiopqwertzxcvbnm'.charAt(randomBetween(0, 26));
        output += wrong;
        el.textContent = output;
        playKey();
        await new Promise(r => setTimeout(r, randomBetween(60, 140)));
        // backspace
        output = output.slice(0, -1);
        el.textContent = output;
        await new Promise(r => setTimeout(r, randomBetween(80, 140)));
      }

      output += ch;
      el.textContent = output;
      playKey();
      await new Promise(r => setTimeout(r, delay));
    }

    // Keep cursor for a bit and then fade
    await new Promise(r => setTimeout(r, 2000));
    cursor.style.animation = 'tw-blink 1s steps(2, end) infinite, tw-wobble 1.6s ease-in-out infinite, tw-fade 400ms ease forwards';
    playBell();
  }

  function bootstrap() {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    const full = 'Maßgeschneiderte';
    // Fallback: if animation fails within 100ms, show full word
    const fallbackTimeout = setTimeout(() => {
      if (!el.textContent) el.textContent = full;
    }, 100);
    typeWord(el, full).finally(() => clearTimeout(fallbackTimeout));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();


