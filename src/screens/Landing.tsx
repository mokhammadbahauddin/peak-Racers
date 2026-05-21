import React, { useEffect, useState } from "react";
import { GameDataManager, PlayerData } from "../game/GameData";
import { motion } from "motion/react";

export const Landing = ({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) => {
  const [data, setData] = useState<PlayerData | null>(null);

  useEffect(() => {
    const manager = GameDataManager.getInstance();
    setData(manager.getData());
    const unsub = manager.subscribe(setData);
    return unsub;
  }, []);

  const getNextGoal = () => {
    if (!data) return "Ready to Race";
    const racesCompleted = Object.keys(data.records || {}).length;
    if (racesCompleted === 0) return "Goal: Finish First Race";

    const noUpgrades =
      data.stats.speedLevel === 1 &&
      data.stats.handlingLevel === 1 &&
      data.stats.armorLevel === 1;
    if (noUpgrades) return "Goal: Buy First Upgrade";

    if (data.coins < 2500) return "Goal: Collect 2,500 Coins";
    return "Goal: Unlock New Vehicle";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <main className="h-screen w-full flex flex-col items-center justify-between relative z-10 overflow-hidden text-slate-800">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[-1] scale-110"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida/ADBb0ui_PqVQ3jbNeaWDFSawC0lGMuPKGEgcgskcMCrHHKnH1quwoxBuVgsn0bG2KiF2VLGK2WT7JcVfLW2y0YD0F96uN72aAmmwmh8gYQPzUz2o5u-_8PiEixhQIxxOzq_mx5pwg2aVtuTpPWseCXd8wZ_AM8nAKi3L0iKiHKwlSuSShvNe5aYdFalLX53pZe6j328Qmz7dcR72aAuOx_m0QPRCNIqSwg5TDqYFQ2tFOO4lDKFmWnTxL52_JNc')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px) brightness(1.1)",
        }}
      />

      {/* Top Right HUD */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-6 right-6 flex gap-4 items-center z-20"
      >
        <div className="glass-panel flex-row rounded-full py-1 px-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold shadow-inner">
            L{data?.level || 1}
          </div>
          <div className="text-sm font-bold text-slate-500 mr-2 flex flex-col justify-center h-full">
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400"
                style={{
                  width: `${((data?.xp || 0) / ((data?.level || 1) * 1000)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="glass-panel flex-row rounded-full py-1 px-3 flex items-center gap-2">
          <img
            alt="Currency icon"
            className="w-8 h-8 object-cover rounded-full mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida/ADBb0uhgoHsIgKZd8j_8QdbUhF5iwhFZngFtl-BMk2MQy143P1KowKko3z2-nMcL2-IEzFzVjmozWCBzwsvN-JgDVRDnTd9WNKFZyTNaopJDJfetdH-_IhIl7XrXxhwZ8Lhb8tn-JUqEpgbXCZ7CneXqriMQPwJejt7829Dk8hleYL1f5vQdHmuxhpNkQpW1Yl-P1glziDf3PFkk-PtY2R3xIGp-uGu8Kia-YJxOeTg3D-29It5-zRxPgDCbHv6g"
          />
          <span className="font-title-md text-xl text-primary font-bold mr-2">
            {data?.coins?.toLocaleString() || "0"}
          </span>
        </div>
        <div
          className="glass-panel rounded-full p-1 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onNavigate("auth")}
        >
          <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-800 overflow-hidden">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "28px" }}
            >
              account_circle
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="h-full w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-20 relative z-10 max-w-7xl mx-auto"
      >
        {/* Left: Branding */}
        <motion.div
          variants={itemVariants}
          className="w-full md:w-1/4 flex flex-col items-start justify-center pt-20 md:pt-0 pointer-events-none"
        >
          <h1 className="font-display-lg text-5xl md:text-7xl font-extrabold text-primary drop-shadow-md leading-tight">
            PASTEL
            <br />
            PEAK
            <br />
            RACERS
          </h1>
          <p className="font-body-lg text-lg text-slate-700 font-bold mt-4 max-w-[200px] opacity-80 mix-blend-multiply">
            Start your engines in the dreamscape.
          </p>
        </motion.div>

        {/* Center: Hero Car Image */}
        <motion.div
          variants={itemVariants}
          className="w-full md:w-2/4 h-[50vh] md:h-full flex items-center justify-center relative"
        >
          <div className="absolute w-[80%] aspect-square bg-pink-200 rounded-full opacity-30 blur-3xl shadow-[0_0_40px_rgba(255,209,220,0.6)] z-0"></div>
          <img
            alt="Hero car"
            className="w-full max-w-[500px] object-contain z-10 drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
            src="https://lh3.googleusercontent.com/aida/ADBb0ui4WIB4RlG_kDmat1OUpRzMKLmE-LeDcuhHrlu0wHwXjkAmp2Cigxdc9tJaWdvqGJ-SLsYbCX0WTol1x2MiDrYqpkBRHz6KxdanJydjAl7Z8cY2lHufVHVKcp2uBcvPI8JZUbk6_hETOtlcyxvcc8S6V2_Yl9t0Pq2arW2qS4B4brBMBQieo3Kbvx4FdkCBu0MHSXhj99FmrBpTTIg0JVFGu0ymH8texK45Mm1LEDC866V5g5KB8AWnGJ_W"
          />
        </motion.div>

        {/* Right: Navigation Stack */}
        <motion.div
          variants={itemVariants}
          className="w-full md:w-[35%] flex flex-col gap-4 items-end justify-center pb-20 md:pb-0 z-20"
        >
          <div className="flex flex-col w-full gap-2 items-end">
            <button
              onClick={() => onNavigate("character-selection")}
              className="glass-button w-full py-8 px-10 rounded-[2rem] flex-row items-center justify-between group bg-pink-500/20 border-pink-500/40 text-primary shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] transition-all"
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-headline-lg text-4xl font-black tracking-widest drop-shadow-sm">
                  RACE NOW
                </span>
                <span className="text-sm font-bold text-pink-600 uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                  Enter the Dreamscape
                </span>
              </div>
              <span
                className="material-symbols-outlined text-pink-500 group-hover:translate-x-2 transition-transform drop-shadow-md"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "48px" }}
              >
                play_circle
              </span>
            </button>
            <div
              className="bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl px-6 py-3 flex items-center justify-between w-full shadow-sm"
              style={{ animation: "float 6s ease-in-out infinite" }}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  flag
                </span>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Next Step
                </span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-xl">
                <span className="text-sm font-black text-indigo-600 tracking-tight">
                  {getNextGoal()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <button
              onClick={() => onNavigate("grand-prix")}
              className="glass-button flex-col py-4 px-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-white/60"
            >
              <span className="material-symbols-outlined text-3xl text-amber-500 group-hover:scale-110 transition-transform">
                emoji_events
              </span>
              <span className="font-title-md text-sm font-bold text-slate-700">
                GRAND PRIX
              </span>
            </button>

            <button
              onClick={() => onNavigate("garage")}
              className="glass-button flex-col py-4 px-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-white/60"
            >
              <span className="material-symbols-outlined text-3xl text-sky-500 group-hover:scale-110 transition-transform">
                directions_car
              </span>
              <span className="font-title-md text-sm font-bold text-slate-700">
                GARAGE
              </span>
            </button>

            <button
              onClick={() => onNavigate("shop")}
              className="glass-button flex-col py-4 px-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-white/60"
            >
              <span className="material-symbols-outlined text-3xl text-emerald-500 group-hover:scale-110 transition-transform">
                storefront
              </span>
              <span className="font-title-md text-sm font-bold text-slate-700">
                SHOP
              </span>
            </button>

            <button
              onClick={() => onNavigate("leaderboard")}
              className="glass-button flex-col py-4 px-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-white/60"
            >
              <span className="material-symbols-outlined text-3xl text-purple-500 group-hover:scale-110 transition-transform">
                leaderboard
              </span>
              <span className="font-title-md text-sm font-bold text-slate-700">
                STANDINGS
              </span>
            </button>

            <button
              onClick={() => onNavigate("howtoplay")}
              className="glass-button flex-col py-4 px-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-white/60"
            >
              <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:scale-110 transition-transform">
                help
              </span>
              <span className="font-title-md text-sm font-bold text-slate-600">
                HOW TO PLAY
              </span>
            </button>

            <button
              onClick={() => onNavigate("settings")}
              className="glass-button flex-col py-4 px-4 rounded-2xl flex items-center justify-center gap-2 group hover:bg-white/60"
            >
              <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:scale-110 transition-transform">
                settings
              </span>
              <span className="font-title-md text-sm font-bold text-slate-600">
                SETTINGS
              </span>
            </button>
          </div>


        </motion.div>
      </motion.div>
    </main>
  );
};
