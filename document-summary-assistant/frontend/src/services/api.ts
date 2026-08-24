import {
  UploadedFileInfo,
  ProcessResult,
  SummaryResultData,
  SummaryLength,
  AIProvider,
  HealthStatus,
} from '../types';

// API base URL from environment or local fallback (strips any accidental trailing slashes)
const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

async function handleResponse<T>(res: Response): Promise<T> {
  const rawText = await res.text();
  
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    if (rawText) {
      try {
        const errJson = JSON.parse(rawText);
        if (errJson && errJson.detail) {
          errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
        } else if (errJson && errJson.message) {
          errorDetail = errJson.message;
        } else {
          errorDetail = rawText;
        }
      } catch {
        errorDetail = rawText;
      }
    }
    throw new Error(errorDetail);
  }

  try {
    return JSON.parse(rawText) as T;
  } catch (err) {
    throw new Error(`Failed to parse server response: ${rawText.slice(0, 150)}`);
  }
}

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    return await handleResponse<HealthStatus>(res);
  } catch (err: any) {
    console.warn('Backend health check failed:', err);
    return {
      status: 'offline',
      version: '1.0.0',
      tesseractAvailable: false,
      geminiAvailable: false,
      openaiAvailable: false,
    };
  }
}

export async function uploadDocument(file: File): Promise<UploadedFileInfo> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<UploadedFileInfo>(res);
}

export async function processDocument(filename: string): Promise<ProcessResult> {
  const res = await fetch(`${API_BASE}/api/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filename }),
  });

  return handleResponse<ProcessResult>(res);
}

export async function summarizeDocument(
  text: string,
  summaryLength: SummaryLength = 'short',
  provider: AIProvider = 'auto'
): Promise<SummaryResultData> {
  const res = await fetch(`${API_BASE}/api/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      summaryLength,
      provider,
    }),
  });

  return handleResponse<SummaryResultData>(res);
}
