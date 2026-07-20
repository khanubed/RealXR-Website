/**
 * GalleryDashboard.jsx
 * ─────────────────────────────────────────────────────────────────
 * RealXR — Gallery page controller
 *
 * Design language (paired with the soft white/pink liquid-distort
 * Three.js background rendered behind this component):
 *  • Light glass surfaces — never opaque dark panels
 *  • "REAL" set solid, "XR" cut from glass so the liquid bg shows
 *    through the letterforms — the club's own "two layers merging"
 *    idea, expressed as typography instead of decoration
 *  • AR-reticle custom cursor (viewfinder brackets, not a dot+ring)
 *  • GSAP: char-level headline reveal, magnetic event cards,
 *    sliding glass tab indicator, scroll-batched grid reveal
 * ─────────────────────────────────────────────────────────────────
 *
 * Route setup (in your router):
 *   <Route path="/gallery" element={<GalleryDashboard />} />
 *
 * Deep-link examples:
 *   /gallery                         → shows all events dashboard
 *   /gallery?event=hackathon-3       → opens that event's grid
 *   /gallery?event=hackathon-3&media=h3-02 → opens lightbox for that item
 * ─────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useEffect, useRef, useMemo, useCallback, memo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { EVENTS, getEventBySlug } from "../../data/galleryData";
import MediaGrid from "./MediaGrid.jsx";
import Lightbox  from "./Lightbox";

// ── Design tokens (shared informally across the gallery module) ──
const INK        = "#15141A";
const INK_SOFT   = "rgba(21,20,26,0.55)";
const INK_FAINT  = "rgba(21,20,26,0.32)";
const LINE       = "rgba(21,20,26,0.09)";
const GLASS      = "rgba(255,255,255,0.5)";
const GLASS_HI   = "rgba(255,255,255,0.78)";
const REAL       = "#FF3D8F";
const XR         = "#00BFAE";

// ── Split a string into per-character spans for GSAP reveals ─────
function splitChars(str) {
  return str.split("").map((ch, i) => (
    <span
      key={i}
      className="char-unit"
      style={{ display: "inline-block", willChange: "transform" }}
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

// ── Event cover card on dashboard ────────────────────────────────
const EventCard = memo(function EventCard({ event, onClick }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const quickX  = useRef(null);
  const quickY  = useRef(null);

  // Swapped useEffect for useGSAP with scoping
  useGSAP(() => {
    if (!cardRef.current) return;
    quickX.current = gsap.quickTo(cardRef.current, "x", { duration: 0.6, ease: "power3.out" });
    quickY.current = gsap.quickTo(cardRef.current, "y", { duration: 0.6, ease: "power3.out" });
  }, { scope: cardRef });

  // Magnetic pull — subtle, capped so it never feels gimmicky
  const handleMove = useCallback((e) => {
    const r = cardRef.current.getBoundingClientRect();
    const relX = e.clientX - (r.left + r.width / 2);
    const relY = e.clientY - (r.top + r.height / 2);
    quickX.current?.(relX * 0.06);
    quickY.current?.(relY * 0.06);
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
    quickX.current?.(0);
    quickY.current?.(0);
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(event.slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="view"
      style={{
        position: "relative", borderRadius: 20,
        overflow: "hidden",
        aspectRatio: "16/10",
        background: GLASS,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: hovered
          ? `1px solid ${event.accent}55`
          : `1px solid rgba(255,255,255,0.6)`,
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
        boxShadow: hovered
          ? `0 0 0 1px ${event.accent}22, 0 30px 70px -20px rgba(255,61,143,0.25)`
          : "0 12px 40px -18px rgba(21,20,26,0.18)",
        willChange: "transform",
      }}
    >
      {/* Cover image */}
      <img
        src={event.coverThumb}
        alt={event.title}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          opacity: 0.9,
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
        loading="lazy"
        decoding="async"
      />

      {/* Soft light-to-glass gradient (replaces the old dark scrim) */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to top, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.5) 42%, rgba(255,255,255,0.05) 100%)`,
      }} />

      {/* Accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3, background: event.accent,
        opacity: hovered ? 1 : 0.55,
        transition: "opacity 0.3s",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0, padding: "1.4rem",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "3px 10px", borderRadius: 999,
          background: GLASS_HI,
          backdropFilter: "blur(6px)",
          border: `1px solid ${event.accent}44`,
          marginBottom: "0.7rem", width: "fit-content",
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: event.accent }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.66rem", color: INK_SOFT,
            letterSpacing: "0.04em",
          }}>{event.date} · {event.location}</span>
        </div>

        <h3 style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800,
          fontSize: "clamp(1.15rem, 2.5vw, 1.8rem)",
          color: INK, letterSpacing: "-0.03em",
          lineHeight: 1.05, marginBottom: "0.5rem",
        }}>{event.title}</h3>

        <p style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "0.8rem", color: INK_SOFT,
          lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{event.tagline}</p>

        <div style={{
          marginTop: "1rem",
          display: "flex", alignItems: "center", gap: 6,
          color: event.accent,
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transition: "transform 0.3s ease",
        }}>
          <span style={{
            fontFamily: "Syne, sans-serif", fontWeight: 700,
            fontSize: "0.72rem", letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>View Gallery</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>

      {/* Media count badge */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        padding: "3px 9px", borderRadius: 999,
        background: GLASS_HI, backdropFilter: "blur(8px)",
        border: "1px solid rgba(21,20,26,0.08)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.66rem", color: INK_SOFT,
        letterSpacing: "0.03em",
      }}>
        {event.media.length} items
      </div>
    </div>
  );
});

// ── Custom cursor — AR viewfinder reticle, not a generic dot+ring ─
function ARCursor({ accent }) {
  const wrapRef = useRef(null);
  const [mode, setMode] = useState("default"); // default | view

  // Kept as useEffect since this drives a raw requestAnimationFrame loop, not GSAP
  useEffect(() => {
    const el = wrapRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0, raf;

    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      const target = e.target.closest("[data-cursor]");
      setMode(target ? target.dataset.cursor : "default");
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (el) el.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move);
    tick();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  const size = mode === "view" ? 64 : 34;
  const corner = mode === "view" ? 10 : 7;

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: size, height: size,
        pointerEvents: "none", zIndex: 99999,
        transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        mixBlendMode: "difference",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        {[
          ["M2,C L2,2 C,2", 0],
        ].map(() => null)}
        {/* four corner brackets, drawn manually for full control */}
        <path d={`M2 ${corner + 2} L2 2 L${corner + 2} 2`} fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <path d={`M${size - corner - 2} 2 L${size - 2} 2 L${size - 2} ${corner + 2}`} fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <path d={`M${size - 2} ${size - corner - 2} L${size - 2} ${size - 2} L${size - corner - 2} ${size - 2}`} fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <path d={`M${corner + 2} ${size - 2} L2 ${size - 2} L2 ${size - corner - 2}`} fill="none" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx={size / 2} cy={size / 2} r="1.6" fill={accent} />
      </svg>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function GalleryDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug  = searchParams.get("event");
  const activeEvent = useMemo(
    () => activeSlug ? getEventBySlug(activeSlug) : null,
    [activeSlug]
  );

  const headerRef    = useRef(null);
  const gridWrapRef  = useRef(null);
  const tabBarRef    = useRef(null);
  const indicatorRef = useRef(null);

  // ── Header char-reveal on mount (Scoped to headerRef) ─────────
  useGSAP(() => {
    // With scope defined, we can safely select using string selectors
    gsap.fromTo(".char-unit",
      { opacity: 0, yPercent: 120, rotateZ: 6 },
      {
        opacity: 1, yPercent: 0, rotateZ: 0,
        duration: 0.9, ease: "expo.out",
        stagger: { each: 0.028, from: "start" },
        delay: 0.15,
      }
    );
    gsap.fromTo(".eyebrow-tag",
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay: 0.05 }
    );
  }, { dependencies: [activeSlug], scope: headerRef });

  // ── Event switch transition (Scoped config) ────────────────────
  useGSAP(() => {
    if (!gridWrapRef.current) return;
    gsap.fromTo(gridWrapRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
    );
  }, { dependencies: [activeSlug] });

  // ── Sliding glass tab indicator (Scoped to tabBarRef) ──────────
  useGSAP(() => {
    if (!activeEvent || !tabBarRef.current || !indicatorRef.current) return;
    const activeBtn = tabBarRef.current.querySelector(`[data-slug="${activeSlug}"]`);
    if (!activeBtn) return;
    const barRect = tabBarRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    
    gsap.to(indicatorRef.current, {
      x: btnRect.left - barRect.left + tabBarRef.current.scrollLeft,
      width: btnRect.width,
      background: `${activeEvent.accent}14`,
      borderColor: `${activeEvent.accent}55`,
      duration: 0.5, ease: "power3.out",
    });
  }, { dependencies: [activeSlug, activeEvent], scope: tabBarRef });

  const openEvent  = useCallback((slug) => setSearchParams({ event: slug }), [setSearchParams]);
  const clearEvent = useCallback(() => setSearchParams({}), [setSearchParams]);

  const currentMedia = useMemo(
    () => activeEvent?.media ?? [],
    [activeEvent]
  );

  const heroAccent = activeEvent?.accent ?? XR;

  return (
    <div className="pt-12" style={{
      minHeight: "100vh",
      background: "transparent", // liquid-distort Three.js canvas shows through
      color: INK,
      fontFamily: "Space Grotesk, sans-serif",
      overflowX: "hidden",
      position: "relative",
    }}>
      <ARCursor accent={heroAccent} />

      {/* ── Header ────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        style={{
          padding: "3.5rem 3rem 2rem",
          borderBottom: `1px solid ${LINE}`,
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        }}
      >
        <div>
          <p className="eyebrow-tag" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem", letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: heroAccent,
            marginBottom: "0.6rem",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 20, height: 1, background: heroAccent, display: "inline-block" }} />
            {activeEvent ? activeEvent.label ?? "Event Gallery" : "RealXR · IES IPS Academy"}
          </p>

          <h1 style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800,
            fontSize: "clamp(2.4rem, 7vw, 5.6rem)",
            letterSpacing: "-0.04em", lineHeight: 0.92,
            display: "flex", flexWrap: "wrap",
          }}>
            {activeEvent ? (
              <>
                <span style={{ overflow: "hidden", display: "inline-block" }}>{splitChars(activeEvent.title)}</span>
                <span style={{
                  display: "block", width: "100%",
                  fontSize: "0.4em", color: activeEvent.accent, marginTop: "0.3em",
                }}>{splitChars(activeEvent.date)}</span>
              </>
            ) : (
              <>
                {/* REAL — solid ink */}
                <span style={{ overflow: "hidden", display: "inline-block", color: INK }}>
                  {splitChars("REAL")}
                </span>
                {/* XR — glass cutout: a soft pink→teal gradient fill on the
                    letterforms themselves, so it visually "bleeds" the
                    liquid background's palette straight through the type */}
                <span
                  className="xr-fill"
                  style={{
                    overflow: "hidden", display: "inline-block",
                    marginLeft: "0.14em",
                  }}
                >
                  {splitChars("XR")}
                </span>
                <span style={{
                  display: "block", width: "100%",
                  fontSize: "0.28em", color: INK_FAINT, marginTop: "0.35em",
                  fontFamily: "Space Grotesk, sans-serif", fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}>
                  {splitChars("moments that shaped us.")}
                </span>
              </>
            )}
          </h1>
        </div>

        {activeEvent && (
          <button
            onClick={clearEvent}
            data-cursor="view"
            style={{
              padding: "0.6rem 1.4rem",
              border: "1px solid rgba(21,20,26,0.12)",
              borderRadius: 999, background: GLASS,
              backdropFilter: "blur(10px)",
              color: INK_SOFT, cursor: "pointer",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "0.8rem", letterSpacing: "0.05em",
              display: "flex", alignItems: "center", gap: 8,
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = activeEvent.accent + "77"; e.currentTarget.style.color = INK; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(21,20,26,0.12)"; e.currentTarget.style.color = INK_SOFT; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All Events
          </button>
        )}
      </header>

      {/* ── Event tab bar (glass pills, sliding indicator) ──────── */}
      {activeEvent && (
        <div
          ref={tabBarRef}
          style={{
            position: "relative",
            display: "flex", gap: "0.3rem", overflowX: "auto",
            borderBottom: `1px solid ${LINE}`,
            padding: "0.6rem 3rem",
            scrollbarWidth: "none",
          }}
        >
          <div
            ref={indicatorRef}
            style={{
              position: "absolute", top: "0.6rem", left: "3rem",
              height: "calc(100% - 1.2rem)",
              borderRadius: 999,
              border: "1px solid transparent",
              pointerEvents: "none",
            }}
          />
          {EVENTS.map((ev) => (
            <button
              key={ev.id}
              data-slug={ev.slug}
              data-cursor="view"
              onClick={() => setSearchParams({ event: ev.slug })}
              style={{
                position: "relative",
                padding: "0.6rem 1.1rem",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "Syne, sans-serif", fontWeight: 600,
                fontSize: "0.78rem", letterSpacing: "0.05em",
                whiteSpace: "nowrap", borderRadius: 999,
                color: ev.slug === activeSlug ? INK : INK_FAINT,
                transition: "color 0.25s",
              }}
            >{ev.title}</button>
          ))}
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────── */}
      <main style={{ padding: "2.5rem 3rem 6rem" }}>

        {!activeEvent && (
          <div>
            <p style={{
              fontSize: "0.85rem", color: INK_SOFT,
              marginBottom: "2.2rem", lineHeight: 1.65,
              maxWidth: 480,
            }}>
              Every build night, every demo that finally worked, every headset
              tangled in cables — captured here. Click an event to step into
              its gallery.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.4rem",
            }}>
              {EVENTS.map((ev) => (
                <EventCard key={ev.id} event={ev} onClick={openEvent} />
              ))}
            </div>
          </div>
        )}

        {activeEvent && (
          <div ref={gridWrapRef}>
            <p style={{
              fontSize: "0.9rem", color: INK_SOFT,
              marginBottom: "2.2rem", maxWidth: 560, lineHeight: 1.75,
            }}>{activeEvent.description}</p>

            <MediaGrid
              items={currentMedia}
              accent={activeEvent.accent}
              eventId={activeEvent.id}
            />
          </div>
        )}
      </main>

      {activeEvent && (
        <Lightbox items={currentMedia} accent={activeEvent.accent} />
      )}

      <style>{`
        .xr-fill {
          background-image: linear-gradient(120deg, ${REAL}, ${XR});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 0px;
          display: inline-block;
        }
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </div>
  );
}