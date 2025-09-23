// ===================================
// PersoPro - Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    initMobileNavigation();
    
    // Smooth Scrolling
    initSmoothScrolling();
    
    // (removed) Featured Profiles section
    
    // Form Validation
    initFormValidation();
    
    // Lazy Loading Images
    initLazyLoading();

    // Hero Search interactions
    initHeroSearch();

    // Reveal animations for services sticky list
    initServicesReveal();

    // Stats counter animation
    initStatsCounters();

    // Roles reveal
    initRolesReveal();

    // Scroll progress bar under header
    initScrollProgress();

    // Header transparency → solid on scroll
    initHeaderScrollState();

    // Docked-to-Hero behavior (removed)

    // Hint Browser to use passive listeners globally where possible (no layout change)
    try {
        const opts = { passive: true };
        window.addEventListener('touchstart', function(){}, opts);
        window.addEventListener('touchmove', function(){}, opts);
        window.addEventListener('wheel', function(){}, opts);
    } catch (_) {}
});

// Smooth vertical snap progression on wheel for services list (desktop)
document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('.services-list');
    if (!list) return;
    let isScrolling = false;
    const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
    // Bild-Elemente (Crossfade) und Mapping definieren
    const imgA = document.getElementById('servicesImageA');
    const imgB = document.getElementById('servicesImageB');
    let activeIsA = true;
    const imageMap = [
        'images/leistungen/kuechenhilfe.png',
        'images/leistungen/servierer.png',
        'images/leistungen/barista.png'
    ];
    const imageForIndex = (idx) => imageMap[Math.max(0, Math.min(imageMap.length - 1, idx))];

    // Bilder vorab laden/decodieren, um Mikroruckler zu vermeiden
    const preloaded = new Set();
    function preload(src) {
        if (preloaded.has(src)) return;
        const i = new Image();
        i.src = src;
        if (i.decode) {
            i.decode().catch(() => {});
        }
        preloaded.add(src);
    }
    imageMap.forEach(preload);
    // Helper bleibt für evtl. direkte Sprünge verfügbar (nicht in Scroll benutzt)
    function updateServicesImage(idx) {
        if (!imgA || !imgB) return;
        const targetSrc = imageForIndex(idx);
        const activeLayer = activeIsA ? imgA : imgB;
        const otherLayer  = activeIsA ? imgB : imgA;
        if (activeLayer.getAttribute('src') === targetSrc) return;
        preload(targetSrc);
        otherLayer.src = targetSrc;
        otherLayer.classList.add('is-active');
        activeLayer.classList.remove('is-active');
        activeIsA = !activeIsA;
    }
    let slideWidth = 0;
    const updateSlideWidth = () => { slideWidth = list.clientWidth; };
    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    window.addEventListener('orientationchange', updateSlideWidth);
    window.addEventListener('load', () => { updateSlideWidth(); imageMap.forEach(preload); });
    let lockedIndex = 0;
    // Initiale Quellen sicherstellen
    if (imgA && !imgA.getAttribute('src')) imgA.src = imageForIndex(0);
    if (imgB && !imgB.getAttribute('src')) imgB.src = imageForIndex(1);
    let scrollEndTimer;
    const goTo = (index) => {
        lockedIndex = index;
        list.scrollTo({ left: lockedIndex * slideWidth, behavior: 'smooth' });
    };
    // Smooth, progress-basierte Bildüberblendung beim Scrollen
    const stickyMedia = document.querySelector('.sticky-media');
    // rAF-Throttling für butterweiche Updates
    let rafId = null;
    let lastLeft = 0;
    const EPS = 0.001;
    function updateOnRaf() {
        rafId = null;
        if (!imgA || !imgB) return;
        const progressRaw = (lastLeft / slideWidth) || 0;
        const base = Math.floor(progressRaw);
        let t = Math.min(1, Math.max(0, progressRaw - base));
        // sanftes Easing schon während der Bewegung
        const ease = (x) => 1 - Math.pow(1 - x, 2); // easeOutQuad
        const eased = ease(t);
        const nextIndex = Math.min(imageMap.length - 1, base + 1);
        const baseSrc = imageForIndex(base);
        const nextSrc = imageForIndex(nextIndex);
        preload(nextSrc);
        const front = activeIsA ? imgA : imgB;
        const back  = activeIsA ? imgB : imgA;
        // Nur aktualisieren, wenn sich etwas tatsächlich sichtbar ändert
        if (front.src.indexOf(baseSrc) === -1) front.src = baseSrc;
        if (back.src.indexOf(nextSrc) === -1) back.src = nextSrc;
        stickyMedia && stickyMedia.classList.add('scrubbing');
        const currentOpacity = parseFloat(front.style.opacity || '1');
        if (Math.abs((1 - eased) - currentOpacity) > EPS) {
            front.style.opacity = String(1 - eased);
            back.style.opacity  = String(eased);
            const scaleFrom = 1.04, scaleTo = 1.0;
            back.style.transform  = `scale(${(scaleFrom + (scaleTo - scaleFrom) * eased).toFixed(4)})`;
            front.style.transform = `scale(${(scaleTo + (scaleFrom - scaleTo) * eased).toFixed(4)})`;
        }

        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            lockedIndex = Math.round(lastLeft / slideWidth);
            const progressRawEnd = (lastLeft / slideWidth) || 0;
            const baseEnd = Math.floor(progressRawEnd);
            const tEnd = Math.min(1, Math.max(0, progressRawEnd - baseEnd));
            const easeEnd = (x) => 1 - Math.pow(1 - x, 2);
            const easedEnd = easeEnd(tEnd);
            const current = activeIsA ? imgA : imgB;
            const other = activeIsA ? imgB : imgA;
            const wantSrc = imageForIndex(lockedIndex);
            preload(wantSrc);
            // Wähle die aktuell sichtbare Ebene (>= 0.5 => other ist sichtbar)
            const finalActive = (easedEnd >= 0.5) ? other : current;
            const finalInactive = (finalActive === current) ? other : current;
            if (finalActive.getAttribute('src') !== wantSrc) finalActive.src = wantSrc;
            finalActive.classList.add('is-active');
            finalInactive.classList.remove('is-active');
            // Inline-Styles zurücksetzen, Übergänge wieder an
            finalActive.style.opacity = '';
            finalInactive.style.opacity = '';
            finalActive.style.transform = '';
            finalInactive.style.transform = '';
            stickyMedia && stickyMedia.classList.remove('scrubbing');
            activeIsA = (finalActive === imgA);
        }, 60);
    }

    list.addEventListener('scroll', () => {
        lastLeft = list.scrollLeft;
        if (rafId == null) {
            rafId = requestAnimationFrame(updateOnRaf);
        }
    }, { passive: true });

    // Kein Wheel-Override mehr: native horizontale Scroll-/Snap-Physik sorgt für flüssiges Verhalten

    // Keyboard navigation (links/rechts)
    list.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const cards = list.querySelectorAll('.service-card');
        updateSlideWidth();
        const nextIndex = e.key === 'ArrowRight' ? clamp(lockedIndex + 1, 0, cards.length - 1)
                                                 : clamp(lockedIndex - 1, 0, cards.length - 1);
        goTo(nextIndex);
    });

    // Touch swipe (links/rechts)
    let startX = 0, startY = 0, touching = false;
    const SWIPE_THRESHOLD = 50; // etwas höher für stabileres Gefühl
    list.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        touching = true;
    }, { passive: true });

    list.addEventListener('touchend', (e) => {
        if (!touching) return;
        touching = false;
        const t = e.changedTouches && e.changedTouches[0];
        if (!t) return;
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        if (Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < SWIPE_THRESHOLD) return; // nur horizontale, deutliche Wischgesten
        const direction = dx < 0 ? 1 : -1;
        const cards = list.querySelectorAll('.service-card');
        updateSlideWidth();
        const nextIndex = clamp(lockedIndex + direction, 0, cards.length - 1);
        goTo(nextIndex);
    }, { passive: true });

    // (früher definiert)
});

