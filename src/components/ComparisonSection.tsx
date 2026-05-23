import { useState } from "react";
import { Check, X, ShieldAlert, Zap, Award, BarChart3 } from "lucide-react";

interface ComparisonRow {
  feature: string;
  redmagic: string;
  rog: string;
  legion: string;
  isRedmagicBetter: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Processor Speed",
    redmagic: "i9-14900HX (Up to 5.8GHz / Overclock Limit)",
    rog: "i9-14900HX (Stock speeds)",
    legion: "i9-14900HX (Stock speeds)",
    isRedmagicBetter: true,
  },
  {
    feature: "Display Refresh Rate",
    redmagic: "300Hz (Smooth Esports Silk)",
    rog: "240Hz Standard Display",
    legion: "240Hz Standard Display",
    isRedmagicBetter: true,
  },
  {
    feature: "Cooling Architecture",
    redmagic: "Liquid Metal + 10,000mm² Dual Vapor Chamber",
    rog: "Liquid Metal + Triple Fans (No VC)",
    legion: "Stock Thermal Paste + Dual Fans",
    isRedmagicBetter: true,
  },
  {
    feature: "Primary Bus Ports",
    redmagic: "Thunderbolt 5 (Up to 120Gbps)",
    rog: "Thunderbolt 4 (40Gbps)",
    legion: "Thunderbolt 4 (40Gbps)",
    isRedmagicBetter: true,
  },
  {
    feature: "Chassis CNC Material",
    redmagic: "Aerospace-grade Matte Aluminum Alloy",
    rog: "Reinforced Composite Plastic Bottom",
    legion: "Pressed Sheet Metal Plates",
    isRedmagicBetter: true,
  },
  {
    feature: "Keyboard Illumination",
    redmagic: "Per-Key Dynamic ARGB Ripples",
    rog: "4-Zone Standard RGB Blocks",
    legion: "4-Zone Standard RGB Blocks",
    isRedmagicBetter: true,
  },
  {
    feature: "Thickness / Weight",
    redmagic: "18.5mm Ultra Slim / 2.3kg",
    rog: "22.5mm Grid Build / 2.5kg",
    legion: "21.9mm Standard / 2.6kg",
    isRedmagicBetter: true,
  },
];

export default function ComparisonSection() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section className="relative bg-[#020204] py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5" id="compare-matrix">
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Title Block */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 bg-cyan-950/20 px-3 py-1 rounded border border-cyan-500/20">
            <BarChart3 size={12} className="text-cyan-400" />
            BENCHMARK COMPARISON LAB // ELITE ARMED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-white tracking-tight">
            THE TITAN{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
              DOMINANCE MATRIX
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            See how the REDMAGIC Titan 16 Pro stacks up directly against the leading gaming names in the tech stratosphere. No contests.
          </p>
        </div>

        {/* Floating Matrix Board */}
        <div className="border border-white/5 bg-[#06060c] p-4 sm:p-6 md:p-8 rounded-xl relative shadow-2xl z-10 overflow-x-auto select-none">
          <table className="w-full text-left border-collapse min-w-[720px]">
            {/* Headers Row */}
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest w-1/4">
                  HARDWARE LANE
                </th>
                <th className="pb-6 text-left w-1/3">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-black/30 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] glow-cyan font-bold">
                    <Award size={14} className="text-cyan-400 animate-pulse" />
                    REDMAGIC Titan 16 Pro
                  </div>
                </th>
                <th className="pb-6 font-display font-medium text-gray-400 text-sm pl-4">
                  ASUS ROG Strix G16
                </th>
                <th className="pb-6 font-display font-medium text-gray-400 text-sm pl-4">
                  Lenovo Legion Pro 7
                </th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-white/5">
              {COMPARISON_ROWS.map((row, idx) => {
                const isHovered = hoveredRow === idx;
                return (
                  <tr
                    key={row.feature}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`transition-all duration-300 ${
                      isHovered ? "bg-[#0b0b14]/50" : ""
                    }`}
                  >
                    {/* Feature label */}
                    <td className="py-5 font-display font-semibold text-gray-300 text-sm">
                      {row.feature}
                    </td>

                    {/* REDMAGIC superior stats */}
                    <td className="py-5 text-sm font-sans text-white font-medium text-left">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-cyan-400 glow-cyan font-bold flex-shrink-0" />
                        <span className="text-cyan-200">{row.redmagic}</span>
                      </div>
                    </td>

                    {/* ROG specs */}
                    <td className="py-5 text-xs font-sans text-gray-400 pl-4">
                      {row.rog}
                    </td>

                    {/* Legion specs */}
                    <td className="py-5 text-xs font-sans text-gray-400 pl-4">
                      {row.legion}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Footer system telemetry indicator */}
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mt-6 border-t border-white/5 pt-4">
            <span className="flex items-center gap-1">
              <ShieldAlert size={11} className="text-cyan-400" />
              BENCHMARKS ACCURED PURSUANT TO ACTIVE LAB OVERCLOCK SPECS
            </span>
            <span>SYSTEM CERTIFICATION: EXCELLENT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
