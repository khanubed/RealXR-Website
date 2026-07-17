/**
 * Lightbox.jsx
 * ─────────────────────────────────────────────────────────────────
 * Premium fullscreen media viewer — RealXR gallery.
 *  • Deep-linkable via ?media=<id> URL param
 *  • Keyboard navigation (← → Esc)
 *  • Touch swipe navigation
 *  • GSAP entrance/exit transitions
 *  • Frosted light-glass overlay (not opaque black) so it reads as
 *    a continuation of the liquid-distort background, not a modal
 *    that stamps out the page
 * ─────────────────────────────────────────────────────────────────
 */

import React, {
  useEffect, useRef, useCallback, memo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const INK = "#15141A";

const Lightbox = memo(function Lightbox({ items, accent = "#00BFAE" }) {
  useGSAP();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId   = searchParams.get("media");
  const activeIdx  = items.findIndex((m) => m.id === activeId);
  const isOpen     = activeIdx !== -1;

  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef   = useRef(null);
  const touchStart = useRef(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !contentRef.current) return;
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
    gsap.fromTo(contentRef.current,
      { opacity: 0, scale: 0.93, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "expo.out" }
    );
  }, [isOpen, activeId]);

  const navigate = useCallback((dir) => {
    const next = activeIdx + dir;
    if (next < 0 || next >= items.length) return;
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0, x: dir * -60,
        duration: 0.2, ease: "power2.in",
        onComplete: () => {
          setSearchParams({ media: items[next].id });
          if (contentRef.current) {
            gsap.fromTo(contentRef.current,
              { opacity: 0, x: dir * 60 },
              { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
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
      opacity: 0, duration: 0.28, ease: "power2.in",
      onComplete: () => setSearchParams({}),
    });
  }, [setSearchParams]);

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
        background: "rgba(255,246,248,0.72)", // warm frosted glass, not black
        backdropFilter: "blur(28px) saturate(1.2)",
        WebkitBackdropFilter: "blur(28px) saturate(1.2)",
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

      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "min(90vw, 1100px)",
          maxHeight: "90vh",
          width: "100%",
          borderRadius: 20,
          overflow: "hidden",
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(10px)",
          border: `1px solid rgba(255,255,255,0.8)`,
          boxShadow: `0 0 0 1px ${accent}22, 0 40px 90px -30px rgba(21,20,26,0.35)`,
        }}
      >
        <div style={{
          position: "relative",
          width: "100%",
          maxHeight: "75vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#0d0d0d",
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

        <div style={{
          padding: "1rem 1.4rem",
          borderTop: "1px solid rgba(21,20,26,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1rem",
        }}>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "0.85rem", color: "rgba(21,20,26,0.65)",
            lineHeight: 1.5, flex: 1,
          }}>{item.caption}</p>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            fontSize: "0.72rem", letterSpacing: "0.1em",
            color: accent, whiteSpace: "nowrap",
          }}>
            {activeIdx + 1} / {items.length}
          </span>
        </div>
      </div>

      <button
        onClick={close}
        data-cursor="view"
        style={{
          position: "fixed", top: 20, right: 20,
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(21,20,26,0.1)",
          color: INK, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s, border-color 0.2s",
          zIndex: 10,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = accent + "22"; e.currentTarget.style.borderColor = accent + "66"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(21,20,26,0.1)"; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {hasPrev && (
        <NavBtn dir="left" accent={accent} onClick={(e) => { e.stopPropagation(); navigate(-1); }} />
      )}
      {hasNext && (
        <NavBtn dir="right" accent={accent} onClick={(e) => { e.stopPropagation(); navigate(1); }} />
      )}

      <div style={{
        position: "fixed", bottom: 16, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: 6, zIndex: 10,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        padding: "6px 8px", borderRadius: 999,
        border: "1px solid rgba(21,20,26,0.08)",
        maxWidth: "90vw", overflowX: "auto",
      }}>
        {items.map((m, i) => (
          <div
            key={m.id}
            data-cursor="view"
            onClick={(e) => { e.stopPropagation(); setSearchParams({ media: m.id }); }}
            style={{
              width: 36, height: 24, borderRadius: 4,
              overflow: "hidden", flexShrink: 0, cursor: "pointer",
              border: i === activeIdx ? `1.5px solid ${accent}` : "1.5px solid transparent",
              opacity: i === activeIdx ? 1 : 0.5,
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

const NavBtn = ({ dir, accent, onClick }) => (
  <button
    onClick={onClick}
    data-cursor="view"
    style={{
      position: "fixed",
      [dir === "left" ? "left" : "right"]: 16,
      top: "50%", transform: "translateY(-50%)",
      width: 48, height: 48, borderRadius: "50%",
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(21,20,26,0.08)",
      color: "#15141A", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 10,
      transition: "background 0.2s, border-color 0.2s, transform 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background = accent + "22"; e.currentTarget.style.borderColor = accent + "55"; e.currentTarget.style.transform = `translateY(-50%) scale(1.1)`; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(21,20,26,0.08)"; e.currentTarget.style.transform = `translateY(-50%) scale(1)`; }}
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
