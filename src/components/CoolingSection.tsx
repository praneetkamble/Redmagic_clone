import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Wind, ShieldAlert, Cpu, Fan, Thermometer } from "lucide-react";

export default function CoolingSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boostActive, setBoostActive] = useState(true);
  const [exhaustTemp, setExhaustTemp] = useState(38.2);

  // 2D Cooling Flow Particle Simulator
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 320);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 320;
    };
    window.addEventListener("resize", handleResize);

    // Particles array definition
    interface Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      color: string;
      angle: number;
      alpha: number;
      type: "intake" | "exhaust";
    }

    const particles: Particle[] = [];

    // Create single particles
    const createParticle = (type: "intake" | "exhaust"): Particle => {
      const spdFactor = boostActive ? 4.5 : 1.8;
      if (type === "intake") {
        return {
          x: Math.random() * 80 + 30, // enter from left vents
          y: height / 2 + (Math.random() * 40 - 20),
          speed: (1.5 + Math.random() * 2) * spdFactor,
          size: Math.random() * 3.5 + 1.5,
          color: "rgba(6, 182, 212, ",
          angle: 0,
          alpha: Math.random() * 0.5 + 0.5,
          type,
        };
      } else {
        return {
          x: width / 2 + (Math.random() * 60 - 30), // emerge from central VC core
          y: height / 2 + (Math.random() * 20 - 10),
          speed: (2 + Math.random() * 2.5) * spdFactor,
          size: Math.random() * 4 + 1.5,
          color: "rgba(236, 72, 153, ", // pink represent high temp exhaust
          angle: Math.random() * 0.4 - 0.2, // wide exit angles towards rear VCP
          alpha: Math.random() * 0.6 + 0.4,
          type,
        };
      }
    };

    // Initialize initial stream
    for (let i = 0; i < 80; i++) {
      particles.push(createParticle(Math.random() > 0.4 ? "intake" : "exhaust"));
    }

    const drawSimulation = () => {
      ctx.fillStyle = "#030307";
      ctx.fillRect(0, 0, width, height);

      // Render schematic lines representing vapor chambers
      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 1.5;
      
      // Central Motherboard shield outline
      ctx.beginPath();
      ctx.rect(width / 2 - 120, height / 2 - 60, 240, 120);
      ctx.stroke();

      // Exhaust pipe branches
      ctx.beginPath();
      ctx.moveTo(width / 2 - 120, height / 2);
      ctx.lineTo(80, height / 2);
      ctx.moveTo(width / 2 + 120, height / 2);
      ctx.lineTo(width - 80, height / 2);
      ctx.stroke();

      // Render glowing fans backing circles
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(6, 182, 212, 0.03)";
      ctx.beginPath();
      ctx.arc(100, height / 2, 45, 0, Math.PI * 2);
      ctx.arc(width - 100, height / 2, 45, 0, Math.PI * 2);
      ctx.fill();

      // Render vapor chamber heat loops (copper pipes)
      ctx.strokeStyle = "rgba(168, 85, 247, 0.15)";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(width / 2 - 100, height / 2 + 25);
      ctx.lineTo(width / 2 + 100, height / 2 + 25);
      ctx.moveTo(width / 2 - 100, height / 2 - 25);
      ctx.lineTo(width / 2 + 100, height / 2 - 25);
      ctx.stroke();

      // Render core chip labels
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.font = "bold 13px 'Space Grotesk'";
      ctx.textAlign = "center";
      ctx.fillText("i9 CENTRAL CORE", width / 2, height / 2 - 15);
      ctx.fillText("RTX HEAVY BLOCK", width / 2, height / 2 + 20);

      // Update flow particles
      particles.forEach((p, idx) => {
        ctx.fillStyle = `${p.color}${p.alpha})`;

        if (p.type === "intake") {
          p.x += p.speed;
          // Curve and pull particles inwards towards the cooling core
          const dy = height / 2 - p.y;
          p.y += dy * 0.05;

          // Dissolve when arriving at CPU target core
          if (p.x > width / 2 - 40) {
            particles[idx] = createParticle("intake");
          }
        } else {
          // Exhaust flows away from motherboard to rear and side vents
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed;

          // Transition cooling from glowing red/pink to cold cyan towards vents
          if (p.x > width - 110) {
            p.color = "rgba(6, 182, 212, ";
          }

          // Reset when exit borders
          if (p.x > width || p.y < 0 || p.y > height) {
            particles[idx] = createParticle("exhaust");
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ambient system details overlays
      ctx.fillStyle = "rgba(6,182,212,0.6)";
      ctx.font = "9px 'JetBrains Mono'";
      ctx.fillText("TURBINE_A: ACTIVE 6400RPM", 100, height / 2 + 65);
      ctx.fillText("TURBINE_B: ACTIVE 6400RPM", width - 100, height / 2 + 65);

      animationId = requestAnimationFrame(drawSimulation);
    };

    drawSimulation();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [boostActive]);

  // Keep exhaust temp dynamic
  useEffect(() => {
    const inter = setInterval(() => {
      setExhaustTemp((prev) => {
        const target = boostActive ? 34.6 : 46.8;
        return Number((prev + (target - prev) * 0.08 + (Math.random() * 0.4 - 0.2)).toFixed(1));
      });
    }, 400);
    return () => clearInterval(inter);
  }, [boostActive]);

  return (
    <section className="relative bg-[#050505] py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5" id="cooling-sec">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid-dots opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* LEFT COMPONENT - EXPLANATIONS */}
        <div className="lg:col-span-5 text-left space-y-6 md:space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest text-[#06b6d4] bg-cyan-950/20 px-2.5 py-1 rounded-sm border border-cyan-500/20">
              <Fan size={12} className="animate-spin text-cyan-400" />
              DIABOLIC ICE THERMAL SYSTEMS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-white tracking-tight leading-tight italic font-black uppercase">
              AEROSPATIAL{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                VAPOR CHAMBERS
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-sans">
              Equipped with a giant high-performance dual-fan copper alloy chamber that has 10,000 mm² of coverage. Liquid metal contact transfers heat away instantly. No throttles, pure frame dominance.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-white/5 bg-black/60 p-4 rounded-sm text-xs font-mono space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400" />
              <div className="text-gray-500 uppercase">COOLING ACCELERATION RATIO:</div>
              <div className="text-white text-sm font-bold flex justify-between">
                <span>LIQUID METAL THERMAL COND:</span>
                <span className="text-cyan-400">79 W/m·K VS 8.5W STD</span>
              </div>
            </div>

            <div className="border border-white/5 bg-black/60 p-4 rounded-sm text-xs font-mono space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-2 bg-purple-400" />
              <div className="text-gray-500 uppercase">AIR CIRCULATION:</div>
              <div className="text-white text-sm font-bold flex justify-between">
                <span>AGGREGATE AIR DISPERSION:</span>
                <span className="text-purple-400">+35% IMPROVEMENT</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setBoostActive(!boostActive)}
            className={`w-full py-4 rounded-sm font-display font-medium text-xs tracking-widest uppercase border transition-all duration-300 cursor-pointer ${
              boostActive
                ? "bg-cyan-500 border-cyan-400 text-black glow-box-cyan font-bold"
                : "bg-transparent border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:text-white hover:bg-cyan-950/20"
            }`}
          >
            {boostActive ? "DEACTIVATE SUPERCOOL VENT" : "ENGAGE DIABOLIC BOOST"}
          </button>
        </div>

        {/* RIGHT COMPONENT - LIVE FLUID CANVAS */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-sm border border-white/5 bg-[#09090f] relative overflow-hidden z-10 shadow-2xl">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
            <div className="text-left font-mono">
              <span className="text-[10px] text-gray-500 block uppercase">SIMULATOR MONITOR</span>
              <span className="text-xs text-white block">CORE VAPOR PRESSURE: EXTREME</span>
            </div>
            <div className="text-right font-mono text-xs flex gap-4">
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">EXHAUST TEMP</span>
                <span className={`block font-bold ${boostActive ? "text-cyan-400" : "text-purple-400 animate-pulse"}`}>
                  {exhaustTemp}°C
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">AUDIO DB</span>
                <span className="text-white block font-bold">
                  {boostActive ? "41.5 dB" : "18.2 dB"}
                </span>
              </div>
            </div>
          </div>

          {/* Actual responsive drawing canvas */}
          <div className="relative border border-white/5 bg-[#050510]/80 rounded-sm h-80 overflow-hidden shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* HUD reticles and borders */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/50 flex items-center gap-1">
              <Thermometer size={10} className="animate-bounce" />
              <span>STABILITY SIMULATOR STATE: ACTIVE</span>
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-purple-400/50">
              OVERCLOCK LEVEL: BOOST_ACTIVE
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-4 pt-1">
            <span>INTAKE: COLD ATMOSPHERE 22°C</span>
            <span>EXHAUST: VAPORIZED COPPER CHANNELS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
