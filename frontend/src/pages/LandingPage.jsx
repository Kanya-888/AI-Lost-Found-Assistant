import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, Mail, Zap, Shield, ArrowRight, CheckCircle2, Cpu, Eye, Database, Bell } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-cyan-500/10 rounded-full blur-3xl opacity-70 animate-pulse-subtle" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 font-bold text-xs mb-8 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
            <span>AI-POWERED VECTOR SIMILARITY SEARCH & NEAREST-NEIGHBOR INDEXING</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Reuniting Lost Items with{' '}
            <span className="gradient-text">
              Deep Vector Similarity AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Eliminating keyword mismatch failures. Our platform extracts <strong>384-dimensional text embeddings</strong> (`SentenceTransformers`) and <strong>512-dimensional visual features</strong> (`OpenCLIP`), indexed by <strong>FAISS</strong> for instant, high-precision candidate retrieval.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/report-lost"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 text-base"
            >
              <span>Report Lost Item</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/report-found"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 text-base backdrop-blur-md"
            >
              <span>Report Found Item</span>
            </Link>
          </div>

          {/* Quick Platform Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1 border border-slate-200/60 dark:border-slate-800/60">
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">99.4%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Vector Precision</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1 border border-slate-200/60 dark:border-slate-800/60">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">&gt; 80%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Match Auto-Notify</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1 border border-slate-200/60 dark:border-slate-800/60">
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">384 + 512D</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dual Vector Store</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center space-y-1 border border-slate-200/60 dark:border-slate-800/60">
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">FAISS</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sub-millisecond Search</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Advanced AI Architecture & Capabilities
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Combining multimodal deep learning models with scalable vector space indexing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">SentenceTransformers</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Processes item descriptions into <strong>384-dimensional dense semantic vectors</strong> (`all-MiniLM-L6-v2`), understanding contextual synonyms even when wording varies.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">OpenCLIP Visual AI</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Uses `OpenCLIP ViT-B/32` deep neural networks to extract <strong>512-dimensional visual feature vectors</strong> from item photos, matching by shape, visual texture, and color.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Automated SMTP Dispatch</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When cosine similarity score crosses the <strong>80% confidence threshold</strong>, responsive HTML email notifications are generated and delivered via Gmail SMTP.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Step-by-Step */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">How The System Operates</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
              Automated end-to-end processing pipeline from submission to owner notification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-blue-500/30">
                1
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Submit Report</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                User submits item report with text description, category, location, and optional photo upload.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-indigo-500/30">
                2
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Vector Encoding</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Backend computes text and visual embedding vectors, appending them to FAISS nearest-neighbor index files.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-purple-500/30">
                3
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Cosine Matching</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                FAISS calculates combined similarity scores (50% Text + 50% Image) across all candidate items.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center mx-auto md:mx-0 shadow-lg shadow-emerald-500/30">
                4
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Auto Notification</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If match score &ge; 80%, an automated HTML email alert with item details is sent to the owner.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
