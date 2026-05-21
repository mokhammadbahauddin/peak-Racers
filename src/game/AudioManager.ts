import * as THREE from 'three';
import { GameDataManager } from './GameData';

export class AudioManager {
  listener: THREE.AudioListener;
  engineSound: THREE.Audio;
  driftSound: THREE.Audio;
  windSound: THREE.Audio;
  boostSound: THREE.Audio;

  // Queued SFX pool to prevent overlapping blowouts and allow polyphony
  sfxPool: (THREE.Audio | THREE.PositionalAudio)[] = [];
  sfxQueue: { type: 'pickup' | 'crash' | 'hit', pan: number, priority: number, position?: THREE.Vector3 }[] = [];
  queueTimer = 0;
  
  context: AudioContext;
  
  // Buffers
  pickupBuffer!: AudioBuffer;
  crashBuffer!: AudioBuffer;
  hitBuffer!: AudioBuffer;

  constructor(camera: THREE.Camera) {
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);
    this.context = this.listener.context;

    this.engineSound = new THREE.Audio(this.listener);
    this.driftSound = new THREE.Audio(this.listener);
    this.windSound = new THREE.Audio(this.listener);
    this.boostSound = new THREE.Audio(this.listener);

    // Create 4 distinct pooled SFX channels
    for (let i = 0; i < 8; i++) {
        // Upgrade to PositionalAudio for 3D spatialization
        const sfx = new THREE.PositionalAudio(this.listener);
        sfx.setRefDistance(10);
        sfx.setRolloffFactor(2);
        sfx.setMaxDistance(100);
        this.sfxPool.push(sfx);
    }

