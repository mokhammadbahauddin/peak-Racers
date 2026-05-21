import React from 'react';
import { ArrowLeft, Target, Activity, Users, Zap, TrendingUp } from 'lucide-react';

const METRICS = [
  { value: '40%', label: 'Day-7 Retention', desc: 'Industry average for casual games is 15–20%. We target 40% as a signal the core loop works.', method: 'PostHog cohort analysis on player_id. Day-1, Day-7, Day-30 checkpoints.', color: 'text-indigo-600' },
  { value: '5%', label: 'IAP Conversion', desc: '5% of MAU purchasing at least one skin pack (Rare, Epic, or Legendary) in first 30 days.', method: 'Stripe webhook -> backend -> Data Warehouse.', color: 'text-emerald-600' },
  { value: '4.5/5', label: 'Game Feel Score', desc: 'Qualitative "Juice Rating" from 100-player UAT survey. Primary signal for tactile satisfaction.', method: 'In-app Typeform survey trigger after 5th race completion.', color: 'text-amber-600' },
  { value: '< 45s', label: 'Time to First Race', desc: 'From account creation to race start. Measures onboarding friction. The Casual Dripper persona demands this.', method: 'Datadog RUM from startAuth to initialRaceLoad.', color: 'text-rose-600' },
  { value: '3.2', label: 'Sessions / Week', desc: 'Average sessions per weekly active user. Below 2.0 indicates core loop is not creating habit.', method: 'PostHog session duration tracking aggregated weekly.', color: 'text-blue-600' },
  { value: '< 2%', label: 'Rage-Quit Rate', desc: '% of races abandoned mid-race (excluding restarts). High rate signals frustration.', method: 'Custom event trigger when player closes tab mid-race.', color: 'text-purple-600' },
];

export const SuccessMetrics = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[15%] right-[10%] w-[35vw] h-[35vw] bg-teal-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-[45vw] h-[45vw] bg-sky-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Metrics</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Target className="text-primary w-10 h-10" />
             Success Metrics
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Specific, measurable outcomes. These become the definition of done for the product. Each has a measurement method.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {METRICS.map((metric, idx) => (
             <div key={idx} className="glass-panel p-8 rounded-3xl shadow-sm border border-white hover:-translate-y-2 transition-transform duration-300 group flex flex-col">
               <div className={`font-display font-black text-5xl mb-2 ${metric.color}`}>
                 {metric.value}
               </div>
               <h3 className="font-display font-bold text-xl text-slate-800 mb-4">{metric.label}</h3>
               
               <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 flex-1">
                 {metric.desc}
               </p>

               <div className="pt-4 border-t border-slate-200">
                  <div className="text-xs uppercase font-bold text-slate-400 mb-2 tracking-wider flex items-center gap-1.5">
                     <Activity size={12} />
                     Measurement Method
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed bg-white/50 p-2.5 rounded-lg border border-white">
                     {metric.method}
                  </p>
               </div>
             </div>
           ))}
        </div>

      </div>
    </main>
  );
};
