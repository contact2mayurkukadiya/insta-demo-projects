
const containerID = 'containerInput';
// const thumbnailContainerID = 'thumbnailContainerInput';
const checkboxID = 'isAutoDownload';
const downloadButtonID = 'download';
const containerInput = document.getElementById(containerID);
// const thumbnailContainerInput = document.getElementById(thumbnailContainerID);
const isAutoDownloadCheckbox = document.getElementById(checkboxID);
const downloadButton = document.getElementById(downloadButtonID);

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

loadData();
toggleDownloadButton();
setFormChangeEventListener()
attachStorageChangeEventListener();

downloadButton.addEventListener('click', handleFormSubmit);


async function handleFormSubmit() {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];

        chrome.tabs.sendMessage(tab.id, { action: 'download', data: { container: containerInput.value.trim() } }, function (response) {
            if (!chrome.runtime.lastError) {
                console.log("response successfully");
            } else {
                console.log("runtime error : port is closed");
            }
        });
    });
}

async function loadData() {
    // auto input value on reopen
    const containerInputValue = await localstorage.get(containerID);
    if (containerInputValue != null && containerInputValue != undefined) {
        if (containerInputValue.length > 0) {
            containerInput.value = containerInputValue;
        } else {
            localstorage.set(containerID, '.uPeMFQ');
            containerInput.value = '.uPeMFQ';
        }
    }

    // const thumbnailContainerInputValue = await localstorage.get(thumbnailContainerID);
    // if (thumbnailContainerInputValue != null && thumbnailContainerInputValue != undefined) {
    //     if (thumbnailContainerInputValue.length > 0) {
    //         thumbnailContainerInput.value = thumbnailContainerInputValue;
    //     } else {
    //         localstorage.set(containerID, '.mh2TGQ');
    //         thumbnailContainerInput.value = '.mh2TGQ';
    //     }
    // }


    // auto select checkbox on reopen
    const isAutoDownloadValue = await localstorage.get(checkboxID);
    if (isAutoDownloadValue != null && isAutoDownloadValue != undefined) {
        isAutoDownloadCheckbox.checked = isAutoDownloadValue;
    }
}

async function toggleDownloadButton(value = null) {
    var isAutoDownloadValue = null;
    if (!value) {
        isAutoDownloadValue = await localstorage.get(checkboxID);
    } else {
        isAutoDownloadValue = value;
    }
    if (isAutoDownloadValue != null && isAutoDownloadValue != undefined) {
        if ((isAutoDownloadValue == true || isAutoDownloadValue == 'true')) {
            downloadButton.classList.remove('d-block');
            downloadButton.classList.add('d-none');
        } else {
            downloadButton.classList.remove('d-none');
            downloadButton.classList.add('d-block');
        }
    }
}

function setFormChangeEventListener() {
    containerInput.addEventListener('change', function () {
        localstorage.set(containerID, containerInput.value.trim());
    });

    // thumbnailContainerInput.addEventListener('change', function () {
    //     localstorage.set(thumbnailContainerID, thumbnailContainerInput.value.trim());
    // });

    isAutoDownloadCheckbox.addEventListener('change', function () {
        localstorage.set(checkboxID, isAutoDownload.checked);
    });
}

function attachStorageChangeEventListener() {
    chrome.storage.onChanged.addListener((changes) => {
        for (let [key, { newValue }] of Object.entries(changes)) {
            if (key == checkboxID) {
                toggleDownloadButton(newValue);
            }
        }
    });
}