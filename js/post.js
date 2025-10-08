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
    
    // Check if posts are loaded
    if (!window.posts) {
        console.log('Posts not loaded yet, will retry when available');
        return;
    }
    
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
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        const description = `${post.title} - ServiceNow tips and tutorials on SuperNow blog`;
        metaDescription.setAttribute('content', description);
    }
    
    // Add dynamic Open Graph meta tags
    updateOrCreateMetaTag('property', 'og:title', post.title + ' - SuperNow');
    updateOrCreateMetaTag('property', 'og:description', post.excerpt || post.title);
    updateOrCreateMetaTag('property', 'og:type', 'article');
    updateOrCreateMetaTag('property', 'og:url', window.location.href);
    updateOrCreateMetaTag('property', 'article:author', post.author);
    updateOrCreateMetaTag('property', 'article:published_time', post.date);
    if (post.tags) {
        // Remove existing article:tag meta tags
        document.querySelectorAll('meta[property="article:tag"]').forEach(tag => tag.remove());
        // Add new ones
        post.tags.forEach(tag => {
            updateOrCreateMetaTag('property', 'article:tag', tag);
        });
    }
    
    // Add Twitter Card meta tags
    updateOrCreateMetaTag('name', 'twitter:title', post.title + ' - SuperNow');
    updateOrCreateMetaTag('name', 'twitter:description', post.excerpt || post.title);
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        canonical.href = window.location.href;
    }
    
    // Add structured data for the blog post
    addStructuredDataForPost(post);
    
    // Populate the dynamic content
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author').textContent = `By ${post.author}`;
    document.getElementById('post-date').textContent = formatDate(post.date);
    document.getElementById('post-body').innerHTML = post.content;
    
    // Handle tags
    const tagsContainer = document.getElementById('post-tags');
    if (post.tags && post.tags.length > 0) {
        tagsContainer.innerHTML = post.tags.map(tag => `
            <a href="index.html?tag=${encodeURIComponent(tag)}" class="tag">
                ${tag}
            </a>
        `).join('');
        tagsContainer.style.display = 'flex';
    } else {
        tagsContainer.style.display = 'none';
    }
    
    // Show footer after post content has loaded
    document.body.classList.add('content-loaded');
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
    // Show footer even on error
    document.body.classList.add('content-loaded');
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
    displaySinglePost();
});

// Also try when posts are loaded (in case posts.js loads after this script)
window.addEventListener('load', function() {
    if (window.posts && !document.getElementById('post-title').textContent) {
        console.log('Posts loaded via window load event');
        displaySinglePost();
    }
});

// Helper function to update or create meta tags
function updateOrCreateMetaTag(attribute, property, content) {
    let meta = document.querySelector(`meta[${attribute}="${property}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

// Function to add structured data for blog posts
function addStructuredDataForPost(post) {
    // Remove existing structured data
    const existingScript = document.querySelector('script[data-type="blog-post-schema"]');
    if (existingScript) {
        existingScript.remove();
    }
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt || post.title,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "SuperNow",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.supernow-blog.com/images/supernow-logo-full.png"
            }
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        },
        "url": window.location.href
    };
    
    if (post.tags && post.tags.length > 0) {
        structuredData.keywords = post.tags.join(', ');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-type', 'blog-post-schema');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}
