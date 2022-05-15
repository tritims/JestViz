chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("Listening...");
    });
  });
  chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    window.open(data, '_blank')
      chrome.notifications.create({
          type: "basic",
          title: "My Title",
          message: "My Message",
          iconUrl: './resource/icon.png'
      })
    if(data._initPage) {
      console.log("INITPAGE")
      // handleInitRequest(data, sender, sendResponse);
    }
    else if(data._errors) {
      console.log("ERROR")
      // handleErrorsRequest(data, sender, sendResponse);
    }
    return true;
  });

console.log("Background page...")