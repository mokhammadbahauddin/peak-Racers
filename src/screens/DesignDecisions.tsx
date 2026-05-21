import React from 'react';
import { ArrowLeft, Database, Server, Cloud, FileCode2, ShieldCheck, PaintRoller } from 'lucide-react';

export const DesignDecisions = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[30%] left-[20%] w-[35vw] h-[35vw] bg-pink-200/50 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute bottom-[10%] right-[30%] w-[45vw] h-[45vw] bg-cyan-200/50 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '11s', animationDelay: '1s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">System Design</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-5xl px-6 pb-24 z-20 flex flex-col gap-10">
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-primary font-black mb-4 uppercase">Design Decisions Before Coding</h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Layer 1 decisions constrain everything below them. System design and data model must be stable before UX design begins.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Layer 1 */}
          <div className="relative">
            <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center text-pink-600 font-black shadow-md justify-center text-lg md:text-2xl border-4 border-white z-10">
              1
            </div>
            <div className="glass-panel p-6 shadow-xl rounded-[2rem] border-white ml-2 md:ml-6 relative overflow-hidden bg-white/60">
              <div className="absolute top-0 left-0 w-2 h-full bg-pink-400"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-pink-500 mb-6 pl-4">Layer 1: Core Foundation</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                 {/* Card 1 */}
                 <div className="flex-1 bg-white/80 rounded-2xl p-6 shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform">
                    <span className="absolute -top-3 -right-2 bg-pink-500 text-white text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full shadow-sm">Most Expensive to Change</span>
                    <div className="flex items-center gap-3 mb-3 text-slate-800">
                       <Database className="text-pink-500" />
                       <h3 className="font-display font-bold text-xl">Data Model & Schema</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Finalized before any API or UX work. Core entities: Player, Vehicle, Track, Race, Leaderboard, Upgrade, Skin. All cardinalities resolved. Indexes designed for leaderboard query patterns. Soft-delete + audit timestamps on all entities.
                    </p>
                 </div>
                 {/* Card 2 */}
                 <div className="flex-1 bg-white/80 rounded-2xl p-6 shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-3 mb-3 text-slate-800">
                       <Server className="text-pink-500" />
                       <h3 className="font-display font-bold text-xl">System Architecture</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <strong>Decision: Monolith.</strong> Three.js core handles synchronous gameplay. Async background workers handle leaderboard recalculations and reward distribution. No microservices in v2 — the overhead is unjustified at this scale.
                    </p>
                 </div>
              </div>
            </div>
          </div>

          {/* Layer 2 */}
          <div className="relative mt-4">
            <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-amber-100 rounded-full flex items-center text-amber-600 font-black shadow-md justify-center text-lg md:text-2xl border-4 border-white z-10">
              2
            </div>
            <div className="glass-panel p-6 shadow-xl rounded-[2rem] border-white ml-2 md:ml-6 relative overflow-hidden bg-white/60">
              <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-6 pl-4">Layer 2: Infrastructure & APIs</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                 {/* Card 1 */}
                 <div className="flex-1 bg-white/80 rounded-2xl p-6 shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-3 mb-3 text-slate-800">
                       <Cloud className="text-amber-500" />
                       <h3 className="font-display font-bold text-xl">Infrastructure & Stack</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Cloud: AWS (us-east-1 primary, eu-west-1 replica for GDPR). Runtime: containerized Node.js on ECS Fargate. CI/CD: GitHub Actions on day 1. CDN: CloudFront for all static game assets. No manual deploys — ever.
                    </p>
                 </div>
                 {/* Card 2 */}
                 <div className="flex-1 bg-white/80 rounded-2xl p-6 shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform">
                    <span className="absolute -top-3 -right-2 bg-amber-500 text-white text-[10px] uppercase font-black tracking-wider px-3 py-1 rounded-full shadow-sm">ADR-002 Written</span>
                    <div className="flex items-center gap-3 mb-3 text-slate-800">
                       <FileCode2 className="text-amber-500" />
                       <h3 className="font-display font-bold text-xl">API Contracts</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      OpenAPI 3.1 spec authored before frontend development. Frontend mocks against spec immediately. Versioned via URL prefix <code>/v2/</code>. All error responses follow RFC 7807 (Problem Details).
                    </p>
                 </div>
              </div>
            </div>
          </div>

          {/* Layer 3 */}
          <div className="relative mt-4">
            <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-cyan-100 rounded-full flex items-center text-cyan-600 font-black shadow-md justify-center text-lg md:text-2xl border-4 border-white z-10">
              3
            </div>
            <div className="glass-panel p-6 shadow-xl rounded-[2rem] border-white ml-2 md:ml-6 relative overflow-hidden bg-white/60">
              <div className="absolute top-0 left-0 w-2 h-full bg-cyan-400"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-500 mb-6 pl-4">Layer 3: Security & Experience</h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                 {/* Card 1 */}
                 <div className="flex-1 bg-white/80 rounded-2xl p-6 shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-3 mb-3 text-slate-800">
                       <ShieldCheck className="text-cyan-500" />
                       <h3 className="font-display font-bold text-xl">Security Model</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Auth: JWT (15min access token + 30d refresh). AuthZ: RBAC (Player / Admin). Secrets: AWS Secrets Manager — zero hardcoded keys. Encryption: TLS 1.3 in transit, AES-256 at rest for PII. GDPR: right-to-erasure endpoint implemented before launch.
                    </p>
                 </div>
                 {/* Card 2 */}
                 <div className="flex-1 bg-white/80 rounded-2xl p-6 shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-3 mb-3 text-slate-800">
                       <PaintRoller className="text-cyan-500" />
                       <h3 className="font-display font-bold text-xl">UX Flows & States</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Every screen accounts for 5 states: Happy Path, Loading/Skeleton, Empty State (no cars owned), Error (connection lost), and Edge Case (10,000 max leaderboard entries, network timeout mid-race). No screen may ship without all 5 states.
                    </p>
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
};