// Slider arrows for services list
document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('.services-list');
    const prev = document.getElementById('svcPrev');
    const next = document.getElementById('svcNext');
    if (!list || !prev || !next) return;
    const getSlideWidth = () => list.clientWidth;
    prev.addEventListener('click', () => {
        list.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
        list.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
    });
});

// ===================================
// Mobile Navigation
// ===================================

function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    if (navToggle && navMenu) {
        // Korrigiere dynamische Top-Position des mobilen Menüs anhand Headerhöhe
        const setMenuTop = () => {
            const headerRect = (document.querySelector('.header') || {}).getBoundingClientRect?.();
            const h = headerRect ? Math.round(headerRect.height) : 72;
            navMenu.style.setProperty('--mobile-menu-top', h + 'px');
        };
        setMenuTop();
        window.addEventListener('resize', setMenuTop, { passive: true });
        window.addEventListener('orientationchange', setMenuTop);
        // ARIA initialisieren
        const menuId = navMenu.id || 'primary-navigation';
        if (!navMenu.id) navMenu.id = menuId;
        navToggle.setAttribute('aria-controls', menuId);
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');

        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            header && header.classList.toggle('nav-open');
            
            // Animate hamburger menu
            // Styles werden rein via CSS gesteuert (cleaner)

            // ARIA + Scroll-Lock
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navMenu.setAttribute('aria-hidden', String(!isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                header && header.classList.remove('nav-open');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });

        // Verhindere, dass das Overlay Klicks auf Links blockiert
        const onMenuClick = (e) => {
            e.stopPropagation();
        };
        navMenu.addEventListener('click', onMenuClick);
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                header && header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                header && header.classList.remove('nav-open');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===================================
// Smooth Scrolling
// ===================================

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const header = document.querySelector('.header');
                const headerOffset = header ? Math.round(header.getBoundingClientRect().height) : 72;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// (removed) loadFeaturedProperties

// ===================================
// Form Validation
// ===================================

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    showFieldError(field, 'Dieses Feld ist erforderlich');
                } else {
                    field.classList.remove('error');
                    clearFieldError(field);
                }
                
                // Email validation
                if (field.type === 'email' && field.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        showFieldError(field, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
                    }
                }
                
                // Phone validation
                if (field.type === 'tel' && field.value) {
                    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                    if (!phoneRegex.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        showFieldError(field, 'Bitte geben Sie eine gültige Telefonnummer ein');
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                showSuccessMessage(form);
                // Reset form
                form.reset();
            }
        });
        
        // Clear error on input
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    clearFieldError(this);
                }
            });
        });
    });
}

