const fs = require('fs');
const hljs = require('highlight.js');
const path = require('path');

// Global counter to ensure unique tab IDs across all posts
let globalTabCounter = 0;

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

// Detect list marker type and nesting level for a line.
// Returns { level, type, content } or null if not a list item.
function detectListMarker(line) {
  const trimmed = line.trimStart();
  const spaces = line.length - trimmed.length;
  const spaceLevel = Math.floor(spaces / 4);

  // Uppercase alpha (A., B., C., etc.) - minimum level 1
  if (/^[A-Z]\.\s/.test(trimmed)) {
    return { level: Math.max(spaceLevel, 1), type: 'ol', content: trimmed.replace(/^[A-Z]\.\s/, '') };
  }

  // Lowercase roman numerals (i., ii., iii., iv., v., vi., vii., viii., ix., x., xi., xii., xiii., xiv., xv.)
  // minimum level 2
  if (/^(?:i{1,3}|iv|vi{0,3}|ix|x(?:i{0,3}|iv|v)?)\.\s/.test(trimmed)) {
    return { level: Math.max(spaceLevel, 2), type: 'ol', content: trimmed.replace(/^[ivx]+\.\s/, '') };
  }

  // Decimal numbers (1., 2., etc.) - level based on indentation
  if (/^\d+\.\s/.test(trimmed)) {
    return { level: spaceLevel, type: 'ol', content: trimmed.replace(/^\d+\.\s/, '') };
  }

  // Unordered bullet items (-, *, +)
  if (/^[-*+]\s/.test(trimmed)) {
    return { level: spaceLevel, type: 'ul', content: trimmed.replace(/^[-*+]\s/, '') };
  }

  // Other alphanumeric markers (catch-all: a., b., c., etc.)
  if (/^[A-Za-z0-9]+\.\s/.test(trimmed)) {
    return { level: spaceLevel, type: 'ol', content: trimmed.replace(/^[A-Za-z0-9]+\.\s/, '') };
  }

  return null;
}

// Parse a list block starting at lines[startI].
// Recursively handles nested lists and includes non-list content in the preceding list item.
// Returns { listNode, nextI }.
function parseListBlock(lines, startI) {
  const firstMarker = detectListMarker(lines[startI]);
  if (!firstMarker) return null;

  const listLevel = firstMarker.level;
  const listType = firstMarker.type;
  const items = [];
  let currentItem = null;
  let i = startI;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const marker = detectListMarker(line);

    if (marker) {
      if (marker.level < listLevel || (marker.level === listLevel && marker.type !== listType)) {
        // Shallower level or different list type at same level - end this list
        break;
      } else if (marker.level === listLevel) {
        // Same level, same type - start a new item
        if (currentItem) items.push(currentItem);
        currentItem = { content: marker.content, subLists: [], extraContent: [] };
        i++;
      } else {
        // Deeper level - parse as a nested list under the current item
        if (!currentItem) {
          currentItem = { content: '', subLists: [], extraContent: [] };
        }
        const result = parseListBlock(lines, i);
        if (result) {
          currentItem.subLists.push(result.listNode);
          i = result.nextI;
          // If the next line is non-list content, end this list so the
          // paragraph isn't absorbed into the current item's extraContent
          if (i < lines.length && lines[i].trim() && !detectListMarker(lines[i])) {
            break;
          }
        } else {
          i++;
        }
      }
    } else {
      if (!trimmed) {
        // Blank line - look ahead to see if the list continues
        let j = i + 1;
        while (j < lines.length && !lines[j].trim()) j++;
        if (j >= lines.length || !detectListMarker(lines[j])) {
          // Next non-blank content is not a list item - end this list,
          // consuming the trailing blank lines so they don't become <br> tags
          i = j;
          break;
        }
        // Skip blank lines and keep going
        i = j;
      } else if (/^<h[1-6]>/.test(trimmed)) {
        // Heading ends the list
        break;
      } else {
        // Non-list content between markers - append to current item
        if (currentItem) {
          currentItem.extraContent.push(line);
        }
        i++;
      }
    }
  }

  if (currentItem) items.push(currentItem);
  return { listNode: { type: 'list', listType, items }, nextI: i };
}

