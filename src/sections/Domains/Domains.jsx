import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { domainsData } from "../../data/domainsData";

gsap.registerPlugin(ScrollTrigger);

const defaultContent = domainsData

const Domains = ({ content = defaultContent }) => {
  const wrapperRef = useRef(null);
  const sliderSectionRef = useRef(null);
  const trackRef = useRef(null);
  const strip1Ref = useRef(null);
  const strip2Ref = useRef(null);

  useEffect(() => {
    // If there are no slides, skip the GSAP logic entirely
    if (!content.slides || content.slides.length === 0) return;

    let ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".slider-panel");
      const total = panels.length;

      const getPanelWidth = () => panels[0]?.getBoundingClientRect().width || 0;

      const holdDur = 1;
      const moveDur = 0.6;
      const inDur = 0.35;
      const outDur = 0.3;

      const totalDuration = total * holdDur + (total - 1) * moveDur;
      const pxPerUnit = window.innerHeight * 0.6;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sliderSectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalDuration * pxPerUnit}`,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(trackRef.current, { x: 0 });

      // Marquee strips - run continuously across pin duration
      tl.to(
        strip1Ref.current,
        { x: "-33.333%", ease: "none", duration: totalDuration },
        0
      );
      tl.to(
        strip2Ref.current,
        { x: "-100%", ease: "none", duration: totalDuration },
        0
      );

      let cursor = 0;

      panels.forEach((panel, i) => {
        const title = panel.querySelector(".slide-title");
        const desc = panel.querySelector(".slide-desc");
        const num = panel.querySelector(".slide-num");

        if (title && desc && num) {
          gsap.set([title, desc, num], { opacity: 0 });
          gsap.set(title, { y: 60, skewY: 2 });
          gsap.set(desc, { y: 24 });
          gsap.set(num, { x: -16 });

          const holdStart = cursor;

          tl.fromTo(
            title,
            { y: 60, opacity: 0, skewY: 2 },
            { y: 0, opacity: 1, skewY: 0, ease: "power3.out", duration: inDur },
            holdStart
          );
          tl.fromTo(
            desc,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, ease: "power2.out", duration: inDur },
            holdStart + 0.05
          );
          tl.fromTo(
            num,
            { x: -16, opacity: 0 },
            { x: 0, opacity: 1, ease: "power2.out", duration: inDur },
            holdStart
          );

          if (i < total - 1) {
            const exitStart = holdStart + holdDur - outDur;

            tl.to(
              title,
              { y: -50, opacity: 0, skewY: -1.5, ease: "power2.in", duration: outDur },
              exitStart
            );
            tl.to(
              desc,
              { y: -20, opacity: 0, ease: "power2.in", duration: outDur },
              exitStart
            );
            tl.to(
              num,
              { x: 16, opacity: 0, ease: "power2.in", duration: outDur },
              exitStart
            );

            const moveStart = holdStart + holdDur;
            const targetIndex = i + 1;
            tl.to(
              trackRef.current,
              {
                x: () => -(getPanelWidth() * targetIndex),
                ease: "power1.inOut",
                duration: moveDur,
              },
              moveStart
            );

            cursor = moveStart + moveDur;
          } else {
            cursor = holdStart + holdDur;
          }
        }
      });
    }, wrapperRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [content.slides]); // Re-run GSAP if the slides array changes

  return (
    <div ref={wrapperRef} className="-mt-24" style={{ position: "relative" }}>
      <div
        ref={sliderSectionRef}
        style={{
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Dynamic Strip 1 */}
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            background: "#fff",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            padding: "0.85rem 0",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20,
          }}
        >
          <div
            ref={strip1Ref}
            style={{
              display: "flex",
              gap: "2rem",
              width: "300%",
              willChange: "transform",
            }}
          >
            {Array(12)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {content.marqueeStrip1}
                  <span style={{ color: "#00F5D4", margin: "0 1.2rem" }}>
                    {content.marqueeStrip1Icon}
                  </span>
                </span>
              ))}
          </div>
        </div>

        {/* Dynamic Strip 2 */}
        <div
          style={{
            width: "110%",
            overflow: "hidden",
            background: "#000",
            padding: "0.7rem 0",
            transform: "rotate(-1.6deg)",
            marginLeft: "-5%",
            position: "absolute",
            top: "3.2rem",
            left: 0,
            zIndex: 19,
            color: "#00F5D4",
          }}
        >
          <div
            ref={strip2Ref}
            style={{
              display: "flex",
              gap: "2.5rem",
              width: "300%",
              willChange: "transform",
              translateX: "-66.6%",
            }}
          >
            {Array(12)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.8rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#fff",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {content.marqueeStrip2Items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {item}{" "}
                      <span style={{ opacity: 0.4, margin: "0 0.8rem" }}>·</span>
                    </React.Fragment>
                  ))}
                </span>
              ))}
          </div>
        </div>

        {/* Dynamic Slide track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            height: "100%",
            width: `${(content.slides?.length || 1) * 100}vw`,
            willChange: "transform",
          }}
        >
          {content.slides?.map((slide, i) => (
            <section
              key={slide.id || i}
              className="slider-panel"
              style={{
                width: "100vw",
                height: "100%",
                flexShrink: 0,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "clamp(2rem, 5vw, 5rem)",
                background: slide.bgColor || "#0a0a0a",
                overflow: "hidden",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  width: "100%",
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%) rotate(45deg)",
                    width: 7,
                    height: 7,
                    background: "rgba(255,255,255,0.2)",
                  }}
                />
              </div>

              <div
                className="mt-52"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  zIndex: 5,
                }}
              >
                <span
                  className="slide-num"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(0.7rem, 1vw, 0.9rem)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: slide.tagColor || "#00F5D4",
                  }}
                >
                  {slide.num} — {slide.label}
                </span>

                <p
                  className="slide-desc"
                  style={{
                    maxWidth: 420,
                    fontFamily: "Syne, sans-serif",
                    fontSize: "clamp(0.95rem, 1.15vw, 1.1rem)",
                    fontWeight: 600,
                    color: slide.textColor
                      ? `${slide.textColor}cc`
                      : "rgba(255,255,255,0.7)",
                    lineHeight: 1.8,
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {slide.description}
                </p>
              </div>

              <div style={{ zIndex: 5 }}>
                <h2
                  className="slide-title"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2.25rem, 6vw, 6rem)",
                    letterSpacing: "-0.04em",
                    textTransform: "uppercase",
                    lineHeight: 0.95,
                    color: slide.textColor || "#fff",
                    textShadow: "0 2px 24px rgba(0,0,0,0.25)",
                  }}
                >
                  {/* Safely split dynamic title by newline if provided */}
                  {(slide.title || "").split("\n").map((line, j, arr) => (
                    <React.Fragment key={j}>
                      {line}
                      {j < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "clamp(1.5rem, 3vw, 3rem)",
                  right: "clamp(1.5rem, 3vw, 3rem)",
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(4rem, 10vw, 10rem)",
                  color: "rgba(255,255,255,0.05)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Domains;