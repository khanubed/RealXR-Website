import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshReflectorMaterial, Text, Center, OrbitControls } from '@react-three/drei';

// 1. A Stylized 3D VR Headset Placeholder matching image_7c4b04_2.png
const VRHeadset = () => {
  return (
    <group position={[0, -0.3, 1.5]}>
      {/* Main White Visor Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.9, 1.0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} flatShading />
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

// 2. The Reflective Floor Plane
const ReflectiveFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 19]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[400, 100]}        // Blur ground reflections (width, height)
        resolution={1024}        // Reflections resolution
        mixBlur={1}              // How much blur mixes with surface roughness
        mixStrength={15}         // Strength of the reflections
        roughness={0.15}         // Surface roughness
        depthScale={1.2}         // Scale the reflection depth
        minDepthThreshold={0.4}  // Lower threshold for depth fading
        maxDepthThreshold={1.4}  // Upper threshold for depth fading
        color="#ffffff"          // Floor color tint
        metalness={0.05}         // Slight metallic shine for tile look
      />
    </mesh>
  );
};

// 3. The Main Hero Scene Component
export default function HeroScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'transparent', position: 'relative', overflow: 'hidden' }}>
      
      {/* HEADER NAV OVERLAY */}
      {/* <header style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px',
        height: '60px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        zIndex: 10,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>REAL<span style={{ color: '#555' }}>XR</span></div>
        <nav style={{ display: 'flex', gap: '30px', fontSize: '0.9rem', fontWeight: '500' }}>
          <a href="#home" style={{ textDecoration: 'none', color: '#000' }}>Home</a>
          <a href="#about" style={{ textDecoration: 'none', color: '#000' }}>About</a>
          <a href="#projects" style={{ textDecoration: 'none', color: '#000' }}>Projects</a>
          <a href="#events" style={{ textDecoration: 'none', color: '#000' }}>Events</a>
          <a href="#team" style={{ textDecoration: 'none', color: '#000' }}>Team</a>
        </nav>
        <button style={{
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '20px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>Join Us</button>
      </header> */}

      {/* 3D CANVAS */}
      <Canvas
        className='orbitron-900'
        gl={{ logarithmicDepthBuffer: true, antialias: true }}
        camera={{ position: [0, 1.5, 8.5], fov: 45 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {/* Lights setup to illuminate both front object and back text */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-10, 5, 5]} intensity={0.5} />
        <pointLight position={[0, 2, 2]} intensity={1} />

        <Suspense fallback={null}>
          {/* Big Background Text */}
          <Center position={[0, 1, -6]}>
            <Text
            
              fontSize={4}
              color="#000000"
              fontWeight={900}
              letterSpacing={0.05}
            >
              REALXR
            </Text>
          </Center>

          {/* Foreground Hero Object */}
          <VRHeadset />

          {/* Reflective Ground */}
          <ReflectiveFloor />
        </Suspense>

        {/* Optional controls to look around the composition */}
        <OrbitControls 
          enableZoom={false} 
          maxPolarAngle={Math.PI / 2 - 0.05} // Don't let camera go under floor
          minPolarAngle={Math.PI / 3} 
        />
      </Canvas>
    </div>
  );
}