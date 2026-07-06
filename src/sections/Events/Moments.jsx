import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { rainImages } from "../../data/data.js"; // Adjust this path to match your file structure

const Moments = () => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    // Clear out stale references
    itemsRef.current = itemsRef.current.slice(0, rainImages.length);

    // Master function to manage a single image's lifecycle
    const startRainCycle = (el, isInitialSpawn = false) => {
      if (!el || !containerRef.current) return;

      // 1. Generate wide-variance properties for deep 3D-like layering
      const randomScale = gsap.utils.random(0.3, 1.0); // Extreme size differences
      const randomDuration = gsap.utils.random(8, 16); // High speed variation
      const startX = gsap.utils.random(2, 98);         // Screen distribution width
      const randomRotation = gsap.utils.random(-35, 35);

      // 2. Handle position on initial page load vs normal respawn
      // On load, scatter images vertically across the screen so it's already "raining"
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
        // Small background images are faint; large foreground images are sharp and bold
        opacity: gsap.utils.mapRange(0.3, 1.0, 0.3, 0.85, randomScale),
        // Push larger items forward using z-index
        zIndex: Math.round(randomScale * 10),
      });

      // 4. Animate the fall
      gsap.to(el, {
        y: containerHeight + 200,
        rotation: randomRotation + gsap.utils.random(-30, 30),
        duration: randomDuration,
        ease: "none",
        // The Magic Hook: When done, run it again with completely new values!
        onComplete: () => startRainCycle(el, false),
      });
    };

    // Kick off the rain for all elements simultaneously
    itemsRef.current.forEach((el) => {
      startRainCycle(el, true); // true = pre-populate the screen on first load
    });

    return () => {
      // Clean up all active tweens when the component unmounts
      if (itemsRef.current.length > 0) {
        gsap.killTweensOf(itemsRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[95vh] min-h-[650px]  flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* BACKGROUND: Truly Random Infinite Falling Images */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {rainImages.map((image, index) => (
          <div
            key={image.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className="absolute w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 overflow-hidden rounded shadow-sm will-change-transform bg-gray-50"
          >
            <img
              src={image.url}
              alt="Captured Moment"
              className="w-full h-full object-cover pointer-events-none"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* FOREGROUND: Crisp Heavy Typography Section Layer (from image_e0d25e.png) */}
      <div className="relative z-20 text-center max-w-5xl px-6 pointer-events-none mix-blend-difference md:mix-blend-normal">
        <h2 className="text-black syne-800 font-black tracking-tighter uppercase text-5xl sm:text-7xl md:text-[5vw] leading-[0.88] mb-6">
          Moments That <br /> Shaped Us
        </h2>
        <p className="text-black font-medium tracking-tight syne-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto opacity-90">
          Every event, every late night, every demo that actually worked — captured here.
        </p>
      </div>
    </section>
  );
};

export default Moments;