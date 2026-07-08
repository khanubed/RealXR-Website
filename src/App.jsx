import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import FluidCanvas from "./components/three/FluidCanvas";
import Hero from "./sections/Hero/Hero";
import HeroVideo from "./sections/Hero/HeroVideo";
import About from "./sections/About/About";
import Domains from "./sections/Domains/Domains";
import Projects from "./sections/Projects/Projects";
import Moments from "./sections/Events/Moments";
import PastEvents from "./sections/Events/PastEvents";
import TeamIntro from "./sections/Team/TeamIntro";
import Team from "./sections/Team/Team";
import Join from "./sections/Join/Join";
import Footer from "./sections/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  useEffect(() => {
    // Single Lenis instance — only here, nowhere else
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Connect lenis → ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // ✅ Named function so we can actually remove it from ticker on cleanup
    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.defaults({ scroller: window });

    // Refresh after mount so all child ScrollTriggers calculate correctly
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      clearTimeout(t);
      gsap.ticker.remove(tickerFn); // ✅ removes the exact same function reference
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="w-full relative">
      {/* Fixed WebGL background */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <Canvas camera={{ position: [0, 0, 1] }}>
          <FluidCanvas />
        </Canvas>
      </div>

      {/* Page content — no zIndex, no overflow */}
      <div className="relative w-full">
        <Hero />
        <HeroVideo />
        <About />
        <Domains />
        <Projects />
        <Moments />
        <PastEvents />
        <TeamIntro />
        <Team />
        {/* Join + Footer: 3-layer curtain stack.
            The 250 vh wrapper gives the sticky Join section its "hold" time.
            While the user scrolls through it, Join stays pinned at the top
            (position:sticky) and the Footer slides up from below to overlap it. */}
        <div style={{ position: "relative", height: "250vh" }}>
          <Join />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
