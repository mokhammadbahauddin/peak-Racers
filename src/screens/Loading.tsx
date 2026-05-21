import React, { useState, useEffect } from 'react';

import { GameDataManager } from '../game/GameData';

const TIPS = [
  "Use mushrooms on straightaways to maximize speed.",
  "Drifting around corners builds up your mini-turbo boost.",
  "Check your garage to upgrade your vehicle's baseline stats.",
  "Peach Peaks is unlocked after earning 5 total stars.",
  "Stay on the track! Driving on rough terrain slows you down."
];

export const Loading = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => {
    const duration = 2500; // Simulated loading time
    let start = Date.now();
    let frameId: number;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      
      // Easing out sine
      const currentProgress = Math.sin((t * Math.PI) / 2) * 100;
      setProgress(currentProgress);

      if (t < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        GameDataManager.getInstance().setBooted();
        setTimeout(onComplete, 200); // small buffer at 100%
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 pointer-events-auto">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-40">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-pink-500 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] bg-cyan-600 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="relative z-10 w-full max-w-xl px-12 flex flex-col items-center">
        {/* Animated Car */}
        <div className="w-full flex items-center justify-center mb-12 relative h-32">
          {/* Subtle track line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 rounded-full"></div>
          
          <div 
            className="absolute bottom-1 w-24 h-24"
            style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-full h-full relative animate-bounce" style={{ animationDuration: '0.4s' }}>
                <span className="material-symbols-outlined absolute bottom-0 left-1/2 -translate-x-1/2 text-[64px] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    sports_motorsports
                </span>
                {/* Wind particles behind car */}
                {progress > 5 && progress < 95 && (
                    <div className="absolute top-1/2 -left-8 flex gap-1 items-center opacity-60">
                        <div className="h-1 w-4 bg-white/50 rounded-full animate-pulse"></div>
                        <div className="h-1 w-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    </div>
                )}
            </div>
          </div>
        </div>

        <h1 className="font-display-lg text-4xl text-white font-bold mb-8 uppercase tracking-widest text-center">
          Loading World
        </h1>

        {/* Progress Bar Container */}
        <div className="w-full relative mb-8">
          <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border-2 border-white/20 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
            <div 
              className="h-full bg-gradient-to-r from-pink-400 via-white to-cyan-300 rounded-full shadow-[0_0_15px_rgba(255,209,220,0.8)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="absolute -bottom-6 right-0 text-white/50 font-mono text-sm font-bold">
            {Math.floor(progress)}%
          </div>
        </div>

        {/* Dynamic Tip Selection */}
        <div className="glass-panel p-4 px-6 border border-white/10 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
            </div>
            <div>
                <p className="font-label-sm text-xs font-bold uppercase tracking-widest text-primary mb-1">Pro Tip</p>
                <p className="font-body-md text-[14px] text-slate-300 leading-snug">
                    {TIPS[tipIndex]}
                </p>
            </div>
        </div>

      </div>
    </main>
  );
};
