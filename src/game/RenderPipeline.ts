import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';

export class RenderPipeline {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  dirLight: THREE.DirectionalLight;
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;

  constructor(container: HTMLElement, envColors = { sky: 0xbfe0ec, fogNear: 40, fogFar: 350 }) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(envColors.sky);
    this.scene.fog = new THREE.Fog(envColors.sky, envColors.fogNear, envColors.fogFar);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, 1.5) : 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(envColors.sky, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100vw';
    this.renderer.domElement.style.height = '100vh';
    container.appendChild(this.renderer.domElement);

    const renderScene = new RenderPass(this.scene, this.camera);
    
    const ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight);
    ssaoPass.kernelRadius = 12;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.05;

    // Bloom Pass configuration
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = 0.8;
    this.bloomPass.strength = 0.4;
    this.bloomPass.radius = 0.5;

    const outputPass = new OutputPass();
    // Removed SMAAPass to use hardware MSAA

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(ssaoPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(outputPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.5);
    hemiLight.position.set(0, 200, 0);
    this.scene.add(hemiLight);
    
    this.dirLight = new THREE.DirectionalLight(0xfff0dd, 1.4);
    this.dirLight.position.set(100, 200, 50);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 4096;
    this.dirLight.shadow.mapSize.height = 4096;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 600;
    this.dirLight.shadow.camera.left = -200;
    this.dirLight.shadow.camera.right = 200;
    this.dirLight.shadow.camera.top = 200;
    this.dirLight.shadow.camera.bottom = -200;
    this.dirLight.shadow.bias = -0.0005;
    this.dirLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirLight);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.composer.render();
  }

  dispose() {
    this.renderer.dispose();
    this.composer.dispose();
  }
}
