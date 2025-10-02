var cookieStoreId = '';
var tabIndex = -1;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "superNowCloseTab") {
        chrome.tabs.remove(sender.tab.id);
    }else{
        if (sender){ 
            if (sender?.tab?.cookieStoreId) 
                cookieStoreId = sender.tab.cookieStoreId 
            tabIndex = sender.tab.index;
        } 
        if (message.event == "superNowTrueUnlock") {
            superNowTrueUnlock(message, cookieStoreId);
        }
    }
});

function superNowTrueUnlock(message, cookieStoreId) {
        var url = chrome.runtime.getURL("ultimate_form.html");
        var args = '?tablename=' + message.command["tableName"] +
            '&sysid=' + message.command["sysId"] +
            '&url=' + message.command["url"] +
            '&title=' + message.command["title"] +
            '&tableTitle=' + message.command["tableTitle"] +
            '&g_ck=' + message.command["g_ck"];    
        var createObj = {
            'url': url + args,
            'active': true
        }
        if (cookieStoreId) createObj.cookieStoreId = cookieStoreId; //only FireFox
        if (tabIndex > -1) createObj.index = tabIndex+1;
        chrome.tabs.create(createObj);
}