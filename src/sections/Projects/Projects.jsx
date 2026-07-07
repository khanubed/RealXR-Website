import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "../../data/data.js";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const componentRef = useRef(null);
  const revealBoxRef = useRef(null);
  const marqueeRef = useRef(null);
  const [activeImage, setActiveImage] = useState(projectsData[0].img);

  // GSAP quickTo refs for responsive mouse positioning tracking
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    // 1. Setup high-speed cursor target tracking
    xTo.current = gsap.quickTo(revealBoxRef.current, "x", { duration: 0.4, ease: "power3.out" });
    yTo.current = gsap.quickTo(revealBoxRef.current, "y", { duration: 0.4, ease: "power3.out" });

    // Initial cursor box setup state
    gsap.set(revealBoxRef.current, { scale: 0, xPercent: -50, yPercent: -50 });

    // 2. Infinite Marquee Base Loop
    const marqueeTween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      repeat: -1,
      duration: 25, // Base speed (seconds to complete one full loop)
      ease: "none",
    });

    // 3. Section Pinning & Intro Sequence Timeline
    const pinTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: componentRef.current,
        start: "top top",       // Lock section when its top edge hits the top of viewport
        end: "+=1200",          // Total scroll reach the section remains locked (increase for longer hold)
        pin: true,              // Pins the section in place
        scrub: 1,               // Smoothly links timeline progression to scroll distance
        anticipatePin: 1,       // Prevents layout jumps during fast scroll initialization
      }
    });

    // Stagger reveal the project rows as the user scrubs into the pin
    pinTimeline.fromTo(".project-row", 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0,个人: 0, stagger: 0.15, ease: "power2.out" }
    )
    // Extra layout pad duration at the end of the timeline 
    // This creates the dedicated "hold" frame where the list is completely still and hoverable
    .to({}, { duration: 1.5 });

    // 4. ScrollTrigger to monitor page scroll velocity (for marquee reaction)
    const velocityTrigger = ScrollTrigger.create({
      trigger: componentRef.current,
      start: "top bottom",
      end: "bottom top",
    });

    // 5. Smoothly map scroll speed to animation timeScale using the ticker
    let currentScale = 1;
    
    const dynamicVelocityTracker = () => {
      const scrollVelocity = velocityTrigger ? Math.abs(velocityTrigger.getVelocity()) : 0;
      const targetScale = 1 + scrollVelocity * 0.002; 
      
      currentScale += (targetScale - currentScale) * 0.08;
      marqueeTween.timeScale(currentScale);
    };

    gsap.ticker.add(dynamicVelocityTracker);

    // Cleanup on unmount
    return () => {
      if (velocityTrigger) velocityTrigger.kill();
      pinTimeline.kill();
      marqueeTween.kill();
      gsap.ticker.remove(dynamicVelocityTracker);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!componentRef.current || !revealBoxRef.current) return;
    
    const bounds = componentRef.current.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    xTo.current(mouseX);
    yTo.current(mouseY);
  };

  const handleMouseEnterRow = (imgUrl) => {
    setActiveImage(imgUrl);
    
    gsap.to(revealBoxRef.current, {
      scale: 1,
      rotation: 2,
      opacity: 1,
      duration: 0.35,
      ease: "back.out(1.4)"
    });
  };

  const handleMouseLeaveRow = () => {
    gsap.to(revealBoxRef.current, {
      scale: 0,
      rotation: -2,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in"
    });
  };

  return (
    <section 
      ref={componentRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen py-10 px-4 md:px-12 overflow-hidden select-none text-black flex flex-col justify-center "
    >
      {/* Dynamic Velocity Marquee Tracker Wrapper */}
      <div className="w-full overflow-hidden whitespace-nowrap  border-b border-black/10">
        <div ref={marqueeRef} className="inline-block whitespace-nowrap will-change-transform">
          <h2 className="inline-block text-[6vw] md:text-[4.5vw] font-black syne-800 tracking-tighter uppercase font-sans">
            RECENT PROJECTS — RECENT PROJECTS — RECENT PROJECTS — RECENT PROJECTS —&nbsp;
          </h2>
          <h2 className="inline-block text-[6vw] md:text-[4.5vw] font-black syne-800 tracking-tighter uppercase font-sans">
            RECENT PROJECTS — RECENT PROJECTS — RECENT PROJECTS — RECENT PROJECTS —&nbsp;
          </h2>
        </div>
      </div>

      {/* Main Project Stack Table Structure */}
      <div className="w-full max-w-6xl mx-auto mt-6 border-t border-black">
        {projectsData.map((project) => (
          <div
            key={project.id}
            onMouseEnter={() => handleMouseEnterRow(project.img)}
            onMouseLeave={handleMouseLeaveRow}
            className="project-row group flex justify-between items-center py-4 px-4 md:px-8 border-b border-black transition-colors duration-200 ease-out hover:bg-black cursor-pointer"
          >
            {/* Title Label Area */}
            <h3 className="text-xl md:text-3xl font-bold tracking-tight text-black transition-colors duration-200 group-hover:text-white syne-600">
              {project.title}
            </h3>

            {/* Badge Pill Item Button Frame wrapper */}
            <div className="border border-black group-hover:border-white px-6 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-wide text-black syne-500 transition-colors duration-200 group-hover:text-white">
              {project.tag}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Interactive Hover Follower Display Box Panel */}
      <div
        ref={revealBoxRef}
        className="absolute top-0 left-0 w-72 h-44 md:w-96 md:h-56 pointer-events-none overflow-hidden rounded-xl shadow-2xl z-50 origin-center border border-white/20 will-change-transform opacity-0"
      >
        <img
          src={activeImage}
          alt="Project Preview"
          className="w-full h-full object-cover transform scale-105"
        />
      </div>
    </section>
  );
};

export default Projects;