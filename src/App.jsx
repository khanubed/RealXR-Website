import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FluidCanvas from "./components/three/FluidCanvas";
import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero/Hero";
import About from "./sections/About/About";

gsap.registerPlugin(ScrollTrigger);

const App = () => {

  useEffect(() => {
    // Init Lenis here directly — simplest and safest
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // CRITICAL — connect lenis scroll events to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // CRITICAL — drive lenis via gsap ticker, NOT requestAnimationFrame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Prevents GSAP compensating for dropped frames (causes jitter)
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    // ✅ No height, no overflow — let window handle scrolling
    <div style={{ width: "100vw", position: "relative" }}>

      {/* Fixed WebGL background — sits behind everything */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",  // ✅ Behind content, not above it
      }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <FluidCanvas />
        </Canvas>
      </div>

      {/* All page content sits above the WebGL layer */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <Hero />
        <About />
      </div>

    </div>
  );
};

export default App;