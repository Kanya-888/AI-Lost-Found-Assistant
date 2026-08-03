import React from 'react';
import { Link, useLocation } from 'react_router_dom';
import { LayoutDashboard, PlusCircle, History, Search, User, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Report Lost Item', path: '/report-lost', icon: PlusCircle, badge: 'Lost', badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
    { label: 'Report Found Item', path: '/report-found', icon: PlusCircle, badge: 'Found', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    { label: 'Match History', path: '/matches', icon: History },
    { label: 'AI FAISS Search', path: '/search', icon: Search },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Dashboard', path: '/admin', icon: Shield, badge: 'Admin', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' });
  }

  return (
    <aside className="w-64 glass-panel rounded-2xl p-4 hidden md:block shrink-0 h-[calc(100vh-6rem)] sticky top-20">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-xs mb-1">
          <AlertTriangle className="w-4 h-4" />
          <span>AI Matching Engine</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          SentenceTransformers + OpenCLIP cosine confidence active.
        </p>
      </div>
    </aside>
  );
};
