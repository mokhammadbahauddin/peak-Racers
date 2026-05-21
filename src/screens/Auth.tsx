import React, { useState } from 'react';
import { ArrowLeft, User as UserIcon, Lock, Mail, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GameDataManager } from '../game/GameData';
import { auth } from '../firebase';

export const AuthScreen = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const { user, signIn, signUp, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      // Trigger cloud initialization
      if (auth.currentUser) {
         await GameDataManager.getInstance().initializeFromCloud(auth.currentUser.uid);
      }
      onNavigate('landing');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center relative z-10 p-6 text-slate-800">
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={() => onNavigate('landing')} 
          className="glass-button flex items-center gap-2 px-6 py-3 rounded-full text-slate-700 font-bold shadow-sm hover:scale-105 transition-transform"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="glass-panel w-full max-w-md p-8 shadow-xl rounded-3xl flex flex-col border border-white">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <UserIcon size={32} />
          </div>
          <h1 className="font-display text-2xl font-black uppercase text-slate-800 tracking-wide text-center">
            {user ? 'Player Profile' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h1>
          {user && <p className="text-sm font-medium text-slate-500 mt-2">{user.email}</p>}
        </div>

        {user ? (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2 shadow-inner">
               <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                 <span>Status:</span>
                 <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded shadow-sm">Online</span>
               </div>
               <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                 <span>Sync:</span>
                 <span className="text-primary bg-primary/10 px-2 py-0.5 rounded shadow-sm">Active</span>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full btn-primary bg-rose-500 hover:bg-rose-600 py-4 rounded-xl font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-white"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-rose-50 text-rose-600 text-sm font-medium p-3 rounded-lg border border-rose-200">
                {error}
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner hover:bg-white"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-inner hover:bg-white"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : (isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>)}
            </button>
            
            <div className="flex justify-center mt-2">
               <button 
                 type="button" 
                 onClick={() => { setIsLogin(!isLogin); setError(''); }}
                 className="text-sm font-bold text-slate-500 hover:text-primary transition-colors underline decoration-slate-300 underline-offset-4"
               >
                 {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
               </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};
