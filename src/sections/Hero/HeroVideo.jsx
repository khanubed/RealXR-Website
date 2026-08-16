import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Keep this as a local fallback just in case the API doesn't return a video URL
import heroVideoFallback from "../../assets/video/hero.webm";
import { heroData } from "../../data/heroData";

gsap.registerPlugin(ScrollTrigger);

// Define fallback content so the UI never breaks during loading/errors
const defaultContent = heroData;

// Adjust this breakpoint to match your actual mobile/tablet cutoff.
const DESKTOP_QUERY = "(min-width: 769px)";
const MOBILE_QUERY = "(max-width: 768px)";

// Coalesces the many `currentTime` writes that scroll events produce into a
// single seek per rendered frame, and applies it right before paint via
// requestVideoFrameCallback (rAF fallback). This keeps the scrubbed playback
// buttery smooth: no seek storms, no dropped frames, no stutter.
function createSmoothScrubber(video) {
  let target = 0;
  let scheduled = false;
  const schedule =
    typeof video.requestVideoFrameCallback === "function"
      ? (fn) => video.requestVideoFrameCallback(fn)
      : (fn) => requestAnimationFrame(fn);
  const apply = () => {
    scheduled = false;
    if (Math.abs(video.currentTime - target) > 0.01) {
      video.currentTime = target;
    }
  };
  return (time) => {
    target = time;
    if (!scheduled) {
      scheduled = true;
      schedule(apply);
    }
  };
}

// Kick the decoder once so later seeks are near-instant instead of stalling
// on the first few frames. Muted autoplay is allowed, and the fixed layer is
// hidden at this point, so the brief play/pause is invisible.
function warmDecoder(video) {
  if (video.readyState >= 1 && video.paused) {
    video.play().catch(() => {});
    video.pause();
  }
}

