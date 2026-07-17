import React, { useEffect, useRef, useLayoutEffect, useCallback, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Responsive word splitter with flex-wrapping support to prevent mobile clipping
const SplitWords = memo(function SplitWords({ text }) {
  const words = text.split(" ");
  return (
    <span className="flex flex-wrap justify-center gap-x-[0.2em] w-full">
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
        >
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

const Preloader = ({ onComplete }) => {
  useGSAP();
  const preloaderRef   = useRef(null);
  const curtainRef     = useRef(null);
  const counterRef     = useRef(null);
  const line1Ref       = useRef(null);
  const line2Ref       = useRef(null);
  const taglineRef     = useRef(null);
  const progressBarRef = useRef(null);
  const ctxRef         = useRef(null);

  const runAnimation = useCallback(() => {
    if (ctxRef.current) ctxRef.current.revert();

    ctxRef.current = gsap.context(() => {
      const words1   = line1Ref.current?.querySelectorAll("[data-word]") ?? [];
      const words2   = line2Ref.current?.querySelectorAll("[data-word]") ?? [];
      const allWords = [...words1, ...words2];

      // GSAP Initial State Registry
      gsap.set(counterRef.current,      { y: 40,  opacity: 0 });
      gsap.set(taglineRef.current,      { y: 20,  opacity: 0 });
      gsap.set(progressBarRef.current,  { scaleX: 0, transformOrigin: "left center", opacity: 0 });
      gsap.set(allWords,                { y: "110%" });
      gsap.set(curtainRef.current,      { clipPath: "inset(0% 0% 0% 0%)" });
      if (preloaderRef.current) preloaderRef.current.style.display = "flex";

      const masterTL = gsap.timeline({ onComplete: () => onComplete?.() });

      // Phase 1: Interactive elements emerge
      masterTL.to(counterRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
      masterTL.to(progressBarRef.current, { opacity: 1, duration: 0.4 }, "-=0.4");

      // Counter engine setup (Direct DOM manipulation to bypass React render bottleneck)
      const obj = { val: 0 };
      const updateCounter = () => {
        if (counterRef.current)
          counterRef.current.textContent = String(Math.floor(obj.val)).padStart(2, "0");
        if (progressBarRef.current)
          gsap.set(progressBarRef.current, { scaleX: obj.val / 100 });
      };

      // Organic loading increments
      masterTL.to(obj, { val: 28, duration: 0.65, ease: "power2.out", onUpdate: updateCounter });
      masterTL.to(obj, { val: 32, duration: 0.85, ease: "power1.in",  onUpdate: updateCounter });
      masterTL.to(obj, { val: 74, duration: 0.9,  ease: "expo.out",   onUpdate: updateCounter });
      masterTL.to(obj, { val: 78, duration: 0.9,  ease: "power1.inOut", onUpdate: updateCounter });

      // Phase 2: Words reveal staggered during organic pause
      masterTL.to(allWords, {
        y: "0%", duration: 1.1, ease: "power4.out", stagger: 0.08,
      }, "-=1.6");

      // Tagline reveal
      masterTL.to(taglineRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.6");

      // Phase 3: Final speed-burst to completion
      masterTL.to(obj, {
        val: 100, duration: 0.65, ease: "power4.in",
        onUpdate: updateCounter,
        onComplete: () => { if (counterRef.current) counterRef.current.textContent = "100"; },
      });

      // Phase 4: Seamless Exit Choreography
      masterTL.to([counterRef.current, taglineRef.current], {
        y: -40, opacity: 0, duration: 0.55, ease: "power3.in", stagger: 0.06,
      }, "+=0.15");

      masterTL.to(allWords, {
        y: "-110%", duration: 0.5, ease: "power3.in",
        stagger: { each: 0.04, from: "end" },
      }, "-=0.45");

      // Premium upward clip-path reveal wipe
      masterTL.to(curtainRef.current, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.1,
        ease: "power4.inOut",
      }, "-=0.15");

      masterTL.set(preloaderRef.current, { display: "none" });

    }, preloaderRef);
  }, [onComplete]);

  useLayoutEffect(() => {
    runAnimation();
    return () => ctxRef.current?.revert();
  }, [runAnimation]);

  // Dev mode debugger (Tap "R" to trigger visual replay)
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
    >
      {/* Background Curtain */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[#0a0a0a]"
        style={{ clipPath: "inset(0% 0% 0% 0%)", zIndex: 0 }}
      />

      {/* Top Edge Progress Bar Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-10">
        <div
          ref={progressBarRef}
          className="absolute inset-0 bg-[#00F5D4]"
        />
      </div>

      {/* Dynamic Digital Counter */}
      <div
        ref={counterRef}
        className="absolute bottom-6 left-6 md:bottom-10 md:left-12 font-mono font-bold text-xs sm:text-sm md:text-base tracking-widest text-white/30 z-10"
      >
        00
      </div>

      {/* Main Core Typography Stack */}
      <div className="relative z-10 text-center w-full px-4 max-w-5xl flex flex-col items-center justify-center gap-1 sm:gap-2">
        <div
          ref={line1Ref}
          className="w-full text-[10vw] sm:text-[7vw] md:text-[6.5vw] lg:text-[6vw] font-['Syne'] font-extrabold text-white tracking-tighter uppercase leading-[0.95]"
        >
          <SplitWords text="EXTENDING" />
        </div>
        <div
          ref={line2Ref}
          className="w-full text-[10vw] sm:text-[7vw] md:text-[6.5vw] lg:text-[6vw] font-['Syne'] font-extrabold text-[#00F5D4] tracking-tighter uppercase leading-[0.95]"
        >
          <SplitWords text="REALITY" />
        </div>
      </div>

      {/* Institutional Metadata Tagline */}
      <div
        ref={taglineRef}
        className="absolute bottom-6 right-6 md:bottom-10 md:right-12 font-['Space_Grotesk'] text-[9px] md:text-xs tracking-widest uppercase text-white/25 z-10 text-right"
      >
        RealXR · IPS Academy
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 right-4 font-mono text-[9px] text-white/10 z-20">
          press R to replay
        </div>
      )}
    </div>
  );
};

export default Preloader;