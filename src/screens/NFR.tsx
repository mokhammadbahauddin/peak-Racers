import React from 'react';
import { ArrowLeft, Zap, Globe, Clock, Server, Users, Accessibility, Settings2 } from 'lucide-react';

export const NFR = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const nfrs = [
    { icon: <Zap size={24} />, title: 'Performance', metric: '60 FPS', desc: 'Sustained on mid-tier desktop (2019 MacBook Pro). Three.js scene must not exceed 12ms frame budget.', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { icon: <Globe size={24} />, title: 'API Latency', metric: '< 150ms', desc: 'P95 latency for leaderboard submission and profile update. SLA measurement via CloudWatch.', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: <Clock size={24} />, title: 'Time to Interactive', metric: '< 3s', desc: 'Main menu interactive within 3 seconds on 10 Mbps connection. Game assets streamed progressively.', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { icon: <Server size={24} />, title: 'Uptime SLA', metric: '99.5%', desc: 'Measured monthly. Allows max 3.6 hours downtime/month. Excludes scheduled maintenance (max 1h/week).', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { icon: <Users size={24} />, title: 'Concurrency', metric: '5,000', desc: 'Concurrent sessions without performance degradation. Load test required before each deployment.', color: 'text-pink-600', bg: 'bg-pink-100' },
    { icon: <Accessibility size={24} />, title: 'Accessibility', metric: 'WCAG 2.1 AA', desc: 'High-contrast text mode. Motion reduction for vestibular sensitivity. Keyboard navigable menus.', color: 'text-teal-600', bg: 'bg-teal-100' },
  ];

  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] bg-amber-200/50 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] bg-orange-200/50 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">NFRs</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-amber-700 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Settings2 className="text-amber-500 w-10 h-10" />
             Non-Functional Requirements
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            NFRs are what developers need to make architecture decisions. Missing NFRs cause expensive rewrites. These are hard constraints, not aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {nfrs.map((nfr, idx) => (
             <div key={idx} className="glass-panel p-8 rounded-3xl shadow-md border border-white hover:-translate-y-2 transition-transform duration-300 group flex flex-col items-center text-center">
               <div className={`w-16 h-16 ${nfr.bg} ${nfr.color} rounded-full flex items-center justify-center mb-6`}>
                 {nfr.icon}
               </div>
               <h3 className="font-display font-bold text-xl text-slate-800 mb-2">{nfr.title}</h3>
               <div className={`font-mono text-xl font-black ${nfr.color} bg-white/50 px-4 py-1 rounded-full mb-4 shadow-sm border border-white`}>
                 {nfr.metric}
               </div>
               <p className="text-sm text-slate-600 font-medium leading-relaxed">
                 {nfr.desc}
               </p>
             </div>
           ))}
        </div>

      </div>
    </main>
  );
};
