import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function RedSection() {
  const containerRef = useRef(null);
  const redPanelRef = useRef(null);
  
  // Scoped typography refs
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const taglineRef = useRef(null);
  const bgWatermarkRef = useRef(null);

  useGSAP(
    () => {
      // 1. Core Pinning Track Configuration
      ScrollTrigger.create({
        trigger: redPanelRef.current,
        start: "top top",
        end: "+=130%", // Gives the custom type animation breathing room to finish smoothly
        pin: true,
        pinSpacing: true, 
        anticipatePin: 1,
      });

      // 2. High-End Typography Timeline Engine
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: redPanelRef.current,
          start: "top top",
          end: "+=130%",
          scrub: 1, // Smooth dampening to simulate inertia
        }
      });

      tl.to(line1Ref.current, { xPercent: -25, opacity: 0, ease: "none" }, 0)
        .to(line3Ref.current, { xPercent: 25, opacity: 0, ease: "none" }, 0)
        // Center text scales and reveals subtle outline styling
        .to(line2Ref.current, { 
          scale: 1.05, 
          yPercent: -10,
          opacity: 0.15, 
          letterSpacing: "0.05em",
          ease: "none" 
        }, 0)
        // Right tagline falls away backwards on a spatial vector
        .to(taglineRef.current, { 
          yPercent: 15, 
          opacity: 0, 
          scale: 0.95,
          ease: "none" 
        }, 0)
        // Deep background giant scale accent text reveal
        .fromTo(bgWatermarkRef.current, 
          { scale: 0.85, opacity: 0 },
          { scale: 1.1, opacity: 0.08, ease: "none" }, 
          0
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full relative bg-[#0A0A0C]">
      <div
        ref={redPanelRef}
        className="sticky bottom-0 z-10 w-full h-screen bg-[#FF5A60] text-white overflow-hidden"
      >
        {/* Kinetic Abstract Watermark Layer */}
        <div 
          ref={bgWatermarkRef}
          className="absolute syne-800 inset-0 flex items-center justify-center font-black text-[13vw] uppercase tracking-tighter text-black select-none pointer-events-none will-change-transform"
        >
          REAL XR
        </div>

        {/* Core Layout Interface Container */}
        <div
          className="relative z-10 w-full h-full flex flex-col md:flex-row md:justify-between md:items-center gap-8 px-6 py-10 sm:px-12 md:px-16 lg:px-24 md:py-16"
        >
          {/* Main Typography Track */}
          <div className="select-none max-w-full md:max-w-2xl lg:max-w-4xl">
            <h2 className="syne-800 tracking-tight uppercase flex flex-col space-y-1 sm:space-y-2">
              <span
                ref={line1Ref}
                className="inline-block will-change-transform text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-white/90 font-bold"
              >
                Built At
              </span>
              <span
                ref={line2Ref}
                className="inline-block will-change-transform origin-left text-black mix-blend-overlay font-black text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-[1.08] tracking-tighter"
              >
                <span className="block">Institute of</span>
                <span className="block">Engineering and Science</span>
              </span>
              <span
                ref={line3Ref}
                className="inline-block will-change-transform text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-white font-bold"
              >
                IPS Academy
              </span>
            </h2>
          </div>

          {/* Right Text Block Frame */}
          <div ref={taglineRef} className="shrink-0 md:text-right max-w-xs md:max-w-sm lg:max-w-md will-change-transform">
            <p className="orbitron-600 text-sm sm:text-base md:text-lg lg:text-xl tracking-wider uppercase leading-10 text-white/95">
              Where Imagination <br /> Meets Engineering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
