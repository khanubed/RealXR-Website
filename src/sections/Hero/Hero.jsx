import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../../components/layout/Navbar"; // Ensure path is correct

// You can keep a local fallback image here just in case the API fails
import FallbackHeroImg from "../../assets/images/Hero/headset.webp";
import FallbackCollegeLogo from "../../assets/images/ies-ips-logo.webp";
import { heroData } from "../../data/heroData";
import DistortText from "../../components/three/DistortText";

gsap.registerPlugin(ScrollTrigger);

const HEADSET_SIZE = "clamp(160px, 26vw, 380px)";

const wordmarkStyle = {
  fontFamily: "Syne, sans-serif",
  fontWeight: 800,
  fontSize: "clamp(2rem, 9.5vw, 11rem)",
  letterSpacing: "-0.03em",
  color: "#0a0a0a",
  lineHeight: 0.9,
  margin: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  maxWidth: "100%",
  textAlign: "center",
  whiteSpace: "nowrap",
};

const reflectionWrapperStyle = {
  transform: "scaleY(-1)",
  marginTop: "-0.05em",
  WebkitMaskImage:
    "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent 65%)",
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.28), transparent 65%)",
  pointerEvents: "none",
  userSelect: "none",
};

// Define fallback content so the UI never breaks
const defaultContent = heroData;

