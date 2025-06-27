export interface TTSPayload {
  text: string;
}

export interface TranscribePayload {
  fileBuffer: Buffer;
}

export interface QueryPayload {
  fileNames?: string[];
  query: string;
}

export interface StartAnalysisPayload {
  fileNames: string[];
  query: string;
}

export interface FileReadyPayload {
  url: string;
}
