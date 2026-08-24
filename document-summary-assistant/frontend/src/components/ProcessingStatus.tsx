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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6 animate-fade-in">
      {/* Title & Pulse Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            {statusMessage || 'Processing Document...'}
          </h3>
        </div>
        <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200/60">
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
                  ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                  : isCurrent
                  ? 'bg-brand-50/90 border-brand-400 text-brand-950 ring-2 ring-brand-500/20'
                  : 'bg-slate-50/50 border-slate-200/60 text-slate-400'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
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

      {/* Skeleton placeholders so UI is never static */}
      <div className="space-y-3 pt-2">
        <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
        <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
      </div>
    </div>
  );
}
