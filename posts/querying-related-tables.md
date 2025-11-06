---
title: "Querying Related Tables"
date: "2025-10-24"
excerpt: "How to use RLQUERY, SUBQUERY, and JOIN in your list view and GlideRecord encoded queries."
author: "James McGaha"
tags: ["tips & tricks","non-admin hacks","list view tricks","URLs","development","advanced"]
---
Note: RLQUERY, SUBQUERY, and JOIN work in the list view but can't be added through the filter condition builder (RLQUERY is availble for conditions built for a report or a workspace list). To add them you have to directly modify the sysparm_query parameter in the URL (see [Modifying ServiceNow URLs](modifying-servicenow-urls.html)) or with the [SN Utils](https://chromewebstore.google.com/detail/jgaodbdddndbaijmcljdbglhpdhnjobg) extension you can directly edit the encoded query for the list by double-clicking in the whitespace next to the filter condition.

## Options for querying related tables
### 1. RLQUERY
**Pros:**
1. Is the only option for filtering for when there is *not* a matching related record (only option that can do a LEFT JOIN).
2. Is the only option for filtering based on how many matching related records there are.
3. Easy to generate the syntax using a report or a workspace.

**Cons:**
1. Only works when the related table has a direct reference to the current table.
2. You can't include more than one RLQUERY.
3. Doesn't support joining the related query to the rest of the encoded query using ^OR or ^NQ (^ORRLQUERY and ^NQRLQUERY end up treated the same as ^RLQUERY)

**Syntax:**
**RLQUERY**`table_to_join`**.**`joining_table_field`**,**`comparison_operator``count`**^**`optional_condition`**^ENDRLQUERY**

**Example:**
`RLQUERYtask.assigned_to,>=1^active=true^ENDRLQUERY`

**Syntax notes:**
1. If querying a Many-to-Many table, then you need to include `,m2m` right after the count (e.g. `RLQUERYsys_user_has_role.user,>=1,m2m^role.name=admin^ENDRLQUERY`).
2. `^ENDRLQUERY` is technically optional, but best practice to include for clarity and necessary if you want to append additional conditions for the base table at the end.
### 2. SUBQUERY
**Pros:**
1. Can include multiple instances in one condition
2. Can freely nest a JOIN, RLQUERY, or another SUBQUERY in its condition or can include within the condition of a JOIN or RLQUERY.

**Cons:**
1. Can only join related records to the sys_id of the current table or join using the same field on both the current and related table.
2. Doesn't support joining the subquery to the rest of the encoded query using ^OR or ^NQ (^ORSUBQUERY and ^NQSUBQUERY end up treated the same as ^SUBQUERY)

**Syntax:**
**SUBQUERY**`primary_table_field`**,**`joining_table_field`**,**`table_to_join`**^**`optional_condition`**^ENDSUBQUERY**

**Example:** 
`SUBQUERYsys_id,assigned_to,task^active=true^ENDSUBQUERY`

**Syntax notes:**
1. The **^** before the optional_condition is mandatory even if you don't include a condition. If the SUBQUERY is nested, then you have to include a condition (though you can just put sys_idANYTHING).
2. When nesting a SUBQUERY, for the inner subquery replace **^** with **^^** (e.g. `SUBQUERYsys_id,manager,sys_user^active=true^SUBQUERYsys_id,manager,sys_user^^active=true^^ENDSUBQUERY^ENDSUBQUERY`). This might technically not be necessary as it seems to still work with single carets, but when executing in a background script you can see that if you don't use the double carets for the inner subqueries then the printout includes a message like this (though the script continues to execute as normal): `QueryEventLogger: Invalid query detected, please check logs for details [Unknown field  in table sys_user]`
3. `^ENDSUBQUERY` is technically optional, but best practice to include for clarity and necessary if you want to append additional conditions for the base table at the end.
### 3. JOIN
**Pros:**
1. Some support for using ^OR or ^NQ. The joins always occur, but the conditions on the joined tables will be attached to the main query using ^OR or ^NQ (e.g. if you do a query on the user table like `JOINsys_user.sys_id=sys_user_group.manager!active=true^NQJOINsys_user.sys_id=task.assigned_to!active=true`, then both joins will always apply and all users returned will have to be the manager of a group and assigned to a task, but since ^NQ was used then only one of the conditions on the joins needs to be true--like only one of the related group or the related task have to be active).
2. Can use non-reference fields for joining fields (e.g. can join sys_user.name to task.short_description)

