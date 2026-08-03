import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ItemCard } from '../components/ItemCard';
import { AlertCircle, CheckCircle2, Clock, FileText, Sparkles } from 'lucide-react';
import api from '../services/api';
import { Toast } from '../components/Toast';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lost');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/dashboard');
      setData(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load dashboard metrics', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading AI Dashboard Analytics...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Sidebar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      <main className="flex-1 space-y-8 min-w-0">
        
        {/* Welcome Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold">System Overview Dashboard</h1>
            <p className="text-blue-100 text-sm max-w-xl">
              Real-time monitoring of lost items, found items, pending reports, and automated AI match candidate pairs.
            </p>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-inner">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lost Items</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.global_lost_count || 0}</h3>
              <p className="text-[11px] text-slate-500">Your Reports: {stats.user_lost_items || 0}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Found Items</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.global_found_count || 0}</h3>
              <p className="text-[11px] text-slate-500">Your Reports: {stats.user_found_items || 0}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Matched Items</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.total_matched_items || 0}</h3>
              <p className="text-[11px] text-slate-500">&gt; 80% AI Confidence</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Reports</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.pending_reports || 0}</h3>
              <p className="text-[11px] text-slate-500">Awaiting Match</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed Header & Tab Selector */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Recent Reports Activity Feed
            </h2>

            <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('lost')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'lost'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Recent Lost ({data?.recent_lost_reports?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('found')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'found'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Recent Found ({data?.recent_found_reports?.length || 0})
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'lost' ? (
              data?.recent_lost_reports?.length > 0 ? (
                data.recent_lost_reports.map((item) => (
                  <ItemCard key={`lost-${item.id}`} item={item} type="lost" />
                ))
              ) : (
                <div className="col-span-full text-center py-12 glass-panel rounded-2xl text-slate-400">
                  No lost items reported yet.
                </div>
              )
            ) : (
              data?.recent_found_reports?.length > 0 ? (
                data.recent_found_reports.map((item) => (
                  <ItemCard key={`found-${item.id}`} item={item} type="found" />
                ))
              ) : (
                <div className="col-span-full text-center py-12 glass-panel rounded-2xl text-slate-400">
                  No found items reported yet.
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
