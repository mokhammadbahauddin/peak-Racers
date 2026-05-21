import { io, Socket } from 'socket.io-client';
import * as THREE from 'three';

class NetworkManager {
    private static instance: NetworkManager;
    private socket: Socket | null = null;
    
    public remotePlayers: Record<string, {
      id: string;
      position: THREE.Vector3;
      rotation: THREE.Quaternion;
      carType: string;
      active: boolean;
      lastUpdate: number;
    }> = {};

    private isConnected = false;

    private constructor() {}

    public static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
        }
        return NetworkManager.instance;
    }

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
        });

        this.socket.on("players-update", (players: Record<string, any>) => {
            for (const id in players) {
                if (id === this.socket?.id) continue; // Skip self
                const p = players[id];
                if (!this.remotePlayers[id]) {
                    this.remotePlayers[id] = {
                        id,
                        position: new THREE.Vector3(),
                        rotation: new THREE.Quaternion(),
                        carType: p.carType || 'cruiser',
                        active: true,
                        lastUpdate: Date.now()
                    };
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
                    rp.position.set(data.position.x, data.position.y, data.position.z);
                }
                if (data.rotation) {
                    rp.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z, data.rotation.w);
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
    }
}

export const generateNetworkManager = (): NetworkManager => NetworkManager.getInstance();
