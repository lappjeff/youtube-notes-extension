import { Message, MessageType } from "../models/message.model";

browser.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type === MessageType.SYNC_DATA) {
    window.localStorage.setItem("yt-notes", JSON.stringify(message.payload));

    window.dispatchEvent(new Event("storage"));
  }
});
