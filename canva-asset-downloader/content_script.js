chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "download") downloadImagesInContainer();
});

function downloadImagesInContainer() {
    const containerSelector = ".uPeMFQ";
    const containers = document.querySelectorAll(containerSelector);
    if (!containers || containers.length <= 0) {
        console.error("Container not found!");
        return;
    }

    containers.forEach(container => {

        const images = container.querySelectorAll("img");
        const zip = new JSZip();
        const imgFolder = zip.folder("images");

        images.forEach((image, index) => {
            const imageUrl = image.src;
            fetch(imageUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const contentType = blob.type;
                    var extension = contentType.split('/')[1];
                    if (extension == 'svg+xml') {
                        extension = extension.split("+")[0];
                    }

                    imgFolder.file(`image_${index}.${extension}`, blob);
                    if (index === images.length - 1) {
                        zip.generateAsync({ type: "blob" }).then((content) => {
                            const url = window.URL.createObjectURL(content);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `images.zip`;
                            a.click();
                            window.URL.revokeObjectURL(url);
                        });
                    }
                });
        });
    })
}