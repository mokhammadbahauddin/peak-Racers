import React from 'react';
import { ArrowLeft, Database, Key, Clock, Settings, User, Trophy, PlayCircle } from 'lucide-react';

export const DataModel = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] bg-teal-200/50 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[45vw] h-[45vw] bg-emerald-200/50 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Data Architecture</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-teal-700 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Database className="text-teal-500 w-10 h-10" />
             Data Model & Schema
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            The most expensive decisions to change. Finalized before API or UI work began.
          </p>
        </div>

        {/* Schema Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Player */}
          <div className="glass-panel p-6 shadow-xl rounded-2xl border-white hover:-translate-y-1 transition-transform">
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/40">
                <div className="flex items-center gap-3">
                   <div className="bg-teal-100 p-2 rounded-lg text-teal-600"><User size={20} /></div>
                   <h2 className="font-display text-xl font-bold text-slate-800">Player</h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-100 px-2 py-1 rounded">PK</span>
             </div>
             
             <ul className="space-y-3 font-mono text-xs">
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">player_id</span> <span className="text-teal-600">UUID</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">display_name</span> <span className="text-slate-500">VARCHAR(32)</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">email</span> <span className="text-slate-500">VARCHAR(255)</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">currency_coins</span> <span className="text-slate-500">INT</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">currency_gems</span> <span className="text-slate-500">INT</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold text-amber-600">active_vehicle_id</span> <span className="text-slate-500">FK</span></li>
                <li className="flex justify-between"><span className="text-slate-800 font-bold">created_at</span> <span className="text-slate-500">TIMESTAMPTZ</span></li>
             </ul>
             <div className="mt-6 pt-4 border-t border-white/40 text-xs text-slate-500 font-medium">
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded mr-2 font-bold text-[10px]">1 → n</span>
                Race, Leaderboard
             </div>
          </div>

          {/* Vehicle */}
          <div className="glass-panel p-6 shadow-xl rounded-2xl border-white hover:-translate-y-1 transition-transform">
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/40">
                <div className="flex items-center gap-3">
                   <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Settings size={20} /></div>
                   <h2 className="font-display text-xl font-bold text-slate-800">Vehicle</h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-1 rounded">PK</span>
             </div>
             
             <ul className="space-y-3 font-mono text-xs">
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">vehicle_id</span> <span className="text-amber-600">UUID</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">name</span> <span className="text-slate-500">VARCHAR(64)</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">stat_speed</span> <span className="text-slate-500">SMALLINT</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">stat_handling</span> <span className="text-slate-500">SMALLINT</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">stat_accel</span> <span className="text-slate-500">SMALLINT</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">class</span> <span className="text-slate-500">ENUM</span></li>
                <li className="flex justify-between"><span className="text-slate-800 font-bold">unlock_cost</span> <span className="text-slate-500">INT</span></li>
             </ul>
             <div className="mt-6 pt-4 border-t border-white/40 text-xs text-slate-500 font-medium">
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded mr-2 font-bold text-[10px]">1 → n</span>
                PlayerVehicle
             </div>
          </div>

          {/* Race */}
          <div className="glass-panel p-6 shadow-xl rounded-2xl border-white hover:-translate-y-1 transition-transform">
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/40">
                <div className="flex items-center gap-3">
                   <div className="bg-pink-100 p-2 rounded-lg text-pink-600"><PlayCircle size={20} /></div>
                   <h2 className="font-display text-xl font-bold text-slate-800">Race</h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-pink-100 px-2 py-1 rounded">PK</span>
             </div>
             
             <ul className="space-y-3 font-mono text-xs">
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">race_id</span> <span className="text-pink-600">UUID</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold text-teal-600">player_id</span> <span className="text-slate-500">FK</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold text-indigo-600">track_id</span> <span className="text-slate-500">FK</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold text-amber-600">vehicle_id</span> <span className="text-slate-500">FK</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">lap_time_ms</span> <span className="text-slate-500">INT</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">finish_position</span> <span className="text-slate-500">SMALLINT</span></li>
                <li className="flex justify-between"><span className="text-slate-800 font-bold">coins_earned</span> <span className="text-slate-500">INT</span></li>
             </ul>
             <div className="mt-6 pt-4 border-t border-white/40 text-xs text-slate-500 font-medium">
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded mr-2 font-bold text-[10px]">n → 1</span>
                Player, Track, Vehicle
             </div>
          </div>

          {/* LeaderboardEntry */}
          <div className="glass-panel p-6 shadow-xl rounded-2xl border-white hover:-translate-y-1 transition-transform">
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/40">
                <div className="flex items-center gap-3">
                   <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Trophy size={20} /></div>
                   <h2 className="font-display text-xl font-bold text-slate-800">Leaderboard</h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-100 px-2 py-1 rounded">PK</span>
             </div>
             
             <ul className="space-y-3 font-mono text-xs">
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold">entry_id</span> <span className="text-indigo-600">UUID</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold text-teal-600">player_id</span> <span className="text-slate-500">FK</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold text-indigo-600">track_id</span> <span className="text-slate-500">FK</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold ">best_lap_ms</span> <span className="text-slate-500">INT</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold ">season_id</span> <span className="text-slate-500">VARCHAR(16)</span></li>
                <li className="flex justify-between border-b border-black/5 pb-1"><span className="text-slate-800 font-bold text-pink-500">rank</span> <span className="text-slate-500">COMPUTED</span></li>
                <li className="flex justify-between"><span className="text-slate-800 font-bold">updated_at</span> <span className="text-slate-500">TIMESTAMPTZ</span></li>
             </ul>
             <div className="mt-6 pt-4 border-t border-white/40 text-[10px] font-bold text-slate-600 uppercase tracking-wider break-all leading-relaxed">
                UNIQUE(player_id, track_id, season)
             </div>
          </div>

        </div>

        {/* Info Callout */}
        <div className="bg-white/80 p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
           <div className="bg-teal-100 text-teal-600 p-2 rounded-full shrink-0">
              <Clock size={20} />
           </div>
           <p className="text-sm text-slate-700 leading-relaxed">
             <strong>Note:</strong> All tables include <code>created_at TIMESTAMPTZ NOT NULL DEFAULT now()</code> and <code>updated_at</code> triggers. Leaderboard rank is a computed column refreshed by an async worker every 60 seconds, not calculated at query time. Read replicas handle leaderboard reads; primary handles all writes.
           </p>
        </div>

      </div>
    </main>
  );
};
