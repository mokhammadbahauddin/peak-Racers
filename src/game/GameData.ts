import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { apiFetch } from '../apiClient';

export interface CarStats {
  speedLevel: number;
  handlingLevel: number;
  armorLevel: number;
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  graphicsQuality: 'low' | 'medium' | 'high';
}

export interface LastRaceStats {
  timeMs: number;
  rank: number;
  coinsEarned: number;
  xpEarned?: number;
}

export interface RaceRecord {
  timeMs: number;
  carType: 'cruiser' | 'sprinter' | 'tank';
  rank?: number;
}

export interface TrackRecords {
  bestLap: RaceRecord | null;
  topTimes: RaceRecord[]; // up to 5
}

export interface PlayerData {
  isTestDrive?: boolean;
  testDriveVehicleId?: string;
  coins: number;
  gems: number;
  xp: number;
  level: number;
  activeColor: number;
  activeCarType: 'cruiser' | 'sprinter' | 'tank';
  activeCharacter: string;
  activeVehicleId: string;
  activeWorld: string;
  activeTrack: string;
  stars: number;
  difficulty: '50cc' | '100cc' | '150cc';
  ownedVehicles: string[];
  vehicleUpgrades: Record<string, { turbo: number; tires: number; aero: number }>;
  stats: CarStats;
  settings: GameSettings;
  lastRaceStats: LastRaceStats | null;
  records: Record<string, TrackRecords>;
  hasBooted: boolean;
}

const DEFAULT_DATA: PlayerData = {
  isTestDrive: false,
  testDriveVehicleId: undefined,
  coins: 500,
  gems: 0,
  xp: 0,
  level: 1,
  activeColor: 0xffadbc,
  activeCarType: 'cruiser',
  activeCharacter: 'cat',
  activeVehicleId: 'bubblegum_cruiser',
  activeWorld: 'soft_sands',
  activeTrack: 'sands_1',
  stars: 0,
  difficulty: '50cc',
  ownedVehicles: ['bubblegum_cruiser', 'lemon_buggy'],
  vehicleUpgrades: {},
  hasBooted: false,
  stats: {
    speedLevel: 1,
    handlingLevel: 1,
    armorLevel: 1
  },
  settings: {
    masterVolume: 80,
    musicVolume: 60,
    sfxVolume: 100,
    graphicsQuality: 'high'
  },
  lastRaceStats: null,
  records: {}
};

type Subscriber = (data: PlayerData) => void;

export class GameDataManager {
  private static instance: GameDataManager;
  private data: PlayerData;
  private syncTimeout: NodeJS.Timeout | null = null;
  private subscribers: Subscriber[] = [];
  private isInitializing = false;

  private constructor() {
    this.data = this.loadLocalData();
  }

