import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamImages } from "../../data/teamsData.js"; // Renamed to map your team dataset cleanly

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const TeamIntro = () => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    // Clear out stale references
    itemsRef.current = itemsRef.current.slice(0, teamImages.length);

    // Master function to manage a single team photo's lifecycle
    const startRainCycle = (el, isInitialSpawn = false) => {
      if (!el || !containerRef.current) return;

      // 1. Generate wide-variance properties for deep 3D-like layering
      const randomScale = gsap.utils.random(0.4, 1.1); // Slightly larger scale for portrait visibility
      const randomDuration = gsap.utils.random(9, 18); // Elegant, slightly relaxed falling velocity
      const startX = gsap.utils.random(2, 98);         // Screen distribution width
      const randomRotation = gsap.utils.random(-25, 25);

      // 2. Handle position on initial page load vs normal respawn
      const containerHeight = containerRef.current.offsetHeight;
      const startY = isInitialSpawn 
        ? gsap.utils.random(-150, containerHeight) 
        : -250;

      // 3. Apply the random properties
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        left: `${startX}%`,
        y: startY,
        scale: randomScale,
        rotation: randomRotation,
        opacity: gsap.utils.mapRange(0.4, 1.1, 0.25, 0.9, randomScale),
        zIndex: Math.round(randomScale * 10),
      });

      // 4. Animate the fall
      gsap.to(el, {
        y: containerHeight + 250,
        rotation: randomRotation + gsap.utils.random(-20, 20),
        duration: randomDuration,
        ease: "none",
        onComplete: () => startRainCycle(el, false),
      });
    };

    // Kick off the rain for all team avatars simultaneously
    itemsRef.current.forEach((el) => {
      startRainCycle(el, true);
    });

    // 5. Create Pinning ScrollTrigger to hold the section on screen
    const pinTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",       // Locks section when it hits the top of the viewport
      end: "+=1400",          // Extended hold window to absorb faces and text before moving on
      pin: true,              // Activates structural screen locking
      pinSpacing: true,       // Pushes subsequent team grids or layouts down cleanly
      anticipatePin: 1,       // Eliminates visual snapping
    });

    return () => {
      // Clean up all active triggers and animations on unmount
      if (pinTrigger) pinTrigger.kill();
      if (itemsRef.current.length > 0) {
        gsap.killTweensOf(itemsRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[650px]  flex flex-col justify-center items-center overflow-hidden select-none"
    >
      {/* BACKGROUND: Falling Team Member Images */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {teamImages.map((image, index) => (
          <div
            key={image.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className="absolute w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 overflow-hidden rounded-2xl shadow-xl will-change-transform bg-gray-100 border border-black/5"
          >
            <img
              src={image.url}
              alt={image.name || "Team Member"}
              className="w-full h-full object-cover pointer-events-none"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* FOREGROUND: Heavy Typography Header Layer */}
      <div className="relative z-20 text-center max-w-7xl px-6 pointer-events-none mix-blend-difference md:mix-blend-normal">
        <h2 className="text-black syne-800 font-black tracking-tighter uppercase text-5xl sm:text-7xl md:text-[5.5vw] leading-[0.85] mb-6">
          Meet the Minds <br /> Behind RealXR
        </h2>
        <p className="text-black font-medium tracking-tight syne-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto opacity-80">
          The creators, builders, and spatial visionaries pushing the absolute boundaries of reality.
        </p>
      </div>
    </section>
  );
};

export default TeamIntro;