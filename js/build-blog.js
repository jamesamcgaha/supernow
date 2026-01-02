const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(__dirname, '..', 'posts');
const outputDirectory = path.join(__dirname);
const templatesDirectory = path.join(__dirname, '..', 'templates');
const rootDirectory = path.join(__dirname, '..');
const blogDirectory = path.join(__dirname, '..', 'blog');

// Simple frontmatter parser
function parseFrontmatter(fileContents) {
  const lines = fileContents.split('\n');
  const frontmatterStart = lines.findIndex(line => line.trim() === '---');
  const frontmatterEnd = lines.findIndex((line, index) => 
    index > frontmatterStart && line.trim() === '---'
  );

  if (frontmatterStart === -1 || frontmatterEnd === -1) {
    return { data: {}, content: fileContents };
  }

  const frontmatterLines = lines.slice(frontmatterStart + 1, frontmatterEnd);
  const contentLines = lines.slice(frontmatterEnd + 1);

  const data = {};
  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => 
          item.trim().replace(/['"]/g, '')
        );
      }
      
      data[key] = value;
    }
  });

  return { data, content: contentLines.join('\n') };
}

// Helper function to nest list items based on indentation
function nestListItems(listItemsHtml, listType) {
  const items = listItemsHtml.match(/<li class="[^"]*"[^>]*>.*?<\/li>/g) || [];
  if (items.length === 0) return listItemsHtml;
  
  let result = '';
  let i = 0;
  
  function processItems(currentIndent) {
    let html = '';
    
    while (i < items.length) {
      const item = items[i];
      const indentMatch = item.match(/data-indent="(\d+)"/);
      const indent = indentMatch ? parseInt(indentMatch[1]) : 0;
      
      if (indent < currentIndent) {
        // We've outdented, return to parent level
        break;
      }
      
      if (indent > currentIndent) {
        // Skip - will be handled by parent
        break;
      }
      
      // Same level - process this item
      const content = item.replace(/class="[^"]*"\s*data-indent="\d+"\s*>/, '>').replace(/<\/li>$/, '');
      i++;
      
      // Check if next item is nested
      if (i < items.length) {
        const nextIndentMatch = items[i].match(/data-indent="(\d+)"/);
        const nextIndent = nextIndentMatch ? parseInt(nextIndentMatch[1]) : 0;
        
        if (nextIndent > indent) {
          // Has nested items
          html += content + `<${listType}>` + processItems(nextIndent) + `</${listType}></li>`;
        } else {
          html += content + '</li>';
        }
      } else {
        html += content + '</li>';
      }
    }
    
    return html;
  }
  
  result = processItems(0);
  return `<${listType}>` + result + `</${listType}>`;
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown
    // Clean up Windows line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  
  // Process code blocks first and protect them from inline code processing
  const codeBlocks = [];
  html = html.replace(/```([\s\S]*?)```/gm, function(match, code) {
    const placeholder = `___CODEBLOCK_${codeBlocks.length}___`;
    codeBlocks.push('<pre><code>' + code + '</code></pre>');
    return placeholder;
  });
  
  html = html
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Images (must come before links)
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/gim, '<img src="$2" alt="$1" />')
    // Links
    .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
    // Inline code (now safe since code blocks are protected)
    .replace(/`([^`]*)`/gim, '<code>$1</code>')
    // Lists - handle each line separately with nesting support
    .split('\n')
    .map(line => {
      // Detect indentation level (4 spaces = 1 level)
      const leadingSpaces = line.match(/^( *)/)[1].length;
      const indentLevel = Math.floor(leadingSpaces / 4);
      const trimmed = line.trim();
      
      // Bullet lists
      if (trimmed.startsWith('- ')) {
        return `<li class="ul-item" data-indent="${indentLevel}">${trimmed.substring(2)}</li>`;
      }
      
      // Any numbered/lettered lists (1. A. a. i. etc.)
      if (/^[A-Za-z0-9]+\.\s/.test(trimmed)) {
        return `<li class="ol-item" data-indent="${indentLevel}">${trimmed.replace(/^[A-Za-z0-9]+\.\s/, '')}</li>`;
      }
      
      return line;
    })
    .join('\n')
    // Paragraphs - split by single newlines for line-by-line processing
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      // Empty lines become line breaks for spacing
      if (!trimmed) return '<br>';
      // Don't wrap if already a block-level HTML element or list item
      if (/^<(h[1-6]|ul|ol|li|pre|div|blockquote|hr|table|br)/.test(trimmed)) return trimmed;
      // Don't wrap placeholders
      if (/^___CODEBLOCK_\d+___$/.test(trimmed)) return trimmed;
      // Wrap everything else in paragraph tag (including lines with inline elements like <strong>, <code>, etc.)
      return '<p>' + trimmed + '</p>';
    })
    .join('\n')
    // NOW group consecutive bullet list items with nesting (after paragraph processing)
    .replace(/(?:<li class="ul-item"[^>]*>.*?<\/li>(?:\n|<br>)*)+/g, function(match) {
      // Remove any <br> tags that got in between list items
      const cleaned = match.replace(/<br>/g, '\n');
      return nestListItems(cleaned, 'ul');
    })
    // Group consecutive numbered list items with nesting (after paragraph processing)
    .replace(/(?:<li class="ol-item"[^>]*>.*?<\/li>(?:\n|<br>)*)+/g, function(match) {
      // Remove any <br> tags that got in between list items
      const cleaned = match.replace(/<br>/g, '\n');
      return nestListItems(cleaned, 'ol');
    });
  
  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    html = html.replace(`___CODEBLOCK_${index}___`, block);
  });

  return html;
}

// Function to calculate related posts based on shared tags
function calculateRelatedPosts(currentPost, allPosts, maxResults = 3) {
  const relatedPosts = allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => {
      const sharedTags = currentPost.tags.filter(tag => 
        post.tags.some(pTag => pTag.toLowerCase().includes(tag.toLowerCase()) || 
                              tag.toLowerCase().includes(pTag.toLowerCase()))
      );
      return { post, relevance: sharedTags.length };
    })
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, maxResults)
    .map(item => item.post);
  
  return relatedPosts;
}

// Function to generate related posts HTML
function generateRelatedPostsHtml(relatedPosts) {
  if (relatedPosts.length === 0) return '';
  
  return `
                <div class="related-posts-section">
                    <h3>Related Articles</h3>
                    <div class="related-posts-grid">
                        ${relatedPosts.map(post => `
                        <div class="related-post-card">
                            <a href="${post.id}.html">
                                <h4>${post.title}</h4>
                                <p>${post.excerpt}</p>
                                <div class="related-post-tags">
                                    ${post.tags.slice(0, 2).map(tag => `<a href="../index.html?tag=${encodeURIComponent(tag)}" class="tag tag-link">${tag}</a>`).join('')}
                                </div>
                            </a>
                        </div>`).join('')}
                    </div>
                </div>`;
}

// Sitemap generation functions
function generateSitemap(posts = []) {
  const SITE_URL = 'https://www.supernow-blog.com';
  const OUTPUT_FILE = path.join(__dirname, '..', 'sitemap.xml');
  
  // Static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: '/',
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: new Date().toISOString().split('T')[0]
    },
    {
      url: '/about.html',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    }
  ];
  
  console.log(`\n🗺️  Generating sitemap...`);
  console.log(`Generating sitemap with ${posts.length} blog posts and ${staticPages.length} static pages...`);
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static pages
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  // Add blog posts
  posts.forEach(post => {
    const postUrl = `/blog/${post.id}.html`;
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${postUrl}</loc>\n`;
    xml += `    <lastmod>${post.date}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  try {
    fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');
    console.log(`Sitemap generated successfully: ${OUTPUT_FILE}`);
    // Show file stats
    const stats = fs.statSync(OUTPUT_FILE);
    console.log(`File size: ${stats.size} bytes`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

function generatePosts() {
  console.log('Generating blog posts...');
  
  // Define favorite posts
  const favoritePostIds = ['supernow-chrome-extension', 'comprehensive-search'];
  
  // Read template files
  const headerTemplate = fs.readFileSync(path.join(templatesDirectory, 'header.html'), 'utf8');
  const footerTemplate = fs.readFileSync(path.join(templatesDirectory, 'footer.html'), 'utf8');
  
  // Read all markdown files
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = parseFrontmatter(fileContents);
      
      return {
        id,
        title: data.title || 'Untitled',
        date: data.date || '2026-01-01',
        excerpt: data.excerpt || '',
        author: data.author || 'Anonymous',
        tags: data.tags || [],
        content: markdownToHtml(content),
        isFavorite: favoritePostIds.includes(id)
      };
    })
    .sort((a, b) => {
      // First, sort by favorite status (favorites first)
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      // Then by date (newest first)
      return new Date(b.date) - new Date(a.date);
    });

  // Generate individual HTML files for each post
  posts.forEach(post => {
    const postUrl = `https://www.supernow-blog.com/blog/${post.id}.html`;
    const description = post.excerpt || `${post.title} - ServiceNow tips and tutorials`;
    
    // Replace placeholders in header template (adjust paths for blog subdirectory)
    let postHeader = headerTemplate
      .replace(/{{TITLE}}/g, post.title)
      .replace(/{{DESCRIPTION}}/g, description)
      .replace(/{{URL}}/g, postUrl)
      .replace(/href="css\//g, 'href="../css/')
      .replace(/src="images\//g, 'src="../images/')
      .replace(/href="images\//g, 'href="../images/')
      .replace(/href="index\.html"/g, 'href="../index.html"')
      .replace(/href="about\.html"/g, 'href="../about.html"');
    
    // Calculate related posts for this post
    const relatedPosts = calculateRelatedPosts(post, posts);
    const relatedPostsHtml = generateRelatedPostsHtml(relatedPosts);
    
    // Fix paths in post content for blog subdirectory
    const processedContent = post.content
      .replace(/src="images\//g, 'src="../images/')
      .replace(/href="images\//g, 'href="../images/')
      .replace(/href="index\.html"/g, 'href="../index.html"')
      .replace(/href="about\.html"/g, 'href="../about.html"');
    
    // Create post content HTML
    const postContent = `
            <header class="post-header">
                <h1>${post.title}</h1>
                
                <div class="post-meta">
                    <span>${post.author}</span>
                    <span class="separator">•</span>
                    <span>${new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                </div>
                
                <div class="post-tags">
                    ${post.tags.map(tag => `<a href="../index.html?tag=${encodeURIComponent(tag)}" class="tag tag-link">${tag}</a>`).join('')}
                </div>
            </header>
            
            <div class="post-body">
                ${processedContent}${relatedPostsHtml}
            </div>`;
    
    // Adjust footer paths for blog subdirectory
    let postFooter = footerTemplate
      .replace(/src="js\//g, 'src="../js/');
    
    // Combine header, content, and footer
    const fullHtml = postHeader + postContent + postFooter;
    
    // Write individual HTML file to blog directory
    const htmlFileName = `${post.id}.html`;
    const htmlFilePath = path.join(blogDirectory, htmlFileName);
    fs.writeFileSync(htmlFilePath, fullHtml);
    
    console.log(`Generated: blog/${htmlFileName}`);
  });

  // No longer need posts.js since everything is pre-rendered
  console.log('Skipping posts.js generation - using pre-rendered content');

  // Update index.html with pre-rendered blog posts and tag tabs
  console.log('Updating index.html with pre-rendered posts...');
  const indexPath = path.join(rootDirectory, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  
  // Calculate tag counts
  const tagCounts = {};
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  // Sort tags by count (most popular first)
  const sortedTags = Object.keys(tagCounts)
    .map(tag => ({ name: tag, count: tagCounts[tag] }))
    .sort((a, b) => b.count - a.count);
  
  // Generate static HTML for tag tabs with mobile "show more" functionality
  const maxTagsMobile = 3; // Show first 3 tags on mobile
  const visibleTags = sortedTags.slice(0, maxTagsMobile);
  const hiddenTags = sortedTags.slice(maxTagsMobile);
  
  const tagTabsHtml = `        <button class="tag-tab active" data-tag="all">
            All Posts<span class="tag-count">${posts.length}</span>
        </button>
        ${visibleTags.map(tag => `
        <button class="tag-tab" data-tag="${tag.name}">
            ${tag.name}<span class="tag-count">${tag.count}</span>
        </button>`).join('')}${hiddenTags.map(tag => `
        <button class="tag-tab hidden-tag-tab" data-tag="${tag.name}">
            ${tag.name}<span class="tag-count">${tag.count}</span>
        </button>`).join('')}${hiddenTags.length > 0 ? `
        <button class="tag-tab tag-more-btn" onclick="event.stopPropagation(); showAllTagTabs(this); return false;">
            +${hiddenTags.length} more
        </button>` : ''}`;
  
  // Generate HTML for all blog posts
  const blogPostsHtml = posts.map(post => {
    const postTags = post.tags && post.tags.length > 0 
      ? post.tags.map(tag => `<button class="tag tag-clickable" data-tag="${tag}">${tag}</button>`).join('')
      : '';
    
    const favoriteClass = post.isFavorite ? ' favorite' : '';
    const favoriteIndicator = post.isFavorite ? '<div class="favorite-indicator"></div>' : '';
    
    return `        <article class="post-card${favoriteClass}" data-tags="${post.tags ? post.tags.join(',') : ''}" data-title="${post.title.toLowerCase()}" data-excerpt="${post.excerpt.toLowerCase()}" data-url="blog/${post.id}.html">
            ${favoriteIndicator}<a href="blog/${post.id}.html" class="post-card-link">
                <h2 class="post-title">
                    ${post.title}
                </h2>
                ${postTags ? `<div class="post-tags">${postTags}</div>` : ''}
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span class="read-more-btn">
                        Read More <i class="fas fa-arrow-right"></i>
                    </span>
                    <span class="post-date">${new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                </div>
            </a>
        </article>`;
  }).join('\n');
  
  // Replace content between markers
  indexHtml = indexHtml.replace(
    /<!-- START:TAG_TABS -->[\s\S]*?<!-- END:TAG_TABS -->/,
    `<!-- START:TAG_TABS -->\n${tagTabsHtml}\n                <!-- END:TAG_TABS -->`
  );
  
  indexHtml = indexHtml.replace(
    /<!-- START:BLOG_POSTS -->[\s\S]*?<!-- END:BLOG_POSTS -->/,
    `<!-- START:BLOG_POSTS -->\n${blogPostsHtml}\n            <!-- END:BLOG_POSTS -->`
  );
  
  // Write the updated index.html file
  fs.writeFileSync(indexPath, indexHtml);
  
  console.log(`Generated index.html with ${posts.length} pre-rendered posts!`);
  
  console.log(`\nGenerated ${posts.length} individual HTML files successfully!`);
  console.log('HTML Files:', posts.map(p => `${p.id}.html`));
  
  return posts; // Return posts for sitemap generation
}

// Run the generator
const posts = generatePosts();

// Generate sitemap after building posts
generateSitemap(posts);

