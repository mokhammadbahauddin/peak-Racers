import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { PhysicsConfig } from './PhysicsConfig';

export class ArcadeVehicle {
    body: CANNON.Body;
    mesh: THREE.Group;
    yaw: number;
    speedMult: number;
    armorMult: number;
    handlingMult: number;
    raycast: CANNON.RaycastResult;
    world: CANNON.World;

    // Transmission & Engine
    currentGear: number = 1;
    maxGears: number = 6;
    rpm: number = 0;
    maxSpeed: number = 120;
    speed: number = 0;

    private _rayFrom = new CANNON.Vec3();
    private _rayTo = new CANNON.Vec3();
    private _upAxis = new CANNON.Vec3(0, 1, 0);
    private _downforce = new CANNON.Vec3();
    private _engineForceVec = new CANNON.Vec3();
    private _tForward = new THREE.Vector3();
    private _tRight = new THREE.Vector3();
    private _tUp = new THREE.Vector3(0, 1, 0);
    private _t1 = new THREE.Vector3();

    private _groundNormal: CANNON.Vec3 = new CANNON.Vec3(0, 1, 0);

    constructor(world: CANNON.World, mesh: THREE.Group, startPt: THREE.Vector3, faceAngle: number, speedMult: number, armorMult: number, handlingMult: number, maxSpeed: number = 120) {
        this.world = world;
        this.mesh = mesh;
        this.yaw = Math.PI + faceAngle; // Correct rotation mapping
        this.speedMult = speedMult;
        this.armorMult = armorMult;
        this.handlingMult = handlingMult;
        this.maxSpeed = maxSpeed;

        const shape = new CANNON.Sphere(0.5); 
        this.body = new CANNON.Body({
            mass: 1000 * armorMult,
            material: new CANNON.Material({ friction: 0.0, restitution: 0.1 }),
            fixedRotation: true,
            position: new CANNON.Vec3(startPt.x, startPt.y + 2, startPt.z),
            collisionFilterGroup: 1, // vehicles
            collisionFilterMask: -1, // collide with everything
        });
        
        // Lower center of mass slightly by offsetting collision mesh
        this.body.addShape(shape, new CANNON.Vec3(0, 0.4, 0));
        this.body.linearDamping = 0.1; 
        
        this.world.addBody(this.body);
        this.raycast = new CANNON.RaycastResult();
    }

    hop() {
        if (this.raycast.hasHit) {
            this.body.velocity.y += 12; // Upward impulse
        }
    }

