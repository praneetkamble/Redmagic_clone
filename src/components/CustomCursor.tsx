import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const trailRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      setIsHidden(false);
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest(".cursor-pointer") ||
        target.closest("input") ||
        target.closest("select");

      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", updateHoverState);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    let frameId: number;
    const tick = () => {
      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.4;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.4;

      trailPos.current.x += (mouse.current.x - trailPos.current.x) * 0.12;
      trailPos.current.y += (mouse.current.y - trailPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate3d(-50%, -50%, 0)`;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", updateHoverState);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (isHidden || (typeof window !== "undefined" && window.innerWidth < 1024)) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={trailRef}
        className="absolute top-0 left-0 rounded-full border border-cyan-400/80 transition-all duration-300 ease-out"
        style={{
          width: isHovering ? "42px" : "28px",
          height: isHovering ? "42px" : "28px",
          boxShadow: isHovering
            ? "0 0 18px rgba(6, 182, 212, 0.5)"
            : "0 0 8px rgba(6, 182, 212, 0.15)",
          willChange: "transform",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-cyan-400" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-cyan-400" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-[1px] bg-cyan-400" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-[1px] bg-cyan-400" />
      </div>

      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full bg-pink-500 transition-all duration-200"
        style={{
          width: isHovering ? "8px" : "4px",
          height: isHovering ? "8px" : "4px",
          boxShadow: "0 0 8px rgba(236, 72, 153, 0.8)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

