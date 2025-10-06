// SuperNow Configuration System
let superNowConfig = {
  unlockForm: true,
  editInExplorer: true,
  personalizeColumns: true,
  openRecordsInTabs: true,
  isNotOneOfOperator: true
};

// Listen for configuration from content script
window.addEventListener('message', function(event) {
  if (event.origin !== window.location.origin) return;
  
  if (event.data.type === 'SUPERNOW_CONFIG' && event.data.source === 'supernow-content-script') {
    superNowConfig = event.data.config;
    
    // Initialize if we haven't already
    if (!window.superNowInitialized) {
      initializeSuperNow();
    }
  }
  
  if (event.data.type === 'SUPERNOW_CONFIG_UPDATE' && event.data.source === 'supernow-content-script') {
    superNowConfig = event.data.config;
    // Re-initialize with new config
    superNowInit();
  }
});

// Signal that inject script is ready
window.postMessage({
  type: 'SUPERNOW_INJECT_READY',
  source: 'supernow-inject-script'
}, '*');

function superNowInit(){
  //form buttons
  if (typeof g_form != 'undefined'){
    let trgt = document.querySelector('.navbar-right .navbar-btn');
    if (trgt){
      //add the unlock button
      if (superNowConfig.unlockForm && !document.getElementById('unlockBtn')) {
        let btn = document.createElement("button");
        btn.type = "submit";
        btn.id = "unlockBtn";
        btn.title = "[SuperNow] Unlock Form";
        btn.classList = "btn btn-icon icon-unlocked navbar-btn";
        btn.addEventListener('click', (e) => { 
          superNowDoUnlock() 
        });
        trgt.after(btn);
      }

      //add edit in SuperNow Explorer button
      if (superNowConfig.editInExplorer && !document.getElementById('formBtn')) {
        let btn2 = document.createElement("button");
        btn2.type = "submit";
        btn2.id = "formBtn";
        btn2.title = "[SuperNow] Edit in SuperNow Explorer\nShow and edit all table columns.";
        btn2.classList = "btn btn-icon icon-panel-display-popout navbar-btn";
        btn2.addEventListener('click', (e) => { 
          superNowLoadInfoMessage() 
        });
        trgt.after(btn2);
      }
    }
  }

  let super_now_g_list;
  //list buttons: personalize columns button
  let relatedListsButtons = document.querySelectorAll('[data-type="list_mechanic2_open"]:not(.supernow-added)');
  if (relatedListsButtons){
    relatedListsButtons.forEach(rlb => {
      let tableName = rlb?.dataset?.table;
      if (!tableName) return;
      if(!GlideList2) return;
      super_now_g_list = GlideList2.get(rlb?.dataset?.list_id);
      rlb.classList.add('supernow-added');
      
      // Add "Open records in new tabs" button
      if (superNowConfig.openRecordsInTabs) {
        let icon2 = document.createElement('i');
        icon2.className = 'icon-export btn btn-icon table-btn-lg supernow-open-records';
        icon2.title = '[SuperNow] Open records in new tabs';
        icon2.role = 'button';
        icon2.addEventListener('click', evt => {
          superNowOpenRecords(icon2);
        });
        rlb.parentNode.insertBefore(icon2, rlb.nextSibling);
      }
      
      // Add "Personalize List Columns" button
      if (superNowConfig.personalizeColumns) {
        let icon = document.createElement('i');
        icon.className = 'icon-unlocked btn btn-icon table-btn-lg';
        icon.title = '[SuperNow] Personalize List Columns (Enhanced)';
        icon.role = 'button';
        icon.addEventListener('click', evt => {
          superNowLoadPersonalizeModal(rlb.dataset);
        });
        rlb.parentNode.insertBefore(icon, rlb.nextSibling);
      }
    });

    if (super_now_g_list) {
      if (superNowConfig.isNotOneOfOperator) {
        document.addEventListener('click', function (event) {
            if (event.ctrlKey || event.metaKey) {
                if (event.target.tagName == 'SELECT' && event.target.classList.contains('filerTableSelect')){
                    const newOp = new Option("[SuperNow] is not one of", "NOT IN");
                    event.target.add(newOp);
                }
            }
        });
      }
      
      document.addEventListener('paste', function(event) {
        let target = event.target;
        if (target.tagName === 'INPUT' && target.classList.contains('filerTableInput')) {
            let firstChild = target?.parentElement?.previousElementSibling?.firstElementChild;
            if (firstChild && firstChild.tagName === 'SELECT' && firstChild.selectedOptions[0].value === 'NOT IN') {
                event.preventDefault();
                let pasteText = (event.clipboardData || window.clipboardData).getData('text');
                pasteText = pasteText.replace(/[\n\t]/g, ',');
                let replacedText = pasteText.replace(/\r/g, '');
                let start = target.selectionStart;
                let end = target.selectionEnd;
                target.value = target.value.slice(0, start) + replacedText + target.value.slice(end);
                target.setSelectionRange(start + replacedText.length, start + replacedText.length);
            }
        }
      });
    }
  }

}

// Initialize SuperNow with configuration
function initializeSuperNow() {
  if (window.superNowInitialized) return;
  superNowInit();
  window.superNowInitialized = true;
}

// Start initialization - use setTimeout to ensure DOM is ready
setTimeout(() => {
  if (!window.superNowInitialized) {
    initializeSuperNow();
  }
}, 200);

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

