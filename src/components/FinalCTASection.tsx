import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, ShieldCheck, RefreshCcw, Send, Sparkles } from "lucide-react";
import deskSetupImg from "../assets/images/input_file_3_1779536853413.png";

interface FinalCTASectionProps {
  onBuySubmit: () => void;
}

export default function FinalCTASection({ onBuySubmit }: FinalCTASectionProps) {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<"rtx4070" | "rtx5080">("rtx4070");
  const [emailForm, setEmailForm] = useState("");

  const handleOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!emailForm) return;
    setIsSubmitSuccessful(true);
    if (onBuySubmit) onBuySubmit();
  };

  const getPrice = () => {
    return selectedSpec === "rtx4070" ? "$1,699.00" : "$2,499.00";
  };

  return (
    <section className="relative bg-[#050505] py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5" id="final-checkout">
      {/* Background Energy Waves and Particles */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_70%] from-purple-950/20 via-[#050505]/90 to-[#050505] pointer-events-none" />
      <div className="absolute inset-0 cyber-grid-dots opacity-40 pointer-events-none" />
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-5000" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* LEFT COMPONENT - IMAGE HERO SHOWCASE */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[480px] rounded-sm overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* High Tech interface details */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-cyan-400" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-cyan-400" />

            <div className="relative rounded-sm overflow-hidden aspect-video group">
              <img
                src={deskSetupImg}
                alt="REDMAGIC laptop and phone hardware on setup desk"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />

              {/* Tag Overlays */}
              <div className="absolute bottom-3 left-4 text-left">
                <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase bg-black/80 px-2 py-0.5 rounded-sm border border-cyan-500/20">
                  ⚡ MATTE SLATE DESK SETUP INFO
                </span>
              </div>
            </div>

            <div className="mt-4 text-left space-y-2">
              <h4 className="text-white font-display font-medium text-base">Enter The Future.</h4>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">
                The REDMAGIC ecosystem is engineered to sync your computing power fluidly. Matte black aerospace metals combined with transparent RGB ribbon highlights match any battle station environment.
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COMPONENT - PREMIUM CONFIGURATOR FORM */}
        <div className="lg:col-span-6 text-left p-6 md:p-8 rounded-sm border border-white/5 bg-[#09090f] relative shadow-2xl overflow-hidden">
          {/* Accent Neon Lightbar of checkout box */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />

          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-white/5 pb-4">
              <span className="text-[10px] font-mono text-cyan-400 block uppercase tracking-widest leading-none">
                HARDWARE DISPATCH SECURE LAYER
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">Configure Your Armory</h3>
              <p className="text-xs text-gray-500 font-mono">AUTHORIZED RESELLER DISPATCHES // 2-YEAR WARRANTY</p>
            </div>

            {/* Spec Option selector radio rows */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-mono tracking-widest text-[#06b6d4] uppercase">
                Choose Discrete Graphics Processor
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedSpec("rtx4070")}
                  className={`p-3 rounded-sm text-left border transition-all duration-300 cursor-pointer ${
                    selectedSpec === "rtx4070"
                      ? "bg-cyan-950/20 text-white border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold"
                      : "bg-[#0b0b14] text-gray-400 border-white/5 hover:border-cyan-500/20 hover:text-cyan-400"
                  }`}
                >
                  <span className="text-xs font-mono text-cyan-400 block">STANDARD CORE</span>
                  <span className="font-display font-bold text-sm block">RTX 4070 TGP</span>
                  <span className="text-[10px] font-mono text-gray-500 block">i9 CPU + 32GB RAM</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSpec("rtx5080")}
                  className={`p-3 rounded-sm text-left border transition-all duration-300 cursor-pointer ${
                    selectedSpec === "rtx5080"
                      ? "bg-purple-950/20 text-white border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] font-bold"
                      : "bg-[#0b0b14] text-gray-400 border-white/5 hover:border-purple-500/20 hover:text-purple-400"
                  }`}
                >
                  <span className="text-xs font-mono text-purple-400 block animate-pulse">DIABOLIC CORE</span>
                  <span className="font-display font-bold text-sm block">RTX 5080 PUMPED</span>
                  <span className="text-[10px] font-mono text-gray-500 block">i9 CPU + 64GB RAM</span>
                </button>
              </div>
            </div>

            {/* Checkout Pricing box */}
            <div className="bg-[#0b0b14] p-4 border border-white/5 rounded-sm flex justify-between items-center">
              <div className="text-left font-mono">
                <h5 className="text-[10px] text-gray-500 uppercase block">AGGREGATE VALUE ESTIMATES</h5>
                <span className="text-2xl font-mono text-white font-extrabold tracking-tight">
                  {getPrice()}
                </span>
                <span className="text-[9px] text-gray-600 block">TAXES & FREE FEDEX DISPATCH INCL</span>
              </div>

              <div className="text-right text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <Sparkles size={11} className="text-cyan-400" />
                <span>SPEC DELIVERABLE</span>
              </div>
            </div>

            {/* Configurator input submit form */}
            <AnimatePresence mode="wait">
              {!isSubmitSuccessful ? (
                <motion.form
                  key="form"
                  onSubmit={handleOrderSubmit}
                  className="space-y-3.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-[#06b6d4] uppercase block">
                      Secure Dispatch Email Contact
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="ENTER_YOUR_ENCRYPTED_EMAIL@GAMER.SYS"
                        value={emailForm}
                        onChange={(e) => setEmailForm(e.target.value)}
                        className="w-full bg-[#0a0a14] border border-white/5 rounded-sm p-3 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.1)] transition-all"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cyan-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-sm font-display font-medium text-xs tracking-widest uppercase bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-bold"
                  >
                    <ShoppingCart size={14} />
                    INITIALIZE DISPATCH PAYMENT
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-sm border border-cyan-400/50 bg-cyan-950/20 text-center space-y-3"
                >
                  <ShieldCheck className="mx-auto text-cyan-400 animate-bounce" size={28} />
                  <h4 className="text-white font-display font-bold tracking-wide">SECURE DISPATCH INITIALIZED</h4>
                  <p className="text-gray-300 text-xs font-sans leading-relaxed">
                    Check your inbox at <span className="text-cyan-400 font-mono font-bold">{emailForm}</span>. Our e-sports dispatch officers have initialized raw materials packing. Welcome to the REDMAGIC elite team!
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitSuccessful(false);
                      setEmailForm("");
                    }}
                    className="mt-2 text-[10px] font-mono text-cyan-400 hover:text-white transition-colors underline bg-transparent border-0 cursor-pointer"
                  >
                    CONFIGURE ANOTHER RIG
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
