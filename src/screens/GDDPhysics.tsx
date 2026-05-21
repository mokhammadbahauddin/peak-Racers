import React from 'react';
import { ArrowLeft, Beaker, Car, Gauge, Move, Settings, Zap, Compass, RotateCcw } from 'lucide-react';

const PHYSICS_CONFIG = [
  {
    title: '🚗 Movement',
    color: 'pink',
    params: [
      { name: 'Top speed (Class A)', val: '160 km/h' },
      { name: 'Top speed (Class B)', val: '140 km/h' },
      { name: 'Top speed (Class C)', val: '120 km/h' },
      { name: 'Acceleration time 0→100', val: '1.8–3.2s' },
      { name: 'Braking deceleration', val: '−2.8 m/s²' },
      { name: 'Off-track speed penalty', val: '−40%' },
    ]
  },
  {
    title: '🌀 Drifting',
    color: 'cyan',
    params: [
      { name: 'Drift activation', val: 'Hold brake + steer' },
      { name: 'Drift speed multiplier', val: '×0.85' },
      { name: 'Boost charge rate', val: '+3% boost/s' },
      { name: 'Mini-turbo threshold', val: '1.5s drift' },
      { name: 'Mini-turbo speed bonus', val: '+20 km/h × 0.8s' },
      { name: 'Drift trail color', val: 'Player skin hue' },
    ]
  },
  {
    title: '💨 Boost System',
    color: 'amber',
    params: [
      { name: 'Boost bar capacity', val: '100 units' },
      { name: 'Boost speed multiplier', val: '×1.4 (+40%)' },
      { name: 'Boost duration', val: '2.0 s' },
      { name: 'Boost from drift', val: '+3/s while drifting' },
      { name: 'Boost from star pickup', val: '+30 units' },
      { name: 'Boost bar decay at rest', val: '−1/s (idle)' },
    ]
  },
  {
    title: '🎮 Handling',
    color: 'indigo',
    params: [
      { name: 'Steering sensitivity', val: 'Speed-dependent' },
      { name: 'Turn radius (low speed)', val: '6 m' },
      { name: 'Turn radius (top speed)', val: '18 m' },
      { name: 'Traction recovery time', val: '0.3 s after slip' },
      { name: 'Wall collision bounce', val: '−30% speed, 0.4s stun' },
      { name: 'Collision with opponent', val: 'Weight-based push' },
    ]
  }
];

export const GDDPhysics = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
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
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Section 03: Physics</span>
        <div className="w-[160px]"></div>
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Beaker className="text-primary w-10 h-10" />
             Physics & Controls
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Arcade physics — not simulation. Every parameter below is tunable via a game config object. No hardcoded physics values in game logic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PHYSICS_CONFIG.map((group, idx) => (
            <div key={idx} className={`glass-panel p-6 rounded-3xl shadow-sm border border-${group.color}-200 border-t-4 border-t-${group.color}-500 hover:-translate-y-1 transition-transform duration-300`}>
                <h3 className={`font-display text-xl font-bold text-${group.color}-600 mb-6 border-b border-${group.color}-100 pb-3`}>{group.title}</h3>
                <div className="flex flex-col gap-3">
                    {group.params.map((p, pidx) => (
                        <div key={pidx} className="flex justify-between items-center bg-white/40 px-4 py-2 rounded-xl">
                            <span className="text-slate-600 font-medium text-sm">{p.name}</span>
                            <span className="text-slate-800 font-bold font-mono text-sm">{p.val}</span>
                        </div>
                    ))}
                </div>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 shadow-lg border-white rounded-[2rem] flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white/40 rounded-2xl p-6 border border-white">
               <h3 className="font-display text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">⌨️ Keyboard</h3>
               <ul className="text-sm text-slate-600 font-medium space-y-3">
                   <li className="flex justify-between"><span>Steer + Accelerate/Brake</span> <strong className="text-slate-800">Arrow Keys / WASD</strong></li>
                   <li className="flex justify-between"><span>Use power-up</span> <strong className="text-slate-800">Space</strong></li>
                   <li className="flex justify-between"><span>Manual drift</span> <strong className="text-slate-800">Shift</strong></li>
                   <li className="flex justify-between"><span>Pause menu</span> <strong className="text-slate-800">Esc</strong></li>
                   <li className="flex justify-between"><span>Restart race</span> <strong className="text-slate-800">Ctrl+R</strong></li>
               </ul>
            </div>
            
             <div className="flex-1 bg-white/40 rounded-2xl p-6 border border-white">
               <h3 className="font-display text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">📱 Touch (Mobile)</h3>
               <ul className="text-sm text-slate-600 font-medium space-y-3">
                   <li className="flex justify-between"><span>Brake / Power-up</span> <strong className="text-slate-800">Left side tap/hold</strong></li>
                   <li className="flex justify-between"><span>Accelerate</span> <strong className="text-slate-800">Right side tap/hold</strong></li>
               </ul>
            </div>
        </div>

      </div>
    </main>
  );
};
