
export type TruthLevel = "True" | "Likely True" | "Misleading" | "Fake";

export type ContentType = "text" | "url" | "youtube";

export interface CheckedContent {
  id: string;
  content: string;
  contentType: ContentType;
  truthScore: number;
  truthLevel: TruthLevel;
  summary: string;
  sources: Source[];
  timestamp: Date;
}

export interface Source {
  title: string;
  url: string;
  publisher: string;
  publishedDate?: string;
  isSupporting?: boolean;
  description?: string;
  aiGenerated?: boolean;
}

export interface HistoryItem {
  id: string;
  content: string;
  contentType: ContentType;
  truthScore: number;
  truthLevel: TruthLevel;
  timestamp: Date;
}
