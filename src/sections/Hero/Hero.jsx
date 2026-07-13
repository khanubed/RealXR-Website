import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../../components/layout/Navbar"; // Ensure path is correct

// You can keep a local fallback image here just in case the API fails
import FallbackHeroImg from "../../assets/images/Hero/headset.png";
import { heroData } from "../../data/heroData";

gsap.registerPlugin(ScrollTrigger);

const HEADSET_SIZE = "clamp(240px, 30vw, 400px)";

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
  textAlign: "center",
};

const reflectionWrapperStyle = {
  transform: "scaleY(-1)",
  marginTop: "-0.05em",
  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent 65%)",
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent 65%)",
  pointerEvents: "none",
  userSelect: "none",
};

// Define fallback content so the UI never breaks
const defaultContent = heroData

const Hero = ({ content = defaultContent }) => {
  const containerRef    = useRef(null);
  const sceneRef        = useRef(null); 
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
            if (self.progress > 0) {
              if (floatNormal.isActive()) floatNormal.kill();
              if (floatReflect.isActive()) floatReflect.kill();
            }
          },
        },
      });

      outroTl
        .to(scrollIndRef.current, { opacity: 0, y: 10, duration: 0.3, ease: "power1.out" }, 0)
        .to(taglineRef.current, { opacity: 0, y: -24, duration: 0.35, ease: "power1.out" }, 0.05)
        .to([imgNormalRef.current, imgReflectRef.current], {
          scale: 2.4,
          opacity: 0,
          filter: "blur(24px)",
          ease: "power2.in",
          duration: 0.9,
        }, 0.18)
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
        zIndex : -50,
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* <Navbar /> */}

      {/* ── Visual Composition ── */}
      <div ref={sceneRef} style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Text layer */}
        <div style={{
          position: "relative", zIndex: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <div style={{ overflow: "visible" }}>
            {/* Dynamic Title */}
            <h1 ref={textNormalRef} style={wordmarkStyle}>{content.title}</h1>
          </div>
          <div style={reflectionWrapperStyle}>
            {/* Dynamic Title Reflection */}
            <h1 ref={textReflectRef} style={wordmarkStyle}>{content.title}</h1>
          </div>
        </div>

        {/* Headset layer */}
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
          {/* Dynamic Image & Alt Text */}
          <img
            ref={imgNormalRef}
            src={content.heroImageUrl || FallbackHeroImg}
            alt={content.imageAltText}
            style={{
              width: HEADSET_SIZE,
              display: "block",
              filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.25))",
            }}
          />
          <div style={reflectionWrapperStyle}>
            {/* Dynamic Image Reflection */}
            <img
              ref={imgReflectRef}
              src={content.heroImageUrl || FallbackHeroImg}
              alt=""
              aria-hidden="true"
              style={{ width: HEADSET_SIZE, display: "block" }}
            />
          </div>
        </div>

        {/* Dynamic Tagline */}
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
            {content.tagline}
          </p>
        </div>
      </div>

      {/* Dynamic Scroll indicator */}
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
        }}>
          {content.scrollText}
        </span>
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