document.addEventListener("super-now-event", function (data) {
  if(data.detail.event == 'superNowTrueUnlock'){
    chrome.runtime.sendMessage(data.detail); //forward the customevent message to the bg script.
  }else if(data.detail.event =='superNowPersonalizeColumns'){
    fetch(chrome.runtime.getURL('/personalize_columns.html')).then(r => r.text()).then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      // not using innerHTML as it would break js event listeners of the page
    });
  }
  
  return true;
});

var s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
(document.head || document.documentElement).appendChild(s);