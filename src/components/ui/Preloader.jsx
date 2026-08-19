import React, { useEffect, useRef, useCallback, useMemo, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const SplitWords = memo(function SplitWords({ text, innerRef }) {
  const words = text.split(" ");
  return (
    <span
      ref={innerRef}
      className="flex flex-wrap justify-center gap-x-[0.2em] w-full"
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            data-word="true"
            className="inline-block translate-y-[110%] will-change-transform"
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
});

// Boxy, angular front-view headset with a moving lens-scan highlight.
const BoxyHeadset = memo(function BoxyHeadset({ innerRef, className }) {
  return (
    <svg
      ref={innerRef}
      viewBox="0 0 200 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="headset-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB13C">
            <animate
              attributeName="stop-color"
              values="#FFB13C;#37F0FF;#FF3D7A;#FFB13C"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#FF3D7A">
            <animate
              attributeName="stop-color"
              values="#FF3D7A;#FFB13C;#37F0FF;#FF3D7A"
              dur="5s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        <filter id="headset-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id="lens-left-clip">
          <rect x="34" y="32" width="54" height="56" rx="6" />
        </clipPath>
        <clipPath id="lens-right-clip">
          <rect x="112" y="32" width="54" height="56" rx="6" />
        </clipPath>
      </defs>

      {/* Side straps */}
      <rect x="0" y="44" width="16" height="32" rx="3" fill="url(#headset-gradient)" opacity="0.35" />
      <rect x="184" y="44" width="16" height="32" rx="3" fill="url(#headset-gradient)" opacity="0.35" />

      {/* Main boxy shell */}
      <rect
        x="14" y="14" width="172" height="92" rx="10"
        fill="#0a0a0a" stroke="url(#headset-gradient)" strokeWidth="3"
        filter="url(#headset-glow)"
      />

      {/* Lenses */}
      <rect x="34" y="32" width="54" height="56" rx="6" fill="#050505" stroke="url(#headset-gradient)" strokeWidth="2.5" />
      <rect x="112" y="32" width="54" height="56" rx="6" fill="#050505" stroke="url(#headset-gradient)" strokeWidth="2.5" />

      {/* Moving scan highlight, clipped to each lens */}
      <g clipPath="url(#lens-left-clip)">
        <rect x="-20" y="30" width="14" height="60" fill="#ffffff" opacity="0.4">
          <animate attributeName="x" values="20;95;20" dur="2.6s" repeatCount="indefinite" />
        </rect>
      </g>
      <g clipPath="url(#lens-right-clip)">
        <rect x="98" y="30" width="14" height="60" fill="#ffffff" opacity="0.4">
          <animate attributeName="x" values="98;175;98" dur="2.6s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Lens reflections */}
      <rect x="42" y="40" width="12" height="9" rx="2" fill="url(#headset-gradient)" opacity="0.55" />
      <rect x="120" y="40" width="12" height="9" rx="2" fill="url(#headset-gradient)" opacity="0.55" />

      {/* Bridge */}
      <rect x="94" y="52" width="12" height="16" rx="3" fill="url(#headset-gradient)" opacity="0.5" />

      {/* Sensor marks */}
      <rect x="20" y="20" width="4" height="4" fill="url(#headset-gradient)" />
      <rect x="176" y="20" width="4" height="4" fill="url(#headset-gradient)" />
      <rect x="20" y="92" width="4" height="4" fill="url(#headset-gradient)" />
      <rect x="176" y="92" width="4" height="4" fill="url(#headset-gradient)" />
    </svg>
  );
});

const PARTICLE_COUNT = 8;
const TICK_COUNT = 28;

const Preloader = ({ onComplete }) => {
  const preloaderRef   = useRef(null);
  const curtainLRef    = useRef(null);
  const curtainRRef    = useRef(null);
  const seamRef        = useRef(null);
  const flashRef       = useRef(null);
  const gridRef        = useRef(null);
  const headsetWrapRef = useRef(null);
  const headsetRef     = useRef(null);
  const ringARef       = useRef(null);
  const ringBRef       = useRef(null);
  const percentRef     = useRef(null);
  const progressRef    = useRef(null);
  const progressHeadRef= useRef(null);
  const line1Ref       = useRef(null);
  const idleFloatRef   = useRef(null);
  const particleRefs   = useRef([]);
  const particleLoopsRef = useRef([]);

  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const radius = 90 + (i % 3) * 18;
        return {
          id: i,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius * 0.55,
          delay: (i * 0.13) % 1,
        };
      }),
    [],
  );

  const pulseRing = useCallback((ref) => {
    if (!ref.current || reduceMotion) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0.7, scale: 0.85 },
      { opacity: 0, scale: 1.7, duration: 0.6, ease: "power2.out" },
    );
  }, [reduceMotion]);

  const buildTimeline = useCallback(
    () => {
      const words1 = line1Ref.current?.querySelectorAll("[data-word]") ?? [];
      const dots = particleRefs.current.filter(Boolean);

      gsap.killTweensOf([
        gridRef.current,
        headsetRef.current,
        headsetWrapRef.current,
        percentRef.current,
        progressRef.current,
        progressHeadRef.current,
        curtainLRef.current,
        curtainRRef.current,
        seamRef.current,
        flashRef.current,
        words1,
        dots,
      ]);
      idleFloatRef.current?.kill();
      particleLoopsRef.current.forEach((tw) => tw?.kill());
      particleLoopsRef.current = [];

      // Reset state
      gsap.set(curtainLRef.current, { xPercent: 0 });
      gsap.set(curtainRRef.current, { xPercent: 0 });
      gsap.set(seamRef.current,     { opacity: 0, scaleX: 1 });
      gsap.set(flashRef.current,    { opacity: 0 });
      gsap.set(gridRef.current,     { opacity: 0, y: 24 });
      gsap.set(headsetWrapRef.current, { opacity: 0, scale: 0.6, y: 10 });
      gsap.set(headsetRef.current,  { x: 0, y: 0 });
      gsap.set(percentRef.current,  { opacity: 0, y: 12 });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(progressHeadRef.current, { left: "0%", opacity: 0 });
      gsap.set(words1,              { y: "110%" });
      gsap.set(dots,                { opacity: 0, scale: 0, x: 0, y: 0 });
      if (ringARef.current) gsap.set(ringARef.current, { opacity: 0 });
      if (ringBRef.current) gsap.set(ringBRef.current, { opacity: 0 });
      if (line1Ref.current) line1Ref.current.style.textShadow = "none";
      if (preloaderRef.current) preloaderRef.current.style.display = "flex";

      const idleFloat = gsap.to(headsetWrapRef.current, {
        y: "+=8",
        duration: 1.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });
      idleFloatRef.current = idleFloat;

      const masterTL = gsap.timeline({ onComplete: () => onComplete?.() });

      // Phase 0: environment fades in
      masterTL.to(gridRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });

      // Phase 1: headset "signal lock" — snaps in, jitters, then settles
      masterTL.to(
        headsetWrapRef.current,
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(2)" },
        "-=0.5",
      );
      if (!reduceMotion) {
        masterTL.to(headsetRef.current, {
          keyframes: [
            { x: -4, y: 2, duration: 0.05 },
            { x: 5, y: -3, duration: 0.05 },
            { x: -3, y: 0, duration: 0.05 },
            { x: 0, y: 0, duration: 0.08 },
          ],
          ease: "none",
          onComplete: () => idleFloat.play(),
        });
      } else {
        masterTL.call(() => idleFloat.play());
      }
      masterTL.add(() => { pulseRing(ringARef); }, "<");

      // Particles drift in and start orbiting
      masterTL.to(dots, {
        opacity: 0.8,
        scale: 1,
        duration: 0.4,
        stagger: 0.03,
        ease: "power2.out",
        onComplete: () => {
          if (reduceMotion) return;
          dots.forEach((dot, i) => {
            const p = particles[i];
            const tw = gsap.to(dot, {
              x: `+=${(i % 2 === 0 ? 1 : -1) * 10}`,
              y: `+=${(i % 2 === 0 ? -1 : 1) * 8}`,
              duration: 1.4 + (i % 3) * 0.3,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: p.delay,
            });
            particleLoopsRef.current.push(tw);
          });
        },
      }, "-=0.3");

      masterTL.to(percentRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.25");
      masterTL.to([progressRef.current, progressHeadRef.current], { opacity: 1, duration: 0.3 }, "-=0.3");

      // Percentage engine
      const obj = { val: 0 };
      const updatePercent = () => {
        const v = Math.floor(obj.val);
        if (percentRef.current) percentRef.current.textContent = `${v}%`;
        if (progressRef.current) gsap.set(progressRef.current, { scaleX: obj.val / 100 });
        if (progressHeadRef.current) gsap.set(progressHeadRef.current, { left: `${obj.val}%` });
      };
      const punchPercent = () => {
        if (!percentRef.current || reduceMotion) return;
        gsap.fromTo(percentRef.current, { scale: 1.18, filter: "blur(2px)" }, { scale: 1, filter: "blur(0px)", duration: 0.25, ease: "power2.out" });
      };

      masterTL.to(obj, { val: 28, duration: 0.65, ease: "power2.out", onUpdate: updatePercent, onComplete: punchPercent });
      masterTL.to(obj, { val: 32, duration: 0.85, ease: "power1.in",  onUpdate: updatePercent });
      masterTL.to(obj, { val: 74, duration: 0.9,  ease: "expo.out",   onUpdate: updatePercent, onComplete: () => { punchPercent(); pulseRing(ringBRef); } });
      masterTL.to(obj, { val: 78, duration: 0.9,  ease: "power1.inOut", onUpdate: updatePercent });

      // Phase 2: wordmark converges from chromatic-aberration ghosting
      const chroma = { offset: 6 };
      const updateChroma = () => {
        if (line1Ref.current)
          line1Ref.current.style.textShadow = `${-chroma.offset}px 0 #37F0FF, ${chroma.offset}px 0 #FF3D7A`;
      };
      masterTL.to(words1, {
        y: "0%", duration: 1, ease: "power4.out", stagger: 0.06,
      }, "-=1.6");
      masterTL.to(chroma, {
        offset: 0, duration: 1, ease: "power3.out", onUpdate: updateChroma,
      }, "<");

      // Particles get pulled into the headset — portal is "charging"
      masterTL.to(dots, {
        x: 0, y: 0, scale: 0, opacity: 0,
        duration: 0.45, ease: "power3.in", stagger: 0.025,
      }, "-=0.3");

      // Phase 3: final speed-burst + lock pulse on the headset
      masterTL.to(obj, {
        val: 100, duration: 0.55, ease: "power4.in",
        onUpdate: updatePercent,
        onComplete: () => {
          if (percentRef.current) percentRef.current.textContent = "100%";
          pulseRing(ringARef);
          pulseRing(ringBRef);
        },
      }, "-=0.15");
      masterTL.to(headsetWrapRef.current, { scale: 1.1, duration: 0.18, ease: "power2.out" }, "-=0.08");

      // Phase 4: exit — flash, crack of light, headset punches through, doors open
      masterTL.addLabel("exit");
      masterTL.call(() => idleFloat.pause(), null, "exit");

      masterTL.to(percentRef.current, { y: -14, opacity: 0, duration: 0.35, ease: "power3.in" }, "exit");
      masterTL.to(words1, {
        y: "-110%", duration: 0.4, ease: "power3.in",
        stagger: { each: 0.035, from: "end" },
      }, "exit");
      masterTL.to(gridRef.current, { opacity: 0, y: 20, duration: 0.35, ease: "power2.in" }, "exit");

      masterTL.to(seamRef.current, { opacity: 1, scaleX: 3, duration: 0.18, ease: "power2.out" }, "exit+=0.12");
      masterTL.to(flashRef.current, { opacity: 0.85, duration: 0.1, ease: "power1.in" }, "exit+=0.22");

      // Headset zooms through the "lens" toward camera, then vanishes
      masterTL.to(headsetWrapRef.current, {
        scale: 22,
        duration: 0.5,
        ease: "power4.in",
      }, "exit+=0.24");
      masterTL.to(headsetWrapRef.current, { opacity: 0, duration: 0.18, ease: "power1.in" }, "exit+=0.6");

      masterTL.to(flashRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, "exit+=0.45");
      masterTL.to(seamRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, "exit+=0.45");

      // Doors split apart
      masterTL.to(curtainLRef.current, {
        xPercent: -100, duration: 0.9, ease: "power4.inOut",
      }, "exit+=0.3");
      masterTL.to(curtainRRef.current, {
        xPercent: 100, duration: 0.9, ease: "power4.inOut",
      }, "exit+=0.3");

      masterTL.set(preloaderRef.current, { display: "none" });

      return masterTL;
    },
    [onComplete, particles, pulseRing, reduceMotion],
  );

  const { contextSafe } = useGSAP(
    () => {
      buildTimeline();
    },
    { scope: preloaderRef, dependencies: [buildTimeline] },
  );

  const runAnimation = contextSafe(() => {
    buildTimeline();
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const handler = (e) => {
      if (e.key === "r" || e.key === "R") runAnimation();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runAnimation]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
      style={{ "--void": "#06070A", "--wire": "#26304A", "--signal": "#FFB13C" }}
    >
      {/* Split doors */}
      <div ref={curtainLRef} className="absolute inset-y-0 left-0 w-1/2" style={{ background: "var(--void)", zIndex: 0 }} />
      <div ref={curtainRRef} className="absolute inset-y-0 right-0 w-1/2" style={{ background: "var(--void)", zIndex: 0 }} />

      {/* Seam crack-of-light */}
      <div
        ref={seamRef}
        className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 pointer-events-none"
        style={{ background: "var(--signal)", boxShadow: "0 0 24px 4px var(--signal)", zIndex: 25, opacity: 0 }}
      />

      {/* Camera flash */}
      <div ref={flashRef} className="absolute inset-0 bg-white pointer-events-none" style={{ zIndex: 40, opacity: 0 }} />

      {/* Perspective scan-grid floor */}
      <div
        ref={gridRef}
        className="absolute inset-x-0 bottom-0 h-[42%] overflow-hidden pointer-events-none z-[1]"
        style={{ perspective: "560px" }}
      >
        <div
          className="absolute inset-0 origin-bottom [animation:grid-drift_1.6s_linear_infinite]"
          style={{
            transform: "rotateX(62deg)",
            backgroundImage:
              "linear-gradient(var(--wire) 1px, transparent 1px), linear-gradient(90deg, var(--wire) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            opacity: 0.5,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to top, var(--void), transparent)" }}
        />
      </div>

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.05] z-[2]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Scanline sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <div
          className="absolute inset-x-0 h-16 [animation:scan-sweep_3.2s_ease-in-out_infinite]"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent)" }}
        />
      </div>

      {/* Core: particles, rings, headset, percentage, wordmark */}
      <div className="relative z-10 text-center w-full px-4 max-w-5xl flex flex-col items-center justify-center gap-3 sm:gap-4">
        <div ref={headsetWrapRef} className="relative flex items-center justify-center w-28 sm:w-32 md:w-40 mb-1 will-change-transform">
          {/* Pulse rings */}
          <div ref={ringARef} className="absolute inset-[-14%] rounded-2xl border pointer-events-none" style={{ borderColor: "var(--signal)", opacity: 0 }} />
          <div ref={ringBRef} className="absolute inset-[-14%] rounded-2xl border pointer-events-none" style={{ borderColor: "#37F0FF", opacity: 0 }} />

          {/* Orbiting particles */}
          {particles.map((p, i) => (
            <span
              key={p.id}
              ref={(el) => (particleRefs.current[i] = el)}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none will-change-transform"
              style={{
                background: i % 2 === 0 ? "var(--signal)" : "#37F0FF",
                left: `calc(50% + ${p.x}px)`,
                top: `calc(50% + ${p.y}px)`,
                boxShadow: "0 0 6px 1px currentColor",
              }}
            />
          ))}

          <BoxyHeadset innerRef={headsetRef} className="w-full h-auto" />
        </div>

        <div
          ref={percentRef}
          className="font-mono font-bold text-3xl sm:text-4xl md:text-5xl tracking-wide"
          style={{ color: "var(--signal)" }}
        >
          0%
        </div>

        <div className="w-full text-[5vw] sm:text-[3vw] md:text-[2.4vw] lg:text-[2vw] font-['Syne'] font-extrabold text-white tracking-tighter uppercase leading-[0.95]">
          <SplitWords text="ENTERING   REALXR" innerRef={line1Ref} />
        </div>
      </div>

      {/* Segmented progress bar, top edge */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10 flex">
        {Array.from({ length: TICK_COUNT }).map((_, i) => (
          <div key={i} className="flex-1 mx-[0.5px] bg-white/5" />
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10 overflow-hidden">
        <div ref={progressRef} className="absolute inset-0" style={{ background: "var(--signal)", transformOrigin: "left center" }} />
      </div>
      <div
        ref={progressHeadRef}
        className="absolute top-0 w-[6px] h-[6px] rounded-full -translate-x-1/2 -translate-y-[1.5px] z-10 pointer-events-none"
        style={{ background: "var(--signal)", boxShadow: "0 0 10px 3px var(--signal)" }}
      />

      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] text-white/10 z-20">
          press R to replay
        </div>
      )}

      <style>{`
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to   { background-position: 0 46px; }
        }
        @keyframes scan-sweep {
          0%   { transform: translateY(-20%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(420%); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Preloader;