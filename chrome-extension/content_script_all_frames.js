// Default configuration
const DEFAULT_CONFIG = {
  unlockForm: true,
  editInExplorer: true,
  personalizeColumns: true,
  openRecordsInTabs: true,
  isNotOneOfOperator: true
};

// Load configuration and inject it into the page
async function loadConfigAndInject() {
  let config;
  
  try {
    // Load configuration from storage
    config = await chrome.storage.sync.get(DEFAULT_CONFIG);
  } catch (error) {
    console.error('SuperNow: Error loading config, using defaults:', error);
    config = DEFAULT_CONFIG;
  }
  
  // Store config for when inject script is ready
  window.superNowStoredConfig = config;
  
  // Listen for inject script ready signal
  window.addEventListener('message', function(event) {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'SUPERNOW_INJECT_READY' && event.data.source === 'supernow-inject-script') {
      window.postMessage({
        type: 'SUPERNOW_CONFIG',
        config: window.superNowStoredConfig,
        source: 'supernow-content-script'
      }, '*');
    }
  });
  
  // Inject DOMPurify first
  const purifyScript = document.createElement("script");
  purifyScript.src = chrome.runtime.getURL("js/purify.min.js");
  purifyScript.onload = () => {
    // Inject the main script after DOMPurify is loaded
    const mainScript = document.createElement("script");
    mainScript.src = chrome.runtime.getURL("inject.js");
    (document.head || document.documentElement).appendChild(mainScript);
  };
  (document.head || document.documentElement).appendChild(purifyScript);
}

document.addEventListener("super-now-event", function (data) {
  if(data.detail.event == 'superNowTrueUnlock'){
    chrome.runtime.sendMessage(data.detail); //forward the customevent message to the bg script.
  }else if(data.detail.event =='superNowPersonalizeColumns'){
    fetch(chrome.runtime.getURL('/personalize_columns.html')).then(r => r.text()).then(html => {
      // Sanitize the HTML before inserting it
      const cleanHtml = window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
      // Insert the sanitized modal HTML into the current frame's document (same iframe where the button was clicked)
      document.body.insertAdjacentHTML('beforeend', cleanHtml);
      // not using innerHTML as it would break js event listeners of the page
    });
  }
  
  return true;
});

// Listen for configuration updates from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CONFIG_UPDATED') {
    chrome.storage.sync.get(DEFAULT_CONFIG).then((config) => {
      window.postMessage({
        type: 'SUPERNOW_CONFIG_UPDATE',
        config: config,
        source: 'supernow-content-script'
      }, '*');
      sendResponse({success: true});
    });
    return true; // Indicate we'll respond asynchronously
  }
});

// Load configuration and inject scripts
loadConfigAndInject();