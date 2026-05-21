import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star, Lock, MapPin, Play, Trophy } from 'lucide-react';
import { GameDataManager } from '../game/GameData';
import { TRACK_REGISTRY, WORLD_NAMES } from '../game/tracks/TrackRegistry';

const WORLD_CONFIGS = [
  { id: 'soft_sands', gradient: 'from-amber-200 to-orange-200', emoji: '🏖️', starReq: 0 },
  { id: 'sugar_snow', gradient: 'from-blue-200 to-cyan-200', emoji: '❄️', starReq: 4 },
  { id: 'peach_peaks', gradient: 'from-pink-200 to-rose-200', emoji: '🌸', starReq: 8 },
  { id: 'pastel_peak', gradient: 'from-purple-200 to-violet-200', emoji: '💎', starReq: 14 }
];

export const Worlds = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const gd = GameDataManager.getInstance();
  const [data, setData] = useState(gd.getData());
  const [selectedWorld, setSelectedWorld] = useState(data.activeWorld || 'soft_sands');

  useEffect(() => {
    const unsub = gd.subscribe(setData);
    return unsub;
  }, []);

  const playerStars = data.stars || 0;
  const tracks = TRACK_REGISTRY[selectedWorld] || [];
  const worldConfig = WORLD_CONFIGS.find(w => w.id === selectedWorld)!;

  const handleSelectTrack = (trackId: string) => {
    gd.setWorldAndTrack(selectedWorld, trackId);
    onNavigate('loading');
  };

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 left-6 z-20"
      >
        <button
          onClick={() => onNavigate('character-selection')}
          className="glass-button h-14 px-6 rounded-full font-display uppercase font-black tracking-widest text-sm shadow-xl border-white/80 flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </motion.div>

      {/* Stars Badge */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 right-6 z-20"
      >
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
          <Star size={16} className="text-amber-400" fill="currentColor" />
          <span className="font-display font-black text-slate-700">{playerStars}</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-display text-4xl md:text-5xl font-black text-primary italic tracking-tight mt-16 mb-2"
      >
        SELECT WORLD
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-slate-500 font-bold mb-6"
      >
        Choose a world, then pick your track
      </motion.p>

      {/* World Tabs */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-3 mb-8 flex-wrap justify-center"
      >
        {WORLD_CONFIGS.map((world, i) => {
          const isLocked = playerStars < world.starReq;
          const isActive = selectedWorld === world.id;

          return (
            <button
              key={world.id}
              disabled={isLocked}
              onClick={() => !isLocked && setSelectedWorld(world.id)}
              className={`glass-panel px-5 py-3 rounded-2xl flex items-center gap-2 transition-all
                ${isActive ? 'ring-3 ring-pink-400 shadow-xl scale-105 bg-white/80' : ''}
                ${isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:scale-102 cursor-pointer'}
              `}
            >
              <span className="text-2xl">{world.emoji}</span>
              <div className="flex flex-col items-start">
                <span className="font-display font-black text-sm text-slate-800">{WORLD_NAMES[world.id]}</span>
                {isLocked && (
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Lock size={10} /> {world.starReq} ⭐
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* Track List */}
      <motion.div
        key={selectedWorld}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full mb-12"
      >
        {tracks.map((track, i) => {
          const isLocked = playerStars < track.starRequirement;
          const record = data.records?.[track.id];
          const bestTime = record?.bestLap?.timeMs;

          return (
            <motion.div
              key={track.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-panel p-5 rounded-2xl relative overflow-hidden transition-all group
                ${isLocked ? 'opacity-50' : 'hover:shadow-xl hover:scale-[1.01] cursor-pointer'}
              `}
              onClick={() => !isLocked && handleSelectTrack(track.id)}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${worldConfig.gradient} opacity-30`} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display text-lg font-black text-slate-800">{track.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full
                        ${track.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                          track.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                          track.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'}
                      `}>
                        {track.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{(track.lengthM / 1000).toFixed(1)} km</span>
                      <span className="text-[10px] font-bold text-slate-400">Par {formatTime(track.parTimeMs)}</span>
                    </div>
                  </div>

                  {isLocked ? (
                    <div className="flex items-center gap-1 bg-slate-200 px-2 py-1 rounded-full">
                      <Lock size={12} className="text-slate-500" />
                      <span className="text-xs font-black text-slate-600">{track.starRequirement} ⭐</span>
                    </div>
                  ) : (
                    <button className="glass-button w-10 h-10 rounded-full flex items-center justify-center text-primary group-hover:bg-pink-500 group-hover:text-white transition-all">
                      <Play size={16} fill="currentColor" />
                    </button>
                  )}
                </div>

                {/* Best Time & Stars */}
                {!isLocked && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/50">
                    {bestTime ? (
                      <div className="flex items-center gap-1">
                        <Trophy size={12} className="text-amber-500" />
                        <span className="text-xs font-black text-slate-600">Best: {formatTime(bestTime)}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 italic">No record yet</span>
                    )}
                    <div className="ml-auto flex gap-0.5">
                      {[0, 1, 2].map(s => (
                        <Star key={s} size={14} className="text-amber-400" fill={s < 0 ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </main>
  );
};
