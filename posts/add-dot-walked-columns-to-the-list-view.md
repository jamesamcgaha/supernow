---
title: "How to add dot-walked columns to the list view"
date: "2025-10-22"
excerpt: "Personalize your list view to include values from other tables."
author: "James McGaha"
tags: ["tips & tricks","non-admin hacks","chrome extension","list view tricks"]
---
There are many scenarios where a key piece of information isn't available directly on the table you are viewing. For example, you'd like to be able to view the caller's email from the list of incidents or maybe you want to see the catalog item name from the list of SC Tasks but that information is stored on the Requested Item.

Someone with System Administrator access can always configure the List Layout to include a dot-walked column; however, if you don't have admin or don't want to add a "dot-walked" column to the default list view for all users, then you can still use one of these options to get the extended field added to your personalized list view:

1. You can create a new report with type List and the reporting interface allows you to expand reference fields and add dot-walked columns. If want to have those same columns available in the normal list view outside of a report, then you can select a column to group the report by (ideally by a column all rows have the same value for), save the report, and then click the label of the group—which will take you to the list view with the same filter condition and the columns you specified in your report (it does this by adding a URL parameter like *&sysparm_view=RPT**aa6d3aec9fec3a546c1551361824ab8a*** where the bolded portion is the "sys_id" of your report).
2. If you have the [SuperNow chrome extension](supernow-chrome-extension.html) installed, you will see an "unlock" icon next to the normal "personalize list" cog icon which will open up an enhanced personalize list modal that supports expanding reference fields.
3. If you have the [SN Utils chrome extension](https://chromewebstore.google.com/detail/jgaodbdddndbaijmcljdbglhpdhnjobg) installed, then you can double click any of the whitespace in the personalize list modal to have an input added below the "Selected" side of the slushbucket where you can type the internal name of the dot-walked field (e.g. caller_id.email).
4. You can manually add a dot-walked field by:
    A. Opening up the personalize list modal
    B. Adding any field you don't need
    C. Right-click that field after adding it to the Selected side
    D. Select "Inspect" to view that element in your browser's dev tools
    E. Manually change the "value" attribute for that option to be the internal name of the dot-walked field (e.g. caller_id.email)
    F. Nothing will appear to change, but when you hit the "ok" button to dismiss the modal your dot-walked column will be there