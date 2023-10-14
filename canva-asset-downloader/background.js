function sendMessage(tabId, message, callback) {
    chrome.tabs.sendMessage(tabId, message, callback);
}

// Called when the user clicks on the browser action
chrome.action.onClicked.addListener((tab) => {
    sendMessage(tab.id, { action: "download" }, () => {
        if (!chrome.runtime.lastError) {
            console.log("response successfully");
        } else {
            console.log("runtime error : port is closed");
        }
    });
});