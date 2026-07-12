/**
 * Preloader.jsx
 * Awwwards-level animated preloader component.
 *
 * Animation sequence:
 *  1. Counter ticks 00 to 100 with organic pauses
 *  2. Typography stagger-reveals word by word
 *  3. Counter + tagline exit upward
 *  4. Curtain wipes UP via clip-path polygon
 *  5. onComplete() fires - parent unlocks hero content
 *
 * gsap.context() ensures cleanup on unmount / React Strict Mode safety.
 */

import React, { useEffect, useRef, useLayoutEffect, useCallback, memo } from "react";
import { gsap } from "gsap";

// Word splitter — each word gets overflow:hidden + inner span at y:110%
const SplitWords = memo(function SplitWords({ text }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
            marginRight: i < words.length - 1 ? "0.28em" : 0,
          }}
        >
          <span data-word="true" style={{ display: "inline-block", transform: "translateY(110%)" }}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
});

const Preloader = ({ onComplete }) => {
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
      // Collect word spans from both lines
      const words1   = line1Ref.current?.querySelectorAll("[data-word]") ?? [];
      const words2   = line2Ref.current?.querySelectorAll("[data-word]") ?? [];
      const allWords = [...words1, ...words2];

      // Reset initial states — GSAP owns these, not inline style
      gsap.set(counterRef.current,    { y: 60,  opacity: 0 });
      gsap.set(taglineRef.current,    { y: 20,  opacity: 0 });
      gsap.set(progressBarRef.current,{ scaleX: 0, transformOrigin: "left center", opacity: 0 });
      gsap.set(allWords,              { y: "110%" });
      gsap.set(curtainRef.current,    { clipPath: "inset(0% 0% 0% 0%)" });
      if (preloaderRef.current) preloaderRef.current.style.display = "flex";

      const masterTL = gsap.timeline({ onComplete: () => onComplete?.() });

      // Phase 1: Counter appears
      masterTL.to(counterRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
      masterTL.to(progressBarRef.current, { opacity: 1, duration: 0.4 }, "-=0.4");

      // Proxy object drives counter DOM directly — avoids React state churn
      const obj = { val: 0 };
      const updateCounter = () => {
        if (counterRef.current)
          counterRef.current.textContent = String(Math.floor(obj.val)).padStart(2, "0");
        if (progressBarRef.current)
          gsap.set(progressBarRef.current, { scaleX: obj.val / 100 });
      };

      // Segment A: 0 -> 20, fast burst
      masterTL.to(obj, { val: 20, duration: 0.65, ease: "power2.out", onUpdate: updateCounter });
      // Pause at 20 — slow crawl mimicking heavy asset load
      masterTL.to(obj, { val: 24, duration: 0.85, ease: "power1.in",  onUpdate: updateCounter });
      // Burst: 24 -> 68
      masterTL.to(obj, { val: 68, duration: 0.9,  ease: "expo.out",   onUpdate: updateCounter });
      // Pause at 68
      masterTL.to(obj, { val: 71, duration: 0.9,  ease: "power1.inOut", onUpdate: updateCounter });

      // Phase 3: Words reveal during the 68 pause
      masterTL.to(allWords, {
        y: "0%", duration: 1.1, ease: "power4.out", stagger: 0.09,
      }, "-=1.5");

      // Tagline fades in
      masterTL.to(taglineRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.6");

      // Final acceleration: 71 -> 100
      masterTL.to(obj, {
        val: 100, duration: 0.65, ease: "power4.in",
        onUpdate: updateCounter,
        onComplete: () => { if (counterRef.current) counterRef.current.textContent = "100"; },
      });

      // Phase 4: Counter + tagline exit
      masterTL.to([counterRef.current, taglineRef.current], {
        y: -60, opacity: 0, duration: 0.55, ease: "power3.in", stagger: 0.06,
      }, "+=0.15");

      // Words exit upward
      masterTL.to(allWords, {
        y: "-110%", duration: 0.5, ease: "power3.in",
        stagger: { each: 0.05, from: "end" },
      }, "-=0.45");

      // Phase 5: Curtain wipes upward via clip-path
      // inset(0%) = full coverage, inset(100% 0% 0%) = top wipes to bottom
      masterTL.to(curtainRef.current, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.2,
        ease: "power4.inOut",
      }, "-=0.15");

      // Hide preloader entirely after wipe
      masterTL.set(preloaderRef.current, { display: "none" });

    }, preloaderRef);
  }, [onComplete]);

  useLayoutEffect(() => {
    runAnimation();
    return () => ctxRef.current?.revert();
  }, [runAnimation]);

  // Dev: press R to replay
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
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden", pointerEvents: "all",
      }}
    >
      {/* Curtain — clip-path animated to wipe upward */}
      <div
        ref={curtainRef}
        style={{
          position: "absolute", inset: 0,
          background: "#0a0a0a",
          clipPath: "inset(0% 0% 0% 0%)",
          zIndex: 0,
        }}
      />

      {/* Progress bar — top edge */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.05)", zIndex: 2 }}>
        <div
          ref={progressBarRef}
          style={{ position: "absolute", inset: 0, background: "#00F5D4", transform: "scaleX(0)", transformOrigin: "left center", opacity: 0 }}
        />
      </div>

      {/* Counter — bottom left */}
      <div
        ref={counterRef}
        style={{
          position: "absolute", bottom: "2.5rem", left: "3rem",
          fontFamily: "'Courier New', monospace",
          fontWeight: 700, fontSize: "clamp(1rem, 2vw, 1.25rem)",
          letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)",
          zIndex: 2, userSelect: "none",
        }}
      >00</div>

      {/* Main typography */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 2rem", maxWidth: 1000 }}>
        <div
          ref={line1Ref}
          style={{
            display: "block", fontFamily: "Syne, 'Arial Black', sans-serif",
            fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 8rem)",
            letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 0.92, marginBottom: "0.06em",
          }}
        >
          <SplitWords text="ARCHITECTING" />
        </div>
        <div
          ref={line2Ref}
          style={{
            display: "block", fontFamily: "Syne, 'Arial Black', sans-serif",
            fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 8rem)",
            letterSpacing: "-0.04em", color: "#00F5D4", lineHeight: 0.92,
          }}
        >
          <SplitWords text="DIGITAL SPACES" />
        </div>
      </div>

      {/* Tagline — bottom right */}
      <div
        ref={taglineRef}
        style={{
          position: "absolute", bottom: "2.8rem", right: "3rem",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "0.7rem", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
          zIndex: 2, userSelect: "none",
        }}
      >
        IES IPS Academy · RealXR
      </div>

      {process.env.NODE_ENV === "development" && (
        <div style={{
          position: "absolute", top: "1rem", right: "1.2rem",
          fontFamily: "monospace", fontSize: "0.62rem",
          color: "rgba(255,255,255,0.12)", zIndex: 3, userSelect: "none",
        }}>press R to replay</div>
      )}
    </div>
  );
};

export default Preloader;