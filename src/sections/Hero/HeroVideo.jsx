import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroVideo from "../../assets/video/hero.mp4";

gsap.registerPlugin(ScrollTrigger);

const HeroVideo = () => {
  const wrapperRef    = useRef(null);
  const fixedRef      = useRef(null);
  const videoRef      = useRef(null);
  const videoInnerRef = useRef(null);
  const bigTextRef    = useRef(null);
  const h1Ref         = useRef(null);

  useEffect(() => {
    const video      = videoRef.current;
    const wrapper    = wrapperRef.current;
    const fixedEl    = fixedRef.current;
    const videoInner = videoInnerRef.current;
    const bigText    = bigTextRef.current;
    const h1Element  = h1Ref.current;

    let scrubST;

    const init = () => {
      video.pause();
      video.currentTime = 0;

      const duration = video.duration || 1;
      const vw       = window.innerWidth;
      
      const textWidth = h1Element.offsetWidth;
      const totalScrollDistance =  textWidth;

      // Define the scroll distance for each of the 3 phases
      const scrubPx = duration * 500;               // Phase 1: Video scrubbing
      const fadePx  = window.innerHeight * 0.8;     // Phase 2: Fading the video to 0
      const slidePx = totalScrollDistance * 1.2;    // Phase 3: Text scrolling across

      const totalPx = scrubPx + fadePx + slidePx;

      wrapper.style.height = `${window.innerHeight + totalPx}px`;

      gsap.set(videoInner, { opacity: 1 });
      gsap.set(bigText,    { x: vw, opacity: 0 }); 

      scrubST = ScrollTrigger.create({
        trigger: wrapper,
        start: "top 20%",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,

        onEnter: () => {
          fixedEl.style.visibility = "visible";
          fixedEl.style.opacity    = 1;
        },
        onEnterBack: () => {
          fixedEl.style.visibility = "visible";
          fixedEl.style.opacity    = 1;
        },
        onLeave: (self) => {
          fixedEl.style.opacity = 0;
          setTimeout(() => {
            if (!self.isActive) fixedEl.style.visibility = "hidden";
          }, 300);
        },
        onLeaveBack: (self) => {
          fixedEl.style.opacity = 0;
          setTimeout(() => {
            if (!self.isActive) fixedEl.style.visibility = "hidden";
          }, 300);
        },

        onUpdate: (self) => {
          // Calculate the percentage of total scroll each phase takes
          const scrubRatio = scrubPx / totalPx;
          const fadeRatio  = fadePx / totalPx;
          
          if (self.progress <= scrubRatio) {
            // PHASE 1: Video Scrubbing
            const videoProgress = self.progress / scrubRatio;
            video.currentTime = videoProgress * duration;

            gsap.set(videoInner, { opacity: 1 });
            gsap.set(bigText,    { x: vw, opacity: 0 }); // Text waits offscreen

          } else if (self.progress <= scrubRatio + fadeRatio) {
            // PHASE 2: Video Fades to 0 (Text still waits offscreen)
            video.currentTime = duration; // Keep video at last frame
            
            // Normalize progress for just this fade phase (0 -> 1)
            const fadeProgress = (self.progress - scrubRatio) / fadeRatio;
            
            gsap.set(videoInner, { opacity: 1 - fadeProgress });
            gsap.set(bigText,    { x: vw, opacity: 0 }); 

          } else {
            // PHASE 3: Text Marquee comes from right (Video stays fully hidden)
            video.currentTime = duration;
            gsap.set(videoInner, { opacity: 0 });

            // Normalize progress for the slide phase (0 -> 1)
            const slideStart = scrubRatio + fadeRatio;
            const slideProgress = (self.progress - slideStart) / (1 - slideStart);

            // Animate from off-screen Right (vw) to fully off-screen Left (-textWidth)
            const textX = vw - (slideProgress * totalScrollDistance);
            
            gsap.set(bigText, {
              x: textX,
              opacity: Math.min(1, slideProgress * 8), // Fade in quickly right at the start of slide
            });
          }
        },
      });

      ScrollTrigger.refresh();
    };

    const handleResize = () => {
      if (!video.duration || !h1Element) return;
      const vw = window.innerWidth;
      
      const textWidth = h1Element.offsetWidth;
      const scrubPx = video.duration * 500;
      const fadePx  = window.innerHeight * 0.8;
      const slidePx = (vw + textWidth) * 1.2;
      
      const totalPx = scrubPx + fadePx + slidePx;
      wrapper.style.height = `${window.innerHeight + totalPx}px`;
      
      ScrollTrigger.refresh();
    };

    if (video.readyState >= 1) {
      init();
    } else {
      video.addEventListener("loadedmetadata", init, { once: true });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (scrubST) scrubST.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="w-full h-32 bg-gradient-to-b from-white to-black" />

      {/* Tall spacer */}
      <div
        ref={wrapperRef}
        style={{ position: "relative", width: "100%", background: "#000" }}
      />

      {/* Fixed layer */}
      <div
        ref={fixedRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100vh",
          background: "#000",
          overflow: "hidden",
          visibility: "hidden",
          opacity: 0,
          transition: "opacity 0.25s ease",
          zIndex: 20,
        }}
      >
        {/* Video Frame */}
        <div
          ref={videoInnerRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            willChange: "opacity",
          }}
        >
          <video
            ref={videoRef}
            src={heroVideo}
            muted
            playsInline
            preload="auto"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* Text Layer */}
        <div
          ref={bigTextRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            userSelect: "none",
            willChange: "transform, opacity",
            width: "max-content",
          }}
        >
          <h1
            ref={h1Ref}
            style={{
              color: "#ffffff",
              fontSize: "clamp(4rem, 10vw, 11rem)",
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              whiteSpace: "nowrap",
              // paddingLeft: "%", 
              display: "inline-block",
            }}
          >
            We Don't Just Study the Future — We Build It.
          </h1>
        </div>

        {/* Bottom fade Overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: "100%", height: 160,
          background: "linear-gradient(to bottom, transparent, #000)",
          pointerEvents: "none", zIndex: 3,
        }} />

        {/* Scroll tracker graphics */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8, zIndex: 5,
        }}>
          <span style={{
            fontSize: "0.6rem", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
            fontFamily: "Space Grotesk, sans-serif",
          }}>Scroll to reveal</span>
          <div style={{
            width: 1, height: 44,
            background: "linear-gradient(to bottom, #00F5D4, transparent)",
            animation: "scrollLine 2s ease infinite",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </>
  );
};

export default HeroVideo;