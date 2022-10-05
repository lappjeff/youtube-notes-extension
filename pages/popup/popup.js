let portFromCS;

const noteButton = document.getElementsByClassName("noteBtn")[0];

noteButton.addEventListener("click", takeNote);

function takeNote() {
  if(!portFromCS) return 
  portFromCS.postMessage({type: 'request_timestamp'})
}

// load notetube content script
browser.tabs.executeScript({file: '../../content_scripts/notetube.js'}).then().catch(e => console.error(e))

// save ports to variable for access
browser.runtime.onConnect.addListener((e) => {
  portFromCS = e 

  portFromCS.onMessage.addListener(m => console.log(m))
})