  static getInstance(): GameDataManager {
    if (!GameDataManager.instance) {
      GameDataManager.instance = new GameDataManager();
    }
    return GameDataManager.instance;
  }

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }
  }

  private notify() {
    this.subscribers.forEach(cb => cb(this.data));
  }

  private loadLocalData(): PlayerData {
    try {
      const stored = localStorage.getItem('pastel_peak_racers_data');
      if (stored) {
        return { ...DEFAULT_DATA, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to read from localStorage', e);
    }
    return { ...DEFAULT_DATA };
  }

  async initializeFromCloud(userId: string) {
    if (this.isInitializing) return;
    this.isInitializing = true;
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const cloudData = userSnap.data();
        this.data = {
          ...this.data,
          coins: cloudData.coins ?? this.data.coins,
          xp: cloudData.xp ?? this.data.xp,
          level: cloudData.level ?? this.data.level,
          activeColor: cloudData.activeColor ?? this.data.activeColor,
          activeCarType: cloudData.activeCarType ?? this.data.activeCarType,
          activeWorld: cloudData.activeWorld ?? this.data.activeWorld,
          activeTrack: cloudData.activeTrack ?? this.data.activeTrack,
          stats: cloudData.stats ?? this.data.stats,
          settings: cloudData.settings ?? this.data.settings
        };
        this.notify();
      } else {
        // First time cloud sync
        await this.syncToCloud(true);
      }
    } catch (e) {
      console.error('Failed to sync from cloud', e);
    } finally {
      this.isInitializing = false;
    }
  }

  private saveData() {
    try {
      localStorage.setItem('pastel_peak_racers_data', JSON.stringify(this.data));
      this.notify();
    } catch (e) {
      console.warn('Failed to write to localStorage', e);
    }

    if (auth.currentUser) {
      if (this.syncTimeout) clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncToCloud();
      }, 2000);
    }
  }

  private async syncToCloud(isCreation = false) {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      const payload: any = {
        coins: this.data.coins,
        xp: this.data.xp,
        level: this.data.level,
        activeColor: this.data.activeColor,
        activeCarType: this.data.activeCarType,
        activeWorld: this.data.activeWorld,
        activeTrack: this.data.activeTrack,
        stats: this.data.stats,
        settings: this.data.settings,
        updatedAt: serverTimestamp()
      };
      if (isCreation) {
        payload.createdAt = serverTimestamp();
      }
      await setDoc(docRef, payload, { merge: true });
    } catch (e) {
      console.error('Failed to sync to Firestore', e);
    }
  }

  getData(): PlayerData {
    return this.data;
  }

  addCoins(amount: number) {
    this.data.coins += amount;
    this.saveData();
  }

  addXp(amount: number) {
    this.data.xp += amount;
    const nextLevelXp = this.data.level * 1000;
    if (this.data.xp >= nextLevelXp) {
        this.data.xp -= nextLevelXp;
        this.data.level += 1;
    }
    this.saveData();
  }

  setColor(colorHex: number) {
    this.data.activeColor = colorHex;
    this.saveData();
  }

  setCarType(carType: 'cruiser' | 'sprinter' | 'tank') {
    this.data.activeCarType = carType;
    this.saveData();
  }

  setWorldAndTrack(worldId: string, trackId: string) {
    this.data.activeWorld = worldId;
    this.data.activeTrack = trackId;
    this.saveData();
  }

  upgradeStat(stat: keyof CarStats, cost: number): boolean {
    if (this.data.coins >= cost && this.data.stats[stat] < 5) {
      this.data.coins -= cost;
      this.data.stats[stat] += 1;
      this.saveData();
      return true;
    }
    return false;
  }

  updateSettings(newSettings: Partial<GameSettings>) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
  }

  setBooted() {
    this.data.hasBooted = true;
    this.saveData();
  }

  setLastRaceStats(stats: LastRaceStats) {
    this.data.lastRaceStats = stats;
    this.saveData();
  }

  // ─── New Character/Vehicle/Progression Methods ───

  setCharacter(id: string) {
    this.data.activeCharacter = id;
    this.saveData();
  }

  setVehicle(id: string) {
    this.data.activeVehicleId = id;
    this.saveData();
  }

  setDifficulty(d: '50cc' | '100cc' | '150cc') {
    this.data.difficulty = d;
    this.saveData();
  }

  setTestDrive(active: boolean, vehicleId?: string) {
    this.data.isTestDrive = active;
    if (vehicleId) {
        this.data.testDriveVehicleId = vehicleId;
    } else {
        this.data.testDriveVehicleId = undefined;
    }
    // Don't save test drive state to cloud or local storage persistently if we don't want to,
    // but for immediate UI reactivity we can just call notify without saveData, or
    // just call notify. We will call notify directly so it doesn't persist across reloads.
    this.notify();
  }

  addStars(amount: number) {
    this.data.stars = (this.data.stars || 0) + amount;
    this.saveData();
  }

  addGems(amount: number) {
    this.data.gems = (this.data.gems || 0) + amount;
    this.saveData();
  }

  unlockVehicle(id: string, cost: number, currency: 'coins' | 'gems'): boolean {
    if (!this.data.ownedVehicles) this.data.ownedVehicles = ['bubblegum_cruiser', 'lemon_buggy'];
    if (this.data.ownedVehicles.includes(id)) return false;
    
    if (currency === 'coins' && this.data.coins >= cost) {
      this.data.coins -= cost;
      this.data.ownedVehicles.push(id);
      this.saveData();
      return true;
    } else if (currency === 'gems' && (this.data.gems || 0) >= cost) {
      this.data.gems = (this.data.gems || 0) - cost;
      this.data.ownedVehicles.push(id);
      this.saveData();
      return true;
    }
    return false;
  }

  upgradeVehiclePart(vehicleId: string, part: 'turbo' | 'tires' | 'aero', cost: number): boolean {
    if (!this.data.vehicleUpgrades) this.data.vehicleUpgrades = {};
    if (!this.data.vehicleUpgrades[vehicleId]) {
      this.data.vehicleUpgrades[vehicleId] = { turbo: 0, tires: 0, aero: 0 };
    }
    const currentLevel = this.data.vehicleUpgrades[vehicleId][part];
    if (currentLevel >= 5) return false;
    if (this.data.coins < cost) return false;
    
    this.data.coins -= cost;
    this.data.vehicleUpgrades[vehicleId][part] = currentLevel + 1;
    this.saveData();
    return true;
  }

  getVehicleUpgradeLevel(vehicleId: string, part: 'turbo' | 'tires' | 'aero'): number {
    if (!this.data.vehicleUpgrades?.[vehicleId]) return 0;
    return this.data.vehicleUpgrades[vehicleId][part] || 0;
  }

  // ─── Original Race Records ───

  async saveRaceRecord(trackId: string, totalTimeMs: number, bestLapMs?: number) {
    if (this.data.isTestDrive) {
        console.log("Test drive completed, discarding race record and rewards.");
        return;
    }
    if (!this.data.records) this.data.records = {};
    if (!this.data.records[trackId]) {
       this.data.records[trackId] = { bestLap: null, topTimes: [] };
    }

    const currentCar = this.data.activeCarType;
    const recs = this.data.records[trackId];

    // Local stats update
    const newTotalRec: RaceRecord = { timeMs: totalTimeMs, carType: currentCar };
    recs.topTimes.push(newTotalRec);
    recs.topTimes.sort((a,b) => a.timeMs - b.timeMs);
    if (recs.topTimes.length > 5) recs.topTimes.pop();

    if (bestLapMs && bestLapMs < Infinity) {
        if (!recs.bestLap || bestLapMs < recs.bestLap.timeMs) {
            recs.bestLap = { timeMs: bestLapMs, carType: currentCar };
        }
    }
    this.saveData();

    // Push to cloud leaderboard if logged in
    const user = auth.currentUser;
    if (user) {
      try {
        const recordsRef = collection(db, 'raceRecords');
        await addDoc(recordsRef, {
          userId: user.uid,
          trackId,
          timeMs: totalTimeMs,
          carType: currentCar,
          recordType: 'total_race',
          createdAt: serverTimestamp()
        });

        if (bestLapMs && bestLapMs < Infinity) {
           await addDoc(recordsRef, {
             userId: user.uid,
             trackId,
             timeMs: bestLapMs,
             carType: currentCar,
             recordType: 'best_lap',
             createdAt: serverTimestamp()
           });
        }
      } catch(e) {
        console.error('Failed to save cloud record', e);
      }
    }

    // Also submit to v2 API mock
    try {
        await apiFetch('/races', {
            method: 'POST',
            body: JSON.stringify({
                track_id: trackId,
                lap_time_ms: bestLapMs || totalTimeMs,
                finish_position: newTotalRec.rank || 1 // Assuming 1 for simplicity here
            })
        });
    } catch(e) {
        console.error('Failed to save v2 API record', e);
    }
  }
}
