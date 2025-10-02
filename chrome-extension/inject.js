function superNowInit(){
  //form buttons
  if (typeof g_form != 'undefined'){
    let trgt = document.querySelector('.navbar-right .navbar-btn');
    if (trgt){
      //add the unlock button
      let btn = document.createElement("button");
      btn.type = "submit";
      btn.id = "unlockBtn";
      btn.title = "[SuperNow] Unlock Form";
      btn.classList = "btn btn-icon icon-unlocked navbar-btn";
      btn.addEventListener('click', (e) => { 
        superNowDoUnlock() 
      });
      trgt.after(btn);

      //add edit in SuperNow Explorer button
      let btn2 = document.createElement("button");
      btn2.type = "submit";
      btn2.id = "formBtn";
      btn2.title = "[SuperNow] Edit in SuperNow Explorer\nShow and edit all table columns.";
      btn2.classList = "btn btn-icon icon-panel-display-popout navbar-btn";
      btn2.addEventListener('click', (e) => { 
        superNowLoadInfoMessage() 
      });
      trgt.after(btn2);

      let imgElements = document.querySelectorAll('img[data-original-title="Open a 1:1 Teams Chat"]');
      imgElements.forEach(img => {
        img.style.width = "24px";
        img.style.height = "24px";
      });
    }
  }

  let g_list;
  //list buttons: personalize columns button
  let relatedListsButtons = document.querySelectorAll('[data-type="list_mechanic2_open"]:not(.supernow-added)');
  if (relatedListsButtons){
    relatedListsButtons.forEach(rlb => {
      let tableName = rlb?.dataset?.table;
      if (!tableName) return;
      if(!GlideList2) return;
      g_list = GlideList2.get(rlb?.dataset?.list_id);
      rlb.classList.add('supernow-added');
        let icon = document.createElement('i');
        icon.className = 'icon-unlocked btn btn-icon table-btn-lg';
        icon.title = '[SuperNow] Personalize List Columns (Enhanced)';
        icon.role = 'button';
        icon.addEventListener('click', evt => {
          superNowLoadPersonalizeModal(rlb.dataset);
        });
        rlb.parentNode.insertBefore(icon, rlb.nextSibling);
/*
        let icon2 = document.createElement('i');
        icon2.className = 'icon-user btn btn-icon table-btn-lg';
        icon2.title = '[SuperNow] Advanced conditions';
        icon2.id = "super_now_advanced_conditions_button";
        icon2.role = 'button';
        icon2.addEventListener('click', evt => {
          superNowLoadAdvancedConditions(rlb.dataset);
        });
        rlb.parentNode.insertBefore(icon2, rlb.nextSibling);*/
    });

    /*if (!(typeof GlideList2 == 'undefined' || typeof g_form !== 'undefined')){ 
      let relatedListsButtons = document.querySelectorAll('[data-type="list_mechanic2_open"]:not(.snuified)');

      if (!relatedListsButtons) return;
      relatedListsButtons.forEach(rlb => {
          let tableName = rlb?.dataset?.table;
          if (!tableName) return;
          g_list = GlideList2.get(rlb?.dataset?.list_id);
      });
    }*/

    if (g_list) {
      document.addEventListener('click', function (event) {
          if (event.ctrlKey || event.metaKey) {
              if (event.target.tagName == 'SELECT' && event.target.classList.contains('filerTableSelect')){
                  //const options = event.target.options;
                  //let exists = false;
                  /*for (let i = 0; i < options.length; i++) { // Check for option existence
                    if (options[i].value === "LIKE") {
                      exists = true;
                      break;
                    }
                  }*/
                  // Add the option if it does not exist if (!exists)
                  const newOp = new Option("[SuperNow] is not one of", "NOT IN");
                  event.target.add(newOp);
              }
          }
      });
      document.addEventListener('paste', function(event) {
        let target = event.target;
        if (target.tagName === 'INPUT' && target.classList.contains('filerTableInput')) {
            let firstChild = target?.parentElement?.previousElementSibling?.firstElementChild;
            if (firstChild && firstChild.tagName === 'SELECT' && firstChild.selectedOptions[0].value === 'NOT IN') {
                event.preventDefault();
                let pasteText = (event.clipboardData || window.clipboardData).getData('text');
                pasteText = pasteText.replace(/[\n\t]/g, ',');
                let replacedText = pasteText.replace(/\r/g, '');
                //let replacedText = pasteText.replace(/somePattern/g, 'replacementText'); // Adjust the pattern and replacement text as needed
                let start = target.selectionStart;
                let end = target.selectionEnd;
                target.value = target.value.slice(0, start) + replacedText + target.value.slice(end);
                target.setSelectionRange(start + replacedText.length, start + replacedText.length);
            }
        }
      });
    }
  }

  //double click to set value
  document.addEventListener('dblclick', event => {
    if (event?.target?.classList?.contains('label-text') || event?.target?.parentElement?.classList.contains('label-text') || event?.target?.parentElement?.classList.contains('sc_editor_label')) {
      event.preventDefault();
        var elm;

        var formGroup = event.target.closest('div.form-group');
        if (formGroup) {
            var id = formGroup.getAttribute('id');
            if (id) {
                if (id.startsWith('variable_ni.VE') && formGroup.querySelector('div.slushbucket')) {
                    // List Collector is the most tricky because it has a weird value of the 'for' argument.
                    elm = 'ni.' + id.split('.')[1];
                } else {
                    // Form fields.
                    elm = id.split('.').slice(2).join('.');
                }
            }
        }

        // If the element is still not found it can be a catalog item variable.
        if (!elm) {
            var forLabel = event.target.parentElement.getAttribute('for');
            if (forLabel) {
                var temp = forLabel.split('.');
                if (temp.length == 3) {
                    // Reference, Requested for (same as the Reference but always references the User table) and Masked catalog variables types.
                    elm = temp.slice(1).join('.');
                } else {
                    // All other types of catalog item variables.
                    elm = temp.join('.');
                }
            }
        }

        // Check if the found value is a valid field/variable.
        var glideUIElement = g_form.getGlideUIElement(elm);
        if (!glideUIElement) {
            return;
        }

        var val = g_form.getValue(elm);
        var options = "";
        g_form.getOptionControl(elm)?.querySelectorAll('option').forEach(opt =>{
            options += "\n" + opt.value + ": " + (opt.dataset.snuoriginal || opt.innerText) ;
        });
        if (options) options = "\nOptions:" + options;
        if (!(NOW.user.roles.split(',').includes('admin') || snuImpersonater(document))) { //only allow admin to change fields
            var newValue = prompt('[SuperNow]\nField Type: ' + glideUIElement.type + '\nField: ' + elm + options + '\nValue:', val);
            if (newValue !== null)
                g_form.setValue(elm, newValue);
          }
      
    }else if (typeof window?.NOW?.sp != 'undefined' && event.target.tagName == 'SPAN') { //basic serviceportal names
      try {
          let fld =  angular.element(event.target).scope();
          //if (fld?.$parent?.$root?.user?.can_debug_admin) return;
          let fldName = fld.field.name;                    
          let gf = fld.$parent.getGlideForm();
          let val = gf.getValue(fldName);
          let newValue = prompt('[SuperNow]\nField Type: ' +  fld.field.type + '\nField: ' + fldName + '\nValue:', val);
          if (newValue !== null)
              gf.setValue(fldName, newValue);

      }catch(e){}        
    }
  }); 

}
superNowInit();

