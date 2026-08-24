import React from 'react';
import { Sparkles, Zap, AlignLeft, BookOpen, Loader2 } from 'lucide-react';
import { SummaryLength } from '../types';

interface SummaryLengthSelectorProps {
  selectedLength: SummaryLength;
  onChange: (length: SummaryLength) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const LENGTH_OPTIONS: {
  id: SummaryLength;
  label: string;
  description: string;
  badge: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'short',
    label: 'Short',
    description: 'Concise 3–5 sentence executive overview',
    badge: 'Quick',
    icon: Zap,
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Balanced coverage of key points & context',
    badge: 'Standard',
    icon: AlignLeft,
  },
  {
    id: 'long',
    label: 'Long',
    description: 'Comprehensive deep dive with all insights',
    badge: 'Detailed',
    icon: BookOpen,
  },
];

export default function SummaryLengthSelector({
  selectedLength,
  onChange,
  onGenerate,
  isLoading,
  disabled = false,
}: SummaryLengthSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Select Summary Length</h3>
          <p className="text-xs text-slate-500">
            Choose the level of depth for the generated AI summary.
          </p>
        </div>
      </div>

      {/* Segmented Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LENGTH_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedLength === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled || isLoading}
              onClick={() => onChange(option.id)}
              className={`flex flex-col text-left p-3.5 rounded-xl border-2 transition-all relative ${
                isSelected
                  ? 'bg-brand-50/70 border-brand-600 shadow-sm ring-2 ring-brand-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              } ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-brand-900' : 'text-slate-800'
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-brand-200/60 text-brand-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {option.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug mt-0.5">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Prominent Action Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={onGenerate}
          className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm text-white shadow-md transition-all duration-200 ${
            disabled || isLoading
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 active:scale-[0.99] shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating AI Summary...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Generate Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
