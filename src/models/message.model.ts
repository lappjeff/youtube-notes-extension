export enum MessageType {
  REQUEST_VIDEO_METADATA = "request_video_metadata",
}

export type MessageOption = `${MessageType}`;

export interface VideoPayload {
  timestamp: string;
  videoId: string;
  url: string;
}
