import React from 'react';
import { ArrowLeft, Clock, CheckCircle2, CircleDashed, Rocket } from 'lucide-react';

export const Lifecycle = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-yellow-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-purple-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Development Lifecycle</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-5xl px-6 pb-24 z-20 flex flex-col gap-10">
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-primary font-black mb-4 uppercase">7-Phase Execution Plan</h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Every phase has a gate. Skipping a gate has a cost. Discovery is the cheapest time to kill a bad idea; production is the most expensive.
          </p>
        </div>

        <div className="glass-panel p-8 shadow-xl rounded-[2rem] border-white backdrop-blur-md">
          <div className="flex flex-col gap-8">
            {/* Phase 1 */}
            <div className="flex gap-6 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                  <CheckCircle2 size={24} className="opacity-100" />
                </div>
                <div className="w-1 h-full min-h-[4rem] bg-emerald-200 rounded-full mt-4"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-bold text-slate-800">01. Discovery</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full">Completed</span>
                </div>
                <p className="text-slate-600">Validated "Cozy-Arcade" niche via 40+ user interviews, competitor teardowns, and JTBD mapping. Produced all 6 discovery artifacts. Go/No-Go gate passed.</p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="flex gap-6 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                  <CheckCircle2 size={24} className="opacity-100" />
                </div>
                <div className="w-1 h-full min-h-[4rem] bg-emerald-200 rounded-full mt-4"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-bold text-slate-800">02. PRD & Planning</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full">Completed</span>
                </div>
                <p className="text-slate-600">This document. Defined all functional/non-functional requirements, API contracts, data schema, scope, milestones, and risk register. Signed off by Product Lead.</p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="flex gap-6 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                  <CheckCircle2 size={24} className="opacity-100" />
                </div>
                <div className="w-1 h-full min-h-[4rem] bg-emerald-200 rounded-full mt-4"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-bold text-slate-800">03. Design</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full">Completed</span>
                </div>
                <p className="text-slate-600">Full UX/UI system designed: glassmorphism design language, "No Top-Bar" immersive canvas logic, all 12 screen states mocked. Data model finalized before UX to prevent redesign loops. ADRs written for all major decisions.</p>
              </div>
            </div>

            {/* Phase 4 */}
            <div className="flex gap-6 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-md">
                  <Clock size={24} className="opacity-100" />
                </div>
                <div className="w-1 h-full min-h-[4rem] bg-slate-200 rounded-full mt-4 relative">
                   <div className="absolute top-0 w-full h-1/2 bg-amber-200 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-bold text-slate-800">04. Development</h2>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase rounded-full animate-pulse">In Progress</span>
                </div>
                <p className="text-slate-600">Sprint-based execution (2-week sprints). Three.js for 3D rendering, Tailwind CSS for UI layer. CI/CD pipeline live from Sprint 1. Feature flags on all unreleased tracks. Code review required for all PRs touching game physics or leaderboard logic.</p>
              </div>
            </div>

            {/* Phase 5 */}
            <div className="flex gap-6 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shadow-md border border-slate-200">
                  <CircleDashed size={24} className="opacity-80" />
                </div>
                <div className="w-1 h-full min-h-[4rem] bg-slate-200 rounded-full mt-4"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-bold text-slate-500">05. QA & Staging</h2>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase rounded-full">Upcoming</span>
                </div>
                <p className="text-slate-500">Staging mirrors production exactly. Test suite: unit (game physics), integration (API + leaderboard), E2E (Playwright, all 12 screens), load (5,000 concurrent sessions), and UAT with 20 recruited players from target personas.</p>
              </div>
            </div>

            {/* Phase 6 */}
            <div className="flex gap-6 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shadow-md border border-slate-200">
                  <CircleDashed size={24} className="opacity-80" />
                </div>
                <div className="w-1 h-full min-h-[4rem] bg-slate-200 rounded-full mt-4"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-bold text-slate-500">06. Deployment</h2>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase rounded-full">Upcoming</span>
                </div>
                <p className="text-slate-500">Blue-green release for zero downtime. Canary rollout: 5% → 25% → 100% traffic over 48 hours. Alerting wired to PagerDuty before traffic goes live. Written rollback plan, not just a button. Global CDN for asset delivery.</p>
              </div>
            </div>

            {/* Phase 7 */}
            <div className="flex gap-6 items-start group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center shadow-md border border-indigo-100">
                  <Rocket size={24} className="opacity-80" />
                </div>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-bold text-slate-500">07. Maintenance</h2>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase rounded-full">Post-Launch</span>
                </div>
                <p className="text-slate-500">SLA: 99.5% uptime. On-call rotation (2 engineers). Blameless postmortems within 48h of P0 incidents. Dependency audit quarterly. Architecture docs written within 2 weeks of launch while context is fresh. Full plan in Section 15.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};
