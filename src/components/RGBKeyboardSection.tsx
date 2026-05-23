import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Keyboard, Palette, Volume2, Bolt } from "lucide-react";

interface KeyLayout {
  key: string;
  widthClass: string;
  isSpecial?: boolean;
  rowIdx: number;
}

const KEYBOARD_ROWS: KeyLayout[][] = [
  // Row 1
  [
    { key: "ESC", widthClass: "w-10 sm:w-12", isSpecial: true, rowIdx: 0 },
    { key: "F1", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F2", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F3", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F4", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F5", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F6", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F7", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F8", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F9", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F10", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F11", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "F12", widthClass: "w-7 sm:w-8", isSpecial: true, rowIdx: 0 },
    { key: "PRT", widthClass: "w-10 sm:w-11", isSpecial: true, rowIdx: 0 },
  ],
  // Row 2
  [
    { key: "~", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "1", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "2", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "3", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "4", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "5", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "6", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "7", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "8", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "9", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "0", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "-", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "+", widthClass: "w-7 sm:w-8", rowIdx: 1 },
    { key: "BACKSPACE", widthClass: "flex-1", isSpecial: true, rowIdx: 1 },
  ],
  // Row 3 (WASD Row)
  [
    { key: "TAB", widthClass: "w-12 sm:w-14", isSpecial: true, rowIdx: 2 },
    { key: "Q", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "W", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "E", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "R", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "T", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "Y", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "U", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "I", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "O", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "P", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "[", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "]", widthClass: "w-7 sm:w-8", rowIdx: 2 },
    { key: "\\", widthClass: "w-7 sm:w-8", rowIdx: 2 },
  ],
  // Row 4
  [
    { key: "CAPS", widthClass: "w-14 sm:w-16", isSpecial: true, rowIdx: 3 },
    { key: "A", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "S", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "D", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "F", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "G", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "H", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "J", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "K", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "L", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: ";", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "'", widthClass: "w-7 sm:w-8", rowIdx: 3 },
    { key: "ENTER", widthClass: "flex-1", isSpecial: true, rowIdx: 3 },
  ],
  // Row 5
  [
    { key: "SHIFT", widthClass: "w-16 sm:w-20", isSpecial: true, rowIdx: 4 },
    { key: "Z", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: "X", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: "C", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: "V", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: "B", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: "N", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: "M", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: ",", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: ".", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: "/", widthClass: "w-7 sm:w-8", rowIdx: 4 },
    { key: "SHIFT_R", widthClass: "flex-1", isSpecial: true, rowIdx: 4 },
  ],
  // Row 6
  [
    { key: "CTRL", widthClass: "w-10 sm:w-11", isSpecial: true, rowIdx: 5 },
    { key: "WIN", widthClass: "w-10 sm:w-11", isSpecial: true, rowIdx: 5 },
    { key: "ALT", widthClass: "w-10 sm:w-11", isSpecial: true, rowIdx: 5 },
    { key: "SPACE", widthClass: "w-36 sm:w-48", rowIdx: 5 },
    { key: "ALT_R", widthClass: "w-10 sm:w-11", isSpecial: true, rowIdx: 5 },
    { key: "FN", widthClass: "w-10 sm:w-11", isSpecial: true, rowIdx: 5 },
    { key: "CTRL_R", widthClass: "w-10 sm:w-11", isSpecial: true, rowIdx: 5 },
    { key: "◀", widthClass: "w-8", isSpecial: true, rowIdx: 5 },
    { key: "▲", widthClass: "w-8", isSpecial: true, rowIdx: 5 },
    { key: "▼", widthClass: "w-8", isSpecial: true, rowIdx: 5 },
    { key: "▶", widthClass: "w-8", isSpecial: true, rowIdx: 5 },
  ],
];

