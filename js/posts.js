// Auto-generated from markdown files
// Debug: Starting posts.js
console.log('posts.js: Starting to load posts...');

var posts = [
  {
    "id": "future-of-web-development",
    "title": "Comprehensive Search Tool",
    "date": "2025-10-01",
    "excerpt": "The only search tool that fully searches ALL records tracked by update sets to make sure that no matching records are missed.",
    "author": "James McGaha",
    "tags": [
      "Tools"
    ],
    "content": "<p>The comprehensive search tool can be downloaded from ServiceNow Share here: <a href=\"https://developer.servicenow.com/connect.do#!/share/contents/2146901_comprehensive_search\">https://developer.servicenow.com/connect.do#!/share/contents/2146901_comprehensive_search</a></p>\n\n<p>This is the only search tool that fully searches <strong>ALL</strong> records tracked by update sets to make sure that no matching records are missed.</p>\n\n<img src=\"images/comprehensive_search.png\" alt=\"Comprehensive Search Tool Interface\" />\n\n<h3>Common Use Cases</h3>\n\n<p>Some common uses include:</p>\n\n<p>1. Find all references to a rebranded name or an outdated URL</p>\n\n<p>2. See if a script include is used anywhere before deleting it</p>\n\n<p>3. Identify all scripts using a deprecated function</p>\n\n<p>4. Check if I left any \"gs.error('James test')\" debugging messages anywhere</p>\n\n<p>5. Find the matching record for a mysterious sys_id</p>\n\n<p>6. Search for common spelling mistakes</p>\n\n<h3>Technical Details & Limitations</h3>\n\n<p>1. Only searches fields with a base type of String or GUID (e.g. won't search Integer or Date/Time fields) and will only match internal values not display values.\nGUID fields (e.g. sys_id or reference fields) will only be searched if the search string is 32 characters long.</p>\n\n<p>2. Only searches tables that extend Application File, have \"update_synch=true\", or have special handling to be tracked in update sets (e.g. won't search the incident or task table unless specifically included in the options section).</p>\n\n<p>3. Will not search any tables that have Caller Access set to \"Caller Restriction\" or Can Read set to \"false\" unless those tables are in the global scope. If needed, after granting this widget access to those tables, can include those tables manually in the options section.</p>\n\n<p>4. Additional tables to include or exclude can be specified in the options section. Changes to these lists will be automatically saved just for you. To update the defaults for all users, edit the userProvided and userExcluded properties of the object in text file attached to this widget record. Personally, I like exclude by prefix all \"sys_ux_\" tables as those can be slow to search in some instances.</p>\n\n<p>5. To ONLY search specific tables, in the options section mention those specific tables and put \"All\" in the tables to be excluded field.</p>\n\n<p>6. The list of tables updates weekly unless you manually refresh it in the options section.</p>"
  },
  {
    "id": "welcome-to-supernow",
    "title": "Welcome to SuperNow",
    "date": "2025-10-01",
    "excerpt": "Welcome to SuperNow, a modern blog platform where we share insights about technology, development, and innovation.",
    "author": "SuperNow Team",
    "tags": [
      "welcome",
      "introduction",
      "technology"
    ],
    "content": "<h1>Welcome to SuperNow</h1>\n\n<p>Welcome to SuperNow, a modern blog platform where we share insights about technology, development, and innovation. This is our inaugural post to kick off this exciting journey.</p>\n\n<p>SuperNow is designed to be a hub for thought-provoking content, tutorials, and discussions about the latest trends in technology. Whether you're a developer, designer, or just someone interested in tech, you'll find something valuable here.</p>\n\n<h2>What to Expect</h2>\n\n<p>In the coming weeks and months, we'll be covering topics such as:</p>\n\n<ul><li>Web development best practices</li>\n<li>Emerging technologies and frameworks</li>\n<li>Industry insights and trends</li>\n<li>Tutorials and how-to guides</li>\n<li>Software architecture and design patterns</li>\n</ul>\n<h2>Our Approach</h2>\n\n<p>We believe in creating content that is:</p>\n\n<p>1. <strong>Practical</strong> - You can apply what you learn immediately\n2. <strong>Accessible</strong> - Complex topics explained clearly\n3. <strong>Up-to-date</strong> - Latest trends and technologies\n4. <strong>Community-driven</strong> - Your feedback shapes our content</p>\n\n<p>Stay tuned for more exciting content, and don't hesitate to reach out if you have any suggestions or topics you'd like us to cover!</p>\n\n<p>Thank you for joining us on this journey. Let's build something amazing together.</p>"
  },
  {
    "id": "modern-css-responsive-design",
    "title": "Building Responsive Websites with Modern CSS",
    "date": "2025-09-25",
    "excerpt": "A comprehensive guide to creating responsive websites that work seamlessly across all devices using modern CSS techniques.",
    "author": "Sarah Johnson",
    "tags": [
      "CSS",
      "responsive design",
      "web development",
      "tutorial"
    ],
    "content": "<h1>Building Responsive Websites with Modern CSS</h1>\n\n<p>Responsive web design has evolved significantly since its inception. In 2025, we have powerful tools and techniques that make creating truly responsive websites easier than ever before.</p>\n\n<h2>The Foundation: Mobile-First Design</h2>\n\n<p>Always start with mobile design and work your way up. This approach ensures your site works well on the most constrained devices first.</p>\n\n<pre><code>css\n/<em> Mobile styles (default) </em>/\n.container {\n  padding: 1rem;\n}\n\n<p>/<em> Tablet and up </em>/\n@media (min-width: 768px) {\n  .container {\n    padding: 2rem;\n  }\n}</p>\n\n<p>/<em> Desktop and up </em>/\n@media (min-width: 1024px) {\n  .container {\n    padding: 3rem;\n  }\n}\n</code></pre></p>\n\n<h2>Modern CSS Grid and Flexbox</h2>\n\n<p>CSS Grid and Flexbox have revolutionized how we approach layout design. These tools provide intuitive ways to create complex, responsive layouts without relying on external frameworks.</p>\n\n<h3>CSS Grid for Two-Dimensional Layouts</h3>\n\n<p>CSS Grid excels at creating two-dimensional layouts where you need to control both rows and columns.</p>\n\n<pre><code>css\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 2rem;\n}\n</code></pre>\n\n<h3>Flexbox for One-Dimensional Layouts</h3>\n\n<p>Flexbox is ideal for one-dimensional layouts like navigation bars, button groups, and centering content.</p>\n\n<pre><code>css\n.flex-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}\n</code></pre>\n\n<h2>Container Queries: The Next Evolution</h2>\n\n<p>Container queries represent the next evolution in responsive design, allowing components to respond to their container's size rather than the viewport size.</p>\n\n<pre><code>css\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n    align-items: center;\n  }\n}\n</code></pre>\n\n<h2>Fluid Typography</h2>\n\n<p>Use clamp() for typography that scales smoothly across all screen sizes:</p>\n\n<pre><code>css\nh1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n}\n</code></pre>\n\n<h2>Modern CSS Units</h2>\n\n<p>Take advantage of modern CSS units for better responsive design:</p>\n\n<ul><li><code>dvh</code> (dynamic viewport height)</li>\n<li><code>svh</code> (small viewport height)</li>\n<li><code>lvh</code> (large viewport height)</li>\n<li><code>vmin</code> and <code>vmax</code></li>\n</ul>\n<h2>Best Practices</h2>\n\n<p>1. <strong>Test on real devices</strong> - Emulators are great, but nothing beats testing on actual devices\n2. <strong>Performance matters</strong> - Optimize images and minimize CSS\n3. <strong>Accessibility first</strong> - Ensure your responsive design works for everyone\n4. <strong>Progressive enhancement</strong> - Start with a working baseline and enhance</p>\n\n<h2>Conclusion</h2>\n\n<p>By combining these modern techniques with progressive enhancement principles, we can create websites that provide excellent experiences across all devices and screen sizes.</p>\n\n<p>The key is to embrace these new tools while keeping user experience at the center of all design decisions.</p>"
  }
];

console.log('posts.js: Loaded', posts.length, 'posts');

// Make posts available globally
window.posts = posts;

console.log('posts.js: Set window.posts, now available globally');