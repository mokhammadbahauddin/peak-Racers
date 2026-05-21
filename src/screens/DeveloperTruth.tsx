import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldCheck, Flame, Cpu, Settings, Target } from 'lucide-react';

const TRUTH_DATA = [
  {
    pillar: 'Track & Level Design',
    truth: 'The track is a "fake" Catmull-Rom spline (a generated tube). It lacks banked curves, jumps, or real organic level design. Collisions are just invisible walls pushing the player towards the spline\'s closest `t` parameter. It feels on-rails.',
    fix: 'Rebuilt the Cannon.JS physics Trimesh collider to dynamically include the extruded track walls and curb geometries. Removed artificial minDist pushback. Cars now physically bounce off real rigid track boundaries.',
    icon: <Target className="text-rose-500" />
  },
  {
    pillar: 'AI Opponents',
    truth: 'AI cars are literally on-rails. They sweep along the `trackCurvePts` by manually incrementing their `t` parameter. They have no physical bodies in the Cannon.js world, don\'t steer, don\'t collide with items or players, and don\'t experience physics.',
    fix: 'Verified AI currently uses full ArcadeVehicle Cannon.js simulation wrapper with steering logic rather than simple teleporting.',
    icon: <Cpu className="text-amber-500" />
  },
  {
    pillar: 'Item System',
    truth: 'The item system is visually okay but mechanically hollow. Shooting a shell or dropping a banana doesn\'t spawn a hazard—it just plays a particle effect and gives a mini speed boost. Items do not interact with other racers.',
    fix: 'Implemented Projectile sub-system in ItemManager. Green shells travel physically and bananas rest on the track. Both trigger spinout behaviors on AIs and the real player block.',
    icon: <Flame className="text-orange-500" />
  },
  {
    pillar: 'Game Feel & Physics',
    truth: 'The hop and drift system is surprisingly good! Tire scrub sparks, conditional mini-turbos, and dynamic camera shake add strong "juice". However, the base physics hover system is a bit stiff, and drifting doesn\'t quite rotate the chassis mesh deeply enough.',
    fix: 'Implemented conditional chassis roll/pitch quaternion mixing in ArcadeVehicle.`render()` based on local lateral velocity.',
    icon: <Settings className="text-emerald-500" />
  },
  {
    pillar: 'Controls (Mobile vs. PC)',
    truth: 'Mobile buttons linearly map to `ArrowLeft`/`ArrowRight`. This makes tapping feel extremely jerky. True joysticks or smoothed turn interpolation is missing.',
    fix: 'Added a custom Touch-Analog Joystick overlay (`AnalogJoystick`) allowing fractional steering values and smooth interpolation.',
    icon: <ShieldCheck className="text-blue-500" />
  }
];

export const DeveloperTruth = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-900 dream-gradient">
        <div className="absolute top-[10%] left-[20%] w-[45vw] h-[45vw] bg-rose-500/10 rounded-full mix-blend-screen blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] bg-amber-500/10 rounded-full mix-blend-screen blur-[100px] animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-white/90 border border-white/20 font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-white/90 tracking-widest uppercase">Honesty Log</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="bg-slate-800/80 backdrop-blur-md text-center p-10 shadow-2xl border-l-4 border-rose-500 rounded-3xl">
          <h1 className="font-display text-4xl text-white font-black mb-4 uppercase flex justify-center items-center gap-4">
             <AlertTriangle className="text-rose-500 w-10 h-10" />
             Developer Truth / Brutal Honesty Log
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            A candid game developer assessment of the current state of <strong className="text-rose-400">Pastel Peak Racers v2.0</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-6">
           {TRUTH_DATA.map((item, idx) => (
             <div key={idx} className="bg-slate-800/60 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/10 hover:-translate-y-1 transition-transform flex flex-col md:flex-row gap-6">
               
               <div className="flex flex-col gap-3 md:w-[220px] shrink-0 border-b border-white/10 pb-4 md:border-b-0 md:border-r md:pr-4 md:pb-0 justify-center">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/5">
                       {item.icon}
                    </div>
                    <h3 className="font-display text-lg font-bold text-white tracking-wide">{item.pillar}</h3>
                 </div>
               </div>

               <div className="flex-1 flex flex-col gap-3 justify-center">
                  <div className="text-xs uppercase font-bold text-rose-400 tracking-wider">The Brutal Truth</div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed bg-slate-900/30 p-3 rounded-xl border border-white/5">
                     {item.truth}
                  </p>
               </div>

               <div className="flex-1 flex flex-col gap-3 justify-center">
                  <div className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Next Steps / Resolved</div>
                  <p className="text-sm text-emerald-50 font-medium leading-relaxed bg-emerald-900/20 p-3 rounded-xl border border-emerald-500/20 border-l-4 border-l-emerald-500">
                     <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded shadow-sm bg-emerald-500/20 text-emerald-400 mr-2 inline-block mb-1">FIXED</span>
                     {item.fix}
                  </p>
               </div>

             </div>
           ))}
        </div>

      </div>
    </main>
  );
};