const Hero = ({ content = defaultContent }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const textNormalRef = useRef(null);
  const textReflectRef = useRef(null);
  const imgNormalRef = useRef(null);
  const imgReflectRef = useRef(null);
  const taglineRef = useRef(null);
  const scrollIndRef = useRef(null);

  useGSAP(
    () => {
      let floatNormal = null;
      let floatReflect = null;
      let onMouseMove = null;

      // ── Initial states ───────────────────────────────────
      gsap.set(textNormalRef.current, { opacity: 0, y: 70 });
      gsap.set(textReflectRef.current, { opacity: 0, y: -70 });
      gsap.set([imgNormalRef.current, imgReflectRef.current], {
        opacity: 0,
        y: 40,
        scale: 0.85,
      });
      gsap.set(taglineRef.current, { opacity: 0, y: 16 });
      gsap.set(scrollIndRef.current, { opacity: 0 });

      // ── Entrance ─────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to([textNormalRef.current, textReflectRef.current], {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
      })
        .to(
          [imgNormalRef.current, imgReflectRef.current],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.4)",
          },
          "-=0.75",
        )
        .to(
          taglineRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .to(scrollIndRef.current, { opacity: 1, duration: 0.4 }, "-=0.1");

      // ── Ambient float ────────────────────────────────────
      floatNormal = gsap.to(imgNormalRef.current, {
        y: -12,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      });
      floatReflect = gsap.to(imgReflectRef.current, {
        y: 12,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.4,
      });

      // ── Mouse parallax ───────────────────────────────────
      onMouseMove = (e) => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 2;
        gsap.to([imgNormalRef.current, imgReflectRef.current], {
          x: dx * 12,
          duration: 1.1,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to([textNormalRef.current, textReflectRef.current], {
          x: dx * -12,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
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
              if (floatNormal?.isActive()) floatNormal.kill();
              if (floatReflect?.isActive()) floatReflect.kill();
            }
          },
        },
      });

      outroTl
        .to(
          scrollIndRef.current,
          { opacity: 0, y: 10, duration: 0.3, ease: "power1.out" },
          0,
        )
        .to(
          taglineRef.current,
          { opacity: 0, y: -24, duration: 0.35, ease: "power1.out" },
          0.05,
        )
        .to(
          [imgNormalRef.current, imgReflectRef.current],
          {
            scale: 2.4,
            opacity: 0,
            filter: "blur(24px)",
            ease: "power2.in",
            duration: 0.9,
          },
          0.18,
        )
        .to(
          textNormalRef.current,
          {
            x: -260,
            y: -50,
            rotate: -3,
            skewX: -8,
            opacity: 0,
            ease: "power2.in",
            duration: 0.9,
          },
          0.28,
        )
        .to(
          textReflectRef.current,
          {
            x: -260,
            y: 50,
            rotate: 3,
            opacity: 0,
            ease: "power2.in",
            duration: 0.9,
          },
          0.28,
        )
        .to(
          sceneRef.current,
          {
            scale: 0.92,
            opacity: 0,
            ease: "power2.inOut",
            duration: 0.6,
          },
          0.55,
        );

      // useGSAP cleanly disposes of all gsap animations/triggers,
      // but custom global events like window.addEventListener still need manual removal.
      return () => {
        if (onMouseMove) window.removeEventListener("mousemove", onMouseMove);
      };
    },
    { scope: containerRef, dependencies: [content] },
  ); // Scopes selections and wraps execution in a cleanup-safe container

  // Render tagline with zoomed circular college crest before the college name
  const renderTagline = () => {
    const text = content.tagline || "";
    const logo = content.collegeLogo || FallbackCollegeLogo;

    const collegePattern = /(Institute of Engineering and Science|IPS Academy)/i;
    const match = text.search(collegePattern);

    if (match !== -1 && logo) {
      const before = text.slice(0, match);
      const after = text.slice(match);
      return (
        <>
          <span>{before}</span>
          <img
            src={logo}
            alt="IES IPS Academy Logo"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full object-contain inline-block shrink-0 align-middle mr-1.5 -mt-0.5 drop-shadow-sm"
            loading="eager"
            decoding="async"
          />
          <span>{after}</span>
        </>
      );
    }

    return text;
  };

  return (
    <section
      ref={containerRef}
      style={{
        zIndex: -50,
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
      <div
        ref={sceneRef}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        {/* Text layer */}
        <div
          style={{
            position: "relative",
            zIndex: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "100vw",
            padding: "0 0.75rem",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              overflow: "visible",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <DistortText
              ref={textNormalRef}
              text={content.title}
              style={wordmarkStyle}
              nowrap={true}
            />
          </div>
          <div
            style={{
              ...reflectionWrapperStyle,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* Dynamic Title Reflection */}
            <h1 ref={textReflectRef} style={wordmarkStyle}>
              {content.title}
            </h1>
          </div>
        </div>

        {/* Headset layer */}
        <div
          style={{
            position: "absolute",
            zIndex: 2,
            top: "clamp(20px, 4.5vw, 45px)",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          {/* Dynamic Image & Alt Text */}
          <img
            ref={imgNormalRef}
            src={content.heroImageUrl || FallbackHeroImg}
            alt={content.imageAltText}
            style={{
              width: HEADSET_SIZE,
              display: "block",
              filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.25))",
              pointerEvents: "auto",
            }}
          />
          <div
            style={{
              ...reflectionWrapperStyle,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
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
        <div
          style={{
            position: "absolute",
            top: "clamp(-4.5rem, -8vh, -3.2rem)",
            left: 0,
            right: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 1rem",
            pointerEvents: "none",
          }}
        >
          <p
            ref={taglineRef}
            style={{
              fontSize: "clamp(0.6rem, 1.8vw, 0.72rem)",
              letterSpacing: "clamp(0.12em, 0.4vw, 0.22em)",
              textTransform: "uppercase",
              color: "#888",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 500,
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: "min(92vw, 42rem)",
            }}
            className="whitespace-normal sm:whitespace-nowrap"
          >
            {renderTagline()}
          </p>
        </div>
      </div>

      {/* Dynamic Scroll indicator */}
      <div
        ref={scrollIndRef}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#999",
            fontFamily: "Space Grotesk, sans-serif",
          }}
        >
          {content.scrollText}
        </span>
        <div
          style={{
            width: 1,
            height: 44,
            background: "linear-gradient(to bottom, #0a0a0a, transparent)",
            animation: "scrollLine 2s ease infinite",
          }}
        />
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
