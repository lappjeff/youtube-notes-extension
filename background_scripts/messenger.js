let popupPort;

let csPorts = {};

// listen to port connections
browser.runtime.onConnect.addListener((port) => {
  // save port of current popup
  if (port.name === "popup-port") {
    popupPort = port;

    // watch for messages coming into popup port
    popupPort.onMessage.addListener(async (m) => {
      csPorts[m.portId].postMessage(m);
    });
    return;
  }

  const portName = port.name;

  // create ports for each page the content script is loaded into
  if (!csPorts[portName]) {
    csPorts[portName] = port;

    // listen to messages on each saved port
    csPorts[portName].onMessage.addListener((m) => {
      // forward messages received by content script port to the popup port
      popupPort.postMessage(m);
    });
  }
});
