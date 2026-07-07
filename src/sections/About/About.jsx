import React, { useEffect, useRef } from "react";
import { gsap } from "gsap"; // or standard 'gsap' import
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const span1Ref   = useRef(null);
  const span2Ref   = useRef(null);
  const span3Ref   = useRef(null);

  useEffect(() => {
    const spans = [span1Ref.current, span2Ref.current, span3Ref.current];

    // 1. Set initial states uniformly
    spans.forEach((span) => {
      if (!span) return;
      gsap.set(span, {
        backgroundColor: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.3)",
        padding: "0 0.5rem",
        borderRadius: "2px",
      });
    });

    // 2. Create a master timeline with pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",      // Locks section to viewport as soon as the top hits the top
        end: "+=1500",         // Total scroll distance the section stays locked (increase for a longer hold)
        scrub: 1,              // Smoothly binds the scrollbar to the timeline playhead
        pin: true,             // Pins the element in place
        anticipatePin: 1,      // Eliminates slight visual jitter on fast scrolling
      },
    });

    // 3. Sequence the highlights smoothly
    tl.to(span1Ref.current, { backgroundColor: "#00F5D4", color: "#000", ease: "power1.out" })
      .to(span2Ref.current, { backgroundColor: "#00F5D4", color: "#000", ease: "power1.out" })
      .to(span3Ref.current, { backgroundColor: "#00F5D4", color: "#000", ease: "power1.out" })
      // An empty layout pad at the end of the timeline ensures the text
      // stays fully highlighted and visible for a short window before unpinning
      .to({}, { duration: 0.6 }); 

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black flex justify-center items-center"
      style={{ minHeight: "100vh" }} // Ensures full viewport coverage while pinned
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