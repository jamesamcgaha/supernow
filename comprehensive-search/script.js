(function() {
	if(!input){
		var defaultPropVal = `
		{
			"lastUpdated": "",
			"configTables": [],
			"customHandling": ["scrum_theme", "sys_choice", "sys_element_mapping", "sys_flow_cat_variable_model", "sys_flow_catalog_trigger", "sys_flow_compiled_flow ", "sys_flow_compiled_flow_chunk ", "sys_flow_email_trigger", "sys_flow_record_trigger", "sys_flow_subflow_plan", "sys_flow_trigger", "sys_flow_trigger_plan", "sys_hub_action_input_action_instance", "sys_hub_action_instance", "sys_hub_action_plan", "sys_hub_action_status_metadata", "sys_hub_flow_component", "sys_hub_flow_logic", "sys_hub_flow_stage", "sys_hub_input_scripts", "sys_hub_pill_compound", "sys_hub_step_instance", "sys_hub_sub_flow_instance", "sys_hub_trigger_instance", "sys_pd_lane", "sys_pd_activity", "sys_pd_snapshot", "sys_pd_snapshot_chunk", "sys_pd_trigger_instance", "sys_portal", "sys_portal_preferences", "sys_trigger_runner_mapping", "sys_ui_annotation", "sys_ui_element", "sys_ui_form_section", "sys_ui_list_element", "sys_ui_related_list_entry", "sys_variable_value", "wf_activity", "wf_condition", "wf_condition_default", "wf_estimated_runtime_config", "wf_stage", "wf_transition", "wf_versionable", "wf_workflow_instance", "wf_workflow_version"],
			"userProvided": ["sys_properties","sys_user_group","kb_knowledge","kb_knowledge_base","kb_category","cmdb_application_product_model"],
			"userExcluded": ["sys_ux_lib_asset"]
		}`;
		var grAttachment = new GlideRecord('sys_attachment');
		if(grAttachment.get("table_sys_id", '7232bfd583143210675fccb6feaad301')){
			var reader = new global.AttachmentReader();
			var content = reader.getContent(grAttachment);
			try{
				data.propVal = JSON.parse(content);
			}catch(e){
				data.propVal = JSON.parse(defaultPropVal);
				gs.addErrorMessage('Error parsing the value of the <a href="/sys_attachment.do?sys_id='+grAttachment.getUniqueValue()+'" target="_blank">comprehensive_search_tables.txt</a> attachment');
				gs.error('Comprehensive Search: Error parsing the value of the comprehensive_search_tables.txt attachment: '+e);
			}
		}else{
			data.propVal = JSON.parse(defaultPropVal);
		}
		if(!data.propVal.configTables.length){
			retrieveTables();
		}
		if(data.propVal.lastUpdated){
			var gdt = new GlideDateTime();
			gdt.setValue(data.propVal.lastUpdated);
			//if lastupdated is more than a week in the past, refresh table list
			var oneWeekAgo = new GlideDateTime();
			oneWeekAgo.addDaysUTC(-7);
			if(gdt.before(oneWeekAgo)){
				retrieveTables();
			}else{
				data.propVal.lastUpdated = gdt.getDisplayValue();
			}
		}else{
			data.propVal.lastUpdated = 'Never';
		}
		//find default global update set
		data.globalDefaultSetId = 'NULL';
		var grSet = new GlideRecord('sys_update_set');
		grSet.addEncodedQuery('name=Default^application=global');
		grSet.query();
		if(grSet.next()){
			data.globalDefaultSetId = grSet.getUniqueValue();
		}
	}else if(input.action == 'retrieveTables'){
		data.propVal = input.propVal;
		retrieveTables();
	}else if(input.action == 'cleanupRCAUpdates'){
		var rcaUpdates = '';
		var gr = new GlideRecord('sys_restricted_caller_access');
		gr.addEncodedQuery('source=7232bfd583143210675fccb6feaad301^source_table=sp_widget^sys_updated_on>='+input.startTime);
		gr.query();
		if(gr.next()) rcaUpdates = 'sys_restricted_caller_access_'+gr.getUniqueValue();
		while(gr.next()){
			rcaUpdates += ',sys_restricted_caller_access_'+gr.getUniqueValue();
		}
		if(rcaUpdates){
			var grDel = new GlideRecord('sys_update_xml');
			grDel.addEncodedQuery('nameIN'+rcaUpdates+'^sys_updated_on>='+input.startTime+'^update_set!='+input.globalDefaultSetId);
			grDel.query();
			grDel.setValue('application', 'global');
			grDel.setValue('update_set', input.globalDefaultSetId);
			grDel.updateMultiple();
		}
	}else if(input.action == 'lookupTablesStartingWith'){
		data.startsWithTables = [];
		var tables = new GlideRecord('sys_db_object');
		tables.addEncodedQuery('nameSTARTSWITH'+input.startStr);
		tables.orderBy('name');
		tables.query();
		while(tables.next()){
			data.startsWithTables.push(tables.getValue('name'));
		}
		data.startsWithTables = data.startsWithTables.toString();
	}else{
		var searchText = input.searchText.trim();
		data.results = [];
		data.startTime = new GlideDateTime().getValue();
		if(input.metadataColumns){
			data.metadataColumns = input.metadataColumns;
		}else{
			data.metadataColumns = {};
			var metadataFields = new GlideRecord('sys_dictionary');
			var q2 = 'name=sys_metadata^elementISNOTEMPTY^elementNOT INsys_update_name,sys_created_by,sys_updated_by^internal_typeNOT INpassword,password2,glide_var,journal,journal_input,journal_list,user_roles^internal_type.scalar_type=string';
			if(searchText.length == 32){
				q2 += '^ORinternal_type.scalar_type=GUID'; 
			}else{
				q2 += '^internal_type!=GUID';
			}
			metadataFields.addEncodedQuery(q2);
			metadataFields.query();
			while(metadataFields.next()){
				if(metadataFields.getValue('internal_type') == 'GUID' || metadataFields.internal_type.scalar_type == 'GUID'){
					data.metadataColumns[metadataFields.getValue('element')] = 'GUID';
				}else{
					data.metadataColumns[metadataFields.getValue('element')] = metadataFields.internal_type.scalar_type.toString();
				}
			}
		}
		var tables = new GlideRecord('sys_db_object');
		tables.addEncodedQuery('nameIN'+input.tables);
		tables.orderBy('name');
		tables.query();
		var columns = {};
		var recordsArray = [];
		var matches = [];
		var normalizedStr2 = searchText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		if(tables.hasNext()){
			while(tables.next()){
				try{
					columns = {};
					var tableName = tables.getValue('name');
					var allTables = tableName;
					var tempTableGr = tables.getElement('super_class');
					while(tempTableGr){
						tempTableGr = tempTableGr.getRefRecord();
						tempName = tempTableGr.getValue('name');
						if(tempName == 'sys_metadata'){
							columns = JSON.parse(JSON.stringify(data.metadataColumns));
							break;
						}else{
							allTables += ','+tempName;
							tempTableGr = tempTableGr.getElement('super_class');
						}
					}
					var fields = new GlideRecord('sys_dictionary');
					var q = 'nameIN'+allTables+'^elementISNOTEMPTY^elementNOT INsys_update_name,sys_created_by,sys_updated_by^internal_typeNOT INcompressed,password,password2,glide_var,journal,journal_input,journal_list,user_roles^internal_type.scalar_type=string';
					if(searchText.length == 32){
						q += '^ORinternal_type.scalar_type=GUID'; 
					}else{
						q += '^internal_type!=GUID';
					}
					fields.addEncodedQuery(q);
					fields.query();
					if(!fields.hasNext()){
						continue;
					}
					while(fields.next()){
						if(fields.getValue('internal_type') == 'GUID' || fields.internal_type.scalar_type == 'GUID'){// || fields.getValue('internal_type') == 'user_roles'){
							columns[fields.getValue('element')] = 'GUID';
						}else if(fields.getValue('internal_type') == 'user_roles'){ //currently not including user roles
							columns[fields.getValue('element')] = 'user_roles';
						}else{
							columns[fields.getValue('element')] = fields.internal_type.scalar_type.toString(); //currently will always be a string
						}
					}

					var records =  new GlideRecord(tableName);
					if(!records.isValid()){
						gs.error('jtest script search error: invalid table: '+tableName); 
						continue;
					}
					var add = '';
					for(var c in columns){
						if(records.isValidField(c)){
							var operand = columns[c] == 'string' ? 'CONTAINS' : columns[c] == 'user_roles' ? 'IN' : '=';
							if(!add){
								add = records.addQuery(c, operand, searchText);
							}else{
								add.addOrCondition(c, operand, searchText); 
							}
						}
					}
					if(records.isValidField('sys_class_name')){
						records.addQuery('sys_class_name', '=', tableName);
					}
					if(input.hideInactive && records.isValidField('active')){
						records.addActiveQuery();
					}
					if(input.scopeList && records.isValidField('sys_scope')){
						records.addEncodedQuery('sys_scope.scopeIN'+input.scopeList);
						//if(input.scopes != 'all' && input.scopes != 'none' && records.isValidField('sys_scope')){
						//records.addEncodedQuery(input.scopes);
					}
					if(input.hasOwnProperty('innerIndex')){
						records.chooseWindow(input.innerIndex, input.innerIndex+1); 
					}
					records.orderByDesc('sys_created_on');
					records.query();

					recordsArray = [];
					if(input && input.retrieveTableCountOnly){
						data.recordsLength = records.getRowCount();
						break;
					}
					while(records.next()){
						matches = [];
						for(var c2 in columns){
							var val  = records.getValue(c2);
							if(val){
								if((columns[c2] == 'string' && val.toLowerCase().indexOf(searchText.toLowerCase()) != -1) || (columns[c2] == 'GUID' && val.toLowerCase() == searchText.toLowerCase())){
									var rawVal = val;
									val = htmlEntities(val);
									var escapedSearch = htmlEntities(searchText);
									escapedSearch = escapedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
									var re = new RegExp('(' + escapedSearch + ')', 'ig');
									val = val.replace(re, '<strong>$1</strong>');
									matches.push({field: c2, value: val, rawValue: rawVal});
								}else if(columns[c2] == 'string' && val == "PROTECTEDSCRIPT:"){
									matches.push({field: c2, value: 'PROTECTEDSCRIPT:', rawValue: 'PROTECTEDSCRIPT:'});
								}else if(columns[c2] == 'string' && /[^\u0000-\u007F]/.test(val)){
									// Normalize both strings to NFD and remove diacritic marks
									var normalizedStr1 = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
									if(normalizedStr1.indexOf(normalizedStr2) != -1){
										var rawVal = val;
										matches.push({field: c2, value: val, rawValue: rawVal});

									}
								}
							}
						}
						if(!matches.length){
							//most likely due to the real text having diacritc marks 
							gs.error('jtest script search error: '+tableName +'/'+ records.getEncodedQuery()+'/'+records.getUniqueValue());
							matches.push({field: 'N/A', value: 'Could not retrieve matched value', rawValue: 'Could not retrieve matched value'});
						}
						if(matches.length){
							var id = records.getUniqueValue();
							var name = '';
							var scope = 'None';
							//TODO: add support for other tables like Flows
							if(tableName == 'sys_variable_value'){
								if(records.getValue('document') == 'wf_activity'){
									var activityId = records.getValue('document_key');
									if(activityId){
										var act = new GlideRecord('wf_activity');
										if(act.get(activityId)){
											var activityName = act.getValue('name');
											if(act.getValue('workflow_version')){
												var workflow = act.workflow_version.getRefRecord();
												if(input.hideInactive){
													if(workflow.getValue('published') != '1' && !workflow.getValue('checked_out')){
														continue;
													}
													name = workflow.getValue('name') + ': ' + activityName;
												}else{
													name = workflow.getValue('name') + ': ' + activityName + '('+records.getDisplayValue()+')';
												}
												if(workflow.getValue('workflow')){
													var workflowParent = workflow.workflow.getRefRecord();
													scope = workflowParent.getDisplayValue('sys_scope');
												}
											}
										}
									}
								}else{
									var activityId2 = records.getValue('document_key');
									if(activityId2){
										var grDoc = new GlideRecord(records.getValue('document'));
										if(grDoc.get(records.getValue('document_key'))){
											name = grDoc.getClassDisplayValue()+': '+grDoc.getDisplayValue() + ' - '+ records.getDisplayValue();
											if(grDoc.isValidField('sys_scope')) scope = grDoc.getDisplayValue('sys_scope');
										}
									}
								}
							}else{
								if(records.isValidField('sys_scope')){
									scope = records.getDisplayValue('sys_scope');
								}
							}
							if(!name) name = records.getDisplayValue();
							if(!name) name = id;

							recordsArray.push({id: id, name: name, scope: scope, matches: matches});
						}
					}
					var test = '';
					if(recordsArray.length){
						var tooMuch = false;
						try{
							test = JSON.stringify(recordsArray);
						}catch(e){
							test = '';
							gs.error('jtest script search error: stringify catch1: '+e);
							if(input.hasOwnProperty('innerIndex')){
								for(var j = 0; j < recordsArray[0].matches.length; j++){
									if(recordsArray[0].matches[j].value.length > 100){
										recordsArray[0].matches[j].value = 'Value too long to display';
										recordsArray[0].matches[j].rawValue = 'Value too long to display';
									}
								}
								try{
									test = JSON.stringify(recordsArray);
								}catch(e){
									test = '';
									gs.error('jtest script search error: stringify catch2: '+e);
									recordsArray[0].matches = [{field: 'N/A', value: 'Value too long to display', rawValue: 'Value too long to display'}];
								}
							}else{
								tooMuch = true;
								data.lastTable = tableName;
								data.recordsLength = records.getRowCount();
							}
						}
						if(!tooMuch){
							data.results.push({table: tableName, tableLabel: tables.getValue('label'), records: recordsArray});
							try{
								test = JSON.stringify(data.results);
							}catch(e){
								test = '';
								gs.error('jtest script search error: stringify catch3: '+e);
								data.results.pop();
								data.lastTable = tableName;
								data.recordsLength = records.getRowCount();
								break;
							}
						}else{
							break;
						}
					}
				}catch(e){
					gs.error('jtest script search error1: '+e);
					gs.error('jtest script search error2: '+tables.getValue('name'));
				}
			}
		}else{
			data.done = true;
		}
	}
	function htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	function retrieveTables(){
		var grDict = new GlideRecord('sys_dictionary');
		grDict.addEncodedQuery('internal_type=collection^attributesLIKEupdate_synch=true^ORattributesLIKEupdate_synch_custom=true');
		grDict.query();
		var tables = [];
		while(grDict.next()){
			tables.push(grDict.getValue('name'));
		}
		var appTables = [];
		var ar = GlideDBObjectManager.get().getAllExtensions('sys_metadata');
		for (var i = 0; i < ar.size(); i++) {
			appTables[i] = ar.get(i);
		}
		var customHandlingTables = data.propVal.customHandling;
		var allTables = appTables.concat(tables).concat(customHandlingTables);
		var grTables = new GlideRecord('sys_db_object');
		grTables.addEncodedQuery('caller_access=1^ORcaller_access=^ORsys_scope=global^read_access=true^ORread_accessISEMPTY^ORsys_scope=global^nameIN'+allTables.join(','));
		//grTables.addEncodedQuery('nameIN'+allTables.join(','));
		grTables.query();
		data.propVal.configTables = [];
		while(grTables.next()){
			data.propVal.configTables.push(grTables.getValue('name'));
		}
		data.propVal.lastUpdated = new GlideDateTime().getValue();
		var widget = new GlideRecord('sp_widget');
		widget.get('7232bfd583143210675fccb6feaad301');
		var gsa = new GlideSysAttachment();
		gsa.deleteAll(widget);
		gsa.write(widget, "comprehensive_search_tables.txt", 
		'text/plain', JSON.stringify(data.propVal));
		var gdt = new GlideDateTime();
		gdt.setValue(data.propVal.lastUpdated);
		data.propVal.lastUpdated = gdt.getDisplayValue();
	}
	
})();