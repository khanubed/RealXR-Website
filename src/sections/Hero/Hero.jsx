import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroImg from "../../assets/images/Hero/headset.png";

const Hero = () => {
  const containerRef = useRef(null);
  const realRef = useRef(null);
  const xrRef = useRef(null);
  const imgRef = useRef(null);
  const taglineRef = useRef(null);
  const scrollIndRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Initial states — keep it minimal
      gsap.set([realRef.current, xrRef.current], {
        opacity: 0, y: 80, skewY: 4,
      });
      gsap.set(imgRef.current, {
        opacity: 0, y: 40, scale: 0.88,
      });
      gsap.set(taglineRef.current, { opacity: 0, y: 16 });
      gsap.set(ctaRef.current, { opacity: 0, y: 12 });
      gsap.set(scrollIndRef.current, { opacity: 0 });

      // Timeline — fast and punchy
      tl.to(realRef.current, {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.9, ease: "expo.out",
      })
      .to(imgRef.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8, ease: "power3.out",
      }, "-=0.6")
      .to(xrRef.current, {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.9, ease: "expo.out",
      }, "-=0.7")
      .to(taglineRef.current, {
        opacity: 1, y: 0,
        duration: 0.6, ease: "power3.out",
      }, "-=0.3")
      .to(ctaRef.current, {
        opacity: 1, y: 0,
        duration: 0.5, ease: "power3.out",
      }, "-=0.2")
      .to(scrollIndRef.current, {
        opacity: 1, duration: 0.4,
      }, "-=0.1");

      // Headset float — lightweight, no 3D transforms
      gsap.to(imgRef.current, {
        y: -14,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      });

      // Subtle mouse parallax — only on headset, very light
      const onMouseMove = (e) => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 2;
        const dy = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(imgRef.current, {
          x: dx * 14,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Top label */}
      <div style={{
        position: "absolute", top: 100,
        display: "flex", alignItems: "center", gap: 8,
        zIndex: 10,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#00C4A8",
          display: "inline-block",
          animation: "pulse 2s infinite",
        }} />
        <span style={{
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#00C4A8",
          fontFamily: "Space Grotesk, sans-serif",
        }}>
          AR/VR Club · IES IPS Academy
        </span>
      </div>

      {/* Corner brackets */}
      {[
        { top: 32, left: 32, borderTop: true, borderLeft: true },
        { top: 32, right: 32, borderTop: true, borderRight: true },
        { bottom: 32, left: 32, borderBottom: true, borderLeft: true },
        { bottom: 32, right: 32, borderBottom: true, borderRight: true },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute",
          top: pos.top, bottom: pos.bottom,
          left: pos.left, right: pos.right,
          width: 18, height: 18,
          borderTop: pos.borderTop ? "1.5px solid #00C4A8" : "none",
          borderBottom: pos.borderBottom ? "1.5px solid #00C4A8" : "none",
          borderLeft: pos.borderLeft ? "1.5px solid #00C4A8" : "none",
          borderRight: pos.borderRight ? "1.5px solid #00C4A8" : "none",
          zIndex: 10, opacity: 0.5,
        }} />
      ))}

      {/* ── Main row: REAL [headset] XR ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(0.5rem, 2vw, 2rem)",
        position: "relative",
        zIndex: 5,
      }}>

        {/* REAL */}
        <div style={{ overflow: "hidden" }}>
          <h1
            ref={realRef}
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(4rem, 12vw, 14rem)",
              letterSpacing: "-0.04em",
              color: "#0a0a0a",
              lineHeight: 1,
              margin: 0,
            }}
          >
            REAL
          </h1>
        </div>

        {/* Headset — sits between REAL and XR */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <img
            ref={imgRef}
            src={HeroImg}
            alt="VR Headset"
            style={{
              width: "clamp(100px, 16vw, 260px)",
              display: "block",
              filter: "drop-shadow(0 8px 32px rgba(0,196,168,0.2))",
            }}
          />
        </div>

        {/* XR */}
        <div style={{ overflow: "hidden" }}>
          <h1
            ref={xrRef}
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(4rem, 12vw, 14rem)",
              letterSpacing: "-0.04em",
              color: "#00C4A8",
              lineHeight: 1,
              margin: 0,
            }}
          >
            XR
          </h1>
        </div>
      </div>

      {/* Tagline */}
      <p
        ref={taglineRef}
        style={{
          marginTop: "1.2rem",
          fontSize: "0.8rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#999",
          fontFamily: "Space Grotesk, sans-serif",
        }}
      >
        Building the next dimension of reality
      </p>

      {/* CTAs */}
      <div
        ref={ctaRef}
        style={{
          display: "flex", gap: 12, marginTop: "2rem",
        }}
      >
        <a href="#domains" style={{
          padding: "0.75rem 2rem",
          background: "#00C4A8",
          color: "#fff",
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 600,
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          borderRadius: 2,
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,196,168,0.3)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Explore
        </a>
        <a href="#join" style={{
          padding: "0.75rem 2rem",
          background: "transparent",
          color: "#0a0a0a",
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 500,
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          border: "1.5px solid #e0e0e0",
          borderRadius: 2,
          textDecoration: "none",
          transition: "border-color 0.3s, color 0.3s",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#00C4A8";
            e.currentTarget.style.color = "#00C4A8";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#e0e0e0";
            e.currentTarget.style.color = "#0a0a0a";
          }}
        >
          Join Us
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndRef}
        style={{
          position: "absolute", bottom: 36,
          left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8, zIndex: 10,
        }}
      >
        <span style={{
          fontSize: "0.6rem", letterSpacing: "0.15em",
          textTransform: "uppercase", color: "#bbb",
          fontFamily: "Space Grotesk, sans-serif",
        }}>Scroll</span>
        <div style={{
          width: 1, height: 44,
          background: "linear-gradient(to bottom, #00C4A8, transparent)",
          animation: "scrollLine 2s ease infinite",
        }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.3;transform:scale(0.6)}
        }
        @keyframes scrollLine {
          0%{transform:scaleY(0);transform-origin:top}
          50%{transform:scaleY(1);transform-origin:top}
          51%{transform:scaleY(1);transform-origin:bottom}
          100%{transform:scaleY(0);transform-origin:bottom}
        }
      `}</style>
    </div>
  );
};

export default Hero;
