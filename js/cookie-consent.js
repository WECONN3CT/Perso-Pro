/* PersoPro Cookie Consent (vanilla JS)
 * - Kategorien: essential, analytics, marketing
 * - Speicherung: localStorage 'pp_cookie_consent' {version, timestamp, categories}
 * - Defer: nutzt <script type="text/plain" data-cookie-category="analytics|marketing"> ... </script>
 */

(function () {
  const CONSENT_STORAGE_KEY = 'pp_cookie_consent';
  const CONSENT_VERSION = 1;

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;
      if (data.version !== CONSENT_VERSION) return null;
      return data;
    } catch (_) {
      return null;
    }
  }

  function saveConsent(categories) {
    const data = {
      version: CONSENT_VERSION,
      timestamp: Date.now(),
      categories: {
        essential: true,
        analytics: !!categories.analytics,
        marketing: !!categories.marketing
      }
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
    return data;
  }

  function enableDeferredScripts(consent) {
    const allowed = new Set(['essential']);
    if (consent.categories.analytics) allowed.add('analytics');
    if (consent.categories.marketing) allowed.add('marketing');

    const placeholders = document.querySelectorAll('script[type="text/plain"][data-cookie-category]');
    placeholders.forEach((node) => {
      const cat = node.getAttribute('data-cookie-category');
      if (!allowed.has(cat)) return;

      const s = document.createElement('script');
      // Copy attributes except type and data-cookie-category
      for (const { name, value } of Array.from(node.attributes)) {
        if (name === 'type' || name === 'data-cookie-category') continue;
        s.setAttribute(name, value);
      }
      s.type = node.getAttribute('data-script-type') || 'text/javascript';
      if (node.textContent) s.text = node.textContent;
      node.replaceWith(s);
    });
  }

  function openModal() {
    const m = document.getElementById('cc-modal');
    if (!m) return;
    m.classList.remove('cc-hidden');
    requestAnimationFrame(() => m.classList.add('cc-visible'));
  }

  function closeModal() {
    const m = document.getElementById('cc-modal');
    if (!m) return;
    m.classList.remove('cc-visible');
    const onEnd = () => {
      m.classList.add('cc-hidden');
      m.removeEventListener('transitionend', onEnd);
    };
    let fallback = setTimeout(onEnd, 400);
    m.addEventListener('transitionend', () => { clearTimeout(fallback); onEnd(); }, { once: true });
  }

  function showBanner() {
    const b = document.getElementById('cc-banner');
    if (!b) return;
    // sichtbar machen und im nächsten Frame animiert einblenden
    b.classList.remove('cc-hidden');
    requestAnimationFrame(() => {
      b.classList.add('cc-visible');
    });
  }

  function hideBanner() {
    const b = document.getElementById('cc-banner');
    if (!b) return;
    // erst ausblenden, danach display:none setzen
    b.classList.remove('cc-visible');
    const onEnd = () => {
      b.classList.add('cc-hidden');
      b.removeEventListener('transitionend', onEnd);
    };
    // Fallback, falls transitionend nicht feuert
    let fallback = setTimeout(onEnd, 600);
    b.addEventListener('transitionend', () => {
      clearTimeout(fallback);
      onEnd();
    }, { once: true });
  }

  function initUI(consent) {
    // Pre-check toggles in modal based on consent
    const analyticsToggle = document.getElementById('cc-opt-analytics');
    const marketingToggle = document.getElementById('cc-opt-marketing');
    if (analyticsToggle) analyticsToggle.checked = !!(consent && consent.categories.analytics);
    if (marketingToggle) marketingToggle.checked = !!(consent && consent.categories.marketing);

    // Wire events
    const btnAcceptAll = document.querySelectorAll('[data-cc-accept-all]');
    const btnReject = document.querySelectorAll('[data-cc-reject]');
    const btnSettings = document.querySelectorAll('[data-cc-settings]');
    const btnSave = document.querySelectorAll('[data-cc-save]');
    const btnClose = document.getElementById('cc-close');
    const links = document.querySelectorAll('[data-open-cookie-settings]');
    const fab = document.getElementById('cc-fab');

    btnAcceptAll.forEach((el) => el.addEventListener('click', () => {
      const c = saveConsent({ analytics: true, marketing: true });
      enableDeferredScripts(c);
      hideBanner();
      closeModal();
    }));

    btnReject.forEach((el) => el.addEventListener('click', () => {
      const c = saveConsent({ analytics: false, marketing: false });
      hideBanner();
      closeModal();
    }));

    btnSettings.forEach((el) => el.addEventListener('click', () => {
      openModal();
    }));

    if (btnClose) btnClose.addEventListener('click', () => {
      closeModal();
    });

    btnSave.forEach((el) => el.addEventListener('click', () => {
      const analytics = analyticsToggle ? !!analyticsToggle.checked : false;
      const marketing = marketingToggle ? !!marketingToggle.checked : false;
      const c = saveConsent({ analytics, marketing });
      enableDeferredScripts(c);
      hideBanner();
      closeModal();
    }));

    links.forEach((el) => el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));

    if (fab) {
      fab.addEventListener('click', () => {
        openModal();
      });
    }
  }

  function bootstrap() {
    const current = readConsent();
    initUI(current);
    if (current) {
      enableDeferredScripts(current);
    } else {
      // Keine Zustimmung: Banner anzeigen und FAB hervorheben
      showBanner();
      const fab = document.getElementById('cc-fab');
      if (fab) fab.classList.add('cc-attention');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();


