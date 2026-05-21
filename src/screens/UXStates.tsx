import React from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Mailbox, Zap, Shuffle, Activity, LayoutTemplate, ShieldAlert } from 'lucide-react';

export const UXStates = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[10%] right-[20%] w-[35vw] h-[35vw] bg-indigo-200/50 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '9s' }}></div>
        <div className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] bg-violet-200/50 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">UX & Observability</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-indigo-700 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <LayoutTemplate className="text-indigo-500 w-10 h-10" />
             UX States & Error Handling
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Every screen must handle all five states before it ships. "We forgot to handle errors" is not a valid postmortem finding.
          </p>
        </div>

        {/* 5 States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Happy Path */}
          <div className="glass-panel p-6 shadow-md rounded-2xl border-white hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
               <CheckCircle2 size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Happy Path</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
               Data loaded, user logged in, race available. Primary flow. Designed first.
            </p>
          </div>

          {/* Loading */}
          <div className="glass-panel p-6 shadow-md rounded-2xl border-white hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <Loader2 size={24} className="animate-spin" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Loading</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
               Skeleton screens and loading car animation. Max perceived wait: 800ms before progress bar appears.
            </p>
          </div>

          {/* Empty State */}
          <div className="glass-panel p-6 shadow-md rounded-2xl border-white hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-4">
               <Mailbox size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Empty State</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
               No vehicles owned, no races completed, new account. Must guide user to first action, not show blank UI.
            </p>
          </div>

          {/* Error State */}
          <div className="glass-panel p-6 shadow-md rounded-2xl border-white hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
               <Zap size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Error State</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
               Connection lost mid-race, API failure, payment error. Always include retry action + human-readable message.
            </p>
          </div>

          {/* Edge Cases */}
          <div className="glass-panel p-6 shadow-md rounded-2xl border-white hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
               <Shuffle size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Edge Cases</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
               10,000 leaderboard entries, 0-coin balance at shop, network timeout at lap 3. All must be handled gracefully.
            </p>
          </div>

        </div>

        {/* Observability Section */}
        <div className="mt-8">
           <h2 className="font-display text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
              <Activity className="text-indigo-500" />
              Observability & Structured Logging
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white/80 p-8 rounded-3xl shadow-sm border border-slate-100">
                 <h3 className="font-display font-bold text-xl mb-4 text-slate-800">Log Format (JSON)</h3>
                 <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Every log line includes: <code className="bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-xs font-bold">correlation_id</code>, <code className="bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-xs font-bold">player_id</code> (if authenticated), <code className="bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-xs font-bold">event_type</code>, <code className="bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-xs font-bold">severity</code>, <code className="bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-xs font-bold">timestamp_utc</code>, <code className="bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-xs font-bold">service</code>.
                 </p>
                 <p className="text-sm text-slate-600 leading-relaxed font-bold">
                    No free-form strings. Parsed by CloudWatch Insights.
                 </p>
              </div>
              
              <div className="bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-700 text-white">
                 <h3 className="font-display font-bold text-xl mb-4 text-indigo-300 flex items-center gap-2">
                    <ShieldAlert size={20} />
                    Alert Thresholds
                 </h3>
                 <ul className="space-y-4">
                    <li className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                       <span className="text-slate-300">P95 API latency &gt; 300ms</span>
                       <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">PagerDuty Warning</span>
                    </li>
                    <li className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                       <span className="text-slate-300">Error rate &gt; 1% over 5min</span>
                       <span className="bg-red-500/20 text-red-300 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">PagerDuty Critical</span>
                    </li>
                    <li className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                       <span className="text-slate-300">Leaderboard sync lag &gt; 120s</span>
                       <span className="bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">Slack Alert</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                       <span className="text-slate-300">CDN cache hit rate &lt; 90%</span>
                       <span className="bg-slate-600 text-slate-300 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">Engineering Ticket</span>
                    </li>
                 </ul>
              </div>

           </div>
        </div>

      </div>
    </main>
  );
};