function superNowDoUnlock(){
   g_form.getSectionNames().forEach(section=>g_form.setSectionDisplay(section,true));
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
    });
}

function superNowCheckForPersonalizeModal(count, dataset){
  if(count > 100){
    return;
  }else{
    if(document.getElementById('super_now_field-list-modal')){
      superNowInitPersonalizeModal(dataset);
    }else{
      setTimeout(function(){
        superNowCheckForPersonalizeModal(count+1, dataset);
      }, 100);
    }
  }
}
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
function superNowLoadAdvancedConditions(dataset){
 /* if(!document.getElementById('super_now_filter_widget')){
    var scriptTag2 = document.createElement('script'); 
    scriptTag2.id = 'super_now_filter_widget';
    scriptTag2.type = 'text/javascript'; 
    scriptTag2.src = '/scripts/js_includes_filter_widget.js';
    document.querySelector('head').appendChild(scriptTag2);
  }
  if(!document.getElementById('super_now_form_elements')){
    var scriptTag3 = document.createElement('script');
    scriptTag3.id = 'super_now_form_elements';
    scriptTag3.type = 'text/javascript';
    scriptTag3.src = '/scripts/js_includes_form_elements.js';
    document.querySelector('head').appendChild(scriptTag3);
  }*/
  if(!document.getElementById('super_now_filter_css')){
    var cssTag = document.createElement('link');
    cssTag.id = 'super_now_filter_css';
    cssTag.rel = 'stylesheet';
    cssTag.href = '/styles/filter.css';
    document.querySelector('head').appendChild(cssTag);
    var cssTag2 = document.createElement('link');
    cssTag2.rel = 'stylesheet';
    cssTag2.href = '/styles/thirdparty/datetimepicker.css';
    document.querySelector('head').appendChild(cssTag2);
    /*var cssTag3 = document.createElement('link');
    cssTag3.rel = 'stylesheet';
    cssTag3.href = '/styles/retina_icons.css';
    document.querySelector('head').appendChild(cssTag3);*/
  }
  if(!document.getElementById('super_now_advanced_conditions')){
    const buttonSection = document.getElementById('super_now_advanced_conditions_button').parentElement;
    var divEl = document.createElement('div');
    divEl.id = 'super_now_advanced_conditions';
    divEl.innerHTML = `
    <div sn-ng-formatter="sn.filter_widget">
    <script type="text/javascript" src="/scripts/js_includes_filter_widget.jsx"></script>
    <script type="text/javascript" src="/scripts/sn/common/messaging/js_includes_messaging.jsx"></script>
    <script type="text/javascript" src="/scripts/js_includes_ng_form_elements.jsx"></script>
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
    <form-filter-widget ref="sys_script.filter_condition" static-dependent="${rlb.dataset.table}" restricted-fields="" extended-operators="VALCHANGES;CHANGESFROM;CHANGESTO" allow-order="false" allow-related-list-query="true" show-condition-count="false" subject-criteria="false" security-attributes="false"></form-filter-widget>
    </div>
    `;
    buttonSection.appendChild(divEl);
  } 
 /* if(!document.getElementById('super_now_field-list-modal')){
    let event = new CustomEvent("super-now-event", {detail: { event: "superNowPersonalizeColumns"}});
    window.top.document.dispatchEvent(event);
    superNowCheckForPersonalizeModal(0, dataset);
  }else{
    superNowInitPersonalizeModal(dataset);
  }*/
}

