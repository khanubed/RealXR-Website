import React, { useEffect, useRef, useState } from "react";
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

  // 1. Lenis & ScrollTrigger Initialization
  useEffect(() => {
    // Keep Lenis from scrolling during the preload phase
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.defaults({ scroller: window });
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(t);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isLoading]);

  // 2. Route Change Scroll-To-Top handling
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Website Preloader Layer */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <div 
        ref={eventRootRef} 
        className={`w-full relative bg-[#0a0a0a] text-white min-h-screen ${isLoading ? 'h-screen overflow-hidden' : ''}`}
      >
        <CustomCursor/>
        {/* FIXED 3D WEBGL ENGINE BACKGROUND LAYER */}
        <div
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <Canvas eventSource={eventRootRef.current} camera={{ position: [0, 0, 1] }}>
            <FluidCanvas />
          </Canvas>
        </div>

        {/* FLOATING CAPSULE NAVIGATION LAYER */}
        <div className="absolute w-full flex justify-center mt-3.5" style={{ zIndex: 20 }}>
          <Navbar />
        </div>

        {/* COMPONENT ROUTER VIEWPORTS */}
        <div className="relative w-full z-0">
          {/* Outlet is where child routes (Home, Gallery) inject their UI */}
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default RootLayout;