---
title: "Types of ServiceNow URLs"
date: "2025-10-24"
excerpt: "How to tell whether a ServiceNow URL is for a Service Portal, Classic Environment, or Workspace page."
author: "James McGaha"
tags: ["ServiceNow 101", "URLs"]
---
How to tell whether a ServiceNow URL is for a Service Portal, Classic Environment, or Workspace page.

Note: all of the URL examples mentioned in this post are relative URLs and assume that you will include the domain of your ServiceNow site before them. For example, when this post mentions the URL */incident.do*, for your ServiceNow instance that will looks like *https://dev123456.service-now.com/incident.do*.
### Service Portal / Employee Center page
You can recognize a Service Portal URL because it will always include **?id=**. These pages are built using [AngularJS](https://code.angularjs.org/1.5.9/docs/api) (with [Bootstrap CSS](https://getbootstrap.com/docs/3.3/css/), [Bootstrap Components](https://getbootstrap.com/docs/3.3/components/), and [UI Bootstrap](https://angular-ui.github.io/bootstrap/versioned-docs/1.2.5/)).

Service Portal URLs follow the pattern:
`https://{instance}/{portal suffix}/{language}/{keywords}?id={page id}&{page parameters}`

Example: `/esc?id=sc_cat_item&sys_id=186d917a6fab7980575967ddbb3ee4f2`

Or, if human-readable/SEO URLs are enabled, it may look like this:
`https://{instance}/{portal suffix}/{guest language}/{keywords}?id={page id}&lang={language}&{page parameters"`

Example: `/kb/en/life-feed-application-demo-data-for-a-what-is-template?id=kb_article_view&sysparm_article=KB0010002`
### Classic Environment / "Native UI" pages
URLs in the classic environment will always include **.do**. These pages are built using Jelly.

A classic environment URL can point to:
1. Processors (like /cache.do)
2. UI Pages (like /impersonate_dialog.do)
3. OOB pages we don't have access to view (like /report_home.do)
4. The list or table view for a table (like /incident_list.do or /incident.do)

The main thing to note is that a classic environment URL will look different depending on whether or not the Navigation Frame (the global ServiceNow header) is present. The navigation frame will be present by default, but if you open any records in a new tab you may notice that the navigation frame does not get included.

When the navigation frame is not included, the URLs are the easiest to decipher. So, I often open a page in a new tab if I know I will want to modify the URL. For more information on modifying classic environment URLs, see: [Modifying SerivceNow URLs](modifying-servicenow-urls.html).

When the navigation frame *is* included, the URL will be essentially the same except that:
1. `/now/nav/ui/classic/params/target/` will be included at the beginning of the URL (if you are still using the Core UI instead of the Next Experience UI, the URL prefix will be `/nav_to.do?uri=%2F`)
2. The remainder of the URL will be URL-encoded

So, without the navigation frame you'll see a simpler URL like this: `/sys_user_list.do?sysparm_query=first_nameLIKEjames`

But with the navigation frame you'll get this: `/now/nav/ui/classic/params/target/sys_user_list.do%3Fsysparm_query%3Dfirst_nameLIKEjames`
### Workspace / UI Builder page
A workspace or UI builder page won't contain either **?id=** or **.do** and instead will just have slashes **/**. These pages are built using ServiceNow's "React-like" Seismic framework.

Some of these URLs are not too difficult to decipher. For example, the URL for a specific incident opened in the Service Operations Workspace is pretty straightforward and makes it easy to find the incident's sys_id: `/now/sow/record/incident/d492e26c83a42210675fccb6feaad363`. However, even a simple list view can be pretty illegible with unique identifiers for the list and base64 encoded parameters. For example: `/now/sow/list/params/list-id/7ae4da1ec3013010965e070e9140dd66/__state__/b64~eyJlNGQ0NmFiM2ViYzQxMjEwMzg5MGRkZGUyMzUyMjhhOCI6eyJsaXN0X2NvbnRyb2xsZXIiOnsiYWN0aXZlPXRydWUiOnsicXVlcnkiOm51bGwsImN1cnJlbnRQYWdlIjowfSwiXyI6eyJxdWVyeSI6IiIsImN1cnJlbnRQYWdlIjowfX19fQ%3D%3D`