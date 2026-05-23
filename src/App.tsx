import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Menu, 
  X, 
  Settings, 
  VolumeX, 
  Volume2, 
  Compass, 
  Cpu, 
  Activity, 
  Terminal,
  ShieldCheck
} from "lucide-react";

// Import modules
import CustomCursor from "./components/CustomCursor";
import HeroSection from "./components/HeroSection";
import Preloader from "./components/Preloader";
import logoImg from "./assets/images/logo.png";

const preloadableImages = Object.values(
  import.meta.glob("./assets/images/*.{png,jpg,jpeg,webp,avif,svg}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
) as string[];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let visualProgress = 0;
    let targetProgress = 12;
    const startedAt = performance.now();
    const minimumShowTime = 2400;
    const maximumBufferTime = 11000;

    const updateTarget = (nextProgress: number) => {
      targetProgress = Math.max(targetProgress, Math.min(nextProgress, 96));
    };

    const progressTimer = window.setInterval(() => {
      if (cancelled) return;

      visualProgress += Math.max((targetProgress - visualProgress) * 0.12, 0.35);
      setLoadingProgress(Math.min(99, Math.round(visualProgress)));
    }, 45);

    const waitForWindowLoad = () => {
      if (document.readyState === "complete") return Promise.resolve();

      return new Promise<void>((resolve) => {
        window.addEventListener("load", () => resolve(), { once: true });
      });
    };

    const waitForFonts = () => {
      if (!document.fonts?.ready) return Promise.resolve();
      return document.fonts.ready.catch(() => undefined);
    };

    const waitForDomToSettle = () =>
      new Promise<void>((resolve) => {
        let settleTimer = 0;

        const finish = () => {
          window.clearTimeout(settleTimer);
          observer.disconnect();
          resolve();
        };

        const observer = new MutationObserver(() => {
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(finish, 350);
        });

        observer.observe(document.body, { childList: true, subtree: true });
        settleTimer = window.setTimeout(finish, 350);
        window.setTimeout(finish, 2500);
      });

    const decodeImage = (src: string) =>
      new Promise<void>((resolve) => {
        if (!src || src.startsWith("data:")) {
          resolve();
          return;
        }

        const img = new Image();
        const complete = () => resolve();
        const timeoutId = window.setTimeout(complete, 7000);

        img.decoding = "async";
        img.onload = () => {
          window.clearTimeout(timeoutId);
          if (img.decode) {
            img.decode().catch(() => undefined).finally(complete);
          } else {
            complete();
          }
        };
        img.onerror = () => {
          window.clearTimeout(timeoutId);
          complete();
        };
        img.src = src;
      });

    const waitForImages = async () => {
      await waitForDomToSettle();

      const imageUrls = new Set<string>(preloadableImages);
      Array.from(document.images).forEach((img) => {
        const src = img.currentSrc || img.src;
        if (src) imageUrls.add(src);
      });

      const urls = Array.from(imageUrls);
      if (!urls.length) {
        updateTarget(85);
        return;
      }

      let completedImages = 0;
      await Promise.all(
        urls.map((src) =>
          decodeImage(src).finally(() => {
            completedImages += 1;
            updateTarget(20 + (completedImages / urls.length) * 70);
          }),
        ),
      );
    };

    const completeLoading = async () => {
      await Promise.race([
        Promise.all([
          waitForWindowLoad().then(() => updateTarget(30)),
          waitForFonts().then(() => updateTarget(45)),
          waitForImages(),
        ]),
        new Promise((resolve) => window.setTimeout(resolve, maximumBufferTime)),
      ]);

      if (cancelled) return;

      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, minimumShowTime - elapsed);
      updateTarget(100);

      window.setTimeout(() => {
        if (cancelled) return;
        window.clearInterval(progressTimer);
        setLoadingProgress(100);
        window.setTimeout(() => {
          if (!cancelled) setIsLoading(false);
        }, 650);
      }, remaining);
    };

    completeLoading();

    return () => {
      cancelled = true;
      window.clearInterval(progressTimer);
    };
  }, []);

  // Play feedback audio beep
  const playCyberBeep = (freq = 800, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Pitch sweeps
      if (type === "sawtooth" || type === "triangle") {
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + duration);
      } else {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  const scrollToSection = (id: string) => {
    playCyberBeep(600, "triangle", 0.12);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-black custom-cursor-active scanlines relative">
      <CustomCursor />

      <AnimatePresence mode="wait">
        {isLoading && <Preloader progress={loadingProgress} />}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/85 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo element with rotating geometric structure */}
          <div 
            onClick={() => scrollToSection("hero-sec")}
            onMouseEnter={() => playCyberBeep(1200, "sine")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src={logoImg} 
              alt="REDMAGIC Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Desktop Navigation Paths */}
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-mono tracking-widest text-gray-400">
            {[
              { label: "ARMORY", target: "hero-sec" },
              { label: "SPECS", target: "specs-armory" },
              { label: "3D LAB", target: "laptop-3d-system" },
              { label: "MULTIPLEX", target: "performance-arena" },
              { label: "THERMALS", target: "cooling-sec" },
              { label: "QUANTUM COLOUR", target: "display-quantum" },
              { label: "IO PIPES", target: "ports-sec" },
              { label: "ARD DECK", target: "rgb-key-deck" },
            ].map((nav) => (
              <button
                key={nav.label}
                onClick={() => scrollToSection(nav.target)}
                onMouseEnter={() => playCyberBeep(900, "sine")}
                className="hover:text-cyan-400 transition-colors uppercase cursor-pointer"
              >
                {nav.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-xs text-white/30 font-mono tracking-tighter uppercase mr-2 select-none">
              SYSTEM STATUS: OPTIMAL
            </span>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                // Trigger quick confirmation Sweep
                setTimeout(() => {
                  if (!soundEnabled) {
                    try {
                      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                      if (AudioContextClass) {
                        const ctx = new AudioContextClass();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.frequency.setValueAtTime(440, ctx.currentTime);
                        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.3);
                        gain.gain.setValueAtTime(0.04, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.3);
                      }
                    } catch(err) {}
                  }
                }, 50);
              }}
              className={`p-2 rounded-sm border transition-all cursor-pointer ${
                soundEnabled
                  ? "border-cyan-500/40 text-cyan-400 bg-cyan-950/20"
                  : "border-white/5 text-gray-600 hover:text-gray-400"
              }`}
              title="Toggle Cyber Feedback Sounds"
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            <button
              onClick={() => scrollToSection("final-checkout")}
              className="px-6 py-2 border border-cyan-500/50 text-cyan-400 text-xs uppercase tracking-widest hover:bg-cyan-500/10 transition-all rounded-sm cursor-pointer font-bold"
            >
              ORDER NOW
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
              }}
              className="p-1.5 rounded text-gray-500"
            >
              {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/95 border-b border-white/5 overflow-hidden flex flex-col p-6 space-y-4 lg:hidden text-[11px] font-mono tracking-widest text-[#06b6d4]"
          >
            {[
              { label: "ARMORY", target: "hero-sec" },
              { label: "SPECS", target: "specs-armory" },
              { label: "3D LAB", target: "laptop-3d-system" },
              { label: "MULTIPLEX", target: "performance-arena" },
              { label: "THERMALS", target: "cooling-sec" },
              { label: "QUANTUM COLOUR", target: "display-quantum" },
              { label: "IO PIPES", target: "ports-sec" },
              { label: "ARD DECK", target: "rgb-key-deck" },
            ].map((nav) => (
              <button
                key={nav.label}
                onClick={() => scrollToSection(nav.target)}
                className="w-full text-left py-2 border-b border-white/5 hover:text-white transition-colors"
              >
                {nav.label}
              </button>
            ))}
             <button
              onClick={() => scrollToSection("final-checkout")}
              className="w-full text-center py-3 bg-white text-black font-semibold tracking-wider rounded-sm text-xs font-mono"
            >
              BUY NOW
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 w-full">
        <HeroSection 
          onExploreClick={() => window.open("https://redmagic.gg/pages/redmagic-titan-16-pro", "_blank")}
          onBuyClick={() => window.open("https://redmagic.gg/pages/redmagic-titan-16-pro", "_blank")}
        />
      </main>

      <div className="fixed bottom-6 right-6 z-40 pointer-events-auto select-none font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-white/30 hover:text-cyan-400 transition-colors duration-500 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/5 rounded-sm flex items-center gap-2 shadow-2xl group">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/30 group-hover:bg-cyan-400 transition-colors animate-pulse" />
        <span>DESIGNED BY PRANEET KAMBLE</span>
        <div className="absolute -top-[1px] -left-[1px] w-1 h-1 border-t border-l border-cyan-500/30 group-hover:border-cyan-400 transition-colors" />
        <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-cyan-500/30 group-hover:border-cyan-400 transition-colors" />
      </div>
    </div>
  );
}
