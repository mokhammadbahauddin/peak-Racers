export interface Character {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  archetype: string;
  stats: {
    speed: number;
    acceleration: number;
    handling: number;
    weight: number;
  };
  specialTrait: {
    name: string;
    description: string;
  };
  recommendedVehicles: string[];
  color: number;
}

export const CHARACTERS: Character[] = [
  {
    id: 'bunny',
    name: 'Bunny',
    emoji: '🐰',
    tagline: 'Light as a cloud, fast as a dream.',
    description: 'Pure speed, no weight. Win races by being the fastest thing on the track.',
    archetype: 'Speedster',
    stats: { speed: 88, acceleration: 98, handling: 65, weight: 25 },
    specialTrait: { name: 'Lightfoot', description: 'Faster start boost off the line' },
    recommendedVehicles: ['speed_demon', 'lemon_buggy'],
    color: 0xffadbc
  },
  {
    id: 'cat',
    name: 'Cat',
    emoji: '🐱',
    tagline: 'Smooth is fast. Fast is smooth.',
    description: 'Consistent and reliable. A car that doesn\'t punish small mistakes.',
    archetype: 'All-Rounder',
    stats: { speed: 80, acceleration: 80, handling: 85, weight: 55 },
    specialTrait: { name: 'Nine Lives', description: 'Faster recovery from collisions' },
    recommendedVehicles: ['bubblegum_cruiser', 'nimbus_cruiser'],
    color: 0xbaeafa
  },
  {
    id: 'frog',
    name: 'Frog',
    emoji: '🐸',
    tagline: 'Corners are where I shine.',
    description: 'Feel the satisfaction of a perfect drift line. The boost is just the reward.',
    archetype: 'Drift Master',
    stats: { speed: 70, acceleration: 100, handling: 95, weight: 20 },
    specialTrait: { name: 'Drift King', description: 'Drift boost charges 10% faster' },
    recommendedVehicles: ['azure_breeze', 'peach_drifter'],
    color: 0xd1e9cd
  },
  {
    id: 'bear',
    name: 'Bear',
    emoji: '🐻',
    tagline: 'I don\'t avoid collisions. I cause them.',
    description: 'Bulldoze through traffic. Your size is your weapon.',
    archetype: 'Tank',
    stats: { speed: 78, acceleration: 50, handling: 55, weight: 95 },
    specialTrait: { name: 'Heavyweight', description: 'Immune to collision pushback from lighter racers' },
    recommendedVehicles: ['golden_champ', 'mint_cruiser'],
    color: 0xe7bbc6
  }
];

export function getCharacter(id: string): Character {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS[1];
}
