export type User = {
  id: string;
  name: string;
  avatar?: string;
};

export type MessageAttachment = {
  id: string;
  type: "image" | "file";
  name: string;
  url: string;
  thumbnailUrl?: string;
  size?: number;
  mimeType?: string;
};

export type Message = {
  id: string;
  conversationId: string;
  content: string;
  role: "user" | "assistant" | "system";
  createdAt: number;
  attachments?: MessageAttachment[];
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
};