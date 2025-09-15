// ===================================
// Barut Immobilien - Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    initMobileNavigation();
    
    // Smooth Scrolling
    initSmoothScrolling();
    
    // Load Featured Properties on Homepage
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
// Load Featured Properties
// ===================================

async function loadFeaturedProperties() {
    try {
        const response = await fetch('data/properties.json');
        const data = await response.json();
        
        const featuredContainer = document.getElementById('featuredProperties');
        if (!featuredContainer) return;
        
        // Display first 3 properties as featured
        const featuredProperties = data.properties.slice(0, 3);
        
        featuredContainer.innerHTML = featuredProperties.map(property => `
            <article class="property-card">
                <img src="${property.images[0] || 'images/properties/placeholder.jpg'}" 
                     alt="${property.title}" 
                     class="property-image"
                     loading="lazy">
                <div class="property-content">
                    <div class="property-price">
                        ${property.type === 'Miete' ? property.price.toLocaleString('de-DE') + ' €/Monat' : property.price.toLocaleString('de-DE') + ' €'}
                    </div>
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${property.location}
                    </div>
                    <div class="property-features">
                        <span class="property-feature">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                <line x1="9" y1="6" x2="15" y2="6"></line>
                                <line x1="9" y1="10" x2="15" y2="10"></line>
                            </svg>
                            ${property.rooms} Zimmer
                        </span>
                        <span class="property-feature">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="9" y1="21" x2="9" y2="9"></line>
                            </svg>
                            ${property.size} m²
                        </span>
                    </div>
                    <a href="immobilien.html#property-${property.id}" class="property-link">Details ansehen →</a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error('Error loading properties:', error);
        const featuredContainer = document.getElementById('featuredProperties');
        if (featuredContainer) {
            featuredContainer.innerHTML = '<p class="text-center">Immobilien werden geladen...</p>';
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
    // Weiterleitung zur Immobilien-Seite mit Query-Parametern
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

    const scrollAmount = () => {
        const firstCard = track.querySelector('.property-card');
        if (!firstCard) return 0;
        const style = window.getComputedStyle(firstCard);
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap || '16');
        return cardWidth + gap;
    };

    prevBtn && prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    nextBtn && nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });
}
