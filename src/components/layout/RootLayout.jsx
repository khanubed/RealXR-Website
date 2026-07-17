import React, { useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "./Navbar";
import Footer from "../../sections/Footer/Footer";
import FluidCanvas from "../three/FluidCanvas";
import CustomCursor from "../cursor/CustomCursor";
import Preloader from "../ui/Preloader";

gsap.registerPlugin(ScrollTrigger);

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef(null);
  const eventRootRef = useRef(null);
  const location = useLocation();

  // Unified Scroll Architecture via useGSAP
  useGSAP(
    () => {
      // 1. Gated Execution: Delay initialization until preloader completes
      if (isLoading) return;

      // 2. Initialize Lenis Smooth Scroll
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenisRef.current = lenis;
      
      // Keep ScrollTrigger sync'd with smooth scroll steps
      lenis.on("scroll", ScrollTrigger.update);

      // Link GSAP's high-performance animation ticker to Lenis frames
      const tickerFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.defaults({ scroller: window });

      // Handle structural geometry refresh on a brief delay to account for asset loading layout shifts
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      // 3. Precise Component Cleanup Sequence
      return () => {
        clearTimeout(refreshTimeout);
        gsap.ticker.remove(tickerFn);
        lenis.destroy();
        lenisRef.current = null;
        
        // Wipe active timelines cleanly to prevent React node-removal collisions
        gsap.globalTimeline.clear();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { dependencies: [isLoading] } // Only fires up when loading finishes
  );

  // Separate, safe route change handler for scroll resetting
  useGSAP(
    () => {
      if (isLoading) return;

      // Smoothly snap or instantly jump the view to the top on page swaps
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }

      // Allow DOM rendering thread to finalize before mapping scroll limits
      const routeRefresh = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(routeRefresh);
    },
    { dependencies: [location.pathname, isLoading] } // Triggers immediately on every route pivot
  );

  return (
    <>
      {/* Website Preloader Layer */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <div
        ref={eventRootRef}
        className={`w-full relative bg-[#0a0a0a] text-white min-h-screen ${
          isLoading ? "h-screen overflow-hidden" : ""
        }`}
      >
        <CustomCursor />
        
        {/* FIXED 3D WEBGL ENGINE BACKGROUND LAYER */}
        <div
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <Canvas eventSource={eventRootRef} camera={{ position: [0, 0, 1] }}>
            <FluidCanvas />
          </Canvas>
        </div>

        {/* FLOATING CAPSULE NAVIGATION LAYER */}
        <div className="absolute w-full flex justify-center mt-3.5" style={{ zIndex: 20 }}>
          <Navbar />
        </div>

        {/* COMPONENT ROUTER VIEWPORTS */}
        <div className="relative w-full z-0">
          {/* Remount route content on each pathname change to avoid stale animation state during navigation */}
          <Outlet key={location.pathname} />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default RootLayout;