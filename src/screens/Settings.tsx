import React, { useState, useEffect } from 'react';
import { Volume2, Music, Monitor, RotateCcw, ArrowLeft, Headphones, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { GameDataManager, GameSettings } from '../game/GameData';

export const SettingsScreen = ({ hideBackground = false, onBack }: { hideBackground?: boolean, onBack?: () => void }) => {
  const [settings, setSettings] = useState<GameSettings | null>(null);

  useEffect(() => {
    setSettings(GameDataManager.getInstance().getData().settings);
  }, []);

  if (!settings) return null;

  const handleUpdate = (field: keyof GameSettings, value: any) => {
    setSettings(prev => prev ? ({ ...prev, [field]: value }) : prev);
  };

  const handleApply = () => {
    if (settings) {
       GameDataManager.getInstance().updateSettings(settings);
       if (onBack) onBack();
    }
  };

  const resetDefaults = () => {
    const defaults: GameSettings = {
       masterVolume: 80,
       musicVolume: 60,
       sfxVolume: 100,
       graphicsQuality: 'high'
    };
    setSettings(defaults);
  };

  return (
    <div className={`flex-grow w-full max-w-container-max mx-auto p-gutter relative z-10 flex flex-col items-center justify-center min-h-[50vh] ${!hideBackground ? 'min-h-screen pt-12' : ''}`}>
      
      {/* Back Button */}
      {onBack && !hideBackground && (
          <div className="absolute top-10 left-10 z-50">
              <button 
                  onClick={onBack}
                  className="glass-button w-12 h-12 rounded-full text-primary border-2 border-white/90"
              >
                  <ArrowLeft size={22} />
              </button>
          </div>
      )}

      <motion.div 
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="w-full max-w-xl glass-panel p-8 md:p-10 relative z-10 border-2 border-white/90 shadow-2xl"
      >
        <header className="flex justify-between items-center mb-10 border-b border-slate-200/60 pb-6 text-left">
            <div className="flex flex-col">
                 <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-pink-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferences</span>
                 </div>
                 <h2 className="font-display text-4xl text-slate-800 uppercase tracking-tighter font-black">SYSTEM</h2>
            </div>
            <div className="bg-slate-100 text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white">
                v2.0 Beta
            </div>
        </header>

        <div className="space-y-10 text-left">
          {/* Audio Mixing Section */}
          <section className="space-y-6">
            <h3 className="font-display text-xs text-slate-400 font-black flex items-center gap-2 uppercase tracking-[0.2em]">
              <Headphones size={14} /> Audio Core
            </h3>
            
            <div className="space-y-6">
              {/* Master Volume */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-widest text-slate-800 font-black">Global Master</span>
                  <span className="font-display text-primary font-black text-xs tracking-widest">{settings.masterVolume}%</span>
                </div>
                <div className="relative h-4 flex items-center group">
                    <input 
                        type="range" min="0" max="100" value={settings.masterVolume} 
                        onChange={(e) => handleUpdate('masterVolume', parseInt(e.target.value))} 
                        className="custom-slider w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #f472b6 ${settings.masterVolume}%, #f1f5f9 ${settings.masterVolume}%)` }} 
                    />
                </div>
              </div>

              {/* Music */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-widest text-slate-800 font-black flex items-center gap-2"><Music size={14} /> Lo-fi Beats</span>
                  <span className="font-display text-cyan-500 font-black text-xs tracking-widest">{settings.musicVolume}%</span>
                </div>
                <div className="relative h-4 flex items-center group">
                    <input 
                        type="range" min="0" max="100" value={settings.musicVolume} 
                        onChange={(e) => handleUpdate('musicVolume', parseInt(e.target.value))} 
                        className="custom-slider w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #06b6d4 ${settings.musicVolume}%, #f1f5f9 ${settings.musicVolume}%)` }} 
                    />
                </div>
              </div>
            </div>
          </section>

          {/* Graphics Section */}
          <section className="space-y-6">
            <h3 className="font-display text-xs text-slate-400 font-black flex items-center gap-2 uppercase tracking-[0.2em]">
              <Monitor size={14} /> Render Engine
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                 {(['low', 'medium', 'high'] as const).map(q => (
                    <button 
                       key={q} 
                       onClick={() => handleUpdate('graphicsQuality', q)}
                       className={`h-14 rounded-2xl font-display uppercase font-black text-[10px] tracking-widest transition-all relative overflow-hidden flex items-center justify-center gap-2 ${settings.graphicsQuality === q ? 'bg-white border-2 border-primary text-primary shadow-lg ring-4 ring-primary/5' : 'bg-slate-50 border-2 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    >
                       {settings.graphicsQuality === q && <Check size={12} className="text-primary" />}
                       {q}
                    </button>
                 ))}
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter text-center">Post-processing: {settings.graphicsQuality === 'high' ? 'ENABLED' : 'OPTIMIZED'}</p>
            </div>
          </section>
        </div>

        <footer className="mt-12 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-slate-200/60 pt-8">
          <button 
            onClick={resetDefaults}
            className="h-14 px-6 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:text-slate-600 transition-colors bg-white/50 border border-slate-200 w-full sm:w-auto justify-center"
          >
            <RotateCcw size={14} strokeWidth={3} /> Reset All
          </button>
          
          <button 
            onClick={handleApply}
            className="glass-button-primary h-14 px-10 text-lg w-full sm:w-auto"
          >
            SAVE CONFIG
          </button>
        </footer>
      </motion.div>
    </div>
  );
};
