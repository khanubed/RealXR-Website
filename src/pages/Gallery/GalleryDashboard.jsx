/**
 * GalleryDashboard.jsx
 * ─────────────────────────────────────────────────────────────────
 * RealXR — Pinterest-Style Spatial Media Gallery
 *  • Optimized for high contrast against WebGL liquid background
 *  • Native waterfall masonry grid (light, airy, uncluttered)
 *  • Deep ink typography (#12131A) with vibrant cyber accents
 *  • Horizontal event navigation with chevron step controls & auto-scroll
 *  • Seamless event filtering ("All Moments" + individual event pills)
 *  • Event context header with accent glow and quick switcher
 *  • Integrated fullscreen Lightbox
 * ─────────────────────────────────────────────────────────────────
 */

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { EVENTS } from "../../data/eventsData";
import MediaGrid from "./MediaGrid.jsx";
import Lightbox from "./Lightbox";
import usePageMeta from "../../hooks/usePageMeta";

// ── Contrast-Tuned Color Tokens ────────────────────────────────
const INK_PRIMARY = "#12131A";                   // Deep obsidian black for primary headings
const INK_SECONDARY = "rgba(18, 19, 26, 0.72)";  // High-legibility secondary text
const INK_MUTED = "rgba(18, 19, 26, 0.45)";      // Metadata & inactive pill labels
const DEFAULT_ACCENT = "#00a896";               // Rich cyber teal for light canvas

