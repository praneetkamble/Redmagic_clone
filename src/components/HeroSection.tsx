import { motion } from "motion/react";
import { Terminal, Shield, Cpu, Flame, Target, ArrowDown } from "lucide-react";
import heroLaptopImg from "../assets/images/titan_16_pro_hero_view_1779537205495.png";

interface HeroSectionProps {
  onExploreClick: () => void;
  onBuyClick: () => void;
}

export default function HeroSection({ onExploreClick, onBuyClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 pb-12 px-6 md:px-12 lg:px-24 bg-[#050505]" id="hero-sec">
      {/* Immersive geometric background layers */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%,rgba(6,182,212,0.08),transparent_70%] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-grid-dots opacity-30 pointer-events-none z-0" />

      {/* Hero Giant Text Layer in background */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <h1 className="text-[12vw] font-black tracking-tighter text-white/[0.03] select-none leading-none uppercase">
          TITAN 16 PRO
        </h1>
      </div>

      {/* Retro/Cyber glowing ambient circles */}
      <div className="absolute top-[20%] left-[10%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[25%] right-[5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Little floating geometric indicators (ambient) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 flex justify-between text-[10px] font-mono tracking-[0.25em] text-gray-500 pointer-events-none uppercase">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-cyan-500 animate-pulse" />
          <span>SYS_STATUS: READY.SYS</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>DIABOLIC ENGINE OVERCLOCK: ACTIVE</span>
        </div>
        <div>TITAN_16_PRO // E-SPORTS</div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-6">
        {/* LEFT COMPONENT - TITLES & CTAS */}
        <div className="lg:col-span-6 text-left space-y-6 md:space-y-8">
          <div className="space-y-3">
            {/* Holographic subtitle bar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.3em] text-cyan-400 border border-cyan-500/25 bg-cyan-950/30 px-3 py-1 rounded-sm"
            >
              <Cpu size={12} className="animate-pulse" />
              <span>14th Gen Intel Core i9 HX + RTX 4070/5080</span>
            </motion.div>
 
            {/* Giant Cyberpunk Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-display font-medium text-white tracking-tight leading-[1.05]">
              REDMAGIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 italic font-black">
                TITAN 16 PRO
              </span>
            </h1>

            {/* High-contrast catchphrase */}
            <h3 className="text-xl md:text-2xl font-sans text-cyan-400 font-light tracking-wide uppercase">
              Beyond The Horizon.
            </h3>
          </div>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl font-sans">
            Ascend to absolute gaming dominance. Encased in high-tech matte aerospace-grade aluminum, utilizing direct-contact liquid-metal cooling, and engineered for relentless frame-rates. Built for gods.
          </p>

          {/* Quick Stats Grid with Geometric Balance bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-white/5 py-6 max-w-xl text-left">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-sm flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-mono font-bold">Processor</span>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">i9-14900HX</span>
                <span className="text-[10px] text-white/40 font-mono">14th Gen</span>
              </div>
              <div className="w-full h-[2px] bg-white/10 mt-2">
                <div className="w-[92%] h-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-sm flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-purple-400 font-mono font-bold">Graphics</span>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">RTX 5080/4070</span>
                <span className="text-[10px] text-white/40 font-mono">GDDR6X</span>
              </div>
              <div className="w-full h-[2px] bg-white/10 mt-2">
                <div className="w-[88%] h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-sm flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-widest text-pink-400 font-mono font-bold">Thermal Armour</span>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">IceLoop 3.0</span>
                <span className="text-[10px] text-white/40 font-mono">Vapor Chamber</span>
              </div>
              <div className="w-full h-[2px] bg-white/10 mt-2">
                <div className="w-[95%] h-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div>
              </div>
            </div>
          </div>

          {/* Magnetic CTA Buttons */}
          <div className="flex gap-4 pt-1">
            <button
              onClick={onBuyClick}
              className="px-10 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-sm hover:bg-cyan-400 transition-colors transform active:scale-95 duration-200 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_24px_rgba(6,182,212,0.4)]"
            >
              CONFIGURE NOW
            </button>

            <button
              onClick={onExploreClick}
              className="px-10 py-3.5 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:border-cyan-500 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              TECHNICAL SPECS
            </button>
          </div>
        </div>

        {/* RIGHT COMPONENT - PREMIUM 3D FLOAT CARD WITH USER RENDER PHOTO */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[300px] md:min-h-[450px]">
          {/* Glowing Hexagonal framing behind the image container */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[280px] h-[280px] md:w-[480px] md:h-[480px] border border-cyan-500/10 rounded-full animate-spin duration-30000" />
            <div className="absolute w-[240px] h-[240px] md:w-[420px] md:h-[420px] border border-dashed border-purple-500/15 rounded-full animate-spin duration-15000 direction-reverse" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[480px] flex justify-center items-center p-4"
          >
            {/* Holographic interface details corner brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

            {/* Glowing bezel lines around image */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-30 rounded-lg blur-lg" />

            {/* Elite Laptops Image with float-shadow hover animation */}
            <motion.div
              animate={{ 
                y: [0, -12, 0],
                rotateZ: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative rounded-lg overflow-hidden border border-white/5 bg-black/60 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-sm z-10 w-full"
            >
              {// ReferrerPolicy recommended by guidelines for static image loads
              }
              <img
                src={heroLaptopImg}
                alt="REDMAGIC Titan 16 Pro Gaming Laptop Duo"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain object-center scale-105 select-none"
              />

              {/* Status overlay bar in card corner */}
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[10px] font-mono text-gray-500 border-t border-white/5 pt-2">
                <span className="flex items-center gap-1">
                  <Shield size={9} className="text-cyan-400" />
                  MIL-STD SHIELD
                </span>
                <span className="flex items-center gap-1">
                  <Flame size={9} className="text-pink-500" />
                  EX FLOW VENTS
                </span>
                <span className="flex items-center gap-1">
                  <Target size={9} className="text-purple-400" />
                  FPS STABLE
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
