import { create } from 'zustand';
import { GameState } from '../Engine';

interface HudState {
  speed: number;
  lap: number;
  rank: number;
  maxSpeed: number;
  gear: number;
  rpm: number;
  showRedline: boolean;
  gameState: GameState;
  timer: number;
  boost: number;
  currentItem: 'none' | 'mushroom' | 'star' | 'shield' | 'rocket';
  playerT: number;
  aiTs: number[];
  setHudData: (data: Partial<Omit<HudState, 'setHudData'>>) => void;
}

export const useHudStore = create<HudState>()((set) => ({
  speed: 0,
  lap: 1,
  rank: 1,
  maxSpeed: 120,
  gear: 1,
  rpm: 0,
  showRedline: false,
  gameState: 'intro',
  timer: 3.0,
  boost: 100,
  currentItem: 'none',
  playerT: 0,
  aiTs: [],
  setHudData: (data) => set((state) => ({ ...state, ...data })),
}));
