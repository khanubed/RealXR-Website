import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { eventsData } from "../../data/data";
gsap.registerPlugin(ScrollTrigger);

// ── Data ──────────────────────────────────────────────────────────


// ── Cursor image preview ───────────────────────────────────────────
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
      {/* Slide dots */}
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

// ── Card ──────────────────────────────────────────────────────────
const EventCard = React.forwardRef(({ event, index }, ref) => {
  const [hovered, setHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const onMouseMove = (e) => setCursor({ x: e.clientX, y: e.clientY });

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
      style={{
        position: "sticky",
        minHeight: "520px",
        top: `${60 + index * 18}px`, // stacking offset
        width: "100%",
        maxWidth: 860,
        margin: "0 auto",
        borderRadius: 28,
        overflow: "hidden",
        background: "#000000",
        boxShadow:
          "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        cursor: "none",
        willChange: "transform",
        transformOrigin: "top center",
        padding: "24px", // Insets both the image and content fields uniformly
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", gap: "32px", height: "100%" }}>
        {/* Left — cover image */}
        <div
          style={{
            width: "44%",   
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px", // Clean corners all around
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
              opacity: 1, // Full image clarity matching the mockup
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        </div>

        {/* Right — content */}
        <div
          style={{
            height : "100%" ,
            flex: 1,
            padding: "12px 12px 12px 0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top Info Header */}
          <div>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 3.8vw, 2.8rem)",
                letterSpacing: "-0.02em",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "1.2rem",
                whiteSpace: "pre-line",
              }}
            >
              {event.title}
            </h2>

            {/* Redesigned solid white date pill */}
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
                  fontFamily: "Space Grotesk, sans-serif",
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

          {/* Bottom Description */}
          <p
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {event.desc}
          </p>
        </div>
      </div>

      {/* Cursor image preview */}
      <CursorPreview
        images={event.images}
        accent={event.accent}
        visible={hovered}
        x={cursor.x}
        y={cursor.y}
      />
    </div>
  );
});

// ── Section ───────────────────────────────────────────────────────
const PastEvents = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      // Cards — each slides up from below when scrolled into view
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
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
            delay: i * 0.06,
          },
        );

        // Scale down slightly as cards stack — gives depth
        gsap.to(card, {
          scale: 1 - (eventsData.length - 1 - i) * 0.018,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top top",
            end: `+=${eventsData.length * 200}`,
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        // background: "#000",
        padding: "8rem 2rem 6rem",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Heading */}
      {/* <div ref={headingRef} style={{
        maxWidth: 860, margin: "0 auto 4rem",
      }}>
        <p style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "0.72rem", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#00F5D4",
          marginBottom: "0.8rem",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ display: "inline-block", width: 24, height: 1, background: "#00F5D4" }} />
          Our Journey
        </p>
        <h2 style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800,
          fontSize: "clamp(2.2rem, 5vw, 4rem)",
          letterSpacing: "-0.04em", color: "#fff",
          lineHeight: 1,
        }}>
          Moments That<br />
          <span style={{ color: "#00F5D4" }}>Shaped Us.</span>
        </h2>
      </div> */}

      {/* Stacked cards */}
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
        {eventsData.map((event, i) => (
          <EventCard
            key={event.id}
            event={event}
            index={i}
            ref={(el) => (cardRefs.current[i] = el)}
          />
        ))}
      </div>
    </section>
  );
};

export default PastEvents;
