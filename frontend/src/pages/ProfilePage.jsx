import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ItemCard } from '../components/ItemCard';
import { Toast } from '../components/Toast';
import { User, Mail, Lock, Shield, KeyRound, LogOut, FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile details state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('lost');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/profile');
      setProfileData(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load profile details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setToast({ message: 'Name and email cannot be empty', type: 'error' });
      return;
    }

    setProfileLoading(true);
    try {
      const res = await api.put('/api/profile', { name: name.trim(), email: email.trim().toLowerCase() });
      updateUser(res.data);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      let errorMsg = 'Failed to update profile';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        errorMsg = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(d => d.msg || d).join(', ') : errorMsg);
      }
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setPwdLoading(true);
    try {
      await api.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setToast({ message: 'Password updated successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to change password';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setPwdLoading(false);
    }
  };


  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Sidebar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      <main className="flex-1 min-w-0 space-y-8">
        
        {/* User Details Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-blue-500/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase">
                  {user?.role}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>

        {/* Settings Column & User Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-6">
            {/* Edit Profile Details Card */}
            <div className="glass-panel rounded-3xl p-6 space-y-4 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Edit Profile Details
              </h3>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all text-xs disabled:opacity-50 shadow-md shadow-blue-500/20"
                >
                  {profileLoading ? 'Saving Profile...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="glass-panel rounded-3xl p-6 space-y-4 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                Change Password
              </h3>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all text-xs disabled:opacity-50 shadow-md shadow-blue-500/20"
                >
                  {pwdLoading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>


          {/* User's Reports Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                My Submitted Reports
              </h3>

              <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('lost')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === 'lost'
                      ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  My Lost ({profileData?.lost_items?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('found')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === 'found'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  My Found ({profileData?.found_items?.length || 0})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeTab === 'lost' ? (
                profileData?.lost_items?.length > 0 ? (
                  profileData.lost_items.map((item) => (
                    <ItemCard key={`my-lost-${item.id}`} item={item} type="lost" />
                  ))
                ) : (
                  <p className="col-span-full text-slate-400 text-center py-10 text-sm">No lost item reports submitted yet.</p>
                )
              ) : (
                profileData?.found_items?.length > 0 ? (
                  profileData.found_items.map((item) => (
                    <ItemCard key={`my-found-${item.id}`} item={item} type="found" />
                  ))
                ) : (
                  <p className="col-span-full text-slate-400 text-center py-10 text-sm">No found item reports submitted yet.</p>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
