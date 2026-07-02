import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

/**
 * 1. Shader Uniform Definitions
 * Uniforms are variables passed from React/JavaScript down into the GPU hardware.
 * - uTime: Keeps track of elapsed clock seconds for seamless phase loops.
 * - uResolution: Coordinates pixel dimensional scale to handle display resizing.
 * - uMouse: Tracks translated normalized coordinates (0.0 to 1.0) of the system pointer.
 * - uIntensity: Modulates the structural footprint dynamically depending on cursor movement delta.
 */
const ViscousFluidMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uMouse: new THREE.Vector2(0.5, 0.5),
    uIntensity: 0,
  },

  // 2. Vertex Shader
  // This executes once per geometric vertex point to map layout projections onto screen space.
  `
    varying vec2 vUv;
    void main() {
      vUv = uv; // Forward texture coordinates over to the Fragment Shader
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  // 3. Fragment Shader
  // This calculates the individual pixel colors sequentially across the viewport.
  `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uIntensity;
    varying vec2 vUv;

    // Cosine-based spectrum palette generator
    // Generates complex gradient curves smoothly by varying Phase Shift (d) and Bias (a).
    vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
        return a + b * cos( 6.28318 * (c * t + d) );
    }

    void main() {
      // Prevent dividing by zero during initial frame render ticks
      float resY = max(uResolution.y, 0.001);
      
      // Calculate aspect ratio vector offsets to keep the mouse ripple perfectly round 
      // instead of squishing on wide/ultra-wide viewports
      vec2 aspect = vec2(uResolution.x / resY, 1.0);
      vec2 st = vUv * aspect;
      vec2 mouse = uMouse * aspect;

      // Determine the precise scalar distance between the pixel and the current cursor location
      float dist = distance(st, mouse);
      
      // Pull Mask: Dictates how far away from the cursor the liquid distortion spreads
      float pull = smoothstep(0.25, 0.0, dist); 
      pull *= uIntensity; // Fades completely away when the cursor stops moving

      // Serpentine Ribbon Mathematics
      // High frequency distance loops (28.0) paired with sluggish time shifts (1.5)
      // twist the linear directional vectors into a winding snake structure.
      float wiggle = sin(dist * 28.0 - uTime * 1.5);
      vec2 snakeWiggle = vec2(cos(wiggle), sin(wiggle));

      // Calculate directional vector away from mouse, adding a tiny fallback offset 
      // to avoid NaN errors when exactly positioned at 0.0 distance
      vec2 dir = normalize(st - mouse + vec2(0.0001));
      
      // Mix the natural push vector with the snake curves for a balanced serpentine flow
      dir = normalize(mix(dir, snakeWiggle, 0.65)); 
      
      // Apply the calculated displacement factor directly into local texture coordinate streams
      vec2 warpedUV = st - (dir * pull * 0.12);

      // Multi-Layered Domain Warping
      // Creates complex secondary and tertiary ripples inside the main snake track
      vec2 q = vec2(0.0);
      q.x = sin(warpedUV.y * 4.0 + uTime * 0.1);
      q.y = sin(warpedUV.x * 4.0 + uTime * 0.1);

      vec2 r = vec2(0.0);
      r.x = sin((warpedUV.y + q.y) * 5.0 + uTime * 0.15);
      r.y = sin((warpedUV.x + q.x) * 5.0 + uTime * 0.15);

      // Apply the nested loop distortions back down to the target coordinate map
      warpedUV += r * (0.02 + pull * 0.15); 

      // Pastel Environment Background Layer
      vec3 bgCyan = vec3(0.92, 0.97, 1.0);  
      vec3 bgRed = vec3(1.0, 0.95, 0.96);   
      vec3 baseGradient = mix(bgCyan, bgRed, vUv.x + vUv.y - 0.5);
      
      // Infuse subtle ambient liquid drifting into the static background canvas
      baseGradient += sin(vUv.x * 6.0 + uTime * 0.2) * 0.005;

      // Soft Satin Specular Highlights
      // Approximates artificial face normal paths from domain warp outputs to cast 
      // light maps across wave peaks, emulating premium matte glass coatings.
      vec3 normalVec = normalize(vec3(q.x - r.y, q.y - r.x, 1.0));
      vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
      float spec = pow(max(dot(reflect(-lightDir, normalVec), vec3(0.0, 0.0, 1.0)), 0.0), 16.0);

      // Background-Infused Translucent Color Palette Matching
      vec3 a = mix(bgCyan, bgRed, 0.5); // Centers base color directly around background average
      vec3 b = vec3(0.18, 0.15, 0.18);  // Controls color intensity boundaries safely
      vec3 c = vec3(0.6, 0.5, 0.6);     // Stretches wavelength iterations across screen pixels
      vec3 d = vec3(0.00, 0.33, 0.67);  // Shifts color phases smoothly into soft pastel tints

      // Determine final color mix driven by time and multi-layered spatial warping
      float colorDriver = length(q) * 0.7 + length(r) * 0.4 + warpedUV.x - uTime * 0.04;
      vec3 holographicColor = palette(colorDriver, a, b, c, d);
      
      // Blend light reflections on top of the fluid trail
      holographicColor += vec3(spec * 0.1) * pull;

      // Linearly interpolate between background gradient and holographic color via mask
      vec3 finalColor = mix(baseGradient, holographicColor, pull * 0.85);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
);

// Register the custom shader material to expose it as an accessible JSX tag
extend({ ViscousFluidMaterial });

export { ViscousFluidMaterial };
