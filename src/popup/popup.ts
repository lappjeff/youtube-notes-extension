import { MessageType, VideoPayload } from "../models/message.model";
import { YTParam } from "../models/youtube.model";
import { PortName } from "../models/port.model";

const popupPort = browser.runtime.connect({ name: PortName.POPUP_PORT });

const noteButton = document.getElementsByClassName("noteBtn")[0];

noteButton.addEventListener("click", takeNote);

const storage = browser.storage.sync;

(async () => {
  // videoId = await getVideoId();
  const activeTab = await getActiveTab();

  const { timestamp, videoId } = await requestVideoData(activeTab);

  const timestampedUrl = `https://youtu.be/${videoId}?${YTParam.TIMESTAMP}=${timestamp}`;

  console.log(timestamp, videoId);
  let videoNotes = await storage.get(videoId);

  // TODO - handle video notes update
  // if (!Object.keys(videoNotes).length) {
  //   storage.set({ [videoId]: {} });
  // }

  // const videoData = { ...videoNotes, ...data, url: timestampedUrl };
  // await storage.set({ videoId: videoData });
})();

function takeNote() {
  console.log("save note here");
  // TODO - get value of inputs and save to storage
}

async function getActiveTab(): Promise<browser.tabs.Tab> {
  const tab = (
    await browser.tabs.query({
      currentWindow: true,
      active: true,
    })
  )[0] as browser.tabs.Tab;

  return tab;
}

async function requestVideoData(tab: browser.tabs.Tab): Promise<VideoPayload> {
  const videoData: VideoPayload = await browser.tabs.sendMessage(
    tab.id,
    MessageType.REQUEST_VIDEO_METADATA
  );

  return videoData;
}
