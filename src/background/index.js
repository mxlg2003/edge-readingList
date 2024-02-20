console.log('background is running')
function onInstalled(a) {
  console.log('onInstalled')
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: !0 })
}

chrome.runtime.onInstalled.addListener(onInstalled)
