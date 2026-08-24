import React from 'react';
import { CheckCircle2, Loader2, Circle, Sparkles, FileText, Search, BrainCircuit } from 'lucide-react';
import { ProcessingStage } from '../types';

interface ProcessingStatusProps {
  stage: ProcessingStage;
  statusMessage?: string;
}

const STAGES = [
  { id: 'uploading', label: 'Uploading Document', icon: FileText },
  { id: 'extracting', label: 'Extracting Text & OCR', icon: Search },
  { id: 'analyzing', label: 'Analyzing Content', icon: BrainCircuit },
  { id: 'summarizing', label: 'Generating Summary', icon: Sparkles },
];

export default function ProcessingStatus({ stage, statusMessage }: ProcessingStatusProps) {
  const getStageIndex = (s: ProcessingStage): number => {
    switch (s) {
      case 'uploading': return 0;
      case 'extracting': return 1;
      case 'analyzing': return 2;
      case 'summarizing': return 3;
      case 'completed': return 4;
      default: return -1;
    }
  };

  const currentIndex = getStageIndex(stage);

  return (
    <div className="bg-white dark:bg-espresso-900 rounded-2xl border border-sand-200 dark:border-espresso-700 p-6 shadow-sm space-y-6 animate-fade-in">
      {/* Title & Pulse Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600 dark:bg-brand-400" />
          </div>
          <h3 className="text-sm font-semibold text-sand-900 dark:text-sand-100">
            {statusMessage || 'Processing Document...'}
          </h3>
        </div>
        <span className="text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/80 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800/80">
          Step {Math.min(currentIndex + 1, 4)} of 4
        </span>
      </div>

      {/* Progress Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {STAGES.map((stg, idx) => {
          const Icon = stg.icon;
          const isDone = currentIndex > idx;
          const isCurrent = currentIndex === idx;

          return (
            <div
              key={stg.id}
              className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300'
                  : isCurrent
                  ? 'bg-brand-50 dark:bg-brand-950/70 border-brand-400 dark:border-brand-500 text-brand-950 dark:text-brand-100 ring-2 ring-brand-500/20'
                  : 'bg-sand-50/50 dark:bg-espresso-850 border-sand-200 dark:border-espresso-700 text-sand-400 dark:text-sand-500'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-brand-600 dark:text-brand-400 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-sand-300 dark:text-espresso-700" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">{stg.label}</p>
                <p className="text-[11px] opacity-75">
                  {isDone ? 'Complete' : isCurrent ? 'In progress...' : 'Pending'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skeleton placeholders */}
      <div className="space-y-3 pt-2">
        <div className="h-4 bg-sand-100 dark:bg-espresso-800 rounded-full w-3/4 animate-pulse" />
        <div className="h-4 bg-sand-100 dark:bg-espresso-800 rounded-full w-full animate-pulse" />
        <div className="h-4 bg-sand-100 dark:bg-espresso-800 rounded-full w-5/6 animate-pulse" />
      </div>
    </div>
  );
}
