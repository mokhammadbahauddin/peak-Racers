import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';

class NetworkManager {
    private static instance: NetworkManager;
    private socket: Socket | null = null;
    
        public remotePlayers: Record<string, {
      id: string;
      position: THREE.Vector3;
      rotation: THREE.Quaternion;
      targetPosition: THREE.Vector3;
      targetRotation: THREE.Quaternion;
      carType: string;
      active: boolean;
      lastUpdate: number;
    }> = {};

    private isConnected = false;
    private loopRunning = false;

    private constructor() {}

    public static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
        }
        return NetworkManager.instance;
    }


    private lastTickTime: number = performance.now();
    private updateLoop = () => {
        if (!this.isConnected || !this.loopRunning) return;
        const now = performance.now();
        const delta = (now - this.lastTickTime) / 1000;
        this.lastTickTime = now;

        for (const id in this.remotePlayers) {
            const rp = this.remotePlayers[id];
            // Interpolate position
            rp.position.lerp(rp.targetPosition, 10 * delta); // Adjust the factor for speed
            // Interpolate rotation
            rp.rotation.slerp(rp.targetRotation, 10 * delta);
        }
        if (this.loopRunning) {
            requestAnimationFrame(this.updateLoop);
        }
    };

    public connect(carType: string) {
        if (this.socket) return;
        
        // Connect to the same origin server
        this.socket = io({
            transports: ['websocket'],
            reconnection: true
        });

                this.socket.on("connect", () => {
            console.log("Connected to multiplayer server");
            this.isConnected = true;
            this.socket?.emit("join-race", { carType });
            this.lastTickTime = performance.now();
            if (!this.loopRunning) {
                this.loopRunning = true;
                requestAnimationFrame(this.updateLoop);
            }
        });

        this.socket.on("players-update", (players: Record<string, any>) => {
            for (const id in players) {
                if (id === this.socket?.id) continue; // Skip self
                const p = players[id];
                if (!this.remotePlayers[id]) {
                    this.remotePlayers[id] = {
                        id,
                        position: new THREE.Vector3(p.position?.x || 0, p.position?.y || 0, p.position?.z || 0),
                        rotation: new THREE.Quaternion(p.rotation?.x || 0, p.rotation?.y || 0, p.rotation?.z || 0, p.rotation?.w || 1),
                        targetPosition: new THREE.Vector3(p.position?.x || 0, p.position?.y || 0, p.position?.z || 0),
                        targetRotation: new THREE.Quaternion(p.rotation?.x || 0, p.rotation?.y || 0, p.rotation?.z || 0, p.rotation?.w || 1),
                        carType: p.carType || 'cruiser',
                        active: true,
                        lastUpdate: Date.now()
                    };
                } else {
                    const rp = this.remotePlayers[id];
                    if (p.position) {
                        rp.targetPosition.set(p.position.x, p.position.y, p.position.z);
                    }
                    if (p.rotation) {
                        rp.targetRotation.set(p.rotation.x, p.rotation.y, p.rotation.z, p.rotation.w);
                    }
                }
            }
            // Remove disconnected
            for (const id in this.remotePlayers) {
                if (!players[id]) {
                    delete this.remotePlayers[id];
                }
            }
        });

                this.socket.on("player-moved", (data: any) => {
            if (this.remotePlayers[data.id]) {
                const rp = this.remotePlayers[data.id];
                if (data.position) {
                    rp.targetPosition.set(data.position.x, data.position.y, data.position.z);
                }
                if (data.rotation) {
                    rp.targetRotation.set(data.rotation.x, data.rotation.y, data.rotation.z, data.rotation.w);
                }
                rp.lastUpdate = Date.now();
            }
        });
    }

    public sendUpdate(position: THREE.Vector3, rotation: THREE.Quaternion) {
        if (!this.isConnected || !this.socket) return;
        this.socket.emit("player-update", {
            position: { x: position.x, y: position.y, z: position.z },
            rotation: { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
        });
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
        this.remotePlayers = {};
        this.loopRunning = false;
    }
}

export const generateNetworkManager = (): NetworkManager => NetworkManager.getInstance();
