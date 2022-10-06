const popupPort = browser.runtime.connect({name: 'popup-port'})

const noteButton = document.getElementsByClassName("noteBtn")[0];

noteButton.addEventListener("click", takeNote);

// TODO - request timestamp on toolbar button click

function takeNote() {
  popupPort.postMessage({type: 'request_timestamp'})
}

// save ports to variable for access
popupPort.onMessage.addListener(async () => {
  // TODO - check for timestamp and save 
})
