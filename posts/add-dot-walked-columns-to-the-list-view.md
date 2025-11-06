---
title: "How to add dot-walked columns to the list view"
date: "2025-10-24"
excerpt: "There are many scenarios where a key piece of information isn't available directly on the table you are viewing."
author: "James McGaha"
tags: ["tips & tricks","non-admin hacks","chrome extension","list view tricks"]
---
There are many scenarios where a key piece of information isn't available directly on the table you are viewing.

For example, you'd like to be able to view the caller's email from the list of incidents or maybe you want to see the catalog item name from the list of SC Tasks but that information is stored on the Requested Item.

Someone with System Administrator access can always configure the List Layout to include a dot-walked column; however, if you don't have admin or don't want to add a "dot-walked" column to the default list view for all users, then you can still use one of these options to get the extended field added to your personalized list view:

1. You can create a new report with type List and the reporting interface allows to expand reference fields and add dot-walked columns. If want to have those same columns available in the normal list view outside of a report, then you can:
    A. Save the report
    B. Copy the "sys_id" from the report's URL
    c. In your list view you can add/adjust the "sysparm_view" value in the list URL to be "RPT" and then your sys_id (e.g. sysparm_view=RPTaa6d3aec9fec3a546c1551361824ab8a). See: [Modifying ServiceNow URLs](modifying-servicenow-urls.html).
2. If you have the [SuperNow chrome extension](supernow-chrome-extension.html) installed, you will see an "unlock" icon next to the normal "personalize list" cog icon which will open up an enhanced personalize list modal that supports expanding reference fields.
3. If you have the [SN Utils chrome extension](https://chromewebstore.google.com/detail/jgaodbdddndbaijmcljdbglhpdhnjobg) installed, then you can double click any of the whitespace in the personalize list modal to have an input added below the "Selected" side of the slushbucket where you can type the internal name of the dot-walked field (e.g. caller_id.email).
4. You can manually add a dot-walked field by:
    A. Opening up the personalize list modal
    B. Adding any field you don't need
    C. Right-click that field after adding it to the Selected side
    D. Select "Inspect" to view that element in your browser's dev tools
    E. Manually change the "value" attribute for that option to be the internal name of the dot-walked field (e.g. caller_id.email)
    F. Nothing will appear to change, but when you hit the "ok" button to dismiss the modal your dot-walked column will be there