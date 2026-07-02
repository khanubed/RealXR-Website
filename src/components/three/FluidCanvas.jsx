import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './ViscousFluidMaterial'; // Ensure shader initialization happens here

const FluidCanvas = () => {
  const materialRef = useRef();
  
  // Store persistent simulation values outside of React's state loop 
  // to avoid forcing re-renders at 60fps/120fps.
  const prevMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const intensity = useRef(0);
  
  // Extract contextual sizing profiles from the React Three Fiber viewport loop
  const { viewport, size } = useThree();

  // The useFrame hook ties directly into the browser's RequestAnimationFrame tick loop
  useFrame((state) => {
    if (!materialRef.current) return;

    // 1. Synchronize Animation Time & Viewport Sizing Uniforms
    materialRef.current.uTime = state.clock.elapsedTime;
    materialRef.current.uResolution.set(size.width, size.height);

    // 2. Translate WebGL Mouse Coordinates
    // Standard R3F state.pointer tracks -1.0 to +1.0. This remaps it to 0.0 to 1.0 UV space.
    const targetX = (state.pointer.x + 1) / 2;
    const targetY = (state.pointer.y + 1) / 2;

    // 3. Fluid Inertia & Drag (Viscosity)
    // Linearly interpolating (lerping) by 0.04 creates a heavy, smooth drag lag 
    // that mimics a highly viscous fluid tracking behind the cursor.
    materialRef.current.uMouse.x += (targetX - materialRef.current.uMouse.x) * 0.04;
    materialRef.current.uMouse.y += (targetY - materialRef.current.uMouse.y) * 0.04;

    // 4. Track Velocity Delta for Automatic Replenishment
    // Calculate how far the interpolated mouse moved since the previous render frame
    const distanceMoved = materialRef.current.uMouse.distanceTo(prevMouse.current);

    if (distanceMoved > 0.0001) {
      // If the mouse is moving, smoothly ramp up the trail visualization intensity
      intensity.current = THREE.MathUtils.lerp(intensity.current, 1.0, 0.08);
    } else {
      // If the mouse is stationary, slowly decay intensity back to 0.0 to flatten the fluid
      intensity.current = THREE.MathUtils.lerp(intensity.current, 0.0, 0.015);
    }

    // Sync scalar variables into WebGL uniform memory space
    materialRef.current.uIntensity = intensity.current;
    
    // Cache current cursor position to compute distance deltas on the next tick
    prevMouse.current.copy(materialRef.current.uMouse);
  });

  return (
    <mesh>
      {/* A full-bleed flat plane geometry scaled directly to fill the user screen boundary */}
      <planeGeometry args={[viewport.width, viewport.height]} />
      {/* Mount our custom registered shader material component */}
      <viscousFluidMaterial ref={materialRef} />
    </mesh>
  );
};

export default FluidCanvas;