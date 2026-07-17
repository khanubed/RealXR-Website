import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshReflectorMaterial, Text, Center } from "@react-three/drei";
import gsap from "gsap"; // 1. Import GSAP
import { useGSAP } from "@gsap/react";

const VRHeadset = () => {
  const groupRef = useRef();
  const isDragging = useRef(false);
  const previousPointerPosition = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    isDragging.current = true;
    previousPointerPosition.current = { x: e.clientX, y: e.clientY };

    // 2. Kill any active snap-back tweens instantly so they don't fight user interaction
    if (groupRef.current) {
      gsap.killTweensOf(groupRef.current.rotation);
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    const deltaX = e.clientX - previousPointerPosition.current.x;
    const deltaY = e.clientY - previousPointerPosition.current.y;

    if (groupRef.current) {
      groupRef.current.rotation.y += deltaX * 0.007;
      groupRef.current.rotation.x += deltaY * 0.007;
    }

    previousPointerPosition.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    isDragging.current = false;

    // 3. Smoothly animate back to original rotation [0, 0, 0] on release
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2, // Time in seconds to return to center
        ease: "power3.out", // Premium, fluid deceleration curve
      });
    }
  };

  return (
    <group
    scale={2}
      ref={groupRef}
      position={[0, -0.6, -1.0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ cursor: "grab" }}
    >
      {/* Main White Visor Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 1.0]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Front Dark Glass Panel */}
      <mesh position={[0, 0, 0.51]}>
        <boxGeometry args={[1.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Head Strap (Top) */}
      <mesh position={[0, 0.5, -0.3]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.8]} />
        <meshStandardMaterial color="#7c7c7c" roughness={0.8} />
      </mesh>
    </group>
  );
};

const ReflectiveFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 30]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={12}
        roughness={0.15}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#ffffff"
        metalness={0.1}
      />
    </mesh>
  );
};

export default function HeroScene() {
  useGSAP();
  return (
    <div
    className="orbitron-400"

      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        // zIndex : -10
      }}
    >
      <Canvas
      className="orbitron-bold"
        gl={{ logarithmicDepthBuffer: true, antialias: true }}
        camera={{ position: [0, 1.5, 8.5], fov: 45 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex : 40,
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, -10]} intensity={1.2} />
        <directionalLight position={[-10, 5, 5]} intensity={0.3} />
        <pointLight position={[0, 2, 2]} intensity={0.8}    />

        {/* High intensity point light directly behind the text layer */}
        <pointLight
          position={[0, 1.5, -6.5]}
          intensity={8}
          distance={15}
          decay={1.5}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          {/* <Center position={[0, 0.5, -20]}>
            <Text
              fontSize={7}
              color="#000000"
              fontWeight={900}
              letterSpacing={0.05}
            //   font="https://fonts.gstatic.com/s/syncopate/v22/pe0FMIWNx4969_at6Shf7_bc8A.woff"
            >
              REALXR
            </Text>
          </Center> */}
        
          <VRHeadset />
          <ReflectiveFloor />
        </Suspense>
      </Canvas>
      
    </div>
  );
}
