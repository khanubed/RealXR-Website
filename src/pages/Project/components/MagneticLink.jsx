import React, { useRef } from "react";
import { gsap } from "gsap";

/**
 * A link/button that leans gently toward the cursor while hovered.
 * Disabled automatically for touch/coarse pointers and reduced-motion users.
 */
export const MagneticLink = ({ href, onClick, className = "", strength = 18, children, ...rest }) => {
  const ref = useRef(null);
  const quick = useRef(null);

  const canMagnet = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: fine)")?.matches &&
    !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const handleMove = (e) => {
    if (!ref.current || !canMagnet()) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    if (!quick.current) {
      quick.current = {
        x: gsap.quickTo(ref.current, "x", { duration: 0.5, ease: "power3.out" }),
        y: gsap.quickTo(ref.current, "y", { duration: 0.5, ease: "power3.out" }),
      };
    }
    quick.current.x((x / rect.width) * strength);
    quick.current.y((y / rect.height) * strength);
  };

  const handleLeave = () => {
    if (!quick.current) return;
    quick.current.x(0);
    quick.current.y(0);
  };

  const Tag = href ? "a" : "button";

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className={`inline-flex will-change-transform ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};
