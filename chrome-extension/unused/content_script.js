/*CONTENT_SCRIPT.JS*/
/*var s = document.createElement('script');
s.src = chrome.runtime.getURL('/js/purify.min.js');

var s2 = document.createElement('script');
s2.src = chrome.runtime.getURL('inject.js');

var d = document.getElementById("gsft_main")
  ? document.getElementById("gsft_main").contentWindow.document
  : document;


if (typeof g_form2 == 'undefined') {
    try { //get if in iframe
        g_form2 =
            (document.querySelector("#gsft_main") || document.querySelector("[component-id]")
                .shadowRoot.querySelector("#gsft_main")).contentWindow.g_form;
    } catch (e) { }
}

function addCustomListOption(count) {
  //var gsft = document.getElementById('gsft_main').contentWindow.document;
  var body = d.querySelector(".list-mechanic #slush [valign=middle] tbody");
  if (body) {
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add dotwalk field (confirm with enter)";
    input.className = "form-control";
    input.style.marginTop = "2px";
    input.style.marginLeft = "2px";
    //el.onclick = function (ev) { input.value = ev.target.value + '.'; input.focus() }
    input.onkeydown = function (ev) {
      if (ev.which == 13) {
        ev.preventDefault();
        var opt = document.createElement("option");
        opt.value = input.value;
        opt.innerHTML = DOMPurify.sanitize(input.value);
        var select = document.querySelector(
          ".list-mechanic #slush [valign=middle] tbody select"
        );
        select.appendChild(opt);
        this.value = "";
        this.innerHTML = "";
      }
    };
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.colspan = "2";
    td.appendChild(input);
    tr.appendChild(td);
    body.appendChild(tr);
  } else if (count < 10) {
    setTimeout(function () {
      count++;
      addCustomListOption(count);
    }, 1000);
  }
}

//var gsft = document.getElementById('gsft_main').contentWindow.document;
var cog = d.querySelectorAll('[data-type="list_mechanic2_open"]');
console.log(cog);
for (var i = 0; i < cog.length; i++) {
  cog[i].onclick = function (ev) {
    addCustomListOption(0);
  };
}


var detail = {
    "detail": {
        "type": "code",
        "content": 'unlockForm()'
    }
};
var e2 = new CustomEvent('snuEvent', detail);
document.dispatchEvent(e2);

*/

/*BACKGROUND.JS*/
/*chrome.commands.onCommand.addListener(function (command) {
    if (typeof lastCommand !== 'undefined' && (new Date()).getTime() - lastCommand < 500) {
        //dont trigger twice #245
    }
    else if (command == "unlock-form")
        unlockForm2();
   

    lastCommand = (new Date()).getTime();
    return true;

});

function unlockForm2() {

    chrome.tabs.query({
        currentWindow: true,
        active: true
    },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                method: "jtest"
            });
        });

}
*/

