import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Anything matching this (or carrying data-cursor-hover) triggers the
// "hovering" cursor state. Add data-cursor-text="VIEW" to any element to
// show a short label inside the ring while hovering it (e.g. on your
// PastEvents/Team cards).
const HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor-hover]';

const CustomCursor = () => {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // Skip entirely on touch/coarse-pointer devices — there's no real
    // cursor to replace, and a fake one just gets in the way.
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    document.body.classList.add("realxr-custom-cursor");

    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const label = labelRef.current;

    // Dot tracks near-instantly; the ring trails a beat behind for a
    // "magnetic" feel rather than rigidly locking to the pointer.
    const dotX  = gsap.quickTo(dot,  "x", { duration: 0.05, ease: "power3.out" });
    const dotY  = gsap.quickTo(dot,  "y", { duration: 0.05, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.75, duration: 0.2, ease: "power2.out" });
      gsap.to(dot,  { scale: 0.6,  duration: 0.2, ease: "power2.out" });
    };
    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot,  { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    const onOver = (e) => {
      const target = e.target.closest(HOVER_SELECTOR);
      if (!target) return;
      ring.classList.add("is-hovering");
      dot.classList.add("is-hovering");
      const text = target.getAttribute("data-cursor-text");
      if (text) {
        label.textContent = text;
        ring.classList.add("has-label");
      }
    };
    const onOut = (e) => {
      const target = e.target.closest(HOVER_SELECTOR);
      if (!target) return;
      ring.classList.remove("is-hovering", "has-label");
      dot.classList.remove("is-hovering");
      label.textContent = "";
    };

    const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);

    return () => {
      document.body.classList.remove("realxr-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="realxr-cursor-dot" />
      <div ref={ringRef} className="realxr-cursor-ring">
        <span ref={labelRef} className="realxr-cursor-label" />
      </div>

      <style>{`
        body.realxr-custom-cursor,
        body.realxr-custom-cursor * {
          cursor: none !important;
        }

        .realxr-cursor-dot,
        .realxr-cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
        }

        .realxr-cursor-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00F5D4;
          box-shadow: 0 0 12px 2px rgba(0, 245, 212, 0.6);
          transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
        }
        .realxr-cursor-dot.is-hovering {
          width: 0px;
          height: 0px;
          box-shadow: none;
        }

        .realxr-cursor-ring {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(0, 245, 212, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            width 0.3s ease, height 0.3s ease,
            background 0.3s ease, border-color 0.3s ease,
            opacity 0.2s ease;
        }
        .realxr-cursor-ring.is-hovering {
          width: 64px;
          height: 64px;
          background: rgba(0, 245, 212, 0.1);
          border-color: rgba(0, 245, 212, 0.9);
        }
        .realxr-cursor-ring.has-label {
          width: 88px;
          height: 88px;
        }

        .realxr-cursor-label {
          font-family: "Space Grotesk", sans-serif;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #00F5D4;
          text-align: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .realxr-cursor-ring.has-label .realxr-cursor-label {
          opacity: 1;
        }

        @media (hover: none), (pointer: coarse) {
          .realxr-cursor-dot, .realxr-cursor-ring {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;