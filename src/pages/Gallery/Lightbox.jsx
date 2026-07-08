/**
 * Lightbox.jsx
 * ─────────────────────────────────────────────────────────────────
 * Premium fullscreen media viewer.
 *  • Deep-linkable via ?media=<id> URL param
 *  • Keyboard navigation (← → Esc)
 *  • Touch swipe navigation
 *  • GSAP entrance/exit transitions
 *  • Scroll-lock when open
 * ─────────────────────────────────────────────────────────────────
 */

import React, {
  useEffect, useRef, useCallback, useState, memo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";

const Lightbox = memo(function Lightbox({ items, accent = "#00F5D4" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId   = searchParams.get("media");
  const activeIdx  = items.findIndex((m) => m.id === activeId);
  const isOpen     = activeIdx !== -1;

  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef   = useRef(null);

  // ── Touch swipe tracking ──────────────────────────────────────
  const touchStart = useRef(0);

  // ── Scroll lock ────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── GSAP entrance ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !overlayRef.current || !contentRef.current) return;
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
    gsap.fromTo(contentRef.current,
      { opacity: 0, scale: 0.93, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "expo.out" }
    );
  }, [isOpen, activeId]);

  // ── Navigation ────────────────────────────────────────────────
  const navigate = useCallback((dir) => {
    const next = activeIdx + dir;
    if (next < 0 || next >= items.length) return;
    // Animate out
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0, x: dir * -60,
        duration: 0.2, ease: "power2.in",
        onComplete: () => {
          setSearchParams({ media: items[next].id });
          // Animate in
          if (contentRef.current) {
            gsap.fromTo(contentRef.current,
              { opacity: 0, x: dir * 60 },
              { opacity: 1, x: 0, duration: 0.28, ease: "power2.out" }
            );
          }
        },
      });
    } else {
      setSearchParams({ media: items[next].id });
    }
  }, [activeIdx, items, setSearchParams]);

  const close = useCallback(() => {
    if (!overlayRef.current) { setSearchParams({}); return; }
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.25, ease: "power2.in",
      onComplete: () => setSearchParams({}),
    });
  }, [setSearchParams]);

  // ── Keyboard ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft")  navigate(-1);
      if (e.key === "Escape")     close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, navigate, close]);

  // ── Video management ──────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
    return () => { v.pause(); };
  }, [activeId]);

  if (!isOpen) return null;

  const item = items[activeIdx];
  const hasPrev = activeIdx > 0;
  const hasNext = activeIdx < items.length - 1;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.96)",
        backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        userSelect: "none",
      }}
      onClick={close}
      onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const dx = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 60) navigate(dx > 0 ? 1 : -1);
      }}
    >

      {/* ── Content ─────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "min(90vw, 1100px)",
          maxHeight: "90vh",
          width: "100%",
          borderRadius: 16,
          overflow: "hidden",
          background: "#0d0d0d",
          border: `1px solid rgba(255,255,255,0.07)`,
          boxShadow: `0 0 0 1px ${accent}22, 0 32px 80px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Media */}
        <div style={{
          position: "relative",
          width: "100%",
          maxHeight: "75vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#080808",
        }}>
          {item.type === "image" ? (
            <img
              src={item.src}
              alt={item.caption}
              style={{
                maxWidth: "100%", maxHeight: "75vh",
                objectFit: "contain", display: "block",
              }}
              draggable={false}
            />
          ) : (
            <video
              ref={videoRef}
              src={item.videoMp4}
              poster={item.thumb}
              controls
              playsInline
              style={{
                maxWidth: "100%", maxHeight: "75vh",
                display: "block",
              }}
            />
          )}
        </div>

        {/* Caption bar */}
        <div style={{
          padding: "1rem 1.4rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1rem",
        }}>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "0.85rem", color: "rgba(255,255,255,0.6)",
            lineHeight: 1.5, flex: 1,
          }}>{item.caption}</p>
          <span style={{
            fontFamily: "Syne, sans-serif", fontWeight: 700,
            fontSize: "0.72rem", letterSpacing: "0.15em",
            color: accent, whiteSpace: "nowrap",
          }}>
            {activeIdx + 1} / {items.length}
          </span>
        </div>
      </div>

      {/* ── Close ───────────────────────────────────────────────── */}
      <button
        onClick={close}
        style={{
          position: "fixed", top: 20, right: 20,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s, border-color 0.2s",
          zIndex: 10,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = accent + "22"; e.currentTarget.style.borderColor = accent + "66"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* ── Prev ────────────────────────────────────────────────── */}
      {hasPrev && (
        <NavBtn dir="left" accent={accent} onClick={(e) => { e.stopPropagation(); navigate(-1); }} />
      )}

      {/* ── Next ────────────────────────────────────────────────── */}
      {hasNext && (
        <NavBtn dir="right" accent={accent} onClick={(e) => { e.stopPropagation(); navigate(1); }} />
      )}

      {/* ── Thumbnail strip ─────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 16, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: 6, zIndex: 10,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px)",
        padding: "6px 8px", borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.07)",
        maxWidth: "90vw", overflowX: "auto",
      }}>
        {items.map((m, i) => (
          <div
            key={m.id}
            onClick={(e) => { e.stopPropagation(); setSearchParams({ media: m.id }); }}
            style={{
              width: 36, height: 24, borderRadius: 4,
              overflow: "hidden", flexShrink: 0, cursor: "pointer",
              border: i === activeIdx ? `1.5px solid ${accent}` : "1.5px solid transparent",
              opacity: i === activeIdx ? 1 : 0.45,
              transition: "all 0.2s ease",
            }}
          >
            <img src={m.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
});

// Small nav button component
const NavBtn = ({ dir, accent, onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "fixed",
      [dir === "left" ? "left" : "right"]: 16,
      top: "50%", transform: "translateY(-50%)",
      width: 48, height: 48, borderRadius: "50%",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#fff", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 10,
      transition: "background 0.2s, border-color 0.2s, transform 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = accent + "22"; e.currentTarget.style.borderColor = accent + "55"; e.currentTarget.style.transform = `translateY(-50%) scale(1.1)`; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = `translateY(-50%) scale(1)`; }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left"
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 18 15 12 9 6" />
      }
    </svg>
  </button>
);

export default Lightbox;