import React from 'react';
import { MapPin, Calendar, Tag, Image as ImageIcon } from 'lucide-react';

export const ItemCard = ({ item, type = 'lost', onDelete }) => {
  const isLost = type === 'lost';
  const imageUrl = item.image_path ? `http://localhost:8000${item.image_path}` : null;

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    matched: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    resolved: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-900',
  };

  return (
    <div className="glass-card overflow-hidden group flex flex-col h-full">
      {/* Image Thumbnail Header */}
      <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60';
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
            <ImageIcon className="w-10 h-10 stroke-1" />
            <span className="text-xs font-medium">No Image Uploaded</span>
          </div>
        )}

        {/* Type Badge (Lost vs Found) */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-md ${
            isLost 
              ? 'bg-rose-600 text-white' 
              : 'bg-emerald-600 text-white'
          }`}>
            {isLost ? 'Lost' : 'Found'}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize border backdrop-blur-md shadow-sm ${
            statusColors[item.status] || 'bg-slate-100 text-slate-700'
          }`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{item.category}</span>
          </div>

          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.name}
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{isLost ? `Lost on ${item.date_lost}` : `Found on ${item.date_found}`}</span>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(type, item.id)}
            className="w-full py-2 px-3 mt-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
          >
            Delete Spam Report
          </button>
        )}
      </div>
    </div>
  );
};
