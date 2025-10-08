#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://www.supernow-blog.com'; // Your actual domain from CNAME
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

// Function to load posts from posts.js
function loadPosts() {
    try {
        const postsContent = fs.readFileSync(path.join(__dirname, 'posts.js'), 'utf8');
        
        // Extract the posts array from the JavaScript file
        const postsMatch = postsContent.match(/var posts = (\[[\s\S]*?\]);/);
        if (!postsMatch) {
            console.error('Could not find posts array in posts.js');
            return [];
        }
        
        // Parse the posts array
        const postsArray = eval(postsMatch[1]);
        return postsArray;
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

// Function to generate XML sitemap
function generateSitemap() {
    const posts = loadPosts();
    
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
        const postUrl = `/post.html?id=${post.id}`;
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}${postUrl}</loc>\n`;
        xml += `    <lastmod>${post.date}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    return xml;
}

// Function to write sitemap to file
function writeSitemap() {
    try {
        const sitemapXml = generateSitemap();
        fs.writeFileSync(OUTPUT_FILE, sitemapXml, 'utf8');
        console.log(`✅ Sitemap generated successfully: ${OUTPUT_FILE}`);        
        // Show file stats
        const stats = fs.statSync(OUTPUT_FILE);
        console.log(`📄 File size: ${stats.size} bytes`);
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

// Main execution
if (require.main === module) {
    writeSitemap();
}

module.exports = { generateSitemap, writeSitemap };
