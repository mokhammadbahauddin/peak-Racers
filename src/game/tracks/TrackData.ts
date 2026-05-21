export interface TrackDefinition {
  id: string;
  name: string;
  points: [number, number, number][];
  roadWidth: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  lengthM: number;
  parTimeMs: number;
  laps: number;
  cupId: 'mushroom' | 'star' | 'cloud' | 'peak';
  starRequirement: number;
  environment: {
    skyColor: number;
    fogColor: number;
    fogNear: number;
    fogFar: number;
  };
  colors: {
    base: string;
    stripes: string;
    rubble1: string;
    rubble2: string;
  };
  props: {
    treeProbability: number;
    barrierProbability: number;
  };
}
