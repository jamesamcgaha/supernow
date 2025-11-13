---
title: "CSS Specificity in the Service Portal"
date: "2025-11-13"
excerpt: "Deep dive into how CSS styles are applied in the Service Portal and how that affects the specificity of the selectors."
author: "James McGaha"
tags: ["developer","service portal","advanced"]
---
## I. Calculating Specificity
If multiple CSS declarations apply to the same element, here's how you can determine which one will be applied:
### 1). Calculate the specificity of the selector
Add the points shown below for each that apply:

(10,000) Value has "!important" appended - Example: *color: black !important;*
(1,000) Inline styles - Example: *&lt;h1 style="color: pink;"&gt;*
(100) IDs - Example: *#navbar*
(10) Classes, pseudo-classes, attribute selectors - Example: *.test, :hover, [href]*
(1) Elements and pseudo-elements - Example: *h1, ::before*

Note: if the selector has multiple parts, add points for each part (for example, `div.text-blue` would get 11 points; `.btn-container #submit-button` would get 110 points).

For more information: [https://www.w3schools.com/css/css_specificity.asp](https://www.w3schools.com/css/css_specificity.asp)
### 2). Add in points for additions ServiceNow makes to the selector
A. If the element is within a widget, there is a widget instance that has CSS, and the declaration is present in the **widget instance** CSS, the portal record CSS, or the theme CSS: **add 100 points**
B. Else if the element is within a widget, that widget has CSS, and the declaration is present in the **widget**, portal, or theme CSS: **add 10 points**
C. Else if the page has CSS and the declaration is present in the **page**, portal, or theme CSS: **add 10 points**

*For example, if the declaration is present in the portal record's CSS and the widget instance does not have any CSS defined, but the widget does, then would add 10 points; if the declaration is present in the theme's CSS but the element referenced is not within a widget, then add 10 points if the page has CSS, otherwise add none.*
### 3). If the points for two declarations are tied, then compare the source of the declarations
The declaration whose source is highest on this list will be the one that is applied:
1. &lt;style&gt; tag in the HTML (if multiple, whichever is farthest to the bottom of the HTML)
2. embedded widget
3. (if embedded widget has CSS) theme
4. (if embedded widget has CSS) portal
5. widget instance
6. (if widget instance has CSS) theme
7. (if widget instance has CSS) portal
8. widget 
9. (if widget has CSS) theme
10. (if widget has CSS) portal
11. page
12. (if page has CSS) theme
13. (if page has CSS) portal
14. the stylesheet attached to the theme with the biggest order number
15. (if there is a stylesheet attached to the theme) theme
16. (if there is a stylesheet attached to the theme) portal
17. all other stylesheets attached to the theme ranked from biggest to smallest order value
18. bootstrap accessibility CSS
19. theme
20. portal
21. font awesome CSS
22. bootstrap CSS
23. OOB service portal CSS

*For example, if there is an element with the class "container" and the ID "case-header", and the widget instance has a declaration with the selector `.container` and the widget has a declaration with the selector `#case-header`, then (after adding in the bonus points from step 2) both declarations would have 110 points, but the widget instance's styling would be applied because it is number 2 in the list compared to number 5.*

*Note: skip 2-10 if the element is located outside of a widget (e.g. the page background or an element within a popup), skip 5-7 if the widget does not have an instance (e.g. the portal header widget).*
### 4). If the declarations are located within the same source, whichever declaration is lowest down in the stylesheet gets applied
## II. Explaining ServiceNow's Impact on Specificity
### 1). Portal and theme CSS gets added onto all other CSS stylesheets
ServiceNow allows you to put any CSS in the portal or theme records; however, these places are really only meant to contain CSS variables that can be used by other stylesheets within the portal. When ServiceNow compiles all the CSS, it creates and adds to the HTML for the page a &lt;style&gt; element for each of the possible places for CSS to be located (only if those sources have a value): widget instances, widgets, the page, and any stylesheets attached to the theme (styling defined directly in the HTML of a widget or angular template are not touched). For each of these stylesheets, it adds the CSS from the portal and then from the theme to the top. It does this so variables defined at the portal or theme are available everywhere you might add styling. However, this means that if you add a normal CSS declaration to the portal or theme, this declaration gets copied to the top of the CSS for every single widget instance, widget, page, and stylesheet on that page that have CSS.
### 2). ServiceNow adds "scoping" selectors to widget and page CSS
Also, when ServiceNow compiles all the CSS for a portal page, it adds to some selectors to help the declarations get applied in the right order and to make CSS scoped to the right elements. The following selectors are added to the front of all CSS declarations for widget instance, widget, and page CSS:

Widget Instance: #x[instance_sys_id]
Widget: .v[widget_sys_id]
Page: .page-[page_sys_id]

This means that if you had a widget with a selector like `.panel` and a widget instance with a selector like `div`, then those would get compiled to look like `.vc583d3ce1bdddd94d7b4eb12604bcb36 .panel` and `#x3c29786e87133200e0ef0cf888cb0bdf div`. So, even though the widget instance's element selector has a lower specificity than the widget's class selector, after compiling the points come out to 20 for the widget and 101 for the widget instance (the ID selector that ServiceNow adds to widget instance CSS helping to ensure that you are able to effectively overwrite generic widget CSS for specific instances of that widget).

One benefit of this is that by adding a widget to a page, you never have to worry about that widget's CSS messing up the styling of other widgets on that page.
### 3). All CSS is added within the HTML in a specific order
Lastly, once everything is all compiled by ServiceNow, all CSS (except for in-line styling) gets added to the HTML for the page within &lt;style&gt; tags. And the way CSS works is that CSS is applied from the top to the bottom, so (in the case where there are multiple declarations with the same specificity) whichever declaration is found closest to the bottom is the one that will get applied.

The order mentioned in step 3 of "Calculating Specificity" is essentially just the reverse of the order that the different &lt;style&gt; tags appear in the HTML for a portal page.