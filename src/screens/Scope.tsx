import React from 'react';
import { ArrowLeft, CheckCircle, XCircle, Target } from 'lucide-react';

export const Scope = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[15%] right-[10%] w-[35vw] h-[35vw] bg-emerald-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[15%] left-[10%] w-[45vw] h-[45vw] bg-rose-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Scope</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Target className="text-primary w-10 h-10" />
             Scope: In & Out
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            The "Out of Scope" list prevents scope creep. Any feature not on the "In" list requires a formal scope change request.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
           
           {/* In Scope */}
           <div className="flex-1 flex flex-col gap-4">
              <div className="glass-panel p-6 rounded-3xl shadow-sm border-white bg-emerald-50/50 flex items-center gap-4 border-b-4 border-b-emerald-400">
                 <CheckCircle className="text-emerald-500 w-8 h-8" />
                 <h2 className="font-display text-2xl font-bold text-emerald-900 uppercase">In Scope — v2.0</h2>
              </div>

              <div className="flex flex-col gap-3">
                 <ScopeItem title="Grand Prix Mode" desc="4 cups (Mushroom, Star, Cloud, Peak) × 4 tracks each = 16 total tracks" />
                 <ScopeItem title="Character System" desc="4 racers (Bunny, Cat, Frog, Bear) with distinct stat profiles" />
                 <ScopeItem title="Vehicle Garage" desc="Skin selection, stat upgrades, part-specific leveling (Turbo, Tires, Aero)" />
                 <ScopeItem title="Battle HUD" desc="Power-up system: Mushroom, Star, Shield, Rocket. Item slots and activation" />
                 <ScopeItem title="Global Leaderboard" desc="Per-track best lap times, season rankings, Friends filter" />
                 <ScopeItem title="Shop" desc="Cosmetic skins (Rare/Epic/Legendary), boost trails, track props" />
                 <ScopeItem title="Immersive UI System" desc="No-Top-Bar canvas logic, glassmorphism design language, all 12 screens" />
                 <ScopeItem title="Settings" desc="Audio mixing, motion blur toggle, isometric shadows, control remapping" />
                 <ScopeItem title="Player Auth" desc="JWT-based login, profile, GDPR right-to-erasure" />
                 <ScopeItem title="Loading Screen" desc="World-streaming experience with tips, animated car, progress bar" />
              </div>
           </div>

           {/* Out of Scope */}
           <div className="flex-1 flex flex-col gap-4">
              <div className="glass-panel p-6 rounded-3xl shadow-sm border-white bg-rose-50/50 flex items-center gap-4 border-b-4 border-b-rose-400">
                 <XCircle className="text-rose-500 w-8 h-8" />
                 <h2 className="font-display text-2xl font-bold text-rose-900 uppercase">Out of Scope — v2.0</h2>
              </div>

              <div className="flex flex-col gap-3">
                 <ScopeItem title="Real-Time Multiplayer" desc="Synchronous P2P racing. WebSocket infra not sized for v2. V3 candidate." />
                 <ScopeItem title="Track Editor" desc="Community level creation and sharing. UGC pipeline requires separate moderation system." />
                 <ScopeItem title="Console Porting" desc="Nintendo Switch, Xbox, PlayStation. Not browser-native. Separate project scope." />
                 <ScopeItem title="Native Mobile App" desc="iOS/Android apps via React Native or Unity. Web-responsive is sufficient for v2." />
                 <ScopeItem title="Voice Chat" desc="In-race voice communication. Requires WebRTC + content moderation. V4." />
                 <ScopeItem title="Clan / Team System" desc="Persistent team rankings, clan wars. Social graph complexity not justified v2." />
                 <ScopeItem title="Battle Pass" desc="Seasonal pass with premium reward track. Economy design not complete." />
                 <ScopeItem title="AI/ML Opponents" desc="Adaptive difficulty AI. Rule-based bots with difficulty presets are sufficient for v2." />
                 <ScopeItem title="Replay System" desc="Race recording and playback. Storage costs prohibitive at launch scale." />
              </div>
           </div>

        </div>

      </div>
    </main>
  );
};

const ScopeItem = ({ title, desc }: { title: string, desc: string }) => (
   <div className="glass-panel bg-white/60 p-4 rounded-xl border border-white hover:-translate-y-1 transition-transform group">
      <div className="flex flex-col">
         <span className="font-display font-bold text-slate-800 text-lg mb-1 group-hover:text-primary transition-colors">{title}</span>
         <span className="text-sm text-slate-600 leading-relaxed font-medium">{desc}</span>
      </div>
   </div>
);
