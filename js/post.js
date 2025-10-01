// Script for individual post pages
console.log('post.js: Starting...');

// Function to get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to display a single post
function displaySinglePost() {
    console.log('displaySinglePost called');
    
    const postId = getUrlParameter('id');
    console.log('Looking for post with ID:', postId);
    
    if (!postId) {
        showError('No post ID specified in URL');
        return;
    }
    
    if (!window.posts) {
        console.log('No posts available');
        showError('Posts not loaded');
        return;
    }
    
    console.log('Available posts:', window.posts.length);
    console.log('Post IDs:', window.posts.map(p => p.id));
    
    const post = window.posts.find(p => p.id === postId);
    
    if (!post) {
        console.log('Post not found for ID:', postId);
        showError('Post not found: ' + postId);
        return;
    }
    
    console.log('Found post:', post.title);
    
    // Update page title
    document.title = post.title + ' - SuperNow';
    
    // Create the post content
    const container = document.querySelector('main.container');
    container.innerHTML = `
        <article class="post-content">
            <div class="back-link" style="margin-bottom: 2rem;">
                <a href="index.html" style="color: #3498db; text-decoration: none;">
                    ← Back to all posts
                </a>
            </div>
            
            <header style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #2c3e50;">
                    ${post.title}
                </h1>
                
                <div style="color: #7f8c8d; margin-bottom: 1rem;">
                    <span>By ${post.author}</span>
                    <span style="margin: 0 1rem;">•</span>
                    <span>${formatDate(post.date)}</span>
                </div>
                
                ${post.tags && post.tags.length > 0 ? `
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${post.tags.map(tag => `
                        <a href="index.html?tag=${encodeURIComponent(tag)}" 
                           style="background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.875rem; text-decoration: none; transition: all 0.3s ease;"
                           onmouseover="this.style.background='#bbdefb'"
                           onmouseout="this.style.background='#e3f2fd'">
                            ${tag}
                        </a>
                    `).join('')}
                </div>
                ` : ''}
            </header>
            
            <div class="post-body" style="line-height: 1.8;">
                ${post.content}
            </div>
        </article>
    `;
}

// Function to show error message
function showError(message) {
    const container = document.querySelector('main.container');
    container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h1 style="color: #e74c3c;">Post not found</h1>
            <p style="color: #7f8c8d; margin: 1rem 0;">${message}</p>
            <a href="index.html" style="color: #3498db; text-decoration: none;">
                ← Return to home
            </a>
        </div>
    `;
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('post.js: DOM loaded');
    
    // Wait a bit for posts.js to load
    setTimeout(function() {
        if (window.posts) {
            console.log('Posts available, displaying post');
            displaySinglePost();
        } else {
            console.log('Posts not available yet, waiting longer...');
            setTimeout(function() {
                if (window.posts) {
                    displaySinglePost();
                } else {
                    showError('Unable to load posts data');
                }
            }, 1000);
        }
    }, 100);
});
