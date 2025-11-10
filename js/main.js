// Simplified main.js - only handles event listeners and filtering for pre-rendered content
console.log('main.js starting...');

// Global variables
let currentFilter = 'all';
let currentSearchTerm = '';

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to set active tag tab
function setActiveTag(tagName) {
    const tagTabs = document.querySelectorAll('.tag-tab');
    tagTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tag') === tagName) {
            tab.classList.add('active');
        }
    });
    currentFilter = tagName;
}

// Function to filter pre-rendered post cards
function filterPostCards() {
    const cards = document.querySelectorAll('.post-card');
    let visibleCount = 0;
    const visibleCards = [];
    
    // First pass: reset all cards and determine visibility
    cards.forEach(function(card) {
        let shouldShow = true;
        
        // Apply tag filter
        if (currentFilter !== 'all') {
            const cardTags = card.getAttribute('data-tags');
            const tagsArray = cardTags ? cardTags.split(',') : [];
            shouldShow = tagsArray.includes(currentFilter);
        }
        
        // Apply search filter
        if (currentSearchTerm && shouldShow) {
            const title = card.getAttribute('data-title') || '';
            const excerpt = card.getAttribute('data-excerpt') || '';
            const searchLower = currentSearchTerm.toLowerCase();
            shouldShow = title.includes(searchLower) || excerpt.includes(searchLower);
        }
        
        // Reset animation state for all cards
        card.classList.remove('animate-in');
        card.style.animationDelay = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        
        if (shouldShow) {
            visibleCards.push(card);
            card.style.display = 'block';
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
    
    // Small delay to ensure the DOM updates before starting animations
    setTimeout(function() {
        // Second pass: apply staggered animations to visible cards
        visibleCards.forEach(function(card, index) {
            // Apply staggered animation delay (0.1s intervals, max 0.8s)
            const delay = Math.min(index * 0.1, 0.8);
            card.style.animationDelay = `${delay}s`;
            
            // Add the animation class to trigger the animation
            card.classList.add('animate-in');
        });
    }, 100); // Increased delay to ensure proper reset
    
    // Show/hide no results message
    showNoResultsMessage(visibleCount === 0);
    
    console.log(`Filtered posts: ${visibleCount} visible out of ${cards.length} total`);
}

// Function to show/hide no results message
function showNoResultsMessage(show) {
    let noResultsDiv = document.getElementById('noResults');
    
    if (show) {
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'noResults';
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            document.getElementById('postsContainer').appendChild(noResultsDiv);
        }
        noResultsDiv.style.display = 'block';
    } else {
        if (noResultsDiv) {
            noResultsDiv.style.display = 'none';
        }
    }
}

// Function to setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value.trim();
        filterPostCards();
    });
    
    // Clear search on escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            currentSearchTerm = '';
            filterPostCards();
        }
    });
}

// Function to setup tag tab event handlers (tabs are now pre-rendered)
function setupTagTabs() {
    const container = document.getElementById('tagTabsContainer');
    if (!container) return;
    
    // Add click handlers to pre-rendered tag tabs
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('tag-tab') || e.target.parentElement.classList.contains('tag-tab')) {
            const button = e.target.classList.contains('tag-tab') ? e.target : e.target.parentElement;
            const tag = button.getAttribute('data-tag');
            
            // Update active tab
            setActiveTag(tag);
            
            // Update filter and display posts
            filterPostCards();
        }
    });
}

// Function to setup clickable tag event handlers
function setupClickableTags() {
    const postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) return;
    
    // Add click handlers to clickable tags in post cards
    postsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('tag-clickable')) {
            e.preventDefault();
            e.stopPropagation(); // Prevent card link from being triggered
            const tag = e.target.getAttribute('data-tag');
            
            // Update active tab
            setActiveTag(tag);
            
            // Update filter and display posts
            filterPostCards();
        }
    });
}

// Function to apply initial staggered animations
function applyInitialAnimations() {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach(function(card, index) {
        // Apply staggered animation delay (0.1s intervals, max 0.8s)
        const delay = Math.min(index * 0.1, 0.8);
        card.style.animationDelay = `${delay}s`;
        card.classList.add('animate-in');
    });
}

// Function to initialize the page
function initializePage() {
    console.log('Initializing page with pre-rendered content...');
    
    // Check for tag parameter in URL
    const tagParam = getUrlParameter('tag');
    if (tagParam) {
        console.log(`Found tag parameter: ${tagParam}`);
        setActiveTag(tagParam);
    }
    
    // Apply initial staggered animations
    applyInitialAnimations();
    
    // Setup event handlers for pre-rendered tag tabs
    setupTagTabs();
    
    // Setup clickable tags
    setupClickableTags();
    
    // Setup search
    setupSearch();
    
    // Apply initial filter (including URL parameter)
    filterPostCards();
    
    console.log('Page initialization complete!');
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