function showFieldError(field, message) {
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('field-error')) {
        errorElement = document.createElement('span');
        errorElement.classList.add('field-error');
        const refId = field.id || field.name || `field-${Math.random().toString(36).slice(2,7)}`;
        errorElement.id = `${refId}-error`;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    field.setAttribute('aria-invalid', 'true');
    if (errorElement.id) field.setAttribute('aria-describedby', errorElement.id);
    errorElement.textContent = message;
    errorElement.style.color = '#DC3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
}

function clearFieldError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('field-error')) {
        errorElement.remove();
    }
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
}

function showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.textContent = 'Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.';
    successMessage.setAttribute('role', 'status');
    successMessage.setAttribute('aria-live', 'polite');
    successMessage.tabIndex = -1;
    successMessage.style.cssText = `
        background: #28A745;
        color: white;
        padding: 1rem;
        border-radius: 6px;
        margin-top: 1rem;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    form.appendChild(successMessage);
    try { successMessage.focus({ preventScroll: true }); } catch(_) {}
    
    setTimeout(() => {
        successMessage.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successMessage.remove(), 300);
    }, 5000);
}

// ===================================
// Lazy Loading
// ===================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// Utility Functions
// ===================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatPrice(price, type = 'Kauf') {
    const formatted = price.toLocaleString('de-DE');
    return type === 'Miete' ? `${formatted} €/Monat` : `${formatted} €`;
}

// ===================================
// Hero Search
// ===================================

function initHeroSearch() {
    const chipButtons = document.querySelectorAll('.hero-search .chip');
    const typeInput = document.getElementById('heroType');
    // Prevent container scroll issues on iOS when inputs are focused
    const search = document.querySelector('.hero-search');
    if (search) {
        search.addEventListener('touchmove', (e) => {
            // allow internal scroll of selects/inputs, prevent body scroll hijack
            e.stopPropagation();
        }, { passive: true });
    }
    chipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            chipButtons.forEach(b => b.classList.remove('chip-active'));
            btn.classList.add('chip-active');
            if (typeInput) typeInput.value = btn.dataset.type || '';
        });
    });
}

function toggleHeroMore(button) {
    const container = document.querySelector('.hero-more');
    if (!container) return;
    const isHidden = container.hasAttribute('hidden');
    if (isHidden) {
        container.removeAttribute('hidden');
        button.setAttribute('aria-expanded', 'true');
    } else {
        container.setAttribute('hidden', '');
        button.setAttribute('aria-expanded', 'false');
    }
}

function handleHeroSearch(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const params = new URLSearchParams(new FormData(form));
    // Weiterleitung zur Leistungen-Seite mit Query-Parametern
    const url = `unsere-leistungen.html?${params.toString()}#properties`;
    window.location.href = url;
    return false;
}

