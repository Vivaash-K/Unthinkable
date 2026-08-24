import React, { useState } from 'react';
import { ListChecks, Check, Copy, Sparkles } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ListChecks className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Key Points</h3>
            <p className="text-xs text-slate-500">Essential insights & takeaways</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/60 transition"
          title="Copy key points to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
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
            className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed hover:bg-slate-50 transition"
          >
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mt-0.5">
              {index + 1}
            </span>
            <span className="flex-1">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