function superNowLoadPersonalizeModal(dataset){
  if(!document.getElementById('supernow_slushbucket_scripts')){
    var scriptTag2 = document.createElement('script'); 
    scriptTag2.id = 'supernow_slushbucket_scripts';
    scriptTag2.type = 'text/javascript'; 
    scriptTag2.src = '/scripts/slushbucket.js';
    document.querySelector('head').appendChild(scriptTag2);
  }
  if(!document.getElementById('super_now_field-list-modal')){
    let event = new CustomEvent("super-now-event", {detail: { event: "superNowPersonalizeColumns"}});
    window.top.document.dispatchEvent(event);
    superNowCheckForPersonalizeModal(0, dataset);
  }else{
    superNowInitPersonalizeModal(dataset);
  }
}

function superNowInitPersonalizeModal(dataset){
  document.getElementById('super_now_field-list-modal').style.display = 'block';
  var rlb = {};
  rlb.dataset = dataset;
  var jtd = document.getElementById('jtest_table_data');
  jtd.value = JSON.stringify(rlb.dataset);
  var ga = new GlideAjax('UIPage');
  ga.addParam('sysparm_name','getList');
  ga.addParam('sysparm_list_view',rlb.dataset.view);
  ga.addParam('sysparm_list_parent',rlb.dataset.parentTable);
  ga.addParam('sysparm_list_parent_id',rlb.dataset.parentId);
  ga.addParam('sysparm_list_relationship',rlb.dataset.relationship);
  ga.addParam('sysparm_table',rlb.dataset.table);
  ga.getXML(superNowListResponse);
}

