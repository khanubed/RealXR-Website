/**
 * MediaGrid.jsx
 * ─────────────────────────────────────────────────────────────────
 * Hardware-accelerated asymmetric bento grid — RealXR gallery.
 *  • CSS Grid with variable col/row spans from item.span
 *  • GSAP staggered 3D entry animation on mount / event switch
 *  • ScrollTrigger batch reveal for cards scrolled into view
 *  • Memoized to prevent re-render when lightbox opens/closes
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useCallback, memo } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MediaCard from "./MediaCard";

gsap.registerPlugin(ScrollTrigger);

const MediaGrid = memo(function MediaGrid({ items, accent, eventId }) {
  useGSAP();
  const gridRef        = useRef(null);
  const [, setSearch]  = useSearchParams();

  // ── Stagger entry on mount or when event switches ─────────────
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".media-card-wrap");
    if (!cards?.length) return;

    gsap.killTweensOf(cards);

    gsap.fromTo(
      cards,
      { opacity: 0, y: 46, scale: 0.94, rotateX: -6, transformPerspective: 800 },
      {
        opacity: 1, y: 0, scale: 1, rotateX: 0,
        duration: 0.75,
        ease: "expo.out",
        stagger: { each: 0.055, from: "start" },
        clearProps: "transform",
      }
    );

    // Cards below the fold get a lighter scroll-triggered reveal too,
    // so long galleries don't dump everything in on page load.
    const st = ScrollTrigger.batch(cards, {
      start: "top 88%",
      onEnter: (batch) => gsap.to(batch, {
        opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06,
        overwrite: true,
      }),
    });

    return () => st.forEach((t) => t.kill());
  }, [eventId]);

  const openLightbox = useCallback(
    (item) => setSearch({ media: item.id }),
    [setSearch]
  );

  const onCursorEnter = useCallback(() => {}, []);
  const onCursorLeave = useCallback(() => {}, []);

  return (
    <div
      ref={gridRef}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "280px",
        gap: "14px",
        width: "100%",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="media-card-wrap"
          data-cursor="view"
          style={{
            gridColumn: item.span === "2" ? "span 2" : "span 1",
            gridRow:    item.span === "tall" ? "span 2" : "span 1",
          }}
        >
          <MediaCard
            item={item}
            accent={accent}
            onClick={openLightbox}
            onCursorEnter={onCursorEnter}
            onCursorLeave={onCursorLeave}
          />
        </div>
      ))}
    </div>
  );
});

export default MediaGrid;
