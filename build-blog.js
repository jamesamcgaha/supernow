const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(__dirname, 'posts');
const outputDirectory = path.join(__dirname, 'js');

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

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown
    // Clean up Windows line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
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
    // Code blocks
    .replace(/```([^`]*)```/gim, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]*)`/gim, '<code>$1</code>')
    // Lists - handle each line separately
    .split('\n')
    .map(line => {
      if (line.trim().startsWith('- ')) {
        return '<li>' + line.trim().substring(2) + '</li>';
      }
      return line;
    })
    .join('\n')
    // Group consecutive list items
    .replace(/(<li>.*<\/li>\n?)+/g, function(match) {
      return '<ul>' + match + '</ul>';
    })
    // Paragraphs - split by double newlines
    .split('\n\n')
    .map(paragraph => {
      paragraph = paragraph.trim();
      if (paragraph && !paragraph.startsWith('<')) {
        return '<p>' + paragraph + '</p>';
      }
      return paragraph;
    })
    .filter(p => p.length > 0)
    .join('\n\n');

  return html;
}

function generatePosts() {
  console.log('Generating blog posts...');
  
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
        date: data.date || '2025-01-01',
        excerpt: data.excerpt || '',
        author: data.author || 'Anonymous',
        tags: data.tags || [],
        content: markdownToHtml(content)
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Generate posts.js file for the website
  const postsJs = `// Auto-generated from markdown files
// Debug: Starting posts.js
console.log('posts.js: Starting to load posts...');

var posts = ${JSON.stringify(posts, null, 2)};

console.log('posts.js: Loaded', posts.length, 'posts');

// Make posts available globally
window.posts = posts;

console.log('posts.js: Set window.posts, now available globally');`;

fs.writeFileSync(path.join(outputDirectory, 'posts.js'), postsJs);
  
  console.log(`Generated ${posts.length} posts successfully!`);
  console.log('Posts:', posts.map(p => p.title));
}

// Run the generator
generatePosts();