function superNowPersonalizeColumnsClose(){
  document.getElementById('super_now_field-list-modal').style.display = 'none';
  $j("#super_now_field_list_select_0")[0].options.length = 0;
  $j("#super_now_field_list_select_1")[0].options.length = 0;
}

function superNowGetListCols(sysparm_field_list, sysparm_table) {
  var params = "sysparm_processor=ListColumns&sysparm_expanded=0&sysparm_include_variables=true&sysparm_include_questions=true&sysparm_is_list=true&sysparm_dot_walk_extended_fields_supported=true&sysparm_name=" + sysparm_table;
  if (sysparm_field_list)
    params += "&sysparm_col_list=" + sysparm_field_list;
  var url = "xmlhttp.do?" + params;
  serverRequest(url, function postCb(request){      
    var commaSeparatedColumns = superNowColsReturned(request, $j("#super_now_field_list_select_0")[0], $j("#super_now_field_list_select_1")[0], sysparm_field_list, false, sysparm_table !== "wf_activity");
    document.getElementById('sysparm_super_now_field_list').value = commaSeparatedColumns;
  }, null);
}
  
function superNowListResponse(request) {
  var xml = request.responseXML.documentElement;
  var z2 = xml.getElementsByTagName("selected")[0];
  var choices = z2.getElementsByTagName("choice");
  var arraything = [];
  for (var i = 0; i < choices.length; i++ ) {
    var choice = choices[i];
    arraything.push(choice.getAttribute('value'));
  }
  var z = xml.getElementsByTagName("choice_list_set")[0];
  gel('ni.super_now.highlighting').checked = 'true' == z.getAttribute('table.highlighting');
  gel('ni.super_now.compact').checked = 'true' == z.getAttribute('table.compact');
  gel('ni.super_now.wrap').checked = 'true' == z.getAttribute('table.wrap');
  gel('ni.super_now.field_style_circles').checked = 'true' == z.getAttribute('field_style_circles');
  gel('ni.super_now.list_edit_enable').checked = 'true' == z.getAttribute('list_edit_enable');
  gel('ni.super_now.list_edit_double').checked = 'true' == z.getAttribute('list_edit_double');
  var tempthing = JSON.parse(document.getElementById('jtest_table_data').value);
  var a = z.getAttribute("user_list");
  if (a == 'true') {
    gel('super_now_reset_column_defaults').disabled = false;
  } else {
    gel('super_now_reset_column_defaults').disabled = true;
  }
  superNowGetListCols(arraything.join(','),tempthing.table);
}

