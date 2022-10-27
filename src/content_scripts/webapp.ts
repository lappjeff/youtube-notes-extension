import { Message, MessageType } from "../models/message.model";
import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type === MessageType.SYNC_DATA) {
    await browser.storage.local.set({ "yt-notes": message.payload });
  }
});
