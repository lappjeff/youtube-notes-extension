const ytPlayer = document.querySelector("video");

let csPort = browser.runtime.connect({ name: "port-from-cs" });

csPort.onMessage.addListener((m) => {
  if (m.type === "request_timestamp") {
    csPort.postMessage({
      data: {
        timestamp: ytPlayer.currentTime,
      },
    });
  }
});