function superNowColsReturned(request, availableSel, selectedSel, colsList, pivotFieldDisplay, showVariables) {
  var tcols = request.responseXML;
  var acols = availableSel;
  var scols = selectedSel;
  var colist = colsList;
  scols.options.length = 0;
  acols.options.length = 0;
  var mfields = [];
  var useSpecFields = false;
  if (colist) {
    mfields = colist.split(",");
    if (mfields.length)
      useSpecFields = true;
  }
  var root = tcols.getElementsByTagName("xml")[0];
  var items = tcols.getElementsByTagName("item");
  var commaSeparatedColumns = "";
  var sysIdSelected = false;
  for (var i = 0; i !== items.length; i++) {
    var item = items[i];
    var value = item.getAttribute("value");
    var label = item.getAttribute("label");
    var status = item.getAttribute("status");
    var ref = item.getAttribute("reference");
    if (pivotFieldDisplay && value === "sys_tags")
      continue;
    if (showVariables === false && value === "vars")
      continue;
    if (ref === "")
      ref = null;
    var o = superNowEnhanceOption(item, value, label, root, status);
    if (useSpecFields) {
      if (valueExistsInArray(value, mfields)) {
        scols.options[scols.options.length] = o;
        if (ref)
          acols.options[acols.options.length] = superNowEnhanceOption(item,
              value, label, root, "available");
      } else {
        acols.options[acols.options.length] = o;
      }
    } else {
      if (status === "selected") {
        if(value === "sys_id") sysIdSelected = true;
        scols.options[scols.options.length] = o;
        if (i>0)
          commaSeparatedColumns += ",";
        commaSeparatedColumns += value;
        if (ref)
          acols.options[acols.options.length] = superNowEnhanceOption(item, value, label, root, "available");
      } else {
        acols.options[acols.options.length] = o;
      }
    }
  }
  if (useSpecFields) {
    var newOptions = [];
    for (i = 0; i !== mfields.length; i++) {
      var s = mfields[i];
      for (var z = 0; z !== scols.options.length; z++) {
        if (scols.options[z].value === s) {
          newOptions[newOptions.length] = scols.options[z];
          break;
        }
      }
    }
    scols.options.length = 0;
    sysIdSelected = false;
    for (i = 0; i !== newOptions.length; i++) {
      if(newOptions[i].value === "sys_id") sysIdSelected = true;
      scols.options.add(newOptions[i]);
    }
  }
  if (pivotFieldDisplay) {
    if (!colsList)
      $j(scols).find("option").remove();
    else
      pivotFieldDisplay.val(superNowSelectedOptionsToArray(scols).selectedLabels.join(", "));
  }
  if(!sysIdSelected){
    var o = new Option('Sys ID', 'sys_id');
    o.cv = 'sys_id';
    o.cl = 'Sys ID';
    o.title = 'Sys ID';
    acols.options[acols.options.length] = o;
  }
  return commaSeparatedColumns;
}

function superNowEnhanceOption(item, value, label, root, status) {
  var ref = null;
  var xlabel = label;
  if (status !== "selected") {
    ref = item.getAttribute("reference");
    if (ref) {
      if (ref !== "") {
        xlabel += " [+]";
      } else
        ref = null;
    }
  }
  var o = new Option(xlabel, value);
  o.cv = value;
  o.cl = label;
  o.title = label;
  var extension = item.getAttribute("extended_field");
  if (ref) {
    o.tl = item.getAttribute("reflabel");
    o.style.color = "green";
    o.reference = ref;
    o.doNotDelete = "true";
    if (root) {
      o.bt = root.getAttribute("name");
      o.btl = root.getAttribute("label");
    }
  }
  if (extension === "true")
    o.style.color = "darkred";
  return o;
}

function superNowSetAndAddOption (field, reportField, sep1, sep2, sep3) {
  moveOption(document.getElementById(field + '_select_0'), document.getElementById(field + '_select_1'), sep1, sep2, sep3);
  superNowSaveBucketData(field + '_select_1', reportField);
}

function superNowSetAndRemoveOption (field, reportField, sep1, sep2, sep3) {
  moveOption(document.getElementById(field + '_select_1'), document.getElementById(field + '_select_0'), sep1, sep2, sep3);
  superNowSaveBucketData(field + '_select_1', reportField);
}

function superNowSetAndMoveUp (field, reportField) {
  moveUp(document.getElementById(field));
  superNowSaveBucketData(field, reportField);
}

function superNowSetAndMoveDown (field, reportField) {
  moveDown(document.getElementById(field));
  superNowSaveBucketData(field, reportField);
}

function superNowSaveBucketData(field, reportField) {
  var array = superNowSelectedOptionsToArray('#' + field);
  var valToSet = array.selectedValues.join(',');
  //set the value of the input element that has an ID of "field"
  document.getElementById(reportField).value = valToSet;
}

function superNowSelectedOptionsToArray(selectField) {
  var selectedValues = [];
  var selectedLabels = [];
  $j(selectField).find('option').each(function(i, option) {
    selectedValues[i] = $j(option).val();
    selectedLabels[i] = $j(option).text();
  });
  return {
    selectedValues : selectedValues,
    selectedLabels : selectedLabels
  };
}

