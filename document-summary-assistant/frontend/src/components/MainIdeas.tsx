import React from 'react';
import { Tag, Compass } from 'lucide-react';

interface MainIdeasProps {
  mainIdeas: string[];
}

export default function MainIdeas({ mainIdeas }: MainIdeasProps) {
  if (!mainIdeas || mainIdeas.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Main Ideas</h3>
          <p className="text-xs text-slate-500">Major themes & core topics</p>
        </div>
      </div>

      {/* Topics / Chips */}
      <div className="flex flex-wrap gap-2.5 flex-1 content-start">
        {mainIdeas.map((idea, index) => {
          // Dynamic subtle color themes
          const colorStyles = [
            'bg-brand-50 text-brand-800 border-brand-200/70 hover:bg-brand-100',
            'bg-blue-50 text-blue-800 border-blue-200/70 hover:bg-blue-100',
            'bg-violet-50 text-violet-800 border-violet-200/70 hover:bg-violet-100',
            'bg-teal-50 text-teal-800 border-teal-200/70 hover:bg-teal-100',
            'bg-indigo-50 text-indigo-800 border-indigo-200/70 hover:bg-indigo-100',
            'bg-sky-50 text-sky-800 border-sky-200/70 hover:bg-sky-100',
          ];
          const style = colorStyles[index % colorStyles.length];

          return (
            <span
              key={index}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-default shadow-xs ${style}`}
            >
              <Tag className="w-3 h-3 opacity-60" />
              <span>{idea}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
