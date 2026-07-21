import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "./TextDistortMaterial";

function FitOrthoCamera({ width, height }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.near = 0.1;
    camera.far = 100;
    camera.position.z = 10;
    camera.updateProjectionMatrix();
  }, [camera, width, height]);
  return null;
}

function TextPlane({ texture, width, height, isTouch }) {
  const materialRef = useRef();
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetIntensity = useRef(0);
  const decayTimeout = useRef(null);

  useFrame((_, delta) => {
    const m = materialRef.current;
    if (!m) return;
    m.uTime += delta;
    m.uMouse.x += (targetMouse.current.x - m.uMouse.x) * 0.15;
    m.uMouse.y += (targetMouse.current.y - m.uMouse.y) * 0.15;
    const rate = targetIntensity.current > m.uIntensity ? 0.15 : 0.05;
    m.uIntensity += (targetIntensity.current - m.uIntensity) * rate;
  });

  const setUvFromEvent = (e) => {
    if (!e.uv) return;
    targetMouse.current.set(e.uv.x, e.uv.y);
  };

  const handlePointerMove = (e) => {
    if (isTouch) return;
    setUvFromEvent(e);
    targetIntensity.current = 1;
  };

  const handlePointerOut = () => {
    if (isTouch) return;
    targetIntensity.current = 0;
  };

  const handleTap = (e) => {
    if (!isTouch) return;
    setUvFromEvent(e);
    targetIntensity.current = 1;
    clearTimeout(decayTimeout.current);
    decayTimeout.current = setTimeout(() => {
      targetIntensity.current = 0;
    }, 900);
  };

  useEffect(() => () => clearTimeout(decayTimeout.current), []);

  return (
    <mesh
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onPointerDown={handleTap}
    >
      <planeGeometry args={[width, height]} />
      <textDistortMaterial
        ref={materialRef}
        uTexture={texture}
        uResolution={new THREE.Vector2(width, height)}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

const DistortText = forwardRef(
  ({ text, style, tag: Tag = "h1", className, nowrap = false }, forwardedRef) => {
    const wrapperRef = useRef(null);
    const measureRef = useRef(null);
    const [texture, setTexture] = useState(null);
    const [dims, setDims] = useState({ width: 0, height: 0 });

    useImperativeHandle(forwardedRef, () => wrapperRef.current);

    const isTouch = useMemo(
      () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
      [],
    );

    useEffect(() => {
      if (!measureRef.current) return;
      const render = () => {
        const el = measureRef.current;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return;

        const computed = window.getComputedStyle(el);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(rect.width * dpr);
        canvas.height = Math.ceil(rect.height * dpr);
        const ctx = canvas.getContext("2d");

        ctx.scale(dpr, dpr);
        ctx.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
        ctx.fillStyle = computed.color || "#0a0a0a";
        ctx.textBaseline = "middle"; // Centered vertically
        ctx.textAlign = "center";

        const wrapText = (text, maxWidth) => {
          const words = text.split(" ");
          let lines = [];
          let currentLine = words[0];
          for (let i = 1; i < words.length; i++) {
            const width = ctx.measureText(currentLine + " " + words[i]).width;
            if (width < maxWidth) {
              currentLine += " " + words[i];
            } else {
              lines.push(currentLine);
              currentLine = words[i];
            }
          }
          lines.push(currentLine);
          return lines;
        };

        const lineHeight = parseInt(computed.lineHeight) || 40;
        const lines = nowrap ? [text] : wrapText(text, rect.width);

        ctx.clearRect(0, 0, rect.width, rect.height);
        
        lines.forEach((line, i) => {
          // If nowrap, center exactly; if multiline, calculate offset
          const y = nowrap ? rect.height / 2 : (i + 0.5) * lineHeight;
          ctx.fillText(line, rect.width / 2, y);
        });

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;

        setTexture((prev) => {
          prev?.dispose();
          return tex;
        });
        setDims({ width: rect.width, height: rect.height });
      };

      render();
      const ro = new ResizeObserver(render);
      ro.observe(measureRef.current);
      window.addEventListener("resize", render);
      document.fonts?.ready.then(render).catch(() => {});

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", render);
      };
    }, [text, nowrap]); // Added nowrap dependency

    return (
      <Tag
        ref={wrapperRef}
        className={className}
        style={{ position: "relative", ...style }}
      >
        <span
          ref={measureRef}
          style={{
            visibility: "hidden",
            display: "inline-block",
            maxWidth: "100%",
            whiteSpace: nowrap ? "nowrap" : "normal",
            width: nowrap ? "max-content" : "100%",
          }}
        >
          {text}
        </span>

        {texture && dims.width > 0 && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}>
            <Canvas
              orthographic
              dpr={[1, 2]}
              gl={{ alpha: true, antialias: true }}
              style={{ width: "100%", height: "100%", display: "block" }}
            >
              <FitOrthoCamera width={dims.width} height={dims.height} />
              <TextPlane
                texture={texture}
                width={dims.width}
                height={dims.height}
                isTouch={isTouch}
              />
            </Canvas>
          </div>
        )}
      </Tag>
    );
  },
);

DistortText.displayName = "DistortText";
export default DistortText;