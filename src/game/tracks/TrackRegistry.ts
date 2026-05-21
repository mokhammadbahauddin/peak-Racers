import { TrackDefinition } from './TrackData';

export const TRACK_REGISTRY: Record<string, TrackDefinition[]> = {
  // ═══════════════════════════════════════════════════════════
  // WORLD 1 — Dawn Archipelago (Mushroom Cup)
  // Warm sunrise palette · Soft sands · Calm turquoise waters
  // ═══════════════════════════════════════════════════════════
  'soft_sands': [
    {
      id: "sands_1", name: "Soft Sands Oval",
      difficulty: 'easy', lengthM: 1200, parTimeMs: 105000, laps: 3, cupId: 'mushroom', starRequirement: 0,
      points: [[0, 0, 0], [0, 0, 150], [-100, 10, 300], [-300, 25, 400], [-500, 10, 300], [-400, -5, 100], [-100, -10, -100], [100, 0, -200], [200, 15, -100], [100, 5, 0]],
      roadWidth: 28,
      environment: { skyColor: 0xffdac1, fogColor: 0xffdac1, fogNear: 40, fogFar: 350 },
      colors: { base: '#ffd8a8', stripes: '#fff0d4', rubble1: '#eec79f', rubble2: '#ffc078' },
      props: { treeProbability: 0.1, barrierProbability: 0.2 }
    },
    {
      id: "sands_2", name: "Minty Meadows Circuit",
      difficulty: 'easy', lengthM: 1450, parTimeMs: 120000, laps: 3, cupId: 'mushroom', starRequirement: 0,
      points: [[0, 0, 0], [50, 5, 150], [200, -5, 200], [300, 0, 100], [250, 10, -100], [100, 5, -200], [-50, -5, -250], [-150, 0, -100], [-100, 5, 0]],
      roadWidth: 26,
      environment: { skyColor: 0xffebc2, fogColor: 0xffebc2, fogNear: 30, fogFar: 300 },
      colors: { base: '#ffe066', stripes: '#fff4e6', rubble1: '#8ce99a', rubble2: '#ffb347' },
      props: { treeProbability: 0.5, barrierProbability: 0.3 }
    },
    {
      id: "sands_3", name: "Peach Peaks Hairpin",
      difficulty: 'medium', lengthM: 1800, parTimeMs: 150000, laps: 3, cupId: 'mushroom', starRequirement: 0,
      points: [[0, 0, 0], [0, 20, 200], [0, -10, 400], [200, -20, 500], [400, 15, 300], [300, 30, 100], [100, -5, -100], [-100, -15, -200], [-50, 0, 0]],
      roadWidth: 20,
      environment: { skyColor: 0xffd8a8, fogColor: 0xffd8a8, fogNear: 20, fogFar: 250 },
      colors: { base: '#ffa8a5', stripes: '#ffffff', rubble1: '#e5989b', rubble2: '#ffb4a2' },
      props: { treeProbability: 0.05, barrierProbability: 0.6 }
    },
    {
      id: "sands_4", name: "Island Grand Circuit",
      difficulty: 'medium', lengthM: 2200, parTimeMs: 190000, laps: 3, cupId: 'mushroom', starRequirement: 2,
      points: [[0, 0, 0], [80, 5, 120], [200, 15, 250], [100, 25, 400], [-100, 10, 500], [-300, 5, 400], [-400, 20, 200], [-350, 0, 0], [-200, -10, -150], [-50, 5, -250], [100, 15, -200], [180, 0, -50]],
      roadWidth: 24,
      environment: { skyColor: 0xffe4c9, fogColor: 0xffe4c9, fogNear: 30, fogFar: 320 },
      colors: { base: '#ffc8a2', stripes: '#fff0d4', rubble1: '#ffb088', rubble2: '#ffd4b8' },
      props: { treeProbability: 0.3, barrierProbability: 0.4 }
    }
  ],

  // ═══════════════════════════════════════════════════════════
  // WORLD 2 — Sugar Snow Summit (Star Cup)
  // Cool blue palette · Snow & ice · Mountain passes
  // ═══════════════════════════════════════════════════════════
  'sugar_snow': [
    {
      id: "snow_1", name: "Sugar Snow Summit",
      difficulty: 'easy', lengthM: 1300, parTimeMs: 110000, laps: 3, cupId: 'star', starRequirement: 4,
      points: [[0, 0, 0], [50, 10, 180], [180, 30, 300], [100, 40, 450], [-50, 25, 400], [-180, 15, 250], [-100, 5, 100], [-30, 0, 0]],
      roadWidth: 26,
      environment: { skyColor: 0xd0e8ff, fogColor: 0xd0e8ff, fogNear: 30, fogFar: 300 },
      colors: { base: '#e3f2fd', stripes: '#ffffff', rubble1: '#bbdefb', rubble2: '#90caf9' },
      props: { treeProbability: 0.3, barrierProbability: 0.2 }
    },
    {
      id: "snow_2", name: "Frosty Flyover",
      difficulty: 'medium', lengthM: 1500, parTimeMs: 130000, laps: 3, cupId: 'star', starRequirement: 4,
      points: [[0, 0, 0], [0, 30, 200], [150, 50, 350], [300, 20, 250], [250, 40, 50], [100, 60, -100], [-50, 30, -200], [-150, 10, -50]],
      roadWidth: 22,
      environment: { skyColor: 0xc5e1f5, fogColor: 0xc5e1f5, fogNear: 25, fogFar: 280 },
      colors: { base: '#e1f5fe', stripes: '#ffffff', rubble1: '#b3e5fc', rubble2: '#81d4fa' },
      props: { treeProbability: 0.2, barrierProbability: 0.4 }
    },
    {
      id: "snow_3", name: "Blizzard Chicane",
      difficulty: 'medium', lengthM: 1700, parTimeMs: 145000, laps: 3, cupId: 'star', starRequirement: 6,
      points: [[0, 0, 0], [80, 5, 100], [0, 15, 200], [-80, 5, 300], [0, 25, 400], [120, 10, 350], [80, 35, 200], [-40, 20, 100], [-120, 10, 50]],
      roadWidth: 20,
      environment: { skyColor: 0xb8d8ea, fogColor: 0xb8d8ea, fogNear: 15, fogFar: 220 },
      colors: { base: '#cce5ff', stripes: '#ffffff', rubble1: '#a8d8ea', rubble2: '#96c8e8' },
      props: { treeProbability: 0.15, barrierProbability: 0.6 }
    },
    {
      id: "snow_4", name: "Summit Grand Prix",
      difficulty: 'hard', lengthM: 2100, parTimeMs: 180000, laps: 3, cupId: 'star', starRequirement: 6,
      points: [[0, 0, 0], [100, 20, 150], [250, 50, 250], [200, 70, 400], [0, 80, 500], [-200, 60, 400], [-300, 40, 200], [-200, 20, 0], [-100, 30, -150], [50, 10, -100]],
      roadWidth: 22,
      environment: { skyColor: 0xadd8e6, fogColor: 0xadd8e6, fogNear: 20, fogFar: 260 },
      colors: { base: '#dceefb', stripes: '#ffffff', rubble1: '#a3d5f5', rubble2: '#7ec8e3' },
      props: { treeProbability: 0.25, barrierProbability: 0.5 }
    }
  ],

  // ═══════════════════════════════════════════════════════════
  // WORLD 3 — Peach Peaks (Cloud Cup)
  // Warm pink/purple palette · Mountain peaks · Cherry blossoms
  // ═══════════════════════════════════════════════════════════
  'peach_peaks': [
    {
      id: "peach_1", name: "Sunset Circuit",
      difficulty: 'medium', lengthM: 1400, parTimeMs: 120000, laps: 3, cupId: 'cloud', starRequirement: 8,
      points: [[0, 0, 0], [150, 20, 100], [300, 50, -50], [100, 20, -200], [-100, -10, -100], [-150, 0, 50]],
      roadWidth: 26,
      environment: { skyColor: 0xffc9c9, fogColor: 0xffc9c9, fogNear: 20, fogFar: 250 },
      colors: { base: '#ffb8b8', stripes: '#ffffff', rubble1: '#ffa8a5', rubble2: '#ffefef' },
      props: { treeProbability: 0.3, barrierProbability: 0.5 }
    },
    {
      id: "peach_2", name: "Cherry Overpass",
      difficulty: 'hard', lengthM: 1600, parTimeMs: 140000, laps: 3, cupId: 'cloud', starRequirement: 8,
      points: [[0, 0, 0], [-200, 40, 0], [-200, 40, -200], [0, -10, -200], [200, 10, -200], [200, 20, 0]],
      roadWidth: 22,
      environment: { skyColor: 0xeebefa, fogColor: 0xeebefa, fogNear: 30, fogFar: 300 },
      colors: { base: '#e599f7', stripes: '#ffffff', rubble1: '#f8f0fc', rubble2: '#da77f2' },
      props: { treeProbability: 0.5, barrierProbability: 0.7 }
    },
    {
      id: "peach_3", name: "Volcano Rim",
      difficulty: 'hard', lengthM: 1900, parTimeMs: 165000, laps: 3, cupId: 'cloud', starRequirement: 10,
      points: [[0, 0, 0], [100, 60, 200], [200, 80, 0], [100, 60, -200], [-100, 60, -200], [-200, 80, 0], [-100, 60, 200]],
      roadWidth: 18,
      environment: { skyColor: 0xffb3c6, fogColor: 0xffb3c6, fogNear: 15, fogFar: 200 },
      colors: { base: '#fe8a71', stripes: '#ffffff', rubble1: '#ffd98e', rubble2: '#ff6262' },
      props: { treeProbability: 0.1, barrierProbability: 0.8 }
    },
    {
      id: "peach_4", name: "Peach Grand Prix",
      difficulty: 'hard', lengthM: 2300, parTimeMs: 200000, laps: 3, cupId: 'cloud', starRequirement: 10,
      points: [[0, 0, 0], [120, 30, 150], [250, 60, 300], [150, 40, 450], [-50, 20, 500], [-200, 50, 350], [-300, 70, 150], [-250, 30, -50], [-100, 10, -150], [50, 20, -100]],
      roadWidth: 20,
      environment: { skyColor: 0xffc0cb, fogColor: 0xffc0cb, fogNear: 20, fogFar: 240 },
      colors: { base: '#ffb6c1', stripes: '#ffffff', rubble1: '#ff9eb5', rubble2: '#ffd6e0' },
      props: { treeProbability: 0.35, barrierProbability: 0.6 }
    }
  ],

  // ═══════════════════════════════════════════════════════════
  // WORLD 4 — Pastel Peak (Peak Cup)
  // Dream/crystal palette · Magical · Final world
  // ═══════════════════════════════════════════════════════════
  'pastel_peak': [
    {
      id: "peak_1", name: "Dream Archipelago X",
      difficulty: 'hard', lengthM: 1800, parTimeMs: 155000, laps: 3, cupId: 'peak', starRequirement: 14,
      points: [[0, 0, 0], [150, 30, 200], [300, 10, 100], [350, 40, -100], [200, 60, -250], [0, 30, -300], [-150, 50, -150], [-200, 20, 50]],
      roadWidth: 22,
      environment: { skyColor: 0xe8d0ff, fogColor: 0xe8d0ff, fogNear: 25, fogFar: 280 },
      colors: { base: '#d8b4fe', stripes: '#ffffff', rubble1: '#c084fc', rubble2: '#e9d5ff' },
      props: { treeProbability: 0.4, barrierProbability: 0.5 }
    },
    {
      id: "peak_2", name: "Storm Peak",
      difficulty: 'expert', lengthM: 2000, parTimeMs: 175000, laps: 3, cupId: 'peak', starRequirement: 14,
      points: [[0, 0, 0], [0, 50, 200], [150, 80, 350], [50, 30, 500], [-150, 70, 450], [-250, 100, 250], [-150, 50, 50], [-50, 80, -100], [100, 40, -50]],
      roadWidth: 18,
      environment: { skyColor: 0xdbb4f0, fogColor: 0xdbb4f0, fogNear: 15, fogFar: 220 },
      colors: { base: '#c4b5fd', stripes: '#ffffff', rubble1: '#a78bfa', rubble2: '#ddd6fe' },
      props: { treeProbability: 0.2, barrierProbability: 0.7 }
    },
    {
      id: "peak_3", name: "Crystal Circuit",
      difficulty: 'expert', lengthM: 2200, parTimeMs: 190000, laps: 3, cupId: 'peak', starRequirement: 18,
      points: [[0, 0, 0], [80, 20, 100], [0, 40, 200], [-80, 20, 300], [0, 60, 400], [120, 40, 350], [200, 80, 200], [120, 40, 50], [0, 60, -50], [-120, 30, 0]],
      roadWidth: 16,
      environment: { skyColor: 0xf0c6ff, fogColor: 0xf0c6ff, fogNear: 15, fogFar: 200 },
      colors: { base: '#e0aaff', stripes: '#ffffff', rubble1: '#c77dff', rubble2: '#f0c6ff' },
      props: { treeProbability: 0.15, barrierProbability: 0.8 }
    },
    {
      id: "peak_4", name: "Pastel Peak Grand Prix",
      difficulty: 'expert', lengthM: 2500, parTimeMs: 220000, laps: 3, cupId: 'peak', starRequirement: 18,
      points: [[0, 0, 0], [100, 30, 120], [250, 60, 250], [200, 90, 400], [50, 70, 500], [-150, 100, 450], [-300, 80, 300], [-350, 50, 100], [-250, 70, -50], [-100, 40, -150], [50, 60, -200], [150, 30, -100]],
      roadWidth: 18,
      environment: { skyColor: 0xe4b8ff, fogColor: 0xe4b8ff, fogNear: 15, fogFar: 240 },
      colors: { base: '#d8a8ff', stripes: '#ffffff', rubble1: '#be7cff', rubble2: '#ecd0ff' },
      props: { treeProbability: 0.3, barrierProbability: 0.7 }
    }
  ]
};

// Cup metadata for Grand Prix mode
export const CUP_DATA = {
  mushroom: { name: 'Mushroom Cup', emoji: '🍄', worldId: 'soft_sands', starReq: 0, color: '#ffd8a8' },
  star:     { name: 'Star Cup',     emoji: '⭐', worldId: 'sugar_snow', starReq: 4, color: '#d0e8ff' },
  cloud:    { name: 'Cloud Cup',    emoji: '☁️', worldId: 'peach_peaks', starReq: 8, color: '#ffc9c9' },
  peak:     { name: 'Peak Cup',     emoji: '🏔️', worldId: 'pastel_peak', starReq: 14, color: '#e8d0ff' }
} as const;

// Helper to get all tracks for a cup
export function getTracksForCup(cupId: string): TrackDefinition[] {
  const cup = CUP_DATA[cupId as keyof typeof CUP_DATA];
  if (!cup) return [];
  return TRACK_REGISTRY[cup.worldId] || [];
}

// Helper to get world name for display
export const WORLD_NAMES: Record<string, string> = {
  'soft_sands': 'Dawn Archipelago',
  'sugar_snow': 'Sugar Snow Summit',
  'peach_peaks': 'Peach Peaks',
  'pastel_peak': 'Pastel Peak'
};
