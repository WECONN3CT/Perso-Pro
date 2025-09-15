// ===================================
// Properties Page JavaScript
// ===================================

let allProperties = [];
let filteredProperties = [];
let currentPage = 1;
const propertiesPerPage = 6;

document.addEventListener('DOMContentLoaded', async function() {
    await loadProperties();
    initializeFilters();
    initializeSorting();
});

// ===================================
// Load Properties Data
// ===================================

async function loadProperties() {
    try {
        const response = await fetch('data/properties.json');
        const data = await response.json();
        allProperties = data.properties;
        filteredProperties = [...allProperties];
        displayProperties();
        updateResultsCount();
    } catch (error) {
        console.error('Error loading properties:', error);
        document.getElementById('propertiesGrid').innerHTML = 
            '<p class="text-center">Fehler beim Laden der Immobilien. Bitte versuchen Sie es später erneut.</p>';
    }
}

// ===================================
// Display Properties
// ===================================

function displayProperties() {
    const grid = document.getElementById('propertiesGrid');
    const startIndex = 0;
    const endIndex = currentPage * propertiesPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);
    
    if (propertiesToShow.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('loadMore').style.display = 'none';
        grid.innerHTML = '';
        return;
    }
    
    document.getElementById('noResults').style.display = 'none';
    
    grid.innerHTML = propertiesToShow.map(property => `
        <article class="property-card" id="property-${property.id}">
            <img src="${property.images[0] || 'images/properties/placeholder.jpg'}" 
                 alt="${property.title}" 
                 class="property-image"
                 loading="lazy">
            <div class="property-content">
                <div class="property-price">
                    ${formatPrice(property.price, property.type)}
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
                    ${property.bathrooms ? `
                    <span class="property-feature">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 6l.5-1.5c.3-.9 1.1-1.5 2-1.5s1.7.6 2 1.5L14 6"></path>
                            <path d="M5 12h14a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4a1 1 0 0 1 1-1z"></path>
                            <path d="M8 21v1m8-1v1"></path>
                        </svg>
                        ${property.bathrooms} Bad
                    </span>
                    ` : ''}
                </div>
                <button class="property-link" onclick="showPropertyDetails(${property.id})">
                    Details ansehen →
                </button>
            </div>
        </article>
    `).join('');
    
    // Update load more button visibility
    const loadMoreBtn = document.getElementById('loadMore');
    if (endIndex >= filteredProperties.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// ===================================
// Filter Functions
// ===================================

function initializeFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const locationFilter = document.getElementById('locationFilter');
    const priceFilter = document.getElementById('priceFilter');
    const roomsFilter = document.getElementById('roomsFilter');
    
    // Add event listeners
    typeFilter.addEventListener('change', applyFilters);
    locationFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    roomsFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const type = document.getElementById('typeFilter').value;
    const location = document.getElementById('locationFilter').value;
    const maxPrice = document.getElementById('priceFilter').value;
    const rooms = document.getElementById('roomsFilter').value;
    
    filteredProperties = allProperties.filter(property => {
        let matches = true;
        
        // Type filter
        if (type && property.type !== type) {
            matches = false;
        }
        
        // Location filter
        if (location && !property.location.includes(location)) {
            matches = false;
        }
        
        // Price filter
        if (maxPrice) {
            const propertyPrice = property.type === 'Miete' ? property.price * 100 : property.price;
            if (propertyPrice > parseInt(maxPrice)) {
                matches = false;
            }
        }
        
        // Rooms filter
        if (rooms) {
            const roomCount = parseInt(rooms);
            if (roomCount === 5) {
                if (property.rooms < 5) matches = false;
            } else {
                if (property.rooms !== roomCount) matches = false;
            }
        }
        
        return matches;
    });
    
    currentPage = 1;
    displayProperties();
    updateResultsCount();
}

function resetFilters() {
    document.getElementById('typeFilter').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('roomsFilter').value = '';
    
    filteredProperties = [...allProperties];
    currentPage = 1;
    displayProperties();
    updateResultsCount();
}

// ===================================
// Sorting Functions
// ===================================

function initializeSorting() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', sortProperties);
}

