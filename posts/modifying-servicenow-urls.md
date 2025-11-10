---
title: "Modifying ServiceNow URLs"
date: "2025-10-25"
excerpt: "Understanding the components of a ServiceNow URL and modifying ServiceNow URLs directly can save you a lot of time and unlock some advanced tricks."
author: "James McGaha"
tags: ["tips & tricks","non-admin hacks","list view tricks","URLs"]
---
Understanding the components of a ServiceNow URL and modifying ServiceNow URLs directly can save you a lot of time and unlock some advanced tricks.

This post will focus on where I get the most value out of modifying the URL: list and forms in the classic environment without the navigation frame (e.g. `/incident_list.do`). To understand the difference between classic environment URLs and URLs for the Service Portal or a Workspace or to understand how the navigation frame impacts the format of the URL, see [Types of ServiceNow URLs](types-of-servicenow-urls.html).
### The List View
Note: If your URL starts with `/now/nav/ui/classic/params/target/` or `/nav_to.do?uri=%2F`, then it will make modifying the form easiser if you open up that page without the navigation frame by opening the link to the list in a new tab or you can right-click the list filter condition and select "Open new window". Also, there are many chrome extensions (like [SN Utils](https://chromewebstore.google.com/detail/jgaodbdddndbaijmcljdbglhpdhnjobg)) that make it easy to switch between having the navigation frame present or not.

A list view URL without the navigation frame will have a structure like */**table_name**_list.do?**first_parameter**&**second_parameter** . . .* where the first parameter (if there are any) is separated from **_list.do** with a **?** and then every additional parameter is separated by an **&**. So, if you are looking to add a parameter to your URL like `sysparm_force_row_count=1`, then usually you will want to use **&** to connect your parameter to the existing URL, but if no other parameters are present then you will need to use **?**.

Here's a breakdown of the most common or most useful URL parameters for the list view:
1. **sysparm_query**: contains the current encoded query for the table. It will usually be URL-encoded but it can accept non-URL-encoded queries. If your **sysparm_query** value is URL-encoded (has *%5E* or *%255E* instead of *^*), then it may be easier to modify if you right-click the filter condition for this list, select "Copy query", and then paste that in as the **sysparm_query** value in the URL. By modifying the encoded query directly, you can use operators not available in the filter condition builder like **NOT IN**, group by columns it won't let you group by in the UI (see [Advanced List View Grouping](advanced-list-view-grouping.html)), and add related list conditions (see [Querying Related Tables](querying-related-tables.html)). Note: if your query includes **^** as part of a text query and not as an operator--then you'll need to escape it by adding an additional ^ like `short_descriptionLIKEx^^2^active=true`. Also, the [SN Utils](https://chromewebstore.google.com/detail/jgaodbdddndbaijmcljdbglhpdhnjobg) extension makes it easy to directly modify the encoded query for the list by double-clicking in the whitespace next to the filter condition.

2. **sysparm_fixed_query**: contains an encoded query that the user cannot remove using the filter condition builder (they still can manually remove it from the URL).

3. **sysparm_view**: the view used. Can make the list columns match that of a list type report by setting this parameter to be "RPT**sys_id_of_the_report**".

4. **sysparm_view_forced=true**: prevents the user from changing the view unless they remove this parameter from the URL. To truly enforce a specific view, you should use a view rule (sysrule_view).

5. **sysparm_filter_only=true**: shows the list with only the filter present and no data loaded yet. Great for tables that load really slowly like syslog_transaction where you'll definitely want to add a filter condition before loading the data. This parameter is what is added when you type incident.FILTER into filter navigator instead of incident.LIST.

6. **sysparm_force_row_count**: overrides your user preference for the number of rows to show per page. Very useful if you want to show like 1,000 rows if you're trying to do a big bulk list edit or if you want to show like just 1 row to make a slow list load faster (I often use `&sysparm_force_row_count=1` when I'm grouping by a column and just care about the count of records in each group). As described [here](https://baral.me/blog/post-snutil-rows-hack/), you can set up some cool shortcuts for this using either bookmarklets or "slashcommands" (if you have the SN Utils chrome extension) if you don't want to add this URL parameter manually each time.

7. **sysparm_group_sort**: when you have a list that is grouped by a column, SerivceNow has added a "Group sort options" icon on the type right next to where it mentions the total count of records. Clicking that icon gives you the option to sort the groups by count ascending or count descending instead of the defaul alphabetical order. When selecting to order by count, it will just reload the page with either `&sysparm_group_sort=COUNT` or `&sysparm_group_sort=COUNTDESC`. For more list grouping tricks, see [Advanced List View Grouping](advanced-list-view-grouping.html).

8. **sysparm_userpref_module**: when you click a module from the filter navigator, this parameter gets added with a value of the sys_id of that module. I guess this functionality exists so that when reviewing syslog_transaction you can tell what module the user used to get to that table or theoretically you could run custom client logic that checks the URL and only runs when this parameter has a specific value.

9. **sysparm_userpref.user-preference-name**: can use this parameter to dynamical set most user preference (sys_user_preference) values for the user that navigates to that URL. I've found that it doesn't work for some preferences (like setting the current application preference "apps.current_app"), but it works for most of the settings shown in the Preferences modal. Here are a couple useful examples:
    A. **rowcount**: the parameter **sysparm_force_row_count** is great when you want to view a non-standard rows per page just the once, but if you want to update your default rows per page for all lists then you can use a URL parameter like **sysparm_userpref.rowcount=200**.
    B. **glide.ui.polaris.use**: if your instance doesn't have the property **glide.ui.polaris.on_off_user_pref_enabled** set to "true" to allow you to easily switch between the Next Experience UI and the Core UI using the preferences modal, then you can instead navigate to `/navpage.do?sysparm_userpref.glide.ui.polaris.use=false` to switch back to the Core UI (and switch that URL to have "true" to go back to the Next Experience UI).

10. Exporting options
### The Form View

1. **sys_id**: a form URL will always 
1. **sysparm_query**: auto-populate values