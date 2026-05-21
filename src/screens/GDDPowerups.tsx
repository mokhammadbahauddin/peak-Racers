import React from "react";
import { ArrowLeft, Rocket, Shield, Star, Zap } from "lucide-react";

const POWERUPS = [
  {
    name: "Mushroom",
    icon: "🍄",
    color: "amber",
    rarity: "Common · 45% drop rate",
    desc: "Instant speed burst. Primary catch-up mechanic. Hits harder the further behind you are (position-weighted drop rate).",
    specs: [
      { label: "Speed bonus", val: "+40%" },
      { label: "Duration", val: "3.0 s" },
      { label: "Boost fill", val: "+30 units" },
      { label: "Drop rate (1st place)", val: "20%" },
      { label: "Drop rate (4th place)", val: "60%" },
      { label: "Visual cue", val: "Gold particle trail" },
    ],
  },
  {
    name: "Star",
    icon: "⭐",
    color: "yellow",
    rarity: "Rare · 20% drop rate",
    desc: "Temporary invincibility + speed. Knocks aside any opponent contacted. Pastel rainbow particle trail. The most visually spectacular item.",
    specs: [
      { label: "Speed bonus", val: "+25%" },
      { label: "Duration", val: "5.0 s" },
      { label: "Collision effect", val: "Knock (0.8s stun)" },
      { label: "Invincibility to", val: "Rockets, wall damage" },
      { label: "Drop rate (1st place)", val: "5%" },
      { label: "Visual cue", val: "Rainbow sparkle aura" },
    ],
  },
  {
    name: "Shield",
    icon: "🛡️",
    color: "blue",
    rarity: "Rare · 20% drop rate",
    desc: "Absorbs one incoming Rocket or collision. Passive — activates automatically. Visible as a soft blue bubble around the car. Provides psychological comfort to cozy players.",
    specs: [
      { label: "Charges", val: "1 (absorbs 1 hit)" },
      { label: "Duration", val: "Until hit or lap end" },
      { label: "Blocks", val: "Rocket · Collision stun" },
      { label: "Does NOT block", val: "Off-track slow" },
      { label: "Pop animation", val: "Bubble burst + sparkle" },
      { label: "Sound", val: "Soft chime on absorb" },
    ],
  },
  {
    name: "Rocket",
    icon: "🚀",
    color: "pink",
    rarity: "Epic · 15% drop rate",
    desc: "Fires forward at the nearest opponent. Homing with soft curve — not pixel-perfect. Miss chance increases with target's Handling stat. The most offensive item. Tone: pastel pinkish missile, not violent.",
    specs: [
      { label: "Speed (projectile)", val: "2× current car speed" },
      { label: "Homing range", val: "80 m" },
      { label: "Hit effect", val: "1.5s spin stun" },
      { label: "Miss condition", val: "Target handling >75" },
      { label: "Max travel distance", val: "120 m then dissolve" },
      { label: "Visual", val: "Pink pastel missile" },
    ],
  },
];

export const GDDPowerups = ({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div
          className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] bg-pink-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] bg-cyan-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse"
          style={{ animationDuration: "11s", animationDelay: "1s" }}
        ></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button
          onClick={() => onNavigate("landing")}
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">
          Section 04: Power-ups
        </span>
        <div className="w-[160px]"></div>
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
            <Zap className="text-primary w-10 h-10" />
            Power-up System
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            4 power-up types collectible via item boxes on track. Each box
            respawns after 8 seconds. One item held at a time. Items are
            non-pay-to-win — all players access the same pool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {POWERUPS.map((powerup, idx) => (
            <div
              key={idx}
              className={`glass-panel p-8 rounded-[2rem] shadow-sm border border-${powerup.color}-200 border-t-8 border-t-${powerup.color}-400 hover:-translate-y-2 transition-transform duration-300 flex flex-col gap-6`}
            >
              <div className="flex gap-4 items-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-${powerup.color}-100 flex items-center justify-center text-4xl shadow-inner`}
                >
                  {powerup.icon}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-black text-slate-800 tracking-tight">
                    {powerup.name}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 bg-${powerup.color}-50 text-${powerup.color}-700 border border-${powerup.color}-200`}
                  >
                    {powerup.rarity}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                {powerup.desc}
              </p>

              <div className="bg-white/50 rounded-2xl p-4 border border-white/60 mt-auto flex flex-col gap-2">
                {powerup.specs.map((spec, sidx) => (
                  <div
                    key={sidx}
                    className="flex justify-between items-center py-1.5 border-b border-slate-100/50 last:border-0"
                  >
                    <span className="text-slate-500 font-medium text-xs tracking-wide uppercase">
                      {spec.label}
                    </span>
                    <span className="text-slate-800 font-bold text-sm font-mono text-right max-w-[60%]">
                      {spec.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
