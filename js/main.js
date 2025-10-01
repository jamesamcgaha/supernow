// Simple test to verify posts are loading
console.log('main.js starting...');

// Global variables
let currentFilter = 'all';
let currentSearchTerm = '';

// Function to get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to get all unique tags from posts
function getAllTags() {
    if (!window.posts) return [];
    
    const tagCounts = {};
    
    window.posts.forEach(function(post) {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(function(tag) {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        }
    });
    
    return Object.keys(tagCounts).map(function(tag) {
        return {
            name: tag,
            count: tagCounts[tag]
        };
    }).sort(function(a, b) {
        return b.count - a.count; // Sort by count, most popular first
    });
}

// Function to create tag filter tabs
function createTagTabs() {
    const container = document.getElementById('tagTabsContainer');
    if (!container) return;
    
    const tags = getAllTags();
    const totalPosts = window.posts ? window.posts.length : 0;
    
    let tabsHtml = `
        <button class="tag-tab ${currentFilter === 'all' ? 'active' : ''}" data-tag="all">
            All Posts<span class="tag-count">${totalPosts}</span>
        </button>
    `;
    
    tags.forEach(function(tag) {
        tabsHtml += `
            <button class="tag-tab ${currentFilter === tag.name ? 'active' : ''}" data-tag="${tag.name}">
                ${tag.name}<span class="tag-count">${tag.count}</span>
            </button>
        `;
    });
    
    container.innerHTML = tabsHtml;
    
    // Add click handlers
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('tag-tab') || e.target.parentElement.classList.contains('tag-tab')) {
            const button = e.target.classList.contains('tag-tab') ? e.target : e.target.parentElement;
            const tag = button.getAttribute('data-tag');
            
            // Update active tab
            container.querySelectorAll('.tag-tab').forEach(function(tab) {
                tab.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update filter and display posts
            currentFilter = tag;
            filterAndDisplayPosts();
        }
    });
}

// Function to filter posts based on current filter and search
function filterAndDisplayPosts() {
    if (!window.posts) return;
    
    let filteredPosts = window.posts;
    
    // Apply tag filter
    if (currentFilter !== 'all') {
        filteredPosts = filteredPosts.filter(function(post) {
            return post.tags && post.tags.includes(currentFilter);
        });
    }
    
    // Apply search filter
    if (currentSearchTerm) {
        filteredPosts = filteredPosts.filter(function(post) {
            return post.title.toLowerCase().includes(currentSearchTerm) ||
                   post.excerpt.toLowerCase().includes(currentSearchTerm) ||
                   post.author.toLowerCase().includes(currentSearchTerm) ||
                   (post.tags && post.tags.some(function(tag) {
                       return tag.toLowerCase().includes(currentSearchTerm);
                   }));
        });
    }
    
    console.log('Filtered posts:', filteredPosts.length, 'Filter:', currentFilter, 'Search:', currentSearchTerm);
    displayPosts(filteredPosts);
}
// Check if posts are available immediately
function checkPosts() {
    console.log('Checking for posts...');
    console.log('window.posts exists:', typeof window.posts !== 'undefined');
    console.log('window.posts length:', window.posts ? window.posts.length : 'undefined');
    
    if (window.posts && window.posts.length > 0) {
        console.log('Posts found, setting up UI...');
        
        // Check for tag parameter in URL
        const urlTag = getUrlParameter('tag');
        if (urlTag) {
            console.log('Tag filter from URL:', urlTag);
            currentFilter = urlTag;
        }
        
        createTagTabs(); // Create tag filter tabs
        filterAndDisplayPosts(); // Apply any URL filters
        setupSearch(); // Set up search after posts are loaded
    } else {
        console.log('No posts found');
        document.getElementById('postsContainer').innerHTML = '<p style="color: red;">No posts found. Check console for details.</p>';
    }
}

// Simple function to display posts
function displayPosts(posts) {
    console.log('displayPosts called with', posts.length, 'posts');
    const container = document.getElementById('postsContainer');
    
    if (!container) {
        console.log('Container not found!');
        return;
    }
    
    container.innerHTML = '';
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-search"></i>
                <p>No posts found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    posts.forEach(function(post, index) {
        console.log('Creating post', index + 1, ':', post.title);
        
        const postDiv = document.createElement('div');
        postDiv.className = 'post-card';
        
        const postTags = post.tags && post.tags.length > 0 ? 
            post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('') : '';
        
        postDiv.innerHTML = `
            <div class="post-meta">
                <div class="post-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${formatDate(post.date)}
                </div>
                <div class="post-author">
                    <i class="fas fa-user"></i>
                    ${post.author}
                </div>
            </div>
            <h2 class="post-title">
                <a href="post.html?id=${post.id}">${post.title}</a>
            </h2>
            <p class="post-excerpt">${post.excerpt}</p>
            ${postTags ? `<div class="post-tags">${postTags}</div>` : ''}
            <a href="post.html?id=${post.id}" class="read-more-btn">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        `;
        
        container.appendChild(postDiv);
    });
}

// Search functionality
function setupSearch() {
    console.log('Setting up search functionality');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) {
        console.log('Search input not found');
        return;
    }
    
    searchInput.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        console.log('Search term:', currentSearchTerm);
        
        if (!window.posts) {
            console.log('No posts available for search');
            return;
        }
        
        filterAndDisplayPosts();
    });
    
    console.log('Search functionality set up successfully');
}

// Wait for DOM and then check posts immediately
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking posts immediately...');
    checkPosts();
});

// Also try immediately when script loads if DOM is already ready
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, checking posts immediately');
    checkPosts();
}
