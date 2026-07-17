import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectsData } from "../../data/projectData";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Fallback content to keep the UI intact if CMS data is missing
const defaultContent = projectsData;

const Projects = ({ content = defaultContent }) => {
  const componentRef = useRef(null);
  const revealBoxRef = useRef(null);
  const marqueeRef = useRef(null);

  // Safely initialize the active image
  const [activeImage, setActiveImage] = useState(
    content.projects?.[0]?.img || "",
  );

  // Update active image if the CMS injects new data
  useEffect(() => {
    if (content.projects && content.projects.length > 0) {
      setActiveImage(content.projects[0].img);
    }
  }, [content.projects]);

  // GSAP quickTo refs for responsive mouse positioning tracking
  const xTo = useRef(null);
  const yTo = useRef(null);

  // Consolidate all initialization, pinning, and marquee tracking inside useGSAP
  useGSAP(
    () => {
      // Safety check: skip GSAP if there are no projects to render
      if (!content.projects || content.projects.length === 0) return;

      // 1. Setup high-speed cursor target tracking
      xTo.current = gsap.quickTo(revealBoxRef.current, "x", {
        duration: 0.4,
        ease: "power3.out",
      });
      yTo.current = gsap.quickTo(revealBoxRef.current, "y", {
        duration: 0.4,
        ease: "power3.out",
      });

      // Initial cursor box setup state
      gsap.set(revealBoxRef.current, {
        scale: 0,
        xPercent: -50,
        yPercent: -50,
      });

      // 2. Infinite Marquee Base Loop
      const marqueeTween = gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 25,
        ease: "none",
      });

      // 3. Section Pinning & Intro Sequence Timeline
      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: componentRef.current,
          start: "top top",
          end: "+=1200",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Stagger reveal the project rows
      pinTimeline
        .fromTo(
          ".project-row",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.15, ease: "power2.out" },
        )
        .to({}, { duration: 1.5 }); // Dedicated "hold" frame

      // 4. ScrollTrigger to monitor page scroll velocity
      const velocityTrigger = ScrollTrigger.create({
        trigger: componentRef.current,
        start: "top bottom",
        end: "bottom top",
      });

      // 5. Smoothly map scroll speed to animation timeScale
      let currentScale = 1;

      const dynamicVelocityTracker = () => {
        const scrollVelocity = velocityTrigger
          ? Math.abs(velocityTrigger.getVelocity())
          : 0;
        const targetScale = 1 + scrollVelocity * 0.002;

        currentScale += (targetScale - currentScale) * 0.08;
        marqueeTween.timeScale(currentScale);
      };

      gsap.ticker.add(dynamicVelocityTracker);

      // useGSAP handles killing components automatically,
      // but the custom ticker loop needs manual removal on unmount
      return () => {
        gsap.ticker.remove(dynamicVelocityTracker);
      };
    },
    { scope: componentRef, dependencies: [content.projects] },
  );

  const handleMouseMove = (e) => {
    if (!componentRef.current || !revealBoxRef.current) return;

    const bounds = componentRef.current.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    if (xTo.current && yTo.current) {
      xTo.current(mouseX);
      yTo.current(mouseY);
    }
  };

  const handleMouseEnterRow = (imgUrl) => {
    setActiveImage(imgUrl);

    gsap.to(revealBoxRef.current, {
      scale: 1,
      rotation: 2,
      opacity: 1,
      duration: 0.35,
      ease: "back.out(1.4)",
    });
  };

  const handleMouseLeaveRow = () => {
    gsap.to(revealBoxRef.current, {
      scale: 0,
      rotation: -2,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });
  };

  return (
    <section
      ref={componentRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen py-10 px-4 md:px-12 overflow-hidden select-none text-black flex flex-col justify-center "
    >
      {/* Dynamic Velocity Marquee Tracker Wrapper */}
      <div className="w-full overflow-hidden whitespace-nowrap border-b border-black/10">
        <div
          ref={marqueeRef}
          className="inline-block whitespace-nowrap will-change-transform"
        >
          {[1, 2].map((key) => (
            <h2
              key={key}
              className="inline-block text-[6vw] md:text-[4.5vw] font-black syne-800 tracking-tighter uppercase font-sans"
            >
              {Array(4).fill(content.marqueeText).join(" ")}&nbsp;
            </h2>
          ))}
        </div>
      </div>

      {/* Main Project Stack Table Structure */}
      <div className="w-full max-w-6xl mx-auto mt-6 border-t border-black">
        {content.projects?.map((project) => (
          <div
            key={project.id}
            onMouseEnter={() => handleMouseEnterRow(project.img)}
            onMouseLeave={handleMouseLeaveRow}
            className="project-row group flex justify-between items-center py-4 px-4 md:px-8 border-b border-black transition-colors duration-200 ease-out hover:bg-black cursor-pointer"
          >
            <h3 className="text-xl md:text-3xl font-bold tracking-tight text-black transition-colors duration-200 group-hover:text-white syne-600">
              {project.title}
            </h3>

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
        {activeImage && (
          <img
            src={activeImage}
            alt="Project Preview"
            className="w-full h-full object-cover transform scale-105"
          />
        )}
      </div>
    </section>
  );
};

export default Projects;
