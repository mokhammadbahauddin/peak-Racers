import { Sparkles, LayoutGrid, ShoppingBag, Settings, UserCircle, Play } from 'lucide-react';
import React from 'react';

export const Navbar = ({ 
  currentPath, 
  onNavigate 
}: { 
  currentPath: string;
  onNavigate: (path: string) => void;
}) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-container-max rounded-full border border-white/20 bg-white/50 dark:bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(178,226,242,0.2)] z-50">
      <div className="flex justify-between items-center px-8 py-3">
        <div 
          onClick={() => onNavigate('landing')}
          className="cursor-pointer flex items-center font-display-lg text-title-md md:text-headline-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate pr-4"
        >
          <Sparkles className="text-primary mr-2" size={24} />
          Pastel Peak Racers
        </div>
        
        <div className="hidden md:flex gap-4 items-center overflow-x-auto hide-scrollbar max-w-2xl px-2">
          {[
            { id: 'worlds', label: 'Worlds' },
            { id: 'howtoplay', label: 'How to Play' },
            { id: 'discovery', label: 'Discovery' },
            { id: 'personas', label: 'Personas' },
            { id: 'shop', label: 'Shop' },
            { id: 'lifecycle', label: 'Lifecycle' },
            { id: 'design-decisions', label: 'System' },
            { id: 'data-model', label: 'Data' },
            { id: 'ux-states', label: 'UX States' },
            { id: 'scope', label: 'Scope' },
            { id: 'requirements', label: 'Reqs' },
            { id: 'nfr', label: 'NFRs' },
            { id: 'api', label: 'API' },
            { id: 'risks', label: 'Risks' },
            { id: 'metrics', label: 'Metrics' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'questions', label: 'Questions' },
            { id: 'truth', label: 'Dev Truth' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`whitespace-nowrap font-title-md transition-all duration-300 px-3 py-1 rounded-lg ${currentPath === item.id ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant font-medium hover:bg-white/40 hover:scale-105'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('gameplay')}
            className="glass-button px-6 py-2 rounded-full flex items-center gap-2 text-primary font-title-md hover:scale-105 active:scale-95 transition-all"
          >
            Play Now
          </button>
          <button className="text-primary hover:bg-white/40 transition-all duration-300 p-2 rounded-full hidden sm:flex">
            <UserCircle size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="w-full py-xl bg-surface-container-lowest border-t border-white/10 mt-auto z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-center px-md max-w-container-max mx-auto gap-md">
        <div className="font-display-lg text-title-md font-bold text-primary flex items-center gap-2">
          Pastel Peak Racers
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Support</a>
        </nav>
        <div className="font-body-md text-secondary text-center md:text-left">
          © {new Date().getFullYear()} Pastel Peak Racers. Smooth drifting awaits.
        </div>
      </div>
    </footer>
  );
};
