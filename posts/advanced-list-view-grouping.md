---
title: "Advanced List View Grouping"
date: "2025-10-14"
excerpt: "Level up your list view grouping skills by improving the performance and grouping by columns that are dot-walked or have a type that can't normally be grouped by."
author: "James McGaha"
tags: ["tips & tricks","non-admin hacks","list view tricks","URLs"]
---
Level up your list view grouping skills by improving the performance and grouping by columns that are dot-walked or have a type that can't normally be grouped by.
### I. Improving Grouping Performance
Grouped list views can often load pretty slowly, so being aware of ways to improve the performance of a grouped list can save you a lot of time. I've attached a list of things I've seen improve the performance of a grouped list (along with how much of an performance increase I saw while testing on the sysevent table):
1. Of course, factors that cause an ungrouped list to load slow (e.g. table size, filter condition, list layout columns, etc.) will also cause a grouped list to load slow. However, a query that would normally run slower than an unfiltered list can end up being the faster option when grouping if the slow filter returns fewer results and fewer distinct groupings (e.g. it was 95% faster to load an unfiltered syslog list than it was to load it with the filter "messageLIKEjtest"; however, after grouping by the source column, the filtered list which returned only 171 rows and 6 distinct source values loaded 61% faster than the unfiltered list that returned 449,350 rows with 785 source values) 
2. The column you are grouping by obviously influences the performance.
    A. Grouping by an indexed column (e.g. for a query on the sysevent table, it was 80% faster to group by the indexed column sys_created_on than the unindexed sys_updated_on--even when the query condition and sorting both used sys_updated_on).
    B. Grouping by a column with fewer unique values (e.g. querying sysevent, grouping by "claimed_by" which had 9 groups was 84% faster than grouping by "instance" which had 3,648 groups--and there was no significant difference when using a query that resulted in the same number of unique claimed_by and instance values).
    C. Grouping by the column you are filtering by may *slightly* help the performance (e.g. for the sysevent table, when querying based on either process_on or sys_updated_on, it was slightly faster (3%) to group by the same column as used in the query).
3. Sorting by the column you're grouping by (e.g. querying the sysevent table grouped by either parm1 or by parm2, it was 11% faster when sorting by the same column being grouped by)
4. Using fewer rows per page can dramatically help the performance. If you are showing 100 rows per page and group a list that has 100 groups that each have 100+ records, then you're effectively showing 10,000 rows. If you aren't interested in seeing all of the rows within each group, it can save a lot of time to add **&sysparm_force_row_count=1** to your URL (see [Modifying ServiceNow URLs](modifying-servicenow-urls.html)) (e.g. for a query on the sysevent table grouping by sys_created_on, it was 85% faster when limiting the row count to 1).
### II. Ordering the Groups
ServiceNow has added a useful "Group sort options" button that shows in the top right next to the total record count while grouping a list. You can use this to sort your groups based on "Count descending" instead of alphabetically, which is very useful when there are many groups and you just want to see the most common one (like if you want to quickly see who are the Callers with the most incidents). If you're still on a version of ServiceNow before they added this button or prefer to do through the URL, you can do the same thing the button does by adding **&sysparm_group_sort=COUNTDESC** to your URL (see [Modifying ServiceNow URLs](modifying-servicenow-urls.html)). I often add via URL because I'm already modifying the URL to force the row count to be 1 and it's quickest to add both parameters at the same time like **&sysparm_force_row_count=1&sysparm_group_sort=COUNTDESC**.
### III. Grouping by Any Type of Column
For the following column types, the "Group By" option in the column header context menu is grayed out, but you can still group by them if you manually modify the encoded query—either by updating the sysparm_query parameter in the URL (see [Modifying ServiceNow URLs](modifying-servicenow-urls.html)) or using the [SN Utils](https://chromewebstore.google.com/detail/jgaodbdddndbaijmcljdbglhpdhnjobg) extension and double-clicking the whitespace next to the filter condition—to include ^GROUPBYcolumn_name:
- Basic Date/Time (datetime)
- Calendar Date/Time (calendar_date_time)
- Data Structure (data_structure)
- Date (glide_date)
- Date/Time (glide_date_time)
- Due Date (due_date)
- Duration (glide_duration)
- Dynamic Attribute Store (dynamic_attribute_store)
- FX Currency (currency2)
- Insert Timestamp (insert_timestamp)
- Other Date (date)
- Password (1 Way Encrypted) (password)
- Password (2 Way Encrypted) (password2)
- Properties (properties)
- String (string) **(If the max length is 256 or greater)**
- Time (glide_time)
- URL (url)
- UTC Time (glide_utc_time)
- Wiki (wiki_text)
Note: for password type columns, since the hashed values are salted, rows that are set to have the same value won't group together--only empty values will be grouped together.

For these 4 types of columns, it will technically let you group by them, but it won't work as there will always just be one group with the label "(empty)":
- Journal (journal)
- Journal Input (journal_input)
- Journal List (journal_list)
- Related Tags (related_tags)
### IV. Grouping by Dot-Walked Columns
Note: grouping by a dot-walked column can be slow.

To group by a dot-walked column, either:
1. Manually modify the encoded query to have the dot-walked column the same way as in point **III.** above.
2. Add the dot-walked column to the list view and then use the column header context menu to group by that column as normal (see [How to add dot-walked columns to the list view](add-dot-walked-columns-to-the-list-view.html)).