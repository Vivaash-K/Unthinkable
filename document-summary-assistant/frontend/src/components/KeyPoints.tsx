import React, { useState } from 'react';
import { ListChecks, Check, Copy } from 'lucide-react';

interface KeyPointsProps {
  keyPoints: string[];
}

export default function KeyPoints({ keyPoints }: KeyPointsProps) {
  const [copied, setCopied] = useState(false);

  if (!keyPoints || keyPoints.length === 0) return null;

  const handleCopy = () => {
    const text = keyPoints.map((kp, idx) => `${idx + 1}. ${kp}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-espresso-900 rounded-2xl border border-sand-200 dark:border-espresso-700 p-6 shadow-sm flex flex-col h-full transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sand-100 dark:border-espresso-800 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
            <ListChecks className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-sand-900 dark:text-sand-50">Key Points</h3>
            <p className="text-xs text-sand-500 dark:text-sand-400">Essential insights & takeaways</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sand-700 dark:text-sand-300 bg-sand-50 dark:bg-espresso-800 hover:bg-sand-100 dark:hover:bg-espresso-750 active:bg-sand-200 border border-sand-200 dark:border-espresso-700 transition"
          title="Copy key points to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-sand-500 dark:text-sand-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Bullet Points List */}
      <ul className="space-y-3 flex-1">
        {keyPoints.map((point, index) => (
          <li
            key={index}
            className="flex items-start space-x-3 p-3 rounded-xl bg-sand-50/70 dark:bg-espresso-850 border border-sand-100 dark:border-espresso-800 text-xs sm:text-sm text-sand-800 dark:text-sand-200 leading-relaxed hover:bg-sand-100/70 dark:hover:bg-espresso-800 transition"
          >
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold mt-0.5 border border-emerald-200 dark:border-emerald-700">
              {index + 1}
            </span>
            <span className="flex-1">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
