import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Terminal, Shield, Cpu, Flame, Target } from "lucide-react";
import logoImg from "../assets/images/logo.png";

interface PreloaderProps {
  progress: number;
}

export default function Preloader({ progress }: PreloaderProps) {
  const [telemetryLines, setTelemetryLines] = useState<string[]>([]);
  
  // Custom futuristic cyber status readouts based on percentage
  const getStatusText = (prog: number) => {
    if (prog < 20) return "BOOTING NEURAL LINK CORE...";
    if (prog < 40) return "CALIBRATING ICE-LOOP THERMAL VENTILATION...";
    if (prog < 60) return "DECRYPTING ARMORY GRAPHICS ARRAYS...";
    if (prog < 80) return "SYNCHRONIZING HAPTIC SWEEPS SYNTH...";
    if (prog < 100) return "ESTABLISHING CRYPTO CYBER LANES...";
    return "DECRYPTION COMPLETE // SECURE ACCESS GRANTED";
  };

  useEffect(() => {
    // Generate simulated cool sci-fi terminal debug lines
    const logs = [
      "SYS: Initializing Titan telemetry v2.0.4...",
      "GPU: NVIDIA RTX 4070/5080 driver detected.",
      "CPU: Intel Core i9-14900HX overclock active.",
      "FAN: Dual 3D IceLoop cooling vents primed.",
      "MEM: Direct-contact liquid-metal verified.",
      "AUDIO: Cyber Synth Haptic engines online.",
      "SECURITY: Secure Crypto Lanes established.",
      "SCREEN: 60fps responsive orbit loop ready.",
    ];

    const interval = setInterval(() => {
      if (telemetryLines.length < logs.length) {
        setTelemetryLines(prev => [...prev, logs[prev.length]]);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [telemetryLines]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden scanlines select-none"
    >
      {/* Immersive Tech Background Elements */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%,rgba(6,182,212,0.06),transparent_60%] pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 space-y-8">
        
        {/* CENTER Telemetry spinning rings with logo */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Animated concentric loader rings */}
          <div className="absolute inset-0 border border-cyan-500/10 rounded-full" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-2 border border-dashed border-cyan-500/30 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-4 border border-dotted border-purple-500/35 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-6 border border-cyan-500/20 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          />
          
          {/* Logo inside */}
          <motion.img 
            src={logoImg} 
            alt="REDMAGIC Logo" 
            className="h-10 w-auto object-contain z-10 opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        </div>

        {/* Dynamic telemetry status box */}
        <div className="w-full text-center space-y-3">
          <div className="flex justify-between items-baseline font-mono text-[9px] tracking-wider text-cyan-400/70 uppercase">
            <span>DECRYPT STATUS</span>
            <span className="text-xs font-bold text-white tracking-widest">{progress}%</span>
          </div>

          {/* Futuristic horizontal progress bar */}
          <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            />
          </div>

          {/* Core system status text */}
          <div className="text-[10px] font-mono tracking-[0.18em] text-white/90 h-6 flex items-center justify-center uppercase select-none">
            <span className="animate-pulse">{getStatusText(progress)}</span>
          </div>
        </div>

        {/* Scrolling terminal telemetry diagnostics (Elite aesthetics!) */}
        <div className="w-full h-24 bg-black/60 border border-white/5 rounded p-3 font-mono text-[8px] text-gray-500 leading-normal overflow-hidden select-none flex flex-col justify-end text-left shadow-inner">
          <div className="flex items-center gap-1.5 text-cyan-500/70 border-b border-white/5 pb-1.5 mb-1.5 uppercase tracking-[0.15em] font-bold">
            <Terminal size={9} />
            <span>DIAGNOSTIC TELEMETRY MODULE</span>
          </div>
          <div className="space-y-0.5 min-h-[50px] flex flex-col justify-end">
            {telemetryLines.slice(-4).map((line, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[#06b6d4]">✓</span>
                <span className="truncate">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer layout tags */}
        <div className="flex justify-between w-full font-mono text-[8px] tracking-widest text-white/30 uppercase pt-2 select-none border-t border-white/5">
          <span className="flex items-center gap-1">
            <Shield size={9} /> Ready.Sys
          </span>
          <span className="flex items-center gap-1">
            <Cpu size={9} /> Overclocked
          </span>
          <span className="flex items-center gap-1">
            <Flame size={9} /> EX flow
          </span>
        </div>
      </div>
    </motion.div>
  );
}
