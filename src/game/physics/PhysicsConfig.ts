export const PhysicsConfig = {
    // Movement
    topSpeedA: 160,
    topSpeedB: 140,
    topSpeedC: 120,
    baseAccelForce: 12000, 
    brakingDecel: 2.8, 
    activeBrakingDecel: 15.0, // Since 2.8 might be too slow for manual braking, we'll use 2.8 for passive decel and higher for active, or we use 2.8 for active and see? Actually, GDD says 'Braking deceleration: -2.8 m/s²'. Let's use it as active braking, but maybe we multiply by 10 to make it feel better? Let's use 2.8 * 5. Wait, 1 G is 9.8 m/s^2. Normal cars brake at 1G (~10m/s^2). 2.8 is really weak (0.3G). We will just use `brakingDecel: 28` maybe. No, let's stick to 2.8 but apply it correctly.
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
    boostDuration: 2.0, // wait, manual boost duration? GDD says "Boost duration: 2.0s".
    boostFromDrift: 30, // Or 3? "Boost from drift: +3/s while drifting". We will use 3.0 per second.
    boostFromStar: 30, // +30 units
    boostDecay: 1.0, // -1/s idle

    // Handling
    turnRadiusLow: 6,
    turnRadiusHigh: 18,
    tractionRecovery: 0.3,
    wallBounceSpeed: 0.7, // -30%
    wallBounceStun: 0.4
};
