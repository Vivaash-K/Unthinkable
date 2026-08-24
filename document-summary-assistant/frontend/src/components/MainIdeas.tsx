import React from 'react';
import { Tag, Compass } from 'lucide-react';

interface MainIdeasProps {
  mainIdeas: string[];
}

export default function MainIdeas({ mainIdeas }: MainIdeasProps) {
  if (!mainIdeas || mainIdeas.length === 0) return null;

  return (
    <div className="bg-white dark:bg-espresso-900 rounded-2xl border border-sand-200 dark:border-espresso-700 p-6 shadow-sm flex flex-col h-full transition-colors">
      {/* Header */}
      <div className="flex items-center space-x-2.5 pb-4 border-b border-sand-100 dark:border-espresso-800 mb-4">
        <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/70 dark:border-brand-800/60">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-sand-900 dark:text-sand-50">Main Ideas</h3>
          <p className="text-xs text-sand-500 dark:text-sand-400">Core themes & topics</p>
        </div>
      </div>

      {/* Topics / Chips */}
      <div className="flex flex-wrap gap-2.5 flex-1 content-start">
        {mainIdeas.map((idea, index) => {
          // Curated warm beige, caramel, amber, bronze & sage chip palettes
          const colorStyles = [
            'bg-brand-50 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 border-brand-200/80 dark:border-brand-800/70 hover:bg-brand-100 dark:hover:bg-brand-900',
            'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-200/80 dark:border-amber-800/70 hover:bg-amber-100 dark:hover:bg-amber-900',
            'bg-sand-100 dark:bg-espresso-800 text-sand-800 dark:text-sand-200 border-sand-300 dark:border-espresso-700 hover:bg-sand-200 dark:hover:bg-espresso-750',
            'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-200/80 dark:border-emerald-800/70 hover:bg-emerald-100 dark:hover:bg-emerald-900',
            'bg-orange-50 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 border-orange-200/80 dark:border-orange-800/70 hover:bg-orange-100 dark:hover:bg-orange-900',
            'bg-stone-100 dark:bg-stone-900/80 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-850',
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
