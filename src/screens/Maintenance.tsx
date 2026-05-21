import React from 'react';
import { ArrowLeft, Wrench, Activity, ShieldAlert, RefreshCw, BookOpen } from 'lucide-react';

const MAINT_DATA = [
  {
    icon: <Activity size={24} className="text-blue-500" />,
    title: 'Observability Stack',
    bg: 'bg-blue-50 border-blue-200',
    items: [
      'CloudWatch Logs — structured JSON, all services',
      'AWS X-Ray — distributed tracing, correlation IDs',
      'CloudWatch Metrics — custom game-specific dashboards',
      'PostHog — player behavior analytics',
      'Sentry — frontend error tracking with source maps'
    ]
  },
  {
    icon: <ShieldAlert size={24} className="text-rose-500" />,
    title: 'Incident Response',
    bg: 'bg-rose-50 border-rose-200',
    items: [
      'P0 (game unplayable): 15min response SLA, PagerDuty wake',
      'P1 (feature broken): 2h response SLA, Slack alert',
      'P2 (degraded): next business day, ticketing system',
      'Blameless postmortem within 48h of all P0/P1 incidents',
      'Written runbook for each known failure mode'
    ]
  },
  {
    icon: <RefreshCw size={24} className="text-emerald-500" />,
    title: 'Iteration Cadence',
    bg: 'bg-emerald-50 border-emerald-200',
    items: [
      '2-week sprints continue post-launch',
      'Bug triage every Monday: severity classification',
      'New track / skin drop: 6-week cadence (keeps shop fresh)',
      'Dependency audit: quarterly (security patches)',
      'Performance regression testing: every deploy'
    ]
  },
  {
    icon: <BookOpen size={24} className="text-purple-500" />,
    title: 'Documentation',
    bg: 'bg-purple-50 border-purple-200',
    items: [
      'Architecture Decision Records (ADRs) finalized within 2 weeks of launch',
      'API docs auto-generated from OpenAPI spec (Redoc)',
      'On-call playbook written before go-live'
    ]
  }
];

export const Maintenance = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <main className="h-screen w-full flex flex-col items-center relative z-10 overflow-y-auto text-slate-800 bg-surface">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dream-gradient">
        <div className="absolute top-[25%] right-[25%] w-[45vw] h-[45vw] bg-indigo-200/30 rounded-full mix-blend-multiply blur-[120px] animate-pulse" style={{ animationDuration: '9s' }}></div>
        <div className="absolute bottom-[10%] left-[20%] w-[35vw] h-[35vw] bg-fuchsia-200/30 rounded-full mix-blend-multiply blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1.5s' }}></div>
      </div>

      <header className="w-full max-w-6xl mt-12 mb-8 px-6 flex justify-between items-center z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-primary font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>
        <span className="font-display text-2xl font-extrabold text-primary tracking-widest uppercase">Maintenance</span>
        <div className="w-[160px]"></div> {/* Spacer */}
      </header>

      <div className="w-full max-w-6xl px-6 pb-24 z-20 flex flex-col gap-10">
        
        <div className="glass-panel text-center p-10 shadow-lg border-white rounded-[2rem]">
          <h1 className="font-display text-4xl text-slate-800 font-black mb-4 uppercase flex justify-center items-center gap-4">
             <Wrench className="text-primary w-10 h-10" />
             Post-Launch Maintenance 
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Post-launch is where long-term quality lives. Most teams skip this until there's an incident. Document the architecture while it's fresh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {MAINT_DATA.map((section, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-3xl shadow-sm border border-white hover:-translate-y-2 transition-transform duration-300">
                 <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${section.bg} bg-opacity-50`}>
                       {section.icon}
                    </div>
                    <h2 className="font-display text-2xl font-bold text-slate-800">{section.title}</h2>
                 </div>
                 
                 <ul className="flex flex-col gap-3">
                    {section.items.map((item, i) => (
                       <li key={i} className="flex items-start gap-3 bg-white/50 p-3 rounded-lg border border-slate-100 shadow-sm text-sm text-slate-700 font-medium">
                          <span className="text-primary mt-1">•</span>
                          <span className="leading-relaxed">{item}</span>
                       </li>
                    ))}
                 </ul>
              </div>
           ))}
        </div>

      </div>
    </main>
  );
};
