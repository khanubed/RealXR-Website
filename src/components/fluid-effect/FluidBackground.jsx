import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import FluidCanvas from './FluidCanvas';

/**
 * FluidBackground - Drop-in full-screen or container interactive fluid component
 * 
 * Works out-of-the-box with zero Three.js boilerplate needed in the consuming project.
 * 
 * @example
 * // Standard full-screen background
 * <FluidBackground preset="darkNeon" />
 * 
 * @example
 * // Local container (e.g. Hero banner or Card)
 * <div className="relative w-full h-[600px] overflow-hidden">
 *   <FluidBackground 
 *     className="absolute inset-0 w-full h-full"
 *     color1="#050811"
 *     color2="#10192e"
 *     fluidColor="#00d2ff"
 *     radius={0.35}
 *   />
 *   <div className="relative z-10">Hero Content</div>
 * </div>
 */
const FluidBackground = ({
  // Container styling & layout
  className = 'fixed top-0 left-0 w-full h-full pointer-events-none',
  style,
  zIndex = 0,
  
  // Three Fiber Canvas options
  eventSource,
  camera = { position: [0, 0, 1] },
  dpr = [1, 2],
  gl = { antialias: true, alpha: true, powerPreference: 'high-performance' },
  canvasProps = {},

  // Fluid visual parameters passed down
  preset = 'pastel',
  color1,
  color2,
  paletteA,
  paletteB,
  paletteC,
  paletteD,
  usePalette,
  fluidColor,
  fluidBlend,
  backgroundOpacity,
  ambientWave,
  radius,
  frequency,
  distortion,
  viscosity,
  trailIntensity,
  decaySpeed,
  speed,
  wiggleFactor,
  specularIntensity,
  
  ...restProps
}) => {
  const containerRef = useRef(null);

  // Resolved event source: user provided ref/element, or fallback to containerRef
  const activeEventSource = eventSource || containerRef;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ zIndex, ...style }}
      {...restProps}
    >
      <Canvas
        eventSource={activeEventSource}
        camera={camera}
        dpr={dpr}
        gl={gl}
        {...canvasProps}
      >
        <FluidCanvas
          preset={preset}
          color1={color1}
          color2={color2}
          paletteA={paletteA}
          paletteB={paletteB}
          paletteC={paletteC}
          paletteD={paletteD}
          usePalette={usePalette}
          fluidColor={fluidColor}
          fluidBlend={fluidBlend}
          backgroundOpacity={backgroundOpacity}
          ambientWave={ambientWave}
          radius={radius}
          frequency={frequency}
          distortion={distortion}
          viscosity={viscosity}
          trailIntensity={trailIntensity}
          decaySpeed={decaySpeed}
          speed={speed}
          wiggleFactor={wiggleFactor}
          specularIntensity={specularIntensity}
        />
      </Canvas>
    </div>
  );
};

export default FluidBackground;
