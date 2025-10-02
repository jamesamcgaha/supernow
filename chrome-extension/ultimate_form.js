let url = getUrlVars('url');
let g_ck = getUrlVars('g_ck');
let tableName = getUrlVars('tablename');
let sysId = getUrlVars('sysid');
let title = getUrlVars('title');
let tableTitle = getUrlVars('tableTitle');
let metaDataObject = {};
const columnFilters = {};
let longestInput = '';
let maxWidth = 150;
let sortDirection = true;
let selectedFromTypeahead = false;
let initialInputValue = '';
let initialDisplayValue = '';
let showInternalNames = false;
let hideBlankValues = false;


superNowGetViewData();

async function superNowGetViewData() {
    if (!(tableName && sysId)) {
        return true;
    }

   /* var url2 = url.replace('https://', '').replace('http://', '');
    const cspContent = `font-src 'self' ${url2};`;
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = 'Content-Security-Policy';
    metaTag.content = cspContent;
    document.head.appendChild(metaTag);
*/
    const style = document.createElement('style');
    style.type = 'text/css';
    const css = `
        @font-face {
            font-family: "retina_icons";
            src: url("${url}/styles/retina_icons/retina_icons.eot?48738ebcb15c33e079d559483fe7e2aa");
            src: url("${url}/styles/retina_icons/retina_icons.eot?48738ebcb15c33e079d559483fe7e2aa#iefix") format("embedded-opentype"),
                url("${url}/styles/retina_icons/retina_icons.woff?48738ebcb15c33e079d559483fe7e2aa") format("woff"),
                url("${url}/styles/retina_icons/retina_icons.ttf?48738ebcb15c33e079d559483fe7e2aa") format("truetype");
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: "SourceSansPro";
            src: url("${url}/styles/fonts/source-sans-pro/SourceSansPro-Regular.eot");
            src: url("${url}/styles/fonts/source-sans-pro/SourceSansPro-Regular.eot?#iefix") format("embedded-opentype"), url("${url}/styles/fonts/source-sans-pro/SourceSansPro-Regular.otf.woff") format("woff"), url("${url}/styles/fonts/source-sans-pro/SourceSansPro-Regular.ttf") format("truetype");
        }
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            src: url('${url}/styles/polarisberg/fonts/lato/lato-v17-latin-ext_latin-700.woff2') format('woff2'), url('${url}/styles/polarisberg/fonts/lato/lato-v17-latin-ext_latin-700.woff') format('woff');
        }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

   /*
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url + '/scripts/js_includes_filter_widget.js';
    document.head.appendChild(script);
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = url + '/scripts/js_includes_ng_form_elements.js';
    document.head.appendChild(script2);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url + '/styles/filter.css';
    document.head.appendChild(link);
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.type = 'text/css';
    link2.href = url + '/styles/thirdparty/datetimepicker.css';
    document.head.appendChild(link2);
    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.type = 'text/css';
    link3.href = url + '/styles/retina_icons.css';
    document.head.appendChild(link3);

    const conditionFilterSection = document.getElementById('filterToAddTo');
    if(conditionFilterSection){
        conditionFilterSection.innerHTML = `
        <div sn-ng-formatter="sn.filter_widget">
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter.xml">
            <div id="{{uid}}gcond_filters" class="ng-filter-widget filterContainer"><now-message key="Filter" value="Filter"></now-message><now-message key="Variables" value="Variables"></now-message><now-message key="Save Filter" value="Save Filter"></now-message><now-message key="Quantity" value="Quantity"></now-message><now-message key="Keywords" value="Keywords"></now-message><now-message key="Days" value="Days"></now-message><now-message key="Weeks" value="Weeks"></now-message><now-message key="Months" value="Months"></now-message><now-message key="Quarters" value="Quarters"></now-message><now-message key="Years" value="Years"></now-message><now-message key="Minutes" value="Minutes"></now-message><now-message key="Today" value="Today"></now-message><now-message key="Yesterday" value="Yesterday"></now-message><now-message key="Tomorrow" value="Tomorrow"></now-message><now-message key="This week" value="This week"></now-message><now-message key="Last week" value="Last week"></now-message><now-message key="Next week" value="Next week"></now-message><now-message key="This month" value="This month"></now-message><now-message key="Last month" value="Last month"></now-message><now-message key="Next month" value="Next month"></now-message><now-message key="Last 3 months" value="Last 3 months"></now-message><now-message key="Last 6 months" value="Last 6 months"></now-message><now-message key="Last 9 months" value="Last 9 months"></now-message><now-message key="Last 12 months" value="Last 12 months"></now-message><now-message key="This quarter" value="This quarter"></now-message><now-message key="Last quarter" value="Last quarter"></now-message><now-message key="Last 2 quarters" value="Last 2 quarters"></now-message><now-message key="Next quarter" value="Next quarter"></now-message><now-message key="Next 2 quarters" value="Next 2 quarters"></now-message><now-message key="This year" value="This year"></now-message><now-message key="Next year" value="Next year"></now-message><now-message key="Last year" value="Last year"></now-message><now-message key="Last 2 years" value="Last 2 years"></now-message><now-message key="Last 7 days" value="Last 7 days"></now-message><now-message key="Last 30 days" value="Last 30 days"></now-message><now-message key="Last 60 days" value="Last 60 days"></now-message><now-message key="Last 90 days" value="Last 90 days"></now-message><now-message key="Last 120 days" value="Last 120 days"></now-message><now-message key="Current hour" value="Current hour"></now-message><now-message key="Last hour" value="Last hour"></now-message><now-message key="Last 2 hours" value="Last 2 hours"></now-message><now-message key="Current minute" value="Current minute"></now-message><now-message key="Last minute" value="Last minute"></now-message><now-message key="Last 15 minutes" value="Last 15 minutes"></now-message><now-message key="Last 30 minutes" value="Last 30 minutes"></now-message><now-message key="Last 45 minutes" value="Last 45 minutes"></now-message><now-message key="One year ago" value="One year ago"></now-message><now-message key="ago" value="ago"></now-message><now-message key="from now" value="from now"></now-message><now-message key="Day" value="Day"></now-message><now-message key="Month" value="Month"></now-message><now-message key="Quarter" value="Quarter"></now-message><now-message key="Year" value="Year"></now-message><now-message key="Week" value="Week"></now-message><now-message key="Time" value="Time"></now-message><now-message key="Day as" value="Day as"></now-message><now-message key="Week as" value="Week as"></now-message><now-message key="Month as" value="Month as"></now-message><now-message key="Quarter as" value="Quarter as"></now-message><now-message key="Year as" value="Year as"></now-message><now-message key="Hour as" value="Hour as"></now-message><now-message key="Hours" value="Hours"></now-message><now-message key="Minutes" value="Minutes"></now-message><now-message key="Days" value="Days"></now-message><now-message key="Months" value="Months"></now-message><now-message key="Quarters" value="Quarters"></now-message><now-message key="Years" value="Years"></now-message><now-message key="on or after" value="on or after"></now-message><now-message key="on or before" value="on or before"></now-message><now-message key="after" value="after"></now-message><now-message key="before" value="before"></now-message><now-message key="before or after" value="before or after"></now-message><now-message key="on" value="on"></now-message><now-message key="Monday" value="Monday"></now-message><now-message key="Tuesday" value="Tuesday"></now-message><now-message key="Wednesday" value="Wednesday"></now-message><now-message key="Thursday" value="Thursday"></now-message><now-message key="Friday" value="Friday"></now-message><now-message key="Saturday" value="Saturday"></now-message><now-message key="January" value="January"></now-message><now-message key="February" value="February"></now-message><now-message key="March" value="March"></now-message><now-message key="April" value="April"></now-message><now-message key="May" value="May"></now-message><now-message key="June" value="June"></now-message><now-message key="July" value="July"></now-message><now-message key="August" value="August"></now-message><now-message key="September" value="September"></now-message><now-message key="October" value="October"></now-message><now-message key="November" value="November"></now-message><now-message key="December" value="December"></now-message><now-message key="Quarter 1" value="Quarter 1"></now-message><now-message key="Quarter 2" value="Quarter 2"></now-message><now-message key="Quarter 3" value="Quarter 3"></now-message><now-message key="Quarter 4" value="Quarter 4"></now-message><now-message key="Week 0" value="Week 0"></now-message><now-message key="Week 1" value="Week 1"></now-message><now-message key="Week 2" value="Week 2"></now-message><now-message key="Week 3" value="Week 3"></now-message><now-message key="Week 4" value="Week 4"></now-message><now-message key="Week 5" value="Week 5"></now-message><now-message key="Week 6" value="Week 6"></now-message><now-message key="Week 7" value="Week 7"></now-message><now-message key="Week 8" value="Week 8"></now-message><now-message key="Week 9" value="Week 9"></now-message><now-message key="Week 10" value="Week 10"></now-message><now-message key="Week 11" value="Week 11"></now-message><now-message key="Week 12" value="Week 12"></now-message><now-message key="Week 13" value="Week 13"></now-message><now-message key="Week 14" value="Week 14"></now-message><now-message key="Week 15" value="Week 15"></now-message><now-message key="Week 16" value="Week 16"></now-message><now-message key="Week 17" value="Week 17"></now-message><now-message key="Week 18" value="Week 18"></now-message><now-message key="Week 19" value="Week 19"></now-message><now-message key="Week 20" value="Week 20"></now-message><now-message key="Week 21" value="Week 21"></now-message><now-message key="Week 22" value="Week 22"></now-message><now-message key="Week 23" value="Week 23"></now-message><now-message key="Week 24" value="Week 24"></now-message><now-message key="Week 25" value="Week 25"></now-message><now-message key="Week 26" value="Week 26"></now-message><now-message key="Week 27" value="Week 27"></now-message><now-message key="Week 28" value="Week 28"></now-message><now-message key="Week 29" value="Week 29"></now-message><now-message key="Week 30" value="Week 30"></now-message><now-message key="Week 31" value="Week 31"></now-message><now-message key="Week 32" value="Week 32"></now-message><now-message key="Week 33" value="Week 33"></now-message><now-message key="Week 34" value="Week 34"></now-message><now-message key="Week 35" value="Week 35"></now-message><now-message key="Week 36" value="Week 36"></now-message><now-message key="Week 37" value="Week 37"></now-message><now-message key="Week 38" value="Week 38"></now-message><now-message key="Week 39" value="Week 39"></now-message><now-message key="Week 40" value="Week 40"></now-message><now-message key="Week 41" value="Week 41"></now-message><now-message key="Week 42" value="Week 42"></now-message><now-message key="Week 43" value="Week 43"></now-message><now-message key="Week 44" value="Week 44"></now-message><now-message key="Week 45" value="Week 45"></now-message><now-message key="Week 46" value="Week 46"></now-message><now-message key="Week 47" value="Week 47"></now-message><now-message key="Week 48" value="Week 48"></now-message><now-message key="Week 49" value="Week 49"></now-message><now-message key="Week 50" value="Week 50"></now-message><now-message key="Week 51" value="Week 51"></now-message><now-message key="Week 52" value="Week 52"></now-message><now-message key="Week 53" value="Week 53"></now-message><now-message key="2000" value="2000"></now-message><now-message key="2001" value="2001"></now-message><now-message key="2002" value="2002"></now-message><now-message key="2003" value="2003"></now-message><now-message key="2004" value="2004"></now-message><now-message key="2005" value="2005"></now-message><now-message key="2006" value="2006"></now-message><now-message key="2007" value="2007"></now-message><now-message key="2008" value="2008"></now-message><now-message key="2009" value="2009"></now-message><now-message key="2010" value="2010"></now-message><now-message key="2011" value="2011"></now-message><now-message key="2012" value="2012"></now-message><now-message key="2013" value="2013"></now-message><now-message key="2014" value="2014"></now-message><now-message key="2015" value="2015"></now-message><now-message key="2016" value="2016"></now-message><now-message key="2017" value="2017"></now-message><now-message key="2018" value="2018"></now-message><now-message key="2018" value="2018"></now-message><now-message key="2019" value="2019"></now-message><now-message key="2020" value="2020"></now-message><now-message key="2021" value="2021"></now-message><now-message key="2022" value="2022"></now-message><now-message key="2023" value="2023"></now-message><now-message key="2024" value="2024"></now-message><now-message key="2025" value="2025"></now-message><now-message key="2026" value="2026"></now-message><now-message key="2027" value="2027"></now-message><now-message key="2028" value="2028"></now-message><now-message key="2029" value="2029"></now-message><now-message key="2030" value="2030"></now-message><now-message key="Midnight hour" value="Midnight hour"></now-message><now-message key="1 am hour" value="1 am hour"></now-message><now-message key="2 am hour" value="2 am hour"></now-message><now-message key="3 am hour" value="3 am hour"></now-message><now-message key="4 am hour" value="4 am hour"></now-message><now-message key="5 am hour" value="5 am hour"></now-message><now-message key="6 am hour" value="6 am hour"></now-message><now-message key="7 am hour" value="7 am hour"></now-message><now-message key="8 am hour" value="8 am hour"></now-message><now-message key="9 am hour" value="9 am hour"></now-message><now-message key="10 am hour" value="10 am hour"></now-message><now-message key="11 am hour" value="11 am hour"></now-message><now-message key="Noon hour" value="Noon hour"></now-message><now-message key="1 pm hour" value="1 pm hour"></now-message><now-message key="2 pm hour" value="2 pm hour"></now-message><now-message key="3 pm hour" value="3 pm hour"></now-message><now-message key="4 pm hour" value="4 pm hour"></now-message><now-message key="5 pm hour" value="5 pm hour"></now-message><now-message key="6 pm hour" value="6 pm hour"></now-message><now-message key="7 pm hour" value="7 pm hour"></now-message><now-message key="8 pm hour" value="8 pm hour"></now-message><now-message key="9 pm hour" value="9 pm hour"></now-message><now-message key="10 pm hour" value="10 pm hour"></now-message><now-message key="11 pm hour" value="11 pm hour"></now-message><now-message key="{TABLENAME} Conditions" value="{TABLENAME} Conditions"></now-message><now-message key="Related List" value="Related List"></now-message><now-message key="Greater than or Equal to" value="Greater than or Equal to"></now-message><now-message key="Greater than" value="greater than"></now-message><now-message key="Less than or Equal to" value="Less than or Equal to"></now-message><now-message key="Less than" value="less than"></now-message><now-message key="Equal to" value="Equal to"></now-message><now-message key="None" value="None"></now-message><now-message key="-- None --" value="-- None --"></now-message><now-message key="-- Choose Field --" value="-- choose field --"></now-message><now-message key="Between" value="between"></now-message><now-message key="- Table -" value="- Table -"></now-message><now-message key="Joined {0} : {1} {2} records are related to a {3}" value="Joined {0} : {1} {2} records are related to a {3}"></now-message><now-message key="Next decade" value="Next decade"></now-message><now-message key="Previous decade" value="Previous decade"></now-message><now-message key="Previous year" value="Previous year"></now-message><now-message key="Previous month" value="Previous month"></now-message><now-message key="Select month" value="Select month"></now-message><now-message key="Select year" value="Select year"></now-message><form ng-submit="runFilter()"><div class="filter-header" ng-if="!filterConfig.hideHeader"><sn-load-filter-widget ng-if="filterConfig.loadFilter" manage-filters-link="{{filterConfig.manageFiltersLink}}" class="pull-left"></sn-load-filter-widget><sn-save-filter-widget ng-if="filterConfig.saveFilter" global-role="true" group-role="true" admin-role="true" class="pull-left"></sn-save-filter-widget><span ng-if="filterConfig.saveFilter &amp;&amp; filterConfig.loadFilter" class="nav-divider pull-left"></span><sn-sort-filter-widget ng-if="filterConfig.sortFilter" field-list="{{filterConfig.fieldList.join(',')}}" class="pull-left"></sn-sort-filter-widget><button type="button" ng-if="filterConfig.testFilter" id="{{uid}}-test-filter-button" class="btn btn-primary pull-left sn-filter-tooltip" ng-click="testFilter()" title="See how many results this query will return.">Preview</button><p ng-if="filterConfig.testFilter &amp;&amp; count" class="test-results-text pull-left"><a ng-href="/{{ table }}_list.do?sysparm_query={{ encodedQueryPreviewUrl }}" aria-live="polite" class="btn btn-link" target="_blank">{{count}} records match condition</a></p><span ng-if="filterConfig.testFilter" class="nav-divider"></span><div class="pull-right"><button type="button" ng-if="filterConfig.clearFilter" id="{{uid}}-clear-filter-button" class="btn btn-default sn-filter-tooltip" title="Clear all filter conditions" ng-click="clearFilter()">Clear All</button><button ng-if="filterConfig.runFilter" id="{{uid}}-run-filter-button" class="btn btn-primary sn-filter-tooltip" title="Filter this list" type="submit">Run</button></div><button id="{{uid}}-close-filter-button" type="button" class="btn btn-icon icon icon-connect-close close pull-right close-button sn-filter-tooltip" title="Close Filter" ng-click="close()" ng-if="filterConfig.closeFilter"><span class="sr-only">Close Filter</span></button></div><div class="filter-hr no-margin" ng-if="!filterConfig.hideHeader"></div><sn-filter-predicate base-table="{{table}}" table-label="{{tableLabel}}" filter-config="filterConfig" popover-config="popoverConfig" ng-if="queryMap.predicates[0]" predicate="queryMap.predicates[0]" table="table" uid="uid"></sn-filter-predicate><sn-filter-predicate base-table="{{table}}" table-label="{{tableLabel}}" filter-config="filterConfig" popover-config="popoverConfig" ng-if="queryMap.predicates[1] &amp;&amp; !initializing &amp;&amp; filterConfig.relatedListQueryConditions " predicate="queryMap.predicates[1]" table="queryMap.predicates[1].comparison.table" uid="uid"></sn-filter-predicate></form></div>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_predicate.xml">
            <div class="predicate"><div class="filter-toggle-header"><button ng-click="toggleState()" ng-if="filterConfig.relatedListQueryConditions" ng-class="{collapsed : data.collapsed}" class="btn btn-default" aria-label="{{displayTitle}}" aria-controls="{{::ariaId}}-content" aria-expanded="{{ data.collapsed ? false : true }}"><i class="icon-arrow-down-triangle" aria-hidden="true"></i><span class="sn-filter-predicate-title h5">{{displayTitle}}</span></button><button class="btn btn-icon icon-help sn-filter-tooltip related-list-help-icon" data-toggle="tooltip" data-placement="bottom" tabindex="-1" title="Show only results that have the selected number of related records" type="button" aria-label="Show only results that have the selected number of related records" ng-if="data.isRelated"></button></div><div id="{{::ariaId}}-content" class="filter-toggle-section" ng-class="{collapsed : data.collapsed}" aria-hidden="{{ data.collapsed }}"><div class="related-list-identifier" ng-if="data.isRelated &amp;&amp; filterConfig.relatedListQueryConditions"><sn-filter-related-list-comparison></sn-filter-related-list-comparison><div class="related-list-selector"><sn-filter-related-list-select ng-if="relatedLists"></sn-filter-related-list-select><button type="button" ng-click="removeTable()" title="Remove table selection" class="remove-related-list-table-button btn btn-default btn-icon icon-delete" aria-label="Remove related list table selection"></button></div></div><div class="compounds" ng-if="!data.isRelated || filterConfig.relatedShowCompounds"><sn-filter-compound ng-repeat="compound in predicate.subpredicates"></sn-filter-compound><div class="filter-footer or-section" ng-if="filterConfig.sets &amp;&amp; allowNewSets()"><div class="or-divider"><span>or</span></div><div><button type="button" tabindex="0" id="{{uid}}-add-new-section" class="btn btn-default pull-left new-criteria sn-filter-tooltip" data-placement="right" title="Create another set of conditions" ng-click="addCompound()">New Criteria</button></div></div></div></div></div>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_related_list_comparison_button.xml">
            <a tabindex="0" ng-click="togglePopover($event)" class="sn-popover-complex" role="button"><span class="sr-only">Open filter field list</span><span class="related-comparison-display-value">{{relatedListComparisonModel.operatorLabel}} {{relatedListComparisonModel.displayValue}}</span></a>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_related_list_comparison_popover.xml">
            <div class="nav-input-group"><div class="search-decoration-full"><div class="related-list-comparison"><form ng-submit="closePopover()"><span class="related-list-comparison-operator-container"><label><span class="sr-only">Choose related comparison operator</span><select ng-model="relatedListComparisonModel.operatorValue" class="form-control" sn-focus="true" ng-change="relatedListComparisonOperatorChange(relatedListComparisonModel.operatorValue)" ng-options="model.operatorValue as model.operatorLabel for model in relatedComparisonOperators"></select><i class="select-indicator icon-vcr-down"></i></label></span><span ng-if="!relatedListComparisonModel.between" class="related-list-comparison-value-container"><label><span class="sr-only">Choose related comparison value</span><input type="text" class="form-control" ng-disabled="disabledInput" ng-change="relatedListComparisonValueChange(relatedListComparisonModel.value)" ng-model="relatedListComparisonModel.value"></input></label></span><span ng-if="relatedListComparisonModel.between"><label class="related-list-comparison-between-operator-container"><span class="sr-only">Choose first related comparison value</span><input type="text" ng-change="formatBetween()" class="form-control related-list-search-between-value" ng-model="relatedListComparisonModel.firstBetweenValue"></input></label><span class="and-section">and</span><label class="related-list-comparison-between-operator-container"><span class="sr-only">Choose second comparison value</span><input type="text" class="form-control related-list-search-between-value" ng-change="formatBetween()" ng-model="relatedListComparisonModel.secondBetweenValue"></input></label></span><button type="submit" class="btn btn-primary sr-only">Done</button></form></div></div></div>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_comparison.xml">
            <div class="ng-filter-widget-row conditions-row"><span class="ng-filter-widget-column field-col form-group center-block" ng-keypress="filterRowKeypress($event)"><sn-filter-field-lists-parent ref="cond_field_{{$index}}" set-index="{{$parent.$parent.$index}}" base-table="baseTable" table="table" uid="uid" close-event="fieldListCloseEvent" ng-model="comparison.field_label" dot-walking="filterConfig.dotWalking" comparison="comparison" predicate="predicate" popover-container="filterConfig.popoverContainer" popover-config="popoverConfig" compound-message="getCompoundMessage(ruleSet) || getCompoundMessage(compound) || getCompoundMessage(predicate)"></sn-filter-field-lists-parent></span><span class="ng-filter-widget-column operator-col form-group" ng-keypress="filterRowKeypress($event)"><label for="cond_operator_{{$index}}" class="sr-only">Filter operator</label><select id="cond_operator_{{$index}}" aria-expanded="{{operatorExpanded}}" ng-click="operatorExpandedToggle(true)" ng-blur="operatorExpandedToggle(false)" ng-keypress="operatorKeypress($event)" ng-change="operatorChange()" ng-model="comparison.operator" ng-options="op.operator as op.label for op in comparison.operators" ng-disabled="comparison.readonly" class="form-control condition-operator-select"></select></span><ng-switch class="ng-filter-widget-column ng-filter-widget-column_multi" on="comparison.advancedEditor" ng-keypress="filterRowKeypress($event)"><label class="center-block" ng-switch-when="none"><span class="sr-only">Field value</span><span class="editor-col"><input class="sr-only" readonly="readonly" value="No value needed"></input></span></label><fieldset ng-switch-when="between_field"><legend class="sr-only">Field value</legend><sn-filter-widget-between-element class="" field="comparison" popover-config="popoverConfig"></sn-filter-widget-between-element></fieldset><label class="center-block" ng-switch-default=""><span class="sr-only">Field value</span><sn-filter-widget-element class="editor-col form-group" field="comparison" popover-config="popoverConfig"></sn-filter-widget-element></label></ng-switch><span class="ng-filter-widget-column btn-col"><button class="btn btn-default btn-icon icon-delete remove-conditions-row sn-filter-tooltip" data-placement="bottom" title="Remove this condition" ng-click="removeComparisonRow($parent.$parent.$index, $parent.$index, $index); cleanToolTip($event);" aria-label="{{comparison.removeButtonAriaLabel}}" type="button" tabindex="0"><span class="sr-only">{{comparison.removeButtonAriaLabel}}</span></button><button type="button" tabindex="0" class="btn btn-default btn-or-condition add-conditions-row sn-filter-tooltip" data-placement="bottom" title="Add OR Condition" ng-click="addComparisonRow($parent.$parent.$index, $parent.$index, $index, 'or'); cleanToolTip($event); focusOrButton($parent.$parent.$index, $parent.$index, $first, (ruleSet.compound_type === 'or'))" ng-disabled="comparison.field === '123TEXTQUERY321'" sn-disabled-explanation="OR button is not available when Keywords is selected"><span aria-hidden="true">or</span><span class="sr-only">Add OR Condition</span></button><button class="btn btn-default btn-and-condition add-conditions-row sn-filter-tooltip" tabindex="0" type="button" data-placement="bottom" title="Add AND condition" ng-click="addComparisonRow($parent.$parent.$index, $parent.$index, $index, 'and')" ng-disabled="!$last &amp;&amp; ruleSet.compound_type === 'or'"><span aria-hidden="true">and</span><span class="sr-only">Add AND condition</span></button></span></div>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_field_list.xml">
            <ul ng-class="{'glow': selected}" role="listbox" aria-label="Filter field list"><li class="loading" ng-if="isLoading"><span class="icon icon-loading"></span><br></br>Loading...</li><li class="no-results" ng-if="!fieldsArray.length &amp;&amp; !isLoading"><a href="javascript:void(0)">No Results</a></li><li class="sr-only" ng-if="!isLoading" role="status" aria-live="polite" aria-relevant="all"><span>{{ fieldsArray.length }} field options showing</span></li><li ng-repeat="field in fieldsArray" role="presentation" ng-class="{'selected': field.selected, 'reference-item': field.reference}"><a tabindex="-1" role="option" ng-if="field.reference &amp;&amp; dotWalking" ng-click="selectField(field)" ng-keypress="keyAction($event, field)" aria-haspopup="true" aria-selected="{{field.selected}}" aria-label="{{field.field_label}}. Dot walk field, press Right Arrow to expand options" title="{{field.field_label}}" data-tooltip-overflow-only-text="true" data-omit-aria-describedby="true" data-column-name="{{field.field}}">{{field.field_label}}</a><a tabindex="-1" role="option" ng-if="!field.reference || !dotWalking" ng-click="selectField(field)" ng-keypress="keyAction($event, field)" aria-selected="{{field.selected}}" title="{{field.field_label}}" data-tooltip-overflow-only-text="true" data-omit-aria-describedby="true" data-column-name="{{field.field}}">{{field.field_label}}</a><button ng-if="(field.reference &amp;&amp; dotWalking)" type="button" tabindex="-1" class="pull-right btn btn-icon add-dot-walk-list" ng-click="addReferenceList(field)"><span class="default-icon icon" ng-class="{'icon-chevron-right-circle-solid': field.selected, 'icon-chevron-right-circle': !field.selected}"></span><span class="selected-icon icon icon-chevron-right-circle-solid"></span><span class="sr-only">Dot Walk to  {{field.reference}}</span></button></li></ul>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_field_list_button.xml">
            <button tabindex="0" ng-click="togglePopover($event)" ng-keydown="popoverConfig.onArrowKey($event, togglePopover)" class="btn btn-default sn-popover-complex btn-select" sn-filter-dot-walk-positioner="" aria-haspopup="true" aria-expanded="{{popOverDisplaying}}" aria-label="Click to view field options" type="button"><span class="sr-only">Field name</span><sn-glyph aria-hidden="true" char="triangle-bottom"></sn-glyph>{{currentField}}<span class="sr-only" ng-if="compoundMessage">, {{compoundMessage}}</span></button>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_field_list_popover.xml">
            <div class="filter-fields-list" role="combobox" sn-filter-dot-walk-keydown-listener=""><div class="filter-fields-search-container"><div class="input-group-transparent"><span class="input-group-addon-transparent icon-search"></span><label for="filter-fields-search" class="sr-only">Search filter field list</label><input id="filter-fields-search" class="form-control form-control-search" aria-owns="filter-field-container-{{::uid}}" aria-autocomplete="list" aria-activedescendant="" ng-model="searchTerm" sn-focus="true" type="search" aria-label="Type to search filter field list" name="filter-fields-search"></input></div><div class="filter-breadcrumbs" ng-if="(display_fields.length &gt;= 2)"><span ng-repeat="displayField in display_fields track by $index"><a ng-click="scrollToReferenceList($index)">{{displayField}}</a><span class="icon icon-arrow-right" ng-if="!$last" ng-click="removeFieldList($index + 1)"></span></span></div></div><div class="filter-field-sets-container" id="filter-field-container-{{::uid}}"><sn-filter-field-list ng-repeat="fieldsList in comparison.fieldsListsPromises" index="$index"></sn-filter-field-list></div></div>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_field_lists_parent.xml">
            <span class="filter-field-lists-parent"><sn-complex-popover class="field-list-button" button-template="sn_filter_field_list_button.xml" template="sn_filter_field_list_popover.xml" complex-popover-type="sn_filter_field_lists"></sn-complex-popover></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_load_filter_widget.xml">
            <span><now-message key="{0} has been deleted" value="{0} has been deleted"></now-message><now-message key="{0} could not be deleted due to an error: {1}" value="{0} could not be deleted due to an error: {1}"></now-message><sn-modal name="loadFilter" move-backdrop="true" aria-labelledby="{{uid}}-load-filter-title"><div class="modal-dialog modal-md ng-cloak"><div class="modal-content"><header class="modal-header"><button data-dismiss="modal" title="Close" class="btn btn-icon close icon-cross sn-filter-tooltip"><span class="sr-only">Close</span></button><h2 class="modal-title h4" id="{{uid}}-load-filter-title">Load Filter</h2><a class="manage-filters-button btn btn-sm btn-default" ng-href="{{manageFiltersLink}}">Manage Filters</a></header><div class="modal-body load-filter-modal" ng-class="{'no-results': (savedFilters.length === 0)}"><div class="input-group-transparent"><span class="input-group-addon-transparent icon-filter"></span><label for="filter-search">Search filters</label><input id="filter-search" sn-focus="true" class="form-control form-control-search" type="search" ng-model="filterSearchTerm" ng-change="searchFilters(filterSearchTerm)" ng-keypress="preserveSearchedFilters($event)"></input></div><ul class="load-filter-list" aria-label="filters"><li class="no-results" ng-if="(savedFilters.length === 0)">No Results</li><li class="loading" ng-if="isLoading"><span class="icon icon-loading"></span><br></br>Loading...</li><li ng-repeat="filter in savedFilters"><a class="apply-filter" aria-label="Apply filter: {{::filter.title}}" title="Apply filter" ng-click="loadAndRunFilter(filter)" href="javascript:void(0)" data-dismiss="modal">{{::filter.title}}</a><button class="btn btn-icon icon-delete delete-filter sn-filter-tooltip" aria-label="Delete filter: {{::filter.title}}" title="Delete filter" ng-if="filter.canDelete" ng-click="deleteFilter(filter, $index)"></button></li></ul></div></div></div></sn-modal><button tabindex="0" id="{{uid}}-load-filter-button" sn-modal-show="loadFilter" title="Apply a saved filter" class="btn btn-default load-filter-btn sn-filter-tooltip" type="button">Load Filter</button></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_query_heuristics_alerts.xml">
            <div class="sn-filter-invalid-comparisons"><div class="notification notification-error sn-filter-invalid-comparison-warning" ng-if="queryHeuristicsErrors.length" ng-repeat="queryHeuristicsError in queryHeuristicsErrors track by $index" ng-show="queryHeuristicsError.show" ng-mouseenter="toggleComparisonsHighlight(queryHeuristicsError, true)" ng-mouseleave="toggleComparisonsHighlight(queryHeuristicsError, false)"><span class="inner-invalid-comparison-wrapper" ng-repeat="(comparisonKey, comparisonIndexes) in queryHeuristicsError.comparisonKeys" ng-init="currentComparison = comparisons[comparisonKey]" ng-if="$first">Review these 
"<span>{{comparisons[comparisonKey].getFieldLabel()}} {{comparisons[comparisonKey].getOperatorLabel()}}</span>" conditions</span><button type="button" class="close-heuristics-alert btn btn-icon close icon-cross pull-right" ng-click="toggleAlert(queryHeuristicsError)"><span class="sr-only">Close</span></button><button type="button" ng-if="queryHeuristicsError.hasFix" data-dismiss="alert" class="btn btn-sm btn-primary invalid-comparison-button pull-right" ng-click="implementRecommendation(queryHeuristicsError)">Fix it</button></div></div>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_save_filter_widget.xml">
            <span global-role="true" group-role="true"><now-message key="Only Me" value="Only Me"></now-message><now-message key="Everyone" value="Everyone"></now-message><now-message key="Group" value="Group"></now-message><now-message key="Please make sure your saved filter has a name and a type" value="Please make sure your saved filter has a name and a type"></now-message><now-message key="'{0}' has been saved" value=""></now-message><now-message key="Your filter could not be saved due to an error: {0}" value="Your filter could not be saved due to an error: {0}"></now-message><sn-modal name="saveFilter" aria-labelledby="{{uid}}-save-filter-title" move-backdrop="true"><div class="modal-dialog modal-md ng-cloak"><div class="modal-content"><header class="modal-header"><button data-dismiss="modal" title="Close" class="btn btn-icon close icon-cross sn-filter-tooltip"><span class="sr-only">Close</span></button><h2 class="modal-title h4" id="{{uid}}-save-filter-title">Save Filter</h2></header><div class="modal-body save-filter-modal"><form class="form-horizontal" name="newFilterForm" ng-submit="saveFilter(newFilterForm)" novalidate=""><div class="form-group"><label class="control-label col-sm-3" for="new-filter-title">Filter name (required)</label><div class="col-sm-9"><span class="sr-only">New filter title</span><input id="new-filter-title" class="form-control" ng-model="newFilter.title" name="title" required="" autocomplete="false"></input><p ng-show="newFilter.title.$invalid &amp;&amp; !newFilter.title.$pristine" class="help-block">Filter name is required.</p></div></div><div class="form-group"><label class="control-label col-sm-3">Query</label><div class="col-sm-9"><span class="sr-only">Query</span><p class="form-control-static">{{saveBreadcrumbs}}</p></div></div><fieldset class="row"><legend class="control-label col-sm-3">Visibility</legend><div class="col-sm-9"><div class="radio"><div ng-repeat="saveItem in filterSaveTypes" class="form-group" ng-show="saveItem.show !== false"><span class="input-group-radio"><span class="sr-only">New filter type</span><input id="{{ saveItem.name }}-type" class="radio" type="radio" name="save-type" value="{{ saveItem.value }}" ng-model="newFilter.saveType"></input><label for="{{ saveItem.name }}-type" class="radio-label" ng-bind="saveItem.label"></label></span></div></div></div></fieldset><div class="form-group" ng-if="newFilter.saveType == 'GROUP'"><label class="control-label col-sm-3">Group</label><div class="col-sm-9"><sn-reference-picker field="groupField" ed="{reference: groupField.targetTable, qualifier: 'sys_idINjavascript:gs.getUser().getMyGroups()'}"></sn-reference-picker></div></div><button id="submit-new-saved-filter-button" type="submit" class="btn btn-primary pull-right" ng-disabled="newFilterForm.$invalid">Submit</button></form></div></div></div></sn-modal><button tabindex="0" id="{{uid}}-save-filter-button" sn-modal-show="saveFilter" title="Save this filter" class="btn btn-default save-filter-btn sn-filter-tooltip" type="button">Save Filter</button></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_sort_filter_widget.xml">
            <span><now-message key="A to Z" value="a to z"></now-message><now-message key="Z to A" value="z to a"></now-message><now-message key="Sort Field Priority {0}" value="Sort Field Priority {0}"></now-message><sn-modal name="sortFilter" move-backdrop="true" aria-labelledby="{{uid}}-sort-filter-title"><div class="modal-dialog modal-md ng-cloak"><div class="modal-content"><header class="modal-header"><button data-dismiss="modal" class="btn btn-icon close icon-cross sn-filter-tooltip" aria-label="Close dialog" title="Close"></button><h2 class="modal-title h4" id="{{uid}}-sort-filter-title">Add Sort</h2></header><div class="modal-body sort-filter-modal"><h4 id="sort-filter-modal-sub-heading" class="sort-filter-modal-sub-heading" aria-level="3">Sorting Order</h4><label for="sort-filter-modal-sub-heading" class="sr-only">List results will be sorted from the first to last sort order defined below</label><form class="sort-set" ng-submit="setSort()"><div class="sort-row" ng-repeat="sortItem in sortItems"><span class="count-col">{{$index + 1}}</span><span class="field-col form-group"><label for="{{table}}_sort_field_{{$index}}" class="sr-only">Sort Field Priority {{$index + 1}}</label><select ng-if="!enableDotWalkFieldPicker" id="{{table}}_sort_field_{{$index}}" ng-model="sortItem.column_name" ng-change="onColumnChange($index, sortFields)" ng-options="sortField.field as sortField.field_label for sortField in sortFields" class="form-control"><option value="" default="default">-- None --</option></select><sn-dot-walk-component id="{{table}}_sort_field_{{$index}}_dot_walk" table="table" path="sortItem.column_name" path-label="sortItem.field_label" component-label="Sort Field" field-filter="sortFieldFilter(item, config)" class="rd-dot-walking" ng-if="enableDotWalkFieldPicker" has-none="true"></sn-dot-walk-component></span><span class="operator-col form-group sn-dotwalk-sort-type-select"><label for="{{table}}_sort_type_{{$index}}" class="sr-only">Sort Direction</label><select id="{{table}}_sort_type_{{$index}}" ng-model="sortItem.ascending" ng-options="sortDirection.value as sortDirection.label for sortDirection in sortDirections" class="form-control"><option value="" default="default">-- None --</option></select></span><span class="btn-col"><button id="{{table}}_remove_sort_{{$index}}" title="Remove Sort Order" class="btn btn-icon remove-sort-row icon-not-started-circle sn-filter-tooltip" ng-click="removeSortItem($event, $index)" type="button" aria-label="Remove Sort Order {{sortItem.field_label}} {{sortItem.ascending ? 'a to z' : 'z to a'}}"></button><button id="{{table}}_add_sort_{{$index}}" title="Add Sort Order" class="btn btn-icon add-sort-row icon-add-circle sn-filter-tooltip" ng-click="addSortItem($event)" type="button" aria-label="Add Sort Order"></button></span></div></form></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button id="{{table}}-save-sort-button" type="button" class="btn btn-primary" data-dismiss="modal" ng-click="setSort()" aria-label="sort to query condition">Save</button></div></div></div></sn-modal><button tabindex="0" id="{{uid}}-sort-filter-button" sn-modal-show="sortFilter" class="btn btn-default sort-filter-btn sn-filter-tooltip" title="Sort this filter" type="button">Add Sort</button></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_related_list_comparison.xml">
            <span><sn-complex-popover button-template="sn_related_list_comparison_button.xml" template="sn_related_list_comparison_popover.xml"></sn-complex-popover><span class="related-comparison-display-span">selected table records are related to a record on {{tableLabel}}</span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_compound.xml">
            <div class="set outer-condition-container"><div class="or-section" ng-if="!$first" aria-hidden="true"><div class="or-divider"><span>or</span></div></div><span class="sn-filter-compound-title h6" aria-hidden="true">All of these conditions must be met</span><span class="sn-filter-compound-title h6 sr-only" ng-if="predicate.subpredicates.length &gt; 1">Condition set {{$index + 1}} of {{predicate.subpredicates.length}} - all conditions of at least one set must be met</span><span class="sn-filter-compound-title h6 sr-only" ng-if="predicate.subpredicates.length == 1">All of these conditions must be met</span><fieldset><legend class="sr-only sn-filter-compound-title h6" ng-if="predicate.subpredicates.length == 1">All of these conditions must be met</legend><legend class="sr-only sn-filter-compound-title h6" ng-if="predicate.subpredicates.length &gt; 1">Condition set {{$index + 1}} of {{predicate.subpredicates.length}}</legend><div ng-repeat="ruleSet in compound.subpredicates" class="rule-set-type-container" data-type="{{ruleSet.compound_type}}"><div class="ruleset-section" ng-if="!$first"><div><p class="ruleset-divider">and</p></div></div><div ng-show="ruleSet.subpredicates.length &gt;= 2" class="ruleset-label" ng-class="{'or-section': ruleSet.compound_type === 'or', 'and-section': ruleSet.compound_type === 'and', 'first' : $first}" set-ruleset-height="" predicate-count="ruleSet.subpredicates.length"><p class="" ng-if="ruleSet.compound_type === 'or'">or</p><p class="" ng-if="ruleSet.compound_type === 'and'">and</p></div><sn-filter-comparison ng-repeat="comparison in ruleSet.subpredicates"></sn-filter-comparison></div></fieldset></div>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_widget_between_element.xml">
            <span><sn-filter-widget-element class="editor-col" field="field1" popover-config="popoverConfig"></sn-filter-widget-element><sn-filter-widget-element class="editor-col" field="field2" popover-config="popoverConfig"></sn-filter-widget-element></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_widget_element.xml">
            <ng-switch on="field.advancedEditor"><sn-string-element ng-switch-when="string"></sn-string-element><sn-boolean-element ng-switch-when="boolean"></sn-boolean-element><sn-choice-element ng-switch-when="choice"></sn-choice-element><sn-choice-element ng-switch-when="choice_dynamic"></sn-choice-element><sn-choice-element ng-switch-when="choice_field_names"></sn-choice-element><sn-choice-multiple-element ng-switch-when="choice_multiple"></sn-choice-multiple-element><sn-currency-element ng-switch-when="currency"></sn-currency-element><sn-currency2-element ng-switch-when="currency2"></sn-currency2-element><sn-currency2-between-element ng-switch-when="currency2_between_field"></sn-currency2-between-element><sn-date-time-element ng-switch-when="glide_date_time"></sn-date-time-element><sn-date-time-element ng-switch-when="glide_date"></sn-date-time-element><sn-date-choice-element ng-switch-when="glide_date_choice"></sn-date-choice-element><sn-date-relative-element ng-switch-when="relative_field"></sn-date-relative-element><sn-date-trend-element ng-switch-when="trend_field"></sn-date-trend-element><sn-date-equivalent-element ng-switch-when="glide_date_equivalent"></sn-date-equivalent-element><sn-date-comparative-element ng-switch-when="glide_date_comparative"></sn-date-comparative-element><sn-time-element ng-switch-when="glide_time"></sn-time-element><sn-email-element ng-switch-when="email"></sn-email-element><sn-reference-picker sn-on-change="field.onChange()" minimum-input-length="1" field="field" ed="{reference:field.targetTable, searchField: field.reference_display_field}" ng-switch-when="glide_list"></sn-reference-picker><sn-reference-picker sn-on-change="field.onChange()" minimum-input-length="1" field="field" ed="{reference:field.targetTable, searchField: field.reference_display_field, referenceKey: field.referenceKey}" ng-switch-when="reference"></sn-reference-picker><sn-reference-picker sn-on-change="field.onChange()" minimum-input-length="1" field="field" ed="{reference:'label', searchField: 'name'}" ng-switch-when="tags"></sn-reference-picker><sn-duration-element ng-switch-when="glide_duration"></sn-duration-element><sn-integer-element ng-switch-when="integer"></sn-integer-element><sn-decimal-element ng-switch-when="decimal"></sn-decimal-element><sn-ip-address-element ng-switch-when="ip_address"></sn-ip-address-element><sn-filter-textarea-element ng-switch-when="textarea"></sn-filter-textarea-element><sn-string-element ng-switch-default=""></sn-string-element></ng-switch>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_filter_textarea_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><textarea ng-model="field.value" ng-change="field.onChange()" ng-blur="field.onBlur()" ng-model-options="{ debounce: field.debounceDuration }" class="form-control" sn-filter-textarea-formatter="" sn-resize-height="" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly" maxlength="{{field.maxLength}}"></textarea></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_string_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><input ng-model="field.value" ng-change="field.onChange()" ng-blur="field.onBlur()" ng-model-options="{ debounce: field.debounceDuration }" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly" maxlength="{{field.maxLength}}"></input></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_boolean_element.xml">
            <span class="ng-form-element" ng-switch="::field.inline"><now-message key="True" value="true"></now-message><now-message key="False" value="false"></now-message><span ng-switch-when="true"><select id="{{field.ref}}" class="form-control" sn-boolean-element-formatter="" sn-focus="field.hasFocus" ng-model="field.value" ng-change="field.onChange()" ng-blur="field.onBlur()" ng-options="choice.value as choice.label for choice in booleanChoices" ng-readonly="field.readonly" ng-disabled="field.readonly"><option value="true">True</option><option value="false">False</option></select></span><span ng-switch-when="false"><span sn-form-group=""><span class="input-group-checkbox"><input id="radio_{{::field.ref}}" class="checkbox" type="checkbox" name="radio_{{::field.ref}}" ng-model="field.value" ng-change="field.onChange()" ng-blur="field.onBlur()" ng-model-options="{ debounce: 1000 }" ng-readonly="field.readonly" ng-disabled="field.readonly"></input><label for="radio_{{::field.ref}}" class="checkbox-label"></label></span></span></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_choice_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><select ng-options="choice.value as choice.label for choice in field.choices" ng-model="field.value" ng-change="field.onChange()" ng-blur="field.onBlur()" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly"></select></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_choice_multiple_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><select ng-options="choice.value as choice.label for choice in field.choices" multiple="true" ng-model="field.value" ng-blur="field.onBlur()" ng-change="field.onChange()" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly"></select></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_currency_element.xml">
            <span class="ng-form-element"><span sn-form-group="" class="input-group"><input ng-model="currency.value" ng-change="valueHandler()" ng-blur="field.onBlur()" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly"></input><span class="input-group-addon input-group-select input-group-select_right"><select class="form-control" ng-model="currency.type" ng-change="valueHandler()" ng-options="currency as currency.display for currency in currencies"></select><i class="select-indicator icon-vcr-down"></i></span></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_time_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><datetimepicker ng-if="::!field.inline" data-ng-model="dateAsPicker" data-datetimepicker-config="config" data-on-set-time="setDateTime(newDate, oldDate)"></datetimepicker><input id="glide_date_time_{{field.name}}_{{field.sysId}}" type="text" class="form-control" ng-disabled="field.readonly" ng-if="::!field.inline" ng-model-options="{ updateOn: 'default blur', debounce: { 'default': 250, 'blur': 0 } }" ng-change="dateTimeOnChangeHandler()" ng-blur="field.onBlur()" ng-model="field.displayValue" ng-readonly="field.readonly"></input><div class="dropdown" ng-if="::field.inline"><a tabindex="-1" id="glide_date_time_{{field.ref}}_dropdown" role="button" data-toggle="dropdown" data-target="#" href="#"><div class="input-group"><input id="glide_date_time_{{field.name}}_{{field.sysId}}" type="text" class="form-control" ng-model="field.displayValue" ng-model-options="{ updateOn: 'default blur', debounce: { 'default': 250, 'blur': 0 } }" ng-change="dateTimeOnChangeHandler()" ng-blur="field.onBlur()" ng-disabled="field.readonly" ng-readonly="field.readonly" maxlength="{{field.maxLength}}" sn-focus="field.hasFocus" format="{{field.dateFormat}}"></input><span class="input-group-btn"><button class="btn btn-default" ng-disabled="field.readonly" ng-readonly="field.readonly"><i class="glyphicon glyphicon-calendar"></i><span class="sr-only">Select date and time</span></button></span></div></a><ul class="dropdown-menu" role="menu" aria-labelledby="dLabel" ng-show="!field.readonly"><datetimepicker ng-model="dateAsPicker" data-datetimepicker-config="config" data-on-set-time="setDateTime(newDate, oldDate)"></datetimepicker></ul></div></span><input id="{{field.ref}}" name="{{field.ref}}" type="hidden" ng-model="field.value"></input></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_choice_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><sn-complex-popover button-template="sn_date_choice_button.xml" template="sn_date_choice_popover.xml"></sn-complex-popover></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_relative_element.xml">
            <span class="ng-form-element"><select ng-options="relativeOperator[1] as relativeOperator[0] for relativeOperator in relativeOperators" ng-model="relativeOperatorModel" class="inline-filter-field form-control" ng-change="operatorHandler(relativeOperatorModel)" ng-readonly="field.readonly" ng-disabled="field.readonly"></select><sn-complex-popover class="inline-filter-field" button-template="sn_date_duration_button.xml" template="sn_date_duration_popover.xml"></sn-complex-popover></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_trend_element.xml">
            <span class="ng-form-element"><select ng-options="trendOperator[1] as trendOperator[0] for trendOperator in trendOperators" ng-change="buildOperatorValue(trendOperatorModel)" class="form-control inline-filter-field" ng-model="trendOperatorModel" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly"></select><sn-complex-popover class="inline-filter-field" button-template="sn_date_trend_date_button.xml" template="sn_date_trend_date_popover.xml"></sn-complex-popover></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_choice_button.xml">
            <button tabindex="0" ng-click="togglePopover($event)" ng-keydown="onDownKey($event)" class="btn btn-default sn-popover-complex btn-select" aria-label="{{field.ariaLabel}} {{data.displayValue}}. Date Chooser" type="button">{{data.displayValue}}<sn-glyph char="triangle-bottom"></sn-glyph></button>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_duration_button.xml">
            <button tabindex="0" ng-click="togglePopover($event)" ng-keydown="onDownKey($event)" class="btn btn-default sn-popover-complex btn-select" type="button">{{displayValue}}<sn-glyph char="triangle-bottom"></sn-glyph></button>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_trend_date_button.xml">
            <button tabindex="0" ng-click="togglePopover($event)" ng-keydown="onDownKey($event)" class="btn btn-default sn-popover-complex btn-select" type="button">{{displayValue}}<sn-glyph char="triangle-bottom"></sn-glyph></button>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_equivalent_element.xml">
            <span class="ng-form-element"><select ng-options="duration[1] as duration[0] for duration in durations" ng-model="durationModel" class="inline-filter-field form-control" ng-change="durationHandler(durationModel)" ng-readonly="field.readonly" ng-disabled="field.readonly"></select><select ng-options="item.field as item.field_label for item in fields" ng-model="fieldModel" class="inline-filter-field form-control" ng-change="fieldHandler(fieldModel)" ng-readonly="field.readonly" ng-disabled="field.readonly"></select></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_date_comparative_element.xml">
            <span class="ng-form-element"><sn-complex-popover class="inline-filter-field" button-template="sn_date_duration_button.xml" template="sn_date_duration_popover.xml"></sn-complex-popover><select ng-options="item.field as item.field_label for item in fields" class="form-control inline-filter-field" ng-model="fieldModel" ng-change="fieldHandler(fieldModel)" ng-readonly="field.readonly" ng-disabled="field.readonly"></select></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_time_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><div class="duration-input-group-container"><div class="duration-input-group input-group"><input type="text" class="form-control" ng-value="field.displayHour" ng-readonly="field.readonly" ng-disabled="field.readonly" maxlength="2" sn-focus="field.hasFocus" ng-blur="field.onBlur()" id="{{field.ref}}_hour"></input><span class="input-group-addon"><label>h</label></span></div><div class="duration-input-group input-group"><input type="text" class="form-control" ng-value="field.displayMin" ng-readonly="field.readonly" ng-disabled="field.readonly" maxlength="2" ng-blur="field.onBlur()" id="{{field.ref}}_min"></input><span class="input-group-addon"><label>m</label></span></div><div class="duration-input-group input-group"><input type="text" class="form-control" ng-value="field.displaySec" ng-readonly="field.readonly" ng-disabled="field.readonly" maxlength="2" ng-blur="field.onBlur()" id="{{field.ref}}_sec"></input><span class="input-group-addon"><label>s</label></span></div></div><input ng-model="field.displayValue" type="hidden" sn-duration-formatter=""></input></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_email_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><input ng-model="field.value" ng-change="field.onChange()" ng-blur="field.onBlur()" ng-model-options="{ debounce: field.debounceDuration }" type="email" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly" maxlength="{{field.maxLength}}"></input></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_duration_element.xml">
            <span class="ng-form-element"><div class="duration-input-group-container" ng-show="showDays &amp;&amp; field.type != 'timer'"><div class="duration-input-group input-group"><input type="text" class="form-control" ng-model="days" ng-readonly="field.readonly" aria-label="Days" ng-disabled="field.readonly" ng-blur="field.onBlur()" sn-focus="field.hasFocus &amp;&amp; showDays"></input><span class="input-group-addon"><label>Days</label></span></div></div><div class="duration-input-group-container"><div class="duration-input-group input-group" ng-show="showHours"><input type="text" class="form-control" ng-model="hours" aria-label="Hours" ng-readonly="field.readonly" ng-disabled="field.readonly" ng-blur="field.onBlur()" sn-focus="field.hasFocus &amp;&amp; field.maxUnit == 'hours'"></input><span class="input-group-addon"><label>h</label></span></div><div class="duration-input-group input-group" ng-show="showMinutes"><input type="text" class="form-control" ng-model="minutes" aria-label="Minutes" ng-readonly="field.readonly" ng-disabled="field.readonly" ng-blur="field.onBlur()" sn-focus="field.hasFocus &amp;&amp; field.maxUnit == 'minutes'"></input><span class="input-group-addon"><label>m</label></span></div><div class="duration-input-group input-group"><input type="text" class="form-control" ng-model="seconds" aria-label="Seconds" ng-readonly="field.readonly" ng-disabled="field.readonly" ng-blur="field.onBlur()" sn-focus="field.hasFocus &amp;&amp; field.maxUnit == 'seconds'"></input><span class="input-group-addon"><label>s</label></span></div></div><input ng-model="field.value" ng-change="field.onChange()" ng-model-options="{ debounce: field.debounceDuration }" type="hidden" sn-duration-formatter=""></input></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_integer_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><input ng-model="field.value" ng-blur="field.onBlur()" ng-change="field.onChange()" ng-model-options="{ debounce: field.debounceDuration }" type="number" sn-string-to-number="" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly"></input></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_decimal_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><input ng-model="field.value" ng-change="field.onChange()" ng-blur="field.onBlur()" ng-model-options="{ debounce: field.debounceDuration }" type="number" step="0.001" sn-string-to-number="" sn-focus="field.hasFocus" ng-readonly="field.readonly" ng-disabled="field.readonly"></input></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_ip_address_element.xml">
            <span class="ng-form-element"><span sn-form-group=""><input ng-model="field.value" ng-change="field.onChange()" ng-blur="field.onBlur()" ng-model-options="{ debounce: field.debounceDuration }" sn-focus="field.hasFocus" ng-pattern="/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/" ng-readonly="field.readonly" ng-disabled="field.readonly" maxlength="{{field.maxLength}}"></input></span></span>
        </script>
        <script type="text/ng-template" id="angular.do?sysparm_type=get_partial&amp;name=sn_form_group.xml">
            <div class="form-group" ng-class="{'is-required' : field.mandatory}"><label ng-if="label" for="{{for}}" class="control-label" ng-class="{'col-sm-3' : field.inline, 'col-sm-12' : !field.inline}"><span ng-repeat="dec in field.decorations" class="{{ dec.icon }}" title="{{ dec.text }}"></span><span ng-show="field.mandatory" class="required-marker" title="Mandatory"></span>{{label}}</label><span class="form-field" ng-transclude="" ng-class="{ 'col-sm-9': label &amp;&amp; field.inline, 'col-sm-12' : !field.inline}"></span></div>
        </script>
        <form-filter-widget ref="sys_script.filter_condition" dependent-field="collection" dependent-table="null" restricted-fields="" extended-operators="VALCHANGES;CHANGESFROM;CHANGESTO" allow-order="false" allow-related-list-query="true" show-condition-count="false" usage-context="element_conditions" subject-criteria="false" security-attributes="false"></form-filter-widget>
        </div>
        `;
    }
    */
    const titleCaption = document.getElementsByClassName('navbar-title-caption');
    if(titleCaption.length){
        titleCaption[0].textContent = tableTitle;
    }
    const titleDisplayValue = document.getElementsByClassName('navbar-title-display-value');
    if(titleDisplayValue.length){
        titleDisplayValue[0].textContent = title;
    }

    const table = document.getElementById('dynamicTable');
    const firstHeaders = document.getElementById('tableLabels');
    const headers = firstHeaders.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.addEventListener('click', () => {
            sortTableByColumn(table, index, sortDirection);
            updateSortIndicators(headers, header, sortDirection);
            sortDirection = !sortDirection;
        });
    });
    const searchHeaders = document.getElementById('searchHeaders');
    const searchInputs = searchHeaders.querySelectorAll('input');
    searchInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            columnFilters[index] = input.value;
            filterTable();
        });
    });
    /*const showInternalCheckbox = document.getElementById('toggleCheckbox');
    showInternalCheckbox.addEventListener('change', () => {
        
    });*/
    document.getElementById('saveButton').addEventListener('click', function() {
        saveForm('sysverb_update_and_stay');
    });
    document.getElementById('insertButton').addEventListener('click', function() {
        saveForm('sysverb_insert_and_stay');
    });
    document.getElementById('deleteButton').addEventListener('click', function() {
        let deleteUrl = url + '/api/now/table/' + tableName + '/' + sysId;
        const { promise, cancel } = superNowFetch(g_ck, deleteUrl, {method: 'DELETE'});
        promise.then(results => {
            if(!results.ok){
                alert('Error deleting record: ' + results.status + ' ' + results.statusText);
               // location.reload();
            }else{
                alert('Record deleted successfully');
                //location.reload();
                chrome.runtime.sendMessage({ action: "superNowCloseTab" });
            }
        });
    });
    document.getElementById('internalNamesOption').addEventListener('click', function() {
        showInternalNames = !showInternalNames;
        const intEl = document.getElementById('checkShowInternalNames');
        intEl.classList.toggle('checked', showInternalNames);
        //this.classList.toggle('checked', showInternalNames);
        const internalFields = document.querySelectorAll('.internal');
        internalFields.forEach(field => {
            field.style.display = showInternalNames ? 'table-cell' : 'none';
        });
        const displayLabels = document.querySelectorAll('.display-label');
        displayLabels.forEach(label => {
            label.style.display = !showInternalNames ? 'table-cell' : 'none';
        });
        const nameSearchColumnHeader = document.getElementById('nameSearchColumnHeader');
        nameSearchColumnHeader.style.display = showInternalNames ? 'table-cell' : 'none';
        const labelSearchColumnHeader = document.getElementById('labelSearchColumnHeader');
        labelSearchColumnHeader.style.display = !showInternalNames ? 'table-cell' : 'none';
        const nameColumnSearch = document.getElementById('nameColumnHeader');
        nameColumnSearch.style.display = showInternalNames ? 'table-cell' : 'none';
        const labelColumnSearch = document.getElementById('labelColumnHeader');
        labelColumnSearch.style.display = !showInternalNames ? 'table-cell' : 'none';
    });
    document.getElementById('hideBlanksOption').addEventListener('click', function() {
        hideBlankValues = !hideBlankValues;
        const blanksEl = document.getElementById('checkHideBlankValues');
        blanksEl.classList.toggle('checked', hideBlankValues);
        filterTable();
        //get all inputs with the class value-input, for any of those that have an empty value, hide their whole row
        /*const inputs = document.querySelectorAll('.value-input');
        inputs.forEach(input => {
            const row = input.closest('tr');
            if(!input.value){
                row.style.display = hideBlankValues ? 'none' : '';
            }
        });*/
    });
    document.getElementById('contextMenuButton').addEventListener('click', function() {
        const menu = document.getElementById('contextMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', function(event) {
        const contextMenu = document.getElementById('contextMenu');
        const contextMenuButton = document.getElementById('contextMenuButton');
        if (!contextMenu.contains(event.target) && !contextMenuButton.contains(event.target)) {
            contextMenu.style.display = 'none';
        }
    });

    let metaUrl = url + '/api/now/ui/meta/' + tableName;
    let dataUrl = url + '/api/now/table/' + tableName + '?sysparm_display_value=all&sysparm_limit=1&sysparm_query=sys_id%3D' + sysId;
    try {
        const [{ promise: metaPromise }, { promise: dataPromise }] = await Promise.all([superNowFetch(g_ck, metaUrl), superNowFetch(g_ck, dataUrl)]);
        const [metaData, recordData] = await Promise.all([metaPromise, dataPromise]);
        metaDataObject = metaData;
        setViewData(metaData, recordData.result[0]);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function saveForm(action) {
    // gather all input elements that have the class 'value-input'
    const inputs = document.querySelectorAll('.value-input');
    //const inputs = document.querySelectorAll('input');
    /*const data = {};
    // Build the JSON object
    inputs.forEach(input => {
        const key = input.name.replace('_value', '');
        data[key] = input.value;
    });*/
    let data = `sysparm_ck=${g_ck}&sys_target=${tableName}&sys_uniqueValue=${sysId}&sys_action=${action}`;
    inputs.forEach(input => {
        //remove the last 6 characters from input.name
        const key = input.name.slice(0, -6);
        //const key = input.name.replace('_value', '');
        //don't pass empty passwords back
        if((metaDataObject.result.columns[key].type != 'password' && metaDataObject.result.columns[key].type != 'password2') || input.value != '**********'){
            data += `&${tableName}.${key}=${encodeURIComponent(input.value)}`;
        }
    });
    
    const oldTbody = document.querySelector('tbody');
    const newTbody = document.createElement('tbody');
    oldTbody.parentNode.replaceChild(newTbody, oldTbody);
    //need to clear the search inputs
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.value = '';
    });
    var searchUrl = url + '/' + tableName + '.do'// + sysId + '?sysparm_display_value=all';
    const { promise, cancel } = superNowFetch(g_ck, searchUrl, {method: 'POST', body: data}, 'application/x-www-form-urlencoded');
    promise.then(results => {
        if(results.status && results.status != '200' && results.status != '201'){
            alert('Error updating record: ' + results.status + ' ' + results.statusText);
            location.reload();
        }else{
            if(results){
                const messageDiv = document.getElementById('output_messages');
                messageDiv.innerHTML = results;
                const messageIcon = messageDiv.querySelector('.notification-icon');
                if(!messageIcon){
                    messageDiv.querySelector('#close-messages-btn').style.display = 'none';
                }
                const closeButton = document.getElementById("close-messages-btn");
                closeButton.addEventListener('click', () => {
                    messageDiv.innerHTML = '';
                });
            }
            let dataUrl = url + '/api/now/table/' + tableName + '?sysparm_display_value=all&sysparm_limit=1&sysparm_query=sys_id%3D' + sysId;
            try {
                const { promise, cancel} = superNowFetch(g_ck, dataUrl);
                promise.then(results => {
                    setViewData(metaDataObject, results.result[0]);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
           //setViewData(metaDataObject, results.result);
        }
        //location.reload();
    });
}

function getCellValue(cell){
    let cellText = '';
    if (cell.querySelector('input')) {
        cellText = cell.querySelector('input').value;
    } else if (cell.querySelector('textarea')) {
        cellText = cell.querySelector('textarea').value;
    } else if (cell.querySelector('select')) {
        cellText = cell.querySelector('select').value;
    } else {
        cellText = cell.textContent || cell.innerText;
    }
    return cellText
}

function filterTable() {
    const table = document.getElementById('dynamicTable');
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        let rowMatches = true;
        if(hideBlankValues && !getCellValue(row.cells[2])){
            rowMatches = false;
        }else{
            Object.keys(columnFilters).forEach(columnIndex => {
                const filterValue = columnFilters[columnIndex];
                const cell = row.cells[columnIndex];
                if (cell) {
                    let cellText = getCellValue(cell);
                    if((cell.classList.contains('value-input') && !cellText && hideBlankValues) || (!cellText.toLowerCase().includes(filterValue.toLowerCase()))){
                        rowMatches = false;
                        return;
                    }
                }
            });
        }
        row.style.display = rowMatches ? '' : 'none';
    });

}

function superNowFetch(token, url, post, contentType) {
    const controller = new AbortController();
    const signal = controller.signal;
    let accept = 'application/json';
    if(!contentType) contentType = 'application/json';
    if(contentType === 'application/x-www-form-urlencoded') accept = 'text/html;charset=UTF-8';
    const fetchPromise = new Promise(async (resolve, reject) => {
        const headers = {
            'Cache-Control': 'no-cache',
            'Accept': accept,
            'Content-Type': contentType,
            'X-UserToken': token || undefined
        };
        try {
            const response = await fetch(url, {
                method: post ? post?.method : 'GET',
                headers,
                body: post && post.method != 'DELETE' ? (contentType == 'application/x-www-form-urlencoded' ? post.body : JSON.stringify(post?.body)) : null,
                signal
            });
            let data;
            if(contentType === 'application/x-www-form-urlencoded'){               
                if (response.ok) {
                    const htmlText = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    if(post && post.body.indexOf('sysverb_insert_and_stay') > -1 && response.url){
                        sysId = response.url.split('sys_id=')[1].split('&')[0];
                        let displayTitle = doc.getElementsByClassName('navbar-title-display-value');
                        let title = displayTitle[0]?.firstChild?.textContent ?? '';
                        const titleDisplayValue = document.getElementsByClassName('navbar-title-display-value');
                        if(titleDisplayValue.length){
                            titleDisplayValue[0].textContent = title;
                        }
                    }
                    const outputMessagesDiv = doc.getElementById('output_messages');
                    //remove onclick attribute from close button
                    if(outputMessagesDiv){
                        const closeButton = outputMessagesDiv.querySelector('#close-messages-btn');
                        if(closeButton){
                            closeButton.removeAttribute('onclick');
                        }
                    }
                    data = outputMessagesDiv ? outputMessagesDiv.innerHTML : null;
                } else {
                    data = response;
                } 
               // data = response.ok ? await response.text() : response;
            }else if(post && post.method == 'DELETE'){
                data = response;
            }else{
                data = response.ok ? await response.json() : response;
                data.resultcount = Number(response.headers.get("X-Total-Count"));
            }
            resolve(data);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                reject(error);
            }
        }
    });

    return {
        promise: fetchPromise,
        cancel: () => controller.abort()
    };
}

/*function createInput(field, name) {
    let input;
    switch (field.type) {
        case 'reference':
            input = document.createElement('select');
            var choicesArray = field.meta.choices;
            // Add options to the select element for each choice
            for (let i = 0; i < choicesArray.length; i++) {
                let choice = choicesArray[i];
                let option = document.createElement('option');
                option.value = choice.value;
                option.text = choice.label;
                input.appendChild(option);
            }
            break;
        case 'date':
            input = document.createElement('input');
            input.type = 'date';
            break;
        default:
            input = document.createElement('input');
            input.type = 'text';
    }
    input.name = name;
    return input;
}*/

function setViewData(metaData, recordData) {
    let dataView = [];
    let rows = recordData;
    for (let key in rows) {
        let propObj = {};
        propObj.name = key;
        propObj.meta = (metaData && metaData != "error") ? metaData.result.columns[key] : { "label": "Error" };
        propObj.display_value = rows[key].display_value; 
        if(propObj.meta.type == 'password' || propObj.meta.type == 'password2'){
            propObj.value = '**********';
        }else{
            propObj.value = rows[key].value;
        }
        dataView.push(propObj);
    }
    let apiResponse = dataView;
    //let showInteral = document.getElementById('toggleCheckbox').checked;
    const tbody = document.querySelector('tbody');
    for (let i = 0; i < apiResponse.length; i++){
        const field = apiResponse[i];
        const tr = document.createElement('tr');

        const labelTd = document.createElement('td');
        labelTd.classList.add('display-label'); 
        labelTd.textContent = field.meta.label;
        labelTd.style.display =  !showInternalNames ? 'table-cell' : 'none';
        tr.appendChild(labelTd);

        const nameTd = document.createElement('td');
        nameTd.classList.add('internal'); 
        nameTd.textContent = field.name;
        nameTd.style.display = showInternalNames ? 'table-cell' : 'none';
        tr.appendChild(nameTd);

        const valueTd = document.createElement('td');
        valueTd.classList.add('value-cell'); 
        const valueDiv = document.createElement('div'); // Create a div element
        valueDiv.style.position = 'relative'; // Optional: Add any necessary styling to the div

        const valueToLabelMap = {};
        let valueInput;
        if (!field.meta.multitext) {
            valueInput = document.createElement('input');
            valueInput.type = 'text';
            valueInput.addEventListener('input', () => adjustInputWidth(valueInput));        
        }else{
            valueInput = document.createElement('textarea');
            valueInput.spellcheck = false;
            valueInput.style.height = '100%';
        }
        valueInput.name = `${field.name}_value`;
        if(field.meta.type === 'glide_duration' || field.meta.type === 'timer'){
            if(field.value){
                const epochStart = new Date('1970-01-01T00:00:00Z');
                const inputDate = new Date(field.value + 'Z'); // Append 'Z' to treat input as UTC
            
                const diffInMs = inputDate - epochStart;
                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
            
                const timePart = field.value.split(' ')[1]; // Extract the time part from the input
            
                valueInput.value = `${diffInDays} ${timePart}`;
            }
        }else if(field.meta.base_type == 'datetime' || field.meta.type == 'integer_time' || field.meta.type == 'integer_date' || field.meta.type == 'schedule_date_time'){
            valueInput.value = field.display_value;
        }else{
            valueInput.value = field.value;
        }
        valueInput.classList.add('value-input'); 
        if (field.meta.type === 'reference') {
            valueInput.addEventListener('blur', lookupDisplayValue);
            valueInput.addEventListener('focus', () => {
                initialInputValue = valueInput.value;
            });
            
        }else if ((field.meta.type === 'choice' && field.meta.choices) || field.meta.type == 'boolean') {
            valueInput.addEventListener('input', () => {
                const inputValue = valueInput.value;
                const displayValueInput2 = valueInput.closest('tr').querySelector('.display-value-input');
                if (valueToLabelMap[inputValue]) {
                    displayValueInput2.value = inputValue;
                } else {
                    displayValueInput2.value = '';
                }
            });
        }else{
            valueInput.addEventListener('input', () => {
                const displayValueInput3 = valueInput.closest('tr').querySelector('.display-value-cell div');
                displayValueInput3.textContent = valueInput.value;
            });
        }

        valueDiv.appendChild(valueInput); // Append the input to the div
        valueTd.appendChild(valueDiv); // Append the div to the td
        tr.appendChild(valueTd);

        const displayValueTd = document.createElement('td');
        displayValueTd.classList.add('display-value-cell'); 
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('cell-content');

        if (field.meta.type === 'reference') {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = field.display_value;
            input.placeholder = 'Type to search...';
            input.classList.add('search-input'); 
            input.dataset.meta = JSON.stringify(field.meta); // Store meta as a data attribute
            input.addEventListener('input', debounce(handleTypeahead, 300));
            input.addEventListener('focus', () => {
                initialDisplayValue = input.value;
            });
            input.addEventListener('blur', () => {
                if(!selectedFromTypeahead){
                    if (input.value !== initialDisplayValue) {
                        const sysIdInput = input.closest('tr').querySelector('td input');
                        if (sysIdInput) {
                            sysIdInput.value = input.value;
                            // }
                        }
                    }
                    clearSuggestions(input);
                }
                selectedFromTypeahead = false;
            });
            contentDiv.appendChild(input);
        } else if ((field.meta.type === 'choice' && field.meta.choices) || field.meta.type == 'boolean') {
            const displayValueSelect = document.createElement('select');
            displayValueSelect.className = 'display-value-input';

            if(field.meta.type == 'choice' && field.meta.choices){
            // Create a mapping between display values and values
                field.meta.choices.forEach(choice => {
                    const option = document.createElement('option');
                    option.value = choice.value;
                    if(field.value === choice.value){
                        option.selected = true;
                    }
                    option.textContent = choice.label;
                    displayValueSelect.appendChild(option);
                    valueToLabelMap[choice.value] = choice.label;
                });
            }else{
                const option1 = document.createElement('option');
                option1.value = 'true';
                if(field.value === 'true'){
                    option1.selected = true;
                }
                option1.textContent = 'True';
                displayValueSelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = 'false';
                if(field.value === 'false'){
                    option2.selected = true;
                }
                option2.textContent = 'False';
                displayValueSelect.appendChild(option2);
            }

            contentDiv.appendChild(displayValueSelect);

            // Add event listener to the select element
            displayValueSelect.addEventListener('change', () => {
                valueInput.value = displayValueSelect.value;
            });

        } else {
            contentDiv.textContent = field.display_value;
        }

        displayValueTd.appendChild(contentDiv);
        tr.appendChild(displayValueTd);

        
        const typeTd = document.createElement('td');
        typeTd.textContent = field.meta.type;
        tr.appendChild(typeTd);

        tbody.appendChild(tr);
    }
   
    const table = document.getElementById('dynamicTable');
    sortTableByColumn(table, 0, sortDirection);
    const headers = table.querySelectorAll('th');
    updateSortIndicators(headers, headers[0], sortDirection);

    //select all inputs with the class 'value-input', don't get textarea elements
    const inputs = tbody.querySelectorAll('input.value-input');
    //const inputs = tbody.querySelectorAll('.value-input');
    inputs.forEach(input => {
        var width = getInputWidth(input);
        if (width > maxWidth) {
            maxWidth = width;
            longestInput = input.name.toString();
        }
    });
    
    const allInputs = tbody.querySelectorAll('.value-cell');
    // Then, set the width of all inputs to the maximum width
    allInputs.forEach(input => {
        input.style.width = `${maxWidth}px`;
        input.style['max-width'] = `${maxWidth}px`;
        input.style['min-width'] = `${maxWidth}px`;
    });
};

/*function getInputWidth(input) {
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'nowrap'; // Preserve whitespace
    tempSpan.style.font = window.getComputedStyle(input).font;
    let text = input.value || input.placeholder;
    if (!text) return 0;
    tempSpan.innerHTML = text.replace(/ /g, '&nbsp;'); // Replace spaces with non-breaking spaces
    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth + 12; // Add some padding
    document.body.removeChild(tempSpan);
    return width;
}*/

function getInputWidth(input) {
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'nowrap'; // Preserve whitespace
    tempSpan.style.font = window.getComputedStyle(input).font;
    let text = input.value || input.placeholder;
    if (!text) return 0;
    text = text.replace(/ /g, '\u00A0'); // Replace spaces with non-breaking spaces
    text = text.replace(/\t/g, '\u00A0\u00A0\u00A0\u00A0'); // Replace tabs with four non-breaking spaces
    tempSpan.textContent = text; // Use textContent to avoid HTML parsing
    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth + 12; // Add some padding
    document.body.removeChild(tempSpan);
    return width;
}

function adjustInputWidth(input) {
    var width = getInputWidth(input);
    if (width > maxWidth) {
        maxWidth = width;
        longestInput = input.name.toString();
        const table = document.getElementById('dynamicTable');
        const tbody = table.querySelector('tbody');
        const inputs2 = tbody.querySelectorAll('.value-cell');
        inputs2.forEach(input => {
            input.style.width = `${maxWidth}px`;
            input.style['max-width'] = `${maxWidth}px`;
            input.style['min-width'] = `${maxWidth}px`;
        });
    }
}

function lookupDisplayValue(event){
    const input = event.target;
    if (input.value !== initialInputValue) {
        const query = input.value;
        const displayValueInput = input.closest('tr').querySelector('.search-input');
        const meta = JSON.parse(displayValueInput.dataset.meta);
        if (query.length < 32) {     
            if (displayValueInput) {
                displayValueInput.value = '';
            }
            return;
        }
        displayValueInput.classList.add('loading');

        displayValueInput.disabled = true;
        var searchUrl = url+'/api/now/table/'+meta.reference+'/'+query;//+'&sysparm_fields='+meta.reference_attributes.display_field;
        
        const { promise, cancel } = superNowFetch(g_ck, searchUrl);
        promise.then(results => {
            if (displayValueInput && results && results.result && results.result[meta.reference_display_field]) {
                displayValueInput.value = results.result[meta.reference_display_field];
            }else{
                displayValueInput.value = '';
            }
            //remove disabled from displayValueInput.value 
            displayValueInput.disabled = false;
            displayValueInput.classList.remove('loading');
        });
    }
}

function debounce(func, wait) {
    let timeout;
    let ongoingCall = null;

    return function(...args) {
        if (ongoingCall) {
            ongoingCall.cancel();
            ongoingCall = null;
        }

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            ongoingCall = func.apply(this, args);
        }, wait);
    };
}

function handleTypeahead(event) {
    const input = event.target;
    const meta = JSON.parse(input.dataset.meta);
    const query = input.value;

    if (query.length < 2) {
        // Clear suggestions if query is too short
        clearSuggestions(input);
        return;
    }
    clearSuggestions(input);
    input.classList.add('loading');

    var queryCondition = meta.reference_display_field+'LIKE'+query;
    if(meta.reference_attributes.ref_ac_columns_search){
         for (var i = 0; i < meta.reference_attributes.ref_ac_columns.length; i++) {
             queryCondition += '^OR'+meta.reference_attributes.ref_ac_columns[i]+'LIKE'+query;
         }
    }   
    var searchUrl = url+'/api/now/table/'+meta.reference+'?sysparm_query='+queryCondition+'&sysparm_fields=sys_id,'+meta.reference_attributes.display_field+','+meta.reference_attributes.ref_ac_columns.toString()+'&sysparm_limit=10';
     
    const { promise, cancel } = superNowFetch(g_ck, searchUrl);
    promise.then(results => {
        results = results.result;
        const dropdown = createDropdown(input);
        results.forEach(result => {
            const option = document.createElement('div');
            option.className = 'typeahead-option';
            option.textContent = result[meta.reference_display_field];
            option.dataset.sysId = result.sys_id;
            option.addEventListener('mousedown', () => {
                selectedFromTypeahead = true;
                input.value = option.textContent;
                const sysIdInput = input.closest('tr').querySelector('td input');
                if (sysIdInput) {
                    sysIdInput.value = option.dataset.sysId;
                }
                clearSuggestions(input);
            });
            dropdown.appendChild(option);
        });
        input.classList.remove('loading');
    })
    .catch(error => {
        console.error('Error fetching typeahead suggestions:', error);
        input.classList.remove('loading');
    });
    return { cancel };
}

function clearSuggestions(input) {
    const dropdown = input.closest('tr').querySelector('.typeahead-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
}

function createDropdown(input) {
    let dropdown = input.closest('tr').querySelector('.typeahead-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'typeahead-dropdown';
        input.closest('td').appendChild(dropdown);
    }
    const inputRect = input.getBoundingClientRect();
    dropdown.style.width = `${inputRect.width}px`;
    dropdown.style.top = `${inputRect.bottom + window.scrollY}px`;
    dropdown.style.left = `${inputRect.left + window.scrollX}px`;
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '1000';
    return dropdown;
}

function addOptionsToInput(input, results) {
    const meta = JSON.parse(input.dataset.meta);
    results = results.result;

    // Clear any existing options
    let dropdown = input.closest('tr').querySelector('.typeahead-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'typeahead-dropdown';
        input.closest('td').appendChild(dropdown);
    }
    dropdown.innerHTML = '';

    // Add new options
    results.forEach(result => {
        const option = document.createElement('div');
        option.className = 'typeahead-option';
        option.textContent = result[meta.reference_display_field]; // Adjust based on your API response structure
        option.dataset.sysId = result.sys_id;
        option.addEventListener('click', () => {
            input.value = option.textContent;
            const sysIdInput = input.closest('tr').querySelector('td input');
            if (sysIdInput) {
                sysIdInput.value = option.dataset.sysId;
            }
            dropdown.innerHTML = ''; // Clear dropdown after selection
        });
        dropdown.appendChild(option);
    });

    // Position the dropdown below the input
    const inputRect = input.getBoundingClientRect();
    dropdown.style.width = `${inputRect.width}px`;
    dropdown.style.top = `${inputRect.bottom + window.scrollY}px`;
    dropdown.style.left = `${inputRect.left + window.scrollX}px`;
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '1000';
}

function sortTableByColumn(table, column, ascending = true) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const getCellValue = (row, column) => {
        const cell = row.querySelector(`td:nth-child(${column + 1})`);
        if (cell.querySelector('input')) {
            return cell.querySelector('input').value.trim();
        } else if (cell.querySelector('textarea')) {
            return cell.querySelector('textarea').value.trim();
        } else if (cell.querySelector('select')) {
            const select = cell.querySelector('select');
            return select.options[select.selectedIndex].text.trim();
        } else {
            return cell.textContent.trim();
        }
    };

    const sortedRows = rows.sort((a, b) => {
        const aText = getCellValue(a, column);
        const bText = getCellValue(b, column);

        return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    tbody.append(...sortedRows);
}

function updateSortIndicators(headers, clickedHeader, sortDirection) {
    headers.forEach(header => {
        const headerDiv = header.querySelector('div');
        if(headerDiv) headerDiv.classList.remove('sort-asc', 'sort-desc');
    });

    const headerDiv = clickedHeader.querySelector('div');
    if(headerDiv) headerDiv.classList.add(sortDirection ? 'sort-asc' : 'sort-desc');
}

function getUrlVars(key) {
    let vars = {};
    let parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = decodeURIComponent(value);
        }
    );
    return vars[key];
}