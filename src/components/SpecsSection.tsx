import { useState } from "react";
import { motion } from "motion/react";
import { Cpu, Zap, Activity, Wind, Network, Keyboard, Monitor, Layers, HardDrive } from "lucide-react";

interface SpecDetail {
  id: string;
  title: string;
  category: string;
  stat: string;
  subStat: string;
  icon: any;
  glowColor: "cyan" | "purple" | "pink";
  visualType: "frequency" | "gpu" | "hz" | "airflow" | "speed" | "rgb" | "display" | "ram" | "ssd";
}

const SPEC_DETAILS: SpecDetail[] = [
  {
    id: "cpu",
    category: "SILICON ARCHITECTURE",
    title: "Intel Core i9-14900HX",
    stat: "5.8 GHz",
    subStat: "24 Cores / 32 Threads / 36MB Cache",
    icon: Cpu,
    glowColor: "cyan",
    visualType: "frequency",
  },
  {
    id: "gpu",
    category: "PIXEL ACCELERATION",
    title: "RTX 4070 / 5080 Laptop GPU",
    stat: "175W TGP",
    subStat: "NVIDIA DLSS 3.5 / Ray Reconstruction",
    icon: Zap,
    glowColor: "purple",
    visualType: "gpu",
  },
  {
    id: "display_refresh",
    category: "ULTRA FLUID REFRESH",
    title: "300Hz Refresh Rate",
    stat: "3 ms Response",
    subStat: "DCI-P3 100% / G-Sync Synchronized",
    icon: Activity,
    glowColor: "pink",
    visualType: "hz",
  },
  {
    id: "cooling",
    category: "THERMAL ARMOR ENGINE",
    title: "Vapor Chamber cooling",
    stat: "0dB Passive Mode",
    subStat: "Liquid Metal Contact / Dual Core Fans",
    icon: Wind,
    glowColor: "cyan",
    visualType: "airflow",
  },
  {
    id: "inputports",
    category: "HIGH RANGE PIPELINES",
    title: "Thunderbolt 5 Integrated",
    stat: "120 Gbps",
    subStat: "Full DisplayPort 2.1 & 240W Charging",
    icon: Network,
    glowColor: "purple",
    visualType: "speed",
  },
  {
    id: "rgbkeys",
    category: "MECHANIZED KEY DECK",
    title: "Full Per-Key ARGB Keyboard",
    stat: "16.8M Colors",
    subStat: "Dynamic Ripple Waves & Anti-Ghosting",
    icon: Keyboard,
    glowColor: "pink",
    visualType: "rgb",
  },
  {
    id: "display_res",
    category: "CYBER COLOUR PANEL",
    title: "2.5K Display Layout",
    stat: "2560 x 1600",
    subStat: "16:10 Ratio / 500 nits High Brightness",
    icon: Monitor,
    glowColor: "cyan",
    visualType: "display",
  },
  {
    id: "memory",
    category: "BUFFER CHIPS ARCH",
    title: "64GB DDR5 RAM",
    stat: "5600 MT/s",
    subStat: "Dual-Channel / Expandable to 128GB",
    icon: Layers,
    glowColor: "purple",
    visualType: "ram",
  },
  {
    id: "storage",
    category: "SOLID STATE VOLTAGE",
    title: "2TB PCIe 4.0 NVMe SSD",
    stat: "7400 MB/s",
    subStat: "Dual M.2 Slot Layout / Max RAID support",
    icon: HardDrive,
    glowColor: "pink",
    visualType: "ssd",
  },
];

