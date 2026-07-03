import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const fadeRef = useRef(null);
  const textSectionRef = useRef(null);
  const span1Ref = useRef(null);
  const span2Ref = useRef(null);
  const span3Ref = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {

      // ── 1. Horizontal scroll section ──────────────────────
      const textEl = textRef.current;
      const viewportWidth = window.innerWidth;
      const textWidth = textEl.scrollWidth - viewportWidth + 50;
      const totalDistance = textWidth + viewportWidth;

      gsap.fromTo(
        textEl,
        { x: viewportWidth },
        {
          x: -textWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalDistance}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        }
      );

      // ── 2. Fade transition div ─────────────────────────────
      // Fades in as you scroll into the text section
      gsap.fromTo(
        fadeRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: fadeRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        }
      );

      // ── 3. Span highlight animations ──────────────────────
      // Each span goes from muted gray → bright white bg + black text
      // as it scrolls into the center of the viewport

      const spans = [span1Ref.current, span2Ref.current, span3Ref.current];

      spans.forEach((span) => {
        if (!span) return;

        // Starting state — washed out
        gsap.set(span, {
          backgroundColor: "rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.35)",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
          borderRadius: "2px",
        });

        // Scroll into highlight
        gsap.to(span, {
          backgroundColor: "#00F5D4",
          color: "#000",
          ease: "power2.out",
          scrollTrigger: {
            trigger: span,
            start: "top 70%",   // starts highlighting as span enters view
            end: "top 40%",     // fully highlighted by center
            scrub: true,
          },
        });
      });

    }, [sectionRef, textSectionRef]);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── Hero → About fade gradient ── */}
      <div className="w-full h-32 relative bg-gradient-to-b from-white to-black" />

      {/* ── Horizontal scroll section ── */}
      <section
        ref={sectionRef}
        style={{ background: "#000", position: "relative", zIndex: 10 }}
      >
        <div style={{
          width: "100%", height: "100vh",
          display: "flex", alignItems: "center",
          overflow: "hidden", userSelect: "none",
        }}>
          <h1
            ref={textRef}
            style={{
              color: "#ffffff",
              fontSize: "clamp(5rem, 11vw, 14rem)",
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              whiteSpace: "nowrap",
              willChange: "transform",
              lineHeight: 1,
            }}
          >
            We Don't Just Study the Future&nbsp;&nbsp;—&nbsp;&nbsp;We Build It.
          </h1>
        </div>
      </section>

      {/* ── Fade in transition ── */}
      <div
        // ref={fadeRef}
        className="w-full h-screen absolute top-0 bg-gradient-to-b from-black to-black"
        style={{ opacity: 0 }}
      />

      {/* ── Text highlight section ── */}
      <section
        ref={textSectionRef}
        className="w-full bg-black flex justify-center items-center"
        style={{ padding: "10vh 0" }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "clamp(1.6rem, 3.2vw, 3rem)",
            fontFamily: "Syne, sans-serif",
            fontWeight: 600,
            lineHeight: 1.35,
            maxWidth: "1200px",
            padding: "0 3rem",
            letterSpacing: "-0.02em",
          }}
        >
          RealXR is a{" "}
          <span ref={span1Ref}>
            student community
          </span>{" "}
          at the bleeding edge of spatial computing. We design, develop, and deploy{" "}
          <span ref={span2Ref}>
            AR/VR experiences
          </span>{" "}
          that push the boundaries of what's possible — inside and outside the
          classroom.
          <br /><br />
          From your first line of shader code to your{" "}
          <span ref={span3Ref}>
            first deployed XR app
          </span>{" "}
          — this is where builders begin.
        </p>
      </section>
    </>
  );
};

export default About;
