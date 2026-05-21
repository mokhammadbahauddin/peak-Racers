import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Pause, AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Engine } from '../game/Engine';
import { SettingsScreen } from './Settings';
import { GameDataManager } from '../game/GameData';
import { TRACK_REGISTRY } from '../game/tracks/TrackRegistry';
import * as THREE from 'three';
import { useHudStore } from '../game/stores/useHudStore';

const Speedometer = () => {
  const speed = useHudStore(s => s.speed);
  const gear = useHudStore(s => s.gear);
  const showRedline = useHudStore(s => s.showRedline);
  
  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <div className="flex justify-between w-full px-2 mb-1">
        <span className="font-display font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] opacity-70">Gear</span>
        <span className="font-display font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] opacity-70">Velocity</span>
      </div>
      <div className="flex items-baseline justify-between w-full px-2">
          <div className="flex items-center gap-2">
            <span className={`font-display text-4xl md:text-5xl leading-none font-black italic drop-shadow-md transition-colors ${showRedline ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
              {gear}
            </span>
            {showRedline && (
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-ping" />
            )}
          </div>
          <div className="flex items-baseline space-x-1">
            <span className={`font-display text-primary text-6xl md:text-8xl leading-none font-black italic tracking-tighter drop-shadow-md ${showRedline ? 'text-red-500' : ''}`}>
              {Math.round(Math.abs(speed))}
            </span>
            <span className="font-display text-slate-300 uppercase text-sm md:text-xl font-black italic opacity-60">KM/H</span>
          </div>
      </div>
    </div>
  );
};

const BoostBar = () => {
  const boost = useHudStore(s => s.boost);
  return (
    <div className="w-full h-4 bg-slate-100 rounded-full mt-6 overflow-hidden relative z-10 border border-white shadow-inner p-[2px]">
      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all ease-out duration-75 relative overflow-hidden" 
           style={{ width: `${boost}%` }}>
         <div className="absolute inset-0 bg-white/30 animate-[pulse_1s_infinite]"></div>
      </div>
    </div>
  );
};

const LapDisplay = () => {
    const lap = useHudStore(s => s.lap);
    return (
        <div className="flex flex-col items-center">
        <p className="font-display font-black text-slate-400 uppercase tracking-[0.2em] text-[10px] mb-1">Lap</p>
        <p className="font-display text-secondary text-3xl md:text-5xl leading-none font-black italic tracking-tighter">
            <span>{lap}</span><span className="text-lg md:text-xl text-slate-300 opacity-60">/3</span>
        </p>
        </div>
    );
};

const PositionDisplay = () => {
    const rank = useHudStore(s => s.rank);
    return (
        <div className="flex flex-col items-center">
            <p className="font-display font-black text-slate-400 uppercase tracking-[0.2em] text-[10px] mb-1">Position</p>
            <p className="font-display text-primary text-3xl md:text-5xl leading-none font-black italic tracking-tighter">
                <span>{rank}</span><span className="text-lg md:text-xl text-slate-300 opacity-60">/4</span>
            </p>
        </div>
    );
};

const ItemDisplay = () => {
    const currentItem = useHudStore(s => s.currentItem);
    return (
        <div className="glass-panel mt-0 flex flex-col items-center justify-center relative w-24 h-24 md:w-32 md:h-32 rounded-full border-t-2 border-white shadow-[0_15px_35px_rgba(0,0,0,0.2)] pointer-events-auto group overflow-hidden">
            <p className="font-display font-black text-slate-500 uppercase tracking-[0.1em] text-[10px] absolute top-3">Item (E)</p>
            <div className="flex-grow flex items-center justify-center w-full h-full pt-4">
                {currentItem === 'none' && <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-slate-300/40 border-dashed opacity-50" />}
                {currentItem === 'mushroom' && <div className="text-5xl md:text-6xl drop-shadow-lg">🍄</div>}
                {currentItem === 'star' && <div className="text-5xl md:text-6xl drop-shadow-lg">⭐</div>}
                {currentItem === 'shield' && <div className="text-5xl md:text-6xl drop-shadow-lg">🛡️</div>}
                {currentItem === 'rocket' && <div className="text-5xl md:text-6xl drop-shadow-lg">🚀</div>}
            </div>
            {currentItem !== 'none' && (
                <div className="absolute inset-0 border-4 border-cyan-400 rounded-full animate-[pulse_2s_infinite] pointer-events-none"></div>
            )}
            {/* Glass reflection highlight */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none"></div>
        </div>
    );
};

const CenterText = () => {
    const gameState = useHudStore(s => s.gameState);
    const timer = useHudStore(s => s.timer);
    
    let text = '';
    let opacity = '0';
    if (gameState === 'intro') {
        text = 'PREPARE...'; opacity = '1';
    } else if (gameState === 'countdown') {
        opacity = '1';
        if (timer > 1) {
            text = Math.floor(timer).toString();
        } else if (timer > 0) {
            text = 'GO!';
        } else {
            opacity = '0';
        }
    } else if (gameState === 'finished') {
        text = 'FINISHED!'; opacity = '1';
    }

    return (
        <h1 className="font-display text-[120px] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] uppercase italic font-black transition-opacity duration-200" style={{ opacity }}>
            {text}
        </h1>
    );
}

const MinimapDot: React.FC<{ isPlayer: boolean, index?: number, mapCurve: THREE.CatmullRomCurve3 }> = ({ isPlayer, index, mapCurve }) => {
    const t = useHudStore(s => isPlayer ? s.playerT : s.aiTs[index || 0]);
    if (!mapCurve) return null;
    let p = { x: 0, z: 0 };
    try {
       p = mapCurve.getPointAt(t % 1.0);
    } catch(e) {}
    
    return (
        <circle cx={p.x} cy={p.z} r={isPlayer ? 28 : 18} fill={isPlayer ? "#fb7185" : "#fda4af"} stroke="#fff" strokeWidth={isPlayer ? 6 : 4} className="transition-all duration-75" />
    );
}

const AnalogJoystick = ({ onSteer }: { onSteer: (val: number | null) => void }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        setActive(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        updatePos(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!active) return;
        updatePos(e.clientX);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setActive(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        onSteer(null);
        if (knobRef.current) {
            knobRef.current.style.transform = `translate(0px, 0px)`;
        }
    };

    const updatePos = (clientX: number) => {
        if (!parentRef.current || !knobRef.current) return;
        const rect = parentRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        let diffX = clientX - centerX;
        const maxDist = (rect.width / 2) - 16; // 16px padding
        
        diffX = Math.max(-maxDist, Math.min(maxDist, diffX));
        
        knobRef.current.style.transform = `translate(${diffX}px, 0px)`;
        
        // normalize to -1.0 to 1.0
        onSteer(diffX / maxDist);
    };

    return (
        <div 
            ref={parentRef}
            className="w-56 h-20 rounded-full glass-panel border-2 border-white/50 flex items-center justify-center relative touch-none pointer-events-auto shadow-xl"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <div className="absolute inset-x-6 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-l from-transparent to-pink-400/50"></div>
            </div>
            <div 
                ref={knobRef}
                className={`w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-slate-200/50 absolute transition-shadow ${active ? 'shadow-[0_0_30px_rgba(255,255,255,0.8)] scale-110' : 'shadow-lg'}`}
                style={{ transition: active ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
                <div className="flex gap-[3px] opacity-30">
                    <div className="w-1.5 h-6 bg-slate-400 rounded-full" />
                    <div className="w-1.5 h-6 bg-slate-400 rounded-full" />
                    <div className="w-1.5 h-6 bg-slate-400 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export const Gameplay = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Generate minimap path
  const { mapPath, mapBounds, mapCurve } = useMemo(() => {
    let activeWorld = 'soft_sands';
    let activeTrackId = 'sands_1';
    try {
      const data = GameDataManager.getInstance().getData();
      activeWorld = data.activeWorld || 'soft_sands';
      activeTrackId = data.activeTrack || 'sands_1';
    } catch(e) {}
    let trackDef = TRACK_REGISTRY[activeWorld]?.find(t => t.id === activeTrackId) || TRACK_REGISTRY['soft_sands'][0];

    const points = trackDef.points.map(p => new THREE.Vector3(p[0]*2, p[1]*2, p[2]*2));
    const curve = new THREE.CatmullRomCurve3(points, true);
    curve.curveType = 'catmullrom';
    curve.tension = 0.5;
    
    const pts = curve.getSpacedPoints(100);
    const d = pts.map((p, i) => `${i===0?'M':'L'}${p.x},${p.z}`).join(' ') + 'Z';
    
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    pts.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.z < minZ) minZ = p.z;
        if (p.z > maxZ) maxZ = p.z;
    });

    return { 
        mapPath: d, 
        mapCurve: curve,
        mapBounds: { x: minX - 100, y: minZ - 100, w: (maxX - minX) + 200, h: (maxZ - minZ) + 200 }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    try {
      const handleGameFinish = (rank: number, timeMs: number, bestLapMs?: number) => {
         // GDD coin rewards: 1st=500, 2nd=300, 3rd=150, 4th=75
         const COIN_REWARDS = [500, 300, 150, 75];
         const baseCoinReward = COIN_REWARDS[Math.min(rank - 1, 3)] || 75;
         
         const gd = GameDataManager.getInstance();
         const difficulty = gd.getData().difficulty || '50cc';
         const diffMult = difficulty === '150cc' ? 2.0 : difficulty === '100cc' ? 1.5 : 1.0;
         
         const coinsEarned = Math.round(baseCoinReward * diffMult);
         const xpEarned = Math.max(0, (5 - rank) * 200 + 100);
         
         gd.addCoins(coinsEarned);
         gd.addXp(xpEarned);
         gd.setLastRaceStats({ rank, timeMs, coinsEarned, xpEarned });
         
         const activeTrack = gd.getData().activeTrack || 'sands_1';
         gd.saveRaceRecord(activeTrack, timeMs, bestLapMs);

         onNavigate('victory');
      };
      engineRef.current = new Engine(containerRef.current, handleGameFinish);
    } catch (e: any) {
        console.error("3D Engine Crash:", e);
        setErrorMsg(e.message || "Unknown WebGL Error");
    }

    return () => {
        if (engineRef.current) engineRef.current.dispose();
    };
  }, [onNavigate]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.togglePause(isPaused);
    }
  }, [isPaused]);

  return (
    <div className="bg-background text-on-surface font-sans h-screen w-screen overflow-hidden flex flex-col relative">
      <div ref={containerRef} className="absolute inset-0 z-0 bg-[#bfe0ec]" />

      {errorMsg && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg p-8">
            <div className="glass-panel p-8 shadow-2xl max-w-lg text-center flex flex-col items-center gap-4">
                <AlertTriangle className="text-red-500 w-12 h-12 mb-2" />
                <h2 className="font-display text-red-500 text-3xl uppercase tracking-widest font-black">Engine Crash</h2>
                <p className="text-slate-600 bg-black/5 p-4 rounded-xl font-mono text-xs w-full break-words">{errorMsg}</p>
                <button onClick={() => onNavigate('landing')} className="glass-button-primary px-8 py-3 rounded-xl mt-4">Return to Menu</button>
            </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <CenterText />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/10 z-10 pointer-events-none mix-blend-overlay"></div>
      
      {/* HUD Elements (Top) */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-start p-6 md:p-10 z-20 pointer-events-none">
        <div className="glass-panel p-4 md:p-6 flex items-center space-x-6 md:space-x-8 pointer-events-auto border-white shadow-2xl">
          <PositionDisplay />
          <div className="w-px h-10 md:h-12 bg-slate-200"></div>
          <LapDisplay />
        </div>
        
        <button 
          onClick={() => setIsPaused(true)}
          className="glass-button w-16 h-16 rounded-full pointer-events-auto text-primary border-2 border-white shadow-xl group"
        >
          <Pause size={24} className="group-active:scale-90 transition-transform fill-current" />
        </button>
      </div>

      {isPaused && !showSettings && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xl pointer-events-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-10 md:p-12 shadow-5xl w-full max-w-sm flex flex-col gap-5 text-center border-white/90"
          >
             <h2 className="font-display text-5xl text-primary font-black italic mb-6 tracking-tight">PAUSED</h2>
             <button onClick={() => setIsPaused(false)} className="glass-button-primary w-full py-5 text-xl font-black shadow-[0_15px_35px_rgba(225,29,72,0.3)]">
                RESUME RACE
             </button>
             <button onClick={() => setShowSettings(true)} className="glass-button w-full h-16 text-lg font-black text-slate-700">
                SETTINGS
             </button>
             <button onClick={() => onNavigate('landing')} className="glass-button w-full h-16 text-lg font-black text-slate-400 hover:text-red-500 border-none bg-transparent shadow-none">
                QUIT LEAGUE
             </button>
          </motion.div>
        </div>
      )}

      {isPaused && showSettings && (
        <div className="absolute inset-0 z-50 flex flex-col pointer-events-auto bg-slate-900/60 backdrop-blur-2xl overflow-y-auto">
            <button onClick={() => setShowSettings(false)} className="absolute top-10 left-10 z-[60] glass-button h-14 px-8 rounded-full font-display uppercase font-black tracking-widest text-sm shadow-2xl border-white/80">
                <ArrowLeft size={18} className="mr-2" /> Back to Pause
            </button>
            <div className="w-full transform scale-95 sm:scale-100 flex-grow py-20 px-4 flex justify-center mt-10">
               <SettingsScreen hideBackground />
            </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full flex justify-between items-end p-6 md:p-10 z-20 pointer-events-none">
        <div className="glass-panel rounded-full p-4 pointer-events-auto w-40 h-40 md:w-56 md:h-56 flex items-center justify-center shadow-2xl border-white/90 overflow-hidden relative group">
           <svg 
              viewBox={`${mapBounds.x} ${mapBounds.y} ${mapBounds.w} ${mapBounds.h}`} 
              className="w-full h-full opacity-100 relative z-10 p-4"
              style={{ strokeLinejoin: 'round', strokeLinecap: 'round' }}
           >
              <path d={mapPath} fill="none" stroke="rgba(120,85,94,0.1)" strokeWidth="40" className="blur-sm" />
              <path d={mapPath} fill="none" stroke="white" strokeWidth="12" />
              {[...Array(3)].map((_, i) => (
                  <MinimapDot key={i} index={i} isPlayer={false} mapCurve={mapCurve} />
              ))}
              <MinimapDot isPlayer={true} mapCurve={mapCurve} />
           </svg>
        </div>

        {/* Center Item Box (Physical Glass Style) */}
        <div className="absolute left-1/2 bottom-6 md:bottom-10 -translate-x-1/2 pointer-events-auto z-30">
            <ItemDisplay />
        </div>

        <div className="glass-panel p-6 flex flex-col items-center pointer-events-auto min-w-[200px] md:min-w-[240px] shadow-2xl border-white/90 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 animate-pulse"></div>
          <Speedometer />
          <BoostBar />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/2 flex justify-between items-end p-6 z-40 pointer-events-none sm:hidden">
        <div className="flex pointer-events-auto transform translate-y-[-3rem] ml-4">
           <AnalogJoystick onSteer={(val) => {
               if (engineRef.current) engineRef.current.input.setAnalogSteer(val);
           }} />
        </div>
        <div className="flex flex-col gap-4 items-end pointer-events-auto transform translate-y-[-2rem]">
           <div className="flex gap-4">
              <button 
                onPointerDown={(e) => { e.preventDefault(); engineRef.current?.simulateInput('z', true); }}
                onPointerUp={(e) => { e.preventDefault(); engineRef.current?.simulateInput('z', false); }}
                className="w-16 h-16 bg-slate-700/80 rounded-full border-2 border-white text-white font-black text-xs active:scale-95 shadow-xl"
              >
                 GEAR -
              </button>
              <button 
                onPointerDown={(e) => { e.preventDefault(); engineRef.current?.simulateInput('x', true); }}
                onPointerUp={(e) => { e.preventDefault(); engineRef.current?.simulateInput('x', false); }}
                className="w-16 h-16 bg-slate-700/80 rounded-full border-2 border-white text-white font-black text-xs active:scale-95 shadow-xl"
              >
                 GEAR +
              </button>
           </div>
           <div className="flex gap-4">
              <button 
                onPointerDown={(e) => { e.preventDefault(); engineRef.current?.simulateInput('e', true); }}
                onPointerUp={(e) => { e.preventDefault(); engineRef.current?.simulateInput('e', false); }}
                className="w-16 h-16 bg-purple-500 rounded-full border-2 border-white text-white font-black text-xs active:scale-95 shadow-xl"
              >
                 ITEM
              </button>
              <button 
                onPointerDown={(e) => { e.preventDefault(); engineRef.current?.simulateInput(' ', true); }}
                onPointerUp={(e) => { e.preventDefault(); engineRef.current?.simulateInput(' ', false); }}
                className="w-16 h-16 bg-amber-500 rounded-full border-2 border-white text-white font-black text-xs active:scale-95 shadow-xl"
              >
                 DRIFT
              </button>
           </div>
           <button 
             onPointerDown={(e) => { e.preventDefault(); engineRef.current?.simulateInput('Shift', true); }}
             onPointerUp={(e) => { e.preventDefault(); engineRef.current?.simulateInput('Shift', false); }}
             className="w-20 h-20 bg-cyan-500 rounded-full border-4 border-white text-white font-black text-xl active:scale-95"
           >
              BOOST
           </button>
           <div className="flex gap-4">
             <button 
               onPointerDown={(e) => { e.preventDefault(); engineRef.current?.simulateInput('ArrowDown', true); }}
               onPointerUp={(e) => { e.preventDefault(); engineRef.current?.simulateInput('ArrowDown', false); }}
               className="w-20 h-20 glass-button rounded-full flex items-center justify-center text-rose-500"
             >
                <ArrowDown size={24} />
             </button>
             <button 
               onPointerDown={(e) => { e.preventDefault(); engineRef.current?.simulateInput('ArrowUp', true); }}
               onPointerUp={(e) => { e.preventDefault(); engineRef.current?.simulateInput('ArrowUp', false); }}
               className="w-24 h-24 glass-button rounded-[2rem] flex items-center justify-center text-emerald-600"
             >
                <ArrowUp size={32} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const ArrowDown = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
);
const ArrowUp = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
);