    update(gas: number, steer: number, brake: number, gearUp: boolean, gearDown: boolean, isDrifting: boolean, dt: number) {
        this.body.wakeUp();

        // Steering modify yaw
        const steerSpeed = 2.0 * this.handlingMult; 
        this.yaw += steer * steerSpeed * dt;

        // Transmission / Gear Logic (AMT)
        this.speed = this.body.velocity.length() * 3.6;

        if (gearUp && this.currentGear < this.maxGears) {
            this.currentGear++;
        }
        if (gearDown && this.currentGear > 1) {
            this.currentGear--;
        }

        const currentGearMaxSpeed = (this.currentGear / this.maxGears) * this.maxSpeed;
        this.rpm = Math.max(0, this.speed / currentGearMaxSpeed);

        // Automatic Shifting
        if (this.rpm > 1.0 && this.speed > 10 && this.currentGear < this.maxGears) {
            this.currentGear++;
        } else if (this.rpm < 0.2 && this.currentGear > 1 && this.speed > 5) {
            this.currentGear--;
        }

        let engineForce = gas * PhysicsConfig.baseAccelForce * this.speedMult; // Base max force
        if (this.speed > currentGearMaxSpeed && engineForce > 0) {
            engineForce = 0; // Rev limiter
        }
        
        let braking = brake;

        // Hover raycast to align vehicle with ground (4 wheels)
        this._groundNormal.set(0,0,0);
        let hitCount = 0;
        let hoverDist = 1.6;

        const springK = 25000;
        const springD = 1500;

        // Front-left, Front-right, Back-left, Back-right
        const offsets = [
            { x: -0.7, z: -1.0 },
            { x: 0.7, z: -1.0 },
            { x: -0.7, z: 1.0 },
            { x: 0.7, z: 1.0 }
        ];

        let speedSq = this.body.velocity.lengthSquared();

        for (let i = 0; i < 4; i++) {
            this._t1.set(offsets[i].x, 0, offsets[i].z).applyAxisAngle(this._tUp, this.yaw);
            this._rayFrom.set(this.body.position.x + this._t1.x, this.body.position.y, this.body.position.z + this._t1.z);
            this._rayTo.set(this._rayFrom.x, this._rayFrom.y - 2.5, this._rayFrom.z);

            this.raycast.reset();
            this.world.raycastClosest(this._rayFrom, this._rayTo, {
                mode: CANNON.Ray.CLOSEST,
                collisionFilterMask: 2 | 4 
            }, this.raycast);

            if (this.raycast.hasHit) {
                hitCount++;
                this._groundNormal.x += this.raycast.hitNormalWorld.x;
                this._groundNormal.y += this.raycast.hitNormalWorld.y;
                this._groundNormal.z += this.raycast.hitNormalWorld.z;
                
                const dist = this.raycast.distance;
                const err = hoverDist - dist;
                
                if (err > 0) {
                    const f = err * springK - this.body.velocity.y * springD;
                    this._downforce.set(0, f, 0);
                    this._t1.set(this._rayFrom.x - this.body.position.x, this._rayFrom.y - this.body.position.y, this._rayFrom.z - this.body.position.z);
                    this.body.applyForce(this._downforce, this._t1 as any);
                }
                
                if (this.body.velocity.y < 2) {
                    this._downforce.set(0, -(speedSq / 4) * 2, 0);
                    this._t1.set(this._rayFrom.x - this.body.position.x, this._rayFrom.y - this.body.position.y, this._rayFrom.z - this.body.position.z);
                    this.body.applyForce(this._downforce, this._t1 as any);
                }
            }
        }

        if (hitCount > 0) {
            this._groundNormal.normalize();
        } else {
            this._groundNormal.copy(this._upAxis);
            // Apply extra gravity if off track to prevent flying
            this._downforce.set(0, -20000, 0);
            this._t1.set(0, 0, 0);
            this.body.applyForce(this._downforce, this._t1 as any);
        }

        // Forward vector based on yaw (Three.js -Z is forward)
        this._tForward.set(0, 0, -1).applyAxisAngle(this._tUp, this.yaw);
        
        if (engineForce !== 0) {
            this._engineForceVec.set(this._tForward.x * engineForce, 0, this._tForward.z * engineForce);
            this._t1.set(0, 0, 0);
            this.body.applyForce(this._engineForceVec, this._t1 as any);
        }

        if (braking > 0) {
            // Apply GDD braking decel (F = ma => a = F/m => F = a*m)
            // But braking in our setup is a dampener when 'braking' is boolean/small, 
            // Or we apply opposite force vector. Let's do a direct velocity reduction for accuracy.
            const decel = PhysicsConfig.activeBrakingDecel * dt;
            const currentSpeedScale = this.body.velocity.length();
            if (currentSpeedScale > 0) {
                const newSpeedScale = Math.max(0, currentSpeedScale - decel);
                this.body.velocity.scale(newSpeedScale / currentSpeedScale, this.body.velocity);
            }
        }

        const velX = this.body.velocity.x;
        const velY = this.body.velocity.y;
        const velZ = this.body.velocity.z;

        this._tRight.set(1, 0, 0).applyAxisAngle(this._tUp, this.yaw);
        
        const fSpeed = velX * this._tForward.x + velY * this._tForward.y + velZ * this._tForward.z;
        let rSpeed = velX * this._tRight.x + velY * this._tRight.y + velZ * this._tRight.z;

        // Grip Logic
        // Math.log(0.95) ~ -0.051, Math.log(0.88) ~ -0.128
        const normalGripDamping = dt / PhysicsConfig.tractionRecovery;
        const driftGripDamping = normalGripDamping * 0.4; // Less grip while drifting
        const damping = isDrifting ? driftGripDamping : normalGripDamping;
        
        const grip = Math.exp(-damping);
        rSpeed *= grip;

        this.body.velocity.set(
            this._tForward.x * fSpeed + this._tRight.x * rSpeed,
            velY,
            this._tForward.z * fSpeed + this._tRight.z * rSpeed
        );
    }

    private rollAmount: number = 0;
    private pitchAmount: number = 0;

    render(dt: number = 0.016) {
        // Sync Mesh Position and Rotation
        this.mesh.position.copy(this.body.interpolatedPosition as any);
        this.mesh.position.y -= 1.2; // Match the new hover suspension equilibrium 
        
        const up = new THREE.Vector3(this._groundNormal.x, this._groundNormal.y, this._groundNormal.z);
        // Forward vector based on current yaw
        this._tForward.set(0, 0, -1).applyAxisAngle(this._tUp, this.yaw);
        this._tRight.set(1, 0, 0).applyAxisAngle(this._tUp, this.yaw);
        
        const lookAtPt = this.mesh.position.clone().add(this._tForward);
        const m = new THREE.Matrix4().lookAt(this.mesh.position, lookAtPt, up);
        
        // Base quaternion aligned to ground and yaw
        const baseQuat = new THREE.Quaternion().setFromRotationMatrix(m);

        // Body Roll (from steering/drifting)
        const localVelX = this.body.velocity.x * this._tRight.x + this.body.velocity.z * this._tRight.z;
        const targetRoll = Math.min(Math.max(-localVelX * 0.015, -0.2), 0.2);
        this.rollAmount += (targetRoll - this.rollAmount) * 10.0 * dt;

        // Body Pitch (from acceleration/braking)
        const accel = (this.speed - (this as any).lastSpeed || this.speed) / dt;
        (this as any).lastSpeed = this.speed;
        const targetPitch = Math.min(Math.max(-accel * 0.005, -0.1), 0.1);
        this.pitchAmount += (targetPitch - this.pitchAmount) * 8.0 * dt;

        const rollQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -this.rollAmount);
        const pitchQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), this.pitchAmount);

        this.mesh.quaternion.copy(baseQuat).multiply(rollQuat).multiply(pitchQuat);
    }
}
