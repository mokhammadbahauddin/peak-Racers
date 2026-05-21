import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Lock, Star, ChevronLeft, Zap, Flag } from 'lucide-react';
import { GameDataManager } from '../game/GameData';
import { useGrandPrixStore } from '../game/stores/useGrandPrixStore';
import { TRACK_REGISTRY, CUP_DATA } from '../game/tracks/TrackRegistry';

const DIFFICULTY_OPTIONS = [
  { id: '50cc' as const, label: '50cc', subtitle: 'Gentle', multiplier: '×1.0', color: 'text-emerald-500' },
  { id: '100cc' as const, label: '100cc', subtitle: 'Balanced', multiplier: '×1.5', color: 'text-amber-500' },
  { id: '150cc' as const, label: '150cc', subtitle: 'Expert', multiplier: '×2.0', color: 'text-red-500' }
];

const CUP_ITEMS = [
  { id: 'mushroom', emoji: '🍄', name: 'Mushroom Cup', world: 'Dawn Archipelago', worldId: 'soft_sands', gradient: 'from-amber-100 to-orange-100', border: 'border-amber-300', starReq: 0 },
  { id: 'star', emoji: '⭐', name: 'Star Cup', world: 'Sugar Snow Summit', worldId: 'sugar_snow', gradient: 'from-blue-100 to-cyan-100', border: 'border-blue-300', starReq: 4 },
  { id: 'cloud', emoji: '☁️', name: 'Cloud Cup', world: 'Peach Peaks', worldId: 'peach_peaks', gradient: 'from-pink-100 to-rose-100', border: 'border-pink-300', starReq: 8 },
  { id: 'peak', emoji: '🏔️', name: 'Peak Cup', world: 'Pastel Peak', worldId: 'pastel_peak', gradient: 'from-purple-100 to-violet-100', border: 'border-purple-300', starReq: 14 }
];

export const GrandPrix = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const gd = GameDataManager.getInstance();
  const data = gd.getData();
  const playerStars = data.stars || 0;

  const [selectedCup, setSelectedCup] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'50cc' | '100cc' | '150cc'>(data.difficulty || '50cc');

  const startGP = useGrandPrixStore(s => s.startGrandPrix);

  const handleStart = () => {
    if (!selectedCup) return;
    const cup = CUP_ITEMS.find(c => c.id === selectedCup);
    if (!cup) return;

    const tracks = TRACK_REGISTRY[cup.worldId] || [];
    const trackIds = tracks.map(t => t.id);

    gd.setDifficulty(difficulty);
    startGP(selectedCup, difficulty, trackIds);
    gd.setWorldAndTrack(cup.worldId, trackIds[0]);
    onNavigate('character-selection');
  };

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center relative z-10 overflow-hidden p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 left-6 z-20"
      >
        <button
          onClick={() => onNavigate('landing')}
          className="glass-button h-14 px-6 rounded-full font-display uppercase font-black tracking-widest text-sm shadow-xl border-white/80 flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-2"
      >
        <Trophy className="text-amber-500" size={36} />
        <h1 className="font-display text-5xl md:text-6xl font-black text-primary italic tracking-tight">GRAND PRIX</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-slate-500 font-bold mb-8 flex items-center gap-2"
      >
        <Star size={16} className="text-amber-400" fill="currentColor" />
        {playerStars} Stars collected
      </motion.p>

      {/* Cup Selection Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-4 max-w-2xl w-full mb-8"
      >
        {CUP_ITEMS.map((cup, i) => {
          const isLocked = playerStars < cup.starReq;
          const isSelected = selectedCup === cup.id;

          return (
            <motion.button
              key={cup.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              disabled={isLocked}
              onClick={() => setSelectedCup(isLocked ? null : cup.id)}
              className={`glass-panel p-6 rounded-2xl flex flex-col items-center gap-3 transition-all relative overflow-hidden group
                ${isSelected ? 'ring-4 ring-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.3)] scale-[1.02]' : ''}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] cursor-pointer'}
              `}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cup.gradient} opacity-40`} />
              
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="text-5xl">{cup.emoji}</span>
                <h3 className="font-display text-lg font-black text-slate-800 tracking-wide">{cup.name}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cup.world}</p>
                
                {isLocked ? (
                  <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full mt-1">
                    <Lock size={12} className="text-slate-500" />
                    <span className="text-xs font-black text-slate-600">{cup.starReq} ⭐ needed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-emerald-100 px-3 py-1 rounded-full mt-1">
                    <Flag size={12} className="text-emerald-600" />
                    <span className="text-xs font-black text-emerald-700">4 Races</span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Difficulty Selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-4 rounded-2xl flex items-center gap-3 mb-6 max-w-md w-full"
      >
        <Zap size={20} className="text-amber-500 ml-2" />
        <span className="font-display font-black text-slate-600 text-sm uppercase tracking-wider mr-auto">Speed</span>
        {DIFFICULTY_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setDifficulty(opt.id)}
            className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all
              ${difficulty === opt.id
                ? 'bg-white shadow-lg scale-105 ring-2 ring-pink-300'
                : 'hover:bg-white/50'
              }
            `}
          >
            <span className={`font-display font-black text-base ${opt.color}`}>{opt.label}</span>
            <span className="text-[10px] font-bold text-slate-400">{opt.subtitle}</span>
            <span className="text-[10px] font-bold text-slate-500 mt-0.5">Coins {opt.multiplier}</span>
          </button>
        ))}
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        disabled={!selectedCup}
        onClick={handleStart}
        className={`glass-button-primary px-16 py-5 text-2xl font-black tracking-wider rounded-2xl transition-all
          ${selectedCup
            ? 'shadow-[0_15px_40px_rgba(225,29,72,0.4)] hover:shadow-[0_20px_50px_rgba(225,29,72,0.5)] hover:scale-105'
            : 'opacity-40 cursor-not-allowed'
          }
        `}
      >
        START GRAND PRIX
      </motion.button>
    </main>
  );
};
