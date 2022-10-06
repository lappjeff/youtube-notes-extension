let csPort;
let popupPort;

// set up message forwarding between messenging ports
browser.runtime.onConnect.addListener((port) => {

  if (port.name === "port-from-cs") {
    csPort = port;
    csPort.onMessage.addListener(async (m) => {
      popupPort.postMessage(m)
    });
  }

  if (port.name === "popup-port") {
    popupPort = port;
    popupPort.onMessage.addListener(async m => {
        csPort.postMessage(m)
    })
  }
});