/*CONTENT_SCRIPT_ALL_FRAMES.JS*/
/*var lastCommand = new Date().getTime();

(function () {
  addScript("inject.js", true);
})();



function addScript(filePath, processSettings) {

s.onload = function () {
  var detail = {
    detail: {
      type: "code",
      content: "unlockForm()",
    },
  };
  var event = new CustomEvent("snuEvent", detail);
  document.dispatchEvent(event);
};
//}
//var s2 = document.createElement('script');
//s2.src = chrome.runtime.getURL('/js/purify.min.js');
var lastCommand = (new Date()).getTime();
//attach event listener from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ((new Date()).getTime() - lastCommand < 500) {
      //dont trigger twice
  }
  else if (request.method == "jtest") {
    var detail = {
      "detail": {
          "type": "code",
          "content": 'doUnlock()'
      }
  };
    var event = new CustomEvent('jamesEvent', detail);
    document.dispatchEvent(event);

      runFunction(request.myVars);
  } else if (request.method == "setBackgroundScript") {
      runFunction(request.myVars, "background");
  } else if (request.snippet) {
      insertTextAtCursor(request.snippet);
  }

  lastCommand = (new Date()).getTime();

});
function runFunction(f) {
  if (typeof document === 'undefined' || document == null) return;

  let inParent = document.querySelector('iframe#gsft_main') != null && document.querySelector('iframe#gsft_main').contentDocument != null;
  if (inParent) {
      // don't run function meant for content frame if we're not in it
      return;
  }
  var detail = {
      "detail": {
          "type": myType,
          "content": f
      }
  };
  if (typeof cloneInto != 'undefined') detail = cloneInto(detail, document.defaultView); //required for ff
  var event = new CustomEvent('snuEvent', detail);
  document.dispatchEvent(event);

}
var d = document.getElementById("gsft_main")
  ? document.getElementById("gsft_main").contentWindow.document
  : document;

if (typeof g_form2 == 'undefined') {
    try { //get if in iframe
        g_form2 =
            (document.querySelector("#gsft_main") || document.querySelector("[component-id]")
                .shadowRoot.querySelector("#gsft_main")).contentWindow.g_form;
    } catch (e) { }
}

function addCustomListOption(count) {
  //var gsft = document.getElementById('gsft_main').contentWindow.document;
  var body = d.querySelector(".list-mechanic #slush [valign=middle] tbody");
  if (body) {
    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Add dotwalk field (confirm with enter)";
    input.className = "form-control";
    input.style.marginTop = "2px";
    input.style.marginLeft = "2px";
    //el.onclick = function (ev) { input.value = ev.target.value + '.'; input.focus() }
    input.onkeydown = function (ev) {
      if (ev.which == 13) {
        ev.preventDefault();
        var opt = document.createElement("option");
        opt.value = input.value;
        opt.innerHTML = DOMPurify.sanitize(input.value);
        var select = document.querySelector(
          ".list-mechanic #slush [valign=middle] tbody select"
        );
        select.appendChild(opt);
        this.value = "";
        this.innerHTML = "";
      }
    };
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.colspan = "2";
    td.appendChild(input);
    tr.appendChild(td);
    body.appendChild(tr);
  } else if (count < 10) {
    setTimeout(function () {
      count++;
      addCustomListOption(count);
    }, 1000);
  }
}

//var gsft = document.getElementById('gsft_main').contentWindow.document;
var cog = d.querySelectorAll('[data-type="list_mechanic2_open"]');
console.log(cog);
for (var i = 0; i < cog.length; i++) {
  cog[i].onclick = function (ev) {
    addCustomListOption(0);
  };
}*/


/*ULTIMATE_FORM.HTML*/
/*<!--link rel="stylesheet" href="css/bootstrap.min.css">
<link rel="stylesheet" href="css/datatables.min.css">
<link rel="stylesheet" href="css/font-awesome.min.css">
<script src="js/purify.min.js"></script>
<script src="js/jquery.min.js"></script>
<script src="js/bootstrap.bundle.min.js"></script>
<script src="js/moment.js"></script>
<script src="js/datatables.min.js"></script>
<script src="js/datatables-datetime.js"></script-->
<!--  <form id="superNowUltimateForm">

    </form>-->
  <!--div id="fixheader">
    <div id="title"><img class="wdth40" src="/images/icon128.png" alt="SN Utils logo" /> View Data details &nbsp;&nbsp;
      <span id="whotheheck">Table | Created | Updated</span>
    </div>
    <div class="input-group">
      <input type="search" id="tbxdataexplore" name="tbxdataexplore" class="form-control form-control-sm sync"
        placeholder="Search data...">
      <div id="divhideempty">
        <input class="form-check-input sync" type="checkbox" id="cbxhideempty" name="cbxhideempty">
        <label class="form-check-label" for="cbxhideempty" title="Hide rows where the field is empty">
          Hide empty rows.
        </label></input>
      </div>
      <button id='btnrefreshdataexplore' class="btn btn-outline-secondary btn-sm" title="Refresh data"
        type="button">Refresh</button>
    </div>
  </div>
  <table id="dataexplore" class="display table-condensed dxp">
    <thead>
      <tr>
        <th>Label</th>
        <th>Name</th>
        <th>Type</th>
        <th>Value</th>
        <th>Display Value</th>
        <th>Has Data</th>
      </tr>
    </thead>
  </table>

  <div id="fieldDetailsModal" class="modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="fieldmodalTableHeader">fieldname</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="fieldmodalTableContent">
          fielddetails
        </div>
      </div>
    </div>
  </div-->
  */

