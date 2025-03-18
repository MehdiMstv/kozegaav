/// <reference types="chrome"/>

// Ensure chrome is available
if (typeof chrome === 'undefined') {
  console.error('Chrome API is not available');
}

// Initialize extension
const initializeExtension = async () => {
  try {
    console.log('Initializing extension...');
    
    // Test chrome.action availability
    if (chrome?.action) {
      console.log('chrome.action is available');
    } else {
      console.error('chrome.action is not available');
      return;
    }

    // Set initial icon
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      await setIcon(tabs[0].id);
    }
  } catch (error) {
    console.error('Error initializing extension:', error);
  }
};

const setIcon = async (tabId: number) => {
  try {
    const { accessToken } = await chrome.storage.local.get("accessToken");
    const hasAccessToken = !!accessToken;
    
    if (hasAccessToken) {
      await chrome.action.setIcon({
        path: "assets/icon.png",
        tabId,
      });
    } else {
      await chrome.action.setIcon({
        path: "assets/disabled.png",
        tabId,
      });
    }
  } catch (error) {
    console.error('Error setting icon:', error);
  }
};

// Listen for installation/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated');
  initializeExtension();
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(({ tabId }: chrome.tabs.TabActiveInfo) => {
  setIcon(tabId);
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId: number, _change: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (!tab.url) return;
  
  if (tab.url.includes("https://app.snapp.taxi")) {
    setIcon(tabId);
  } else {
    setIcon(tabId);
  }
});

// Initialize on load
initializeExtension();
