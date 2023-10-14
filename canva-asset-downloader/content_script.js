chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "download") downloadImagesInContainer(request?.data?.container);
});

function downloadImagesInContainer(containerSelector) {
    const containers = document.querySelectorAll(containerSelector || 'body');
    if (!containers || containers.length <= 0) {
        console.log("Container not found!");
        return;
    }

    containers.forEach((container, index) => {
        createZipForSingleCard(container, index);
    })
}

function createZipForSingleCard(container, zipIndex) {
    var blobs = [];
    const images = container.querySelectorAll("img");
    const zip = new JSZip();
    const imgFolder = zip.folder(`Assets_${zipIndex + 1}`);

    var promises = []
    images.forEach((image, index) => {
        promises.push(fetchAndAddFile(image.src, blobs))
    });

    Promise.all(promises).then(() => {
        blobs.forEach((blob, index) => {
            const contentType = blob.type;
            var extension = contentType.split('/')[1];
            if (extension == 'svg+xml') {
                extension = extension.split("+")[0];
            }
            imgFolder.file(`image_${index}.${extension}`, blob);
        });
        zip.generateAsync({ type: "blob" }).then((content) => {
            const url = window.URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Assets_${zipIndex + 1}.zip`;
            a.click();
            window.URL.revokeObjectURL(url);
        });
    });
}

function fetchAndAddFile(imageUrl, blobs) {
    return fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
            blobs.push(blob);
        });
}