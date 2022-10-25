import { MessageType, VideoPayload } from "../models/message.model";
import { VideoNote } from "../models/storage.model";
import { YTParam } from "../models/youtube.model";

const noteButton = document.getElementsByClassName("noteBtn")[0];
const titleInput = document.getElementsByClassName(
  "title"
)[0] as HTMLInputElement;
const descriptionInput = document.getElementsByClassName(
  "description"
)[0] as HTMLInputElement;

noteButton.addEventListener(
  "click",
  async () =>
    await saveNote({
      ...videoData,
      title: titleInput.value,
      description: titleInput.value,
    })
);

const storage = browser.storage.sync;

let videoData: VideoNote | null = null;

(async () => {
  const activeTab = await getActiveTab();

  const { timestamp, videoId } = await requestVideoData(activeTab);

  const timestampedUrl = `https://youtu.be/${videoId}?${YTParam.TIMESTAMP}=${timestamp}`;

  videoData = {
    startTime: timestamp,
    id: videoId,
    url: timestampedUrl,
    title: "",
    description: "",
  };
})();

async function saveNote(video: VideoNote): Promise<void> {
  const existingNotes: { [videoId: string]: VideoNote[] } = await storage.get(
    video.id
  );

  await storage.set({
    [video.id]: [video, ...(existingNotes[video.id] || [])],
  });
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
