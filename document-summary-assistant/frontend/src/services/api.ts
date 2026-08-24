import {
  UploadedFileInfo,
  ProcessResult,
  SummaryResultData,
  SummaryLength,
  AIProvider,
  HealthStatus,
} from '../types';

// Use relative /api if served via proxy or Vite dev server, otherwise fallback to localhost:8000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      } else if (errJson && errJson.message) {
        errorDetail = errJson.message;
      }
    } catch {
      const rawText = await res.text();
      if (rawText) errorDetail = rawText;
    }
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
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
