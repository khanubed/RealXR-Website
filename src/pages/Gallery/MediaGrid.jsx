/**
 * MediaGrid.jsx
 * ─────────────────────────────────────────────────────────────────
 * Hardware-accelerated asymmetric bento grid.
 *  • CSS Grid with variable col/row spans from item.span
 *  • GSAP staggered entry animation on mount / event switch
 *  • Memoized to prevent re-render when lightbox opens/closes
 *  • Passes cursor callbacks down to MediaCard
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useCallback, memo } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MediaCard from "./MediaCard";

const MediaGrid = memo(function MediaGrid({ items, accent, eventId }) {
  useGSAP();
  const gridRef        = useRef(null);
  const [, setSearch]  = useSearchParams();

  // ── Stagger entry on mount or when event switches ─────────────
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".media-card-wrap");
    if (!cards?.length) return;

    // Kill any running tweens to prevent stacking
    gsap.killTweensOf(cards);

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65,
        ease: "expo.out",
        stagger: { each: 0.07, from: "start" },
        clearProps: "transform", // release GPU layer after animation
      }
    );
  }, [eventId]); // re-run whenever active event changes

  // ── Open lightbox via URL param (enables deep-linking) ────────
  const openLightbox = useCallback(
    (item) => setSearch({ media: item.id }),
    [setSearch]
  );

  // ── Custom cursor helpers ─────────────────────────────────────
  const onCursorEnter = useCallback(() => {
    document.body.style.cursor = "none";
  }, []);
  const onCursorLeave = useCallback(() => {
    document.body.style.cursor = "none";
  }, []);

  return (
    <div
      ref={gridRef}
      style={{
        display: "grid",
        // Auto-fill columns, each min 220px, max 1fr
        // Bento-style: wide cards span 2 cols, tall cards span 2 rows
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "280px",
        gap: "10px",
        width: "100%",
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="media-card-wrap"
          style={{
            // Apply spans from data
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