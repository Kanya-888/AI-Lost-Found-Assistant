import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Toast } from '../components/Toast';
import { Search, Sparkles, SlidersHorizontal, ArrowRight, FileText } from 'lucide-react';
import api from '../services/api';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [targetType, setTargetType] = useState('found');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(`/api/matches/vector-search?query_text=${encodeURIComponent(query)}&target_type=${targetType}`);
      setResults(res.data);
    } catch (err) {
      setToast({ message: 'Vector search failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Sidebar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      <main className="flex-1 min-w-0 space-y-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">FAISS Nearest Neighbor Search</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Query high-dimensional vector space using natural language descriptions.
              </p>
            </div>
          </div>

          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Black leather wallet with student ID card..."
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
            </div>

            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none"
            >
              <option value="found">Search Found Items</option>
              <option value="lost">Search Lost Items</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-6 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Query Vector Store</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Container */}
        {results && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Top 5 Nearest Vectors for "{results.query}"
            </h2>

            {results.top_matches.length > 0 ? (
              <div className="space-y-3">
                {results.top_matches.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Target Item ID #{item.item_id}</h4>
                        <p className="text-xs text-slate-500">Target Index: {results.target_type}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                        {item.similarity_percentage}%
                      </span>
                      <p className="text-[10px] text-slate-400">Cosine Vector Score</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">No vector neighbors found for this query.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
