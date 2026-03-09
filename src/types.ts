export interface MessageMetadata {
  intent?: string;
  topic?: string;
  language?: string;
  retrievedDocsCount?: number;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  metadata?: MessageMetadata;
}
