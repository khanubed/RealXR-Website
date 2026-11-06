/**
 * MediaCard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Lightweight Pinterest-style media card for RealXR Gallery.
 *  • Natural intrinsic aspect ratio (no awkward cropping or heavy padding)
 *  • Progressive lazy-load image with smooth fade-in
 *  • Muted inline video preview on hover
 *  • Uncluttered hover overlay with clean typography and action badges
 *  • Smooth micro-scale and soft shadow elevation on hover
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState, useEffect, useCallback, memo } from "react";

const MediaCard = memo(function MediaCard({
  item,
  accent = "#00F5D4",
  eventTitle,
  onClick,
}) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  // ── Intersection Observer for lazy loading ───────────────────
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      { rootMargin: "250px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Video preview on hover ───────────────────────────────────
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

  const handleClick = useCallback(() => {
    onClick?.(item);
  }, [onClick, item]);

  // Compute aspect ratio string (e.g., "1200 / 800")
  const aspectRatio =
    item.width && item.height ? `${item.width} / ${item.height}` : "4 / 3";

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="view"
      className="group relative w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-400 ease-out"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(10px)",
        border: hovered
          ? `1px solid ${accent}`
          : "1px solid rgba(18, 19, 26, 0.09)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 40px -15px rgba(18, 19, 26, 0.18), 0 0 20px -5px ${accent}25`
          : "0 4px 18px -4px rgba(18, 19, 26, 0.06)",
      }}
    >
      {/* ── Media Container with natural aspect ratio ─────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio }}
      >
        {/* Shimmer placeholder before image loads */}
        {!loaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background:
                "linear-gradient(90deg, rgba(18,19,26,0.03) 25%, rgba(18,19,26,0.07) 50%, rgba(18,19,26,0.03) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        )}

        {/* ── IMAGE ───────────────────────────────────────────── */}
        {item.type === "image" && (
          <img
            src={inView ? item.src : item.thumb}
            alt={item.caption || "RealXR gallery moment"}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
            style={{
              opacity: loaded ? 1 : 0.4,
              transition: "opacity 0.4s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          />
        )}

        {/* ── VIDEO ───────────────────────────────────────────── */}
        {item.type === "video" && (
          <>
            <img
              src={item.thumb}
              alt={item.caption || "Video poster"}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                opacity: hovered ? 0 : 1,
                transition: "opacity 0.3s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
            />
            <video
              ref={videoRef}
              src={inView ? item.videoMp4 : undefined}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.35s ease",
              }}
            />
          </>
        )}

        {/* ── Pinterest Hover Overlay (Gradient Scrim) ─────────── */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(6, 7, 10, 0.9) 0%, rgba(6, 7, 10, 0.4) 40%, rgba(6, 7, 10, 0.05) 75%, transparent 100%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* ── Top Badges ──────────────────────────────────────── */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Media Type / Event Chip */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all duration-300"
            style={{
              background: "rgba(10, 12, 18, 0.7)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${accent}44`,
              color: "#fff",
              opacity: item.type === "video" ? 1 : hovered ? 1 : 0,
              transform: item.type === "video" || hovered ? "translateY(0)" : "translateY(-4px)",
            }}
          >
            {item.type === "video" ? (
              <>
                <svg width="8" height="8" viewBox="0 0 10 10" fill={accent}>
                  <polygon points="2,1 9,5 2,9" />
                </svg>
                <span style={{ color: accent }}>VIDEO</span>
              </>
            ) : (
              <span>{eventTitle || "MOMENT"}</span>
            )}
          </div>

          {/* Quick Zoom / Expand Icon Button */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: "rgba(10, 12, 18, 0.75)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#fff",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.8)",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </div>
        </div>

        {/* ── Bottom Caption Container (Pinterest style) ──────── */}
        <div
          className="absolute bottom-0 inset-x-0 p-3.5 transition-all duration-300 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
          }}
        >
          {item.caption && (
            <p className="text-white text-xs sm:text-[13px] font-['Space_Grotesk'] leading-snug line-clamp-2 drop-shadow-sm">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

export default MediaCard;
