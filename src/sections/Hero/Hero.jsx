import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroImg from "../../assets/images/Hero/headset.png";
import Navbar from "../../components/layout/Navbar";

gsap.registerPlugin(ScrollTrigger);

const HEADSET_SIZE = "clamp(160px, 30vw, 400px)";

const wordmarkStyle = {
  fontFamily: "Syne, sans-serif",
  fontWeight: 800,
  fontSize: "clamp(3.5rem, 10vw, 11rem)",
  letterSpacing: "-0.03em",
  color: "#0a0a0a",
  lineHeight: 0.9,
  margin: 0,
  display: "flex",
  gap: HEADSET_SIZE,
};

const reflectionWrapperStyle = {
  transform: "scaleY(-1)",
  marginTop: "-0.05em",
  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent 65%)",
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent 65%)",
  pointerEvents: "none",
  userSelect: "none",
};

const Hero = () => {
  const containerRef    = useRef(null);
  const sceneRef        = useRef(null); // wraps the whole visual composition for the final pull-back
  const textNormalRef   = useRef(null);
  const textReflectRef  = useRef(null);
  const imgNormalRef    = useRef(null);
  const imgReflectRef   = useRef(null);
  const taglineRef      = useRef(null);
  const scrollIndRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Initial states ───────────────────────────────────
      gsap.set(textNormalRef.current,  { opacity: 0, y: 70 });
      gsap.set(textReflectRef.current, { opacity: 0, y: -70 });
      gsap.set([imgNormalRef.current, imgReflectRef.current], {
        opacity: 0, y: 40, scale: 0.85,
      });
      gsap.set(taglineRef.current,   { opacity: 0, y: 16 });
      gsap.set(scrollIndRef.current, { opacity: 0 });

      // ── Entrance ─────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to([textNormalRef.current, textReflectRef.current], {
          opacity: 1, y: 0, duration: 1, ease: "expo.out",
        })
        .to([imgNormalRef.current, imgReflectRef.current], {
          opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "back.out(1.4)",
        }, "-=0.75")
        .to(taglineRef.current,   { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .to(scrollIndRef.current, { opacity: 1, duration: 0.4 }, "-=0.1");

      // ── Ambient float ────────────────────────────────────
      // Kept alive only while the user is idle (progress === 0). The moment
      // the outro scrub engages we kill these so they can't fight the
      // scroll-driven values on the same properties.
      const floatNormal = gsap.to(imgNormalRef.current, {
        y: -12, duration: 3, ease: "sine.inOut",
        yoyo: true, repeat: -1, delay: 1.4,
      });
      const floatReflect = gsap.to(imgReflectRef.current, {
        y: 12, duration: 3, ease: "sine.inOut",
        yoyo: true, repeat: -1, delay: 1.4,
      });

      // ── Mouse parallax ───────────────────────────────────
      const onMouseMove = (e) => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 2;
        gsap.to([imgNormalRef.current, imgReflectRef.current], {
          x: dx * 12, duration: 1.1, ease: "power2.out", overwrite: "auto",
        });
        gsap.to([textNormalRef.current, textReflectRef.current], {
          x: dx * -12, duration: 1.2, ease: "power2.out", overwrite: "auto",
        });
      };
      window.addEventListener("mousemove", onMouseMove);

      // ── Scroll outro ─────────────────────────────────────
      // The section is PINNED for a dedicated scroll distance (1.4 viewport
      // heights) and one single timeline is scrubbed against that. Because
      // the section can't move or scroll away underneath the animation,
      // there's no race between "content fading" and "content scrolling
      // off" — the whole sequence plays out fully and predictably no
      // matter how fast or slow the person scrolls.
      const s = containerRef.current;

      const outroTl = gsap.timeline({
        scrollTrigger: {
          trigger: s,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.4}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Stop the idle float the instant real scrolling begins,
            // so it can't fight the scrub-driven transforms.
            if (self.progress > 0) {
              if (floatNormal.isActive()) floatNormal.kill();
              if (floatReflect.isActive()) floatReflect.kill();
            }
          },
        },
      });

      // Scroll hint and eyebrow go first — quick, subtle
      outroTl
        .to(scrollIndRef.current, { opacity: 0, y: 10, duration: 0.3, ease: "power1.out" }, 0)
        .to(taglineRef.current, { opacity: 0, y: -24, duration: 0.35, ease: "power1.out" }, 0.05)

        // Headset punches toward camera and dissolves into a soft blur
        .to([imgNormalRef.current, imgReflectRef.current], {
          scale: 2.4,
          opacity: 0,
          filter: "blur(24px)",
          ease: "power2.in",
          duration: 0.9,
        }, 0.18)

        // Wordmark splits apart — REAL drifts left, XR drifts right, both fade
        .to(textNormalRef.current, {
          x: -260, y: -50, rotate: -3, skewX: -8, opacity: 0,
          ease: "power2.in",
          duration: 0.9,
        }, 0.28)
        .to(textReflectRef.current, {
          x: -260, y: 50, rotate: 3, opacity: 0,
          ease: "power2.in",
          duration: 0.9,
        }, 0.28)

        // Whole scene pulls back slightly and fades for a clean handoff
        // to the next section as the pin releases
        .to(sceneRef.current, {
          scale: 0.92,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.6,
        }, 0.55);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        floatNormal.kill();
        floatReflect.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent", // shows FluidCanvas behind it
        overflow: "hidden", // keeps the blurred/scaled headset from spilling out during the pin
      }}
    >
      <Navbar />

      {/* ── Visual Composition ── */}
      <div ref={sceneRef} style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Text layer — behind headset */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{ overflow: "visible" }}>
            <h1 ref={textNormalRef} style={wordmarkStyle}>REAL XR</h1>
          </div>
          <div style={reflectionWrapperStyle}>
            <h1 ref={textReflectRef} style={wordmarkStyle}>REAL XR</h1>
          </div>
        </div>

        {/* Headset layer — in front of text, centered in gap */}
        <div style={{
          position: "absolute",
          zIndex: 2,
          top: 45,
          left: 0, right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img
            ref={imgNormalRef}
            src={HeroImg}
            alt="VR Headset"
            style={{
              width: HEADSET_SIZE,
              display: "block",
              filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.25))",
            }}
          />
          <div style={reflectionWrapperStyle}>
            <img
              ref={imgReflectRef}
              src={HeroImg}
              alt=""
              aria-hidden="true"
              style={{ width: HEADSET_SIZE, display: "block" }}
            />
          </div>
        </div>

        {/* Tagline */}
        <div style={{ position: "absolute", top: "-5rem" }}>
          <p ref={taglineRef} style={{
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#888",
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}>
            AR/VR Club · IES IPS Academy · Est. 2022
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndRef} style={{
        position: "absolute", bottom: 32, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 8, zIndex: 10,
      }}>
        <span style={{
          fontSize: "0.58rem", letterSpacing: "0.18em",
          textTransform: "uppercase", color: "#999",
          fontFamily: "Space Grotesk, sans-serif",
        }}>Scroll</span>
        <div style={{
          width: 1, height: 44,
          background: "linear-gradient(to bottom, #0a0a0a, transparent)",
          animation: "scrollLine 2s ease infinite",
        }} />
      </div>

      <style>{`
        @keyframes scrollLine {
          0%  {transform:scaleY(0);transform-origin:top}
          50% {transform:scaleY(1);transform-origin:top}
          51% {transform:scaleY(1);transform-origin:bottom}
          100%{transform:scaleY(0);transform-origin:bottom}
        }
      `}</style>
    </section>
  );
};

export default Hero;