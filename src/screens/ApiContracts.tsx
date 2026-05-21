import React from 'react';
import { ArrowLeft, Braces, Code, Lock, Server } from 'lucide-react';

const ENDPOINTS = [
  { method: 'POST', path: '/auth/register', desc: 'Create player account with email + password', auth: 'Public', res: '201 · {player_id, access_token, refresh_token}' },
  { method: 'POST', path: '/auth/login', desc: 'Authenticate player, issue JWT pair', auth: 'Public', res: '200 · {access_token, refresh_token, expires_in}' },
  { method: 'POST', path: '/auth/refresh', desc: 'Exchange refresh token for new access token', auth: 'Refresh JWT', res: '200 · {access_token, expires_in}' },
  { method: 'GET', path: '/players/me', desc: "Fetch authenticated player's full profile, currency, active vehicle", auth: 'Bearer JWT', res: '200 · Player object' },
  { method: 'PATCH', path: '/players/me', desc: 'Update display name or avatar', auth: 'Bearer JWT', res: '200 · Updated Player' },
  { method: 'DELETE', path: '/players/me', desc: 'GDPR erasure request — queues deletion job', auth: 'Bearer JWT', res: '202 Accepted · {job_id}' },
  { method: 'GET', path: '/vehicles', desc: 'List all vehicles with stats, unlock cost, player ownership status', auth: 'Bearer JWT', res: '200 · Vehicle[]' },
  { method: 'POST', path: '/vehicles/{id}/unlock', desc: 'Purchase vehicle with coins. Deducts balance atomically.', auth: 'Bearer JWT', res: '200 · {vehicle, new_balance}' },
  { method: 'POST', path: '/vehicles/{id}/upgrade', desc: 'Upgrade specific part (turbo/tires/aero) by one level', auth: 'Bearer JWT', res: '200 · {vehicle, new_balance}' },
  { method: 'GET', path: '/tracks', desc: 'List all tracks with unlock requirements and player progress', auth: 'Bearer JWT', res: '200 · Track[]' },
  { method: 'POST', path: '/races', desc: 'Submit completed race result. Server validates and awards rewards.', auth: 'Bearer JWT', res: '201 · {race, rewards, new_rank}' },
  { method: 'GET', path: '/leaderboard/{track_id}', desc: "Top 100 + caller's rank ±10 rows. Filterable by season, friends.", auth: 'Bearer JWT', res: '200 · {entries[], player_rank}' },
  { method: 'GET', path: '/shop/items', desc: 'All purchasable cosmetics with rarity, price, player ownership', auth: 'Bearer JWT', res: '200 · ShopItem[]' },
  { method: 'POST', path: '/shop/purchase', desc: 'Purchase cosmetic item. Validates currency type and balance atomically.', auth: 'Bearer JWT', res: '200 · {item, new_balance}' },
];

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'POST': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'PATCH': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'DELETE': return 'bg-rose-100 text-rose-700 border-rose-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const ApiContracts = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[30%] left-[5%] w-[40vw] h-[40vw] bg-cyan-200/40 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '9s' }}></div>
        <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] bg-violet-200/40 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      <header className="w-full max-w-7xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">API Contracts</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-7xl px-6 pb-24 z-20 flex flex-col gap-8">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Braces className="text-primary w-10 h-10" />
             API Contracts (v2)
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Defined before frontend development begins. Frontend mocks against this spec. 
            All errors follow RFC 7807 Problem Details. Base URL: <code className="bg-white/50 px-2 py-1 rounded-md text-primary font-bold border border-white">https://api.pastelpeak.io/v2</code>
          </p>
        </div>

        <div className="glass-panel p-2 shadow-sm border border-white rounded-[2rem] overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                 <tr className="bg-slate-50/80 border-b border-slate-200">
                   <th className="p-4 font-display font-bold text-slate-700 uppercase tracking-wider text-sm sticky top-0 bg-slate-50">Method</th>
                   <th className="p-4 font-display font-bold text-slate-700 uppercase tracking-wider text-sm sticky top-0 bg-slate-50">Path</th>
                   <th className="p-4 font-display font-bold text-slate-700 uppercase tracking-wider text-sm sticky top-0 bg-slate-50">Description</th>
                   <th className="p-4 font-display font-bold text-slate-700 uppercase tracking-wider text-sm sticky top-0 bg-slate-50">Auth</th>
                   <th className="p-4 font-display font-bold text-slate-700 uppercase tracking-wider text-sm sticky top-0 bg-slate-50">Key Response</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {ENDPOINTS.map((ep, idx) => (
                   <tr key={idx} className="hover:bg-white/40 transition-colors group">
                     <td className="p-4">
                        <span className={`font-mono text-xs font-black tracking-wider px-2 py-1 rounded-md border ${getMethodColor(ep.method)}`}>
                           {ep.method}
                        </span>
                     </td>
                     <td className="p-4">
                        <span className="font-mono text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{ep.path}</span>
                     </td>
                     <td className="p-4">
                        <span className="text-sm text-slate-600 font-medium">{ep.desc}</span>
                     </td>
                     <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                           {ep.auth !== 'Public' ? <Lock size={12} className="text-amber-500" /> : <Server size={12} className="text-emerald-500" />}
                           {ep.auth}
                        </div>
                     </td>
                     <td className="p-4">
                        <code className="text-xs bg-slate-100/50 text-slate-700 px-2 py-1.5 rounded-md border border-slate-200/50 shadow-sm font-mono whitespace-nowrap">
                           {ep.res}
                        </code>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className="glass-panel p-6 shadow-sm border border-white rounded-[1.5rem] bg-indigo-50/50 flex flex-col md:flex-row gap-4 items-center">
           <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Code className="text-indigo-600" size={24} />
           </div>
           <p className="text-sm text-indigo-900 font-medium leading-relaxed">
             <strong>Implementation Note:</strong> All endpoints return <code>Content-Type: application/json</code>. 
             Error responses include <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, 
             and <code>correlation_id</code> fields per RFC 7807. Rate limiting: 100 req/min per player_id on authenticated endpoints. 
             Race submission endpoint is idempotent via client-generated <code>race_id</code> UUID.
           </p>
        </div>

      </div>
    </main>
  );
};
