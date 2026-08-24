export type SummaryLength = 'short' | 'medium' | 'long';

export type AIProvider = 'auto' | 'gemini' | 'openai' | 'extractive';

export type ProcessingStage =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'analyzing'
  | 'summarizing'
  | 'completed'
  | 'error';

export interface UploadedFileInfo {
  filename: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  sizeFormatted: string;
}

export interface ProcessResult {
  filename: string;
  fileType: string;
  text: string;
  wordCount: number;
  characterCount: number;
  pageCount?: number;
  hasExtractedText: boolean;
  ocrApplied: boolean;
  warning?: string | null;
}

export interface SummaryStats {
  originalWords: number;
  summaryWords: number;
  compressionRatio: string;
  estimatedReadingTimeOriginal: string;
  estimatedReadingTimeSummary: string;
}

export interface SummaryResultData {
  summary: string;
  keyPoints: string[];
  mainIdeas: string[];
  stats?: SummaryStats;
  providerUsed: string;
  summaryLength: SummaryLength;
}

export interface AppError {
  title: string;
  message: string;
  suggestion?: string;
}

export interface HealthStatus {
  status: string;
  version: string;
  tesseractAvailable: boolean;
  geminiAvailable: boolean;
  openaiAvailable: boolean;
}