export default function RGBKeyboardSection() {
  const [rgbMode, setRgbMode] = useState<"rainbow" | "cyberPulse" | "wasdfps" | "tapRipple">("rainbow");
  const [lastTappedKey, setLastTappedKey] = useState<string | null>(null);
  const [rippleOrigin, setRippleOrigin] = useState<{ row: number; col: number } | null>(null);
  const [ticks, setTicks] = useState(0);

  // Background frame time clock to drive waves
  useEffect(() => {
    const inter = setInterval(() => {
      setTicks((t) => t + 1);
    }, 120);
    return () => clearInterval(inter);
  }, []);

  const handleKeyTap = (key: string, rowIdx: number, colIdx: number) => {
    setLastTappedKey(key);
    setRippleOrigin({ row: rowIdx, col: colIdx });
    
    // Clear tap lock after instant duration
    setTimeout(() => {
      setLastTappedKey(null);
    }, 500);
  };

  // Compute key cap dynamically based on lighting preferences
  const getKeyColor = (key: string, rowIdx: number, colIdx: number) => {
    // 1. WASD & arrow focus
    if (rgbMode === "wasdfps") {
      const isTarget = ["W", "A", "S", "D", "◀", "▲", "▼", "▶"].includes(key);
      if (isTarget) return "text-cyan-400 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.5)] bg-cyan-950/20";
      return "text-gray-700 border-white/5 opacity-40";
    }

    // 2. Ripple Tap wave
    if (rgbMode === "tapRipple" && rippleOrigin) {
      const distance = Math.abs(rippleOrigin.row - rowIdx) + Math.abs(rippleOrigin.col - colIdx);
      if (distance === 0 && lastTappedKey === key) {
        return "text-white border-pink-500 bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.8)]";
      }
      if (distance < 3 && lastTappedKey) {
        return "text-pink-400 border-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.3)] bg-pink-950/10Scale scale-102";
      }
      return "text-gray-400 border-white/5";
    }

    // 3. Cosmic Rainbow wave sliding across standard keys
    if (rgbMode === "rainbow") {
      const val = (colIdx * 15 + rowIdx * 10 + ticks * 12) % 360;
      return `border-hsla-${val} text-white shadow-inner bg-[#0c0c16]/80`;
    }

    // 4. Cyborg Breathing Cycle (gradient matching cyan to purple)
    const factor = Math.sin(ticks * 0.15);
    if (factor > 0) {
      return "text-cyan-400 border-cyan-500/30 bg-cyan-950/15 shadow-[0_0_8px_rgba(6,182,212,0.15)]";
    } else {
      return "text-purple-400 border-purple-500/30 bg-purple-950/15 shadow-[0_0_8px_rgba(168,85,247,0.15)]";
    }
  };

  // Convert color parameters for Inline Key styles if Rainbow Mode
  const getKeyInlineStyle = (rowIdx: number, colIdx: number) => {
    if (rgbMode === "rainbow") {
      const hue = (colIdx * 20 + rowIdx * 15 + ticks * 15) % 360;
      return {
        borderColor: `hsla(${hue}, 85%, 55%, 0.4)`,
        textShadow: `0 0 6px hsla(${hue}, 85%, 55%, 0.8)`,
        boxShadow: `0 0 10px hsla(${hue}, 85%, 55%, 0.15)`,
        color: `hsla(${hue}, 90%, 75%, 1)`,
      };
    }
    return {};
  };

  return (
    <section className="relative bg-[#040409] py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5" id="rgb-key-deck">
      <div className="absolute inset-0 cyber-grid-dots opacity-40 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT PORTION - CONTROLS */}
        <div className="lg:col-span-4 text-left space-y-6 md:space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-[#06b6d4] bg-cyan-950/20 px-2.5 py-1 rounded border border-cyan-500/20">
              <Keyboard size={12} className="text-cyan-400 animate-pulse" />
              CHROME RGB KEYS // MECHANIC CORE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-white tracking-tight leading-tight">
              REACTIVE PER-KEY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 glow-cyan">
                ARGB ILLUMINATION
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Unshackle custom layout colors. Featuring 16.8 million colors, tactile bounce feedback, and reactive keyboard lighting waves that pulse beneath your fingertips. Click the virtual keys to interact!
            </p>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            {(["rainbow", "cyberPulse", "wasdfps", "tapRipple"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setRgbMode(mode)}
                className={`p-3 rounded text-[10px] text-left font-mono uppercase tracking-widest border transition-all duration-300 cursor-pointer ${
                  rgbMode === mode
                    ? "bg-[#06b6d4]/10 text-cyan-400 border-[#06b6d4]/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-[#0b0b14]/60 text-gray-500 border-white/5 hover:border-cyan-500/20 hover:text-cyan-400"
                }`}
              >
                <Palette size={13} className="mb-1.5 text-cyan-400" />
                {mode === "rainbow" && "🌈 Cosmic Wave"}
                {mode === "cyberPulse" && "🫀 Cyber Pulse"}
                {mode === "wasdfps" && "🎯 FPS WASD"}
                {mode === "tapRipple" && "🌟 Tactile Ripple"}
              </button>
            ))}
          </div>

          <div className="border border-white/5 bg-black/60 p-4 rounded text-xs font-mono flex items-center justify-between text-gray-400">
            <span className="flex items-center gap-1">
              <Bolt size={12} className="text-cyan-400" />
              HAPTIC FEEDBACK:
            </span>
            <span className="text-white font-bold">ESS SABRE CHIP LINK</span>
          </div>
        </div>

        {/* RIGHT PORTION - INTERACTIVE VIRTUAL KEYCAP DECK */}
        <div className="lg:col-span-8 p-4 sm:p-6 md:p-8 rounded-xl border border-white/5 bg-[#06060c] relative shadow-2xl z-10 overflow-x-auto select-none">
          {/* Top bezel speaker bar and lighting */}
          <div className="w-full h-1.5 bg-black/80 rounded border-b border-white/10 mb-6 flex justify-between px-4 items-center">
            <div className="w-12 h-0.5 bg-cyan-400/40" />
            <div className="w-24 h-0.5 bg-purple-500/30" />
            <div className="w-12 h-0.5 bg-cyan-400/40" />
          </div>

          {/* Deck Body */}
          <div className="space-y-1.5 min-w-[580px] sm:min-w-full">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-between gap-1.5">
                {row.map((k, cIdx) => {
                  const keyClass = getKeyColor(k.key, rIdx, cIdx);
                  const isWASD = ["W", "A", "S", "D"].includes(k.key);
                  return (
                    <motion.button
                      whileTap={{ scale: 0.9, y: 1.5 }}
                      key={cIdx}
                      style={getKeyInlineStyle(rIdx, cIdx)}
                      onClick={() => handleKeyTap(k.key, rIdx, cIdx)}
                      className={`h-7 sm:h-9 text-[9px] sm:text-[11px] rounded border font-mono font-medium flex items-center justify-center transition-all duration-150 cursor-pointer select-none ${k.widthClass} ${keyClass} ${
                        isWASD && rgbMode !== "wasdfps" ? "border-cyan-500/50 font-bold bg-[#0f0f20]" : ""
                      }`}
                    >
                      {k.key === "SHIFT_R" ? "SHIFT" : k.key === "ALT_R" ? "ALT" : k.key === "CTRL_R" ? "CTRL" : k.key}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mt-6 border-t border-white/5 pt-4">
            <span className="flex items-center gap-1">
              <Volume2 size={11} className="text-cyan-400" />
              SIMULATED MECHANICAL CHERRIES ACTION
            </span>
            <span>CHASSIS REFLECTION RATE: HIGH-GAIN</span>
          </div>
        </div>
      </div>
    </section>
  );
}
