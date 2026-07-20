import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rainImages } from "../../data/data.js";
import DistortText from "../../components/three/DistortText.jsx";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Moments = ({ images = [], title, subTitle }) => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const imageList = images?.length ? images : rainImages;

  // Consolidate everything inside the useGSAP hook
  useGSAP(
    () => {
      // Clear out stale references and match the current image array boundaries
      itemsRef.current = itemsRef.current.slice(0, imageList.length);

      // Safety check: skip GSAP logic if there are no images to animate
      if (!imageList || imageList.length === 0) return;

      // Master function to manage a single image's lifecycle
      const startRainCycle = (el, isInitialSpawn = false) => {
        if (!el || !containerRef.current) return;

        // 1. Generate wide-variance properties for deep 3D-like layering
        const randomScale = gsap.utils.random(0.3, 1.0); // Extreme size differences
        const randomDuration = gsap.utils.random(8, 16); // High speed variation
        const startX = gsap.utils.random(2, 98); // Screen distribution width
        const randomRotation = gsap.utils.random(-35, 35);

        // 2. Handle position on initial page load vs normal respawn
        const containerHeight = containerRef.current.offsetHeight;
        const startY = isInitialSpawn
          ? gsap.utils.random(-150, containerHeight)
          : -200;

        // 3. Apply the random properties
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          left: `${startX}%`,
          y: startY,
          scale: randomScale,
          rotation: randomRotation,
          opacity: gsap.utils.mapRange(0.3, 1.0, 0.3, 0.85, randomScale),
          zIndex: Math.round(randomScale * 10),
        });

        // 4. Animate the fall
        gsap.to(el, {
          y: containerHeight + 200,
          rotation: randomRotation + gsap.utils.random(-30, 30),
          duration: randomDuration,
          ease: "none",
          onComplete: () => startRainCycle(el, false),
        });
      };

      // Kick off the rain for all elements simultaneously
      itemsRef.current.forEach((el) => {
        startRainCycle(el, true);
      });

      // 5. Create Pinning ScrollTrigger to hold the section on screen
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top", // Locks section to viewport frame when top reaches top
        end: "+=1200", // Amount of scroll distance the text/rain stays pinned
        pin: true, // Activates pinning mechanics
        pinSpacing: true, // Pushes lower components down cleanly
        anticipatePin: 1, // Eliminates visual snapping during fast scrolls
      });
    },
    { scope: containerRef, dependencies: [imageList] },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[650px] b flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* BACKGROUND: Truly Random Infinite Falling Images */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {imageList.map((image, index) => (
          <div
            key={image.id || `${image}-${index}`}
            ref={(el) => (itemsRef.current[index] = el)}
            className="absolute w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 overflow-hidden rounded shadow-sm will-change-transform bg-gray-50"
          >
            <img
              src={typeof image === "string" ? image : image.url}
              alt="Captured Moment"
              className="w-full h-full object-cover pointer-events-none"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* FOREGROUND: Typography Section Layer */}
      <div className="relative z-20 text-center max-w-6xl px-6 pointer-events-none mix-blend-difference md:mix-blend-normal">
        <DistortText className = {"text-black syne-800 font-black tracking-tighter uppercase text-5xl sm:text-7xl md:text-[5vw] leading-[0.88] mb-6 "} text={title} />
        <p className="text-black font-medium tracking-tight syne-600 text-sm sm:text-base md:text-lg max-w-4xl mx-auto opacity-90">
          {subTitle}
        </p>
      </div>
    </section>
  );
};

export default Moments;
