import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Team Data ─────────────────────────────────────────────────────
export const teams = [
  {
    id: "core",
    label: "01 — Leadership",
    title: "CORE TEAM",
    accent: "#00F5D4",
    bg: "#050f0d",
    members: [
      {
        name: "Arjun Rao",
        role: "Club President",
        desc: "Visionary behind RealXR's direction. Drives strategy, partnerships, and makes sure we ship — every semester.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Priya Krishnan",
        role: "Vice President",
        desc: "Keeps the chaos organized. Manages events, partnerships, and makes sure things actually get done.",
        img: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Rohan Mehta",
        role: "Technical Director",
        desc: "Owns the technical roadmap. From stack decisions to code reviews — if it ships, it goes through him.",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Dev Sharma",
        role: "Operations & Treasurer",
        desc: "Manages financial allocation, tracks hardware ecosystem requests, and pilots logistics for regional hackathons.",
        img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Ananya Mishra",
        role: "Corporate Relations Lead",
        desc: "Bridges the gap between corporate sponsors, hardware tech providers, and institutional communities.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
    ],
  },
  {
    id: "web",
    label: "02 — Engineering",
    title: "WEB DEVELOPERS",
    accent: "#60a5fa",
    bg: "#050810",
    members: [
      {
        name: "Ubed Khan",
        role: "Web Dev Lead",
        desc: "End-to-end builder. Takes a feature from database to deployed UI without blinking. Three.js + GSAP obsessed.",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Saurav Joshi",
        role: "Frontend Developer",
        desc: "Handles UI components, animations, and making sure everything looks crisp on every screen size.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Sara Thakur",
        role: "Web Developer",
        desc: "Handles UI components, animations, and making sure everything looks crisp on every screen size.",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Rohit Malhotra",
        role: "Creative Engineer",
        desc: "Specializes in WebGL graphics optimization, custom shader modules, and immersive interactive spaces.",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Tanvi Kapoor",
        role: "Full Stack Engineer",
        desc: "Maintains deployment stability, central database pipelines, and secure authentication models.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
    ],
  },
  {
    id: "graphics",
    label: "03 — Visual",
    title: "GRAPHIC DESIGNERS",
    accent: "#f472b6",
    bg: "#100510",
    members: [
      {
        name: "Nisha Sharma",
        role: "Design Lead",
        desc: "Crafts the visual identity of RealXR — from event posters to motion graphics that stop your scroll.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Amit Verma",
        role: "3D Artist",
        desc: "Blender open 24/7. Responsible for every 3D asset, render, and motion piece the club publishes.",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Kavya Nair",
        role: "UI/UX Designer",
        desc: "Designs interfaces before a single line of code. Figma all day, Spline when the brief calls for 3D.",
        img: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Ishaan Sen",
        role: "Motion Designer",
        desc: "Breathes life into vector paths. Coordinates video Title assets, kinetic typography, and reels layout logic.",
        img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Riya Roy",
        role: "Brand Illustrator",
        desc: "Guardian of the design guidelines. Custom vector illustration and visual typography layouts for club merch.",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
    ],
  },
  {
    id: "social",
    label: "04 — Community",
    title: "SOCIAL MEDIA",
    accent: "#fb923c",
    bg: "#100800",
    members: [
      {
        name: "Divya Patel",
        role: "Content Lead",
        desc: "Shoots, edits, and tells the RealXR story across Instagram, LinkedIn, and YouTube.",
        img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Rahul Singh",
        role: "Video Producer",
        desc: "Behind every reel, every event highlight, and every cinematic that makes people want to join.",
        img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80",
        socials: { instagram: "#", linkedin: null, github: null },
      },
      {
        name: "Kabir Ahuja",
        role: "Community Growth Manager",
        desc: "Maintains structural health of our Discord space, pilots custom community game nights, and drives reach.",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Mehak Sethi",
        role: "Lead Copywriter",
        desc: "Wordsmith of the feed. Formulates deep-dive tech explainers, threads, and caption setups.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Aryan Verma",
        role: "Event Photographer",
        desc: "Captures high-fidelity candid energy during localized workshops, code sprints, and overnight hackathons.",
        img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
        socials: { instagram: "#", linkedin: null, github: null },
      },
    ],
  },
  {
    id: "alumni",
    label: "05 — Alumni",
    title: "PASSED OUT LEGENDS",
    accent: "#facc15",
    bg: "#0f0f00",
    members: [
      {
        name: "Vikram Anand",
        role: "Founder · Batch 2022",
        desc: "Started RealXR from scratch. Now at Meta Reality Labs. The one who made all of this possible.",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Meera Iyer",
        role: "Design Pioneer · Batch 2022",
        desc: "Built the first visual identity of RealXR. Now doing spatial design at a leading XR studio in Bangalore.",
        img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Shreya Ghoshal",
        role: "Past Tech Lead · Batch 2023",
        desc: "Architected the club's unified deployment hub. Currently active as a Platform Engineer at Google.",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
      {
        name: "Aman Preet",
        role: "Ex-President · Batch 2024",
        desc: "Scaled our flagship hackathon into a multi-state event model. Now focusing on Human-Computer Interaction research.",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: null },
      },
      {
        name: "Hrithik Nair",
        role: "Past Visual Lead · Batch 2024",
        desc: "Engineered our core modular presentation assets. Currently driving production as a Game UI Artist at Unity.",
        img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80",
        socials: { instagram: "#", linkedin: "#", github: "#" },
      },
    ],
  },
];

// ── Social Icons ──────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

// ── Member Card Pair ──────────────────────────────────────────────
const MemberPair = ({ member, accent, bg }) => {
  const pairRef = useRef(null);

  return (
    <div
      ref={pairRef}
      className="member-pair"
      style={{
        display: "flex",
        gap: "1rem",
        flexShrink: 0,
        width: "clamp(480px, 52vw, 640px)",
      }}
    >
      {/* Card A — Photo */}
      <div style={{
        flex: "0 0 48%",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        aspectRatio: "3/4",
        background: "#111",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
      }}>
        <img
          src={member.img}
          alt={member.name}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
          }}
        />
        {/* Bottom gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)",
        }} />
        {/* Name on photo */}
        <div style={{
          position: "absolute", bottom: 16, left: 16, right: 16,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: accent, flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "Syne, sans-serif", fontWeight: 700,
              fontSize: "0.8rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#fff",
            }}>{member.name}</span>
          </div>
          <p style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "0.7rem", color: "rgba(255,255,255,0.5)",
            marginTop: 4, paddingLeft: 16,
          }}>{member.role}</p>
        </div>
      </div>

      {/* Card B — Info */}
      <div style={{
        flex: "0 0 48%",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "1.6rem 1.4rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        aspectRatio: "3/4",
        backdropFilter: "blur(8px)",
      }}>
        {/* Description */}
        <p style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
          color: "rgba(255,255,255,0.65)",
          lineHeight: 1.75,
          flex: 1,
        }}>
          {member.desc}
        </p>

        {/* Bottom — avatar + name + socials */}
        <div>
          <div style={{
            width: "100%", height: "1px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: "1rem",
          }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
            <img
              src={member.img}
              alt=""
              style={{
                width: 36, height: 36, borderRadius: "50%",
                objectFit: "cover",
                border: `1.5px solid ${accent}66`,
              }}
            />
            <div>
              <div style={{
                fontFamily: "Syne, sans-serif", fontWeight: 700,
                fontSize: "0.82rem", color: "#fff",
                letterSpacing: "0.04em",
              }}>{member.name}</div>
              <div style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "0.68rem", color: "rgba(255,255,255,0.4)",
              }}>{member.role}</div>
            </div>
          </div>

          {/* Socials */}
          <div style={{ display: "flex", gap: 10 }}>
            {member.socials.instagram && (
              <a href={member.socials.instagram} target="_blank" rel="noreferrer"
                style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = accent}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
              ><InstagramIcon /></a>
            )}
            {member.socials.linkedin && (
              <a href={member.socials.linkedin} target="_blank" rel="noreferrer"
                style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = accent}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
              ><LinkedInIcon /></a>
            )}
            {member.socials.github && (
              <a href={member.socials.github} target="_blank" rel="noreferrer"
                style={{ color: "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = accent}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
              ><GithubIcon /></a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Team Slide ────────────────────────────────────────────────────
const TeamSlide = ({ team, slideIndex }) => {
  const slideRef  = useRef(null);
  const titleRef  = useRef(null);
  const trayRef   = useRef(null);

  useEffect(() => {
    const slide = slideRef.current;
    const tray  = trayRef.current;
    const title = titleRef.current;

    // Title reveal
    gsap.fromTo(title,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: slide, start: "top 80%", once: true },
      }
    );

    // Push effect — cards start compressed to the right,
    // come close as you scroll in, then push apart as you scroll out
    const pairs = tray.querySelectorAll(".member-pair");

    pairs.forEach((pair, i) => {
      // Each pair enters from right with slight stagger
      gsap.fromTo(pair,
        { x: 120 + i * 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: slide,
            start: "top 75%",
            once: true,
          },
          delay: 0.1 + i * 0.12,
        }
      );
    });

    // Horizontal tray scroll — push effect
    // Cards travel right as section scrolls through
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

    return () => ScrollTrigger.getAll()
      .filter(t => t.vars.trigger === slide)
      .forEach(t => t.kill());
  }, []);

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
      {/* Background section number */}
      <div style={{
        position: "absolute", top: "50%", right: "3rem",
        transform: "translateY(-50%)",
        fontFamily: "Syne, sans-serif", fontWeight: 800,
        fontSize: "clamp(8rem, 20vw, 22rem)",
        color: `${team.accent}06`,
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        letterSpacing: "-0.06em",
      }}>
        {String(slideIndex + 1).padStart(2, "0")}
      </div>

      {/* Label */}
      <p style={{
        fontFamily: "Space Grotesk, sans-serif",
        fontSize: "0.7rem", letterSpacing: "0.2em",
        textTransform: "uppercase", color: team.accent,
        marginBottom: "0.6rem",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ display: "inline-block", width: 20, height: 1, background: team.accent }} />
        {team.label}
      </p>

      {/* Big title */}
      <h2
        ref={titleRef}
        style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800,
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

      {/* Horizontal tray */}
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

          {/* End spacer */}
          <div style={{ width: "4rem", flexShrink: 0 }} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: "100%", height: 1,
        background: `linear-gradient(to right, ${team.accent}44, transparent)`,
      }} />
    </div>
  );
};

// ── Main Section ──────────────────────────────────────────────────
const Team = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Section heading parallax
    gsap.fromTo(
      ".team-section-heading",
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <div ref={sectionRef} style={{ background: "#000" , position : "relative" , zIndex:"0" }}>

      {/* Section intro */}
      {/* <div style={{
        padding: "8rem 4rem 4rem",
        maxWidth: 900,
      }}>
        <p className="team-section-heading" style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "0.72rem", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#00F5D4",
          marginBottom: "1rem",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ display: "inline-block", width: 24, height: 1, background: "#00F5D4" }} />
          The People
        </p>
        <h2 className="team-section-heading" style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800,
          fontSize: "clamp(2rem, 5vw, 4rem)",
          letterSpacing: "-0.04em", color: "#fff",
          lineHeight: 1,
        }}>
          Meet the Minds<br />
          <span style={{ color: "#00F5D4" }}>Behind RealXR.</span>
        </h2>
      </div> */}

      {/* Team slides */}
      {teams.map((team, i) => (
        <TeamSlide key={team.id} team={team} slideIndex={i} />
      ))}

    </div>
  );
};

export default Team;