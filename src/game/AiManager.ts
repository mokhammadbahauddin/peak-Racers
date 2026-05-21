import * as THREE from 'three';
import { MathUtils } from 'three';
import * as CANNON from 'cannon-es';
import { ArcadeVehicle } from './physics/ArcadeVehicle';
import { PhysicsConfig } from './physics/PhysicsConfig';
import { TrackGenerator } from './TrackGenerator';
import { createCarModel } from './CarGenerator';

export class AiManager {
    public aiCars: any[] = [];
    private trackCurvePts: {p: THREE.Vector3, t: number}[] = [];

    // Temporary vectors for math
    private _t1 = new THREE.Vector3();
    private _t2 = new THREE.Vector3();
    private _t3 = new THREE.Vector3();
    private _t4 = new THREE.Vector3();

    constructor() {}

    public init(scene: THREE.Scene, world: CANNON.World, track: TrackGenerator, trackCurvePts: {p: THREE.Vector3, t: number}[]) {
        this.trackCurvePts = trackCurvePts;
        
        const aiSpecs = [
           { color: 0xbaeafa, type: 'sprinter' as const, targetOff: 0.4, speed: 100, t: 0.05, lap: 1, lapFlag: true },
           { color: 0xd1e9cd, type: 'tank' as const, targetOff: -0.6, speed: 105, t: 0.1, lap: 1, lapFlag: true },
           { color: 0xe7bbc6, type: 'cruiser' as const, targetOff: -0.1, speed: 95, t: 0.15, lap: 1, lapFlag: true }
        ];

        this.aiCars = aiSpecs.map(spec => {
           const m = createCarModel(spec.color, spec.type);
           scene.add(m);
           return { mesh: m, ...spec, offX: spec.targetOff };
        });

        this.aiCars.forEach(ai => {
           const aiPt = track.curve.getPointAt(ai.t);
           const aiTan = track.curve.getTangentAt(ai.t).normalize();
           const aiFaceAngle = Math.atan2(aiTan.x, aiTan.z) + Math.PI;
           
           const aiHandling = (ai.type === 'sprinter') ? 1.2 : ((ai.type === 'tank') ? 0.8 : 1.0);
           const aiArmor = (ai.type === 'sprinter') ? 0.8 : ((ai.type === 'tank') ? 1.5 : 1.0);
           const aiMaxSpeed = (ai.type === 'sprinter') ? PhysicsConfig.topSpeedA : ((ai.type === 'tank') ? PhysicsConfig.topSpeedC : PhysicsConfig.topSpeedB);
           
           ai.vehicle = new ArcadeVehicle(world, ai.mesh, aiPt, aiFaceAngle, ai.speed / 120, aiArmor, aiHandling, aiMaxSpeed);
           ai.body = ai.vehicle.body;
        });
    }

    public update(dt: number, track: TrackGenerator, playerPos: THREE.Vector3, playerRank: number, gameState: string, playerT: number) {
        this.aiCars.forEach((ai) => {
            // Find closest point on curve for AI
            let aDist = Infinity;
            let cT = ai.t;
            
            // Use trackCurvePts to approximate closest t
            let searchStart = Math.floor(ai.t * this.trackCurvePts.length) - 20;
            let searchEnd = searchStart + 40;
            
            // Limit bounds to avoid searching whole track
            const l = this.trackCurvePts.length;
            for (let i = searchStart; i <= searchEnd; i++) {
                let idx = (i + l) % l;
                let pt = this.trackCurvePts[idx].p;
                let d = ai.mesh.position.distanceToSquared(pt);
                if (d < aDist) {
                    aDist = d;
                    cT = this.trackCurvePts[idx].t;
                }
            }
            
            ai.t = cT;
            
            // AI Steering logic
            let aiGas = 0;
            let aiBrake = 0;
            let aiSteer = 0;
            let aiTargetSpeed = ai.speed;

            if (ai.spinoutCooldown && ai.spinoutCooldown > 0) {
                ai.spinoutCooldown -= dt;
                aiGas = 0;
                aiBrake = 50; // slowdown
                ai.mesh.rotation.y += dt * 15; // physical visual spin
                aiSteer = 0;
                ai.vehicle.update(aiGas, aiSteer, aiBrake, false, false, false, dt);
                
                // Keep render without overriding the rotation we just added
                ai.vehicle.render(dt);
                // Override rotation back
                ai.mesh.rotation.y += Math.sin(ai.spinoutCooldown * 20); 
            } else {
                const lookAheadT = (cT + 0.05) % 1.0;
                const targetPt = track.curve.getPointAt(lookAheadT);
                
                const forward = this._t1.set(0,0,-1).applyQuaternion(ai.mesh.quaternion);
                const toTarget = this._t2.copy(targetPt).sub(ai.mesh.position).normalize();
                
                const cross = this._t3.copy(forward).cross(toTarget);
                aiSteer = cross.y > 0 ? -0.4 : 0.4; 
                
                // Tactical AI (Rubberbanding and Blocking)
                const distToPlayer = ai.mesh.position.distanceTo(playerPos);
                const tDiff = (playerT - ai.t + 1.0) % 1.0; 
                
                if (distToPlayer > 100) {
                    if (tDiff > 0.5) {
                        aiTargetSpeed = ai.speed * 1.15;
                    } else {
                        aiTargetSpeed = ai.speed * 0.9;
                    }
                }

                let avoidForce = 0;
                for (const otherAi of this.aiCars) {
                    if (otherAi === ai) continue;
                    const dist = ai.mesh.position.distanceTo(otherAi.mesh.position);
                    if (dist < 15) {
                        const toOther = this._t4.copy(otherAi.mesh.position).sub(ai.mesh.position).normalize();
                        const dot = forward.dot(toOther);
                        if (dot > 0.7) { 
                            const avoidCross = this._t4.copy(forward).cross(toOther);
                            avoidForce = avoidCross.y > 0 ? 0.3 : -0.3; 
                        }
                    }
                }
                
                if (distToPlayer < 30 && tDiff < 0.2 && tDiff > 0) {
                     const toPlayer = this._t4.copy(playerPos).sub(ai.mesh.position).normalize();
                     const playerCross = this._t4.copy(forward).cross(toPlayer);
                     aiSteer += playerCross.y > 0 ? 0.2 : -0.2;
                } else {
                    aiSteer += avoidForce; 
                }
                
                aiSteer = MathUtils.clamp(aiSteer, -1, 1);

                const aiSpeedCurrent = Math.abs(ai.vehicle.body.velocity.length() * 3.6);
                if (aiSpeedCurrent < aiTargetSpeed) aiGas = (aiTargetSpeed/120);
                else aiGas = 0;
                
                if (gameState === 'countdown' || gameState === 'intro' || gameState === 'finished') {
                    aiGas = 0;
                    aiBrake = 120;
                }
                
                ai.vehicle.update(aiGas, aiSteer, aiBrake, false, false, false, dt);
                ai.vehicle.render(dt);
            }

            if (cT < 0.1 && ai.lapFlag) {
                ai.lap++;
                ai.lapFlag = false;
            } else if (cT > 0.9) {
                ai.lapFlag = true;
            }
        });
    }

    public getTs(): number[] {
        return this.aiCars.map(ai => ai.t);
    }
}
