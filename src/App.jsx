import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "./components/layout/Navbar";

// Global Canvas asset
import FluidCanvas from "./components/three/FluidCanvas";

// Routing utilities
import ScrollToTop from "./components/ui/ScrollToTop";

// Page Views
import Home from "./pages/Home/Home";
import GalleryDashboard from "./pages/Gallery/GalleryDashboard"; // The page Claude is writing for you
// import Events from "./pages/Events";
// import Blogs from "./pages/Blogs";
import Footer from "./sections/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Single Lenis instance orchestration
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Connect Lenis hook feedback straight into ScrollTrigger updates
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
  }, []);

  return (
    <Router>
      {/* Resets Lenis scroller footprint smoothly on route changes */}
      <ScrollToTop lenisRef={lenisRef} />

      <div className="w-full relative bg-[#0a0a0a] text-white min-height-screen">
        {/* FIXED 3D WEBGL ENGINE BACKGROUND LAYER */}
        <div
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <Canvas camera={{ position: [0, 0, 1] }}>
            <FluidCanvas />
          </Canvas>
        </div>

        {/* GLOBAL NAVIGATION LAYER */}
        {/* FLOATING CAPSULE NAVIGATION LAYER */}
        <div className="absolute top-6 left-0 w-full flex justify-center z-50 px-4 pointer-events-none">
          <Navbar />
        </div>

        {/* COMPONENT ROUTER VIEWPORTS */}
        <div className="relative w-full  pt-24 z-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<GalleryDashboard />} />
            {/* <Route path="/events" element={<Events />} />
            <Route path="/blogs" element={<Blogs />} /> */}
          </Routes>

          {/* Global Footer remains at the base of every routed page view */}
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
