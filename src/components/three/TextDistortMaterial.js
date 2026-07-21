import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const TextDistortMaterial = shaderMaterial(
  {
    uTexture: null,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uIntensity: 0,
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
  },
  // vertex
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment
  `
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform float uIntensity;
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec2 aspect = vec2(uResolution.x / max(uResolution.y, 0.001), 1.0);
      vec2 st = vUv * aspect;
      vec2 mouse = uMouse * aspect;

      float dist = distance(st, mouse);

      // Falloff radius around the pointer, scaled by intensity (ramps up on hover/tap, decays to 0 automatically)
      float pull = smoothstep(0.55, 0.0, dist) * uIntensity;

      float wiggle = sin(dist * 22.0 - uTime * 2.2);
      vec2 snake = vec2(cos(wiggle), sin(wiggle));

      vec2 dir = normalize(st - mouse + 0.0001);
      dir = normalize(mix(dir, snake, 0.6));

      vec2 uv = vUv - dir * pull * 0.14;

      // Secondary ripple so it reads as liquid, not just a push
      uv.y += sin(uv.x * 28.0 + uTime * 3.0) * 0.005 * pull;
      uv.x += cos(uv.y * 24.0 - uTime * 2.4) * 0.005 * pull;

      vec4 color = texture2D(uTexture, clamp(uv, 0.001, 0.999));

      // Subtle chromatic split while distorted — sells the "liquid glass" look
      float split = pull * 0.006;
      float rA = texture2D(uTexture, clamp(uv + vec2(split, 0.0), 0.001, 0.999)).a;
      float bA = texture2D(uTexture, clamp(uv - vec2(split, 0.0), 0.001, 0.999)).a;
      color.a = max(color.a, max(rA, bA) * pull);

      if (color.a < 0.01) discard;
      gl_FragColor = color;
    }
  `
);

extend({ TextDistortMaterial });
export { TextDistortMaterial };