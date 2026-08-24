import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, FileText, Clock, Hash } from 'lucide-react';
import { ProcessResult } from '../types';

interface ExtractedTextViewerProps {
  processResult: ProcessResult;
}

export default function ExtractedTextViewer({ processResult }: ExtractedTextViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(processResult.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-espresso-900 rounded-2xl border border-sand-200 dark:border-espresso-700 shadow-sm overflow-hidden transition-all">
      {/* Header Bar / Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between bg-sand-100/50 dark:bg-espresso-850 hover:bg-sand-100 dark:hover:bg-espresso-800 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-white dark:bg-espresso-800 border border-sand-200 dark:border-espresso-700 text-sand-700 dark:text-sand-300">
            <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-sand-900 dark:text-sand-100">Extracted Document Text</h4>
            <div className="flex items-center gap-3 text-xs text-sand-500 dark:text-sand-400 mt-0.5">
              <span className="inline-flex items-center gap-1">
                <Hash className="w-3 h-3 text-sand-400 dark:text-sand-500" /> {processResult.wordCount.toLocaleString()} words
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-sand-400 dark:text-sand-500" /> ~{Math.max(1, Math.ceil(processResult.wordCount / 200))} min read
              </span>
              {processResult.ocrApplied && (
                <>
                  <span>•</span>
                  <span className="text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.2 rounded font-medium border border-amber-200 dark:border-amber-800/60 text-[11px]">
                    OCR Extracted
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-sand-700 dark:text-sand-200 bg-white dark:bg-espresso-800 border border-sand-200 dark:border-espresso-700 hover:bg-sand-50 dark:hover:bg-espresso-750 transition"
            title="Copy extracted text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-sand-500 dark:text-sand-400" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <div className="p-1.5 rounded-lg text-sand-400 dark:text-sand-500 hover:text-sand-600 dark:hover:text-sand-300">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-5 border-t border-sand-200 dark:border-espresso-700 bg-sand-50/50 dark:bg-espresso-950/50 animate-fade-in">
          <div className="max-h-80 overflow-y-auto rounded-xl bg-white dark:bg-espresso-900 border border-sand-200 dark:border-espresso-700 p-4 text-xs sm:text-sm text-sand-800 dark:text-sand-200 font-mono whitespace-pre-wrap leading-relaxed">
            {processResult.text}
          </div>
        </div>
      )}
    </div>
  );
}
