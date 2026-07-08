/**
 * MediaCard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Individual media tile. Handles:
 *  • Aspect-ratio containment before load (zero CLS)
 *  • Intersection Observer lazy loading
 *  • Video: buffers only when visible, auto-pauses when hidden
 *  • Hover micro-interactions (scale, overlay fade, video preview)
 *  • Custom cursor state via callback
 * ─────────────────────────────────────────────────────────────────
 */

import React, {
  useRef, useEffect, useState, useCallback, memo,
} from "react";

// ── Span → Tailwind class map ──────────────────────────────────────
// "2"   → spans 2 cols (wide landscape)
// "tall"→ spans 2 rows (portrait)
// "1"   → default single cell
const SPAN_CLASS = {
  "2":    "col-span-2",
  "tall": "row-span-2",
  "1":    "col-span-1",
};

// Compute padding-bottom % from width/height to lock aspect ratio
// This reserves exact space before the image loads → no layout shift
const aspectPadding = (w, h) => `${((h / w) * 100).toFixed(4)}%`;

const MediaCard = memo(function MediaCard({
  item,
  accent = "#00F5D4",
  onClick,          // (item) => void — opens lightbox
  onCursorEnter,    // () => void
  onCursorLeave,    // () => void
}) {
  const cardRef    = useRef(null);
  const videoRef   = useRef(null);
  const imgRef     = useRef(null);

  const [loaded,   setLoaded]   = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const [inView,   setInView]   = useState(false);

  // ── Intersection Observer ─────────────────────────────────────
  // Single observer instance per card — triggers lazy load + video play/pause
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true); // start loading src
          // Video: start buffering only when visible
          if (videoRef.current) {
            videoRef.current.load();
          }
        } else {
          // Video: pause + release memory pressure when off-screen
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: "200px 0px" } // preload 200px before entering viewport
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Video hover preview ───────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !inView) return;
    if (hovered) {
      v.play().catch(() => {}); // catch auto-play policy blocks silently
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovered, inView]);

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
  // For tall cards use the image's own aspect on mobile, lock on desktop
  const padBottom = aspectPadding(item.width, item.height);

  return (
    <div
      ref={cardRef}
      className={`${spanClass} relative overflow-hidden rounded-xl cursor-none group`}
      style={{
        // GPU layer promotion — keeps transforms off the main thread
        willChange: "transform",
        background: "#111",
      }}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/*
        ── Aspect ratio box ───────────────────────────────────────
        Padding-bottom trick reserves exact pixel space BEFORE the
        image/video loads, preventing any cumulative layout shift.
        All children are absolute-positioned inside.
      */}
      <div
        className="relative w-full"
        style={{ paddingBottom: padBottom }}
      >

        {/* ── Skeleton shimmer (shown while loading) ── */}
        {!loaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ background: "linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }}
          />
        )}

        {/* ── IMAGE ─────────────────────────────────────────────── */}
        {item.type === "image" && (
          <img
            ref={imgRef}
            // Only set src when in viewport — true lazy load
            src={inView ? item.src : undefined}
            // Low-res thumb as placeholder so the box isn't blank
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
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
            {/* Poster image shown before video loads/plays */}
            {!hovered && (
              <img
                src={item.thumb}
                alt={item.caption}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.3s ease",
                  opacity: loaded ? 1 : 0,
                }}
                onLoad={() => setLoaded(true)}
              />
            )}
            <video
              ref={videoRef}
              // src only set when in viewport — no premature buffering
              src={inView ? item.videoMp4 : undefined}
              poster={item.thumb}
              muted
              loop
              playsInline
              preload="none" // let our IO handle buffering
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.4s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
          </>
        )}

        {/* ── Hover overlay ─────────────────────────────────────── */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        {/* ── Type badge ── */}
        {item.type === "video" && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            display: "flex", alignItems: "center", gap: 5,
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            border: `1px solid ${accent}44`,
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill={accent}>
              <polygon points="2,1 9,5 2,9" />
            </svg>
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", color: accent }}>VIDEO</span>
          </div>
        )}

        {/* ── Caption on hover ─────────────────────────────────── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "1rem 1rem 0.9rem",
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          opacity: hovered ? 1 : 0,
          transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "0.78rem", color: "rgba(255,255,255,0.85)",
            lineHeight: 1.5,
          }}>{item.caption}</p>
        </div>

        {/* ── Expand icon ── */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${accent}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.7)",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
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