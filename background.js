let dictionary = [];

// Load the JSON file when the extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  fetch(chrome.runtime.getURL('sayadganj.json'))
    .then(response => response.json())
    .then(data => {
      dictionary = data;

      // Store the dictionary in chrome.storage
      chrome.storage.local.set({ dictionary })
    });

  // Create the context menu
  chrome.contextMenus.create({
    id: "findDefinition",
    title: '"%s" ءَ سَیدَگنج ءَ بِچار',
    contexts: ["selection"]
  });
});

// Listen for context menu click and store selected word
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "findDefinition") {
    const selectedText = info.selectionText.toLowerCase();

    // Store the selected word in chrome.storage to access it in the sidebar
    chrome.storage.local.set({ selectedWord: selectedText }, () => {

      // Open the sidebar for the current tab
      chrome.sidePanel.open({ tabId: tab.id });

      // Send a message to update the sidebar with the new word
      chrome.runtime.sendMessage({ action: 'updateSidebar', word: selectedText }, () => {
        if (chrome.runtime.lastError) {
          console.warn("Sidebar not available: ", chrome.runtime.lastError.message);
        }
      });
    });
  }
});
