const popupPort = browser.runtime.connect({ name: "popup-port" });

const noteButton = document.getElementsByClassName("noteBtn")[0];

noteButton.addEventListener("click", takeNote);

const storage = browser.storage.sync;

const videoId = await getVideoId();

// save ports to variable for access
popupPort.onMessage.addListener(async ({ data, type }) => {
  console.log("popup port received message", data);
  const { timestamp } = data;

  if (type === "video_metadata") {
    const timestampedUrl = `https://youtu.be/${videoId}?t=${timestamp}`;

    let videoNotes = await storage.get(videoId);

    // TODO - handle video notes update
    // if (!Object.keys(videoNotes).length) {
    //   storage.set({ [videoId]: {} });
    // }

    const videoData = { ...videoNotes, ...data, url: timestampedUrl };
    await storage.set({ videoId: videoData });
  }
});

await requestVideoData(videoId);

async function getVideoId() {
  // get list of tabs
  // should only be one item in array with currentWindow and active boolean config
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });

  // split out url queries
  const splitUrl = tabs[0].url.split("?v=")[1];

  // split out video id in case of additional queries
  const videoId = splitUrl.split("&")[0];

  return videoId;
}

function takeNote() {
  console.log("save note here");
  // TODO - get value of inputs and save to storage
}

async function requestVideoData(portId) {
  popupPort.postMessage({ type: "request_video_metadata", portId });
}
