import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teams } from "../../data/teamsData";

gsap.registerPlugin(ScrollTrigger);

// ── Social Icons ──────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const LinkedInIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const GithubIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// ── Member Card Pair ──────────────────────────────────────────────
const MemberPair = ({ member, accent, bg }) => {
  return (
    <div
      className="flex gap-4 flex-shrink-0 syne-500 w-xl"
    >
      {/* Card A — Photo */}
      <div
        className="flex-[0_0_48%] rounded-2xl overflow-hidden relative aspect-[3/4] bg-[#111] shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      >
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover block"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-transparent to-[55%]"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: accent }}
            />
            <span
              className="font-syne font-bold text-[0.8rem] tracking-[0.1em] uppercase text-white"
            >
              {member.name}
            </span>
          </div>
          <p
            className="font-syne text-[0.7rem] text-[rgba(255,255,255,0.5)] mt-1 pl-4"
          >
            {member.role}
          </p>
        </div>
      </div>

      {/* Card B — Info */}
      <div
        className="flex-[0_0_48%] rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-[1.6rem_1.4rem] flex flex-col justify-between aspect-[3/4] backdrop-blur-[8px]"
      >
        <p
          className="syne-500 text-sm text-[rgba(255,255,255,0.65)] leading-[1.75] flex-1"
        >
          {member.desc}
        </p>

        <div>
          <div className="w-full h-[1px] bg-[rgba(255,255,255,0.06)] mb-4" />
          <div className="flex items-center gap-[10px] mb-4">
            <img
              src={member.img}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
              style={{ border: `1.5px solid ${accent}66` }}
            />
            <div>
              <div
                className="font-syne font-bold text-[0.82rem] text-white tracking-[0.04em]"
              >
                {member.name}
              </div>
              <div
                className="font-space-grotesk text-[0.68rem] text-[rgba(255,255,255,0.4)]"
              >
                {member.role}
              </div>
            </div>
          </div>

          <div className="flex gap-[10px]">
            {member.socials.instagram && (
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[rgba(255,255,255,0.35)] transition-colors duration-200 hover:text-[--accent-color]"
                style={{ "--accent-color": accent }}
              >
                <InstagramIcon />
              </a>
            )}
            {member.socials.linkedin && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-[rgba(255,255,255,0.35)] transition-colors duration-200 hover:text-[--accent-color]"
                style={{ "--accent-color": accent }}
              >
                <LinkedInIcon />
              </a>
            )}
            {member.socials.github && (
              <a
                href={member.socials.github}
                target="_blank"
                rel="noreferrer"
                className="text-[rgba(255,255,255,0.35)] transition-colors duration-200 hover:text-[--accent-color]"
                style={{ "--accent-color": accent }}
              >
                <GithubIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Team Slide ────────────────────────────────────────────────────
const TeamSlide = ({ team, slideIndex }) => {
  const slideRef = useRef(null);
  const titleRef = useRef(null);
  const trayRef = useRef(null);

  useGSAP(
    () => {
      const slide = slideRef.current;
      const tray = trayRef.current;
      const title = titleRef.current;

      if (!slide || !tray) return;

      // Title reveal
      gsap.fromTo(
        title,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: slide, start: "top 80%", once: true },
        },
      );

      // Push effect — cards enter from right with slight stagger
      const pairs = gsap.utils.toArray(".member-pair", tray);

      pairs.forEach((pair, i) => {
        gsap.fromTo(
          pair,
          { x: 120 + i * 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: slide,
              start: "top 75%",
              once: true,
            },
            delay: 0.1 + i * 0.12,
          },
        );
      });

      // Horizontal tray scroll
      const trayTravel = tray.scrollWidth - tray.parentElement.offsetWidth;

      if (trayTravel > 0) {
        gsap.to(tray, {
          x: -trayTravel,
          ease: "none",
          scrollTrigger: {
            trigger: slide,
            start: "top top",
            end: () => `+=${trayTravel + window.innerHeight * 0.5}`,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    },
    { scope: slideRef, dependencies: [team] },
  ); // Adding dependency array preserves data switches if your teams state changes updates dynamically

  return (
    <div
      ref={slideRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: team.bg,
        padding: "3.5rem 2.8rem 2.1rem",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "3rem",
          transform: "translateY(-50%)",
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(8rem, 20vw, 22rem)",
          color: `${team.accent}06`,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.06em",
        }}
      >
        {String(slideIndex + 1).padStart(2, "0")}
      </div>

      <p
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: team.accent,
          marginBottom: "0.6rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 1,
            background: team.accent,
          }}
        />
        {team.label}
      </p>

      <h2
        ref={titleRef}
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(2.3rem, 6vw, 7rem)",
          letterSpacing: "-0.05em",
          color: "#fff",
          lineHeight: 0.88,
          marginBottom: "3.5rem",
          textTransform: "uppercase",
        }}
      >
        {team.title}
      </h2>

      <div style={{ overflow: "visible", position: "relative" }}>
        <div
          ref={trayRef}
          style={{
            display: "flex",
            gap: "3rem",
            width: "max-content",
            willChange: "transform",
            alignItems: "center",
          }}
        >
          {team.members.map((member, i) => (
            <MemberPair
              key={i}
              member={member}
              accent={team.accent}
              bg={team.bg}
            />
          ))}

          <div style={{ width: "4rem", flexShrink: 0 }} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 1,
          background: `linear-gradient(to right, ${team.accent}44, transparent)`,
        }}
      />
    </div>
  );
};

// ── Main Section ──────────────────────────────────────────────────
const Team = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      // Section heading parallax
      gsap.fromTo(
        ".team-section-heading",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      style={{ background: "#000", position: "relative", zIndex: "0" }}
    >
      {teams.map((team, i) => (
        <TeamSlide key={team.id} team={team} slideIndex={i} />
      ))}
    </div>
  );
};

export default Team;
