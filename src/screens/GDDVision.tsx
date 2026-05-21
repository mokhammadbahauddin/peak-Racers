import React from 'react';
import { ArrowLeft, Target, Heart, Sparkles, Paintbrush, Repeat } from 'lucide-react';

export const GDDVision = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] bg-pink-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] bg-cyan-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Section 01: Vision</span>
        <div className="w-[160px]"></div>
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Target className="text-primary w-10 h-10" />
             Game Vision & Design Pillars
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Everything in this game traces back to three non-negotiable pillars. If a feature conflicts with a pillar, the feature loses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-3xl shadow-sm border border-pink-200 border-t-4 border-t-pink-500 hover:-translate-y-2 transition-transform duration-300">
            <Heart className="w-10 h-10 text-pink-500 mb-4" />
            <h3 className="font-display text-xl font-bold text-slate-800 mb-2">Pillar 1 — Cozy Competitive</h3>
            <p className="text-sm text-slate-600 font-medium bg-white/50 p-4 rounded-xl border border-white h-32">
              The game must feel competitive without raising cortisol. Losing is gentle. Winning is satisfying but not smug. Rubberband AI prevents blowouts. Stars reset frustration.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl shadow-sm border border-cyan-200 border-t-4 border-t-cyan-500 hover:-translate-y-2 transition-transform duration-300">
            <Sparkles className="w-10 h-10 text-cyan-600 mb-4" />
            <h3 className="font-display text-xl font-bold text-slate-800 mb-2">Pillar 2 — Digitally Tactile</h3>
            <p className="text-sm text-slate-600 font-medium bg-white/50 p-4 rounded-xl border border-white h-32">
              Every interaction must feel physically satisfying. The cars have weight. Drifts leave trails. Coins burst. Buttons depress. "Juice" is a first-class design concern.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl shadow-sm border border-emerald-200 border-t-4 border-t-emerald-600 hover:-translate-y-2 transition-transform duration-300">
            <Paintbrush className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="font-display text-xl font-bold text-slate-800 mb-2">Pillar 3 — Premium Aesthetic</h3>
            <p className="text-sm text-slate-600 font-medium bg-white/50 p-4 rounded-xl border border-white h-32">
              The game must look good enough to screenshot and share. Glassmorphism UI. Soft isometric 3D. Clay-mation vehicles.
            </p>
          </div>
        </div>

        <div className="glass-panel p-10 shadow-lg border-white rounded-[2rem]">
          <h2 className="font-display text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
             <Repeat className="text-primary w-6 h-6" />
             Core Game Loop
          </h2>
          
          <div className="flex flex-wrap gap-2 items-center justify-center bg-white/50 p-6 rounded-2xl border border-white text-center">
            <div className="px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl font-bold text-pink-700">Select Track</div>
            <div className="text-slate-400 font-black">→</div>
            <div className="px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-xl font-bold text-cyan-700">Race</div>
            <div className="text-slate-400 font-black">→</div>
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl font-bold text-amber-700">Results</div>
            <div className="text-slate-400 font-black">→</div>
            <div className="px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl font-bold text-indigo-700">Upgrade / Buy</div>
            <div className="text-slate-400 font-black">→</div>
            <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-700">Unlock</div>
            <div className="text-slate-400 font-black">→</div>
            <div className="px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 animate-pulse">Repeat</div>
          </div>
          <p className="mt-6 text-sm text-slate-600 bg-indigo-50/50 border-l-4 border-indigo-400 p-4 rounded-r-xl">
             <strong>Design Rule:</strong> There must always be a visible "next thing to do" at every point in the loop. The world map, upgrade screen, and shop all surface the nearest unlock gate prominently.
          </p>
        </div>

      </div>
    </main>
  );
};
