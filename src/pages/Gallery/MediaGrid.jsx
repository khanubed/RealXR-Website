/**
 * MediaGrid.jsx
 * ─────────────────────────────────────────────────────────────────
 * High-performance Pinterest-style Masonry Waterfall Grid — RealXR.
 *  • Dynamic column calculation (2 cols mobile, 3 tablet, 4 desktop)
 *  • Greedy waterfall distribution: balances column heights evenly
 *  • GSAP staggered reveal on filter change or event switch
 *  • Zero awkward gaps, zero artificial cropping
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MediaCard from "./MediaCard";

function getColumnCount(width) {
  if (width < 640) return 2;       // Mobile: 2 columns
  if (width < 1024) return 3;      // Tablet: 3 columns
  return 4;                        // Desktop & Ultrawide: 4 columns
}

const MediaGrid = memo(function MediaGrid({ items = [], accent, eventTitle, eventId }) {
  const containerRef = useRef(null);
  const [search, setSearch] = useSearchParams();
  const [columnsCount, setColumnsCount] = useState(() =>
    typeof window !== "undefined" ? getColumnCount(window.innerWidth) : 3
  );

  // ── Track responsive window width ────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      setColumnsCount(getColumnCount(window.innerWidth));
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Greedy Waterfall Masonry Distribution ─────────────────────
  // Distributes each item into the column with minimum cumulative height
  const columns = useMemo(() => {
    if (!items || items.length === 0) return [];

    const cols = Array.from({ length: columnsCount }, () => ({
      height: 0,
      items: [],
    }));

    items.forEach((item) => {
      // Find the currently shortest column
      let shortest = cols[0];
      for (let i = 1; i < cols.length; i++) {
        if (cols[i].height < shortest.height) {
          shortest = cols[i];
        }
      }

      // Calculate aspect height factor (height / width)
      const ratio =
        item.width && item.height ? item.height / item.width : 1;

      shortest.items.push(item);
      shortest.height += ratio;
    });

    return cols.map((col) => col.items);
  }, [items, columnsCount]);

  // ── GSAP Staggered Entrance Animation ─────────────────────────
  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".pinterest-item");
      if (!cards || cards.length === 0) return;

      gsap.killTweensOf(cards);

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 35,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: {
            each: 0.04,
            from: "start",
          },
          clearProps: "transform",
        }
      );
    },
    { dependencies: [eventId, items.length, columnsCount], scope: containerRef }
  );

  const openLightbox = useCallback(
    (item) => {
      const next = new URLSearchParams(search);
      next.set("media", item.id);
      setSearch(next);
    },
    [search, setSearch]
  );

  if (!items || items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-mono text-sm tracking-widest text-[#12131A]/55 uppercase font-medium">
          No moments found in this collection.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex gap-3 sm:gap-4 lg:gap-5 w-full items-start"
    >
      {columns.map((colItems, colIdx) => (
        <div
          key={colIdx}
          className="flex-1 flex flex-col gap-3 sm:gap-4 lg:gap-5 min-w-0"
        >
          {colItems.map((item) => (
            <div key={item.id} className="pinterest-item w-full">
              <MediaCard
                item={item}
                accent={accent}
                eventTitle={eventTitle}
                onClick={openLightbox}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default MediaGrid;
