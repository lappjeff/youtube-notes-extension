(function () {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  const ytPlayer = document.querySelector("video");

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  // const storage = browser.storage.sync;
  // storage.clear();

  const videoId = params.v;

  let csPort = browser.runtime.connect({ name: videoId });

  csPort.onMessage.addListener((m) => {
    if (m.type === "request_video_metadata") {
      csPort.postMessage({
        data: {
          timestamp: Math.floor(Number(ytPlayer.currentTime)),
        },
        type: "video_metadata",
      });
    }
  });
})();
