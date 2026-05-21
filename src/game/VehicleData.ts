export type VehicleClass = 'A' | 'B' | 'C';

export interface Vehicle {
  id: string;
  name: string;
  vehicleClass: VehicleClass;
  stats: {
    speed: number;
    handling: number;
    acceleration: number;
    weight: number;
  };
  unlockCost: number;
  unlockCurrency: 'coins' | 'gems';
  carType: 'cruiser' | 'sprinter' | 'tank';
  color: number;
  description: string;
}

export const VEHICLES: Vehicle[] = [
  {
    id: 'bubblegum_cruiser', name: 'Bubblegum Cruiser', vehicleClass: 'C',
    stats: { speed: 40, handling: 60, acceleration: 50, weight: 30 },
    unlockCost: 0, unlockCurrency: 'coins', carType: 'cruiser', color: 0xffadbc,
    description: 'A balanced beginner kart. Sweet and reliable.'
  },
  {
    id: 'lemon_buggy', name: 'Lemon Buggy', vehicleClass: 'C',
    stats: { speed: 30, handling: 70, acceleration: 70, weight: 20 },
    unlockCost: 0, unlockCurrency: 'coins', carType: 'sprinter', color: 0xfff3b0,
    description: 'Zippy and nimble. Perfect for drift builds.'
  },
  {
    id: 'mint_cruiser', name: 'Mint Cruiser', vehicleClass: 'B',
    stats: { speed: 50, handling: 50, acceleration: 40, weight: 40 },
    unlockCost: 2500, unlockCurrency: 'coins', carType: 'cruiser', color: 0xbaeafa,
    description: 'A mid-game all-rounder with a fresh look.'
  },
  {
    id: 'azure_breeze', name: 'Azure Breeze', vehicleClass: 'B',
    stats: { speed: 50, handling: 70, acceleration: 30, weight: 30 },
    unlockCost: 2500, unlockCurrency: 'coins', carType: 'sprinter', color: 0x99e9f2,
    description: 'Built for technical tracks. Handles like a dream.'
  },
  {
    id: 'peach_drifter', name: 'Peach Drifter', vehicleClass: 'B',
    stats: { speed: 40, handling: 50, acceleration: 60, weight: 20 },
    unlockCost: 4800, unlockCurrency: 'coins', carType: 'sprinter', color: 0xffc9c9,
    description: 'High-acceleration drift specialist.'
  },
  {
    id: 'speed_demon', name: 'Speed Demon', vehicleClass: 'A',
    stats: { speed: 70, handling: 50, acceleration: 80, weight: 30 },
    unlockCost: 150, unlockCurrency: 'gems', carType: 'sprinter', color: 0xff6b6b,
    description: 'The competitive choice. Raw speed and acceleration.'
  },
  {
    id: 'nimbus_cruiser', name: 'Nimbus Cruiser', vehicleClass: 'A',
    stats: { speed: 60, handling: 70, acceleration: 50, weight: 50 },
    unlockCost: 200, unlockCurrency: 'gems', carType: 'cruiser', color: 0xd0bfff,
    description: 'Balanced Class A. The workhorse of champions.'
  },
  {
    id: 'golden_champ', name: 'Golden Champ', vehicleClass: 'A',
    stats: { speed: 80, handling: 30, acceleration: 40, weight: 70 },
    unlockCost: 300, unlockCurrency: 'gems', carType: 'tank', color: 0xffd43b,
    description: 'Legendary. Maximum speed on straights. A beast.'
  }
];

export const UPGRADE_COSTS = {
  turbo: [300, 500, 800, 1200, 2000],
  tires: [250, 450, 700, 1100, 1800],
  aero:  [350, 600, 950, 1400, 2200]
} as const;

export const UPGRADE_EFFECTS = {
  turbo: { statKey: 'speed' as const, perLevel: 5 },
  tires: { statKey: 'handling' as const, perLevel: 6 },
  aero:  { statKey: 'acceleration' as const, perLevel: 4 }
} as const;

export function getVehicle(id: string): Vehicle {
  return VEHICLES.find(v => v.id === id) || VEHICLES[0];
}
