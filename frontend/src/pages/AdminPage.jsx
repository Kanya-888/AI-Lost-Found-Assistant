import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Toast } from '../components/Toast';
import { Shield, Users, Database, Trash2, Cpu, HardDrive, Sparkles } from 'lucide-react';
import api from '../services/api';

export const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, metricsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/metrics'),
        api.get('/api/admin/users')
      ]);
      setStats(statsRes.data);
      setMetrics(metricsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setToast({ message: 'Admin privileges required to access metrics', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpam = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete ${type} report #${id}?`)) return;

    try {
      await api.delete(`/api/admin/reports/${type}/${id}`);
      setToast({ message: `Successfully deleted ${type} report #${id}`, type: 'success' });
      fetchAdminData();
    } catch (err) {
      setToast({ message: 'Failed to delete report', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Sparkles className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Sidebar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      <main className="flex-1 min-w-0 space-y-8">
        
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">System Administration Dashboard</h1>
              <p className="text-purple-100 text-xs mt-1">
                Monitor platform analytics, manage user accounts, inspect FAISS vector indices, and delete spam reports.
              </p>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Users</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.total_users || 0}</h3>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">FAISS Vector Index</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics?.faiss_index_size || 0}</h3>
              <p className="text-[11px] text-slate-500">Vector Embeddings</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmed Matches</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats?.confirmed_matches || 0}</h3>
              <p className="text-[11px] text-slate-500">Pending: {stats?.pending_matches || 0}</p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upload Storage</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics?.storage_used_mb || 0} MB</h3>
              <p className="text-[11px] text-slate-500">OpenCLIP Images</p>
            </div>
          </div>
        </div>

        {/* User Account Management Table */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Platform Users Management
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">#{u.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-emerald-600">Active</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