// ── Split string into per-character spans for GSAP reveals ─────
function splitChars(str) {
  if (!str) return null;
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

export default function GalleryDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const events = EVENTS;
  const activeSlug = searchParams.get("event") || "all";

  const headerRef = useRef(null);
  const gridWrapRef = useRef(null);
  const tabBarRef = useRef(null);
  const pillRefs = useRef({});

  // Active event resolution
  const activeEvent = useMemo(() => {
    if (!activeSlug || activeSlug === "all") return null;
    return events.find((e) => e.slug === activeSlug) ?? null;
  }, [activeSlug, events]);

  const activeAccent = activeEvent?.accent || DEFAULT_ACCENT;

  usePageMeta({
    title: activeEvent ? `${activeEvent.title} · Gallery` : "Moments & Media Gallery",
    description: activeEvent?.description || "Browse moments, hackathons, workshops, and immersive VR demos captured at RealXR Lab, IES IPS Academy.",
    canonical: `https://realxr.in/gallery${activeSlug !== "all" ? `?event=${activeSlug}` : ""}`,
  });

  // Flatten all media across all events with event context
  const allMedia = useMemo(() => {
    return events.flatMap((ev) =>
      (ev.media || []).map((m) => ({
        ...m,
        eventTitle: ev.title,
        eventSlug: ev.slug,
        accent: ev.accent,
      }))
    );
  }, [events]);

  // Current media displayed based on active filter
  const currentMedia = useMemo(() => {
    if (!activeEvent) return allMedia;
    return (activeEvent.media || []).map((m) => ({
      ...m,
      eventTitle: activeEvent.title,
      eventSlug: activeEvent.slug,
      accent: activeEvent.accent,
    }));
  }, [activeEvent, allMedia]);

  // ── Header Char-Reveal GSAP Animation ────────────────────────
  useGSAP(
    () => {
      gsap.fromTo(
        ".char-unit",
        { opacity: 0, yPercent: 100, rotateZ: 3 },
        {
          opacity: 1,
          yPercent: 0,
          rotateZ: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: { each: 0.02, from: "start" },
          delay: 0.08,
        }
      );
      gsap.fromTo(
        ".eyebrow-tag",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", delay: 0.04 }
      );
    },
    { dependencies: [activeSlug], scope: headerRef }
  );

  // ── Grid Transition on Filter Switch ─────────────────────────
  useGSAP(
    () => {
      if (!gridWrapRef.current) return;
      gsap.fromTo(
        gridWrapRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    },
    { dependencies: [activeSlug] }
  );

  const selectEvent = useCallback(
    (slug) => {
      const next = new URLSearchParams(searchParams);
      if (slug === "all") {
        next.delete("event");
      } else {
        next.set("event", slug);
      }
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  // ── Ordered Navigation Items ─────────────────────────────────
  const navItems = useMemo(() => [
    { slug: "all", title: "All Moments", count: allMedia.length },
    ...events.map((ev) => ({
      id: ev.id,
      slug: ev.slug,
      title: ev.title,
      accent: ev.accent,
      count: ev.media?.length || 0,
    })),
  ], [allMedia.length, events]);

  const currentIndex = useMemo(() => {
    const idx = navItems.findIndex((item) => item.slug === activeSlug);
    return idx >= 0 ? idx : 0;
  }, [navItems, activeSlug]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < navItems.length - 1;

  // Previous & Next event selection
  const handlePrevEvent = useCallback(() => {
    if (currentIndex > 0) {
      selectEvent(navItems[currentIndex - 1].slug);
    }
  }, [currentIndex, navItems, selectEvent]);

  const handleNextEvent = useCallback(() => {
    if (currentIndex < navItems.length - 1) {
      selectEvent(navItems[currentIndex + 1].slug);
    }
  }, [currentIndex, navItems, selectEvent]);

  // ── Auto-scroll active pill into view ─────────────────────────
  useEffect(() => {
    const activeBtn = pillRefs.current[activeSlug];
    if (activeBtn && tabBarRef.current) {
      const container = tabBarRef.current;
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScroll = btnLeft - containerWidth / 2 + btnWidth / 2;

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth",
      });
    }
  }, [activeSlug]);

  // ── Track horizontal scroll boundaries for gradient fades ────
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    if (tabBarRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabBarRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
    }
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, events]);

  return (
    <div
      className="min-h-screen pt-20 pb-28 text-[#12131A] relative overflow-x-hidden"
      style={{
        background: "transparent",
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      {/* ── Page Header ────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="px-6 sm:px-10 lg:px-16 pt-8 pb-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          {/* Eyebrow Breadcrumb with high contrast */}
          <p
            className="eyebrow-tag font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase mb-3 flex items-center gap-2.5 font-bold"
            style={{ color: activeAccent }}
          >
            <span
              style={{
                width: 22,
                height: 2,
                background: activeAccent,
                display: "inline-block",
              }}
            />
            {activeEvent
              ? `${activeEvent.title} · ${activeEvent.date}`
              : "RealXR Archives · IES IPS Academy"}
          </p>

          {/* Main Title in Deep Ink */}
          <h1 className="font-['Syne'] font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95] text-[#12131A]">
            {activeEvent ? (
              <span className="block">{splitChars(activeEvent.title)}</span>
            ) : (
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-[#12131A]">{splitChars("MOMENTS")}</span>
                <span
                  style={{
                    color: activeAccent,
                    textShadow: `0 0 35px ${activeAccent}33`,
                  }}
                >
                  {splitChars("& EXPERIMENTS")}
                </span>
              </div>
            )}
          </h1>

          {/* Subtitle description */}
          {!activeEvent && (
            <p className="mt-3 text-xs sm:text-sm font-normal text-[#12131A]/65 max-w-xl leading-relaxed">
              Every build night, every demo that finally worked, every headset tangled in cables — captured live across the RealXR laboratory.
            </p>
          )}
        </div>

        {/* Media Counter & Total Badge (High Contrast Glass) */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider flex items-center gap-2.5 shadow-sm"
            style={{
              background: "rgba(255, 255, 255, 0.82)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(18, 19, 26, 0.12)",
              color: INK_PRIMARY,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: activeAccent }}
            />
            <span>{currentMedia.length} CAPTURES</span>
          </div>
        </div>
      </header>

      {/* ── Horizontal Event Navigation & Filter Bar ────────────── */}
      <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Previous Event Button */}
          <button
            type="button"
            onClick={handlePrevEvent}
            disabled={!canGoPrev}
            aria-label="Previous event"
            title={canGoPrev ? `Select ${navItems[currentIndex - 1]?.title}` : "At first event"}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm focus:outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(18, 19, 26, 0.12)",
              color: INK_PRIMARY,
              opacity: canGoPrev ? 1 : 0.35,
              cursor: canGoPrev ? "pointer" : "not-allowed",
              boxShadow: canGoPrev ? "0 2px 8px rgba(18, 19, 26, 0.08)" : "none",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Horizontally Listed Events Track with Gradient Fades */}
          <div className="relative flex-1 overflow-hidden rounded-full">
            {/* Left Edge Fade */}
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to right, rgba(255, 255, 255, 0.95), transparent)",
                opacity: canScrollLeft ? 1 : 0,
              }}
            />

            <div
              ref={tabBarRef}
              onScroll={updateScrollState}
              tabIndex={0}
              role="tablist"
              aria-label="Event categories"
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  handlePrevEvent();
                } else if (e.key === "ArrowRight") {
                  e.preventDefault();
                  handleNextEvent();
                }
              }}
              className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none scroll-smooth focus:outline-none"
            >
              {/* "All Moments" Tab */}
              <button
                ref={(el) => (pillRefs.current["all"] = el)}
                role="tab"
                aria-selected={activeSlug === "all"}
                onClick={() => selectEvent("all")}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-['Syne'] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer"
                style={{
                  background: activeSlug === "all" ? INK_PRIMARY : "rgba(255, 255, 255, 0.72)",
                  color: activeSlug === "all" ? "#ffffff" : INK_SECONDARY,
                  border: activeSlug === "all" ? `1px solid ${INK_PRIMARY}` : "1px solid rgba(18, 19, 26, 0.12)",
                  boxShadow: activeSlug === "all" ? "0 4px 14px -3px rgba(18, 19, 26, 0.35)" : "none",
                  backdropFilter: "blur(8px)",
                }}
              >
                ✦ All Moments ({allMedia.length})
              </button>

              {/* Individual Event Pills */}
              {events.map((ev) => {
                const isSelected = ev.slug === activeSlug;
                return (
                  <button
                    key={ev.id}
                    ref={(el) => (pillRefs.current[ev.slug] = el)}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectEvent(ev.slug)}
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-['Syne'] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                    style={{
                      background: isSelected ? INK_PRIMARY : "rgba(255, 255, 255, 0.72)",
                      color: isSelected ? "#ffffff" : INK_SECONDARY,
                      border: isSelected ? `1px solid ${ev.accent}` : "1px solid rgba(18, 19, 26, 0.12)",
                      boxShadow: isSelected ? `0 4px 16px -2px ${ev.accent}44` : "none",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: ev.accent }}
                    />
                    <span>{ev.title}</span>
                    <span style={{ opacity: isSelected ? 0.7 : 0.45 }}>({ev.media?.length || 0})</span>
                  </button>
                );
              })}
            </div>

            {/* Right Edge Fade */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to left, rgba(255, 255, 255, 0.95), transparent)",
                opacity: canScrollRight ? 1 : 0,
              }}
            />
          </div>

          {/* Next Event Button */}
          <button
            type="button"
            onClick={handleNextEvent}
            disabled={!canGoNext}
            aria-label="Next event"
            title={canGoNext ? `Select ${navItems[currentIndex + 1]?.title}` : "At last event"}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm focus:outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(18, 19, 26, 0.12)",
              color: INK_PRIMARY,
              opacity: canGoNext ? 1 : 0.35,
              cursor: canGoNext ? "pointer" : "not-allowed",
              boxShadow: canGoNext ? "0 2px 8px rgba(18, 19, 26, 0.08)" : "none",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Event Context Description Banner (Light High-Contrast Glass Card) */}
        {activeEvent && (
          <div
            className="mt-4 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all duration-300"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(18, 19, 26, 0.1)",
              boxShadow: "0 10px 30px -10px rgba(18, 19, 26, 0.08)",
            }}
          >
            <div className="max-w-2xl">
              <p
                className="text-xs font-mono font-bold tracking-wider uppercase mb-1.5 flex items-center gap-2"
                style={{ color: activeAccent }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeAccent }} />
                {activeEvent.tagline}
              </p>
              <p className="text-[#12131A]/75 text-xs sm:text-sm leading-relaxed font-normal">
                {activeEvent.description}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#12131A]/10">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono tracking-widest text-[#12131A]/45 block font-bold uppercase">
                  VENUE / LOCATION
                </span>
                <span className="text-xs sm:text-sm text-[#12131A] font-bold">
                  {activeEvent.location}
                </span>
              </div>

              {/* Step indicator and quick prev/next shortcuts inside banner */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#12131A]/50">
                  EVENT {currentIndex} OF {events.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevEvent}
                    disabled={!canGoPrev}
                    className="px-2 py-0.5 rounded transition-all hover:bg-black/5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-bold"
                    style={{ color: activeAccent }}
                    title="Previous event"
                  >
                    ← Prev
                  </button>
                  <span className="text-[#12131A]/20">·</span>
                  <button
                    onClick={handleNextEvent}
                    disabled={!canGoNext}
                    className="px-2 py-0.5 rounded transition-all hover:bg-black/5 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed font-bold"
                    style={{ color: activeAccent }}
                    title="Next event"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Main Pinterest Waterfall Grid ──────────────────────── */}
      <main className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        <div ref={gridWrapRef}>
          <MediaGrid
            items={currentMedia}
            accent={activeAccent}
            eventTitle={activeEvent?.title}
            eventId={activeSlug}
          />
        </div>
      </main>

      {/* Fullscreen Interactive Lightbox */}
      <Lightbox items={currentMedia} accent={activeAccent} />
    </div>
  );
}
