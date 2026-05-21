import * as THREE from 'three';
import { TrackGenerator } from './TrackGenerator';
import { AudioManager } from './AudioManager';
import { JuiceManager } from './JuiceManager';
import { useHudStore } from './stores/useHudStore';
import { InputManager } from './InputManager';

interface Projectile {
    type: 'rocket' | 'star';
    mesh: THREE.Object3D;
    velocity: THREE.Vector3;
    active: boolean;
    ownerId: string;
    life: number;
}

export class ItemManager {
    private track: TrackGenerator;
    private audio: AudioManager;
    private juice: JuiceManager;
    private scene: THREE.Scene;

    private wasItemPressed: boolean = false;
    private projectiles: Projectile[] = [];

    // Temp vectors for distance checks
    private _t1 = new THREE.Vector3();

    constructor(track: TrackGenerator, audio: AudioManager, juice: JuiceManager, scene: THREE.Scene) {
        this.track = track;
        this.audio = audio;
        this.juice = juice;
        this.scene = scene;
    }

    public update(dt: number, now: number, playerPos: THREE.Vector3, playerVelocity: THREE.Vector3, input: InputManager, triggerBoost: (duration: number) => void, addBoostBar: (amount: number) => void, triggerSpinout: () => void, aiCars: any[]) {
        // Animate and check Item Boxes
        this.track.itemBoxes.forEach(pickup => {
            if (!pickup.active) return;
            
            // Animate
            pickup.mesh.rotation.y += dt;
            pickup.mesh.rotation.x += dt * 0.5;
            pickup.mesh.position.y = pickup.position.y + Math.sin(now * 0.005 + pickup.id) * 0.5;
            
            // Check collision with player
            const d = pickup.mesh.position.distanceTo(playerPos);
            if (d < 4.0) {
                pickup.active = false;
                pickup.mesh.visible = false;
                this.audio.playPickup();
                this.juice.addExhaust(pickup.mesh.position, true); // particle explosion
                
                // Randomly give an item based on rank (GDD Section 04)
                const hudState = useHudStore.getState();
                if (hudState.currentItem === 'none') {
                    let rolled: 'mushroom' | 'rocket' | 'star' | 'shield' = 'shield';
                    const rank = hudState.rank || 1;
                    const r = Math.random();
                    if (rank === 1) {
                        // 1st place: 20% Mushroom, 5% Star, 25% Rocket, 50% Shield
                        if (r < 0.20) rolled = 'mushroom';
                        else if (r < 0.25) rolled = 'star';
                        else if (r < 0.50) rolled = 'rocket';
                        else rolled = 'shield';
                    } else if (rank === 2 || rank === 3) {
                        // 2nd/3rd place: 40% Mushroom, 20% Star, 20% Rocket, 20% Shield
                        if (r < 0.40) rolled = 'mushroom';
                        else if (r < 0.60) rolled = 'star';
                        else if (r < 0.80) rolled = 'rocket';
                        else rolled = 'shield';
                    } else {
                        // 4th place: 60% Mushroom, 30% Star, 10% Rocket, 0% Shield
                        if (r < 0.60) rolled = 'mushroom';
                        else if (r < 0.90) rolled = 'star';
                        else rolled = 'rocket';
                    }
                    useHudStore.getState().setHudData({ currentItem: rolled });
                }
                
                // Respawn logic attached directly to the pickup
                setTimeout(() => {
                    pickup.active = true;
                    pickup.mesh.visible = true;
                }, 3000);
            }
        });

        // Player use item
        const hudState = useHudStore.getState();
        if (input.isItemPressed()) {
            if (!this.wasItemPressed && hudState.currentItem !== 'none') {
                 this.useItem(hudState.currentItem, playerPos, playerVelocity, triggerBoost, addBoostBar, 'player');
                 useHudStore.getState().setHudData({ currentItem: 'none' });
            }
            this.wasItemPressed = true;
        } else {
            this.wasItemPressed = false;
        }

        // Update Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            if (!p.active) continue;

            p.life -= dt;
            if (p.life <= 0) {
                p.active = false;
                this.scene.remove(p.mesh);
                this.projectiles.splice(i, 1);
                continue;
            }

            if (p.type === 'rocket') {
                // Find nearest target for homing
                let nearestDist = 80 * 80; // Homing range squared
                let targetPos = null;

                if (p.ownerId !== 'player') {
                    const dSq = p.mesh.position.distanceToSquared(playerPos);
                    if (dSq < nearestDist) {
                        nearestDist = dSq;
                        targetPos = playerPos;
                    }
                }

                for (let j = 0; j < aiCars.length; j++) {
                    if (p.ownerId === `ai_${j}`) continue;
                    const dSq = p.mesh.position.distanceToSquared(aiCars[j].mesh.position);
                    if (dSq < nearestDist) {
                        nearestDist = dSq;
                        targetPos = aiCars[j].mesh.position;
                    }
                }

                if (targetPos) {
                    const toTarget = this._t1.copy(targetPos).sub(p.mesh.position).normalize();
                    const currentDir = p.velocity.clone().normalize();
                    currentDir.lerp(toTarget, dt * 2.5).normalize();
                    p.velocity.copy(currentDir).multiplyScalar(p.velocity.length());
                }

                p.mesh.position.addScaledVector(p.velocity, dt);
                p.mesh.rotation.x += dt * 5;
                
                // Height conform slightly
                p.mesh.position.y = Math.max(p.mesh.position.y - dt * 2, 1);
            } else if (p.type === 'star') {
                p.mesh.rotation.y += dt * 3;
            }

            // Collisions
            let hit = false;
            
            // Check Player
            if (p.ownerId !== 'player') {
                if (p.mesh.position.distanceTo(playerPos) < 2.5) {
                    hit = true;
                    triggerSpinout();
                }
            }

            // Check AI
            if (!hit) {
                for (let j = 0; j < aiCars.length; j++) {
                    const ai = aiCars[j];
                    if (p.ownerId === `ai_${j}`) continue;
                    if (p.mesh.position.distanceTo(ai.mesh.position) < 3.0) {
                        hit = true;
                        // Trigger AI spinout
                        ai.spinoutCooldown = 1.5;
                        this.juice.addImpact(ai.mesh.position, 0xffff00);
                        break;
                    }
                }
            }

            if (hit) {
                p.active = false;
                this.juice.addImpact(p.mesh.position, p.type === 'rocket' ? 0xff0000 : 0xffff00);
                this.scene.remove(p.mesh);
                this.projectiles.splice(i, 1);
            }
        }
    }

    private useItem(item: string, playerPos: THREE.Vector3, velocity: THREE.Vector3, triggerBoost: (duration: number) => void, addBoostBar: (amount: number) => void, ownerId: string) {
        if (item === 'mushroom') {
            triggerBoost(3.0); // 3 second boost (GDD spec)
            this.audio.playPickup();
            this.juice.addImpact(playerPos, 0xffaa00);
        } else if (item === 'star') {
            addBoostBar(30.0); // +30 boost units to the bar!
            this.audio.playPickup();
            this.juice.addImpact(playerPos, 0xffffff); // Star sparkle
            // Implementation detail: we could add invincibility flag to player vehicle
        } else if (item === 'shield') {
            this.audio.playPickup();
            this.juice.addImpact(playerPos, 0x00ccff); // Shield bubble
        } else if (item === 'rocket') {
            this.audio.playPickup();
            
            // Launch rocket forward
            const rocketMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.4, 1.5, 8),
                new THREE.MeshLambertMaterial({ color: 0xff66bb }) // pastel pinkish rocket
            );
            rocketMesh.rotation.x = Math.PI / 2;
            
            const forward = velocity.clone().normalize();
            if (forward.lengthSq() < 0.1) forward.set(0,0,-1);

            rocketMesh.position.copy(playerPos).addScaledVector(forward, 2.5);
            rocketMesh.position.y += 0.5;

            this.scene.add(rocketMesh);
            
            const pSpeed = velocity.length();
            
            this.projectiles.push({
                type: 'rocket',
                mesh: rocketMesh,
                velocity: forward.clone().multiplyScalar(Math.max(pSpeed + 20, 60)),
                active: true,
                ownerId,
                life: 3.0 // 120m distance limit implies shorter life
            });
        }
    }
}
