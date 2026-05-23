import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Cpu, Wind, Monitor, Keyboard, Terminal } from "lucide-react";
import logoImg from "../assets/images/logo.png";

interface PortInfo {
  id: string;
  name: string;
  desc: string;
  side: "left" | "right" | "back";
  position: [number, number, number]; // 3D coordinates relative to keyboard base
}

const LAPTOP_PORTS: PortInfo[] = [
  { id: "thunderbolt", name: "Thunderbolt 5", desc: "Up to 120Gbps next-gen ultra-high bandwidth", side: "back", position: [-1.2, 0.15, -1.8] },
  { id: "hdmi", name: "HDMI 2.1 FRL", desc: "Smooth 8K/60Hz or 4K/120Hz display outputs", side: "back", position: [-0.6, 0.15, -1.8] },
  { id: "lan", name: "2.5G RJ45 Port", desc: "Lag-free ultra-fast wired e-sports connection", side: "back", position: [0.6, 0.15, -1.8] },
  { id: "usbc", name: "USB-C 3.2 Gen2", desc: "Fast data delivery & DisplayPort video support", side: "right", position: [2.05, 0.15, 0.2] },
  { id: "usba", name: "USB-A 3.2 Gen1", desc: "Dual responsive high-speed esports mouse ports", side: "left", position: [-2.05, 0.15, 0.4] },
];