function sortProperties() {
    const sortValue = document.getElementById('sortSelect').value;
    
    switch(sortValue) {
        case 'price-asc':
            filteredProperties.sort((a, b) => {
                const priceA = a.type === 'Miete' ? a.price * 100 : a.price;
                const priceB = b.type === 'Miete' ? b.price * 100 : b.price;
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            filteredProperties.sort((a, b) => {
                const priceA = a.type === 'Miete' ? a.price * 100 : a.price;
                const priceB = b.type === 'Miete' ? b.price * 100 : b.price;
                return priceB - priceA;
            });
            break;
        case 'size-desc':
            filteredProperties.sort((a, b) => b.size - a.size);
            break;
        case 'rooms-desc':
            filteredProperties.sort((a, b) => b.rooms - a.rooms);
            break;
    }
    
    currentPage = 1;
    displayProperties();
}

// ===================================
// Load More Function
// ===================================

function loadMoreProperties() {
    currentPage++;
    displayProperties();
}

// ===================================
// Property Details Modal
// ===================================

function showPropertyDetails(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'property-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closePropertyModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closePropertyModal()">×</button>
            <div class="modal-images">
                <img src="${property.images[0] || 'images/properties/placeholder.jpg'}" 
                     alt="${property.title}" 
                     class="modal-main-image">
                ${property.images.length > 1 ? `
                <div class="modal-thumbnails">
                    ${property.images.map((img, index) => `
                        <img src="${img}" alt="${property.title} ${index + 1}" 
                             onclick="changeModalImage('${img}')"
                             class="modal-thumbnail ${index === 0 ? 'active' : ''}">
                    `).join('')}
                </div>
                ` : ''}
            </div>
            <div class="modal-info">
                <h2 class="modal-title">${property.title}</h2>
                <div class="modal-price">${formatPrice(property.price, property.type)}</div>
                <div class="modal-location">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    ${property.location} - ${property.address || ''}
                </div>
                
                <div class="modal-details">
                    <div class="detail-item">
                        <strong>Wohnfläche:</strong> ${property.size} m²
                    </div>
                    <div class="detail-item">
                        <strong>Zimmer:</strong> ${property.rooms}
                    </div>
                    <div class="detail-item">
                        <strong>Schlafzimmer:</strong> ${property.bedrooms}
                    </div>
                    <div class="detail-item">
                        <strong>Badezimmer:</strong> ${property.bathrooms}
                    </div>
                    <div class="detail-item">
                        <strong>Baujahr:</strong> ${property.year}
                    </div>
                    <div class="detail-item">
                        <strong>Energieklasse:</strong> ${property.energy}
                    </div>
                </div>
                
                <div class="modal-description">
                    <h3>Beschreibung</h3>
                    <p>${property.description}</p>
                </div>
                
                ${property.features && property.features.length > 0 ? `
                <div class="modal-features">
                    <h3>Ausstattung</h3>
                    <ul class="features-list">
                        ${property.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="modal-actions">
                    <a href="kontakt.html?property=${property.id}" class="btn btn-primary">
                        Anfrage senden
                    </a>
                    <a href="tel:+498912345677" class="btn btn-secondary">
                        Direkt anrufen
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add modal styles
    addModalStyles();
}

function closePropertyModal() {
    const modal = document.querySelector('.property-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function changeModalImage(imageSrc) {
    const mainImage = document.querySelector('.modal-main-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.modal-thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src.includes(imageSrc)) {
            thumb.classList.add('active');
        }
    });
}

// ===================================
// Utility Functions
// ===================================

function formatPrice(price, type = 'Kauf') {
    const formatted = price.toLocaleString('de-DE');
    return type === 'Miete' ? `${formatted} €/Monat` : `${formatted} €`;
}

function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    const count = filteredProperties.length;
    countElement.textContent = `${count} ${count === 1 ? 'Immobilie' : 'Immobilien'} gefunden`;
}

// ===================================
// Modal Styles
// ===================================

function addModalStyles() {
    if (document.getElementById('modalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'modalStyles';
    style.textContent = `
        .property-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            max-width: 1000px;
            max-height: 90vh;
            overflow-y: auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding: 2rem;
            animation: slideIn 0.3s ease;
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: #f8f9fa;
            transform: rotate(90deg);
        }
        
        .modal-main-image {
            width: 100%;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        
        .modal-thumbnails {
            display: flex;
            gap: 0.5rem;
            overflow-x: auto;
        }
        
        .modal-thumbnail {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }
        
        .modal-thumbnail.active,
        .modal-thumbnail:hover {
            opacity: 1;
        }
        
        .modal-title {
            color: #1E3A5F;
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
        }
        
        .modal-price {
            color: #E67E22;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .modal-location {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #6C757D;
            margin-bottom: 1.5rem;
        }
        
        .modal-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            padding: 1.5rem;
            background: #F8F9FA;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }
        
        .detail-item {
            font-size: 0.9rem;
        }
        
        .detail-item strong {
            color: #1E3A5F;
        }
        
        .modal-description,
        .modal-features {
            margin-bottom: 1.5rem;
        }
        
        .modal-description h3,
        .modal-features h3 {
            color: #1E3A5F;
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
        }
        
        .features-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            list-style: none;
            padding: 0;
        }
        
        .features-list li {
            position: relative;
            padding-left: 1.5rem;
        }
        
        .features-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28A745;
            font-weight: bold;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                grid-template-columns: 1fr;
                padding: 1.5rem;
            }
            
            .modal-details {
                grid-template-columns: 1fr;
            }
            
            .features-list {
                grid-template-columns: 1fr;
            }
            
            .modal-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Handle URL hash for direct property links
window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#property-')) {
        const propertyId = parseInt(hash.replace('#property-', ''));
        setTimeout(() => {
            const propertyElement = document.getElementById(`property-${propertyId}`);
            if (propertyElement) {
                propertyElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                propertyElement.style.animation = 'highlight 2s ease';
            }
        }, 1000);
    }
});
