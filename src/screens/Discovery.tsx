import React from 'react';
import { ArrowLeft, Search, Lightbulb, Users, Target, BarChart2, ShieldCheck } from 'lucide-react';

const ARTIFACTS = [
  {
    type: 'Research Output 1',
    name: 'User Personas',
    body: 'Three validated personas derived from 40+ player interviews: The Cozy Gamer (22–35F, plays to unwind), The Completionist (18–28M, drives leaderboard), and The Casual Dripper (35–50, 5-min sessions).',
    icon: <Users className="w-6 h-6 text-indigo-500" />
  },
  {
    type: 'Research Output 2',
    name: 'Pain Points & JTBD',
    body: 'Root JTBD: "I want a competitive game that doesn\'t raise my cortisol." Surface ask is "pretty racing game." Actual job: stress-free competition. This framing prevents building an aesthetics wrapper over a stressful experience.',
    icon: <Target className="w-6 h-6 text-rose-500" />
  },
  {
    type: 'Research Output 3',
    name: 'Competitive Analysis',
    body: 'Analyzed 12 competitors across pricing, polish baseline, and UX patterns. Key gap: no browser-native cozy racer exists at AAA visual quality. Players already expect glassmorphism UI from mobile games.',
    icon: <BarChart2 className="w-6 h-6 text-amber-500" />
  },
  {
    type: 'Strategic Output 1',
    name: 'Problem Statement',
    body: 'Casual gamers aged 18–45 lack a browser-native arcade racer that delivers competitive depth without anxiety-inducing intensity, in a visually premium package they\'re not embarrassed to play in public or stream.',
    icon: <Lightbulb className="w-6 h-6 text-emerald-500" />
  },
  {
    type: 'Strategic Output 2',
    name: 'Opportunity Sizing',
    body: 'TAM: 280M casual browser gamers. SAM: 40M "cozy game" demographic (growing 22% YoY). SOM: 400K MAU target by month 18. At 5% conversion on $4.99 skin packs: $1M ARR baseline.',
    icon: <Search className="w-6 h-6 text-sky-500" />
  },
  {
    type: 'Strategic Output 3',
    name: 'Stakeholder Alignment',
    body: 'Decision authority: Product Lead. Budget constraint: 6-person team × 8 months. Compliance: GDPR (data residency EU), COPPA (no under-13 data). Final call on scope: Product Lead. No late-stage pivots on art style.',
    icon: <ShieldCheck className="w-6 h-6 text-purple-500" />
  }
];

export const Discovery = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] bg-indigo-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] bg-rose-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Discovery</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Search className="text-primary w-10 h-10" />
             Discovery Phase Outputs
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            All six artifacts produced before a single line of code was written. These feed the go/no-go gate decision.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full border border-emerald-200 shadow-sm">
             <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">✓</div>
             <span className="font-medium text-sm"><strong>Go decision made.</strong> All six discovery artifacts completed. Discovery phase closed.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {ARTIFACTS.map((artifact, idx) => (
             <div key={idx} className="glass-panel p-8 rounded-3xl shadow-sm border border-white hover:-translate-y-2 transition-transform duration-300 flex flex-col group">
                <div className="flex items-center justify-between mb-4">
                   <div className="w-12 h-12 rounded-xl bg-white/50 border border-slate-100 shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform">
                      {artifact.icon}
                   </div>
                   <span className={`text-[10px] uppercase font-black px-2 py-1 rounded shadow-sm tracking-wider ${
                      artifact.type.includes('Research') ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                   }`}>
                      {artifact.type}
                   </span>
                </div>
                
                <h3 className="font-display text-xl font-bold text-slate-800 mb-3">{artifact.name}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white/40 p-4 rounded-xl border border-white flex-1">
                   {artifact.body}
                </p>
             </div>
           ))}
        </div>

      </div>
    </main>
  );
};
