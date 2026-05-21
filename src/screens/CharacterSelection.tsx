import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Shield, Gauge, Weight } from 'lucide-react';
import { GameDataManager } from '../game/GameData';
import { CHARACTERS, Character } from '../game/CharacterData';

const StatBar = ({ label, value, max = 100, icon, color }: { label: string; value: number; max?: number; icon: React.ReactNode; color: string }) => (
  <div className="flex items-center gap-3 w-full">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{label}</span>
        <span className="text-xs font-black text-slate-800">{value}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
          className={`h-full rounded-full ${color.replace('bg-', 'bg-').replace('/20', '')}`}
          style={{ background: `linear-gradient(90deg, ${color.includes('pink') ? '#ec4899' : color.includes('blue') ? '#3b82f6' : color.includes('green') ? '#10b981' : '#8b5cf6'} 0%, ${color.includes('pink') ? '#f9a8d4' : color.includes('blue') ? '#93c5fd' : color.includes('green') ? '#6ee7b7' : '#c4b5fd'} 100%)` }}
        />
      </div>
    </div>
  </div>
);

export const CharacterSelection = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const gd = GameDataManager.getInstance();
  const data = gd.getData();
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const idx = CHARACTERS.findIndex(c => c.id === data.activeCharacter);
    return idx >= 0 ? idx : 1;
  });

  const character = CHARACTERS[selectedIndex];

  const handleConfirm = () => {
    gd.setCharacter(character.id);
    onNavigate('worlds');
  };

  const prev = () => setSelectedIndex((selectedIndex - 1 + CHARACTERS.length) % CHARACTERS.length);
  const next = () => setSelectedIndex((selectedIndex + 1) % CHARACTERS.length);

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center relative z-10 overflow-hidden p-6">
      {/* Back Button */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 left-6 z-20"
      >
        <button
          onClick={() => onNavigate('landing')}
          className="glass-button h-14 px-6 min-h-[48px] min-w-[48px] rounded-full font-display uppercase font-black tracking-widest text-sm shadow-xl border-white/80 flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-display text-4xl md:text-5xl font-black text-primary italic tracking-tight mb-2"
      >
        CHOOSE YOUR RACER
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-slate-500 font-bold mb-8"
      >
        Each racer has a unique ability
      </motion.p>

      {/* Character Carousel */}
      <div className="flex items-center gap-6 md:gap-12 max-w-4xl w-full">
        {/* Left Arrow */}
        <button onClick={prev} className="glass-button w-14 h-14 min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center group">
          <ChevronLeft size={24} className="text-slate-600 group-hover:text-primary transition-colors" />
        </button>

        {/* Character Card */}
        <motion.div
          key={character.id}
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="flex-1 glass-panel p-8 rounded-3xl shadow-2xl border-white/80 relative overflow-hidden"
        >
          {/* Background gradient based on character color */}
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `radial-gradient(circle at 30% 30%, #${character.color.toString(16).padStart(6, '0')}, transparent 70%)` }}
          />

          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            {/* Character Avatar & Info */}
            <div className="flex flex-col items-center md:w-2/5">
              <motion.div
                key={character.id + '-emoji'}
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="text-[120px] md:text-[140px] leading-none mb-4 drop-shadow-lg"
              >
                {character.emoji}
              </motion.div>

              <h2 className="font-display text-4xl font-black text-slate-800 mb-1">{character.name}</h2>

              {/* Special Trait */}
              <div className="mt-2 mb-3 glass-panel p-3 rounded-xl w-full border-amber-200 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-amber-500" />
                  <span className="text-sm font-black text-amber-700 uppercase tracking-wider">{character.specialTrait.name}</span>
                </div>
                <p className="text-sm text-slate-700 font-bold">{character.specialTrait.description}</p>
              </div>

              <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                <Sparkles size={12} />
                {character.archetype}
              </span>
              <p className="text-center text-slate-600 italic font-bold text-sm leading-relaxed">
                "{character.tagline}"
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-4 md:w-3/5 justify-center">
              <StatBar
                label="Speed"
                value={character.stats.speed}
                icon={<Gauge size={16} className="text-pink-500" />}
                color="bg-pink-500/20"
              />
              <StatBar
                label="Acceleration"
                value={character.stats.acceleration}
                icon={<Zap size={16} className="text-blue-500" />}
                color="bg-blue-500/20"
              />
              <StatBar
                label="Handling"
                value={character.stats.handling}
                icon={<Shield size={16} className="text-green-500" />}
                color="bg-green-500/20"
              />
              <StatBar
                label="Weight"
                value={character.stats.weight}
                icon={<Weight size={16} className="text-purple-500" />}
                color="bg-purple-500/20"
              />

              <p className="text-xs text-slate-400 font-bold mt-2">{character.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Right Arrow */}
        <button onClick={next} className="glass-button w-14 h-14 min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center group">
          <ChevronRight size={24} className="text-slate-600 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Character Dots */}
      <div className="flex gap-3 mt-6 mb-6">
        {CHARACTERS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setSelectedIndex(i)}
            className={`w-12 h-12 min-h-[48px] min-w-[48px] rounded-full flex items-center justify-center text-2xl transition-all
              ${i === selectedIndex ? 'bg-white shadow-lg scale-110 ring-2 ring-pink-300' : 'bg-white/50 hover:bg-white/80'}
            `}
          >
            {c.emoji}
          </button>
        ))}
      </div>

      {/* Confirm Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleConfirm}
        className="glass-button-primary px-16 py-5 text-2xl font-black tracking-wider rounded-2xl shadow-[0_15px_40px_rgba(225,29,72,0.4)] hover:shadow-[0_20px_50px_rgba(225,29,72,0.5)] hover:scale-105 transition-all"
      >
        SELECT {character.name.toUpperCase()}
      </motion.button>
    </main>
  );
};
