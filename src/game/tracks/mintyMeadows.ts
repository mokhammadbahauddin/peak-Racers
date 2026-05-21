import { TrackDefinition } from './TrackData';

export const mintyMeadowsTrack: TrackDefinition = {
  id: "minty_meadows",
  name: "Minty Meadows",
  difficulty: 'easy',
  lengthM: 1450,
  parTimeMs: 120000,
  laps: 3,
  cupId: 'mushroom',
  starRequirement: 0,
  points: [
    [0, 0, 0],
    [0, 0, 150],
    [-100, 10, 300],
    [-300, 25, 400],
    [-500, 10, 300],
    [-400, -5, 100],
    [-100, -10, -100],
    [100, 0, -200],
    [200, 15, -100],
    [100, 5, 0]
  ],
  roadWidth: 24,
  environment: {
    skyColor: 0xbfe0ec,
    fogColor: 0xbfe0ec,
    fogNear: 40,
    fogFar: 350
  },
  colors: {
    base: '#baeafa',
    stripes: '#ffffff',
    rubble1: '#ffdad6',
    rubble2: '#dcece8'
  },
  props: {
    treeProbability: 0.3,
    barrierProbability: 0.4
  }
};
