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
    <div className="bg-white dark:bg-espresso-900 rounded-2xl border border-sand-200 dark:border-espresso-700 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-sand-900 dark:text-sand-100">Select Summary Length</h3>
          <p className="text-xs text-sand-500 dark:text-sand-400">
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
                  ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-600 dark:border-brand-500 shadow-sm ring-2 ring-brand-500/20'
                  : 'bg-white dark:bg-espresso-850 border-sand-200 dark:border-espresso-700 hover:border-sand-300 dark:hover:border-espresso-600 hover:bg-sand-50/60 dark:hover:bg-espresso-800'
              } ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected
                        ? 'bg-brand-600 dark:bg-brand-500 text-white'
                        : 'bg-sand-100 dark:bg-espresso-800 text-sand-600 dark:text-sand-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-brand-950 dark:text-brand-100' : 'text-sand-800 dark:text-sand-200'
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-brand-200 dark:bg-brand-900/80 text-brand-900 dark:text-brand-200'
                      : 'bg-sand-100 dark:bg-espresso-800 text-sand-500 dark:text-sand-400'
                  }`}
                >
                  {option.badge}
                </span>
              </div>
              <p className="text-xs text-sand-500 dark:text-sand-400 leading-snug mt-0.5">
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
              ? 'bg-sand-300 dark:bg-espresso-800 cursor-not-allowed shadow-none text-sand-500'
              : 'bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 hover:from-brand-500 hover:to-brand-600 active:scale-[0.99] shadow-brand-700/20 hover:shadow-lg hover:shadow-brand-600/30'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating AI Summary in a Nutshell...</span>
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
