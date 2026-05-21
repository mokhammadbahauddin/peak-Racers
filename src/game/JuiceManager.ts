import * as THREE from 'three';

// CPU-side state for instances
interface ParticleData {
    life: number;
    vel: THREE.Vector3;
    isBoosting: boolean;
    active: boolean;
}

interface ScrubData {
    life: number;
    active: boolean;
}

export class JuiceManager {
  scene: THREE.Scene;
  
  // Tire Scrubs Instanced
  tireScrubGeo: THREE.PlaneGeometry;
  tireScrubMat: THREE.MeshBasicMaterial;
  scrubs: ScrubData[] = [];
  scrubInstanced: THREE.InstancedMesh;
  maxScrubs = 200;
  scrubIndex = 0;

  // Particles Instanced
  particleGeo: THREE.IcosahedronGeometry;
  particleMat: THREE.MeshBasicMaterial;
  particles: ParticleData[] = [];
  particleInstanced: THREE.InstancedMesh;
  maxParticles = 500;
  particleIndex = 0;

  private _dummy = new THREE.Object3D();
  private _color = new THREE.Color();
  
  // Cache vectors for math
  private _up = new THREE.Vector3(0, 1, 0);
  private _pos = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    
    // Tire Scrubs
    this.tireScrubGeo = new THREE.PlaneGeometry(0.8, 0.8);
    this.tireScrubGeo.rotateX(-Math.PI / 2);
    this.tireScrubMat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.6, depthWrite: false });
    this.scrubInstanced = new THREE.InstancedMesh(this.tireScrubGeo, this.tireScrubMat, this.maxScrubs);
    // Initialize inactive hidden
    this._dummy.scale.set(0,0,0);
    this._dummy.updateMatrix();
    for(let i=0; i<this.maxScrubs; i++) {
        this.scrubs.push({ life: 0, active: false });
        this.scrubInstanced.setMatrixAt(i, this._dummy.matrix);
    }
    this.scene.add(this.scrubInstanced);
    
    // Particles
    this.particleGeo = new THREE.IcosahedronGeometry(0.4, 0); // rounder, bigger particles for juicy feel
    this.particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    this.particleInstanced = new THREE.InstancedMesh(this.particleGeo, this.particleMat, this.maxParticles);
    
    for(let i=0; i<this.maxParticles; i++) {
        this.particles.push({ life: 0, vel: new THREE.Vector3(), isBoosting: false, active: false });
        this.particleInstanced.setMatrixAt(i, this._dummy.matrix);
        this.particleInstanced.setColorAt(i, this._color.setHex(0xffffff));
    }
    this.scene.add(this.particleInstanced);
  }

  addScrub(pos: THREE.Vector3, quaternion: THREE.Quaternion) {
    this.scrubIndex = (this.scrubIndex + 1) % this.maxScrubs;
    const data = this.scrubs[this.scrubIndex];
    data.active = true;
    data.life = 1.0;
    
    this._dummy.position.copy(pos);
    this._dummy.position.y += 0.05;
    this._dummy.quaternion.copy(quaternion);
    this._dummy.scale.setScalar(1.0);
    this._dummy.updateMatrix();
    
    this.scrubInstanced.setMatrixAt(this.scrubIndex, this._dummy.matrix);
    this.scrubInstanced.instanceMatrix.needsUpdate = true;
  }

  private _spawnParticle(pos: THREE.Vector3, vx: number, vy: number, vz: number, scale: number, colorToUse: number, isBoost: boolean, life: number = 1.0) {
    this.particleIndex = (this.particleIndex + 1) % this.maxParticles;
    const data = this.particles[this.particleIndex];
    data.active = true;
    data.life = life;
    data.isBoosting = isBoost;
    data.vel.set(vx, vy, vz);

    this._dummy.position.copy(pos);
    this._dummy.scale.setScalar(scale);
    this._dummy.rotation.set(0,0,0);
    this._dummy.updateMatrix();

    this.particleInstanced.setMatrixAt(this.particleIndex, this._dummy.matrix);
    this.particleInstanced.setColorAt(this.particleIndex, this._color.setHex(colorToUse));
    this.particleInstanced.instanceMatrix.needsUpdate = true;
    if (this.particleInstanced.instanceColor) {
        this.particleInstanced.instanceColor.needsUpdate = true;
    }
  }

  addExhaust(pos: THREE.Vector3, isBoosting: boolean = false) {
    if (!isBoosting && Math.random() > 0.3) return; 
    
    let vx = (Math.random() - 0.5) * 2;
    let vy = Math.random() * 2 + 1;
    let vz = (Math.random() - 0.5) * 2;

    const color = (isBoosting && Math.random() > 0.4) ? 0x66ccff : 0xffffff;

    if (isBoosting) {
       vx *= 3.0;
       vy *= 1.5;
       vz *= 3.0;
       this._spawnParticle(pos, vx, vy, vz, 1.5, color, true);
    } else {
       this._spawnParticle(pos, vx, vy, vz, 1.0, color, false);
    }
  }

  addImpact(pos: THREE.Vector3, colorHex: number) {
    for (let i = 0; i < 6; i++) {
        const vx = (Math.random() - 0.5) * 20;
        const vy = Math.random() * 15 + 5;
        const vz = (Math.random() - 0.5) * 20;
        this._spawnParticle(pos, vx, vy, vz, 2.0 + Math.random(), colorHex, false);
    }
  }

  addSparks(pos: THREE.Vector3, colorHex: number) {
    for (let i = 0; i < 3; i++) {
        const vx = (Math.random() - 0.5) * 10;
        const vy = Math.random() * 5 + 3;
        const vz = (Math.random() - 0.5) * 10;
        this._spawnParticle(pos, vx, vy, vz, 0.8 + Math.random() * 0.5, colorHex, false, 0.6);
    }
  }

  update(dt: number) {
    let scrubDirty = false;
    for (let i = 0; i < this.maxScrubs; i++) {
      const scrub = this.scrubs[i];
      if (!scrub.active) continue;
      
      scrubDirty = true;
      scrub.life -= dt * 0.5;
      
      if (scrub.life <= 0) {
        scrub.active = false;
        this._dummy.scale.setScalar(0);
        this._dummy.updateMatrix();
        this.scrubInstanced.setMatrixAt(i, this._dummy.matrix);
      } else {
        this.scrubInstanced.getMatrixAt(i, this._dummy.matrix);
        this._dummy.matrix.decompose(this._dummy.position, this._dummy.quaternion, this._dummy.scale);
        this._dummy.scale.setScalar(Math.max(0.001, scrub.life));
        this._dummy.updateMatrix();
        this.scrubInstanced.setMatrixAt(i, this._dummy.matrix);
      }
    }
    if (scrubDirty) this.scrubInstanced.instanceMatrix.needsUpdate = true;

    let particleDirty = false;
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i];
      if (!p.active) continue;
      
      particleDirty = true;
      p.life -= dt * 2.0; 
      
      if (p.life <= 0) {
        p.active = false;
        this._dummy.scale.setScalar(0);
        this._dummy.updateMatrix();
        this.particleInstanced.setMatrixAt(i, this._dummy.matrix);
      } else {
        this.particleInstanced.getMatrixAt(i, this._dummy.matrix);
        // Extracts position to update based on velocity
        this._pos.setFromMatrixPosition(this._dummy.matrix);
        this._pos.addScaledVector(p.vel, dt);
        
        this._dummy.matrix.decompose(this._dummy.position, this._dummy.quaternion, this._dummy.scale);
        this._dummy.position.copy(this._pos);
        this._dummy.scale.setScalar(Math.max(0.001, p.life));
        this._dummy.updateMatrix();
        
        this.particleInstanced.setMatrixAt(i, this._dummy.matrix);
      }
    }
    if (particleDirty) this.particleInstanced.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.scene.remove(this.scrubInstanced);
    this.scene.remove(this.particleInstanced);
    
    this.tireScrubGeo.dispose();
    this.tireScrubMat.dispose();
    this.particleGeo.dispose();
    this.particleMat.dispose();
  }
}