export default function ThreeLaptopViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keyboardCanvasRef = useRef<HTMLCanvasElement>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction/Animation States
  const [isOpen, setIsOpen] = useState(true);
  const [keyboardPreset, setKeyboardPreset] = useState<"cyber" | "pulse" | "solid">("cyber");
  const [fanSpeed, setFanSpeed] = useState<"quiet" | "balance" | "diabolic">("diabolic");
  const [activePort, setActivePort] = useState<PortInfo | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  // ThreeJS Internal References
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const laptopGroupRef = useRef<THREE.Group | null>(null);
  const lidGroupRef = useRef<THREE.Group | null>(null);
  const keyboardTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const coolingFansRef = useRef<THREE.Mesh[]>([]);

  // Track Mouse
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, downX: 0, downY: 0 });
  const openProgressRef = useRef(1); // 1 = open, 0 = closed

  // Handle Resize and Dimensions
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x04040a, 0.04);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.5);
    camera.lookAt(0, -0.3, 0); // Crucial: orient camera to look directly at the model!
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x222238, 2.5);
    scene.add(ambientLight);

    // Neon Spotlight Cyan (Top Left Accent)
    const cyanLight = new THREE.SpotLight(0x06b6d4, 45, 20, Math.PI / 4, 0.5, 1);
    cyanLight.position.set(-4, 5, 3);
    cyanLight.castShadow = true;
    scene.add(cyanLight);

    // Neon Spotlight Purple (Top Right Accent)
    const purpleLight = new THREE.SpotLight(0xa855f7, 45, 20, Math.PI / 4, 0.5, 1);
    purpleLight.position.set(4, 5, 2);
    purpleLight.castShadow = true;
    scene.add(purpleLight);

    // Soft Front Fill Light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(0, 2, 4);
    scene.add(dirLight);

    // Rim Highlight (from back)
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 3.5);
    rimLight.position.set(0, 1, -5);
    scene.add(rimLight);

    // HOLOGRAPHIC GRID FLOOR
    const gridHelper = new THREE.GridHelper(20, 40, 0x06b6d4, 0x111129);
    gridHelper.position.y = -1.2;
    // Lower opacity through material configuration
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0.12;
      });
    } else {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.12;
    }
    scene.add(gridHelper);

    // Floating concentric holographic HUD rings under laptop (Counter-spinning)
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const ring1 = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.55, 64), ringMat1);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -1.18;
    scene.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const ring2 = new THREE.Mesh(new THREE.RingGeometry(1.78, 1.84, 32), ringMat2);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -1.18;
    scene.add(ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.15 });
    const ring3 = new THREE.Mesh(new THREE.RingGeometry(2.1, 2.15, 6), ringMat3); // Hexagonal HUD border
    ring3.rotation.x = Math.PI / 2;
    ring3.position.y = -1.18;
    scene.add(ring3);

    // Holographic sci-fi rising energy coordinate particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 4.5;
      particlePos[i * 3 + 1] = -1.18 + Math.random() * 3.0;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      particleSpeeds.push(0.004 + Math.random() * 0.008);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Dynamic procedural textures
    setupProceduralTextures();

    // LAPTOP GROUP
    const laptopGroup = new THREE.Group();
    laptopGroupRef.current = laptopGroup;
    laptopGroup.position.y = -0.3;
    scene.add(laptopGroup);

    // BUILD PORTIONS
    buildProceduralLaptop(laptopGroup);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // Event listeners for dragging
    const handleMouseDown = (e: MouseEvent) => {
      mouse.current.isDown = true;
      mouse.current.downX = e.clientX;
      mouse.current.downY = e.clientY;
      setIsRotating(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const yNorm = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.current.targetX = xNorm * 0.4;
      mouse.current.targetY = yNorm * 0.3;

      if (mouse.current.isDown) {
        const diffX = e.clientX - mouse.current.downX;
        const diffY = e.clientY - mouse.current.downY;
        if (laptopGroupRef.current) {
          laptopGroupRef.current.rotation.y += diffX * 0.007;
          laptopGroupRef.current.rotation.x = Math.max(
            -0.2,
            Math.min(0.8, laptopGroupRef.current.rotation.x + diffY * 0.007)
          );
        }
        mouse.current.downX = e.clientX;
        mouse.current.downY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      mouse.current.isDown = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // START ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic ambient animations
      updateDynamicTextures(elapsedTime, openProgressRef.current);

      // Rotate fans inside cooling system
      let rotSpeed = 0.05;
      if (fanSpeed === "balance") rotSpeed = 0.15;
      if (fanSpeed === "diabolic") rotSpeed = 0.4;
      rotSpeed *= openProgressRef.current; // spin down when closed
      coolingFansRef.current.forEach((fan) => {
        fan.rotation.z += rotSpeed;
      });

      // Slowly float or auto-rotate laptop if user is not dragging
      if (laptopGroupRef.current) {
        if (isRotating && !mouse.current.isDown) {
          laptopGroupRef.current.rotation.y = elapsedTime * 0.12;
          laptopGroupRef.current.position.y = -0.3 + Math.sin(elapsedTime * 1.5) * 0.08;
        } else if (!mouse.current.isDown) {
          // Smoothly return to center or follow keyboard cursor offset
          laptopGroupRef.current.rotation.y += (mouse.current.targetX * 1.5 - laptopGroupRef.current.rotation.y) * 0.05;
          laptopGroupRef.current.rotation.x += (mouse.current.targetY * 0.5 - laptopGroupRef.current.rotation.x) * 0.05;
          laptopGroupRef.current.position.y += (-0.3 + Math.sin(elapsedTime * 0.6) * 0.02 - laptopGroupRef.current.position.y) * 0.05;
        }
      }

      // Smooth concentric HUD rings spinning
      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.25;
      ring3.rotation.z = elapsedTime * 0.05;
      
      ring1.scale.setScalar(1 + Math.sin(elapsedTime * 1.5) * 0.03);
      ring2.scale.setScalar(1 + Math.cos(elapsedTime * 2.0) * 0.02);

      // Fade concentric HUD rings out when laptop is closed
      if (Array.isArray(ring1.material)) {
        ring1.material.forEach((m) => {
          m.transparent = true;
          m.opacity = 0.35 * openProgressRef.current;
        });
      } else {
        ring1.material.transparent = true;
        ring1.material.opacity = 0.35 * openProgressRef.current;
      }
      if (Array.isArray(ring2.material)) {
        ring2.material.forEach((m) => {
          m.transparent = true;
          m.opacity = 0.25 * openProgressRef.current;
        });
      } else {
        ring2.material.transparent = true;
        ring2.material.opacity = 0.25 * openProgressRef.current;
      }
      if (Array.isArray(ring3.material)) {
        ring3.material.forEach((m) => {
          m.transparent = true;
          m.opacity = 0.15 * openProgressRef.current;
        });
      } else {
        ring3.material.transparent = true;
        ring3.material.opacity = 0.15 * openProgressRef.current;
      }

      // Update holographic energy particles rising up
      const posArr = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += particleSpeeds[i] * openProgressRef.current;
        posArr[i * 3] += Math.sin(elapsedTime * 0.5 + i) * 0.0015 * openProgressRef.current;
        if (posArr[i * 3 + 1] > 1.8) {
          posArr[i * 3 + 1] = -1.18;
          posArr[i * 3] = (Math.random() - 0.5) * 4.5;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      if (Array.isArray(particles.material)) {
        particles.material.forEach((m) => {
          m.transparent = true;
          m.opacity = 0.7 * openProgressRef.current;
        });
      } else {
        particles.material.transparent = true;
        particles.material.opacity = 0.7 * openProgressRef.current;
      }

      // Scaling of engine/vent flames & core pulsations based on fan speed
      let flameScale = 0.15;
      let waveFreq = 18;
      if (fanSpeed === "balance") {
        flameScale = 0.55;
        waveFreq = 30;
      } else if (fanSpeed === "diabolic") {
        flameScale = 1.25;
        waveFreq = 45;
      }
      
      if (laptopGroupRef.current) {
        laptopGroupRef.current.traverse((child) => {
          if (child.name === "flameLeft" || child.name === "flameRight") {
            const factor = flameScale * (0.82 + 0.22 * Math.sin(elapsedTime * waveFreq)) * openProgressRef.current;
            child.scale.set(factor, factor, factor * 1.4);
            child.rotation.y = Math.sin(elapsedTime * waveFreq * 1.2) * 0.04;
          }
          if (child.name === "powerCore") {
            const pulsate = (0.85 + 0.22 * Math.sin(elapsedTime * (fanSpeed === "diabolic" ? 14 : 6))) * openProgressRef.current;
            child.scale.set(pulsate, 1, pulsate);
          }
          if (child.name === "powerCoreHalo") {
            const pulsate = (1.05 + 0.3 * Math.sin(elapsedTime * (fanSpeed === "diabolic" ? 14 : 6) + 1.25)) * openProgressRef.current;
            child.scale.set(pulsate, 1, pulsate);
          }
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update Lid Angle and Port Selection smoothly
  useEffect(() => {
    if (!lidGroupRef.current) return;
    const targetAngle = isOpen ? -0.45 : Math.PI / 2; // -0.45 rad is open, Math.PI/2 rad (90deg) folds forward and closes
    gsap.to(lidGroupRef.current.rotation, {
      x: targetAngle,
      duration: 1.2,
      ease: "power2.inOut",
    });

    // Animate the openProgress property on the ref object from 1 to 0
    gsap.to(openProgressRef, {
      current: isOpen ? 1 : 0,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  // Procedural Textures Helper
  const setupProceduralTextures = () => {
    // 1. Keyboard Canvas texture (Dynamic RGB Grid)
    const kCanvas = keyboardCanvasRef.current;
    if (kCanvas) {
      kCanvas.width = 512;
      kCanvas.height = 256;
      const ctx = kCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c0c16";
        ctx.fillRect(0, 0, 512, 256);
      }
      const kTexture = new THREE.CanvasTexture(kCanvas);
      kTexture.colorSpace = THREE.SRGBColorSpace;
      keyboardTextureRef.current = kTexture;
    }

    // 2. Screen Canvas Wallpaper (Animated cyber futuristic dashboard)
    const sCanvas = screenCanvasRef.current;
    if (sCanvas) {
      sCanvas.width = 1024;
      sCanvas.height = 640;
      const ctx = sCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#040409";
        ctx.fillRect(0, 0, 1024, 640);
      }
      const sTexture = new THREE.CanvasTexture(sCanvas);
      sTexture.colorSpace = THREE.SRGBColorSpace;
      screenTextureRef.current = sTexture;
    }
  };

  // Redraw canvases every frame for real-time animations!
  const updateDynamicTextures = (time: number, progress: number) => {
    // A. Keyboard RGB Waves
    const kCanvas = keyboardCanvasRef.current;
    if (kCanvas && keyboardTextureRef.current) {
      const ctx = kCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0c0c16";
        ctx.fillRect(0, 0, 512, 256);

        // Render RGB Key Blocks
        const cols = 20;
        const rows = 8;
        const kw = 500 / cols;
        const kh = 240 / rows;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = 6 + c * kw;
            const y = 8 + r * kh;

            // Compute RGB Wave based on preset
            let color = `rgba(6, 182, 212, ${0.4 * progress})`; // Default cyan
            if (keyboardPreset === "cyber") {
              const hue = (c * 15 + r * 10 + time * 180) % 360;
              color = `hsla(${hue}, 90%, 55%, ${0.8 * progress})`;
            } else if (keyboardPreset === "pulse") {
              const alpha = (0.2 + 0.6 * Math.sin(time * 3 + c * 0.4)) * progress;
              color = `rgba(168, 85, 247, ${alpha})`;
            } else if (keyboardPreset === "solid") {
              color = `rgba(6, 182, 212, ${0.8 * progress})`;
            }

            ctx.fillStyle = color;
            ctx.shadowBlur = 8 * progress;
            ctx.shadowColor = color;
            ctx.fillRect(x + 1, y + 1, kw - 3, kh - 3);
          }
        }
        ctx.shadowBlur = 0; // reset
      }
      keyboardTextureRef.current.needsUpdate = true;
    }

    // B. Screen Dynamic Futuristic Layout
    const sCanvas = screenCanvasRef.current;
    if (sCanvas && screenTextureRef.current) {
      const ctx = sCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#020204";
        ctx.fillRect(0, 0, 1024, 640);

        // Animated neon digital grid on screen
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * progress})`;
        ctx.lineWidth = 1;
        const gridGap = 40;
        const shift = (time * 20) % gridGap;
        for (let x = shift; x < 1024; x += gridGap) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 640);
          ctx.stroke();
        }
        for (let y = shift; y < 640; y += gridGap) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1024, y);
          ctx.stroke();
        }

        // Geometric balance rotating nested squares on the laptops screen
        ctx.save();
        ctx.translate(512, 320);
        ctx.rotate(time * 0.45);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.35 * progress})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(-120, -120, 240, 240);
        ctx.rotate(-time * 0.9);
        ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 * progress})`;
        ctx.strokeRect(-80, -80, 160, 160);
        ctx.restore();

        // Waveform visualizer at screen bottom
        ctx.fillStyle = `rgba(6, 182, 212, ${0.6 * progress})`;
        const barWidth = 8;
        const barCount = 60;
        for (let i = 0; i < barCount; i++) {
          const x = 512 - (barCount * barWidth) / 2 + i * barWidth;
          const noise = Math.abs(Math.sin(i * 0.15 + time * 6.0) * Math.cos(i * 0.05 + time * 3.0));
          const h = (20 + noise * 120) * progress;
          ctx.fillRect(x + 1, 480 - h / 2, barWidth - 2, h);
        }

        // Glowing technical labels
        ctx.font = 'bold 36px "Space Grotesk"';
        ctx.fillStyle = `rgba(255, 255, 255, ${progress})`;
        ctx.textAlign = "center";
        ctx.fillText("REDMAGIC OS v7.0", 512, 260);

        ctx.font = '400 16px "JetBrains Mono"';
        ctx.fillStyle = `rgba(6, 182, 212, ${progress})`;
        ctx.fillText("SYSTEM PERFORMANCE: EXTREME DIABOLIC MODE", 512, 290);

        ctx.font = '300 13px "JetBrains Mono"';
        ctx.fillStyle = `rgba(255, 255, 255, ${0.45 * progress})`;
        ctx.fillText(`THERMAL COMPONENT: ${fanSpeed.toUpperCase()}`, 512, 320);
        ctx.fillText("LIQUID METAL TEMPERATURE: 38.5°C", 512, 340);
        ctx.fillText(`KEYBOARD LINK: ARGB WAVE ${keyboardPreset.toUpperCase()}`, 512, 360);

        // Core visual accents (moving target vectors)
        ctx.strokeStyle = `rgba(168, 85, 247, ${progress})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(512 + Math.cos(time * 0.8) * 200, 320 + Math.sin(time * 0.8) * 150, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      screenTextureRef.current.needsUpdate = true;
    }
  };

  // LAPTOP BUILDER
  const buildProceduralLaptop = (group: THREE.Group) => {
    // ----------------------------------------------------
    // A. KEYBOARD BASE (The bottom half)
    // ----------------------------------------------------
    const baseW = 3.6;
    const baseH = 0.12;
    const baseD = 2.4;

    const baseGeometry = new THREE.BoxGeometry(baseW, baseH, baseD);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x181822, // Sleek premium titanium look
      roughness: 0.18,
      metalness: 0.90,
    });
    const keyboardBase = new THREE.Mesh(baseGeometry, baseMaterial);
    keyboardBase.castShadow = true;
    keyboardBase.receiveShadow = true;
    group.add(keyboardBase);

    // Sculpted angular premium trim armor plates (Left/Right margins)
    const trimGeo = new THREE.BoxGeometry(0.5, 0.04, baseD);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a14,
      roughness: 0.1,
      metalness: 0.95,
    });
    const leftTrim = new THREE.Mesh(trimGeo, trimMat);
    leftTrim.position.set(-1.62, baseH / 2 + 0.01, 0);
    const rightTrim = new THREE.Mesh(trimGeo, trimMat);
    rightTrim.position.set(1.62, baseH / 2 + 0.01, 0);
    group.add(leftTrim);
    group.add(rightTrim);

    // Protruding futuristic Rear Utility Ports Deck (Rear Shelf)
    const shelfGeo = new THREE.BoxGeometry(baseW * 0.92, baseH * 0.8, 0.32);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f15,
      roughness: 0.2,
      metalness: 0.85,
    });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, -0.01, -baseD / 2 - 0.16);
    group.add(shelf);

    // Decorative copper heat sink liquid flow pipes inside a transparent plexiglass deck window
    const windowChamberMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      metalness: 0.95,
    });
    const syncWindow = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.005, 0.35), windowChamberMat);
    syncWindow.position.set(0, baseH / 2 + 0.004, -0.68);
    group.add(syncWindow);

    // Copper Heat pipes running underneath glass window
    const copperPipeMat = new THREE.MeshStandardMaterial({
      color: 0xd2691e, // Deep copper
      roughness: 0.15,
      metalness: 0.95,
    });
    const pipeY = baseH / 2 - 0.025;
    for (let i = -1; i <= 1; i += 2) {
      const pipeGeo = new THREE.CylinderGeometry(0.024, 0.024, 1.2, 8);
      const pipe = new THREE.Mesh(pipeGeo, copperPipeMat);
      pipe.rotation.z = Math.PI / 2 + i * 0.12;
      pipe.position.set(i * 0.35, pipeY, -0.68);
      group.add(pipe);
    }

    // Glowing Power Reactor Core (CPU/GPU core visual)
    const coreGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const powerCore = new THREE.Mesh(coreGeo, coreMat);
    powerCore.name = "powerCore";
    powerCore.position.set(0, baseH / 2 + 0.005, -0.68);
    group.add(powerCore);

    const coreHaloGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.015, 16);
    const coreHaloMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.65 });
    const coreHalo = new THREE.Mesh(coreHaloGeo, coreHaloMat);
    coreHalo.name = "powerCoreHalo";
    coreHalo.position.set(0, baseH / 2 + 0.004, -0.68);
    group.add(coreHalo);

    // Decorative RGB Light strip on base sides
    const leftLightGeo = new THREE.BoxGeometry(0.012, 0.04, baseD);
    const rightLightGeo = new THREE.BoxGeometry(0.012, 0.04, baseD);
    const barRGBMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.92,
    });
    const leftLight = new THREE.Mesh(leftLightGeo, barRGBMaterial);
    leftLight.position.set(-baseW / 2 - 0.006, 0, 0);
    const rightLight = new THREE.Mesh(rightLightGeo, barRGBMaterial);
    rightLight.position.set(baseW / 2 + 0.006, 0, 0);
    group.add(leftLight);
    group.add(rightLight);

    // Rear Side Vent Exhaust Jet Flames
    const flameMatLeft = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const flameMatRight = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const jetLeft = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.42, 16), flameMatLeft);
    jetLeft.name = "flameLeft";
    jetLeft.rotation.x = -Math.PI / 2;
    jetLeft.position.set(-1.25, -0.01, -baseD / 2 - 0.12);
    group.add(jetLeft);

    const jetRight = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.42, 16), flameMatRight);
    jetRight.name = "flameRight";
    jetRight.rotation.x = -Math.PI / 2;
    jetRight.position.set(1.25, -0.01, -baseD / 2 - 0.12);
    group.add(jetRight);

    // Dynamic keyboard insert plane
    const keyGeo = new THREE.PlaneGeometry(baseW * 0.72, baseD * 0.54);
    const keyMat = new THREE.MeshBasicMaterial({
      map: keyboardTextureRef.current,
      transparent: true,
      opacity: 0.98,
    });
    const keyboardPlane = new THREE.Mesh(keyGeo, keyMat);
    keyboardPlane.rotation.x = -Math.PI / 2;
    keyboardPlane.position.set(0, baseH / 2 + 0.002, 0.12);
    group.add(keyboardPlane);

    // Trackpad block
    const padGeo = new THREE.BoxGeometry(0.85, 0.002, 0.48);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x12121a,
      roughness: 0.12,
      metalness: 0.85,
    });
    const trackPad = new THREE.Mesh(padGeo, padMat);
    trackPad.position.set(0, baseH / 2 + 0.001, 0.88);
    group.add(trackPad);

    // Trackpad cyan accent border line
    const boxHelper = new THREE.BoxHelper(trackPad, 0x06b6d4);
    boxHelper.position.y += 0.001;
    group.add(boxHelper);

    // Upgraded Mechanical Hinge Blocks (Dual high-precision mechanical metal hinges instead of a single rod)
    const hingeMat = new THREE.MeshStandardMaterial({
      color: 0x22222a,
      roughness: 0.2,
      metalness: 0.90,
    });
    for (let i = -1; i <= 1; i += 2) {
      const singleHinge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.38, 16), hingeMat);
      singleHinge.rotation.z = Math.PI / 2;
      singleHinge.position.set(i * 1.15, baseH / 2 + 0.02, -baseD / 2 + 0.18);
      group.add(singleHinge);
    }

    // Cooling Exhaust Fans inside (animated fan blades visible in rear airflow chambers)
    for (let i = -1; i <= 1; i += 2) {
      const fanGroup = new THREE.Group();
      fanGroup.position.set(i * 1.1, -0.01, -baseD / 2 + 0.12);
      
      const fanOuter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0x0a0a10, roughness: 0.5 })
      );
      fanOuter.rotation.x = Math.PI / 2;
      fanGroup.add(fanOuter);

      const bladesGeo = new THREE.CylinderGeometry(0.04, 0.22, 0.01, 8);
      const bladesMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const blades = new THREE.Mesh(bladesGeo, bladesMat);
      blades.rotation.x = Math.PI / 2;
      fanGroup.add(blades);

      coolingFansRef.current.push(blades);
      group.add(fanGroup);
    }

    // Realistically shiny metal ports sockets
    LAPTOP_PORTS.forEach((p) => {
      const pGeo = new THREE.BoxGeometry(
        p.side === "back" ? 0.18 : 0.012,
        0.06,
        p.side === "back" ? 0.012 : 0.18
      );
      const pMat = new THREE.MeshStandardMaterial({
        color: 0xffd700, // Golden connectors inside
        roughness: 0.1,
        metalness: 0.95,
      });
      const pin = new THREE.Mesh(pGeo, pMat);
      pin.position.set(p.position[0], p.position[1] - 0.05, p.position[2]);
      group.add(pin);
    });

    // ----------------------------------------------------
    // B. SCREEN / LID (The upper half)
    // ----------------------------------------------------
    const lidGroup = new THREE.Group();
    lidGroupRef.current = lidGroup;
    lidGroup.position.set(0, baseH / 2 + 0.02, -baseD / 2 + 0.18);
    group.add(lidGroup);

    // Lid chassis backing
    const lidW = 3.6;
    const lidH = 2.38;
    const lidThick = 0.06;

    const lidBackGeo = new THREE.BoxGeometry(lidW, lidH, lidThick);
    const lidBackMat = new THREE.MeshStandardMaterial({
      color: 0x181822, // matching the base
      roughness: 0.18,
      metalness: 0.90,
    });
    const lidBack = new THREE.Mesh(lidBackGeo, lidBackMat);
    lidBack.position.set(0, lidH / 2, -lidThick / 2);
    lidBack.castShadow = true;
    lidBack.receiveShadow = true;
    lidGroup.add(lidBack);

    // Glowing RGB strip on the lid back (Vibrant LED framing)
    const topLightGeo = new THREE.BoxGeometry(lidW * 0.88, 0.018, 0.005);
    const topBarRGB = new THREE.Mesh(topLightGeo, barRGBMaterial);
    topBarRGB.position.set(0, lidH * 0.94, 0.02);
    lidGroup.add(topBarRGB);

    // Advanced cyber armor detail plates on the corners of the lid back
    const lidTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d14,
      roughness: 0.15,
      metalness: 0.95,
    });
    const cornerPlateLeft = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.4, 0.02), lidTrimMat);
    cornerPlateLeft.position.set(-lidW / 2 + 0.16, lidH / 2, -lidThick - 0.001);
    const cornerPlateRight = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.4, 0.02), lidTrimMat);
    cornerPlateRight.position.set(lidW / 2 - 0.16, lidH / 2, -lidThick - 0.001);
    lidGroup.add(cornerPlateLeft);
    lidGroup.add(cornerPlateRight);

    // Lid Logo
    const logoGroup = new THREE.Group();
    logoGroup.position.set(0, lidH / 2, -lidThick - 0.002);
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load(logoImg);
    const logoGeo = new THREE.PlaneGeometry(0.35, 0.35);
    const logoMat = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.rotation.y = Math.PI;
    logoGroup.add(logoMesh);
    lidGroup.add(logoGroup);

    // Display Panel Frame (Screen glass overlay)
    const glassGeo = new THREE.PlaneGeometry(lidW * 0.96, lidH * 0.95);
    const glassMat = new THREE.MeshBasicMaterial({
      map: screenTextureRef.current,
    });
    const displayPlane = new THREE.Mesh(glassGeo, glassMat);
    displayPlane.position.set(0, lidH / 2, lidThick / 2 + 0.001);
    lidGroup.add(displayPlane);
  };

  const handlePortHover = (port: PortInfo | null) => {
    setActivePort(port);
  };

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row items-stretch" id="laptop-3d-system">
      {/* 3D Render WebGL Canvas */}
      <div 
        ref={containerRef} 
        className="relative flex-1 h-[450px] md:h-full cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Dynamic Halo & Scanlines overlay on Canvas side */}
        <div className="absolute inset-0 pointer-events-none cyber-grid-dots bg-opacity-20" />
        
        {/* Help tooltip overlay in corner */}
        <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded text-xs text-cyan-400 font-mono tracking-wider flex items-center gap-1.5 shadow-md">
          <Terminal size={13} className="animate-pulse text-cyan-400" />
          <span>DRAG TO ROTATE MODEL • ZOOM TO FOCUS</span>
        </div>

        {/* 3D floating annotations projecting dynamically depending on hover port */}
        {activePort && (
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/85 backdrop-blur-md border border-cyan-400 px-4 py-3 rounded-md shadow-[0_0_20px_rgba(6,182,212,0.4)] text-left min-w-[240px] pointer-events-none z-10 transition-all duration-300 transform scale-100"
            style={{
              boxShadow: "0 0 25px rgba(6, 182, 212, 0.45)"
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <h4 className="text-white font-display font-medium text-sm tracking-wide">{activePort.name}</h4>
            </div>
            <p className="text-gray-300 text-xs font-sans leading-relaxed">{activePort.desc}</p>
            <div className="mt-2 text-[10px] font-mono text-cyan-500/80 border-t border-cyan-500/20 pt-1">
              CHASSIS MOUNT: {activePort.side.toUpperCase()} PANEL
            </div>
          </div>
        )}

        {/* Hidden canvases used for raw dynamic rendering of keyboard lights and screen */}
        <canvas ref={keyboardCanvasRef} className="hidden" />
        <canvas ref={screenCanvasRef} className="hidden" />
      </div>

      {/* Futuristic Cyborg Control Dashboard panel */}
      <div className="w-full md:w-[360px] lg:w-[400px] bg-[#09090f] border-t md:border-t-0 md:border-l border-white/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto z-10 relative">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-mono tracking-widest uppercase bg-cyan-950/40 px-2.5 py-1 rounded-sm border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Interactive Lab
            </div>
            <h3 className="text-2xl font-display font-medium text-white tracking-tight">Cyborg Engine v7.0</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-sans">
              Interact directly with the titanium alloy structure, trigger hinge dynamics, and overclock internal cooling channels in real-time.
            </p>
          </div>

          {/* Haptic Mechanics control */}
          <div className="space-y-3 pt-2">
            <h5 className="text-[11px] font-mono tracking-widest text-cyan-500 uppercase">Mechanical Action</h5>
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm text-xs font-mono tracking-wider transition-all border duration-300 ${
                  isOpen
                    ? "bg-cyan-500 text-black border-cyan-400 font-bold glow-box-cyan"
                    : "bg-transparent text-cyan-400 border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/5"
                }`}
              >
                <Monitor size={14} />
                {isOpen ? "CLOSE DISPLAY LID" : "OPEN DISPLAY LID"}
              </button>

              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`flex items-center justify-center p-2.5 rounded-sm text-xs font-mono transition-all border duration-300 ${
                  isRotating
                    ? "bg-purple-600 text-white border-purple-500 glow-box-purple"
                    : "bg-transparent text-purple-400 border-purple-500/30 hover:border-purple-500/60"
                }`}
                title="Toggle Auto Rotation Orbit"
              >
                {isRotating ? "AUTOPILOT" : "MANUAL DRAG"}
              </button>
            </div>
          </div>

          {/* Interactive Keyboard Controller */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-mono tracking-widest text-cyan-500 uppercase">Keys RGB Preset</h5>
            <div className="grid grid-cols-3 gap-2">
              {(["cyber", "pulse", "solid"] as const).map((pres) => (
                <button
                  key={pres}
                  onClick={() => setKeyboardPreset(pres)}
                  className={`px-3 py-2 rounded-sm text-[10px] font-mono text-center tracking-widest uppercase border transition-all duration-300 ${
                    keyboardPreset === pres
                      ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                      : "bg-[#0b0b14] text-gray-400 border-white/5 hover:border-cyan-400/30 hover:text-cyan-400"
                  }`}
                >
                  <Keyboard size={11} className="mx-auto mb-1 opacity-85" />
                  {pres}
                </button>
              ))}
            </div>
          </div>

          {/* Active Cooling Interceptor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h5 className="text-[11px] font-mono tracking-widest text-cyan-500 uppercase">Active Fan Overclock</h5>
              <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1.5 animate-pulse">
                <Wind size={10} />
                {fanSpeed === "quiet" && "1800RPM"}
                {fanSpeed === "balance" && "3600RPM"}
                {fanSpeed === "diabolic" && "6400RPM"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["quiet", "balance", "diabolic"] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setFanSpeed(spd)}
                  className={`px-2 py-2 rounded-sm text-[10px] font-mono text-center tracking-widest uppercase border transition-all duration-300 ${
                    fanSpeed === spd
                      ? "bg-purple-500/15 text-purple-300 border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                      : "bg-[#0b0b14] text-gray-400 border-white/5 hover:border-purple-400/30 hover:text-purple-400"
                  }`}
                >
                  <Cpu size={11} className="mx-auto mb-1 opacity-85" />
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Port Interactive highlight map */}
          <div className="space-y-3 pt-2">
            <h5 className="text-[11px] font-mono tracking-widest text-cyan-500 uppercase">Interactive Port Layout</h5>
            <div className="space-y-1.5">
              {LAPTOP_PORTS.map((port) => {
                const isActive = activePort?.id === port.id;
                return (
                  <div
                    key={port.id}
                    onMouseEnter={() => handlePortHover(port)}
                    onMouseLeave={() => handlePortHover(null)}
                    className={`p-2 rounded-sm text-xs flex justify-between items-center transition-all duration-300 border cursor-pointer ${
                      isActive
                        ? "bg-cyan-950/40 text-white border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        : "bg-[#0b0b14] text-gray-400 border-white/5 hover:border-cyan-500/20 hover:bg-[#0f0f1c]"
                    }`}
                  >
                    <div>
                      <span className="font-medium text-white block">{port.name}</span>
                      <span className="text-[10px] text-gray-400 font-sans block truncate w-56 md:w-48 lg:w-56">{port.desc}</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase bg-white/5 px-1.5 py-0.5 rounded-sm text-gray-400 tracking-wider">
                      {port.side}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 mt-6 text-[11px] font-mono text-gray-500 flex justify-between">
          <span>CORES: i9-14900HX</span>
          <span>GPU: RTX 4070 / 5080</span>
        </div>
      </div>
    </div>
  );
}
