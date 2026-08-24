import React, { useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  CheckCircle2,
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
    <div className="bg-white dark:bg-espresso-900 rounded-2xl border border-sand-200 dark:border-espresso-700 p-5 shadow-sm hover:shadow-md transition-all">
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
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/60'
            }`}
          >
            {isPdf ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3
                className="text-base font-semibold text-sand-900 dark:text-sand-100 truncate"
                title={fileInfo.originalName}
              >
                {fileInfo.originalName}
              </h3>
              {processResult?.hasExtractedText && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-3 h-3" /> Extracted
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-sand-500 dark:text-sand-400">
              <span className="font-medium text-sand-700 dark:text-sand-300 uppercase tracking-wider">
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
                    <span className="inline-flex items-center gap-0.5 text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/60 text-[11px] font-medium">
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-sand-700 dark:text-sand-200 bg-sand-100 dark:bg-espresso-800 hover:bg-sand-200 dark:hover:bg-espresso-700 active:bg-sand-300 disabled:opacity-50 transition border border-sand-200 dark:border-espresso-700"
            title="Replace with another document"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sand-500 dark:text-sand-400" />
            <span>Replace</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 active:bg-rose-200 disabled:opacity-50 transition border border-rose-200/80 dark:border-rose-800/60"
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
