---
title: "SuperNow Chrome Extension"
date: "2025-10-06"
excerpt: "A chrome extension for ServiceNow super users that adds useful options and tools to make it easier to get around platform restrictions and limitations."
author: "James McGaha"
tags: ["chrome extension","tips & tricks","non-admin hacks","tools"]
---
## Download from the Chrome Web Store
[SuperNow - Tool for ServiceNow Super Users](https://chromewebstore.google.com/detail/supernow/onjjggbfdefphfbgdigcaghdkjoeobda)
### Features
1. **Add dot-walked columns to the list layout.** Next to the default "cog" icon for "Update personalized list", an "unlock" icon is added to the list view that opens an enhanced version of the personalize columns popup. This enhanced version is based on the column picker available in reports where you can expand reference fields and even include variables from requested items and catalog tasks.
2. **Bulk open records from the list view in new tabs.** Next to the icon added for the above point, another icon is added that will open the selected rows in new tabs (or all rows if no rows are selected). Note: this only allows a maximum of 100 rows to be opened this way—and I would recommend only doing 20 or so at a time as opening too many at once can cause you to hit a transaction quota limit which would make some of the tabs might not load the form.
3. **Make the "is not one of" filter operator available for other column types.** If you Ctrl+Click the operator dropdown in the filter condition builder, it will add the operator for "NOT IN" (similar to how [SN Utils](https://chromewebstore.google.com/detail/jgaodbdddndbaijmcljdbglhpdhnjobg) adds in the "contains" operator if you Ctrl+Click the operator dropdown).
4. **Make all form fields visible, editable, and non-mandatory.** Next to the attachment and save buttons on the right side of the form header, an "unlock" icon is added that will run a simple g_form script that iterates through the fields and removes their restrictions. Note: this cannot get around restrictions set by an ACL or at the dictionary entry level, see [How to get around read-only and mandatory field restrictions](getting-around-read-only-and-mandatory-restrictions.html).
5. **View and edit raw values for ALL columns for a record in a new tab.** Next to the icon added for the above point, a "new window" icon is added that will open the record in a new tab where all the data is displayed as a table. If you modify the values and save, then it will work as if you had just saved a view of the form that had all columns included.
6. **More coming soon!** I'm excited to hear any suggestions or feedback you have. Feel free to provide any input in a review for the extension or a comment on this post, thanks!