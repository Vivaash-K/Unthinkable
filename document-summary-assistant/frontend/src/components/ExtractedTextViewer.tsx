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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all">
      {/* Header Bar / Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700">
            <FileText className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Extracted Document Text</h4>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="inline-flex items-center gap-1">
                <Hash className="w-3 h-3 text-slate-400" /> {processResult.wordCount.toLocaleString()} words
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> ~{Math.max(1, Math.ceil(processResult.wordCount / 200))} min read
              </span>
              {processResult.ocrApplied && (
                <>
                  <span>•</span>
                  <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">OCR Extracted</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
            title="Copy extracted text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <div className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-200/80 bg-slate-50/30 animate-fade-in">
          <div className="max-h-80 overflow-y-auto rounded-xl bg-white border border-slate-200 p-4 text-xs sm:text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
            {processResult.text}
          </div>
        </div>
      )}
    </div>
  );
}