function superNowFilter(){
  var filter = $j('#super_now_filter').val().toLowerCase();
  var select = $j('#super_now_field_list_select_0');
  select.find('option').each(function(i, option){
    var option = $j(option);
    if(option.text().toLowerCase().indexOf(filter) === -1){
      option.hide();
    }else{
      option.show();
    }
  });
}

function superNowShowFilter(){
  var superNowFilterElement = document.getElementById('super_now_filter'); 
  var currentlyHidden = superNowFilterElement.style.display == 'none'
  superNowFilterElement.style.display = currentlyHidden ? 'inline-block' : 'none';
  var superNowFilterIcon = document.getElementById('super_now_filter_icon');
  if(currentlyHidden){
    superNowFilterIcon.classList.remove('icon-search');
    superNowFilterIcon.classList.add('icon-zoom-out');
  }else{
    superNowFilterIcon.classList.remove('icon-zoom-out');
    superNowFilterIcon.classList.add('icon-search');
  }
}

function superNowSubmitEnhancedColumnsModal(reset){
  document.getElementById('super_now_field-list-modal').style.display = 'none';
  var jtd = document.getElementById('jtest_table_data');
  var rlb = {};
  rlb.dataset = JSON.parse(jtd.value);
  var ga = new GlideAjax('UIPage');
  ga.addParam('sysparm_name','createListMechanic');
  ga.addParam('sysparm_reset',reset ? true : false);
  ga.addParam('sysparm_list_view',rlb.dataset.view);
  ga.addParam('sysparm_list_parent',rlb.dataset.parentTable);
  ga.addParam('sysparm_list_parent_id',rlb.dataset.parentId);
  ga.addParam('sysparm_list_relationship',rlb.dataset.relationship);
  ga.addParam('sysparm_table',rlb.dataset.table);
  ga.addParam('sysparm_f', document.getElementById('sysparm_super_now_field_list').value);//'sys_created_on,name,source_table,target_table,run_business_rules,order,active,sys_updated_on');
  ga.addParam('sysparm_changes',true);
  ga.addParam('sysparm_compact',gel('ni.super_now.compact').checked);
  ga.addParam('sysparm_wrap',gel('ni.super_now.wrap').checked);
  ga.addParam('sysparm_highlighting', gel('ni.super_now.highlighting').checked);
  ga.addParam('sysparm_field_style_circles', gel('ni.super_now.field_style_circles').checked);
  ga.addParam('sysparm_edit_enable', gel('ni.super_now.list_edit_enable').checked);
  ga.addParam('sysparm_edit_double',gel('ni.super_now.list_edit_double').checked);
  ga.getXMLWait();
  ga.getAnswer();
  setTimeout('reloadWindow(self, true);', 1);
}

function superNowLoadInfoMessage(){
  var data = {};
  var tableTitle = document.getElementsByClassName('navbar-title-caption');
  data.tableTitle = tableTitle[0]?.textContent ?? '';
  var displayTitle = document.getElementsByClassName('navbar-title-display-value');
  data.title = displayTitle[0]?.firstChild?.textContent ?? '';
  data.tableName = g_form.getTableName();
  data.sysId = g_form.getUniqueValue();
  data.url = window.location.origin;
  data.g_ck = g_ck || window.top.g_ck;
  let event = new CustomEvent(
      "super-now-event",
      {
          detail: {
              event: "superNowTrueUnlock",
              command: data
          }
      }
  );
  window.top.document.dispatchEvent(event);
}

async function superNowFetchData(token, url, post, callback) {
  if(!token) token = window.top.g_ck; 
  return new Promise(async (resolve, reject) => {
    const headers = {
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-UserToken': token || undefined
    };
    try {
      const response = await fetch(url, {
        method: post ? post?.method : 'GET',
        headers,
        body: post ? JSON.stringify(post?.body) : null
      });
      let data = response.ok ? await response.json() : response;
      data.resultcount = Number(response.headers.get("X-Total-Count"));
      if (callback) callback(data);
      resolve(data);
    } catch (error) {
      if (callback) callback(error);
      reject(error);
    }
  });
}
