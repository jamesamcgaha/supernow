---
title: "How to get around read-only and mandatory field restrictions"
date: "2025-11-10"
excerpt: "It's often very useful to reverse client-side logic that has marked a field as hidden, read-only, or mandatory."
author: "James McGaha"
tags: ["tips & tricks","non-admin hacks","chrome extension"]
---
Note: there are some restrictions that cannot be gotten around without admin access:
1. Any restriction imposed by an ACL security rule (whether read, write, or list-edit)
2. A field marked as read-only at the dictionary entry record level
3. Any server-side logic (like a business rule) that prevents or adjusts certain values
4. Read roles and write roles specified for viewing or editing a catalog variable within a submitted request

Normally, if a field has been hidden, set to be read-only, or marked as mandatory, then that restriction has been applied for good reason. If you are not familiar with all the business logic tied to a field, then it's usually best to not try to get around the restrictions the developer put in the form (e.g. ignoring a mandatory field could cause a business rule to fail if that logic expected the field to always have a value).

That being said, there are often good reasons for wanting to get around form restrictions. Also, if getting around a read-only, mandatory, or hidden restriction for a field causes an issue, then the developer should not have relied on client-side logic to enforce that.
### Approach 1: Set values without using the form
The second approach is the simplest, but it only works for fields that are present on the form. In some cases, this option is as simple as just adding the column you want to update to your personalized list view and modifying the value there. However, there are some types of columns that aren't editable from the list view (like "List"-type columns), and if that column isn't available in any of the form views, then you'll need to use one of the options described below for this approach.

If you have the [SuperNow Chrome Extension](https://chromewebstore.google.com/detail/supernow-tool-for-service/onjjggbfdefphfbgdigcaghdkjoeobda), then you can use the "Edit in SuperNow Explorer" button it adds to the form header. This will open a new tab that shows a table with all fields present on the form. You can edit the field values there and when you click the Save, Insert, or Delete button then it makes the same API call as if you were on a view of the form that included *all* table columns.

If you don't have that extension, then you can use any REST client to manually make the same API call or use the [Table API](https://www.servicenow.com/docs/csh?topicname=c_TableAPI.html&version=latest)
### Approach 2: Use g_form to set all fields to visible, editable, and optional
If you have the [SuperNow Chrome Extension](https://chromewebstore.google.com/detail/supernow-tool-for-service/onjjggbfdefphfbgdigcaghdkjoeobda) installed, then you can just use the "Unlock Form" button it adds to the form header.

If you don't have that extension, then you can still accomplish the same result by using Ctrl+Shift+J and running the below code in the browser dev tools' console (or the ServiceNow "Javascript Executor" if you have admin):
```if(typeof g_form === 'undefined') this.g_form = window.frames["gsft_main"].g_form;
g_form.getSectionNames().forEach(section=>
    g_form.setSectionDisplay(section,true)
);
g_form.elements.forEach(field=>{
    g_form.setVisible(field.fieldName,true);
    g_form.setDisplay(field.fieldName,true);
    g_form.setReadOnly(field.fieldName,false);
    g_form.setMandatory(field.fieldName,false);
});
g_form.nameMap.forEach(field=>{
    g_form.setVisible(field.prettyName,true);
    g_form.setDisplay(field.prettyName,true);
    g_form.setReadOnly(field.prettyName,false);
    g_form.setMandatory(field.prettyName,false);
});```
Note: the first line is only there to handle the case when the navigation frame is present and the browser console has to get g_form from the iframe that contains the form.

If you plan to use this often and don't have the SuperNow chrome extension, then it might be useful to set up a "bookmarklet" for this by creating a bookmark and putting the below code as the "URL" value for the bookmark, and then you can just click that bookmark to run the code (it's essentially the same code as above, just set up to be a single line):
```javascript:var f=window.frames["gsft_main"]!==undefined?window.frames["gsft_main"].g_form:g_form;f.getSectionNames().forEach(section=>f.setSectionDisplay(section,true));f.elements.forEach(field=>{f.setVisible(field.fieldName,true);f.setDisplay(field.fieldName,true);f.setReadOnly(field.fieldName,false);f.setMandatory(field.fieldName,false);});f.nameMap.forEach(field=>{f.setVisible(field.prettyName,true);f.setDisplay(field.prettyName,true);f.setReadOnly(field.prettyName,false);f.setMandatory(field.prettyName,false);}); ```
You can also use this approach to run any other client scripts you might need (whether you just want to directly use *g_form.setValue* or if you need a more complicated script like a GlideAjax call)—just make sure to include that first line to find the g_form object if the navigation frame is present.
### Service Portal
While in the Service Portal (filling out a catalog item, on a portal page with the Form widget, etc.), the process is the same as Approach 2 but you'll need a slightly different script:
```var formScope = angular.element($("sp-variable-layout")).scope();
var g_form = formScope.getGlideForm() || formScope.$parent.getGlideForm(); 
g_form.getFieldNames().forEach(field=>{
    g_form.setVisible(field,true);
    g_form.setDisplay(field,true);
    g_form.setReadOnly(field,false);
    g_form.setMandatory(field,false);
});```
And the single-line version if you want to create a bookmarklet:
```javascript:var formScope = angular.element($("sp-variable-layout")).scope();var g_form=formScope.getGlideForm()||formScope.$parent.getGlideForm();g_form.getFieldNames().forEach(field=>{g_form.setVisible(field,true);g_form.setDisplay(field,true);g_form.setReadOnly(field,false);g_form.setMandatory(field,false);});```
Note: if you're on a Service Portal page but not a page for a catalog item or form that would have g_form, you can still access the client logic for the widgets and get around any non-server-side restrictions that may be in place:
1. This line is useful for quickly showing any elements that are not shown because of an ng-show/ng-hide attribute: `$('.ng-hide').removeClass('ng-hide');`
2. For more advanced options like modifying the client data for widgets, this knowledge article is very helpful: [KB0677496: Debugging Service Portal Widgets](https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0677496) 
