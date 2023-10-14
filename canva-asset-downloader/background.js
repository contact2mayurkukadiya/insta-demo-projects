function sendMessage(tabId, message, callback) {
    chrome.tabs.sendMessage(tabId, message, callback);
}


function downloadImages(tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: downloadImagesInContainer,
    });
}

// Content script function to download images and create a zip file
function downloadImagesInContainer() {
    const containerSelector = ".uPeMFQ";
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error("Container not found!");
        return;
    }

    const images = container.querySelectorAll("img");
    const zip = new JSZip();
    const imgFolder = zip.folder("images");

    images.forEach((image, index) => {
        const imageUrl = image.src;
        fetch(imageUrl)
            .then((response) => {
                console.log("response", response.type);
                return response.blob()
            })
            .then((blob) => {
                const contentType = blob.type;
                var extension = contentType.split('/')[1];
                if (extension == 'svg+xml') {
                    extension = extension.split("+")[0];
                }
                console.log("extension", extension);
                // const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                // imgFolder.file(fileName, blob);

                imgFolder.file(`image_${index}.${extension}`, blob);
                if (index === images.length - 1) {
                    zip.generateAsync({ type: "blob" }).then((content) => {
                        const url = window.URL.createObjectURL(content);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `images.zip`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        // chrome.downloads.download({
                        //     url: url,
                        //     filename: "images.zip",
                        // });
                    });
                }
            });
    });
}

// Called when the user clicks on the browser action
chrome.action.onClicked.addListener((tab) => {
    downloadImages(tab);
});