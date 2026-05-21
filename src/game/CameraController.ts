import * as THREE from 'three';
import { GameState } from './Engine';
import { InputManager } from './InputManager';

export class CameraController {
    camera: THREE.PerspectiveCamera;
    input: InputManager;
    
    private _idealCam = new THREE.Vector3();
    private _introCamStart = new THREE.Vector3();
    private _lookTgt = new THREE.Vector3();
    private _t3 = new THREE.Vector3();
    private _t4 = new THREE.Vector3();
    private _tForward = new THREE.Vector3();
    
    cameraShake: number = 0;
    private stateTimer: number = 0;
    
    constructor(camera: THREE.PerspectiveCamera, input: InputManager) {
        this.camera = camera;
        this.input = input;
    }
    
    public initIntro(startPt: THREE.Vector3, startTan: THREE.Vector3) {
        this.camera.position.copy(startPt.clone().sub(startTan.clone().multiplyScalar(18)).add(new THREE.Vector3(0, 7, 0)));
        this.camera.lookAt(startPt.clone().add(startTan.clone().multiplyScalar(20)));
        this._introCamStart.copy(startPt.clone().add(new THREE.Vector3(0, 80, 80)));
        this.stateTimer = 1.0;
    }

    public addShake(amount: number) {
        this.cameraShake = Math.max(this.cameraShake, amount);
    }
    
    public addCumulativeShake(amount: number) {
        this.cameraShake = Math.min(this.cameraShake + amount, 1.0);
    }

    public update(gameState: GameState, dt: number, carPos: THREE.Vector3, carQuat: THREE.Quaternion, speed: number, maxSpeed: number, isDrifting: boolean, stateTimer: number) {
        this.cameraShake *= 0.9;
        this.stateTimer = stateTimer;
        
        // GDD Section 05: Fixed isometric follow. 50 deg orthographic-like. 45 deg elevation/azimuth.
        this._tForward.set(0, 0, -1).applyQuaternion(carQuat);
        
        const isoOffset = new THREE.Vector3(25, 35, 25);
        this._idealCam.copy(carPos).add(isoOffset);
        
        // Look slightly ahead of car based on velocity/forward vector
        this._lookTgt.copy(carPos).add(this._tForward.clone().multiplyScalar(10));
        
        if (gameState === 'intro') {
            const t = Math.max(0, this.stateTimer / 3.0);
            const ease = 1 - Math.pow(1 - t, 3);
            this.camera.position.lerpVectors(this._idealCam, this._introCamStart, ease);
            this.camera.lookAt(carPos);
        } else if (gameState === 'countdown') {
            this.camera.position.lerp(this._idealCam, 1.0 - Math.exp(-20 * dt));
            this.camera.lookAt(this._lookTgt);
        } else if (gameState === 'racing') {
            const camDamp = 1.0 - Math.exp(-20 * dt);
            this.camera.position.lerp(this._idealCam, camDamp);
            
            if (this.cameraShake > 0) {
               const time = performance.now() * 0.05;
               this.camera.position.x += Math.sin(time) * this.cameraShake * 1.5;
               this.camera.position.y += Math.cos(time * 1.3) * this.cameraShake * 1.5;
            }

            // Dutch Angle (Camera Roll) based on steering and drift
            const rollAmount = -this.input.getSteer() * (isDrifting ? 0.35 : 0.15);
            const targetUp = this._t3.set(Math.sin(rollAmount), Math.cos(rollAmount), 0).normalize();
            this.camera.up.lerp(targetUp, 1.0 - Math.exp(-5 * dt));

            this.camera.lookAt(this._lookTgt);
        } else if (gameState === 'finished') {
            const radius = 20;
            const cx = carPos.x + Math.cos(this.stateTimer * 0.5) * radius;
            const cz = carPos.z + Math.sin(this.stateTimer * 0.5) * radius;
            
            this._t4.set(cx, carPos.y + 10, cz);
            this.camera.position.lerp(this._t4, 1.0 - Math.exp(-2 * dt));
            this.camera.lookAt(carPos);
        } else if (gameState === 'podium') {
            // Podium camera sweep
            const radius = 25;
            const cx = carPos.x + Math.cos(this.stateTimer * 0.3) * radius;
            const cz = carPos.z + Math.sin(this.stateTimer * 0.3) * radius;
            
            this._t4.set(cx, carPos.y + 5, cz);
            this.camera.position.lerp(this._t4, 1.0 - Math.exp(-2 * dt));
            this.camera.lookAt(carPos);
        }
        
        const targetFov = 50 + (Math.abs(speed) / maxSpeed) * 8 + (this.input.isBoosting() && gameState === 'racing' ? 15 : 0);
        this.camera.fov += (targetFov - this.camera.fov) * (1.0 - Math.exp(-5 * dt));
        this.camera.updateProjectionMatrix();
    }
}
