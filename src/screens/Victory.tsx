import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Coins, Timer, ChevronRight, Home, RotateCcw } from 'lucide-react';
import { GameDataManager } from '../game/GameData';
import { useGrandPrixStore } from '../game/stores/useGrandPrixStore';

const POSITION_LABELS = ['1st', '2nd', '3rd', '4th'];
const POSITION_COLORS = ['text-amber-500', 'text-slate-400', 'text-orange-600', 'text-slate-500'];
const CONFETTI_COLORS = ['#ff6b9d', '#c084fc', '#67e8f9', '#fde68a', '#86efac', '#fda4af'];

const ConfettiPiece = ({ delay }: { key?: number, delay: number }) => {
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const left = Math.random() * 100;
  const duration = 2 + Math.random() * 2;
  const size = 4 + Math.random() * 8;

  return (
    <div
      className="absolute top-0 rounded-full animate-[confetti-fall_linear_forwards]"
      style={{
        left: `${left}%`,
        width: size,
        height: size * 1.5,
        backgroundColor: color,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity: 0.8
      }}
    />
  );
};

export const Victory = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const gd = GameDataManager.getInstance();
  const data = gd.getData();
  const stats = data.lastRaceStats;
  const gpStore = useGrandPrixStore();

  const [displayCoins, setDisplayCoins] = useState(0);
  const [showStars, setShowStars] = useState(false);

  const rank = stats?.rank || 1;
  const timeMs = stats?.timeMs || 0;
  const coinsEarned = stats?.coinsEarned || 0;

  // Calculate stars: 1st + fast = 3★, top 2 = 2★, 3rd = 1★
  const starsEarned = rank === 1 ? 3 : rank === 2 ? 2 : rank === 3 ? 1 : 0;

  // CC multiplier for coins
  const difficultyMult = data.difficulty === '150cc' ? 2.0 : data.difficulty === '100cc' ? 1.5 : 1.0;
  const finalCoins = Math.round(coinsEarned * difficultyMult);

  // Animate coin counter
  useEffect(() => {
    let frame: number;
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayCoins(Math.round(progress * finalCoins));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 800);

    const starTimer = setTimeout(() => setShowStars(true), 400);

    return () => {
      clearTimeout(timer);
      clearTimeout(starTimer);
      cancelAnimationFrame(frame);
    };
  }, [finalCoins]);

  // Award stars to game data
  useEffect(() => {
    if (starsEarned > 0) {
      gd.addStars(starsEarned);
    }
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  // Grand Prix handling
  const isGP = gpStore.isActive;

  const handleNext = () => {
    if (isGP) {
      // Record GP result
      gpStore.recordRaceResult({
        trackId: gpStore.getCurrentTrackId(),
        position: rank,
        timeMs,
        stars: starsEarned
      });

      const hasMore = gpStore.advanceToNextRace();
      if (hasMore) {
        const nextTrackId = gpStore.getCurrentTrackId();
        // Find the world for this track
        const worldMap: Record<string, string> = {
          'sands_': 'soft_sands', 'snow_': 'sugar_snow', 'peach_': 'peach_peaks', 'peak_': 'pastel_peak'
        };
        let worldId = 'soft_sands';
        for (const [prefix, wId] of Object.entries(worldMap)) {
          if (nextTrackId.startsWith(prefix)) { worldId = wId; break; }
        }
        gd.setWorldAndTrack(worldId, nextTrackId);
        onNavigate('loading');
      } else {
        // Cup complete — go back to landing
        gpStore.reset();
        onNavigate('landing');
      }
    } else {
      onNavigate('worlds');
    }
  };

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center relative z-10 overflow-hidden p-6">
      {/* Confetti */}
      {rank <= 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 40 }, (_, i) => (
            <ConfettiPiece key={i} delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-30"
          style={{ backgroundColor: rank === 1 ? '#fbbf24' : rank === 2 ? '#c0c0c0' : '#cd7f32' }} />
      </div>

      {/* Position */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative z-10 mb-4"
      >
        <Trophy size={64} className={POSITION_COLORS[rank - 1]} />
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`font-display text-7xl md:text-9xl font-black italic ${POSITION_COLORS[rank - 1]} mb-2`}
      >
        {POSITION_LABELS[rank - 1] || '4th'}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-slate-500 font-bold text-lg mb-8"
      >
        {rank === 1 ? 'Incredible finish!' : rank === 2 ? 'So close to the top!' : rank === 3 ? 'On the podium!' : 'Better luck next time!'}
      </motion.p>

      {/* Stats Panel */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-8 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden mb-8"
      >
        {/* Top gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400" />

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={showStars ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.2, type: 'spring', stiffness: 500 }}
            >
              <Star
                size={40}
                className={i < starsEarned ? 'text-amber-400 drop-shadow-lg' : 'text-slate-200'}
                fill={i < starsEarned ? 'currentColor' : 'none'}
              />
            </motion.div>
          ))}
        </div>

        {/* Time */}
        <div className="flex items-center justify-between py-3 border-b border-white/50">
          <div className="flex items-center gap-3">
            <Timer size={18} className="text-slate-400" />
            <span className="text-sm font-black text-slate-600 uppercase tracking-wider">Race Time</span>
          </div>
          <span className="font-display text-2xl font-black text-slate-800">{formatTime(timeMs)}</span>
        </div>

        {/* Coins */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Coins size={18} className="text-amber-500" />
            <span className="text-sm font-black text-slate-600 uppercase tracking-wider">Coins Earned</span>
          </div>
          <span className="font-display text-2xl font-black text-amber-600">+{displayCoins.toLocaleString()}</span>
        </div>

        {difficultyMult > 1 && (
          <div className="text-center mt-2">
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {data.difficulty} bonus: ×{difficultyMult}
            </span>
          </div>
        )}

        {/* GP Info */}
        {isGP && (
          <div className="mt-4 pt-4 border-t border-white/50 text-center">
            <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
              Grand Prix — Race {gpStore.currentRaceIndex + 1}/{gpStore.trackIds.length}
            </span>
            <div className="text-xs font-bold text-slate-500 mt-1">
              Total Points: {gpStore.totalPoints + (rank <= 4 ? [15, 12, 10, 8][rank - 1] : 8)}
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4"
      >
        <button
          onClick={() => onNavigate('landing')}
          className="glass-button px-8 py-4 rounded-2xl font-black text-slate-600 flex items-center gap-2"
        >
          <Home size={18} />
          Menu
        </button>
        <button
          onClick={handleNext}
          className="glass-button-primary px-12 py-4 rounded-2xl text-lg font-black shadow-[0_15px_40px_rgba(225,29,72,0.4)] hover:scale-105 transition-all flex items-center gap-2"
        >
          {isGP ? 'Next Race' : 'Race Again'}
          <ChevronRight size={20} />
        </button>
      </motion.div>

      {/* CSS for confetti animation */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </main>
  );
};
