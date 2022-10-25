import {
  MessageType,
  VideoPayload,
  MessageOption,
} from "../models/message.model";
import { YTElement, YTParam } from "../models/youtube.model";

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

  handleMessages();
})();

function getQueryParam(key: string): string {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      if (typeof prop === "string") {
        return searchParams.get(prop);
      }

      return;
    },
  });

  const value = params[key];

  return value || "";
}

function getPlayer(): HTMLVideoElement {
  const ytPlayer = document.querySelector(YTElement.VIDEO);

  return ytPlayer;
}

function handleMessages(): void {
  browser.runtime.onMessage.addListener((message: MessageOption) => {
    const player = getPlayer();

    if (!player) throw "No video player found.";

    const videoId = getQueryParam(YTParam.VIDEO_ID);

    if (!videoId) throw "Video id not found.";

    const payload: VideoPayload = {
      timestamp: String(Math.floor(Number(player.currentTime))),
      videoId,
    };

    if (message === MessageType.REQUEST_VIDEO_METADATA) {
      return Promise.resolve(payload);
    }
  });
}
