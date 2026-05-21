import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Zap, Disc, Wind, Lock, Coins, Gem, ChevronRight, Wrench } from 'lucide-react';
import { GameDataManager } from '../game/GameData';
import { VEHICLES, Vehicle, UPGRADE_COSTS, UPGRADE_EFFECTS, getVehicle } from '../game/VehicleData';

const UPGRADE_INFO = [
  { key: 'turbo' as const, label: 'Turbo Charger', icon: <Zap size={18} />, color: 'text-amber-500', bgColor: 'bg-amber-500', desc: 'Increases top speed' },
  { key: 'tires' as const, label: 'Grip Tires', icon: <Disc size={18} />, color: 'text-blue-500', bgColor: 'bg-blue-500', desc: 'Improves handling' },
  { key: 'aero' as const, label: 'Aero Kit', icon: <Wind size={18} />, color: 'text-emerald-500', bgColor: 'bg-emerald-500', desc: 'Better acceleration' }
];

const StatPip = ({ filled, color }: { key?: number, filled: boolean; color: string }) => (
  <div className={`w-3 h-8 rounded-sm transition-all ${filled ? color + ' shadow-md' : 'bg-slate-200'}`} />
);

export const Garage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const gd = GameDataManager.getInstance();
  const [data, setData] = useState(gd.getData());
  const [selectedVehicleId, setSelectedVehicleId] = useState(data.activeVehicleId || 'bubblegum_cruiser');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const unsub = gd.subscribe(setData);
    return unsub;
  }, []);

  const vehicle = getVehicle(selectedVehicleId);
  const isOwned = (data.ownedVehicles || []).includes(selectedVehicleId);
  const isActive = data.activeVehicleId === selectedVehicleId;

  const getUpgradeLevel = (part: 'turbo' | 'tires' | 'aero') =>
    gd.getVehicleUpgradeLevel(selectedVehicleId, part);

  const getEffectiveStat = (statKey: string) => {
    let base = vehicle.stats[statKey as keyof typeof vehicle.stats] || 0;
    for (const upgrade of UPGRADE_INFO) {
      const effect = UPGRADE_EFFECTS[upgrade.key];
      if (effect.statKey === statKey) {
        base += getUpgradeLevel(upgrade.key) * effect.perLevel;
      }
    }
    return Math.min(base, 100);
  };

  const handleUnlock = () => {
    const success = gd.unlockVehicle(vehicle.id, vehicle.unlockCost, vehicle.unlockCurrency);
    if (success) {
      showToast(`${vehicle.name} unlocked!`);
    } else {
      showToast(`Not enough ${vehicle.unlockCurrency}!`);
    }
  };

  const handleUpgrade = (part: 'turbo' | 'tires' | 'aero') => {
    const level = getUpgradeLevel(part);
    if (level >= 5) return;
    const cost = UPGRADE_COSTS[part][level];
    const success = gd.upgradeVehiclePart(selectedVehicleId, part, cost);
    if (success) {
      showToast(`${part.charAt(0).toUpperCase() + part.slice(1)} upgraded to Lv ${level + 1}!`);
    } else {
      showToast('Not enough coins!');
    }
  };

  const handleEquip = () => {
    gd.setVehicle(selectedVehicleId);
    gd.setCarType(vehicle.carType);
    gd.setColor(vehicle.color);
    showToast(`${vehicle.name} equipped!`);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <main className="h-screen w-full flex flex-col relative z-10 overflow-hidden">
      {/* Header */}
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

      {/* Coins Display */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 right-6 z-20 flex gap-3"
      >
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
          <Coins size={16} className="text-amber-500" />
          <span className="font-display font-black text-slate-700">{data.coins?.toLocaleString()}</span>
        </div>
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
          <Gem size={16} className="text-purple-500" />
          <span className="font-display font-black text-slate-700">{(data.gems || 0).toLocaleString()}</span>
        </div>
      </motion.div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full font-display font-black text-sm text-primary shadow-2xl"
        >
          {toast}
        </motion.div>
      )}

      <div className="flex-1 flex flex-col items-center justify-start gap-6 p-6 pt-24 pb-32 overflow-y-auto w-full max-w-4xl mx-auto">

        {/* Main Vehicle Display & Upgrades */}
        <motion.div
          key={selectedVehicleId}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-8 rounded-3xl shadow-2xl w-full relative overflow-hidden flex flex-col md:flex-row gap-8"
        >
          <div className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at 50% 30%, #${vehicle.color.toString(16).padStart(6, '0')}, transparent 60%)` }} />

          <div className="relative z-10">
            {/* Vehicle name & class */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-3xl font-black text-slate-800">{vehicle.name}</h2>
                <span className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full
                  ${vehicle.vehicleClass === 'A' ? 'bg-amber-100 text-amber-700' :
                    vehicle.vehicleClass === 'B' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'}
                `}>
                  Class {vehicle.vehicleClass}
                </span>
              </div>
              {/* Placeholder for 3D model — shows colored box */}
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl"
                style={{ backgroundColor: `#${vehicle.color.toString(16).padStart(6, '0')}30` }}>
                🏎️
              </div>
            </div>

            <p className="text-sm text-slate-500 font-bold mb-6">{vehicle.description}</p>

            {/* Stats */}
            <div className="space-y-3 mb-6">
              {(['speed', 'handling', 'acceleration', 'weight'] as const).map(stat => (
                <div key={stat} className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider w-24">{stat}</span>
                  <div className="flex gap-1 flex-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <StatPip filled={i < Math.round(getEffectiveStat(stat) / 10)}
                        color={stat === 'speed' ? 'bg-pink-400' : stat === 'handling' ? 'bg-blue-400' : stat === 'acceleration' ? 'bg-emerald-400' : 'bg-purple-400'} />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-700 w-8 text-right">{getEffectiveStat(stat)}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            {!isOwned ? (
              <button
                onClick={handleUnlock}
                className="glass-button-primary w-full min-h-[48px] py-4 text-lg font-black rounded-xl flex items-center justify-center gap-3"
              >
                {vehicle.unlockCurrency === 'coins' ? <Coins size={20} /> : <Gem size={20} />}
                UNLOCK — {vehicle.unlockCost.toLocaleString()} {vehicle.unlockCurrency === 'coins' ? '🪙' : '💎'}
              </button>
            ) : !isActive ? (
              <button onClick={handleEquip} className="glass-button-primary w-full min-h-[48px] py-4 text-lg font-black rounded-xl">
                EQUIP THIS VEHICLE
              </button>
            ) : (
              <div className="text-center text-sm font-black text-emerald-600 bg-emerald-50 py-3 rounded-xl">
                ✓ Currently Equipped
              </div>
            )}
          </div>

          {/* Upgrades Panel (integrated) */}
          {isOwned && (
            <div className="flex-1 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-white/40 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center gap-2 mb-2">
                <Wrench size={18} className="text-slate-500" />
                <h3 className="font-display font-black text-sm text-slate-600 uppercase tracking-wider">Upgrades</h3>
              </div>

              {UPGRADE_INFO.map(upgrade => {
                const level = getUpgradeLevel(upgrade.key);
                const maxed = level >= 5;
                const nextCost = maxed ? 0 : UPGRADE_COSTS[upgrade.key][level];

                return (
                  <div key={upgrade.key} className="glass-panel p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${upgrade.color} bg-white/80`}>
                          {upgrade.icon}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-700">{upgrade.label}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{upgrade.desc}</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-600">Lv {level}/5</span>
                    </div>

                    {/* Level pips */}
                    <div className="flex gap-1 mb-3">
                      {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i < level ? upgrade.bgColor : 'bg-slate-200'}`} />
                      ))}
                    </div>

                    {!maxed ? (
                      <button
                        onClick={() => handleUpgrade(upgrade.key)}
                        className="glass-button w-full min-h-[48px] py-2 rounded-lg text-xs font-black flex items-center justify-center gap-2 hover:bg-white/80"
                      >
                        <Coins size={12} className="text-amber-500" />
                        Upgrade — {nextCost.toLocaleString()} 🪙
                      </button>
                    ) : (
                      <div className="text-center text-[10px] font-black text-emerald-600 bg-emerald-50 py-1.5 rounded-lg">
                        ✓ MAX LEVEL
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

      </div>

      {/* Swipeable Vehicle Carousel at Bottom */}
      <div className="absolute bottom-6 left-0 w-full overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: -((VEHICLES.length - 1) * 200), right: 0 }}
          className="flex gap-4 px-6 cursor-grab active:cursor-grabbing w-max"
        >
          {VEHICLES.map(v => {
            const owned = (data.ownedVehicles || []).includes(v.id);
            const isSelected = v.id === selectedVehicleId;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVehicleId(v.id)}
                className={`flex items-center gap-3 p-3 w-48 min-h-[48px] rounded-xl transition-all whitespace-nowrap
                  ${isSelected ? 'bg-white shadow-xl ring-2 ring-pink-300 scale-105' : 'glass-panel hover:bg-white/50 scale-100'}
                  ${!owned ? 'opacity-60' : ''}
                `}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black"
                  style={{ backgroundColor: `#${v.color.toString(16).padStart(6, '0')}30`, color: `#${v.color.toString(16).padStart(6, '0')}` }}>
                  {v.vehicleClass}
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-black text-slate-700 truncate w-full text-left">{v.name}</span>
                  {!owned && <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Lock size={8} /> Locked</span>}
                </div>
              </button>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
};
