import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, FileText, Image as ImageIcon, MapPin } from 'lucide-react';
import { SimilarityBadge } from './SimilarityBadge';

export const MatchCard = ({ match, onUpdateStatus }) => {
  const lost = match.lost_item;
  const found = match.found_item;

  if (!lost || !found) return null;

  const lostImg = lost.image_path ? `http://localhost:8000${lost.image_path}` : null;
  const foundImg = found.image_path ? `http://localhost:8000${found.image_path}` : null;

  return (
    <div className="glass-card p-6 flex flex-col space-y-6">
      {/* Header Match Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Match #{match.id}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
              match.status === 'matched' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                : match.status === 'rejected'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {match.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detected on {new Date(match.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="w-full sm:w-64">
          <SimilarityBadge score={match.similarity_score} />
        </div>
      </div>

      {/* Side-by-side Lost vs Found Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Central Arrow */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-600 text-white items-center justify-center shadow-lg z-10">
          <ArrowRight className="w-5 h-5" />
        </div>

        {/* Lost Item Side */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Lost Item
            </span>
            <span className="text-xs font-medium text-slate-500">{lost.category}</span>
          </div>

          <div className="flex items-start gap-3">
            {lostImg ? (
              <img src={lostImg} alt={lost.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{lost.name}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">{lost.description}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{lost.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Found Item Side */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Found Item
            </span>
            <span className="text-xs font-medium text-slate-500">{found.category}</span>
          </div>

          <div className="flex items-start gap-3">
            {foundImg ? (
              <img src={foundImg} alt={found.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">{found.name}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">{found.description}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{found.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Score Breakdown & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>SentenceTransformers Text: <strong>{Math.round(match.text_score * 100)}%</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>OpenCLIP Image: <strong>{Math.round(match.image_score * 100)}%</strong></span>
          </div>
        </div>

        {match.status === 'pending' && onUpdateStatus && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onUpdateStatus(match.id, 'rejected')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Reject Match
            </button>
            <button
              onClick={() => onUpdateStatus(match.id, 'matched')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:scale-105"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
