import React from 'react';
import { Sparkles } from 'lucide-react';

export const SimilarityBadge = ({ score }) => {
  const percentage = Math.round(score * 100);

  let badgeColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700 dark:text-emerald-400';
  let bgColor = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';

  if (percentage < 70) {
    badgeColor = 'bg-amber-500';
    textColor = 'text-amber-700 dark:text-amber-400';
    bgColor = 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  } else if (percentage < 80) {
    badgeColor = 'bg-blue-500';
    textColor = 'text-blue-700 dark:text-blue-400';
    bgColor = 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
  }

  return (
    <div className={`p-3 rounded-2xl border ${bgColor} flex flex-col gap-1.5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className={textColor}>AI Confidence Score</span>
        </div>
        <span className={`text-base font-extrabold ${textColor}`}>
          {percentage}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${badgeColor} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
