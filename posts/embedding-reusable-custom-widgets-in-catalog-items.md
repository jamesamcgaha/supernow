---
title: "Embedding Reusable Custom Widgets in Catalog Items"
date: "2026-02-25"
excerpt: "Level up your request forms with advanced custom inputs and components."
author: "James McGaha"
tags: ["development", "deep dive", "service portal"]
hidden: true
---
In general, the best catalog items are simple, straightforward, and easy to maintain. Adding custom embedded widgets to a catalog form can often make support and future enhancements more complicated and confusing. However, when used correctly, reusable custom widgets can add significant value across your whole catalog while introducing minimal additional complexity. 

For example, if you have many catalog items with a shipping address section, you could create a single, configurable widget for a typeahead address input with API validation. A widget like this could greatly improve both the user experience and the quality of the provided address data. Additionally, if built correctly, adding in that upgraded custom input to a form can be as easy as adding one new variable record without requiring any changes to the existing form logic.

In this post, I'll walk through three examples of reusable catalog item widgets which cover what I consider to be the most effective patterns and the most common use-cases. For each example, I've included screenshots and the code for the widget. Additionally, if you want to see the widgets in action, you can download [Reusable Custom Widgets for Catalog Items](https://developer.servicenow.com/connect.do#!/share/contents/2146901_reusable_custom_widgets_for_catalog_items?t=PRODUCT_DETAILS) from ServiceNow Share where I've added these widgets to an example catalog item.
## Example 1: Loading Indicators
:::tabs
:::tab Screenshot
![Loading Indicators Widget](images/loading-indicators-widget.png)
:::tab HTML
```html
<div id="supernow-loading-field" class="sp-loading-indicator" ng-class="'v'+widget.sys_id" style="display: none;">
  <div></div>
  <div></div>
  <div></div>
</div>

<div id="supernow-loading-block-skeleton" ng-class="'v'+widget.sys_id" style="display: none">
  <div class="supernow-loading-block-skeleton">
    <div class="loading card-title shorter-s"></div>
    <div class="loading table-content"></div>
    <div class="loading card-title shorter-m"></div>
    <div class="loading table-content"></div>
    <div class="loading card-title shorter-xs"></div>
    <div class="loading table-content"></div>
  </div>
</div>

<div id="supernow-loading-block-loader" ng-class="'v'+widget.sys_id" style="display: none">
    <div class="supernow-mug-container">
      <div class="supernow-mug">
        <div class="supernow-coffee"></div>
      </div>
      <span class="loader-text">
        Loading . . .
      </span>
    </div>
</div>

<div id="supernow-loading-overlay" ng-class="'v'+widget.sys_id" style="display: none">
  <div id="supernow-loading-overlay-inner">
    <div class="supernow-mug-container">
      <div class="supernow-mug">
        <div class="supernow-coffee"></div>
      </div>
      <span id="supernow-loading-overlay-text" class="loader-text">
        Loading . . .
      </span>
    </div>
  </div>
</div>

<style>
  #catItemTop > * {
    position: relative;
  }
</style>
```
:::tab Client Script
```javascript
api.controller=function($scope, $rootScope) {
	var c = this;
	c.activeLoaders = {};
	c.madeReadOnlyFields = {};
	c.movedOverlay = false;

	/*
		PROPERTIES:
		type
			Description: the type of loader to show (small loading icon next to a field's label, a placeholder loader to indicate field will soon be shown in that area, a loader showing below a field on the form along with loading text, or a whole-form overlay loader that will prevent interacting with the form while loading)
			Value: "field", "block-skeleton", "block-loader", or "overlay"
			Default: "overlay"
		action
			Description: whether to hide or show the loader specified
			Value: "show" or "hide"
			Default: "show" (unless a matching loader already exists and is displayed)
			Applies for type: All
		text: 
			Description: the text to show below the loading animation
			Value: any string
			Default: "Loading . . ."
			Applies for type: "block-loader" and "overlay"
		field:
			Description: the field to attach the loader to or below
			Value: the name of any variable in the catalog item
			Default: the variable embedding this widget
			Applies for type: "field", "block-skeleton", and "block-loader"
		disableField:
			Description: whether the corresponding field should be made read-only while loading
			Value: true or false
			Default: true
			Applies for type: "field", "block-skeleton", and "block-loader"
			
		EXAMPLES:
		{type: 'field', field: 'test' disableField: false}
		{type: 'block-loader', field: 'test', action: 'show'}
		{text: 'Loading form data . . . '}
	*/
	var fieldChangeListener = $rootScope.$on("field.change."+$scope.page.field.name, function(evt, parms) {
		if(parms.newValue){
			try{
				var val = JSON.parse(parms.newValue);
				var show = true;
				var el;
				var textElement;
				if(val.type == 'field' || val.type == 'block-skeleton' || val.type == 'block-loader'){
					if(!val.field) val.field = $scope.page.field.name;
					el = document.getElementById("supernow-loading-"+val.type+"-"+val.field);
					if(val.hasOwnProperty('action')){
						show = val.action == 'show';
					}else if(el){
						show = el.style.display == 'none';
					}
					if(show){
						if(!el){
							var p = document.getElementById("supernow-loading-"+val.type);
							el = p.cloneNode(true);
							el.id = "supernow-loading-"+val.type+"-"+val.field;
							var fieldLabel = val.type == 'field' ? $('#'+val.field+' label.field-label')[0] : $('#'+val.field+':has(.form-group)')[0];
							fieldLabel.appendChild(el);
						}
						if(val.type == 'block-loader'){
							textElement = $('#supernow-loading-block-loader-'+val.field+' .loader-text')[0];
							textElement.innerHTML = val.text ? val.text : 'Loading . . .';
						}
						el.style.display = val.type == 'field' ? 'inline-flex' : 'block';
						if(!val.hasOwnProperty('disableField') || val.disableField === true || val.disableField === 'true'){
							if(!$scope.page.g_form.isReadOnly(val.field)){
								c.madeReadOnlyFields[val.field] = true;
								$scope.page.g_form.setReadOnly(val.field, true);
							}
						}
						c.activeLoaders[val.type+'-'+val.field] = true;
					}else{
						el.style.display = 'none';
						if(val.type == 'block-loader'){
							textElement = $('#supernow-loading-block-loader-'+val.field+' .loader-text')[0];
							textElement.innerHTML = '';	
						} 
						if(c.madeReadOnlyFields.hasOwnProperty(val.field)){
							delete c.madeReadOnlyFields[val.field];
							$scope.page.g_form.setReadOnly(val.field, false);
						}
						delete c.activeLoaders[val.type+'-'+val.field];
					}
				}else{
					el = document.getElementById('supernow-loading-overlay');
					textElement = document.getElementById('supernow-loading-overlay-text');
					if(val.hasOwnProperty('action')){
						show = val.action == 'show';
					}else if(el){
						show = el.style.display == 'none';
					}
					if(show){
						if(!c.movedOverlay){
							var catItem = document.getElementById('catalog-form');
							catItem.appendChild(el);
						}
						textElement.innerHTML = val.text ? val.text : 'Loading . . .';
						el.style.display = 'block';
						c.activeLoaders.overlay = true;
					}else{
						el.style.display = 'none';
						textElement.innerHTML = '';
						delete c.activeLoaders.overlay;
					}
				}
			}catch(e){
				console.log('Could not set a loading indicator using the value: '+parms.newValue+'\n\nEnsure that the value you are setting is valid JSON with double quotes around both property names and string values');
			}
			$scope.page.g_form.clearValue($scope.page.field.name);
		}
	});
	$scope.$on("$destroy", fieldChangeListener);

	$scope.page.g_form.$private.events.on('onSubmit', function(){
		if(Object.keys(c.activeLoaders).length){
			$scope.page.g_form.addErrorMessage('Please wait for the form to finish loading');
			return false;
		}
	});	
};
```
:::tab CSS
```css
/* block-skeleton */
.supernow-loading-block-skeleton .card-title.loading {
  margin-bottom: 5px;
  height: 14px;
}
.supernow-loading-block-skeleton .card-title.loading.shorter-s{
  width: 25%;
}
.supernow-loading-block-skeleton .card-title.loading.shorter-m{
  margin-top: 21px;
  width: 30%;
}
.supernow-loading-block-skeleton .card-title.loading.shorter-xs{
  margin-top: 21px;
  width: 20%;
}
.supernow-loading-block-skeleton .loading {
  position: relative;
  background-color: #f1f1f1;
  overflow: hidden;
}
.supernow-loading-block-skeleton .table-content.loading {
  border-radius: 4px;
  height: 34px;
  width: 100%;
}
.supernow-loading-block-skeleton .loading::after {
  content: "";
  position: absolute;
  animation: 2s supernow-block-loading linear 0.5s infinite;
  background: linear-gradient(90deg, transparent, #e6e6e6, transparent);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
@keyframes supernow-block-loading {
  0% {
    transform: translateX(-100%);
  }
  60% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}
/* overlay */ 
#supernow-loading-overlay-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 19;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
}
/* coffee mug for overlay and block-loader */
.supernow-mug {
  width: 40px;
  height: 45px;
  display: inline-block;
  position: relative;
  border: 4px solid #206AAA;
  animation: fill 2s linear infinite alternate;
  color: rgba(#a05425, 0.9);
  border-radius: 0 0 4px 4px;
  z-index: 5;
  &::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid #206AAA;
    width: 20px;
    height: 25px;
    border-radius: 0 8px 8px 0;
  }
}
.supernow-coffee{
  position: absolute;
  left: 2px;
  right: 2px;
  bottom: 2px;
  margin: 2px;
  background: #a05425;
  border-radius: 0 0 6px 6px;
  animation: supernow-coffee 4s ease-in-out infinite alternate-reverse;
}
@keyframes supernow-coffee {
  from {
    top: calc(100% - 35px);
  }
  to {
    top: calc(100% - 7px);
  }
}
.supernow-mug-container .loader-text {
  font-size: 1.3em;
  font-weight: 600;
  color: #206AAA;
  margin-top: 15px;
}
.supernow-mug-container .loader-text {
  color: #002677;
}
.supernow-mug-container{
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```
:::endtabs
This example widget doesn't capture any user input; instead, catalog client scripts can trigger it to show various loading indicators on the form. One example where a widget like this would be useful is if a form includes a slow-running script or API call. In that scenario, you could see issues from the user modifying the values of other variables while the GlideAjax is still running and the data returned from the GlideAjax might no longer be relevant when it finally hits the callback. This widget allows you to make the loading more prominent or use an overlay to prevent user interaction with the form until loading completes.
### 1. How to create the variable for embedding the widget
To add a widget to a form, you need a variable with:
1. A Type value of Custom, Custom with Label, or Single Line Text.
2. A widget referenced in the Widget (sp_widget) field and/or a value in the Default Value field like `{widget: 'supernow-loading-indicators'}`.
A. *If using Single Line Text, the Widget field must have a value.*
B. *If both are specified and are different, the widget specified in the default value is used.*

For this example, we don't want the widget variable itself to display or take up any space on the form. So, we use the Type "Custom" to not have a label included and we check the "Hidden" checkbox for the variable.
### 2. How to trigger the widget from a client script
The easiest way to communicate to and from a widget is to set values on the form and listen for those changes.

An embedded widget comes with built-in access to g_form through $scope.page.g_form (don't forget to inject $scope into your controller), which makes it easy to set values from the widget. To set up the widget to listen for changes to a variable's value, the most straightforward option is to inject $rootScope into the controller and set up a listener for the event name "field.change". The function attached to that listener will trigger on any variable's value changing, but if you want to listen just for changes to a specific variable, append that variable name to the event name like "field.change.variable_name".

In this example, a client script triggers the widget by setting the value of the variable that embeds the widget. So, it has a watcher like this:
```javascript
var fieldChangeListener = $rootScope.$on("field.change."+$scope.page.field.name, function(evt, parms) {
   [ . . . ]
});
$scope.$on("$destroy", fieldChangeListener);
```
*Notes:*
1. *The widget can access the name of the variable it is embedded in by using `$scope.page.field.name`.*
2. *The changed variable's value is in the "newValue" property of the second parameter.*
3. *Important: when setting a watcher on $rootScope, ensure that you clear that watcher when the current scope is destroyed (as shown in the example above)*

This example expects a client script to set its variable's value to be an object containing the details of the loading indicator to be shown. The listener clears out the value of its variable so that the value set is treated like a "message", rather than maintaining the state of the loaders in the variable value itself.
### 3. How to add elements elsewhere in the form
In this example, we want to add loading indicators elsewhere in the form and not be limited to just displaying where the widget's variable is placed. It's easy to use JavaScript to clone, move, or create elements. However, be aware that moving an element preserves its AngularJS linkages to the controller, but cloning or creating an element does not. In this example, that distinction isn't important. However, if the loading elements needed access to the controller scope, you could use an ng-repeat to generate as many elements as needed and move those, instead of cloning and moving.

One other important thing to note is that all the selectors defined in the widget's CSS field will have a class selector of "v" plus the widget's sys_id prepended. This means that elements you move or create outside of the widget's element won't have the widget's CSS applied. For this example, this issue was avoided by manually appending a matching class to each element moved outside the widget and also just defining simple styling inline in the HTML. *Alternatively, you could create a &lt;style&gt; element in the HTML or add your styling to a portal-wide stylesheet, but with that approach it's important to keep your selectors very specific as those selectors will apply to the whole page or portal respectively.* 
### 4. How to handle onSubmit validation
If your widget needs to perform some validation onSubmit, the officially recommended option would be to keep some hidden variable on the form up to date with whatever data is relevant for the onSubmit check (setting the value of that variable in the widget using `$scope.page.g_form.setValue`). This allows you to use a normal onSubmit catalog client script to perform validation using the data stored in the hidden variable.

However, that approach makes your reusable widget less "plug and play", as you'll need to add onSubmit client script logic to every form where your widget is included. So, in this example, we use an undocumented g_form event listener with the code: `$scope.page.g_form.$private.events.on('onSubmit', function(){ [ . . . ] });`. The specified function will work the same as an onSubmit client script, allowing you to block submission using `return false;`—except in this function you can access all the data from your widget's scope.
## Example 2: Time Picker
:::tabs
:::tab Screenshot
![Time Picker Widget](images/time-picker-widget.png)
:::tab HTML
```html
<div uib-timepicker 
     ng-model="c.selectedTime" 
     ng-change="c.storeValue()" 
     ng-disabled="page.field.isReadonly()"
     hour-step="options.hourStep" 
     minute-step="options.minuteStep" 
     show-seconds="options.showSeconds" 
     second-step="options.secondStep" 
     show-meridian="options.showMeridian" 
     meridians="options.meridians"
     show-spinners="options.showSpinners" 
     mousewheel="options.mousewheel"
     arrowkeys="options.arrowkeys" 
     readonly-input="options.readonlyInput" 
     min="options.min" 
     max="options.max"> 
</div>
```
:::tab Client Script
```javascript
api.controller=function($scope, $rootScope) {
	var c = this;

	c.dateFromString = function(string){
		if(string){
			var timeParts = string.split(':');
			var hourPart = parseInt(timeParts[0], 10);
			if(hourPart){
				var date = new Date();
				date.setHours(parseInt(timeParts[0], 10));
				if(timeParts.length > 1){ 
					date.setMinutes(parseInt(timeParts[1], 10) || 0);
					if(timeParts.length > 2){
						date.setSeconds(parseInt(timeParts[2], 10) || 0);
					}else{
						date.setSeconds(0);
					}
				}else{
					data.setMinutes(0);
				}
				return date;
			}
		}
		return undefined;
	};
	
	c.stringFromDate = function(date){
		var timeString = '';
		if(date){
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			timeString += (hours < 10 ? "0" + hours : hours) + ":";
			timeString += (minutes < 10 ? "0" + minutes : minutes) + ":";
			timeString += $scope.options.showSeconds ? (seconds < 10 ? "0" + seconds : seconds) : '00';
		}
		return timeString;
	};
	
	c.storeValue = function() {
		c.storedValue = c.stringFromDate(c.selectedTime);
		$scope.page.g_form.setValue($scope.page.field.name, c.storedValue);
	};

	var fieldChangeListener = $rootScope.$on("field.change."+$scope.page.field.name, function(evt, parms) {
		if(parms.newValue != c.storedValue){
			c.selectedTime = c.dateFromString(parms.newValue);
		}
	});
	$scope.$on("$destroy", fieldChangeListener);
	
	if(!$scope.options.hasOwnProperty('showSpinners')) $scope.options.showSpinners = true;
	if(!$scope.options.hasOwnProperty('showMeridian')) $scope.options.showMeridian = true;
	if(!$scope.options.hasOwnProperty('showSeconds')) $scope.options.showSeconds = false;
	if(!$scope.options.hasOwnProperty('hourStep')) $scope.options.hourStep = 1;
	if(!$scope.options.hasOwnProperty('minuteStep')) $scope.options.minuteStep = 1;
	if(!$scope.options.hasOwnProperty('secondStep')) $scope.options.secondStep = 1;
	if(!$scope.options.hasOwnProperty('readonlyInput')) $scope.options.readonlyInput = false;
	if(!$scope.options.hasOwnProperty('mousewheel')) $scope.options.mousewheel = true;
	if(!$scope.options.hasOwnProperty('arrowkeys')) $scope.options.arrowkeys = true;
	if(!$scope.options.hasOwnProperty('meridians')) $scope.options.meridians = ['AM', 'PM'];
	$scope.options.max = c.dateFromString($scope.options.max);
	$scope.options.min = c.dateFromString($scope.options.min);
	var currentValue = $scope.page.g_form.getValue($scope.page.field.name);
	c.selectedTime = currentValue.indexOf('{') != -1 ? c.dateFromString($scope.options.defaultTime) : c.dateFromString(currentValue);
	c.storeValue();
};
```
:::endtabs
This example widget shows how to create a reusable option for capturing a type of input not normally supported: a "time" input. Dictionary entries have the type Time available, but variables only have Date and Date/Time. So, if you have a record producer for a record with a time field (like the sys_holiday table), you normally would have to use a Single Line Text variable and either add validation on the form to prevent invalid time values like "5 PM" or use a record producer script to transform the user input into a value that the Time field on the produced record will accept. This Time Picker widget both improves the user experience and ensures data is always in the correct format. This widget displays as an upgraded input pre-submit, supports defining options for each instance, and is integrated with the form so that it can be treated just like any other variable.
### 1. How to display post-submit
If your widget captures user data, you'll likely want to display that data in the requested item after the form is submitted. (If you're using a record producer, you can skip this section if the variable editor for the submitted information isn't shown on the produced record.) Prior to submitting the form, this post assumes that the catalog items including the custom widgets will only be accessed in the Service Portal where the widget will always display for the variable. However, the submitted requested item can be accessed in all three different UIs: portals, classic environments (native UI), and workspaces. Because the widgets use AngularJS, they won't render in the classic environment or a workspace. There are three main options for displaying the data post-submit:
1. If the data captured by your widget can display as Single Line Text, then the variable with your embedded widget can use that type instead of Custom or Custom with Label. 
A. This will result in Service Portal showing your widget still, while elsewhere it will show as a Single Line Text. 
B. This option is used by this example widget. 
C. *Note: the Widget field doesn't show on the variable form for the type Single Line Text; either add the Widget value from the list view of variables or set the type to Custom, update the Widget field, and then switch back to Single Line Text.*
2. If the submitted data for the widget needs to display as a different variable type (like a reference or a date), create or use a separate variable for storing the data and displaying post-submit.
A. Set this variable's value on change of your input or on submit and set the widget variable to only show pre-submit in the catalog item and the other variable to only show post-submit in requested items and catalog tasks.
B. *In example #3, we use this approach and also handle the hiding and showing in the widget's client script itself.*
3. If you don't want the submitted data to just display as a normal field and need a custom element to show even in the classic environment and workspaces, your only option is to create a custom UI macro and a custom Next Experience component and include them in the Macro and Macroponent fields in your variable. 
A. This option requires significant work because you have to create entirely new versions of your widget using two totally different frameworks (unless you wanted to go with a complicated solution where your macro and component use an iframe to embed a portal page with just your widget and update your widget to take values from URL parameters—but I wouldn't recommend that). 
B. Also, when using a macro in the classic environment it might not allow you to set the value of that variable using g_form. 
### 2. How to define options for each instance of the widget
For this widget, we use [UI Bootstrap](https://angular-ui.github.io/bootstrap/versioned-docs/1.1.2/)'s uib-timepicker directive which is included by default in the Service Portal. That directive includes many different options you can specify, like whether to include seconds and whether to use 24- or 12-hour time. In this example, passing options to a specific instance of the widget is not required but is supported (e.g. if you wanted one Work Start variable with a "max" value of 12:59:59 and another Work End variable with a "min" value of 13:00:00).

To specify options for an embedded widget, include an object in the "Default value" field of the variable. For example:
```javascript
{
   "mousewheel": false,
   "showSeconds": true,
   "defaultTime": "09:00:00",
   "max": "12:59:59"
}
```

The embedded widget instance can then access the options data in a few different places:
1. From the $scope data. Can use either $scope.options, $scope.widget_parameters, or $scope.widget.options (I don't think there's any difference between these three).
2. From the "options" object in the server script, which can be made available to the client script with a line like: `data.options = options;` (this option is mainly useful if you have on load server code that depends on and potentially updates the options).
3. From the g_form value of its variable using `$scope.page.g_form.getValue($scope.page.field.name);`.

If the widget won't display in the portal post-submit and the form doesn't support drafts, the approach used won't matter because the widget will only pull options once on initial catalog item load. Otherwise, you'll need to consider the following:
1. Approach #3 shouldn't be used if the widget overwrites its own g_form value to store the user's input.
2. Approach #1 and #2 will use the current default value from the variable, whereas approach #3 will keep whatever the value was when the form was submitted or the draft was saved. So, approach #3 is great if the options can change and more accurately represent the "current state" of the widget. However, with approach #3 you'll need to be careful about changing your option schema because the widget will still need to support options from previously submitted/saved requests.

*Note: if using approach #1 or #2, the options object will also include some properties added by default. So, make sure to not accidentally use the same property name and be aware they are present if you plan to iterate through the options. The options currently included automatically are: preserve_placeholder_size, advanced_placeholder_dimensions, cat_item, sp_widget_dv, sp_column_dv, active, sys_tags, order, and async_load.*
### 3. How to make your widget act like a normal variable
Our goal with a widget like this (which uses type Single Line Text and stores the input in its own variable) is that, other than setting the Widget field and potentially the Default value for the variable, the variable shouldn't require any special handling and should just work the same as any normal variable. With the approach this example uses, the widget only needs a little extra logic for this:
1. For client scripts, UI policies, etc. to be able to get and set the value of your custom input, you'll need to sync the value of your custom input with the variable's g_form value.
A. The simplest way is to include the following in your input: `ng-model="page.fieldValue" ng-model-options="{updateOn: 'blur', getterSetter: true}"`.
B. However, in this example, the value needs to be transformed both when getting and setting because the uib-timepicker uses a Date object whereas the variable's value should have a string formatted as "HH:mm:ss". So, for setting the variable's value you can add an ng-blur or ng-change function to your input and have that function transform the value and then store it using `$scope.page.g_form.setValue($scope.page.field.name, value);`. For updating your custom input when something else changes the variable's value, you can watch for the field.change event on $rootScope (as described in point #2 of the first example) and transform the data before updating the variable you're using for your ng-model.
2. For handling read-only, you'll have to add your own logic to prevent the user from interacting with your custom elements while the widget's variable is read-only. For this example, this was as easy as adding this attribute to the input element: `ng-disabled="page.field.isReadonly()"`.
## Example 3: Country Typeahead Picker
:::tabs
:::tab Screenshot
![Country Typeahead Picker Widget](images/country-typeahead-picker-widget.png)
:::tab HTML
```html
<div ng-if="c.isVisible">
  <script type="text/ng-template" id="typeaheadAddress.html">
    <a>
        <img ng-src="{{match.model.flags.png}}" width="16">
        <span ng-bind-html="match.label | uibTypeaheadHighlight:query"></span>
    </a>
  </script>
  <div class="form-group country-typeahead">
    <span ng-if="c.isMandatory" class="fa fa-asterisk mandatory" ng-class="{'mandatory-filled': c.selectedCountry}" aria-label="{{c.selectedCountry ? 'Required Filled' : 'Required'}}" role="img"></span>
    <label for="typeahead-{{page.field.name}}">{{c.label}}<span ng-show="c.loadingLocations">
        <div class="loader"></div>
      </span>
    </label>
    <input id="typeahead-{{page.field.name}}" type="text" ng-model="c.selectedCountry" placeholder="Search for country" ng-disabled="c.isReadOnly"
    typeahead-on-select="c.select($item)" uib-typeahead="address as address.name.common for address in c.getLocation($viewValue)"
    typeahead-select-on-blur="false" ng-blur="c.blur()" typeahead-loading="c.loadingLocations" typeahead-template-url="typeaheadAddress.html" typeahead-show-hint="true" 
    typeahead-no-results="noResults" class="form-control" typeahead-wait-ms="300" typeahead-min-length="0" typeahead-popup-limit="10">
  </div>
</div>
```
:::tab Client Script
```javascript
api.controller=function($scope, $http, $timeout){
	var c = this;
	var currentValue = $scope.page.g_form.getValue($scope.page.field.name);
	if(currentValue) currentValue = JSON.parse(currentValue);
	if(currentValue && currentValue.linkedField){
		c.select = function(item){
			$scope.page.g_form.setValue(currentValue.linkedField, item.name.common);
		};

		c.blur = function(){
			//timeout to give time for c.select to run first if an option was clicked
			$timeout(function() {}, 500).then(function(){
				//if an option was selected then c.selectedCountry would change from string to object
				if(typeof c.selectedCountry === 'string'){
					if(!c.loadingLocations && c.lastChecked == c.selectedCountry){
						if(!c.lastResults || !c.lastResults.length){
							c.selectedCountry = ''
							if(currentValue) $scope.page.g_form.clearValue(currentValue.linkedField);
						}else if(c.lastResults.length == 1){
							c.selectedCountry = c.lastResults[0];
							if(currentValue) $scope.page.g_form.setValue(currentValue.linkedField, c.lastResults[0].name.common);
						}else if(c.lastResults.length > 1){
							c.selectedCountry = '';
							if(currentValue) $scope.page.g_form.clearValue(currentValue.linkedField);
						}else{
							c.deferBlur = true;
						}
					}else{
						c.deferBlur = true;
					}
				}
			});
		};

		c.getLocation = function(val){
			var apiToUse = val ? 'https://restcountries.com/v3.1/name/'+ val : 'https://restcountries.com/v3.1/all'
			return $http.get(apiToUse, {
				params: {
					fields: 'cca2,cca3,name,translations,nativeName,altSpellings,flags,independent'
				}
			}).then(function(response){
				c.lastChecked = val;
				if(!currentValue.includeTerritories){
					response.data = response.data.filter(function(country) {
						return country.independent === true;
					});
				}
				c.lastResults = response.data;
				$scope.page.g_form.hideFieldMsg($scope.page.field.name, true);
				if(c.deferBlur){
					c.deferBlur = false;
					c.loadingLocations = false;
					c.blur();
				}
				return response.data;
			}, function(response){
				c.lastChecked = val;
				c.lastResults = '';
				$scope.page.g_form.showFieldMsg($scope.page.field.name, 'Could not find a country matching "'+val+'"', 'error');
				if(c.deferBlur){
					c.deferBlur = false;
					c.loadingLocations = false;
					c.blur();
				}
				return [];
			});
		};

		c.init = function(){
			c.selectedCountry = '';
			c.lastResults = '';
			c.lastChecked = '';
			c.deferBlur = false;
			c.isMandatory = $scope.page.g_form.isMandatory(currentValue.linkedField);
			c.isVisible = $scope.page.g_form.isVisible(currentValue.linkedField);
			c.isReadOnly = $scope.page.g_form.isReadOnly(currentValue.linkedField);
			var linkedFieldDetails = $scope.page.g_form.getField(currentValue.linkedField);
			c.label = linkedFieldDetails ? linkedFieldDetails.label : 'Country';
			$scope.page.g_form.$private.events.on("onPropertyChange", function(type, field, attribute, value){
				if(type == 'FIELD' && field == currentValue.linkedField){
					if(attribute == 'visible'){
						c.isVisible = value;
					}else if(attribute == 'readonly'){
						c.isReadOnly = value;
					}else if(attribute == 'mandatory'){
						c.isMandatory = value;
					}else if(attribute == 'messages'){
						$scope.page.g_form.hideFieldMsg($scope.page.field.name, true);
						for(var i = 0; i < value.length; i++){
							$scope.page.g_form.showFieldMsg($scope.page.field.name, value[i].message, value[i].type);
						}
					}else if(attribute == 'label'){
						c.label = value;
					}
				}
			});
			var linkedFieldValue = $scope.page.g_form.getValue(currentValue.linkedField);
			if(linkedFieldValue){
				c.selectedCountry = linkedFieldValue;
				c.deferBlur = true;
				c.getLocation(value);
			}
			$scope.page.g_form.$private.events.on('onChange', function(field, blank, value){
				if(field == currentValue.linkedField){
					if(!c.selectedCountry || typeof c.selectedCountry === 'string' || c.selectedCountry.name.common != value){
						c.selectedCountry = value;
						if(c.selectedCountry){
							c.deferBlur = true;
							c.getLocation(value);
						}
					}
				}
			});
			$scope.page.g_form.$private.events.on('submit', function(){
				$scope.page.g_form.clearValue($scope.page.field.name);
			});
			var el = $('.sp-form-container #'+currentValue.linkedField);
			if(el[0] && el[0].style) el[0].style.display = 'none';
		};
		c.init();
	}else{
		$scope.page.g_form.setDisplay($scope.page.field.name, false);
	}
};
```
:::tab CSS
```css
/* loading icon */
.loader {
  border: 2px solid #b7b7b7;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 2s linear infinite;
  display: inline-block;
}
@keyframes spin {
	0% { transform: rotate(0deg); }	
	100% { transform: rotate(360deg); }
}
/* to limit the height of the dropdown and to include a scrollbar */
.dropdown-menu {
  max-height: 250px;
  overflow-y: auto;
}
.country-typeahead .dropdown-menu::-webkit-scrollbar {
  	 -webkit-appearance: none;
    width: 8px;
}
.country-typeahead .dropdown-menu::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.4);
}
.country-typeahead .dropdown-menu::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
}
```
:::tab Link Function
```javascript
function link(scope, element, attrs, controller) {
    element.on('mousedown', '.dropdown-menu', function(e){
        if (e.target === e.currentTarget || e.target.classList.contains('dropdown-menu')){
            e.preventDefault();
        }
    });
}
```
:::endtabs
In this example, we are replacing an existing Single Line Text variable called "Country" with a custom input that uses [UI Bootstrap](https://angular-ui.github.io/bootstrap/versioned-docs/1.1.2/)'s uib-typeahead directive and an API call to [restcountries.com](https://restcountries.com/) to create a typeahead dropdown of country values. Rather than storing the user's input in its own variable like in the previous example, this example stores the data in the existing country variable and mirrors the state of that variable (so that any existing logic referencing the existing variable will automatically apply to this new custom input without needing to be updated).

Storing the user input in the widget's own variable is often simpler, but that approach doesn't work as well if:
1. The captured input needs to be stored as something other than Single Line Text.
2. The input needs to be stored across multiple variables.
3. You don't want to modify the existing variable you'll be replacing (e.g. the variable is within a variable set used by a lot of other forms).
4. You conditionally need to show either the existing variable or the upgraded custom variable.
A. For example, say you create a similar typeahead field to capture "state" data, but you only have state data for USA. So, when the country is not USA, you want to show an existing Single Line Text variable instead of your new typeahead state picker. By having the custom state picker variable store its value in the existing variable, other logic can use that existing variable's value as the single source of truth for the state value.

*This example widget could have been created as a "self-contained" widget like the previous example, but for demonstration purposes we'll show what it would look like if we wanted to create a separate variable for the widget rather than updating the existing Country field to include a widget.*
### 1. How to Determining Pre- or Post-Submit
In this example, post-submit we want to hide the widget's variable and instead show the existing country variable that we copy the data to. We use the variable type Custom because that will keep the the variable from showing in the classic environment or workspaces:
1. In the Classic Environment, a variable with type Custom will not display at all if the variable record has a value for the Widget field and doesn't have a value for the Macro field.
2. In workspaces, the widget won't display (assuming the variable is type Custom and doesn't have a Macroponent value); however, the variable will still take up a small amount of space in the form's variable editor. 
A. *If this extra space is unacceptable, you can manually hide the widget variable post-submit. If you want a more reusable option to handle hiding multiple widgets like this, you can add an onLoad client script with UI Type "Mobile / Service Portal" and a script like: `g_form.getFieldNames().filter(f => f.startsWith('variables.') && g_form.getControl(f).type == 'macro').forEach(f => g_form.setDisplay(f, false));`. You can either create that client script in the catalog item/variable set (and check the boxes for "Applies on Requested Items" and "Applies on Catalog Tasks") or directly in the Requested Item and Catalog Task tables themselves.*
3. In the portal, a variable of type Custom with a Widget value will normally display and the widget code will run. So, we have to add handling to our widget to limit its logic to only run pre-submit and to hide the widget's variable post-submit. To identify in the widget's client script whether it is running pre- or post-submit, there are two main options:
A. OnSubmit of the form, set the value of the widget variable (or some other variable) to be a value that it would never have prior to the form being submitted. This approach is used for this widget. We have logic like this that clears the widget's value onSubmit:
```javascript
$scope.page.g_form.$private.events.on('submit', function(){
    $scope.page.g_form.clearValue($scope.page.field.name);
});
```
And we wrap the client code in an if-condition like this so that it only runs when the variable has a value:
```javascript
var currentValue = $scope.page.g_form.getValue($scope.page.field.name);
if(currentValue) currentValue = JSON.parse(currentValue);
if(currentValue && currentValue.linkedField){
```
*I prefer clearing the value rather than setting it to a specific value like "submitted", so that the variable won't show a value anywhere, such as the variable summary that shows for approvals.*
B. The other approach relies on the fact that `$scope.page.g_form.getUniqueValue();` will always return the sys_id of the catalog item, but post-submit other places will switch to having the sys_id of the submitted request. 
i. Can compare to the g_form object attached to the `sp-variable-layout` directive, which contains the form both pre- and post-submit: 
```javascript
c.isPostSubmit = ($scope.page.g_form.getUniqueValue() == angular.element($("sp-variable-layout")).scope().getGlideForm().getUniqueValue()));
```
ii. Can compare to the g_form object broadcast in the event `spModel.gForm.rendered`:
```javascript
var g_formListener = $rootScope.$on('spModel.gForm.rendered', function(e, gFormInstance) {
	c.isPostSubmit = (gFormInstance.getSysId() == $scope.page.g_form.getUniqueValue());
});
$scope.$on("$destroy", g_formListener);
```
iii. Can compare to the sys_id in the page's URL (making sure to inject $location into your controller): 
```javascript
c.isPostSubmit = ($location.search().sys_id == $scope.page.g_form.getUniqueValue());
```

*We don't use Custom with Label because we want this custom input's label to show as mandatory, which isn't supported for the two Custom variable types. Instead, our widget's HTML will include custom label and mandatory asterisk elements that match the styling of normal variables' labels.*
### 2. How to mirror an existing variable
We want this widget set up so that any existing logic that applies to the existing variable (like a UI Policy that makes it read-only or a client script that shows a field message for it) will automatically apply to the new custom variable as well. The goal is that adding this custom country typeahead picker to a form should be as easy as just creating the new Custom type variable referencing this widget and specifying the "linkedField" in the default value. 

The steps for achieving this and mirroring an existing variable are:
1. Manually hide the existing variable by setting its element to `display: 'none'` (which is independent of its status of g_form.isMandatory). 
A. *As mentioned earlier, post-submit we'll instead hide the widget's variable and let the existing variable work as normal—no mirroring needed.*
B. *In some cases, you might want the existing variable to conditionally show instead of the widget's variable. If that's the case, you won't want to mirror the visible status of the existing variable; instead, you can use normal UI policies or client scripts to handle which field to show. If you need to prevent some client script logic from running while the widget's variable is hidden you can wrap it in an if-statement like: `if($scope.page.field.isVisible()){`.*
2. On load, get the existing variable's current value and its mandatory, visible, and read-only status using g_form and store those values in the widget's scope for the HTML to use for manually setting its custom input to hidden, not mandatory, or disabled. 
3. Additionally, set up listeners for syncing the widget's custom input with any changes made to the existing variable or its value. 
A. In this example, we use the private g_form event "onChange" to listen for changes to the existing variable's value and the event "onPropertyChange" to listen for the following changes related to the variable: visible, readonly, mandatory, messages (field messages), and label. 
i. *If you prefer not to use the private g_form events, you could instead listen to changes to the existing variable's value using $rootScope, and for the other attributes of the existing variable you could store a reference to its field object retrieved with g_form.getField and use the functions isMandatory, isReadonly, and isVisible included there.*
B. We don't have to worry about syncing anything back to the existing variable other than the value because we're expecting all client scripts and UI policies to reference the existing variable rather than the widget variable itself.