const HeroVideo = ({ content = defaultContent }) => {
  const wrapperRef = useRef(null);
  const fixedRef = useRef(null);
  const videoRef = useRef(null);
  const videoInnerRef = useRef(null);
  const bigTextRef = useRef(null);
  const h1Ref = useRef(null);

  useGSAP(
    () => {
      const video = videoRef.current;
      const wrapper = wrapperRef.current;
      const fixedEl = fixedRef.current;
      const videoInner = videoInnerRef.current;
      const bigText = bigTextRef.current;
      const h1Element = h1Ref.current;

      const showFixed = () => {
        fixedEl.style.visibility = "visible";
        fixedEl.style.opacity = 1;
      };
      const hideFixed = (self) => {
        fixedEl.style.opacity = 0;
        setTimeout(() => {
          if (!self.isActive) fixedEl.style.visibility = "hidden";
        }, 300);
      };

      // gsap.matchMedia() automatically tears down the previous branch's
      // ScrollTriggers/listeners whenever the breakpoint crosses (e.g. on
      // orientation change or window resize past 768px), and reverts
      // everything on unmount.
      const mm = gsap.matchMedia();

      // ---------------------------------------------------------------
      // DESKTOP: original scroll-scrubbed video (scrub -> fade -> slide)
      // ---------------------------------------------------------------
      mm.add(DESKTOP_QUERY, () => {
        let isDestroyed = false;

        const init = () => {
          video.pause();
          video.currentTime = 0;
          warmDecoder(video);

          const duration = video.duration || 1;
          const vw = window.innerWidth;
          const textWidth = h1Element.offsetWidth;
          const totalScrollDistance = textWidth;

          const scrubPx = duration * 500; // Phase 1: video scrubbing
          const fadePx = window.innerHeight * 0.8; // Phase 2: fade video to 0
          const slidePx = totalScrollDistance * 1.2; // Phase 3: text slide

          const totalPx = scrubPx + fadePx + slidePx;
          wrapper.style.height = `${window.innerHeight + totalPx}px`;

          const scrub = createSmoothScrubber(video);

          gsap.set(videoInner, { opacity: 1 });
          gsap.set(bigText, { x: vw, opacity: 0 });

          const st = ScrollTrigger.create({
            trigger: wrapper,
            start: "top 20%",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onEnter: showFixed,
            onEnterBack: showFixed,
            onLeave: hideFixed,
            onLeaveBack: hideFixed,
            onUpdate: (self) => {
              const scrubRatio = scrubPx / totalPx;
              const fadeRatio = fadePx / totalPx;

              if (self.progress <= scrubRatio) {
                // PHASE 1: video scrubbing
                const videoProgress = self.progress / scrubRatio;
                scrub(videoProgress * duration);

                gsap.set(videoInner, { opacity: 1 });
                gsap.set(bigText, { x: vw, opacity: 0 });
              } else if (self.progress <= scrubRatio + fadeRatio) {
                // PHASE 2: video fades, held on last frame
                scrub(duration);
                const fadeProgress = (self.progress - scrubRatio) / fadeRatio;

                gsap.set(videoInner, { opacity: 1 - fadeProgress });
                gsap.set(bigText, { x: vw, opacity: 0 });
              } else {
                // PHASE 3: text marquee slides in
                scrub(duration);
                gsap.set(videoInner, { opacity: 0 });

                const slideStart = scrubRatio + fadeRatio;
                const slideProgress =
                  (self.progress - slideStart) / (1 - slideStart);
                const textX = vw - slideProgress * totalScrollDistance;

                gsap.set(bigText, {
                  x: textX,
                  opacity: Math.min(1, slideProgress * 8),
                });
              }
            },
          });

          ScrollTrigger.refresh();
          return st;
        };

        const handleResize = () => {
          if (!video.duration || !h1Element) return;
          const vw = window.innerWidth;
          const textWidth = h1Element.offsetWidth;
          const scrubPx = video.duration * 500;
          const fadePx = window.innerHeight * 0.8;
          const slidePx = (vw + textWidth) * 1.2;
          const totalPx = scrubPx + fadePx + slidePx;
          wrapper.style.height = `${window.innerHeight + totalPx}px`;
          ScrollTrigger.refresh();
        };

        let st;
        const safeInit = () => {
          if (isDestroyed) return;
          st = init();
        };

        if (video.readyState >= 1) {
          safeInit();
        } else {
          video.addEventListener("loadedmetadata", safeInit, { once: true });
        }

        window.addEventListener("resize", handleResize);

        // Runs when this matchMedia branch is torn down (breakpoint
        // crossed, or component unmounts).
        return () => {
          isDestroyed = true;
          video.removeEventListener("loadedmetadata", safeInit);
          window.removeEventListener("resize", handleResize);
          st?.kill();
        };
      });

      // ---------------------------------------------------------------
      // MOBILE: one-time playback on entering view, freeze on last frame,
      // then fade + text marquee continue with normal scroll.
      // ---------------------------------------------------------------
      mm.add(MOBILE_QUERY, () => {
        let isDestroyed = false;
        let hasPlayed = false;

        const init = () => {
          video.pause();
          video.currentTime = 0;
          hasPlayed = false;
          warmDecoder(video);

          const vw = window.innerWidth;
          const textWidth = h1Element.offsetWidth;
          const totalScrollDistance = textWidth;

          // "Dead zone" scroll distance reserved while the video free-plays
          // once, independent of exact scroll position. Tune this to roughly
          // match how far a typical scroll gesture covers during playback.
          const playPx = window.innerHeight * 0.6;
          const fadePx = window.innerHeight * 0.8;
          const slidePx = totalScrollDistance * 1.2;

          const totalPx = playPx + fadePx + slidePx;
          wrapper.style.height = `${window.innerHeight + totalPx}px`;

          const scrub = createSmoothScrubber(video);

          gsap.set(videoInner, { opacity: 1 });
          gsap.set(bigText, { x: vw, opacity: 0 });

          const playOnce = () => {
            if (hasPlayed) return;
            hasPlayed = true;
            video.currentTime = 0;
            video.play().catch(() => {
              // Autoplay blocked for some reason — just show the last frame.
              video.currentTime = video.duration || 0;
            });
          };

          const st = ScrollTrigger.create({
            trigger: wrapper,
            // Fires once the wrapper's top reaches the middle of the screen.
            start: "top center",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              showFixed();
              playOnce();
            },
            onEnterBack: () => {
              showFixed();
              playOnce();
            },
            onLeave: hideFixed,
            onLeaveBack: hideFixed,
            onUpdate: (self) => {
              const playRatio = playPx / totalPx;
              const fadeRatio = fadePx / totalPx;

              if (self.progress <= playRatio) {
                // PHASE 1 (mobile): video plays on its own, not scroll-tied.
                // Leave it fully visible; playback runs at its own pace and
                // naturally freezes on its last frame once it ends.
                gsap.set(videoInner, { opacity: 1 });
                gsap.set(bigText, { x: vw, opacity: 0 });
              } else if (self.progress <= playRatio + fadeRatio) {
                // PHASE 2: fade the (now-frozen) last frame out
                scrub(video.duration || 0);
                const fadeProgress = (self.progress - playRatio) / fadeRatio;
                gsap.set(videoInner, { opacity: 1 - fadeProgress });
                gsap.set(bigText, { x: vw, opacity: 0 });
              } else {
                // PHASE 3: text marquee slides in
                scrub(video.duration || 0);
                gsap.set(videoInner, { opacity: 0 });

                const slideStart = playRatio + fadeRatio;
                const slideProgress =
                  (self.progress - slideStart) / (1 - slideStart);
                const textX = vw - slideProgress * totalScrollDistance;

                gsap.set(bigText, {
                  x: textX,
                  opacity: Math.min(1, slideProgress * 8),
                });
              }
            },
          });

          ScrollTrigger.refresh();
          return st;
        };

        const handleResize = () => {
          if (!h1Element) return;
          const vw = window.innerWidth;
          const textWidth = h1Element.offsetWidth;
          const playPx = window.innerHeight * 0.6;
          const fadePx = window.innerHeight * 0.8;
          const slidePx = (vw + textWidth) * 1.2;
          const totalPx = playPx + fadePx + slidePx;
          wrapper.style.height = `${window.innerHeight + totalPx}px`;
          ScrollTrigger.refresh();
        };

        let st;
        const safeInit = () => {
          if (isDestroyed) return;
          st = init();
        };

        if (video.readyState >= 1) {
          safeInit();
        } else {
          video.addEventListener("loadedmetadata", safeInit, { once: true });
        }

        window.addEventListener("resize", handleResize);

        return () => {
          isDestroyed = true;
          video.removeEventListener("loadedmetadata", safeInit);
          window.removeEventListener("resize", handleResize);
          st?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: wrapperRef, dependencies: [content] },
  );

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
          {/* Dynamic Video Element */}
          <video
            ref={videoRef}
            src={content.videoUrl || heroVideoFallback}
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
              pointerEvents: "none",
            }}
          />
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
          {/* Dynamic Marquee Text */}
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
              display: "inline-block",
            }}
          >
            {content.marqueeText}
          </h1>
        </div>

        {/* Bottom fade Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 160,
            background: "linear-gradient(to bottom, transparent, #000)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Dynamic Scroll tracker graphics */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 5,
          }}
        >
          <span
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            {content.scrollText}
          </span>
          <div
            style={{
              width: 1,
              height: 44,
              background: "linear-gradient(to bottom, #00F5D4, transparent)",
              animation: "scrollLine 2s ease infinite",
            }}
          />
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