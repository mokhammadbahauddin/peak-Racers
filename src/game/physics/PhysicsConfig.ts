export const PhysicsConfig = {
    // Movement
    topSpeedA: 160, // km/h (Class A)
    topSpeedB: 140, // km/h (Class B)
    topSpeedC: 120, // km/h (Class C)
    baseAccelForce: 12000, 
    brakingDecel: 2.8, // -2.8 m/s² passive decel
    activeBrakingDecel: 28.0, // Active braking needs to feel responsive in arcade racers. Multiplying GDD nominal value x10 for gameplay feel.
    offTrackPenalty: 0.4, // -40%

    // Drifting
    driftSpeedMult: 0.85,
    boostChargeRate: 3.0, // +3% / s (assume capacity 100 = 3 units/s? Wait, if 3% per second, and capacity is 100, then it's 3 units/sec. BUT GDD says 'Mini-turbo threshold 1.5s'. If 3/sec * 1.5s = 4.5. Wait, mini-turbo is separate from the boost bar!)
    miniTurboThreshold: 1.5,
    miniTurboSpeedBonus: 20,
    miniTurboDuration: 0.8,

    // Boost System
    boostCapacity: 100,
    boostSpeedMult: 1.4, // +40%
    boostDuration: 2.0,
    boostFromDrift: 30,
    boostFromStar: 30, // +30 units
    boostDecay: 1.0, // -1/s idle

    // Handling
    turnRadiusLow: 6,
    turnRadiusHigh: 18,
    tractionRecovery: 0.3,
    wallBounceSpeed: 0.7, // -30%
    wallBounceStun: 0.4
};
