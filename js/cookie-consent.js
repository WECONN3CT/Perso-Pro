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
    if (m) m.classList.remove('cc-hidden');
  }

  function closeModal() {
    const m = document.getElementById('cc-modal');
    if (m) m.classList.add('cc-hidden');
  }

  function showBanner() {
    const b = document.getElementById('cc-banner');
    if (b) b.classList.remove('cc-hidden');
  }

  function hideBanner() {
    const b = document.getElementById('cc-banner');
    if (b) b.classList.add('cc-hidden');
  }

  function initUI(consent) {
    // Pre-check toggles in modal based on consent
    const analyticsToggle = document.getElementById('cc-opt-analytics');
    const marketingToggle = document.getElementById('cc-opt-marketing');
    if (analyticsToggle) analyticsToggle.checked = !!(consent && consent.categories.analytics);
    if (marketingToggle) marketingToggle.checked = !!(consent && consent.categories.marketing);

    // Wire events
    const btnAcceptAll = document.getElementById('cc-accept-all');
    const btnReject = document.getElementById('cc-reject');
    const btnSettings = document.getElementById('cc-settings');
    const btnSave = document.getElementById('cc-save');
    const btnClose = document.getElementById('cc-close');
    const links = document.querySelectorAll('[data-open-cookie-settings]');

    if (btnAcceptAll) btnAcceptAll.addEventListener('click', () => {
      const c = saveConsent({ analytics: true, marketing: true });
      enableDeferredScripts(c);
      hideBanner();
      closeModal();
    });

    if (btnReject) btnReject.addEventListener('click', () => {
      const c = saveConsent({ analytics: false, marketing: false });
      // Do not run deferred scripts
      hideBanner();
      closeModal();
    });

    if (btnSettings) btnSettings.addEventListener('click', () => {
      openModal();
    });

    if (btnClose) btnClose.addEventListener('click', () => {
      closeModal();
    });

    if (btnSave) btnSave.addEventListener('click', () => {
      const analytics = analyticsToggle ? !!analyticsToggle.checked : false;
      const marketing = marketingToggle ? !!marketingToggle.checked : false;
      const c = saveConsent({ analytics, marketing });
      enableDeferredScripts(c);
      hideBanner();
      closeModal();
    });

    links.forEach((el) => el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));
  }

  function bootstrap() {
    const current = readConsent();
    initUI(current);
    if (current) {
      // Consent present → enable allowed scripts immediately
      enableDeferredScripts(current);
    } else {
      // No consent → show banner
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();


