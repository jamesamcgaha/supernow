// SEO Enhancement: Internal Linking Suggestions
// This script analyzes posts and suggests related content for internal linking

function generateInternalLinks() {
    if (!window.posts) return;
    
    const currentPostId = getUrlParameter('id');
    const currentPost = window.posts.find(p => p.id === currentPostId);
    
    if (!currentPost) return;
    
    // Find related posts based on shared tags
    const relatedPosts = window.posts
        .filter(p => p.id !== currentPostId)
        .map(post => {
            const sharedTags = currentPost.tags.filter(tag => 
                post.tags.some(pTag => pTag.toLowerCase().includes(tag.toLowerCase()) || 
                                      tag.toLowerCase().includes(pTag.toLowerCase()))
            );
            return { post, relevance: sharedTags.length };
        })
        .filter(item => item.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 3)
        .map(item => item.post);
    
    if (relatedPosts.length > 0) {
        addRelatedPostsSection(relatedPosts);
    }
}

function addRelatedPostsSection(relatedPosts) {
    const postBody = document.getElementById('post-body');
    if (!postBody) return;
    
    const relatedSection = document.createElement('div');
    relatedSection.className = 'related-posts-section';
    relatedSection.innerHTML = `
        <h3>📖 Related Articles</h3>
        <div class="related-posts-grid">
            ${relatedPosts.map(post => `
                <div class="related-post-card">
                    <a href="post.html?id=${post.id}">
                        <h4>${post.title}</h4>
                        <p>${post.excerpt}</p>
                        <div class="related-post-tags">
                            ${post.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </a>
                </div>
            `).join('')}
        </div>
    `;
    
    postBody.appendChild(relatedSection);
}

// Auto-run when post loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateInternalLinks);
} else {
    generateInternalLinks();
}
