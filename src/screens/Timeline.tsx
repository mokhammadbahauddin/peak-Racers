import React from 'react';
import { ArrowLeft, Calendar, Flag, CheckCircle, Clock } from 'lucide-react';

const MILESTONES = [
  { week: 'Week 1–3', name: 'Foundation Complete', status: 'done', items: 'CI/CD pipeline live · DB schema migrated · Auth endpoints deployed · Three.js scene rendering at target FPS' },
  { week: 'Week 4–7', name: 'Core Race Loop', status: 'done', items: '1 playable track · Vehicle physics tuned · Lap timing working · Race submission API live · Basic HUD' },
  { week: 'Week 8–12', name: 'Full Feature Set', status: 'current', items: 'All 16 tracks · All 4 characters · Garage upgrades · Power-ups · Shop · Leaderboard · Victory screen · Settings' },
  { week: 'Week 13–15', name: 'QA & UAT', status: 'pending', items: 'Full test suite passing · 5K concurrent load test passing · UAT with 20 recruited players · All 5 UX states verified on every screen' },
  { week: 'Week 16', name: 'Soft Launch (5% Traffic)', status: 'pending', items: 'Canary deploy · PagerDuty alerts live · Rollback plan tested · Legal sign-off on GDPR · Pen test report reviewed' },
  { week: 'Week 17–18', name: 'General Availability', status: 'pending', items: '100% traffic · Press release · Day-1 retention measurement starts · Architecture docs published · On-call rotation active' }
];

export const Timeline = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-pink-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[10%] right-[30%] w-[35vw] h-[35vw] bg-purple-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '2s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Timeline</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Calendar className="text-primary w-10 h-10" />
             Timeline & Milestones
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Not a Gantt chart. Enough structure that everyone knows what "done" looks like and by when.
          </p>
        </div>

        <div className="glass-panel p-10 shadow-sm border border-white rounded-[2rem]">
           <div className="flex flex-col gap-8 relative">
              {/* Vertical line */}
              <div className="absolute left-[39px] md:left-[119px] top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-400 via-primary to-slate-200 rounded-full z-0"></div>

              {MILESTONES.map((ms, idx) => (
                <div key={idx} className="relative z-10 flex flex-col md:flex-row md:items-start gap-4 md:gap-8 group">
                   
                   <div className="flex items-center gap-4 w-[180px] shrink-0">
                      <div className={`w-20 font-mono text-sm font-bold text-right pt-2 ${
                         ms.status === 'done' ? 'text-slate-400' :
                         ms.status === 'current' ? 'text-primary drop-shadow-sm' :
                         'text-slate-400'
                      }`}>
                         {ms.week}
                      </div>

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${
                         ms.status === 'done' ? 'bg-emerald-400 text-white' :
                         ms.status === 'current' ? 'bg-primary text-white animate-pulse' :
                         'bg-slate-200 text-slate-400'
                      }`}>
                         {ms.status === 'done' && <CheckCircle size={16} />}
                         {ms.status === 'current' && <Clock size={16} />}
                         {ms.status === 'pending' && <Flag size={14} className="opacity-50" />}
                      </div>
                   </div>

                   <div className={`flex-1 glass-panel p-6 rounded-2xl shadow-sm border border-white transition-all ${
                     ms.status === 'current' ? 'bg-white/80 border-primary shadow-md transform -translate-y-1' : 'bg-white/40 hover:bg-white/60'
                   }`}>
                      <div className="flex items-center gap-3 mb-2">
                         <h3 className={`font-display font-bold text-xl ${
                            ms.status === 'current' ? 'text-primary' : 'text-slate-800'
                         }`}>{ms.name}</h3>
                         {ms.status === 'done' && <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Completed</span>}
                         {ms.status === 'current' && <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 text-blue-700">In Progress</span>}
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                         {ms.items}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </main>
  );
};
