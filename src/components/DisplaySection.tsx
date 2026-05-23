import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sun, ShieldAlert, Monitor, ChevronRight, Sparkles } from "lucide-react";
import displayScreenImg from "../assets/images/input_file_1_1779536812575.png";

export default function DisplaySection() {
  const [refreshRate, setRefreshRate] = useState<60 | 144 | 300>(300);
  const [colorProfile, setColorProfile] = useState<"dcip3" | "srgb" | "cyber">("cyber");
  const [bulletX, setBulletX] = useState(0);

  // Animate the refresh crosshair indicator
  useEffect(() => {
    let speed = refreshRate === 60 ? 3 : refreshRate === 144 ? 5 : 8;
    let dir = 1;
    const interval = setInterval(() => {
      setBulletX((prev) => {
        if (prev > 96) {
          dir = -1;
          return 96;
        }
        if (prev < 4) {
          dir = 1;
          return 4;
        }
        return prev + speed * dir;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [refreshRate]);

  // Handle CSS filters based on Color profiles
  const getImageFilter = () => {
    if (colorProfile === "dcip3") {
      return "contrast-[1.12] saturate-[1.25] brightness-[1.05]";
    } else if (colorProfile === "srgb") {
      return "contrast-[0.98] saturate-[1.0] brightness-[1.0]";
    } else {
      return "contrast-[1.3] saturate-[1.6] hue-rotate-[10deg] brightness-[1.15]";
    }
  };

  return (
    <section className="relative bg-[#050505] py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5" id="display-quantum">
      {/* Background Cyber Glow Details */}
      <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COMPONENT - IMAGE PANEL FOR DISPLAY */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative border border-cyan-500/25 bg-black/60 p-4 rounded-sm backdrop-blur-md overflow-hidden shadow-2xl space-y-4">
            {/* Top status header */}
            <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-cyan-400 animate-spin duration-3000" />
                DCI-P3 100% CINEMATIC RANGE
              </span>
              <span>SCREEN GAIN: +500 NITS</span>
            </div>

            {/* Glowing border outline reflecting display color profile */}
            <div className={`p-1 rounded-sm border transition-all duration-500 ${
              colorProfile === "cyber" ? "border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-pink-950/5" :
              colorProfile === "dcip3" ? "border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-cyan-950/5" : "border-white/5"
            }`}>
              <div className="relative rounded-sm overflow-hidden aspect-video bg-black flex items-center justify-center">
                <img
                  src={displayScreenImg}
                  alt="300Hz Display stealth jet popping out of the screen"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover select-none transition-all duration-700 ease-out ${getImageFilter()}`}
                />

                {/* Backlight reflection indicators inside screen corners */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-black/85 border border-[#06b6d4]/40 text-[9px] font-mono text-[#06b6d4] tracking-widest uppercase">
                  {colorProfile.toUpperCase()} VIEW
                </div>
              </div>
            </div>

            {/* Bezel reflections & controller */}
            <div className="grid grid-cols-3 gap-3">
              {(["cyber", "dcip3", "srgb"] as const).map((prof) => (
                <button
                  key={prof}
                  onClick={() => setColorProfile(prof)}
                  className={`px-3 py-2.5 rounded-sm text-[10px] font-mono uppercase tracking-widest text-center border transition-all duration-300 cursor-pointer ${
                    colorProfile === prof
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-sm font-bold"
                      : "bg-[#0b0b14]/50 text-gray-500 border-white/5 hover:border-cyan-500/20 hover:text-cyan-400"
                  }`}
                >
                  {prof === "cyber" && "⚡ CYBER VIBRANT"}
                  {prof === "dcip3" && "🎬 CREATOR DCI-P3"}
                  {prof === "srgb" && "💻 STANDARD sRGB"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT - CONTROLS & COMPARISONS */}
        <div className="lg:col-span-5 text-left space-y-6 md:space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-[#06b6d4] bg-cyan-950/30 px-2.5 py-1 rounded-sm border border-cyan-500/20">
              <Monitor size={12} className="text-cyan-400" />
              INTELLIGENT RETINA SYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-white tracking-tight leading-tight italic font-black uppercase">
              300Hz FLUID <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                E-SPORTS CANVAS
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
              Experience gameplay with absolutely zero tearing, ghosting, or stuttering. Armed with a 16:10 aspect ratio and 2.5K pixel resolution, you see your enemy frames before they even realize you've fired.
            </p>
          </div>

          {/* DYNAMIC SHUTTER COMPARATOR */}
          <div className="space-y-3 border-t border-b border-white/5 py-5 text-left">
            <div className="flex justify-between items-center mb-1">
              <h5 className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
                Active Frame Rate Comparator
              </h5>
              <span className="text-[10px] font-mono text-gray-500">
                INTERVALS: {refreshRate}Hz
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {([60, 144, 300] as const).map((hz) => (
                <button
                  key={hz}
                  onClick={() => setRefreshRate(hz)}
                  className={`py-2 rounded-sm font-mono text-xs tracking-wider border transition-all duration-300 cursor-pointer ${
                    refreshRate === hz
                      ? "bg-[#06b6d4] border-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      : "bg-[#0b0b14]/50 border-white/5 text-gray-400 hover:border-cyan-400/30 hover:text-cyan-400"
                  }`}
                >
                  {hz} Hz
                </button>
              ))}
            </div>

            {/* Slider visual trace area */}
            <div className="pt-2">
              <div className="relative w-full h-10 border border-white/5 bg-[#05050c] rounded-sm flex items-center p-1 overflow-hidden">
                {/* Simulated ghost coordinates behind target */}
                {refreshRate === 60 && (
                  <>
                    <div className="absolute w-2 h-2 rounded-sm bg-cyan-500/20" style={{ left: `${Math.max(4, bulletX - 15)}%` }} />
                    <div className="absolute w-2 h-2 rounded-sm bg-cyan-500/10" style={{ left: `${Math.max(4, bulletX - 30)}%` }} />
                  </>
                )}
                {refreshRate === 144 && (
                  <div className="absolute w-2.5 h-2.5 rounded-sm bg-cyan-500/20" style={{ left: `${Math.max(4, bulletX - 8)}%` }} />
                )}

                {/* Primary moving target item */}
                <div
                  className="absolute w-3.5 h-3.5 rounded-sm bg-cyan-400 transition-all duration-75 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ left: `${bulletX}%` }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">
                    {refreshRate === 60 ? "STUTTER / HIGH GHOST GAPS" : refreshRate === 144 ? "MEDIUM ESPORTS RESPONSE" : "ELITE SILK VECTOR MULTIPLEX"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-xs font-mono text-gray-500 justify-between">
            <span className="flex items-center gap-1 text-left">
              <Sun size={12} className="text-cyan-400" />
              500 NITS MAX HDR
            </span>
            <span className="text-right">CONTRAST 1200:1</span>
          </div>
        </div>
      </div>
    </section>
  );
}
