import { byId, createElement, on } from "../libs/htmlUtils";
import { getActiveTab, sendMessage } from "../libs/tabUtils";
import { Input } from "../models/dom.model";
import { VideoPayload } from "../models/message.model";
import { VideoNote } from "../models/storage.model";

class Popup {
  private videoData: VideoNote;
  private storage = browser.storage.sync;

  public constructor() {
    this.initPopup();
    this.getVideoData();
  }

  private initPopup(): void {
    const container = byId("popup-content");

    const titleInput = createElement<HTMLInputElement>(
      document,
      container,
      "input",
      { name: Input.TITLE, placeholder: "Note name" }
    );

    const descriptionInput = createElement<HTMLTextAreaElement>(
      document,
      container,
      "textarea",
      { name: Input.DESCRIPTION, placeholder: "Note description" }
    );

    const inputs = [titleInput, descriptionInput];

    for (let input of inputs) {
      this.handleInput(input);
    }

    const saveBtn = createElement(document, container, "button", {
      textContent: "Save",
    });

    on(saveBtn, "click", async () => {
      try {
        await this.saveNote(this.videoData);

        console.log(this.storage.get());
        window.close();
      } catch (error) {
        console.error(error);
      }
    });
  }

  private async getVideoData(): Promise<void> {
    const activeTab = await getActiveTab();

    const {
      timestamp: startTime,
      videoId: id,
      url,
    } = await this.requestVideoData(activeTab.id);

    this.videoData = {
      startTime,
      id,
      url,
      title: "",
      description: "",
    };
  }

  private handleInput(el: HTMLInputElement | HTMLTextAreaElement) {
    on(el, "input", (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;

      this.videoData = { ...this.videoData, [target.name]: target.value };
    });
  }

  async requestVideoData(tabId: number): Promise<VideoPayload> {
    const videoData = sendMessage<VideoPayload>(
      "request_video_metadata",
      tabId
    );

    return videoData;
  }

  async saveNote(video: VideoNote): Promise<void> {
    const existingNotes: { [videoId: string]: VideoNote[] } =
      await this.storage.get(video.id);

    await this.storage.set({
      [video.id]: [video, ...(existingNotes[video.id] || [])],
    });
  }
}

// init popup
new Popup();
