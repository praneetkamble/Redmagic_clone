import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, ShieldAlert, Cpu, Heart, Award, RefreshCw, Zap } from "lucide-react";

interface GameScore {
  name: string;
  fpsBase: number;
  fpsOverclock: number;
  resolution: string;
  settings: string;
  competitorRog: number;
  competitorLegion: number;
  highlightText: string;
}

const GAMES_ARMORY: GameScore[] = [
  {
    name: "Cyberpunk 2077",
    fpsBase: 112,
    fpsOverclock: 138,
    resolution: "2560x1600 (2.5K)",
    settings: "Ray Tracing Overdrive / DLSS Frame Gen On",
    competitorRog: 82,
    competitorLegion: 88,
    highlightText: "Path-traced sci-fi masterpiece running at fluid esports-grade double digit performance.",
  },
  {
    name: "Valorant",
    fpsBase: 420,
    fpsOverclock: 512,
    resolution: "2560x1600 (2.5K)",
    settings: "Competitive Preset / Raw Input Buffering On",
    competitorRog: 320,
    competitorLegion: 350,
    highlightText: "Zero lag fluid responsiveness maximizing the 300Hz display panel limit.",
  },
  {
    name: "Forza Horizon 5",
    fpsBase: 148,
    fpsOverclock: 172,
    resolution: "2560x1600 (2.5K)",
    settings: "Extreme Preset / Ray Tracing High / MSAA x4",
    competitorRog: 110,
    competitorLegion: 115,
    highlightText: "Photorealistic landscapes running at unmatched frame times with solid horizontal synchronization.",
  },
  {
    name: "GTA V",
    fpsBase: 185,
    fpsOverclock: 218,
    resolution: "2560x1600 (2.5K)",
    settings: "Ultra Graphic Preset / Smooth Shadows / MSAA x8",
    competitorRog: 140,
    competitorLegion: 145,
    highlightText: "Action-packed open world environments rendered smoothly at maximum render scale filters.",
  },
];

