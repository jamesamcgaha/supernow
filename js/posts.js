// Auto-generated from markdown files
// Debug: Starting posts.js
console.log('posts.js: Starting to load posts...');

var posts = [
  {
    "id": "top-ten-time-savers",
    "title": "My Top 10 Time Savers",
    "date": "2025-10-02",
    "excerpt": "These are the top 10 tips & tricks that I save me the most time and that I'd have the hardest time doing without.",
    "author": "James McGaha",
    "tags": [
      "tips & tricks",
      "non-admin hacks",
      "tools",
      "admin access required",
      "development"
    ],
    "content": "<p>1. SN Utils</p>\n\n<p>2. Windows key + V for pasting clipboard</p>\n\n<p>3. Using &sysparm_force_row_count=1&sysparm_group_sort=COUNTDESC</p>\n\n<p>4. Adding dot-walked fields in list layouts</p>\n\n<p>5. Directly modifying the list view query</p>\n\n<p>6. Comprehensive search tool</p>\n\n<p>7. SN Utils script sync + GitHub Copilot</p>\n\n<p>8. Set fields to visible, editable, and non-mandatory</p>\n\n<p>9. Service portal debugging</p>\n\n<p>10. Cancel transaction URL</p>"
  },
  {
    "id": "comprehensive-search",
    "title": "Comprehensive Search Tool",
    "date": "2025-10-01",
    "excerpt": "The only search tool that fully searches ALL records tracked by update sets to make sure that no matching records are missed.",
    "author": "James McGaha",
    "tags": [
      "tools",
      "admin access required",
      "development"
    ],
    "content": "<p>The comprehensive search tool can be downloaded from ServiceNow Share here: <a href=\"https://developer.servicenow.com/connect.do#!/share/contents/2146901_comprehensive_search\">https://developer.servicenow.com/connect.do#!/share/contents/2146901_comprehensive_search</a></p>\n\n<img src=\"images/comprehensive_search.png\" alt=\"Comprehensive Search Tool Interface\" />\n\n<h3>Common Use Cases</h3>\n\n<p>Some common uses include:</p>\n\n<p>1. Find all references to a rebranded name or an outdated URL</p>\n\n<p>2. See if a script include is used anywhere before deleting it</p>\n\n<p>3. Identify all scripts using a deprecated function</p>\n\n<p>4. Check if I left any \"gs.error('James test')\" debugging messages anywhere</p>\n\n<p>5. Find the matching record for a mysterious sys_id</p>\n\n<p>6. Search for common spelling mistakes</p>\n\n<h3>Technical Details & Limitations</h3>\n\n<p>1. Only searches fields with a base type of String or GUID (e.g. won't search Integer or Date/Time fields) and will only match internal values not display values.\nGUID fields (e.g. sys_id or reference fields) will only be searched if the search string is 32 characters long.</p>\n\n<p>2. Only searches tables that extend Application File, have \"update_synch=true\", or have special handling to be tracked in update sets (e.g. won't search the incident or task table unless specifically included in the options section).</p>\n\n<p>3. Will not search any tables that have Caller Access set to \"Caller Restriction\" or Can Read set to \"false\" unless those tables are in the global scope. If needed, after granting this widget access to those tables, can include those tables manually in the options section.</p>\n\n<p>4. Additional tables to include or exclude can be specified in the options section. Changes to these lists will be automatically saved just for you. To update the defaults for all users, edit the userProvided and userExcluded properties of the object in text file attached to this widget record. Personally, I like exclude by prefix all \"sys_ux_\" tables as those can be slow to search in some instances.</p>\n\n<p>5. To ONLY search specific tables, in the options section mention those specific tables and put \"All\" in the tables to be excluded field.</p>\n\n<p>6. The list of tables updates weekly unless you manually refresh it in the options section.</p>"
  }
];

console.log('posts.js: Loaded', posts.length, 'posts');

// Make posts available globally
window.posts = posts;

console.log('posts.js: Set window.posts, now available globally');