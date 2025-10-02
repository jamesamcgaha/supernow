api.controller=function(spUtil, $http,$window, $scope, $q, $timeout) {
	var c = this;
	
	c.searchText = '';
	c.start = 0;
	c.end = 0;
	c.stop = false;
	c.searching = false;
	c.chunkSize = 100;
	c.chunkSizes = [1,5,10,20,50,100,200,500];
	c.initChunkSize = 100;
	c.innerIndex = 0;			
	c.skipInner = false;
	c.hideInactive = true;
	c.cleaning = false;
	c.startTime = '';
	var cancelRequest = null;
	c.hardTimeout = null;
	c.chunkTarget = 0;
	c.retrieveTableCountOnly = false;
	c.scopes = 'All';
	c.scopeList = '';
	c.includeNone = true;
	c.getIncludedTablesPref = function(val){
		c.includedTables = val || c.data.propVal.userProvided.toString();
	};
	spUtil.getPreference('comprehensive_search.included_tables', c.getIncludedTablesPref);
	c.getExcludedTablesPref = function(val){
		c.excludedTables = val || c.data.propVal.userExcluded.toString();
	};
	spUtil.getPreference('comprehensive_search.excluded_tables', c.getExcludedTablesPref) 
	c.exportColumns = ["Record Name", "Table Label", "Table Name", "Scope", "Record Sys_Id", "Matching Field", "Value"];
	c.data.results = [];

	$scope.range = function(n) {
		return new Array(n);
	};

	c.makeDoubleRecords = function(r){
		r.doubleRecords = new Array(r.records.length * 2);
	};

	c.expandAll = function(r){
		var allExpanded = c.allExpanded(r);
		for(var i = 0; i < r.length; i++){
			r[i].expanded = !allExpanded;
		}
	};

	c.allExpanded = function(r){
		for(var i = 0; i < r.length; i++){
			if(!r[i].expanded){
				return false;
			}
		}
		return true;
	};

	c.getTableList = function(){
		c.server.get({action: 'retrieveTables', propVal: c.data.propVal}).then(function(response){	
			if(response.data.propVal){
				c.data.propVal = response.data.propVal;
			}
		});
	};

	c.resetIncluded = function(){
		c.includedTables = c.data.propVal.userProvided.toString();
	};

	c.resetExcluded = function(){
		c.excludedTables = c.data.propVal.userExcluded.toString();
	};

	c.saveIncluded = function(){
		spUtil.setPreference('comprehensive_search.included_tables', c.includedTables);
	};

	c.saveExcluded = function(){
		spUtil.setPreference('comprehensive_search.excluded_tables', c.excludedTables);
	};

	c.lookupTablesStartingWith = function(startStr, included){
		if(startStr && startStr.length > 0){
			if(included){
				c.including = true;
			}else{
				c.excluding = true;
			}
			startStr = startStr.toLowerCase();
			c.server.get({action: 'lookupTablesStartingWith', startStr: startStr}).then(function(response){
				if(response.data.startsWithTables){
					if(included){
						if(c.includedTables) c.includedTables += ',';
						c.includedTables += response.data.startsWithTables.toString();
						var tableArray = c.includedTables.split(',');
						tableArray = tableArray.filter(function(item, pos) {
							return tableArray.indexOf(item) === pos;
						});
						c.includedTables = tableArray.toString();
						c.saveIncluded();
					}else{
						if(c.excludedTables) c.excludedTables += ',';
						c.excludedTables += response.data.startsWithTables.toString();
						var tableArray = c.excludedTables.split(',');
						tableArray = tableArray.filter(function(item, pos) {
							return tableArray.indexOf(item) === pos;
						});
						c.excludedTables = tableArray.toString();
						c.saveExcluded();
					}
				}else{
					spUtil.addErrorMessage('No tables found starting with "'+startStr+'"');
				}
				if(included){
					c.including = false;
					c.showIncludeSearch = false;
					c.includeSearch = '';
				}else{
					c.excluding = false;
					c.showExcludeSearch = false;
					c.excludeSearch = '';
				}
			}, function(){
				if(included){
					spUtil.addErrorMessage('Error looking up tables to include by prefix.');
					c.including = false;
					c.showIncludeSearch = false;
					c.includeSearch = '';
				}else{
					spUtil.addErrorMessage('Error looking up tables to exclude by prefix.');
					c.excluding = false;
					c.showExcludeSearch = false;
					c.excludeSearch = '';
				}
			});
		}
	};

	c.search = function() {
		if(c.scopes != 'All' && c.scopeList == ''){
			spUtil.addErrorMessage('Must select at least one Application option');
		}else{
			if(c.searchText){
				if(c.searchText.length < 3){
					spUtil.addErrorMessage('Search text must be at least 3 characters long');
				}else{
					c.data.results = [];
					c.searching = true;
					c.finalTables = c.data.propVal.configTables.concat(c.data.propVal.customHandling).concat(c.includedTables.split(','));
					//remove any tables specified in c.excludedTables from the array
					c.finalTables = c.finalTables.filter(function(item, pos) {
						return c.excludedTables.indexOf(item) === -1 && c.finalTables.indexOf(item) === pos;
					});
					if(c.hideInactive){
						var index = c.finalTables.indexOf('sys_metadata_delete');
						if(index > -1){
							c.finalTables.splice(index, 1);
						}
					}
					if(c.excludedTables == 'All') c.finalTables = c.includedTables.split(',');
					c.finalTables = c.finalTables.sort();
					c.start = 0;
					c.end = 0;
					c.stop = false;
					c.skipInner = false;
					c.startTime = '';
					c.tableCount = c.finalTables.length;
					c.innerIndex = 0;
					c.innerRecordsLength = 0;
					c.retrieveTableCountOnly = false;
					c.initChunkSize = c.chunkSize;
					c.chunkTarget = 0;
					if(c.scopes == 'All'){
						c.scopeList = '';
					}
					c.callServer();
				}
			}
		}
	};

	c.getWidgetURL = function() {
		return $scope.widget && $scope.widget.rectangle_id ? "/api/now/sp/rectangle/" + $scope.widget.rectangle_id : "/api/now/sp/widget/" + $scope.widget.sys_id
	},

	c.doHttp = function(input, cancel) {
		return $http({
            method: "POST",
            url: c.getWidgetURL(),
            data: input,
			params: {
				"id": "comprehensive_search"
			},
			headers: {
				Accept: "application/json",
                "x-portal": $scope.portal.sys_id,
                "X-UserToken": $window.g_ck
			},
            timeout: cancel
        });
	};

	c.callServer = function(){
		c.skipResponse = false;
		cancelRequest = $q.defer();
		c.start = c.end;
		c.end = c.start + c.chunkSize;
		if(c.end > c.finalTables.length){
			c.end = c.finalTables.length;
		}
		if(c.start >= c.finalTables.length){
			c.cleaning = true;
			c.server.get({action: 'cleanupRCAUpdates', startTime: c.startTime, globalDefaultSetId: c.data.globalDefaultSetId}).then(function(response){
				c.cleaning = false;
				c.searching = false;
				c.chunkSize = c.initChunkSize;
			});
		}else{
			var tableSubset = c.finalTables.slice(c.start, c.end);

			c.timeoutLength = tableSubset.length == 1 ? 300000 : 30000; // 5 minutes for single table, 30 seconds for multiple tables
			c.hardTimeout = $timeout(function() {
				c.cancelServerCall();
			}, c.timeoutLength);
			
			c.q = c.doHttp({searchText: c.searchText, metadataColumns: c.data.metadataColumns, hideInactive: c.hideInactive, includeNone: c.includeNone, tables: tableSubset.toString(), scopeList: c.scopeList, retrieveTableCountOnly: c.retrieveTableCountOnly}, cancelRequest.promise);
			c.q.then(function(r){
				if (c.hardTimeout) {
					$timeout.cancel(c.hardTimeout); // Cancel the timeout
				}
				if(!c.skipResponse){
					if(r.data.result.invalid_token){
						c.searching = false;
						c.chunkSize = c.initChunkSize;
						spUtil.addInfoMessage('Session expired, please refresh the page');
						return;
					}
					if(r.data && r.data.result) r = r.data.result;
					if(!c.startTime && r.data.startTime){
						c.startTime = r.data.startTime;
					}
					if(c.retrieveTableCountOnly){
						c.retrieveTableCountOnly = false;
						if(r.data.recordsLength){
							c.innerRecordsLength = r.data.recordsLength;
							c.failScenario('size');
						}else{
							c.failScenario('total failure');
						}
					}else{
						if(!c.data.metadataColumns && r.data.metadataColumns) c.data.metadataColumns = r.data.metadataColumns;
						if(!r.data.hasOwnProperty('results')){
							c.innerRecordsLength = r.data.recordsLength;
							c.failScenario('size');
						}else{
							c.data.results = c.data.results.concat(r.data.results);
							if(r.data.hasOwnProperty('recordsLength')){
								c.innerRecordsLength = r.data.recordsLength;
								if(r.data.lastTable){
									c.start = c.finalTables.indexOf(r.data.lastTable);
								}else{
									c.start = c.finalTables.indexOf(c.data.results[c.data.results.length - 1].table);
								}
								if(!c.chunkTarget) c.chunkTarget = c.end;
								c.chunkSize = 1;
								c.end = c.start + 1;
								spUtil.addErrorMessage('Could not retrieve the full results for the table "'+c.finalTables[c.start]+'". Attempting to retrieve each matching record individually now.');
								c.tryInnerSearch();
							}else{
								if(c.chunkTarget && c.end >= c.chunkTarget){
									c.chunkSize = c.initChunkSize;
									c.chunkTarget = 0;
								}
								c.callServer();
							}
						}
					}
				}
			}).catch(function(error){
				if (c.hardTimeout) {
					$timeout.cancel(c.hardTimeout); // Cancel the timeout
				}
				c.skipResponse = true;
				//console['log']('jtest catch!!!!: '+JSON.stringify(error));
				if(c.stop){
					c.searching = false;
					c.chunkSize = c.initChunkSize;
					spUtil.addInfoMessage('Search cancelled');
				}else{
					var statusCode = error.status;
					var retryAfter = error.headers && error.headers('Retry-After');
					if (statusCode === 429 && retryAfter) {
						var delayMs;
						// Retry-After can be in seconds or a date
						if (!isNaN(retryAfter)) {
							// It's in seconds
							delayMs = parseInt(retryAfter, 10) * 1000;
						} else {
							// It's a date string
							var retryDate = new Date(retryAfter);
							var now = new Date();
							delayMs = retryDate - now;
						}
						// Wait, then retry
						console['log']('Received 429. Retrying after ' + delayMs + ' ms.');
						$timeout(function() {
							c.end = c.start;
							c.callServer();
						}, delayMs > 0 ? delayMs : 1000); 
					}else{
						if(c.retrieveTableCountOnly){
							c.failScenario('total failure');
						}else{
							c.failScenario('timeout');
						}
					}
				}
			});
		}
	};

	c.cancelServerCall = function() {
		if (cancelRequest) {
			cancelRequest.resolve(); // Resolve the cancel token to cancel the request
			cancelRequest = null; // Reset the cancel token
		}
	};

	c.stopSearch = function() {
		c.stop = true;
		c.cancelServerCall();
	};

	c.skipInnerSearch = function() {
		c.skipInner = true;
		c.cancelServerCall();
	};

	c.failScenario = function(reason){
		if(reason == 'total failure'){
			c.retrieveTableCountOnly = false;
			spUtil.addErrorMessage('Failed to query the table "'+c.finalTables[c.start]+'". Skipping to the next table.');
			if(c.chunkTarget && c.end >= c.chunkTarget){
				c.chunkSize = c.initChunkSize;
				c.chunkTarget = 0;
			}
			c.innerIndex = 0;
			c.innerRecordsLength = 0;
			c.callServer();
		}else{
			//chunk is more than 1
			if(c.chunkSizes.indexOf(c.chunkSize) > 0){
				if(!c.chunkTarget) c.chunkTarget = c.end;
				c.end = c.start;
				c.chunkSize = c.chunkSizes[c.chunkSizes.indexOf(c.chunkSize)-1];
				if(reason == 'timeout'){
					spUtil.addErrorMessage('Transaction timed out. Retrying with a smaller chunk size.');
				}else{
					spUtil.addErrorMessage('Return object too large. Retrying with a smaller chunk size.');
				}
				c.callServer();
			//switching over to record by record results
			}else if(reason == 'size' && c.innerRecordsLength){
				spUtil.addErrorMessage('Could not retrieve the full results for the table "'+c.finalTables[c.start]+'". Attempting to retrieve each matching record individually now.');
				c.tryInnerSearch();
			//chunk size is 1, and either the reason is timeout or we don't have c.innerRecordsLength
			}else{
				//if we're currently in record by record mode, then we just skip the bad record
				if(c.innerRecordsLength){
					if(reason == 'timeout'){
						spUtil.addErrorMessage('Transaction timed out. Skipping record '+(c.innerIndex+1)+' out of '+c.innerRecordsLength);
					}else{
						spUtil.addErrorMessage('Return object too large. Skipping record '+(c.innerIndex+1)+' out of '+c.innerRecordsLength);
					}
					c.innerIndex++;
					if(c.innerIndex < c.innerRecordsLength){
						c.tryInnerSearch();
					}else{
						c.innerIndex = 0;
						c.innerRecordsLength = 0;
						if(c.chunkTarget && c.end >= c.chunkTarget){
							c.chunkSize = c.initChunkSize;
							c.chunkTarget = 0;
						}
						c.callServer();
					}
				//if we're not in record by record mode, then that means the server called failed (reason=timeout) while just retrieving the one table
				//so, we need to do a server call to just retrieve the count of matching records for that table so that we can switch to record by record mode
				}else{
					c.retrieveTableCountOnly = true;
					//redo the current table
					c.end--;
					c.callServer();
				}
				//TODO: could skip the table and continue. would just need to add a server function to lookup the table name i guess or return that every call
			}
		}
	};

	c.tryInnerSearch = function(){
		c.skipResponse = false;
		cancelRequest = $q.defer();
		c.q = c.doHttp({searchText: c.searchText, metadataColumns: c.data.metadataColumns, hideInactive: c.hideInactive, includeNone: c.includeNone, tables: c.finalTables[c.start], scopeList: c.scopeList, innerIndex: c.innerIndex}, cancelRequest.promise);
		c.q.then(function(r){
			if(!c.skipResponse){
				if(r.data && r.data.result) r = r.data.result;
					if(!r.data.hasOwnProperty('results')){
						c.failScenario('size-inner');
					}else{
						if(r.data.results[0] && r.data.results[0].hasOwnProperty('records')){
							if(c.innerIndex == 0){
								c.data.results.push(r.data.results[0]);
							}else{
								c.data.results[c.data.results.length - 1].records = c.data.results[c.data.results.length - 1].records.concat(r.data.results[0].records);
							}
						}
						c.innerIndex++;
						if(c.innerIndex < c.innerRecordsLength){
							c.tryInnerSearch();
						}else{
							if(c.chunkTarget && c.end >= c.chunkTarget){
								c.chunkSize = c.initChunkSize;
								c.chunkTarget = 0;
							}
							c.innerIndex = 0;
							c.innerRecordsLength = 0;
							c.callServer();
						}
					}
				//}
			}
		}).catch(function(error){ 
			//console['log']('jtest catch!!!!: '+JSON.stringify(error));
			c.skipResponse = true;
			if(c.stop == true){
				c.searching = false;
				c.chunkSize = c.initChunkSize;
				spUtil.addInfoMessage('Search cancelled');
			
			}else{
				var statusCode = error.status;
				var retryAfter = error.headers && error.headers('Retry-After');
				if (statusCode === 429 && retryAfter) {
					var delayMs;
					// Retry-After can be in seconds or a date
					if (!isNaN(retryAfter)) {
						// It's in seconds
						delayMs = parseInt(retryAfter, 10) * 1000;
					} else {
						// It's a date string
						var retryDate = new Date(retryAfter);
						var now = new Date();
						delayMs = retryDate - now;
					}
					// Wait, then retry
					console['log']('Received 429. Retrying after ' + delayMs + ' ms.');
					$timeout(function() {
						c.tryInnerSearch();
					}, delayMs > 0 ? delayMs : 1000); 
				}else{
					if(c.skipInner == true){
						spUtil.addInfoMessage('Skipped the remaining results for the table "'+c.finalTables[c.start]+'"');
						c.skipInner = false;
						if(c.chunkTarget && c.end >= c.chunkTarget){
							c.chunkSize = c.initChunkSize;
							c.chunkTarget = 0;
						}
						c.innerIndex = 0;
						c.innerRecordsLength = 0;
						c.callServer();
					}else{
						c.failScenario('timeout');
					}
				}
			}
		});
	};

	c.formatColumn = function(ws) {
		var range = XLSX.utils.decode_range(ws['!ref']);
		for(var R = range.s.r; R <= range.e.r; ++R) {
			for(var C = range.s.c; C <= range.e.c; ++C) {
				var cell_address = {c:C, r:R};
				var cell_ref = XLSX.utils.encode_cell(cell_address);
				ws[cell_ref].t = 's';
				ws[cell_ref].z = '@';
			}
		}
	};

	c.findMaxWidth = function(w, r) {
		return Math.min(Math.max(w, r[c.col].length), 49);
	};	

	c.export2 = function(){
		var rows = [];
		for(var i = 0; i < c.data.results.length; i++){
			for(var j = 0; j < c.data.results[i].records.length; j++){
				for(var k = 0; k < c.data.results[i].records[j].matches.length; k++){
					var rawVal = c.data.results[i].records[j].matches[k].rawValue;
					if(rawVal.length >= 32767) rawVal = rawVal.substring(0, 32764) + '...';
					rows.push({"Record Name": c.data.results[i].records[j].name, "Table Label": c.data.results[i].tableLabel, "Table Name": c.data.results[i].table, "Scope": c.data.results[i].records[j].scope, "Record Sys_Id": c.data.results[i].records[j].id, "Matching Field": c.data.results[i].records[j].matches[k].field, "Value": rawVal});//.replace(/<strong>/g, '').replace(/<\/strong>/g, '')});
				}
			}
		}
		var worksheet = XLSX.utils.json_to_sheet(rows);
		c.formatColumn(worksheet);
		var workbook = XLSX.utils.book_new();
		worksheet["!cols"] = [];
		for (var l = 0; l < c.exportColumns.length; l++) {
			c.col = c.exportColumns[l];
			var max_width = rows.reduce(c.findMaxWidth, c.col.length);
			worksheet["!cols"].push({
				wch: (max_width + 1)
			});
		}
		var sheetName = 'Results for "' + c.searchText + '"';
		sheetName = sheetName.replace(/[/\\*?[\]]/g, '').trim();
		if(sheetName.length > 31) sheetName = sheetName.substring(0, 28) + '...';
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
		XLSX.writeFile(workbook, 'Comprehensive Search Results - ' + c.searchText.replace(/[^a-zA-Z0-9\s]/g, '') + '.xlsx');								
	};

	c.addEnterListener = function() {
		document.getElementById('story_search').addEventListener('keydown', function(evt) {
			var keycode = evt.keyCode;
			if (keycode === 13) {
				evt.preventDefault();
				c.search();
			}
		});
	};
	c.addEnterListenerInclude = function() {
		document.getElementById('include_search').addEventListener('keydown', function(evt) {
			var keycode = evt.keyCode;
			if (keycode === 13) {
				evt.preventDefault();
				c.lookupTablesStartingWith(c.includeSearch, true);
			}
		});
	};
	c.addEnterListenerExclude = function() {
		document.getElementById('exclude_search').addEventListener('keydown', function(evt) {
			var keycode = evt.keyCode;
			if (keycode === 13) {
				evt.preventDefault();
				c.lookupTablesStartingWith(c.excludeSearch, false);
			}
		});
	};

	//for searching and exporting a large number of text without intervention
	/*c.searches = [];
	c.i=0;
	c.nextOne = function(){
		if(c.searches.length){
			if(c.data.results.length){
				c.export();
			}
			c.i++;
			if(c.i < c.searches.length){
				c.chunkSize = 100;
				c.searchText = c.searches[c.i].toString();
				c.search();
			}
		}
	};
	*/
};