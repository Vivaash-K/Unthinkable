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
    <div className="rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 p-4 sm:p-5 shadow-sm text-sand-900 dark:text-sand-100 animate-slide-up mb-6 transition-colors">
      <div className="flex items-start">
        <div className="flex-shrink-0 p-1 bg-rose-100 dark:bg-rose-900/60 rounded-xl text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="ml-3.5 flex-1">
          <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-200">{error.title}</h3>
          <div className="mt-1 text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
            {error.message}
          </div>
          {error.suggestion && (
            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-rose-900 dark:text-rose-200 bg-rose-100/60 dark:bg-rose-900/40 rounded-lg p-2.5 border border-rose-200/60 dark:border-rose-800/50">
              <HelpCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span><strong>Tip:</strong> {error.suggestion}</span>
            </div>
          )}
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white transition shadow-sm"
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
            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 transition"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
