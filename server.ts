import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Server } from "socket.io";
import { createServer } from "http";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  
  // Socket.io for multiplayer racing
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });
  
  const players: Record<string, any> = {};

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    socket.on("join-race", (data) => {
       players[socket.id] = { id: socket.id, position: null, rotation: null, active: true, carType: data?.carType || 'cruiser' };
       // Tell everyone someone joined
       io.emit("players-update", players);
    });

    socket.on("player-update", (data) => {
       if (players[socket.id]) {
           players[socket.id] = { ...players[socket.id], ...data };
           // optimize: we could broadcast this in a tick instead of on every message
           socket.broadcast.emit("player-moved", players[socket.id]);
       }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      delete players[socket.id];
      io.emit("players-update", players);
    });
  });

  // Needed for large image payloads
  app.use(express.json({ limit: "50mb" }));

  // Initialize the Gemini API client
  let ai: GoogleGenAI | null = null;
  function getAI() {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // In-memory "database" for the game (for v2 local API representation)
  const db = {
    players: new Map<string, any>(),
    leaderboard: [] as any[],
  };

  // Simple JWT mockup middleware for the API contracts
  const authenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
          const token = authHeader.split(' ')[1];
          (req as any).user = { id: token.replace('mock-token-', '') };
          next();
      } else {
          res.sendStatus(401);
      }
  };

  // --- v2 API Contracts Implementation ---

  // Auth
  app.post('/v2/auth/register', (req, res) => {
      const { email, password } = req.body;
      const player_id = 'user_' + Date.now();
      db.players.set(player_id, {
          player_id,
          email,
          display_name: email.split('@')[0],
          coins: 500,
          gems: 0,
          active_vehicle_id: 'bubblegum_cruiser',
          owned_vehicles: ['bubblegum_cruiser', 'lemon_buggy'],
          vehicle_upgrades: {}
      });
      res.status(201).json({ player_id, access_token: 'mock-token-' + player_id, refresh_token: 'mock-refresh-' + player_id });
  });

  app.post('/v2/auth/login', (req, res) => {
      // Mock login, just return a token for an existing user or create a generic one
      const player_id = db.players.keys().next().value || 'user_123';
      if (!db.players.has(player_id)) {
          db.players.set(player_id, {
              player_id,
              display_name: 'Guest',
              coins: 500,
              gems: 0,
              active_vehicle_id: 'bubblegum_cruiser',
              owned_vehicles: ['bubblegum_cruiser', 'lemon_buggy'],
              vehicle_upgrades: {}
          });
      }
      res.json({ access_token: 'mock-token-' + player_id, refresh_token: 'mock-refresh-' + player_id, expires_in: 900 });
  });

  app.post('/v2/auth/refresh', (req, res) => {
      res.json({ access_token: 'mock-token-refreshed', expires_in: 900 });
  });

  // Players
  app.get('/v2/players/me', authenticateJWT, (req, res) => {
      const userId = (req as any).user.id;
      const player = db.players.get(userId);
      if (player) res.json(player);
      else res.status(404).json({ error: 'Player not found' });
  });

  app.patch('/v2/players/me', authenticateJWT, (req, res) => {
      const userId = (req as any).user.id;
      const isSafeUserId = typeof userId === 'string'
          && /^[a-zA-Z0-9_-]+$/.test(userId)
          && !['__proto__', 'constructor', 'prototype'].includes(userId);
      if (!isSafeUserId || !db.players.has(userId)) {
          return res.status(404).json({ error: 'Player not found' });
      }

      const player = db.players.get(userId);
      const updates = (req.body && typeof req.body === 'object') ? req.body : {};
      if (Object.prototype.hasOwnProperty.call(updates, 'display_name')) player.display_name = updates.display_name;
      if (Object.prototype.hasOwnProperty.call(updates, 'avatar_url')) player.avatar_url = updates.avatar_url;
      if (Object.prototype.hasOwnProperty.call(updates, 'active_vehicle_id')) player.active_vehicle_id = updates.active_vehicle_id;
      if (Object.prototype.hasOwnProperty.call(updates, 'owned_vehicles')) player.owned_vehicles = updates.owned_vehicles;
      if (Object.prototype.hasOwnProperty.call(updates, 'vehicle_upgrades')) player.vehicle_upgrades = updates.vehicle_upgrades;
      if (Object.prototype.hasOwnProperty.call(updates, 'coins')) player.coins = updates.coins;
      if (Object.prototype.hasOwnProperty.call(updates, 'gems')) player.gems = updates.gems;
      res.json(player);
  });

  app.delete('/v2/players/me', authenticateJWT, (req, res) => {
      const userId = (req as any).user.id;
      db.players.delete(userId);
      res.status(202).json({ job_id: 'del_' + Date.now() });
  });

  // Vehicles
  app.get('/v2/vehicles', authenticateJWT, (req, res) => {
      // Return a mock list of vehicles
      res.json([{ vehicle_id: 'bubblegum_cruiser', name: 'Bubblegum Cruiser', unlock_cost: 0 }, { vehicle_id: 'speed_demon', name: 'Speed Demon', unlock_cost: 150 }]);
  });

  app.post('/v2/vehicles/:id/unlock', authenticateJWT, (req, res) => {
      const userId = (req as any).user.id;
      const vehicleId = req.params.id;
      const player = db.players.get(userId);
      if (!player) return res.status(404).json({ error: 'Player not found' });

      if (!player.owned_vehicles.includes(vehicleId)) {
          player.owned_vehicles.push(vehicleId);
          player.coins -= 100; // Mock cost
      }
      res.json({ vehicle: vehicleId, new_balance: player.coins });
  });

  app.post('/v2/vehicles/:id/upgrade', authenticateJWT, (req, res) => {
      const userId = (req as any).user.id;
      const player = db.players.get(userId);
      if (!player) return res.status(404).json({ error: 'Player not found' });

      player.coins -= 50; // Mock cost
      res.json({ vehicle: req.params.id, new_balance: player.coins });
  });

  // Tracks & Races
  app.get('/v2/tracks', authenticateJWT, (req, res) => {
      res.json([{ track_id: 'sands_1', name: 'Soft Sands Oval' }]);
  });

  app.post('/v2/races', authenticateJWT, (req, res) => {
      const userId = (req as any).user.id;
      const player = db.players.get(userId);
      const { track_id, lap_time_ms, finish_position } = req.body;

      const coinsEarned = finish_position === 1 ? 500 : 100;
      if (player) player.coins += coinsEarned;

      if (lap_time_ms) {
          db.leaderboard.push({ player_id: userId, track_id, best_lap_ms: lap_time_ms, timestamp: Date.now() });
      }

      res.status(201).json({ race: req.body, rewards: { coins: coinsEarned }, new_rank: 1 });
  });

  app.get('/v2/leaderboard/:track_id', authenticateJWT, (req, res) => {
      const trackId = req.params.track_id;
      const entries = db.leaderboard
          .filter(e => e.track_id === trackId)
          .sort((a, b) => a.best_lap_ms - b.best_lap_ms)
          .slice(0, 100);
      res.json({ entries, player_rank: 1 });
  });

  // Shop
  app.get('/v2/shop/items', authenticateJWT, (req, res) => {
      res.json([{ item_id: 'skin_neon', name: 'Neon Skin', type: 'skin', rarity: 'epic', price: 500, currency: 'coins' }]);
  });

  app.post('/v2/shop/purchase', authenticateJWT, (req, res) => {
      const userId = (req as any).user.id;
      const player = db.players.get(userId);
      const { item_id } = req.body;

      if (player && player.coins >= 500) {
          player.coins -= 500;
          res.json({ item: item_id, new_balance: player.coins });
      } else {
          res.status(400).json({ error: 'Insufficient funds' });
      }
  });

  // API Route
  app.post("/api/analyze-landmark", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64 in request body" });
      }

      const client = getAI();

      // Ensure we only have the pure base64 string, remove data url prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      // 1. Identify landmark & get history using Gemini with Search Grounding
      const identificationPrompt = `
You are an expert AI tour guide.

Analyze the provided image and identify the landmark, monument, or point of interest.
If you know it, fetch its recent history and interesting facts using Google Search.
If it is just a generic building or indistinguishable, say "Unknown Landmark" and provide a generic short narration about appreciating architecture and looking closely.

Create a captivating, engaging tour guide narration script (approx 40-60 words) to be read aloud to the user right now as an AR experience. The script must be plain text suitable for TTS (avoid markdown, asterisks, or unpronounceable characters).
Also provide the name of the landmark.

Output ONLY valid JSON matching this schema:
{
  "name": "Landmark Name",
  "script": "The narration script here."
}`;

      let idRes;
      try {
        idRes = await client.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: [
             { inlineData: { mimeType: "image/jpeg", data: base64Data } },
             { text: identificationPrompt }
          ],
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                script: { type: Type.STRING },
              },
              required: ["name", "script"],
            },
          },
        });
      } catch (err) {
        console.error("Gemini landmark identification error:", err);
        return res.status(500).json({ error: "Failed to identify landmark." });
      }

      let parsedLine;
      try {
        const rawText = idRes.text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "");
        parsedLine = JSON.parse(rawText);
      } catch (e) {
        console.error("JSON parsing error:", e, idRes.text);
        parsedLine = { name: "Unknown Landmark", script: "Oh, it looks like I couldn't quite recognize this place. Try getting a bit closer or finding a better angle!" };
      }

      const { name, script } = parsedLine;

      // 2. Generate Audio TTS
      let audioBase64 = null;
      try {
        const audioRes = await client.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: script }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Puck" }, // Friendly voice
              },
            },
          },
        });
        audioBase64 = audioRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (audioErr) {
        console.error("Audio generation error:", audioErr);
        // We do not fail the whole request if audio fails, we can just return no audio
      }

      // Extract bounding search references if available
      const sources = idRes.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title,
      })).filter(Boolean);

      res.json({ name, script, audioBase64, sources });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: String(e.message || e) });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