    this.initProceduralSounds();
  }

  private initProceduralSounds() {
    // Engine hum: base low freq sine waves
    const engineBuf = this.createNoiseBuffer(2.0, (t) => Math.sin(t * 200) * 0.4 + Math.sin(t * 400) * 0.2);
    this.engineSound.setBuffer(engineBuf);
    this.engineSound.setLoop(true);
    this.engineSound.setVolume(0);
    this.engineSound.play();

    // Tire squeal (high freq noise)
    const squealBuf = this.createNoiseBuffer(1.0, (t) => {
       const noise = Math.random() * 2 - 1;
       return noise * 0.3 * Math.sin(t * 2500);   
    });
    this.driftSound.setBuffer(squealBuf);
    this.driftSound.setLoop(true);
    this.driftSound.setVolume(0);
    this.driftSound.play();

    // Wind (filtered noise)
    const windBuf = this.createNoiseBuffer(2.0, () => {
        return (Math.random() * 2 - 1) * 0.15;
    });
    this.windSound.setBuffer(windBuf);
    this.windSound.setLoop(true);
    this.windSound.setVolume(0);
    this.windSound.play();

    // Boost Whoosh
    const boostBuf = this.createNoiseBuffer(1.0, (t) => {
        return (Math.random() * 2 - 1) * Math.max(0, 1 - t) * Math.sin(t * 1000);
    });
    this.boostSound.setBuffer(boostBuf);
    this.boostSound.setVolume(0.5);

    // SFX Buffers
    this.pickupBuffer = this.createNoiseBuffer(0.3, (t) => Math.sin(t * 4000) * Math.max(0, 1 - t/0.3) * 0.5);
    this.crashBuffer = this.createNoiseBuffer(0.4, (t) => (Math.random() * 2 - 1) * Math.max(0, 1 - t/0.4) * 0.6 * Math.sin(t*300));
    this.hitBuffer = this.createNoiseBuffer(0.5, (t) => Math.sin(t * 800) * Math.max(0, 1 - t/0.5) * 0.8);
  }

  // Enqueue sounds to prevent playing 5 exact sounds on frame 1
  public queueSound(type: 'pickup' | 'crash' | 'hit', pan: number = 0, priority: number = 1, position?: THREE.Vector3) {
      if (this.sfxQueue.length > 12) return; // Drop if queue is backed up
      this.sfxQueue.push({ type, pan, priority, position });
      this.sfxQueue.sort((a,b) => b.priority - a.priority);
  }

  // Backwards compatibility for exact calls
  public playPickup() {
     this.queueSound('pickup', 0, 2);
  }
  public playCrash() {
     this.queueSound('crash', 0, 3);
  }

  private processSfxQueue(dt: number) {
      this.queueTimer -= dt;
      if (this.queueTimer > 0 || this.sfxQueue.length === 0) return;

      const nextSfx = this.sfxQueue.shift();
      if (!nextSfx) return;

      // Find available voice
      const voice = this.sfxPool.find(s => !s.isPlaying) || this.sfxPool[0]; // steal oldest if full
      if (voice.isPlaying) voice.stop();

      let settingsVol = 1.0;
      try {
          const { masterVolume, sfxVolume } = GameDataManager.getInstance().getData().settings;
          settingsVol = (masterVolume / 100) * (sfxVolume / 100);
      } catch(e) {}

      if (nextSfx.type === 'pickup') {
          voice.setBuffer(this.pickupBuffer);
          voice.setVolume(0.6 * settingsVol);
      } else if (nextSfx.type === 'crash') {
          voice.setBuffer(this.crashBuffer);
          voice.setVolume(0.8 * settingsVol);
      } else if (nextSfx.type === 'hit') {
          voice.setBuffer(this.hitBuffer);
          voice.setVolume(0.7 * settingsVol);
      }
      
      if (nextSfx.position && (voice instanceof THREE.PositionalAudio)) {
          // If we have a position, update the internal panner's position (via its transform)
          // Since it's not strictly attached to a mesh in the scene graph during pool playback,
          // we manually set the position:
          voice.position.copy(nextSfx.position);
          voice.updateMatrixWorld();
      } else if (voice instanceof THREE.PositionalAudio) {
          // Reset to origin/camera if no position (e.g. player hit)
          voice.position.set(0,0,0);
          voice.updateMatrixWorld();
      }

      voice.play();
      this.queueTimer = 0.05; // 50ms stagger
  }

  private createNoiseBuffer(duration: number, func: (t: number, i: number) => number) {
    const sampleRate = this.context.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.context.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
        data[i] = func(i / sampleRate, i);
    }
    return buffer;
  }

  update(speed: number, maxSpeed: number, isDrifting: boolean, isBoosting: boolean, dt: number = (1/60)) {
    if (this.context.state === 'suspended') {
       this.context.resume();
    }
    
    this.processSfxQueue(dt);

    let settingsVol = 1.0;
    try {
        const { masterVolume, sfxVolume } = GameDataManager.getInstance().getData().settings;
        settingsVol = (masterVolume / 100) * (sfxVolume / 100);
    } catch(e) {}
    
    // Normalize speed for audio pitches
    const speedRatio = Math.max(0, Math.min(Math.abs(speed) / maxSpeed, 1.5));
    
    // Engine pitch and volume
    this.engineSound.setPlaybackRate(0.6 + speedRatio * 1.5);
    this.engineSound.setVolume((0.2 + speedRatio * 0.3) * settingsVol);

    // Wind volume based on speed
    this.windSound.setVolume((speedRatio > 0.4 ? (speedRatio - 0.4) * 0.6 : 0) * settingsVol);
    this.windSound.setPlaybackRate(1.0 + speedRatio * 0.5);

    // Drift squeal
    if (isDrifting && Math.abs(speed) > 30) {
        this.driftSound.setVolume(Math.min(0.4 * settingsVol, this.driftSound.getVolume() + 0.05 * settingsVol));
    } else {
        this.driftSound.setVolume(Math.max(0, this.driftSound.getVolume() - 0.1));
    }

    if (isBoosting) {
        if (!this.boostSound.isPlaying) {
             this.boostSound.setVolume(0.5 * settingsVol);
             this.boostSound.play();
        }
    }
  }

  dispose() {
    if (this.engineSound.isPlaying) this.engineSound.stop();
    if (this.driftSound.isPlaying) this.driftSound.stop();
    if (this.windSound.isPlaying) this.windSound.stop();
    if (this.boostSound.isPlaying) this.boostSound.stop();
    this.sfxPool.forEach(s => { if (s.isPlaying) s.stop(); });
  }
}
