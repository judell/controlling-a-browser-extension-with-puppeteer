// load start.js when a page is loaded into a tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.executeScript(tabId, {
      file: 'start.js'
    })
  }
})

// listen for messages from start.js, launch the viewer with data it sends
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  switch (request.action) {
    case 'proceedWithData':
      const data = encodeURIComponent(JSON.stringify(request.data))
      const newTabUrl = chrome.extension.getURL(`main.html?data=${data}`)
      chrome.tabs.create({ url: newTabUrl })
  }
})
