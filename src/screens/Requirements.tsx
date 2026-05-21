import React from 'react';
import { ArrowLeft, CheckCircle2, ListChecks, CheckSquare } from 'lucide-react';

const REQUIREMENTS = [
  { id: 'FR-01', priority: 'MUST', name: 'Race Loop', desc: 'Player can start, complete, or abandon a race on any unlocked track with their active vehicle.', criteria: 'Race completes in under 3 minutes on Soft Sands. Lap times recorded to ms precision.' },
  { id: 'FR-02', priority: 'MUST', name: 'Vehicle Stats', desc: 'Each vehicle has Speed, Handling, Acceleration, Weight stats that deterministically affect physics.', criteria: 'Speed Demon vehicle (Speed 85) laps faster than Bubblegum Cruiser (Speed 75) on straight tracks.' },
  { id: 'FR-03', priority: 'MUST', name: 'Leaderboard', desc: 'Global per-track best-lap leaderboard updates within 60s of race completion. Player rank visible with ±10 context rows.', criteria: 'New personal best propagates to leaderboard rank within 60 seconds in load testing.' },
  { id: 'FR-04', priority: 'MUST', name: 'Garage Upgrades', desc: 'Player can upgrade Turbo, Tires, and Aero Kit using earned coins. Each upgrade level increases relevant stat by defined increment.', criteria: 'Turbo Level 4 increases Speed stat by exactly 5 points. Displayed stat matches physics.' },
  { id: 'FR-05', priority: 'MUST', name: 'Track Unlock', desc: 'Tracks unlock progressively by star count. Peach Peaks requires 5 stars. Locked tracks display requirement clearly.', criteria: 'Player with 4 stars sees Peach Peaks as locked with "Requires 5 Stars" tooltip.' },
  { id: 'FR-06', priority: 'MUST', name: 'Power-Ups', desc: '4 power-up types (Mushroom, Star, Shield, Rocket) collectible during race. Item slot shows current item.', criteria: 'Mushroom boost increases speed by 40% for 3s. Shield absorbs 1 projectile.' },
  { id: 'FR-07', priority: 'MUST', name: 'Auth & Profile', desc: 'Player registers with email/password. JWT session persists 30 days. GDPR erasure request processed within 72h.', criteria: 'Player data erasure API returns 202 Accepted and data is purged within 72h.' },
  { id: 'FR-08', priority: 'SHOULD', name: 'Shop / IAP', desc: 'Player can purchase skins using coins (earned) or gems (purchased). No stat advantage from purchases.', criteria: 'All purchasable items are cosmetic only. No pay-to-win mechanics.' },
  { id: 'FR-09', priority: 'SHOULD', name: 'Visual Settings', desc: 'Motion Blur and Isometric Shadows toggleable in Settings. Preference persists across sessions.', criteria: 'Motion Blur OFF reduces GPU draw calls by ≥15%. Preference survives browser refresh.' },
  { id: 'FR-10', priority: 'NICE', name: 'Victory Screen', desc: 'Post-race results show position, lap time, stars earned, coins rewarded, and rank delta with confetti.', criteria: 'All 5 result elements visible within 500ms of race end.' },
  { id: 'FR-11', priority: 'NICE', name: 'Character Selection', desc: 'Player selects from 4 character/vehicle pairings before Grand Prix. Selection persists until changed.', criteria: 'Character selection saves to player profile. Stat bars animate correctly.' }
];

export const Requirements = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[20%] left-[15%] w-[40vw] h-[40vw] bg-indigo-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] bg-fuchsia-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Requirements</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-8">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <ListChecks className="text-primary w-10 h-10" />
             Functional Requirements
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Each requirement is tagged by priority and includes a testable acceptance criterion. 
            The Out of Scope list acts as the explicit scope fence.
          </p>
        </div>

        <div className="flex flex-col gap-4">
           {REQUIREMENTS.map((req) => (
              <div key={req.id} className="glass-panel p-6 rounded-2xl shadow-sm border border-white hover:-translate-y-1 transition-transform group flex flex-col md:flex-row gap-6 md:items-center">
                 
                 <div className="flex flex-col md:w-[150px] shrink-0">
                    <span className="font-mono text-sm text-slate-400 font-bold mb-1">{req.id}</span>
                    <div>
                       <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-1 rounded shadow-sm ${
                          req.priority === 'MUST' ? 'bg-rose-100 text-rose-700' :
                          req.priority === 'SHOULD' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                       }`}>
                          {req.priority}
                       </span>
                    </div>
                 </div>

                 <div className="flex flex-col md:w-[200px] shrink-0 border-l-2 border-slate-100 pl-4 md:border-l-0 md:pl-0">
                    <h3 className="font-display font-bold text-lg text-slate-800 group-hover:text-primary transition-colors">{req.name}</h3>
                 </div>

                 <div className="flex-1 flex flex-col gap-2">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                       <strong className="text-slate-800">Requirement:</strong> {req.desc}
                    </p>
                    <div className="flex items-start gap-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-sm text-slate-600 mt-2">
                       <CheckSquare size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                       <span className="leading-relaxed"><strong className="text-slate-800">Criteria:</strong> {req.criteria}</span>
                    </div>
                 </div>

              </div>
           ))}
        </div>

      </div>
    </main>
  );
};
