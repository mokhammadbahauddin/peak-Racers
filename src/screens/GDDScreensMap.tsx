import React from 'react';
import { ArrowLeft, MonitorPlay, BoxSelect, Settings, Trophy, Car, Map, Layout, Zap, Users, ShieldAlert, BarChart } from 'lucide-react';

const SCREENS = [
  { icon: <Zap size={24} />, name: 'Loading', desc: 'World streaming, tips, animated car, progress bar', tag: 'System', color: 'slate' },
  { icon: <Layout size={24} />, name: 'Main Menu', desc: 'Hero car, RACE NOW CTA, nav to all top-level destinations', tag: 'Core', color: 'pink' },
  { icon: <Map size={24} />, name: 'World Map', desc: 'Isometric world carousel, cup selection, world completion %', tag: 'Core', color: 'pink' },
  { icon: <BoxSelect size={24} />, name: 'Track Selection', desc: 'Interactive map nodes, lock states, star requirements', tag: 'Core', color: 'pink' },
  { icon: <Users size={24} />, name: 'Character Select', desc: '4 racers, stat comparison, selection persists', tag: 'Core', color: 'pink' },
  { icon: <Car size={24} />, name: 'Race HUD', desc: 'Speedometer, position, lap counter, minimap, power-up slot', tag: 'Core', color: 'pink' },
  { icon: <Trophy size={24} />, name: 'Victory / Results', desc: 'Podium, stars earned, coins, rank delta, confetti', tag: 'Core', color: 'pink' },
  { icon: <Settings size={24} />, name: 'Garage', desc: '3D car viewer, stat bars, upgrade panel, skin selector', tag: 'Meta', color: 'cyan' },
  { icon: <ShieldAlert size={24} />, name: 'Shop', desc: 'Car skins, boost trails, props. Rarity tiers, coin/gem prices', tag: 'Meta', color: 'cyan' },
  { icon: <BarChart size={24} />, name: 'Leaderboard', desc: 'Global / Friends rankings, player\'s rank ±10, season filter', tag: 'Meta', color: 'cyan' },
  { icon: <Trophy size={24} />, name: 'Grand Prix', desc: 'Cup selection grid, CC difficulty selector, world flyover', tag: 'Core', color: 'pink' },
  { icon: <Settings size={24} />, name: 'Settings', desc: 'Audio sliders, visual comfort toggles, account, controls', tag: 'System', color: 'slate' },
];

export const GDDScreensMap = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
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
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Section 02: Screen Map</span>
        <div className="w-[160px]"></div>
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <MonitorPlay className="text-primary w-10 h-10" />
             Screen Map & Navigation Flow
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            12 distinct screens. Each follows the "Immersive Canvas" rule — no persistent top navigation bar during active gameplay or selection flows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SCREENS.map((s, idx) => (
            <div key={idx} className={`glass-panel p-6 rounded-3xl shadow-sm border border-${s.color}-200 border-t-4 border-t-${s.color}-500 hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between`}>
              <div>
                 <div className={`text-${s.color}-600 mb-4 bg-${s.color}-50 w-12 h-12 flex items-center justify-center rounded-2xl`}>
                    {s.icon}
                 </div>
                 <h3 className="font-display text-lg font-bold text-slate-800 mb-2">{s.name}</h3>
                 <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    {s.desc}
                 </p>
              </div>
              <div className="mt-auto">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.tag === 'Core' ? 'bg-pink-100 text-pink-700' : s.tag === 'Meta' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-700'}`}>
                   {s.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 shadow-lg border-white rounded-[2rem] flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
                <Zap size={32} />
            </div>
            <div>
               <h3 className="font-display text-xl font-bold text-slate-800 mb-2">Immersive Canvas Rule ✓</h3>
               <p className="text-sm text-slate-600">
                  <strong>Design Rule:</strong> Race HUD, Track Selection, World Map, and Character Select screens suppress the global navigation shell entirely. The 3D world is the UI. Bottom nav is suppressed on these screens. All other screens show the standard navigation bar.
               </p>
            </div>
        </div>

      </div>
    </main>
  );
};
