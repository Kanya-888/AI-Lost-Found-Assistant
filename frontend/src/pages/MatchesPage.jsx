import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MatchCard } from '../components/MatchCard';
import { Toast } from '../components/Toast';
import { History, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';

export const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/api/matches');
      setMatches(res.data);
    } catch (err) {
      setToast({ message: 'Failed to retrieve match history', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (matchId, newStatus) => {
    try {
      await api.put(`/api/matches/${matchId}/status`, { status: newStatus });
      setToast({ message: `Match #${matchId} marked as ${newStatus}`, type: 'success' });
      fetchMatches();
    } catch (err) {
      setToast({ message: 'Failed to update match status', type: 'error' });
    }
  };

  const filteredMatches = matches.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Sidebar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      <main className="flex-1 min-w-0 space-y-6">
        
        {/* Page Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Match History</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confidence scores derived from SentenceTransformers & OpenCLIP vector embeddings.
              </p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {['all', 'matched', 'pending', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Match Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="space-y-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} onUpdateStatus={handleUpdateStatus} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl space-y-3">
            <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Matches Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No AI candidates matched the current filter. Report lost or found items to calculate new vector similarity scores.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
