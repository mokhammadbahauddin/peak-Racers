import React from 'react';
import { ArrowLeft, MessageCircleQuestion, CheckCircle2, AlertCircle } from 'lucide-react';

const QUESTIONS = [
  { id: 'Q1', status: 'resolved', text: 'Should we support keyboard-only control? Yes. WCAG 2.1 AA requires full keyboard navigation. Gamepad support is a v3 nice-to-have.' },
  { id: 'Q2', status: 'resolved', text: 'Monolith vs microservices? Monolith for v2 (see ADR-001). Revisit extraction of the leaderboard service at 1M MAU.' },
  { id: 'Q3', status: 'resolved', text: 'Which payment processor? Stripe. DPA signed. No alternative processor in v2. PayPal as V3 expansion market.' },
  { id: 'Q4', status: 'open', text: 'What is the exact coin reward formula per race finish position? Product Lead decision needed by Sprint 6. Placeholder: 1st=500, 2nd=300, 3rd=150, 4th=75 coins. Needs balance testing.' },
  { id: 'Q5', status: 'open', text: 'Do Legendary skins require gem currency (real money) or can they be earned via coins? Business model decision. If gems-only, need careful communication to avoid pay-to-impress perception. Needs Product Lead + legal sign-off.' },
  { id: 'Q6', status: 'open', text: 'Should the leaderboard be global-only or support regional filters? Regional adds DB complexity (country detection, multiple indexes) but is important for Asian markets. Defer to v2.1 unless market research justifies v2 investment.' },
  { id: 'Q7', status: 'open', text: 'What is the season cadence and reset policy? Season 1 = launch until end of Q4. After reset: historical best times preserved for player records but removed from active leaderboard. Needs community communication plan.' },
  { id: 'Q8', status: 'open', text: 'Bot difficulty in Grand Prix mode — how do AI opponents scale? Three difficulty presets (50cc / 100cc / 150cc) implemented with rubber-band AI. Exact rubber-band curve parameters need playtesting in Sprint 7.' }
];

export const OpenQuestions = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[20%] left-[30%] w-[35vw] h-[35vw] bg-yellow-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] right-[30%] w-[40vw] h-[40vw] bg-teal-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Open Questions</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <MessageCircleQuestion className="text-primary w-10 h-10" />
             Open Questions
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            A living list. A PRD with no open questions is a PRD where someone didn't ask hard enough. Green = resolved, amber = still open.
          </p>
        </div>

        <div className="flex flex-col gap-4">
           {QUESTIONS.map((q) => (
             <div key={q.id} className={`glass-panel p-6 rounded-2xl shadow-sm border border-white hover:-translate-y-1 transition-transform flex gap-4 md:gap-6 ${
               q.status === 'resolved' ? 'bg-emerald-50/20' : 'bg-amber-50/20'
             }`}>
                <div className="pt-1 shrink-0">
                   {q.status === 'resolved' ? (
                      <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                   ) : (
                      <AlertCircle className="text-amber-500 w-8 h-8" />
                   )}
                </div>
                
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-slate-800">{q.id}</span>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded shadow-sm ${
                         q.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                         {q.status}
                      </span>
                   </div>
                   <p className="text-sm text-slate-700 font-medium leading-relaxed max-w-4xl">
                      {q.text}
                   </p>
                </div>
             </div>
           ))}
        </div>

      </div>
    </main>
  );
};
