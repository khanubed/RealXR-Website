import React, { useEffect, useRef } from "react";
import { gsap } from "gsap"; 
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutData } from "../../data/aboutData";

gsap.registerPlugin(ScrollTrigger);

// Fallback content using the new array structure
const defaultContent = aboutData;

const About = ({ content = defaultContent }) => {
  useGSAP();
  const sectionRef = useRef(null);
  // This will hold an array of ALL our dynamic highlight spans
  const highlightRefs = useRef([]);

  useEffect(() => {
    // 1. Filter out any nulls just in case, to get a clean array of elements
    const spans = highlightRefs.current.filter(Boolean);

    if (spans.length === 0) return;

    const ctx = gsap.context(() => {
      // 2. Set initial states uniformly for ALL highlights
      gsap.set(spans, {
        backgroundColor: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.3)",
        padding: "0 0.5rem",
        borderRadius: "2px",
      });

      // 3. Create a master timeline with pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1500", 
          scrub: 1, 
          pin: true, 
          anticipatePin: 1,
        },
      });

      // 4. Dynamically loop through however many spans exist and add them to the timeline
      spans.forEach((span) => {
        tl.to(span, { 
          backgroundColor: "#00F5D4", 
          color: "#000", 
          ease: "power1.out" 
        });
      });

      // 5. Empty layout pad at the end
      tl.to({}, { duration: 0.6 });
    }, sectionRef);

    return () => ctx.revert();
  }, [content]); // re-run if content changes

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black flex justify-center items-center"
      style={{ minHeight: "100vh" }} 
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
        {/* Dynamically map over the text blocks */}
        {content.textBlocks.map((block, index) => {
          if (block.isHighlight) {
            return (
              <span 
                key={index} 
                // Push this specific span into our refs array
                ref={(el) => (highlightRefs.current[index] = el)}
              >
                {block.text}
              </span>
            );
          }
          // If it's not a highlight, just return the plain text
          return <React.Fragment key={index}>{block.text}</React.Fragment>;
        })}
      </p>
    </section>
  );
};

export default About;