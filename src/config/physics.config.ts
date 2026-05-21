export const PHYSICS_CONFIG = {
  movement: {
    topSpeedClassA: 160,
    topSpeedClassB: 140,
    topSpeedClassC: 120,
    accelTimeRange: [1.8, 3.2],
    brakingDecel: -2.8,
    offTrackSpeedPenalty: 0.6 // 40% reduction
  },
  drifting: {
    driftSpeedMultiplier: 0.85,
    boostChargeRate: 3, // per second
    miniTurboThreshold: 1.5,
    miniTurboSpeedBonus: 20,
    miniTurboDuration: 0.8
  },
  boostSystem: {
    boostBarCapacity: 100,
    boostSpeedMultiplier: 1.4,
    boostDuration: 2.0,
    boostFromDrift: 3,
    boostFromStar: 30,
    boostBarDecayIdle: 1 // per second
  },
  handling: {
    turnRadiusLowSpeed: 6,
    turnRadiusTopSpeed: 18,
    tractionRecoveryTime: 0.3,
    wallCollisionBounce: 0.7, // -30% speed
    wallCollisionStun: 0.4
  }
};