/*ULTIMATE_FORM.JS*/
/*
if (!tableName) { //try to find table and sys_id in workspace
  let myurl = new URL(response.frameHref)
  let parts = myurl.pathname.split("/");
  let idx = parts.indexOf("sub") // show subrecord if available
  if (idx != -1) parts = parts.slice(idx);
  idx = parts.indexOf("record")
  if (idx > -1 && parts.length >= idx + 2) {
      tableName = parts[idx + 1];
      sysId = parts[idx + 2];
  }
}
   //  superNowFetch(g_ck, , ).then(results => {
            // Simulate an API call to fetch suggestions
           // fetch(`/api/typeahead?query=${query}&meta=${meta.reference_display_field}`)
            //reload the tab
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.update(tabs[0].id, {url: url + '/' + tableName + '.do?sys_id=' + sysId});
            });

                if(results.body){
                    results.body.text().then(bodyText => {
                        alert('Error updating record: ' + results.status + ' ' + results.statusText + ' (' + bodyText + ')');
                    }).catch(error => {
                        alert('Error updating record: ' + results.status + ' ' + results.statusText + ' (Error reading body: ' + error + ')');
                    });
                }else{  
                            //let dataView = superNowBuildRows(results);
            //buildBody(dataView);
            //location.reload();
                    //const [metaData, recordData] = await Promise.all([superNowFetch(g_ck, metaUrl), superNowFetch(g_ck, dataUrl)]);
 let propObj = {};
        propObj.name = "#TABLE / SYS_ID";
        propObj.meta = {
            "label": "#TABLE / SYS_ID",
            "type": "TABLE"
        };
        propObj.display_value = "<a class='referencelink' href='" + url + "/" + tableName + ".do?sys_id=" + sysId + "' target='_blank'>" + tableName + " / " + sysId + "</a>";
        propObj.link = url + "/" + tableName + ".do?sys_id=" + sysId;
        propObj.value = tableName + " / " + sysId;
        dataView.push(propObj);
                //let dataView = superNowBuildRows(recordData);
        //buildBody(dataView);
                //setViewData([]);
                function filterTableByColumn(columnIndex, filterValue) {
                  const table = document.getElementById('dynamicTable');
                  const rows = table.querySelectorAll('tbody tr');
                  rows.forEach(row => {
                      const cell = row.cells[columnIndex];
                      if (cell) {
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
                          row.style.display = cellText.toLowerCase().includes(filterValue.toLowerCase()) ? '' : 'none';
                       }
                  });
              }

function superNowFetch(token, url, post) {
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
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}
const debouncedSuperNowFetch = debounce((token, url, post) => {
    const { promise, cancel } = superNowFetch(token, url, post);
    promise.then(data => {
        console.log(data);
    }).catch(error => {
        console.error('Fetch error:', error);
    });
    return { cancel };
}, 300);
try {
        rows = recordData.result[0];
    } catch (e) {
        rows = { "Error": { "display_value": e.message, "value": "Record data not retrieved." } };
    }
     let whotheheck = `Table: <a href="${url}/${tableName}.do?sys_id=${sysId}" target="_blank">${tableName}</a> 
    | Created: <a href="${url}/sys_user.do?sys_id=${rows?.sys_created_by?.value}&sysparm_refkey=user_name" target="_blank">${rows?.sys_created_by?.display_value}</a> 
        - ${rows?.sys_created_on?.display_value} 
    | Updated: <a href="${url}/sys_user.do?sys_id=${rows?.sys_updated_by?.value}&sysparm_refkey=user_name" target="_blank">${rows?.sys_updated_by?.display_value}</a> 
        - ${rows?.sys_updated_on?.display_value}`;
    document.querySelector('#whotheheck').innerHTML = whotheheck;
        // if (!rows.hasOwnProperty(key)) continue;
        //let display_value = rows[key].display_value;
        //let link = propObj.link = rows[key].link;
if (link) {
            let linksplit = link.split('/');
            let href = url + '/' + linksplit[6] + '.do?sys_id=' + linksplit[7];
            if (!display_value) display_value = '[Deleted reference or empty display value]';
            display_value = "<a href='" + href + "' target='_blank'>" + display_value + "</a>";
        }
 //if field.meta.multitext is true, set the input type to textarea
        if (field.meta.multitext) {
            valueInput.type = 'textarea';
        }
        if (field.meta.multitext) {
            const textarea = document.createElement('textarea');
            textarea.value = valueInput.value;
            valueInput.replaceWith(textarea);
            valueInput = textarea;
        }
            input.addEventListener('input', debounce(() => {
                //clearSuggestions(input); // Clear old suggestions
                handleTypeahead(input); // Load new suggestions
            }, 300));
                                        // const matchedOption = results.find(result => result[meta.reference_display_field] === input.value);
                            // if (!matchedOption) {

const displayValueTd = document.createElement('td');
        const displayValueInput = createInput(field, `${field.name}_display_value`);
        displayValueTd.appendChild(displayValueInput);
        tr.appendChild(displayValueTd);
  // const valueHeaderCells = table.querySelectorAll('tbody .value-cell');
    //valueHeaderCells.forEach(cell => {

    inputs.forEach(input => {
        adjustInputWidth(input);
    });
// Then, set the width of all inputs to the maximum width
   inputs.forEach(input => {
        input.parentElement.style.width = `${maxWidth}px`;
    });
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.font = window.getComputedStyle(input).font;
    tempSpan.textContent = input.value || input.placeholder;
    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth + 12; // Add some padding
    //make this set the parent td width
    input.parentElement.style.width = `${width}px`;
    //input.style.width = `${width}px`;
    document.body.removeChild(tempSpan);
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
   // superNowFetch(g_ck, searchUrl).then(results => {
    // Simulate an API call to fetch suggestions
   // fetch(`/api/typeahead?query=${query}&meta=${meta.reference_display_field}`)
    let loadingIndicator = input.closest('td').querySelector('.loading-indicator');
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<div class="spinner"></div>';
        input.closest('td').appendChild(loadingIndicator);
    }
    const inputRect = input.getBoundingClientRect();
    loadingIndicator.style.position = 'absolute';
    loadingIndicator.style.top = `${inputRect.top + window.scrollY}px`;
    loadingIndicator.style.left = `${inputRect.right + window.scrollX + 10}px`;
    loadingIndicator.style.display = 'inline-block';
    const loadingIndicator = input.closest('td').querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
 example meta value
        "reference_display_field": "name",
        "reference_attributes": {
            "display_field": "name",
            "ref_ac_columns": [
                "user_name",
                "email",
                "last_name"
            ],
            "ref_ac_columns_search": "true",
            "ref_ac_display_value": true,
            "ref_auto_completer": "AJAXTableCompleter"
        },
        
  const query = event.target.value;
    if (query.length > 0) {
        const meta = JSON.parse(event.target.dataset.meta); // Retrieve meta from data attribute


    
       var queryCondition = meta.reference_display_field+'LIKE'+query;
       if(meta.reference_attributes.ref_ac_columns_search){
            for (var i = 0; i < meta.reference_attributes.ref_ac_columns.length; i++) {
                queryCondition += '^OR'+meta.reference_attributes.ref_ac_columns[i]+'LIKE'+query;
            }
        }   
        var searchUrl = url+'/api/now/table/'+meta.reference+'?sysparm_query='+queryCondition+'&sysparm_fields=sys_id,'+meta.reference_attributes.display_field+','+meta.reference_attributes.ref_ac_columns.toString()+'&sysparm_limit=10';
        superNowFetch(g_ck,searchUrl).then(results => {
            // Process the results and add options to the input
            addOptionsToInput(event.target, results);
        })
    function handleTypeahead(event) {
    if (event.inputType === 'insertReplacementText') {
        return;
    }

    const input = event.target;
    const query = input.value.trim();
    if (query.length < 3) {
        return;
    }

    const meta = JSON.parse(input.dataset.meta);
    var queryCondition = meta.reference_display_field+'LIKE'+query;
    if(meta.reference_attributes.ref_ac_columns_search){
        for (var i = 0; i < meta.reference_attributes.ref_ac_columns.length; i++) {
            queryCondition += '^OR'+meta.reference_attributes.ref_ac_columns[i]+'LIKE'+query;
        }
    }       
    //let queryCondition = meta.reference_attributes.ref_ac_columns.map(column => `${column}LIKE${query}`).join('^OR');
    const searchUrl = `${url}/api/now/table/${meta.reference}?sysparm_query=${queryCondition}&sysparm_fields=sys_id,${meta.reference_attributes.display_field},${meta.reference_attributes.ref_ac_columns.toString()}&sysparm_limit=10`;

    showLoadingIndicator(input);

    superNowFetch(g_ck, searchUrl).then(results => {
        hideLoadingIndicator(input);

        // Process the results and add options to the input
        addOptionsToInput(input, results);
    }).catch(error => {
        // Hide loading indicator in case of error
        hideLoadingIndicator(input);
        console.error('Error fetching typeahead results:', error);
    });

  
        // Placeholder for API call
        console.log('Searching for:', query);
        // Example: fetch(`/api/search?query=${query}`).then(...);
    //}
}

function showLoadingIndicator(input) {
    let loadingIndicator = input.closest('td').querySelector('.loading-indicator');
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<div class="spinner"></div>';
        input.closest('td').appendChild(loadingIndicator);
    }
    const inputRect = input.getBoundingClientRect();
    loadingIndicator.style.position = 'absolute';
    loadingIndicator.style.top = `${inputRect.top + window.scrollY}px`;
    loadingIndicator.style.left = `${inputRect.right + window.scrollX + 10}px`;
    loadingIndicator.style.display = 'inline-block';
}

function hideLoadingIndicator(input) {
    const loadingIndicator = input.closest('td').querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

function addOptionsToInput(input, results) {
    const meta = JSON.parse(input.dataset.meta);
    results = results.result;
    // Clear any existing options
    const datalistId = `${input.name}-datalist`;
    let datalist = document.getElementById(datalistId);
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = datalistId;
        document.body.appendChild(datalist);
        input.setAttribute('list', datalistId);
    }
    datalist.innerHTML = '';

    // Add new options
    results.forEach(result => {
        const option = document.createElement('option');
        option.value = result[meta.reference_display_field]; // Adjust based on your API response structure
        option.dataset.sysId = result.sys_id; 
        datalist.appendChild(option);
    });

    input.addEventListener('input', function() {
        const selectedOption = Array.from(datalist.options).find(option => option.value === input.value);
        if (selectedOption) {
            const sysId = selectedOption.dataset.sysId;
            const valueInput = input.closest('tr').querySelector('td input'); //'input[name="value"]');
            if (valueInput) {
                valueInput.value = sysId;
            }
        }
    });
}
Object.entries(nme).forEach( // add check of empty fields to be able to filter out
        ([key, obj]) => {
            nme[key].hasdata = (obj.value || obj.display_value) ? "hasdata" : "";
            if (!nme[key].link) {
                let escpd = escape(nme[key].display_value);
                if (nme[key].display_value != escpd)
                    nme[key].display_value = '<pre style="white-space: pre-wrap; max-width:600px;"><code>' + escpd + '</code></pre>'
            }
        }
    );

    if (dtViewData) dtTables.destroy();
    //$('#dataexplore').html(DOMPurify.sanitize(nme));
    dtViewData = $('#dataexplore').DataTable({

        "aaData": nme,
        "createdRow": function (row, data, index) {
            // console.log(row, data, index);
        },
        "aoColumns": [

            { "mDataProp": "meta.label" },
            { "mDataProp": "name" },
            {
                mRender: function (data, type, row) {
                    let reference = "<div class='refname'>" + row?.meta?.reference + "</div>";
                    let choices = (row?.meta?.choices?.length > 0) ? `<span class='choices'> ${row?.meta?.choices?.length}</span>` : "*";
                    if (reference.includes('undefined')) reference = '';
                    return `${row?.meta?.type} <a class='fielddetailsa' data-field="${row?.meta?.name}" href="#">${choices}</a>${reference}`;
                },

                "bSearchable": true,
                "mDataProp": "meta.type"

            },
            { "mDataProp": "value" },
            { "mDataProp": "display_value" },
            { "mDataProp": "hasdata" }
        ],
        "language": {
            "info": "Matched: _TOTAL_ of _MAX_ fields | Hold down CMD or CTRL to keep window open after clicking a link &nbsp;&nbsp;",
            "infoFiltered": "",
            "infoEmpty": "No matches found"
        },
        "bLengthChange": false,
        "bSortClasses": false,
        "scrollY": "75vh",
        "scrollCollapse": true,
        "paging": false,
        "dom": 'rti<"btns"B>',
        "buttons": [
            "copyHtml5"
        ],
        "initComplete": function (settings, json) {
            document.querySelectorAll('a.fielddetailsa').forEach(a => {
                a.addEventListener('click', function (ev) {
                    ev.preventDefault();
                    let fieldName = a.dataset.field;
                    let fieldData = nme.filter((field) => field.meta.name == fieldName)[0];
                    parseAndShowFieldModal(fieldData.meta);
                });
            });
        }

    });

    dtViewData.column(5).visible(false);

    $('#tbxdataexplore').keyup(function () {
        let srch = ($('#cbxhideempty').prop('checked') ? "hasdata " : "") + $('#tbxdataexplore').val();
        dtViewData.search(srch, true).draw();
    }).focus().trigger('keyup');


    $('#cbxhideempty').change(function (e) {
        let srch = ($('#cbxhideempty').prop('checked') ? "hasdata " : "") + $('#tbxdataexplore').val();
        dtViewData.search(srch, true).draw();
    });

    $('a.referencelink').click(function () {
        event.preventDefault();
        chrome.tabs.create({ "url": $(this).attr('href'), "active": !(event.ctrlKey || event.metaKey) });
    });

    $('#waitingdataexplore').hide();

}


//Function to query Servicenow API
async function snuFetchData(token, url, post, callback) {
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
function escape(htmlStr) {
    if (!htmlStr) return '';
    return htmlStr.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}



// Function to convert JSON to a modern HTML table
function parseAndShowFieldModal(obj) {

    let html = ``;


    let choices = obj.choices;
    delete obj.choices;

    if (choices) {
        console.log(choices);
        html += `<h5>Choices</h5>
        <table class="fieldmodal">
            <thead>
                <tr>
                    <th>Label</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>`;

        choices.forEach(item => {
            html += `<tr>
            <td>${item.label}</td>
            <td>${item.value}</td>
         </tr>`;
        });
        html += `</tbody></table>`;
    }

    html += `<h5>Field properties</h5>
        <table class="fieldmodal">
                    <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>`;
    for (let key in obj) {

        if (obj.hasOwnProperty(key)) {
            let value = obj[key];

            if (typeof value === 'object' && value !== null) {

                if (Array.isArray(value)) {
                    html += `<tr><td>${key}</td><td>`;
                    html += '<table><tr>';
                    let headers = Object.keys(value[0] || {});
                    headers.forEach(header => html += `<th>${header}</th>`);
                    html += '</tr>';
                    value.forEach(item => {
                        html += '<tr>';
                        headers.forEach(header => {
                            html += `<td>${typeof item[header] == 'object' ? '<pre>' + JSON.stringify(item[header], null, 2) + '</pre>' : item[header]}</td>`;
                        });
                        html += '</tr>';
                    });
                    html += '</table>';
                    html += '</td></tr>';
                } else {
                    console.log(key, value);
                    html += `<tr><td>${key}</td><td>${JSON.stringify(value, null, 2)}</td></tr>`;
                }
            } else {
                html += `<tr><td>${key}</td><td>${value}</td></tr>`;
            }
        }
    }

    html += '</table>';

    let dictUrl = `${url}/sys_dictionary.do?sysparm_query=name=javascript:new PAUtils().getTableAncestors('${tableName}')^element=${obj.name}&sysparm_view=advanced`;

    document.getElementById("fieldmodalTableHeader").innerHTML = `Field details: ${obj.label} | <span class="code">${obj.name}</span>  <a href="${dictUrl}" title="Open dictionary entry" target="_blank">&#9881;</a>`;
    document.getElementById("fieldmodalTableContent").innerHTML = html;
    $('#fieldDetailsModal').modal('show');
}

              */

