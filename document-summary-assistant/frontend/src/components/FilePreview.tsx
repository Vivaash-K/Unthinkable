import React, { useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { UploadedFileInfo, ProcessResult } from '../types';

interface FilePreviewProps {
  fileInfo: UploadedFileInfo;
  processResult: ProcessResult | null;
  onRemove: () => void;
  onReplace: (file: File) => void;
  disabled?: boolean;
}

export default function FilePreview({
  fileInfo,
  processResult,
  onRemove,
  onReplace,
  disabled = false,
}: FilePreviewProps) {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const isPdf =
    fileInfo.contentType === 'application/pdf' ||
    fileInfo.originalName.toLowerCase().endsWith('.pdf');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onReplace(f);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <input
        ref={replaceInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side: Icon + Name + Metadata */}
        <div className="flex items-start sm:items-center space-x-4 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
              isPdf
                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}
          >
            {isPdf ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3
                className="text-base font-semibold text-slate-900 truncate"
                title={fileInfo.originalName}
              >
                {fileInfo.originalName}
              </h3>
              {processResult?.hasExtractedText && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <CheckCircle2 className="w-3 h-3" /> Extracted
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="font-medium text-slate-600 uppercase tracking-wider">
                {isPdf ? 'PDF Document' : 'Image File'}
              </span>
              <span>•</span>
              <span>{fileInfo.sizeFormatted}</span>
              {processResult && (
                <>
                  <span>•</span>
                  <span>{processResult.wordCount.toLocaleString()} words</span>
                  {processResult.pageCount && (
                    <>
                      <span>•</span>
                      <span>{processResult.pageCount} page(s)</span>
                    </>
                  )}
                  {processResult.ocrApplied && (
                    <span className="inline-flex items-center gap-0.5 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 text-[11px] font-medium">
                      <Layers className="w-3 h-3" /> OCR
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
          <button
            type="button"
            disabled={disabled}
            onClick={() => replaceInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 transition"
            title="Replace with another document"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Replace</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 disabled:opacity-50 transition border border-rose-200/60"
            title="Remove uploaded document"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
