# Original Super Mario Kart Source Code (Gigaleak)

The Nintendo Gigaleak preserves a very substantial Super Mario Kart source archive.
It provides incredible insight into how the original game was architected. We are using these insights to refactor and improve our own React/Three.js kart racer.

## Key Architectural Takeaways

### 1. Main Runtime & Schedulers
The game uses a strict mode dispatcher (`kart-main.asm` and `kart-init.asm`), separating state transition requests (`game_selecta`) from the active runtime mode (`game_index`). NMI (VBlank) handlers are kept strictly separate from the main simulation loop.
* **Our implementation:** We will ensure `useHudStore` cleanly separates game state transitions from the `Engine.ts` simulation loop.

### 2. Table-Driven Course Data
Courses are not monolithic. They reuse themes (Circuit, Ghost Valley, Bowser Castle) by loading shared asset families (Characters, Tilemaps, Palettes) and applying a specific track layout.
* **Our implementation:** Our `TRACK_REGISTRY` already mirrors this by reusing `environment` properties while swapping `points` and geometry per-track. 

### 3. AI is Tactical, Not Just Path-Following
The AI in `kart-enemy.asm` uses a target buffer to steer, but its tactical state (`Check_drive_status`) evaluates:
- Current rank (1st vs 8th)
- Distance to player (rubber banding)
- Need to use items strategically
* **Our implementation:** We will expand our AI to evaluate player distance, rank, and aggressively weave to block the player or use items.

### 4. Audio Queuing
`kart-apu.asm` does not play sounds instantly. It buffers BGM requests and SFX (with pan metadata) into a queue, pulling them off systematically.
* **Our implementation:** We will refactor `AudioManager.ts` to queue sound effects, preventing overlapping audio blowout, and adding stereo panning based on 3D distance.

### 5. Collision as a Surface-State System
`BGcheck-p.asm` doesn't just stop the kart on collision; it returns a "surface state" that `kart-effect.asm` uses to trigger spins, jumps, slowdowns (off-road), or bounces.
* **Our implementation:** We will implement surface mapping (Road vs Sand vs Wall) on our tracks, affecting drag and top speed dynamically.

### 6. SRAM Data (Records)
The game saves a strict 20-byte record per course: `2` byte checksum, `5` top total times, `1` best lap time. Every entry stores the Time and the Character used.
* **Our implementation:** We will implement a `localStorage` record system tracking Top 5 Race Times and Best Lap Times per track ID.