export default function SpecsSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Dynamic Card Visualizer Components (Mini-Charts / Indicators)
  const renderCardVisual = (type: string, glow: string, isHovered: boolean) => {
    switch (type) {
      case "frequency":
        return (
          <div className="w-full flex items-end justify-between h-8 mt-2 px-1 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[9px] font-mono tracking-widest ${isHovered ? "text-cyan-400" : "text-gray-600"} transition-colors`}>
                DIABOLIC STABLE
              </span>
            </div>
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [
                    "20%",
                    `${Math.min(100, Math.max(30, 60 + Math.sin(i + (hoveredId ? 10 : 2)) * 35))}%`,
                    "20%",
                  ],
                }}
                transition={{
                  duration: i % 2 === 0 ? 1.4 : 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`w-1 rounded-sm ${
                  glow === "cyan" ? "bg-cyan-500/80" : glow === "purple" ? "bg-purple-500/80" : "bg-pink-500/80"
                }`}
              />
            ))}
          </div>
        );
      case "gpu":
        return (
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2 relative">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "100%" : "85%" }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
            <div className="absolute top-0 right-1/4 bottom-0 w-0.5 bg-white/60" />
          </div>
        );
      case "hz":
        return (
          <div className="w-full h-8 flex items-center justify-center mt-2 border border-white/5 bg-[#07070d] rounded px-2 overflow-hidden">
            <div className="text-[10px] font-mono text-pink-500 tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
              <span>300FPS REAL-TIME DELAY: 0.003s</span>
            </div>
          </div>
        );
      case "airflow":
        return (
          <div className="w-full flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((b) => (
              <div key={b} className="flex-1 h-3 border border-white/5 bg-[#05050a] rounded-sm flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{
                    opacity: [0.1, 0.9, 0.1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: b * 0.15,
                  }}
                  className="w-1 h-1 rounded-full bg-cyan-400"
                />
              </div>
            ))}
          </div>
        );
      case "speed":
        return (
          <div className="w-full text-left font-mono text-[9px] text-gray-500 bg-black/40 border border-white/5 rounded p-1.5 mt-2 space-y-0.5 leading-none">
            <div>&gt; INTR TRSF: CONNECTED.SYS</div>
            <div className={isHovered ? "text-purple-400" : "text-gray-500"}>
              &gt; BANDW: 120.000 MBPS STABLE
            </div>
          </div>
        );
      case "rgb":
        return (
          <div className="w-full flex gap-1 mt-2.5">
            {["#06b6d4", "#a855f7", "#ec4899", "#ef4444", "#3b82f6"].map((col, idx) => (
              <motion.div
                key={idx}
                animate={{
                  scaleY: isHovered ? [1, 1.4, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  repeat: isHovered ? Infinity : 0,
                  delay: idx * 0.08,
                }}
                style={{ backgroundColor: col }}
                className="flex-1 h-2 rounded-sm"
              />
            ))}
          </div>
        );
      case "display":
        return (
          <div className="w-full flex justify-between text-[10px] font-mono text-cyan-400/80 mt-2 px-1 border-t border-cyan-500/10 pt-1.5">
            <span>COL: 1.07B colors</span>
            <span>RATIO: 16:10</span>
          </div>
        );
      case "ram":
        return (
          <div className="w-full grid grid-cols-2 gap-1.5 mt-2 text-center text-[10px] font-mono">
            <div className="bg-[#0b0b14] py-1 border border-white/5 text-purple-400 rounded">
              CH_A: ACTIVE
            </div>
            <div className="bg-[#0b0b14] py-1 border border-white/5 text-purple-400 rounded">
              CH_B: ACTIVE
            </div>
          </div>
        );
      case "ssd":
        return (
          <div className="w-full text-right mt-2 h-7 bg-black/40 border border-white/5 rounded px-2 flex items-center justify-between text-[10px] font-mono text-pink-400">
            <span>NVME READ:</span>
            <span className="font-bold">7.40 GB/s</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative bg-[#050505] py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5" id="specs-armory">
      {/* Absolute floating cyber meshes */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%,rgba(6,182,212,0.06),transparent_70%] pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-grid-dots opacity-20 pointer-events-none z-0" />

      {/* Title block with holographic accents */}
      <div className="max-w-7xl mx-auto text-center mb-16 md:mb-20 space-y-4">
        <div className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 bg-cyan-950/20 px-3 py-1 rounded-sm border border-cyan-500/20 shadow-sm">
          <span>CORES // HARDWARE SYSTEMS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-white tracking-tight italic font-black uppercase">
          HARDWARE{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            DOMINANCE SPECS
          </span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Peer into the cybernetic framework of the planet's premium gaming machine. Overloaded with raw specs and cooled with severe tactical cooling.
        </p>
      </div>

      {/* Specs Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {SPEC_DETAILS.map((spec) => {
          const Icon = spec.icon;
          const isHovered = hoveredId === spec.id;

          // Compute custom color theme based on specification attributes
          let borderStyle = "border-white/5";
          let glowClass = "";
          let iconColor = "text-gray-400";
          let categoryColor = "text-gray-500";

          if (isHovered) {
            if (spec.glowColor === "cyan") {
              borderStyle = "border-cyan-500/50";
              glowClass = "shadow-[0_0_25px_rgba(6,182,212,0.18)]";
              iconColor = "text-cyan-400";
              categoryColor = "text-cyan-400";
            } else if (spec.glowColor === "purple") {
              borderStyle = "border-purple-500/50";
              glowClass = "shadow-[0_0_25px_rgba(168,85,247,0.18)]";
              iconColor = "text-purple-400";
              categoryColor = "text-purple-400";
            } else {
              borderStyle = "border-pink-500/50";
              glowClass = "shadow-[0_0_25px_rgba(236,72,153,0.18)]";
              iconColor = "text-pink-400";
              categoryColor = "text-pink-400";
            }
          }

          return (
            <motion.div
              hover={{ y: -8, scale: 1.01 }}
              key={spec.id}
              onMouseEnter={() => setHoveredId(spec.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`p-6 rounded-sm glass-panel transition-all duration-300 relative group overflow-hidden ${borderStyle} ${glowClass}`}
            >
              {/* Corner tech indicators */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/5 opacity-40 group-hover:opacity-100 group-hover:border-white/20 transition-all" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/5 opacity-40 group-hover:opacity-100 group-hover:border-white/20 transition-all" />

              {/* Ambient inner soft laser-glow trail */}
              <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Header inside spec card */}
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-300 ${categoryColor}`}>
                  {spec.category}
                </span>
                <div className={`p-2 rounded-sm border border-white/5 bg-[#0b0b14] transition-all duration-300 ${
                  isHovered && spec.glowColor === "cyan" ? "border-cyan-500/30 text-cyan-400 bg-cyan-950/20" :
                  isHovered && spec.glowColor === "purple" ? "border-purple-500/30 text-purple-400 bg-purple-950/20" :
                  isHovered && spec.glowColor === "pink" ? "border-pink-500/30 text-pink-400 bg-pink-950/20" : ""
                }`}>
                  <Icon size={16} className={`${iconColor} transition-transform duration-500 group-hover:rotate-12`} />
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2 text-left">
                <h4 className="text-white font-display font-medium text-lg tracking-wide leading-tight group-hover:text-cyan-300/90 transition-colors">
                  {spec.title}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono text-white font-bold tracking-tight">
                    {spec.stat}
                  </span>
                  <span className="text-xs text-gray-500 font-mono tracking-wide">
                    {spec.id === "display_refresh" ? "" : "PEAK"}
                  </span>
                </div>
                <p className="text-gray-400 text-xs font-sans leading-relaxed">
                  {spec.subStat}
                </p>
              </div>

              {/* Unique Embedded Animated Visualizer */}
              <div className="mt-6 border-t border-white/5 pt-4">
                {renderCardVisual(spec.visualType, spec.glowColor, isHovered)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