// ===================================
// Animations
// ===================================

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .fade-in {
        animation: fadeIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    
    .slide-in {
        animation: slideIn 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
`;
document.head.appendChild(style);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            // Prestate entfernen, danach animieren
            target.style.opacity = '';
            target.style.transform = '';
            target.classList.add('fade-in', 'slide-in');
            target.addEventListener('animationend', () => {
                target.style.willChange = '';
                target.style.backfaceVisibility = '';
                target.style.transformStyle = '';
            }, { once: true });
            scrollObserver.unobserve(target);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .property-card, .about-preview, .leistungen-page .value, .leistungen-page .step, .leistungen-page .acc-item');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    animatedElements.forEach((el, i) => {
        el.style.willChange = 'transform, opacity';
        el.style.backfaceVisibility = 'hidden';
        el.style.transformStyle = 'preserve-3d';
        if (!prefersReduced) {
            // initial unsichtbar, um Flash beim ersten Reveal zu vermeiden
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0,12px,0)';
            el.style.animationDelay = `${i * 100}ms`;
            scrollObserver.observe(el);
        } else {
            el.classList.add('fade-in', 'slide-in');
        }
    });
});

// (removed) initPropertiesCarousel

// ===================================
// Services Reveal
// ===================================

function initServicesReveal() {
    const revealItems = document.querySelectorAll('.services-list .reveal');
    if (!revealItems.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    revealItems.forEach(el => observer.observe(el));
}

// ===================================
// Stats Counters (About Section)
// ===================================

function initStatsCounters() {
    const counters = document.querySelectorAll('.about-stats .stat-number');
    if (!counters.length) return;

    // Prepare counters
    counters.forEach(el => {
        const text = (el.textContent || '').trim();
        const match = text.match(/^(\d+[\.,]?\d*)(.*)$/);
        if (!match) return;
        const numeric = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
        const suffix = match[2] || '';
        el.dataset.target = String(numeric);
        el.dataset.suffix = suffix;
        el.textContent = `0${suffix}`;
    });

    const animate = (el, to, suffix, duration = 1200) => {
        const start = performance.now();
        const from = 0;
        const step = now => {
            const progress = Math.min(1, (now - start) / duration);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(from + (to - from) * eased);
            el.textContent = `${value.toLocaleString('de-DE')}${suffix}`;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.counted === 'true') return;
                el.dataset.counted = 'true';
                const to = parseFloat(el.dataset.target || '0');
                const suffix = el.dataset.suffix || '';
                animate(el, to, suffix);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
}

function initRolesReveal() {
    const cards = document.querySelectorAll('.roles-grid .role-card');
    if (!cards.length) return;
    const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('slide-in');
                o.unobserve(e.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    cards.forEach((c, i) => {
        c.style.animationDelay = `${80 * i}ms`;
        obs.observe(c);
    });
}

// ===================================
// Scroll Progress Bar
// ===================================

function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    const container = bar.parentElement;
    const header = document.querySelector('.header');
    let anchorY = 0;
    let lastFixed = null; // null = undef, true/false = Zustand
    const headerHeight = () => (header ? Math.round(header.getBoundingClientRect().height) : 72);
    const computeAnchor = () => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        anchorY = window.pageYOffset + rect.top; // absolute Dokumentposition der Leiste
    };
    const applyTop = () => { /* Top wird beim Fixieren gesetzt */ };
    const update = () => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollTop = doc.scrollTop || body.scrollTop;
        const scrollHeight = (doc.scrollHeight || body.scrollHeight) - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (!update._raf) {
            update._raf = requestAnimationFrame(() => {
                bar.style.width = `${progress}%`;
                update._raf = null;
            });
        }
        // Fix/Unfix über stabile Schwelle: Headerhöhe + scrollY >= anchorY
        const h = headerHeight();
        const headerBottom = window.pageYOffset + h;
        const tolerance = 1; // 1px Hysterese gegen Flackern
        // Solange noch nicht fixiert, Anker laufend nachführen (bei nachladenden Inhalten)
        if (!lastFixed) {
            anchorY = window.pageYOffset + container.getBoundingClientRect().top;
        }
        const shouldFix = headerBottom >= (anchorY - tolerance);
        if (lastFixed !== shouldFix) {
            lastFixed = shouldFix;
            if (shouldFix) {
                container.classList.add('is-fixed');
                container.style.top = `${h}px`;
            } else if (headerBottom < (anchorY - tolerance)) {
                container.classList.remove('is-fixed');
                container.style.top = '0px';
            }
        }
        container.style.visibility = 'visible';
        container.style.opacity = '1';
    };
    computeAnchor();
    applyTop();
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', () => { computeAnchor(); update(); });
    window.addEventListener('orientationchange', () => { computeAnchor(); update(); });
}

// Switch header style based on scroll position
function initHeaderScrollState() {
    const header = document.querySelector('.header');
    if (!header) return;
    // Vermeide visuelle Flacker an der Umschalt-Schwelle über Hysterese und rAF
    let lastSolid = null; // null = ungesetzt, true/false = Zustand
    let ticking = false;
    // Fixiere Header-Hhe fr3 den gesamten Umschaltbereich, um Layoutsprngen auszuschlie3en
    const headerHeight = Math.round(header.getBoundingClientRect().height);
    header.style.minHeight = headerHeight + 'px';
    const update = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = (document.documentElement.scrollTop || document.body.scrollTop) | 0;
            const enter = 132; // Einblend-Schwelle
            const leave = 108; // Ausblend-Schwelle (Hysterese)
            const wantSolid = lastSolid === null ? (y > 120) : (lastSolid ? y > leave : y > enter);
            if (wantSolid !== lastSolid) {
                lastSolid = wantSolid;
                if (wantSolid) {
                    header.classList.add('header-solid');
                    header.classList.remove('header-transparent');
                } else {
                    header.classList.add('header-transparent');
                    header.classList.remove('header-solid');
                }
            }
            ticking = false;
        });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('orientationchange', update);
}
// (removed) Docked-to-Hero Behavior
