/**
 * GalleryDashboard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Main gallery page controller.
 *  • React Router v6 — event slug in URL (?event=<slug>)
 *  • Event tab switcher with GSAP slide indicator
 *  • Custom magnetic cursor
 *  • useMemo guards against re-computing filtered media on every render
 *  • Graceful empty state
 * ─────────────────────────────────────────────────────────────────
 *
 * Route setup (in your router):
 *   <Route path="/gallery" element={<GalleryDashboard />} />
 *
 * Deep-link examples:
 *   /gallery                        → shows all events dashboard
 *   /gallery?event=hackathon-3      → opens that event's grid
 *   /gallery?event=hackathon-3&media=h3-02 → opens lightbox for that item
 * ─────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useEffect, useRef, useMemo, useCallback, memo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { EVENTS, getEventBySlug } from "../../data/galleryData";
import MediaGrid from "./MediaGrid.jsx";
import Lightbox  from "./Lightbox";

// ── Event cover card on dashboard ────────────────────────────────
const EventCard = memo(function EventCard({ event, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(event.slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 16,
        overflow: "hidden", cursor: "none",
        aspectRatio: "16/10",
        background: "#111",
        border: hovered
          ? `1px solid ${event.accent}66`
          : "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered
          ? `0 0 0 1px ${event.accent}22, 0 24px 60px rgba(0,0,0,0.5)`
          : "0 8px 32px rgba(0,0,0,0.3)",
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
          opacity: 0.55,
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s",
        }}
        loading="lazy"
        decoding="async"
      />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to top, ${event.bg ?? "#000"} 0%, rgba(0,0,0,0.2) 100%)`,
      }} />

      {/* Accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3, background: event.accent,
        opacity: hovered ? 1 : 0.4,
        transition: "opacity 0.3s",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0, padding: "1.4rem",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}>
        {/* Date + location pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "3px 10px", borderRadius: 999,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          border: `1px solid ${event.accent}33`,
          marginBottom: "0.7rem", width: "fit-content",
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: event.accent }} />
          <span style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "0.68rem", color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.05em",
          }}>{event.date} · {event.location}</span>
        </div>

        <h3 style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800,
          fontSize: "clamp(1.1rem, 2.5vw, 1.7rem)",
          color: "#fff", letterSpacing: "-0.03em",
          lineHeight: 1.05, marginBottom: "0.5rem",
        }}>{event.title}</h3>

        <p style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "0.78rem", color: "rgba(255,255,255,0.5)",
          lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{event.tagline}</p>

        {/* View gallery arrow */}
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
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "Space Grotesk, sans-serif",
        fontSize: "0.68rem", color: "rgba(255,255,255,0.55)",
        letterSpacing: "0.05em",
      }}>
        {event.media.length} items
      </div>
    </div>
  );
});

