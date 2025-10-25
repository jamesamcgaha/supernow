# SuperNow Blog

## Writing Blog Posts

1. Create a new `.md` file in the `posts/` folder
2. Add frontmatter with title, date, excerpt, author, and tags
3. Write content in Markdown
4. Commit and push - GitHub Actions will automatically build everything

### Example Post Format:
```markdown
---
title: "Post Title"
date: "2025-10-20"
excerpt: "Brief description of your post"
author: "Name"
tags: ["servicenow", "tutorial"]
---

Markdown content here...
```

### Automated Deployment:
GitHub Actions automatically:
- Builds individual HTML files for each post
- Updates the sitemap
- Commits changes back to the repository

