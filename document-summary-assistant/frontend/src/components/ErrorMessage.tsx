import React from 'react';
import { AlertTriangle, X, HelpCircle, RefreshCw } from 'lucide-react';
import { AppError } from '../types';

interface ErrorMessageProps {
  error: AppError | null;
  onDismiss: () => void;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onDismiss, onRetry }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="rounded-2xl bg-rose-50/90 border border-rose-200/80 p-4 sm:p-5 shadow-sm text-slate-800 animate-slide-up mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 p-1 bg-rose-100 rounded-xl text-rose-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="ml-3.5 flex-1">
          <h3 className="text-sm font-semibold text-rose-900">{error.title}</h3>
          <div className="mt-1 text-xs sm:text-sm text-rose-700 leading-relaxed">
            {error.message}
          </div>
          {error.suggestion && (
            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-rose-800 bg-rose-100/60 rounded-lg p-2 border border-rose-200/50">
              <HelpCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span><strong>Tip:</strong> {error.suggestion}</span>
            </div>
          )}
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition shadow-sm"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