export default function PerformanceSection() {
  const [selectedGameIdx, setSelectedGameIdx] = useState(0);
  const [isOverclocked, setIsOverclocked] = useState(true);
  const [svgDataPoints, setSvgDataPoints] = useState<number[]>([]);
  const [sysTemp, setSysTemp] = useState(68);
  const [cpuUsage, setCpuUsage] = useState(45);

  const activeGame = GAMES_ARMORY[selectedGameIdx];

  // Dynamic SVG Chart Oscilloscope Points Generator
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setSvgDataPoints((prev) => {
        const nextPoints = [...prev];
        const amplitude = isOverclocked ? 25 : 15;
        const baseline = isOverclocked ? 65 : 45;
        const newValue = baseline + Math.sin(tick * 0.4) * amplitude + Math.cos(tick * 0.95) * (amplitude * 0.3) + (Math.random() * 8 - 4);
        nextPoints.push(Math.max(10, Math.min(100, newValue)));
        if (nextPoints.length > 25) {
          nextPoints.shift();
        }
        return nextPoints;
      });

      // Fluctuate thermal state slightly based on clock multipliers
      setSysTemp((prev) => {
        const targetTemp = isOverclocked ? 78 : 62;
        const diff = targetTemp - prev;
        return Number((prev + diff * 0.1 + (Math.random() * 0.6 - 0.3)).toFixed(1));
      });

      // Fluctuate simulated CPU state
      setCpuUsage((prev) => {
        const targetCpu = isOverclocked ? 92 : 68;
        const diff = targetCpu - prev;
        return Number((prev + diff * 0.15 + (Math.random() * 4 - 2)).toFixed(0));
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isOverclocked]);

  const toggleOverclock = () => {
    setIsOverclocked(!isOverclocked);
  };

  const getFPS = () => {
    return isOverclocked ? activeGame.fpsOverclock : activeGame.fpsBase;
  };

  // Convert array points to SVG Polyline stream coordinates
  const getPolylinePoints = () => {
    const width = 450;
    const height = 120;
    const padding = 10;
    const totalPoints = svgDataPoints.length;
    if (totalPoints < 2) return "";

    return svgDataPoints
      .map((p, idx) => {
        const x = (idx / (totalPoints - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - (p / 100) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <section className="relative bg-[#050505] py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5" id="performance-arena">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-[25%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Floor Detail */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="text-left space-y-3">
            <span className="inline-block text-[11px] font-mono tracking-widest text-purple-400 bg-purple-950/20 border border-purple-500/25 px-2.5 py-1 rounded-sm">
              BENCHMARK LAB // PERFORMANCE LAB
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-white tracking-tight leading-none italic font-black uppercase">
              DIABOLIC{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                OVERCLOCK CLOCKS
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl font-sans">
              Compare framerates across triple-A titles in high-fidelity 2.5K resolution. Arm your system and overclock live clocks below.
            </p>
          </div>

          {/* Gamified Overclock Controller trigger button */}
          <div className="flex items-center gap-4 bg-black/60 border border-white/5 p-4 rounded-sm backdrop-blur-md self-start lg:self-auto min-w-[280px]">
            <div className="flex-1 text-left">
              <span className="text-[10px] font-mono text-gray-500 block uppercase">SYSTEM MULTIPLIER</span>
              <span className={`text-sm font-display font-bold block transition-colors ${isOverclocked ? "text-cyan-400 glow-cyan" : "text-gray-400"}`}>
                {isOverclocked ? "DIABOLIC MODE: ACTIVE" : "BALANCED MODE"}
              </span>
            </div>
            <button
              onClick={toggleOverclock}
              className={`relative px-4 py-2.5 rounded-sm font-mono text-xs tracking-wider cursor-pointer border transition-all duration-300 flex items-center gap-1.5 ${
                isOverclocked
                  ? "bg-red-500/10 text-red-500 border-red-500/40 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                  : "bg-cyan-500 text-black font-bold border-cyan-400 hover:bg-cyan-400 glow-box-cyan"
              }`}
            >
              <Zap size={13} className={isOverclocked ? "animate-bounce" : ""} />
              {isOverclocked ? "DEACTIVATE" : "OVERCLOCK"}
            </button>
          </div>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          {/* LEFT SIDE PANEL - GAMES ARMORY TABS */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h4 className="text-[11px] font-mono tracking-widest text-gray-500 uppercase text-left mb-1">
              Select GPU Software
            </h4>
            {GAMES_ARMORY.map((game, idx) => {
              const isActive = selectedGameIdx === idx;
              return (
                <button
                  key={game.name}
                  onClick={() => setSelectedGameIdx(idx)}
                  className={`p-4 rounded-sm text-left transition-all duration-300 border backdrop-blur-sm cursor-pointer relative ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-950/20 to-black/40 text-white border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                      : "bg-[#0b0b13]/60 text-gray-400 border-white/5 hover:border-cyan-500/20 hover:text-cyan-400"
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1/2 rounded-r bg-gradient-to-b from-cyan-400 to-purple-500" />
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-display font-medium text-base">{game.name}</span>
                    <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-sm text-gray-400">
                      {isOverclocked ? game.fpsOverclock : game.fpsBase} FPS
                    </span>
                  </div>
                  <span className="text-xs font-sans text-gray-500 mt-1 block truncate">
                    {game.settings}
                  </span>
                </button>
              );
            })}

            {/* Little thermal warnings inside the side navigation */}
            <div className={`p-4 rounded-sm border text-left flex items-start gap-3 transition-colors ${
              isOverclocked ? "bg-red-950/20 border-red-500/20 text-red-400" : "bg-cyan-950/20 border-cyan-500/20 text-cyan-400"
            }`}>
              <ShieldAlert className="flex-shrink-0 mt-0.5 animate-pulse" size={16} />
              <div className="space-y-1">
                <h5 className="font-mono text-xs font-bold leading-none">
                  {isOverclocked ? "OVERCLOCK VOLTAGE ACTIVE" : "COOLING SYSTEM OPTIMIZED"}
                </h5>
                <p className="text-[11px] font-sans text-gray-400 leading-normal">
                  {isOverclocked 
                    ? "Advanced chip settings running at 1.45V peak. Cooling fan system is forced to absolute turbulences."
                    : "Standard voltages loaded. Fan RPM dynamically regulated. Quiet and responsive e-sports action."}
                </p>
              </div>
            </div>
          </div>

          {/* MAIN GRAPHICS LAB - CENTER PIECE CARD */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 md:p-8 rounded-sm border border-white/5 bg-[#09090f]/75 backdrop-blur-md relative overflow-hidden">
            {/* Ambient glows inside card */}
            <div className={`absolute top-0 right-0 w-44 h-44 rounded-full blur-[80px] pointer-events-none transition-all duration-500 ${
              isOverclocked ? "bg-red-500/10" : "bg-cyan-500/10"
            }`} />

            <div className="space-y-6">
              {/* Card Title Header details of active game */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 block tracking-widest uppercase">
                    LIVE RENDERING ENVIRONMENT
                  </span>
                  <h3 className="text-2xl font-display font-medium text-white">{activeGame.name}</h3>
                  <p className="text-xs font-sans text-gray-400">{activeGame.settings}</p>
                </div>

                <div className="text-right flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-sm">
                  <div className="text-left">
                    <span className="text-[9px] font-mono text-gray-500 block uppercase">RESOLUTION</span>
                    <span className="text-xs font-mono text-white block font-bold">{activeGame.resolution}</span>
                  </div>
                  <div className="w-1.5 h-8 bg-cyan-500/20 rounded-sm overflow-hidden">
                    <motion.div animate={{ height: ["10%", "90%", "30%"] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-full bg-cyan-400" />
                  </div>
                </div>
              </div>

              {/* ACTIVE FPS DIAL DISPLAY */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* Ring graphics */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.02)" strokeWidth="4" fill="none" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke={isOverclocked ? "#06b6d4" : "#a855f7"}
                        strokeWidth="5"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * Math.min(getFPS(), 512)) / 550}
                        strokeLinecap="round"
                        fill="none"
                        transition={{ duration: 1 }}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">
                        ACTIVE FPS
                      </span>
                      <span className="text-4xl font-mono text-white font-black tracking-tight my-0.5 leading-none">
                        {getFPS()}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-950/40 px-1.5 py-0.5 rounded-sm leading-none">
                        {isOverclocked ? "+22% STABLE" : "OPTIMAL"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* REAL-TIME SIMULATED GPU LINE GRAPH / CHART */}
                <div className="md:col-span-8 space-y-2 text-left">
                  <h5 className="text-[11px] font-mono tracking-widest text-[#06b6d4] uppercase flex items-center gap-1">
                    <Activity size={12} className="text-cyan-400 animate-pulse" />
                    SIM MULTIPLEXER FRAME TIME CLOCKS (OSCILLOSCOPE)
                  </h5>

                  {/* SVG frame container for polyline chart */}
                  <div className="w-full bg-black/60 border border-white/5 h-28 rounded-sm relative overflow-hidden p-1">
                    <div className="absolute inset-0 flex flex-col justify-between p-1.5 text-[8px] font-mono text-gray-600 pointer-events-none">
                      <div>512 FPS limit</div>
                      <div>256 FPS baseline</div>
                      <div>0 ms delayed</div>
                    </div>
                    
                    <svg className="w-full h-full" viewBox="0 0 450 120" preserveAspectRatio="none">
                      {/* Grid guideline background inside chart */}
                      <line x1="0" y1="30" x2="450" y2="30" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
                      <line x1="0" y1="60" x2="450" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />
                      <line x1="0" y1="90" x2="450" y2="90" stroke="rgba(255,255,255,0.03)" strokeDasharray="3" />

                      {/* Oscilloscope core polyline */}
                      <polyline
                        fill="none"
                        stroke={isOverclocked ? "url(#cyan-grad)" : "url(#purple-grad)"}
                        strokeWidth="2"
                        points={getPolylinePoints()}
                        className="transition-all duration-150"
                      />

                      <defs>
                        <linearGradient id="cyan-grad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="purple-grad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>

              {/* COMPETITOR BENCHMARK SLIDER BARS */}
              <div className="space-y-3.5 border-t border-white/5 pt-5 text-left">
                <h5 className="text-[11px] font-mono tracking-widest text-[#06b6d4] uppercase">
                  HIGH RESOLUTION BENCHMARK COMPARISON
                </h5>

                <div className="space-y-2.5">
                  {/* REDMAGIC BAR */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-display font-medium text-white flex items-center gap-1.5 font-bold">
                        REDMAGIC Titan 16 Pro
                        <span className="text-[9px] font-mono bg-cyan-950/40 text-cyan-400 px-1.5 rounded-sm uppercase border border-cyan-500/20 animate-pulse">
                          ULTIMATE POWER
                        </span>
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">{getFPS()} FPS</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-sm overflow-hidden relative border border-white/5">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${(getFPS() / 520) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                      />
                    </div>
                  </div>

                  {/* LEGION BAR */}
                  <div className="space-y-1 opacity-70">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-display text-gray-300">Lenovo Legion Pro 7 (4070)</span>
                      <span className="font-mono text-gray-400">{activeGame.competitorLegion} FPS</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-sm overflow-hidden">
                      <div style={{ width: `${(activeGame.competitorLegion / 600) * 100}%` }} className="h-full bg-gray-600" />
                    </div>
                  </div>

                  {/* ROG BAR */}
                  <div className="space-y-1 opacity-70">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-display text-gray-300">ASUS ROG Strix G16 (4070)</span>
                      <span className="font-mono text-gray-400">{activeGame.competitorRog} FPS</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-sm overflow-hidden">
                      <div style={{ width: `${(activeGame.competitorRog / 600) * 100}%` }} className="h-full bg-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER TECHNICAL STATE METERS */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/5 mt-6 pt-5 text-left text-xs font-mono">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">CORE TEMP</span>
                <span className={`font-mono text-sm block font-bold transition-colors ${isOverclocked ? "text-red-500" : "text-cyan-400"}`}>
                  {sysTemp}°C
                </span>
                <span className="text-[9px] text-gray-600">LIQUID COMPONENT</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">OVERALL TGP</span>
                <span className="text-sm block text-white font-bold">
                  {isOverclocked ? "175W MAX" : "115W SAV"}
                </span>
                <span className="text-[9px] text-gray-600">DYNAMIC POWER LIMIT</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">CPU FREQUENCY</span>
                <span className="text-sm block text-purple-400 font-bold">
                  {isOverclocked ? "5.82 GHz" : "4.15 GHz"}
                </span>
                <span className="text-[9px] text-gray-600">OVERCLOCK STATUS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
