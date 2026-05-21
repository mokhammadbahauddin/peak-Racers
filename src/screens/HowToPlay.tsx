import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Keyboard, Gamepad2, Smartphone, Zap, Star, Shield, Rocket } from 'lucide-react';

const ControlRow = ({ keys, action }: { keys: string; action: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/30 last:border-0">
    <span className="text-sm font-bold text-slate-600">{action}</span>
    <div className="flex gap-1">
      {keys.split(' / ').map((key, i) => (
        <span key={i} className="px-2 py-1 bg-white/80 rounded-lg text-xs font-black text-slate-700 shadow-sm border border-white">
          {key}
        </span>
      ))}
    </div>
  </div>
);

const PowerUpCard = ({ emoji, name, description, effect }: { emoji: string; name: string; description: string; effect: string }) => (
  <div className="glass-panel p-4 rounded-xl flex gap-3">
    <span className="text-3xl">{emoji}</span>
    <div>
      <h4 className="font-display font-black text-sm text-slate-800">{name}</h4>
      <p className="text-xs text-slate-500 font-bold">{description}</p>
      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">{effect}</span>
    </div>
  </div>
);

export const HowToPlay = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col relative z-10 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button
          onClick={() => onNavigate('landing')}
          className="glass-button h-14 px-6 rounded-full font-display uppercase font-black tracking-widest text-sm shadow-xl border-white/80 flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <h1 className="font-display text-3xl font-black text-primary italic">HOW TO PLAY</h1>
        <div className="w-24" />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-12 space-y-8">
        {/* Racing Basics */}
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h2 className="font-display text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
            🏁 Racing Basics
          </h2>
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              Race against 3 AI opponents across beautiful pastel worlds. Complete 3 laps to finish. 
              Your position determines coin rewards and star ratings.
            </p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center bg-white/50 p-3 rounded-xl">
                <span className="text-2xl">🥇</span>
                <p className="text-xs font-black text-slate-700 mt-1">500 coins</p>
                <p className="text-[10px] font-bold text-amber-600">⭐⭐⭐</p>
              </div>
              <div className="text-center bg-white/50 p-3 rounded-xl">
                <span className="text-2xl">🥈</span>
                <p className="text-xs font-black text-slate-700 mt-1">300 coins</p>
                <p className="text-[10px] font-bold text-amber-600">⭐⭐</p>
              </div>
              <div className="text-center bg-white/50 p-3 rounded-xl">
                <span className="text-2xl">🥉</span>
                <p className="text-xs font-black text-slate-700 mt-1">150 coins</p>
                <p className="text-[10px] font-bold text-amber-600">⭐</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Keyboard Controls */}
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="font-display text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
            <Keyboard size={24} className="text-slate-500" /> Keyboard Controls
          </h2>
          <div className="glass-panel p-5 rounded-2xl">
            <ControlRow keys="↑ / W" action="Accelerate" />
            <ControlRow keys="↓ / S" action="Brake / Reverse" />
            <ControlRow keys="← → / A D" action="Steer" />
            <ControlRow keys="Space" action="Drift (hold while turning)" />
            <ControlRow keys="Shift" action="Use Boost" />
            <ControlRow keys="E" action="Use Power-Up" />
            <ControlRow keys="X / Z" action="Gear Up / Down" />
            <ControlRow keys="Esc" action="Pause Menu" />
          </div>
        </motion.section>

        {/* Drifting & Boost */}
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
            <Zap size={24} className="text-amber-500" /> Drifting & Boost
          </h2>
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              Hold <span className="px-1.5 py-0.5 bg-white rounded text-xs font-black">Space</span> while turning to initiate a drift. 
              Drifting charges your boost bar (+3% per second). After drifting for 1.5 seconds, you earn a mini-turbo bonus!
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-cyan-50 p-3 rounded-xl">
                <h4 className="text-xs font-black text-cyan-700">Boost Bar</h4>
                <p className="text-[10px] text-cyan-600 font-bold">100 unit capacity. +40% speed for 2 seconds. Press Shift to activate.</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl">
                <h4 className="text-xs font-black text-amber-700">Mini-Turbo</h4>
                <p className="text-[10px] text-amber-600 font-bold">Drift 1.5s+ for a +20 km/h speed burst lasting 0.8 seconds.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Power-Ups */}
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="font-display text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
            🎁 Power-Ups
          </h2>
          <div className="space-y-3">
            <PowerUpCard emoji="🍄" name="Mushroom" description="Instant speed burst. Most common power-up." effect="+40% speed for 3s" />
            <PowerUpCard emoji="⭐" name="Star" description="Temporary invincibility + speed boost." effect="+25% speed for 5s + invincible" />
            <PowerUpCard emoji="🛡️" name="Shield" description="Absorbs one incoming hit or collision." effect="Blocks 1 attack" />
            <PowerUpCard emoji="🚀" name="Rocket" description="Fires a homing projectile at the racer ahead." effect="1.5s spin stun on hit" />
          </div>
        </motion.section>

        {/* Grand Prix */}
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
            🏆 Grand Prix Mode
          </h2>
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              Race through 4 tracks in sequence. Points accumulate across all races.
              Choose between 50cc (Gentle), 100cc (Balanced), or 150cc (Expert) difficulty.
              Higher difficulty = tougher AI but bigger coin rewards!
            </p>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center bg-white/50 p-2 rounded-xl">
                <p className="text-xs font-black text-slate-700">🥇 = 15pts</p>
              </div>
              <div className="text-center bg-white/50 p-2 rounded-xl">
                <p className="text-xs font-black text-slate-700">🥈 = 12pts</p>
              </div>
              <div className="text-center bg-white/50 p-2 rounded-xl">
                <p className="text-xs font-black text-slate-700">🥉 = 10pts</p>
              </div>
              <div className="text-center bg-white/50 p-2 rounded-xl">
                <p className="text-xs font-black text-slate-700">4th = 8pts</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};
