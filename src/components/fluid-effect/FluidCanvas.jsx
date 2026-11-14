import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './ViscousFluidMaterial';
import { FLUID_PRESETS } from './presets';

// Helper utilities to parse colors and vectors gracefully
const parseColor = (val, defaultVal) => {
  if (!val) return new THREE.Color(defaultVal);
  if (val instanceof THREE.Color) return val;
  try {
    return new THREE.Color(val);
  } catch (e) {
    return new THREE.Color(defaultVal);
  }
};

const parseVec3 = (val, defaultVal) => {
  if (!val) return new THREE.Vector3(...defaultVal);
  if (val instanceof THREE.Vector3) return val;
  if (Array.isArray(val) && val.length === 3) return new THREE.Vector3(val[0], val[1], val[2]);
  return new THREE.Vector3(...defaultVal);
};

/**
 * FluidCanvas / FluidMesh
 * 
 * Interactive WebGL liquid surface mesh with fully customizable colors, 
 * effect sizing, distortion, and fluid physics parameters.
 */
const FluidCanvas = ({
  // Preset selector
  preset = 'pastel',

  // Color props
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

  // Sizing & geometry props
  radius,
  frequency,
  distortion,

  // Effect & dynamics props
  viscosity,
  trailIntensity,
  decaySpeed,
  speed,
  wiggleFactor,
  specularIntensity,
  
  // Custom mesh props
  ...meshProps
}) => {
  const materialRef = useRef();

  // Resolve active preset configuration with user prop overrides
  const config = useMemo(() => {
    const base = FLUID_PRESETS[preset] || FLUID_PRESETS.pastel;
    return {
      color1: color1 ?? base.color1,
      color2: color2 ?? base.color2,
      paletteA: paletteA ?? base.paletteA,
      paletteB: paletteB ?? base.paletteB,
      paletteC: paletteC ?? base.paletteC,
      paletteD: paletteD ?? base.paletteD,
      usePalette: usePalette ?? base.usePalette ?? true,
      fluidColor: fluidColor ?? base.fluidColor,
      fluidBlend: fluidBlend ?? base.fluidBlend ?? 0.85,
      backgroundOpacity: backgroundOpacity ?? base.backgroundOpacity ?? 1.0,
      ambientWave: ambientWave ?? base.ambientWave ?? 0.005,
      radius: radius ?? base.radius ?? 0.25,
      frequency: frequency ?? base.frequency ?? 28.0,
      distortion: distortion ?? base.distortion ?? 0.12,
      viscosity: viscosity ?? base.viscosity ?? 0.04,
      trailIntensity: trailIntensity ?? base.trailIntensity ?? 1.0,
      decaySpeed: decaySpeed ?? base.decaySpeed ?? 0.015,
      speed: speed ?? base.speed ?? 1.0,
      wiggleFactor: wiggleFactor ?? base.wiggleFactor ?? 0.65,
      specularIntensity: specularIntensity ?? base.specularIntensity ?? 0.1,
    };
  }, [
    preset,
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
  ]);

  // Memoize Three.js color & vector instances
  const parsedValues = useMemo(() => {
    return {
      color1: parseColor(config.color1, '#eaf7ff'),
      color2: parseColor(config.color2, '#fff2f5'),
      paletteA: parseVec3(config.paletteA, [0.96, 0.96, 0.98]),
      paletteB: parseVec3(config.paletteB, [0.18, 0.15, 0.18]),
      paletteC: parseVec3(config.paletteC, [0.6, 0.5, 0.6]),
      paletteD: parseVec3(config.paletteD, [0.0, 0.33, 0.67]),
      fluidColor: parseColor(config.fluidColor, '#c7e9fb'),
    };
  }, [
    config.color1,
    config.color2,
    config.paletteA,
    config.paletteB,
    config.paletteC,
    config.paletteD,
    config.fluidColor,
  ]);

  // Persistent simulation state outside of React state
  const prevMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const intensity = useRef(0);

  const { viewport, size } = useThree();

  useFrame((state) => {
    if (!materialRef.current) return;

    // 1. Synchronize Animation Time & Viewport Sizing Uniforms
    materialRef.current.uTime = state.clock.elapsedTime;
    materialRef.current.uResolution.set(size.width, size.height);

    // 2. Translate WebGL Mouse Coordinates (-1..1 to 0..1 UV space)
    const targetX = (state.pointer.x + 1) / 2;
    const targetY = (state.pointer.y + 1) / 2;

    // 3. Fluid Inertia & Drag (Viscosity)
    const drag = Math.max(0.005, Math.min(config.viscosity, 0.5));
    materialRef.current.uMouse.x += (targetX - materialRef.current.uMouse.x) * drag;
    materialRef.current.uMouse.y += (targetY - materialRef.current.uMouse.y) * drag;

    // 4. Track Velocity Delta for Trail Replenishment
    const distanceMoved = materialRef.current.uMouse.distanceTo(prevMouse.current);

    if (distanceMoved > 0.0001) {
      // Smoothly ramp up trail intensity when moving
      intensity.current = THREE.MathUtils.lerp(
        intensity.current,
        config.trailIntensity,
        0.08
      );
    } else {
      // Smoothly decay intensity when cursor is stationary
      intensity.current = THREE.MathUtils.lerp(
        intensity.current,
        0.0,
        config.decaySpeed
      );
    }

    materialRef.current.uIntensity = intensity.current;
    prevMouse.current.copy(materialRef.current.uMouse);
  });

  return (
    <mesh {...meshProps}>
      {/* Full-bleed flat plane geometry scaled to viewport */}
      <planeGeometry args={[viewport.width, viewport.height]} />
      <viscousFluidMaterial
        ref={materialRef}
        transparent={config.backgroundOpacity < 1.0}
        uColor1={parsedValues.color1}
        uColor2={parsedValues.color2}
        uPaletteA={parsedValues.paletteA}
        uPaletteB={parsedValues.paletteB}
        uPaletteC={parsedValues.paletteC}
        uPaletteD={parsedValues.paletteD}
        uUsePalette={config.usePalette ? 1.0 : 0.0}
        uFluidColor={parsedValues.fluidColor}
        uFluidBlend={config.fluidBlend}
        uBackgroundOpacity={config.backgroundOpacity}
        uAmbientWave={config.ambientWave}
        uRadius={config.radius}
        uFrequency={config.frequency}
        uDistortion={config.distortion}
        uSpeed={config.speed}
        uWiggleFactor={config.wiggleFactor}
        uSpecularIntensity={config.specularIntensity}
      />
    </mesh>
  );
};

export { FluidCanvas, FluidCanvas as FluidMesh };
export default FluidCanvas;
