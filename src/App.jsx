import React from "react";
import { Canvas } from "@react-three/fiber";
import FluidCanvas from "./components/three/FluidCanvas";
import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero/Hero";

const App = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <Hero />
      



      {/* 2. WEBGL SIMULATION BACKGROUND LAYER */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        {/* Orthographic-aligned camera setup ideal for pure 2D flat-plane shader screens */}
        <Canvas camera={{ position: [0, 0, 1] }}>
          <FluidCanvas />
        </Canvas>
      </div>
    </div>
  );
};

export default App;
