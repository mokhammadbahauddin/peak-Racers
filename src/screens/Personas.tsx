import React from 'react';
import { ArrowLeft, Users, Target, Rocket } from 'lucide-react';

export const Personas = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
         <div className="absolute top-[10%] right-[15%] w-[40vw] h-[40vw] bg-pink-300 rounded-full mix-blend-multiply blur-[100px] opacity-40 animate-pulse" style={{ animationDuration: '6s' }}></div>
         <div className="absolute bottom-[10%] left-[5%] w-[50vw] h-[50vw] bg-cyan-300 rounded-full mix-blend-multiply blur-[120px] opacity-40 animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Personas & JTBD</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        {/* Foundation Card */}
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-3xl md:text-4xl text-secondary font-black mb-4 uppercase">Discovery & UX Foundation</h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Our product is built around a single unifying job-to-be-done: 
            <br/><br/>
            <span className="text-primary font-bold italic text-xl">"I want a competitive game that doesn't raise my cortisol."</span>
          </p>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Persona 1 */}
          <div className="glass-panel p-8 shadow-xl rounded-3xl border-white hover:-translate-y-2 transition-transform duration-300 flex flex-col">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  🌸
                </div>
                <div>
                   <h2 className="font-display text-xl text-primary font-black leading-tight">The Cozy Gamer</h2>
                   <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Sofia, 28 · UX Designer</span>
                </div>
             </div>
             <div className="space-y-4 text-sm flex-1">
                <div>
                   <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-1">Goal</strong>
                   <span className="text-slate-600">Decompress after work without doomscrolling. Play 20-min sessions.</span>
                </div>
                <div>
                   <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-1">JTBD</strong>
                   <span className="text-slate-600 italic">"When I'm overstimulated, I want to play something competitive but calming..."</span>
                </div>
             </div>
             <div className="pt-6 mt-auto">
                <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-2">Primary Features</strong>
                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-white/60 rounded-full text-slate-600 font-medium text-xs border border-white shadow-sm">Grand Prix</span>
                   <span className="px-3 py-1 bg-white/60 rounded-full text-slate-600 font-medium text-xs border border-white shadow-sm">Garage</span>
                </div>
             </div>
          </div>

          {/* Persona 2 */}
          <div className="glass-panel p-8 shadow-xl rounded-3xl border-white hover:-translate-y-2 transition-transform duration-300 flex flex-col">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  🏆
                </div>
                <div>
                   <h2 className="font-display text-xl text-secondary font-black leading-tight">The Completionist</h2>
                   <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Marcus, 23 · Software Eng</span>
                </div>
             </div>
             <div className="space-y-4 text-sm flex-1">
                <div>
                   <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-1">Goal</strong>
                   <span className="text-slate-600">Reach #1 on every track's leaderboard. Own every Legendary skin.</span>
                </div>
                <div>
                   <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-1">JTBD</strong>
                   <span className="text-slate-600 italic">"...I want to master a skill-based game, so I can see measurable progress."</span>
                </div>
             </div>
             <div className="pt-6 mt-auto">
                <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-2">Primary Features</strong>
                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-white/60 rounded-full text-slate-600 font-medium text-xs border border-white shadow-sm">Leaderboards</span>
                   <span className="px-3 py-1 bg-white/60 rounded-full text-slate-600 font-medium text-xs border border-white shadow-sm">Pro Upgrades</span>
                </div>
             </div>
          </div>

          {/* Persona 3 */}
          <div className="glass-panel p-8 shadow-xl rounded-3xl border-white hover:-translate-y-2 transition-transform duration-300 flex flex-col">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  ⏱️
                </div>
                <div>
                   <h2 className="font-display text-xl text-amber-600 font-black leading-tight max-w-[120px]">The Casual Dripper</h2>
                   <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Priya, 41 · Marketing</span>
                </div>
             </div>
             <div className="space-y-4 text-sm flex-1">
                <div>
                   <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-1">Goal</strong>
                   <span className="text-slate-600">5-minute sessions. Play on commute or lunch break. No commitment.</span>
                </div>
                <div>
                   <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-1">JTBD</strong>
                   <span className="text-slate-600 italic">"...I want to do something fun and pretty, to feel like I had a micro-vacation."</span>
                </div>
             </div>
             <div className="pt-6 mt-auto">
                <strong className="block text-slate-700 text-xs uppercase tracking-wider mb-2">Primary Features</strong>
                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-white/60 rounded-full text-slate-600 font-medium text-xs border border-white shadow-sm">Quick Race</span>
                   <span className="px-3 py-1 bg-white/60 rounded-full text-slate-600 font-medium text-xs border border-white shadow-sm">World Map</span>
                </div>
             </div>
          </div>

        </div>

      </div>
    </main>
  );
};
