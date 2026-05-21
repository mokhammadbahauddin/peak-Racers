import { create } from 'zustand';

interface GrandPrixRaceResult {
  trackId: string;
  position: number;
  timeMs: number;
  stars: number;
  points: number;
}

interface AIRacer {
  name: string;
  totalPoints: number;
}

const POINTS_MAP: Record<number, number> = { 1: 15, 2: 12, 3: 10, 4: 8 };
const AI_NAMES = ['Rosie', 'Pepper', 'Mochi'];

interface GrandPrixState {
  isActive: boolean;
  cupId: string;
  difficulty: '50cc' | '100cc' | '150cc';
  currentRaceIndex: number;
  trackIds: string[];
  results: GrandPrixRaceResult[];
  totalPoints: number;
  aiRacers: AIRacer[];

  startGrandPrix: (cupId: string, difficulty: '50cc' | '100cc' | '150cc', trackIds: string[]) => void;
  recordRaceResult: (result: Omit<GrandPrixRaceResult, 'points'>) => void;
  advanceToNextRace: () => boolean;
  getCurrentTrackId: () => string;
  getStandings: () => { position: number; points: number; isPlayer: boolean; name: string }[];
  isComplete: () => boolean;
  reset: () => void;
}

export const useGrandPrixStore = create<GrandPrixState>()((set, get) => ({
  isActive: false,
  cupId: '',
  difficulty: '50cc',
  currentRaceIndex: 0,
  trackIds: [],
  results: [],
  totalPoints: 0,
  aiRacers: AI_NAMES.map(name => ({ name, totalPoints: 0 })),

  startGrandPrix: (cupId, difficulty, trackIds) => {
    set({
      isActive: true,
      cupId,
      difficulty,
      currentRaceIndex: 0,
      trackIds,
      results: [],
      totalPoints: 0,
      aiRacers: AI_NAMES.map(name => ({ name, totalPoints: 0 }))
    });
  },

  recordRaceResult: (result) => {
    const state = get();
    const playerPoints = POINTS_MAP[result.position] || 8;
    const fullResult: GrandPrixRaceResult = { ...result, points: playerPoints };

    // Generate AI positions (positions that player didn't take)
    const allPositions = [1, 2, 3, 4];
    const remainingPositions = allPositions.filter(p => p !== result.position);
    // Shuffle remaining for AI
    for (let i = remainingPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingPositions[i], remainingPositions[j]] = [remainingPositions[j], remainingPositions[i]];
    }

    const updatedAi = state.aiRacers.map((ai, idx) => ({
      ...ai,
      totalPoints: ai.totalPoints + (POINTS_MAP[remainingPositions[idx]] || 8)
    }));

    set({
      results: [...state.results, fullResult],
      totalPoints: state.totalPoints + playerPoints,
      aiRacers: updatedAi
    });
  },

  advanceToNextRace: () => {
    const state = get();
    const nextIndex = state.currentRaceIndex + 1;
    if (nextIndex >= state.trackIds.length) {
      return false; // Cup complete
    }
    set({ currentRaceIndex: nextIndex });
    return true;
  },

  getCurrentTrackId: () => {
    const state = get();
    return state.trackIds[state.currentRaceIndex] || '';
  },

  getStandings: () => {
    const state = get();
    const all = [
      { name: 'You', points: state.totalPoints, isPlayer: true },
      ...state.aiRacers.map(ai => ({ name: ai.name, points: ai.totalPoints, isPlayer: false }))
    ];
    all.sort((a, b) => b.points - a.points);
    return all.map((entry, i) => ({ ...entry, position: i + 1 }));
  },

  isComplete: () => {
    const state = get();
    return state.results.length >= state.trackIds.length;
  },

  reset: () => {
    set({
      isActive: false,
      cupId: '',
      difficulty: '50cc',
      currentRaceIndex: 0,
      trackIds: [],
      results: [],
      totalPoints: 0,
      aiRacers: AI_NAMES.map(name => ({ name, totalPoints: 0 }))
    });
  }
}));
