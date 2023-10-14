const localstorage = {
    get: async function (key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, (result) => {
                resolve(result[key]);
            });
        });
    },
    set: function (key, value) {
        chrome.storage.local.set({ [key]: value });
    }
}


chrome.webNavigation.onCompleted.addListener(
    async function (tab) {
        try {
            const checkboxID = 'isAutoDownload';
            const containerID = 'containerInput';
            const isAutoDownloadValue = await localstorage.get(checkboxID);
            const container = await localstorage.get(containerID);
            if (isAutoDownloadValue != null && isAutoDownloadValue != undefined && (isAutoDownloadValue == 'true' || isAutoDownloadValue == true)) {
                sendMessage(tab.tabId, { action: "download", data: { container } }, (response) => {
                    if (!chrome.runtime.lastError) {
                        console.log("response successfully");
                    } else {
                        console.log("runtime error : port is closed");
                    }
                });
            }

        } catch (error) {
            console.log("error", error);
        }
    },
    { url: [{ urlMatches: "https://*/*" }, { urlMatches: "http://*/*" }] }
);

function sendMessage(tabId, message, callback) {
    chrome.tabs.sendMessage(tabId, message, callback);
}