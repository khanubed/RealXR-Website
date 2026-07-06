import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const span1Ref   = useRef(null);
  const span2Ref   = useRef(null);
  const span3Ref   = useRef(null);

  useEffect(() => {
    const spans = [span1Ref, span2Ref, span3Ref];

    spans.forEach((ref) => {
      const span = ref.current;
      if (!span) return;

      gsap.set(span, {
        backgroundColor: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.3)",
        padding: "0 0.5rem",
        borderRadius: "2px",
      });

      gsap.to(span, {
        backgroundColor: "#00F5D4",
        color: "#000",
        ease: "power2.out",
        scrollTrigger: {
          trigger: span,
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full  bg-black flex justify-center items-center"
      style={{ padding: "12vh 0 40vh 0" }}
    >
      <p style={{
        color: "rgba(255,255,255,0.85)",
        fontSize: "clamp(1.3rem, 2.8vw, 2.5rem)",
        fontFamily: "Syne, sans-serif",
        fontWeight: 600,
        lineHeight: 1.45,
        maxWidth: "1100px",
        padding: "0 3rem",
        letterSpacing: "-0.02em",
      }}>
        RealXR is a{" "}
        <span ref={span1Ref}>student community</span>{" "}
        at the bleeding edge of spatial computing. We design, develop, and deploy{" "}
        <span ref={span2Ref}>AR/VR experiences</span>{" "}
        that push the boundaries of what's possible — inside and outside the classroom.
        <br /><br />
        From your first line of shader code to your{" "}
        <span ref={span3Ref}>first deployed XR app</span>{" "}
        — this is where builders begin.
      </p>
    </section>
  );
};

export default About;