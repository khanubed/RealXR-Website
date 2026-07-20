/**
 * MediaCard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Individual media tile — RealXR gallery. Handles:
 *  • Aspect-ratio containment before load (zero CLS)
 *  • Intersection Observer lazy loading
 *  • Video: buffers only when visible, auto-pauses when hidden
 *  • Hover micro-interactions: scale, tilt, overlay fade, video preview
 *  • Light-glass skeleton + frame so cards read correctly against
 *    the soft white/pink liquid background behind the page
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useState, useCallback, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const SPAN_CLASS = {
  2: "col-span-2",
  tall: "row-span-2",
  1: "col-span-1",
};

const aspectPadding = (w, h) => `${((h / w) * 100).toFixed(4)}%`;

const MediaCard = memo(function MediaCard({
  item,
  accent = "#00BFAE",
  onClick,
  onCursorEnter,
  onCursorLeave,
}) {
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const videoRef = useRef(null);
  const imgRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  // ── Intersection Observer ─────────────────────────────────────
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (videoRef.current) videoRef.current.load();
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Video hover preview ───────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !inView) return;
    if (hovered) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovered, inView]);

  // ── Subtle 3D tilt toward the cursor — a quiet, premium touch ──
  // ── Subtle 3D tilt toward the cursor — a quiet, premium touch ──
  useGSAP(
    () => {
      if (!hovered || !tiltRef.current) return;
      const el = tiltRef.current;

      const quickRX = gsap.quickTo(el, "rotationX", {
        duration: 0.4,
        ease: "power3.out",
      });
      const quickRY = gsap.quickTo(el, "rotationY", {
        duration: 0.4,
        ease: "power3.out",
      });

      const handle = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        quickRY(px * 6);
        quickRX(-py * 6);
      };

      cardRef.current.addEventListener("mousemove", handle);

      return () => {
        cardRef.current?.removeEventListener("mousemove", handle);

        // FIX: Use explicit GSAP animation for rotation reset
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true, // Ensures no conflicting animations
        });
      };
    },
    { dependencies: [hovered], scope: cardRef },
  );

  const handleClick = useCallback(() => onClick(item), [onClick, item]);
  const handleEnter = useCallback(() => {
    setHovered(true);
    onCursorEnter?.();
  }, [onCursorEnter]);
  const handleLeave = useCallback(() => {
    setHovered(false);
    onCursorLeave?.();
  }, [onCursorLeave]);

  const spanClass = SPAN_CLASS[item.span] ?? "col-span-1";
  const padBottom = aspectPadding(item.width, item.height);

  return (
    <div
      ref={cardRef}
      className={`${spanClass} relative overflow-hidden rounded-2xl group`}
      style={{
        willChange: "transform",
        background: "rgba(255,255,255,0.45)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: hovered
          ? `0 24px 60px -24px rgba(21,20,26,0.28), 0 0 0 1px ${accent}33`
          : "0 10px 32px -18px rgba(21,20,26,0.16)",
        transition: "box-shadow 0.35s ease, border-color 0.35s ease",
      }}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        ref={tiltRef}
        className="relative w-full"
        style={{ paddingBottom: padBottom, transformStyle: "preserve-3d" }}
      >
        {/* ── Skeleton shimmer — light glass tone, not dark ── */}
        {!loaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.35) 25%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.35) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        )}

        {/* ── IMAGE ─────────────────────────────────────────────── */}
        {item.type === "image" && (
          <img
            ref={imgRef}
            src={inView ? item.src : undefined}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: loaded ? 1 : 0,
              transition:
                "opacity 0.5s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
            alt={item.caption}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        )}

        {/* ── VIDEO ─────────────────────────────────────────────── */}
        {item.type === "video" && (
          <>
            {!hovered && (
              <img
                src={item.thumb}
                alt={item.caption}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.3s ease",
                  opacity: loaded ? 1 : 0,
                }}
                onLoad={() => setLoaded(true)}
              />
            )}
            <video
              ref={videoRef}
              src={inView ? item.videoMp4 : undefined}
              poster={item.thumb}
              muted
              loop
              playsInline
              preload="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: hovered ? 1 : 0,
                transition:
                  "opacity 0.4s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
          </>
        )}

        {/* ── Hover overlay — dark scrim on the media itself only,
             for caption legibility; unrelated to the page's light theme ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, rgba(10,10,12,0.78) 0%, rgba(10,10,12,0.12) 55%, transparent 100%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        {/* ── Type badge ── */}
        {item.type === "video" && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(6px)",
              border: `1px solid ${accent}44`,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill={accent}>
              <polygon points="2,1 9,5 2,9" />
            </svg>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                color: "#15141A",
              }}
            >
              VIDEO
            </span>
          </div>
        )}

        {/* ── Caption on hover ─────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "1rem 1rem 0.9rem",
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            opacity: hovered ? 1 : 0,
            transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <p
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.5,
            }}
          >
            {item.caption}
          </p>
        </div>

        {/* ── Expand icon ── */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${accent}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(0.7)",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={accent}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
});

export default MediaCard;
