import React from 'react';
import { Link } from 'react_router_dom';
import { Sparkles, Search, Mail, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold text-xs mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
            <span>Next-Gen Artificial Intelligence Lost & Found Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Reuniting Lost Belongings with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Deep Vector Similarity AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            No more keyword guessing. Our system combines <strong>SentenceTransformers</strong> text embeddings and <strong>OpenCLIP</strong> image features with <strong>FAISS</strong> vector indexing for high-precision item matching.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/report-lost"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2 text-base"
            >
              <span>Report Lost Item</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/report-found"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 text-base"
            >
              <span>Report Found Item</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Powered by Cutting-Edge AI Architecture
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Engineered for high accuracy and rapid vector search candidate retrieval.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">SentenceTransformers</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Uses <code>all-MiniLM-L6-v2</code> 384-dimensional text embeddings to understand semantic description similarity far beyond plain keywords.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">OpenCLIP Visual AI</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Extracts high-dimensional visual feature vectors using OpenCLIP ViT-B/32 models to match item photos by shape, color, and texture.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Automated SMTP Dispatch</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When confidence crosses the 80% match threshold, an automated email notification with collection details is dispatched instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