// ── Custom cursor ─────────────────────────────────────────────────
function CustomCursor({ accent }) {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  let rx = 0, ry = 0, rafId;

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0;

    const move = (e) => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; };
    const tick = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      rafId = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move);
    tick();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{ position: "fixed", width: 8, height: 8, background: accent, borderRadius: "50%", pointerEvents: "none", zIndex: 99999, transform: "translate(-50%,-50%)", mixBlendMode: "difference" }} />
      <div ref={ringRef} style={{ position: "fixed", width: 36, height: 36, border: `1px solid ${accent}`, borderRadius: "50%", pointerEvents: "none", zIndex: 99998, transform: "translate(-50%,-50%)", opacity: 0.5, transition: "width 0.3s, height 0.3s" }} />
    </>
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

  // ── Page entrance ──────────────────────────────────────────────
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  // ── Event switch transition ────────────────────────────────────
  useEffect(() => {
    if (!gridWrapRef.current) return;
    gsap.fromTo(gridWrapRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [activeSlug]);

  const openEvent  = useCallback((slug) => setSearchParams({ event: slug }), [setSearchParams]);
  const clearEvent = useCallback(() => setSearchParams({}), [setSearchParams]);

  // All media for current event (memoized — no recompute on cursor move etc.)
  const currentMedia = useMemo(
    () => activeEvent?.media ?? [],
    [activeEvent]
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#fff",
      fontFamily: "Space Grotesk, sans-serif",
      cursor: "none",
      overflowX: "hidden",
    }}>
      <CustomCursor accent={activeEvent?.accent ?? "#00F5D4"} />

      {/* ── Header ────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        style={{
          padding: "3rem 3rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        }}
      >
        <div>
          <p style={{
            fontSize: "0.68rem", letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: activeEvent?.accent ?? "#00F5D4",
            marginBottom: "0.5rem",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 20, height: 1, background: activeEvent?.accent ?? "#00F5D4", display: "inline-block" }} />
            {activeEvent ? activeEvent.label ?? "Event Gallery" : "Our Journey"}
          </p>

          <h1 style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 4rem)",
            letterSpacing: "-0.04em", lineHeight: 0.95,
          }}>
            {activeEvent ? (
              <>{activeEvent.title}<br /><span style={{ color: activeEvent.accent, fontSize: "0.6em" }}>{activeEvent.date}</span></>
            ) : (
              <>Moments That<br /><span style={{ color: "#00F5D4" }}>Shaped Us.</span></>
            )}
          </h1>
        </div>

        {/* Back button */}
        {activeEvent && (
          <button
            onClick={clearEvent}
            style={{
              padding: "0.6rem 1.4rem",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999, background: "transparent",
              color: "rgba(255,255,255,0.6)", cursor: "none",
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "0.8rem", letterSpacing: "0.08em",
              display: "flex", alignItems: "center", gap: 8,
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = activeEvent.accent + "66"; e.currentTarget.style.color = activeEvent.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All Events
          </button>
        )}
      </header>

      {/* ── Event tab bar (visible when inside an event) ────────── */}
      {activeEvent && (
        <div
          ref={tabBarRef}
          style={{
            display: "flex", gap: 0, overflowX: "auto",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "0 3rem",
            scrollbarWidth: "none",
          }}
        >
          {EVENTS.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSearchParams({ event: ev.slug })}
              style={{
                padding: "0.9rem 1.2rem",
                background: "none", border: "none", cursor: "none",
                fontFamily: "Syne, sans-serif", fontWeight: 600,
                fontSize: "0.78rem", letterSpacing: "0.06em",
                whiteSpace: "nowrap",
                color: ev.slug === activeSlug ? ev.accent : "rgba(255,255,255,0.35)",
                borderBottom: ev.slug === activeSlug ? `2px solid ${ev.accent}` : "2px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >{ev.title}</button>
          ))}
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────── */}
      <main style={{ padding: "2.5rem 3rem 5rem" }}>

        {/* Dashboard — all events */}
        {!activeEvent && (
          <div>
            <p style={{
              fontSize: "0.8rem", color: "rgba(255,255,255,0.35)",
              marginBottom: "2rem", lineHeight: 1.6,
              maxWidth: 480,
            }}>
              Every event, every late night, every demo that actually worked —
              captured here. Click an event to explore its gallery.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.2rem",
            }}>
              {EVENTS.map((ev) => (
                <EventCard key={ev.id} event={ev} onClick={openEvent} />
              ))}
            </div>
          </div>
        )}

        {/* Event gallery */}
        {activeEvent && (
          <div ref={gridWrapRef}>
            {/* Event description */}
            <p style={{
              fontSize: "0.88rem", color: "rgba(255,255,255,0.45)",
              marginBottom: "2rem", maxWidth: 560, lineHeight: 1.7,
            }}>{activeEvent.description}</p>

            <MediaGrid
              items={currentMedia}
              accent={activeEvent.accent}
              eventId={activeEvent.id}
            />
          </div>
        )}
      </main>

      {/* Lightbox — always mounted, reads ?media= param */}
      {activeEvent && (
        <Lightbox items={currentMedia} accent={activeEvent.accent} />
      )}
    </div>
  );
}