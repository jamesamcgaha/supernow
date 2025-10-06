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
            }else{
                alert('Record deleted successfully');
                chrome.runtime.sendMessage({ action: "superNowCloseTab" });
            }
        });
    });
    document.getElementById('internalNamesOption').addEventListener('click', function() {
        showInternalNames = !showInternalNames;
        const intEl = document.getElementById('checkShowInternalNames');
        intEl.classList.toggle('checked', showInternalNames);
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
    let data = `sysparm_ck=${g_ck}&sys_target=${tableName}&sys_uniqueValue=${sysId}&sys_action=${action}`;
    inputs.forEach(input => {
        // remove the last 6 characters from input.name
        const key = input.name.slice(0, -6);
        // don't pass empty passwords back
        if((metaDataObject.result.columns[key].type != 'password' && metaDataObject.result.columns[key].type != 'password2') || input.value != '**********'){
            data += `&${tableName}.${key}=${encodeURIComponent(input.value)}`;
        }
    });
    
    const oldTbody = document.querySelector('tbody');
    const newTbody = document.createElement('tbody');
    oldTbody.parentNode.replaceChild(newTbody, oldTbody);
    // need to clear the search inputs
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.value = '';
    });
    var searchUrl = url + '/' + tableName + '.do';
    const { promise, cancel } = superNowFetch(g_ck, searchUrl, {method: 'POST', body: data}, 'application/x-www-form-urlencoded');
    promise.then(results => {
        if(results.status && results.status != '200' && results.status != '201'){
            alert('Error updating record: ' + results.status + ' ' + results.statusText);
            location.reload();
        }else{
            if(results){
                const messageDiv = document.getElementById('output_messages');
                // Sanitize the results before inserting into DOM
                const sanitizedResults = window.DOMPurify ? window.DOMPurify.sanitize(results) : results;
                messageDiv.innerHTML = sanitizedResults;
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
        }
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
                    // remove onclick attribute from close button
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
            // remove disabled from displayValueInput.value 
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