import React, { useState } from 'react';
import { Landing } from './screens/Landing';
import { Worlds } from './screens/Worlds';
import { Gameplay } from './screens/Gameplay';
import { Garage } from './screens/Garage';
import { SettingsScreen } from './screens/Settings';
import { Victory } from './screens/Victory';
import { Leaderboard } from './screens/Leaderboard';
import { Shop } from './screens/Shop';
import { CharacterSelection } from './screens/CharacterSelection';
import { Loading } from './screens/Loading';
import { HowToPlay } from './screens/HowToPlay';
import { GrandPrix } from './screens/GrandPrix';
import { AuthScreen } from './screens/Auth';

export default function App() {
  const [currentPath, setCurrentPath] = useState('landing');

  const isGameplay = currentPath === 'gameplay';

  return (
    <div className="min-h-screen relative flex flex-col font-body-md text-slate-800 selection:bg-pink-200">
      {/* Background Ambience Consistent across all screens */}
      {(!isGameplay && currentPath !== 'loading') && (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-900 dream-gradient">
           {/* Abstract Animated Glass Blobs for additional ambient color */}
           <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-pink-400 rounded-full mix-blend-overlay blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '8s' }}></div>
           <div className="absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-cyan-400 rounded-full mix-blend-overlay blur-[120px] opacity-60 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
           <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-amber-400 rounded-full mix-blend-overlay blur-[100px] opacity-60 animate-pulse" style={{ animationDuration: '10s' }}></div>
           
           {/* Light glass overlay to ensure legibility of foreground */}
           <div className="absolute inset-0 bg-white/30 backdrop-blur-[4px]"></div>
        </div>
      )}

      {/* Main Content Router */}
      {currentPath === 'landing' && <Landing onNavigate={setCurrentPath} />}
      {currentPath === 'character-selection' && <CharacterSelection onNavigate={setCurrentPath} />}
      {currentPath === 'worlds' && <Worlds onNavigate={setCurrentPath} />}
      {currentPath === 'loading' && <Loading onComplete={() => setCurrentPath('gameplay')} />}
      {currentPath === 'gameplay' && <Gameplay onNavigate={setCurrentPath} />}
      {currentPath === 'garage' && <Garage onNavigate={setCurrentPath} />}
      {currentPath === 'settings' && <SettingsScreen onBack={() => setCurrentPath('landing')} />}
      {currentPath === 'victory' && <Victory onNavigate={setCurrentPath} />}
      {currentPath === 'leaderboard' && <Leaderboard onNavigate={setCurrentPath} />}
      {currentPath === 'shop' && <Shop onNavigate={setCurrentPath} />}
      {currentPath === 'grand-prix' && <GrandPrix onNavigate={setCurrentPath} />}
      {currentPath === 'howtoplay' && <HowToPlay onNavigate={setCurrentPath} />}
      {currentPath === 'auth' && <AuthScreen onNavigate={setCurrentPath} />}
    </div>
  );
}
