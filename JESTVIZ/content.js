// var s = document.createElement('script');
// s.src = chrome.runtime.getURL('script.js');
// s.onload = function() {
//     this.remove();
// };
// (document.head || document.documentElement).appendChild(s);

// console.log("Content page")

// This code will be injected to run in webpage context
function sendMessageToIframe(data, DOMEle) {
    // console.log("Posting message to iframe")
    DOMEle.contentWindow.postMessage(
        JSON.parse(JSON.stringify(data.detail))
        , '*')
}

function codeToInject() {
    window.addEventListener('message', function (e, a, x) {
        // console.log(
        //     e
        // );
        // var error = {
        //     stack: e.error.stack
        //     // Add here any other properties you need, like e.filename, etc...
        // };
        // document.dispatchEvent(new CustomEvent('ReportError', {detail:error}));
    });
    window.addEventListener('unhandledrejection', function (e, a, x) {
        console.log(
            "unhandledrejection", e.data
        );
        var error = {
            // stack: e.error.stack
            // Add here any other properties you need, like e.filename, etc...
        };
        document.dispatchEvent(new CustomEvent('ReportError', { detail: error }));
    });
    // window.addEventListener('error', function (e, a, x) {
    //     console.log(
    //         "error", e
    //     );
    //     var error = {
    //         stack: e.error.stack
    //         // Add here any other properties you need, like e.filename, etc...
    //     };
    //     document.dispatchEvent(new CustomEvent('ReportError', { detail: error }));
    // });

    window.addEventListener('error', function(e) {
        // console.log("Dispatching event....")
        if(e.filename) {
          document.dispatchEvent(new CustomEvent('ErrorToExtension', {
            detail: {
              stack: e.error ? e.error.stack : null,
              url: e.filename,
              line: e.lineno,
              col: e.colno,
              text: e.message
            }
          }));
        }
      })

    var consoleErrorFunc = window.console.error;
    window.console.error = function () {
        var argsArray = [];
        for (var i in arguments) { // because arguments.join() not working! oO
            argsArray.push(arguments[i]);
        }
        consoleErrorFunc.apply(console, argsArray);

        // handleCustomError(argsArray.length == 1 && typeof argsArray[0] == 'string' ? argsArray[0] : JSON.stringify(argsArray.length == 1 ? argsArray[0] : argsArray));
    }
}

// document.addEventListener('ReportError', function(e) {
//     popup = document.createElement('embed');
//     popup.src = chrome.extension.getURL('./popup.html');
//     popup.frameBorder = 0;
//     popup.style.cssText = 'position: fixed !important; bottom: 50px !important; right: 50px !important; z-index: 2147483647 !important;';
//     popup.height = '50px';
//     (document.body || document.documentElement).appendChild(popup);
//     // Send message to iframe
//     setTimeout(() => {
//     sendMessageToIframe(e, popup);    
//     }, 2000);
//     console.log('CONTENT SCRIPT', e);
// });

document.addEventListener('ErrorToExtension', function (e) {
    console.log('Event caught in conject.js..')
    if (e.detail && e.detail.stack.split('\n').length>2) {
        popup = document.createElement('iframe');
        popup.id = "estracer-iframe"
        popup.src = chrome.extension.getURL('./popup.html');
        popup.frameBorder = 0;
        popup.style.cssText = 'position: fixed !important; right: 50px !important; z-index: 2147483647 !important; height: -webkit-fill-available; width: auto; top: 0px';
        popup.style.height = '-webkit-fill-available';
        (document.body || document.documentElement).appendChild(popup);
        // Send message to iframe
        setTimeout(() => {
            sendMessageToIframe(e, popup);
        }, 1000);
        // console.log('CONTENT SCRIPT', e.detail.stack);
    }
});

//Inject code
var script = document.createElement('script');
script.textContent = '(' + codeToInject + '())';
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

// var s = document.createElement('script');
// // TODO: add "script.js" to web_accessible_resources in manifest.json
// s.src = chrome.runtime.getURL('script.js');
// s.onload = function () {
//     this.remove();
// };
// (document.head || document.documentElement).appendChild(s);