**Cons:**
1. Can't nest within an RLQUERY or have an RLQUERY nested within it.
2. Can only somewhat nest JOIN queries. You can't specify a JOIN query within the condition if another JOIN, but you can have independent JOIN statements that functionaly nest within each other as long as two JOIN queries don't share the same table (or base table) for the left half of the join. (like you can have a query to get users who are the manager of an assignment group that has open tasks assigned by doing `JOINsys_user.sys_id=sys_user_group.manager!^JOINsys_user_group.sys_id=task.assignment_group!active=true`, but if you do something like this: `JOINsys_user.sys_id=sys_user.manager!^JOINsys_user.sys_id=task.assigned_to!active=true` then since both joins have "sys_user" on the left side then it queries for users who are a manager *and* are assigned a task--doesn't query for managers of users who are assigned a task).
3. When joining to a table that extends another table, technically it will join using the base table but add a condition like `sys_class_name=child_table`--except if you add your own condition to the join then it is no longer included by default so you have to add it manually (e.g. `JOINproblem.short_description=incident.short_description!active=true^^sys_class_name=incident`).

**Syntax:**
**JOIN**`primary_table`**.**`primary_table_field`**=**`table_to_join`**.**`joining_table_field`**!**`optional_condition`**^^**`optional_second_condition`

**Example:**
`JOINsys_user.sys_id=task.assigned_to!active=true`

**Syntax notes:**
1. The **!** is required even if you don't have a condition.
2. The primary_table value can be either the table you are querying or another table that you have already joined.
3. If you are attaching a JOIN to another JOIN using **^OR**, then for some reason the other JOIN also has to use **^OR**.
    A. If you have a query like `JOIN...^ORJOIN...`, then will need to replace with one of:
        i. `sys_id!=-1^ORJOIN...^ORJOIN...` (can use any condition that will always be true instead of `sys_id!=-1`)
        ii. `JOIN...^NQJOIN...`
    B. If you have a query like `base_query^JOIN...^ORJOIN...`, then will need to replace with one of:
        i. `base_query^sys_id!=-1^ORJOIN...^ORJOIN...`
        ii. `base_query^JOIN...^NQbase_query^JOIN...`
### 4. addJoinQuery
**Pros:**
1. Only option that supports dot-walked joining fields like: `gr.addJoinQuery('incident', 'opened_by.last_name', 'caller_id.first_name');`

**Cons:**
1. Only available as part of a GlideRecord script; not possible to include as the condition for a list view or report filter.
2. Can't add an encoded query as the condition for the join (have to use .addCondition() or .addOrCondition()).
3. Only able to include one addJoinQuery. 
4. Can't nest an addJoinQuery as a condition within a joining method and can't have a joining method within an addJoinQuery's condition.

**Syntax:**
**gr.addJoinQuery('**`table_to_join`**', '**`primary_table_field`**', '**`joining_table_field`**').addCondition('**`field`**', '**`operator`**', '**`value`**);**

**Example:**
`gr.addJoinQuery('task', 'sys_id', 'assigned_to').addCondition('active', 'true');`

**Syntax notes:**
1. Including addCondition() or addOrCondition() is optional. 
2. Can add multiple conditions to the joining table by using a variable like `var join = gr.addJoinQuery(` and then adding conditions like `join.addCondition(`
### 5. Database view
**Pros:**
1. Lets you retrieve only the columns you need.
2. Only option that lets you include related table columns in the data returned.
3. Supports nested joins (even nested joins not supported by JOIN like if you wanted to query for users that are the manager of a user who is assigned an active task).

**Cons:**
1. Have to create and save the database view configuration, so doesn't make sense for one-off or ad-hoc queries.
2. The records returned by a database view are read-only.
3. Unlike the other options that do a true database join (RLQUERY and JOIN), a database doesn't by default include GROUP BY or DISTINCT to ensure that more than one row is not returned for each matching base table record (so if you have a database view to join sys_user to the manager field on the sys_user_group table, then a user who is the manager of two groups will have two rows in your database view). Can't get around this by grouping by the base table sys_id in the list view or using GlideAggregate, but that can be less convenient then being able to access the base table rows directly.
4. When querying a database view through a script, you are limited to only querying 10,000 rows by default unless you adjust the property glide.db.max_view_records.
### 6. Other options
1. With GlideRecord scripting, can manually do the same idea as SUBQUERY or addJoinQuery by iterating through a seperate GlideRecord query to build an array of values and then including those as the value for an IN condition in the main GlideRecord.
2. For some simple use cases where you don't need to perform an operation on or retrieve the full data for records, you might be able to accomplish your goal with a GlideAggregate query. Like if you need just the names of users who are the manager of two or more group records, then you could query the sys_user table with RLQUERY and >=2, but it also would work to do a GlideAggregate on sys_user_group with `groupBy('manager')` and `addHaving('COUNT','>=',2)`. 
3. Similar to the GlideAggregate option, you can get similar results in a list view query by switching to the related table and grouping by the reference field. For info on improving grouping performance and grouping by dot-walked columns, see [Advanced List View Grouping](advanced-list-view-grouping.html).

## Detailed Comparison
For each of the four joining options, here is GlideRecord code for a query to pull all active users who are the manager of an active group.

For each example I've included the raw SQL logic that each query executes (to get the SQL I included `gs.trace(true);` on the line before addEncodedQuery() and `gs.trace(false);` on the line after query()).

Note: for any SQL statements shown that include `SELECT * FROM` or `SELECT DISTINCT * FROM`, technically the gs.trace() doesn't ever use * and instead lists out all fields from the table being query. For readability, I have replaced anywhere it lists out all columns for a table with *.
### RLQUERY
```var gr = new GlideRecord('sys_user');
gr.addEncodedQuery('active=true^RLQUERYsys_user_group.manager,>=1^active=true^ENDRLQUERY');
gr.query();```
This query runs the following SQL:
```SELECT sys_user0.`sys_id` FROM (sys_user sys_user0  INNER JOIN sys_user_group sj0 ON sj0.`manager`=sys_user0.`sys_id` AND sj0.`active` = 1 )  WHERE sys_user0.`active` = 1 GROUP BY sys_user0.`sys_id` HAVING count(sj0.`sys_id`) >= 1```
Notes:
1. Only option that includes the `GROUP BY . . . HAVING` syntax.
2. The related table condition is included within the JOIN statement.
3. `INNER JOIN` changes to `LEFT JOIN` when the querying for no matching related records.
### SUBQUERY
```var gr = new GlideRecord('sys_user');
gr.addEncodedQuery('active=true^SUBQUERYsys_id,manager,sys_user_group^active=true^ENDSUBQUERY');
gr.query();```
This query runs the following SQL:
```SELECT DISTINCT sys_user_group0.`manager` FROM sys_user_group sys_user_group0  WHERE sys_user_group0.`active` = 1 ```
```SELECT * FROM sys_user sys_user0  WHERE sys_user0.`active` = 1 AND sys_user0.`sys_id` IN ('46d44a23a9fe19810012d100cca80666' , '506c0f9cd7011200f2d224837e61030f' , '62826bf03710200044e0bfc8bcbe5df1' , '9ee1b13dc6112271007f9d0efdb69cd0' , 'a8f98bb0eb32010045e1a5115206fe3a' , 'b6b364e253131300e321ddeeff7b121b' , 'cf1ec0b4530360100999ddeeff7b129f' , 'f298d2d2c611227b0106c6be7f154bc8')```
Notes:
1. Only option that splits the SQL into more than one statement. The subqueries are actually executed when addEncodedQuery() is run and then the values returned by the subqueries are included within the main query that only executes when query() is run.
2. True to it's name, technically performs a subquery rather than doing a true database join.
### JOIN
```var gr = new GlideRecord('sys_user');
gr.addEncodedQuery('active=true^JOINsys_user.sys_id=sys_user_group.manager!active=true');
gr.query();```
This query runs the following SQL:
```SELECT DISTINCT * FROM (sys_user sys_user0  INNER JOIN sys_user_group sys_user_group0 ON sys_user0.`sys_id` = sys_user_group0.`manager` )  WHERE sys_user0.`active` = 1 AND sys_user_group0.`active` = 1```
Notes:
1. All join statements are moved to the front and the base table and related table conditions are all combined into one WHERE clause at the end. Understanding this helps explain the behavior using ^OR or ^NQ. For example, an encoded query like `condition`**^ORJOIN**`table_1_join`**!**`table_1_condition`**^ORJOIN**`table_2_join`**!**`table_2_condition` should be considered to actually work like **JOIN**`table_1_join`**^JOIN**`table_2_join`**^**`condition`**^OR**`table_1_condition`**^OR**`table_2_condition`
2. If the main table being queried or the joined table are a child table (like incident), then the joins are performed using the base table (like task). Also, if there is a storage alias for the column, then that is used instead and it's possible that a different child table uses that same alias for a different field. For more details, refer to Example 1 under Further Examples.
### addJoinQuery
```var gr = new GlideRecord('sys_user');
gr.addEncodedQuery('active=true');
var join = gr.addJoinQuery('sys_user_group', 'sys_id', 'manager');
join.addCondition('active', 'true');
gr.query();```
This query runs the following SQL:
```SELECT * FROM sys_user sys_user0  WHERE sys_user0.`active` = 1 AND sys_user0.`sys_id` IN (SELECT sys_user_group0.`manager` FROM sys_user_group sys_user_group0  WHERE sys_user_group0.`active` = 1 ORDER BY sys_user_group0.`sys_id`)```
Notes:
1. Despite it's name, this performs a subquery rather than a true database join. It's essentially the same as using SUBQUERY, except it is all executed as one SQL query.
2. Includes an ORDER BY statement at the end. For these 4 example GlideRecord queries listed here, I noticed that addJoinQuery and JOIN returned the users in the same order while RLQUERY and SUBQUERY shared a different ordering of the users.
### Database view
Assuming that a sys_db_view record, "u_sys_user_group_managers", has already been created by joining sys_user and sys_user_group with a where clause for the sys_user_group view table like `group_manager = user_sys_id`.
```var gr = new GlideAggregate('u_sys_user_group_managers');
gr.addEncodedQuery('group_active=true^user_active=true');
gr.groupBy('user_sys_id');
gr.query();```
This query runs the following SQL:
```SELECT `user`.`sys_id` AS `user_sys_id` FROM (sys_user_group `group`  INNER JOIN sys_user `user` ON `group`.`manager`  = `user`.`sys_id`  )  WHERE `group`.`active` = 1 AND `user`.`active` = 1 GROUP BY `user`.`sys_id` ORDER BY `user`.`sys_id` ```
Notes:
1. Similar to the other true database joins, RLQUERY and JOIN.
2. Can add additional fields to be returned by including additional groupBy statements.
3. In this example, if you didn't care about a user who is the manager of two groups having two rows returned, then you could instead switch GlideAggregate with GlideRecord and remove the groupBy statement. The SQL returned would be the same except it would SELECT all columns in the database view and would not include `GROUP BY` and `ORDER BY` statements.
## Further Examples
### Example 1: JOIN with ^OR and child tables
`name=Ron Sorokin^ORJOINsys_user.sys_id=incident.caller_id!active=true^^sys_class_name=incident^ORJOINsys_user.sys_id=problem.opened_by!active=true^^sys_class_name=problem`
```SELECT DISTINCT * FROM ((sys_user sys_user0  INNER JOIN task task0 ON sys_user0.`sys_id` = task0.`a_ref_4` )  INNER JOIN task task1 ON sys_user0.`sys_id` = task1.`opened_by` )  WHERE (sys_user0.`name` = 'Ron Sorokin' OR (task0.`active` = 1 AND task0.`sys_class_name` = 'incident') OR (task1.`active` = 1 AND task1.`sys_class_name` = 'problem'))```
You might expect that this query would return:
1. Ron Sorokin
2. All users listed as the caller in an active incident
3. All users listed as the opened by in an active problem

But how it actually works is all users returned must meet all three of these conditions:
1. Have a record in the task table (including all child tables of task) that lists them as the opened by
2. Have a record in the task table (or any of its child tables) that lists them in whatever column in that table uses the storage alias (sys_storage_alias) "a_ref_4" (because the incident table uses that storage alias for the caller_id column)
3. Either be named Ron Sorokin, be listed as the caller in an active incident, or be listed as the opened by in an active problem

So, if Ron is not listed as the "opened_by" value in any record in the task table hierarchy, then he would not be returned. However, Ron would be returned if theoretically he was the opened_by for an inactive change_request record and was the reopened_by for a problem_task record (since problem task uses the same storage alias for "Last reopened by" as incident does for "Caller").
### Example 2: Nested SUBQUERY with dot-walking
In this example, I'm concerned about requests for the catalog item "Apple iPad 3" having tasks that sit around unassigned for over a week, so I want to get all of the users who own an assignment group that currently has tasks like that. And I actually want to get their boss, so I can reach out to them directly and tell them that their reports need to stay on top of their fulfillment groups better.

`SUBQUERYsys_id,manager,sys_user^SUBQUERYsys_id,manager,sys_user_group^^SUBQUERYsys_id,assignment_group,sc_task^^assigned_toISEMPTY^^active=true^^sys_created_onRELATIVELT@dayofweek@ago@7^^request_item.cat_item.name=Apple iPad 3^^ENDSUBQUERY^^ENDSUBQUERY^ENDSUBQUERY`
```SELECT DISTINCT task0.`assignment_group`, task1.`number` AS request_item_number FROM ((task task0  LEFT JOIN task task1 ON task0.`a_ref_2` = task1.`sys_id` )  LEFT JOIN sc_cat_item sc_cat_item2 ON task1.`a_ref_1` = sc_cat_item2.`sys_id` )  WHERE task0.`sys_class_name` = 'sc_task' AND task0.`assigned_to` IS NULL  AND task0.`active` = 1  AND task0.`sys_created_on`< '2025-10-17 13:29:33' AND sc_cat_item2.`name` = 'Apple iPad 3'```
```SELECT DISTINCT sys_user_group0.`manager` FROM sys_user_group sys_user_group0  WHERE sys_user_group0.`sys_id` = '8a4cb6d4c61122780043b1642efcd52b' ```
``` SELECT DISTINCT sys_user0.`manager` FROM sys_user sys_user0  WHERE sys_user0.`sys_id` = '46d44a23a9fe19810012d100cca80666' ```
```SELECT * FROM sys_user sys_user0  WHERE sys_user0.`sys_id` = '5a826bf03710200044e0bfc8bcbe5dcc'```
You can see it starts with the innermost SUBQUERY, executes that an independent SQL statement, and uses the returned values for the condition in the next innermost query (if multiple values were returned, the **=** would be replaced by **IN**).