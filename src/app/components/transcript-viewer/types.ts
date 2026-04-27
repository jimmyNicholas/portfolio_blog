export type Dataset = "creatives" | "scientists" | "workforce";
export type Speaker = "ai" | "user" | "other";

export interface TranscriptMessage {
  speaker: Speaker;
  label: string;
  text: string;
  index: number;
}

export interface TranscriptConversation {
  id: string;
  dataset: Dataset;
  rawText: string;
  searchableText: string;
  messageCount: number;
  speakerCounts: Record<Speaker, number>;
  messages: TranscriptMessage[];
}

export interface TranscriptPayload {
  generatedAt: string;
  totalConversations: number;
  conversations: TranscriptConversation[];
}
