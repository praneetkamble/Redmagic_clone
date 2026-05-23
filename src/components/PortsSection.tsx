import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cable, Cpu, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import portsDiagramImg from "../assets/images/input_file_0_1779536832017.png";

interface PortSpec {
  id: string;
  name: string;
  spec: string;
  desc: string;
  coords: { x: string; y: string }; // Position relative to absolute layout overlay
  color: "cyan" | "purple" | "pink";
}

const PORT_SPECS: PortSpec[] = [
  {
    id: "lan",
    name: "2.5G RJ45 Wired Port",
    spec: "Realtek RTL8125BG Gaming Controller",
    desc: "Provides up to 2500 Mbps of raw connection with priority package tagging for zero-jitter online lobbies.",
    coords: { x: "46%", y: "16%" },
    color: "cyan",
  },
  {
    id: "usba_back",
    name: "USB-A 3.2 Gen 2 (10Gbps)",
    spec: "Dual channel high power layout",
    desc: "Connect capture cards, high-speed storage, or VR headsets with up to 1250 MB/s transfer speeds.",
    coords: { x: "50%", y: "18%" },
    color: "purple",
  },
  {
    id: "hdmi",
    name: "HDMI 2.1 FRL",
    spec: "Full 48Gbps Bandwidth Support",
    desc: "Enables direct output of 8K at 60Hz or 4K at 120Hz/144Hz with VRR, ALLM, and eARC support straight from the GPU.",
    coords: { x: "54%", y: "21%" },
    color: "pink",
  },
  {
    id: "tb5",
    name: "Thunderbolt 5 Interface",
    spec: "Intel Barlow Ridge Controller",
    desc: "The pinnacle of IO. Up to 120Gbps bandwidth for external graphics cards, triple 4K monitors, or high-power charging support.",
    coords: { x: "57%", y: "23%" },
    color: "cyan",
  },
  {
    id: "power",
    name: "280W DC Power Interface",
    spec: "Overload surge protection fuses",
    desc: "Heavy-duty magnetic insertion port supplying raw unrestricted current to satisfy simultaneous CPU & GPU boosting.",
    coords: { x: "61%", y: "26%" },
    color: "pink",
  },
  {
    id: "sd_card",
    name: "UHS-I High Speed SD Slot",
    spec: "Integrated multi-format slot",
    desc: "Fast access for content creators to dump direct camera logs, supporting speeds up to 104 MB/s.",
    coords: { x: "47%", y: "78%" },
    color: "cyan",
  },
  {
    id: "usba_right",
    name: "USB-A 3.2 Gen 1 (5Gbps)",
    spec: "Dedicated latency routing lanes",
    desc: "Standard e-sports response port meant to preserve raw polling frequencies of mice and keyboards.",
    coords: { x: "65%", y: "62%" },
    color: "purple",
  },
  {
    id: "usbc_side",
    name: "USB-C 3.2 Gen 2 (10Gbps)",
    spec: "DisplayPort 1.4 & Power Delivery 100W",
    desc: "Convenient side port for fast-charging phones, connection drives, or outputting secondary portable displays.",
    coords: { x: "69%", y: "65%" },
    color: "cyan",
  },
  {
    id: "jack",
    name: "3.5mm Headphone Combined",
    spec: "ESS SABRE HiFi DAC Integrated",
    desc: "High-impedance audio combo support with premium DAC decoding for clean spatial headset pinpointing.",
    coords: { x: "73%", y: "68%" },
    color: "pink",
  },
];

export default function PortsSection() {
  const [activePortId, setActivePortId] = useState<string | null>("tb5");

  const activePort = PORT_SPECS.find((p) => p.id === activePortId);

  return (
    <section className="relative bg-[#020204] py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5" id="ports-sec">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Block */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 bg-cyan-950/20 px-3 py-1 rounded border border-cyan-500/20">
            <Cable size={12} className="animate-pulse" />
            IO ARMORY LAB // CONNECTION MATRIX
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-white tracking-tight">
            TECHNICAL{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
              EXPLODED IO PIPES
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Unrestricted high-speed pipelines configured on all three facets of the chassis body. Interactive diagram displays locations and bus lanes.
          </p>
        </div>

        {/* Technical Exploded Dashboard Board layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          {/* LEFT TELEMETRY TERMINAL INTERFACE */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-lg border border-white/5 bg-[#06060c] relative">
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  PORT SPECIFICATION PANEL
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>

              {/* Slide Details of selected port */}
              <AnimatePresence mode="wait">
                {activePort ? (
                  <motion.div
                    key={activePort.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex gap-1.5 items-center text-[10px] font-mono text-cyan-400/80 uppercase">
                      BUS STANDARD: {activePort.id === "tb5" ? "PCIE GEN5 X4" : "USB 3.2 DATA BUS"}
                    </div>
                    <h3 className="text-xl font-display font-bold text-white tracking-wide">
                      {activePort.name}
                    </h3>
                    <div className="bg-[#0b0b14] p-3 border border-white/5 rounded">
                      <span className="text-[9px] font-mono text-gray-500 block uppercase">HARDWARE LAYER</span>
                      <span className="text-xs text-purple-400 font-mono font-medium block">
                        {activePort.spec}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed font-sans">
                      {activePort.desc}
                    </p>
                  </motion.div>
                ) : (
                  <div className="text-gray-500 font-mono text-xs">
                    Hover or select any physical coordinate node on the backing diagram to load internal bus lane data pipelines.
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/5 pt-4 mt-8 flex flex-col gap-2 text-left text-[11px] font-mono text-gray-500">
              <div className="flex justify-between">
                <span>INT PORT LIMITS:</span>
                <span className="text-white">UNRESTRICTED TGP</span>
              </div>
              <div className="flex justify-between">
                <span>SECURITY PROTOCOLS:</span>
                <span className="text-cyan-400">ACTIVE BUS FIREWALLS</span>
              </div>
            </div>
          </div>

          {/* RIGHT DIAGRAM CONTAINER WITH pulsing nodes */}
          <div className="lg:col-span-8 border border-white/5 rounded-lg bg-black p-5 relative overflow-hidden flex items-center justify-center min-h-[380px]">
            {/* Labeled technical Diagram rendered below coordinates */}
            <div className="relative w-full max-w-[640px] select-none">
              <img
                src={portsDiagramImg}
                alt="REDMAGIC Titan 16 Pro Back ports labeled diagram"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain scale-102"
              />

              {/* Absolute Overlaid Coordinate Targets */}
              {PORT_SPECS.map((p) => {
                const isActive = activePortId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePortId(p.id)}
                    onMouseEnter={() => setActivePortId(p.id)}
                    style={{ left: p.coords.x, top: p.coords.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                  >
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isActive 
                          ? "bg-cyan-400" 
                          : p.color === "cyan" ? "bg-cyan-500/40" : p.color === "purple" ? "bg-purple-500/40" : "bg-pink-500/40"
                      }`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 ${
                        isActive
                          ? "bg-white scale-125"
                          : p.color === "cyan" ? "bg-cyan-400" : p.color === "purple" ? "bg-purple-400" : "bg-pink-400"
                      }`} />
                    </span>

                    {/* Popover little preview label */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#06060c] border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-white tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
                      {p.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ambient scanlines overlay in background */}
            <div className="absolute inset-0 pointer-events-none cyber-grid-dots bg-opacity-10" />
            <div className="absolute bottom-3 right-4 text-[9px] font-mono text-gray-600">
              DIAGRAM PERSPECTIVES: REAR-BACK DECK & LEFT-RIGHT ANGLE VENTS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
