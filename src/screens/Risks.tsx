import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldCheck, User } from 'lucide-react';

const RISKS = [
  { sev: 'HIGH', risk: 'Three.js performance on low-end hardware', desc: 'Target 60FPS may not be achievable on older Intel integrated graphics. Could break core experience for 30% of users.', mitigation: 'LOD system with 3 quality tiers (auto-detected). Manual quality selector in Settings. Tested on 2017 hardware in CI.', owner: 'Engine Lead' },
  { sev: 'HIGH', risk: 'Leaderboard race submission cheating', desc: 'Client-submitted race results could be manipulated. Compromises competitive integrity and ruins the game for The Completionist persona.', mitigation: 'Server-side physics replay validation for top-100 submissions. Statistical anomaly detection (lap times 3σ below track average). Soft-ban on anomalies, manual review queue.', owner: 'Backend Lead' },
  { sev: 'HIGH', risk: 'GDPR compliance at launch', desc: 'Missing data residency or erasure endpoint at launch creates legal liability in EU market. EU is 35% of addressable market.', mitigation: 'Legal review 4 weeks before launch. Erasure endpoint (FR-07) is a hard dependency for go-live. DPA signed with all sub-processors before any EU data flows.', owner: 'Product Lead' },
  { sev: 'MED', risk: 'Third-party payment processor downtime', desc: 'Shop purchases fail during payment processor outage. Revenue impact + user frustration.', mitigation: 'Graceful degradation: shop shows "Purchases temporarily unavailable" without error codes. Queue failed transactions for retry within 24h. No double-charge risk.', owner: 'Backend Lead' },
  { sev: 'MED', risk: 'Art style regression during dev', desc: 'Without a design token system, individual developers may deviate from the glassmorphism language, creating visual inconsistency.', mitigation: 'Tailwind config locked at design review. PR checklist includes screenshot comparison against Figma spec. Design token library treated as dependency, not a guideline.', owner: 'Design Lead' },
  { sev: 'LOW', risk: 'Scope creep from stakeholder requests', desc: 'New features requested post-PRD sign-off could delay launch. Common in games where "just one more track" is easy to rationalize.', mitigation: 'Formal scope change request process with Product Lead sign-off and explicit sprint impact statement. Out-of-scope list (Section 07) is contractual.', owner: 'Product Lead' },
  { sev: 'LOW', risk: 'Mobile performance on low-RAM devices', desc: 'Three.js on mobile browsers may run poorly on devices with <3GB RAM, affecting the commuter persona.', mitigation: 'Mobile-specific asset bundles (50% polygon reduction). Auto-detect mobile and apply low-quality preset. Explicit "Desktop recommended" notice for mobile users at first load.', owner: 'Engine Lead' }
];

export const Risks = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[20%] left-[20%] w-[35vw] h-[35vw] bg-rose-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute bottom-[20%] right-[15%] w-[45vw] h-[45vw] bg-amber-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Risks</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-8">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <AlertTriangle className="text-rose-500 w-10 h-10" />
             Risks & Mitigations
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Write the mitigation next to each risk. A PRD with no risks is a PRD where someone didn't ask hard enough questions.
          </p>
        </div>

        <div className="flex flex-col gap-6">
           {RISKS.map((risk, idx) => (
             <div key={idx} className="glass-panel p-6 rounded-3xl shadow-sm border border-white hover:-translate-y-1 transition-transform flex flex-col md:flex-row gap-6">
               
               <div className="flex flex-col gap-3 md:w-[140px] shrink-0 border-b border-white/50 pb-4 md:border-b-0 md:border-r md:pr-4 md:pb-0 justify-center">
                 <div className="flex flex-col items-start gap-2">
                    <span className={`text-xs uppercase font-black tracking-wider px-3 py-1 rounded shadow-sm ${
                      risk.sev === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                      risk.sev === 'MED' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {risk.sev} SEVERITY
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white/40 px-2 py-1 rounded">
                       <User size={14} />
                       {risk.owner}
                    </div>
                 </div>
               </div>

               <div className="flex-1 flex flex-col gap-3">
                  <h3 className="font-display font-bold text-xl text-slate-800">{risk.risk}</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white/40 p-3 rounded-xl border border-white/60">
                     {risk.desc}
                  </p>
               </div>

               <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold font-display uppercase tracking-wider text-sm mt-1 sm:mt-0">
                     <ShieldCheck size={18} />
                     Mitigation
                  </div>
                  <p className="text-sm text-emerald-900 font-medium leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 border-l-4 border-l-emerald-400">
                     {risk.mitigation}
                  </p>
               </div>

             </div>
           ))}
        </div>

      </div>
    </main>
  );
};