function superNowOpenRecords(iconElement){
  // Find the parent list container from the clicked icon
  const listContainer = iconElement.closest('.list_v2');
  if (!listContainer) return;
  
  // Find all checkboxes in the list container
  const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
  const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
  
  let linksToProcess = [];
  
  if (checkedCheckboxes.length > 0) {
    // If checkboxes are selected, only get links for checked rows
    checkedCheckboxes.forEach(checkbox => {
      // Find the row containing this checkbox
      const row = checkbox.closest('tr');
      if (row) {
        // Find the list_popup link in this row
        const linkInRow = row.querySelector('a.list_popup');
        if (linkInRow) {
          linksToProcess.push(linkInRow);
        }
      }
    });
    
    if (linksToProcess.length === 0) {
      alert('[SuperNow] No valid links found in checked rows');
      return;
    }
  } else {
    // If no checkboxes are selected, get all list_popup links
    linksToProcess = Array.from(listContainer.querySelectorAll('a.list_popup'));
    
    if (linksToProcess.length === 0) {
      alert('[SuperNow] No records found to open');
      return;
    }
  }
  
  // Determine how many tabs will actually be opened
  const maxTabs = 100;
  const tabsToOpen = Math.min(linksToProcess.length, maxTabs);
  const willOpenAll = linksToProcess.length <= maxTabs;
  
  // Create confirmation message
  let message = `[SuperNow] Open Records in New Tabs\n\n`;
  if (checkedCheckboxes.length > 0) {
    message += `Found ${checkedCheckboxes.length} checked row(s) with ${linksToProcess.length} link(s).\n`;
  } else {
    message += `No rows selected - will open all records.\n`;
    message += `Found ${linksToProcess.length} records.\n`;
  }
  
  if (willOpenAll) {
    message += `This will open ${tabsToOpen} new tabs.`;
  } else {
    message += `Only the first ${maxTabs} will be opened in new tabs.`;
  }
  message += `\n\nAre you sure you want to continue?`;
  
  // Show confirmation dialog
  if (!confirm(message)) {
    return;
  }
  
  // Open the tabs (limited to maxTabs)
  const linksToOpen = linksToProcess.slice(0, maxTabs);
  linksToOpen.forEach(link => {
    if (link.href) {
      window.open(link.href, '_blank');
    }
  });
  
  // Show completion message
  const openedCount = linksToOpen.length;
  const selectionType = checkedCheckboxes.length > 0 ? 'selected' : 'all';
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
    document.dispatchEvent(event);
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

function superNowExpandFileWithSysId(selectElement, fieldPrefix) {
  // Get the selected value first
  var selectedValue = selectElement.value;
  if (!selectedValue) {
    // No selection, just call original expandFile
    expandFile(selectElement, fieldPrefix);
    return;
  }
  
  // Find the selected option that has a reference
  var selectedOption = null;
  for (var i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].selected && selectElement.options[i].reference) {
      selectedOption = selectElement.options[i];
      break;
    }
  }
  
  if (!selectedOption) {
    // No reference field selected, just call original expandFile
    expandFile(selectElement, fieldPrefix);
    return;
  }
  
  // Store initial option count to detect when expansion is complete
  var initialOptionCount = selectElement.options.length;
  var addedSysId = false;
  
  // Set up observer to watch for when options stop being added (expansion complete)
  var observer = new MutationObserver(function(mutations) {
    // Use a short delay to ensure all options have been added
    setTimeout(function() {
      if (!addedSysId && selectElement.options.length > initialOptionCount) {
        var sysIdValue = selectedValue + '.sys_id';
        
        // Check if the option already exists
        var existingOption = null;
        for (var j = 0; j < selectElement.options.length; j++) {
          if (selectElement.options[j].value === sysIdValue) {
            existingOption = selectElement.options[j];
            break;
          }
        }
        
        if (!existingOption) {
          // Find the indentation pattern from the last added option
          var lastOption = selectElement.options[selectElement.options.length - 1];
          var indent = '';
          if (lastOption && lastOption.textContent && lastOption.textContent.match(/^(\s+)/)) {
            indent = lastOption.textContent.match(/^(\s+)/)[1];
          }
          
          var newOption = new Option(indent + 'Sys ID', sysIdValue);
          newOption.cv = sysIdValue;
          newOption.cl = 'Sys ID';
          newOption.title = 'Sys ID';
          selectElement.appendChild(newOption);
          addedSysId = true;
        }
        
        observer.disconnect();
      }
    }, 100); // Wait 100ms after last mutation to ensure expansion is complete
  });
  
  // Watch for new options being added to the select element
  observer.observe(selectElement, {
    childList: true
  });
  
  // Fallback timeout in case the mutation observer doesn't work
  setTimeout(function() {
    if (!addedSysId) {
      var sysIdValue = selectedValue + '.sys_id';
      var existingOption = null;
      for (var j = 0; j < selectElement.options.length; j++) {
        if (selectElement.options[j].value === sysIdValue) {
          existingOption = selectElement.options[j];
          break;
        }
      }
      
      if (!existingOption) {
        // Find the indentation pattern from the last added option
        var lastOption = selectElement.options[selectElement.options.length - 1];
        var indent = '';
        if (lastOption && lastOption.textContent && lastOption.textContent.match(/^(\s+)/)) {
          indent = lastOption.textContent.match(/^(\s+)/)[1];
        }
        
        var newOption = new Option(indent + 'Sys ID', sysIdValue);
        newOption.cv = sysIdValue;
        newOption.cl = 'Sys ID';
        newOption.title = 'Sys ID';
        selectElement.appendChild(newOption);
        addedSysId = true;
      }
    }
    observer.disconnect();
  }, 2000);
  
  // Now call the original expandFile function
  expandFile(selectElement, fieldPrefix);
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
  setTimeout(() => reloadWindow(self, true), 1);
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
