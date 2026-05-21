import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Medal, Star, Timer, User, Crown } from 'lucide-react';
import { GameDataManager } from '../game/GameData';
import { TRACK_REGISTRY, WORLD_NAMES } from '../game/tracks/TrackRegistry';

// Generate mock leaderboard data for display
const generateMockLeaderboard = (trackId: string) => {
  const names = ['Rosie', 'Pepper', 'Mochi', 'Luna', 'Maple', 'Biscuit', 'Hazel', 'Cocoa', 'Willow', 'Clover'];
  return names.map((name, i) => ({
    rank: i + 1,
    name,
    time: 45000 + Math.floor(Math.random() * 30000) + i * 3000,
    isPlayer: false
  })).sort((a, b) => a.time - b.time).map((e, i) => ({ ...e, rank: i + 1 }));
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 10);
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
};

export const Leaderboard = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const gd = GameDataManager.getInstance();
  const data = gd.getData();
  
  // Get all tracks
  const allTracks = Object.entries(TRACK_REGISTRY).flatMap(([worldId, tracks]) =>
    tracks.map(t => ({ ...t, worldId }))
  );
  
  const [selectedTrackId, setSelectedTrackId] = useState(allTracks[0]?.id || 'sands_1');
  
  const selectedTrack = allTracks.find(t => t.id === selectedTrackId);
  const worldName = selectedTrack ? WORLD_NAMES[selectedTrack.worldId] : '';
  
  // Build leaderboard with player's time inserted
  const playerRecord = data.records?.[selectedTrackId]?.bestLap;
  const mockEntries = generateMockLeaderboard(selectedTrackId);
  
  let entries = [...mockEntries];
  if (playerRecord) {
    entries.push({ rank: 0, name: 'You', time: playerRecord.timeMs, isPlayer: true });
    entries.sort((a, b) => a.time - b.time);
    entries = entries.map((e, i) => ({ ...e, rank: i + 1 }));
  }

  return (
    <main className="h-screen w-full flex flex-col relative z-10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 z-20">
        <button
          onClick={() => onNavigate('landing')}
          className="glass-button h-14 px-6 rounded-full font-display uppercase font-black tracking-widest text-sm shadow-xl border-white/80 flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Trophy size={28} className="text-amber-500" />
          <h1 className="font-display text-3xl font-black text-primary italic">LEADERBOARD</h1>
        </div>
        <div className="w-24" />
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 px-6 pb-6 overflow-hidden">
        {/* Track Selector (sidebar) */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-panel p-4 rounded-2xl md:w-56 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto md:max-h-full"
        >
          {Object.entries(TRACK_REGISTRY).map(([worldId, tracks]) => (
            <div key={worldId}>
              <h3 className="font-display font-black text-[10px] text-slate-400 uppercase tracking-wider px-2 py-1 hidden md:block">
                {WORLD_NAMES[worldId]}
              </h3>
              {tracks.map(track => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-xs font-bold min-w-max
                    ${selectedTrackId === track.id ? 'bg-white shadow-lg ring-2 ring-pink-300 text-slate-800' : 'text-slate-500 hover:bg-white/50'}
                  `}
                >
                  {track.name}
                </button>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          key={selectedTrackId}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel p-6 rounded-2xl flex-1 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl font-black text-slate-800">{selectedTrack?.name}</h2>
              <span className="text-xs font-bold text-slate-400">{worldName} • Best Lap Times</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500">
                Par: {selectedTrack ? formatTime(selectedTrack.parTimeMs / 3) : '--'}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-1">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <span className="w-8">#</span>
              <span className="flex-1">Racer</span>
              <span className="w-24 text-right">Best Lap</span>
            </div>

            {entries.slice(0, 10).map((entry, i) => (
              <motion.div
                key={`${entry.name}-${i}`}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                  ${entry.isPlayer ? 'bg-pink-50 ring-2 ring-pink-300 shadow-md' : i % 2 === 0 ? 'bg-white/30' : ''}
                `}
              >
                {/* Rank */}
                <span className="w-8 font-display font-black text-lg">
                  {entry.rank === 1 ? <Crown size={20} className="text-amber-500" /> :
                   entry.rank === 2 ? <Medal size={20} className="text-slate-400" /> :
                   entry.rank === 3 ? <Medal size={20} className="text-orange-600" /> :
                   <span className="text-slate-400">{entry.rank}</span>}
                </span>

                {/* Name */}
                <div className="flex-1 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black
                    ${entry.isPlayer ? 'bg-pink-200 text-pink-700' : 'bg-slate-100 text-slate-500'}
                  `}>
                    {entry.isPlayer ? <User size={14} /> : entry.name[0]}
                  </div>
                  <span className={`font-bold text-sm ${entry.isPlayer ? 'text-pink-700 font-black' : 'text-slate-700'}`}>
                    {entry.name}
                    {entry.isPlayer && <span className="ml-1 text-[10px] text-pink-500">(You)</span>}
                  </span>
                </div>

                {/* Time */}
                <span className={`w-24 text-right font-display font-black text-sm ${entry.isPlayer ? 'text-pink-700' : 'text-slate-600'}`}>
                  {formatTime(entry.time)}
                </span>
              </motion.div>
            ))}

            {!playerRecord && (
              <div className="text-center py-6 text-sm font-bold text-slate-400 italic">
                Race this track to appear on the leaderboard!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
};
