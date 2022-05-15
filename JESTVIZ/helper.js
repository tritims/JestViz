export function sendMessageToIframe(data, DOMEle) {
    DOMEle.contentWindow.postMessage({
        message: data
    }, '*')
}