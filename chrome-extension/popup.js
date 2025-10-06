// Default configuration
const DEFAULT_CONFIG = {
  unlockForm: true,
  editInExplorer: true,
  personalizeColumns: true,
  openRecordsInTabs: true,
  isNotOneOfOperator: true
};

// Load saved configuration and update UI
async function loadConfiguration() {
  try {
    if (chrome && chrome.storage && chrome.storage.sync) {
      const result = await chrome.storage.sync.get(DEFAULT_CONFIG);
      
      // Update checkboxes based on saved configuration
      Object.keys(DEFAULT_CONFIG).forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
          checkbox.checked = result[key];
        }
      });
    } else {
      console.error('Chrome storage API not available');
    }
  } catch (error) {
    console.error('Error loading configuration:', error);
    showStatus('Error loading settings. Using defaults.', 'error');
  }
}

// Save configuration
async function saveConfiguration() {
  try {
    if (!chrome || !chrome.storage || !chrome.storage.sync) {
      throw new Error('Chrome storage API not available');
    }
    
    const config = {};
    
    // Get current state of all checkboxes
    Object.keys(DEFAULT_CONFIG).forEach(key => {
      const checkbox = document.getElementById(key);
      if (checkbox) {
        config[key] = checkbox.checked;
      }
    });
    
    // Save to storage
    await chrome.storage.sync.set(config);
    
    // Show success message
    showStatus('Settings saved successfully!', 'success');
    
    // Notify content scripts of configuration change (non-blocking)
    notifyContentScripts();
    
  } catch (error) {
    console.error('Error saving configuration:', error);
    showStatus('Error saving settings. Please try again.', 'error');
  }
}

// Show status message
function showStatus(message, type = 'success') {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  statusElement.style.display = 'block';
  
  // Hide after 2 seconds
  setTimeout(() => {
    statusElement.style.display = 'none';
  }, 2000);
}

// Notify content scripts that configuration has changed
async function notifyContentScripts() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('service-now.com')) {
      chrome.tabs.sendMessage(tab.id, { 
        type: 'CONFIG_UPDATED',
        source: 'popup'
      }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not ready, config will apply on next page load
        }
      });
    }
  } catch (error) {
    // Silently handle errors
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  // Load current configuration
  await loadConfiguration();
  
  // Add event listeners to checkboxes
  Object.keys(DEFAULT_CONFIG).forEach(key => {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      checkbox.addEventListener('change', saveConfiguration);
    }
  });
});

// Export for use in content scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_CONFIG };
}