// Render a parsed list node to HTML string.
function renderListNode(listNode) {
  const tag = listNode.listType;
  const itemsHtml = listNode.items.map(item => {
    // Render extra content (code block placeholders, paragraphs) inside the <li>
    const extraHtml = item.extraContent.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (/^___CODEBLOCK_\d+___$/.test(trimmed)) return trimmed;
      if (/^___TABBLOCK_\d+___$/.test(trimmed)) return trimmed;
      if (/^<(h[1-6]|ul|ol|li|pre|div|blockquote|hr|table|br)/.test(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    }).filter(Boolean).join('\n');

    // Render any nested sub-lists
    const subListsHtml = item.subLists.map(renderListNode).join('\n');

    const innerContent = item.content +
      (extraHtml ? '\n' + extraHtml : '') +
      (subListsHtml ? '\n' + subListsHtml : '');

    return `<li>${innerContent}</li>`;
  }).join('\n');

  return `<${tag}>\n${itemsHtml}\n</${tag}>`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function addLineNumbers(highlightedHtml) {
  const lines = highlightedHtml.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  const rows = lines.map((line, i) =>
    `<tr><td class="hljs-ln-numbers"><div class="hljs-ln-n">${i + 1}</div></td><td class="hljs-ln-code">${line}</td></tr>`
  ).join('');
  return `<table class="hljs-ln"><tbody>${rows}</tbody></table>`;
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown
    // Clean up Windows line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Extract tab blocks first (they contain code fences which must be handled separately)
  const tabBlocks = [];
  html = html.replace(/:::tabs\n([\s\S]*?):::endtabs/gm, function(_, innerContent) {
    const placeholder = `___TABBLOCK_${tabBlocks.length}___`;
    const blockId = `tabs-${globalTabCounter++}`;

    // Split on :::tab lines to get individual tabs
    const tabParts = innerContent.split(/(?=:::tab )/);
    const tabs = [];
    for (const part of tabParts) {
      const m = part.match(/^:::tab ([^\n]+)\n?([\s\S]*)/);
      if (m) {
        tabs.push({ name: m[1].trim(), content: (m[2] || '').trimEnd() });
      }
    }

    const buttons = tabs.map((tab, idx) => {
      const cls = idx === 0 ? ' active' : '';
      return `<button class="tab-btn${cls}" onclick="switchTab(this,'${blockId}-${idx}')">${tab.name}</button>`;
    }).join('');

    const panels = tabs.map((tab, idx) => {
      const cls = idx === 0 ? ' active' : '';
      let content = tab.content.trim();

      // Code panels get a dark background; screenshot/text panels get a light one
      const hasCodeBlock = /```[\s\S]*?```/.test(content);
      const panelType = hasCodeBlock ? 'tab-panel-code' : 'tab-panel-light';

      // Process code fences within this tab (with syntax highlighting and line numbers)
      content = content.replace(/```(\w*)\n?([\s\S]*?)```/gm, (_, lang, code) => {
        const rawCode = code.replace(/\n$/, '');
        let codeHtml;
        if (lang && hljs.getLanguage(lang)) {
          const highlighted = hljs.highlight(rawCode, { language: lang }).value;
          codeHtml = addLineNumbers(highlighted);
        } else {
          codeHtml = escapeHtml(rawCode);
        }
        const langClass = lang ? ` class="hljs language-${lang}"` : ' class="hljs"';
        return `<pre><code${langClass}>${codeHtml}</code></pre>`;
      });

      // Process basic inline markdown
      content = content
        .replace(/!\[([^\]]*)\]\(([^)]*)\)/gim, '<img src="$2" alt="$1" />')
        .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/`([^`]*)`/gim, '<code>$1</code>');

      const copyBtn = panelType === 'tab-panel-code' ? '<button class="copy-btn" title="Copy code"><i class="fas fa-copy"></i></button>' : '';
      return `<div id="${blockId}-${idx}" class="tab-panel ${panelType}${cls}">${content}${copyBtn}</div>`;
    }).join('');

    const tabHtml = `<div class="code-tabs"><div class="tab-buttons">${buttons}</div><div class="tab-panels">${panels}</div></div>`;
    tabBlocks.push(tabHtml);
    return placeholder;
  });

  // Process code blocks first and protect them from inline code processing
  const codeBlocks = [];
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/gm, function(match, lang, code) {
    const placeholder = `___CODEBLOCK_${codeBlocks.length}___`;
    const rawCode = code.replace(/\n$/, '');
    let codeHtml;
    if (lang && hljs.getLanguage(lang)) {
      codeHtml = hljs.highlight(rawCode, { language: lang }).value;
    } else {
      codeHtml = escapeHtml(rawCode);
    }
    const langClass = lang ? ` class="hljs language-${lang}"` : ' class="hljs"';
    codeBlocks.push(`<pre><code${langClass}>${codeHtml}</code></pre>`);
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
    .replace(/`([^`]*)`/gim, '<code>$1</code>');

  // Process lines with stateful, context-aware list handling
  const lines = html.split('\n');
  const resultParts = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const marker = detectListMarker(line);

    if (marker) {
      // Parse the complete list block (including nested items and their embedded content)
      const result = parseListBlock(lines, i);
      if (result) {
        resultParts.push(renderListNode(result.listNode));
        i = result.nextI;
      } else {
        i++;
      }
    } else {
      const trimmed = line.trim();
      if (!trimmed) {
        resultParts.push('<br>');
      } else if (/^<(h[1-6]|ul|ol|li|pre|div|blockquote|hr|table|br)/.test(trimmed)) {
        resultParts.push(trimmed);
      } else if (/^___CODEBLOCK_\d+___$/.test(trimmed)) {
        resultParts.push(trimmed);
      } else if (/^___TABBLOCK_\d+___$/.test(trimmed)) {
        resultParts.push(trimmed);
      } else {
        resultParts.push('<p>' + trimmed + '</p>');
      }
      i++;
    }
  }

  html = resultParts.join('\n');

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    html = html.replace(`___CODEBLOCK_${index}___`, block);
  });

  // Restore tab blocks
  tabBlocks.forEach((block, index) => {
    html = html.replace(`___TABBLOCK_${index}___`, block);
  });

  return html;
}

// Function to calculate related posts based on shared tags
function calculateRelatedPosts(currentPost, allPosts, maxResults = 3) {
  const relatedPosts = allPosts
    .filter(post => post.id !== currentPost.id && !post.hidden)
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
  
  // Add blog posts (exclude hidden posts from sitemap)
  posts.filter(post => !post.hidden).forEach(post => {
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
        isFavorite: favoritePostIds.includes(id),
        hidden: data.hidden === 'true'
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
      .replace(/src="js\//g, 'src="../js/')
      .replace(/{{YEAR}}/g, new Date().getFullYear());
    
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

  const visiblePosts = posts.filter(post => !post.hidden);

  // Calculate tag counts
  const tagCounts = {};
  visiblePosts.forEach(post => {
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
            All Posts<span class="tag-count">${visiblePosts.length}</span>
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
  const blogPostsHtml = visiblePosts.map(post => {
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

