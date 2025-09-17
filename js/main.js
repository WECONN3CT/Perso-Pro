// ===================================
// PersoPro - Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    initMobileNavigation();
    
    // Smooth Scrolling
    initSmoothScrolling();
    
    // Load Featured Profiles on Homepage
    if (document.getElementById('featuredProperties')) {
        loadFeaturedProperties();
        initPropertiesCarousel();
    }
    
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

    // Docked-to-Hero behavior (removed)
});

// Smooth vertical snap progression on wheel for services list (desktop)
document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('.services-list');
    if (!list) return;
    let isScrolling = false;
    list.addEventListener('wheel', (e) => {
        // apply only on non-touch large screens
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches === false) return;
        e.preventDefault();
        if (isScrolling) return;
        isScrolling = true;
        const direction = e.deltaY > 0 ? 1 : -1;
        const cards = Array.from(list.querySelectorAll('.service-card'));
        const listLeft = list.getBoundingClientRect().left;
        const current = cards.findIndex(card => Math.abs(card.getBoundingClientRect().left - listLeft) < 24);
        const nextIndex = Math.min(cards.length - 1, Math.max(0, (current === -1 ? 0 : current) + direction));
        cards[nextIndex] && cards[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        setTimeout(() => { isScrolling = false; }, 420);
    }, { passive: false });
});

// ===================================
// Mobile Navigation
// ===================================

function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
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
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Load Featured Profiles
// ===================================

async function loadFeaturedProperties() {
    try {
        const response = await fetch('data/profiles.json');
        const data = await response.json();
        
        const featuredContainer = document.getElementById('featuredProperties');
        if (!featuredContainer) return;
        
        // Display first 8 profiles as featured (carousel shows 4 per page)
        const featuredProfiles = (data.profiles || []).slice(0, 8);
        
        featuredContainer.innerHTML = featuredProfiles.map(profile => `
            <article class="property-card">
                <img src="${(profile.images && profile.images[0]) || 'images/start/persohero.png'}" 
                     alt="${profile.title || profile.role}" 
                     class="property-image"
                     loading="lazy">
                <div class="property-content">
                    <div class="property-price">${(Number(profile.wage||0)).toLocaleString('de-DE')} €/Std</div>
                    <h3 class="property-title">${profile.title || profile.role}</h3>
                    <div class="property-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${profile.location || ''}
                    </div>
                    <div class="property-features">
                        <span class="property-feature">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 20a8 8 0 1 0-8-8 8 8 0 0 0 8 8z"></path>
                            </svg>
                            ${profile.experience ? `${profile.experience} Jahre` : 'Erfahrung n/a'}
                        </span>
                        <span class="property-feature">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 12h18M12 3v18"></path>
                            </svg>
                            ${profile.shift ? `Schicht: ${profile.shift}` : 'Schicht: flexibel'}
                        </span>
                    </div>
                    <a href="kontakt.html?profile=${profile.id}" class="property-link">Personal anfragen →</a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error loading properties:', error);
        const featuredContainer = document.getElementById('featuredProperties');
        if (featuredContainer) {
            featuredContainer.innerHTML = '<p class="text-center">Profile werden geladen...</p>';
        }
    }
}

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
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
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
}

function showSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.textContent = 'Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.';
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
    // Weiterleitung zur Leistungen/Profiles-Seite mit Query-Parametern
    const url = `immobilien.html?${params.toString()}#properties`;
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
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
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
        animation: fadeIn 0.5s ease;
    }
    
    .slide-in {
        animation: slideIn 0.3s ease;
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
            entry.target.classList.add('fade-in');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .property-card, .about-preview');
    animatedElements.forEach(el => scrollObserver.observe(el));
});

// ===================================
// Properties Carousel
// ===================================

function initPropertiesCarousel() {
    const track = document.querySelector('.carousel-track #featuredProperties');
    if (!track) return;

    const prevBtn = document.querySelector('.properties-carousel .prev');
    const nextBtn = document.querySelector('.properties-carousel .next');

    const stepWidth = () => {
        // Scroll by width of 1 column (+gap) so es slidet Karte für Karte
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.getPropertyValue('--carousel-gap') || styles.gap || '16');
        const colWidth = (track.clientWidth - gap * 3) / 4;
        return colWidth + gap;
    };

    prevBtn && prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -stepWidth(), behavior: 'smooth' });
        updateButtons();
    });
    nextBtn && nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: stepWidth(), behavior: 'smooth' });
        updateButtons();
    });

    function updateButtons() {
        if (!prevBtn || !nextBtn) return;
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        prevBtn.classList.toggle('disabled', track.scrollLeft <= 1);
        nextBtn.classList.toggle('disabled', track.scrollLeft >= maxScroll);
    }

    track.addEventListener('scroll', () => {
        // debounce via rAF
        requestAnimationFrame(updateButtons);
    });

    updateButtons();

    // Resize handling to keep stepWidth in sync
    window.addEventListener('resize', () => {
        // force re-eval by reading stepWidth
        stepWidth();
        updateButtons();
    });

    // Beobachte DOM-Änderungen im Track (nachdem Karten geladen wurden)
    const mo = new MutationObserver(() => {
        requestAnimationFrame(updateButtons);
    });
    mo.observe(track, { childList: true, subtree: true });

    // Beobachte Größenänderungen des Track-Inhalts
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => requestAnimationFrame(updateButtons));
        ro.observe(track);
    }
}

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

// (removed) Docked-to-Hero Behavior