/*ULTIMATE_FORM.CSS*/ 
/*th, td {
    padding: 12px 15px;
    border: 1px solid #ddd;
}

thead {
    background-color: #333;
    color: #fff;
}

tbody tr:nth-child(even) {
    background-color: #f2f2f2;
}

tbody tr:hover {
    background-color: #ddd;
}


*/

/*INJECT.JS*/
/*
document.addEventListener('jamesEvent', function (e) {
    //if (e.detail.type == "code" && (location.host.includes('service-now') || g_ck || location.pathname.endsWith('.do'))) { //basic check for servicenow instance
        var script = document.createElement('script');
        script.textContent = e.detail.content;
        (document.head || document.documentElement).appendChild(script);
   // }
});

function addCustomListOption(count) {
    var body = document.querySelector(".list-mechanic #slush [valign=middle] tbody");
    if (body) {
      var input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Add field";
      input.className = "form-control";
      input.style.marginTop = "2px";
      input.style.marginLeft = "2px";
      input.onkeydown = function (ev) {
        if(ev.code == "Enter"){
          ev.preventDefault();
          var opt = document.createElement("option");
          opt.value = input.value;
          opt.innerHTML = DOMPurify.sanitize(input.value);
          var select = document.querySelector(".list-mechanic #slush [valign=middle] tbody select");
          select.appendChild(opt);
          this.value = "";
          this.innerHTML = "";
        }
      };
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.colspan = "2";
      td.appendChild(input);
      tr.appendChild(td);
      body.appendChild(tr);
    } else if (count < 10) {
      setTimeout(function () {
        count++;
        addCustomListOption(count);
      }, 1000);
    }
  }
  
  var cog = document.querySelectorAll('[data-type="list_mechanic2_open"]');
  for (var i = 0; i < cog.length; i++) {
    cog[i].onclick = function (ev) {
      addCustomListOption(0);
    };
  }
  
  //var button = document.getElementById('jtest_button');
  //var relatedListsButtons = target.parentElement.querySelectorAll('[data-type="list_mechanic2_open"]');
 // console.log(relatedListsButtons);
  //relatedListsButtons.forEach(rlb => {
    //  console.log(rlb.dataset);//?.dataset?.table;  
var relatedListsButtons = document.parentElement.querySelectorAll('[data-type="list_mechanic2_open"]');
  relatedListsButtons.forEach(rlb => {
    let btn = document.createElement("i");
    btn.type = "submit";
    btn.id = "unlockBtn";
    btn.title = "Unlock Form";
    btn.classList = "btn btn-icon icon-unlocked navbar-btn";
    btn.addEventListener('click', (e) => { 
    doUnlock() });
    rlb.parentElement.appendChild()
  });
var z = xml.getElementsByTagName("columns")[0];
  populateSelect(gel('slush_left'), z);

  z = xml.getElementsByTagName("selected")[0];
  populateSelect(gel('slush_right'), z);
  var array = slush.getValues(slush.getRightSelect());
  var r = array.join(",");
  slush.saveRightValues(r);

  // a user list?
  z = xml.getElementsByTagName("choice_list_set")[0];

  var a = z.getAttribute("user_list");
            ni.super_now.wrap
            ni.super_now.compact
            ni.super_now.highlighting
            ni.super_now.field_style_circles
            ni.super_now.list_edit_enable
            ni.super_now.list_edit_double
var ga = new GlideAjax('UIPage');
  ga.addParam('sysparm_name','getList');
  ga.addParam('sysparm_list_view',g_list_view);
  ga.addParam('sysparm_list_parent',g_list_parent);
  ga.addParam('sysparm_list_parent_id',g_list_parent_id);
  ga.addParam('sysparm_list_relationship',g_list_relationship);
  ga.addParam('sysparm_table',g_table);
  ga.getXML(superNowListResponse);

  //[reportField] = array.selectedValues.join(',');
  //$j('#sys_display\\.' + reportField).val(array.selectedLabels.join(', '));
 ga.addParam('sysparm_list_view',g_list_view);
  ga.addParam('sysparm_list_parent',g_list_parent);
  ga.addParam('sysparm_list_parent_id',g_list_parent_id);
  ga.addParam('sysparm_list_relationship',g_list_relationship);
  ga.addParam('sysparm_table',g_table);
  //ga.addParam('sysparm_f',f);
  //ga.addParam('sysparm_name','createListMechanic');
  // ga.addParam('sysparm_reset',true);
  //ga.addParam('sysparm_list_view',g_list_view);
  // ga.addParam('sysparm_list_parent',g_list_parent);
  // ga.addParam('sysparm_list_parent_id',g_list_parent_id);
  // ga.addParam('sysparm_list_relationship',g_list_relationship);
  //ga.addParam('sysparm_table','sys_transform_map');
  // ga.addParam('sysparm_changes',true);
 setTimeout(function(){
      var jtd = document.getElementById('jtest_table_data');
      var tableData = JSON.parse(jtd.value);
      GlideList2.get(document.getElementById(tableData.list_id+'_table')).refreshWithOrderBy(1);
    }, 1);
        //data.instance = window.location.host.split('.')[0];
    //data.open = "tab";
let reqUrl = `/api/now/table/${g_form.getTableName()}/${g_form.getUniqueValue()}?sysparm_display_value=true&sysparm_fields=sys_updated_on,sys_updated_by,sys_created_on,sys_created_by,sys_mod_count,sys_scope`;
    superNowFetchData('', reqUrl, null, res => {
      alert(JSON.stringify(res?.result));
    });



*/