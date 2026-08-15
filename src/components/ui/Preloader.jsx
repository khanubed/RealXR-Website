import React, { useEffect, useRef, useCallback, memo } from "react";
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

// Boxy, angular front-view headset — sharp/near-square corners instead of
// the earlier rounded-pill shape. Color cycles via a native SVG <animate>
// on the gradient stops, so it keeps running smoothly on its own.
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

      {/* Lenses — square-cornered, not circular */}
      <rect x="34" y="32" width="54" height="56" rx="6" fill="#050505" stroke="url(#headset-gradient)" strokeWidth="2.5" />
      <rect x="112" y="32" width="54" height="56" rx="6" fill="#050505" stroke="url(#headset-gradient)" strokeWidth="2.5" />

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

const Preloader = ({ onComplete }) => {
  const preloaderRef  = useRef(null);
  const curtainRef    = useRef(null);
  const gridRef       = useRef(null);
  const headsetRef    = useRef(null);
  const percentRef    = useRef(null);
  const progressRef   = useRef(null);
  const line1Ref      = useRef(null);
  const idleFloatRef  = useRef(null);

  const buildTimeline = useCallback(
    () => {
      const words1 = line1Ref.current?.querySelectorAll("[data-word]") ?? [];

      gsap.killTweensOf([
        gridRef.current,
        headsetRef.current,
        percentRef.current,
        progressRef.current,
        curtainRef.current,
        words1,
      ]);
      idleFloatRef.current?.kill();

      gsap.set(gridRef.current,     { opacity: 0, y: 24 });
      gsap.set(headsetRef.current,  { opacity: 0, scale: 0.6, y: 10 });
      gsap.set(percentRef.current,  { opacity: 0, y: 12 });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(words1,              { y: "110%" });
      gsap.set(curtainRef.current,  { clipPath: "circle(150% at 50% 50%)" });
      if (line1Ref.current) line1Ref.current.style.textShadow = "none";
      if (preloaderRef.current) preloaderRef.current.style.display = "flex";

      const idleFloat = gsap.to(headsetRef.current, {
        y: "+=8",
        duration: 1.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });
      idleFloatRef.current = idleFloat;

      const masterTL = gsap.timeline({ onComplete: () => onComplete?.() });

      // Phase 1: environment + headset emerge
      masterTL.to(gridRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
      masterTL.to(
        headsetRef.current,
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)", onComplete: () => idleFloat.play() },
        "-=0.5",
      );
      masterTL.to(percentRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
      masterTL.to(progressRef.current, { opacity: 1, duration: 0.3 }, "-=0.3");

      // Percentage engine — direct DOM writes
      const obj = { val: 0 };
      const updatePercent = () => {
        if (percentRef.current) percentRef.current.textContent = `${Math.floor(obj.val)}%`;
        if (progressRef.current) gsap.set(progressRef.current, { scaleX: obj.val / 100 });
      };

      masterTL.to(obj, { val: 28, duration: 0.65, ease: "power2.out", onUpdate: updatePercent });
      masterTL.to(obj, { val: 32, duration: 0.85, ease: "power1.in",  onUpdate: updatePercent });
      masterTL.to(obj, { val: 74, duration: 0.9,  ease: "expo.out",   onUpdate: updatePercent });
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

      // Phase 3: final speed-burst + lock pulse on the headset
      masterTL.to(obj, {
        val: 100, duration: 0.6, ease: "power4.in",
        onUpdate: updatePercent,
        onComplete: () => { if (percentRef.current) percentRef.current.textContent = "100%"; },
      });
      masterTL.to(headsetRef.current, { scale: 1.08, duration: 0.2, ease: "power2.out" }, "-=0.1");
      masterTL.to(headsetRef.current, { scale: 1, duration: 0.3, ease: "power2.inOut" });

      // Phase 4: exit
      masterTL.call(() => idleFloat.pause());

      masterTL.to(percentRef.current, { y: -14, opacity: 0, duration: 0.4, ease: "power3.in" }, "+=0.1");
      masterTL.to(headsetRef.current, { scale: 0.5, opacity: 0, duration: 0.4, ease: "power3.in" }, "<");
      masterTL.to(gridRef.current, { opacity: 0, y: 20, duration: 0.4, ease: "power2.in" }, "<");
      masterTL.to(words1, {
        y: "-110%", duration: 0.45, ease: "power3.in",
        stagger: { each: 0.04, from: "end" },
      }, "-=0.3");

      masterTL.to(curtainRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 1.0,
        ease: "power4.inOut",
      }, "-=0.1");

      masterTL.set(preloaderRef.current, { display: "none" });

      return masterTL;
    },
    [onComplete],
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
      <div
        ref={curtainRef}
        className="absolute inset-0"
        style={{ background: "var(--void)", clipPath: "circle(150% at 50% 50%)", zIndex: 0 }}
      />

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

      {/* Core: headset, percentage, wordmark */}
      <div className="relative z-10 text-center w-full px-4 max-w-5xl flex flex-col items-center justify-center gap-3 sm:gap-4">
        <BoxyHeadset
          innerRef={headsetRef}
          className="w-28 sm:w-32 md:w-40 h-auto mb-1 will-change-transform"
        />

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

      {/* Progress hairline, top edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-10">
        <div ref={progressRef} className="absolute inset-0" style={{ background: "var(--signal)" }} />
      </div>

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
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Preloader;   