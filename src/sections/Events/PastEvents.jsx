import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── 1. Cursor Preview Component ─────────────────────────────────────
const CursorPreview = ({ images, accent, visible, x, y }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      intervalRef.current = setInterval(() => {
        setActiveIdx((i) => (i + 1) % images.length);
      }, 800);
    } else {
      clearInterval(intervalRef.current);
      setActiveIdx(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [visible, images.length]);

  return (
    <div
      style={{
        position: "fixed",
        left: x + 24,
        top: y - 80,
        width: 220,
        height: 148,
        borderRadius: 12,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "scale(1) translateY(0)"
          : "scale(0.88) translateY(8px)",
        transition: "opacity 0.22s ease, transform 0.22s ease",
        boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1.5px ${accent}44`,
      }}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === activeIdx ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 5,
        }}
      >
        {images.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIdx ? 16 : 5,
              height: 5,
              borderRadius: 999,
              background: i === activeIdx ? accent : "rgba(255,255,255,0.4)",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ── 2. Event Card Component (Now Responsive) ────────────────────────
const EventCard = React.forwardRef(({ event, index, totalCards }, ref) => {
  const [hovered, setHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
        setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
      }
    };

    handleResize(); // Init on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onMouseMove = (e) => setCursor({ x: e.clientX, y: e.clientY });

  // Hide custom cursor on touch devices to prevent UX issues
  const showCursor = hovered && !isMobile && !isTablet;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
      style={{
        position: "sticky",
        // Switch to auto height on mobile, keep 80vh on desktop
        height: isMobile ? "auto" : isTablet ? "60vh" : "80vh",
        minHeight: isMobile ? "480px" : "auto",
        top: `${60 + index * 18}px`,
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        borderRadius: 28,
        overflow: "hidden",
        background: "#000000",
        boxShadow:
          "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        cursor: isMobile || isTablet ? "default" : "none",
        willChange: "transform",
        transformOrigin: "top center",
        padding: isMobile ? "16px" : "12px",
        boxSizing: "border-box",
      }}
    >
      <div 
        style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "20px" : "32px", 
          height: "100%" 
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "44%",
            height: isMobile ? "240px" : "100%",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
          }}
        >
          <img
            src={event.images[0]}
            alt={event.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: showCursor ? "scale(1.04)" : "scale(1)",
            }}
          />
        </div>
        
        <div
          style={{
            height: isMobile ? "auto" : "100%",
            flex: 1,
            padding: isMobile ? "0" : "12px 12px 12px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "flex-start" : "end", // Left align on mobile, Right align on desktop
            justifyContent: isMobile ? "flex-start" : "space-between",
          }}
        >
          <div style={{ textAlign: isMobile ? "left" : "right" }}>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)",
                letterSpacing: "-0.02em",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "1.2rem",
                whiteSpace: "pre-line",
              }}
            >
              {event.title}
            </h2>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.5rem 1.1rem",
                background: "#ffffff",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#000000",
                  letterSpacing: "0.02em",
                }}
              >
                {event.date}
              </span>
            </div>
          </div>
          
          <p
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.6,
              margin: 0,
              textAlign: isMobile ? "left" : "right",
            }}
          >
            {event.desc}
          </p>
        </div>
      </div>
      
      {/* Hide Custom Cursor completely on Mobile & Tablet devices */}
      {showCursor && (
        <CursorPreview
          images={event.images}
          accent={event.accent}
          visible={hovered}
          x={cursor.x}
          y={cursor.y}
        />
      )}
    </div>
  );
});

// ── 3. Past Events Section ─────────────────────────────────────────
const PastEvents = ({ events }) => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { y: 120, opacity: 0, rotateX: 8, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
            delay: i * 0.06,
          },
        );

        // Scale down as they stack
        gsap.to(card, {
          scale: 1 - (events.length - 1 - i) * 0.018,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: `+=${events.length * 200}`,
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [events]);

  return (
    <section
      ref={sectionRef}
      style={{ padding: "8rem 1.5rem 6rem", position: "relative", zIndex: 10 }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          perspective: "1200px",
        }}
      >
        {events.map((event, i) => (
          <EventCard
            key={event.id}
            event={event}
            index={i}
            totalCards={events.length}
            ref={(el) => (cardRefs.current[i] = el)}
          />
        ))}
      </div>
    </section>
  );
};

export default PastEvents;